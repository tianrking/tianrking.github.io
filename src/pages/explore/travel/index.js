import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const seriesPrinciples = [
  {
    index: '01',
    title: '先把路線算清楚',
    body: '先看地理邏輯、交通轉移與每天可承受的密度，再決定要不要加入某個景點。',
  },
  {
    index: '02',
    title: '到現場留下證據',
    body: '景點不是打卡清單，而是歷史、建築、城市與食物的現場資料。',
  },
  {
    index: '03',
    title: '回來之後修正',
    body: '把實際花費、等待時間、體力與意外整理回下一版，讓旅行規劃越來越可靠。',
  },
];

const futureStories = [
  '下一次的城市考古與博物館路線',
  '一段適合慢遊的沿海鐵路旅行',
  '把硬體田野調查與旅行筆記放在同一套方法裡',
];

export default function TravelSeriesPage() {
  return (
    <Layout
      title="行旅誌"
      description="w0x7ce 的旅行規劃、田野筆記與行程復盤系列。">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <div className={styles.eyebrow}>EXPLORATION / TRAVEL LOG</div>
            <Heading as="h1">把旅程寫成一份<br />可以真正執行的記錄。</Heading>
            <p>
              這是一個新的探索系列：把地理、歷史、交通、預算、食物與現場風險放在同一份文件裡，
              也把出發後的修正留給下一次旅行。
            </p>
          </div>
        </header>

        <section className={`container ${styles.feature}`} aria-labelledby="first-story-title">
          <div className={styles.featureTopline}>
            <span>TRAVEL LOG / 01</span>
            <span>2026.08.29 — 2026.09.05</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="first-story-title">馬來西亞西馬半島<br />8 天 7 晚終極歷史考古線</Heading>
              <p>
                從馬六甲的殖民要塞與華人古墓，到檳城的國慶、二戰地下要塞與宗族街區，
                再沿北馬鐵路走進布央谷、太平、怡保，最後回到吉隆坡的國家級博物館、清真寺與現代地標。
              </p>
              <div className={styles.featureMeta}>
                <span>8 天 / 7 晚</span>
                <span>歷史考古</span>
                <span>國家級地標</span>
                <span>背包客硬開銷估算</span>
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

        <section className={`container ${styles.principles}`} aria-labelledby="series-principles-title">
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>METHOD</span>
            <Heading as="h2" id="series-principles-title">這個系列怎麼寫。</Heading>
          </div>
          <div className={styles.principleGrid}>
            {seriesPrinciples.map((item) => (
              <article className={styles.principle} key={item.index}>
                <span className={styles.principleIndex}>{item.index}</span>
                <Heading as="h3">{item.title}</Heading>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`container ${styles.nextSection}`} aria-labelledby="future-stories-title">
          <div className={styles.nextCopy}>
            <span className={styles.eyebrow}>UP NEXT</span>
            <Heading as="h2" id="future-stories-title">後面還會繼續加。</Heading>
            <p>這裡不只放完成後的遊記，也會保留那些還在準備、比較與修正中的版本。</p>
          </div>
          <ul className={styles.futureList}>
            {futureStories.map((story, index) => (
              <li key={story}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {story}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
}
