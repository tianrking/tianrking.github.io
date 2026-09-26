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

        <section className={`container ${styles.feature}`} aria-labelledby="nepal-story-title">
          <div className={styles.featureTopline}>
            <span>尼泊爾 / 旅行計畫</span>
            <span>10 日 / 9 晚</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="nepal-story-title">加德滿都谷地遺產<br />與博卡拉山湖 10 日</Heading>
              <p>四天慢走加德滿都谷地七處 UNESCO 紀念區，再飛往博卡拉看費瓦湖與安納普爾納山麓；回程預留兩晚緩衝，不把季風山路或國內航班延誤推給國際離境日。</p>
              <div className={styles.featureMeta}>
                <span>加德滿都 7 晚</span>
                <span>博卡拉 2 晚</span>
                <span>世界遺產</span>
                <span>雨季安全閘門</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/nepal-10-day-kathmandu-pokhara-heritage-mountains">打開完整計畫 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.routeCard} aria-label="尼泊爾路線節點">
              <div className={styles.routeCardLabel}>10 DAYS / KTM ROUND TRIP</div>
              <div className={styles.routeList}>
                {['KTM · 加德滿都 5 晚', '谷地七處遺產區', 'PKR · 博卡拉 2 晚', 'KTM · 緩衝 2 晚', 'KTM 出境'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}>
                    <span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{stop}</span>
                    {index < 4 && <span className={styles.routeLine} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className={styles.routeNote}>國內往返航班非準點保證；D8 回 KTM、D9 留作延誤緩衝。</p>
            </div>
          </div>
        </section>

        <section className={`container ${styles.feature}`} aria-labelledby="india-story-title">
          <div className={styles.featureTopline}>
            <span>印度 / 旅行計畫</span>
            <span>10 日 / 9 晚</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="india-story-title">德里往返、阿格拉與<br />齋浦爾金三角 10 日</Heading>
              <p>德里三晚起步，向南看泰姬陵與阿格拉堡，再到齋浦爾古城、琥珀堡與天文台；按泰姬陵週五閉館彈性調整參觀日，離境前一晚回德里留交通緩衝。</p>
              <div className={styles.featureMeta}>
                <span>德里 4 晚</span>
                <span>阿格拉 2 晚</span>
                <span>齋浦爾 3 晚</span>
                <span>白天城際鐵路</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/india-10-day-delhi-agra-jaipur">打開完整計畫 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.routeCard} aria-label="印度金三角路線節點">
              <div className={styles.routeCardLabel}>10 DAYS / DEL ROUND TRIP</div>
              <div className={styles.routeList}>
                {['DEL · 德里 3 晚', 'AGC · 阿格拉 2 晚', 'JP · 齋浦爾 3 晚', 'DEL · 機場區 1 晚', 'DEL 出境'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}>
                    <span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{stop}</span>
                    {index < 4 && <span className={styles.routeLine} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className={styles.routeNote}>泰姬陵周五閉館；D9 回德里住宿，避免城際延誤直撞國際航班。</p>
            </div>
          </div>
        </section>

        <section className={`container ${styles.feature}`} aria-labelledby="bhutan-story-title">
          <div className={styles.featureTopline}>
            <span>不丹 / 旅行計畫</span>
            <span>10 日 / 9 晚</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="bhutan-story-title">帕羅、廷布與<br />普那卡山谷 10 日</Heading>
              <p>用西不丹經典環線串起山谷宗堡與多楚拉山口，另留一整天走虎穴寺；全程導遊與山路轉場均照實納入規劃。</p>
              <div className={styles.featureMeta}>
                <span>帕羅 5 晚</span>
                <span>廷布 2 晚</span>
                <span>普那卡 2 晚</span>
                <span>SDF 費用提示</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/bhutan-10-day-paro-thimphu-punakha">打開完整計畫 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.routeCard} aria-label="不丹十日路線節點">
              <div className={styles.routeCardLabel}>10 DAYS / PBH ROUND TRIP</div>
              <div className={styles.routeList}>
                {['PBH · 帕羅 2 晚', 'THIMPHU · 廷布 2 晚', 'PUNAKHA · 普那卡 2 晚', 'PARO · 回程與虎穴寺 3 晚', 'PBH · 離境'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}>
                    <span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{stop}</span>
                    {index < 4 && <span className={styles.routeLine} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className={styles.routeNote}>US$100／人／晚 SDF 按官方現行費率估算；全程須由持證當地導遊陪同。</p>
            </div>
          </div>
        </section>

        <section className={`container ${styles.feature}`} aria-labelledby="maldives-story-title">
          <div className={styles.featureTopline}>
            <span>馬爾地夫 / 旅行計畫</span>
            <span>10 日 / 9 晚</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="maldives-story-title">馬列、馬夫西與古麗<br />居民島慢旅 10 日</Heading>
              <p>以居民島旅宿和公共渡輪為主，串聯首都文化、馬夫西與古麗海岸；渡輪週五停航、海況取消和機場緩衝都列入行程，不把度假村或水上飛機當作預設。</p>
              <div className={styles.featureMeta}>
                <span>居民島住宿</span>
                <span>公共渡輪</span>
                <span>浮潛自選</span>
                <span>天候備案</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/maldives-10-day-male-maafushi-gulhi">打開完整計畫 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.routeCard} aria-label="馬爾地夫十日路線節點">
              <div className={styles.routeCardLabel}>10 DAYS / MLE ROUND TRIP</div>
              <div className={styles.routeList}>
                {['MLE · 胡魯馬列 1 晚', 'Maafushi · 馬夫西 5 晚', 'Gulhi · 古麗 2 晚', '胡魯馬列 · 緩衝 1 晚', 'MLE 出境'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}>
                    <span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{stop}</span>
                    {index < 4 && <span className={styles.routeLine} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className={styles.routeNote}>若週五停航或海況取消，古麗段改為馬夫西連住；D9 回機場側，避免外島渡輪直撞國際班機。</p>
            </div>
          </div>
        </section>

        <section className={`container ${styles.feature}`} aria-labelledby="bangladesh-story-title">
          <div className={styles.featureTopline}>
            <span>孟加拉 / 旅行計畫</span>
            <span>10 日 / 9 晚</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="bangladesh-story-title">達卡、錫爾赫特與<br />斯里曼加爾 10 日</Heading>
              <p>從老達卡與索納爾岡一路向東北，走入濕地、茶園與森林；按洪水、水位和道路狀況設安全備案，離境前回達卡住一晚。</p>
              <div className={styles.featureMeta}>
                <span>達卡 5 晚</span>
                <span>錫爾赫特 2 晚</span>
                <span>斯里曼加爾 2 晚</span>
                <span>白天鐵路轉場</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/bangladesh-10-day-dhaka-sylhet-sreemangal">打開完整計畫 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.routeCard} aria-label="孟加拉十日路線節點">
              <div className={styles.routeCardLabel}>10 DAYS / DAC ROUND TRIP</div>
              <div className={styles.routeList}>
                {['DAC · 達卡 4 晚', '索納爾岡一日往返', 'ZYL · 錫爾赫特 2 晚', '斯里曼加爾 2 晚', 'DAC · 離境緩衝 1 晚'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}>
                    <span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{stop}</span>
                    {index < 4 && <span className={styles.routeLine} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className={styles.routeNote}>拉塔古爾／傑夫隆依天氣、水位與道路條件二選一；D9 回達卡。</p>
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

        <section className={`container ${styles.feature}`} aria-labelledby="afghanistan-story-title">
          <div className={styles.featureTopline}>
            <span>阿富汗 / 条件式旅行预案</span>
            <span>10 日框架 · 暂缓出发</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="afghanistan-story-title">先确认安全警示<br />再谈阿富汗文化路线</Heading>
              <p>中国领事提醒暂勿前往，英国 FCDO 仍建议避免一切旅行。本篇保留喀布尔与巴米扬的未来文化路线框架，但明列签证、交通、保险与安全门槛；目前不是可预订行程。</p>
              <div className={styles.featureMeta}>
                <span>喀布尔</span><span>巴米扬世界遗产</span><span>交通闸门</span><span>暂缓预订</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/afghanistan-10-day-conditional-heritage">阅读条件与安全门槛 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.routeCard} aria-label="阿富汗条件式路线框架">
              <div className={styles.routeCardLabel}>TRAVEL ADVISORY FIRST</div>
              <div className={styles.routeList}>
                {['先查本国官方警示', '喀布尔 · 4 晚*', '巴米扬 · 4 晚*', '喀布尔 · 离境缓冲 1 晚', '所有转场未确认前不出发'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}>
                    <span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{stop}</span>
                    {index < 4 && <span className={styles.routeLine} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className={styles.routeNote}>*僅為警示、簽證、保險、景區准入與合規交通均獲重新確認後的假設性住宿分配；目前建議暫緩前往。</p>
            </div>
          </div>
        </section>

        <section className={`container ${styles.feature}`} aria-labelledby="iran-story-title">
          <div className={styles.featureTopline}>
            <span>伊朗 / 條件式旅行預案</span>
            <span>10 日框架 · 暫緩出發</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="iran-story-title">先等官方警示解除<br />再走波斯遺產路線</Heading>
              <p>中國外交部提醒暫勿前往，英國 FCDO 與澳洲 Smartraveller 仍有嚴重旅行警示。本篇整理德黑蘭、伊斯法罕、亞茲德與設拉子的未來文化路線，並將航班、簽證、保險和離境緩衝列為前置條件。</p>
              <div className={styles.featureMeta}>
                <span>波斯遺產</span><span>四城文化線</span><span>航空風險</span><span>暫緩預訂</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/iran-10-day-conditional-culture">閱讀條件與路線框架 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.routeCard} aria-label="伊朗條件式路線框架">
              <div className={styles.routeCardLabel}>TRAVEL ADVISORY FIRST</div>
              <div className={styles.routeList}>
                {['先查本國官方警示', '德黑蘭 · 3 晚', '伊斯法罕 · 2 晚', '亞茲德 · 2 晚', '設拉子 · 2 晚*'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}>
                    <span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{stop}</span>
                    {index < 4 && <span className={styles.routeLine} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className={styles.routeNote}>*國際航班若由德黑蘭出發，需另加回城緩衝日；目前警示未解除，不應按此表訂票。</p>
            </div>
          </div>
        </section>

        <section className={`container ${styles.feature}`} aria-labelledby="kazakhstan-story-title">
          <div className={styles.featureTopline}>
            <span>哈薩克 / 旅行計畫</span>
            <span>10 日 / 9 晚</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="kazakhstan-story-title">阿拉木圖山湖、恰倫峽谷<br />與阿斯塔納 10 日</Heading>
              <p>從天山山麓出發，在薩蒂村連住兩晚走恰倫、科爾賽與凱恩迪，再飛往阿斯塔納看新首都軸線；以實際道路、季節和機票銜接決定景點取捨。</p>
              <div className={styles.featureMeta}>
                <span>ALA 入 / NQZ 出</span>
                <span>山湖三日</span>
                <span>村落民宿</span>
                <span>天候備案</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/kazakhstan-10-day-almaty-saty-astana">打開完整計畫 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.routeCard} aria-label="哈薩克十日路線節點">
              <div className={styles.routeCardLabel}>10 DAYS / ALA → NQZ</div>
              <div className={styles.routeList}>
                {['阿拉木圖 · 3 晚', '恰倫峽谷', '薩蒂 · 2 晚', '阿拉木圖 · 1 晚', '阿斯塔納 · 3 晚'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}>
                    <span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{stop}</span>
                    {index < 4 && <span className={styles.routeLine} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className={styles.routeNote}>自然區以合規接送與當日道路公告為先；薩蒂往返不放在國際航班當天。</p>
            </div>
          </div>
        </section>

        <section className={`container ${styles.feature}`} aria-labelledby="kyrgyzstan-story-title">
          <div className={styles.featureTopline}>
            <span>吉爾吉斯 / 夏季旅行計畫</span>
            <span>10 日 / 9 晚</span>
          </div>
          <div className={styles.featureGrid}>
            <div>
              <Heading as="h2" id="kyrgyzstan-story-title">比什凱克、伊塞克湖<br />與松庫爾草原 10 日</Heading>
              <p>由布拉納塔絲路遺址往東到伊塞克湖，再循南岸分宿至松庫爾牧場；明列季節和山口條件，也特別說清中國普通護照個人旅行的簽證要求。</p>
              <div className={styles.featureMeta}>
                <span>比什凱克往返</span>
                <span>湖泊與峽谷</span>
                <span>高山氈房</span>
                <span>6–9 月季節線</span>
              </div>
              <Link className={styles.primaryLink} to="/explore/travel/kyrgyzstan-10-day-bishkek-issyk-kul-song-kol">打開完整計畫 <span aria-hidden="true">↗</span></Link>
            </div>
            <div className={styles.routeCard} aria-label="吉爾吉斯十日路線節點">
              <div className={styles.routeCardLabel}>10 DAYS / BSZ ROUND TRIP</div>
              <div className={styles.routeList}>
                {['比什凱克 · 2 晚', '布拉納塔', '喬爾蓬阿塔 · 1 晚', '卡拉科爾 · 2 晚', '博孔巴耶沃／科奇科爾 · 2 晚', '松庫爾 · 1 晚', '比什凱克緩衝 · 1 晚'].map((stop, index) => (
                  <div className={styles.routeItem} key={stop}>
                    <span className={styles.routeIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{stop}</span>
                    {index < 6 && <span className={styles.routeLine} aria-hidden="true" />}
                  </div>
                ))}
              </div>
              <p className={styles.routeNote}>松庫爾僅在道路與營地季節開放、司機確認可通行時安排；D9 留整天回城。</p>
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
