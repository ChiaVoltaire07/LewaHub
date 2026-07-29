import prisma from "./src/lib/prisma";

async function debugSearch() {
    console.log("=".repeat(80));
    console.log("SEARCH DEBUG - Checking Database State");
    console.log("=".repeat(80));

    try {
        // Check total schools
        const totalSchools = await prisma.school.count();
        console.log(`\n📊 Total schools in database: ${totalSchools}`);

        // Check approved schools
        const approvedSchools = await prisma.school.count({
            where: {
                verification_status: "approved"
            }
        });
        console.log(`✅ Approved schools: ${approvedSchools}`);

        // Check schools by status
        const statusCounts = await prisma.school.groupBy({
            by: ["verification_status"],
            _count: true
        });
        console.log(`\n📈 Schools by status:`);
        statusCounts.forEach(status => {
            console.log(`   ${status.verification_status || "null"}: ${status._count}`);
        });

        // Check schools in Yaounde/Centre
        const yaoundeSchools = await prisma.school.findMany({
            where: {
                OR: [
                    { address: { contains: "yaounde", mode: "insensitive" } },
                    { address: { contains: "centre", mode: "insensitive" } }
                ]
            },
            include: {
                region: true
            },
            take: 5
        });
        console.log(`\n📍 Schools with Yaounde/Centre in address: ${yaoundeSchools.length}`);
        yaoundeSchools.forEach(school => {
            console.log(`   - ${school.name} (${school.region?.name}) - Status: ${school.verification_status}`);
        });

        // Check private schools
        const privateSchools = await prisma.school.count({
            where: {
                ownership: "private"
            }
        });
        console.log(`\n🏢 Private schools: ${privateSchools}`);

        // Check boarding schools
        const boardingSchools = await prisma.school.count({
            where: {
                boarding_available: true
            }
        });
        console.log(`\n🛏️  Boarding schools: ${boardingSchools}`);

        // Check private + boarding + approved
        const privateBoardingApproved = await prisma.school.count({
            where: {
                verification_status: "approved",
                ownership: "private",
                boarding_available: true
            }
        });
        console.log(`\n🎯 Private + Boarding + Approved: ${privateBoardingApproved}`);

        // Show sample approved schools
        const sampleApproved = await prisma.school.findMany({
            where: {
                verification_status: "approved"
            },
            include: {
                region: true
            },
            take: 3
        });
        console.log(`\n📋 Sample approved schools:`);
        sampleApproved.forEach(school => {
            console.log(`   - ${school.name}`);
            console.log(`     Region: ${school.region?.name}`);
            console.log(`     Ownership: ${school.ownership}`);
            console.log(`     Boarding: ${school.boarding_available}`);
            console.log(`     Address: ${school.address}`);
        });

        // Test the actual query
        console.log(`\n${"=".repeat(80)}`);
        console.log("Testing actual search query filters:");
        console.log("=".repeat(80));
        
        const testQuery = await prisma.school.findMany({
            where: {
                verification_status: "approved",
                ownership: "private",
                boarding_available: true,
                region: {
                    name: {
                        contains: "Centre",
                        mode: "insensitive"
                    }
                }
            },
            include: {
                region: true
            },
            take: 10
        });
        
        console.log(`\n🔍 Query: private + boarding + approved + Centre region`);
        console.log(`   Results: ${testQuery.length}`);
        testQuery.forEach(school => {
            console.log(`   - ${school.name} (${school.region?.name})`);
        });

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

debugSearch();