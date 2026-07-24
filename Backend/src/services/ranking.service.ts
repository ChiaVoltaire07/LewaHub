import prisma from "../lib/prisma";
import { SearchFilters } from "./filter.service";

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
        
        score += matchedFacilities.length * 15;
    }

    // Program match bonus
    if (filters.programs && filters.programs.length > 0 && school.program) {
        const schoolProgramNames = school.program
            .map((p: { name: string }) => p.name.toLowerCase());
        
        const matchedPrograms = filters.programs.filter((p: string) => 
            schoolProgramNames.some((sp: string) => sp.includes(p.toLowerCase()) || p.toLowerCase().includes(sp))
        );
        
        score += matchedPrograms.length * 15;
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
        
        score += keywordMatches.length * 10;
    }

    return score;
}