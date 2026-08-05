import { settingsService } from "./settingsService.js";

export const settingsController = {
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await settingsService.changePassword(req.admin.sub, currentPassword, newPassword);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};