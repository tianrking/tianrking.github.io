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

        <section className="container" aria-label="亞洲十日旅行系列">
          <p style={{margin: '1.4rem 0 0', color: 'var(--site-muted)', fontSize: '.9rem'}}>
            一國一篇，逐步補齊亞洲 10 天路線： <Link to="/explore/travel/asia-10-day-series">查看系列目錄與進度 ↗</Link>
          </p>
        </section>

        <section className={`container ${styles.feature}`} aria-labelledby="indonesia-story-title">
          <div className={styles.featureTopline}>
            <span>印度尼西亞 / 旅行計畫</span>
            <span>10 日 / 9 晚</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="indonesia-story-title">雅加達入、泗水出<br />爪哇歷史文化 10 日</Heading>
              <p>雅加達加住一晚；婆羅浮屠與普蘭巴南同日走主寺及 Sewu，省下的一天留給首都。三城各住一處，以兩段白天火車串聯；想慢看寺群可在日惹加一晚，不硬塞布羅莫與 Tumpak Sewu。</p>
              <div className={styles.featureMeta}>
                <span>4＋3＋2 晚</span>
                <span>公共交通＋寺庙日包车</span>
                <span>外國遊客票種</span>
                <span>閉館日期檢查</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/indonesia-java-9-day-jakarta-yogyakarta-surabaya">打開完整計畫 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.routeCard} aria-label="印度尼西亞路線節點">
              <div className={styles.routeCardLabel}>10 DAYS / CGK → SUB</div>
              <div className={styles.routeList}>
                {['CGK 機場', '雅加達 · 4 晚', '日惹 · 3 晚', '泗水 · 2 晚', 'SUB 機場'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}>
                    <span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{stop}</span>
                    {index < 4 && <span className={styles.routeLine} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className={styles.routeNote}>10 日 9 晚；雅加達 4 晚、日惹 3 晚、泗水 2 晚；一日寺廟線需預約登塔時段與可靠接送。</p>
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

        <section className={`container ${styles.feature}`} aria-labelledby="vietnam-story-title">
          <div className={styles.featureTopline}>
            <span>越南北部 / 旅行計畫</span>
            <span>8 日 / 7 晚</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="vietnam-story-title">河內入、沙巴山地<br />寧平古蹟與老街文化 8 日</Heading>
              <p>以沙巴为核心，串联升龙皇城、Trang An 世界遗产、Hoa Lư 古都、Muong Hoa 梯田、Fansipan 与北河周日市场，按公共交通和天气缓冲安排。</p>
              <div className={styles.featureMeta}>
                <span>2＋1＋3 晚</span>
                <span>自然与古迹</span>
                <span>山地文化</span>
                <span>交通与签证核对</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/vietnam-north-8-day-hanoi-ninh-binh-sapa">打開完整計畫 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.routeCard} aria-label="越南北部路線節點">
              <div className={styles.routeCardLabel}>河內入境 → 沙巴 → 河内出境</div>
              <div className={styles.routeList}>
                {['HAN 機場', '河內 · 2 晚', '寧平 · 1 晚', '沙巴 · 3 晚', '老街／北河', 'HAN 機場'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}>
                    <span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{stop}</span>
                    {index < 5 && <span className={styles.routeLine} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className={styles.routeNote}>世界遺產、梯田、最高峰與周日高地市場；D7 按星期切換北河或沙巴緩衝。</p>
            </div>
          </div>
        </section>

        <section className={`container ${styles.feature}`} aria-labelledby="sri-lanka-story-title">
          <div className={styles.featureTopline}>
            <span>斯里蘭卡 / 旅行計畫</span>
            <span>10 日 / 9 晚</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="sri-lanka-story-title">古代王國、茶山鐵路<br />與南岸古城 10 日</Heading>
              <p>科倫坡機場進出，串聯獅子岩、丹布勒、波隆納魯沃、康提、中央高地、埃勒與加勒；為山地降雨、鐵路中斷和末日返機場預留實際緩衝。</p>
              <div className={styles.featureMeta}>
                <span>文化三角</span><span>高地自然</span><span>世界遺產</span><span>天氣備案</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/sri-lanka-10-day-cultural-highlands-south">打開完整計畫 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.routeCard} aria-label="斯里蘭卡路線節點">
              <div className={styles.routeCardLabel}>10 DAYS / CMB ROUND TRIP</div>
              <div className={styles.routeList}>
                {['CMB／尼甘布 · 1 晚', '錫吉里耶 · 3 晚', '康提 · 1 晚', '茶山／埃勒 · 2 晚', '加勒 · 2 晚', 'CMB'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}><span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span><span>{stop}</span>{index < 5 && <span className={styles.routeLine} aria-hidden="true" />}</div>
                ))}
              </div>
              <p className={styles.routeNote}>文化三角 → 中央高地 → 南部海岸；鐵路依當日天氣與營運狀態確認。</p>
            </div>
          </div>
        </section>

        <section className={`container ${styles.feature}`} aria-labelledby="myanmar-story-title">
          <div className={styles.featureTopline}>
            <span>緬甸 / 條件式旅行預案</span>
            <span>10 日框架 · 暫緩出發</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="myanmar-story-title">先把安全警示放在路線之前</Heading>
              <p>截至 2026 年 9 月，多國政府仍對緬甸發布嚴重旅行警示。頁面提供未來形勢改善後的文化路線框架與明確取消門檻，不把當前狀況包裝成可直接預訂的觀光行程。</p>
              <div className={styles.featureMeta}>
                <span>仰光</span><span>蒲甘</span><span>曼德勒</span><span>官方風險核對</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/myanmar-10-day-conditional-heritage">閱讀安全條件與預案 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.routeCard} aria-label="緬甸條件式路線框架">
              <div className={styles.routeCardLabel}>TRAVEL ADVISORY FIRST</div>
              <div className={styles.routeList}>
                {['先查本國警示', '仰光 · 4 晚', '蒲甘 · 3 晚', '曼德勒 · 2 晚*', '只在可行時轉場'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}><span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span><span>{stop}</span>{index < 4 && <span className={styles.routeLine} aria-hidden="true" />}</div>
                ))}
              </div>
              <p className={styles.routeNote}>*所有地點與交通均受出發當日官方警示、管制與保險條款約束；不符條件即延期。</p>
            </div>
          </div>
        </section>

        <section className={`container ${styles.feature}`} aria-labelledby="philippines-story-title">
          <div className={styles.featureTopline}>
            <span>菲律賓 / 旅行計畫</span>
            <span>10 日 / 9 晚</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="philippines-story-title">馬尼拉入出<br />宿務與薄荷島歷史自然 10 日</Heading>
              <p>從王城與國家博物館走到宿務殖民史，再到薄荷島的巧克力山、眼鏡猴保育區與河谷；把海島天候緩衝和離境前一晚留在路線裡。</p>
              <div className={styles.featureMeta}>
                <span>3＋2＋3＋1 晚</span>
                <span>歷史文化</span>
                <span>喀斯特地貌</span>
                <span>渡船天氣備案</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/philippines-10-day-manila-cebu-bohol">打開完整計畫 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.routeCard} aria-label="菲律賓路線節點">
              <div className={styles.routeCardLabel}>10 DAYS / MNL ROUND TRIP</div>
              <div className={styles.routeList}>
                {['MNL · 馬尼拉 3 晚', 'CEB · 宿務 2 晚', 'TAG · 薄荷島 3 晚', 'MNL · 機場側 1 晚', 'MNL 出境'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}>
                    <span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{stop}</span>
                    {index < 4 && <span className={styles.routeLine} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className={styles.routeNote}>10 日 9 晚；D9 回馬尼拉，避免客船與國際航班同日銜接。</p>
            </div>
          </div>
        </section>

        <section className={`container ${styles.feature}`} aria-labelledby="thailand-story-title">
          <div className={styles.featureTopline}>
            <span>泰國 / 旅行計畫</span>
            <span>10 日 / 9 晚</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="thailand-story-title">曼谷入、清邁出<br />王城、古都與蘭納文化 10 日</Heading>
              <p>從曼谷王城與阿瑜陀耶古都一路向北，接上清邁蘭納街區、素貼山與因他暖山自然線；避開遠距離折返，並替空氣品質與天候留出替代日。</p>
              <div className={styles.featureMeta}>
                <span>曼谷 4 晚</span>
                <span>清邁 5 晚</span>
                <span>世界遺產</span>
                <span>國內航班緩衝</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/thailand-10-day-bangkok-ayutthaya-chiang-mai">打開完整計畫 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.routeCard} aria-label="泰國路線節點">
              <div className={styles.routeCardLabel}>10 DAYS / BKK → CNX</div>
              <div className={styles.routeList}>
                {['BKK · 曼谷 4 晚', '阿瑜陀耶 · 一日往返', 'CNX · 清邁 5 晚', '素貼山', '因他暖山', '清邁出境'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}>
                    <span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{stop}</span>
                    {index < 5 && <span className={styles.routeLine} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className={styles.routeNote}>曼谷往返機票可改 D9 回曼谷，住機場側一晚後離境。</p>
            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
}
