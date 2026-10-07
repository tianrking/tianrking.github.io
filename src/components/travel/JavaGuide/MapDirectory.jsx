import React, {useId, useState} from 'react';
import {CITIES, filterPlaces, mapsUrl} from './places.mjs';
import styles from './styles.module.css';

export default function MapDirectory({language = 'zh'}) {
  const en = language === 'en';
  const id = useId();
  const [city, setCity] = useState('all');
  const [search, setSearch] = useState('');
  const places = filterPlaces(city, search);
  const kinds = en ? {main:'Main route', optional:'Conditional stop', alternative:'Alternative', transport:'Transport', stay:'Stay area / reference'}
    : {main:'主線', optional:'條件支線', alternative:'備選，非額外必到', transport:'交通', stay:'住宿區／比較'};
  return <section className={styles.directory} aria-label={en ? 'Place directory' : '地點導航目錄'}>
    <p className={styles.note}>{en ? 'Search by Chinese or local name. Links open Google Maps in a new tab. Search results are not verified entrance pins: confirm the gate, terminal and pickup address. Stay references are not additional confirmed bookings.' : '可搜中文或當地名稱；點擊在新分頁開啟 Google Maps。這是地點搜尋，不是已核實入口座標；核對入口、航站樓與接人地址。住宿比較不代表新增已訂酒店。'}</p>
    <div className={styles.filters} role="group" aria-label={en ? 'Filter by area' : '按區域篩選'}>
      {[['all','全部','All places'], ...CITIES].map(([key, zh, english]) => <button key={key} type="button" aria-pressed={city === key} onClick={() => setCity(key)}>{en ? english : zh}</button>)}
    </div>
    <label className={styles.searchLabel} htmlFor={`${id}-search`}>{en ? 'Find a place' : '搜尋地點'}</label>
    <input className={styles.search} id={`${id}-search`} type="search" value={search} placeholder={en ? 'e.g. Borobudur, PSE, hotel…' : '例如：婆羅浮屠、PSE、酒店…'} onChange={(event) => setSearch(event.target.value)} />
    <p className={styles.count} aria-live="polite">{en ? `${places.length} ${places.length === 1 ? 'place' : 'places'}` : `${places.length} 個地點`}</p>
    {places.length > 0 ? <ul className={styles.places} role="list">
      {places.map((place) => <li key={place.id}>
        <a href={mapsUrl(place.query)} target="_blank" rel="noopener noreferrer" aria-label={`${place.zh} · ${place.name} — ${en ? 'open Google Maps in a new tab' : '新分頁開啟 Google Maps'}`}>
          <span className={styles.kind}>{kinds[place.kind]}</span>
          <strong>{en ? place.name : place.zh}</strong>
          <span className={styles.localName}>{en ? place.zh : place.name}</span>
          <span className={styles.mapAction}>Google Maps <span aria-hidden="true">↗</span></span>
        </a>
      </li>)}
    </ul> : <div className={styles.empty}><p>{en ? 'No matching places. Try another name or area.' : '沒有匹配地點，試試其他名稱或區域。'}</p><button type="button" onClick={() => {setCity('all'); setSearch('');}}>{en ? 'Reset filters' : '重設篩選'}</button></div>}
  </section>;
}
