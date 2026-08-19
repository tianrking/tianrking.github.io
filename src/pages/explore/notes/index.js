import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from '../styles.module.css';

export default function ExplorationNotesPage() {
  return (
    <Layout
      title="其他探索"
      description="城市、文化與非技術專題。">
      <main className={styles.page}>
        <header className={styles.hubHero}>
          <div className="container">
            <div className={styles.libraryBreadcrumb}>
              <Link to="/explore">探索</Link><span aria-hidden="true">/</span><span>其他探索</span>
            </div>
            <span className={styles.eyebrow}>OTHER EXPLORATIONS / 02</span>
            <Heading as="h1">城市、文化與專題</Heading>
            <p>城市觀察、文化脈絡與非技術專題。</p>
          </div>
        </header>
        <section className={`container ${styles.notesEmpty}`} aria-labelledby="notes-empty-heading">
          <span className={styles.sectionKicker}>目前 0 篇</span>
          <Heading as="h2" id="notes-empty-heading">尚未發布內容</Heading>
          <p>此分類尚未發布文章。</p>
          <div className={styles.notesActions}>
            <Link className={styles.featuredLink} to="/explore/travel">先看行旅誌 <span aria-hidden="true">→</span></Link>
            <Link className={styles.libraryLink} to="/explore/library">瀏覽全站索引 <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
