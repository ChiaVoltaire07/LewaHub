import express from "express";
import { adminDashboardController } from "./dashboardController.js";

const router = express.Router();

router.get("/", adminDashboardController.getDashboard);

export default router;
