import { schoolsRepository } from "../schools/schoolsRepository.js";
import { AppError } from "../../middleware/errorHandler.js";

export const aiSummaryService = {
  generateSummary(school) {
    // Simple template-based summary generation
    // In production, this would call an actual AI service (OpenAI, etc.)
    const programsList = school.programs.length
      ? school.programs.map((p) => p.name).join(", ")
      : "various fields of study";

    const summary = `${school.name} is a ${school.category.toLowerCase()} located in ${school.city}, ${school.region} region. It offers ${school.programs.length} program(s) including ${programsList}. ${school.verified ? "This school is verified and recognized." : "Verification status is pending."} With ${school.anonymousViews || 0} views from students, it is ${school.anonymousViews > 50 ? "a popular choice" : "gaining attention"} in the education sector.`;

    return summary;
  },

  async regenerateSummary(schoolId) {
    const school = await schoolsRepository.findById(schoolId);
    if (!school) {
      throw new AppError("School not found", 404);
    }

    const newSummary = this.generateSummary(school);
    await schoolsRepository.update(schoolId, { aiSummary: newSummary });

    return { aiSummary: newSummary };
  },

  async regenerateAllSummaries() {
    const result = await schoolsRepository.findAll({ page: 1, limit: 1000 });
    const schools = result.data;

    const updated = [];
    for (const school of schools) {
      const newSummary = this.generateSummary(school);
      const schoolId = school.id || school._id;
      if (newSummary !== school.aiSummary) {
        await schoolsRepository.update(schoolId, { aiSummary: newSummary });
        updated.push(schoolId);
      }
    }

    return { updated: updated.length, total: schools.length };
  },
};
