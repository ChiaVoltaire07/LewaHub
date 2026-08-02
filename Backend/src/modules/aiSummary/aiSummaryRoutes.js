import express from "express";
import { aiSummaryController } from "./aiSummaryController.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

// Admin routes only
router.post("/:schoolId/regenerate", authMiddleware, aiSummaryController.regenerateSummary);
router.post("/batch/regenerate-all", authMiddleware, aiSummaryController.regenerateAllSummaries);

export default router;
