import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Import route modules
import authRoutes from "./modules/auth/authRoutes.js";
import schoolsRoutes from "./modules/schools/schoolsRoutes.js";
import programsRoutes from "./modules/programs/programsRoutes.js";
import searchRoutes from "./modules/search/searchRoutes.js";
import aiSummaryRoutes from "./modules/aiSummary/aiSummaryRoutes.js";
import dashboardRoutes from "./modules/dashboard/dashboardRoutes.js";
import geolocationRoutes from "./modules/geolocation/geolocationRoutes.js";
import settingsRoutes from "./modules/settings/settingsRoutes.js";
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: [config.frontendUrl, "http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // max 5 login attempts per 15 minutes
  message: "Too many login attempts, please try again later",
});

app.use("/api/v1/", limiter);
app.use("/api/v1/admin/login", loginLimiter);

// Routes
app.use("/api/v1/admin", authRoutes);
app.use("/api/v1/admin/dashboard", dashboardRoutes);
app.use("/api/v1/admin/settings", settingsRoutes);
app.use("/api/v1/schools", schoolsRoutes);
app.use("/api/v1/schools/:schoolId/programs", programsRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/ai-summary", aiSummaryRoutes);
app.use("/api/v1/geolocation", geolocationRoutes);

// Health check
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler (must come before error handler)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`\n✓ LewaHub API running on http://localhost:${config.port}/api/v1`);
});