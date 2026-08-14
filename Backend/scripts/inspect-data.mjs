import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();
try {
  const programs = await p.program.findMany({ select: { id: true, name: true, schoolId: true, departmentId: true }, orderBy: { name: "asc" } });
  console.log("=== PROGRAMS:", programs.length);
  for (const pr of programs) console.log(`${pr.name} | school=${pr.schoolId ? "direct" : "via-dept"}`);

  const depts = await p.department.findMany({ select: { id: true, name: true, facultyId: true }, orderBy: { name: "asc" } });
  console.log("\n=== DEPARTMENTS:", depts.length);
  for (const d of depts) console.log(d.name);

  const faculties = await p.faculty.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  console.log("\n=== FACULTIES:", faculties.length);
  for (const f of faculties) console.log(f.name);

  const regions = await p.location.findMany({ distinct: ["region"], select: { region: true }, orderBy: { region: "asc" } });
  console.log("\n=== REGIONS:", JSON.stringify(regions.map((r) => r.region)));

  const quals = await p.qualification.findMany({ select: { id: true, name: true, field: true, type: true }, orderBy: { name: "asc" } });
  console.log("\n=== QUALIFICATIONS:", quals.length);
  for (const q of quals) console.log(`${q.name} | field=${q.field} | type=${q.type}`);
} finally {
  await p.$disconnect();
}
