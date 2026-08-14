import React, {useMemo, useState} from 'react';
import styles from './styles.module.css';

const KIB = 1024;
const FLASH_PAGE = 4 * KIB;

const relationshipLayers = [
  {
    id: 'bond',
    code: 'N_bond',
    title: 'Bond DB',
    analogy: '鑰匙櫃',
    summary: '長期保存曾經安全配對之裝置的 LTK、IRK 與相關安全中繼資料。',
    limit: '受 Host 配置、持久化資料庫、應用身分表與產品策略共同限制。',
    question: '重新連線後，能否找回這個 peer 的長期密鑰？',
  },
  {
    id: 'resolving',
    code: 'N_resolving',
    title: 'Resolving List',
    analogy: '門衛快速識別名單',
    summary: 'Controller 以 IRK 在硬體側解析輪換中的 RPA，避免每次都喚醒 Host。',
    limit: '容量由 Controller 實作決定，通常小於或等於完整 Bond DB。',
    question: '看到一個 RPA 時，Controller 能否立即認出是哪個已知 peer？',
  },
  {
    id: 'connections',
    code: 'N_conn',
    title: 'Active Connections',
    analogy: '通信車道',
    summary: '當下正在維持的 ACL 連線；每條都有控制器、Host、緩衝與排程成本。',
    limit: '取決於 Controller、Host、RAM、無線排程與產品策略的最小值。',
    question: '此刻真正有多少個 peer 同時佔用連線上下文與無線時隙？',
  },
  {
    id: 'users',
    code: 'N_identity',
    title: 'App Users',
    analogy: '軟體權限系統',
    summary: 'ADMIN、MEMBER、帳號、capability 與 session 都是應用層語意。',
    limit: '可由 MCU、本機 App 或雲端資料庫管理，與 Bond 數量不必一對一。',
    question: '已建立安全鏈路的這個會話，現在被允許執行什麼操作？',
  },
];

function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function formatBytes(bytes) {
  const rounded = Math.max(0, Math.round(bytes));
  if (rounded < KIB) return `${rounded.toLocaleString('zh-Hant')} B`;
  const kib = rounded / KIB;
  const digits = kib >= 10 || Number.isInteger(kib) ? 0 : 1;
  return `${kib.toFixed(digits)} KiB`;
}

function NumberField({id, label, value, min, max, step = 1, unit, onChange, help}) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.inputShell}>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <span aria-hidden="true">{unit}</span>
      </span>
      {help ? <small>{help}</small> : null}
    </label>
  );
}

function Presets({label, values, active, onSelect}) {
  return (
    <div className={styles.presets} aria-label={label}>
      <span>{label}</span>
      <div>
        {values.map((value) => (
          <button
            key={value}
            type="button"
            className={active === value ? styles.presetActive : undefined}
            aria-pressed={active === value}
            onClick={() => onSelect(value)}>
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

function BondCapacityEstimator() {
  const [bondCount, setBondCount] = useState(8);
  const [recordBytes, setRecordBytes] = useState(192);
  const [redundancy, setRedundancy] = useState(2);

  const result = useMemo(() => {
    const logicalBytes = bondCount * recordBytes;
    const protectedBytes = logicalBytes * redundancy;
    const partitionBytes = Math.ceil(Math.max(protectedBytes, FLASH_PAGE) / FLASH_PAGE) * FLASH_PAGE;
    return {logicalBytes, protectedBytes, partitionBytes};
  }, [bondCount, recordBytes, redundancy]);

  return (
    <section className={styles.tool} aria-labelledby="bond-estimator-title">
      <div className={styles.toolHeading}>
        <div>
          <span className={styles.kicker}>ESTIMATOR / FLASH</span>
          <h3 id="bond-estimator-title">Bond / NVS 容量估算器</h3>
        </div>
        <span className={styles.toolIndex} aria-hidden="true">01</span>
      </div>

      <Presets
        label="常用 Bond 數"
        values={[8, 16, 32]}
        active={bondCount}
        onSelect={setBondCount}
      />

      <div className={styles.fieldGrid}>
        <NumberField
          id="bond-count"
          label="Bond 數量"
          value={bondCount}
          min={0}
          max={10000}
          unit="peers"
          onChange={(value) => setBondCount(clampNumber(value, 0, 10000, 0))}
        />
        <NumberField
          id="bond-record-bytes"
          label="每條邏輯記錄"
          value={recordBytes}
          min={32}
          max={4096}
          step={16}
          unit="B"
          help="包含安全欄位、索引、版本、CRC 與對齊"
          onChange={(value) => setRecordBytes(clampNumber(value, 32, 4096, 192))}
        />
        <NumberField
          id="bond-redundancy"
          label="存儲冗餘倍數"
          value={redundancy}
          min={1}
          max={8}
          step={0.25}
          unit="×"
          help="涵蓋 journal、雙副本、GC 與掉電恢復餘量"
          onChange={(value) => setRedundancy(clampNumber(value, 1, 8, 2))}
        />
      </div>

      <div className={styles.metrics} aria-live="polite">
        <div>
          <span>邏輯資料量</span>
          <strong>{formatBytes(result.logicalBytes)}</strong>
          <small>{bondCount} × {recordBytes} B</small>
        </div>
        <div>
          <span>含冗餘需求</span>
          <strong>{formatBytes(result.protectedBytes)}</strong>
          <small>邏輯資料 × {redundancy}</small>
        </div>
        <div className={styles.metricEmphasis}>
          <span>建議 NVS 起始容量</span>
          <strong>{formatBytes(result.partitionBytes)}</strong>
          <small>向上取整至 4 KiB；仍須符合實際 NVS/Flash 幾何</small>
        </div>
      </div>
    </section>
  );
}

function RadioOccupancyEstimator() {
  const [connections, setConnections] = useState(8);
  const [eventTime, setEventTime] = useState(2);
  const [interval, setInterval] = useState(30);

  const occupancy = useMemo(
    () => interval > 0 ? (connections * eventTime / interval) * 100 : 0,
    [connections, eventTime, interval],
  );
  const meterValue = Math.min(100, Math.max(0, occupancy));
  const state = occupancy < 60 ? 'comfortable' : occupancy < 80 ? 'tight' : 'fragile';
  const stateLabel = {
    comfortable: '仍有排程餘量',
    tight: '排程開始緊繃',
    fragile: '接近或超過脆弱區',
  }[state];

  return (
    <section className={styles.tool} aria-labelledby="radio-estimator-title">
      <div className={styles.toolHeading}>
        <div>
          <span className={styles.kicker}>ESTIMATOR / AIRTIME</span>
          <h3 id="radio-estimator-title">多連線無線佔用估算器</h3>
        </div>
        <span className={styles.toolIndex} aria-hidden="true">02</span>
      </div>

      <div className={styles.fieldGrid}>
        <NumberField
          id="radio-connections"
          label="活動連線數"
          value={connections}
          min={0}
          max={100}
          unit="links"
          onChange={(value) => setConnections(clampNumber(value, 0, 100, 0))}
        />
        <NumberField
          id="radio-event-time"
          label="每次 connection event"
          value={eventTime}
          min={0.05}
          max={1000}
          step={0.05}
          unit="ms"
          onChange={(value) => setEventTime(clampNumber(value, 0.05, 1000, 2))}
        />
        <NumberField
          id="radio-interval"
          label="Connection interval"
          value={interval}
          min={0.125}
          max={4000}
          step={0.125}
          unit="ms"
          onChange={(value) => setInterval(clampNumber(value, 0.125, 4000, 30))}
        />
      </div>

      <div className={styles.radioResult} aria-live="polite">
        <div className={styles.gauge}>
          <div className={styles.gaugeTrack} aria-hidden="true">
            <span className={styles.gaugeFill} data-state={state} style={{width: `${meterValue}%`}} />
          </div>
          <div className={styles.gaugeSummary}>
            <strong>{occupancy.toFixed(1)}%</strong>
            <span data-state={state}>{stateLabel}</span>
          </div>
        </div>
        <p>
          <code>{connections} × {eventTime} ms ÷ {interval} ms</code>。這是建立直覺的工程近似，
          <strong>尚未計入重傳、廣播、掃描、時鐘漂移、封包長度變化與排程保護時間</strong>。
        </p>
      </div>
    </section>
  );
}

function RelationshipExplorer() {
  const [activeId, setActiveId] = useState('bond');
  const active = relationshipLayers.find((layer) => layer.id === activeId) ?? relationshipLayers[0];

  return (
    <section className={styles.relationship} aria-labelledby="relationship-title">
      <div className={styles.toolHeading}>
        <div>
          <span className={styles.kicker}>MODEL / FOUR LIMITS</span>
          <h3 id="relationship-title">四層容量不是同一個數字</h3>
        </div>
        <span className={styles.toolIndex} aria-hidden="true">03</span>
      </div>

      <div className={styles.layerButtons} aria-label="切換資源層">
        {relationshipLayers.map((layer) => (
          <button
            key={layer.id}
            type="button"
            aria-pressed={layer.id === activeId}
            className={layer.id === activeId ? styles.layerActive : undefined}
            onClick={() => setActiveId(layer.id)}>
            <code>{layer.code}</code>
            <span>{layer.title}</span>
          </button>
        ))}
      </div>

      <article className={styles.layerDetail} aria-live="polite">
        <div>
          <span>{active.analogy}</span>
          <h4>{active.title}</h4>
          <p>{active.summary}</p>
        </div>
        <dl>
          <div>
            <dt>容量由誰決定</dt>
            <dd>{active.limit}</dd>
          </div>
          <div>
            <dt>它回答的問題</dt>
            <dd>{active.question}</dd>
          </div>
        </dl>
      </article>
    </section>
  );
}

export default function BleResourceWorkbench() {
  return (
    <div className={styles.workbench}>
      <div className={styles.workbenchIntro}>
        <span>INTERACTIVE RESOURCE MODEL</span>
        <p>調整數值，看看「記住多少裝置」和「同時連多少裝置」如何落在完全不同的資源預算上。</p>
      </div>
      <BondCapacityEstimator />
      <RadioOccupancyEstimator />
      <RelationshipExplorer />
      <noscript>
        <p className={styles.noScript}>JavaScript 未啟用；正文中的公式、拆解表與 8／16／32 筆預算表仍包含完整結論。</p>
      </noscript>
    </div>
  );
}
