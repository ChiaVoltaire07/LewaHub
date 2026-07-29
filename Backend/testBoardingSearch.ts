import { searchSchools } from "./src/services/search.service";
import { extractFilters } from "./src/services/filter.service";

async function testBoardingSearch() {
    const queries = [
        "boarding",
        "boarding school",
        "dormitory",
        "hostel"
    ];

    for (const query of queries) {
        console.log(`\n${"=".repeat(80)}`);
        console.log(`Query: "${query}"`);
        console.log("=".repeat(80));
        
        const filters = extractFilters(query);
        console.log("Extracted filters:", JSON.stringify(filters, null, 2));
        
        const results = await searchSchools(query);
        console.log(`Found ${results.length} boarding schools:`);
        results.forEach((school: any, index: number) => {
            console.log(`   ${index + 1}. ${school.name} (Boarding: ${school.boarding_available})`);
        });
    }
}

testBoardingSearch().catch(console.error);