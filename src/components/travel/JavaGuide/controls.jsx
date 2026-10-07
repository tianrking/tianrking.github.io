import React from 'react';
import {useHistory, useLocation} from '@docusaurus/router';
import styles from './styles.module.css';

export default function GuideControls({language}) {
  const location = useLocation();
  const history = useHistory();
  const en = language === 'en';
  function select(next) {
    const params = new URLSearchParams(location.search);
    if (next === 'en') params.set('lang', 'en');
    else params.delete('lang');
    history.replace({...location, search: params.size ? `?${params}` : ''});
  }
  return <div className={styles.toolbar}>
    <div className={styles.languages} role="group" aria-label={en ? 'Article language' : '文章語言'}>
      <button type="button" lang="zh-Hant" aria-pressed={!en} onClick={() => select('zh')}>繁體中文</button>
      <button type="button" lang="en" aria-pressed={en} onClick={() => select('en')}>English</button>
    </div>
    <nav className={styles.shortcuts} aria-label={en ? 'Practical sections' : '實用章節'}>
      {[
        ['advance-booking', en ? 'Book ahead' : '提前預訂'],
        ['route', en ? 'Itinerary' : '行程總覽'],
        ['calendar', en ? 'Stays' : '住宿日曆'],
        ['budget', en ? 'Budget' : '一人預算'],
        ['maps', en ? 'Google Maps' : '地圖導航'],
      ].map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
    </nav>
  </div>;
}
