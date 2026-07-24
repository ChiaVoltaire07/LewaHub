import prisma from "../lib/prisma";
import {
    calculateSchoolScore
} from "./ranking.service";
import {
    extractFilters,
    SearchFilters
} from "./filter.service";
import {
    getCache,
    setCache
} from "./cache.service";

export async function searchSchools(
    query: string
) {
    // 1. Check cache first
    const cacheKey = `school-search:${query}`;
    const cached = await getCache(cacheKey);

    if (cached) {
        console.log("Returning cached result");
        return cached;
    }

    // 2. Extract filters from natural language query
    const filters = extractFilters(query);

    // 2.5 Check if we have any filters to apply
    const hasFilters = filters.region || 
                       filters.boarding !== undefined || 
                       filters.ownership || 
                       (filters.facilities && filters.facilities.length > 0) ||
                       (filters.programs && filters.programs.length > 0) ||
                       (filters.keywords && filters.keywords.length > 0);

    if (!hasFilters) {
        // No valid filters extracted, return empty array
        return [];
    }

    // 3. Build dynamic Prisma query
    const where: any = {};

    // Region filter
    if (filters.region) {
        where.region = {
            name: {
                contains: filters.region,
                mode: "insensitive"
            }
        };
    }

    // Boarding filter
    if (filters.boarding !== undefined) {
        where.boarding_available = filters.boarding;
    }

    // Ownership filter
    if (filters.ownership) {
        where.ownership = filters.ownership;
    }

    // Facilities filter - schools that have ALL specified facilities
    if (filters.facilities && filters.facilities.length > 0) {
        where.school_facility = {
            some: {
                facility: {
                    name: {
                        in: filters.facilities,
                        mode: "insensitive"
                    }
                }
            }
        };
    }

    // Programs filter - schools that have ANY of the specified programs
    if (filters.programs && filters.programs.length > 0) {
        where.program = {
            some: {
                name: {
                    in: filters.programs,
                    mode: "insensitive"
                }
            }
        };
    }

    // Keyword search across multiple fields
    if (filters.keywords && filters.keywords.length > 0) {
        // For each keyword, create a group of OR conditions
        // Then AND all keyword groups together
        const keywordGroups: any[] = [];

        for (const keyword of filters.keywords) {
            const searchTerm = keyword.toLowerCase();
            
            // Each keyword must match at least one field
            const keywordGroup: any[] = [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { address: { contains: searchTerm, mode: "insensitive", not: null } },
                { description: { contains: searchTerm, mode: "insensitive", not: null } },
                { region: { name: { contains: searchTerm, mode: "insensitive" } } },
                { school_facility: { some: { facility: { name: { contains: searchTerm, mode: "insensitive" } } } } },
                { program: { some: { name: { contains: searchTerm, mode: "insensitive" } } } },
                { curriculum: { some: { name: { contains: searchTerm, mode: "insensitive" } } } }
            ];

            keywordGroups.push({
                OR: keywordGroup
            });
        }

        // All keywords must match (AND between keyword groups)
        where.AND = keywordGroups;
    }

    // 4. Execute search with includes
    const schools = await prisma.school.findMany({
        where,
        take: 50,
        include: {
            region: true,
            program: true,
            school_facility: {
                include: {
                    facility: true
                }
            },
            curriculum: true
        }
    });

    // 5. Calculate scores and rank
    type SchoolWithRelations = typeof schools[number];
    const rankedSchools = schools
        .map((school: SchoolWithRelations) => ({
            ...school,
            score: calculateSchoolScore(school, filters)
        }))
        .sort((a: SchoolWithRelations & { score: number }, b: SchoolWithRelations & { score: number }) => b.score - a.score);

    // 6. Save in Redis
    await setCache(
        cacheKey,
        rankedSchools,
        3600
    );

    return rankedSchools;
}