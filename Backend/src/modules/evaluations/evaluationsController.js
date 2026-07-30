import { evaluationsService } from "./evaluationsService.js";

export const evaluationsController = {
  async recordEvaluation(req, res, next) {
    try {
      const { studentId, institutionId, score, notes } = req.body;
      const result = await evaluationsService.recordEvaluation(
        studentId,
        institutionId,
        score,
        notes
      );
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async getAggregateByInstitution(req, res, next) {
    try {
      const { institutionId } = req.params;
      const aggregate = await evaluationsService.getAggregateByInstitution(institutionId);
      res.json(aggregate);
    } catch (err) {
      next(err);
    }
  },

  async verifyStudent(req, res, next) {
    try {
      const { email, phone, verificationToken } = req.body;
      const result = await evaluationsService.verifyStudent(email, phone, verificationToken);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async generateVerificationToken(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email required" });
      }
      const token = await evaluationsService.generateVerificationToken(email);
      res.json({ token, message: "Verification token generated. Valid for 24 hours." });
    } catch (err) {
      next(err);
    }
  },
};
