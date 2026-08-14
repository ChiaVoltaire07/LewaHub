// Helpers for deriving a program's "speciality" (subject/field of study).
//
// Specialities are never fabricated: they come from the department a program
// belongs to (universities) or from the subject embedded in the program name
// (technical/HND programs attached directly to a school). Secondary-level
// school-leaving programs (GCE/BEPC/Baccalauréat) carry no speciality.

const SCHOOL_LEAVING = /GCE Ordinary Level|GCE Advanced Level|BEPC|Probatoire|FSLC|Baccalaur/iu;

// "Higher National Diploma in Computer Science" -> "Computer Science"
// "Bachelor of Engineering in Electrical Engineering" -> "Electrical Engineering"
// "Bachelor of Science in Software Engineering" -> "Software Engineering"
const SUBJECT_AFTER_IN = /\bin\s+([^\s(][^(]*)$/iu;

export function extractSpecialityFromProgramName(name) {
  if (!name || typeof name !== "string") return null;
  if (SCHOOL_LEAVING.test(name)) return null;

  const match = name.match(SUBJECT_AFTER_IN);
  if (match) {
    const subject = match[1].trim();
    if (subject.length > 0) return subject;
  }

  // "State Registered Nurse (Diploma)" -> "Nursing"
  if (/\bnurse\b/i.test(name)) return "Nursing";

  return null;
}

/**
 * Returns the speciality names a program represents. `program` accepts either
 * a Prisma row (`{ name, department: { name } }`) or a seed entry
 * (`{ name, department: "Computer Science" }`).
 */
export function specialityNamesForProgram(program) {
  const names = new Set();
  const departmentName =
    program.department?.name ?? (typeof program.department === "string" ? program.department : null);
  if (departmentName && departmentName.trim()) {
    names.add(departmentName.trim());
  }
  const extracted = extractSpecialityFromProgramName(program.name);
  if (extracted) names.add(extracted);
  return [...names];
}

/**
 * Creates any missing Speciality rows and links them to the program.
 * Idempotent and safe to call for every program on every seed.
 */
export async function linkSpecialities(prisma, programId, names) {
  for (const name of names ?? []) {
    const speciality = await prisma.speciality.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    await prisma.programSpeciality.upsert({
      where: { programId_specialityId: { programId, specialityId: speciality.id } },
      update: {},
      create: { programId, specialityId: speciality.id },
    });
  }
}
