import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CITIES, PLACES, filterPlaces, mapsUrl} from './places.mjs';
import {DAY_TITLES, DAY_CITIES, ALERTS} from '../JavaTripPlanner/english.mjs';
import {buildCalendar} from '../JavaTripPlanner/calendar.mjs';

const zh = readFileSync(new URL('../../../pages/explore/travel/indonesia-java-10-day-jakarta-yogyakarta-surabaya/index.mdx', import.meta.url), 'utf8');
const en = readFileSync(new URL('../../../content/travel/indonesia-java.en.mdx', import.meta.url), 'utf8');
const headingIds = (text) => [...text.matchAll(/^#{2,3} .*?\{\/\* #([\w-]+) \*\/\}/gm)].map((match) => match[1]);

test('both language versions have exactly the same stable sections and ten daily anchors', () => {
  assert.deepEqual(headingIds(zh), headingIds(en));
  assert.equal(new Set(headingIds(en)).size, headingIds(en).length);
  assert.deepEqual(headingIds(en).filter((id) => /^d\d+$/.test(id)), Array.from({length:10}, (_, i) => `d${i + 1}`));
  assert.match(zh, /export const bilingual/);
  for (const body of [zh, en]) {
    assert.equal((body.match(/className="javaBooking__card"/g) ?? []).length, 6);
    assert.doesNotMatch(body, /\\\*|&#x[\da-f]+;/i);
  }
});

test('old Chinese deep links remain valid in both languages', () => {
  const aliases = (body) => [...body.matchAll(/<span id="([^"]+)" className="javaLegacyAnchor"/g)].map((match) => match[1]);
  assert.equal(aliases(zh).length, 25);
  assert.deepEqual(aliases(zh), aliases(en));
  assert.equal(new Set([...headingIds(en), ...aliases(en)]).size, headingIds(en).length + 25);
});

test('English preserves all budget categories, totals, dates and unbooked status', () => {
  const section = en.split('## Solo budget')[1].split('### Working target')[0];
  const rows = [...section.matchAll(/^\| (.+?) \| (?:\*\*)?Rp([\d,]+)(?:–([\d,]+))?(?:\*\*)? \|/gm)].map(([,label,low,high]) => ({label,low:Number(low.replaceAll(',', '')),high:Number((high ?? low).replaceAll(',', ''))}));
  const costs = rows.filter((row) => !row.label.includes('Ground total'));
  const total = rows.find((row) => row.label.includes('Ground total'));
  assert.equal(costs.length, 11);
  assert.equal(costs.reduce((sum,row) => sum + row.low,0), total.low);
  assert.equal(costs.reduce((sum,row) => sum + row.high,0), total.high);
  for (const amount of ['Rp8,880,000','Rp8,620,000','Rp9,600,000–10,500,000','Rp455,000','Rp400,000']) assert.ok(en.includes(amount));
  assert.match(en, /Only the first Jakarta night/);
  assert.match(en, /No purchase or seat hold/);
  assert.match(en, /after midnight, buy a 5 November ticket/);
  assert.match(en, /05:00 waterfall tour today/);
});

test('every map entry has a unique identity, correct area and safe Google search URL', () => {
  assert.ok(PLACES.length >= 60);
  assert.equal(new Set(PLACES.map((p) => p.id)).size, PLACES.length);
  assert.equal(new Set(PLACES.map((p) => p.query)).size, PLACES.length);
  for (const p of PLACES) {
    assert.ok(CITIES.some(([key]) => key === p.city));
    assert.ok(p.zh && p.name && p.query && p.kind);
    const url = new URL(mapsUrl(p.query));
    assert.equal(url.origin, 'https://www.google.com');
    assert.equal(url.pathname, '/maps/search/');
    assert.equal(url.searchParams.get('api'), '1');
    assert.equal(url.searchParams.get('query'), p.query);
  }
  assert.ok(PLACES.find((p) => p.query.includes('79-81 Kemayoran Jakarta Pusat')));
  assert.ok(PLACES.find((p) => p.name.includes('Kotalama') && p.kind === 'alternative'));
});

test('map filtering works in both languages, case-insensitively and with empty results', () => {
  assert.equal(filterPlaces('all', '').length, PLACES.length);
  assert.equal(filterPlaces('all', '  BOROBUDUR  ').length, 2);
  assert.equal(filterPlaces('all', '婆羅浮屠').length, 3);
  assert.equal(filterPlaces('all', '婆罗浮屠').length, 3);
  assert.ok(filterPlaces('all', '雅加达').length >= 20);
  assert.equal(filterPlaces('surabaya', 'Borobudur').length, 0);
  assert.ok(filterPlaces('all', 'PSE').some((p) => p.name.includes('Senen')));
  assert.equal(filterPlaces('jakarta', 'hotel').length, 1);
  for (const [city] of CITIES) assert.ok(filterPlaces(city, '').every((p) => p.city === city));
});

test('English calendar translates every day and every possible closure/prayer reminder', () => {
  assert.equal(DAY_TITLES.length, 10);
  assert.equal(DAY_CITIES.length, 10);
  for (let date = 1; date <= 7; date++) {
    for (const alert of buildCalendar(`2026-10-0${date}`).alerts) assert.ok(ALERTS[alert.code]);
  }
});
