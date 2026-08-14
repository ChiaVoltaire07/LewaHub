import { prismaClient } from "../../../lib/database.js";

export const adminAuthRepository = {
  findByEmail(email) {
    return prismaClient.adminUser.findUnique({ where: { email } });
  },

  findById(id) {
    return prismaClient.adminUser.findUnique({ where: { id } });
  },

  createSession(adminId, token, expiresAt) {
    return prismaClient.adminSession.create({ data: { adminId, token, expiresAt } });
  },

  findSessionWithAdmin(token) {
    return prismaClient.adminSession.findUnique({
      where: { token },
      include: { admin: true },
    });
  },

  deleteSession(token) {
    // deleteMany is tolerant of already-expired/missing sessions.
    return prismaClient.adminSession.deleteMany({ where: { token } });
  },

  updateLastLogin(adminId, at) {
    return prismaClient.adminUser.update({
      where: { id: adminId },
      data: { lastLoginAt: at },
    });
  },

  updatePasswordHash(adminId, passwordHash) {
    return prismaClient.adminUser.update({
      where: { id: adminId },
      data: { passwordHash },
    });
  },

  deleteExpiredSessions() {
    return prismaClient.adminSession.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  },
};
