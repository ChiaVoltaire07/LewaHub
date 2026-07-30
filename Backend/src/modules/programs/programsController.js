import { programsService } from "./programsService.js";

export const programsController = {
  async getPrograms(req, res, next) {
    try {
      const { institutionId } = req.params;
      const programs = await programsService.getPrograms(institutionId);
      res.json({ programs });
    } catch (err) {
      next(err);
    }
  },

  async addProgram(req, res, next) {
    try {
      const { institutionId } = req.params;
      const program = await programsService.addProgram(institutionId, req.body);
      res.status(201).json(program);
    } catch (err) {
      next(err);
    }
  },

  async updateProgram(req, res, next) {
    try {
      const { institutionId, programId } = req.params;
      const program = await programsService.updateProgram(institutionId, programId, req.body);
      res.json(program);
    } catch (err) {
      next(err);
    }
  },

  async deleteProgram(req, res, next) {
    try {
      const { institutionId, programId } = req.params;
      const result = await programsService.deleteProgram(institutionId, programId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
