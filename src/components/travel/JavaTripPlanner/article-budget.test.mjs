import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const article = readFileSync(new URL(
  '../../../pages/explore/travel/indonesia-java-10-day-jakarta-yogyakarta-surabaya/index.mdx',
  import.meta.url,
), 'utf8');

test('published ground budget sums all eleven categories without counting the mountain room twice', () => {
  const section = article.split('## 一人預算')[1].split('## 用餐')[0];
  const rows = [...section.matchAll(/^\| (.+?) \| (?:\*\*)?Rp([\d,]+)(?:–([\d,]+))?(?:\*\*)? \|/gm)]
    .map(([, label, low, high]) => ({
      label,
      low: Number(low.replaceAll(',', '')),
      high: Number((high ?? low).replaceAll(',', '')),
    }));
  const total = rows.find((row) => row.label.includes('地面合計'));
  const costs = rows.filter((row) => !row.label.includes('地面合計'));
  assert.equal(costs.length, 11);
  assert.equal(total.low, costs.reduce((sum, row) => sum + row.low, 0));
  assert.equal(total.high, costs.reduce((sum, row) => sum + row.high, 0));
  assert.match(section, /八晚城市床位/);
  assert.match(section, /山腳房與泗水送達/);
  assert.match(section, /不含國際機票/);
});

test('working budget and private-room adjustments remain arithmetically consistent', () => {
  const target = [1040000, 1000000, 650000, 600000, 500000, 950000,
    450000, 2500000, 500000, 150000, 700000].reduce((sum, cost) => sum + cost, 0);
  assert.ok(article.includes(`Rp${target.toLocaleString('en-US')}`));
  assert.equal(target + 2000000 - 1040000, 10000000);
  assert.equal(target + 3200000 - 1040000, 11200000);
  assert.match(article, /Rp10,000,000–11,200,000/);
  assert.match(article, /規劃換算 1 元人民幣＝Rp2,200/);
  assert.match(article, /不是查得的即期匯率/);
});
