import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import contentIndex from '@site/src/data/content-index.json';
import styles from './styles.module.css';

const travelDocument = {
  id: 'explore-travel-malaysia-peninsula-8-day',
  title: '馬來西亞西馬半島 8 天 7 晚',
  description: '歷史考古、國家級地標、交通、預算與現場風險整理成一份可執行的行程。',
  section: '行旅誌',
  kind: 'explore',
  kindLabel: '探索系列',
  route: '/explore/travel/malaysia-peninsula-8-day',
  date: '2026-08-19',
  year: '2026',
  tags: ['旅行', '馬來西亞', '歷史考古'],
  keywords: ['馬六甲', '檳城', '布央谷', '太平', '怡保', '吉隆坡'],
};

const documents = [travelDocument, ...(contentIndex.documents || [])];

const travelSeries = {
  eyebrow: 'TRAVEL SERIES / 01',
  title: '馬來西亞西馬半島 8 天 7 晚',
  description:
    '一份把地理路線、歷史考古、國家級地標、交通預訂、預算與現場風險放在同一張桌上的可執行旅行方案。',
  meta: '2026.08.29 — 2026.09.05 · 歷史考古 · 國家級地標',
  route: '/explore/travel/malaysia-peninsula-8-day',
};

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
  return date ? date.replaceAll('-', '.') : '未標日期';
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
        <time dateTime={document.date || undefined}>{formatDate(document.date)}</time>
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

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [section, setSection] = useState('all');
  const [tag, setTag] = useState('all');
  const [year, setYear] = useState('all');

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
      title="探索內容"
      description="搜尋和瀏覽 w0x7ce 的技術筆記、開發誌與工程資料。">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <span className={styles.eyebrow}>CONTENT INDEX</span>
            <Heading as="h1">找到你要的內容。</Heading>
            <p>
              以關鍵字、內容類型、技術領域、標籤或年份篩選技術筆記與開發誌。
              全站搜尋也可以使用 <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd>。
            </p>
          </div>
        </header>

        <section className={`container ${styles.seriesFeature}`} aria-labelledby="travel-series-title">
          <div className={styles.seriesFeatureLabel}>{travelSeries.eyebrow}</div>
          <div className={styles.seriesFeatureBody}>
            <div>
              <Heading as="h2" id="travel-series-title">{travelSeries.title}</Heading>
              <p>{travelSeries.description}</p>
              <div className={styles.seriesMeta}>{travelSeries.meta}</div>
            </div>
            <Link className={styles.seriesLink} to={travelSeries.route}>
              閱讀完整方案 <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className={`container ${styles.explorer}`} aria-labelledby="explore-controls">
          <h2 id="explore-controls" className={styles.visuallyHidden}>內容篩選</h2>
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
            <label>
              <span>類型</span>
              <select value={kind} onChange={(event) => setKind(event.target.value)}>
                <option value="all">全部類型</option>
                <option value="docs">技術筆記</option>
                <option value="blog">開發誌</option>
                <option value="explore">探索系列</option>
              </select>
            </label>
            <label>
              <span>領域</span>
              <select value={section} onChange={(event) => setSection(event.target.value)}>
                <option value="all">全部領域</option>
                {sections.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label>
              <span>標籤</span>
              <select value={tag} onChange={(event) => setTag(event.target.value)}>
                <option value="all">全部標籤</option>
                {tags.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label>
              <span>年份</span>
              <select value={year} onChange={(event) => setYear(event.target.value)}>
                <option value="all">全部年份</option>
                {years.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <button className={styles.clearButton} type="button" onClick={clearFilters} disabled={!hasFilters}>
              清除篩選
            </button>
          </div>

          <div className={styles.resultsHeader}>
            <p aria-live="polite">
              顯示 <strong>{filteredDocuments.length}</strong> / {documents.length} 篇內容
            </p>
            <span>索引在建置時生成，頁面本身不需要等待 API。</span>
          </div>

          {filteredDocuments.length ? (
            <div className={styles.grid}>
              {filteredDocuments.map((document) => <ContentCard key={document.id} document={document} />)}
            </div>
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
