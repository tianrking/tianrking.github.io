import {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import styles from './styles.module.css';

const FILTERS = [
  {id: 'all', label: '全部'},
  {id: 'infrastructure', label: '基礎設施'},
  {id: 'experiment', label: '實驗與工具'},
];

const LAB_ITEMS = [
  {
    id: 'pypi',
    name: 'PyPI Mirror',
    mark: 'PY',
    category: 'infrastructure',
    description: 'Python 套件與 PyTorch 下載加速。',
    url: 'https://pypi.w0x7ce.eu/',
    tags: ['Python', 'Packages'],
    command: 'pip install numpy -i https://pypi.w0x7ce.eu/simple',
  },
  {
    id: 'docker',
    name: 'Container Registry',
    mark: 'CR',
    category: 'infrastructure',
    description: 'Docker Hub 相容的映像下載入口。',
    url: 'https://docker.w0x7ce.eu/',
    tags: ['Docker', 'OCI'],
    command: 'docker pull docker.w0x7ce.eu/library/nginx:latest',
  },
  {
    id: 'github',
    name: 'GitHub Proxy',
    mark: 'GH',
    category: 'infrastructure',
    description: 'Git repository、Release 與原始檔案下載加速。',
    url: 'https://github.w0x7ce.eu/',
    tags: ['Git', 'Downloads'],
    command: 'git clone https://github.w0x7ce.eu/owner/repository',
  },
  {
    id: 'hugging-face',
    name: 'Hugging Face Mirror',
    mark: 'HF',
    category: 'infrastructure',
    description: '模型權重與資料集下載入口。',
    url: 'https://hf.w0x7ce.eu/',
    tags: ['AI', 'Models'],
    command: 'HF_ENDPOINT=https://hf.w0x7ce.eu huggingface-cli download gpt2',
  },
  {
    id: 'linux-mirrors',
    name: 'Linux Mirrors',
    mark: 'LX',
    category: 'infrastructure',
    description: '常用 Linux 發行版與套件來源鏡像。',
    url: 'https://mirrors.w0x7ce.eu/',
    tags: ['Linux', 'Mirror'],
  },
  {
    id: 'file-proxy',
    name: 'File Proxy',
    mark: 'FP',
    category: 'infrastructure',
    description: '用於公開檔案的通用下載轉送工具。',
    url: 'https://proxy.w0x7ce.eu/',
    tags: ['HTTP', 'Download'],
    command: 'curl -L -O "https://proxy.w0x7ce.eu/https://example.com/file.zip"',
  },
  {
    id: 'llm-matrix',
    name: 'LLM Matrix',
    mark: 'LM',
    category: 'experiment',
    description: '跨供應商模型價格與規格比較介面。',
    url: 'https://llm.w0x7ce.eu/',
    tags: ['LLM', 'Data'],
  },
  {
    id: 'polyscan',
    name: 'PolyScan',
    mark: 'PS',
    category: 'experiment',
    description: 'Polymarket 市場資料探索與分析實驗。',
    url: 'https://polymarket.w0x7ce.eu/',
    tags: ['Analytics', 'Markets'],
  },
  {
    id: 'pdf-stitch',
    name: 'PDFStitch',
    mark: 'PDF',
    category: 'experiment',
    description: '在瀏覽器中拆分與轉換 PDF 頁面。',
    url: 'https://pdfstitch.w0x7ce.eu/',
    tags: ['PDF', 'Browser'],
  },
  {
    id: 'draw',
    name: 'Draw',
    mark: 'DR',
    category: 'experiment',
    description: '輕量的線上草圖與白板工具。',
    url: 'https://draw.w0x7ce.eu/',
    tags: ['Canvas', 'Creative'],
  },
  {
    id: 'realtime',
    name: 'Realtime Proxy',
    mark: 'RT',
    category: 'experiment',
    description: 'OpenAI Realtime API 的連線與 CORS 實驗入口。',
    url: 'https://realtime.w0x7ce.eu/',
    tags: ['Realtime', 'API'],
  },
];

function LabCard({item, copied, copyFailed, onCopy}) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.mark} aria-hidden="true">{item.mark}</span>
        <span className={styles.kind}>
          {item.category === 'infrastructure' ? 'SERVICE' : 'EXPERIMENT'}
        </span>
      </div>
      <h2>{item.name}</h2>
      <p>{item.description}</p>
      <ul className={styles.tags} aria-label="技術標籤">
        {item.tags.map((tag) => <li key={tag}>{tag}</li>)}
      </ul>
      {item.command && (
        <div className={styles.commandRow}>
          <code title={item.command}>{item.command}</code>
          <button
            type="button"
            onClick={() => onCopy(item)}
            aria-label={copyFailed ? `${item.name} 指令複製失敗，請手動複製` : `複製 ${item.name} 指令`}
            aria-live="polite">
            {copied ? '已複製' : copyFailed ? '請手動複製' : '複製'}
          </button>
        </div>
      )}
      <a className={styles.openLink} href={item.url} target="_blank" rel="noopener noreferrer">
        開啟服務 <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

export default function Labs() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [copyFailedId, setCopyFailedId] = useState(null);
  const visibleItems = useMemo(
    () => activeFilter === 'all' ? LAB_ITEMS : LAB_ITEMS.filter((item) => item.category === activeFilter),
    [activeFilter],
  );

  async function copyCommand(item) {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API is unavailable.');
      }
      await navigator.clipboard.writeText(item.command);
      setCopyFailedId(null);
      setCopiedId(item.id);
      window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      setCopiedId(null);
      setCopyFailedId(item.id);
      window.setTimeout(() => setCopyFailedId(null), 2600);
    }
  }

  return (
    <Layout title="實驗場" description="w0x7ce 維護的開發服務、基礎設施與互動實驗。">
      <main className={styles.page}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>LAB / PUBLIC WORKBENCH</p>
          <h1>實驗場</h1>
          <p>正在運作的基礎設施、可直接使用的工具，以及尚在演化中的小型實驗。</p>
          <div className={styles.notice}>
            這裡展示公開入口，不代表服務等級承諾；使用前請確認頁面狀態與最後更新資訊。
          </div>
        </header>

        <section className={styles.content} aria-labelledby="lab-items-title">
          <div className={styles.toolbar}>
            <h2 id="lab-items-title">可用入口</h2>
            <div className={styles.filters} aria-label="實驗場分類">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={activeFilter === filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.grid}>
            {visibleItems.map((item) => (
              <LabCard
                key={item.id}
                  item={item}
                  copied={copiedId === item.id}
                  copyFailed={copyFailedId === item.id}
                  onCopy={copyCommand}
              />
            ))}
          </div>
          <p className={styles.copyStatus} aria-live="polite">
            {copiedId ? '指令已複製到剪貼簿。' : ''}
          </p>
        </section>
      </main>
    </Layout>
  );
}
