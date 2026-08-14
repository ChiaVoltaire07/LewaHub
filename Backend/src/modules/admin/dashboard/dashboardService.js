import { adminDashboardRepository } from "./dashboardRepository.js";

/**
 * Admin dashboard service. Every number is derived from PostgreSQL on each
 * request — nothing is hardcoded or cached.
 */
export const adminDashboardService = {
  async getDashboardStats() {
    const [
      totalSchools,
      verifiedSchools,
      missingCoordinates,
      missingWebsite,
      missingImages,
      universities,
      secondarySchools,
      primarySchools,
      recentSchools,
    ] = await Promise.all([
      adminDashboardRepository.countSchools(),
      adminDashboardRepository.countVerifiedSchools(),
      adminDashboardRepository.countMissingCoordinates(),
      adminDashboardRepository.countMissingWebsite(),
      adminDashboardRepository.countMissingImages(),
      adminDashboardRepository.countByLevel("HIGHER"),
      adminDashboardRepository.countByLevel("SECONDARY"),
      adminDashboardRepository.countPrimaryNursery(),
      adminDashboardRepository.recentSchools(10),
    ]);

    return {
      totalSchools,
      universities,
      secondarySchools,
      primarySchools,
      verifiedSchools,
      missingCoordinates,
      missingWebsite,
      missingImages,
      recentSchools,
    };
  },
};
