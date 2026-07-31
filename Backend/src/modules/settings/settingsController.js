import { settingsService } from "./settingsService.js";

export const settingsController = {
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current password and new password are required" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters" });
      }
      const result = await settingsService.changePassword(req.admin.sub, currentPassword, newPassword);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};