import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { globalLimiter, searchLimiter, adminLoginLimiter } from "./middleware/rateLimiter.js";

// Import route modules
import schoolsRoutes from "./modules/schools/schoolsRoutes.js";
import searchRoutes from "./modules/search/searchRoutes.js";
import adminRoutes from "./modules/admin/adminRoutes.js";

export const app = express();

// Trust the first hop so req.ip and rate limiting see the real client IP
app.set("trust proxy", config.isProduction ? 1 : false);

// ✅ Health check BEFORE HTTPS redirect
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// Enforce HTTPS in production: redirect all plain HTTP to HTTPS.
if (config.isProduction) {
  app.use((req, res, next) => {
    // Skip health check
    if (req.path === "/api/v1/health") return next();
    
    if (req.secure) return next();
    const host = req.headers.host || "localhost";
    return res.redirect(301, `https://${host}${req.originalUrl}`);
  });
}

// Security headers...
app.use(
  helmet({
    hsts: config.isProduction
      ? { maxAge: 60 * 60 * 24 * 180, includeSubDomains: true, preload: true }
      : false,
    referrerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
  })
);

// CORS...
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (config.corsAllowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// Rate limiting
app.use("/api/v1/", globalLimiter);
app.use("/api/v1/search", searchLimiter);

// Routes
app.use("/api/v1/schools", schoolsRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/admin/auth/login", adminLoginLimiter);
app.use("/api/v1/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use(errorHandler);