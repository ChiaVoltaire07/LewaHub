import { schoolsRepository } from "../schools/schoolsRepository.js";

export const dashboardService = {
  async getDashboardStats() {
    // Get all schools
    const schoolResult = await schoolsRepository.findAll({ page: 1, limit: 10000 });
    const totalSchools = schoolResult.total;

    // Count schools without images
    const missingImage = schoolResult.data.filter((s) => !s.imageUrl || s.imageUrl.length === 0)
      .length;

    // Count schools without descriptions
    const missingDescription = schoolResult.data.filter((s) => !s.description || s.description.length === 0)
      .length;

    // Get verified count
    const verifiedCount = schoolResult.data.filter((s) => s.verified).length;

    // Get total views across all schools
    const totalViews = schoolResult.data.reduce((sum, s) => sum + (s.anonymousViews || 0), 0);

    // Recent activity - last 5 schools created or updated
    const recentActivity = [...schoolResult.data]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        name: s.name,
        action: "Updated",
        timeAgo: getTimeAgo(new Date(s.updatedAt || s.createdAt)),
      }));

    return {
      totalSchools,
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
