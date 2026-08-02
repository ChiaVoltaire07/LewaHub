import { programsService } from "./programsService.js";

export const programsController = {
  async getPrograms(req, res, next) {
    try {
      const { schoolId } = req.params;
      const programs = await programsService.getPrograms(schoolId);
      res.json({ programs });
    } catch (err) {
      next(err);
    }
  },

  async addProgram(req, res, next) {
    try {
      const { schoolId } = req.params;
      const program = await programsService.addProgram(schoolId, req.body);
      res.status(201).json(program);
    } catch (err) {
      next(err);
    }
  },

  async updateProgram(req, res, next) {
    try {
      const { schoolId, programId } = req.params;
      const program = await programsService.updateProgram(schoolId, programId, req.body);
      res.json(program);
    } catch (err) {
      next(err);
    }
  },

  async deleteProgram(req, res, next) {
    try {
      const { schoolId, programId } = req.params;
      const result = await programsService.deleteProgram(schoolId, programId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
