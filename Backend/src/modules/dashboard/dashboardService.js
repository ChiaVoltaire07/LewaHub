import { institutionsRepository } from "../institutions/institutionsRepository.js";
import { evaluationsRepository } from "../evaluations/evaluationsRepository.js";

export const dashboardService = {
  async getDashboardStats() {
    // Get all institutions
    const instResult = await institutionsRepository.findAll({ page: 1, limit: 1000 });
    const totalInstitutions = instResult.total;

    // Get all evaluations
    const allEvals = await evaluationsRepository.findAll();
    const totalEvaluations = allEvals.length;

    // Count institutions without AI summaries
    const missingSummaries = instResult.data.filter((i) => !i.aiSummary || i.aiSummary.length === 0)
      .length;

    // Get verified count
    const verifiedCount = instResult.data.filter((i) => i.verified).length;

    // Get total views across all institutions
    const totalViews = instResult.data.reduce((sum, i) => sum + (i.anonymousViews || 0), 0);

    return {
      totalInstitutions,
      totalEvaluations,
      missingSummaries,
      verifiedCount,
      totalViews,
    };
  },
};
