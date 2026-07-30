import { institutionsRepository } from "./institutionsRepository.js";
import { AppError } from "../../middleware/errorHandler.js";

export const institutionsService = {
  async listInstitutions(filters) {
    return institutionsRepository.findAll(filters);
  },

  async getInstitutionById(id) {
    const inst = await institutionsRepository.findById(id);
    if (!inst) {
      throw new AppError("Institution not found", 404);
    }
    // Increment anonymous views
    await institutionsRepository.incrementViews(id);
    return inst;
  },

  async createInstitution(data) {
    if (!data.name || !data.type || !data.region || !data.city) {
      throw new AppError("Missing required fields", 400);
    }
    return institutionsRepository.create(data);
  },

  async updateInstitution(id, data) {
    const existing = await institutionsRepository.findById(id);
    if (!existing) {
      throw new AppError("Institution not found", 404);
    }
    return institutionsRepository.update(id, data);
  },

  async deleteInstitution(id) {
    const existing = await institutionsRepository.findById(id);
    if (!existing) {
      throw new AppError("Institution not found", 404);
    }
    const deleted = await institutionsRepository.delete(id);
    if (!deleted) {
      throw new AppError("Failed to delete institution", 500);
    }
    return { success: true };
  },

  async findNearby(latitude, longitude, radius) {
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      throw new AppError("Invalid latitude/longitude", 400);
    }
    return institutionsRepository.findNearby(latitude, longitude, radius);
  },
};
