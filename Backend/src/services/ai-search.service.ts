import OpenAI from "openai";
import { extractFilters, SearchFilters } from "./filter.service";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || ""
});

interface SemanticSearchResult {
    schoolId: number;
    relevanceScore: number;
    matchReason: string;
}

/**
 * AI-powered search enhancement service
 * Uses OpenAI to understand query intent and improve search results
 */
export class AISearchService {
    private static instance: AISearchService;
    private openai: OpenAI;

    private constructor() {
        this.openai = openai;
    }

    public static getInstance(): AISearchService {
        if (!AISearchService.instance) {
            AISearchService.instance = new AISearchService();
        }
        return AISearchService.instance;
    }

    /**
     * Enhance the search query using AI to extract semantic meaning
     */
    public async enhanceQuery(originalQuery: string): Promise<{
        enhancedQuery: string;
        searchIntent: string;
        keyConcepts: string[];
        suggestedFilters: Partial<SearchFilters>;
    }> {
        try {
            const prompt = `You are a search engine for a school directory in Cameroon. Analyze this search query and extract:
1. Enhanced search query (expand abbreviations, fix typos, add relevant terms)
2. Search intent (find_school, compare_schools, browse_options, specific_school)
3. Key concepts (main topics the user is looking for)
4. Suggested filters (region, ownership, facilities, programs, etc.)

Query: "${originalQuery}"

Respond in JSON format:
{
    "enhancedQuery": "improved search query",
    "searchIntent": "intent category",
    "keyConcepts": ["concept1", "concept2"],
    "suggestedFilters": {
        "region": "region name if mentioned",
        "ownership": "private/public if mentioned",
        "facilities": ["facility1"],
        "programs": ["program1"],
        "keywords": ["keyword1"]
    }
}`;

            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful search engine assistant for a school directory. Always respond with valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 500
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error("No response from OpenAI");
            }

            const result = JSON.parse(content);
            
            return {
                enhancedQuery: result.enhancedQuery || originalQuery,
                searchIntent: result.searchIntent || "find_school",
                keyConcepts: result.keyConcepts || [],
                suggestedFilters: result.suggestedFilters || {}
            };

        } catch (error) {
            console.error("AI query enhancement failed:", error);
            // Fallback to original query
            return {
                enhancedQuery: originalQuery,
                searchIntent: "find_school",
                keyConcepts: [],
                suggestedFilters: {}
            };
        }
    }

    /**
     * Rank search results using AI based on relevance to the query
     */
    public async rankResultsWithAI(
        query: string,
        schools: Array<{
            school_id: number;
            name: string;
            description?: string;
            region?: { name: string };
            program?: Array<{ name: string }>;
            school_facility?: Array<{ facility: { name: string } }>;
        }>,
        existingScores: Map<number, number>
    ): Promise<Map<number, number>> {
        if (schools.length === 0) {
            return existingScores;
        }

        try {
            // Prepare school data for AI analysis
            const schoolData = schools.map(school => ({
                id: school.school_id,
                name: school.name,
                description: school.description || "",
                region: school.region?.name || "",
                programs: school.program?.map(p => p.name).join(", ") || "",
                facilities: school.school_facility?.map(sf => sf.facility.name).join(", ") || ""
            }));

            const prompt = `You are ranking schools based on relevance to a search query. Score each school from 0-100 based on how well it matches the query.

Query: "${query}"

Schools:
${JSON.stringify(schoolData, null, 2)}

Consider:
- Name matches
- Description relevance
- Program offerings
- Facilities
- Location

Respond with JSON array of {school_id, score, reason}:
[
    {"school_id": 1, "score": 85, "reason": "Strong match because..."},
    ...
]`;

            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a school ranking assistant. Always respond with valid JSON array."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 1000
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                return existingScores;
            }

            const aiRankings = JSON.parse(content);
            const newScores = new Map(existingScores);

            // Blend AI scores with existing scores (70% AI, 30% existing)
            for (const ranking of aiRankings) {
                const currentScore = existingScores.get(ranking.school_id) || 0;
                const blendedScore = (ranking.score * 0.7) + (currentScore * 0.3);
                newScores.set(ranking.school_id, blendedScore);
            }

            return newScores;

        } catch (error) {
            console.error("AI ranking failed:", error);
            return existingScores;
        }
    }

    /**
     * Generate a summary of why these schools were returned
     */
    public async generateSearchSummary(
        query: string,
        schools: Array<{ name: string; score: number }>
    ): Promise<string> {
        if (schools.length === 0) {
            return "No schools found matching your criteria.";
        }

        try {
            const topSchools = schools.slice(0, 5);
            const schoolNames = topSchools.map(s => s.name).join(", ");

            const prompt = `Generate a brief, helpful summary (1-2 sentences) explaining why these schools were returned for the search query "${query}".

Top results: ${schoolNames}

Make it natural and user-friendly.`;

            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful search assistant. Keep responses concise and friendly."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 100
            });

            return response.choices[0]?.message?.content || 
                   `Found ${schools.length} schools matching your search.`;

        } catch (error) {
            console.error("AI summary generation failed:", error);
            return `Found ${schools.length} schools matching your search.`;
        }
    }

    /**
     * Suggest related searches based on the current query
     */
    public async suggestRelatedSearches(query: string): Promise<string[]> {
        try {
            const prompt = `Suggest 5 related search queries for a school directory in Cameroon based on this query: "${query}"

Provide diverse suggestions that might help the user find what they're looking for.

Respond with JSON array:
["suggestion1", "suggestion2", ...]`;

            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a search suggestion assistant. Always respond with valid JSON array."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 200
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                return [];
            }

            const suggestions = JSON.parse(content);
            return suggestions.slice(0, 5);

        } catch (error) {
            console.error("AI suggestions failed:", error);
            return [];
        }
    }
}

// Export singleton instance
export const aiSearchService = AISearchService.getInstance();