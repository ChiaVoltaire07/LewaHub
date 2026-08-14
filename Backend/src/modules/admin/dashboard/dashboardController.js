import { adminDashboardService } from "./dashboardService.js";

export const adminDashboardController = {
  /**
   * GET /api/v1/admin/dashboard
   */
  async getDashboard(req, res, next) {
    try {
      const stats = await adminDashboardService.getDashboardStats();
      return res.json({ data: stats });
    } catch (error) {
      next(error);
    }
  },
};
