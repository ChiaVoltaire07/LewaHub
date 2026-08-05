import express from "express";
import { settingsController } from "./settingsController.js";
import { authMiddleware } from "../../middleware/auth.js";
import { validate, changePasswordSchema } from "../../middleware/validate.js";

const router = express.Router();

router.put("/password", authMiddleware, validate(changePasswordSchema), settingsController.changePassword);

export default router;