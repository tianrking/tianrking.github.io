import React, {useEffect, useRef, useState} from 'react';
import {useHistory, useLocation} from '@docusaurus/router';
import styles from './styles.module.css';

const storagePrefix = 'w0x7ce:reading:v1:';
const selectors = [
  '.travelGuidePage_article',
  '.theme-doc-markdown',
  '.blog-post-page .theme-blog-markdown',
].join(',');

function findCurrent(headings, line) {
  let low = 0;
  let high = headings.length;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (headings[middle].element.getBoundingClientRect().top <= line) low = middle + 1;
    else high = middle;
  }
  return headings[low - 1]?.id ?? '';
}

function HeadingText(heading) {
  return heading.textContent.replace(/#\s*$/, '').trim();
}

export default function ReadingNavigator() {
  const {pathname, search, hash} = useLocation();
  const language = new URLSearchParams(search).get('lang') === 'en' ? 'en' : 'zh';
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 996px)');
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return mobile ? <Reader key={pathname + ':' + language} pathname={pathname} en={language === 'en'} hasHash={Boolean(hash)} /> : null;
}

function Reader({pathname, en, hasHash}) {
  const history = useHistory();
  const location = useLocation();
  const pathKey = pathname.replace(/\/+$/, '');
  const key = storagePrefix + pathKey + (en ? ':en' : ':zh');
  const [headings, setHeadings] = useState([]);
  const [active, setActive] = useState('');
  const [inArticle, setInArticle] = useState(false);
  const [saved, setSaved] = useState('');
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  const scrolling = useRef(false);
  const visited = useRef('');
  const current = headings.find((item) => item.id === active);
  const resume = headings.find((item) => item.id === saved);

  useEffect(() => {
    try {setSaved(localStorage.getItem(key) || '');} catch {}
    let nodes = [];
    let article = null;
    let frame = 0;
    let signature = '';
    let contentFrame = 0;
    let readingLine = 126;

    const update = () => {
      frame = 0;
      if (!article?.isConnected) return;
      const rect = article.getBoundingClientRect();
      setInArticle(rect.top < innerHeight * .7 && rect.bottom > innerHeight * .35);
      const next = findCurrent(nodes, readingLine);
      setActive(next);
      if (scrolling.current && next && next !== visited.current && rect.bottom > readingLine) {
        try {localStorage.setItem(key, next);} catch {}
        visited.current = next;
      }
    };
    const scan = () => {
      contentFrame = 0;
      article = document.querySelector(selectors);
      const found = [...(article?.querySelectorAll('h2[id],h3[id]') ?? [])]
        .map((element) => ({element,id:element.id,title:HeadingText(element),level:element.tagName}))
        .filter(({title}) => title);
      nodes = found.length >= 3 ? found : [];
      if (nodes.length) {
        const scrollPadding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        const scrollMargin = Number.parseFloat(getComputedStyle(nodes[0].element).scrollMarginTop) || 0;
        readingLine = Math.max(126, scrollPadding + scrollMargin + 12);
      }
      const next = JSON.stringify(nodes.map(({id,title}) => [id,title]));
      if (next !== signature) {
        signature = next;
        setHeadings(nodes.map(({id,title,level}) => ({id,title,level})));
      }
      update();
    };
    const onScroll = () => {
      scrolling.current = true;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new MutationObserver(records => {
      if (records.some(record => [...record.addedNodes, ...record.removedNodes].some(node =>
        node instanceof Element && (node.matches('main,article,h2,h3,' + selectors)
          || node.querySelector('main,article,h2[id],h3[id]'))))) {
        if (!contentFrame) contentFrame = requestAnimationFrame(scan);
      }
    });
    scan();
    observer.observe(document.getElementById('__docusaurus') ?? document.body, {childList:true,subtree:true});
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', scan);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', scan);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(contentFrame);
    };
  }, [key]);

  function dismiss() {
    dialog.current?.close();
    setOpen(false);
  }

  function openContents() {
    const sheet = dialog.current;
    sheet?.showModal();
    setOpen(true);
    const list = sheet?.querySelector('nav');
    const selected = list?.querySelector('[aria-current="location"]');
    if (selected) {
      list.scrollTop += selected.getBoundingClientRect().top - list.getBoundingClientRect().top - list.clientHeight * .25;
    }
  }

  function jump(event, id) {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    dismiss();
    setSaved('');
    try {localStorage.setItem(key,id);} catch {}
    visited.current = id;
    history.push({...location, hash: '#' + encodeURIComponent(id)});
    requestAnimationFrame(() => {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({preventScroll:true});
      target.scrollIntoView({block:'start',behavior:'instant'});
    });
  }

  if (!headings.length) return null;
  const offerResume = resume && !hasHash;
  return <div className={styles.wrap} lang={en ? 'en' : undefined}>
    {(inArticle || offerResume || open) && <div className={styles.dock}>
      {offerResume && <button type="button" onClick={(event) => jump(event,resume.id)} title={resume.title}>
        {en ? 'Resume reading' : '繼續上次閱讀'}
      </button>}
      <button type="button" aria-haspopup="dialog" onClick={openContents}>
        <span className={styles.icon} aria-hidden="true">☰</span>{en ? 'Contents' : '章節目錄'}
        {current && !offerResume && <span className={styles.current}>{current.title}</span>}
      </button>
    </div>}
    <dialog ref={dialog} className={styles.sheet} aria-label={en ? 'Article navigator' : '文章章節導航'} onClose={() => setOpen(false)}>
      <div className={styles.sheetHead}>
        <strong>{en ? 'On this page' : '本文目錄'}</strong>
        <button type="button" autoFocus onClick={dismiss}>{en ? 'Close' : '關閉'}</button>
      </div>
      <nav aria-label={en ? 'Sections' : '章節'}>
        {headings.map(({id,title,level}) => <a key={id} href={`#${encodeURIComponent(id)}`}
          aria-current={id === active ? 'location' : undefined} data-level={level} onClick={(event) => jump(event,id)}>{title}</a>)}
      </nav>
      <div className={styles.sheetFoot}>
        <small>{en ? 'Reading position stays on this device.' : '閱讀位置只保存在此瀏覽器。'}</small>
        {saved && <button type="button" onClick={() => {
          try {localStorage.removeItem(key);} catch {}
          visited.current = active;
          setSaved('');
        }}>{en ? 'Forget position' : '清除上次位置'}</button>}
      </div>
    </dialog>
  </div>;
}
