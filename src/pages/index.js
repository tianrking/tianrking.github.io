import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {useHistory} from '@docusaurus/router';
import ProjectCard, {
  getCategoryLabel,
  getProjectLanguages,
  getStatusLabel,
  useFeaturedProjects,
} from '@site/src/components/ProjectCard';
import recentContent from '@site/src/data/recent-content.json';
import styles from './index.module.css';

const editorPicks = [
  {kind:'技術筆記',title:'TLSR8258 開發與燒錄',description:'從工具鏈、SWS 接線到燒錄驗證，把硬體實作的關鍵細節一次對齊。',to:'/embedded/telink/tlsr8258/sws-build-flash-verify'},
  {kind:'代表專案',title:'EdgeMirror',description:'以 Cloudflare Workers 建置軟體倉庫鏡像，從邊緣轉送與快取取捨理解專案架構。',to:'https://github.com/tianrking/EdgeMirror'},
  {kind:'實走遊記',title:'馬尼拉與科雷希多島',description:'從馬尼拉城市旅行走到海灣口，分開整理親身足跡、二戰歷史與地點導讀。',to:'/explore/travel/philippines-manila-corregidor-travel-notes'},
];

const entrances = [
  {
    index: '01',
    title: '技術筆記',
    description: '可重現的開發流程、架構拆解、接線與故障排除。',
    to: '/tutorial',
  },
  {
    index: '02',
    title: '開發誌',
    description: '帶有時間脈絡的發布、踩坑、取捨與工程觀察。',
    to: '/blog',
  },
  {
    index: '03',
    title: '實驗場',
    description: '公開服務、工具與線上原型。',
    to: '/labs',
  },
  {
    index: '04',
    title: '探索',
    description: '旅行規劃、城市觀察與非技術專題。',
    to: '/explore',
  },
];

function SectionHeading({eyebrow, title, description, action}) {
  return (
    <div className={styles.sectionHeading}>
      <div>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <Heading as="h2">{title}</Heading>
        {description ? <p>{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

function HomepageHero() {
  const history = useHistory();
  return (
    <header className={styles.hero}>
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <span className={styles.identity}>W0X7CE / 個人網站</span>
          <Heading as="h1">工程筆記<span>與旅途紀錄。</span></Heading>
          <p className={styles.lead}>
            記下嵌入式系統、在地 AI 與基礎設施的實作，也整理走過的城市、博物館與古蹟。
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} to="/tutorial">
              閱讀技術筆記 <span aria-hidden="true">→</span>
            </Link>
            <Link className={styles.secondaryAction} to="/explore/travel/#completed-heading">
              瀏覽旅行紀錄
            </Link>
          </div>
          <form className={styles.heroSearch} role="search" aria-label="搜尋全站索引" action="/explore/library" onSubmit={(event) => {
            event.preventDefault();
            const query = String(new FormData(event.currentTarget).get('q') ?? '').trim();
            history.push(query ? `/explore/library?${new URLSearchParams({q: query})}` : '/explore/library');
          }}>
            <label htmlFor="home-site-search" className={styles.searchLabel}>搜尋文章標題、摘要與地點</label>
            <input id="home-site-search" name="q" type="search" maxLength={120} placeholder="例如：BLE、爪哇、Corregidor" />
            <button type="submit">搜尋 <span aria-hidden="true">↗</span></button>
          </form>
        </div>

        <aside className={styles.signalPanel} aria-label="最新文章">
          <div className={styles.panelHeader}>
            <h2>最新文章</h2>
          </div>
          <ul className={styles.latestList}>
            {recentContent.map((item) => <li key={item.route}>
              <Link to={item.route}>
                <small>{item.kindLabel} <span aria-hidden="true">·</span> <time dateTime={item.date}>{item.date.replaceAll('-', '.')}</time></small>
                <strong>{item.title}</strong>
                <span className={styles.latestArrow} aria-hidden="true">↗</span>
              </Link>
            </li>)}
          </ul>
          <div className={styles.panelFooter}>
            <Link to="/explore/library">瀏覽全站索引 <span aria-hidden="true">→</span></Link>
          </div>
        </aside>
      </div>
    </header>
  );
}

function ProjectRow({project, index}) {
  const languages = getProjectLanguages(project);
  const tags = (project.tags || project.tech || [])
    .filter((tag) => !languages.some((language) => language.toLowerCase() === String(tag).toLowerCase()))
    .slice(0, 2);
  const github = project.github || {};
  const stars = github.stars ?? github.stargazersCount ?? github.stargazerCount;
  const latestRelease = github.latestRelease?.tagName
    || github.latestRelease?.tag
    || github.latestRelease?.name
    || github.latestRelease;
  const repository = project.repo || project.repositories?.[0];
  const repositoryUrl = project.links?.github
    || project.githubUrl
    || (repository?.owner && repository?.name
      ? `https://github.com/${repository.owner}/${repository.name}`
      : null);

  return (
    <article className={styles.projectRow}>
      <span className={styles.projectRowIndex}>{String(index).padStart(2, '0')}</span>
      <div className={styles.projectRowBody}>
        <div className={styles.projectRowMeta}>
          <span>{getCategoryLabel(project.category)}</span>
          <span className={styles.projectRowStatus}>
            <span aria-hidden="true" />
            {getStatusLabel(project.status)}
          </span>
        </div>
        <Heading as="h3">{project.title}</Heading>
        <p>{project.summary || project.description}</p>
        <div className={styles.projectRowTags}>
          {[...languages.slice(0, 2), ...tags].map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      <div className={styles.projectRowAside}>
        <div className={styles.projectRowMetrics}>
          {stars !== undefined && stars !== null ? <span><strong>{stars}</strong> stars</span> : null}
          {latestRelease ? <span>{latestRelease}</span> : null}
        </div>
        {repositoryUrl ? (
          <a href={repositoryUrl} target="_blank" rel="noopener noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function Home() {
  const {projects, snapshotState} = useFeaturedProjects();
  const featured = projects.filter((project) => project.id !== 'edge-mirror').slice(0, 5);

  return (
    <Layout
      title="w0x7ce"
      description="嵌入式系統、Local AI 與基礎設施筆記。">
      <main className={styles.page}>
        <HomepageHero />

        <section className={`${styles.section} ${styles.editorSection}`} aria-labelledby="output-heading">
          <div className="container">
            <SectionHeading eyebrow="SELECTED WORK" title={<span id="output-heading">編輯精選</span>}
              action={<Link className={styles.textAction} to="/explore/library">全站索引 <span aria-hidden="true">→</span></Link>} />
            <div className={styles.editorGrid}>
              {editorPicks.map((pick, index) => (
                <Link key={pick.to} to={pick.to} className={styles.editorCard}>
                  <span className={styles.editorMeta}><span>0{index + 1} / {pick.kind}</span><span aria-hidden="true">↗</span></span>
                  <Heading as="h3">{pick.title}</Heading>
                  <p>{pick.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="projects-heading">
          <div className="container">
            <SectionHeading
              eyebrow="精選作品"
              title={<span id="projects-heading">精選專案</span>}
              description="專案狀態、技術棧與 GitHub 公開資料。"
              action={(
                <Link className={styles.textAction} to="/projects">
                  全部專案 <span aria-hidden="true">→</span>
                </Link>
              )}
            />
            <div className={styles.projectShowcase}>
              {featured[0] ? (
                <div className={styles.featuredProject}>
                  <div className={styles.featuredProjectLabel}>
                    <span>01</span>
                    <span>Selected build</span>
                  </div>
                  <ProjectCard project={featured[0]} />
                </div>
              ) : null}
              <div className={styles.projectList}>
                {featured.slice(1, 5).map((project, index) => (
                  <ProjectRow key={project.id} project={project} index={index + 2} />
                ))}
              </div>
            </div>
            <p className={styles.dataNote}>
              {snapshotState === 'fallback'
                ? '目前顯示網站內建的專案快照。'
                : 'Stars、語言與版本資訊由公開 GitHub 快照定期更新。'}
            </p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="browse-heading">
          <div className="container">
            <SectionHeading
              eyebrow="瀏覽內容"
              title={<span id="browse-heading">內容入口</span>}
            />
            <div className={styles.entranceGrid}>
              {entrances.map((entrance) => (
                <Link key={entrance.index} className={styles.entrance} to={entrance.to}>
                  <span className={styles.entranceIndex}>{entrance.index}</span>
                  <Heading as="h3">{entrance.title}</Heading>
                  <p>{entrance.description}</p>
                  <span className={styles.entranceAction}>進入 <span aria-hidden="true">→</span></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.closing}>
          <div className={`container ${styles.closingInner}`}>
            <span className={styles.closingMark} aria-hidden="true">W7</span>
            <div>
              <span className={styles.eyebrow}>開源程式碼</span>
              <Heading as="h2">GitHub 公開程式碼與專案。</Heading>
            </div>
            <a href="https://github.com/tianrking" target="_blank" rel="noopener noreferrer">
              GitHub / tianrking <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
