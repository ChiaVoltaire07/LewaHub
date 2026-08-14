import { config } from "../../../config/env.js";
import { adminAuthService } from "./authService.js";

function sessionCookieOptions(expiresAt) {
  return {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? "none" : "lax",
    expires: expiresAt,
    path: "/",
  };
}

export const adminAuthController = {
  /**
   * POST /api/v1/admin/auth/login
   * Body validated by loginSchema. On success an HTTP-only session cookie is
   * set; the token itself is never exposed to the frontend.
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.validatedBody;
      const result = await adminAuthService.login(email, password);

      res.cookie("admin_session", result.token, sessionCookieOptions(result.expiresAt));

      return res.json({
        admin: result.admin,
        expiresAt: result.expiresAt,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/v1/admin/auth/logout
   * Destroys the server-side session and clears the cookie.
   */
  async logout(req, res, next) {
    try {
      const token = req.cookies?.admin_session;
      if (token) {
        await adminAuthService.logout(token);
      }
      res.clearCookie("admin_session", { path: "/" });
      return res.json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/admin/auth/me
   * Requires an authenticated session (requireAdmin middleware).
   */
  async me(req, res) {
    return res.json({ admin: req.admin });
  },
};
