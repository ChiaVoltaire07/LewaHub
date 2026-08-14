import express from "express";
import { requireAdmin } from "../../middleware/auth/adminAuth.js";
import authRoutes from "./auth/authRoutes.js";
import dashboardRoutes from "./dashboard/dashboardRoutes.js";
import schoolsRoutes from "./schools/schoolsRoutes.js";

const router = express.Router();

// Auth routes (only /login is public; /me is guarded inside authRoutes).
router.use("/auth", authRoutes);

// Protected admin routes (require authentication).
router.use("/dashboard", requireAdmin, dashboardRoutes);
router.use("/schools", requireAdmin, schoolsRoutes);

export default router;
