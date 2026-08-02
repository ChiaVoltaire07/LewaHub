import express from "express";
import { schoolsController } from "./schoolsController.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

// Public routes - specific routes first, then parameters
router.get("/nearby", schoolsController.findNearby);
router.get("/", schoolsController.listSchools);
router.get("/:id", schoolsController.getSchoolById);

// Admin routes
router.post("/", authMiddleware, schoolsController.createSchool);
router.put("/:id", authMiddleware, schoolsController.updateSchool);
router.delete("/:id", authMiddleware, schoolsController.deleteSchool);

export default router;