import React from 'react';
import {HERITAGE_STOPS} from './heritage.mjs';
import {mapsUrl, directionsUrl} from './places.mjs';
import styles from './styles.module.css';

export default function HeritageStops({day, language = 'zh'}) {
  const en = language === 'en';
  const i = en ? 1 : 0;
  const labels = en ? {main:'On the route', optional:'Only if conditions fit', alternative:'Choose instead, not extra'}
    : {main:'順路主線', optional:'符合條件才加', alternative:'擇一替代，不疊加'};
  return <div className={styles.heritage} aria-label={en ? `Day ${day} heritage details` : `D${day} 古蹟與墓園詳解`}>
    {HERITAGE_STOPS.filter((stop) => stop.day === day).map((stop) => <article className={styles.heritageCard} id={`heritage-${stop.id}`} key={stop.id}>
      <div className={styles.stopMeta}><span className={styles.stopStatus} data-kind={stop.kind}>{labels[stop.kind]}</span><span>{stop.duration[i]}</span></div>
      <h4>{en ? stop.name : stop.zh}</h4>
      <span className={styles.localName}>{en ? stop.zh : stop.name}</span>
      <p>{stop.history[i]}</p>
      <p className={styles.stopRule}><strong>{en ? 'Visiting window · ' : '參訪窗口 · '}</strong>{stop.hours[i]}</p>
      <details className={styles.stopDetails}>
        <summary>{en ? 'How it fits · transport & cut-off' : '怎麼走、何時去與時間底線'}</summary>
        <p>{stop.rule[i]}</p>
        <a className={styles.stopSource} href={stop.source} target="_blank" rel="noopener noreferrer">{en ? 'Source / visiting information ↗' : '資料來源／參訪資訊 ↗'}</a>
      </details>
      <div className={styles.mapActions}>
        <a href={mapsUrl(stop.query)} target="_blank" rel="noopener noreferrer" aria-label={`${en ? stop.name : stop.zh} · ${en ? 'view place on Google Maps, new tab' : 'Google Maps 查看地點，新分頁'}`}>{en ? 'View place ↗' : '查看地點 ↗'}</a>
        <a href={directionsUrl(stop.query)} target="_blank" rel="noopener noreferrer" aria-label={`${en ? stop.name : stop.zh} · ${en ? 'get directions in Google Maps, new tab' : 'Google Maps 從目前位置導航，新分頁'}`}>{en ? 'Directions ↗' : '從目前位置導航 ↗'}</a>
      </div>
    </article>)}
  </div>;
}
