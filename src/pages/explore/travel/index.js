import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function TravelSeriesPage() {
  return (
    <Layout
      title="行旅誌"
      description="旅行記錄：歷史、博物館、宗教文化、路線與交通。">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <div className={styles.eyebrow}>EXPLORATION / TRAVEL LOG</div>
            <Heading as="h1">行旅誌</Heading>
            <p>博物館、古蹟、宗教文化與城市歷史；每日路線、交通與住宿。</p>
          </div>
        </header>

        <section className={`container ${styles.feature}`} aria-labelledby="indonesia-story-title">
          <div className={styles.featureTopline}>
            <span>印度尼西亞 / 旅行計畫</span>
            <span>9 日 / 8 晚</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="indonesia-story-title">雅加達入、泗水出<br />爪哇歷史文化 9 日</Heading>
              <p>雅加達金融博物館與清真寺、日惹婆羅浮屠與普蘭巴南、泗水戰爭墓園與獨立革命史。三城各住一處，以兩段白天火車串聯。</p>
              <div className={styles.featureMeta}>
                <span>2＋4＋2 晚</span>
                <span>公共交通</span>
                <span>外國遊客票種</span>
                <span>閉館日期檢查</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/indonesia-java-9-day-jakarta-yogyakarta-surabaya">打開完整計畫 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.routeCard} aria-label="印度尼西亞路線節點">
              <div className={styles.routeCardLabel}>雅加達入境 → 泗水出境</div>
              <div className={styles.routeList}>
                {['CGK 機場', '雅加達 · 2 晚', '日惹 · 4 晚', '泗水 · 2 晚', 'SUB 機場'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}>
                    <span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{stop}</span>
                    {index < 4 && <span className={styles.routeLine} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className={styles.routeNote}>每日路線、車站、住宿區域、導航、預算與預約順序；出發日期可自行檢查。</p>
            </div>
          </div>
        </section>

        <section className={`container ${styles.feature}`} aria-labelledby="first-story-title">
          <div className={styles.featureTopline}>
            <span>TRAVEL LOG / 01</span>
            <span>2026.08.29 — 2026.09.06</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="first-story-title">馬來西亞西馬半島<br />9 日博物館與二戰行程</Heading>
              <p>
                從馬六甲的殖民要塞與華人古墓，到檳城的國慶、二戰地下要塞與宗族街區，
                再沿北馬鐵路走進布央谷、太平、怡保，最後回到吉隆坡的國家級博物館、清真寺與現代地標。
              </p>
              <div className={styles.featureMeta}>
                <span>9 日 / 8 晚</span>
                <span>歷史考古</span>
                <span>國家級地標</span>
                <span>公共交通與經濟住宿</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/malaysia-peninsula-8-day">
                打開完整行程 <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className={styles.routeCard} aria-label="馬來西亞路線節點">
              <div className={styles.routeCardLabel}>ROUTE / COUNTER-CLOCKWISE</div>
              <div className={styles.routeList}>
                {['KUL', '馬六甲', '檳城', '布央谷', '太平', '怡保', '吉隆坡', 'KUL T2'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}>
                    <span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{stop}</span>
                    {index < 7 && <span className={styles.routeLine} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className={styles.routeNote}>渡輪、KTM／ETS 與長途巴士串聯西馬半島。</p>
            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
}
