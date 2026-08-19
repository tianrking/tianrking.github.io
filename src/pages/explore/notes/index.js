import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from '../styles.module.css';

export default function ExplorationNotesPage() {
  return (
    <Layout
      title="其他探索"
      description="城市、文化、方法與仍在形成中的非技術探索系列。">
      <main className={styles.page}>
        <header className={styles.hubHero}>
          <div className="container">
            <div className={styles.libraryBreadcrumb}>
              <Link to="/explore">探索</Link><span aria-hidden="true">/</span><span>其他探索</span>
            </div>
            <span className={styles.eyebrow}>OTHER EXPLORATIONS / 02</span>
            <Heading as="h1">城市、文化與專題，慢慢長出自己的形狀。</Heading>
            <p>
              這一區不與旅行混在一起，也不取代技術筆記。它留給觀察、研究、方法與尚在整理中的題目。
            </p>
          </div>
        </header>
        <section className={`container ${styles.notesEmpty}`} aria-labelledby="notes-empty-heading">
          <span className={styles.sectionKicker}>SERIES IN PROGRESS</span>
          <Heading as="h2" id="notes-empty-heading">下一篇探索正在整理中。</Heading>
          <p>之後會在這裡加入城市觀察、文化脈絡與其他不適合放進技術區的長篇內容。</p>
          <div className={styles.notesActions}>
            <Link className={styles.featuredLink} to="/explore/travel">先看行旅誌 <span aria-hidden="true">→</span></Link>
            <Link className={styles.libraryLink} to="/explore/library">瀏覽全站索引 <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
