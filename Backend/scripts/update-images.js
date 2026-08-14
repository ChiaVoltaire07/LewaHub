/**
 * One-off helper: back-fills `imageUrl` on School rows that have a null or
 * outdated image. Safe to re-run — it skips rows whose image is already correct.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Curated Unsplash image URLs for each school
const imageMap = {
  "University of Yaoundé I": "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop",
  "University of Buea": "https://images.unsplash.com/photo-1592280771190-2e4e8a1d33b3?w=600&h=400&fit=crop",
  "University of Douala": "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop",
  "University of Ngaoundéré": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop",
  "University of Dschang": "https://images.unsplash.com/photo-1607237138827-5a4e7f0c0e0b?w=600&h=400&fit=crop",
  "University of Yaoundé II": "https://images.unsplash.com/photo-1523050854058-8df90110c3c9?w=600&h=400&fit=crop",
  "ENSET Douala": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
  "ENSET Bambili": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop",
  "Catholic University of Cameroon": "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=600&h=400&fit=crop",
  "Pan-African University of Science, Technology & Innovation": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop",
  "Lycée Général Leclerc": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop",
  "Collège Voltaire": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
  "Presbyterian Secondary School Kumba": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
  "Cameroon College of Education, Kumba": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
  "GHS Bamenda": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
  "Lycée Bilingue de Bafoussam": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
  "École Maternelle Étoile": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop",
  "Petite Enfantine Camerounaise": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop",
  "Bright Beginnings Nursery School": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop",
  "Government Primary School Bertoua": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
  "Government Bilingual Primary School Maroua": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
  "Sacred Heart Primary School Ebolowa": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
};

async function main() {
  const schools = await prisma.school.findMany({
    select: { id: true, name: true, imageUrl: true },
  });

  for (const school of schools) {
    const newImage = imageMap[school.name];
    if (newImage && school.imageUrl !== newImage) {
      await prisma.school.update({
        where: { id: school.id },
        data: { imageUrl: newImage },
      });
      console.log(`✓ Updated image for: ${school.name}`);
    } else if (!newImage) {
      console.log(`⚠ No image mapping for: ${school.name}`);
    } else {
      console.log(`- Already correct: ${school.name}`);
    }
  }

  console.log("\n✅ Image update complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
