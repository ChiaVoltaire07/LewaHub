import { schoolsService } from "./schoolsService.js";

export const schoolsController = {
  async listSchools(req, res, next) {
    try {
      const { search, category, region, verified, language, ownership, boarding, program, page = 1, limit = 10 } = req.query;
      // Split comma-separated multi-value filters into arrays
      const splitMulti = (val) =>
        typeof val === "string" && val.includes(",") ? val.split(",") : val;
      const result = await schoolsService.listSchools(
        {
          search,
          category: splitMulti(category),
          region: splitMulti(region),
          language: splitMulti(language),
          ownership: splitMulti(ownership),
          boarding: splitMulti(boarding),
          program,
          verified: verified === "true" ? true : verified === "false" ? false : undefined,
          page: parseInt(page),
          limit: parseInt(limit),
        },
        res
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getSchoolById(req, res, next) {
    try {
      const school = await schoolsService.getSchoolById(req.params.id, res);
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
      const { latitude, longitude, radius = 50, page = 1, limit = 20 } = req.query;
      const nearby = await schoolsService.findNearby(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(radius),
        res
      );
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const start = (pageNum - 1) * limitNum;
      const paginated = nearby.slice(start, start + limitNum);
      res.json({ data: paginated, total: nearby.length, page: pageNum, limit: limitNum });
    } catch (err) {
      next(err);
    }
  },
};