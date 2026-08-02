import { schoolsService } from "./schoolsService.js";

export const schoolsController = {
  async listSchools(req, res, next) {
    try {
      const { search, category, region, verified, page = 1, limit = 10 } = req.query;
      const result = await schoolsService.listSchools({
        search,
        category,
        region,
        verified: verified === "true" ? true : verified === "false" ? false : undefined,
        page: parseInt(page),
        limit: parseInt(limit),
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getSchoolById(req, res, next) {
    try {
      const school = await schoolsService.getSchoolById(req.params.id);
      res.json(school);
    } catch (err) {
      next(err);
    }
  },

  async createSchool(req, res, next) {
    try {
      const school = await schoolsService.createSchool(req.body);
      res.status(201).json(school);
    } catch (err) {
      next(err);
    }
  },

  async updateSchool(req, res, next) {
    try {
      const school = await schoolsService.updateSchool(req.params.id, req.body);
      res.json(school);
    } catch (err) {
      next(err);
    }
  },

  async deleteSchool(req, res, next) {
    try {
      await schoolsService.deleteSchool(req.params.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async findNearby(req, res, next) {
    try {
      const { latitude, longitude, radius = 50 } = req.query;
      const nearby = await schoolsService.findNearby(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(radius)
      );
      res.json({ data: nearby, total: nearby.length });
    } catch (err) {
      next(err);
    }
  },
};