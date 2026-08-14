import { cacheDel, cacheDelPattern } from "../../config/redis.js";

/**
 * Invalidate the public caches affected by a school mutation so the public
 * site immediately reflects administrator changes. No-ops gracefully when
 * Redis is disabled (PostgreSQL remains the source of truth).
 */
export async function invalidateSchoolCache(schoolId) {
  await cacheDel(`schools:detail:${schoolId}`);
  await cacheDelPattern("schools:list:*");
  await cacheDelPattern("schools:nearby:*");
}
