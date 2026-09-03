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
  {label: 'KL / KUL', detail: '國家館舍、戰時記憶與返程', query: 'Kuala Lumpur International Airport, Sepang, Malaysia'},
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
    stay: '與 Day 6 同一間唐人街／Pasar Seni 青旅，不換酒店。',
  },
  {
    day: 8,
    date: '9 月 5 日（六）',
    route: '黑風洞 → 國家博物館 → 廣東義山 → 獨立廣場',
    title: '用地質、國家館舍與墓園替整條線收束',
    focus: '黑風洞、國家博物館、國家紡織博物館、獨立廣場、廣東義山',
    mapStops: [
      {label: '黑風洞', query: 'Batu Caves, Selangor, Malaysia'},
      {label: '國家博物館', query: 'Muzium Negara, Kuala Lumpur, Malaysia'},
      {label: '廣東義山', query: 'Kwong Tong Cemetery Kuala Lumpur, Malaysia'},
      {label: '國家紡織博物館', query: 'National Textile Museum Kuala Lumpur, Malaysia'},
      {label: '音樂博物館（備援）', query: 'Music Museum Kuala Lumpur, Malaysia'},
      {label: '占美清真寺', query: 'Masjid Jamek of Kuala Lumpur, Malaysia'},
      {label: '生命之河', query: 'River of Life Kuala Lumpur, Malaysia'},
      {label: '獨立廣場', query: 'Merdeka Square Kuala Lumpur, Malaysia'},
      {label: '蘇丹阿都沙末大廈', query: 'Sultan Abdul Samad Building Kuala Lumpur, Malaysia'},
    ],
    blocks: [
      ['08:12–08:41', '從 KL Sentral 搭 KTM Komuter 到 Batu Caves；若住在唐人街，可在 Kuala Lumpur 站約 08:16 上車。只走主洞與石灰岩地景，遇雨、身體疲勞或交通延誤就略過，直接前往國家博物館。'],
      ['08:45–10:40', '走 Batu Caves 主洞與石灰岩地景；10:40 開始往車站回程，不再追加遠處寺廟或商場。'],
      ['11:00–11:31', '由 Batu Caves 搭 KTM 回 KL Sentral，步行往 Muzium Negara。'],
      ['11:45–13:00', '進 Muzium Negara。這裡把史前、早期馬來王國、殖民與日據時期、獨立後的馬來西亞放在同一條國家敘事中。'],
      ['13:00–14:55', '快速午餐後以短程 Grab 到 Kwong Tong Cemetery；13:45–14:55 在開放、有日光的時段走葉亞來墓、南僑機工紀念碑與華人開埠脈絡。墓園 16:00 關閉，不把它排到傍晚。'],
      ['15:15–16:05', '回獨立廣場一帶；國家紡織博物館若當日開放就進，若有臨時閉館，改進免費的音樂博物館，不為補館跨城折返。'],
      ['16:05–18:00', '走占美清真寺外觀、生命之河、獨立廣場與蘇丹阿都沙末大廈，回看殖民行政、獨立儀式與今天的城市中心。'],
      ['18:00–20:30', '在市區吃晚餐並整理隔天返程所需的證件、行李與交通方案。'],
    ],
    stay: '與 Day 6 同一間唐人街／Pasar Seni 青旅，不換酒店。',
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
  ['馬當博物館 / Kota Ngah Ibrahim', '霹靂州·馬當', '錫礦行政空間，1942–1945 年由日軍作為總部使用；本次因鐵路動線改為太平→怡保，明確列為未到訪的下次支線。'],
  ['太平戰爭公墓', '霹靂州·太平', '馬來亞戰役與英、澳、印、廓爾喀將士的戰爭記憶；本次未與太平市區同日硬塞，保留給下一次太平專線。'],
  ['霹靂博物館', '霹靂州·太平', '半島最早的博物館；用地方史、自然史與民族誌理解霹靂。'],
  ['Han Chin Pet Soo', '怡保舊街場', '1893 年客家錫礦俱樂部、移民社群與礦業財富。'],
  ['怡保戰爭紀念碑', '怡保車站廣場', '戶外紀念碑串起兩次世界大戰、泰緬死亡鐵路、緊急狀態與對抗時期；比市內零散墓點更適合短停。'],
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
  ['實走關鍵票券', '8 月 30 日直達夜巴、9 月 2 日 07:00 渡輪／07:35 Butterworth → Sungai Petani KTM、10:00 K51、15:52 Sungai Petani → Butterworth／17:40 → Taiping KTM、9 月 3 日清晨 Taiping → Ipoh ETS、14:00 Han Chin Pet Soo 與晚間 Ipoh → KL Sentral ETS；晚車只以 KITS 實際有位班次為準。'],
  ['公共交通原則', '布央谷放在 Sungai Petani 的單日支線，太平完成霹靂博物館後清晨進怡保；馬當與太平戰爭公墓不因「看起來順路」就硬塞入同一天。布央谷最後約 2.5 km 與班車失去鐵路緩衝時，才使用一次短程 Grab。'],
  ['閉館規則', '檳城州立博物館避開 8 月 31 日國慶假日；警察博物館避開星期一。其餘場館也要在出發前看官方當日公告。'],
  ['導航與通信', '預先準備 Grab、Google Maps 離線地圖、本地 eSIM 與至少一張離線交通備份。'],
  ['空調與裝備', '夜巴、商場與博物館可能很冷；古墓、密林與戰爭遺址要準備驅蚊、長褲與防滑鞋。'],
  ['宗教禮儀', '清真寺脫鞋、服裝端正，借用長袍與頭巾後按規定歸還；不要把宗教空間當成背景板。'],
  ['回程餘量', 'AK116 於 9 月 6 日 16:35 自 KUL T2 起飛；若有托運，目標是 12:30 前從 KL Sentral 出發。'],
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
    title: '廣東義山',
    body: '公開時段為 08:30–16:00；安排在 13:45–14:55，墓園不排傍晚。',
    href: 'https://ktc.org.my/wp-content/uploads/2024/03/Cemetery-Rules-Regulations_The-Association-of-Kwong-Tong-Cemetery-Management-KL.pdf',
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
      description="以馬六甲、檳城、布央谷、太平、怡保與吉隆坡串起的 9 日博物館、歷史遺跡與二戰行程；已標出實走調整、Google Maps 與閉館校正。"
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
              <span className={styles.kicker}>VERSION 04 / LIVE ROUTE SYNC</span>
              <Heading as="h2" id="revision-title">先守住時間，再增加內容。</Heading>
              <p>已將夜巴抵達、9 月 2 日 07:00 渡輪／07:35 KTM／10:00 K51／15:52 返程 KTM，以及 9 月 3 日清晨太平 → 怡保的實走調整、14:00 Han Chin Pet Soo 預約與晚間怡保 → KL Sentral 計畫入表；馬當與太平戰爭公墓已明確標為未到訪。晚車、館舍、渡輪、KTM、宗教場所、天氣與安全狀況仍以當日資訊為準。</p>
            </div>
            <Link className={styles.backLink} to="/explore/travel">回到行旅誌 <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
