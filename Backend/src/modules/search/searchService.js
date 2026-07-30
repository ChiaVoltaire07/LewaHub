import { institutionsRepository } from "../institutions/institutionsRepository.js";
import { AppError } from "../../middleware/errorHandler.js";

export const searchService = {
  async search(query, filters = {}) {
    if (!query || query.trim().length < 2) {
      throw new AppError("Search query must be at least 2 characters", 400);
    }

  
    const keywords = query.toLowerCase().split(/\s+/).filter((k) => k.length > 0);

    let results = await institutionsRepository.findAll({
      page: 1,
      limit: 100, 
    });

    
    const scored = results.data
      .map((inst) => {
        let score = 0;

        keywords.forEach((keyword) => {
          if (inst.name.toLowerCase().includes(keyword)) score += 3;
          if (inst.description.toLowerCase().includes(keyword)) score += 2;
          if (inst.city.toLowerCase().includes(keyword)) score += 1;
          if (inst.region.toLowerCase().includes(keyword)) score += 1;
          inst.programs.forEach((prog) => {
            if (prog.name.toLowerCase().includes(keyword)) score += 2;
          });
        });

        return { ...inst, searchScore: score };
      })
      .filter((inst) => inst.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore);

   
    let filtered = scored;
    if (filters.type) {
      filtered = filtered.filter((i) => i.type === filters.type);
    }
    if (filters.region) {
      filtered = filtered.filter((i) => i.region === filters.region);
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
