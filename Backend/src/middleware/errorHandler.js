import { config } from "../config/env.js";

// Central error handler.
//
// Public endpoints keep the historical `{ error: string }` shape so existing
// consumers are unaffected. Admin endpoints return a structured envelope
// `{ success: false, error: { code, message } }` so the UI can map stable
// codes to friendly messages. Prisma internals, SQL, credentials and stack
// traces are never exposed to clients in production.
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Expected client errors (4xx) are logged at a quieter level; unexpected
  // 5xx errors log the full detail for debugging.
  if (statusCode >= 500) {
    console.error("Error:", err);
  } else {
    console.warn(`[error] ${err.code || "HTTP" + statusCode}: ${err.message}`);
  }

  // Don't leak stack traces in production
  const isDev = config.nodeEnv === "development";
  const stack = isDev ? err.stack : undefined;

  const message = err.message || "Internal server error";
  const code = err.code || (statusCode >= 500 ? "INTERNAL_ERROR" : "INTERNAL_ERROR");

  if (req.path.startsWith("/api/v1/admin")) {
    return res.status(statusCode).json({
      success: false,
      error: { code, message },
      ...(isDev && { stack }),
    });
  }

  res.status(statusCode).json({
    error: message,
    ...(isDev && { stack }),
  });
};

export class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR", details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
