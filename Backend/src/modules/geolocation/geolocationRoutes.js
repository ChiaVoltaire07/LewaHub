import express from "express";
import { geolocationController } from "./geolocationController.js";

const router = express.Router();

router.get("/nearby", geolocationController.findNearby);

export default router;
