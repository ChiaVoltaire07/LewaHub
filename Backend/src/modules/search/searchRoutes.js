import express from "express";
import { searchController } from "./searchController.js";
import { validateQuery, searchSchema } from "../../lib/validation.js";

const router = express.Router();

router.get("/", validateQuery(searchSchema), searchController.search);

export default router;
