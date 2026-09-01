// Simple local flat-earth projection (equirectangular approximation).
// Accurate to well under 1% error at the scale of a single cemetery
// property -- more than good enough here.
//
// ORIGIN is treated as (0, 0) in a local "meters" coordinate space; every
// other point is expressed as meters north/south and east/west of it.
// Because this is real-world distance math (not pixel-matching against a
// picture), any new GPS coordinates -- from your own EXIF app or from
// Pine Ridge staff -- will always land in the correct spot on the custom
// map automatically, with no recalibration ever needed.

export const ORIGIN = { lat: 43.8858, lon: -79.0665 };

const METERS_PER_DEG_LAT = 110574;

function metersPerDegLon(atLat) {
  return 111320 * Math.cos((atLat * Math.PI) / 180);
}

// Returns [y, x] in meters from ORIGIN, in the [lat-like, lng-like] order
// react-leaflet expects when using CRS.Simple.
export function gpsToLocal(lat, lon) {
  const y = (lat - ORIGIN.lat) * METERS_PER_DEG_LAT;
  const x = (lon - ORIGIN.lon) * metersPerDegLon(ORIGIN.lat);
  return [y, x];
}

// Known reference landmarks, used only to roughly orient the decorative
// background art -- not required for pin accuracy, which comes straight
// from GPS via gpsToLocal above.
export const LANDMARKS = {
  parkingOffice: gpsToLocal(43.8889667, -79.0669992),
  pond: gpsToLocal(43.8857043, -79.0639583),
};
