import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const levelMap = {
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
  "École Maternelle Étoile": "Nursery",
  "Government Primary School Bertoua": "Primary",
  "Government Bilingual Primary School Maroua": "Primary",
  "Sacred Heart Primary School Ebolowa": "Primary",
  "Lycée Bilingue de Bafoussam": "Secondary",
};

async function main() {
  const institutions = await prisma.institution.findMany({
    select: { id: true, name: true },
  });

  for (const inst of institutions) {
    const level = levelMap[inst.name];
    if (level) {
      await prisma.institution.update({
        where: { id: inst.id },
        data: { level },
      });
      console.log(`Updated ${inst.name} -> ${level}`);
    } else {
      console.log(`No explicit mapping for: ${inst.name}`);
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


