export interface SearchFilters {
    region?: string;
    boarding?: boolean;
    ownership?: string;
    facilities?: string[];
    programs?: string[];
    keywords?: string[];
    city?: string;
    minRating?: number;
    maxFee?: number;
    curriculum?: string[];
    schoolLevel?: string;
    searchIntent?: 'specific' | 'browse' | 'compare';
}

// Common Cameroonian regions for detection
const CAMEROON_REGIONS = [
    "adamawa", "centre", "east", "far north", "littoral", 
    "north", "northwest", "south", "southwest", "west"
];

// Common Cameroonian cities mapped to regions
const CAMEROON_CITIES: Record<string, string> = {
    "yaounde": "Centre",
    "douala": "Littoral",
    "bamenda": "Northwest",
    "buea": "Southwest",
    "limbe": "Southwest",
    "kumba": "Southwest",
    "garoua": "North",
    "maroua": "Far North",
    "ngaoundere": "Adamawa",
    "bertoua": "East",
    "ebolowa": "South",
    "bafoussam": "West",
    "dschang": "West",
    "kumbo": "Northwest"
};

// School levels
const SCHOOL_LEVELS = [
    "primary", "secondary", "high school", "elementary", 
    "nursery", "kindergarten", "college", "lycee"
];

// Curriculum types
const CURRICULUM_TYPES = [
    "british", "french", "american", "international", 
    "cameroonian", "igcse", "gcse", "baccalaureate"
];

// Synonyms and related terms - EXPANDED
const SYNONYMS: Record<string, string[]> = {
    "cheap": ["affordable", "low cost", "budget", "inexpensive", "economical", "low fee", "low fees", "reasonable"],
    "expensive": ["premium", "high end", "luxury", "costly", "pricey", "high fee", "high fees"],
    "good": ["best", "top", "excellent", "quality", "great", "outstanding", "top rated", "highly rated"],
    "bad": ["poor", "low quality", "terrible", "worst"],
    "big": ["large", "spacious", "huge", "major", "well known", "popular"],
    "small": ["small", "intimate", "cozy", "personalized", "individual attention"],
    "old": ["established", "traditional", "historic", "experienced", "legacy"],
    "new": ["modern", "contemporary", "recent", "latest", "innovative"],
    "safe": ["secure", "protected", "safe environment", "peaceful"],
    "strict": ["disciplined", "structured", "rigorous", "tough"],
    "relaxed": ["flexible", "lenient", "casual", "friendly"]
};

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

// Levenshtein distance for typo tolerance
function levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }

    return dp[m][n];
}

// Find closest match with typo tolerance
function findClosestMatch(word: string, options: string[], threshold: number = 2): string | null {
    let closestMatch: string | null = null;
    let minDistance = Infinity;

    for (const option of options) {
        const distance = levenshteinDistance(word, option);
        if (distance < minDistance && distance <= threshold) {
            minDistance = distance;
            closestMatch = option;
        }
    }

    return closestMatch;
}

// Detect search intent
function detectSearchIntent(query: string): 'specific' | 'browse' | 'compare' {
    const lowerQuery = query.toLowerCase();
    
    // Specific search indicators
    if (lowerQuery.includes("find") || 
        lowerQuery.includes("search") || 
        lowerQuery.includes("looking for") ||
        lowerQuery.includes("show me") ||
        lowerQuery.includes("i want")) {
        return 'specific';
    }
    
    // Compare indicators
    if (lowerQuery.includes("compare") || 
        lowerQuery.includes("versus") || 
        lowerQuery.includes("vs") ||
        lowerQuery.includes("difference between")) {
        return 'compare';
    }
    
    // Browse indicators
    if (lowerQuery.includes("best") || 
        lowerQuery.includes("top") || 
        lowerQuery.includes("recommend") ||
        lowerQuery.includes("list")) {
        return 'browse';
    }
    
    // Default to specific if there are specific filters
    return 'specific';
}

export function extractFilters(query: string): SearchFilters {
    const text = query.toLowerCase().trim();
    
    const filters: SearchFilters = {
        keywords: []
    };

    // Detect search intent
    filters.searchIntent = detectSearchIntent(query);

    // Detect cities (with typo tolerance)
    const words = text.split(/\s+/);
    for (const word of words) {
        const matchedCity = findClosestMatch(word, Object.keys(CAMEROON_CITIES), 2);
        if (matchedCity) {
            filters.city = matchedCity.charAt(0).toUpperCase() + matchedCity.slice(1);
            filters.region = CAMEROON_CITIES[matchedCity];
            break;
        }
    }

    // Detect regions (with typo tolerance) - only if no city matched
    if (!filters.region) {
        for (const region of CAMEROON_REGIONS) {
            if (text.includes(region)) {
                filters.region = region.charAt(0).toUpperCase() + region.slice(1);
                break;
            }
        }
    }

    // Detect boarding requests - expanded with more synonyms
    const boardingKeywords = [
        "boarding", "dormitory", "dorm", "residential", "hostel", "accommodation",
        "live on campus", "stay at school", "full time", "full-time",
        "weekday boarding", "weekly boarding", "flexible boarding"
    ];
    
    for (const keyword of boardingKeywords) {
        if (text.includes(keyword)) {
            filters.boarding = true;
            break;
        }
    }

    // If boarding is detected, don't add "dormitory" to facilities
    // (boarding filter is more reliable than facility name matching)
    if (filters.boarding) {
        // Remove dormitory from facilities if it was added
        if (filters.facilities) {
            filters.facilities = filters.facilities.filter(f => f !== "dormitory");
        }
    }

    // Detect ownership
    if (text.includes("private")) {
        filters.ownership = "private";
    } else if (text.includes("public") || text.includes("government")) {
        filters.ownership = "public";
    }

    // Detect school level
    for (const level of SCHOOL_LEVELS) {
        if (text.includes(level)) {
            filters.schoolLevel = level;
            break;
        }
    }

    // Detect curriculum
    for (const curriculum of CURRICULUM_TYPES) {
        if (text.includes(curriculum)) {
            filters.curriculum = [curriculum];
            break;
        }
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

    const filteredWords = words.filter(word => {
        // Keep word if it's not a stop word and not already captured in filters
        const isStopWord = stopWords.has(word);
        const isFilterWord = word.match(/^(boarding|dormitory|dorm|residential|private|public|government|hostel|accommodation)$/);
        const isCity = Object.keys(CAMEROON_CITIES).includes(word);
        const isRegion = CAMEROON_REGIONS.includes(word);
        const isLevel = SCHOOL_LEVELS.includes(word);
        const isCurriculum = CURRICULUM_TYPES.includes(word);
        
        return word.length > 2 && 
               !isStopWord && 
               !isFilterWord &&
               !isCity &&
               !isRegion &&
               !isLevel &&
               !isCurriculum;
    });

    if (filteredWords.length > 0) {
        filters.keywords = filteredWords;
    }

    return filters;
}
