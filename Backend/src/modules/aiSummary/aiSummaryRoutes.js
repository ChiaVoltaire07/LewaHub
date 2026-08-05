import express from "express";
import { aiSummaryController } from "./aiSummaryController.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

// Admin routes only
// Draft review endpoints must come BEFORE the :schoolId route to avoid conflicts
router.get("/drafts", authMiddleware, aiSummaryController.listDrafts);
router.post("/drafts/:draftId/approve", authMiddleware, aiSummaryController.approveDraft);
router.post("/drafts/:draftId/reject", authMiddleware, aiSummaryController.rejectDraft);

router.post("/:schoolId/regenerate", authMiddleware, aiSummaryController.regenerateSummary);
router.post("/batch/regenerate-all", authMiddleware, aiSummaryController.regenerateAllSummaries);

export default router;