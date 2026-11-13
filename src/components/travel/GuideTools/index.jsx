import React, {useEffect, useMemo, useState} from 'react';
import {filterPlaces, mapUrl, restoreChecks} from './model.mjs';
import styles from './styles.module.css';

export function RouteSummary({facts, language = 'zh'}) {
  return <div className={styles.facts}>
    {facts.map((fact) => <div className={styles.fact} key={fact.id}>
      <span>{language === 'en' ? fact.labelEn : fact.labelZh}</span>
      <strong>{language === 'en' ? fact.en : fact.zh}</strong>
    </div>)}
  </div>;
}

export function BookingChecklist({guide, language = 'zh'}) {
  const en = language === 'en';
  const storageKey = `travel-guide:${guide.id}:checklist:v1`;
  const [checks, setChecks] = useState({});
  const [ready, setReady] = useState(false);
  const [canSave, setCanSave] = useState(true);
  useEffect(() => {
    setReady(false);
    try { setChecks(restoreChecks(localStorage.getItem(storageKey), guide.tasks)); }
    catch { setChecks({}); setCanSave(false); }
    setReady(true);
  }, [guide, storageKey]);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(storageKey, JSON.stringify(checks)); }
    catch { setCanSave(false); }
  }, [checks, ready, storageKey]);
  const completed = guide.tasks.filter((task) => checks[task.id]).length;
  return <section className={styles.checklist} aria-label={en ? 'Personal preparation checklist' : '個人行前清單'}>
    <div className={styles.checklistHeader}>
      <span aria-live="polite">{en ? 'YOUR PREPARATION' : '行前準備'} · {completed}/{guide.tasks.length}</span>
      <button type="button" disabled={!completed || !ready} onClick={() => setChecks({})}>{en ? 'Reset checklist' : '重設勾選'}</button>
    </div>
    <div className={styles.tasks}>
      {guide.tasks.map((task) => <div className={styles.task} key={task.id}>
        <label>
          <input type="checkbox" disabled={!ready} checked={Boolean(checks[task.id])} onChange={(event) => setChecks((current) => ({...current, [task.id]: event.target.checked}))} />
          <span><strong>{en ? task.en : task.zh}</strong><small>{en ? task.detailEn : task.detailZh}</small></span>
        </label>
        {task.url && <a href={task.url} target="_blank" rel="noopener noreferrer">{en ? 'Official reference' : '官方入口'} ↗</a>}
      </div>)}
    </div>
    <p className={styles.note}>{en
      ? `${canSave ? 'Saved only in this browser.' : 'Browser storage is unavailable; checks last only for this page session.'} A check is your own note, not a booking, payment, permit or confirmation of a visit.`
      : `${canSave ? '僅保存在這個瀏覽器。' : '瀏覽器儲存不可用，勾選僅在本頁停留期間有效。'}勾選是個人筆記，不代表訂房、付款、許可或已到訪。`}</p>
  </section>;
}

export function PlaceDirectory({guide, language = 'zh'}) {
  const en = language === 'en';
  const [query, setQuery] = useState('');
  const places = useMemo(() => filterPlaces(guide.places, query), [guide.places, query]);
  return <section className={styles.directory} aria-label={en ? 'Searchable Google Maps directory' : 'Google Maps 地點目錄'}>
    <label className={styles.search}>
      <span>{en ? 'Find a place or day' : '搜尋地點、地區或日程'}</span>
      <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={en ? 'Museum, Moalboal, D2…' : '博物館、古鎮、D2…'} />
    </label>
    <p className={styles.count} role="status">{places.length} / {guide.places.length} {en ? 'places' : '個地點'}</p>
    <div className={styles.places}>
      {places.map((place) => <a className={styles.place} key={place.id} href={mapUrl(place.query)} target="_blank" rel="noopener noreferrer">
        <span className={styles.placeMeta}>{place.day} · {place.area}</span>
        <strong>{en ? place.en : place.zh}</strong>
        {!en && <span className={styles.placeEnglish}>{place.en}</span>}
        <span className={styles.mapAction}>{en ? 'Open Google Maps' : '開啟 Google Maps'} ↗</span>
      </a>)}
    </div>
    {!places.length && <p>{en ? 'No matching place. Clear the search to see all locations.' : '沒有符合的地點，清除搜尋即可顯示全部。'}</p>}
    <p className={styles.note}>{en ? 'Search pins are navigation starting points, not verified entrances, bus stops or pickup positions. Check the exact gate and meeting point with the venue or operator.' : '搜尋定位是導航起點，不是已核實的入口、巴士站或上車點；實際大門與集合位置仍須向場館或承運人確認。'}</p>
  </section>;
}
