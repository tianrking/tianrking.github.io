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
  {label: 'KL / KUL', detail: '黑風洞、雲頂、戰時記憶與返程', query: 'Kuala Lumpur International Airport, Sepang, Malaysia'},
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
      ['20:15–21:10', '回 Sleep Here 取行李，再以市巴或短程 Grab 到 Melaka Sentral。8 月 30 日先選「直達 Sungai Nibong／Penang Sentral」的已付款車票，寧可早到，不要為省一點錢買凌晨在 KL 轉車的班次。'],
      ['約 21:30–05:18', '搭直達夜巴北上檳城；目前票務頁可見約 21:30、翌日清晨抵達的直達班次，最終以你買到的票面時間與下車站為準。全程約 7 小時，睡在車上省一晚住宿，外套放手邊。'],
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
      ['05:20–08:15', '夜巴抵達後先在車站附近吃早餐、充電與等候天亮，再到住宿寄放行李。國慶日的州級活動、封路與人流每年不同，現場不追逐流程，先保留體力。'],
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
      ['06:25–07:00', '從喬治市核心區往 Raja Tun Uda 碼頭；06:50 前進站，搭 07:00 首班渡輪。帶大行李、下雨或住宿較遠時，只用一次短程 Grab，不能把 07:00 船當成可遲到的班次。'],
      ['07:00–08:09', '07:00 渡輪到 Butterworth，直接接 07:35 KTM Komuter；08:09 抵達 Sungai Petani。這班車早到只是為了留出 K51 的確定等候時間，不是要在車站硬趕 08:15 班公車。'],
      ['08:09–10:00', '由車站走到巴士總站、吃早餐、補水與確認 K51。K51 往 Tanjung Dawai 的可執行班次是 10:00；上車時說 Merbok／Lembah Bujang，並再問司機回程上車點。'],
      ['10:00–13:30', '搭 K51 到 Merbok 一帶；博物館位於 Merbok 鎮外約 2.5 km，白天步行或只補這一段短程 Grab。進 Lembah Bujang Archaeological Museum 與鄰近 Candi Bukit Batu Pahat，重點看 3–12 世紀海上貿易、印度教／佛教遺存；13:30 前離開館區回 Merbok。'],
      ['13:30–15:30', '搭 K51 回 Sungai Petani，目標 15:30 前回到車站。若 13:45 前仍無法確認可回站的車，不再等下一個循環，直接用一次 Merbok → Sungai Petani 的短程 Grab 保住固定火車。'],
      ['15:52–18:44', '15:52 KTM Komuter 從 Sungai Petani 到 Butterworth（16:26），17:40 再由 Butterworth 到 Taiping（18:44）。抵達後入住太平市區；不把戰爭公墓塞進日落後。'],
    ],
    stay: '太平市區住宿；翌日清晨搭 ETS 進怡保。馬當與太平戰爭公墓移出本次實走路線，不把未到訪地點寫成完成。',
  },
  {
    day: 6,
    date: '9 月 3 日（四）',
    route: '太平 → 怡保 → 吉隆坡',
    title: '把錫礦城市、洞寺與舊街場放在同一天',
    focus: '清晨 ETS、三寶洞、鏡湖、Han Chin Pet Soo、怡保舊街場、晚間 ETS',
    mapStops: [
      {label: '太平車站', query: 'Taiping Railway Station, Perak, Malaysia'},
      {label: '三寶洞', query: 'Sam Poh Tong Temple, Ipoh, Perak, Malaysia'},
      {label: '鏡湖一號', query: 'Tasik Cermin 1 Mirror Lake, Ipoh, Perak, Malaysia'},
      {label: 'Han Chin Pet Soo', query: 'Han Chin Pet Soo, Ipoh, Malaysia'},
      {label: '何人可博物館', query: 'Ho Yan Hor Museum, Ipoh, Perak, Malaysia'},
      {label: '怡保戰爭紀念碑', query: 'Cenotaph War Memorial, Ipoh, Perak, Malaysia'},
      {label: '怡保舊街場', query: 'Ipoh Old Town, Perak, Malaysia'},
      {label: '怡保車站', query: 'Ipoh Railway Station, Perak, Malaysia'},
      {label: 'KL Sentral', query: 'Kuala Lumpur Sentral, Malaysia'},
    ],
    blocks: [
      ['06:11–06:56', '由 Taiping 搭 ETS 到 Ipoh；先寄放行李、補水與吃早餐。霹靂博物館已於前一日完成，馬當與太平戰爭公墓不為了補一站再折返。'],
      ['08:30–11:30', '以短程 Grab 連接三寶洞與鏡湖一號；洞寺與石灰岩地景是同一個 Gunung Rapat 支線，完成後直接回怡保舊街場，不繞去已暫停開放的 Kek Lok Tong。'],
      ['11:30–13:40', '回舊街場午餐、整理照片與行李；13:40 前到 Han Chin Pet Soo 報到。'],
      ['14:00–15:00', '依已確認的預約進 Han Chin Pet Soo；以客家錫礦俱樂部、移民社群與礦業財富為主線。'],
      ['15:00–18:20', '先走隔壁何人可博物館（以 16:00 前入館為原則），再到怡保戰爭紀念碑、火車站、市政廳、Birch Memorial Clock Tower、二奶巷與舊街場。怡保市內沒有值得為此繞路的大型二戰墓園；戰爭紀念碑比只有兩座二戰墓的基督教公墓更值得保留。'],
      ['18:20–20:00', '在舊街場晚餐、取行李，最晚 30 分鐘前回怡保車站。'],
      ['20:00–22:50', '搭已購到的晚間 ETS 前往 KL Sentral；優先 20:00，若無座位以 20:26 為最後備援，車票與當日異動以 KITS 為準。抵達後直接入住唐人街／Pasar Seni 一帶。'],
    ],
    stay: '吉隆坡唐人街／Pasar Seni 一帶連住 3 晚（9/3 入住、9/6 退房；例如 Space Hotel）。',
  },
  {
    day: 7,
    date: '9 月 4 日（五）',
    route: '吉隆坡國家館舍與獨立廣場（已實走）',
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
      ['上午', '已進皇家馬來西亞警察博物館與敦阿都拉薩紀念園；前者用殖民警務、日據與緊急狀態串起治安史，後者補上建國後的國家行政記憶。'],
      ['中午', '已走伊斯蘭藝術博物館、國家清真寺與國家博物館；宗教開放區與服裝要求以現場安排為準。'],
      ['傍晚', '已完成獨立廣場、蘇丹阿都沙末大廈、占美清真寺與生命之河。國家銀行改放到返程日上午，避免重複走館。'],
    ],
    stay: 'Central Market／Pasar Seni 一帶。',
  },
  {
    day: 8,
    date: '9 月 5 日（六）',
    route: '黑風洞 → KL Sentral → 青雲亭 → 雲頂高原 → Bukit Bintang／TRX',
    title: '只走北線：石灰岩、山上宗教空間與高原鐵路接駁',
    focus: '黑風洞、KTM Komuter、RWT Express、Awana SkyWay、青雲亭、雲頂高原',
    mapStops: [
      {label: '黑風洞', query: 'Batu Caves, Selangor, Malaysia'},
      {label: 'KL Sentral', query: 'Kuala Lumpur Sentral, Malaysia'},
      {label: 'Awana SkyCentral', query: 'Awana SkyCentral Genting Highlands, Pahang, Malaysia'},
      {label: '青雲亭', query: 'Chin Swee Caves Temple Genting Highlands, Pahang, Malaysia'},
      {label: '雲頂高原', query: 'SkyAvenue Genting Highlands, Pahang, Malaysia'},
      {label: 'Bukit Bintang／TRX', query: 'The Exchange TRX Kuala Lumpur, Malaysia'},
    ],
    blocks: [
      ['06:50–07:20', '從住宿直接 Grab 到 Batu Caves。這段用一次車換掉清晨兩段轉乘；到站後只帶水、雨具與手機，不帶任何寄存行李。'],
      ['07:20–08:35', '走 Temple Cave 主洞與石灰岩地景。主洞免費、272 級階梯；不加遠處寺廟、商場或攀登支線，08:35 前回 Batu Caves KTM 站。'],
      ['08:35–10:15', '搭下一班 KTM Komuter 回 KL Sentral；抵達後到 Lower Ground 的 RWT Express 櫃檯，買上山巴士＋Awana SkyWay 票，並同時鎖定回程 RWT 班次，不用 Grab 跨城折返。'],
      ['10:15–12:15', '搭 KL Sentral → GHPO／Awana 的官方巴士，轉 Awana SkyWay 上山。實際搭乘以櫃檯給出的最近一班為準；若纜車因天候暫停，改走巴士上山或直接回市區，不另買分散的付費設施。'],
      ['12:15–15:45', '以青雲亭為主，利用同一張纜車票中途下車、再回到高原站；午餐後在 SkyAvenue／山頂步行區停留。今天不進賭場、不排付費樂園，保留山景、寺廟與公共接駁這條主線即可。'],
      ['15:45–18:30', '由 Awana／GHPO 搭已鎖定的 RWT Express 回 KL Sentral，再轉 MRT／步行至 Bukit Bintang／TRX 的新住宿。若回程巴士座位或天候變動，以最早可用班次下山，不把晚到風險留給明天航班。'],
    ],
    stay: 'Bukit Bintang／TRX 一帶，9 月 5 日入住、9 月 6 日退房；選可晚到、24 小時櫃檯的住宿。',
  },
  {
    day: 9,
    date: '9 月 6 日（日）',
    route: 'Cheras → Jalan Dato Onn → 國家銀行 → KL Sentral → KUL T2',
    title: '戰時記憶、建國檔案、金融制度，然後直接返程',
    focus: 'Cheras War Cemetery、東姑阿都拉曼紀念館、國家銀行博物館、AK116 16:35 航班',
    mapStops: [
      {label: 'Cheras War Cemetery', query: 'Cheras War Cemetery Kuala Lumpur, Malaysia'},
      {label: '東姑阿都拉曼紀念館', query: 'Memorial Tunku Abdul Rahman Putra Kuala Lumpur, Malaysia'},
      {label: '國家銀行博物館', query: 'Bank Negara Malaysia Museum and Art Gallery, Kuala Lumpur, Malaysia'},
      {label: 'KL Sentral', query: 'Kuala Lumpur Sentral, Malaysia'},
      {label: 'KUL T2', query: 'Kuala Lumpur International Airport Terminal 2, Sepang, Malaysia'},
    ],
    blocks: [
      ['07:35–08:00', '退房後背行李直接 Grab 到 Cheras War Cemetery；墓園 08:00 開門，先走戰爭墓區，不在住宅區四處找未確認的入口。'],
      ['08:00–08:30', '看 Cheras War Cemetery。它是本次唯一保留的墓園：二戰軍人墓區的時間線清楚，也不必為廣東義山再做一次跨城折返。'],
      ['08:30–09:00', 'Grab 到 Jalan Dato Onn；09:00 進東姑阿都拉曼紀念館。若此段交通超過預期，直接略過紀念館、保留國家銀行與機場餘量。'],
      ['09:00–09:40', '看馬來西亞首任首相的故居、獨立與建國文獻、1959 年 Cadillac；這一站與獨立廣場的戶外儀式空間互補。'],
      ['09:40–10:00', 'Grab 到 Bank Negara Malaysia Museum and Art Gallery。'],
      ['10:00–10:50', '集中看 Economics、Numismatics 與 Bank Negara 的制度展示；伊斯蘭金融展廳如仍暫停開放，不為它等待。'],
      ['10:50–12:00', '前往 KL Sentral，搭 KLIA Ekspres 直達機場；以 12:00 前離開 KL Sentral 為硬截止。KLIA Transit 停靠較多，時間不足時優先選 Express。'],
      ['約 12:35–16:35', '抵達 KUL T2 後完成值機、托運、安檢與登機。AK116 的登機口、行李規則與時間以 AirAsia App 當日頁面為準。'],
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
  ['馬當博物館 / Kota Ngah Ibrahim', '霹靂州·馬當', '錫礦行政空間，1942–1945 年由日軍作為總部使用；本次因鐵路動線改為太平→怡保，明確列為未到訪的下次支線。'],
  ['太平戰爭公墓', '霹靂州·太平', '馬來亞戰役與英、澳、印、廓爾喀將士的戰爭記憶；本次未與太平市區同日硬塞，保留給下一次太平專線。'],
  ['霹靂博物館', '霹靂州·太平', '半島最早的博物館；用地方史、自然史與民族誌理解霹靂。'],
  ['Han Chin Pet Soo', '怡保舊街場', '1893 年客家錫礦俱樂部、移民社群與礦業財富。'],
  ['怡保戰爭紀念碑', '怡保車站廣場', '戶外紀念碑串起兩次世界大戰、泰緬死亡鐵路、緊急狀態與對抗時期；比市內零散墓點更適合短停。'],
  ['皇家馬來西亞警察博物館', '吉隆坡', '殖民警務、日據、緊急狀態與建國後治安史的入口。'],
  ['國家博物館 / 獨立廣場', '吉隆坡', '國家史敘事、殖民行政建築與 1957 年獨立儀式空間；已於 9 月 4 日完成。'],
  ['黑風洞 / 青雲亭', '雪蘭莪／彭亨', '石灰岩聖地與高原華人宗教空間，以 KTM、官方巴士與纜車接成一條北線。'],
  ['Cheras War Cemetery', '吉隆坡 Cheras', '二戰軍人墓區；保留到返程日上午第一站，避免把墓園塞進高原支線。'],
  ['東姑阿都拉曼紀念館', 'Jalan Dato Onn', '首任首相故居、獨立及建國檔案，接到獨立廣場之外的國家形成史。'],
  ['國家銀行博物館', '吉隆坡', '貨幣、中央銀行、經濟危機與金融制度；伊斯蘭金融展廳以當日開放為準。'],
  ['Kwong Tong Cemetery', '吉隆坡', '葉亞來墓、南僑機工紀念碑與華人開埠及抗戰史；本次不硬塞進黑風洞／雲頂北線，保留給下一次市內專線。'],
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
  ['實走關鍵票券', '8 月 30 日直達夜巴、9 月 2 日 07:00 渡輪／07:35 Butterworth → Sungai Petani KTM、10:00 K51、15:52 Sungai Petani → Butterworth／17:40 → Taiping KTM、9 月 3 日清晨 Taiping → Ipoh ETS、14:00 Han Chin Pet Soo 與晚間 Ipoh → KL Sentral ETS；晚車只以 KITS 實際有位班次為準。'],
  ['公共交通原則', '布央谷放在 Sungai Petani 的單日支線，太平完成霹靂博物館後清晨進怡保；馬當與太平戰爭公墓不因「看起來順路」就硬塞入同一天。布央谷最後約 2.5 km 與班車失去鐵路緩衝時，才使用一次短程 Grab。'],
  ['閉館規則', '檳城州立博物館避開 8 月 31 日國慶假日；警察博物館避開星期一。其餘場館也要在出發前看官方當日公告。'],
  ['導航與通信', '預先準備 Grab、Google Maps 離線地圖、本地 eSIM 與至少一張離線交通備份。'],
  ['空調與裝備', '夜巴、商場與博物館可能很冷；古墓、密林與戰爭遺址要準備驅蚊、長褲與防滑鞋。'],
  ['宗教禮儀', '清真寺脫鞋、服裝端正，借用長袍與頭巾後按規定歸還；不要把宗教空間當成背景板。'],
  ['9 月 5 日北線', '黑風洞後回 KL Sentral，再用 RWT Express／Awana SkyWay 上雲頂；不從黑風洞 Grab 到廣東義山再折返雲頂。這樣少一次跨城車資與回頭路。'],
  ['回程餘量', 'AK116 於 9 月 6 日 16:35 自 KUL T2 起飛；背行李完成 Cheras、東姑紀念館、國家銀行後，以 12:00 前從 KL Sentral 出發為硬截止。'],
];

const warPriorityChoices = [
  {
    title: '主線：渡輪／KTM／短程 Grab，不包車',
    body: '以檳城戰爭博物館、檳城紀念碑、布央谷、太平霹靂博物館、怡保舊街場與吉隆坡國家館舍串成主線；馬當與太平戰爭公墓明確保留為下一次太平專線，不把未走路段包裝成已完成。',
    tone: 'primary',
  },
  {
    title: '陸軍博物館不放進主線',
    body: 'Port Dickson 的陸軍博物館值得，但公共交通往返會吃掉一整天；這次不為了再多一館破壞馬六甲—檳城—太平—怡保—吉隆坡的連續路線。',
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
    title: '布央谷考古博物館',
    body: '官方指向 Sungai Petani → Merbok 的公共接駁；最後約 2.5 km 以白天步行為主，雨天才用短程備援。',
    href: 'https://www.jmm.gov.my/en/content/lembah-bujang-archaeological-museum',
  },
  {
    title: 'K51：雙溪大年 → 丹絨達外',
    body: '官方路線圖列出 10:00 往丹絨達外班；在 Merbok 下車後再進布央谷，回程不能錯過 15:52 的 KTM。',
    href: 'https://bas.my/route/K51.png',
  },
  {
    title: '馬當博物館（下次太平支線）',
    body: '官方列出從 Taiping 巴士站搭 77 號往 Kuala Sepetang；本次未走，下一次需在站內確認去回班次後獨立安排。',
    href: 'https://www.jmm.gov.my/en/content/matang-museum',
  },
  {
    title: '檳城渡輪',
    body: 'George Town → Butterworth 首班為 07:00；明早到碼頭的硬截止是 06:50。',
    href: 'https://penangport.gov.my/en/services/service/ferry-services',
  },
  {
    title: 'KTM 與 ETS',
    body: '渡輪與列車均有固定班次；行前再次核對當日異動，Day 5 及 Day 6 不以「大概能趕上」作規劃。',
    href: 'https://www.ktmb.com.my/traintime.html',
  },
  {
    title: 'RWT Express／Awana SkyWay',
    body: 'KL Sentral Lower Ground 可接官方巴士；上山巴士加纜車票價以現場與官網當日資訊為準，並在購買時一併鎖定回程班次。',
    href: 'https://www.rwgenting.com/en/getting-here/express-bus.html',
  },
  {
    title: 'Awana SkyWay',
    body: '纜車通常 07:00–23:00；同張票可在 Chin Swee Station 中途停靠，天候或檢修以現場公告為準。',
    href: 'https://www.rwgenting.com/en/getting-here/cable-car.html',
  },
  {
    title: 'Cheras War Cemetery',
    body: 'Cheras Christian Cemetery／Crematorium 每日 08:00–16:00；以地圖釘選前往戰爭墓區。',
    href: 'https://www.dbkl.gov.my/en/kesihatan-awam/tanah-perkuburan-dan-krematorium',
  },
  {
    title: '東姑阿都拉曼紀念館',
    body: '星期六、日 09:00–17:00，免費；返程日上午在開門後短停。',
    href: 'https://www.arkib.gov.my/en/perkhidmatan/arkib-memorial/info-galeri/the-tunku-abdul-rahman-putra-memorial',
  },
  {
    title: '國家銀行博物館',
    body: '星期六、日 10:00–17:00，免費；伊斯蘭金融展廳如暫停開放，不為它改動機場硬截止。',
    href: 'https://museum.bnm.gov.my/v2/',
  },
  {
    title: 'KLIA Ekspres',
    body: 'KL Sentral 到 T1 約 28 分鐘、再到 T2 約 3 分鐘；返程日優先選不停站的 Express。',
    href: 'https://www.kliaekspres.com/products-fares/klia-ekspres/',
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
      description="以馬六甲、檳城、布央谷、太平、怡保與吉隆坡串起的 9 日歷史行程；同步記錄實走調整、黑風洞／雲頂北線、戰爭墓園與機場前的金融史路線。"
      image="img/w0x7ce-social-card.png">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <div className={styles.breadcrumb}><Link to="/explore/travel">行旅誌</Link><span>/</span><span>01</span></div>
            <div className={styles.kicker}>MALAYSIA / PENINSULAR FIELD PLAN</div>
            <Heading as="h1">馬來西亞西馬半島<br />9 日博物館、歷史遺跡與二戰行程。</Heading>
            <p className={styles.lead}>
              從馬六甲的殖民要塞與港口史，到檳城的戰爭遺址、州立收藏與公共紀念，
              再走進布央谷、太平、怡保，最後以吉隆坡的國家館舍與戰時記憶收束。
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
            <p>保留逆時針主線，布央谷與太平放在同一天完成，隔天清晨才進怡保；不把馬當與戰爭公墓寫成已走完的「順路站」。</p>
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
              <p>從 KUL 出發，依序經馬六甲、檳城、布央谷、太平、怡保與吉隆坡後回到 KUL；用來看實走的城市順序，跨城交通仍以每日連結與實際班次為準。</p>
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
            <strong>本次修正：</strong>已完成布央谷與太平霹靂博物館；9 月 3 日已改為清晨太平 → 怡保，午後依 Han Chin Pet Soo 預約與舊街場動線，晚間再進吉隆坡。馬當與太平戰爭公墓未到訪，保留給下一次太平專線。
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
            <p>按往返機票 ¥1,200、夜巴、渡輪、KTM／ETS、公共接駁與增加館舍計算，9 日基準約 ¥2,833；下面可直接替換成實際價格。</p>
          </div>
          <BudgetEstimator />
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>支出項目</th><th>人民幣基準</th><th>核算思路</th></tr></thead>
              <tbody>
                <tr><td>國際機票</td><td>約 ¥1,200</td><td>本方案按目前往返票價估算，隨航班、日期與行李規則浮動。</td></tr>
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
              <span className={styles.kicker}>VERSION 05 / LIVE ROUTE SYNC</span>
              <Heading as="h2" id="revision-title">9 月 5 日不折返，9 月 6 日不壓機場。</Heading>
              <p>9 月 4 日已完成的館舍與獨立廣場已回寫。9 月 5 日改為黑風洞 → KL Sentral → 雲頂的公共交通北線，不再把廣東義山塞在中間製造昂貴跨城回頭路；廣東義山保留給下次市內專線。9 月 6 日以 Cheras War Cemetery、東姑阿都拉曼紀念館、國家銀行博物館接 KLIA Ekspres，12:00 前離開 KL Sentral。車票、宗教場所、天候、纜車與館舍仍以當日公告為準。</p>
            </div>
            <Link className={styles.backLink} to="/explore/travel">回到行旅誌 <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
