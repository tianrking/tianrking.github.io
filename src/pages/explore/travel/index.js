import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import issues from '@site/src/data/travel-series-catalog.json';
import styles from './styles.module.css';

const defaultFilters = [
  {id: 'all', label: '全部專題'},
  {id: 'conditional', label: '需先核對安全條件'},
];

function IssueCard({issue}) {
  return (
    <article className={`${styles.issueCard} ${issue.conditional ? styles.issueCardConditional : ''}`}>
      <div className={styles.issueCardTop}>
        <span className={styles.issueNumber}>TRAVEL SERIES / {String(issue.issue).padStart(2, '0')}</span>
        {issue.conditional && <span className={styles.conditionalFlag}>條件式規劃</span>}
      </div>
      <Heading as="h3"><Link to={issue.route}>{issue.title}</Link></Heading>
      <p className={styles.issueDescription}>{issue.description}</p>
      <div className={styles.issueMeta}>
        <span>{issue.destination}</span>
        <span>{issue.days} 日 / {issue.nights} 晚</span>
      </div>
      {issue.companionRoutes.length > 0 && (
        <div className={styles.companionLinks}>
          {issue.companionRoutes.map((route) => (
            <Link key={route} to={route}>
              {route.includes('malaysia-10-day') ? '另有 10 日慢遊版' : '另有 8 日精簡版'} <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      )}
      <Link className={styles.readLink} to={issue.route}>
        閱讀完整專題 <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}

export default function TravelSeriesPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const visibleIssues = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return issues.filter((issue) => {
      const matchesQuery = !normalizedQuery ||
        `${issue.title} ${issue.description} ${issue.destination} ${issue.slug} ${(issue.tags ?? []).join(' ')}`
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      const matchesFilter = filter !== 'conditional' || issue.conditional;
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  return (
    <Layout
      title="旅行專題"
      description="獨立編號的亞洲旅行專題：每篇從路線與歷史脈絡，到交通住宿、預算、安全與實用資料完整規劃。">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.eyebrow}>EXPLORATION / TRAVEL SERIES</div>
            <Heading as="h1">旅行專題</Heading>
            <p>每一篇都是獨立目的地計畫：從路線和歷史脈絡，到交通、住宿、預算與現場取捨。</p>
            <div className={styles.heroFacts}>
              <span><strong>{issues.length.toString().padStart(2, '0')}</strong> 篇亞洲目的地專題</span>
              <span>一篇一條完整路線</span>
              <Link to="/explore/library">探索全部內容 <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </header>

        <section className={`container ${styles.librarySection}`} aria-labelledby="library-heading">
          <div className={styles.libraryHeader}>
            <div className={styles.sectionIntro}>
              <span className={styles.sectionEyebrow}>THE SERIES / 01—{String(issues.length).padStart(2, '0')}</span>
              <Heading as="h2" id="library-heading">一篇一條路線。</Heading>
              <p>01 馬來西亞、02 印度尼西亞，之後按系列編號展開；每篇都可單獨閱讀與規劃。</p>
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
            {defaultFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                className={filter === item.id ? styles.filterActive : ''}
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}>
                {item.label}
              </button>
            ))}
            <span className={styles.resultCount} aria-live="polite">{visibleIssues.length} 篇</span>
          </div>

          {visibleIssues.length > 0 ? (
            <div className={styles.issueGrid}>
              {visibleIssues.map((issue) => <IssueCard key={issue.slug} issue={issue} />)}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <strong>沒有找到相符的旅程。</strong>
              <span>試試目的地名稱，或清除搜尋條件。</span>
              <button type="button" onClick={() => {setQuery(''); setFilter('all');}}>顯示全部專題</button>
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
              <span>TRAVEL COMPANION / VIETNAM · 08 DAYS</span>
              <strong>越南北部精簡版</strong>
              <small>河內、寧平與沙巴的短假期版本 ↗</small>
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
