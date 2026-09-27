import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {
  HtmlClassNameProvider,
  PageMetadata,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import MDXContent from '@theme/MDXContent';
import TOC from '@theme/TOC';
import ContentVisibility from '@theme/ContentVisibility';
import EditMetaRow from '@theme/EditMetaRow';
import TOCCollapsible from '@theme/TOCCollapsible';
import seriesCatalog from '@site/src/data/travel-series-catalog.json';
import styles from './styles.module.css';

const companionIssues = {
  'malaysia-10-day-kuala-lumpur-melaka-ipoh-taiping-penang': 1,
  'vietnam-north-8-day-hanoi-ninh-binh-sapa': 5,
};

export default function MDXPage({content: MDXPageContent}) {
  const location = useLocation();
  const {metadata, assets} = MDXPageContent;
  const {
    title,
    editUrl,
    description,
    frontMatter,
    lastUpdatedBy,
    lastUpdatedAt,
  } = metadata;
  const {
    keywords,
    wrapperClassName,
    hide_table_of_contents: hideTableOfContents,
  } = frontMatter;
  const image = assets.image ?? frontMatter.image;
  const pathParts = location.pathname.split('/').filter(Boolean);
  const isTravelArticle = pathParts[0] === 'explore' && pathParts[1] === 'travel';
  const slug = pathParts[2];
  const seriesEntry = seriesCatalog.find((entry) => entry.slug === slug);
  const issueIndex = seriesEntry ? seriesEntry.issue - 1 : -1;
  const previousIssue = issueIndex > 0 ? seriesCatalog[issueIndex - 1] : null;
  const nextIssue = issueIndex >= 0 ? seriesCatalog[issueIndex + 1] ?? null : null;
  const companionIssue = companionIssues[slug];
  const issueNumber = issueIndex >= 0 ? issueIndex + 1 : companionIssue;
  const isCompanion = issueIndex < 0 && Boolean(companionIssue);
  const durationMatch = title.match(/(\d+)\s*(?:日|天)/);
  const duration = durationMatch ? Number(durationMatch[1]) : null;
  const issueLabel = isCompanion
    ? `TRAVEL COMPANION / SERIES ${String(issueNumber).padStart(2, '0')}`
    : `TRAVEL SERIES / ${String(issueNumber).padStart(2, '0')}`;
  const isConditional = Boolean(seriesEntry?.conditional);
  const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy);

  return (
    <HtmlClassNameProvider
      className={clsx(
        wrapperClassName ?? ThemeClassNames.wrapper.mdxPages,
        ThemeClassNames.page.mdxPage,
        isTravelArticle && 'travelGuidePage',
      )}>
      <Layout>
        <PageMetadata title={title} description={description} keywords={keywords} image={image} />
        {isTravelArticle ? (
          <header className={styles.hero}>
            <div className={`container ${styles.heroInner}`}>
              <nav className={styles.breadcrumb} aria-label="麵包屑導覽">
                <Link to="/explore">探索</Link><span aria-hidden="true">/</span>
                <Link to="/explore/travel">旅行專題</Link><span aria-hidden="true">/</span>
                <span>{issueNumber ? String(issueNumber).padStart(2, '0') : '補充路線'}</span>
              </nav>
              <div className={styles.eyebrowRow}>
                <span className={styles.eyebrow}>{issueNumber ? issueLabel : 'TRAVEL NOTES / ROUTE GUIDE'}</span>
                {duration && <span className={styles.duration}>{duration} 日 / {Math.max(0, duration - 1)} 晚</span>}
                {isConditional && <span className={styles.safetyLabel}>先核對安全條件</span>}
              </div>
              <h1>{title}</h1>
              <p className={styles.description}>{description}</p>
              {isConditional && <p className={styles.safetyNote}>本篇只在官方旅行警示與安全條件允許時供規劃參考；請先看文首警示，不代表建議目前前往。</p>}
            </div>
          </header>
        ) : null}
        <main className={clsx('container', 'container--fluid', 'margin-vert--lg', isTravelArticle && 'travelGuidePage_main')}>
          {isTravelArticle && !hideTableOfContents && MDXPageContent.toc.length > 0 && (
            <div className="travelGuidePage_mobileToc" aria-label="本文目錄">
              <TOCCollapsible
                toc={MDXPageContent.toc}
                minHeadingLevel={frontMatter.toc_min_heading_level}
                maxHeadingLevel={frontMatter.toc_max_heading_level}
                className="travelGuidePage_mobileTocCollapsible"
              />
            </div>
          )}
          <div className={clsx('row', 'travelGuidePage_contentRow')}>
            <div className={clsx('col', !hideTableOfContents && 'col--8', isTravelArticle && styles.articleColumn)}>
              <ContentVisibility metadata={metadata} />
              <article className={isTravelArticle ? 'travelGuidePage_article' : undefined}>
                <MDXContent><MDXPageContent /></MDXContent>
              </article>
              {canDisplayEditMetaRow && (
                <EditMetaRow
                  className={clsx('margin-top--sm', ThemeClassNames.pages.pageFooterEditMetaRow)}
                  editUrl={editUrl}
                  lastUpdatedAt={lastUpdatedAt}
                  lastUpdatedBy={lastUpdatedBy}
                />
              )}
            </div>
            {!hideTableOfContents && MDXPageContent.toc.length > 0 && (
              <aside className={clsx('col', 'col--2', isTravelArticle && 'travelGuidePage_tocColumn')} aria-label="本文目錄">
                <TOC
                  toc={MDXPageContent.toc}
                  minHeadingLevel={frontMatter.toc_min_heading_level}
                  maxHeadingLevel={frontMatter.toc_max_heading_level}
                />
              </aside>
            )}
          </div>
          {isTravelArticle && (
            <>
              {seriesEntry && (previousIssue || nextIssue) && (
                <nav className={styles.seriesNav} aria-label="相鄰旅行專題">
                  {previousIssue ? (
                    <Link className={styles.seriesNavPrevious} to={previousIssue.route}>
                      <span>← TRAVEL SERIES / {String(previousIssue.issue).padStart(2, '0')}</span>
                      <strong>{previousIssue.title}</strong>
                    </Link>
                  ) : <span />}
                  {nextIssue ? (
                    <Link className={styles.seriesNavNext} to={nextIssue.route}>
                      <span>TRAVEL SERIES / {String(nextIssue.issue).padStart(2, '0')} →</span>
                      <strong>{nextIssue.title}</strong>
                    </Link>
                  ) : <span />}
                </nav>
              )}
              <div className={styles.returnLink}><Link to="/explore/travel">← 回到全部旅行專題</Link></div>
            </>
          )}
        </main>
      </Layout>
    </HtmlClassNameProvider>
  );
}
