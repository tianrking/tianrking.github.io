const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

export const MAX_START_DATE = '9999-12-22';
export const TRIP_START_DATE = '2026-10-30';

const ITINERARY = [
  { title: '抵達雅加達', city: '雅加達 Jakarta', stay: '雅加達' },
  { title: '海事館、Kota Tua、銀行館與 Glodok', city: '雅加達 Jakarta', stay: '雅加達' },
  { title: '國家博物館、宗教建築與金融軸，晚間夜車', city: '雅加達 → 日惹', stay: null, overnight: '雅加達 → 日惹夜火車' },
  { title: '清晨到日惹，水宮與老街、休整', city: '日惹 Yogyakarta', stay: '日惹' },
  { title: '婆羅浮屠登塔，Mendut／Pawon 條件支線', city: '日惹 → 馬格朗 → 日惹', stay: '日惹' },
  { title: '上午王宮，下午普蘭巴南與 Sewu，深夜夜車', city: '日惹 → 普蘭巴南 → 日惹 → 瑪琅', stay: null, overnight: '日惹 → 瑪琅夜火車' },
  { title: '清晨到瑪琅，休整與市內歷史街區', city: '瑪琅 Malang', stay: '瑪琅' },
  { title: 'Tumpak Sewu 瀑布，夜宿布羅莫山腳', city: '瑪琅 → Tumpak Sewu → 布羅莫', stay: '布羅莫山腳' },
  { title: '布羅莫日出，下午返回泗水', city: '布羅莫 → 泗水 Surabaya', stay: '泗水' },
  { title: '泗水戰爭墓園與老城，22:00 飛香港', city: '泗水 → SUB → 香港 HKG', stay: null },
];

// A round-trip check rejects impossible dates instead of normalising them.
export function parseISODate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
    ? date
    : null;
}

export function formatISODate(date) {
  return [
    String(date.getUTCFullYear()).padStart(4, '0'),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

function dateAtOffset(start, offset) {
  return new Date(start.getTime() + offset * DAY_MS);
}

function alertsForDay(day, weekday) {
  if (weekday === 1) {
    if (day === 2) return [{
      code: 'jakarta-oldtown-monday',
      severity: 'closure',
      text: '週一閉館衝突：印尼銀行博物館與海事博物館閉館。這是移動日期後的衝突，須重排雅加達館舍日。',
    }];
    if (day === 3) return [{
      code: 'jakarta-national-monday',
      severity: 'closure',
      text: '週一閉館衝突：國家博物館閉館。Monas 也不能作為保證開放的替補，須核對管理方公告。',
    }];
    if (day === 6) return [{
      code: 'yogyakarta-monday',
      severity: 'closure',
      text: '週一參觀衝突：上午王宮閉館，下午普蘭巴南主寺區 Zone 1 有限制。調整文化與寺群日；婆羅浮屠登塔每日開放仍須選票面時段。',
    }];
    if (day === 10) return [{
      code: 'surabaya-monday',
      severity: 'closure',
      text: '週一閉館衝突：十一月十日博物館閉館。調整出發日或確認館方是否有特別開放；墓園與老城不能代替館內參觀。',
    }];
  }
  if (day === 3 && weekday === 5) return [{
    code: 'jakarta-friday',
    severity: 'prayer',
    text: '週五禮拜提醒：獨立清真寺遊客參觀需避開聚禮，依當日接待安排，不把午後接待當成已確認預約。',
  }];
  return [];
}

export function buildCalendar(startValue) {
  const blank = { days: [], stays: [], overnightTransfers: [], alerts: [], totalNights: 0, hotelNights: 0, trainNights: 0 };
  if (startValue === '') return { ...blank, status: 'empty', error: '' };
  const start = parseISODate(startValue);
  if (!start || startValue > MAX_START_DATE) return {
    ...blank,
    status: 'invalid',
    error: `請選擇有效的出發日期，且日期不晚於 ${MAX_START_DATE}。`,
  };

  const days = ITINERARY.map((item, index) => {
    const date = dateAtOffset(start, index);
    const day = index + 1;
    const weekday = date.getUTCDay();
    return {
      ...item,
      day,
      date: formatISODate(date),
      weekday,
      weekdayLabel: WEEKDAYS[weekday],
      alerts: alertsForDay(day, weekday),
    };
  });
  const stays = [
    { city: '雅加達', startOffset: 0, nights: 2 },
    { city: '日惹', startOffset: 3, nights: 2 },
    { city: '瑪琅', startOffset: 6, nights: 1 },
    { city: '布羅莫山腳', startOffset: 7, nights: 1 },
    { city: '泗水', startOffset: 8, nights: 1 },
  ].map(({ city, startOffset, nights }) => ({
    city,
    nights,
    checkIn: formatISODate(dateAtOffset(start, startOffset)),
    checkOut: formatISODate(dateAtOffset(start, startOffset + nights)),
  }));

  const overnightTransfers = [
    { route: '雅加達 → 日惹', startOffset: 2, ticketOffset: 2 },
    { route: '日惹 → 瑪琅', startOffset: 5, ticketOffset: 6 },
  ].map(({ route, startOffset, ticketOffset }) => ({
    route,
    nightDate: formatISODate(dateAtOffset(start, startOffset)),
    arrivalDate: formatISODate(dateAtOffset(start, startOffset + 1)),
    targetTicketDate: formatISODate(dateAtOffset(start, ticketOffset)),
  }));
  const hotelNights = stays.reduce((sum, stay) => sum + stay.nights, 0);

  return {
    status: 'ready',
    error: '',
    days,
    stays,
    overnightTransfers,
    alerts: days.flatMap(({ day, date, alerts }) => alerts.map((alert) => ({ ...alert, day, date }))),
    hotelNights,
    trainNights: overnightTransfers.length,
    totalNights: hotelNights + overnightTransfers.length,
  };
}
