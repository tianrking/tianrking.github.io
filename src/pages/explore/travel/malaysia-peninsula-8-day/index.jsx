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
  {label: '馬當', detail: 'Kota Ngah Ibrahim 與日軍佔領史', query: 'Matang Museum Perak, Malaysia'},
  {label: '太平', detail: '戰爭公墓與半島最早的博物館', query: 'Taiping War Cemetery, Perak, Malaysia'},
  {label: '怡保', detail: '錫礦城市與摩崖古刹', query: 'Ipoh, Perak, Malaysia'},
  {label: 'KL / KUL', detail: '國家館舍、戰時記憶與返程', query: 'Kuala Lumpur International Airport, Sepang, Malaysia'},
];

const overallRouteStops = routeStops.map((stop) => stop.query);

const budgetInitial = {
  flight: 1200,
  transit: 500,
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
      ['08:00–10:30', '抵達 KUL 後完成入境、提取行李、交通卡、現金與網路補給；第一天不把入境與轉車當成可忽略的空白。'],
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
      ['12:45–17:00', '漫步 Heeren Street 老騎樓，吃娘惹叻沙；下午留給補眠、充電、防蚊與整理筆記，夜巴前不要再硬塞一座遠館。'],
      ['21:30–22:30', '前往 Melaka Sentral 候車，提前確認車次、座位與行李。'],
      ['22:30–06:00', '搭 KKKL 或 Mayang Sari 豪華夜巴北上檳城。2+1 寬座可以省下一晚住宿，但薄羽絨或抓絨外套一定要放在手邊。'],
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
      ['06:30–08:15', '夜巴抵達後先寄放行李、吃早餐。國慶日的州級活動、封路與人流每年不同，現場不追逐流程，先保留體力。'],
      ['08:30–11:00', '從 Esplanade、檳城紀念碑走到康華利斯堡。紀念碑把第一次世界大戰、第二次世界大戰、泰緬死亡鐵路與緊急狀態等記憶放在同一處城市節點；國慶日最適合以戶外史跡為主。'],
      ['11:15–13:00', '走 Old Protestant Cemetery 與吉寧甲必丹回教堂，將殖民港口、早期英人墓園與印度穆斯林商業社群放在同一個街區讀。'],
      ['14:30–17:30', '邱公司、姓周橋與周邊街屋擇二深入，不把每個展館都當成打卡。檳城州立博物館在國慶假日不排入這天，留到 Day 4。'],
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
      ['09:00–12:30', '從喬治市前往 Penang War Museum。以山頂地下工事、彈藥庫、防毒氣室與戰時指揮空間的關係為重點，不把刑訊史當成獵奇素材；密林路段備水、長褲與驅蚊。'],
      ['12:30–15:15', '回到喬治市、午餐與緩衝。這一段不能壓縮：島南回市區的交通會直接決定下午是否趕得上館舍。'],
      ['15:15–17:00', '進檳城州立博物館 @ Farquhar。它在 2026 年 7 月重新開放，並於國慶假日後的星期二安排；把州史、海峽殖民地與戰時脈絡補齊。'],
      ['17:15–18:30', '若仍有精神，走亞美尼亞街或回住宿整理。明早是本行程最需要準時出發的轉移日。'],
    ],
    stay: '喬治市青旅，預算約 35 MYR。',
  },
  {
    day: 5,
    date: '9 月 2 日（三）',
    route: '檳城 → 布央谷 → 馬當 → 太平',
    title: '從古吉打走進戰時馬來亞',
    focus: '布央谷考古遺址、Kota Ngah Ibrahim、太平戰爭公墓',
    mapStops: [
      {label: '檳城出發點', query: 'George Town, Penang, Malaysia'},
      {label: '布央谷遺址', query: 'Lembah Bujang Archaeological Museum, Kedah, Malaysia'},
      {label: 'Bukit Batu Pahat 遺址', query: 'Candi Bukit Batu Pahat Lembah Bujang, Kedah, Malaysia'},
      {label: '馬當博物館', query: 'Matang Museum Perak, Malaysia'},
      {label: '太平戰爭公墓', query: 'Taiping War Cemetery, Perak, Malaysia'},
      {label: '太平湖花園', query: 'Taiping Lake Gardens, Perak, Malaysia'},
    ],
    blocks: [
      ['06:30–09:00', '這天預訂全日包車或有明確報價的跨城司機，從檳城直達布央谷。若只靠公車與臨時 Grab，馬當與太平不應同日硬塞。'],
      ['09:00–11:00', '進 Lembah Bujang Archaeological Museum 與鄰近 Candi Bukit Batu Pahat。博物館展示吉打地區 3–12 世紀的海上貿易與印度教／佛教遺存；以當日開放安排為準。'],
      ['11:00–14:00', '包車往南至馬當，途中吃簡單午餐並保留塞車緩衝。這段移動本身就是把古港口、錫礦區與戰時路線連在一起。'],
      ['14:00–15:30', '參觀 Matang Museum（Kota Ngah Ibrahim）。它曾是錫礦行政空間，1942–1945 年間由日軍作為總部使用；比單一戰爭展館更能讀出權力如何接管既有建築。'],
      ['16:00–17:15', '到 Taiping War Cemetery，安靜走一圈後再回太平市區住宿。公墓是二戰核心站，不再為了趕怡保而壓縮。'],
    ],
    stay: '太平市區住宿，避免把布央谷、太平與怡保塞進同一晚。',
  },
  {
    day: 6,
    date: '9 月 3 日（四）',
    route: '太平 → 怡保 → 吉隆坡',
    title: '把太平與怡保拆開，才有博物館的時間',
    focus: '霹靂博物館、Han Chin Pet Soo、KTM ETS、KLCC',
    mapStops: [
      {label: '霹靂博物館', query: 'Perak Museum, Taiping, Perak, Malaysia'},
      {label: '太平車站', query: 'Taiping Railway Station, Perak, Malaysia'},
      {label: 'Han Chin Pet Soo', query: 'Han Chin Pet Soo, Ipoh, Malaysia'},
      {label: '怡保車站', query: 'Ipoh Railway Station, Perak, Malaysia'},
      {label: 'KL Sentral', query: 'Kuala Lumpur Sentral, Malaysia'},
      {label: '雙子塔 / KLCC', query: 'Petronas Twin Towers, Kuala Lumpur, Malaysia'},
    ],
    blocks: [
      ['09:00–10:45', '進 Perak Museum。它是半島最早的博物館，先用自然史、民族誌與地方史建立霹靂州的長時間框架。'],
      ['11:00–13:15', '太平前往怡保，吃午餐並移動到舊街場。以 KTM／巴士當日班次選擇，不預設某一班一定能接上。'],
      ['14:00–15:00', 'Han Chin Pet Soo 需要預約時段；若沒有預約，改走怡保舊街場與車站，不要現場碰運氣。'],
      ['15:45–18:30', '搭已預訂的 KTM ETS 南下 KL Sentral。抵達後辦入住、補給，晚上看 KLCC。'],
      ['19:30–22:00', '在 KLCC 看雙子塔與噴泉夜景，晚餐吃 Roti Canai 與 Teh Tarik。'],
    ],
    stay: '吉隆坡唐人街青旅，預算約 35 MYR。',
  },
  {
    day: 7,
    date: '9 月 4 日（五）',
    route: '吉隆坡博物館走廊',
    title: '把國家、貨幣與警務史放在同一天',
    focus: '皇家警察博物館、國家銀行博物館、伊斯蘭藝術博物館、國家清真寺',
    mapStops: [
      {label: '皇家馬來西亞警察博物館', query: 'Royal Malaysia Police Museum Kuala Lumpur, Malaysia'},
      {label: '伊斯蘭藝術博物館', query: 'Islamic Arts Museum Malaysia, Kuala Lumpur, Malaysia'},
      {label: '國家清真寺', query: 'National Mosque of Malaysia, Kuala Lumpur, Malaysia'},
      {label: '國家銀行博物館', query: 'Bank Negara Malaysia Museum and Art Gallery, Kuala Lumpur, Malaysia'},
    ],
    blocks: [
      ['09:00–11:00', '先進皇家馬來西亞警察博物館。以殖民警務、日據、緊急狀態與建國後的治安史為線索；星期一閉館，因此安排在星期五。'],
      ['11:15–13:30', '進伊斯蘭藝術博物館，重點看建築模型、書寫與跨區域收藏。它與警察博物館、國家清真寺相鄰，先把同一街區走完。'],
      ['13:40–14:20', '看國家清真寺外觀與開放區域；遇祈禱時段或服裝限制，尊重現場安排，不硬闖。'],
      ['15:00–17:00', '再到 Bank Negara Malaysia Museum and Art Gallery。貨幣、金融制度與經濟危機不是「非歷史」，它們是國家如何運作的物證。'],
    ],
    stay: '吉隆坡青旅，預算約 35 MYR。',
  },
  {
    day: 8,
    date: '9 月 5 日（六）',
    route: '黑風洞 → 國家館舍 → 獨立廣場 → 廣東義山',
    title: '用地質、國家館舍與墓園替整條線收束',
    focus: '黑風洞、國家博物館、國家紡織博物館、獨立廣場、廣東義山',
    mapStops: [
      {label: '黑風洞', query: 'Batu Caves, Selangor, Malaysia'},
      {label: '國家博物館', query: 'Muzium Negara, Kuala Lumpur, Malaysia'},
      {label: '國家紡織博物館', query: 'National Textile Museum Kuala Lumpur, Malaysia'},
      {label: '占美清真寺', query: 'Masjid Jamek of Kuala Lumpur, Malaysia'},
      {label: '生命之河', query: 'River of Life Kuala Lumpur, Malaysia'},
      {label: '獨立廣場', query: 'Merdeka Square Kuala Lumpur, Malaysia'},
      {label: '蘇丹阿都沙末大廈', query: 'Sultan Abdul Samad Building Kuala Lumpur, Malaysia'},
      {label: '廣東義山', query: 'Kwong Tong Cemetery Kuala Lumpur, Malaysia'},
    ],
    blocks: [
      ['06:45–09:15', '把 Batu Caves 當作清晨的獨立模組：只走主洞與石灰岩地景，遇雨、身體疲勞或交通延誤就略過，直接前往國家博物館。'],
      ['10:15–12:00', '進 Muzium Negara。這裡把史前、早期馬來王國、殖民與日據時期、獨立後的馬來西亞放在同一條國家敘事中。'],
      ['12:15–13:15', '走國家紡織博物館。它與獨立廣場同區，適合作為一個短而完整的館舍，不需要為了「數量」停留過久。'],
      ['14:00–16:15', '走占美清真寺、生命之河、獨立廣場與蘇丹阿都沙末大廈，回看殖民行政、獨立儀式與今天的城市中心。'],
      ['16:30–18:00', '到 Kwong Tong Cemetery。只在開放、安全且有日光時進入；以華人開埠、南僑機工與日據死難記憶為主線，不在墓區逗留到天黑。'],
      ['18:00–20:30', '回到 KL Sentral，在市區吃晚餐並整理隔天返程所需的證件、行李與交通方案。'],
    ],
    stay: '吉隆坡青旅，預算約 35 MYR。',
  },
  {
    day: 9,
    date: '9 月 6 日（日）',
    route: '吉隆坡市區 → KUL T2 → 廣州',
    title: '把返程留出真正的餘量',
    focus: '早餐、退房、機場轉移、AK116 16:35 航班',
    mapStops: [
      {label: 'KL Sentral', query: 'Kuala Lumpur Sentral, Malaysia'},
      {label: 'KUL', query: 'Kuala Lumpur International Airport, Sepang, Malaysia'},
    ],
    blocks: [
      ['08:00–10:00', '在住宿附近吃早餐，整理最後的行李與文件。不要再安排需排隊的博物館或跨城景點。'],
      ['10:00–11:30', '退房；確認護照、AK116 登機資料、充電設備與可托運行李。'],
      ['12:00–12:30', '從 KL Sentral 搭 KLIA Transit 往 KUL T2。車程約 39 分鐘；如需托運，目標是 12:30 前離開 KL Sentral，而非壓到最後一班。'],
      ['13:15–16:35', '在 KUL 完成值機、托運、安檢與登機。航班資訊以 AirAsia App 的當日頁面為準。'],
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
  ['檳城州立博物館 @ Farquhar', '喬治市', '用州史收藏補上港口、殖民地與社會史的背景；國慶假日不排入。'],
  ['馬當博物館 / Kota Ngah Ibrahim', '霹靂州·馬當', '錫礦行政空間，1942–1945 年由日軍作為總部使用。'],
  ['太平戰爭公墓', '霹靂州·太平', '馬來亞戰役與英、澳、印、廓爾喀將士的戰爭記憶。'],
  ['霹靂博物館', '霹靂州·太平', '半島最早的博物館；用地方史、自然史與民族誌理解霹靂。'],
  ['Han Chin Pet Soo', '怡保舊街場', '1893 年客家錫礦俱樂部、移民社群與礦業財富。'],
  ['皇家馬來西亞警察博物館', '吉隆坡', '殖民警務、日據、緊急狀態與建國後治安史的入口。'],
  ['國家博物館 / 紡織博物館', '吉隆坡', '國家史敘事與物質文化，接到獨立廣場的殖民行政建築群。'],
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
  ['先鎖四項', '8 月 30 日夜巴、9 月 2 日全日包車、Han Chin Pet Soo 時段、怡保至 KL 的 ETS；這四項決定路線是否成立。'],
  ['Day 5 包車', '布央谷、馬當、太平三點同日只適合已預訂的全日司機。公共交通版本應刪馬當或增加一晚，不要臨場硬接。'],
  ['閉館規則', '檳城州立博物館避開 8 月 31 日國慶假日；警察博物館避開星期一。其餘場館也要在出發前看官方當日公告。'],
  ['導航與通信', '預先準備 Grab、Google Maps 離線地圖、本地 eSIM 與至少一張離線交通備份。'],
  ['空調與裝備', '夜巴、商場與博物館可能很冷；古墓、密林與戰爭遺址要準備驅蚊、長褲與防滑鞋。'],
  ['宗教禮儀', '清真寺脫鞋、服裝端正，借用長袍與頭巾後按規定歸還；不要把宗教空間當成背景板。'],
  ['回程餘量', 'AK116 於 9 月 6 日 16:35 自 KUL T2 起飛；若有托運，目標是 12:30 前從 KL Sentral 出發。'],
];

const warPriorityChoices = [
  {
    title: '已納入：檳城 → 馬當 → 太平 → 吉隆坡',
    body: '保留檳城戰爭博物館、檳城紀念碑、馬當博物館的日軍佔領脈絡、太平戰爭公墓，以及吉隆坡的皇家警察博物館。這是本次的主方案。',
    tone: 'primary',
  },
  {
    title: '想再加陸軍博物館：替換 Day 7，不是硬疊',
    body: 'Port Dickson 的陸軍博物館適合二戰優先者，但需要一整天包車往返。用它替換 Day 7 的吉隆坡博物館走廊，再把警察博物館移到 Day 8；不要在黑風洞後再趕 Port Dickson。',
    href: 'https://www.mkn.gov.my/web/ms/2025/01/03/muzium-tentera-darat-port-dickson-kenakan-bayaran-masuk-mulai-1-januari/',
    linkLabel: '看陸軍博物館開放資訊',
  },
];

const officialChecks = [
  {
    title: '檳城州立博物館',
    body: '2026 年 7 月重開；星期五與公眾假日閉館，因此排在 9 月 1 日。',
    href: 'https://penangmuseum.gov.my/',
  },
  {
    title: '布央谷／馬當／霹靂館',
    body: '三座由馬來西亞博物館局維護；Day 5 的跨城密度仍以包車保證。',
    href: 'https://www.jmm.gov.my/en/content/lembah-bujang-archaeological-museum',
  },
  {
    title: 'KLIA Transit',
    body: 'KL Sentral 至 KUL T2 約 39 分鐘；返程以當日班表為準。',
    href: 'https://www.kliaekspres.com/products-fares/klia-transit/',
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
      ? {flight: 1200, transit: 460, stay: 385, tickets: 300, food: 378, local: 180}
      : {flight: 1200, transit: 650, stay: 840, tickets: 500, food: 630, local: 300});
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
      <p className={styles.workbenchNote}>金額以人民幣估算；機票、匯率、國慶長周末與景點政策，出發前再核對。</p>
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
      title="馬來西亞西馬半島 9 日博物館、歷史遺跡與二戰行程"
      description="以馬六甲、檳城、布央谷、馬當、太平、怡保與吉隆坡串起的 9 日博物館、歷史遺跡與二戰行程；含可執行交通、Google Maps 與閉館校正。"
      image="img/w0x7ce-social-card.png">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <div className={styles.breadcrumb}><Link to="/explore/travel">行旅誌</Link><span>/</span><span>01</span></div>
            <div className={styles.kicker}>MALAYSIA / PENINSULAR FIELD PLAN</div>
            <Heading as="h1">馬來西亞西馬半島<br />9 日博物館、歷史遺跡與二戰行程。</Heading>
            <p className={styles.lead}>
              從馬六甲的殖民要塞與港口史，到檳城的戰爭遺址、州立收藏與公共紀念，
              再走進布央谷、馬當、太平、怡保，最後以吉隆坡的國家館舍與戰時記憶收束。
            </p>
            <div className={styles.metaRow}>
              <span>2026.08.29 — 2026.09.06</span>
              <span>9 日 / 8 晚</span>
              <span>博物館／歷史遺跡／二戰</span>
              <span>可執行密度版</span>
            </div>
          </div>
        </header>

        <section className="container" aria-labelledby="route-title">
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>01 / ROUTE LOGIC</span>
            <Heading as="h2" id="route-title">先看路線，再看景點。</Heading>
            <p>保留逆時針主線，但不再把布央谷、太平與怡保硬塞進同一天；省下來的時間給真正值得停留的博物館與戰時遺址。</p>
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
              <p>從 KUL 出發，依序經馬六甲、檳城、布央谷、馬當、太平、怡保與吉隆坡後回到 KUL；用來看地理關係，跨城交通仍以每日連結與實際班次為準。</p>
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
          <div className={styles.callout}>
            <strong>本次修正：</strong>取消雲頂與凱利古堡，把時間換成檳城州立博物館、馬當博物館、霹靂博物館、皇家警察博物館、國家銀行博物館與國家紡織博物館；Day 5 用包車，才不會把二戰站點做成趕路。
          </div>
        </section>

        <section className="container" aria-labelledby="war-priority-title">
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>02 / WWII PRIORITY</span>
            <Heading as="h2" id="war-priority-title">二戰內容加滿，但不把路線塞爆。</Heading>
            <p>主方案已經把戰爭遺址、公共紀念、日軍佔領建築與國家層級的警務史串起來。Port Dickson 是額外的完整替換，不是假裝能順路多去一站。</p>
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
          <div className={styles.officialCheckGrid} aria-label="行程關鍵場館官方查核連結">
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
            <Heading as="h2" id="budget-title">歷史強化版預算</Heading>
            <p>按往返機票 ¥1,200、Day 5 包車與增加館舍計算，9 日基準約 ¥3,003；下面可直接替換成實際價格。</p>
          </div>
          <BudgetEstimator />
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>支出項目</th><th>人民幣基準</th><th>核算思路</th></tr></thead>
              <tbody>
                <tr><td>國際機票</td><td>約 ¥1,200</td><td>本方案按目前往返票價估算，隨航班、日期與行李規則浮動。</td></tr>
                <tr><td>城際大交通</td><td>約 ¥500</td><td>機場巴士、夜巴、KTM / ETS，以及 Day 5 跨城包車的基準。</td></tr>
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
            <span className={styles.kicker}>04 / DAILY EXECUTION</span>
            <Heading as="h2" id="itinerary-title">每天怎麼走，現場看什麼。</Heading>
            <p>上面的快捷選擇會把焦點移到某一天；下面保留完整的 9 日明細，沒有 JavaScript 時也能直接閱讀。</p>
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
            <span className={styles.kicker}>05 / FIELD NOTES</span>
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
            <span className={styles.kicker}>07 / BEFORE DEPARTURE</span>
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
              <span className={styles.kicker}>VERSION 02 / RECHECK BEFORE GO</span>
              <Heading as="h2" id="revision-title">先守住時間，再增加內容。</Heading>
              <p>出發前重新核對航班、MDAC、館舍開放、國慶活動、夜巴、ETS、Day 5 包車、宗教場所規定、天氣與安全狀況。現場若有延誤，優先保留馬六甲、檳城戰爭博物館、布央谷／馬當／太平與吉隆坡國家館舍；不要犧牲這些核心站點去補一個遠距離打卡。</p>
            </div>
            <Link className={styles.backLink} to="/explore/travel">回到行旅誌 <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
