import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const schools = await prisma.school.count();
    const programs = await prisma.program.count();
    const images = await prisma.schoolImage.count();
    const fees = await prisma.schoolFee?.count?.() || 0;
    const facilities = await prisma.schoolFacility?.count?.() || 0;
    const sections = await prisma.schoolSection?.count?.() || 0;
    const sources = await prisma.schoolSource?.count?.() || 0;
    const identifiers = await prisma.institutionIdentifier?.count?.() || 0;
    
    console.log("=== RECORD COUNTS ===");
    console.log("Schools:", schools);
    console.log("Programs:", programs);
    console.log("Images:", images);
    console.log("SchoolFee:", fees);
    console.log("SchoolFacility:", facilities);
    console.log("SchoolSection:", sections);
    console.log("SchoolSource:", sources);
    console.log("InstitutionIdentifier:", identifiers);
    
    console.log("\n✅ All records counted successfully");
    process.exit(0);
  } catch (e) {
    console.error("❌ Count failed:", e.message);
    process.exit(1);
  }
}

main();
