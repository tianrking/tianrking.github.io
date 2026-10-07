export const CITIES = [
  ['jakarta', '雅加達', 'Jakarta'],
  ['yogyakarta', '日惹與大寺', 'Yogyakarta & temples'],
  ['malang', '瑪琅', 'Malang'],
  ['nature', '瀑布與布羅莫', 'Waterfall & Bromo'],
  ['surabaya', '泗水', 'Surabaya'],
];

// Local names and cities disambiguate searches. These are not verified gate pins.
const rows = [
  ['jakarta','蘇加諾哈達機場 CGK','Soekarno-Hatta International Airport','Soekarno-Hatta International Airport CGK Tangerang','transport'],
  ['jakarta','首晚酒店地址','Asyana Kemayoran Jakarta','Jl. Bungur Besar Raya No.79-81 Kemayoran Jakarta Pusat 10620','stay'],
  ['jakarta','機場線 BNI City','BNI City Station','Stasiun BNI City Jakarta','transport'],
  ['jakarta','Manggarai 換乘站','Manggarai Station','Stasiun Manggarai Jakarta','transport'],
  ['jakarta','雅加達老城站','Jakarta Kota Station','Stasiun Jakarta Kota Jakarta','transport'],
  ['jakarta','夜車出發站 PSE','Pasar Senen Station','Stasiun Pasar Senen Jakarta','transport'],
  ['jakarta','替代出發站 GMR','Gambir Station','Stasiun Gambir Jakarta','alternative'],
  ['jakarta','海事博物館','Museum Bahari','Museum Bahari Jakarta','main'],
  ['jakarta','港口瞭望塔','Menara Syahbandar','Menara Syahbandar Jakarta','optional'],
  ['jakarta','巽他格拉巴港','Sunda Kelapa Harbour','Sunda Kelapa Harbour Jakarta','optional'],
  ['jakarta','老城廣場','Taman Fatahillah / Kota Tua','Taman Fatahillah Jakarta','main'],
  ['jakarta','印尼銀行博物館','Museum Bank Indonesia','Museum Bank Indonesia Jakarta','main'],
  ['jakarta','唐人街','Glodok / Petak Sembilan','Petak Sembilan Glodok Jakarta','main'],
  ['jakarta','國家博物館','Museum Nasional','Museum Nasional Indonesia Jakarta','main'],
  ['jakarta','獨立清真寺','Istiqlal Mosque','Istiqlal Mosque Jakarta','main'],
  ['jakarta','雅加達大教堂','Jakarta Cathedral','Jakarta Cathedral Jakarta','main'],
  ['jakarta','獨立紀念碑與廣場','Monas / Merdeka Square','Monumen Nasional Jakarta','optional'],
  ['jakarta','金融中心街區','Bundaran HI / Thamrin','Bundaran HI Jakarta','main'],
  ['jakarta','Sarinah 商場','Sarinah','Sarinah Thamrin Jakarta','optional'],
  ['jakarta','晚餐街','Jalan Sabang','Jalan Haji Agus Salim Jakarta','optional'],
  ['jakarta','Sudirman 商業軸','Jalan Jenderal Sudirman','Jalan Jenderal Sudirman Jakarta','optional'],
  ['yogyakarta','到達車站 LPN','Lempuyangan Station','Stasiun Lempuyangan Yogyakarta','transport'],
  ['yogyakarta','夜車出發站 YK','Yogyakarta / Tugu Station','Stasiun Yogyakarta Tugu','transport'],
  ['yogyakarta','住宿區','Sosrowijayan / Malioboro north','Jalan Sosrowijayan Yogyakarta','stay'],
  ['yogyakarta','住宿區／青旅比較','Dagen / The Packer Lodge','The Packer Lodge Dagen Yogyakarta','stay'],
  ['yogyakarta','水宮','Taman Sari','Taman Sari Yogyakarta','main'],
  ['yogyakarta','午飯街區','Ngasem','Pasar Ngasem Yogyakarta','main'],
  ['yogyakarta','老街','Malioboro','Jalan Malioboro Yogyakarta','main'],
  ['yogyakarta','傳統市場','Beringharjo','Pasar Beringharjo Yogyakarta','main'],
  ['yogyakarta','銀器老街','Kotagede','Kotagede Yogyakarta','optional'],
  ['yogyakarta','婆羅浮屠','Borobudur Temple','Borobudur Temple Magelang','main'],
  ['yogyakarta','孟都寺','Candi Mendut','Candi Mendut Magelang','optional'],
  ['yogyakarta','帕翁寺','Candi Pawon','Candi Pawon Magelang','optional'],
  ['yogyakarta','婆羅浮屠公交出發站','Terminal Jombor','Terminal Jombor Yogyakarta','transport'],
  ['yogyakarta','婆羅浮屠公交站','Terminal Borobudur','Terminal Borobudur Magelang','transport'],
  ['yogyakarta','蘇丹王宮核心','Kagungan Dalem Kedhaton','Kagungan Dalem Kedhaton Yogyakarta','main'],
  ['yogyakarta','Gudeg 飲食街','Wijilan','Jalan Wijilan Yogyakarta','optional'],
  ['yogyakarta','普蘭巴南公交站','Terminal Prambanan','Terminal Prambanan Yogyakarta','transport'],
  ['yogyakarta','普蘭巴南主寺','Prambanan Temple','Prambanan Temple Yogyakarta','main'],
  ['yogyakarta','賽烏佛寺','Candi Sewu','Candi Sewu Prambanan','main'],
  ['yogyakarta','支寺','Candi Lumbung','Candi Lumbung Prambanan','optional'],
  ['yogyakarta','支寺','Candi Bubrah','Candi Bubrah Prambanan','optional'],
  ['yogyakarta','堡壘博物館','Museum Benteng Vredeburg','Museum Benteng Vredeburg Yogyakarta','alternative'],
  ['yogyakarta','爪哇文化博物館','Museum Sonobudoyo','Museum Sonobudoyo Yogyakarta','alternative'],
  ['malang','主車站 ML／住宿區','Malang Station / Klojen','Stasiun Malang Klojen Malang','transport'],
  ['malang','另一車站，非本線目標','Malang Kotalama Station','Stasiun Malang Kotalama','alternative'],
  ['malang','圖古廣場','Alun-Alun Tugu','Alun Alun Tugu Malang','main'],
  ['malang','市政廳外觀','Balai Kota Malang','Balai Kota Malang','main'],
  ['malang','華人寺廟','Klenteng Eng An Kiong','Klenteng Eng An Kiong Malang','optional'],
  ['malang','彩色村','Jodipan','Kampung Warna Warni Jodipan Malang','optional'],
  ['malang','歷史街區','Kayutangan Heritage','Kayutangan Heritage Malang','main'],
  ['nature','圖帕克塞烏瀑布','Tumpak Sewu Waterfall','Tumpak Sewu Waterfall Lumajang East Java','main'],
  ['nature','布羅莫火山','Mount Bromo','Mount Bromo East Java','main'],
  ['nature','優先山腳住宿區','Cemoro Lawang','Cemoro Lawang Bromo Probolinggo','stay'],
  ['nature','團商指定住宿備選','Sukapura','Sukapura Probolinggo East Java','stay'],
  ['nature','日出觀景點（依開放）','Penanjakan viewpoint','Penanjakan Bromo viewpoint','optional'],
  ['nature','日出觀景點（依開放）','King Kong Hill','King Kong Hill Bromo viewpoint','optional'],
  ['surabaya','街區／優先住宿','Tunjungan / Genteng','Jalan Tunjungan Surabaya','stay'],
  ['surabaya','住宿區／青旅比較','Gubeng / My Studio','My Studio Hotel Surabaya Gubeng','stay'],
  ['surabaya','歷史酒店外觀','Hotel Majapahit','Hotel Majapahit Surabaya','main'],
  ['surabaya','荷蘭戰爭墓園','Ereveld Kembang Kuning','Ereveld Kembang Kuning Surabaya','main'],
  ['surabaya','革命史博物館','Museum Sepuluh Nopember','Museum Sepuluh Nopember Surabaya','main'],
  ['surabaya','英雄紀念碑','Tugu Pahlawan','Tugu Pahlawan Surabaya','main'],
  ['surabaya','紅橋','Jembatan Merah','Jembatan Merah Surabaya','main'],
  ['surabaya','宗教老街','Ampel','Masjid Ampel Surabaya','main'],
  ['surabaya','潛艇博物館，替代 Ampel','Monumen Kapal Selam','Monumen Kapal Selam Surabaya','alternative'],
  ['surabaya','機場巴士換乘總站','Purabaya / Bungurasih','Terminal Purabaya Bungurasih Sidoarjo','transport'],
  ['surabaya','朱安達機場 SUB','Juanda International Airport','Juanda International Airport SUB Sidoarjo','transport'],
];
export const PLACES = rows.map(([city, zh, name, query, kind], index) => ({id: `java-place-${index + 1}`, city, zh, name, query, kind}));
export function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
const SEARCH_CHARACTERS = {'羅':'罗','蘭':'兰','達':'达','瑪':'玛','烏':'乌','圖':'图','國':'国','館':'馆','銀':'银','戰':'战','爭':'争','園':'园','橋':'桥','獨':'独','門':'门','場':'场','頭':'头','廟':'庙','亞':'亚','廣':'广','車':'车','機':'机','總':'总','轉':'转','舊':'旧','華':'华','區':'区','優':'优','備':'备','選':'选','賽':'赛','傳':'传','統':'统','線':'线','觀':'观','點':'点','樓':'楼','務':'务'};
function normalizeSearch(value) {
  return value.toLocaleLowerCase().replace(/[羅蘭達瑪烏圖國館銀戰爭園橋獨門場頭廟亞廣車機總轉舊華區優備選賽傳統線觀點樓務]/g, (character) => SEARCH_CHARACTERS[character]);
}
export function filterPlaces(city, search) {
  const term = normalizeSearch(search.trim());
  return PLACES.filter((place) => (city === 'all' || place.city === city)
    && normalizeSearch(`${CITIES.find(([key]) => key === place.city).slice(1).join(' ')} ${place.zh} ${place.name} ${place.query} ${place.kind === 'stay' ? 'hotel hostel accommodation 酒店 住宿 青旅' : ''}`).includes(term));
}
