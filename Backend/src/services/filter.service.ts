export interface SearchFilters {
    region?: string;
    boarding?: boolean;
    ownership?: string;
    facilities?: string[];
    programs?: string[];
    keywords?: string[];
}

// Common Cameroonian regions for detection
const CAMEROON_REGIONS = [
    "adamawa", "centre", "east", "far north", "littoral", 
    "north", "northwest", "south", "southwest", "west"
];

// Common facility keywords mapping
const FACILITY_KEYWORDS: Record<string, string[]> = {
    "library": ["library", "libraries"],
    "laboratory": ["laboratory", "lab", "labs", "computer lab", "science lab"],
    "computer": ["computer", "computer lab", "it lab", "ict lab"],
    "dormitory": ["dormitory", "dorm", "boarding"],
    "sports": ["sports", "stadium", "field", "gymnasium", "gym"],
    "cafeteria": ["cafeteria", "canteen", "dining"],
    "wifi": ["wifi", "internet", "wireless"],
    "swimming": ["swimming", "pool"],
    "music": ["music", "band"],
    "art": ["art", "arts"]
};

// Common program keywords mapping
const PROGRAM_KEYWORDS: Record<string, string[]> = {
    "computer science": ["computer science", "cs", "programming", "software"],
    "science": ["science", "scientific", "stem"],
    "mathematics": ["mathematics", "math", "maths"],
    "english": ["english", "bilingual"],
    "french": ["french", "francophone"],
    "business": ["business", "commerce", "management"],
    "arts": ["arts", "humanities", "literature"],
    "engineering": ["engineering", "technical"],
    "medicine": ["medicine", "health", "nursing"],
    "law": ["law", "legal"]
};

export function extractFilters(query: string): SearchFilters {
    const text = query.toLowerCase().trim();
    
    const filters: SearchFilters = {
        keywords: []
    };

    // Detect regions
    for (const region of CAMEROON_REGIONS) {
        if (text.includes(region)) {
            filters.region = region.charAt(0).toUpperCase() + region.slice(1);
            break;
        }
    }

    // Detect boarding requests
    if (text.includes("boarding") || text.includes("dormitory") || text.includes("dorm") || text.includes("residential")) {
        filters.boarding = true;
    }

    // Detect ownership
    if (text.includes("private")) {
        filters.ownership = "private";
    } else if (text.includes("public") || text.includes("government")) {
        filters.ownership = "public";
    }

    // Detect facilities
    const detectedFacilities: string[] = [];
    for (const [facility, keywords] of Object.entries(FACILITY_KEYWORDS)) {
        for (const keyword of keywords) {
            if (text.includes(keyword)) {
                detectedFacilities.push(facility);
                break;
            }
        }
    }
    if (detectedFacilities.length > 0) {
        filters.facilities = [...new Set(detectedFacilities)];
    }

    // Detect programs
    const detectedPrograms: string[] = [];
    for (const [program, keywords] of Object.entries(PROGRAM_KEYWORDS)) {
        for (const keyword of keywords) {
            if (text.includes(keyword)) {
                detectedPrograms.push(program);
                break;
            }
        }
    }
    if (detectedPrograms.length > 0) {
        filters.programs = [...new Set(detectedPrograms)];
    }

    // Extract general keywords (remove common stop words and filter-specific terms)
    const stopWords = new Set([
        "a", "an", "the", "in", "on", "at", "to", "for", "with", "without",
        "and", "or", "but", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "will", "would", "could",
        "should", "may", "might", "must", "shall", "can", "need", "dare",
        "ought", "used", "it", "its", "this", "that", "these", "those",
        "i", "you", "he", "she", "we", "they", "what", "which", "who",
        "when", "where", "why", "how", "all", "each", "every", "both",
        "few", "more", "most", "other", "some", "such", "no", "nor", "not",
        "only", "own", "same", "so", "than", "too", "very", "just",
        "school", "schools", "find", "search", "looking", "want"
    ]);

    const words = text.split(/\s+/).filter(word => {
        // Keep word if it's not a stop word and not already captured in filters
        return word.length > 2 && 
               !stopWords.has(word) &&
               !word.match(/^(boarding|dormitory|dorm|residential|private|public|government)$/);
    });

    if (words.length > 0) {
        filters.keywords = words;
    }

    return filters;
}