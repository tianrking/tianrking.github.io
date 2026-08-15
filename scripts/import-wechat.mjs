#!/usr/bin/env node

import {createHash} from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {load} from 'cheerio';

const CONTENT_EXTENSIONS = new Set(['.html', '.htm', '.md', '.mdx']);
const PREFERRED_CONTENT_NAMES = [
  'article.html',
  'index.html',
  'content.html',
  'article.md',
  'index.md',
  'content.md',
];
const BLOCK_TAGS = new Set([
  'address',
  'article',
  'aside',
  'blockquote',
  'div',
  'figcaption',
  'figure',
  'footer',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'li',
  'main',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'table',
  'ul',
]);

const projectRoot = process.cwd();
const defaultInputRoot = path.join(projectRoot, 'wechat-import');
const defaultOutputRoot = path.join(projectRoot, 'blog');
const defaultAssetRoot = path.join(projectRoot, 'static', 'img', 'wechat');

function usage() {
  console.log(`微信公众号文章导入工具

用法：
  npm run import:wechat -- --list
  npm run import:wechat -- --article <相对目录或文件> --apply

选项：
  --input <dir>       导出文件目录，默认 wechat-import/
  --output <dir>      博客输出目录，默认 blog/
  --assets <dir>      图片输出目录，默认 static/img/wechat/
  --article <id>      只处理一个文章来源；--apply 时必须唯一匹配
  --apply             写入博客 Markdown 和本地图片；默认只预览
  --overwrite         允许覆盖已有同名博客文件
  --list              只列出发现的文章
  --help              显示帮助

每次 --apply 只允许写入一篇文章，便于在检查通过后创建一个独立 commit。
`);
}

function parseArgs(argv) {
  const options = {apply: false, list: false, overwrite: false};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--apply') {
      options.apply = true;
    } else if (arg === '--list') {
      options.list = true;
    } else if (arg === '--overwrite') {
      options.overwrite = true;
    } else if (['--input', '--output', '--assets', '--article'].includes(arg)) {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`${arg} 需要一个值。`);
      }
      options[arg.slice(2)] = value;
      index += 1;
    } else {
      throw new Error(`未知选项：${arg}`);
    }
  }
  return options;
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(directory) {
  const entries = await fs.readdir(directory, {withFileTypes: true});
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (entry.name.startsWith('.')) {
      continue;
    }
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function isWithin(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

function stripQuotes(value) {
  const trimmed = String(value ?? '').trim();
  if (trimmed.length >= 2 && ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'")))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  const text = String(value ?? '').trim();
  if (!text) {
    return [];
  }
  if (text.startsWith('[') && text.endsWith(']')) {
    const inner = text.slice(1, -1).trim();
    if (!inner) {
      return [];
    }
    return inner.split(',').map(stripQuotes).filter(Boolean);
  }
  return [stripQuotes(text)].filter(Boolean);
}

function parseFrontMatter(source) {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!match) {
    return {metadata: {}, body: source};
  }
  const metadata = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator < 0) {
      continue;
    }
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (['authors', 'author', 'tags'].includes(key)) {
      metadata[key] = parseList(value);
    } else {
      metadata[key] = stripQuotes(value);
    }
  }
  return {metadata, body: source.slice(match[0].length)};
}

function normalizeDate(value) {
  const text = String(value ?? '').trim();
  if (!text) {
    return null;
  }
  const iso = text.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (iso) {
    return `${iso[1]}-${iso[2].padStart(2, '0')}-${iso[3].padStart(2, '0')}`;
  }
  const chinese = text.match(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日?/);
  if (chinese) {
    return `${chinese[1]}-${chinese[2].padStart(2, '0')}-${chinese[3].padStart(2, '0')}`;
  }
  if (/^\d{10,13}$/.test(text)) {
    const date = new Date(Number(text.length === 10 ? `${text}000` : text));
    if (!Number.isNaN(date.valueOf())) {
      return date.toISOString().slice(0, 10);
    }
  }
  const date = new Date(text);
  return Number.isNaN(date.valueOf()) ? null : date.toISOString().slice(0, 10);
}

function slugify(value) {
  const slug = String(value ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
  return slug || 'wechat-article';
}

function yamlQuote(value) {
  return JSON.stringify(String(value ?? ''));
}

function cleanText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function metaContent($, selectors) {
  for (const selector of selectors) {
    const value = $(selector).first().attr('content') || $(selector).first().attr('datetime');
    if (value) {
      return value;
    }
  }
  return null;
}

function readHtmlMetadata($) {
  const title = cleanText(
    metaContent($, ['meta[property="og:title"]', 'meta[name="twitter:title"]']) ||
      $('title').first().text() ||
      $('h1').first().text(),
  );
  const description = cleanText(
    metaContent($, ['meta[name="description"]', 'meta[property="og:description"]']) || '',
  );
  const date =
    metaContent($, [
      'meta[property="article:published_time"]',
      'meta[name="date"]',
      'meta[name="publishdate"]',
      'time[datetime]',
    ]) ||
    cleanText($('time').first().text());
  const sourceUrl = metaContent($, ['meta[property="og:url"]']) || $('link[rel="canonical"]').first().attr('href') || null;
  return {title, description, date, sourceUrl};
}

function selectContentRoot($) {
  const selectors = ['#js_content', '.rich_media_content', '.rich_media_area_primary', 'article', 'main', 'body'];
  for (const selector of selectors) {
    const candidate = $(selector).first();
    if (candidate.length && cleanText(candidate.text()).length > 20) {
      return candidate;
    }
  }
  return $('body');
}

function sourceCandidateKey(inputRoot, sourceFile) {
  return path.relative(inputRoot, sourceFile).replaceAll(path.sep, '/');
}

async function discoverArticles(inputRoot) {
  const files = await walk(inputRoot);
  const contentFiles = files.filter((filePath) => CONTENT_EXTENSIONS.has(path.extname(filePath).toLowerCase()) && path.basename(filePath).toLowerCase() !== 'readme.md');
  const groups = new Map();
  for (const filePath of contentFiles) {
    const parent = path.dirname(filePath);
    if (!groups.has(parent)) {
      groups.set(parent, []);
    }
    groups.get(parent).push(filePath);
  }

  const candidates = [];
  for (const [parent, group] of groups) {
    const sorted = [...group].sort((left, right) => {
      const leftName = path.basename(left).toLowerCase();
      const rightName = path.basename(right).toLowerCase();
      const leftRank = PREFERRED_CONTENT_NAMES.indexOf(leftName);
      const rightRank = PREFERRED_CONTENT_NAMES.indexOf(rightName);
      return (leftRank < 0 ? 100 : leftRank) - (rightRank < 0 ? 100 : rightRank) || leftName.localeCompare(rightName);
    });
    if (parent === inputRoot) {
      for (const sourceFile of sorted) {
        candidates.push({id: sourceCandidateKey(inputRoot, sourceFile), sourceDir: parent, sourceFile});
      }
    } else {
      candidates.push({id: path.relative(inputRoot, parent).replaceAll(path.sep, '/') || path.basename(sorted[0]), sourceDir: parent, sourceFile: sorted[0]});
    }
  }
  return candidates.sort((left, right) => left.id.localeCompare(right.id));
}

async function readMetadataFile(directory) {
  for (const name of ['metadata.json', 'meta.json']) {
    const filePath = path.join(directory, name);
    if (await exists(filePath)) {
      const parsed = JSON.parse(await fs.readFile(filePath, 'utf8'));
      return {filePath, metadata: parsed};
    }
  }
  return {filePath: null, metadata: {}};
}

async function loadArticle(candidate) {
  const source = await fs.readFile(candidate.sourceFile, 'utf8');
  const extension = path.extname(candidate.sourceFile).toLowerCase();
  const frontMatter = extension === '.md' || extension === '.mdx' ? parseFrontMatter(source) : {metadata: {}, body: source};
  const html = extension === '.html' || extension === '.htm';
  const $ = html ? load(source, {decodeEntities: false}) : null;
  const htmlMetadata = $ ? readHtmlMetadata($) : {};
  const metadataFile = await readMetadataFile(candidate.sourceDir);
  const metadata = {...htmlMetadata, ...frontMatter.metadata, ...metadataFile.metadata};
  const title = cleanText(metadata.title || path.basename(candidate.sourceFile, extension));
  const date = normalizeDate(metadata.date || metadata.published || metadata.publishedAt || metadata.publish_time);
  const slug = slugify(metadata.slug || title);
  const articleKey = `${date || 'undated'}-${slug}`;
  const tags = parseList(metadata.tags);
  if (!tags.some((tag) => tag === '微信公眾號')) {
    tags.push('微信公眾號');
  }
  const authors = parseList(metadata.authors || metadata.author);
  if (!authors.length) {
    authors.push('w0x7ce');
  }
  return {
    ...candidate,
    articleKey,
    authors,
    body: frontMatter.body,
    date,
    description: cleanText(metadata.description || metadata.summary || ''),
    html,
    metadataFile: metadataFile.filePath,
    source,
    sourceUrl: metadata.sourceUrl || metadata.source_url || metadata.url || null,
    slug,
    tags,
    title,
    $,
  };
}

function safeFileName(value) {
  const normalized = String(value || 'asset').normalize('NFKC').replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').replace(/\s+/g, '-');
  return normalized.slice(0, 140) || 'asset';
}

function hashText(value) {
  return createHash('sha1').update(String(value)).digest('hex').slice(0, 10);
}

function parseDataUri(uri) {
  const match = String(uri).match(/^data:([^;,]+)?(;base64)?,([\s\S]*)$/i);
  if (!match) {
    return null;
  }
  const mimeType = match[1] || 'application/octet-stream';
  const data = match[2] ? Buffer.from(match[3], 'base64') : Buffer.from(decodeURIComponent(match[3]), 'utf8');
  const extension = ({
    'image/gif': '.gif',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/svg+xml': '.svg',
    'image/webp': '.webp',
  })[mimeType] || '.bin';
  return {data, extension, mimeType};
}

function publicAssetPath(articleKey, filename) {
  return `/img/wechat/${articleKey}/${filename}`;
}

async function createAssetContext(article, inputRoot, assetRoot, apply) {
  const localFiles = await walk(article.sourceDir);
  const byBaseName = new Map();
  for (const filePath of localFiles) {
    const key = path.basename(filePath).toLowerCase();
    if (!byBaseName.has(key)) {
      byBaseName.set(key, filePath);
    }
  }
  return {
    apply,
    article,
    assetRoot,
    byBaseName,
    copied: [],
    inputRoot,
    imageRefs: new WeakMap(),
    pending: new Map(),
    sourceDir: article.sourceDir,
    warnings: [],
  };
}

function chooseLocalAsset(reference, context) {
  const withoutQuery = String(reference).split('#')[0].split('?')[0];
  if (!withoutQuery || /^(?:https?:|data:|blob:|file:)/i.test(withoutQuery)) {
    return null;
  }
  let decoded;
  try {
    decoded = decodeURIComponent(withoutQuery);
  } catch {
    decoded = withoutQuery;
  }
  const direct = path.resolve(context.sourceDir, decoded.replace(/^\/+/, ''));
  if (isWithin(context.inputRoot, direct)) {
    return direct;
  }
  return context.byBaseName.get(path.basename(decoded).toLowerCase()) || null;
}

async function prepareAsset(reference, context) {
  const original = String(reference || '').trim();
  if (!original) {
    return {publicPath: original};
  }
  const dataUri = parseDataUri(original);
  let sourceKey = original;
  let sourcePath = null;
  let buffer = null;
  let extension = null;
  if (dataUri) {
    buffer = dataUri.data;
    extension = dataUri.extension;
    sourceKey = `data:${hashText(original)}`;
  } else {
    sourcePath = chooseLocalAsset(original, context);
    if (!sourcePath || !(await exists(sourcePath))) {
      if (/^https?:\/\//i.test(original)) {
        context.warnings.push(`外部图片未下载，保留原始 URL：${original}`);
      } else {
        context.warnings.push(`找不到本地图片，保留原始引用：${original}`);
      }
      return {publicPath: original};
    }
    extension = path.extname(sourcePath).toLowerCase() || '.bin';
    sourceKey = sourcePath;
  }
  if (context.pending.has(sourceKey)) {
    return {publicPath: context.pending.get(sourceKey).publicPath};
  }
  const originalName = dataUri ? `embedded-${hashText(original)}${extension}` : safeFileName(path.basename(sourcePath));
  let filename = originalName;
  const existing = [...context.pending.values()].find((asset) => asset.filename === filename);
  if (existing && existing.sourceKey !== sourceKey) {
    filename = `${hashText(sourceKey)}-${filename}`;
  }
  const target = path.join(context.assetRoot, context.article.articleKey, filename);
  const asset = {buffer, filename, publicPath: publicAssetPath(context.article.articleKey, filename), sourceKey, sourcePath, target};
  context.pending.set(sourceKey, asset);
  if (context.apply) {
    context.copied.push(asset);
  }
  return {publicPath: asset.publicPath};
}

async function prepareHtmlImages($, root, context) {
  const images = root.is('img') ? [root[0]] : root.find('img').toArray();
  for (const node of images) {
    const reference = $(node).attr('src') || $(node).attr('data-src') || $(node).attr('data-original') || $(node).attr('srcset')?.split(',')[0]?.trim().split(' ')[0];
    if (reference) {
      const asset = await prepareAsset(reference, context);
      context.imageRefs.set(node, asset.publicPath);
    }
  }
}

function normalizeText(value, inPre = false) {
  const text = String(value ?? '').replace(/\u00a0/g, ' ');
  return inPre ? text : text.replace(/[\t\r\n ]+/g, ' ');
}

function attr(node, name) {
  return node.attribs?.[name] || '';
}

function escapeAttribute(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function block(value) {
  const text = String(value ?? '').replace(/\n{3,}/g, '\n\n').trim();
  return text ? `${text}\n\n` : '';
}

function renderInlineCode(value) {
  const text = String(value ?? '').replace(/\r?\n/g, ' ').trim();
  if (!text) {
    return '';
  }
  const ticks = Math.max(1, ...[...text.matchAll(/`+/g)].map((match) => match[0].length)) + 1;
  const fence = '`'.repeat(ticks);
  return `${fence}${text}${fence}`;
}

function renderRawVideo(node) {
  const attributes = ['src', 'poster', 'width', 'height'].filter((name) => attr(node, name)).map((name) => `${name}="${escapeAttribute(attr(node, name))}"`);
  if (attr(node, 'controls') !== '') {
    attributes.push('controls');
  }
  return block(`<video ${attributes.join(' ')}></video>`);
}

function renderNode(node, context, mode = 'block') {
  if (!node) {
    return '';
  }
  if (node.type === 'text') {
    const normalized = normalizeText(node.data, context.inPre);
    if (!context.inPre && !normalized.trim() && (mode === 'block' || /[\r\n]/.test(node.data || ''))) {
      return '';
    }
    return normalized;
  }
  if (node.type === 'comment' || node.type === 'directive') {
    return '';
  }
  if (node.type !== 'tag') {
    return node.children ? renderChildren(node, context, mode) : '';
  }
  const tag = String(node.name || '').toLowerCase();
  if (['script', 'style', 'noscript', 'template'].includes(tag)) {
    return '';
  }
  if (tag === 'br') {
    return '\n';
  }
  if (tag === 'img') {
    const source = context.imageRefs.get(node) || attr(node, 'src') || attr(node, 'data-src') || '';
    const alt = attr(node, 'alt') || '圖片';
    return source ? `![${alt.replaceAll(']', '\\]')}](${source})` : '';
  }
  if (tag === 'a') {
    const href = attr(node, 'href');
    const content = renderChildren(node, context, 'inline').trim();
    if (!href || /^(?:javascript:|data:)/i.test(href)) {
      return content;
    }
    return content ? `[${content.replaceAll(']', '\\]')}](${href.replaceAll(')', '\\)')})` : `<${href}>`;
  }
  if (tag === 'strong' || tag === 'b') {
    const content = renderChildren(node, context, 'inline').trim();
    return content ? `**${content}**` : '';
  }
  if (tag === 'em' || tag === 'i') {
    const content = renderChildren(node, context, 'inline').trim();
    return content ? `*${content}*` : '';
  }
  if (tag === 'del' || tag === 's') {
    const content = renderChildren(node, context, 'inline').trim();
    return content ? `~~${content}~~` : '';
  }
  if (tag === 'code' && node.parent?.name !== 'pre') {
    return renderInlineCode(renderChildren(node, {...context, inPre: true}, 'inline'));
  }
  if (tag === 'pre') {
    const codeNode = node.children?.find((child) => child.type === 'tag' && child.name === 'code');
    const code = codeNode ? textContent(codeNode) : textContent(node);
    const className = codeNode ? attr(codeNode, 'class') : attr(node, 'class');
    const language = className.match(/(?:language|lang)-([\w-]+)/i)?.[1] || '';
    const fenceLength = Math.max(3, ...[...code.matchAll(/`{3,}/g)].map((match) => match[0].length + 1));
    const fence = '`'.repeat(fenceLength);
    return block(`${fence}${language}\n${code.replace(/^\n|\n$/g, '')}\n${fence}`);
  }
  if (/^h[1-6]$/.test(tag)) {
    const content = renderChildren(node, context, 'inline').trim();
    return content ? block(`${'#'.repeat(Number(tag.slice(1)))} ${content}`) : '';
  }
  if (tag === 'hr') {
    return block('---');
  }
  if (tag === 'blockquote') {
    const content = cleanupMarkdown(renderChildren(node, context, 'block'));
    return content ? block(content.split('\n').map((line) => (line ? `> ${line}` : '>')).join('\n')) : '';
  }
  if (tag === 'ul' || tag === 'ol') {
    return renderList(node, context, tag === 'ol');
  }
  if (tag === 'table') {
    return renderTable(node, context);
  }
  if (tag === 'video') {
    return renderRawVideo(node);
  }
  if (tag === 'iframe') {
    const src = attr(node, 'src');
    return src ? block(`<iframe src="${escapeAttribute(src)}" title="嵌入內容"></iframe>`) : '';
  }

  const content = renderChildren(node, context, BLOCK_TAGS.has(tag) ? 'block' : mode);
  return BLOCK_TAGS.has(tag) ? block(content) : content;
}

function renderChildren(node, context, mode) {
  return (node.children || []).map((child) => renderNode(child, context, mode)).join('');
}

function textContent(node) {
  if (!node) {
    return '';
  }
  if (node.type === 'text') {
    return node.data || '';
  }
  return (node.children || []).map(textContent).join('');
}

function renderList(node, context, ordered) {
  const items = (node.children || []).filter((child) => child.type === 'tag' && child.name === 'li');
  const lines = [];
  items.forEach((item, index) => {
    const marker = ordered ? `${index + 1}.` : '-';
    const parts = [];
    for (const child of item.children || []) {
      if (child.type === 'tag' && (child.name === 'ul' || child.name === 'ol')) {
        const nested = cleanupMarkdown(renderList(child, context, child.name === 'ol')).split('\n').map((line) => (line ? `  ${line}` : line));
        parts.push(`\n${nested.join('\n')}`);
      } else {
        parts.push(renderNode(child, context, 'inline'));
      }
    }
    const value = cleanupMarkdown(parts.join('')).replace(/\n+/g, ' ').trim();
    if (value) {
      lines.push(`${marker} ${value}`);
    }
  });
  return block(lines.join('\n'));
}

function renderTable(node, context) {
  const rows = collectDescendants(node, 'tr');
  const normalizedRows = rows.map((row) => (row.children || []).filter((cell) => cell.type === 'tag' && (cell.name === 'td' || cell.name === 'th')).map((cell) => cleanupMarkdown(renderChildren(cell, context, 'inline')).replace(/\|/g, '\\|').replace(/\n+/g, ' ').trim()));
  if (!normalizedRows.length || !normalizedRows[0].length) {
    return '';
  }
  const width = Math.max(...normalizedRows.map((row) => row.length));
  const padded = normalizedRows.map((row) => [...row, ...Array(width - row.length).fill('')]);
  const lines = [`| ${padded[0].join(' | ')} |`, `| ${padded[0].map(() => '---').join(' | ')} |`];
  for (const row of padded.slice(1)) {
    lines.push(`| ${row.join(' | ')} |`);
  }
  return block(lines.join('\n'));
}

function collectDescendants(node, tagName) {
  const matches = [];
  for (const child of node.children || []) {
    if (child.type === 'tag' && child.name === tagName) {
      matches.push(child);
    } else if (child.type === 'tag' && child.name !== 'table') {
      matches.push(...collectDescendants(child, tagName));
    }
  }
  return matches;
}

function cleanupMarkdown(value) {
  return String(value ?? '').replace(/\r\n?/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

async function normalizeMarkdownAssets(body, context) {
  const pattern = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^)]*["'])?\)/g;
  const matches = [...body.matchAll(pattern)];
  let output = '';
  let cursor = 0;
  for (const match of matches) {
    output += body.slice(cursor, match.index);
    const asset = await prepareAsset(match[2], context);
    output += `![${match[1]}](${asset.publicPath})`;
    cursor = match.index + match[0].length;
  }
  return output + body.slice(cursor);
}

function frontMatter(article) {
  const lines = [
    '---',
    `slug: ${yamlQuote(article.slug)}`,
    `title: ${yamlQuote(article.title)}`,
    `authors: [${article.authors.map(yamlQuote).join(', ')}]`,
    `tags: [${article.tags.map(yamlQuote).join(', ')}]`,
    `date: ${article.date}`,
  ];
  if (article.description) {
    lines.push(`description: ${yamlQuote(article.description)}`);
  }
  if (article.sourceUrl) {
    lines.push(`source_url: ${yamlQuote(article.sourceUrl)}`);
  }
  lines.push('---');
  return lines.join('\n');
}

async function renderArticle(article, context) {
  let body;
  if (article.html) {
    const root = selectContentRoot(article.$);
    root.find('script,style,noscript,template').remove();
    await prepareHtmlImages(article.$, root, context);
    body = cleanupMarkdown(renderChildren(root[0], context, 'block'));
  } else {
    body = cleanupMarkdown(await normalizeMarkdownAssets(article.body, context));
  }
  if (!body) {
    throw new Error('正文为空，拒绝生成博客文件。');
  }
  const sourceNote = article.sourceUrl ? `原文链接：<${article.sourceUrl}>\n\n` : '';
  return `${frontMatter(article)}\n\n${sourceNote}${body}\n`;
}

async function writeAssets(context) {
  for (const asset of context.copied) {
    await fs.mkdir(path.dirname(asset.target), {recursive: true});
    if (asset.buffer) {
      await fs.writeFile(asset.target, asset.buffer);
    } else {
      await fs.copyFile(asset.sourcePath, asset.target);
    }
  }
}

function printCandidate(candidate) {
  const date = candidate.date || '缺少日期';
  const output = candidate.date ? `${candidate.date}-${candidate.slug}.md` : '需要补充日期后才能写入';
  console.log(`- ${candidate.id} | ${date} | ${candidate.title || '缺少标题'} | ${output}`);
  for (const warning of candidate.warnings || []) {
    console.log(`  警告：${warning}`);
  }
}

async function prepareCandidate(candidate, inputRoot, outputRoot, assetRoot, apply) {
  const article = await loadArticle(candidate);
  const context = await createAssetContext(article, inputRoot, assetRoot, apply);
  const content = await renderArticle(article, context);
  const outputName = `${article.date || 'undated'}-${article.slug}.md`;
  const outputPath = path.join(outputRoot, outputName);
  return {article, context, content, outputName, outputPath};
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    usage();
    return;
  }
  const inputRoot = path.resolve(options.input || defaultInputRoot);
  const outputRoot = path.resolve(options.output || defaultOutputRoot);
  const assetRoot = path.resolve(options.assets || defaultAssetRoot);
  if (!(await exists(inputRoot))) {
    console.log(`尚未发现 ${inputRoot}。请按 wechat-import/README.md 放入文章导出文件。`);
    return;
  }
  const candidates = await discoverArticles(inputRoot);
  if (!candidates.length) {
    console.log(`在 ${inputRoot} 中没有发现 HTML/Markdown 文章。`);
    return;
  }

  const selectedCandidates = options.article
    ? candidates.filter((candidate) => [candidate.id, sourceCandidateKey(inputRoot, candidate.sourceFile)].some((value) => value.toLowerCase() === options.article.toLowerCase()))
    : candidates;
  if (options.article && selectedCandidates.length !== 1) {
    throw new Error(`--article 没有唯一匹配：${options.article}；请先运行 --list。`);
  }

  const prepared = [];
  for (const candidate of selectedCandidates) {
    try {
      const item = await prepareCandidate(candidate, inputRoot, outputRoot, assetRoot, options.apply);
      candidate.title = item.article.title;
      candidate.date = item.article.date;
      candidate.slug = item.article.slug;
      candidate.warnings = item.context.warnings;
      prepared.push(item);
    } catch (error) {
      candidate.warnings = [error instanceof Error ? error.message : String(error)];
      printCandidate(candidate);
      if (options.apply) {
        throw error;
      }
    }
  }

  console.log(`发现 ${selectedCandidates.length} 篇文章：`);
  for (const candidate of selectedCandidates) {
    printCandidate(candidate);
  }
  if (!options.apply || options.list) {
    return;
  }
  if (prepared.length !== 1) {
    throw new Error('--apply 每次只允许写入一篇文章；请使用 --article 指定来源。');
  }
  const [{article, context, content, outputPath, outputName}] = prepared;
  if (!article.date) {
    throw new Error('文章缺少可确认的发布日期；请在 metadata.json 中补充 date，避免生成错误时间线。');
  }
  if ((await exists(outputPath)) && !options.overwrite) {
    throw new Error(`目标文件已存在：${outputName}；如确实需要更新，请显式使用 --overwrite。`);
  }
  await writeAssets(context);
  await fs.mkdir(outputRoot, {recursive: true});
  await fs.writeFile(outputPath, content, 'utf8');
  console.log(`已写入 ${outputPath}`);
  console.log(`本地图片：${context.copied.length} 个；警告：${context.warnings.length} 条。`);
}

main().catch((error) => {
  console.error(`导入失败：${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
