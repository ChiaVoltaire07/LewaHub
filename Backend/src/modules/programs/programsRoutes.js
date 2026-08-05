import express from "express";
import { programsController } from "./programsController.js";
import { authMiddleware } from "../../middleware/auth.js";
import { validate, createProgramSchema, updateProgramSchema } from "../../middleware/validate.js";

const router = express.Router({ mergeParams: true });

// Public route
router.get("/", programsController.getPrograms);

// Admin routes
router.post("/", authMiddleware, validate(createProgramSchema), programsController.addProgram);
router.put("/:programId", authMiddleware, validate(updateProgramSchema), programsController.updateProgram);
router.delete("/:programId", authMiddleware, programsController.deleteProgram);

export default router;