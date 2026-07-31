
export const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || "lewahub-admin-secret-key-2026",
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  databaseUrl: process.env.DATABASE_URL,
};
