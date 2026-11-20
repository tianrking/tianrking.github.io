import React, {useEffect, useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {useHistory, useLocation} from '@docusaurus/router';
import contentIndex from '@site/src/data/content-index.json';
import travelCatalog from '@site/src/data/travel-series-catalog.json';
import {findDocuments, makeSearchIndex} from '@site/src/data/content-search.mjs';
import styles from '../styles.module.css';

const travelDocuments = travelCatalog.map((item) => ({
  id: item.slug,
  route: item.route,
  title: item.title,
  description: item.description,
  section: '行旅誌',
  kind: 'explore',
  kindLabel: item.kind === 'record' ? '實走紀錄' : '行前規劃',
  tags: [item.destination, ...(item.tags ?? [])],
  keywords: [...(item.keywords ?? []), ...item.slug.split('-')],
}));
const documents = [...travelDocuments.filter((document) => document.kindLabel === '實走紀錄'),
  ...(contentIndex.documents || []), ...travelDocuments.filter((document) => document.kindLabel === '行前規劃')];
const searchIndex = makeSearchIndex(documents);
const batchSize = 24;

function uniqueValues(key) {
  return [...new Set(documents.flatMap((document) => document[key] || []).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, 'zh-Hant'));
}

const sections = [...new Set(documents.map((document) => document.section).filter(Boolean))]
  .sort((left, right) => left.localeCompare(right, 'zh-Hant'));
const tags = uniqueValues('tags');
const years = [...new Set(documents.map((document) => document.year).filter(Boolean))]
  .sort((left, right) => right.localeCompare(left));

function formatDate(date) {
  return date?.replaceAll('-', '.');
}

function ContentCard({document}) {
  return (
    <Link className={styles.card} to={document.route}>
      <div className={styles.cardMeta}>
        <span>{document.kindLabel}</span>
        {document.date && <time dateTime={document.date}>{formatDate(document.date)}</time>}
      </div>
      <Heading as="h2">{document.title}</Heading>
      <p>{document.description || '這篇內容尚未提供摘要。'}</p>
      <div className={styles.cardFooter}>
        <span>{document.section}</span>
        <span aria-hidden="true">↗</span>
      </div>
    </Link>
  );
}

export default function ExploreLibraryPage() {
  const location = useLocation();
  const history = useHistory();
  // Static HTML is generated without a query string; apply the URL after hydration.
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [section, setSection] = useState('all');
  const [tag, setTag] = useState('all');
  const [year, setYear] = useState('all');
  const [limit, setLimit] = useState(batchSize);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get('q')?.slice(0, 120) ?? '');
    const selected = params.get('type');
    setKind(['docs', 'blog', 'explore'].includes(selected) ? selected : 'all');
    setSection(sections.includes(params.get('section')) ? params.get('section') : 'all');
    setTag(tags.includes(params.get('tag')) ? params.get('tag') : 'all');
    setYear(years.includes(params.get('year')) ? params.get('year') : 'all');
  }, [location.search]);
  useEffect(() => {setLimit(batchSize);}, [query, kind, section, tag, year]);

  const filteredDocuments = useMemo(() => findDocuments(searchIndex, query, (document) => {
      if (kind !== 'all' && document.kind !== kind) return false;
      if (section !== 'all' && document.section !== section) return false;
      if (tag !== 'all' && !document.tags?.includes(tag)) return false;
      if (year !== 'all' && document.year !== year) return false;
      return true;
  }), [kind, query, section, tag, year]);

  const hasFilters = Boolean(query || kind !== 'all' || section !== 'all' || tag !== 'all' || year !== 'all');

  function clearFilters() {
    setQuery('');
    setKind('all');
    setSection('all');
    setTag('all');
    setYear('all');
    history.replace({...location, search: ''});
  }

  function submitSearch(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    for (const [name, value] of Object.entries({q:query.trim(), type:kind, section, tag, year})) {
      if (value && value !== 'all') params.set(name, value);
    }
    history.replace({...location, search: params.size ? `?${params}` : ''});
  }

  return (
    <Layout
      title="全站內容索引"
      description="搜尋和瀏覽 w0x7ce 的技術筆記、開發誌與探索系列。">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <div className={styles.libraryBreadcrumb}>
              <Link to="/explore">探索</Link><span aria-hidden="true">/</span><span>全站索引</span>
            </div>
            <span className={styles.eyebrow}>CONTENT INDEX</span>
            <Heading as="h1">全站內容索引</Heading>
            <p>找技術筆記、開發誌與旅行專題。可用簡繁中文、常用地名別稱，或輸入多個關鍵字。</p>
          </div>
        </header>

        <section className="container" aria-labelledby="library-controls">
          <h2 id="library-controls" className={styles.visuallyHidden}>內容篩選</h2>
          <form className={styles.controls} role="search" aria-label="全站索引搜尋" onSubmit={submitSearch}>
            <div className={styles.searchField}>
              <label htmlFor="library-query">搜尋內容</label>
              <div className={styles.searchPair}><input
                id="library-query"
                type="search"
                maxLength={120}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="例如：宿务 博物馆、BLE、Corregidor"
                aria-label="搜尋內容標題、摘要與標籤"
              />
              <button className={styles.searchSubmit} type="submit" title="更新可分享的搜尋網址">搜尋 <span aria-hidden="true">↗</span></button></div>
            </div>
            <label><span>類型</span><select value={kind} onChange={(event) => setKind(event.target.value)}>
              <option value="all">全部類型</option><option value="docs">技術筆記</option>
              <option value="blog">開發誌</option><option value="explore">探索系列</option>
            </select></label>
            <label><span>領域</span><select value={section} onChange={(event) => setSection(event.target.value)}>
              <option value="all">全部領域</option>{sections.map((value) => <option key={value} value={value}>{value}</option>)}
            </select></label>
            <label><span>標籤</span><select value={tag} onChange={(event) => setTag(event.target.value)}>
              <option value="all">全部標籤</option>{tags.map((value) => <option key={value} value={value}>{value}</option>)}
            </select></label>
            <label><span>年份</span><select value={year} onChange={(event) => setYear(event.target.value)}>
              <option value="all">全部年份</option>{years.map((value) => <option key={value} value={value}>{value}</option>)}
            </select></label>
            <button className={styles.clearButton} type="button" onClick={clearFilters} disabled={!hasFilters}>清除篩選</button>
          </form>
          <nav className={styles.quickQueries} aria-label="快速瀏覽">
            <span>快速瀏覽</span>
            <Link to="?type=docs">技術筆記</Link>
            <Link to="?type=blog">開發誌</Link>
            <Link to="?type=explore">旅行專題</Link>
            <Link to="?q=Corregidor">科雷希多島</Link>
          </nav>
          <div className={styles.resultsHeader}>
            <p aria-live="polite">顯示 <strong>{filteredDocuments.length}</strong> / {documents.length} 篇內容</p>
          </div>
          {filteredDocuments.length ? (
            <>
              <div className={styles.grid}>{filteredDocuments.slice(0, limit).map((document) => <ContentCard key={document.id} document={document} />)}</div>
              {limit < filteredDocuments.length && <button className={styles.clearButton} style={{marginTop:'1.25rem'}} type="button" onClick={() => setLimit((count) => count + batchSize)}>顯示更多（已列出 {limit} 篇）</button>}
            </>
          ) : (
            <div className={styles.emptyState} role="status">
              <Heading as="h2">找不到符合的內容。</Heading>
              <p>試試較短的關鍵字，或清除部分篩選條件。</p>
              <button className={styles.clearButton} type="button" onClick={clearFilters}>清除篩選</button>
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}
