import {
    Request,
    Response
} from "express";


import {
    searchSchools
} from "../services/search.service";



export async function search(
    req: Request,
    res: Response
) {
    try {
        const query = req.query.query as string;

        if (!query || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
                error: "Please provide a search query"
            });
        }

        // Validate query length
        if (query.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Search query too short",
                error: "Query must be at least 2 characters long"
            });
        }

        if (query.trim().length > 200) {
            return res.status(400).json({
                success: false,
                message: "Search query too long",
                error: "Query must be less than 200 characters"
            });
        }

        const startTime = Date.now();
        const result = await searchSchools(query.trim());
        const executionTime = Date.now() - startTime;

        // Return enhanced response with metadata
        res.json({
            success: true,
            data: result,
            meta: {
                query: query.trim(),
                resultCount: result.length,
                executionTimeMs: executionTime,
                cached: false // Note: The cache check happens in the service
            }
        });

    } catch (error) {
        console.error("Search error:", error);
        
        res.status(500).json({
            success: false,
            message: "Search failed",
            error: "An unexpected error occurred while processing your search"
        });
    }
}
