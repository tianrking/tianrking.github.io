import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(scriptDirectory, '..');
const travelDirectory = path.join(rootDirectory, 'src/pages/explore/travel');
const order = JSON.parse(
  await fs.readFile(path.join(rootDirectory, 'src/data/travel-series-order.json'), 'utf8'),
);

// These destinations currently have explicit regional security/airspace caveats
// in their article bodies. Keep the catalog badges aligned with that guidance;
// review this set whenever the dated advisories in those articles are refreshed.
const conditionalTravelSlugs = new Set([
  'saudi-arabia-10-day-riyadh-alula-jeddah',
  'qatar-10-day-doha-north-desert',
  'bahrain-10-day-manama-dilmun-pearling',
  'kuwait-10-day-kuwait-city-failaka-heritage',
  'oman-10-day-muscat-sur-nizwa',
]);

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
  const entry = {
    issue: index + 1,
    slug,
    route: `/explore/travel/${slug}`,
    title,
    description,
    destination: tags.find((tag) => tag !== '旅行') || title.split(/[：:，,\s]/)[0],
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

// Hong Kong and Macau are intentionally excluded as standalone destinations
// from this country-by-country travel series. Keep their legacy travel diaries
// in the blog archive; only reject them if they are reintroduced as series items.
const excludedSeriesDestinations = new Set(['香港', '澳門', '澳门', 'Hong Kong', 'Macau', 'Macao']);
const excludedSeriesSlug = /(?:^|[-/])(?:hong-kong|macau|macao)(?:[-/]|$)/i;
const excludedEntry = entries.find((entry) =>
  excludedSeriesDestinations.has(entry.destination)
  || excludedSeriesSlug.test(entry.slug)
  || excludedSeriesSlug.test(entry.route));
if (excludedEntry) {
  throw new Error(`Excluded standalone destination in travel series: ${excludedEntry.slug}`);
}

const output = path.join(rootDirectory, 'src/data/travel-series-catalog.json');
await fs.writeFile(output, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');
console.log(`Generated ${entries.length} numbered travel-series articles.`);
