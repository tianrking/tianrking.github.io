// Article status is not a country-visit checklist. Only these published articles
// are completed journey records; proposed routes elsewhere remain plans.
export const COMPLETED_TRAVEL_SLUGS = Object.freeze([
  'malaysia-peninsula-9-day',
  'indonesia-java-10-day-jakarta-yogyakarta-surabaya',
  'philippines-manila-corregidor-travel-notes',
  'thailand-bangkok-ayutthaya-chiang-mai-travel-notes',
  'vietnam-mong-cai-ha-long-da-nang-ho-chi-minh-travel-notes',
  'russia-vladivostok-travel-notes',
  'south-korea-seoul-dmz-incheon-travel-notes',
  'japan-tokyo-mount-fuji-travel-notes',
]);

export function travelPublicationKind(slug) {
  return COMPLETED_TRAVEL_SLUGS.includes(slug) ? 'record' : 'plan';
}
