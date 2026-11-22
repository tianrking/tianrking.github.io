import assert from 'node:assert/strict';
import test from 'node:test';
import {createPortfolio, legValue} from './payoff.mjs';
import {defaultPreset, presets} from './presets.mjs';

const market = {multiplier: 100, volatility: 0.25, rate: 0.03, yieldRate: 0};
const portfolio = (preset, settings = market) => createPortfolio(presets[preset].legs, settings);
const close = (actual, expected, tolerance = 1e-7) =>
  assert(Math.abs(actual - expected) < tolerance, `Expected ${expected}, received ${actual}`);

test('matches the original bull put example, including both tails', () => {
  const model = portfolio(defaultPreset);
  close(model.cashFlow, 120);
  close(model.best, 120);
  close(model.worst, -380);
  close(model.profitAt(75), -380);
  close(model.profitAt(95), 120);
  close(model.profitAt(93.8), 0);
  assert.deepEqual(model.breakEvens, [[93.8, 93.8]]);
});

test('covers both the unlimited call tail and the bounded short put loss', () => {
  assert.equal(portfolio('long-call').best, Infinity);
  assert.equal(portfolio('short-call').worst, -Infinity);
  assert.equal(portfolio('cash-put').worst, -9300);
  assert.equal(portfolio('cash-put').profitAt(75), -1800);
});

test('uses the share multiplier for paired stock and options', () => {
  const model = portfolio('covered-call', {...market, multiplier: 50});
  assert.equal(model.cashFlow, -4900);
  assert.equal(model.best, 350);
  assert.equal(model.worst, -4900);
  assert.deepEqual(model.breakEvens, [[98, 98]]);
});

test('finds two break-evens, including a root beyond the final strike', () => {
  assert.deepEqual(portfolio('long-straddle').breakEvens, [[92, 92], [108, 108]]);
  assert.deepEqual(portfolio('iron-condor').breakEvens, [[93, 93], [107, 107]]);
});

test('returns a break-even interval for a flat zero-payoff segment', () => {
  const call = {kind: 'call', side: 'buy', strike: 100, premium: 0, quantity: 1, days: 0};
  assert.deepEqual(createPortfolio([call], market).breakEvens, [[0, 100]]);
  const offset = {...call, side: 'sell'};
  assert.deepEqual(createPortfolio([call, offset], market).breakEvens, [[0, Infinity]]);
});

test('values later expiry legs and preserves discounted put-call parity', () => {
  const call = {kind: 'call', strike: 100, days: 30};
  const put = {...call, kind: 'put'};
  close(legValue(call, 100, market) - legValue(put, 100, market),
    100 - 100 * Math.exp(-market.rate * 30 / 365));
  close(legValue(put, 0, market), 100 * Math.exp(-market.rate * 30 / 365));
  assert.equal(legValue(call, 0, market), 0);
  const example = portfolio('call-calendar');
  assert.equal(example.estimates, true);
  assert.equal(example.best, undefined);
  assert(portfolio('call-calendar', {...market, volatility: 0.5}).profitAt(100) > example.profitAt(100));
});

test('all thirty presets produce finite scenario values and correctly categorized valuation', () => {
  assert.equal(Object.keys(presets).length, 30);
  for (const [name, preset] of Object.entries(presets)) {
    const model = portfolio(name);
    assert.equal(model.estimates, preset.legs.some((leg) => leg.days > 0));
    for (const spot of [0, 75, 100, 125, 1000000]) {
      assert(Number.isFinite(model.profitAt(spot)), name);
    }
  }
});
