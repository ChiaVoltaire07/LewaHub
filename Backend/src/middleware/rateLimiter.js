import rateLimit from "express-rate-limit";
import { config } from "../config/env.js";

// IPs from the RATE_LIMIT_ALLOWLIST env var bypass all limits. In the test
// environment limiters are skipped so the automated admin test-suite can run
// repeated mutations without tripping limits.
const skipAllowed = (req) =>
  config.nodeEnv === "test" || config.rateLimitAllowlist.includes(req.ip);

const common = {
  standardHeaders: true, // return RateLimit-* headers per the IETF draft spec
  legacyHeaders: false, // disable X-RateLimit-* headers
  skip: skipAllowed,
};

const createLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    ...common,
    handler: (req, res) => {
      console.warn(`[rate-limit] Limit exceeded for IP ${req.ip}`);
      res.status(429).json({ error: message });
    },
  });

// Broad global protection for the whole public API. Generous enough for a
// search UI (debounced requests + browsing) while still bounding per-IP load.
export const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 600, // 600 requests per windowMs
  message: "Too many requests, please try again later",
});

// Stricter limit for the expensive AI-backed search endpoint.
export const searchLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // 60 search requests per windowMs
  message: "Too many search requests, please try again later",
});

// Admin login is intentionally tight — 5 attempts / 15 minutes / IP.
export const adminLoginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per windowMs
  message: "Too many login attempts. Please try again later.",
});

// Admin writes (create/update/delete/image mutations). Reasonably generous so
// normal editing sessions never trip it, but still bounds scripted abuse.
export const adminMutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  ...common,
  // Reads are limited by the global limiter; this only constrains mutations.
  skip: (req) => skipAllowed(req) || ["GET", "HEAD", "OPTIONS"].includes(req.method),
  handler: (req, res) => {
    console.warn(`[rate-limit] Admin mutation limit exceeded for IP ${req.ip}`);
    res.status(429).json({
      success: false,
      error: { code: "RATE_LIMITED", message: "Too many requests, please try again later." },
    });
  },
});
