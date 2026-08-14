import express from "express";
import { adminAuthController } from "./authController.js";
import { requireAdmin } from "../../../middleware/auth/adminAuth.js";
import { validateBody } from "../../../lib/validation.js";
import { loginSchema } from "../validation/authSchemas.js";

const router = express.Router();

router.post("/login", validateBody(loginSchema), adminAuthController.login);
router.post("/logout", adminAuthController.logout);
router.get("/me", requireAdmin, adminAuthController.me);

export default router;
