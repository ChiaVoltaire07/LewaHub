import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

const institutions = [
  {
    name: "University of Yaoundé I",
    type: "University",
    level: "University",
    description:
      "Founded in 1962, the University of Yaoundé I is Cameroon's oldest and largest university. It serves over 40,000 students across faculties including Sciences, Arts & Humanities, Medicine, Law, and Economics. The main campus at Ngoa-Ekellé houses the prestigious Faculty of Medicine and Biomedical Sciences, the Faculty of Science, and the National Advanced School of Engineering (ENSPY). Known for its research output in tropical medicine and computer science, it consistently ranks among the top universities in Central Africa.",
    region: "Centre",
    city: "Yaoundé",
    address: "Avenue Kennedy, Ngoa-Ekellé",
    latitude: 3.848,
    longitude: 11.502,
    website: "https://www.uy1.uninet.cm",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop",
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
    level: "University",
    description:
      "Founded in 1992, the University of Buea is Cameroon's only English-speaking university located on the slopes of Mount Cameroon. It serves approximately 20,000 students across faculties including Arts, Education, Health Sciences, Science, and Social & Management Sciences. The university is particularly renowned for its Faculty of Health Sciences, which produces a significant portion of Cameroon's medical professionals, and its teacher education programs through the Advanced School of Translators and Interpreters (ASTI).",
    region: "Southwest",
    city: "Buea",
    address: "P.O. Box 63, Buea",
    latitude: 4.1516,
    longitude: 9.2441,
    website: "https://www.ubuea.cm",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-2e4e8a1d33b3?w=600&h=400&fit=crop",
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
    level: "University",
    description: "Located in Cameroon's economic capital, focused on commerce and technology.",
    region: "Littoral",
    city: "Douala",
    address: "BP 24157, Douala",
    latitude: 4.051,
    longitude: 9.708,
    website: "https://www.univ-douala.cm",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop",
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
    level: "University",
    description: "Regional university serving the northern regions of Cameroon.",
    region: "Adamawa",
    city: "Ngaoundéré",
    address: "BP 454, Ngaoundéré",
    latitude: 3.8667,
    longitude: 13.5833,
    website: "https://www.univ-ngaoundere.cm",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop",
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
    level: "University",
    description: "Specializes in agriculture, technology, and natural sciences.",
    region: "West",
    city: "Dschang",
    address: "BP 96, Dschang",
    latitude: 5.4531,
    longitude: 10.4039,
    website: "https://www.univ-dschang.cm",
    imageUrl: "https://images.unsplash.com/photo-1607237138827-5a4e7f0c0e0b?w=600&h=400&fit=crop",
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
    level: "University",
    description: "Specialized in social sciences, law, and humanities.",
    region: "Centre",
    city: "Yaoundé",
    address: "BP 18, Yaoundé",
    latitude: 3.8667,
    longitude: 11.5167,
    website: "https://www.uy2.uninet.cm",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c3c9?w=600&h=400&fit=crop",
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
    level: "University",
    description: "National School of Engineering specializing in technical education.",
    region: "Littoral",
    city: "Douala",
    address: "BP 8698, Douala",
    latitude: 4.0589,
    longitude: 9.7119,
    website: "https://www.enset-douala.cm",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
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
    level: "University",
    description: "Engineering school in the Northwest region focusing on practical training.",
    region: "Northwest",
    city: "Bambili",
    address: "BP 39, Bambili",
    latitude: 5.96,
    longitude: 10.38,
    website: "https://www.enset-bambili.cm",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop",
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
    level: "University",
    description: "Private university with emphasis on liberal arts and professional studies.",
    region: "Centre",
    city: "Yaoundé",
    address: "BP 1597, Yaoundé",
    latitude: 3.9,
    longitude: 11.48,
    website: "https://www.catuc.cm",
    imageUrl: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=600&h=400&fit=crop",
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
    level: "University",
    description: "International university promoting pan-African cooperation in STEM.",
    region: "Centre",
    city: "Yaoundé",
    address: "BP 6923, Yaoundé",
    latitude: 3.8667,
    longitude: 11.5333,
    website: "https://www.pausti.org",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop",
    contactEmail: "info@pausti.org",
    contactPhone: "+237 2 2 2 2 2 22",
    verified: true,
    programs: [
      { name: "Biotechnology", level: "Master", duration: "2 years", tuition: 500000 },
      { name: "Climate Science", level: "Master", duration: "2 years", tuition: 500000 },
    ],
  },

  // Secondary Schools (6)
  {
    name: "Lycée Général Leclerc",
    type: "School",
    level: "Secondary",
    description: "Premier secondary school in Yaoundé, established during colonial period.",
    region: "Centre",
    city: "Yaoundé",
    address: "Rue Fabien Eboué",
    latitude: 3.8574,
    longitude: 11.5181,
    website: "https://www.lyceegl.cm",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop",
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
    level: "Secondary",
    description: "Bilingual secondary school known for academic excellence.",
    region: "Littoral",
    city: "Douala",
    address: "Rue de Kotto, Akwa",
    latitude: 4.0511,
    longitude: 9.7679,
    website: "https://www.collegevoltaire.cm",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
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
    level: "Secondary",
    description: "Mission school with long tradition of academic and religious education.",
    region: "Southwest",
    city: "Kumba",
    address: "Church Road",
    latitude: 4.636,
    longitude: 9.447,
    website: "https://www.pressbkumba.cm",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
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
    level: "Secondary",
    description: "Teachers' college providing secondary education and teacher training.",
    region: "Southwest",
    city: "Kumba",
    address: "P.O. Box 10, Kumba",
    latitude: 4.6406,
    longitude: 9.4469,
    website: "https://www.ccedk.cm",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
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
    level: "Secondary",
    description: "Government secondary school serving Northwest region.",
    region: "Northwest",
    city: "Bamenda",
    address: "Commercial Avenue",
    latitude: 5.9631,
    longitude: 10.1591,
    website: "https://www.ghsbamenda.cm",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
    contactEmail: "info@ghsbamenda.cm",
    contactPhone: "+237 7 7 7 7 7 77",
    verified: false,
    programs: [
      { name: "Secondary Education", level: "Secondary", duration: "6 years", tuition: 90000 },
    ],
  },
  {
    name: "Lycée Bilingue de Bafoussam",
    type: "School",
    level: "Secondary",
    description: "Public bilingual secondary school serving the West region's capital.",
    region: "West",
    city: "Bafoussam",
    address: "Avenue du 20 Mai, Bafoussam",
    latitude: 5.4737,
    longitude: 10.4176,
    website: null,
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
    contactEmail: "info@lyceebafoussam.cm",
    contactPhone: "+237 6 5 4 4 4 44",
    verified: true,
    programs: [
      { name: "O'Level", level: "Secondary", duration: "4 years", tuition: 100000 },
      { name: "Advanced Level", level: "Secondary", duration: "2 years", tuition: 130000 },
    ],
  },

  // Nursery Schools (3)
  {
    name: "École Maternelle Étoile",
    type: "School",
    level: "Nursery",
    description: "Nursery school in Garoua known for a play-based early learning approach.",
    region: "North",
    city: "Garoua",
    address: "Quartier Plateau, Garoua",
    latitude: 9.3017,
    longitude: 13.3921,
    website: null,
    imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop",
    contactEmail: "info@etoilenursery.cm",
    contactPhone: "+237 6 9 9 9 9 99",
    verified: true,
    programs: [
      { name: "Nursery Program", level: "Nursery", duration: "2 years", tuition: 60000 },
    ],
  },
  {
    name: "Petite Enfantine Camerounaise",
    type: "School",
    level: "Nursery",
    description: "Private nursery offering bilingual early childhood education.",
    region: "Centre",
    city: "Yaoundé",
    address: "Quartier Bastos, Yaoundé",
    latitude: 3.876,
    longitude: 11.515,
    website: null,
    imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop",
    contactEmail: "info@pecamerounaise.cm",
    contactPhone: "+237 6 6 6 6 6 66",
    verified: true,
    programs: [
      { name: "Pre-Nursery", level: "Nursery", duration: "1 year", tuition: 50000 },
      { name: "Nursery", level: "Nursery", duration: "2 years", tuition: 55000 },
    ],
  },
  {
    name: "Bright Beginnings Nursery School",
    type: "School",
    level: "Nursery",
    description: "Community nursery focused on foundational literacy and numeracy.",
    region: "Southwest",
    city: "Buea",
    address: "Molyko Avenue, Buea",
    latitude: 4.155,
    longitude: 9.232,
    website: null,
    imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop",
    contactEmail: "info@brightbeginningsbuea.cm",
    contactPhone: "+237 6 5 5 5 5 55",
    verified: false,
    programs: [
      { name: "Early Years", level: "Nursery", duration: "2 years", tuition: 45000 },
    ],
  },

  // Primary Schools (3)
  {
    name: "Government Primary School Bertoua",
    type: "School",
    level: "Primary",
    description: "Public primary school serving the East region's capital city.",
    region: "East",
    city: "Bertoua",
    address: "Avenue de l'Indépendance, Bertoua",
    latitude: 4.5767,
    longitude: 13.6846,
    website: null,
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
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
    level: "Primary",
    description: "Public bilingual primary school in the Far North, teaching both French and English streams.",
    region: "Far North",
    city: "Maroua",
    address: "Quartier Domayo, Maroua",
    latitude: 10.591,
    longitude: 14.3159,
    website: null,
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
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
    level: "Primary",
    description: "Mission-run primary school in the South region with a strong local reputation.",
    region: "South",
    city: "Ebolowa",
    address: "Rue de la Mission, Ebolowa",
    latitude: 2.9,
    longitude: 11.15,
    website: null,
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
    contactEmail: "info@sacredheartebolowa.cm",
    contactPhone: "+237 6 6 5 5 5 55",
    verified: true,
    programs: [
      { name: "Primary Education", level: "Primary", duration: "6 years", tuition: 70000 },
    ],
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  try {
    // Clear existing data
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