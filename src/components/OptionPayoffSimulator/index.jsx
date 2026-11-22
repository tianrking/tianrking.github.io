import React, {useId, useRef, useState} from 'react';
import Heading from '@theme/Heading';
import PayoffChart, {formatMoney, formatNumber} from './PayoffChart';
import {createPortfolio, legValue, signedQuantity} from './payoff.mjs';
import {defaultPreset, groups, presets} from './presets.mjs';
import styles from './styles.module.css';

const maxLegs = 8;
const marketDefaults = {multiplier: 100, volatility: 25, rate: 3, yieldRate: 0};
const scenarioDefaults = {price: 100, low: 70, high: 130};
const newLeg = {kind: 'call', side: 'buy', strike: 100, premium: 4, quantity: 1, days: 0};
const kindLabels = {call: 'Call', put: 'Put', stock: '現貨'};
const sideLabels = {buy: '買入', sell: '賣出'};

function numberedLegs(id) {
  return presets[id].legs.map((leg, index) => ({...leg, id: index}));
}

function validNumber(value, min, max, step = 'any') {
  const number = Number(value);
  return value !== '' && Number.isFinite(number) && number >= min && number <= max
    && (step !== 1 || Number.isInteger(number));
}

function NumberField({label, value, min, max, step = 'any', onChange}) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="number" min={min} max={max} step={step}
        aria-invalid={!validNumber(value, min, max, step) || undefined}
        value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function SelectField({label, value, onChange, children}) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>{children}</select>
    </div>
  );
}

function LegEditor({leg, position, canRemove, edit, remove}) {
  const isStock = leg.kind === 'stock';
  const update = (key) => (value) => edit(leg.id, key, value);

  return (
    <fieldset className={styles.leg}>
      <legend>第 {position} 腿</legend>
      <div className={styles.fields}>
        <SelectField label="品種" value={leg.kind} onChange={update('kind')}>
          {Object.entries(kindLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </SelectField>
        <SelectField label="方向" value={leg.side} onChange={update('side')}>
          {Object.entries(sideLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </SelectField>
        {!isStock && <NumberField label="履約價（美元）" min={0.01} max={1000000} value={leg.strike} onChange={update('strike')} />}
        <NumberField label={isStock ? '開倉價（美元/股）' : '權利金（美元/股）'} min={0} max={1000000}
          value={leg.premium} onChange={update('premium')} />
        <NumberField label={isStock ? '數量（手）' : '數量（張）'} min={1} max={1000} step={1}
          value={leg.quantity} onChange={update('quantity')} />
        {!isStock && <NumberField label="估值日後剩餘天數" min={0} max={3650} step={1} value={leg.days} onChange={update('days')} />}
        <button type="button" className={styles.remove} aria-label={`刪除第 ${position} 腿`} disabled={!canRemove}
          onClick={() => remove(leg.id)}>刪除</button>
      </div>
    </fieldset>
  );
}

function formatBreakEvens(bounds) {
  if (!bounds.length) return '無';
  return bounds.map(([from, to]) => {
    if (from === 0 && to === Infinity) return '所有價格';
    if (to === Infinity) return `$${formatNumber(from)} 及以上`;
    if (from === to) return `$${formatNumber(from)}`;
    return `$${formatNumber(from)} 至 $${formatNumber(to)}`;
  }).join('、');
}

const legIsValid = ({kind, strike, premium, quantity, days}) =>
  validNumber(premium, 0, 1000000) && validNumber(quantity, 1, 1000, 1)
  && (kind === 'stock' || (validNumber(strike, 0.01, 1000000) && validNumber(days, 0, 3650, 1)));

function Summary({model, price}) {
  return (
    <dl className={styles.stats}>
      <div>
        <dt>{model.estimates ? '情境估算損益' : '情境到期損益'}</dt>
        <dd className={Number.isFinite(price) && model.profitAt(price) < 0 ? styles.loss : styles.gain}>
          <output>{Number.isFinite(price) ? formatMoney(model.profitAt(price)) : '—'}</output>
        </dd>
      </div>
      <div><dt>開倉淨現金流</dt><dd>{formatMoney(model.cashFlow)}</dd></div>
      {model.estimates ? (
        <div className={styles.breakEven}><dt>損益與估值假設</dt><dd>按所設估值日計算，隨剩餘時間、波動率、利率和股息率變化。</dd></div>
      ) : (
        <>
          <div><dt>最高到期損益</dt><dd>{formatMoney(model.best)}</dd></div>
          <div><dt>最低到期損益</dt><dd>{model.worst === -Infinity ? '虧損無上限' : formatMoney(model.worst)}</dd></div>
          <div className={styles.breakEven}><dt>到期損益平衡價</dt><dd>{formatBreakEvens(model.breakEvens)}</dd></div>
        </>
      )}
    </dl>
  );
}

export default function OptionPayoffSimulator() {
  const [template, setTemplate] = useState(defaultPreset);
  const [legs, setLegs] = useState(() => numberedLegs(defaultPreset));
  const [market, setMarket] = useState(marketDefaults);
  const [scenario, setScenario] = useState(scenarioDefaults);
  const nextId = useRef(maxLegs);
  const editorHeading = useRef(null);
  const sliderId = useId();
  const estimates = legs.some((leg) => leg.kind !== 'stock' && Number(leg.days) > 0);
  const validMarket = validNumber(market.multiplier, 1, 10000, 1)
    && (!estimates || (validNumber(market.volatility, 1, 400) && validNumber(market.rate, -30, 30)
      && validNumber(market.yieldRate, 0, 50)));
  const settings = {
    multiplier: Number(market.multiplier),
    volatility: Number(market.volatility) / 100,
    rate: Number(market.rate) / 100,
    yieldRate: Number(market.yieldRate) / 100,
  };
  const validLegs = legs.every(legIsValid);
  const numericLegs = validLegs ? legs.map((leg) => ({
    ...leg, strike: Number(leg.strike), premium: Number(leg.premium),
    quantity: Number(leg.quantity), days: Number(leg.days),
  })) : [];
  const model = validLegs && validMarket ? createPortfolio(numericLegs, settings) : null;
  const low = Number(scenario.low);
  const high = Number(scenario.high);
  const validRange = validNumber(scenario.low, 0, 1000000)
    && validNumber(scenario.high, 0, 1000000) && high - low >= 0.01 - 1e-10;
  const price = validNumber(scenario.price, 0, 1000000) ? Number(scenario.price) : NaN;
  const sliderValue = Number.isFinite(price) ? Math.max(low, Math.min(high, price)) : low;

  function selectTemplate(id) {
    setTemplate(id);
    setLegs(numberedLegs(id));
  }
  function reset() {
    setLegs(numberedLegs(template));
    setMarket(marketDefaults);
    setScenario(scenarioDefaults);
  }
  function editLeg(id, key, value) {
    setLegs((previous) => previous.map((leg) => {
      if (leg.id !== id) return leg;
      if (key === 'kind' && leg.kind === 'stock' && Number(leg.strike) <= 0) {
        return {...leg, strike: newLeg.strike, kind: value};
      }
      return {...leg, [key]: value};
    }));
  }
  function removeLeg(id) {
    setLegs((previous) => previous.filter((leg) => leg.id !== id));
    editorHeading.current?.focus();
  }
  function addLeg() {
    const id = nextId.current++;
    setLegs((previous) => previous.length < maxLegs ? [...previous, {...newLeg, id}] : previous);
  }
  const setMarketField = (field) => (value) => setMarket((previous) => ({...previous, [field]: value}));
  const setScenarioField = (field) => (value) => setScenario((previous) => ({...previous, [field]: value}));

  return (
    <section className={styles.simulator} aria-labelledby="strategy-simulator">
      <Heading as="h2" id="strategy-simulator">期權策略損益模擬</Heading>
      <p>選擇範本，調節組合腿和標的價格，觀察損益如何變化。範例使用假設權利金，按美元計價，未計交易費、保證金利息、股息現金流或提前指派。</p>
      <noscript><p>目前顯示預設牛市 Put 價差。啟用 JavaScript 後可切換和調整參數。</p></noscript>
      <div className={styles.workspace}>
        <div className={styles.toolbar}>
          <SelectField label="策略範本" value={template} onChange={selectTemplate}>
            {groups.map(({name, strategies}) => (
              <optgroup key={name} label={name}>
                {strategies.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </optgroup>
            ))}
          </SelectField>
          <NumberField label="合約乘數（股）" min={1} max={10000} step={1} value={market.multiplier} onChange={setMarketField('multiplier')} />
          <button type="button" onClick={reset}>重設為範本</button>
        </div>
        <p className={styles.strategyNote}>{presets[template].description}</p>
        <div className={styles.controls}>
          <div className={styles.fields}>
            <NumberField label="情境標的價（美元）" min={0} max={1000000} value={scenario.price} onChange={setScenarioField('price')} />
            <NumberField label="橫軸起點（美元）" min={0} max={1000000} value={scenario.low} onChange={setScenarioField('low')} />
            <NumberField label="橫軸終點（美元）" min={0} max={1000000} value={scenario.high} onChange={setScenarioField('high')} />
          </div>
          {!Number.isFinite(price) && <p role="status" className={styles.validation}>請輸入 0 至 1,000,000 美元之間的情境標的價。</p>}
          {!validRange && <p role="status" className={styles.validation}>橫軸終點須比起點至少高 0.01 美元。</p>}
          {validRange && (
            <div className={styles.slider}>
              <label htmlFor={sliderId}>沿曲線選價</label>
              <input id={sliderId} type="range" min={low} max={high} step="any" value={sliderValue}
                aria-valuetext={`${formatNumber(sliderValue)} 美元`}
                onChange={(event) => setScenarioField('price')(Number(Number(event.target.value).toFixed(2)))} />
            </div>
          )}
        </div>
        {model && <Summary model={model} price={price} />}
        {model && validRange && <PayoffChart model={model} low={low} high={high} probe={price} />}
        {!model && <p role="status" className={styles.validation}>請填寫完整參數，並檢查標示的欄位。履約價必須大於零，數量和剩餘天數必須為整數。</p>}

        <h3 ref={editorHeading} tabIndex={-1}>調整組合腿</h3>
        <p className={styles.hint}>期權數量按合約張數填寫。現貨每手使用同一乘數，開倉價按每股填寫。到期腿剩餘天數填 0，跨期組合可以將近月到期日設為估值日。</p>
        <div className={styles.legs}>
          {legs.map((leg, index) => (
            <LegEditor key={leg.id} leg={leg} position={index + 1} canRemove={legs.length > 1}
              edit={editLeg} remove={removeLeg} />
          ))}
        </div>
        <button className={styles.add} type="button" onClick={addLeg} disabled={legs.length === maxLegs}>
          {legs.length === maxLegs ? '已達 8 腿上限' : '新增一腿'}
        </button>

        {estimates && (
          <fieldset className={styles.leg}>
            <legend>估值假設</legend>
            <div className={styles.fields}>
              <NumberField label="隱含波動率（%）" min={1} max={400} value={market.volatility} onChange={setMarketField('volatility')} />
              <NumberField label="年化無風險利率（%）" min={-30} max={30} value={market.rate} onChange={setMarketField('rate')} />
              <NumberField label="年化股息率（%）" min={0} max={50} value={market.yieldRate} onChange={setMarketField('yieldRate')} />
            </div>
            <p className={styles.hint}>尚未到期的部位用歐式 Black–Scholes 模型估值，各腿使用同一波動率輸入。已到期的腿按內在價值計算。</p>
          </fieldset>
        )}
        {model && Number.isFinite(price) && (
          <details className={styles.chartDetails}>
            <summary>查看情境下的逐腿損益</summary>
            <table>
              <caption>標的價格為 ${formatNumber(price)} 時的組合明細</caption>
              <thead><tr><th scope="col">組合腿</th><th scope="col">損益（美元）</th></tr></thead>
              <tbody>
                {numericLegs.map((leg, index) => (
                  <tr key={leg.id}>
                    <th scope="row">第 {index + 1} 腿 · {sideLabels[leg.side]} {kindLabels[leg.kind]}</th>
                    <td>{formatMoney(signedQuantity(leg) * (legValue(leg, price, settings) - leg.premium) * settings.multiplier)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        )}
      </div>
    </section>
  );
}
