import React from 'react';
import {COMPLETED_ROUTE, VISITED_HIGHLIGHTS} from './trip-record.mjs';
import {mapsUrl, directionsUrl} from './places.mjs';
import styles from './styles.module.css';

export default function TripRecord({language = 'zh'}) {
  const en = language === 'en';
  return <section className={styles.tripRecord} aria-label={en ? 'Completed journey' : '這次走過的路線'}>
    <div className={styles.recordHeading}><span className={styles.eyebrow}>JAVA FIELD NOTES · 2026</span><span className={styles.stopStatus}>{en ? 'Trip completed' : '旅程已完成'}</span></div>
    <ol className={styles.recordRoute}>
      {COMPLETED_ROUTE.map((stop, index) => <li key={stop.id}>
        <span className={styles.recordNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <div><h3>{en ? stop.en : stop.zh}<span>{en ? stop.zh : stop.en}</span></h3><p>{en ? stop.enText : stop.zhText}</p>
          <a className={styles.recordMap} href={mapsUrl(stop.query)} target="_blank" rel="noopener noreferrer" aria-label={`${en ? stop.en : stop.zh} · Google Maps`}>{en ? 'View city on Google Maps ↗' : 'Google Maps 查看城市 ↗'}</a>
        </div>
      </li>)}
    </ol>
    <h3>{en ? 'Temples, volcanoes and waterfall visited' : '這次走到的大寺、火山與瀑布'}</h3>
    <div className={styles.recordHighlights}>
      {VISITED_HIGHLIGHTS.map((place) => <div className={styles.placeCard} key={place.id}>
        <strong>{en ? place.en : place.zh}</strong><span className={styles.localName}>{en ? place.zh : place.en}</span>
        <div className={styles.mapActions}>
          <a href={mapsUrl(place.query)} target="_blank" rel="noopener noreferrer" aria-label={`${en ? place.en : place.zh} · ${en ? 'view place' : '查看地點'}`}>{en ? 'View place ↗' : '查看地點 ↗'}</a>
          <a href={directionsUrl(place.query)} target="_blank" rel="noopener noreferrer" aria-label={`${en ? place.en : place.zh} · ${en ? 'directions' : '導航'}`}>{en ? 'Directions ↗' : '導航 ↗'}</a>
        </div>
      </div>)}
    </div>
  </section>;
}
