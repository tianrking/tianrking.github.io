import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(scriptDirectory, '..');
const travelDirectory = path.join(rootDirectory, 'src/pages/explore/travel');
const order = JSON.parse(
  await fs.readFile(path.join(rootDirectory, 'src/data/travel-series-order.json'), 'utf8'),
);

const malaysiaGuidePath = path.join(travelDirectory, 'malaysia-peninsula-9-day/index.jsx');
const malaysiaGuide = await fs.readFile(malaysiaGuidePath, 'utf8');
const malaysiaDays = [...malaysiaGuide.matchAll(/^\s+day:\s*(\d+),$/gm)].map((match) => Number(match[1]));
if (malaysiaDays.join(',') !== '1,2,3,4,5,6,7,8,9') {
  throw new Error(`Travel Series / 01 must contain nine complete daily records: ${malaysiaGuidePath}`);
}
for (const requiredFeature of ['TRAVEL SERIES / 01', 'MapRouteLinks', '完整行程明細', '住宿：', '預算']) {
  if (!malaysiaGuide.includes(requiredFeature)) {
    throw new Error(`Travel Series / 01 is missing required guide feature "${requiredFeature}": ${malaysiaGuidePath}`);
  }
}

// These destinations currently have explicit regional security/airspace caveats
// in their article bodies. Keep the catalog badges aligned with that guidance;
// review this set whenever the dated advisories in those articles are refreshed.
const conditionalTravelSlugs = new Set([
  'uae-10-day-dubai-abu-dhabi-al-ain',
  'russia-10-day-siberia-baikal',
  'saudi-arabia-10-day-riyadh-alula-jeddah',
  'qatar-10-day-doha-north-desert',
  'bahrain-10-day-manama-dilmun-pearling',
  'kuwait-10-day-kuwait-city-failaka-heritage',
  'oman-10-day-muscat-sur-nizwa',
]);

const regionSlugs = new Map([
  ['東南亞', [
    'malaysia-peninsula-9-day',
    'indonesia-java-10-day-jakarta-yogyakarta-surabaya',
    'myanmar-10-day-conditional-heritage',
    'vietnam-north-10-day-hanoi-ninh-binh-sapa',
    'cambodia-10-day-phnom-penh-battambang-angkor',
    'laos-10-day-vientiane-vang-vieng-luang-prabang',
    'philippines-10-day-manila-cebu-bohol',
    'thailand-10-day-bangkok-ayutthaya-chiang-mai',
    'brunei-10-day-bandar-temburong-tutong-belait',
    'singapore-10-day-city-heritage-nature',
    'timor-leste-10-day-dili-atauro-baucau',
  ]],
  ['南亞', [
    'sri-lanka-10-day-cultural-highlands-south',
    'india-10-day-delhi-agra-jaipur',
    'nepal-10-day-kathmandu-pokhara-heritage-mountains',
    'bangladesh-10-day-dhaka-sylhet-sreemangal',
    'pakistan-10-day-islamabad-taxila-lahore',
    'bhutan-10-day-paro-thimphu-punakha',
    'maldives-10-day-male-maafushi-gulhi',
    'afghanistan-10-day-conditional-heritage',
  ]],
  ['東亞', [
    'taiwan-10-day-taipei-hualien-taitung-kaohsiung',
    'china-10-day-beijing-xian-shanghai',
    'japan-10-day-tokyo-kyoto-nara-osaka',
    'south-korea-10-day-seoul-gyeongju-busan',
    'mongolia-10-day-ulaanbaatar-kharkhorin-orkhon-terelj',
    'north-korea-10-day-conditional-tour-framework',
  ]],
  ['中亞', [
    'kazakhstan-10-day-almaty-saty-astana',
    'kyrgyzstan-10-day-bishkek-issyk-kul-song-kol',
    'tajikistan-10-day-dushanbe-fann-haftkul',
    'turkmenistan-10-day-ashgabat-mary-darvaza',
    'uzbekistan-10-day-silk-road-tashkent-khiva',
  ]],
  ['高加索與東地中海', [
    'armenia-10-day-yerevan-dilijan-gyumri',
    'azerbaijan-10-day-baku-sheki-gobustan',
    'georgia-10-day-tbilisi-kazbegi-kakheti',
    'cyprus-10-day-larnaca-nicosia-troodos-paphos',
    'turkiye-10-day-istanbul-cappadocia-ephesus',
  ]],
  ['西亞', [
    'iran-10-day-conditional-culture',
    'iraq-10-day-conditional-heritage',
    'israel-10-day-tel-aviv-haifa-jerusalem',
    'palestine-10-day-west-bank-heritage',
    'lebanon-10-day-beirut-byblos-qadisha',
    'jordan-10-day-amman-jerash-petra-wadi-rum',
    'syria-10-day-damascus-aleppo-conditional',
    'saudi-arabia-10-day-riyadh-alula-jeddah',
    'uae-10-day-dubai-abu-dhabi-al-ain',
    'qatar-10-day-doha-north-desert',
    'bahrain-10-day-manama-dilmun-pearling',
    'kuwait-10-day-kuwait-city-failaka-heritage',
    'oman-10-day-muscat-sur-nizwa',
    'yemen-10-day-sanaa-hadramaut-conditional',
  ]],
  ['歐亞', ['russia-10-day-siberia-baikal']],
]);
const travelRegionBySlug = new Map(
  [...regionSlugs].flatMap(([region, slugs]) => slugs.map((slug) => [slug, region])),
);

if (travelRegionBySlug.size !== order.length || order.some((slug) => !travelRegionBySlug.has(slug))) {
  throw new Error('Every numbered travel issue must have exactly one regional grouping.');
}

function frontMatterField(frontMatter, field) {
  const match = frontMatter.match(new RegExp(`^${field}:\\s*["']?(.*?)["']?\\s*$`, 'm'));
  return match?.[1]?.trim() ?? '';
}

function parseTags(frontMatter) {
  const match = frontMatter.match(/^tags:\s*\[(.*?)\]\s*$/m);
  return match ? match[1].split(',').map((tag) => tag.trim().replace(/^['"]|['"]$/g, '')) : [];
}

function durationFrom(title, slug) {
  const titleMatch = title.match(/(\d+)\s*(?:日|天)/);
  const slugMatch = slug.match(/(?:^|-)\d+-day-/);
  const days = titleMatch ? Number(titleMatch[1]) : slugMatch ? Number(slug.match(/(?:^|-)\d+-day-/)[0].match(/\d+/)[0]) : 10;
  return {days, nights: Math.max(0, days - 1)};
}

const entries = [];
for (const [index, slug] of order.entries()) {
  if (index === 0) {
    entries.push({
      issue: index + 1,
      slug,
      route: `/explore/travel/${slug}`,
      title: '馬來西亞西馬半島 9 日：博物館、歷史遺跡與二戰',
      description: '從馬六甲、檳城到布央谷、太平、怡保與吉隆坡；把殖民港口、博物館、戰爭遺址、公共交通、預算與現場風險放進同一份可執行計畫。',
      destination: '馬來西亞',
      region: travelRegionBySlug.get(slug),
      days: 9,
      nights: 8,
      featured: true,
      companionRoutes: ['/explore/travel/malaysia-10-day-kuala-lumpur-melaka-ipoh-taiping-penang'],
    });
    continue;
  }

  const articlePath = path.join(travelDirectory, slug, 'index.mdx');
  let source;
  try {
    source = await fs.readFile(articlePath, 'utf8');
  } catch {
    throw new Error(`Missing article source for travel issue ${String(index + 1).padStart(2, '0')}: ${slug}`);
  }
  const frontMatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!frontMatter) throw new Error(`Missing front matter: ${articlePath}`);

  const title = frontMatterField(frontMatter, 'title');
  const description = frontMatterField(frontMatter, 'description');
  const tags = parseTags(frontMatter);
  const duration = durationFrom(title, slug);
  const dayHeadings = [...source.matchAll(/^###\s+D(\d+)\b/gm)].map((match) => Number(match[1]));
  const expectedDayHeadings = Array.from({length: duration.days}, (_, day) => day + 1);
  if (dayHeadings.join(',') !== expectedDayHeadings.join(',')) {
    throw new Error(
      `Travel issue ${String(index + 1).padStart(2, '0')} must contain exactly D1–D${duration.days} in order: ${articlePath}`,
    );
  }

  const contentRequirements = [
    ['transport/logistics', /交通|鐵路|铁路|公車|巴士|火車|火车|轉場|转场|接駁|接驳|transport|transfer|rail|bus/i],
    ['accommodation', /住宿|酒店|旅宿|過夜|过夜|accommodation|lodging|hotel/i],
    ['budget/costs', /預算|预算|費用|费用|成本|花費|花费|budget|cost/i],
    ['safety/entry', /安全|風險|风险|警示|簽證|签证|入境|旅行建議|旅行建议|safety|visa|entry/i],
    ['alternatives/contingencies', /替代|調整|调整|取消|備案|备选|取捨|取舍|延誤|延误|alternative|contingenc|cancel/i],
  ];
  const missingContent = contentRequirements
    .filter(([, pattern]) => !pattern.test(source))
    .map(([name]) => name);
  const citedLinks = [...source.matchAll(/https?:\/\//g)].length;
  if (citedLinks < 5) missingContent.push(`authoritative sources (found ${citedLinks} links)`);
  if (missingContent.length > 0) {
    throw new Error(`Travel issue ${String(index + 1).padStart(2, '0')} is missing required guide content: ${missingContent.join(', ')}: ${articlePath}`);
  }

  const entry = {
    issue: index + 1,
    slug,
    route: `/explore/travel/${slug}`,
    title,
    description,
    destination: tags.find((tag) => tag !== '旅行') || title.split(/[：:，,\s]/)[0],
    region: travelRegionBySlug.get(slug),
    days: duration.days,
    nights: duration.nights,
    tags: tags.filter((tag) => tag !== '旅行').slice(1, 4),
    featured: index === 1,
    companionRoutes: slug === 'vietnam-north-10-day-hanoi-ninh-binh-sapa'
      ? ['/explore/travel/vietnam-north-8-day-hanoi-ninh-binh-sapa']
      : [],
    conditional: conditionalTravelSlugs.has(slug)
      || /conditional|條件式路線|条件式路线|暫緩|暂缓|暫不出發|暂不出发|未來條件|未来条件|暫勿前往|暂勿前往|旅行警示|不作現時出行建議|不作现时出行建议/.test(`${slug} ${title} ${description} ${tags.join(' ')}`)
      || /未來條件式路線|未来条件式路线|不作現時出行建議|不作现时出行建议/.test(source.slice(0, 2200)),
  };
  if (!title || !description) throw new Error(`Missing title or description: ${articlePath}`);
  entries.push(entry);
}

// Hong Kong and Macau are intentionally excluded from the travel collection
// and this country-by-country series. Reject them if reintroduced as series items.
const excludedSeriesDestinations = new Set(['香港', '澳門', '澳门', 'Hong Kong', 'Macau', 'Macao']);
const excludedSeriesSlug = /(?:^|[-/])(?:hong-kong|macau|macao)(?:[-/]|$)/i;
const travelDirectories = await fs.readdir(travelDirectory, {withFileTypes: true});
const excludedStandalonePage = travelDirectories.find((entry) =>
  entry.isDirectory() && excludedSeriesSlug.test(entry.name));
if (excludedStandalonePage) {
  throw new Error(`Excluded standalone destination page in Explore → Travel: ${excludedStandalonePage.name}`);
}
const excludedEntry = entries.find((entry) =>
  excludedSeriesDestinations.has(entry.destination)
  || excludedSeriesSlug.test(entry.slug)
  || excludedSeriesSlug.test(entry.route));
if (excludedEntry) {
  throw new Error(`Excluded standalone destination in travel series: ${excludedEntry.slug}`);
}

for (const entry of entries) {
  for (const companionRoute of entry.companionRoutes) {
    const companionSlug = companionRoute.split('/').filter(Boolean).at(-1);
    const companionPath = path.join(travelDirectory, companionSlug, 'index.mdx');
    try {
      await fs.access(companionPath);
    } catch {
      throw new Error(`Missing companion article for Travel Series / ${String(entry.issue).padStart(2, '0')}: ${companionRoute}`);
    }
  }
}

const output = path.join(rootDirectory, 'src/data/travel-series-catalog.json');
await fs.writeFile(output, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');
console.log(`Generated ${entries.length} numbered travel-series articles.`);
