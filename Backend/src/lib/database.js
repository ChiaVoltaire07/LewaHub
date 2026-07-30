
import { PrismaClient } from "@prisma/client";

let usePrisma = false;
let prismaClient = null;


try {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://"))) {
    prismaClient = new PrismaClient();
    usePrisma = true;
    console.log("✅ PostgreSQL connected via Prisma");
  }
} catch (err) {
  console.log("ℹ️  Running in memory-only mode");
}

export { usePrisma, prismaClient };
