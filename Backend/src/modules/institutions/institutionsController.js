import { institutionsService } from "./institutionsService.js";

export const institutionsController = {
  async listInstitutions(req, res, next) {
    try {
      const { search, type, region, page = 1, limit = 10 } = req.query;
      const result = await institutionsService.listInstitutions({
        search,
        type,
        region,
        page: parseInt(page),
        limit: parseInt(limit),
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getInstitutionById(req, res, next) {
    try {
      const inst = await institutionsService.getInstitutionById(req.params.id);
      res.json(inst);
    } catch (err) {
      next(err);
    }
  },

  async createInstitution(req, res, next) {
    try {
      const inst = await institutionsService.createInstitution(req.body);
      res.status(201).json(inst);
    } catch (err) {
      next(err);
    }
  },

  async updateInstitution(req, res, next) {
    try {
      const inst = await institutionsService.updateInstitution(req.params.id, req.body);
      res.json(inst);
    } catch (err) {
      next(err);
    }
  },

  async deleteInstitution(req, res, next) {
    try {
      await institutionsService.deleteInstitution(req.params.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async findNearby(req, res, next) {
    try {
      const { latitude, longitude, radius = 50 } = req.query;
      const nearby = await institutionsService.findNearby(
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
