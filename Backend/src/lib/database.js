import { PrismaClient } from "@prisma/client";

// Fail fast: refuse to start without a real database
if (!process.env.DATABASE_URL) {
  console.error("FATAL: DATABASE_URL is not set. Refusing to start without a real database.");
  process.exit(1);
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl.startsWith("postgresql://") && !dbUrl.startsWith("postgres://")) {
  console.error("FATAL: DATABASE_URL must be a PostgreSQL connection string (postgresql:// or postgres://).");
  process.exit(1);
}

let prismaClient = null;
try {
  prismaClient = new PrismaClient();
  console.log("✅ PostgreSQL connected via Prisma");
} catch (err) {
  console.error("FATAL: Failed to initialize Prisma client:", err.message);
  process.exit(1);
}

export { prismaClient };