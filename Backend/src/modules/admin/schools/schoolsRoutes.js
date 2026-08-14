import express from "express";
import { adminSchoolsController } from "./schoolsController.js";
import { validateBody, validateParams, validateQuery } from "../../../lib/validation.js";
import {
  adminListSchoolsSchema,
  schoolIdSchema,
  schoolImageIdSchema,
  createSchoolSchema,
  updateSchoolSchema,
  addImageSchema,
  updateImageSchema,
} from "../validation/schoolSchemas.js";
import { adminMutationLimiter } from "../../../middleware/rateLimiter.js";

const router = express.Router();

router.get("/", validateQuery(adminListSchoolsSchema), adminSchoolsController.listSchools);

// Mutation routes share a dedicated write limiter (reads are bounded by the
// global limiter already).
router.post(
  "/",
  adminMutationLimiter,
  validateBody(createSchoolSchema),
  adminSchoolsController.createSchool
);

router.get("/:id", validateParams(schoolIdSchema), adminSchoolsController.getSchoolById);
router.patch(
  "/:id",
  adminMutationLimiter,
  validateParams(schoolIdSchema),
  validateBody(updateSchoolSchema),
  adminSchoolsController.updateSchool
);
router.delete(
  "/:id",
  adminMutationLimiter,
  validateParams(schoolIdSchema),
  adminSchoolsController.deleteSchool
);

router.post(
  "/:id/images",
  adminMutationLimiter,
  validateParams(schoolIdSchema),
  validateBody(addImageSchema),
  adminSchoolsController.addImage
);
router.delete(
  "/:id/images/:imageId",
  adminMutationLimiter,
  validateParams(schoolImageIdSchema),
  adminSchoolsController.deleteImage
);
router.patch(
  "/:id/images/:imageId",
  adminMutationLimiter,
  validateParams(schoolImageIdSchema),
  validateBody(updateImageSchema),
  adminSchoolsController.updateImage
);

export default router;
