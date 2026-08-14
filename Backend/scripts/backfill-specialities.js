// Backfills Speciality rows + ProgramSpeciality links for all existing programs.
// Derives specialities from the program's department name (university programs)
// or the subject embedded in the program name (direct HND/technical programs).
// Idempotent — safe to run any number of times.
//
// Usage: node scripts/backfill-specialities.js
import { prismaClient } from "../src/lib/database.js";
import { specialityNamesForProgram, linkSpecialities } from "../src/lib/specialities.js";

async function main() {
  const programs = await prismaClient.program.findMany({
    select: { id: true, name: true, department: { select: { name: true } } },
  });

  let linked = 0;
  let without = 0;
  const names = new Set();

  for (const program of programs) {
    const specialities = specialityNamesForProgram(program);
    if (specialities.length === 0) {
      without += 1;
      continue;
    }
    await linkSpecialities(prismaClient, program.id, specialities);
    specialities.forEach((name) => names.add(name));
    linked += 1;
  }

  console.log(
    JSON.stringify(
      {
        programs: programs.length,
        linked,
        withoutSpeciality: without,
        distinctSpecialities: [...names].sort(),
        specialityCount: names.size,
      },
      null,
      2
    )
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prismaClient.$disconnect());
