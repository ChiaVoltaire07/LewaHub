import express from "express";
import { settingsController } from "./settingsController.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

router.put("/password", authMiddleware, settingsController.changePassword);

export default router;