import {normalizeSearch, queryTerms} from '../../../data/content-search.mjs';

export function mapUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function directionsUrl(query) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

export function placeDays(label = '') {
  const days = new Set();
  for (const match of label.matchAll(/\bD(\d{1,2})\b(?:\s*[–—-]\s*D?(\d{1,2})\b)?/gi)) {
    const first = Number(match[1]);
    const last = Number(match[2] ?? match[1]);
    if (first < 1 || last > 60 || last < first) continue;
    for (let day = first; day <= last; day++) days.add(day);
  }
  return [...days].sort((a,b) => a-b);
}

export function placeStatus(place, fallback = 'plan') {
  const label = `${place.zh} ${place.en} ${place.day}`;
  if (fallback === 'visited' || fallback === 'context') return fallback;
  return /加選|備選|再加|\boptional\b|flight-time dependent/i.test(label) ? 'optional' : 'plan';
}

export function filterPlaces(places, query, {area = '', day = 0, status = '', fallback = 'plan'} = {}) {
  const terms = queryTerms(query);
  return places.filter((place) => {
    if ((area && place.area !== area) || (day && !placeDays(place.day).includes(day))
        || (status && placeStatus(place,fallback) !== status)) return false;
    const searchable = normalizeSearch(`${place.zh} ${place.en} ${place.area} ${place.day} ${placeDays(place.day).map((d) => 'D' + d).join(' ')}`);
    return terms.every((term) => /^d\d+$/.test(term) ? placeDays(place.day).includes(Number(term.slice(1))) : searchable.includes(term));
  });
}

export function dateInZone(zone, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA',{timeZone:zone, year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const values = Object.fromEntries(parts.map(({type,value}) => [type,value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function readCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value + 'T00:00:00Z');
  return !Number.isFinite(+date) || date.toISOString().slice(0,10) !== value ? null : +date;
}

export function itineraryDay(start, today, days) {
  const first = readCalendarDate(start);
  const current = readCalendarDate(today);
  if (first === null || current === null) return 0;
  const day = Math.floor((current - first) / 86400000) + 1;
  return days.includes(day) ? day : 0;
}

export function restoreChecks(value, tasks) {
  let parsed;
  try { parsed = JSON.parse(value ?? '{}'); } catch { return {}; }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
  return Object.fromEntries(tasks.filter((task) => parsed[task.id] === true).map((task) => [task.id, true]));
}
