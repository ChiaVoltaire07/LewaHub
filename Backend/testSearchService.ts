import { searchSchools } from "./src/services/search.service";

async function testSearch() {
    console.log("Testing search for 'bamenda':\n");
    
    const results = await searchSchools("bamenda");
    
    console.log(`Found ${results.length} schools:`);
    results.forEach((school: any, index: number) => {
        console.log(`${index + 1}. ${school.name} - Score: ${school.score}`);
        console.log(`   Address: ${school.address}`);
        console.log(`   Region: ${school.region?.name}`);
    });
}

testSearch().catch(console.error);