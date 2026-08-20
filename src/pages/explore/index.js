import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {travelSeries} from '@site/src/data/explore-series';
import styles from './styles.module.css';

const categories = [
  {
    index: '01',
    label: '行旅誌',
    title: '旅行規劃與記錄',
    description: '把路線、歷史、交通、預算與現場觀察整理成下一次可以直接使用的旅程。',
    meta: '1 個系列 · 1 篇完整方案',
    route: '/explore/travel',
    accent: 'travel',
  },
  {
    index: '02',
    label: '其他探索',
    title: '城市、文化與專題',
    description: '城市、文化、方法與其他非技術專題。',
    meta: '目前 0 篇',
    route: '/explore/notes',
    accent: 'notes',
  },
];

export default function ExplorePage() {
  return (
    <Layout
      title="探索"
      description="旅行規劃、城市觀察與非技術專題。">
      <main className={styles.page}>
        <header className={styles.hubHero}>
          <div className="container">
            <div className={styles.hubHeroTop}>
              <span className={styles.eyebrow}>EXPLORATION / INDEX</span>
              <Link className={styles.indexLink} to="/explore/library">
                全站內容索引 <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <Heading as="h1">探索系列</Heading>
            <p>旅行規劃與非技術專題。選擇一個系列。</p>
          </div>
        </header>

        <section className={`container ${styles.categorySection}`} aria-labelledby="explore-categories">
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>內容分類</span>
            <Heading as="h2" id="explore-categories">選擇系列。</Heading>
          </div>
          <div className={styles.categoryGrid}>
            {categories.map((category) => (
              <Link
                key={category.index}
                className={`${styles.categoryCard} ${styles[category.accent]}`}
                to={category.route}>
                <div className={styles.categoryCardTop}>
                  <span>{category.index}</span>
                  <span>{category.label}</span>
                </div>
                <Heading as="h3">{category.title}</Heading>
                <p>{category.description}</p>
                <div className={styles.categoryCardBottom}>
                  <span>{category.meta}</span>
                  <span aria-hidden="true">↗</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={`container ${styles.featuredStrip}`} aria-labelledby="featured-travel">
          <div>
            <span className={styles.sectionKicker}>{travelSeries.eyebrow}</span>
            <Heading as="h2" id="featured-travel">第一篇：馬來西亞西馬半島 9 日行程</Heading>
            <p>{travelSeries.description}</p>
          </div>
          <Link className={styles.featuredLink} to={travelSeries.route}>
            閱讀行程 <span aria-hidden="true">→</span>
          </Link>
        </section>

        <section className={`container ${styles.libraryPrompt}`} aria-labelledby="library-heading">
          <div>
            <span className={styles.sectionKicker}>UTILITY</span>
            <Heading as="h2" id="library-heading">全站內容索引</Heading>
            <p>跨類型搜尋技術筆記、開發誌與探索系列。</p>
          </div>
          <Link className={styles.libraryLink} to="/explore/library">
            開啟索引 <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
    </Layout>
  );
}
