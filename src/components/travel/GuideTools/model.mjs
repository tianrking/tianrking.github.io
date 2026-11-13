export function mapUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function filterPlaces(places, query) {
  const needle = query.trim().toLocaleLowerCase();
  return places.filter((place) => !needle || `${place.zh} ${place.en} ${place.area} ${place.day}`.toLocaleLowerCase().includes(needle));
}

export function restoreChecks(value, tasks) {
  let parsed;
  try { parsed = JSON.parse(value ?? '{}'); } catch { return {}; }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
  return Object.fromEntries(tasks.filter((task) => parsed[task.id] === true).map((task) => [task.id, true]));
}
