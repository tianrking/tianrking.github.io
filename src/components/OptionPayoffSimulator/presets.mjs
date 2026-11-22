const call = (side, strike, premium, quantity = 1, days = 0) =>
  ({kind: 'call', side, strike, premium, quantity, days});
const put = (side, strike, premium, quantity = 1, days = 0) =>
  ({kind: 'put', side, strike, premium, quantity, days});
const shares = (side, premium = 100) =>
  ({kind: 'stock', side, strike: 0, premium, quantity: 1, days: 0});

export const groups = [
  {
    name: '单腿与现金担保',
    strategies: [
      ['long-call', '买入 Call', '用权利金换取上涨敞口。到期时，标的涨过行权价之后，买腿开始产生内在价值。', [call('buy', 100, 4)]],
      ['short-call', '裸卖 Call', '上涨时空头损失继续扩大，理论上无上限。', [call('sell', 100, 4)]],
      ['long-put', '买入 Put', '到期价越低，买腿的内在价值越高。标的最低按零计算。', [put('buy', 100, 4)]],
      ['short-put', '裸卖 Put', '收取权利金，承担标的下跌带来的亏损和可能的买入义务。', [put('sell', 100, 4)]],
      ['cash-put', '现金担保卖 Put', '为可能的接货预留现金。担保方式影响资金占用，图中绘制的是空头 Put 的盈亏。', [put('sell', 95, 2)]],
    ],
  },
  {
    name: '现货搭配与合成仓位',
    strategies: [
      ['covered-call', '备兑 Call', '持有现货并卖出 Call。权利金缓冲下跌，行权价以上的现货涨幅被空头 Call 抵消。', [shares('buy'), call('sell', 105, 2)]],
      ['protective-put', '保护性 Put', '持有现货并买入 Put。标的跌破行权价后，买腿抵消额外的现货跌幅。', [shares('buy'), put('buy', 95, 2)]],
      ['collar', '领口策略', '持有现货、买入低执行价 Put、卖出高执行价 Call。两条期权腿分别限制下跌和上涨敞口。', [shares('buy'), put('buy', 95, 2), call('sell', 105, 2)]],
      ['covered-put', '空头备兑 Put', '做空现货并卖出 Put。行权价以下的做空利润被空头 Put 抵消，上涨仍会造成亏损。', [shares('sell'), put('sell', 95, 2)]],
      ['synthetic-long', '合成多头', '同一行权价买入 Call、卖出 Put。到期曲线与持有现货的斜率相同，开仓现金流独立计算。', [call('buy', 100, 4), put('sell', 100, 4)]],
      ['synthetic-short', '合成空头', '同一行权价卖出 Call、买入 Put。到期曲线与做空现货的斜率相同。', [call('sell', 100, 4), put('buy', 100, 4)]],
    ],
  },
  {
    name: '垂直价差',
    strategies: [
      ['bull-call', '牛市 Call 价差', '买低行权价 Call、卖高行权价 Call。到期盈亏在两档行权价之间上升。', [call('buy', 95, 7), call('sell', 105, 2)]],
      ['bull-put', '牛市 Put 价差', '卖高行权价 Put、买低行权价 Put。默认参数与上方原有盈亏示意图相同。', [put('sell', 95, 2), put('buy', 90, 0.8)]],
      ['bear-call', '熊市 Call 价差', '卖低行权价 Call、买高行权价 Call。到期盈亏在两档行权价之间下降。', [call('sell', 95, 7), call('buy', 105, 2)]],
      ['bear-put', '熊市 Put 价差', '买高行权价 Put、卖低行权价 Put。股价跌破较低行权价后，价差价值达到上限。', [put('buy', 105, 7), put('sell', 95, 2)]],
    ],
  },
  {
    name: '跨式、蝶式与多腿组合',
    strategies: [
      ['long-straddle', '买入跨式', '同价买入 Call 和 Put，观察两侧分别需要多大的到期变动才能抵消总权利金。', [call('buy', 100, 4), put('buy', 100, 4)]],
      ['short-straddle', '卖出跨式', '同价卖出 Call 和 Put。到期价靠近行权价时保留较多权利金，向上突破时承受无上限损失。', [call('sell', 100, 4), put('sell', 100, 4)]],
      ['long-strangle', '买入宽跨式', '买入不同执行价的 Put 和 Call。两档行权价之间，两条腿到期都没有内在价值。', [put('buy', 95, 2), call('buy', 105, 2)]],
      ['short-strangle', '卖出宽跨式', '卖出不同执行价的 Put 和 Call。两档行权价之间具有同样的到期盈亏。', [put('sell', 95, 2), call('sell', 105, 2)]],
      ['call-butterfly', '买入 Call 蝶式', '用 1∶2∶1 数量买两翼、卖中间腿。等距行权价时，收益峰值在中间行权价。', [call('buy', 90, 11), call('sell', 100, 4, 2), call('buy', 110, 1)]],
      ['put-butterfly', '买入 Put 蝶式', '用 Put 构建同样的 1∶2∶1 结构，可对照其到期曲线与 Call 蝶式。', [put('buy', 90, 1), put('sell', 100, 4, 2), put('buy', 110, 11)]],
      ['iron-butterfly', '卖出铁蝶式', '卖出中间跨式，同时买入两翼。最大到期收益点在中间行权价。', [put('buy', 90, 1), put('sell', 100, 4), call('sell', 100, 4), call('buy', 110, 1)]],
      ['iron-condor', '卖出铁鹰式', '卖出内侧宽跨式，同时买入两翼。两档内侧行权价之间形成盈利平台。', [put('buy', 90, 1), put('sell', 95, 2), call('sell', 105, 2), call('buy', 110, 1)]],
      ['call-condor', '买入 Call 鹰式', '买外侧两条 Call、卖内侧两条 Call。等宽两翼时，内侧两档之间形成平顶。', [call('buy', 90, 11), call('sell', 95, 7), call('sell', 105, 2), call('buy', 110, 1)]],
      ['call-ratio', '1×2 Call 比率价差', '买一张低行权价 Call、卖两张高行权价 Call。上行尾部仍留有一张空头 Call 敞口。', [call('buy', 95, 7), call('sell', 105, 2, 2)]],
      ['put-ratio', '1×2 Put 比率价差', '买一张高行权价 Put、卖两张低行权价 Put。跌破低行权价后重新出现下跌风险。', [put('buy', 105, 7), put('sell', 95, 2, 2)]],
    ],
  },
  {
    name: '日历与对角价差',
    strategies: [
      ['call-calendar', '买入 Call 日历价差', '同价卖近月、买远月。默认曲线以近月到期日为估值日，远月腿还有 30 天。', [call('sell', 100, 3), call('buy', 100, 5, 1, 30)]],
      ['put-calendar', '买入 Put 日历价差', '用 Put 做同价跨期组合。调整远月隐含波动率，观察近月到期时的估值变化。', [put('sell', 100, 3), put('buy', 100, 5, 1, 30)]],
      ['call-diagonal', 'Call 对角价差', '卖高行权价近月 Call、买低行权价远月 Call，同时改变行权价和期限。', [call('sell', 105, 1.5), call('buy', 95, 8, 1, 30)]],
      ['put-diagonal', 'Put 对角价差', '卖低行权价近月 Put、买高行权价远月 Put。远月腿在近月到期时仍有估算价值。', [put('sell', 95, 1.5), put('buy', 105, 8, 1, 30)]],
    ],
  },
];

export const presets = Object.fromEntries(groups.flatMap(({strategies}) =>
  strategies.map(([id, name, description, legs]) => [id, {name, description, legs}]),
));

export const defaultPreset = 'bull-put';
