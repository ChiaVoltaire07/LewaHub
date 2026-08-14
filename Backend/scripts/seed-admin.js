/**
 * Seed script to create an initial admin user
 *
 * Usage:
 *   node scripts/seed-admin.js
 *
 * This will create a default admin user with:
 *   Email: admin@lewahub.com
 *   Password: admin123
 *
 * IMPORTANT: Change the password immediately after first login in production!
 */

import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

async function seedAdmin() {
  console.log("🌱 Seeding admin user...");

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email: "admin@lewahub.com" },
    });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    // Create admin user
    const passwordHash = await hashPassword("admin123");

    const admin = await prisma.adminUser.create({
      data: {
        email: "admin@lewahub.com",
        passwordHash,
        name: "Admin User",
        role: "ADMIN",
        isActive: true,
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("\nLogin credentials:");
    console.log("  Email: admin@lewahub.com");
    console.log("  Password: admin123");
    console.log("\n⚠️  IMPORTANT: Change this password after first login!\n");
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
