import { schoolsRepository } from "./schoolsRepository.js";
import { AppError } from "../../middleware/errorHandler.js";

export const schoolsService = {
  async listSchools(filters) {
    return schoolsRepository.findAll(filters);
  },

  async getSchoolById(id) {
    const school = await schoolsRepository.findById(id);
    if (!school) {
      throw new AppError("School not found", 404);
    }
    // Increment anonymous views
    await schoolsRepository.incrementViews(id);
    return school;
  },

  async createSchool(data) {
    if (!data.name || !data.category || !data.region || !data.city) {
      throw new AppError("Missing required fields", 400);
    }
    return schoolsRepository.create(data);
  },

  async updateSchool(id, data) {
    const existing = await schoolsRepository.findById(id);
    if (!existing) {
      throw new AppError("School not found", 404);
    }
    return schoolsRepository.update(id, data);
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
    return { success: true };
  },

  async findNearby(latitude, longitude, radius) {
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      throw new AppError("Invalid latitude/longitude", 400);
    }
    return schoolsRepository.findNearby(latitude, longitude, radius);
  },
};