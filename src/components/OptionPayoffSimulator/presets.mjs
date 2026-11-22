const call = (side, strike, premium, quantity = 1, days = 0) =>
  ({kind: 'call', side, strike, premium, quantity, days});
const put = (side, strike, premium, quantity = 1, days = 0) =>
  ({kind: 'put', side, strike, premium, quantity, days});
const shares = (side, premium = 100) =>
  ({kind: 'stock', side, strike: 0, premium, quantity: 1, days: 0});

export const groups = [
  {
    name: '單腿與現金擔保',
    strategies: [
      ['long-call', '買入 Call', '用權利金換取上漲曝險。到期時，標的漲過履約價之後，買腿開始產生內在價值。', [call('buy', 100, 4)]],
      ['short-call', '裸賣 Call', '上漲時空頭損失繼續擴大，理論上無上限。', [call('sell', 100, 4)]],
      ['long-put', '買入 Put', '到期價越低，買腿的內在價值越高。標的最低按零計算。', [put('buy', 100, 4)]],
      ['short-put', '裸賣 Put', '收取權利金，承擔標的下跌帶來的虧損和可能的買入義務。', [put('sell', 100, 4)]],
      ['cash-put', '現金擔保賣 Put', '為可能的接貨預留現金。擔保方式影響資金佔用，圖中繪製的是空頭 Put 的損益。', [put('sell', 95, 2)]],
    ],
  },
  {
    name: '現貨搭配與合成倉位',
    strategies: [
      ['covered-call', '備兌 Call', '持有現貨並賣出 Call。權利金緩衝下跌，履約價以上的現貨漲幅被空頭 Call 抵銷。', [shares('buy'), call('sell', 105, 2)]],
      ['protective-put', '保護性 Put', '持有現貨並買入 Put。標的跌破履約價後，買腿抵銷額外的現貨跌幅。', [shares('buy'), put('buy', 95, 2)]],
      ['collar', '領口策略', '持有現貨、買入低履約價 Put、賣出高履約價 Call。兩條期權腿分別限制下跌和上漲曝險。', [shares('buy'), put('buy', 95, 2), call('sell', 105, 2)]],
      ['covered-put', '空頭備兌 Put', '做空現貨並賣出 Put。履約價以下的做空利潤被空頭 Put 抵銷，上漲仍會造成虧損。', [shares('sell'), put('sell', 95, 2)]],
      ['synthetic-long', '合成多頭', '同一履約價買入 Call、賣出 Put。到期曲線與持有現貨的斜率相同，開倉現金流獨立計算。', [call('buy', 100, 4), put('sell', 100, 4)]],
      ['synthetic-short', '合成空頭', '同一履約價賣出 Call、買入 Put。到期曲線與做空現貨的斜率相同。', [call('sell', 100, 4), put('buy', 100, 4)]],
    ],
  },
  {
    name: '垂直價差',
    strategies: [
      ['bull-call', '牛市 Call 價差', '買低履約價 Call、賣高履約價 Call。到期損益在兩檔履約價之間上升。', [call('buy', 95, 7), call('sell', 105, 2)]],
      ['bull-put', '牛市 Put 價差', '賣高履約價 Put、買低履約價 Put。預設參數與上方原有損益示意圖相同。', [put('sell', 95, 2), put('buy', 90, 0.8)]],
      ['bear-call', '熊市 Call 價差', '賣低履約價 Call、買高履約價 Call。到期損益在兩檔履約價之間下降。', [call('sell', 95, 7), call('buy', 105, 2)]],
      ['bear-put', '熊市 Put 價差', '買高履約價 Put、賣低履約價 Put。股價跌破較低履約價後，價差價值達到上限。', [put('buy', 105, 7), put('sell', 95, 2)]],
    ],
  },
  {
    name: '跨式、蝶式與多腿組合',
    strategies: [
      ['long-straddle', '買入跨式', '同價買入 Call 和 Put，觀察兩側分別需要多大的到期變動才能抵銷總權利金。', [call('buy', 100, 4), put('buy', 100, 4)]],
      ['short-straddle', '賣出跨式', '同價賣出 Call 和 Put。到期價靠近履約價時保留較多權利金，向上突破時承受無上限損失。', [call('sell', 100, 4), put('sell', 100, 4)]],
      ['long-strangle', '買入寬跨式', '買入不同履約價的 Put 和 Call。兩檔履約價之間，兩條腿到期都沒有內在價值。', [put('buy', 95, 2), call('buy', 105, 2)]],
      ['short-strangle', '賣出寬跨式', '賣出不同履約價的 Put 和 Call。兩檔履約價之間具有同樣的到期損益。', [put('sell', 95, 2), call('sell', 105, 2)]],
      ['call-butterfly', '買入 Call 蝶式', '用 1∶2∶1 數量買兩翼、賣中間腿。等距履約價時，收益峰值在中間履約價。', [call('buy', 90, 11), call('sell', 100, 4, 2), call('buy', 110, 1)]],
      ['put-butterfly', '買入 Put 蝶式', '用 Put 構建同樣的 1∶2∶1 結構，可對照其到期曲線與 Call 蝶式。', [put('buy', 90, 1), put('sell', 100, 4, 2), put('buy', 110, 11)]],
      ['iron-butterfly', '賣出鐵蝶式', '賣出中間跨式，同時買入兩翼。最大到期收益點在中間履約價。', [put('buy', 90, 1), put('sell', 100, 4), call('sell', 100, 4), call('buy', 110, 1)]],
      ['iron-condor', '賣出鐵鷹式', '賣出內側寬跨式，同時買入兩翼。兩檔內側履約價之間形成盈利平台。', [put('buy', 90, 1), put('sell', 95, 2), call('sell', 105, 2), call('buy', 110, 1)]],
      ['call-condor', '買入 Call 鷹式', '買外側兩條 Call、賣內側兩條 Call。等寬兩翼時，內側兩檔之間形成平頂。', [call('buy', 90, 11), call('sell', 95, 7), call('sell', 105, 2), call('buy', 110, 1)]],
      ['call-ratio', '1×2 Call 比率價差', '買一張低履約價 Call、賣兩張高履約價 Call。上行尾部仍留有一張空頭 Call 曝險。', [call('buy', 95, 7), call('sell', 105, 2, 2)]],
      ['put-ratio', '1×2 Put 比率價差', '買一張高履約價 Put、賣兩張低履約價 Put。跌破低履約價後重新出現下跌風險。', [put('buy', 105, 7), put('sell', 95, 2, 2)]],
    ],
  },
  {
    name: '日曆與對角價差',
    strategies: [
      ['call-calendar', '買入 Call 日曆價差', '同價賣近月、買遠月。預設曲線以近月到期日為估值日，遠月腿還有 30 天。', [call('sell', 100, 3), call('buy', 100, 5, 1, 30)]],
      ['put-calendar', '買入 Put 日曆價差', '用 Put 做同價跨期組合。調整遠月隱含波動率，觀察近月到期時的估值變化。', [put('sell', 100, 3), put('buy', 100, 5, 1, 30)]],
      ['call-diagonal', 'Call 對角價差', '賣高履約價近月 Call、買低履約價遠月 Call，同時改變履約價和期限。', [call('sell', 105, 1.5), call('buy', 95, 8, 1, 30)]],
      ['put-diagonal', 'Put 對角價差', '賣低履約價近月 Put、買高履約價遠月 Put。遠月腿在近月到期時仍有估算價值。', [put('sell', 95, 1.5), put('buy', 105, 8, 1, 30)]],
    ],
  },
];

export const presets = Object.fromEntries(groups.flatMap(({strategies}) =>
  strategies.map(([id, name, description, legs]) => [id, {name, description, legs}]),
));

export const defaultPreset = 'bull-put';
