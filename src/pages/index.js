import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import ProjectCard, {useFeaturedProjects} from '@site/src/components/ProjectCard';
import contentIndex from '@site/src/data/content-index.json';
import styles from './index.module.css';

const recentWork = (contentIndex.documents || [])
  .filter((document) => document.date)
  .slice(0, 4)
  .map((document) => ({
    kind: document.kindLabel,
    date: document.date.replaceAll('-', '.'),
    title: document.title,
    description: document.description,
    to: document.route,
  }));

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
    description: '仍在運作或驗證中的服務、工具與線上原型。',
    to: '/labs',
  },
  {
    index: '04',
    title: '探索內容',
    description: '用關鍵字、領域、標籤和年份快速找到需要的內容。',
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
  return (
    <header className={styles.hero}>
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <span className={styles.identity}>w0x7ce / 個人技術筆記</span>
          <Heading as="h1">寫程式、玩硬體，也記下遇到的問題。</Heading>
          <p className={styles.lead}>
            這裡主要放嵌入式系統、Local AI、基礎設施相關的筆記，也有最近在做的專案和一些小實驗。
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} to="/projects">
              看看最近的專案 <span aria-hidden="true">→</span>
            </Link>
            <Link className={styles.secondaryAction} to="/tutorial">
              閱讀技術筆記
            </Link>
          </div>
          <div className={styles.disciplines} aria-label="主要領域">
            <span>Embedded Systems</span>
            <span>Local AI</span>
            <span>Infrastructure</span>
          </div>
        </div>

        <aside className={styles.signalPanel} aria-label="網站內容">
          <div className={styles.panelHeader}>
            <span>網站內容</span>
            <span className={styles.liveIndicator}>現在</span>
          </div>
          <ol className={styles.evidenceList}>
            <li>
              <span>01</span>
              <div><strong>技術筆記</strong><small>流程 · 除錯 · 參考資料</small></div>
            </li>
            <li>
              <span>02</span>
              <div><strong>專案</strong><small>硬體 · 軟體 · 工具</small></div>
            </li>
            <li>
              <span>03</span>
              <div><strong>實驗場</strong><small>服務 · Demo · 實驗</small></div>
            </li>
          </ol>
          <div className={styles.panelFooter}>
            <span>最近在寫</span>
            <strong>TLSR8258 開發與燒錄筆記</strong>
          </div>
        </aside>
      </div>
    </header>
  );
}

export default function Home() {
  const {projects, snapshotState} = useFeaturedProjects();
  const featured = projects.slice(0, 6);

  return (
    <Layout
      title="w0x7ce"
      description="嵌入式系統、Local AI 與基礎設施筆記。">
      <main className={styles.page}>
        <HomepageHero />

        <section className={styles.nowSection} aria-labelledby="now-heading">
          <div className={`container ${styles.nowInner}`}>
            <span className={styles.nowLabel}>現在</span>
            <div>
              <Heading id="now-heading" as="h2">最近在整理 TLSR8258 的開發與燒錄筆記。</Heading>
              <p>包含工具鏈、接線、常見錯誤與實板測試記錄。</p>
            </div>
            <Link to="/embedded/telink/tlsr8258/sws-build-flash-verify">
              查看目前筆記 <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="projects-heading">
          <div className="container">
            <SectionHeading
              eyebrow="最近專案"
              title={<span id="projects-heading">最近的專案</span>}
              description="幾個正在維護或最近整理的公開專案。"
              action={(
                <Link className={styles.textAction} to="/projects">
                  全部專案 <span aria-hidden="true">→</span>
                </Link>
              )}
            />
            <div className={styles.projectGrid}>
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} compact />
              ))}
            </div>
            <p className={styles.dataNote}>
              {snapshotState === 'fallback'
                ? '目前顯示網站內建的專案快照。'
                : 'Stars、語言與版本資訊由公開 GitHub 快照定期更新。'}
            </p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.outputSection}`} aria-labelledby="output-heading">
          <div className="container">
            <SectionHeading
              eyebrow="最近更新"
              title={<span id="output-heading">最近發布</span>}
              description="最近更新的技術筆記與開發紀錄。"
            />
            <div className={styles.outputGrid}>
              {recentWork.map((item) => (
                <Link key={item.to} to={item.to} className={styles.outputCard}>
                  <div className={styles.outputMeta}>
                    <span>{item.kind}</span>
                    <time>{item.date}</time>
                  </div>
                  <Heading as="h3">{item.title}</Heading>
                  <p>{item.description}</p>
                  <span className={styles.outputArrow} aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="browse-heading">
          <div className="container">
            <SectionHeading
              eyebrow="瀏覽內容"
              title={<span id="browse-heading">瀏覽更多內容</span>}
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
              <Heading as="h2">更多程式碼和專案都在 GitHub。</Heading>
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
