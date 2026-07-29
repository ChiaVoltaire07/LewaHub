import prisma from "../lib/prisma";
import { SearchFilters } from "./filter.service";
import { Decimal } from "@prisma/client/runtime/library";

type School = Awaited<
    ReturnType<
        typeof prisma.school.findFirst
    >
>;

type SchoolWithRelations = School & {
    region?: { name: string };
    program?: Array<{ name: string }>;
    school_facility?: Array<{ facility: { name: string } }>;
    curriculum?: Array<{ name: string }>;
    evaluation?: Array<{ score?: Decimal | null }>;
    school_view?: Array<{ view_id: number }>;
    fee?: Array<{ fee_id: number }>;
    school_photo?: Array<{ photo_id: number }>;
};

export function calculateSchoolScore(
    school: SchoolWithRelations,
    filters: SearchFilters = {}
){
    let score = 0;

    // Base score for approved schools
    if (school.verification_status === "approved") {
        score += 30;
    }

    // Rating score (0-5 scale, convert to 0-20 points)
    if (school.evaluation && school.evaluation.length > 0 && school.evaluation[0].score) {
        const avgRating = parseFloat(school.evaluation[0].score.toString());
        score += (avgRating / 5) * 20; // Max 20 points for rating
    }

    // Popularity score based on views (max 15 points)
    const viewCount = school.school_view?.length || 0;
    if (viewCount > 0) {
        // Logarithmic scale: 10 views = 5pts, 100 views = 10pts, 1000+ views = 15pts
        score += Math.min(15, Math.log10(viewCount) * 5);
    }

    // Boarding match bonus
    if (filters.boarding && school.boarding_available) {
        score += 20;
    }

    // Facility match bonus
    if (filters.facilities && filters.facilities.length > 0 && school.school_facility) {
        const schoolFacilityNames = school.school_facility
            .map((sf: { facility: { name: string } }) => sf.facility.name.toLowerCase());
        
        const matchedFacilities = filters.facilities.filter((f: string) => 
            schoolFacilityNames.includes(f.toLowerCase())
        );
        
        // Calculate percentage of matched facilities
        const matchPercentage = matchedFacilities.length / filters.facilities.length;
        score += matchPercentage * 25; // Max 25 points for perfect facility match
    }

    // Program match bonus
    if (filters.programs && filters.programs.length > 0 && school.program) {
        const schoolProgramNames = school.program
            .map((p: { name: string }) => p.name.toLowerCase());
        
        const matchedPrograms = filters.programs.filter((p: string) => 
            schoolProgramNames.some((sp: string) => sp.includes(p.toLowerCase()) || p.toLowerCase().includes(sp))
        );
        
        // Calculate percentage of matched programs
        const matchPercentage = matchedPrograms.length / filters.programs.length;
        score += matchPercentage * 25; // Max 25 points for perfect program match
    }

    // Keyword match bonus
    if (filters.keywords && filters.keywords.length > 0) {
        const schoolText = [
            school.name,
            school.description,
            school.address,
            school.region?.name
        ].filter(Boolean).join(" ").toLowerCase();

        const keywordMatches = filters.keywords.filter(keyword => 
            schoolText.includes(keyword.toLowerCase())
        );
        
        // Calculate percentage of matched keywords
        const matchPercentage = keywordMatches.length / filters.keywords.length;
        score += matchPercentage * 20; // Max 20 points for perfect keyword match
    }

    // Completeness bonus (schools with more information)
    let completenessScore = 0;
    if (school.description) completenessScore += 2;
    if (school.phone) completenessScore += 1;
    if (school.email) completenessScore += 1;
    if (school.website) completenessScore += 1;
    if (school.address) completenessScore += 1;
    if (school.fee && school.fee.length > 0) completenessScore += 2;
    if (school.school_photo && school.school_photo.length > 0) completenessScore += 2;
    
    score += Math.min(10, completenessScore); // Max 10 points for completeness

    return score;
}
