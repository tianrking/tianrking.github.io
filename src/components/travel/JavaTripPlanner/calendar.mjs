const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

export const MAX_START_DATE = '9999-12-22';

const ITINERARY = [
  { title: '抵達雅加達', city: '雅加達 Jakarta', stay: '雅加達' },
  { title: '銀行博物館、老城與獨立清真寺', city: '雅加達 Jakarta', stay: '雅加達' },
  { title: 'Glodok 華人街區與 Sunda Kelapa 舊港', city: '雅加達 Jakarta', stay: '雅加達' },
  { title: '火車前往日惹', city: '雅加達 → 日惹', stay: '日惹' },
  { title: '婆羅浮屠與周邊小寺', city: '日惹 → 馬格朗 → 日惹', stay: '日惹' },
  { title: '蘇丹王宮、水宮與歷史博物館', city: '日惹 Yogyakarta', stay: '日惹' },
  { title: '普蘭巴南與 Sewu 寺群', city: '日惹與普蘭巴南', stay: '日惹' },
  { title: '火車前往泗水', city: '日惹 → 泗水', stay: '泗水' },
  { title: '戰爭墓園、獨立史與 Ampel', city: '泗水 Surabaya', stay: '泗水' },
  { title: '前往 SUB 機場返程', city: '泗水 → 朱安達機場', stay: null },
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
      code: 'jakarta-monday',
      severity: 'closure',
      text: '週一閉館衝突：印尼銀行博物館與國家博物館不適合排在今天。調整出發日，或把館舍安排到抵達當天的開放時段；不要直接照原順序走。',
    }];
    if (day === 6) return [{
      code: 'yogyakarta-monday',
      severity: 'closure',
      text: '週一閉館衝突：王宮與歷史博物館的安排需調整。建議交換 D5、D6，把週一留給婆羅浮屠；仍須預訂對應日期的票。',
    }];
    if (day === 7) return [{
      code: 'prambanan-monday',
      severity: 'closure',
      text: '週一參觀限制：普蘭巴南主寺台院 Zone 1 不開放，只能參觀園區 Zone 2。建議交換 D5、D7，把週一留給婆羅浮屠。',
    }];
    if (day === 9) return [{
      code: 'surabaya-monday',
      severity: 'closure',
      text: '週一閉館衝突：十一月十日博物館閉館。調整出發日或確認館方是否有特別開放；墓園與老城不能代替館內參觀。',
    }];
  }
  if (day === 2 && weekday === 5) return [{
    code: 'jakarta-friday',
    severity: 'prayer',
    text: '週五禮拜提醒：獨立清真寺遊客參觀需避開聚禮，依當日接待安排；銀行博物館的午間休息也可能較長。',
  }];
  return [];
}

export function buildCalendar(startValue) {
  const blank = { days: [], stays: [], alerts: [], totalNights: 0 };
  if (startValue === '') return { ...blank, status: 'empty', error: '' };
  const start = parseISODate(startValue);
  if (!start || startValue > MAX_START_DATE) return {
    ...blank,
    status: 'invalid',
    error: '請選擇有效的出發日期，且日期不晚於 9999-12-23。',
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
    { city: '雅加達', startOffset: 0, nights: 3 },
    { city: '日惹', startOffset: 3, nights: 4 },
    { city: '泗水', startOffset: 7, nights: 2 },
  ].map(({ city, startOffset, nights }) => ({
    city,
    nights,
    checkIn: formatISODate(dateAtOffset(start, startOffset)),
    checkOut: formatISODate(dateAtOffset(start, startOffset + nights)),
  }));

  return {
    status: 'ready',
    error: '',
    days,
    stays,
    alerts: days.flatMap(({ day, date, alerts }) => alerts.map((alert) => ({ ...alert, day, date }))),
    totalNights: stays.reduce((sum, stay) => sum + stay.nights, 0),
  };
}
