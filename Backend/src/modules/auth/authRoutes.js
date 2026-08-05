import express from "express";
import { authController } from "./authController.js";
import { validate, loginSchema } from "../../middleware/validate.js";

const router = express.Router();

router.post("/login", validate(loginSchema), authController.login);

export default router;