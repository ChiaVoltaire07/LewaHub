import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

const institutions = [
 
  {
    name: "University of Yaoundé I",
    type: "University",
    description: "The oldest and largest university in Cameroon, offering comprehensive academic programs.",
    region: "Centre",
    city: "Yaoundé",
    address: "Avenue Kennedy, Ngoa-Ekellé",
    latitude: 3.848,
    longitude: 11.502,
    website: "https://www.uy1.uninet.cm",
    imageUrl: "https://unsplash.com/photos/graduates-in-caps-and-gowns-tossing-hats-in-the-air-w-T1VDxb6io",
    contactEmail: "info@uy1.uninet.cm",
    contactPhone: "+237 222 22 22 22",
    verified: true,
    programs: [
      { name: "Computer Science", level: "Bachelor", duration: "3 years", tuition: 250000 },
      { name: "Medicine", level: "Doctorate", duration: "7 years", tuition: 500000 },
      { name: "Law", level: "Bachelor", duration: "4 years", tuition: 200000 },
    ],
  },
  {
    name: "University of Buea",
    type: "University",
    description: "The bilingual university of Cameroon, known for liberal arts and teacher education.",
    region: "Southwest",
    city: "Buea",
    address: "P.O. Box 63, Buea",
    latitude: 4.1516,
    longitude: 9.2441,
    website: "https://www.ubuea.cm",
    imageUrl: "https://via.placeholder.com/400x300?text=University+of+Buea",
    contactEmail: "info@ubuea.cm",
    contactPhone: "+237 333 33 33 33",
    verified: true,
    programs: [
      { name: "English", level: "Bachelor", duration: "3 years", tuition: 220000 },
      { name: "French", level: "Bachelor", duration: "3 years", tuition: 220000 },
      { name: "Teacher Education", level: "Bachelor", duration: "4 years", tuition: 180000 },
    ],
  },
  {
    name: "University of Douala",
    type: "University",
    description: "Located in Cameroon's economic capital, focused on commerce and technology.",
    region: "Littoral",
    city: "Douala",
    address: "BP 24157, Douala",
    latitude: 4.051,
    longitude: 9.708,
    website: "https://www.univ-douala.cm",
    imageUrl: "https://via.placeholder.com/400x300?text=University+of+Douala",
    contactEmail: "info@univ-douala.cm",
    contactPhone: "+237 444 44 44 44",
    verified: true,
    programs: [
      { name: "Business Administration", level: "Bachelor", duration: "3 years", tuition: 280000 },
      { name: "Economics", level: "Bachelor", duration: "3 years", tuition: 250000 },
    ],
  },
  {
    name: "University of Ngaoundéré",
    type: "University",
    description: "Regional university serving the northern regions of Cameroon.",
    region: "Adamawa",
    city: "Ngaoundéré",
    address: "BP 454, Ngaoundéré",
    latitude: 3.8667,
    longitude: 13.5833,
    website: "https://www.univ-ngaoundere.cm",
    imageUrl: "https://via.placeholder.com/400x300?text=University+of+Ngaoundere",
    contactEmail: "info@univ-ngaoundere.cm",
    contactPhone: "+237 555 55 55 55",
    verified: true,
    programs: [
      { name: "Agricultural Science", level: "Bachelor", duration: "4 years", tuition: 200000 },
      { name: "Animal Science", level: "Bachelor", duration: "4 years", tuition: 200000 },
    ],
  },
  {
    name: "University of Dschang",
    type: "University",
    description: "Specializes in agriculture, technology, and natural sciences.",
    region: "West",
    city: "Dschang",
    address: "BP 96, Dschang",
    latitude: 5.4531,
    longitude: 10.4039,
    website: "https://www.univ-dschang.cm",
    imageUrl: "https://via.placeholder.com/400x300?text=University+of+Dschang",
    contactEmail: "info@univ-dschang.cm",
    contactPhone: "+237 666 66 66 66",
    verified: true,
    programs: [
      { name: "Agronomy", level: "Bachelor", duration: "4 years", tuition: 220000 },
      { name: "Civil Engineering", level: "Bachelor", duration: "4 years", tuition: 300000 },
    ],
  },
  {
    name: "University of Yaoundé II",
    type: "University",
    description: "Specialized in social sciences, law, and humanities.",
    region: "Centre",
    city: "Yaoundé",
    address: "BP 18, Yaoundé",
    latitude: 3.8667,
    longitude: 11.5167,
    website: "https://www.uy2.uninet.cm",
    imageUrl: "https://via.placeholder.com/400x300?text=University+of+Yaounde+II",
    contactEmail: "info@uy2.uninet.cm",
    contactPhone: "+237 777 77 77 77",
    verified: true,
    programs: [
      { name: "Political Science", level: "Bachelor", duration: "3 years", tuition: 200000 },
      { name: "Sociology", level: "Bachelor", duration: "3 years", tuition: 200000 },
    ],
  },
  {
    name: "ENSET Douala",
    type: "University",
    description: "National School of Engineering specializing in technical education.",
    region: "Littoral",
    city: "Douala",
    address: "BP 8698, Douala",
    latitude: 4.0589,
    longitude: 9.7119,
    website: "https://www.enset-douala.cm",
    imageUrl: "https://via.placeholder.com/400x300?text=ENSET+Douala",
    contactEmail: "info@enset-douala.cm",
    contactPhone: "+237 888 88 88 88",
    verified: true,
    programs: [
      { name: "Mechanical Engineering", level: "Bachelor", duration: "4 years", tuition: 350000 },
      { name: "Electrical Engineering", level: "Bachelor", duration: "4 years", tuition: 350000 },
    ],
  },
  {
    name: "ENSET Bambili",
    type: "University",
    description: "Engineering school in the Northwest region focusing on practical training.",
    region: "Northwest",
    city: "Bambili",
    address: "BP 39, Bambili",
    latitude: 5.96,
    longitude: 10.38,
    website: "https://www.enset-bambili.cm",
    imageUrl: "https://via.placeholder.com/400x300?text=ENSET+Bambili",
    contactEmail: "info@enset-bambili.cm",
    contactPhone: "+237 999 99 99 99",
    verified: true,
    programs: [
      { name: "Construction Engineering", level: "Bachelor", duration: "4 years", tuition: 320000 },
      { name: "Mining Engineering", level: "Bachelor", duration: "4 years", tuition: 320000 },
    ],
  },
  {
    name: "Catholic University of Cameroon",
    type: "University",
    description: "Private university with emphasis on liberal arts and professional studies.",
    region: "Centre",
    city: "Yaoundé",
    address: "BP 1597, Yaoundé",
    latitude: 3.9,
    longitude: 11.48,
    website: "https://www.catuc.cm",
    imageUrl: "https://via.placeholder.com/400x300?text=Catholic+University",
    contactEmail: "info@catuc.cm",
    contactPhone: "+237 1 1 1 1 1 11",
    verified: true,
    programs: [
      { name: "Business", level: "Bachelor", duration: "3 years", tuition: 400000 },
      { name: "Philosophy", level: "Bachelor", duration: "3 years", tuition: 350000 },
    ],
  },
  {
    name: "Pan-African University of Science, Technology & Innovation",
    type: "University",
    description: "International university promoting pan-African cooperation in STEM.",
    region: "Centre",
    city: "Yaoundé",
    address: "BP 6923, Yaoundé",
    latitude: 3.8667,
    longitude: 11.5333,
    website: "https://www.pausti.org",
    imageUrl: "https://via.placeholder.com/400x300?text=PAUSTI",
    contactEmail: "info@pausti.org",
    contactPhone: "+237 2 2 2 2 2 22",
    verified: true,
    programs: [
      { name: "Biotechnology", level: "Master", duration: "2 years", tuition: 500000 },
      { name: "Climate Science", level: "Master", duration: "2 years", tuition: 500000 },
    ],
  },

  // Primary Schools (5)
  {
    name: "Lycée Général Leclerc",
    type: "School",
    description: "Premier secondary school in Yaoundé, established during colonial period.",
    region: "Centre",
    city: "Yaoundé",
    address: "Rue Fabien Eboué",
    latitude: 3.8574,
    longitude: 11.5181,
    website: "https://www.lyceegl.cm",
    imageUrl: "https://via.placeholder.com/400x300?text=Lycee+Leclerc",
    contactEmail: "info@lyceegl.cm",
    contactPhone: "+237 3 3 3 3 3 33",
    verified: true,
    programs: [
      { name: "Advanced Level", level: "Secondary", duration: "2 years", tuition: 150000 },
      { name: "O'Level", level: "Secondary", duration: "4 years", tuition: 120000 },
    ],
  },
  {
    name: "Collège Voltaire",
    type: "School",
    description: "Bilingual secondary school known for academic excellence.",
    region: "Littoral",
    city: "Douala",
    address: "Rue de Kotto, Akwa",
    latitude: 4.0511,
    longitude: 9.7679,
    website: "https://www.collegevoltaire.cm",
    imageUrl: "https://via.placeholder.com/400x300?text=College+Voltaire",
    contactEmail: "info@collegevoltaire.cm",
    contactPhone: "+237 4 4 4 4 4 44",
    verified: true,
    programs: [
      { name: "Science Track", level: "Secondary", duration: "2 years", tuition: 160000 },
      { name: "Arts Track", level: "Secondary", duration: "2 years", tuition: 140000 },
    ],
  },
  {
    name: "Presbyterian Secondary School Kumba",
    type: "School",
    description: "Mission school with long tradition of academic and religious education.",
    region: "Southwest",
    city: "Kumba",
    address: "Church Road",
    latitude: 4.636,
    longitude: 9.447,
    website: "https://www.pressbkumba.cm",
    imageUrl: "https://via.placeholder.com/400x300?text=Presbyterian+Kumba",
    contactEmail: "info@pressbkumba.cm",
    contactPhone: "+237 5 5 5 5 5 55",
    verified: false,
    programs: [
      { name: "General Education", level: "Secondary", duration: "6 years", tuition: 100000 },
    ],
  },
  {
    name: "Cameroon College of Education, Kumba",
    type: "School",
    description: "Teachers' college providing secondary education and teacher training.",
    region: "Southwest",
    city: "Kumba",
    address: "P.O. Box 10, Kumba",
    latitude: 4.6406,
    longitude: 9.4469,
    website: "https://www.ccedk.cm",
    imageUrl: "https://via.placeholder.com/400x300?text=CCE+Kumba",
    contactEmail: "info@ccedk.cm",
    contactPhone: "+237 6 6 6 6 6 66",
    verified: false,
    programs: [
      { name: "Teacher Training", level: "Secondary", duration: "3 years", tuition: 110000 },
    ],
  },
  {
    name: "GHS Bamenda",
    type: "School",
    description: "Government secondary school serving Northwest region.",
    region: "Northwest",
    city: "Bamenda",
    address: "Commercial Avenue",
    latitude: 5.9631,
    longitude: 10.1591,
    website: "https://www.ghsbamenda.cm",
    imageUrl: "https://via.placeholder.com/400x300?text=GHS+Bamenda",
    contactEmail: "info@ghsbamenda.cm",
    contactPhone: "+237 7 7 7 7 7 77",
    verified: false,
    programs: [
      { name: "Secondary Education", level: "Secondary", duration: "6 years", tuition: 90000 },
    ],
  },
  
  {
    name: "École Maternelle Étoile",
    type: "School",
    description: "Nursery school in Garoua known for a play-based early learning approach.",
    region: "North",
    city: "Garoua",
    address: "Quartier Plateau, Garoua",
    latitude: 9.3017,
    longitude: 13.3921,
    website: null,
    imageUrl: "https://via.placeholder.com/400x300?text=Ecole+Maternelle+Etoile",
    contactEmail: "info@etoilenursery.cm",
    contactPhone: "+237 6 9 9 9 9 99",
    verified: true,
    programs: [
      { name: "Nursery Program", level: "Nursery", duration: "2 years", tuition: 60000 },
    ],
  },
  {
    name: "Government Primary School Bertoua",
    type: "School",
    description: "Public primary school serving the East region's capital city.",
    region: "East",
    city: "Bertoua",
    address: "Avenue de l'Indépendance, Bertoua",
    latitude: 4.5767,
    longitude: 13.6846,
    website: null,
    imageUrl: "https://via.placeholder.com/400x300?text=GPS+Bertoua",
    contactEmail: "info@gpsbertoua.cm",
    contactPhone: "+237 6 8 8 8 8 88",
    verified: false,
    programs: [
      { name: "Primary Education", level: "Primary", duration: "6 years", tuition: 40000 },
    ],
  },
  {
    name: "Government Bilingual Primary School Maroua",
    type: "School",
    description: "Public bilingual primary school in the Far North, teaching both French and English streams.",
    region: "Far North",
    city: "Maroua",
    address: "Quartier Domayo, Maroua",
    latitude: 10.591,
    longitude: 14.3159,
    website: null,
    imageUrl: "https://via.placeholder.com/400x300?text=GBPS+Maroua",
    contactEmail: "info@gbpsmaroua.cm",
    contactPhone: "+237 6 7 7 7 7 77",
    verified: false,
    programs: [
      { name: "Bilingual Primary Education", level: "Primary", duration: "6 years", tuition: 45000 },
    ],
  },
  {
    name: "Sacred Heart Primary School Ebolowa",
    type: "School",
    description: "Mission-run primary school in the South region with a strong local reputation.",
    region: "South",
    city: "Ebolowa",
    address: "Rue de la Mission, Ebolowa",
    latitude: 2.9,
    longitude: 11.15,
    website: null,
    imageUrl: "https://via.placeholder.com/400x300?text=Sacred+Heart+Ebolowa",
    contactEmail: "info@sacredheartebolowa.cm",
    contactPhone: "+237 6 6 5 5 5 55",
    verified: true,
    programs: [
      { name: "Primary Education", level: "Primary", duration: "6 years", tuition: 70000 },
    ],
  },

  // Additional Secondary School (1)
  {
    name: "Lycée Bilingue de Bafoussam",
    type: "School",
    description: "Public bilingual secondary school serving the West region's capital.",
    region: "West",
    city: "Bafoussam",
    address: "Avenue du 20 Mai, Bafoussam",
    latitude: 5.4737,
    longitude: 10.4176,
    website: null,
    imageUrl: "https://via.placeholder.com/400x300?text=Lycee+Bafoussam",
    contactEmail: "info@lyceebafoussam.cm",
    contactPhone: "+237 6 5 4 4 4 44",
    verified: true,
    programs: [
      { name: "O'Level", level: "Secondary", duration: "4 years", tuition: 100000 },
      { name: "Advanced Level", level: "Secondary", duration: "2 years", tuition: 130000 },
    ],
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  try {
    // Clear existing data
    await prisma.evaluation.deleteMany({});
    await prisma.program.deleteMany({});
    await prisma.institution.deleteMany({});
    await prisma.adminUser.deleteMany({});
    await prisma.verificationToken.deleteMany({});

    console.log("✓ Cleared existing data");

    // Create admin user
    const hashedPassword = await bcryptjs.hash("admin123", 10);
    const admin = await prisma.adminUser.create({
      data: {
        email: "admin@lewahub.com",
        password: hashedPassword,
        name: "LewaHub Admin",
      },
    });
    console.log(`✓ Created admin user: ${admin.email}`);

    // Create institutions with programs
    for (const instData of institutions) {
      const { programs, ...instFields } = instData;
      const institution = await prisma.institution.create({
        data: {
          ...instFields,
          programs: {
            create: programs || [],
          },
        },
        include: { programs: true },
      });
      console.log(`✓ Created institution: ${institution.name} (${institution.type})`);
    }

    console.log("\n✅ Seed completed successfully!");
    console.log(`Total institutions: ${institutions.length}`);
    console.log("Database ready for use.\n");
  } catch (e) {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
