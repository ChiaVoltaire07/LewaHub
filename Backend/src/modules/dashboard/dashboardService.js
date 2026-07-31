import { institutionsRepository } from "../institutions/institutionsRepository.js";

export const dashboardService = {
  async getDashboardStats() {
    // Get all institutions
    const instResult = await institutionsRepository.findAll({ page: 1, limit: 10000 });
    const totalInstitutions = instResult.total;

    // Count institutions without images
    const missingImage = instResult.data.filter((i) => !i.imageUrl || i.imageUrl.length === 0)
      .length;

    // Count institutions without descriptions
    const missingDescription = instResult.data.filter((i) => !i.description || i.description.length === 0)
      .length;

    // Get verified count
    const verifiedCount = instResult.data.filter((i) => i.verified).length;

    // Get total views across all institutions
    const totalViews = instResult.data.reduce((sum, i) => sum + (i.anonymousViews || 0), 0);

    // Recent activity - last 5 institutions created or updated
    const recentActivity = [...instResult.data]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 5)
      .map((i) => ({
        id: i.id,
        name: i.name,
        action: "Updated",
        timeAgo: getTimeAgo(new Date(i.updatedAt || i.createdAt)),
      }));

    return {
      totalInstitutions,
      verifiedCount,
      missingImage,
      missingDescription,
      totalViews,
      recentActivity,
    };
  },
};

function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}
