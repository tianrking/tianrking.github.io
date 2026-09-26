import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCalendar, formatISODate, MAX_START_DATE, parseISODate } from './calendar.mjs';

test('empty input keeps the planner unselected', () => {
  assert.deepEqual(buildCalendar(''), {
    status: 'empty', error: '', days: [], stays: [], alerts: [], totalNights: 0,
  });
});

test('rejects invalid dates without JavaScript rollover', () => {
  for (const value of [
    '2026-02-31', '2026-02-29', '2026-04-31', '2026-13-01', '2026-00-01',
    '2026-09-00', '2026-09-32', '2026-9-01', '26-09-01', '0000-01-01',
    'not-a-date', '2026-09-14T00:00:00Z', ' 2026-09-14', undefined, null, 20260914,
  ]) {
    assert.equal(parseISODate(value), null, String(value));
    assert.equal(buildCalendar(value).status, 'invalid', String(value));
    assert.deepEqual(buildCalendar(value).days, [], String(value));
  }
});

test('handles leap years and century rules', () => {
  assert.equal(parseISODate('1900-02-29'), null);
  assert.equal(formatISODate(parseISODate('2000-02-29')), '2000-02-29');
  assert.equal(formatISODate(parseISODate('2028-02-29')), '2028-02-29');
  assert.equal(formatISODate(parseISODate('0001-01-01')), '0001-01-01');
  const result = buildCalendar('2028-02-27');
  assert.deepEqual(result.days.slice(0, 4).map((day) => day.date), [
    '2028-02-27', '2028-02-28', '2028-02-29', '2028-03-01',
  ]);
});

test('crosses month and year boundaries with ten consecutive UTC dates', () => {
  for (const start of ['2026-01-29', '2026-02-25', '2026-12-28', '2026-03-07', '2026-10-31']) {
    const result = buildCalendar(start);
    assert.equal(result.status, 'ready');
    assert.equal(result.days.length, 10);
    assert.equal(result.days[0].date, start);
    for (let index = 1; index < result.days.length; index += 1) {
      assert.equal(
        parseISODate(result.days[index].date).getTime() - parseISODate(result.days[index - 1].date).getTime(),
        86_400_000,
      );
    }
  }
  assert.equal(buildCalendar('2026-12-28').days.at(-1).date, '2027-01-06');
});

test('keeps the complete trip within the supported four-digit year range', () => {
  assert.equal(buildCalendar(MAX_START_DATE).days.at(-1).date, '9999-12-31');
  assert.equal(buildCalendar('9999-12-23').status, 'invalid');
});

test('all seven departure weekdays produce the exact closure and prayer warnings', () => {
  const cases = [
    ['2026-09-13', ['jakarta-monday', 'surabaya-monday']],
    ['2026-09-14', []],
    ['2026-09-15', ['yogyakarta-culture-monday']],
    ['2026-09-16', ['yogyakarta-monday']],
    ['2026-09-17', ['jakarta-friday']],
    ['2026-09-18', ['monas-monday']],
    ['2026-09-19', []],
  ];
  cases.forEach(([start, expectedCodes], startWeekday) => {
    const result = buildCalendar(start);
    assert.equal(result.days[0].weekday, startWeekday);
    assert.deepEqual(result.alerts.map((alert) => alert.code), expectedCodes, start);
    result.days.forEach((day, index) => assert.equal(day.weekday, (startWeekday + index) % 7));
  });
});

test('Monday warnings identify the combined temple day and culture-day closures', () => {
  const templeMonday = buildCalendar('2026-09-16');
  assert.equal(templeMonday.days[5].weekday, 1);
  assert.match(templeMonday.days[5].alerts[0].text, /普蘭巴南主寺區/);
  assert.match(templeMonday.days[5].title, /婆羅浮屠、普蘭巴南與 Sewu/);
  const cultureMonday = buildCalendar('2026-09-15');
  assert.equal(cultureMonday.days[6].weekday, 1);
  assert.match(cultureMonday.days[6].alerts[0].text, /王宮與 Vredeburg/);
});

test('hotel intervals are contiguous 4 + 3 + 2 nights, ending on D10', () => {
  for (let day = 13; day <= 19; day += 1) {
    const result = buildCalendar(`2026-09-${day}`);
    assert.deepEqual(result.stays.map((stay) => stay.nights), [4, 3, 2]);
    assert.equal(result.totalNights, 9);
    assert.equal(result.stays[0].checkIn, result.days[0].date);
    assert.equal(result.stays[0].checkOut, result.days[4].date);
    assert.equal(result.stays[1].checkIn, result.stays[0].checkOut);
    assert.equal(result.stays[1].checkOut, result.days[7].date);
    assert.equal(result.stays[2].checkIn, result.stays[1].checkOut);
    assert.equal(result.stays[2].checkOut, result.days[9].date);
    assert.deepEqual(result.days.map((entry) => entry.stay), [
      '雅加達', '雅加達', '雅加達', '雅加達', '日惹', '日惹', '日惹', '泗水', '泗水', null,
    ]);
    for (const stay of result.stays) {
      assert.equal((parseISODate(stay.checkOut) - parseISODate(stay.checkIn)) / 86_400_000, stay.nights);
    }
  }
});

test('results do not leak mutations between calculations and clear restores initial state', () => {
  const first = buildCalendar('2026-09-13');
  first.days[0].title = 'changed';
  first.days[1].alerts[0].text = 'changed';
  const second = buildCalendar('2026-09-13');
  assert.equal(second.days[0].title, '抵達雅加達');
  assert.notEqual(second.days[1].alerts[0].text, 'changed');
  assert.equal(buildCalendar('').status, 'empty');
  assert.deepEqual(buildCalendar('').stays, []);
});
