import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const routeStops = [
  {label: 'KUL', detail: '吉隆坡國際機場', query: 'Kuala Lumpur International Airport, Sepang, Malaysia'},
  {label: '馬六甲', detail: '殖民要塞與華人古墓', query: 'Dutch Square Melaka, Malaysia'},
  {label: '檳城', detail: '港口史、博物館與二戰要塞', query: 'George Town, Penang, Malaysia'},
  {label: '布央谷', detail: '古吉打海上貿易與寺廟遺址', query: 'Lembah Bujang Archaeological Museum, Kedah, Malaysia'},
  {label: '太平', detail: '霹靂博物館與北部鐵路轉乘', query: 'Perak Museum, Taiping, Perak, Malaysia'},
  {label: '怡保', detail: '錫礦城市與摩崖古刹', query: 'Ipoh, Perak, Malaysia'},
  {label: '吉隆坡', detail: '國家館舍、清真寺與金融史', query: 'Central Market Kuala Lumpur, Malaysia'},
  {label: 'KUL T2', detail: 'KL Sentral 機場巴士與返程', query: 'Kuala Lumpur International Airport Terminal 2, Sepang, Malaysia'},
];

const overallRouteStops = routeStops;

const budgetInitial = {
  flight: 1274,
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
    title: '馬六甲古城與三寶山',
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
      ['清晨', '抵達 KUL，入境後補充現金與上網方案，轉車前往馬六甲。'],
      ['10:30–13:00', '從機場前往 Melaka Sentral，抵達後先寄放行李或辦理入住，再進老城。機場巴士以當日票務班次為準。'],
      ['下午', '荷蘭紅屋、基督堂、A Famosa 城門、聖保羅堂與娘惹街屋：葡萄牙、荷蘭、英國殖民建築與海峽華人生活。'],
      ['傍晚', 'Bukit Cina（三寶山）：古墓、甲必丹家族與華人移民史，日落前離開墓區。'],
      ['20:30–21:30', '雞場街吃雞飯粒與白斬雞，最後用娘惹煎蕊收尾。'],
    ],
    stay: 'Sleep Here Hostel，馬六甲；8 月 29 日入住、30 日退房。',
  },
  {
    day: 2,
    date: '8 月 30 日（日）',
    route: '馬六甲 → 檳城（夜巴）',
    title: '海事博物館、青雲亭與檳城夜巴',
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
      ['夜間 → 翌晨', '由 Melaka Sentral 搭直達夜巴北上檳城，翌日清晨抵達。'],
    ],
    stay: '過夜巴士。',
  },
  {
    day: 3,
    date: '8 月 31 日（一）',
    route: '檳城國慶 → 喬治市史跡核心',
    title: '喬治市國慶、港口與宗族街區',
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
    stay: 'THE CENTURY HOSTEL（George Town）；8 月 31 日至 9 月 2 日，共 2 晚。',
  },
  {
    day: 4,
    date: '9 月 1 日（二）',
    route: '檳城南端 → 喬治市',
    title: '檳城戰爭博物館與州立收藏',
    focus: '檳城二戰戰爭博物館、地下工事、檳城州立博物館',
    mapStops: [
      {label: '檳城戰爭博物館', query: 'Penang War Museum, Penang, Malaysia'},
      {label: '檳城州立博物館', query: 'Penang State Museum @ Farquhar, George Town, Penang, Malaysia'},
      {label: '亞美尼亞街', query: 'Armenian Street George Town Penang, Malaysia'},
    ],
    blocks: [
      ['09:00–12:30', '從喬治市前往 Penang War Museum，看山頂地下工事、彈藥庫、防毒氣室與戰時指揮空間；密林路段備水、長褲與驅蚊。'],
      ['12:30–15:15', '回到喬治市午餐與休息，再前往下午的館舍。'],
      ['15:15–17:00', '檳城州立博物館 @ Farquhar：州史、海峽殖民地與社會史收藏；館方於 2026 年 7 月發布重開公告。'],
      ['17:15–18:30', '亞美尼亞街、老城晚餐，回住宿整理行李。'],
    ],
    stay: 'THE CENTURY HOSTEL（George Town）。',
  },
  {
    day: 5,
    date: '9 月 2 日（三）',
    route: '喬治市 → 北海 → 雙溪大年 → 布央谷 → 太平',
    title: '布央谷古寺遺址與太平霹靂博物館',
    focus: '布央谷考古遺址、半島北段鐵路、霹靂博物館',
    mapStops: [
      {label: '拉惹敦烏達碼頭', query: 'Raja Tun Uda Ferry Terminal, George Town, Penang, Malaysia'},
      {label: '北海碼頭／Penang Sentral', query: 'Sultan Abdul Halim Ferry Terminal, Butterworth, Penang, Malaysia'},
      {label: '雙溪大年站', query: 'KTM Sungai Petani, Kedah, Malaysia'},
      {label: '布央谷遺址', query: 'Lembah Bujang Archaeological Museum, Kedah, Malaysia'},
      {label: 'Bukit Batu Pahat 遺址', query: 'Candi Bukit Batu Pahat Lembah Bujang, Kedah, Malaysia'},
      {label: 'Candi Pendiat', query: 'Candi Pendiat Lembah Bujang, Kedah, Malaysia'},
      {label: '返回雙溪大年站', query: 'KTM Sungai Petani, Kedah, Malaysia'},
      {label: '北海站', query: 'Butterworth Railway Station, Penang, Malaysia'},
      {label: '太平車站', query: 'Taiping Railway Station, Perak, Malaysia'},
      {label: '霹靂博物館', query: 'Perak Museum, Taiping, Malaysia'},
    ],
    blocks: [
      ['清晨', '從喬治市搭渡輪至北海，轉 KTM 到 Sungai Petani（雙溪大年）。'],
      ['上午', '由雙溪大年前往布央谷考古博物館，步行看 Bukit Batu Pahat 與 Candi Pendiat 等寺廟基址。'],
      ['10:30 左右', 'Grab 返回 KTM Sungai Petani；10:53 購買雙溪大年至太平的成人單程票，MYR 8.10。'],
      ['午間', '乘 KTM 至 Butterworth（北海），在北海換乘太平方向列車。'],
      ['14:10 → 15 時多', '由北海出發，經 Kamunting 抵達 Taiping；在太平站下車。'],
      ['下午', '參觀霹靂博物館，之後在太平市區晚餐、住宿。'],
    ],
    stay: '太平市區住宿；翌日清晨搭 ETS 進怡保。',
  },
  {
    day: 6,
    date: '9 月 3 日（四）',
    route: '太平 → 怡保 → Amanjaya → TBS → 吉隆坡',
    title: '怡保洞寺、鏡湖、錫礦會館與舊街場',
    focus: '清晨 ETS、三寶洞、鏡湖、Han Chin Pet Soo、怡保舊街場、Amanjaya 巴士',
    mapStops: [
      {label: '太平車站', query: 'Taiping Railway Station, Perak, Malaysia'},
      {label: '三寶洞', query: 'Sam Poh Tong Temple, Ipoh, Perak, Malaysia'},
      {label: '鏡湖', query: 'Tasik Cermin Ipoh, Perak, Malaysia'},
      {label: '何人可博物館', query: 'Ho Yan Hor Museum, Ipoh, Perak, Malaysia'},
      {label: '怡保舊街場', query: 'Ipoh Old Town, Perak, Malaysia'},
      {label: '真閒別墅', query: 'Han Chin Pet Soo, Ipoh, Malaysia'},
      {label: '怡保火車站', query: 'Ipoh Railway Station, Perak, Malaysia'},
      {label: 'Amanjaya 巴士總站', query: 'Terminal Amanjaya Ipoh, Perak, Malaysia'},
      {label: 'TBS', query: 'Terminal Bersepadu Selatan Kuala Lumpur, Malaysia'},
    ],
    blocks: [
      ['清晨', '由 Taiping 搭 ETS 到 Ipoh，早餐後前往洞寺。'],
      ['08:30–10:30', 'Grab 連接三寶洞與鏡湖 Tasik Cermin，參觀 Gunung Rapat 的洞寺與石灰岩地景。'],
      ['10:30–13:40', '回舊街場，參觀何人可博物館，逛二奶巷與老街，午餐。'],
      ['14:00', '真閒別墅 Han Chin Pet Soo 英語導覽：客家錫礦俱樂部、移民社群與礦業財富。'],
      ['15 時多起', '結束老城行程後，從火車站一帶前往 Terminal Amanjaya，搭巴士到吉隆坡 TBS。'],
      ['傍晚', '抵達 TBS 後接軌道交通或短程 Grab 進市中心，入住 Central Market／Pasar Seni 一帶。'],
    ],
    stay: 'Central Market／Pasar Seni 一帶，連住 9 月 3 日、4 日兩晚。',
  },
  {
    day: 7,
    date: '9 月 4 日（五）',
    route: '吉隆坡國家館舍與獨立廣場',
    title: '國家館舍、獨立廣場與雙子塔',
    focus: '皇家警察博物館、敦阿都拉薩紀念園、伊斯蘭藝術博物館、國家清真寺、國家博物館、獨立廣場',
    mapStops: [
      {label: '皇家馬來西亞警察博物館', query: 'Royal Malaysia Police Museum Kuala Lumpur, Malaysia'},
      {label: '敦阿都拉薩紀念園', query: 'Tun Abdul Razak Memorial Kuala Lumpur, Malaysia'},
      {label: '國家紀念碑', query: 'National Monument Kuala Lumpur, Malaysia'},
      {label: '伊斯蘭藝術博物館', query: 'Islamic Arts Museum Malaysia, Kuala Lumpur, Malaysia'},
      {label: '國家清真寺', query: 'National Mosque of Malaysia, Kuala Lumpur, Malaysia'},
      {label: '國家博物館', query: 'Muzium Negara Kuala Lumpur, Malaysia'},
      {label: '獨立廣場', query: 'Merdeka Square Kuala Lumpur, Malaysia'},
      {label: '占美清真寺', query: 'Masjid Jamek Sultan Abdul Samad Kuala Lumpur, Malaysia'},
      {label: '生命之河', query: 'River of Life Kuala Lumpur, Malaysia'},
      {label: '雙子塔', query: 'Petronas Twin Towers Kuala Lumpur, Malaysia'},
    ],
    blocks: [
      ['上午', '皇家馬來西亞警察博物館、敦阿都拉薩紀念園與國家紀念碑。'],
      ['12:15–14:00 左右', '伊斯蘭藝術博物館，之後前往國家清真寺。'],
      ['下午至 16:30', '國家博物館：早期文明、馬來王國、殖民統治與獨立建國。'],
      ['傍晚', '獨立廣場、蘇丹阿都沙末大廈外觀，沿占美清真寺與生命之河步行。'],
      ['晚上', 'KLCC 雙子塔外觀及周邊夜景。'],
    ],
    stay: 'Central Market／Pasar Seni 一帶。',
  },
  {
    day: 8,
    date: '9 月 5 日（六）',
    route: '黑風洞 → 廣東義山 → 吉隆坡',
    title: '黑風洞、廣東義山與城市住宿',
    focus: '石灰岩洞寺、南僑機工紀念與華人社群史',
    mapStops: [
      {label: '黑風洞', query: 'Batu Caves, Selangor, Malaysia'},
      {label: '廣東義山', query: 'Kwong Tong Cemetery Kuala Lumpur, Malaysia'},
      {label: 'Quill Residences', query: 'Quill Residences Jalan Sultan Ismail Kuala Lumpur, Malaysia'},
    ],
    blocks: [
      ['08:00 左右', '黑風洞 Temple Cave 主洞與石灰岩地景，主洞階梯共 272 級。'],
      ['09:00 後', '由黑風洞直接 Grab 到 Kwong Tong Cemetery（廣東義山）。'],
      ['上午', '廣東義山墓園、葉亞來墓與南僑機工紀念，了解華人開埠與抗戰史。'],
      ['晚上', '回吉隆坡，入住 Jalan Sultan Ismail 的 Quill Residences。'],
    ],
    stay: 'Lila Suites Quill Residence，Quill Residences／Medan Tuanku；9 月 5 日入住、6 日退房。',
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
      ['上午至 11:30', '國家銀行博物館與藝術館：經濟、貨幣與中央銀行制度。'],
      ['11:30–12:00', '由國家銀行一帶 Grab 到 KL Sentral。'],
      ['12:00', '搭 Aerobus 從 KL Sentral 直達 KLIA2，票價 15 MYR。'],
      ['下午', 'KUL T2 機場辦理返程手續；AK116 吉隆坡至廣州，票面起飛時間 16:35。'],
    ],
    stay: '返程日。',
  },
];

const researchTable = [
  ['布央谷考古遺址', '吉打州·Merbok', '公元 3–12 世紀海上貿易與印度教、佛教傳播；館區保存寺廟基址與出土器物。'],
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
  ['黑風洞', '雪蘭莪', '石灰岩洞窟中的印度教聖地，主洞由 272 級階梯連接山腳。'],
  ['Cheras War Cemetery', '吉隆坡 Cheras', '戰爭墓園；與廣東義山、南僑機工紀念共同構成吉隆坡的戰爭與華人社群記憶線。', 'Cheras War Cemetery Kuala Lumpur, Malaysia'],
  ['國家銀行博物館', '吉隆坡', '貨幣、中央銀行、經濟危機與金融制度。'],
  ['Kwong Tong Cemetery', '吉隆坡', '葉亞來墓、南僑機工紀念碑與華人開埠及抗戰史。', 'Kwong Tong Cemetery Kuala Lumpur, Malaysia'],
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
  ['館舍開放', '檳城州立博物館留意周五及節假日公告，警察博物館避開星期一；其餘場館以當日官方公告為準。'],
  ['導航與通信', '準備 Grab、Google Maps 離線地圖、本地 eSIM 與離線交通備份。'],
  ['衣著與裝備', '夜巴、商場與博物館空調較冷；古墓、密林與戰爭遺址準備驅蚊、長褲與防滑鞋。'],
  ['宗教場所', '清真寺脫鞋、服裝端正；借用長袍與頭巾後按規定歸還。'],
  ['雲頂接駁資料', 'KL Sentral 的雲頂巴士至 Awana，再轉纜車；Chin Swee（清水岩廟）為中途站，山頂站為 SkyAvenue。往返車票與纜車營運時間分開確認。'],
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
    body: '09:00–17:00；周五及館方公告節假日閉館。2026 年 7 月發布重開公告。',
    href: 'https://penangmuseum.gov.my/bm/relaunch-farquhar/',
  },
  {
    title: '布央谷考古博物館',
    body: '位於 Merbok 的 Bukit Batu Pahat，距 Sungai Petani 約 23 km。',
    href: 'https://www.jmm.gov.my/en/museum/lembah-bujang-archaeological-museum',
  },
  {
    title: '檳城渡輪',
    body: 'George Town 的 Raja Tun Uda 碼頭連接 Butterworth／Penang Sentral。',
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
    body: 'Awana、Chin Swee 與 SkyAvenue 三站；查詢票種、營運及維護公告。',
    href: 'https://www.rwgenting.com/en/getting-here/cable-car.html',
  },
  {
    title: '廣東義山',
    body: '公開規則列出 08:30–16:00；以有標示的紀念點和既有步道為主。',
    href: 'https://ktc.org.my/wp-content/uploads/2024/03/Cemetery-Rules-Regulations_The-Association-of-Kwong-Tong-Cemetery-Management-KL.pdf',
  },
  {
    title: 'Cheras War Cemetery',
    body: 'DBKL 公布 Cheras 基督教墓園服務時段為每日 08:00–16:00；戰爭墓區參訪依現場管理。',
    href: 'https://www.dbkl.gov.my/en/kesihatan-awam/tanah-perkuburan-dan-krematorium',
  },
  {
    title: '國家銀行博物館',
    body: '周二至周日 10:00–17:00，16:30 最後入場，免費；部分展廳暫停開放，出發前查看公告。',
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

function MapRouteLinks({stops, label}) {
  const segments = [];
  // Mobile Maps URLs support up to three waypoints. Repeat each segment's
  // destination as the next origin so every stop remains in sequence.
  for (let start = 0; start < stops.length - 1; start += 4) {
    segments.push(stops.slice(start, start + 5));
  }

  return (
    <div className={styles.mapRouteLinks}>
      {segments.map((segment, index) => (
        <a
          key={`${label}-${index}`}
          className={styles.mapRouteLink}
          href={googleMapsDirectionsUrl(segment.map((stop) => stop.query))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label}：${segment[0].label}至${segment.at(-1).label}`}>
          {segments.length === 1 ? '開啟路線' : `第 ${index + 1} 段：${segment[0].label} → ${segment.at(-1).label}`}
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
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
      ? budgetInitial
      : {flight: 1274, transit: 450, stay: 840, tickets: 500, food: 630, local: 300});
  }

  return (
    <div className={styles.budgetWorkbench}>
      <div className={styles.workbenchHeader}>
        <div>
          <Heading as="h3">各項金額</Heading>
        </div>
        <div className={styles.presetGroup} aria-label="預算預設">
          <button type="button" onClick={() => applyPreset('lean')}>經濟預算</button>
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
                  step="1"
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
      <p className={styles.workbenchNote}>人民幣計價。往返機票為訂單金額 ¥1,274；其他項目為可調整的旅行預算，非支出結算。</p>
    </div>
  );
}

function DayDetails({day, idPrefix = 'day'}) {
  return (
    <article className={styles.dayCard} id={`${idPrefix}-${day.day}`}>
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
          <MapRouteLinks stops={day.mapStops} label={`Day ${day.day} 路線`} />
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
            <nav className={styles.pageNav} aria-label="行程章節">
              <a href="#itinerary-title">每日行程</a>
              <a href="#research-title">館舍與墓園</a>
              <a href="#budget-title">費用</a>
              <a href="#preparation-title">交通資料</a>
            </nav>
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
              <p>地圖分段排列沿途地點；鐵路、渡輪與巴士換乘見每日交通，不能按全程駕車導航替代。</p>
            </div>
            <MapRouteLinks stops={overallRouteStops} label="全程路線" />
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
          <div className={styles.officialCheckGrid} aria-label="館舍與交通參考連結">
            {officialChecks.map((check) => (
              <a key={check.title} href={check.href} target="_blank" rel="noopener noreferrer">
                <strong>{check.title}</strong>
                <span>{check.body}</span>
                <small>查看資料 ↗</small>
              </a>
            ))}
          </div>
        </section>

        <section className="container" aria-labelledby="budget-title">
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>03 / BUDGET</span>
            <Heading as="h2" id="budget-title">費用框架</Heading>
            <p>8 晚包含 1 晚夜巴與 7 晚住宿；以下為人民幣預算工具。</p>
          </div>
          <BudgetEstimator />
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>支出項目</th><th>人民幣基準</th><th>核算思路</th></tr></thead>
              <tbody>
                <tr><td>國際機票</td><td>¥1,274</td><td>廣州往返吉隆坡的訂單總額。</td></tr>
                <tr><td>城際大交通</td><td>預算 ¥330</td><td>機場巴士、夜巴、檳城渡輪、KTM／ETS 與 Amanjaya → TBS 巴士。</td></tr>
                <tr><td>住宿</td><td>預算 ¥385</td><td>7 晚住宿；最後一晚為 Quill Residences 公寓，其餘為市區經濟住宿。金額可按各晚訂單調整。</td></tr>
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
          <div className={styles.daySelector} role="group" aria-label="選擇行程日">
            {days.map((day) => (
              <button
                key={day.day}
                type="button"
                aria-pressed={activeDay === day.day}
                aria-controls="active-day-panel"
                className={activeDay === day.day ? styles.dayButtonActive : ''}
                onClick={() => setActiveDay(day.day)}>
                Day {day.day}
              </button>
            ))}
          </div>
          <div className={styles.activeDayPanel} id="active-day-panel" aria-live="polite">
            <DayDetails day={active} idPrefix="selected-day" />
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
              <tbody>{researchTable.map(([name, place, note, query]) => <tr key={name}><td>{query ? <a href={googleMapsSearchUrl(query)} target="_blank" rel="noopener noreferrer">{name} ↗</a> : name}</td><td>{place}</td><td>{note}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="container" aria-labelledby="food-title">
          <div className={styles.splitSection}>
            <div>
              <span className={styles.kicker}>06 / CITY TEXTURE</span>
              <Heading as="h2" id="food-title">伊斯蘭建築與平民餐桌。</Heading>
              <p>清真寺、藝術收藏、港口商人社群與各城市的平民飲食。</p>
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

        <footer className={`container ${styles.lastSection}`}>
          <Link to="/explore/travel">← 回到行旅誌</Link>
        </footer>
      </main>
    </Layout>
  );
}
