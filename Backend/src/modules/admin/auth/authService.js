import { AppError } from "../../../middleware/errorHandler.js";
import { hashPassword, verifyPassword, generateToken } from "../../../lib/crypto.js";
import { logAudit } from "../../../lib/audit.js";
import { adminAuthRepository } from "./authRepository.js";

// Session expiry: 24 hours (MVP).
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function serializeAdmin(admin) {
  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };
}

export const adminAuthService = {
  /**
   * Authenticate an admin and issue an HTTP-only session cookie token.
   * Uses a single generic error for every failure path (unknown email,
   * wrong password, disabled account) so the API never reveals which
   * addresses exist.
   */
  async login(email, password) {
    const admin = await adminAuthRepository.findByEmail(email);

    if (!admin || !admin.isActive) {
      logAudit("admin.login_failed", { email, reason: "invalid_credentials" });
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const valid = await verifyPassword(password, admin.passwordHash);
    if (!valid) {
      logAudit("admin.login_failed", { email, reason: "invalid_credentials" });
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await adminAuthRepository.createSession(admin.id, token, expiresAt);
    await adminAuthRepository.updateLastLogin(admin.id, new Date());

    logAudit("admin.login_success", { email, adminId: admin.id });

    return {
      admin: serializeAdmin(admin),
      token,
      expiresAt,
    };
  },

  async logout(token) {
    if (token) {
      await adminAuthRepository.deleteSession(token);
    }
    logAudit("admin.logout", {});
  },

  async getAdminByToken(token) {
    const session = await adminAuthRepository.findSessionWithAdmin(token);
    if (!session || session.expiresAt < new Date() || !session.admin.isActive) {
      return null;
    }
    return serializeAdmin(session.admin);
  },

  /**
   * Change an admin's password (old password verified first).
   */
  async changePassword(adminId, currentPassword, newPassword) {
    const admin = await adminAuthRepository.findById(adminId);
    if (!admin) {
      throw new AppError("Admin not found", 404, "NOT_FOUND");
    }

    const valid = await verifyPassword(currentPassword, admin.passwordHash);
    if (!valid) {
      throw new AppError("Current password is incorrect", 401, "INVALID_CREDENTIALS");
    }

    const passwordHash = await hashPassword(newPassword);
    await adminAuthRepository.updatePasswordHash(adminId, passwordHash);

    logAudit("admin.password_change", { adminId });
    return { updated: true };
  },

  async cleanExpiredSessions() {
    return adminAuthRepository.deleteExpiredSessions();
  },
};
