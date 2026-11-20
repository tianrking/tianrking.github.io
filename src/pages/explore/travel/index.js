import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import issues from '@site/src/data/travel-series-catalog.json';
import styles from './styles.module.css';

const regionFilters = [
  {id: 'all', label: '全部區域'},
  {id: '東南亞', label: '東南亞'},
  {id: '南亞', label: '南亞'},
  {id: '東亞', label: '東亞'},
  {id: '中亞', label: '中亞'},
  {id: '高加索與東地中海', label: '高加索／東地中海'},
  {id: '西亞', label: '西亞'},
  {id: '歐亞', label: '歐亞'},
];
const completedIssues = issues.filter((issue) => issue.kind === 'record');
const plannedIssues = issues.filter((issue) => issue.kind === 'plan');

function IssueCard({issue}) {
  return (
    <article className={`${styles.issueCard} ${issue.conditional ? styles.issueCardConditional : ''}`}>
      <div className={styles.issueCardTop}>
        <span className={styles.issueNumber}>TRAVEL SERIES / {String(issue.issue).padStart(2, '0')}</span>
        <span className={styles.statusFlag}>{issue.kind === 'record' ? '已完成旅行' : '行前規劃'}</span>
        {issue.conditional && <span className={styles.conditionalFlag}>條件式規劃</span>}
      </div>
      <Heading as="h3"><Link to={issue.route}>{issue.title}</Link></Heading>
      <p className={styles.issueDescription}>{issue.description}</p>
      <div className={styles.issueMeta}>
        <span>{issue.destination}</span>
        <span>{issue.region}</span>
        {issue.kind === 'plan' && issue.days != null && <span>{issue.days} 日 / {issue.nights} 晚</span>}
      </div>
      {issue.companionRoutes.length > 0 && (
        <div className={styles.companionLinks}>
          {issue.companionRoutes.map((route) => (
            <Link key={route} to={route}>
              {route.includes('malaysia-10-day')
                ? '另有 10 日慢遊版'
                : route.includes('vietnam-north-8-day')
                  ? '另有 9 日版（含離境緩衝）'
                  : '另有精簡版'} <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      )}
      <Link className={styles.readLink} to={issue.route}>
        {issue.kind === 'record' ? '閱讀旅行紀錄' : '閱讀行前規劃'} <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}

export default function TravelSeriesPage() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('all');
  const [conditionalOnly, setConditionalOnly] = useState(false);
  const visibleIssues = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return issues.filter((issue) => {
      const matchesQuery = !normalizedQuery ||
        `${issue.title} ${issue.description} ${issue.destination} ${issue.slug} ${(issue.tags ?? []).join(' ')}`
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      const matchesRegion = region === 'all' || issue.region === region;
      const matchesSafety = !conditionalOnly || issue.conditional;
      return matchesQuery && matchesRegion && matchesSafety;
    });
  }, [conditionalOnly, query, region]);
  const visibleRecords = visibleIssues.filter((issue) => issue.kind === 'record');
  const visiblePlans = visibleIssues.filter((issue) => issue.kind === 'plan');

  return (
    <Layout
      title="旅行專題"
      description="馬來西亞、印尼與馬尼拉／科雷希多島的真實旅行紀錄並列呈現；其餘尚未實走的路線另列行前規劃，不混作親歷。">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.eyebrow}>EXPLORATION / TRAVEL SERIES</div>
            <Heading as="h1">旅行專題</Heading>
            <p>走過的旅程，留下真實記錄；尚未實走的路線，另作行前規劃。兩種文章分開閱讀。</p>
            <div className={styles.heroFacts}>
              <span><strong>{completedIssues.length}</strong> 篇旅行紀錄</span>
              <span><strong>{plannedIssues.length}</strong> 篇行前規劃</span>
              <Link to="/explore/library">探索全部內容 <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </header>

        <section className={`container ${styles.librarySection}`} aria-labelledby="library-heading">
          <div className={styles.libraryHeader}>
            <div className={styles.sectionIntro}>
              <span className={styles.sectionEyebrow}>THE SERIES / 01—{String(issues.length).padStart(2, '0')}</span>
              <Heading as="h2" id="library-heading">實走與規劃，分開閱讀。</Heading>
              <p>馬來西亞、印度尼西亞、馬尼拉與科雷希多島是已完成旅行的主文章，同級呈現。其他路線列為尚未實走的行前規劃。</p>
            </div>
            <label className={styles.searchBox}>
              <span className={styles.visuallyHidden}>搜尋旅行專題</span>
              <span aria-hidden="true" className={styles.searchIcon}>⌕</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜尋目的地、古蹟、自然…"
              />
              {query && <button type="button" onClick={() => setQuery('')} aria-label="清除搜尋">×</button>}
            </label>
          </div>

          <div className={styles.filterBar} role="group" aria-label="篩選旅行專題">
            {regionFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                className={region === item.id ? styles.filterActive : ''}
                aria-pressed={region === item.id}
                onClick={() => setRegion(item.id)}>
                {item.label}
              </button>
            ))}
            <button
              type="button"
              className={conditionalOnly ? styles.filterActive : ''}
              aria-pressed={conditionalOnly}
              onClick={() => setConditionalOnly((current) => !current)}>
              僅看條件式規劃
            </button>
            <span className={styles.resultCount} aria-live="polite">{visibleIssues.length} 篇</span>
          </div>

          {visibleIssues.length > 0 ? (
            <div>
              {visibleRecords.length > 0 && <section aria-labelledby="completed-heading">
                <div className={styles.sectionIntro}>
                  <span className={styles.sectionEyebrow}>TRAVEL JOURNALS</span>
                  <Heading as="h2" id="completed-heading">已完成的旅行紀錄</Heading>
                  <p>真實足跡與現場記憶；史料導讀和保留的行前參考不自動視為到訪清單。</p>
                </div>
                <div className={styles.issueGrid}>{visibleRecords.map((issue) => <IssueCard key={issue.slug} issue={issue} />)}</div>
              </section>}
              {visiblePlans.length > 0 && <section className={styles.plannedSection} aria-labelledby="plans-heading">
                <div className={styles.sectionIntro}>
                  <span className={styles.sectionEyebrow}>FUTURE ROUTES</span>
                  <Heading as="h2" id="plans-heading">尚未實走的行前規劃</Heading>
                  <p>用於研究下一趟旅行，不是已完成遊記，也不代表本人已按這條路線出發；部分文章仍是待補親歷的底稿。</p>
                </div>
                <div className={styles.issueGrid}>{visiblePlans.map((issue) => <IssueCard key={issue.slug} issue={issue} />)}</div>
              </section>}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <strong>沒有找到相符的旅程。</strong>
              <span>試試目的地名稱，或清除搜尋條件。</span>
              <button type="button" onClick={() => {setQuery(''); setRegion('all'); setConditionalOnly(false);}}>顯示全部專題</button>
            </div>
          )}
        </section>

        <section className={`container ${styles.companions}`} aria-labelledby="companions-heading">
          <div>
            <span className={styles.sectionEyebrow}>ALTERNATE LENGTHS</span>
            <Heading as="h2" id="companions-heading">同一目的地，另一種天數。</Heading>
            <p>短版與慢遊版是主專題的延伸路線，不另拆成平行目的地。</p>
          </div>
          <div className={styles.companionGrid}>
            <Link to="/explore/travel/malaysia-10-day-kuala-lumpur-melaka-ipoh-taiping-penang">
              <span>TRAVEL COMPANION / MALAYSIA · 10 DAYS</span>
              <strong>馬來西亞半島慢遊版</strong>
              <small>以 01 為基礎，多留一天給古城與館舍 ↗</small>
            </Link>
            <Link to="/explore/travel/vietnam-north-8-day-hanoi-ninh-binh-sapa">
              <span>TRAVEL COMPANION / VIETNAM · 08 DAYS + BUFFER NIGHT</span>
              <strong>越南北部精簡版</strong>
              <small>8 天游覽主線，回河內住一晚後第 9 天離境 ↗</small>
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
