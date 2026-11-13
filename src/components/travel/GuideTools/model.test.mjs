import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {filterPlaces, mapUrl, restoreChecks} from './model.mjs';
import {cebu} from '../../../content/travel/cebu.mjs';
import {cambodia} from '../../../content/travel/cambodia.mjs';

function verifyPublishedBudget(source) {
  const section = source.split('/* #budget */}')[1]?.split('\n## ')[0] ?? '';
  const rows = [...section.matchAll(/^\|[^|\r\n]+\|\s*(?:\*\*)?(?:¥|CNY|US\$)([\d,]+)(?:\*\*)?\s*\|\s*(?:\*\*)?(?:¥|CNY|US\$)([\d,]+)(?:\*\*)?\s*\|/gm)]
    .map((match) => [Number(match[1].replaceAll(',','')), Number(match[2].replaceAll(',',''))]);
  assert.ok(rows.length >= 8, 'Published budget rows were not parsed');
  const total = rows.at(-1);
  for (let column = 0; column < 2; column++) assert.equal(rows.slice(0,-1).reduce((sum,row)=>sum+row[column],0), total[column], 'Published budget does not sum');
}

test('map searches encode place names without treating them as verified entrances', () => {
  const url = new URL(mapUrl('Argao & Cebu / 教堂'));
  assert.equal(url.origin, 'https://www.google.com');
  assert.equal(url.searchParams.get('query'), 'Argao & Cebu / 教堂');
});

test('Cambodia preserves four park days, seven-day pass and a separate travel-notes status', () => {
  for (const file of ['src/pages/explore/travel/cambodia-10-day-phnom-penh-siem-reap-angkor/index.mdx','src/content/travel/cambodia.en.mdx']) {
    const source = fs.readFileSync(file, 'utf8');
    assert.deepEqual([...source.matchAll(/^### D(\d+)\b/gm)].map((m) => Number(m[1])), [1,2,3,4,5,6,7,8,9,10]);
    for (const id of ['route','heritage','departure-kit','advance-booking','calendar','budget','risk','seasonal','maps','sources']) assert.ok(source.includes(`#${id} */}`), `${file}: ${id}`);
    assert.ok(source.includes('US$72') && source.includes('US$62'));
    assert.ok(source.includes('KTI') && source.includes('SAI'));
    assert.ok(!/\\\*|&#x[0-9a-f]+;/i.test(source));
    verifyPublishedBudget(source);
  }
  assert.equal([90,100,65,90,40,72,45,30,15,40].reduce((a,b)=>a+b),587);
  assert.equal([180,160,110,150,80,72,65,30,30,60].reduce((a,b)=>a+b),937);
  assert.notEqual(cebu.id, cambodia.id);
  for (const records of [cambodia.tasks,cambodia.places,cambodia.facts]) assert.equal(new Set(records.map((r)=>r.id)).size, records.length);
  for (const place of cambodia.places) for (const field of ['id','zh','en','query','day','area']) assert.ok(place[field], `${place.id}: ${field}`);
  assert.equal(filterPlaces(cambodia.places,'巴戎').length,1);
  assert.equal(filterPlaces(cambodia.places,'Bayon').length,1);
  assert.deepEqual(restoreChecks('{"pass":true,"entry":true,"water":true}',cambodia.tasks),{entry:true,pass:true});
});

test('search supports both languages, areas and days', () => {
  assert.equal(filterPlaces(cebu.places, '').length, cebu.places.length);
  assert.ok(filterPlaces(cebu.places, '博物館').length >= 3);
  assert.ok(filterPlaces(cebu.places, 'moalboal').length >= 3);
  assert.ok(filterPlaces(cebu.places, 'D9').some((place) => place.id === 'ceb'));
  assert.equal(filterPlaces(cebu.places, 'no such site').length, 0);
});

test('checklist ignores corrupted and obsolete browser state', () => {
  assert.deepEqual(restoreChecks('{broken', cebu.tasks), {});
  assert.deepEqual(restoreChecks('null', cebu.tasks), {});
  assert.deepEqual(restoreChecks('[true]', cebu.tasks), {});
  assert.deepEqual(restoreChecks('{"entry":true,"flight":"true","obsolete":true}', cebu.tasks), {entry:true});
});

test('Cebu content has complete bilingual day anchors and correct budget arithmetic', () => {
  for (const file of ['src/pages/explore/travel/philippines-cebu-9-day-heritage-coast-highlands/index.mdx','src/content/travel/cebu.en.mdx']) {
    const source = fs.readFileSync(file, 'utf8');
    assert.deepEqual([...source.matchAll(/^### D(\d+)\b/gm)].map((m) => Number(m[1])), [1,2,3,4,5,6,7,8,9]);
    for (const id of ['route','departure-kit','advance-booking','calendar','budget','risk','seasonal','maps','sources']) assert.ok(source.includes(`#${id} */}`), `${file}: ${id}`);
    assert.ok(!/\\\*|&#x[0-9a-f]+;/i.test(source));
    verifyPublishedBudget(source);
  }
  assert.equal([800,400,450,350,250,100,200].reduce((a,b)=>a+b),2550);
  assert.equal([800,720,630,600,500,180,300].reduce((a,b)=>a+b),3730);
  for (const records of [cebu.tasks,cebu.places,cebu.facts]) assert.equal(new Set(records.map((r)=>r.id)).size, records.length);
  for (const place of cebu.places) for (const field of ['id','zh','en','query','day','area']) assert.ok(place[field], `${place.id}: ${field}`);
});
