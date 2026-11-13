import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {filterPlaces, mapUrl, restoreChecks} from './model.mjs';
import {cebu} from '../../../content/travel/cebu.mjs';

test('map searches encode place names without treating them as verified entrances', () => {
  const url = new URL(mapUrl('Argao & Cebu / 教堂'));
  assert.equal(url.origin, 'https://www.google.com');
  assert.equal(url.searchParams.get('query'), 'Argao & Cebu / 教堂');
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
  }
  assert.equal([800,400,450,350,250,100,200].reduce((a,b)=>a+b),2550);
  assert.equal([800,720,630,600,500,180,300].reduce((a,b)=>a+b),3730);
  for (const records of [cebu.tasks,cebu.places,cebu.facts]) assert.equal(new Set(records.map((r)=>r.id)).size, records.length);
  for (const place of cebu.places) for (const field of ['id','zh','en','query','day','area']) assert.ok(place[field], `${place.id}: ${field}`);
});
