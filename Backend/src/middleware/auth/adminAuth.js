import { prismaClient } from "../../lib/database.js";

const UNAUTHORIZED = (message = "Authentication required") => ({
  success: false,
  error: { code: "UNAUTHORIZED", message },
});

const FORBIDDEN = (message = "Insufficient permissions") => ({
  success: false,
  error: { code: "FORBIDDEN", message },
});

/**
 * Middleware that authenticates an admin via the `admin_session` HTTP-only
 * cookie, validates the server-side session, and loads the administrator
 * into `req.admin`. Authentication secrets are never exposed to the client.
 */
export async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.admin_session;

    if (!token) {
      return res.status(401).json(UNAUTHORIZED());
    }

    const session = await prismaClient.adminSession.findUnique({
      where: { token },
      include: { admin: true },
    });

    if (!session) {
      return res.status(401).json(UNAUTHORIZED());
    }

    if (session.expiresAt < new Date()) {
      // Clean up the expired row so a later login starts fresh.
      await prismaClient.adminSession.deleteMany({ where: { id: session.id } });
      return res.status(401).json({
        success: false,
        error: {
          code: "SESSION_EXPIRED",
          message: "Your session has expired. Please log in again.",
        },
      });
    }

    if (!session.admin.isActive) {
      return res.status(403).json(
        FORBIDDEN("This administrator account has been disabled.")
      );
    }

    req.admin = {
      id: session.admin.id,
      email: session.admin.email,
      name: session.admin.name,
      role: session.admin.role,
    };

    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Authentication failed" },
    });
  }
}

/**
 * Restrict an authenticated admin to specific roles.
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json(UNAUTHORIZED());
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json(FORBIDDEN());
    }

    next();
  };
}
