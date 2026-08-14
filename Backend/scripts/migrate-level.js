/**
 * One-off helper: back-fills the `category` field on School rows that were
 * created before the 3-category model was introduced.
 *
 * Safe to re-run — it is idempotent (update is a no-op when the value
 * is already correct).
 *
 * Old values "Primary" / "Nursery" are mapped to "PrimaryNursery".
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categoryMap = {
  "University of Yaoundé I": "University",
  "University of Buea": "University",
  "University of Douala": "University",
  "University of Ngaoundéré": "University",
  "University of Dschang": "University",
  "University of Yaoundé II": "University",
  "ENSET Douala": "University",
  "ENSET Bambili": "University",
  "Catholic University of Cameroon": "University",
  "Pan-African University of Science, Technology & Innovation": "University",
  "Lycée Général Leclerc": "Secondary",
  "Collège Voltaire": "Secondary",
  "Presbyterian Secondary School Kumba": "Secondary",
  "Cameroon College of Education, Kumba": "Secondary",
  "GHS Bamenda": "Secondary",
  "Lycée Bilingue de Bafoussam": "Secondary",
  "École Maternelle Étoile": "PrimaryNursery",
  "Petite Enfantine Camerounaise": "PrimaryNursery",
  "Bright Beginnings Nursery School": "PrimaryNursery",
  "Government Primary School Bertoua": "PrimaryNursery",
  "Government Bilingual Primary School Maroua": "PrimaryNursery",
  "Sacred Heart Primary School Ebolowa": "PrimaryNursery",
};

async function main() {
  const schools = await prisma.school.findMany({
    select: { id: true, name: true },
  });

  for (const school of schools) {
    const category = categoryMap[school.name];
    if (category) {
      await prisma.school.update({
        where: { id: school.id },
        data: { category },
      });
      console.log(`Updated ${school.name} -> ${category}`);
    } else {
      console.log(`No explicit mapping for: ${school.name}`);
    }
  }

  console.log("\nMigration complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
