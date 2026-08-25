import {useEffect, useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const DATABASES = [
  {
    id: 'rings',
    mark: 'RING',
    eyebrow: 'SMART RINGS',
    title: '智能指環',
    description: '健康、睡眠、運動、NFC 支付、門禁與身份用途的全球型號資料庫。',
    focus: '按品牌、代際與證據等級整理，保留候選、歷史與 OEM 線索。',
    path: '/smart-rings/',
    data: '/smart-rings/data.json',
    accent: '#3f8f76',
  },
  {
    id: 'recorders',
    mark: 'REC',
    eyebrow: 'RECORDERS',
    title: '錄音卡片／AI 錄音設備',
    description: '卡片式錄音、穿戴式錄音、耳機與桌面 AI 會議錄音設備。',
    focus: '記錄收音結構、轉寫能力、儲存、訂閱、連接方式與在售狀態。',
    path: '/smart-recorders/',
    data: '/smart-recorders/data.json',
    accent: '#b47745',
  },
  {
    id: 'pendants',
    mark: 'PEND',
    eyebrow: 'PENDANTS',
    title: '智能掛墜／掛鏈',
    description: 'AI 記憶、情緒、女性健康、SOS、環境感知與 NFC 智能珠寶。',
    focus: '區分掛墜、掛鏈、配件與純飾品，保留服務與資料邊界。',
    path: '/smart-pendants/',
    data: '/smart-pendants/data.json',
    accent: '#9a659e',
  },
  {
    id: 'glasses',
    mark: 'AR',
    eyebrow: 'AI / AR GLASSES',
    title: '智能眼鏡／AR／AI 眼鏡',
    description: '相機、開放式音頻、顯示、翻譯、導航與企業 AR/XR 眼鏡。',
    focus: '區分消費級、開發者、企業與醫療用途，記錄芯片、顯示與續航。',
    path: '/smart-glasses/',
    data: '/smart-glasses/data.json',
    accent: '#5679ad',
  },
  {
    id: 'pets',
    mark: 'PET',
    eyebrow: 'PET TECH',
    title: '智能寵物項圈／吊牌',
    description: 'GPS、活動健康、訓練、防走失、QR／NFC 身份與寵物服務。',
    focus: '區分寵物專用設備、通用追蹤器、項圈與吊牌，標明訂閱與通信制式。',
    path: '/smart-pet-collars/',
    data: '/smart-pet-collars/data.json',
    accent: '#c46b62',
  },
  {
    id: 'watches',
    mark: 'WATCH',
    eyebrow: 'WATCH / FITNESS',
    title: '智能手表／运动手环',
    description: '智能手表、GPS运动表、运动手环与儿童手表。',
    focus: '覆盖健康、训练、定位、通信和儿童安全，按代际与形态区分。',
    path: '/smart-watches/',
    data: '/smart-watches/data.json',
    accent: '#3c78a8',
  },
  {
    id: 'audio',
    mark: 'AUDIO',
    eyebrow: 'TWS / AI AUDIO',
    title: 'TWS／AI／翻译耳机',
    description: 'TWS、AI耳机、翻译耳机、降噪耳机与骨传导耳机。',
    focus: '记录驱动单元、麦克风、ANC、编解码、AI服务和真实续航。',
    path: '/smart-audio/',
    data: '/smart-audio/data.json',
    accent: '#a05d73',
  },
  {
    id: 'gateways',
    mark: 'HUB',
    eyebrow: 'SMART HOME',
    title: '家庭中控／Matter网关',
    description: '家庭中控、Matter网关、协议桥接器与自动化中枢。',
    focus: '区分独立网关、音箱/屏内置中枢、路由器功能与开发者设备。',
    path: '/smart-home-gateways/',
    data: '/smart-home-gateways/data.json',
    accent: '#6b7c49',
  },
  {
    id: 'outdoor',
    mark: 'OUTDOOR',
    eyebrow: 'OUTDOOR / SPORTS',
    title: '户外GPS／骑行／潜水／智能头盔',
    description: 'GPS户外设备、卫星通信器、骑行码表、潜水电脑与智能头盔。',
    focus: '把户外安全、导航、训练、耐压防水和订阅服务分开记录。',
    path: '/outdoor-sports/',
    data: '/outdoor-sports/data.json',
    accent: '#b26d3e',
  },
  {
    id: 'security',
    mark: 'SEC',
    eyebrow: 'SMART SECURITY',
    title: '智能安防与门禁',
    description: '家庭摄像头、可视门铃、智能门锁、报警器、门窗传感器与智能对讲。',
    focus: '区分消费级、专业级、室内外与协议生态，记录状态和关键规格。',
    path: '/smart-security/',
    data: '/smart-security/data.json',
    accent: '#4d7c91',
  },
  {
    id: 'trackers',
    mark: 'TRACK',
    eyebrow: 'TRACKERS / SAFETY',
    title: '定位追踪与个人安全',
    description: '蓝牙标签、GPS追踪器、老人/儿童定位器与车辆追踪设备。',
    focus: '记录定位制式、覆盖范围、订阅、隐私与当前可得性。',
    path: '/smart-trackers/',
    data: '/smart-trackers/data.json',
    accent: '#5f779a',
  },
  {
    id: 'robots',
    mark: 'ROBOT',
    eyebrow: 'HOME ROBOTS',
    title: '家用机器人',
    description: '扫地、洗地、擦窗、割草与泳池机器人。',
    focus: '按清洁/庭院场景和独立型号整理，记录导航、基站、电池与服务。',
    path: '/home-robots/',
    data: '/home-robots/data.json',
    accent: '#6c8a60',
  },
  {
    id: 'imaging',
    mark: 'IMAGE',
    eyebrow: 'IMAGING / CREATOR',
    title: '影像与创作设备',
    description: '运动相机、360相机、云台相机、无人机、手持云台与直播影像设备。',
    focus: '记录传感器、镜头、稳定、编码、飞行/续航与配套软件。',
    path: '/imaging-creator/',
    data: '/imaging-creator/data.json',
    accent: '#a66d54',
  },
  {
    id: 'health',
    mark: 'HEALTH',
    eyebrow: 'SMART HEALTH',
    title: '健康与医疗智能设备',
    description: '体脂秤、血压、心电、睡眠、血糖、体温与康复设备。',
    focus: '区分家用健康管理与受监管医疗设备，保留监管和数据边界。',
    path: '/smart-health/',
    data: '/smart-health/data.json',
    accent: '#6f8c79',
  },
  {
    id: 'vr',
    mark: 'XR',
    eyebrow: 'VR / MR / GAMING',
    title: 'VR／MR与游戏硬件',
    description: 'VR/MR头显、空间计算设备、掌机、游戏控制器与体感/触觉设备。',
    focus: '记录显示、追踪、平台、芯片、连接、续航与生态依赖。',
    path: '/vr-gaming/',
    data: '/vr-gaming/data.json',
    accent: '#7566a1',
  },
  {
    id: 'network',
    mark: 'NET',
    eyebrow: 'NETWORK / CONNECTIVITY',
    title: '网络与移动通信',
    description: 'Wi‑Fi 7路由器、Mesh、5G CPE、移动热点、随身Wi‑Fi与NAS。',
    focus: '按路由、蜂窝接入、便携热点与存储设备区分协议和服务。',
    path: '/network-connectivity/',
    data: '/network-connectivity/data.json',
    accent: '#4e8291',
  },
  {
    id: 'power',
    mark: 'POWER',
    eyebrow: 'POWER / CHARGING',
    title: '电源、充电与便携能源',
    description: '移动电源、GaN充电器、无线充电、户外电源与太阳能充电设备。',
    focus: '记录容量、功率、接口、电芯、协议、安全与可得性。',
    path: '/power-charging/',
    data: '/power-charging/data.json',
    accent: '#a27848',
  },
  {
    id: 'paper',
    mark: 'PAPER',
    eyebrow: 'E-PAPER / OFFICE',
    title: '电子纸与数字办公',
    description: '电子纸平板、电子书、智能笔、数字纸、便携显示器与智能扫描设备。',
    focus: '记录屏幕、笔、存储、连接、格式支持与云服务。',
    path: '/digital-paper-office/',
    data: '/digital-paper-office/data.json',
    accent: '#8a765d',
  },
  {
    id: 'appliances',
    mark: 'HOME',
    eyebrow: 'APPLIANCES / ENVIRONMENT',
    title: '智能家电与环境设备',
    description: '空气净化器、除湿机、恒温器、智能插座、漏水传感器、天气站与能耗监测。',
    focus: '记录传感器、覆盖空间、协议、滤芯/耗材和订阅服务。',
    path: '/smart-appliances-environment/',
    data: '/smart-appliances-environment/data.json',
    accent: '#688d88',
  },
  {
    id: 'baby',
    mark: 'CARE',
    eyebrow: 'BABY / FAMILY CARE',
    title: '婴儿与家庭照护',
    description: '婴儿监视器、智能摇篮、婴儿秤、睡眠监测与家庭照护报警器。',
    focus: '区分监视、睡眠、体重和紧急照护用途，记录隐私与订阅。',
    path: '/baby-family-care/',
    data: '/baby-family-care/data.json',
    accent: '#b37779',
  },
  {
    id: 'auto',
    mark: 'AUTO',
    eyebrow: 'AUTOMOTIVE / MOBILITY',
    title: '汽车与出行电子',
    description: '行车记录仪、车载定位、OBD、胎压监测、ADAS配件与车载充电。',
    focus: '记录安装方式、车辆兼容、定位/影像、供电与数据服务。',
    path: '/automotive-mobility/',
    data: '/automotive-mobility/data.json',
    accent: '#66748c',
  },
  {
    id: 'office',
    mark: 'MEET',
    eyebrow: 'OFFICE / MEETING',
    title: '办公与会议硬件',
    description: '摄像头、会议麦克风、会议终端、标签打印、便携投影与智能录入设备。',
    focus: '记录收音/成像、会议平台、打印耗材、投影和企业服务。',
    path: '/office-meeting/',
    data: '/office-meeting/data.json',
    accent: '#657eaa',
  },
  {
    id: 'assistive',
    mark: 'ACCESS',
    eyebrow: 'ASSISTIVE / HEARING',
    title: '辅助与听力设备',
    description: '助听器、字幕设备、个人扩音器、无障碍提醒器与触觉提示设备。',
    focus: '区分医疗器械、消费级辅助设备和无障碍提醒，保留监管状态。',
    path: '/assistive-hearing/',
    data: '/assistive-hearing/data.json',
    accent: '#7a6c93',
  },
  {
    id: 'wearables',
    mark: 'WEAR',
    eyebrow: 'SMART WEARABLES',
    title: '智能服饰与运动装备',
    description: '智能鞋、智能服装、姿态设备、触觉手环与智能护具。',
    focus: '避开指环、手表、眼镜、耳机和户外GPS的重复型号，突出服饰与护具形态。',
    path: '/smart-wearables/',
    data: '/smart-wearables/data.json',
    accent: '#8a6b58',
  },
];

function DatabaseCard({database, stats}) {
  const summary = stats[database.id];

  return (
    <article className={styles.card} style={{'--database-accent': database.accent}}>
      <div className={styles.cardHeader}>
        <span className={styles.mark} aria-hidden="true">{database.mark}</span>
        <span className={styles.cardEyebrow}>{database.eyebrow}</span>
      </div>
      <a className={styles.cardTitle} href={database.path}>
        <Heading as="h2">{database.title}</Heading>
      </a>
      <p className={styles.description}>{database.description}</p>
      <p className={styles.focus}>{database.focus}</p>
      <div className={styles.cardStats} aria-label={`${database.title} 即時統計`}>
        <div>
          <strong>{summary ? summary.products : '—'}</strong>
          <span>已收錄</span>
        </div>
        <div>
          <strong>{summary ? summary.candidates : '—'}</strong>
          <span>候選／別名</span>
        </div>
        <div>
          <strong>{summary ? summary.sources : '—'}</strong>
          <span>來源組</span>
        </div>
      </div>
      <div className={styles.cardFooter}>
        <a className={styles.primaryLink} href={database.path}>
          進入清單 <span aria-hidden="true">↗</span>
        </a>
        <a className={styles.dataLink} href={database.data} target="_blank" rel="noopener noreferrer">
          JSON <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}

export default function DatabasesPage() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    let cancelled = false;

    Promise.all(DATABASES.map(async (database) => {
      try {
        const response = await fetch(database.data, {cache: 'no-store'});
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return [database.id, {
          products: data.products?.length ?? 0,
          candidates: data.candidates?.length ?? 0,
          sources: data.sources?.length ?? 0,
        }];
      } catch {
        return [database.id, null];
      }
    })).then((entries) => {
      if (!cancelled) setStats(Object.fromEntries(entries));
    });

    return () => { cancelled = true; };
  }, []);

  const loaded = DATABASES.filter((database) => stats[database.id]).length;
  const totalProducts = DATABASES.reduce((total, database) => total + (stats[database.id]?.products ?? 0), 0);

  return (
    <Layout
      title="全球智能硬件資料庫"
      description="智能硬件、消费电子与户外运动设备的全球上市数据库入口。">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <span className={styles.eyebrow}>RESEARCH / DATABASES</span>
            <div className={styles.heroGrid}>
              <div>
                <Heading as="h1">全球智能硬件資料庫。</Heading>
                <p className={styles.heroLead}>
                  把散落在全球的智能硬件，整理成一個可以直接查、直接比、持續更新的清單。
                </p>
              </div>
              <aside className={styles.heroAside} aria-label="資料庫概覽">
                <div className={styles.heroAsideTop}>
                  <span>LIVE INDEX</span>
                  <span className={styles.liveDot}>●</span>
                </div>
                <div className={styles.heroMetric}>
                  <strong>{loaded ? totalProducts : '—'}</strong>
                  <span>已收錄型號</span>
                </div>
                <p>二十四組資料各自更新，數字會跟著最新 JSON 自動變化。</p>
              </aside>
            </div>
          </div>
        </header>

        <section className={styles.catalog} aria-labelledby="database-catalog-title">
          <div className="container">
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>CHOOSE A DATASET</span>
                <Heading id="database-catalog-title" as="h2">想看哪一類？</Heading>
              </div>
              <p>進去就能搜尋、篩選；需要做自己的整理，也可以直接讀獨立 JSON。</p>
            </div>
            <div className={styles.grid}>
              {DATABASES.map((database) => (
                <DatabaseCard key={database.id} database={database} stats={stats} />
              ))}
            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
}
