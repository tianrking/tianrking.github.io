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
  assert.match(section, /六晚城市床位參考/);
  assert.match(section, /山腳房與泗水送達/);
  assert.match(section, /不含國際機票/);
});

test('working budget and private-room adjustments remain arithmetically consistent', () => {
  const target = [780000, 1000000, 750000, 600000, 500000, 950000,
    450000, 2500000, 500000, 150000, 700000].reduce((sum, cost) => sum + cost, 0);
  assert.ok(article.includes(`Rp${target.toLocaleString('en-US')}`));
  assert.equal(target + 1500000 - 780000, 9600000);
  assert.equal(target + 2400000 - 780000, 10500000);
  assert.match(article, /Rp9,600,000–10,500,000/);
  assert.equal(target - 780000 + 4 * 130000, 8620000);
  assert.match(article, /Rp8,620,000＋10\/30 酒店實價＋10\/31 酒店實價/);
  assert.match(article, /規劃換算 1 元人民幣＝Rp2,200/);
  assert.match(article, /不是查得的即期匯率/);
});

test('article aligns booked first night, proposed extension, overnight ticket dates and rest day', () => {
  assert.match(article, /首晚已訂/);
  assert.match(article, /第二晚補訂 10\/31 → 11\/01/);
  assert.match(article, /尚未收到第二晚訂單/);
  assert.match(article, /七晚酒店：2＋2＋1＋1＋1/);
  assert.match(article, /若 00 點後出發，搜尋與購票日期用 \*\*11\/05\*\*/);
  assert.match(article, /今天不接 05:00 瀑布團/);
  assert.match(article, /提前入住／日間房費/);
  assert.doesNotMatch(article, /八晚城市床位|雅加達三晚|日惹三晚|共九晚：/);
});
