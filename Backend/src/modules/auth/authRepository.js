// Repository layer - admin storage
// Uses Prisma/PostgreSQL exclusively (no in-memory fallback)

import { prismaClient } from "../../lib/database.js";

export const authRepository = {
  async findByEmail(email) {
    return prismaClient.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });
  },

  async findById(id) {
    return prismaClient.adminUser.findUnique({
      where: { id },
    });
  },

  async create(data) {
    return prismaClient.adminUser.create({ data });
  },

  async update(id, data) {
    return prismaClient.adminUser.update({
      where: { id },
      data,
    });
  },
};