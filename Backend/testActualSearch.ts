import { searchSchools } from "./src/services/search.service";

async function testActualSearch() {
    const query = "private boarding school in Yaounde";
    
    console.log("=".repeat(80));
    console.log(`TESTING ACTUAL SEARCH SERVICE: "${query}"`);
    console.log("=".repeat(80));
    
    try {
        const results = await searchSchools(query);
        
        console.log(`\n✅ Found ${results.length} schools:`);
        results.forEach((school: any, index: number) => {
            console.log(`\n${index + 1}. ${school.name}`);
            console.log(`   Score: ${school.score.toFixed(2)}`);
            console.log(`   Region: ${school.region?.name}`);
            console.log(`   Address: ${school.address}`);
            console.log(`   Boarding: ${school.boarding_available}`);
            console.log(`   Ownership: ${school.ownership}`);
            
            if (school.school_facility && school.school_facility.length > 0) {
                const facilities = school.school_facility
                    .map((sf: any) => sf.facility.name)
                    .join(", ");
                console.log(`   Facilities: ${facilities}`);
            }
        });
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

testActualSearch().catch(console.error);