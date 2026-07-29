import { searchSchools } from "./src/services/search.service";
import { extractFilters } from "./src/services/filter.service";

async function testEnhancedSearch() {
    console.log("=".repeat(80));
    console.log("ENHANCED NATURAL LANGUAGE SEARCH ENGINE - TEST SUITE");
    console.log("=".repeat(80));

    const testQueries = [
        // Basic searches
        "bamenda",
        "bamendaa", // Typo test
        
        // Region searches
        "schools in Centre",
        "littoral region",
        
        // City searches
        "schools in Yaounde",
        "Douala",
        
        // Facility searches
        "boarding school",
        "school with library",
        "computer lab",
        "schools with sports facilities",
        
        // Program searches
        "computer science",
        "science school",
        
        // Combined filters
        "private boarding school in Bamenda",
        "public school in Centre with library",
        "international curriculum in Douala",
        
        // Complex queries
        "best private boarding school with computer lab in Bamenda",
        "affordable science school with laboratory in Northwest"
    ];

    for (const query of testQueries) {
        console.log(`\n${"=".repeat(80)}`);
        console.log(`Query: "${query}"`);
        console.log("=".repeat(80));
        
        // Show extracted filters
        const filters = extractFilters(query);
        console.log("\n📊 Extracted Filters:");
        console.log(JSON.stringify(filters, null, 2));
        
        // Perform search
        const startTime = Date.now();
        const results = await searchSchools(query);
        const executionTime = Date.now() - startTime;
        
        console.log(`\n🔍 Search Results (${results.length} schools found in ${executionTime}ms):`);
        
        if (results.length === 0) {
            console.log("  ❌ No results found");
        } else {
            results.forEach((school: any, index: number) => {
                console.log(`\n  ${index + 1}. ${school.name}`);
                console.log(`     Score: ${school.score.toFixed(2)}`);
                console.log(`     Region: ${school.region?.name}`);
                console.log(`     Address: ${school.address || 'N/A'}`);
                console.log(`     Boarding: ${school.boarding_available ? 'Yes' : 'No'}`);
                console.log(`     Status: ${school.verification_status}`);
                
                if (school.school_facility && school.school_facility.length > 0) {
                    const facilities = school.school_facility
                        .map((sf: any) => sf.facility.name)
                        .join(", ");
                    console.log(`     Facilities: ${facilities}`);
                }
                
                if (school.program && school.program.length > 0) {
                    const programs = school.program
                        .map((p: any) => p.name)
                        .join(", ");
                    console.log(`     Programs: ${programs}`);
                }
            });
        }
    }

    console.log(`\n${"=".repeat(80)}`);
    console.log("TEST SUITE COMPLETED");
    console.log("=".repeat(80) + "\n");
}

testEnhancedSearch().catch(console.error);