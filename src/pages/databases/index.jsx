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
                <p>九組資料各自更新，數字會跟著最新 JSON 自動變化。</p>
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
