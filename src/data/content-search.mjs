// Search normalization only: display text and URLs remain untouched.
const variantPairs = '務务 館馆 賓宾 馬马 萊莱 來来 亞亚 灣湾 羅罗 蘭兰 龍龙 爾尔 島岛 歷历 遊游 紀纪 錄录 臺台 萬万 門门 嶺岭 東东 義义 戰战 爭争 軍军 國国 邊边 廟庙 預预 訂订 計计 畫画 資资 訊讯 電电 氣气 線线 網网 關关 聯联 鍵键 節节 數数 據据 庫库 軟软 體体 韌韧 頻频 藍蓝 設设 備备 構构 驗验 燒烧 導导 區区 風风 險险 價价 標标 籤签 機机 應应 顯显 觀观 龕龛 雙双 檳槟 吳吴 檔档 傳传 輸输 載载 穩稳 擴扩 檢检 轉转 換换 從从 個个 過过 記记 編编 級级 篩筛 選选 閱阅 讀读 長长 閉闭 開开 覽览 瀏浏 溫温 華华 墳坟 廣广 舊旧 場场 廠厂 達达 寶宝 實实 錯错 總总 經经 際际 會会 點点 擇择 進进';
const variants = new Map(variantPairs.split(' ').map(([traditional, simple]) => [traditional, simple]));
const aliases = [
  [/\b(?:cebu|sugbu|sugbo)\b/g, '宿务'],
  [/\bmanila\b/g, '马尼拉'],
  [/\bcorregidor\b|科雷希多岛?/g, '科雷希多岛'],
  [/\bmoalboal\b/g, '墨宝'],
  [/\b(?:yogyakarta|jogja)\b/g, '日惹'],
  [/\bjakarta\b/g, '雅加达'],
  [/\bborobudur\b/g, '婆罗浮屠'],
  [/\bprambanan\b|普兰巴兰/g, '普兰巴南'],
  [/\b(?:siem reap|siem-reap)\b/g, '暹粒'],
  [/\bangkor wat\b/g, '吴哥窟'],
  [/\bbluetooth low energy\b|低功耗(?:蓝牙|藍牙)/g, 'ble'],
  [/\braspberry pi\b|树莓派|樹莓派/g, 'raspberrypi'],
];

export function normalizeSearch(value = '') {
  let text = Array.from(String(value).normalize('NFKC').toLowerCase(),
    (character) => variants.get(character) ?? character).join('')
    .normalize('NFD').replace(/\p{Mark}/gu, '');
  for (const [alias, canonical] of aliases) text = text.replace(alias, canonical);
  return text.replace(/[^\p{Letter}\p{Number}]+/gu, ' ').trim();
}

export function queryTerms(query) {
  return [...new Set(normalizeSearch(query).split(' ').filter(Boolean))];
}

export function makeSearchIndex(documents) {
  return documents.map((document) => ({
    document,
    title: normalizeSearch(document.title),
    metadata: normalizeSearch([document.section, document.kindLabel, ...(document.tags ?? []), ...(document.keywords ?? [])].join(' ')),
    summary: normalizeSearch(document.description ?? ''),
  }));
}

export function findDocuments(index, query, matchesFilters = () => true) {
  const phrase = normalizeSearch(query);
  const terms = queryTerms(query);
  const matches = [];
  for (const entry of index) {
    if (!matchesFilters(entry.document)) continue;
    let titleHits = 0;
    let metadataHits = 0;
    let valid = true;
    for (const term of terms) {
      if (entry.title.includes(term)) titleHits++;
      else if (entry.metadata.includes(term)) metadataHits++;
      else if (!entry.summary.includes(term)) {valid = false; break;}
    }
    if (valid) matches.push({document: entry.document, titleHits, metadataHits,
      phrase: phrase && entry.title.includes(phrase) ? 1 : 0});
  }
  if (terms.length) matches.sort((a, b) => b.titleHits - a.titleHits || b.phrase - a.phrase || b.metadataHits - a.metadataHits);
  return matches.map(({document}) => document);
}
