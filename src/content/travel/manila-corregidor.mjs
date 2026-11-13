// Confirmed destinations come only from the traveller's account. Context pins
// are deliberately separate: they are not a reconstructed attendance record.
export const VISITED_DESTINATIONS = [
  {id:'manila',zh:'馬尼拉',en:'Manila',area:'Metro Manila',day:'已到訪 / VISITED',query:'Manila Philippines'},
  {id:'corregidor',zh:'科雷希多島',en:'Corregidor Island',area:'Manila Bay · Cavite',day:'已到訪 / VISITED',query:'Corregidor Island Cavite Philippines'},
];

export const HISTORY_CONTEXT = [
  {id:'malinta',zh:'馬林塔隧道',en:'Malinta Tunnel',area:'Corregidor',day:'歷史導讀 / CONTEXT',query:'Malinta Tunnel Corregidor'},
  {id:'way',zh:'Way 炮台',en:'Battery Way',area:'Corregidor',day:'歷史導讀 / CONTEXT',query:'Battery Way Corregidor'},
  {id:'hearn',zh:'Hearn 炮台',en:'Battery Hearn',area:'Corregidor',day:'歷史導讀 / CONTEXT',query:'Battery Hearn Corregidor'},
  {id:'barracks',zh:'Middleside 兵營遺址',en:'Middleside Barracks',area:'Corregidor',day:'歷史導讀 / CONTEXT',query:'Middleside Barracks Corregidor'},
  {id:'pacific',zh:'太平洋戰爭紀念館與紀念地',en:'Pacific War Memorial and Museum',area:'Corregidor',day:'歷史導讀 / CONTEXT',query:'Pacific War Memorial Corregidor'},
  {id:'lorcha',zh:'Lorcha 碼頭歷史地點',en:'Lorcha Dock historic site',area:'Corregidor',day:'歷史導讀 / CONTEXT',query:'Lorcha Dock Corregidor'},
  {id:'intramuros',zh:'王城 Intramuros',en:'Intramuros',area:'Manila',day:'相關閱讀 / CONTEXT',query:'Intramuros Manila Philippines'},
  {id:'fort',zh:'聖地亞哥堡',en:'Fort Santiago',area:'Intramuros',day:'相關閱讀 / CONTEXT',query:'Fort Santiago Intramuros Manila'},
  {id:'memorare',zh:'馬尼拉 1945 平民紀念碑',en:'Memorare–Manila 1945',area:'Intramuros',day:'相關閱讀 / CONTEXT',query:'Memorare Manila 1945 Intramuros'},
  {id:'cemetery',zh:'馬尼拉美軍公墓與紀念地',en:'Manila American Cemetery and Memorial',area:'Taguig',day:'相關閱讀 / CONTEXT',query:'Manila American Cemetery and Memorial Taguig'},
  {id:'museum',zh:'國家博物館美術館',en:'National Museum of Fine Arts',area:'Ermita · Manila',day:'相關閱讀 / CONTEXT',query:'National Museum of Fine Arts Manila'},
  {id:'binondo',zh:'岷倫洛華人街區',en:'Binondo',area:'Manila',day:'相關閱讀 / CONTEXT',query:'Binondo Manila Philippines'},
];

export const manilaCorregidor = {
  facts: [
    {id:'status',labelZh:'旅行狀態',labelEn:'TRAVEL STATUS',zh:'已完成 · 馬尼拉與科雷希多島',en:'Completed · Manila and Corregidor'},
    {id:'theme',labelZh:'真實旅行主題',labelEn:'CONFIRMED THEME',zh:'城市旅行與島上二戰歷史',en:'City travel and WWII history on the island'},
    {id:'scope',labelZh:'記錄方式',labelEn:'RECORD FORMAT',zh:'按地點與主題整理，不編造日期與日序',en:'Places and themes, without invented dates or daily order'},
    {id:'next',labelZh:'下一趟',labelEn:'NEXT JOURNEY',zh:'宿務 9 日另列為未出發規劃',en:'Cebu in 9 days remains a separate future plan'},
  ],
  visited: {places:VISITED_DESTINATIONS},
  context: {places:HISTORY_CONTEXT},
};
