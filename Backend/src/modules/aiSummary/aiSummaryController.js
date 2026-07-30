import { aiSummaryService } from "./aiSummaryService.js";

export const aiSummaryController = {
  async regenerateSummary(req, res, next) {
    try {
      const { institutionId } = req.params;
      const result = await aiSummaryService.regenerateSummary(institutionId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async regenerateAllSummaries(req, res, next) {
    try {
      const result = await aiSummaryService.regenerateAllSummaries();
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
