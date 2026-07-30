import express from "express";
import { programsController } from "./programsController.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router({ mergeParams: true });

// Public route
router.get("/", programsController.getPrograms);

// Admin routes
router.post("/", authMiddleware, programsController.addProgram);
router.put("/:programId", authMiddleware, programsController.updateProgram);
router.delete("/:programId", authMiddleware, programsController.deleteProgram);

export default router;
