import React, {useEffect, useId, useRef, useState} from 'react';
import styles from './styles.module.css';

export const formatNumber = new Intl.NumberFormat('zh-Hant', {maximumFractionDigits: 2}).format;
const formatAxis = new Intl.NumberFormat('zh-Hant', {notation: 'compact', maximumFractionDigits: 2}).format;
export function formatMoney(value) {
  if (!Number.isFinite(value)) return '無上限';
  const sign = value < -0.005 ? '−' : value > 0.005 ? '+' : '';
  return `${sign}$${formatNumber(Math.abs(value))}`;
}

function uniformSamples(low, high, steps) {
  return Array.from({length: steps + 1}, (_, i) => low + (high - low) * i / steps);
}

function quantizedTicks(low, high) {
  const magnitude = 10 ** Math.floor(Math.log10((high - low) / 4));
  const scale = (high - low) / (4 * magnitude);
  const step = [1, 2, 2.5, 5, 10].find((n) => n >= scale) * magnitude;
  const start = Math.floor(low / step);
  const end = Math.ceil(high / step);
  return Array.from({length: end - start + 1}, (_, i) => (start + i) * step);
}

export default function PayoffChart({model, low, high, probe}) {
  const id = useId();
  const container = useRef(null);
  const [width, setWidth] = useState(640);
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.floor(entry.contentRect.width);
      if (nextWidth > 0) setWidth(Math.max(265, nextWidth));
    });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  const graphSpots = model.estimates ? uniformSamples(low, high, 160) : [low, high];
  const samples = [...new Set([...graphSpots, ...model.strikes.filter((x) => x > low && x < high)])]
    .sort((a, b) => a - b).map((x) => [x, model.profitAt(x)]);
  const values = samples.map(([, y]) => y);
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const padding = Math.max(1, (max - min) * 0.08);
  const yTicks = quantizedTicks(min - padding, max + padding);
  const xTicks = uniformSamples(low, high, width < 460 ? 3 : 6);
  const frame = {left: width < 460 ? 63 : 80, right: width - 20, top: 32, bottom: 231};
  const xPos = (x) => frame.left + (x - low) / (high - low) * (frame.right - frame.left);
  const yPos = (y) => frame.bottom - (y - yTicks[0]) / (yTicks.at(-1) - yTicks[0]) * (frame.bottom - frame.top);
  const curve = samples.map(([x, y], i) => `${i ? 'L' : 'M'}${xPos(x).toFixed(2)},${yPos(y).toFixed(2)}`).join(' ');
  const fill = `${curve} L${frame.right},${yPos(0)} H${frame.left} Z`;
  const zeroOffset = (yPos(0) - frame.top) / (frame.bottom - frame.top);
  const showProbe = Number.isFinite(probe) && probe >= low && probe <= high;
  const selectedProfit = showProbe ? model.profitAt(probe) : 0;
  const dataSpots = [...new Set([...uniformSamples(low, high, 4), ...model.strikes]
    .filter((spot) => spot >= low && spot <= high))].sort((a, b) => a - b);

  return (
    <div className={styles.chart} ref={container}>
      <svg className={styles.plot} viewBox={`0 0 ${width} 283`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>{model.estimates ? '組合估值曲線' : '組合到期損益曲線'}</title>
        <desc id={`${id}-desc`}>橫軸為標的價格，縱軸為組合損益，單位為美元。曲線資料可在圖下查看。</desc>
        <defs>
          <linearGradient id={`${id}-area`} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={frame.top} y2={frame.bottom}>
            <stop stopColor="var(--payoff-gain)" stopOpacity=".12" />
            <stop offset={zeroOffset} stopColor="var(--payoff-gain)" stopOpacity=".12" />
            <stop offset={zeroOffset} stopColor="var(--payoff-loss)" stopOpacity=".12" />
            <stop offset="1" stopColor="var(--payoff-loss)" stopOpacity=".12" />
          </linearGradient>
        </defs>
        <text x={frame.left} y="17">損益（美元）</text>
        {yTicks.map((value) => (
          <g key={value}>
            <line x1={frame.left} x2={frame.right} y1={yPos(value)} y2={yPos(value)}
              className={value === 0 ? styles.zeroLine : styles.gridLine} />
            <text x={frame.left - 8} y={yPos(value)} dominantBaseline="middle" textAnchor="end">{formatAxis(value)}</text>
          </g>
        ))}
        {xTicks.map((value, i) => (
          <g key={value}>
            <line x1={xPos(value)} x2={xPos(value)} y1={frame.top} y2={frame.bottom} className={styles.gridLine} />
            <text x={xPos(value)} y={frame.bottom + 19} textAnchor={i === xTicks.length - 1 ? 'end' : 'middle'}>
              {formatAxis(value)}
            </text>
          </g>
        ))}
        <text x={(frame.left + frame.right) / 2} y="275" textAnchor="middle">標的價格（美元）</text>
        <path d={fill} fill={`url(#${id}-area)`} />
        <path d={curve} className={styles.curve} />
        {showProbe && (
          <g>
            <line x1={xPos(probe)} x2={xPos(probe)} y1={frame.top} y2={frame.bottom} className={styles.probeLine} />
            <circle cx={xPos(probe)} cy={yPos(selectedProfit)} r="4.5" className={styles.probe} />
          </g>
        )}
      </svg>
      <details className={styles.chartDetails}>
        <summary>查看曲線資料</summary>
        <table>
          <caption>圖區端點、取樣價與可見履約價對應的損益</caption>
          <thead><tr><th scope="col">標的價格（美元）</th><th scope="col">組合損益（美元）</th></tr></thead>
          <tbody>
            {dataSpots.map((spot) => <tr key={spot}><td>{formatNumber(spot)}</td><td>{formatMoney(model.profitAt(spot))}</td></tr>)}
          </tbody>
        </table>
      </details>
    </div>
  );
}
