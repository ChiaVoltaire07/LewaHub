import { institutionsRepository } from "../institutions/institutionsRepository.js";
import { AppError } from "../../middleware/errorHandler.js";

export const aiSummaryService = {
  generateSummary(institution) {
    // Simple template-based summary generation
    // In production, this would call an actual AI service (OpenAI, etc.)
    const programsList = institution.programs.length
      ? institution.programs.map((p) => p.name).join(", ")
      : "various fields of study";

    const summary = `${institution.name} is a ${institution.type.toLowerCase()} located in ${institution.city}, ${institution.region} region. It offers ${institution.programs.length} program(s) including ${programsList}. ${institution.verified ? "This institution is verified and recognized." : "Verification status is pending."} With ${institution.anonymousViews || 0} views from students, it is ${institution.anonymousViews > 50 ? "a popular choice" : "gaining attention"} in the education sector.`;

    return summary;
  },

  async regenerateSummary(institutionId) {
    const inst = await institutionsRepository.findById(institutionId);
    if (!inst) {
      throw new AppError("Institution not found", 404);
    }

    const newSummary = this.generateSummary(inst);
    await institutionsRepository.update(institutionId, { aiSummary: newSummary });

    return { aiSummary: newSummary };
  },

  async regenerateAllSummaries() {
    const result = await institutionsRepository.findAll({ page: 1, limit: 1000 });
    const institutions = result.data;

    const updated = [];
    for (const inst of institutions) {
      const newSummary = this.generateSummary(inst);
      if (newSummary !== inst.aiSummary) {
        await institutionsRepository.update(inst._id, { aiSummary: newSummary });
        updated.push(inst._id);
      }
    }

    return { updated: updated.length, total: institutions.length };
  },
};
