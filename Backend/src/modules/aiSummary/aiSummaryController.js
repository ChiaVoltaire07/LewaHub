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

  async listDrafts(req, res, next) {
    try {
      const { status = "DRAFT" } = req.query;
      const drafts = await aiSummaryService.listDrafts(status);
      res.json({ drafts });
    } catch (err) {
      next(err);
    }
  },

  async approveDraft(req, res, next) {
    try {
      const { draftId } = req.params;
      const result = await aiSummaryService.approveDraft(draftId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async rejectDraft(req, res, next) {
    try {
      const { draftId } = req.params;
      const result = await aiSummaryService.rejectDraft(draftId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};