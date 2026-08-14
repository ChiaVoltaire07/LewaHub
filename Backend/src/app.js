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
// when running behind a reverse proxy / load balancer (production).
app.set("trust proxy", config.isProduction ? 1 : false);

// Enforce HTTPS in production: redirect all plain HTTP to HTTPS.
if (config.isProduction) {
  app.use((req, res, next) => {
    if (req.secure) return next();
    const host = req.headers.host || "localhost";
    return res.redirect(301, `https://${host}${req.originalUrl}`);
  });
}

// Security headers. HSTS is active only over HTTPS responses; the header is
// intentionally not sent in development so localhost HTTP browsing is unaffected.
app.use(
  helmet({
    hsts: config.isProduction
      ? { maxAge: 60 * 60 * 24 * 180, includeSubDomains: true, preload: true }
      : false,
    referrerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
  })
);

// Locked CORS: only explicitly configured origins are allowed.
// In production the localhost defaults are NOT included (see config/env.js).
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // same-origin / server-to-server / curl
    if (config.corsAllowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false); // block: no CORS headers => browser rejects
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

// Rate limiting: broad global protection plus a stricter cap for AI search.
app.use("/api/v1/", globalLimiter);
app.use("/api/v1/search", searchLimiter);

app.use("/api/v1/schools", schoolsRoutes);
app.use("/api/v1/search", searchRoutes);

// Admin API: tight login rate limit, then the admin namespace.
app.use("/api/v1/admin/auth/login", adminLoginLimiter);
app.use("/api/v1/admin", adminRoutes);

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
