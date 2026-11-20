import React, {useEffect, useMemo, useState} from 'react';
import {dateInZone, directionsUrl, filterPlaces, itineraryDay, mapUrl, placeDays, placeStatus, restoreChecks} from './model.mjs';
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
  const [area, setArea] = useState('');
  const [day, setDay] = useState(0);
  const [status, setStatus] = useState('');
  const [start, setStart] = useState('');
  const [today, setToday] = useState('');
  const [showToday, setShowToday] = useState(false);
  const dateKey = guide.id && guide.timeZone ? `travel-guide:${guide.id}:map-start:v1` : '';
  const areas = useMemo(() => [...new Set(guide.places.map((place) => place.area))], [guide.places]);
  const days = useMemo(() => [...new Set(guide.places.flatMap((place) => placeDays(place.day)))].sort((a,b) => a-b), [guide.places]);
  const labels = en ? {visited:'Visited',context:'Historical context',plan:'Planned',optional:'Optional stop'}
    : {visited:'已到訪',context:'歷史導讀',plan:'行程規劃',optional:'規劃備選'};
  const statuses = [...new Set(guide.places.map((place) => placeStatus(place, guide.status)))];
  const todayDay = itineraryDay(start, today, days);
  const selectedDay = showToday ? todayDay : day;
  const places = useMemo(() => showToday && !selectedDay ? [] : filterPlaces(guide.places, query,
    {day:selectedDay, area, status, fallback:guide.status}), [guide.places, guide.status, query, selectedDay, area, status, showToday]);
  useEffect(() => {
    if (!dateKey || !days.length) return;
    try {setStart(localStorage.getItem(dateKey) ?? '');} catch {}
    const tick = () => setToday(dateInZone(guide.timeZone));
    tick();
    const id = window.setInterval(tick, 60000);
    return () => window.clearInterval(id);
  }, [dateKey, days.length, guide.timeZone]);
  function chooseStart(value) {
    setStart(value);
    setShowToday(false);
    try {if (value) localStorage.setItem(dateKey, value); else localStorage.removeItem(dateKey);} catch {}
  }
  function reset() {setQuery('');setArea('');setDay(0);setStatus('');setShowToday(false);}
  return <section className={styles.directory} aria-label={en ? 'Searchable Google Maps directory' : 'Google Maps 地點目錄'}>
    <div className={styles.mapSearch}>
      <label className={styles.search}>
        <span>{en ? 'Find a place or day' : '搜尋地點、地區或日程'}</span>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={en ? 'Museum, heritage, D2…' : '博物館、古蹟、D2…'} />
      </label>
      <button type="button" disabled={!query} onClick={() => setQuery('')}>{en ? 'Clear' : '清除搜尋'}</button>
    </div>
    <div className={styles.facets}>
      {areas.length > 1 && <label>{en ? 'City or area' : '城市／區域'}
        <select value={area} onChange={(event) => setArea(event.target.value)}>
          <option value="">{en ? 'All areas' : '全部區域'}</option>
          {areas.map(value => <option key={value}>{value}</option>)}
        </select>
      </label>}
      {days.length > 0 && <label>{en ? 'Itinerary day' : '行程日'}
        <select value={selectedDay} onChange={(event) => {setShowToday(false);setDay(Number(event.target.value));}}>
          <option value={0}>{en ? 'All days' : '全部日程'}</option>
          {days.map(value => <option key={value} value={value}>D{value}</option>)}
        </select>
      </label>}
      {statuses.length > 1 && <label>{en ? 'Place status' : '地點狀態'}
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">{en ? 'All statuses' : '全部狀態'}</option>
          {statuses.map(value => <option key={value} value={value}>{labels[value]}</option>)}
        </select>
      </label>}
    </div>
    {dateKey && days.length > 0 && <details className={styles.today}>
      <summary>{en ? 'Today’s stops' : '只看今天'} {showToday && todayDay ? `· D${todayDay}` : ''}</summary>
      <div className={styles.todayFields}>
        <label>{en ? 'Local date of D1' : 'D1 當地日期'} <input type="date" value={start} onChange={(event) => chooseStart(event.target.value)} /></label>
        <button type="button" disabled={!todayDay} aria-pressed={showToday} onClick={() => {
          setShowToday(!showToday);
          if (!showToday) {setArea('');setStatus('');setQuery('');}
        }}>{showToday ? (en ? 'Show all days' : '退出今日篩選') : (en ? 'Only today' : '只看今天')}{!showToday && todayDay ? ` · D${todayDay}` : ''}</button>
      </div>
      <small>{en ? `Destination time zone: ${guide.timeZone}. Date stays on this device.` : `按目的地時區 ${guide.timeZone} 計算；日期只保存在此瀏覽器。`} {start && today && !todayDay && (en ? 'Today falls outside the itinerary.' : '今天不在這趟旅程的日程內。')}</small>
    </details>}
    <p className={styles.count} role="status">{places.length} / {guide.places.length} {en ? 'places' : '個地點'}</p>
    <div className={styles.places}>
      {places.map((place) => <div className={styles.place} key={place.id}>
        <span className={styles.placeMeta}>{place.day} · {place.area}</span>
        <span className={styles.placeStatus} data-status={placeStatus(place, guide.status)}>{labels[placeStatus(place, guide.status)]}</span>
        <strong>{en ? place.en : place.zh}</strong>
        {!en && <span className={styles.placeEnglish}>{place.en}</span>}
        <div className={styles.mapActions}>
          <a href={mapUrl(place.query)} target="_blank" rel="noopener noreferrer" aria-label={en ? `View ${place.en} in Google Maps (new tab)` : `在 Google Maps 查看${place.zh}（新分頁）`}>{en ? 'View place' : '查看地點'} <span aria-hidden="true">↗</span></a>
          <a href={directionsUrl(place.query)} target="_blank" rel="noopener noreferrer" aria-label={en ? `Directions to ${place.en} in Google Maps (new tab)` : `在 Google Maps 導航至${place.zh}（新分頁）`}>{en ? 'Directions' : '開始導航'} <span aria-hidden="true">↗</span></a>
        </div>
      </div>)}
    </div>
    {!places.length && <div className={styles.noMatches}>
      <p>{en ? 'No place matches these filters.' : '沒有符合這組篩選的地點。'}</p>
      <button type="button" onClick={reset}>{en ? 'Reset all filters' : '重設全部篩選'}</button>
    </div>}
    <p className={styles.note}>{en ? 'Search pins are navigation starting points, not verified entrances, bus stops or pickup positions. Check the exact gate and meeting point with the venue or operator.' : '搜尋定位是導航起點，不是已核實的入口、巴士站或上車點；實際大門與集合位置仍須向場館或承運人確認。'}</p>
  </section>;
}
