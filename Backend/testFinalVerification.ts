import { searchSchools } from "./src/services/search.service";

async function finalVerification() {
    console.log("=".repeat(80));
    console.log("FINAL VERIFICATION - Testing Multiple Queries");
    console.log("=".repeat(80));

    const testQueries = [
        "private boarding school in Yaounde",
        "bamenda",
        "schools in Centre",
        "library",
        "computer science",
        "private school with library"
    ];

    for (const query of testQueries) {
        console.log(`\n${"=".repeat(80)}`);
        console.log(`Query: "${query}"`);
        console.log("=".repeat(80));
        
        try {
            const results = await searchSchools(query);
            console.log(`✅ Found ${results.length} school(s)`);
            
            if (results.length > 0) {
                results.forEach((school: any, index: number) => {
                    console.log(`   ${index + 1}. ${school.name} (Score: ${school.score.toFixed(2)})`);
                });
            } else {
                console.log(`   ❌ No results (this may be expected if no schools match)`);
            }
        } catch (error) {
            console.error(`   ❌ Error:`, error);
        }
    }

    console.log(`\n${"=".repeat(80)}`);
    console.log("VERIFICATION COMPLETE");
    console.log("=".repeat(80) + "\n");
}

finalVerification().catch(console.error);