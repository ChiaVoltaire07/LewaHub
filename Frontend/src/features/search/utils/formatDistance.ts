/** Human distance parts for the "schools near me" feature. Pure & unit-tested. */
export interface DistanceParts {
  /** Rounded whole meters, or null when the distance is ≥ 1 km */
  meters: number | null;
  /** Kilometers with one decimal, or null when the distance is < 1 km */
  km: number | null;
}

const KM_THRESHOLD = 1;

/** Rounds to 2 decimals like the backend does (0.1 m of precision). */
const toKm2 = (km: number) => Math.round(km * 100) / 100;

/**
 * Converts a distance in km into display parts:
 *  - < 1 km  → meters (rounded to the nearest 10 m)
 *  - >= 1 km → km with one decimal
 *
 * 0.35  → { meters: 350, km: null }
 * 0.8   → { meters: 800, km: null }
 * 1.2   → { meters: null, km: 1.2 }
 * 5.73  → { meters: null, km: 5.7 }
 * 18.7  → { meters: null, km: 18.7 }
 */
export function formatDistance(distanceKm: number | null | undefined): DistanceParts {
  if (typeof distanceKm !== "number" || !Number.isFinite(distanceKm) || distanceKm < 0) {
    return { meters: null, km: null };
  }
  if (distanceKm < KM_THRESHOLD) {
    return { meters: Math.round(distanceKm * 1000), km: null };
  }
  return { meters: null, km: Math.round(toKm2(distanceKm) * 10) / 10 };
}
