import { schoolsRepository } from "./schoolsRepository.js";
import { AppError } from "../../middleware/errorHandler.js";
import { cacheGet, cacheSet, cacheDelPattern } from "../../config/redis.js";

const SCHOOLS_LIST_CACHE_PREFIX = "schools:list:";
const SCHOOL_DETAIL_CACHE_PREFIX = "schools:detail:";
const SCHOOL_NEARBY_CACHE_PREFIX = "schools:nearby:";

export const schoolsService = {
  async listSchools(filters, res) {
    // Build a cache key from the filters
    const cacheKey = `${SCHOOLS_LIST_CACHE_PREFIX}${JSON.stringify(filters)}`;

    // Try cache first
    const cached = await cacheGet(cacheKey);
    if (cached) {
      if (res) res.set("X-Cache", "HIT");
      return cached;
    }

    const result = await schoolsRepository.findAll(filters);

    // Cache the result
    await cacheSet(cacheKey, result);
    if (res) res.set("X-Cache", "MISS");

    return result;
  },

  async getSchoolById(id, res) {
    const cacheKey = `${SCHOOL_DETAIL_CACHE_PREFIX}${id}`;

    // Try cache first
    const cached = await cacheGet(cacheKey);
    if (cached) {
      if (res) res.set("X-Cache", "HIT");
      return cached;
    }

    const school = await schoolsRepository.findById(id);
    if (!school) {
      throw new AppError("School not found", 404);
    }
    // Increment anonymous views
    await schoolsRepository.incrementViews(id);

    // Cache the result
    await cacheSet(cacheKey, school);
    if (res) res.set("X-Cache", "MISS");

    return school;
  },

  async createSchool(data) {
    if (!data.name || !data.category || !data.region || !data.city) {
      throw new AppError("Missing required fields", 400);
    }
    const school = await schoolsRepository.create(data);
    // Invalidate list caches since a new school was added
    await cacheDelPattern(`${SCHOOLS_LIST_CACHE_PREFIX}*`);
    return school;
  },

  async updateSchool(id, data) {
    const existing = await schoolsRepository.findById(id);
    if (!existing) {
      throw new AppError("School not found", 404);
    }
    const school = await schoolsRepository.update(id, data);
    // Invalidate caches for this school and all lists
    await cacheDelPattern(`${SCHOOL_DETAIL_CACHE_PREFIX}${id}`);
    await cacheDelPattern(`${SCHOOLS_LIST_CACHE_PREFIX}*`);
    await cacheDelPattern(`${SCHOOL_NEARBY_CACHE_PREFIX}*`);
    return school;
  },

  async deleteSchool(id) {
    const existing = await schoolsRepository.findById(id);
    if (!existing) {
      throw new AppError("School not found", 404);
    }
    const deleted = await schoolsRepository.delete(id);
    if (!deleted) {
      throw new AppError("Failed to delete school", 500);
    }
    // Invalidate caches for this school and all lists
    await cacheDelPattern(`${SCHOOL_DETAIL_CACHE_PREFIX}${id}`);
    await cacheDelPattern(`${SCHOOLS_LIST_CACHE_PREFIX}*`);
    await cacheDelPattern(`${SCHOOL_NEARBY_CACHE_PREFIX}*`);
    return { success: true };
  },

  async findNearby(latitude, longitude, radius, res) {
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      throw new AppError("Invalid latitude/longitude", 400);
    }
    const cacheKey = `${SCHOOL_NEARBY_CACHE_PREFIX}${latitude},${longitude},${radius}`;

    // Try cache first
    const cached = await cacheGet(cacheKey);
    if (cached) {
      if (res) res.set("X-Cache", "HIT");
      return cached;
    }

    const nearby = await schoolsRepository.findNearby(latitude, longitude, radius);

    // Cache the result
    await cacheSet(cacheKey, nearby);
    if (res) res.set("X-Cache", "MISS");

    return nearby;
  },
};