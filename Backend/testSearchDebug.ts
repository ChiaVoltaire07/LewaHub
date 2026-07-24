import prisma from "./src/lib/prisma";

async function debugSearch() {
    // Test 1: Simple contains search
    console.log("Test 1: Schools with 'bamenda' in name");
    const test1 = await prisma.school.findMany({
        where: {
            name: {
                contains: "bamenda",
                mode: "insensitive"
            }
        },
        include: {
            region: true
        }
    });
    console.log(`Found ${test1.length} schools`);
    test1.forEach(s => console.log(`  - ${s.name} (${s.region.name})`));

    // Test 2: Search in address
    console.log("\nTest 2: Schools with 'bamenda' in address");
    const test2 = await prisma.school.findMany({
        where: {
            address: {
                contains: "bamenda",
                mode: "insensitive"
            }
        }
    });
    console.log(`Found ${test2.length} schools`);
    test2.forEach(s => console.log(`  - ${s.name}: ${s.address}`));

    // Test 3: OR condition
    console.log("\nTest 3: OR search for 'bamenda'");
    const test3 = await prisma.school.findMany({
        where: {
            OR: [
                { name: { contains: "bamenda", mode: "insensitive" } },
                { address: { contains: "bamenda", mode: "insensitive" } }
            ]
        }
    });
    console.log(`Found ${test3.length} schools`);
    test3.forEach(s => console.log(`  - ${s.name}`));

    // Test 4: Check all schools
    console.log("\nTest 4: All schools in database");
    const allSchools = await prisma.school.findMany({
        include: {
            region: true
        }
    });
    console.log(`Total schools: ${allSchools.length}`);
    allSchools.forEach(s => console.log(`  - ${s.name}: ${s.address}`));
}

debugSearch().catch(console.error);