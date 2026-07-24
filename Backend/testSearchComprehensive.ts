import { searchSchools } from "./src/services/search.service";

async function testSearch() {
    const testQueries = [
        "bamenda",
        "littoral", 
        "dsfnsdkjfnsd",
        "boarding",
        "library",
        "computer science"
    ];

    for (const query of testQueries) {
        console.log(`\n${"=".repeat(60)}`);
        console.log(`Testing query: "${query}"`);
        console.log("=".repeat(60));
        
        const results = await searchSchools(query);
        
        console.log(`Found ${results.length} school(s):`);
        if (results.length === 0) {
            console.log("  (No results - this is correct for gibberish queries)");
        } else {
            results.forEach((school: any, index: number) => {
                console.log(`${index + 1}. ${school.name} - Score: ${school.score}`);
                console.log(`   Address: ${school.address}`);
                console.log(`   Region: ${school.region?.name}`);
                console.log(`   Boarding: ${school.boarding_available}`);
            });
        }
    }
}

testSearch().catch(console.error);