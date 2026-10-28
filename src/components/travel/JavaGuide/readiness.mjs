export const READINESS_KEY = 'java-trip-2026-readiness-v1';
export const HOTEL_ADDRESS = 'Jl. Bungur Besar Raya No.79-81, Kemayoran, Jakarta Pusat, Jakarta 10620, Indonesia';
export const TASKS = [
  {id:'arrival', zh:'已按機票核對落地日期、時刻及首兩晚酒店；若 10/31 到已確認保留房', en:'Checked ticketed arrival date/time and first two hotel nights; room held if arriving on 31 Oct', anchor:'jakarta-stay'},
  {id:'trains', zh:'已核對兩段夜車票面：11/01 晚、11/05 凌晨', en:'Checked both train tickets: 1 Nov evening and 5 Nov after midnight', anchor:'transport'},
  {id:'temples', zh:'兩寺必去：已核對 11/03 登塔場次及提前報到交通、11/04 普蘭巴南票', en:'Both temples essential: checked 3 Nov structure session, early reporting transport and 4 Nov Prambanan ticket', anchor:'advance-booking'},
  {id:'nature', zh:'已取得單人含費總價、山腳酒店、具體入口／日出點、泗水送達與關閉退款確認', en:'Confirmed solo total, mountain hotel, entrance/viewpoint, Surabaya drop-off and closure refunds', anchor:'nature-tour'},
  {id:'entry', zh:'已準備簽證、護照、離境票；按實際抵達日填申報，10/31 到則 10/28 起', en:'Prepared visa, passport and onward ticket; declaration follows actual arrival, from 28 Oct if arriving 31 Oct', anchor:'entry'},
  {id:'connection', zh:'已核對 SQ929／TR982、HKG 直掛行李、SGAC、11/08 晚到酒店及 11/09 13:00 前回 T1', en:'Checked SQ929 / TR982, bags through to HKG, SGAC, 8 Nov late-arrival hotel and return to T1 before 13:00 on 9 Nov', anchor:'singapore-stopover'},
  {id:'offline', zh:'已存離線票券、地圖、保險與接送聯絡方式', en:'Saved offline tickets, maps, insurance and transfer contacts', anchor:'booking-details'},
];

export function readTasks(raw) {
  try {
    const saved = JSON.parse(raw);
    return Array.isArray(saved) ? TASKS.filter(({id}) => saved.includes(id)).map(({id}) => id) : [];
  } catch { return []; }
}
