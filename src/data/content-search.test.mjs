import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {findDocuments, makeSearchIndex, normalizeSearch} from './content-search.mjs';

const articles = JSON.parse(readFileSync(new URL('./travel-series-catalog.json', import.meta.url)));
const index = makeSearchIndex(articles);

test('simplified, traditional and local names prioritize the destination title', () => {
  for (const search of ['宿务','宿務','Cebu','ＣＥＢＵ']) {
    assert.equal(findDocuments(index,search)[0].slug,'philippines-cebu-9-day-heritage-coast-highlands');
  }
  assert.equal(findDocuments(index,'Corregidor')[0].slug,'philippines-manila-corregidor-travel-notes');
  assert.equal(normalizeSearch('博物館'),normalizeSearch('博物馆'));
});

test('multiple terms may match separate fields, but every term is required', () => {
  const results = findDocuments(index,'博物馆 Cebu');
  assert.equal(results[0].slug,'philippines-cebu-9-day-heritage-coast-highlands');
  assert.deepEqual(findDocuments(index,'宿务不存在的字 xyznoarticle'),[]);
  assert.equal(findDocuments(index,'Cebu',(article)=>article.kind==='record')[0].slug,'philippines-manila-corregidor-travel-notes');
});

test('empty queries preserve chosen browse order; title relevance beats partial metadata', () => {
  const docs = [
    {id:1,title:'Boot notes',keywords:['ble'],description:'BLE testing'},
    {id:2,title:'BLE timing',keywords:[],description:'Hardware testing'},
  ];
  const idx = makeSearchIndex(docs);
  assert.deepEqual(findDocuments(idx,''),docs);
  assert.deepEqual(findDocuments(idx,'低功耗蓝牙 testing').map(({id})=>id),[2,1]);
});
