import express from "express";
import { schoolsController } from "./schoolsController.js";
import { validateQuery, listSchoolsSchema, nearbySchema } from "../../lib/validation.js";

const router = express.Router();

// Public routes - specific routes first, then parameters
router.get("/nearby", validateQuery(nearbySchema), schoolsController.findNearby);
router.get("/filters", schoolsController.getFilterOptions);
router.get("/", validateQuery(listSchoolsSchema), schoolsController.listSchools);
router.get("/:id", schoolsController.getSchoolById);

export default router;
