import express from "express";
import { institutionsController } from "./institutionsController.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

// Public routes - specific routes first, then parameters
router.get("/nearby", institutionsController.findNearby);
router.get("/", institutionsController.listInstitutions);
router.get("/:id", institutionsController.getInstitutionById);

// Admin routes
router.post("/", authMiddleware, institutionsController.createInstitution);
router.put("/:id", authMiddleware, institutionsController.updateInstitution);
router.delete("/:id", authMiddleware, institutionsController.deleteInstitution);

export default router;
