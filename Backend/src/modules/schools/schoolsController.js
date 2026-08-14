import { schoolsService } from "./schoolsService.js";

export const schoolsController = {
  async listSchools(req, res, next) {
    try {
      const { result, cache } = await schoolsService.listSchools(req.validatedQuery);
      res.set("X-Cache", cache);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getSchoolById(req, res, next) {
    try {
      const { result, cache } = await schoolsService.getSchoolById(req.params.id);
      res.set("X-Cache", cache);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async findNearby(req, res, next) {
    try {
      const { latitude, longitude, radius, page, limit } = req.validatedQuery;
      const { result, cache } = await schoolsService.findNearby(
        latitude,
        longitude,
        radius,
        page,
        limit
      );
      res.set("X-Cache", cache);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getFilterOptions(req, res, next) {
    try {
      res.json(await schoolsService.getFilterOptions());
    } catch (err) {
      next(err);
    }
  },
};
