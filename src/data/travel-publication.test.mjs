import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {COMPLETED_TRAVEL_SLUGS, travelPublicationKind} from './travel-publication.mjs';

const catalog = JSON.parse(fs.readFileSync(new URL('./travel-series-catalog.json',import.meta.url),'utf8'));
test('three completed journey articles are primary peers, not future-plan companions', () => {
  assert.deepEqual(catalog.filter((entry)=>entry.kind==='record').map((entry)=>entry.slug),COMPLETED_TRAVEL_SLUGS);
  assert.equal(catalog.length,51);
  assert.equal(new Set(catalog.map((entry)=>entry.slug)).size,catalog.length);
  const manila=catalog.find((entry)=>entry.slug===COMPLETED_TRAVEL_SLUGS[2]);
  assert.equal(manila.issue,8);
  assert.equal(manila.days,null);
  assert.equal(manila.nights,null);
  assert.ok(!catalog.some((entry)=>entry.companionRoutes.includes(manila.route)));
  const hub=fs.readFileSync(new URL('../pages/explore/index.js',import.meta.url),'utf8');
  for (const id of ['featured-travel','featured-indonesia','featured-manila']) assert.ok(hub.includes(`id="${id}"`));
  const theme=fs.readFileSync(new URL('../theme/MDXPage/index.js',import.meta.url),'utf8');
  const companions=theme.split('const companionIssues = {')[1].split('};')[0];
  assert.ok(!companions.includes(manila.slug));
});

test('Cebu and every other untravelled article remain identifiable plans',()=>{
  const plans=catalog.filter((entry)=>entry.kind==='plan');
  assert.equal(plans.length,48);
  assert.ok(plans.some((entry)=>entry.slug==='philippines-cebu-9-day-heritage-coast-highlands' && entry.days===9));
  assert.equal(travelPublicationKind('unconfirmed-country-or-trip'),'plan');
  for (const entry of catalog) assert.equal(entry.kind,travelPublicationKind(entry.slug));
  const listing=fs.readFileSync(new URL('../pages/explore/travel/index.js',import.meta.url),'utf8');
  assert.ok(listing.includes('id="completed-heading"') && listing.includes('id="plans-heading"'));
});
