import express from "express";
import { evaluationsController } from "./evaluationsController.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/verify-student", evaluationsController.verifyStudent);
router.get("/:institutionId/aggregate", evaluationsController.getAggregateByInstitution);

// Admin routes
router.post("/", authMiddleware, evaluationsController.recordEvaluation);
router.post("/generate-token", evaluationsController.generateVerificationToken);

export default router;
