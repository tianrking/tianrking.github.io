import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {load as parseYaml} from 'js-yaml';

const siteRoot = process.cwd();
const contentRoots = [
  {kind: 'docs', directory: 'docs', routePrefix: ''},
  {kind: 'blog', directory: 'blog', routePrefix: '/blog'},
];

const markdownExtensions = new Set(['.md', '.mdx']);

async function walk(directory) {
  const entries = await fs.readdir(directory, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
      continue;
    }

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(absolutePath)));
    } else if (markdownExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(absolutePath);
    }
  }

  return files;
}

function parseDocument(source) {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!match) {
    return {frontMatter: {}, body: source};
  }

  return {
    frontMatter: parseYaml(match[1]) || {},
    body: source.slice(match[0].length),
  };
}

function cleanText(value) {
  return String(value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>#~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(value, limit = 180) {
  const text = cleanText(value);
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1).trim()}…`;
}

function firstParagraph(body) {
  return body
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => cleanText(paragraph))
    .find((paragraph) => paragraph && !paragraph.startsWith('```') && !paragraph.startsWith(':::')) || '';
}

function asTags(value) {
  if (!Array.isArray(value)) {
    return value ? [String(value)] : [];
  }

  return value
    .map((tag) => {
      if (typeof tag === 'string') return tag.trim();
      if (tag && typeof tag === 'object') return String(tag.label || tag.name || '').trim();
      return '';
    })
    .filter(Boolean);
}

function asDate(value, filename, kind) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (value) {
    const match = String(value).match(/\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
  }

  if (kind === 'blog') {
    const match = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
    if (match) return match[1];
  }

  return null;
}

function normalizeRoute(value, prefix) {
  if (!value) return null;
  const route = String(value).trim();
  if (route === '/') return '/';
  if (route.startsWith('/')) return route;
  return `${prefix}/${route}`.replace(/\/+/g, '/');
}

function routeFor({kind, routePrefix, relativePath, frontMatter}) {
  const rawSlug = frontMatter.slug == null ? '' : String(frontMatter.slug).trim();
  if (rawSlug) {
    if (kind === 'blog') {
      const explicit = normalizeRoute(rawSlug, '/blog');
      return explicit.startsWith('/blog/') || explicit === '/blog'
        ? explicit
        : `/blog/${explicit.replace(/^\//, '')}`;
    }

    // Docusaurus resolves a docs slug relative to the directory containing the
    // file. A leading slash is the deliberate escape hatch for a site-root
    // route (used by the hand-curated landing pages).
    if (rawSlug.startsWith('/')) return normalizeRoute(rawSlug, '');
    const directory = path.dirname(relativePath).replace(/\\/g, '/');
    const prefix = directory === '.' ? '' : `/${directory}`;
    return `${prefix}/${rawSlug.replace(/^\//, '')}`.replace(/\/+/g, '/');
  }

  const extension = path.extname(relativePath);
  let routePath = relativePath.slice(0, -extension.length).replace(/\\/g, '/');
  if (routePath.endsWith('/index')) routePath = routePath.slice(0, -6);

  if (kind === 'blog') {
    routePath = routePath.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  }

  return `${routePrefix}/${routePath}`.replace(/\/+/g, '/');
}

function titleFor(frontMatter, body, relativePath) {
  if (frontMatter.title) return String(frontMatter.title);
  const heading = body.match(/^#\s+(.+)$/m);
  if (heading) return cleanText(heading[1]);
  return path.basename(relativePath, path.extname(relativePath)).replace(/[-_]+/g, ' ');
}

function languageFor(frontMatter, relativePath) {
  const value = frontMatter.language || frontMatter.lang;
  if (value) return String(value);
  if (/(^|[-_])zh[-_]?hk|繁中|繁體/i.test(relativePath)) return 'zh-Hant';
  if (/(^|[-_])zh[-_]?cn|简中|简体/i.test(relativePath)) return 'zh-Hans';
  if (/(^|[/\\])en([/\\]|[-_])/i.test(relativePath)) return 'en';
  if (/(^|[/\\])es([/\\]|[-_])/i.test(relativePath)) return 'es';
  return 'zh-Hant';
}

function sectionFor(kind, relativePath) {
  if (kind === 'blog') return '開發誌';
  const [section] = relativePath.split(/[\\/]/);
  const labels = {
    embedded: '嵌入式系統',
    'micro-controladores': '微控制器',
    comunicaciones: '通訊與網路',
    migrated: '技術參考',
    'uni-notes': '封存課程筆記',
  };
  return labels[section] || '技術筆記';
}

async function buildIndex() {
  const documents = [];

  for (const root of contentRoots) {
    const directory = path.join(siteRoot, root.directory);
    const files = await walk(directory);

    for (const file of files) {
      const relativePath = path.relative(directory, file);
      const source = await fs.readFile(file, 'utf8');
      const {frontMatter, body} = parseDocument(source);
      const title = titleFor(frontMatter, body, relativePath);
      const date = asDate(frontMatter.date, path.basename(relativePath), root.kind);
      const route = routeFor({
        kind: root.kind,
        routePrefix: root.routePrefix,
        relativePath,
        frontMatter,
      });

      documents.push({
        id: `${root.kind}:${relativePath.replace(/\\/g, '/')}`,
        kind: root.kind,
        kindLabel: root.kind === 'blog' ? '開發誌' : '技術筆記',
        section: sectionFor(root.kind, relativePath),
        language: languageFor(frontMatter, relativePath),
        title,
        description: truncate(frontMatter.description || firstParagraph(body)),
        route,
        date,
        year: date ? date.slice(0, 4) : null,
        tags: asTags(frontMatter.tags),
        keywords: asTags(frontMatter.keywords),
        image: frontMatter.image ? String(frontMatter.image) : null,
      });
    }
  }

  documents.sort((left, right) => {
    const dateOrder = String(right.date || '').localeCompare(String(left.date || ''));
    if (dateOrder !== 0) return dateOrder;
    return left.title.localeCompare(right.title, 'zh-Hant');
  });

  const output = {
    schemaVersion: 1,
    total: documents.length,
    documents,
  };

  // Keep the manifest deterministic so a production build does not dirty the tree.
  await fs.writeFile(
    path.join(siteRoot, 'src', 'data', 'content-index.json'),
    `${JSON.stringify(output, null, 2)}\n`,
  );
  console.log(`Generated content index: ${documents.length} documents`);
}

await buildIndex();
