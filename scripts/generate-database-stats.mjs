import {access, readdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

const staticDir = path.resolve('static');
const stats = {};

for (const entry of await readdir(staticDir, {withFileTypes: true})) {
  if (!entry.isDirectory()) continue;
  const directory = path.join(staticDir, entry.name);
  const dataFile = path.join(directory, 'data.json');
  let source;
  try {
    await access(path.join(directory, 'index.html'));
    source = await readFile(dataFile, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }

  const data = JSON.parse(source);
  stats[`/${entry.name}/data.json`] = {
    products: data.products?.length ?? 0,
    candidates: data.candidates?.length ?? 0,
    sources: data.sources?.length ?? 0,
  };
}

const sortedStats = Object.fromEntries(Object.entries(stats).sort(([left], [right]) => left.localeCompare(right, 'en')));
await writeFile('src/data/database-stats.json', `${JSON.stringify(sortedStats, null, 2)}\n`);
console.log(`Generated statistics for ${Object.keys(stats).length} databases`);
