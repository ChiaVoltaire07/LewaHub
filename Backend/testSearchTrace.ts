import { extractFilters } from "./src/services/filter.service";
import prisma from "./src/lib/prisma";

async function traceSearch() {
    const query = "private boarding school in Yaounde";
    
    console.log("=".repeat(80));
    console.log(`TRACING SEARCH: "${query}"`);
    console.log("=".repeat(80));
    
    // Step 1: Extract filters
    const filters = extractFilters(query);
    console.log("\n📊 Step 1: Extracted Filters");
    console.log(JSON.stringify(filters, null, 2));
    
    // Step 2: Build Prisma query manually
    console.log("\n🔨 Step 2: Building Prisma Query");
    const where: any = {};
    
    where.verification_status = "approved";
    console.log(`   ✓ verification_status = "approved"`);
    
    if (filters.region) {
        where.region = {
            name: {
                contains: filters.region,
                mode: "insensitive"
            }
        };
        console.log(`   ✓ region contains "${filters.region}"`);
    }
    
    if (filters.boarding !== undefined) {
        where.boarding_available = filters.boarding;
        console.log(`   ✓ boarding_available = ${filters.boarding}`);
    }
    
    if (filters.ownership) {
        where.ownership = filters.ownership;
        console.log(`   ✓ ownership = "${filters.ownership}"`);
    }
    
    console.log("\n📋 Complete WHERE clause:");
    console.log(JSON.stringify(where, null, 2));
    
    // Step 3: Execute query
    console.log("\n🔍 Step 3: Executing Query");
    const schools = await prisma.school.findMany({
        where,
        include: {
            region: true
        }
    });
    
    console.log(`   Found ${schools.length} schools:`);
    schools.forEach(school => {
        console.log(`   - ${school.name}`);
        console.log(`     Region: ${school.region?.name}`);
        console.log(`     Ownership: ${school.ownership}`);
        console.log(`     Boarding: ${school.boarding_available}`);
        console.log(`     Address: ${school.address}`);
    });
    
    // Step 4: Test with keyword search
    console.log("\n🔍 Step 4: Testing with keyword search");
    const keywordWhere = { ...where };
    
    if (filters.keywords && filters.keywords.length > 0) {
        const keywordGroups: any[] = [];
        for (const keyword of filters.keywords) {
            const searchTerm = keyword.toLowerCase();
            const keywordGroup: any[] = [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { address: { contains: searchTerm, mode: "insensitive", not: null } },
                { description: { contains: searchTerm, mode: "insensitive", not: null } }
            ];
            keywordGroups.push({ OR: keywordGroup });
        }
        keywordWhere.AND = keywordGroups;
        console.log(`   Added keyword filters: ${JSON.stringify(filters.keywords)}`);
    }
    
    const keywordSchools = await prisma.school.findMany({
        where: keywordWhere,
        include: {
            region: true
        }
    });
    
    console.log(`   Found ${keywordSchools.length} schools with keywords:`);
    keywordSchools.forEach(school => {
        console.log(`   - ${school.name}`);
    });
    
    await prisma.$disconnect();
}

traceSearch().catch(console.error);