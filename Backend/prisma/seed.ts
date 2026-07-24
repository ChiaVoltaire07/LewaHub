import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.program.deleteMany();
  await prisma.institution.deleteMany();

  const uy = await prisma.institution.create({
    data: {
      name: 'University of Yaoundé I',
      region: 'Centre',
      type: 'University',
      description: 'Public university in Yaoundé.',
      lat: 3.8667,
      lng: 11.5167,
      verified: true,
    },
  });

  await prisma.program.createMany({
    data: [
      {
        institutionId: uy.id,
        name: 'Computer Science',
        degreeLevel: 'Bachelor',
        durationMonths: 36,
        tuition: 50000,
        currency: 'XAF',
      },
      {
        institutionId: uy.id,
        name: 'Law',
        degreeLevel: 'Bachelor',
        durationMonths: 48,
        tuition: 60000,
        currency: 'XAF',
      },
    ],
  });

  const iut = await prisma.institution.create({
    data: {
      name: 'IUT Douala',
      region: 'Littoral',
      type: 'Institute of Technology',
      description: 'Technical training institute in Douala.',
      lat: 4.0511,
      lng: 9.7679,
      verified: true,
    },
  });

  await prisma.program.create({
    data: {
      institutionId: iut.id,
      name: 'Electrical Engineering',
      degreeLevel: 'Diploma',
      durationMonths: 24,
      tuition: 35000,
      currency: 'XAF',
    },
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
