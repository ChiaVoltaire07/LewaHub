import { aiSummaryService } from "./aiSummaryService.js";

export const aiSummaryController = {
  async regenerateSummary(req, res, next) {
    try {
      const { schoolId } = req.params;
      const result = await aiSummaryService.regenerateSummary(schoolId);
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
