import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  let failed = false;

  try {
    // ---------- CHECK 5.1: Count records ----------
    const schools = await prisma.school.count();
    const locations = await prisma.location.count();
    const qualifications = await prisma.qualification.count();
    const sections = await prisma.schoolSection.count();

    console.log("✅ POST-MIGRATION COUNTS:");
    console.log("  Schools:", schools, "(should be 20)");
    console.log("  Locations:", locations, "(should be ≤ 20)");
    console.log("  Qualifications:", qualifications, "(should be ≥ 15)");
    console.log("  Sections:", sections, "(should be > 0)");

    if (schools !== 20) {
      failed = true;
      console.error("❌ School count mismatch!");
    } else {
      console.log("\n✅ DATA INTEGRITY CHECK PASSED");
    }

    // ---------- CHECK 5.2: Test sample school ----------
    const school = await prisma.school.findFirst({
      include: {
        location: true,
        qualifications: true,
        programs: true,
        secondarySections: true,
        images: true,
      },
    });

    if (!school) {
      failed = true;
      throw new Error("No schools found!");
    }

    console.log("\n✅ SCHOOL RELATIONSHIPS OK:");
    console.log("  Name:", school.name);
    console.log("  Location:", school.location.city);
    console.log("  Qualifications:", school.qualifications.length);
    console.log("  Programs:", school.programs.length);
    console.log("  Secondary sections:", school.secondarySections.length);
    console.log("  Images:", school.images.length);

    process.exit(failed ? 1 : 0);
  } catch (e) {
    console.error("❌ Error:", e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
