import React, {useId, useRef, useState} from 'react';
import PayoffChart, {formatMoney, formatNumber} from './PayoffChart';
import {createPortfolio, legValue, signedQuantity} from './payoff.mjs';
import {defaultPreset, groups, presets} from './presets.mjs';
import styles from './styles.module.css';

const maxLegs = 8;
const marketDefaults = {multiplier: 100, volatility: 25, rate: 3, yieldRate: 0};
const scenarioDefaults = {price: 100, low: 70, high: 130};
const newLeg = {kind: 'call', side: 'buy', strike: 100, premium: 4, quantity: 1, days: 0};
const kindLabels = {call: 'Call', put: 'Put', stock: '现货'};
const sideLabels = {buy: '买入', sell: '卖出'};

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
        <SelectField label="品种" value={leg.kind} onChange={update('kind')}>
          {Object.entries(kindLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </SelectField>
        <SelectField label="方向" value={leg.side} onChange={update('side')}>
          {Object.entries(sideLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </SelectField>
        {!isStock && <NumberField label="行权价（美元）" min={0.01} max={1000000} value={leg.strike} onChange={update('strike')} />}
        <NumberField label={isStock ? '开仓价（美元/股）' : '权利金（美元/股）'} min={0} max={1000000}
          value={leg.premium} onChange={update('premium')} />
        <NumberField label={isStock ? '数量（手）' : '数量（张）'} min={1} max={1000} step={1}
          value={leg.quantity} onChange={update('quantity')} />
        {!isStock && <NumberField label="估值日后剩余天数" min={0} max={3650} step={1} value={leg.days} onChange={update('days')} />}
        <button type="button" className={styles.remove} aria-label={`删除第 ${position} 腿`} disabled={!canRemove}
          onClick={() => remove(leg.id)}>删除</button>
      </div>
    </fieldset>
  );
}

function formatBreakEvens(bounds) {
  if (!bounds.length) return '无';
  return bounds.map(([from, to]) => {
    if (from === 0 && to === Infinity) return '所有价格';
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
        <dt>{model.estimates ? '情景估算盈亏' : '情景到期盈亏'}</dt>
        <dd className={Number.isFinite(price) && model.profitAt(price) < 0 ? styles.loss : styles.gain}>
          <output>{Number.isFinite(price) ? formatMoney(model.profitAt(price)) : '—'}</output>
        </dd>
      </div>
      <div><dt>开仓净现金流</dt><dd>{formatMoney(model.cashFlow)}</dd></div>
      {model.estimates ? (
        <div className={styles.breakEven}><dt>盈亏与估值假设</dt><dd>按所设估值日计算，随剩余时间、波动率、利率和股息率变化。</dd></div>
      ) : (
        <>
          <div><dt>最高到期盈亏</dt><dd>{formatMoney(model.best)}</dd></div>
          <div><dt>最低到期盈亏</dt><dd>{model.worst === -Infinity ? '亏损无上限' : formatMoney(model.worst)}</dd></div>
          <div className={styles.breakEven}><dt>到期盈亏平衡价</dt><dd>{formatBreakEvens(model.breakEvens)}</dd></div>
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
      <h2 id="strategy-simulator">期权策略盈亏仿真</h2>
      <p>选择模板，调节组合腿和标的价格，观察盈亏如何变化。示例使用假设权利金，按美元计价，未计交易费、保证金利息、股息现金流或提前指派。</p>
      <noscript><p>当前显示默认牛市 Put 价差。启用 JavaScript 后可切换和调整参数。</p></noscript>
      <div className={styles.workspace}>
        <div className={styles.toolbar}>
          <SelectField label="策略模板" value={template} onChange={selectTemplate}>
            {groups.map(({name, strategies}) => (
              <optgroup key={name} label={name}>
                {strategies.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </optgroup>
            ))}
          </SelectField>
          <NumberField label="合约乘数（股）" min={1} max={10000} step={1} value={market.multiplier} onChange={setMarketField('multiplier')} />
          <button type="button" onClick={reset}>恢复模板</button>
        </div>
        <p className={styles.strategyNote}>{presets[template].description}</p>
        <div className={styles.controls}>
          <div className={styles.fields}>
            <NumberField label="情景标的价（美元）" min={0} max={1000000} value={scenario.price} onChange={setScenarioField('price')} />
            <NumberField label="横轴起点（美元）" min={0} max={1000000} value={scenario.low} onChange={setScenarioField('low')} />
            <NumberField label="横轴终点（美元）" min={0} max={1000000} value={scenario.high} onChange={setScenarioField('high')} />
          </div>
          {!Number.isFinite(price) && <p role="status" className={styles.validation}>请输入 0 至 1,000,000 美元之间的情景标的价。</p>}
          {!validRange && <p role="status" className={styles.validation}>横轴终点须比起点至少高 0.01 美元。</p>}
          {validRange && (
            <div className={styles.slider}>
              <label htmlFor={sliderId}>沿曲线选价</label>
              <input id={sliderId} type="range" min={low} max={high} step="any" value={sliderValue}
                aria-valuetext={`${formatNumber(sliderValue)} 美元`}
                onChange={(event) => setScenarioField('price')(Number(Number(event.target.value).toFixed(2)))} />
            </div>
          )}
        </div>
        {model && <Summary model={model} price={price} />}
        {model && validRange && <PayoffChart model={model} low={low} high={high} probe={price} />}
        {!model && <p role="status" className={styles.validation}>请填完整参数，并检查所标出的输入。行权价必须大于零，数量和剩余天数必须为整数。</p>}

        <h3 ref={editorHeading} tabIndex={-1}>调整组合腿</h3>
        <p className={styles.hint}>期权数量按合约张数填写。现货每手使用同一乘数，开仓价按每股填写。到期腿剩余天数填 0，跨期组合可以将近月到期日设为估值日。</p>
        <div className={styles.legs}>
          {legs.map((leg, index) => (
            <LegEditor key={leg.id} leg={leg} position={index + 1} canRemove={legs.length > 1}
              edit={editLeg} remove={removeLeg} />
          ))}
        </div>
        <button className={styles.add} type="button" onClick={addLeg} disabled={legs.length === maxLegs}>
          {legs.length === maxLegs ? '已达 8 腿上限' : '添加一腿'}
        </button>

        {estimates && (
          <fieldset className={styles.leg}>
            <legend>估值假设</legend>
            <div className={styles.fields}>
              <NumberField label="隐含波动率（%）" min={1} max={400} value={market.volatility} onChange={setMarketField('volatility')} />
              <NumberField label="年化无风险利率（%）" min={-30} max={30} value={market.rate} onChange={setMarketField('rate')} />
              <NumberField label="年化股息率（%）" min={0} max={50} value={market.yieldRate} onChange={setMarketField('yieldRate')} />
            </div>
            <p className={styles.hint}>有效期未归零的腿用欧式 Black–Scholes 模型估值，各腿使用同一波动率输入。已到期的腿按内在价值计算。</p>
          </fieldset>
        )}
        {model && Number.isFinite(price) && (
          <details className={styles.chartDetails}>
            <summary>查看情景下的逐腿盈亏</summary>
            <table>
              <caption>标的价格为 ${formatNumber(price)} 时的组合明细</caption>
              <thead><tr><th scope="col">组合腿</th><th scope="col">盈亏（美元）</th></tr></thead>
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
