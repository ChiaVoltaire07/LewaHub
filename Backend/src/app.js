import express from "express";
import cors from "cors";  // ✅ Keep only this one
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { globalLimiter, searchLimiter, adminLoginLimiter } from "./middleware/rateLimiter.js";


import schoolsRoutes from "./modules/schools/schoolsRoutes.js";
import searchRoutes from "./modules/search/searchRoutes.js";
import adminRoutes from "./modules/admin/adminRoutes.js";

export const app = express();  // ✅ Define app FIRST


app.set("trust proxy", config.isProduction ? 1 : false);

app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});


if (config.isProduction) {
  app.use((req, res, next) => {
    if (req.path === "/api/v1/health") return next();
    if (req.secure) return next();
    const host = req.headers.host || "localhost";
    return res.redirect(301, `https://${host}${req.originalUrl}`);
  });
}


app.use(
  helmet({
    hsts: config.isProduction
      ? { maxAge: 60 * 60 * 24 * 180, includeSubDomains: true, preload: true }
      : false,
    referrerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
  })
);


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

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