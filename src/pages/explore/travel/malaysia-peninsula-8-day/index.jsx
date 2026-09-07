import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const routeStops = [
  {label: 'KUL', detail: '吉隆坡國際機場', query: 'Kuala Lumpur International Airport, Sepang, Malaysia'},
  {label: '馬六甲', detail: '殖民要塞與華人古墓', query: 'Dutch Square Melaka, Malaysia'},
  {label: '檳城', detail: '港口史、博物館與二戰要塞', query: 'George Town, Penang, Malaysia'},
  {label: '布央谷', detail: '4–11 世紀古吉打遺址', query: 'Lembah Bujang Archaeological Museum, Kedah, Malaysia'},
  {label: '太平', detail: '霹靂博物館與北部鐵路轉乘', query: 'Perak Museum, Taiping, Perak, Malaysia'},
  {label: '怡保', detail: '錫礦城市與摩崖古刹', query: 'Ipoh, Perak, Malaysia'},
  {label: 'KL / KUL', detail: '黑風洞、義山、國家館舍與返程', query: 'Kuala Lumpur International Airport, Sepang, Malaysia'},
];

const overallRouteStops = routeStops.map((stop) => stop.query);

const budgetInitial = {
  flight: 1200,
  transit: 330,
  stay: 385,
  tickets: 340,
  food: 378,
  local: 200,
};

const budgetLabels = {
  flight: '往返機票',
  transit: '城際大交通',
  stay: '住宿',
  tickets: '門票與館舍',
  food: '餐飲',
  local: '市內交通與通信',
};

const days = [
  {
    day: 1,
    date: '8 月 29 日（六）',
    route: 'KUL → 馬六甲',
    title: '先把古城的時間尺度拉開',
    focus: '大航海要塞、娘惹街屋、三寶山古墓群',
    mapStops: [
      {label: 'KUL', query: 'Kuala Lumpur International Airport, Sepang, Malaysia'},
      {label: 'Melaka Sentral', query: 'Melaka Sentral, Melaka, Malaysia'},
      {label: '荷蘭紅屋', query: 'Dutch Square Melaka, Malaysia'},
      {label: '聖保羅堂', query: "St. Paul's Church Melaka, Malaysia"},
      {label: '峇峇娘惹祖屋', query: 'Baba & Nyonya Heritage Museum Melaka, Malaysia'},
      {label: '三寶山', query: 'Bukit Cina Melaka, Malaysia'},
      {label: '雞場街', query: 'Jonker Street Night Market Melaka, Malaysia'},
    ],
    blocks: [
      ['08:00–10:30', '抵達 KUL 後完成入境、提取行李、交通卡、現金與網路補給。'],
      ['10:30–13:00', '從機場前往 Melaka Sentral，抵達後先寄放行李或辦理入住，再進老城。機場巴士以當日票務班次為準。'],
      ['13:30–17:30', '從荷蘭紅屋、基督堂、A Famosa 城門與聖保羅堂開始，沿著葡萄牙、荷蘭與英國殖民留下的建築層疊讀城市；峇峇娘惹祖屋只在還有入場時段時加入。'],
      ['17:45–18:45', '在仍有日光時走 Bukit Cina（三寶山）。以墓群、甲必丹家族與華人城市記憶為重點；若抵達延遲或天候不好，直接略過，不在天黑後獨自深入。'],
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
    mapStops: [
      {label: '青雲亭', query: 'Cheng Hoon Teng Temple Melaka, Malaysia'},
      {label: '海事博物館', query: 'Maritime Museum Melaka, Malaysia'},
      {label: '荷蘭街', query: 'Heeren Street Melaka, Malaysia'},
      {label: 'Melaka Sentral', query: 'Melaka Sentral, Melaka, Malaysia'},
      {label: '檳城巴士總站', query: 'Sungai Nibong Bus Terminal, Penang, Malaysia'},
    ],
    blocks: [
      ['09:00–12:15', '先走青雲亭，再進海事博物館。海事館把葡萄牙、荷蘭、英國與日據時期放在同一條港口史線上；以官方當日開放時間為準。'],
      ['12:45–17:00', '漫步 Heeren Street 老騎樓，吃娘惹叻沙；下午補眠、充電、防蚊與整理筆記，準備夜巴。'],
      ['20:15–21:10', '回 Sleep Here 取行李，再以市巴或短程 Grab 到 Melaka Sentral，搭直達 Sungai Nibong／Penang Sentral 的夜巴。'],
      ['約 21:30–05:18', '搭直達夜巴北上檳城，翌日清晨抵達；全程約 7 小時，外套放手邊。'],
    ],
    stay: '過夜巴士。',
  },
  {
    day: 3,
    date: '8 月 31 日（一）',
    route: '檳城國慶 → 喬治市史跡核心',
    title: '把國慶日留給城市中心與戶外史跡',
    focus: '檳城紀念碑、康華利斯堡、老公墓、宗祠、港口街區',
    mapStops: [
      {label: 'Esplanade', query: 'Esplanade George Town Penang, Malaysia'},
      {label: '檳城紀念碑', query: 'Penang Cenotaph, George Town, Penang, Malaysia'},
      {label: '康華利斯堡', query: 'Fort Cornwallis, Penang, Malaysia'},
      {label: '老新教徒墓園', query: 'Old Protestant Cemetery Penang, Malaysia'},
      {label: '吉寧甲必丹回教堂', query: 'Kapitan Keling Mosque, Penang, Malaysia'},
      {label: '邱公司', query: 'Khoo Kongsi Penang, Malaysia'},
      {label: '姓周橋', query: 'Chew Jetty Penang, Malaysia'},
    ],
    blocks: [
      ['05:20–08:15', '夜巴抵達後在車站附近吃早餐、充電，天亮後到住宿寄放行李。'],
      ['08:30–11:00', '從 Esplanade、檳城紀念碑走到康華利斯堡。紀念碑把第一次世界大戰、第二次世界大戰、泰緬死亡鐵路與緊急狀態等記憶放在同一處城市節點；國慶日最適合以戶外史跡為主。'],
      ['11:15–13:00', '走 Old Protestant Cemetery 與吉寧甲必丹回教堂，將殖民港口、早期英人墓園與印度穆斯林商業社群放在同一個街區讀。'],
      ['14:30–17:30', '走邱公司、姓周橋與周邊街屋；檳城州立博物館安排在 Day 4。'],
      ['18:30–21:00', 'Line Clear 吃 Nasi Kandar，宵夜安排炭火鴨蛋炒粿條。'],
    ],
    stay: '喬治市老城青旅，預算約 35 MYR。',
  },
  {
    day: 4,
    date: '9 月 1 日（二）',
    route: '檳城南端 → 喬治市',
    title: '把戰爭遺址與州級收藏放在同一天',
    focus: '檳城二戰戰爭博物館、地下工事、檳城州立博物館',
    mapStops: [
      {label: '檳城戰爭博物館', query: 'Penang War Museum, Penang, Malaysia'},
      {label: '檳城州立博物館', query: 'Penang State Museum @ Farquhar, George Town, Penang, Malaysia'},
      {label: '亞美尼亞街', query: 'Armenian Street George Town Penang, Malaysia'},
    ],
    blocks: [
      ['09:00–12:30', '從喬治市前往 Penang War Museum，看山頂地下工事、彈藥庫、防毒氣室與戰時指揮空間；密林路段備水、長褲與驅蚊。'],
      ['12:30–15:15', '回到喬治市午餐與休息，再前往下午的館舍。'],
      ['15:15–17:00', '進檳城州立博物館 @ Farquhar。它在 2026 年 7 月重新開放，並於國慶假日後的星期二安排；把州史、海峽殖民地與戰時脈絡補齊。'],
      ['17:15–18:30', '若仍有精神，走亞美尼亞街或回住宿整理。明早是本行程最需要準時出發的轉移日。'],
    ],
    stay: '喬治市青旅，預算約 35 MYR。',
  },
  {
    day: 5,
    date: '9 月 2 日（三）',
    route: '喬治市 → 北海 → 雙溪大年 → 布央谷 → 太平',
    title: '用渡輪、KTM 與步行接上古吉打',
    focus: '布央谷考古遺址、半島北段鐵路、霹靂博物館',
    mapStops: [
      {label: '拉惹敦烏達碼頭', query: 'Raja Tun Uda Ferry Terminal, George Town, Penang, Malaysia'},
      {label: '北海碼頭／Penang Sentral', query: 'Sultan Abdul Halim Ferry Terminal, Butterworth, Penang, Malaysia'},
      {label: '雙溪大年交通樞紐', query: 'Sungai Petani Bus Terminal, Kedah, Malaysia'},
      {label: '布央谷遺址', query: 'Lembah Bujang Archaeological Museum, Kedah, Malaysia'},
      {label: 'Bukit Batu Pahat 遺址', query: 'Candi Bukit Batu Pahat Lembah Bujang, Kedah, Malaysia'},
      {label: '太平車站', query: 'Taiping Railway Station, Perak, Malaysia'},
    ],
    blocks: [
      ['06:25–07:00', '前往 Raja Tun Uda 碼頭，06:50 前進站，搭 07:00 首班渡輪。'],
      ['07:00–08:09', '07:00 渡輪至 Butterworth，07:35 接 KTM Komuter，08:09 抵達 Sungai Petani。'],
      ['08:09–10:00', '由車站前往巴士總站，吃早餐、補水，10:00 搭 K51 往 Merbok。'],
      ['10:00–13:30', '搭 K51 至 Merbok，步行或短程 Grab 到 Lembah Bujang Archaeological Museum 與 Candi Bukit Batu Pahat，看 3–12 世紀海上貿易、印度教與佛教遺存。'],
      ['13:30–15:30', '搭 K51 回 Sungai Petani，15:30 前回到車站。'],
      ['15:52–18:44', '15:52 KTM Komuter 從 Sungai Petani 到 Butterworth（16:26），17:40 再由 Butterworth 到 Taiping（18:44），抵達後入住太平市區。'],
    ],
    stay: '太平市區住宿；翌日清晨搭 ETS 進怡保。',
  },
  {
    day: 6,
    date: '9 月 3 日（四）',
    route: '太平 → 怡保 → Amanjaya → TBS → 吉隆坡',
    title: '把錫礦城市、洞寺與舊街場放在同一天',
    focus: '清晨 ETS、三寶洞、鏡湖、Han Chin Pet Soo、怡保舊街場、Amanjaya 巴士',
    mapStops: [
      {label: '太平車站', query: 'Taiping Railway Station, Perak, Malaysia'},
      {label: '三寶洞', query: 'Sam Poh Tong Temple, Ipoh, Perak, Malaysia'},
      {label: '鏡湖一號', query: 'Tasik Cermin 1 Mirror Lake, Ipoh, Perak, Malaysia'},
      {label: 'Han Chin Pet Soo', query: 'Han Chin Pet Soo, Ipoh, Malaysia'},
      {label: '何人可博物館', query: 'Ho Yan Hor Museum, Ipoh, Perak, Malaysia'},
      {label: '怡保戰爭紀念碑', query: 'Cenotaph War Memorial, Ipoh, Perak, Malaysia'},
      {label: '怡保舊街場', query: 'Ipoh Old Town, Perak, Malaysia'},
      {label: 'Amanjaya 巴士總站', query: 'Terminal Amanjaya Ipoh, Perak, Malaysia'},
      {label: 'TBS', query: 'Terminal Bersepadu Selatan Kuala Lumpur, Malaysia'},
    ],
    blocks: [
      ['06:11–06:56', '由 Taiping 搭 ETS 到 Ipoh，寄放行李、補水與吃早餐。'],
      ['08:30–11:30', '以短程 Grab 連接三寶洞與鏡湖一號；洞寺與石灰岩地景組成 Gunung Rapat 支線，完成後回怡保舊街場。'],
      ['11:30–13:40', '回舊街場午餐、整理照片與行李；13:40 前到 Han Chin Pet Soo 報到。'],
      ['14:00–15:00', '依已確認的預約進 Han Chin Pet Soo；以客家錫礦俱樂部、移民社群與礦業財富為主線。'],
      ['15:00–18:20', '走隔壁何人可博物館、怡保戰爭紀念碑、火車站、市政廳、Birch Memorial Clock Tower、二奶巷與舊街場。'],
      ['15:15 以後', '前往 Terminal Amanjaya，搭城際巴士至 TBS，車程約 3 小時多。'],
      ['傍晚', '抵達 TBS 後接軌道交通或短程 Grab 進市中心，入住 Central Market／Pasar Seni 一帶。'],
    ],
    stay: '吉隆坡市中心住宿；之後住在 KLCC／Bukit Bintang 一帶。',
  },
  {
    day: 7,
    date: '9 月 4 日（五）',
    route: '吉隆坡國家館舍與獨立廣場',
    title: '先走完國家、宗教與獨立儀式的城市核心',
    focus: '皇家警察博物館、敦阿都拉薩紀念園、伊斯蘭藝術博物館、國家清真寺、國家博物館、獨立廣場',
    mapStops: [
      {label: '皇家馬來西亞警察博物館', query: 'Royal Malaysia Police Museum Kuala Lumpur, Malaysia'},
      {label: '敦阿都拉薩紀念園', query: 'Tun Abdul Razak Memorial Kuala Lumpur, Malaysia'},
      {label: '伊斯蘭藝術博物館', query: 'Islamic Arts Museum Malaysia, Kuala Lumpur, Malaysia'},
      {label: '國家清真寺', query: 'National Mosque of Malaysia, Kuala Lumpur, Malaysia'},
      {label: '國家博物館', query: 'Muzium Negara Kuala Lumpur, Malaysia'},
      {label: '獨立廣場', query: 'Merdeka Square Kuala Lumpur, Malaysia'},
    ],
    blocks: [
      ['上午', '走皇家馬來西亞警察博物館與敦阿都拉薩紀念園：殖民警務、日據、緊急狀態與建國後的國家行政記憶。'],
      ['中午', '走伊斯蘭藝術博物館、國家清真寺與國家博物館；宗教開放區與服裝要求以現場安排為準。'],
      ['傍晚', '走獨立廣場、蘇丹阿都沙末大廈、占美清真寺與生命之河。'],
    ],
    stay: 'Central Market／Pasar Seni 一帶。',
  },
  {
    day: 8,
    date: '9 月 5 日（六）',
    route: '黑風洞 → 廣東義山 → KL Sentral → 青雲亭 → 雲頂高原 → Bukit Bintang／TRX',
    title: '黑風洞、廣東義山與雲頂高原',
    focus: '黑風洞、葉亞來墓與抗戰記憶、Grab、RWT Express、Awana SkyWay、青雲亭、雲頂高原',
    mapStops: [
      {label: '黑風洞', query: 'Batu Caves, Selangor, Malaysia'},
      {label: '廣東義山', query: 'Kwong Tong Cemetery Kuala Lumpur, Malaysia'},
      {label: 'KL Sentral', query: 'Kuala Lumpur Sentral, Malaysia'},
      {label: 'Awana SkyCentral', query: 'Awana SkyCentral Genting Highlands, Pahang, Malaysia'},
      {label: '青雲亭', query: 'Chin Swee Caves Temple Genting Highlands, Pahang, Malaysia'},
      {label: '雲頂高原', query: 'SkyAvenue Genting Highlands, Pahang, Malaysia'},
      {label: 'Bukit Bintang／TRX', query: 'The Exchange TRX Kuala Lumpur, Malaysia'},
    ],
    blocks: [
      ['06:50–07:20', '從住宿 Grab 到 Batu Caves；到站後帶水、雨具與手機。'],
      ['07:20–08:35', '走 Temple Cave 主洞與石灰岩地景。主洞免費、272 級階梯，08:35 前回 Batu Caves KTM 站。'],
      ['08:35–09:35', '從黑風洞 Grab 到廣東義山。'],
      ['約 09:35–10:40', '走廣東義山：葉亞來墓、南僑機工紀念碑及墓園中的華人開埠與抗戰記憶。墓園公開時段約為 08:30–16:00；只走既有步道與有標示的紀念點。'],
      ['約 10:40–11:20', 'Grab 回 KL Sentral Lower Ground，在 RWT Express 櫃檯購買上山巴士與 Awana SkyWay 票。'],
      ['約 12:00–14:00', '搭官方巴士至 GHPO／Awana，轉 Awana SkyWay 上山。'],
      ['14:00–16:45', '在青雲亭中途下車，再回高原站；午餐後走 SkyAvenue 與山頂步行區。'],
      ['16:45–19:30', '由 Awana／GHPO 搭 RWT Express 回 KL Sentral，再轉 MRT／步行至 Bukit Bintang／TRX。'],
    ],
    stay: 'Bukit Bintang／TRX 一帶，9 月 5 日入住、9 月 6 日退房；選可晚到、24 小時櫃檯的住宿。',
  },
  {
    day: 9,
    date: '9 月 6 日（日）',
    route: '國家銀行博物館 → KL Sentral → KUL T2',
    title: '金融與貨幣，然後搭機場巴士返程',
    focus: '國家銀行博物館與藝術館、Aerobus、AK116 16:35 航班',
    mapStops: [
      {label: '國家銀行博物館', query: 'Bank Negara Malaysia Museum and Art Gallery, Kuala Lumpur, Malaysia'},
      {label: 'KL Sentral', query: 'Kuala Lumpur Sentral, Malaysia'},
      {label: 'KUL T2', query: 'Kuala Lumpur International Airport Terminal 2, Sepang, Malaysia'},
    ],
    blocks: [
      ['上午', '參觀 Bank Negara Malaysia Museum and Art Gallery，以 Economics、Numismatics 與中央銀行制度展示為主；伊斯蘭金融展廳依當日開放展示。'],
      ['11:30–12:00', '由國家銀行一帶 Grab 到 KL Sentral。'],
      ['12:00', '搭 Aerobus 從 KL Sentral 直達 KLIA2，票價 15 MYR。'],
      ['約 13:00–16:35', '抵達 KUL T2 後完成值機、托運、安檢與登機。AK116 的登機口、行李規則與時間以 AirAsia App 當日頁面為準。'],
    ],
    stay: '返程日。',
  },
];

const researchTable = [
  ['布央谷考古遺址', '吉打州·雙溪大年', '公元 4–11 世紀古吉打王國、紅磚神殿基座與煉鐵遺跡。'],
  ['三寶山古墓群', '馬六甲', '明清墓碑、甲必丹家族與華人移民社群的城市記憶。'],
  ['Stadthuys / 海事博物館', '馬六甲老城', '葡萄牙、荷蘭、英國與日據時期的港口、行政與海事敘事。'],
  ['檳城紀念碑', '喬治市 Esplanade', '第一次與第二次世界大戰、泰緬死亡鐵路、緊急狀態等公共紀念。'],
  ['檳城戰爭博物館', '檳城南端', '山頂地下工事、彈藥庫、防毒氣室與戰時指揮空間。'],
  ['檳城州立博物館 @ Farquhar', '喬治市', '用州史收藏補上港口、殖民地與社會史的背景。'],
  ['霹靂博物館', '霹靂州·太平', '半島最早的博物館；用地方史、自然史與民族誌理解霹靂。'],
  ['Han Chin Pet Soo', '怡保舊街場', '1893 年客家錫礦俱樂部、移民社群與礦業財富。'],
  ['怡保戰爭紀念碑', '怡保車站廣場', '戶外紀念碑串起兩次世界大戰、泰緬死亡鐵路、緊急狀態與對抗時期；比市內零散墓點更適合短停。'],
  ['皇家馬來西亞警察博物館', '吉隆坡', '殖民警務、日據、緊急狀態與建國後治安史的入口。'],
  ['國家博物館 / 獨立廣場', '吉隆坡', '國家史敘事、殖民行政建築與 1957 年獨立儀式空間。'],
  ['黑風洞 / 青雲亭', '雪蘭莪／彭亨', '石灰岩聖地與高原華人宗教空間，以 KTM、官方巴士與纜車接成一條北線。'],
  ['Cheras War Cemetery', '吉隆坡 Cheras', '二戰軍人墓區；與廣東義山、南僑機工紀念共同構成吉隆坡的戰爭與華人社群記憶線。'],
  ['國家銀行博物館', '吉隆坡', '貨幣、中央銀行、經濟危機與金融制度。'],
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
  ['MDAC 入境卡', '出發前 3 天內使用馬來西亞移民局官方渠道填寫，保存 PDF 或條碼。'],
  ['城際交通', '夜巴、檳城渡輪、KTM／ETS、Terminal Amanjaya → TBS 巴士，以及 KL Sentral → KLIA2 Aerobus 串起全程。'],
  ['市內接駁', '布央谷 Merbok 段、怡保洞寺與鏡湖、黑風洞至廣東義山使用短程 Grab。'],
  ['館舍開放', '檳城州立博物館避開國慶假日，警察博物館避開星期一；其餘場館以當日官方公告為準。'],
  ['導航與通信', '準備 Grab、Google Maps 離線地圖、本地 eSIM 與離線交通備份。'],
  ['衣著與裝備', '夜巴、商場與博物館空調較冷；古墓、密林與戰爭遺址準備驅蚊、長褲與防滑鞋。'],
  ['宗教場所', '清真寺脫鞋、服裝端正；借用長袍與頭巾後按規定歸還。'],
  ['雲頂北線', '黑風洞、廣東義山、KL Sentral、RWT Express、Awana SkyWay、青雲亭與雲頂高原。'],
  ['返程接駁', 'AK116 於 9 月 6 日 16:35 自 KUL T2 起飛；12:00 由 KL Sentral 搭 Aerobus 直達 KLIA2，票價 15 MYR。'],
];

const warPriorityChoices = [
  {
    title: '戰爭遺址與公共紀念',
    body: '檳城戰爭博物館、檳城紀念碑與怡保戰爭紀念碑，從地下工事、港口城市到公共紀念串起馬來亞的戰時經驗。',
    tone: 'primary',
  },
  {
    title: '國家形成與華人社群',
    body: '吉隆坡的警察博物館、國家館舍、廣東義山與國家銀行博物館，連接獨立、建國、移民社群與金融制度。',
  },
];

const officialChecks = [
  {
    title: '檳城州立博物館',
    body: '2026 年 7 月重開；星期五與公眾假日閉館。',
    href: 'https://penangmuseum.gov.my/',
  },
  {
    title: '布央谷考古博物館',
    body: '由 Sungai Petani 往 Merbok；博物館距 Merbok 鎮外約 2.5 km。',
    href: 'https://www.jmm.gov.my/en/content/lembah-bujang-archaeological-museum',
  },
  {
    title: 'K51：雙溪大年 → 丹絨達外',
    body: '官方路線圖列出 10:00 往丹絨達外班；在 Merbok 下車後前往布央谷。',
    href: 'https://bas.my/route/K51.png',
  },
  {
    title: '檳城渡輪',
    body: 'George Town → Butterworth 首班為 07:00。',
    href: 'https://penangport.gov.my/en/services/service/ferry-services',
  },
  {
    title: 'KTM 與 ETS',
    body: '渡輪與列車均有固定班次；出發前核對當日異動。',
    href: 'https://www.ktmb.com.my/traintime.html',
  },
  {
    title: 'RWT Express／Awana SkyWay',
    body: 'KL Sentral Lower Ground 可接官方巴士，再轉 Awana SkyWay 上山。',
    href: 'https://www.rwgenting.com/en/getting-here/express-bus.html',
  },
  {
    title: 'Awana SkyWay',
    body: '纜車通常 07:00–23:00；同張票可在 Chin Swee Station 中途停靠。',
    href: 'https://www.rwgenting.com/en/getting-here/cable-car.html',
  },
  {
    title: '廣東義山',
    body: '公開規則列出 08:30–16:00；以有標示的紀念點和既有步道為主。',
    href: 'https://ktc.org.my/wp-content/uploads/2024/03/Cemetery-Rules-Regulations_The-Association-of-Kwong-Tong-Cemetery-Management-KL.pdf',
  },
  {
    title: 'Cheras War Cemetery',
    body: 'Cheras Christian Cemetery／Crematorium 每日 08:00–16:00；以地圖釘選前往戰爭墓區。',
    href: 'https://www.dbkl.gov.my/en/kesihatan-awam/tanah-perkuburan-dan-krematorium',
  },
  {
    title: '國家銀行博物館',
    body: '星期六、日 10:00–17:00，免費。',
    href: 'https://museum.bnm.gov.my/v2/',
  },
  {
    title: 'KL Sentral → KLIA2 Aerobus',
    body: '12:00 由 KL Sentral 前往 KLIA2，票價 15 MYR；車次與上車月台依票面及現場看板確認。',
    href: 'https://www.klia2.info/bus/bus-operators/aerobus/',
  },
];

function googleMapsSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function googleMapsDirectionsUrl(stops) {
  const [origin, ...remainingStops] = stops;
  const destination = remainingStops.at(-1);
  const waypoints = remainingStops.slice(0, -1);
  const params = new URLSearchParams({api: '1', origin, destination});

  if (waypoints.length) {
    params.set('waypoints', waypoints.join('|'));
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function currency(value) {
  return `¥${Math.round(value).toLocaleString('zh-CN')}`;
}

function BudgetEstimator() {
  const [values, setValues] = useState(budgetInitial);
  const total = useMemo(() => Object.values(values).reduce((sum, value) => sum + Number(value || 0), 0), [values]);
  const perDay = total / 9;

  function updateValue(key, event) {
    setValues((current) => ({...current, [key]: event.target.value}));
  }

  function applyPreset(type) {
    setValues(type === 'lean'
      ? {flight: 1200, transit: 280, stay: 385, tickets: 300, food: 378, local: 180}
      : {flight: 1200, transit: 450, stay: 840, tickets: 500, food: 630, local: 300});
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
          <span>9 日估算總額</span>
          <strong>{currency(total)}</strong>
          <div className={styles.budgetResultMeta}>
            <span>平均每天 {currency(perDay)}</span>
            <span>不含購物與突發醫療支出</span>
          </div>
        </div>
      </div>
      <p className={styles.workbenchNote}>金額以人民幣估算；機票、匯率、假期與景點政策會隨時間變動。</p>
    </div>
  );
}

function DayDetails({day}) {
  const dayMapUrl = googleMapsDirectionsUrl(day.mapStops.map((stop) => stop.query));

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
      <div className={styles.dayMap}>
        <div className={styles.dayMapHeader}>
          <div>
            <span>GOOGLE MAPS / DAY {String(day.day).padStart(2, '0')}</span>
            <strong>當日路線與主要地點</strong>
          </div>
          <a
            className={styles.mapRouteLink}
            href={dayMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`在 Google Maps 開啟 Day ${day.day} 全日路線`}>
            開啟全日路線 <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className={styles.mapStopList} aria-label={`Day ${day.day} 主要地點 Google Maps 連結`}>
          {day.mapStops.map((stop) => (
            <a
              key={stop.label}
              className={styles.mapStopLink}
              href={googleMapsSearchUrl(stop.query)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`在 Google Maps 查看${stop.label}`}>
              {stop.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
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
      title="馬來西亞西馬半島 9 日：博物館、歷史遺跡與二戰"
      description="2026 年 8 月 29 日至 9 月 6 日的馬來西亞西馬半島旅行記錄：馬六甲、檳城、布央谷、太平、怡保與吉隆坡，含城際交通、戰爭記憶與機場接駁。"
      image="img/w0x7ce-social-card.png">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <div className={styles.breadcrumb}><Link to="/explore/travel">行旅誌</Link><span>/</span><span>01</span></div>
            <div className={styles.kicker}>MALAYSIA / PENINSULAR</div>
            <Heading as="h1">馬來西亞西馬半島<br />9 日：博物館、歷史遺跡與二戰。</Heading>
            <p className={styles.lead}>
              從馬六甲的殖民要塞與港口史，到檳城的戰爭遺址、州立收藏與公共紀念，
              再走進布央谷、太平、怡保，最後以吉隆坡的國家館舍、墓園與金融史收束。
            </p>
            <div className={styles.metaRow}>
              <span>2026.08.29 — 2026.09.06</span>
              <span>9 日 / 8 晚</span>
              <span>博物館／歷史遺跡／二戰</span>
              <span>渡輪／鐵路／巴士</span>
            </div>
          </div>
        </header>

        <section className="container" aria-labelledby="route-title">
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>01 / ROUTE</span>
            <Heading as="h2" id="route-title">全程路線。</Heading>
            <p>KUL → 馬六甲 → 檳城 → 布央谷 → 太平 → 怡保 → 吉隆坡 → KUL。</p>
          </div>
          <div className={styles.routeRail}>
            {routeStops.map((stop, index) => (
              <React.Fragment key={stop.label}>
                <a
                  className={styles.routeStop}
                  href={googleMapsSearchUrl(stop.query)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`在 Google Maps 查看${stop.label}`}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{stop.label}</strong>
                  <small>{stop.detail}</small>
                </a>
                {index < routeStops.length - 1 && <div className={styles.routeArrow} aria-hidden="true">→</div>}
              </React.Fragment>
            ))}
          </div>
          <div className={styles.routeMapPanel}>
            <div>
              <span className={styles.kicker}>GOOGLE MAPS / WHOLE ROUTE</span>
              <Heading as="h3">全程城市順序</Heading>
              <p>從 KUL 出發，依序經馬六甲、檳城、布央谷、太平、怡保與吉隆坡後回到 KUL；每一天附完整路線與單點導航。</p>
            </div>
            <a
              className={styles.mapRouteLink}
              href={googleMapsDirectionsUrl(overallRouteStops)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="在 Google Maps 開啟全程行程路線">
              開啟全程路線 <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="container" aria-labelledby="war-priority-title">
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>02 / HISTORY</span>
            <Heading as="h2" id="war-priority-title">戰爭遺址與城市記憶。</Heading>
            <p>遺址、公共紀念、國家館舍與墓園共同串起古港口、殖民行政、戰時佔領、獨立與建國後的城市史。</p>
          </div>
          <div className={styles.decisionGrid}>
            {warPriorityChoices.map((choice) => (
              <article className={`${styles.decisionCard} ${choice.tone === 'primary' ? styles.decisionCardPrimary : ''}`} key={choice.title}>
                <Heading as="h3">{choice.title}</Heading>
                <p>{choice.body}</p>
                {choice.href && <a href={choice.href} target="_blank" rel="noopener noreferrer">{choice.linkLabel} <span aria-hidden="true">↗</span></a>}
              </article>
            ))}
          </div>
          <div className={styles.officialCheckGrid} aria-label="行程相關官方資訊連結">
            {officialChecks.map((check) => (
              <a key={check.title} href={check.href} target="_blank" rel="noopener noreferrer">
                <strong>{check.title}</strong>
                <span>{check.body}</span>
                <small>官方資訊 ↗</small>
              </a>
            ))}
          </div>
        </section>

        <section className="container" aria-labelledby="budget-title">
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>03 / BUDGET</span>
            <Heading as="h2" id="budget-title">費用框架</Heading>
            <p>以往返機票、夜巴、渡輪、KTM／ETS、公共接駁與館舍計算；下方可按金額調整。</p>
          </div>
          <BudgetEstimator />
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>支出項目</th><th>人民幣基準</th><th>核算思路</th></tr></thead>
              <tbody>
                <tr><td>國際機票</td><td>約 ¥1,200</td><td>以往返票價估算，隨航班、日期與行李規則浮動。</td></tr>
                <tr><td>城際大交通</td><td>約 ¥330</td><td>機場巴士、夜巴、檳城渡輪、KTM / ETS 與 Merbok 接駁；不含全日包車。</td></tr>
                <tr><td>住宿</td><td>約 ¥385</td><td>夜巴省 1 晚，其餘 7 晚以青旅床位估算。</td></tr>
                <tr><td>門票與館舍</td><td>約 ¥340</td><td>檳城戰爭博物館、州立與國家館舍、Han Chin Pet Soo 等；依外籍票價與臨時展調整。</td></tr>
                <tr><td>餐飲</td><td>約 ¥378</td><td>茶餐室、嘛嘛檔、雞飯粒、肉骨茶與扁擔飯，按 9 日估算。</td></tr>
                <tr><td>市內交通與通信</td><td>約 ¥200</td><td>本地 eSIM、RapidKL、短途公交與市內 Grab，按 9 日估算。</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="container" aria-labelledby="itinerary-title">
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>04 / DAILY ROUTE</span>
            <Heading as="h2" id="itinerary-title">9 日行程。</Heading>
            <p>每日包含時間、交通、主要地點、住宿與 Google Maps 路線。</p>
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
            <span className={styles.kicker}>05 / PLACES</span>
            <Heading as="h2" id="research-title">博物館、遺址與戰時記憶。</Heading>
            <p>把每一站放回它原本的時間與空間：古港口、殖民行政、戰時佔領、墓園紀念與建國後的國家館舍。進入墓園、宗教場所與戰爭遺址時，優先尊重場地規則。</p>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>館舍 / 遺址 / 公墓</th><th>位置</th><th>考據重點</th></tr></thead>
              <tbody>{researchTable.map(([name, place, note]) => <tr key={name}><td>{name}</td><td>{place}</td><td>{note}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="container" aria-labelledby="food-title">
          <div className={styles.splitSection}>
            <div>
              <span className={styles.kicker}>06 / CITY TEXTURE</span>
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
            <span className={styles.kicker}>07 / PRACTICAL NOTES</span>
            <Heading as="h2" id="preparation-title">交通與出行資訊。</Heading>
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

        <section className={`container ${styles.lastSection}`} aria-labelledby="trip-summary-title">
          <div className={styles.revisionCard}>
            <div>
              <span className={styles.kicker}>TRIP SUMMARY</span>
              <Heading as="h2" id="trip-summary-title">馬來西亞西馬半島 9 日。</Heading>
              <p>馬六甲、檳城、布央谷、太平、怡保與吉隆坡；返程由 KL Sentral 搭 Aerobus 至 KLIA2。</p>
            </div>
            <Link className={styles.backLink} to="/explore/travel">回到行旅誌 <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
