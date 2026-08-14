// Centralized geodesic distance utilities.
// Every part of the backend that needs a distance (currently only the
// Haversine fallback in schoolsRepository.findNearby) must use these helpers
// so there is exactly one implementation of the formula.

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

/**
 * Great-circle distance between two coordinates (Haversine formula).
 * Returns kilometers. Inputs are decimal degrees.
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/** Attach the shared distance fields to a school row (PostGIS or Haversine). */
export function attachDistance(school, distanceKm) {
  if (!school || typeof distanceKm !== "number" || !Number.isFinite(distanceKm)) {
    return school;
  }
  return {
    ...school,
    distanceKm: Math.round(distanceKm * 1000) / 1000,
    distanceMeters: Math.round(distanceKm * 1000),
  };
}
