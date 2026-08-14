import { z } from "zod";
import { schoolsRepository } from "../schools/schoolsRepository.js";
import { AppError } from "../../middleware/errorHandler.js";
import { aiJson, aiEnabled } from "../../lib/ai/client.js";

// Schema for AI-parsed search intent
const searchIntentSchema = z
  .object({
    region: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    keywords: z.array(z.string()).optional().nullable(),
  })
  .strict();

export const searchService = {
  async search(query, filters = {}) {
    if (!query || query.trim().length < 2) {
      throw new AppError("Search query must be at least 2 characters", 400);
    }

    // Try AI-powered natural language parsing first
    let aiIntent = null;
    if (aiEnabled) {
      aiIntent = await this.parseSearchIntent(query);
    }

    // Build the Prisma filters from AI intent (if available) + explicit filters
    const dbFilters = {};

    // AI-parsed region/category take precedence over keyword-only search
    if (aiIntent?.region) {
      dbFilters.region = aiIntent.region;
    }
    if (aiIntent?.category) {
      dbFilters.category = aiIntent.category;
    }

    // Explicit query filters override AI intent
    if (filters.category) dbFilters.category = filters.category;
    if (filters.region) dbFilters.region = filters.region;
    if (filters.language) dbFilters.language = filters.language;
    if (filters.ownership) dbFilters.ownership = filters.ownership;
    if (filters.boarding) dbFilters.boarding = filters.boarding;
    if (filters.program) dbFilters.program = filters.program;
    if (filters.speciality) dbFilters.speciality = filters.speciality;

    // Determine the search keywords: AI keywords if available, otherwise the raw query
    const searchKeywords = aiIntent?.keywords?.length
      ? aiIntent.keywords.join(" ")
      : query;

    // If AI provided structured filters, use the repository's native filtering
    if (aiIntent && (aiIntent.region || aiIntent.category)) {
      const result = await schoolsRepository.findAll({
        ...dbFilters,
        search: searchKeywords,
        page: filters.page || 1,
        limit: filters.limit || 10,
      });
      return {
        query,
        aiParsed: true,
        aiIntent,
        results: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
      };
    }

    // Fallback: keyword-based search using Prisma OR filters (paginated at DB level)
    const keywords = query.toLowerCase().split(/\s+/).filter((k) => k.length > 0);

    const result = await schoolsRepository.findAll({
      search: keywords.join(" "),
      category: filters.category,
      region: filters.region,
      language: filters.language,
      ownership: filters.ownership,
      boarding: filters.boarding,
      program: filters.program,
      speciality: filters.speciality,
      page: filters.page || 1,
      limit: filters.limit || 10,
    });

    return {
      query,
      aiParsed: false,
      results: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  },

  async parseSearchIntent(query) {
    const systemPrompt =
      "You are a search intent parser for a school directory in Cameroon. " +
      "Given a natural language query, extract structured search filters. " +
      'Respond ONLY with JSON matching: {"region": string|null, "category": string|null, "keywords": string[]}. ' +
      "Category must be one of: PrimaryNursery, Secondary, University. " +
      "Region should be a Cameroon region name (e.g. Centre, Littoral, West, Southwest, Northwest, North, Far North, East, South, Adamawa). " +
      "Keywords should be the remaining meaningful search terms (school names, program names, etc.). " +
      "If a field is not present in the query, use null or an empty array.";

    const userPrompt = `Query: "${query}"`;

    return aiJson(systemPrompt, userPrompt, searchIntentSchema);
  },
};