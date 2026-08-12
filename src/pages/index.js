import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import ProjectCard, {useFeaturedProjects} from '@site/src/components/ProjectCard';
import styles from './index.module.css';

const recentWork = [
  {
    kind: '技術筆記',
    date: '2026.08',
    title: 'TLSR8258：從 SWS 燒錄到韌體驗證',
    description: '把工具鏈、接線、建置產物與實板驗證整理成可重做的工程流程。',
    to: '/embedded/telink/tlsr8258/sws-build-flash-verify',
  },
  {
    kind: '開發誌',
    date: '2025.12',
    title: 'Google A2UI：代理驅動介面的新標準',
    description: '從協定、元件目錄與安全模型理解 Agent 如何產生可操作介面。',
    to: '/blog/google-a2ui-agent-driven-interfaces',
  },
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
    description: '仍在運作或驗證中的服務、工具與線上原型。',
    to: '/labs',
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
          <span className={styles.identity}>w0x7ce / engineering field notes</span>
          <Heading as="h1">把做過、拆過、驗證過的系統寫下來。</Heading>
          <p className={styles.lead}>
            嵌入式系統、Local AI 與基礎設施的實作紀錄。不是技術名詞的陳列，而是從原始碼到實板、從原型到運行中的完整證據鏈。
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} to="/projects">
              查看精選專案 <span aria-hidden="true">→</span>
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

        <aside className={styles.signalPanel} aria-label="工程方法">
          <div className={styles.panelHeader}>
            <span>METHOD / EVIDENCE</span>
            <span className={styles.liveIndicator}>NOW</span>
          </div>
          <ol className={styles.evidenceList}>
            <li>
              <span>01</span>
              <div><strong>Build</strong><small>source · toolchain · artifact</small></div>
            </li>
            <li>
              <span>02</span>
              <div><strong>Bench</strong><small>device · signal · measurement</small></div>
            </li>
            <li>
              <span>03</span>
              <div><strong>Publish</strong><small>notes · release · reproducibility</small></div>
            </li>
          </ol>
          <div className={styles.panelFooter}>
            <span>目前聚焦</span>
            <strong>讓硬體 bring-up 的每一步都可診斷</strong>
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
      title="w0x7ce 技術工作台"
      description="嵌入式系統、Local AI 與基礎設施的實作紀錄。">
      <main className={styles.page}>
        <HomepageHero />

        <section className={styles.nowSection} aria-labelledby="now-heading">
          <div className={`container ${styles.nowInner}`}>
            <span className={styles.nowLabel}>NOW</span>
            <div>
              <Heading id="now-heading" as="h2">正在把零散的 bring-up 經驗整理成可重現的工程筆記。</Heading>
              <p>工具版本、接線、失敗症狀與實板驗證會放在同一條路徑裡，而不只留下「最後成功了」。</p>
            </div>
            <Link to="/embedded/telink/tlsr8258/sws-build-flash-verify">
              查看目前筆記 <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="projects-heading">
          <div className="container">
            <SectionHeading
              eyebrow="SELECTED WORK"
              title={<span id="projects-heading">精選專案</span>}
              description="以問題、工程角色與驗證狀態策展，而不是把整個 GitHub 倉庫列表搬過來。"
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
              eyebrow="RECENT OUTPUT"
              title={<span id="output-heading">最近發布</span>}
              description="長期可維護的內容放進技術筆記；有時間脈絡的過程與觀點留在開發誌。"
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
              eyebrow="BROWSE THE WORKBENCH"
              title={<span id="browse-heading">從你需要的資訊進入</span>}
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
              <span className={styles.eyebrow}>OPEN WORK</span>
              <Heading as="h2">原始碼只是起點，能被重現才算完成。</Heading>
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
