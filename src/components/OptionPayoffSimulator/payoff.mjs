// Dollar prices are per share. Each positive quantity is scaled by the share multiplier.
export function legValue(leg, spot, {volatility, rate, yieldRate}) {
  if (leg.kind === 'stock') return spot;

  const {kind, strike, days} = leg;
  if (!days) return Math.max(0, kind === 'call' ? spot - strike : strike - spot);

  const time = days / 365;
  const discountedStrike = strike * Math.exp(-rate * time);
  if (!spot) return kind === 'call' ? 0 : discountedStrike;
  const discountedSpot = spot * Math.exp(-yieldRate * time);
  const drift = volatility * Math.sqrt(time);
  const d1 = (Math.log(spot / strike) + (rate - yieldRate + volatility ** 2 / 2) * time) / drift;
  const d2 = d1 - drift;
  const value = kind === 'call'
    ? discountedSpot * normalCdf(d1) - discountedStrike * normalCdf(d2)
    : discountedStrike * normalCdf(-d2) - discountedSpot * normalCdf(-d1);
  return Math.max(0, value);
}

function normalCdf(x) {
  // Abramowitz–Stegun 26.2.17, with symmetry for negative arguments.
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const tail = Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI) * t
    * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x >= 0 ? 1 - tail : tail;
}

export function signedQuantity(leg) {
  return leg.side === 'buy' ? leg.quantity : -leg.quantity;
}

const epsilon = 1e-7;
const isZero = (value) => Math.abs(value) < epsilon;

export function createPortfolio(legs, settings) {
  const {multiplier} = settings;
  const estimates = legs.some((leg) => leg.kind !== 'stock' && leg.days > 0);
  const strikes = [...new Set(legs.filter((leg) => leg.kind !== 'stock').map((leg) => leg.strike))]
    .sort((a, b) => a - b);
  const cashFlow = legs.reduce((sum, leg) => sum - signedQuantity(leg) * leg.premium * multiplier, 0);
  const profitAt = (spot) => legs.reduce(
    (sum, leg) => sum + signedQuantity(leg) * (legValue(leg, spot, settings) - leg.premium) * multiplier,
    0,
  );

  if (estimates) return {estimates, cashFlow, strikes, profitAt};

  const points = [0, ...strikes].map((spot) => [spot, profitAt(spot)]);
  const tailSlope = legs.reduce(
    (sum, leg) => leg.kind === 'put' ? sum : sum + signedQuantity(leg) * multiplier,
    0,
  );
  const bounds = [];
  const addBreakEven = (from, to = from) => {
    const previous = bounds.at(-1);
    if (previous && isZero(from - previous[1])) previous[1] = to;
    else bounds.push([from, to]);
  };
  for (let i = 1; i < points.length; i += 1) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    if (isZero(y0)) addBreakEven(x0, isZero(y1) ? x1 : x0);
    else if (!isZero(y1) && Math.sign(y0) !== Math.sign(y1)) {
      addBreakEven(x0 - y0 * (x1 - x0) / (y1 - y0));
    }
  }
  const [lastX, lastY] = points.at(-1);
  if (isZero(lastY)) addBreakEven(lastX, isZero(tailSlope) ? Infinity : lastX);
  else if (!isZero(tailSlope) && Math.sign(lastY) !== Math.sign(tailSlope)) {
    addBreakEven(lastX - lastY / tailSlope);
  }
  const values = points.map(([, value]) => value);
  return {
    estimates, cashFlow, strikes, profitAt, breakEvens: bounds,
    best: tailSlope > 0 ? Infinity : Math.max(...values),
    worst: tailSlope < 0 ? -Infinity : Math.min(...values),
  };
}
