import { schoolsRepository } from "../schools/schoolsRepository.js";
import { AppError } from "../../middleware/errorHandler.js";

export const searchService = {
  async search(query, filters = {}) {
    if (!query || query.trim().length < 2) {
      throw new AppError("Search query must be at least 2 characters", 400);
    }

   
    const keywords = query.toLowerCase().split(/\s+/).filter((k) => k.length > 0);

    let results = await schoolsRepository.findAll({
      page: 1,
      limit: 100, 
    });

    
    const scored = (results.data || [])
      .map((school) => {
        let score = 0;

        const name = String(school.name || "").toLowerCase();
        const description = String(school.description || "").toLowerCase();
        const city = String(school.city || "").toLowerCase();
        const region = String(school.region || "").toLowerCase();
        const programs = Array.isArray(school.programs) ? school.programs : [];

        keywords.forEach((keyword) => {
          if (name.includes(keyword)) score += 3;
          if (description.includes(keyword)) score += 2;
          if (city.includes(keyword)) score += 1;
          if (region.includes(keyword)) score += 1;
          programs.forEach((prog) => {
            const progName = String(prog?.name || "").toLowerCase();
            if (progName.includes(keyword)) score += 2;
          });
        });

        return { ...school, searchScore: score };
      })
      .filter((school) => school.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore);

   
    let filtered = scored;
    if (filters.category) {
      filtered = filtered.filter((s) => s.category === filters.category);
    }
    if (filters.region) {
      filtered = filtered.filter((s) => s.region === filters.region);
    }

   
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const start = (page - 1) * limit;
    const paginatedResults = filtered.slice(start, start + limit);

    return {
      query,
      results: paginatedResults,
      total: filtered.length,
      page,
      limit,
    };
  },
};
