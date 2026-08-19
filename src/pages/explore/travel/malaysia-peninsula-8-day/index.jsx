import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const routeStops = [
  {label: 'KUL', detail: '吉隆坡國際機場'},
  {label: '馬六甲', detail: '殖民要塞與華人古墓'},
  {label: '檳城', detail: '國慶、宗族街區與二戰要塞'},
  {label: '布央谷', detail: '4–11 世紀古吉打遺址'},
  {label: '太平', detail: '英聯邦戰爭公墓與雨樹'},
  {label: '怡保', detail: '錫礦城市與摩崖古刹'},
  {label: 'KL / KUL', detail: '博物館、清真寺與返程'},
];

const budgetInitial = {
  flight: 2050,
  transit: 320,
  stay: 330,
  tickets: 250,
  food: 336,
  local: 144,
};

const budgetLabels = {
  flight: '往返機票',
  transit: '城際大交通',
  stay: '住宿',
  tickets: '門票與纜車',
  food: '餐飲',
  local: '市內交通與通信',
};

const days = [
  {
    day: 1,
    date: '8 月 29 日（六）',
    route: '大灣區 → 吉隆坡 → 馬六甲',
    title: '先把古城的時間尺度拉開',
    focus: '大航海要塞、娘惹街屋、三寶山古墓群',
    blocks: [
      ['06:00–11:30', '從大灣區機場搭早班廉航直飛 KUL。入境後先完成交通卡、現金與網路補給。'],
      ['11:30–14:30', '在機場客運大廳購買前往 Melaka Sentral 的長途巴士票，車程約 2 小時。'],
      ['14:30–17:30', '從荷蘭紅屋、基督堂、A Famosa 城門與聖保羅堂開始，沿著葡萄牙、荷蘭與英國殖民留下的建築層疊讀城市。再走進峇峇娘惹祖屋，看清代閩南商館、天井、金漆木雕與維多利亞瓷磚。'],
      ['18:00–20:00', '在 Bukit Cina（三寶山）做一次低強度的夜間田野：明清墓碑、甲必丹家族與馬六甲華人抗日紀念碑，重點是辨識墓群如何成為城市記憶。'],
      ['20:30–21:30', '雞場街吃雞飯粒與白斬雞，最後用娘惹煎蕊收尾。'],
    ],
    stay: '馬六甲老城青旅，預算約 35 MYR。',
  },
  {
    day: 2,
    date: '8 月 30 日（日）',
    route: '馬六甲 → 檳城（夜巴）',
    title: '把海上貿易史交給一艘船',
    focus: '青雲亭、海事博物館、荷蘭街騎樓、夜間跨半島',
    blocks: [
      ['08:30–12:00', '走訪青雲亭，觀察華人寺廟如何同時承擔宗教、社群與地方調解功能；再到海事博物館登上 1:1 復原的 Flor de la Mar，理解香料、航線與武力如何一起塑造馬六甲。'],
      ['12:30–17:00', '漫步 Heeren Street 老騎樓，吃娘惹叻沙；把下午留給補眠、充電、防蚊與整理田野筆記。'],
      ['21:30–22:30', '前往 Melaka Sentral 候車，提前確認車次、座位與行李。'],
      ['22:30–06:00', '搭 KKKL 或 Mayang Sari 豪華夜巴北上檳城。2+1 寬座可以省下一晚住宿，但薄羽絨或抓絨外套一定要放在手邊。'],
    ],
    stay: '過夜巴士。',
  },
  {
    day: 3,
    date: '8 月 31 日（一）',
    route: '檳城國慶 → 極樂寺 → 升旗山 → 喬治市',
    title: '在一座港口城市裡看見多個移民網絡',
    focus: '州級國慶、極樂寺、升旗山、僑生大宅、老公墓與清真寺',
    blocks: [
      ['06:00–08:30', '巴士抵達後前往 Esplanade，觀看國慶活動與康華利斯堡方向的海防地景。國慶日活動時間每年不同，需於出發前重新核對。'],
      ['09:00–13:00', '極樂寺看中、泰、緬風格的萬佛寶塔與觀音像；再乘升旗山纜車，從高處看海峽、殖民避暑別墅與城市密度。'],
      ['14:30–18:00', '走訪檳城僑生博物館與 Old Protestant Cemetery，將華人商業網絡、英國殖民者與早期港口醫療史放在同一張地圖上。接著到吉寧甲必丹回教堂與打石街亞齊清真寺，看印度穆斯林與亞齊商人留下的城市節點。'],
      ['18:30–21:00', 'Line Clear 吃 Nasi Kandar，宵夜安排炭火鴨蛋炒粿條。'],
    ],
    stay: '喬治市老城青旅，預算約 35 MYR。',
  },
  {
    day: 4,
    date: '9 月 1 日（二）',
    route: '檳城南端 → 喬治市',
    title: '把戰爭遺址當成一個空間系統來讀',
    focus: '檳城二戰戰爭博物館、地下工事、壁畫與水上宗族',
    blocks: [
      ['08:30–13:30', '從光大搭公交前往 Penang War Museum。重點不是獵奇，而是讀懂山頂地下工事、彈藥庫、防毒氣室、刑訊空間與逃生通道如何互相連接。密林路段注意鞋底、飲水與驅蚊。'],
      ['15:00–18:30', '回到喬治市看街頭壁畫、姓周橋與邱公司祠堂。這一段用來觀察城市如何把商業、宗族與旅遊重新編排。'],
    ],
    stay: '喬治市青旅，預算約 35 MYR。',
  },
  {
    day: 5,
    date: '9 月 2 日（三）',
    route: '北海 → 布央谷 → 太平 → 怡保',
    title: '沿著鐵路把文明的年代往前推',
    focus: '布央谷考古遺址、太平戰爭公墓、怡保錫礦城市',
    blocks: [
      ['07:30–12:00', '從 Butterworth 乘 KTM 前往雙溪大年，再轉 Grab 到 Lembah Bujang Archaeological Museum。看 Candi Bukit Batu Pahat、紅磚神殿基座、古代煉鐵熔爐與海上貿易留下的地層。'],
      ['13:00–16:30', '乘 KTM 南下太平，探訪 Taiping War Cemetery，再走太平湖的百年雨樹古徑。公墓參觀保持安靜，不跨越墓區邊界。'],
      ['17:00–20:30', '前往怡保舊街場，走二奶巷與 Han Chin Pet Soo，理解錫礦、客家社群、俱樂部與城市財富的形成。晚餐安排芽菜雞、沙河粉、白咖啡與蛋撻。'],
    ],
    stay: '怡保老城青旅，預算約 35 MYR。',
  },
  {
    day: 6,
    date: '9 月 3 日（四）',
    route: '怡保 → 吉隆坡',
    title: '從摩崖字跡走到城市天際線',
    focus: '霹靂洞、凱利古堡、KTM ETS、KLCC',
    blocks: [
      ['08:30–13:00', '先到霹靂洞看天然喀斯特洞穴、摩崖書法與濕壁畫，再到 Kellie’s Castle 觀察未完工古堡、地下通道與殖民時期橡膠園主的想像。'],
      ['14:00–16:30', '搭 KTM ETS 南下 KL Sentral，車程約 2 小時。抵達後先辦理入住與設備充電。'],
      ['19:30–22:00', '在 KLCC 看雙子塔與噴泉夜景，晚餐吃 Roti Canai 與 Teh Tarik。'],
    ],
    stay: '吉隆坡唐人街青旅，預算約 35 MYR。',
  },
  {
    day: 7,
    date: '9 月 4 日（五）',
    route: '黑風洞 → 雲頂高原 → 皇家雪蘭莪',
    title: '把宗教、娛樂與工業史放在同一天',
    focus: '黑風洞、雲頂、清水岩廟、錫器工業史',
    blocks: [
      ['07:30–09:30', '乘 KTM 到 Batu Caves，登 272 級彩階進入石灰岩洞穴神殿。注意猴群、階梯濕滑與宗教空間禮儀。'],
      ['10:00–14:30', '前往 Awana 缆車站，半山經停清水岩廟，再登雲頂。若進入賭場，需符合當地年齡、證件與服裝要求；這裡更適合觀察一個山頂度假城如何運轉。'],
      ['15:30–18:00', '回到市區參觀 Royal Selangor Visitor Centre，從 1885 年錫礦與客家移民史理解吉隆坡早期工業。'],
      ['19:00–20:30', '晚餐安排肉骨茶與油條。'],
    ],
    stay: '吉隆坡青旅，預算約 35 MYR。',
  },
  {
    day: 8,
    date: '9 月 5 日（六）',
    route: '雙溪毛糯 → 國家館舍 → 廣東義山 → KUL',
    title: '用博物館和墓園替整條路線收束',
    focus: '希望之谷、國家博物館、伊斯蘭藝術館、國家清真寺、廣東義山',
    blocks: [
      ['07:30–10:00', 'MRT 前往 Sungai Buloh Settlement，希望之谷的舊隔離城與墓園適合用來理解殖民醫療、隔離政策與病患自建社群。'],
      ['10:30–14:00', '集中參觀 Muzium Negara、伊斯蘭藝術館與國家清真寺。這三站分別補上史前與古代王國、伊斯蘭藝術與現代國家建築的框架。進入清真寺時遵守服裝與脫鞋規範。'],
      ['14:30–17:30', '走占美清真寺、生命之河、獨立廣場與蘇丹阿都沙末大廈，再到 Kwong Tong Cemetery，找葉亞來墓、南僑機工紀念碑與日據死難者總墓。'],
      ['18:00–22:00', '回到 KL Sentral，乘機場巴士前往 KUL，搭晚班航班返程。保留至少 3 小時給跨城回機場與安檢。'],
    ],
    stay: '返程日。',
  },
];

const researchTable = [
  ['布央谷考古遺址', '吉打州·雙溪大年', '公元 4–11 世紀古吉打王國、紅磚神殿基座與煉鐵遺跡。'],
  ['三寶山古墓群', '馬六甲', '明清墓碑、甲必丹家族與華人移民社群的城市記憶。'],
  ['A Famosa / 聖保羅堂', '馬六甲聖保羅山', '葡萄牙海防要塞、荷蘭墓碑與大航海時代的權力轉移。'],
  ['檳城戰爭博物館', '檳城南端', '地下海防工事、彈藥庫、刑訊空間與戰俘歷史。'],
  ['Old Protestant Cemetery', '喬治市', '萊特船長、東印度公司官兵與殖民港口早期死亡史。'],
  ['太平戰爭公墓', '霹靂州·太平', '1941–1942 馬來亞戰役與英、澳、印、廓爾喀將士的戰爭記憶。'],
  ['Han Chin Pet Soo', '怡保舊街場', '1893 年客家錫礦俱樂部、移民社群與礦業財富。'],
  ['希望之谷隔離城', '吉隆坡雙溪毛糯', '殖民醫療、隔離政策、病患自建聚落與密林墓園。'],
  ['Kwong Tong Cemetery', '吉隆坡', '葉亞來墓、南僑機工紀念碑與華人開埠及抗戰史。'],
];

const architecture = [
  ['國家清真寺', '現代主義 18 角折紙傘藍頂，連接建國、英雄陵墓與公共宗教空間。'],
  ['伊斯蘭藝術館', '用古清真寺建築模型、手抄古蘭經與器物展陳補足東南亞伊斯蘭藝術脈絡。'],
  ['占美清真寺', '位於吉隆坡兩條河流匯流處，適合與生命之河、獨立廣場一起閱讀。'],
  ['吉寧甲必丹回教堂', '印度穆斯林商人與南洋港口貿易留下的宗教與社群節點。'],
];

const foodMap = [
  ['馬六甲', '雞飯粒、娘惹叻沙、娘惹煎蕊', '每餐約 8–18 MYR'],
  ['檳城', 'Nasi Kandar、鴨蛋炒粿條', '黑醬咖喱與炭火香氣'],
  ['怡保', '芽菜雞、沙河粉、白咖啡、蛋撻', '地下水與錫礦城市飲食'],
  ['吉隆坡', '肉骨茶、Roti Canai、Teh Tarik', '嘛嘛檔與南洋藥材湯底'],
];

const preparation = [
  ['MDAC 入境卡', '出發前 3 天內，使用馬來西亞移民局官方渠道填寫，保存 PDF 或條碼。'],
  ['夜巴與火車', '國慶長周末提前 1–2 週鎖定 KKKL / Mayang Sari 夜巴，以及 KTMB ETS / KTM 車票。'],
  ['導航與通信', '預先準備 Grab、Google Maps 離線地圖、本地 eSIM 與至少一張離線交通備份。'],
  ['空調與裝備', '夜巴、商場與博物館可能很冷；古墓、密林與戰爭遺址要準備驅蚊、長褲與防滑鞋。'],
  ['宗教禮儀', '清真寺脫鞋、服裝端正，借用長袍與頭巾後按規定歸還；不要把宗教空間當成背景板。'],
  ['回程餘量', '返程日不要把最後一班跨城交通排到極限，至少預留 3 小時給回機場、安檢與改道。'],
];

function currency(value) {
  return `¥${Math.round(value).toLocaleString('zh-CN')}`;
}

function BudgetEstimator() {
  const [values, setValues] = useState(budgetInitial);
  const total = useMemo(() => Object.values(values).reduce((sum, value) => sum + Number(value || 0), 0), [values]);
  const perDay = total / 8;

  function updateValue(key, event) {
    setValues((current) => ({...current, [key]: event.target.value}));
  }

  function applyPreset(type) {
    setValues(type === 'lean'
      ? {flight: 2050, transit: 320, stay: 330, tickets: 250, food: 336, local: 144}
      : {flight: 2050, transit: 430, stay: 720, tickets: 360, food: 560, local: 260});
  }

  return (
    <div className={styles.budgetWorkbench}>
      <div className={styles.workbenchHeader}>
        <div>
          <Heading as="h3">各項金額</Heading>
        </div>
        <div className={styles.presetGroup} aria-label="預算預設">
          <button type="button" onClick={() => applyPreset('lean')}>最低成本</button>
          <button type="button" onClick={() => applyPreset('balanced')}>預留餘量</button>
        </div>
      </div>
      <div className={styles.budgetGrid}>
        <div className={styles.budgetInputs}>
          {Object.entries(budgetLabels).map(([key, label]) => (
            <label key={key}>
              <span>{label}</span>
              <div className={styles.inputWithUnit}>
                <span>¥</span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={values[key]}
                  onChange={(event) => updateValue(key, event)}
                  aria-label={`${label}預估金額`}
                />
              </div>
            </label>
          ))}
        </div>
        <div className={styles.budgetResult} aria-live="polite">
          <span>8 天估算總額</span>
          <strong>{currency(total)}</strong>
          <div className={styles.budgetResultMeta}>
            <span>平均每天 {currency(perDay)}</span>
            <span>不含購物與突發醫療支出</span>
          </div>
        </div>
      </div>
      <p className={styles.workbenchNote}>金額以人民幣估算；機票、匯率、國慶長周末與景點政策，出發前再核對。</p>
    </div>
  );
}

function DayDetails({day}) {
  return (
    <article className={styles.dayCard} id={`day-${day.day}`}>
      <div className={styles.dayCardTop}>
        <span className={styles.dayNumber}>DAY {String(day.day).padStart(2, '0')}</span>
        <span>{day.date}</span>
      </div>
      <Heading as="h3">{day.title}</Heading>
      <div className={styles.dayMeta}>
        <span>{day.route}</span>
        <span>{day.focus}</span>
      </div>
      <div className={styles.dayBlocks}>
        {day.blocks.map(([time, description]) => (
          <div className={styles.dayBlock} key={time}>
            <span>{time}</span>
            <p>{description}</p>
          </div>
        ))}
      </div>
      <p className={styles.stay}><strong>住宿：</strong>{day.stay}</p>
    </article>
  );
}

export default function MalaysiaPeninsulaPage() {
  const [activeDay, setActiveDay] = useState(1);
  const active = days[activeDay - 1];

  return (
    <Layout
      title="馬來西亞西馬半島 8 天 7 晚"
      description="一份把西馬半島歷史考古、國家級地標、交通、預算與現場風險整理在一起的完整旅行規劃。"
      image="img/w0x7ce-social-card.png">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <div className={styles.breadcrumb}><Link to="/explore/travel">行旅誌</Link><span>/</span><span>01</span></div>
            <div className={styles.kicker}>MALAYSIA / PENINSULAR FIELD PLAN</div>
            <Heading as="h1">馬來西亞西馬半島<br />8 天 7 晚終極歷史考古與地標線。</Heading>
            <p className={styles.lead}>
              從馬六甲的殖民要塞與華人古墓，到檳城的國慶、二戰地下要塞與宗族街區，
              再沿北馬鐵路走進布央谷、太平、怡保，最後回到吉隆坡的博物館、清真寺與現代城市地標。
            </p>
            <div className={styles.metaRow}>
              <span>2026.08.29 — 2026.09.05</span>
              <span>8 天 / 7 晚</span>
              <span>歷史考古</span>
              <span>最低成本版</span>
            </div>
          </div>
        </header>

        <section className="container" aria-labelledby="route-title">
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>01 / ROUTE LOGIC</span>
            <Heading as="h2" id="route-title">先看路線，再看景點。</Heading>
            <p>逆時針走西馬半島，讓每一次長距離轉移都服務於下一段歷史敘事；夜巴只用來省房費，不用來炫耀辛苦。</p>
          </div>
          <div className={styles.routeRail}>
            {routeStops.map((stop, index) => (
              <React.Fragment key={stop.label}>
                <div className={styles.routeStop}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{stop.label}</strong>
                  <small>{stop.detail}</small>
                </div>
                {index < routeStops.length - 1 && <div className={styles.routeArrow} aria-hidden="true">→</div>}
              </React.Fragment>
            ))}
          </div>
          <div className={styles.callout}>
            <strong>最直白的版本：</strong>這是一條內容密度很高的「田野線」，每天都需要早起、走路、轉車與整理筆記；如果更在意慢遊，保留同一條主線、刪掉一個轉移點即可。
          </div>
        </section>

        <section className="container" aria-labelledby="budget-title">
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>02 / BUDGET</span>
            <Heading as="h2" id="budget-title">最低成本估算</Heading>
            <p>按往返機票約 ¥2,050 計算，8 天最低成本約為 ¥3,430；其他項目可直接替換成實際價格。</p>
          </div>
          <BudgetEstimator />
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>支出項目</th><th>人民幣基準</th><th>核算思路</th></tr></thead>
              <tbody>
                <tr><td>國際機票</td><td>約 ¥2,050</td><td>本方案按目前往返票價估算，隨航班、日期與行李規則浮動。</td></tr>
                <tr><td>城際大交通</td><td>約 ¥320</td><td>機場巴士、夜巴、KTM / ETS、纜車與少量 Grab。</td></tr>
                <tr><td>住宿</td><td>約 ¥330</td><td>夜巴省 1 晚，其餘 6 晚以青旅床位估算。</td></tr>
                <tr><td>門票與纜車</td><td>約 ¥250</td><td>升旗山、僑生博物館、戰爭博物館、凱利古堡與兩座國家館舍。</td></tr>
                <tr><td>餐飲</td><td>約 ¥336</td><td>茶餐室、嘛嘛檔、雞飯粒、肉骨茶與扁擔飯，按日均約 26 MYR。</td></tr>
                <tr><td>市內交通與通信</td><td>約 ¥144</td><td>本地 eSIM、RapidKL、短途公交與拼車。</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="container" aria-labelledby="itinerary-title">
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>03 / DAILY EXECUTION</span>
            <Heading as="h2" id="itinerary-title">每天怎麼走，現場看什麼。</Heading>
            <p>上面的快捷選擇會把焦點移到某一天；下面保留完整的 8 天明細，沒有 JavaScript 時也能直接閱讀。</p>
          </div>
          <div className={styles.daySelector} role="tablist" aria-label="選擇行程日">
            {days.map((day) => (
              <button
                key={day.day}
                type="button"
                role="tab"
                aria-selected={activeDay === day.day}
                className={activeDay === day.day ? styles.dayButtonActive : ''}
                onClick={() => setActiveDay(day.day)}>
                Day {day.day}
              </button>
            ))}
          </div>
          <div className={styles.activeDayPanel} aria-live="polite">
            <DayDetails day={active} />
          </div>
          <div className={styles.fullItinerary}>
            <Heading as="h3">完整行程明細</Heading>
            {days.map((day) => (
              <details key={day.day} open={day.day === 1}>
                <summary><span>Day {day.day}</span>{day.date} · {day.title}</summary>
                <DayDetails day={day} />
              </details>
            ))}
          </div>
        </section>

        <section className="container" aria-labelledby="research-title">
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>04 / FIELD NOTES</span>
            <Heading as="h2" id="research-title">歷史考古與公墓要點。</Heading>
            <p>這一欄是現場的觀察提示，不是把遺址變成「景點排行榜」。進入墓園、宗教場所與戰爭遺址時，優先尊重場地規則。</p>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>遺址 / 公墓</th><th>位置</th><th>考據重點</th></tr></thead>
              <tbody>{researchTable.map(([name, place, note]) => <tr key={name}><td>{name}</td><td>{place}</td><td>{note}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="container" aria-labelledby="food-title">
          <div className={styles.splitSection}>
            <div>
              <span className={styles.kicker}>05 / CITY TEXTURE</span>
              <Heading as="h2" id="food-title">伊斯蘭建築與平民餐桌。</Heading>
              <p>把國家級建築與一餐 8–18 MYR 的街頭食物放在同一天，才比較接近城市真正的質地。</p>
            </div>
            <div className={styles.infoList}>
              {architecture.map(([title, body]) => <article key={title}><strong>{title}</strong><p>{body}</p></article>)}
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>城市</th><th>建議食物</th><th>記錄角度</th></tr></thead>
              <tbody>{foodMap.map(([city, food, note]) => <tr key={city}><td>{city}</td><td>{food}</td><td>{note}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="container" aria-labelledby="preparation-title">
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>06 / BEFORE DEPARTURE</span>
            <Heading as="h2" id="preparation-title">行前準備與避坑。</Heading>
          </div>
          <div className={styles.preparationGrid}>
            {preparation.map(([title, body], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <Heading as="h3">{title}</Heading>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`container ${styles.lastSection}`} aria-labelledby="revision-title">
          <div className={styles.revisionCard}>
            <div>
              <span className={styles.kicker}>VERSION 01 / RECHECK BEFORE GO</span>
              <Heading as="h2" id="revision-title">這是一份可修正的計畫，不是不可更改的劇本。</Heading>
              <p>出發前重新核對航班、MDAC、景點開放時間、國慶活動、夜巴與火車班次、宗教場所規定、匯率、天氣與安全狀況。到了現場，如果等待時間或體力不允許，優先保留主線：馬六甲 → 檳城 → 布央谷 / 太平 / 怡保 → 吉隆坡。</p>
            </div>
            <Link className={styles.backLink} to="/explore/travel">回到行旅誌 <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
