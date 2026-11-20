import React, {useEffect, useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {useLocation} from '@docusaurus/router';
import contentIndex from '@site/src/data/content-index.json';
import travelCatalog from '@site/src/data/travel-series-catalog.json';
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
  keywords: item.slug.split('-'),
}));
const documents = [...travelDocuments, ...(contentIndex.documents || [])];
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

function searchableText(document) {
  return [
    document.title,
    document.description,
    document.section,
    document.kindLabel,
    ...(document.tags || []),
    ...(document.keywords || []),
  ].join(' ').toLocaleLowerCase();
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
  const {search} = useLocation();
  const routeQuery = new URLSearchParams(search).get('q')?.slice(0, 120) ?? '';
  // Static HTML is generated without a query string; apply the URL after hydration.
  const [query, setQuery] = useState('');
  useEffect(() => {setQuery(routeQuery);}, [routeQuery]);
  const [kind, setKind] = useState('all');
  const [section, setSection] = useState('all');
  const [tag, setTag] = useState('all');
  const [year, setYear] = useState('all');
  const [limit, setLimit] = useState(batchSize);
  useEffect(() => {setLimit(batchSize);}, [query, kind, section, tag, year]);

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return documents.filter((document) => {
      if (kind !== 'all' && document.kind !== kind) return false;
      if (section !== 'all' && document.section !== section) return false;
      if (tag !== 'all' && !document.tags?.includes(tag)) return false;
      if (year !== 'all' && document.year !== year) return false;
      if (normalizedQuery && !searchableText(document).includes(normalizedQuery)) return false;
      return true;
    });
  }, [kind, query, section, tag, year]);

  const hasFilters = Boolean(query || kind !== 'all' || section !== 'all' || tag !== 'all' || year !== 'all');

  function clearFilters() {
    setQuery('');
    setKind('all');
    setSection('all');
    setTag('all');
    setYear('all');
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
            <p>依關鍵字、類型、領域、標籤與年份篩選。</p>
          </div>
        </header>

        <section className="container" aria-labelledby="library-controls">
          <h2 id="library-controls" className={styles.visuallyHidden}>內容篩選</h2>
          <div className={styles.controls}>
            <label className={styles.searchField}>
              <span>搜尋內容</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="例如：BLE、RP2040、Docker、AI…"
                aria-label="搜尋內容標題、摘要與標籤"
              />
            </label>
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
          </div>
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
