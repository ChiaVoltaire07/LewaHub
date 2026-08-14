import { searchService } from "./searchService.js";

export const searchController = {
  async search(req, res, next) {
    try {
      const { q, category, region, page, limit } = req.validatedQuery;
      const result = await searchService.search(q, { category, region, page, limit });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
