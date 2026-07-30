import express from "express";
import { searchController } from "./searchController.js";

const router = express.Router();

router.get("/", searchController.search);

export default router;
