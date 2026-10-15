export const READINESS_KEY = 'java-trip-2026-readiness-v1';
export const HOTEL_ADDRESS = 'Jl. Bungur Besar Raya No.79-81, Kemayoran, Jakarta Pusat, Jakarta 10620, Indonesia';
export const TASKS = [
  {id:'arrival', zh:'已確認 10/31 落地時間、10/30 房間保留及第二晚安排', en:'Confirmed 31 Oct landing time, held 30 Oct room and second-night arrangements', anchor:'jakarta-stay'},
  {id:'trains', zh:'已核對兩段夜車票面：11/01 晚、11/05 凌晨', en:'Checked both train tickets: 1 Nov evening and 5 Nov after midnight', anchor:'transport'},
  {id:'temples', zh:'已核對 11/03 外籍登塔票及 11/04 普蘭巴南票', en:'Checked 3 Nov foreign structure access and 4 Nov Prambanan admission', anchor:'advance-booking'},
  {id:'nature', zh:'已取得 11/06–07 單人全程報價、山腳房及泗水送達確認', en:'Confirmed 6–7 Nov solo quote, mountain room and Surabaya drop-off', anchor:'nature-tour'},
  {id:'entry', zh:'已準備簽證、護照、離境票；10/28 起填入境申報', en:'Prepared visa, passport and onward ticket; arrival declaration from 28 Oct', anchor:'entry'},
  {id:'offline', zh:'已存離線票券、地圖、保險與接送聯絡方式', en:'Saved offline tickets, maps, insurance and transfer contacts', anchor:'booking-details'},
];

export function readTasks(raw) {
  try {
    const saved = JSON.parse(raw);
    return Array.isArray(saved) ? TASKS.filter(({id}) => saved.includes(id)).map(({id}) => id) : [];
  } catch { return []; }
}
