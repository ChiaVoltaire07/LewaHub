import { dashboardService } from "./dashboardService.js";

export const dashboardController = {
  async getDashboard(req, res, next) {
    try {
      const stats = await dashboardService.getDashboardStats();
      res.json(stats);
    } catch (err) {
      next(err);
    }
  },
};
