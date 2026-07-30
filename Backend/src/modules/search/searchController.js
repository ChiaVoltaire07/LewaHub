import { searchService } from "./searchService.js";

export const searchController = {
  async search(req, res, next) {
    try {
      const { q, type, region, page = 1, limit = 10 } = req.query;
      const result = await searchService.search(q, {
        type,
        region,
        page: parseInt(page),
        limit: parseInt(limit),
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
