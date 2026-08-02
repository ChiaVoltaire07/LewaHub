// Repository layer - admin storage
// Uses in-memory fallback and Prisma when configured

import { usePrisma, prismaClient } from "../../lib/database.js";

let admins = [
  {
    id: "admin-1",
    email: "admin@lewahub.com",
    password: "$2a$10$A8zVgjH6iXgIwcG59GZ7guixfnLsdp2D2HnrYBE/W7u3M1wesZfzi", // bcrypt hash of "admin123"
    name: "LewaHub Admin",
    createdAt: new Date().toISOString(),
  },
];

export const authRepository = {
  async findByEmail(email) {
    if (usePrisma && prismaClient) {
      try {
        return await prismaClient.adminUser.findUnique({
          where: { email: email.toLowerCase() },
        });
      } catch (err) {
        console.error("Prisma admin findByEmail failed:", err.message);
      }
    }
    return admins.find((a) => a.email === email.toLowerCase());
  },

  async findById(id) {
    if (usePrisma && prismaClient) {
      try {
        return await prismaClient.adminUser.findUnique({
          where: { id },
        });
      } catch (err) {
        console.error("Prisma admin findById failed:", err.message);
      }
    }
    return admins.find((a) => a.id === id);
  },

  async create(data) {
    if (usePrisma && prismaClient) {
      try {
        return await prismaClient.adminUser.create({ data });
      } catch (err) {
        console.error("Prisma admin create failed:", err.message);
      }
    }

    const newAdmin = {
      id: `admin-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    admins.push(newAdmin);
    return newAdmin;
  },

  async update(id, data) {
    if (usePrisma && prismaClient) {
      try {
        return await prismaClient.adminUser.update({
          where: { id },
          data,
        });
      } catch (err) {
        console.error("Prisma admin update failed:", err.message);
      }
    }

    const idx = admins.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    admins[idx] = { ...admins[idx], ...data };
    return admins[idx];
  },
};
