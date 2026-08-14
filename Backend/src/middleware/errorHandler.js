import { config } from "../config/env.js";

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Don't leak stack traces in production
  const isDev = config.nodeEnv === "development";
  const stack = isDev ? err.stack : undefined;

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(isDev && { stack }),
    });
  }

  res.status(500).json({
    error: "Internal server error",
    ...(isDev && { stack }),
  });
};

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
