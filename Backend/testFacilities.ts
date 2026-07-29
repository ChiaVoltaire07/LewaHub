import prisma from "./src/lib/prisma";

async function checkFacilities() {
    console.log("=".repeat(80));
    console.log("CHECKING FACILITIES IN DATABASE");
    console.log("=".repeat(80));

    try {
        // Get all facilities
        const facilities = await prisma.facility.findMany();
        console.log(`\n📊 Total facilities: ${facilities.length}`);
        facilities.forEach(f => {
            console.log(`   - ${f.facility_id}: ${f.name}`);
        });

        // Get school-facility relationships
        const schoolFacilities = await prisma.school_facility.findMany({
            include: {
                facility: true,
                school: {
                    select: {
                        name: true
                    }
                }
            }
        });

        console.log(`\n🔗 School-Facility relationships: ${schoolFacilities.length}`);
        schoolFacilities.forEach(sf => {
            console.log(`   - ${sf.school.name} → ${sf.facility.name}`);
        });

        // Check specifically for "dormitory" or "boarding"
        console.log(`\n🔍 Searching for dormitory/boarding facilities:`);
        const dormitoryFacilities = await prisma.facility.findMany({
            where: {
                name: {
                    contains: "dormitory",
                    mode: "insensitive"
                }
            }
        });
        console.log(`   Facilities with "dormitory" in name: ${dormitoryFacilities.length}`);
        dormitoryFacilities.forEach(f => console.log(`      - ${f.name}`));

        const boardingFacilities = await prisma.facility.findMany({
            where: {
                name: {
                    contains: "boarding",
                    mode: "insensitive"
                }
            }
        });
        console.log(`   Facilities with "boarding" in name: ${boardingFacilities.length}`);
        boardingFacilities.forEach(f => console.log(`      - ${f.name}`));

        // Check what facilities the 2 matching schools have
        console.log(`\n🏫 Facilities for the 2 matching schools:`);
        const matchingSchools = await prisma.school.findMany({
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
                school_facility: {
                    include: {
                        facility: true
                    }
                }
            }
        });

        matchingSchools.forEach(school => {
            console.log(`\n   ${school.name}:`);
            if (school.school_facility && school.school_facility.length > 0) {
                school.school_facility.forEach(sf => {
                    console.log(`      - ${sf.facility.name}`);
                });
            } else {
                console.log(`      (No facilities listed)`);
            }
        });

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkFacilities();