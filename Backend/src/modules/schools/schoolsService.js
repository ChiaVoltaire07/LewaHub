import { schoolsRepository } from "./schoolsRepository.js";
import { AppError } from "../../middleware/errorHandler.js";
import { cacheGet, cacheSet } from "../../config/redis.js";

const SCHOOLS_LIST_CACHE_PREFIX = "schools:list:";
const SCHOOL_DETAIL_CACHE_PREFIX = "schools:detail:";
const SCHOOL_NEARBY_CACHE_PREFIX = "schools:nearby:";

export const schoolsService = {
  // Services never receive the Express `res` object. Cache status is returned
  // as metadata so the controller can set response headers.
  async listSchools(filters) {
    const cacheKey = `${SCHOOLS_LIST_CACHE_PREFIX}${JSON.stringify(filters)}`;

    const cached = await cacheGet(cacheKey);
    if (cached) {
      return { result: cached, cache: "HIT" };
    }

    const result = await schoolsRepository.findAll(filters);
    await cacheSet(cacheKey, result);

    return { result, cache: "MISS" };
  },

  async getSchoolById(id) {
    const cacheKey = `${SCHOOL_DETAIL_CACHE_PREFIX}${id}`;

    const cached = await cacheGet(cacheKey);
    if (cached) {
      return { result: cached, cache: "HIT" };
    }

    const school = await schoolsRepository.findById(id);
    if (!school) {
      throw new AppError("School not found", 404);
    }
    // Increment anonymous views
    await schoolsRepository.incrementViews(id);

    await cacheSet(cacheKey, school);

    return { result: school, cache: "MISS" };
  },

  async findNearby(latitude, longitude, radiusKm = 10, page = 1, limit = 20) {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new AppError("Invalid latitude/longitude", 400);
    }

    const cacheKey = `${SCHOOL_NEARBY_CACHE_PREFIX}${latitude},${longitude},${radiusKm},${page},${limit}`;

    const cached = await cacheGet(cacheKey);
    let nearby;
    let cache;
    if (cached) {
      nearby = cached;
      cache = "HIT";
    } else {
      nearby = await schoolsRepository.findNearby(latitude, longitude, radiusKm);
      await cacheSet(cacheKey, nearby);
      cache = "MISS";
    }

    const start = (page - 1) * limit;
    return {
      result: {
        data: nearby.slice(start, start + limit),
        center: { latitude, longitude },
        radiusKm,
        total: nearby.length,
        page,
        limit,
      },
      cache,
    };
  },
};
