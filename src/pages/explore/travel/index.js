import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function TravelSeriesPage() {
  return (
    <Layout
      title="行旅誌"
      description="旅行規劃、田野筆記與行程復盤。">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <div className={styles.eyebrow}>EXPLORATION / TRAVEL LOG</div>
            <Heading as="h1">把旅程寫成一份<br />可以真正執行的記錄。</Heading>
            <p>路線、歷史、交通、預算、食物與現場風險，集中在同一份行程文件。</p>
          </div>
        </header>

        <section className={`container ${styles.feature}`} aria-labelledby="first-story-title">
          <div className={styles.featureTopline}>
            <span>TRAVEL LOG / 01</span>
            <span>2026.08.29 — 2026.09.06</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="first-story-title">馬來西亞西馬半島<br />9 日歷史考古行程</Heading>
              <p>
                從馬六甲的殖民要塞與華人古墓，到檳城的國慶、二戰地下要塞與宗族街區，
                再沿北馬鐵路走進布央谷、太平、怡保，最後回到吉隆坡的國家級博物館、清真寺與現代地標。
              </p>
              <div className={styles.featureMeta}>
                <span>9 日 / 8 晚</span>
                <span>歷史考古</span>
                <span>國家級地標</span>
                <span>最低成本估算</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/malaysia-peninsula-8-day">
                打開完整行程 <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className={styles.routeCard} aria-label="馬來西亞路線節點">
              <div className={styles.routeCardLabel}>ROUTE / COUNTER-CLOCKWISE</div>
              <div className={styles.routeList}>
                {['KUL', '馬六甲', '檳城', '布央谷', '太平', '怡保', 'KL / KUL'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}>
                    <span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{stop}</span>
                    {index < 6 && <span className={styles.routeLine} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className={styles.routeNote}>不追求把每個景點塞滿，而是讓每次轉移都能接上下一段歷史。</p>
            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
}
