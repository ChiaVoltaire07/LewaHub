import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// Seed the LewaHub database with the real Cameroon school dataset.
// v2 schema (PostgreSQL): normalized Location, levels/languages enums,
// Program requires qualificationId, verificationStatus replaces `verified`.
//
// Idempotent & non-destructive: schools are matched by name, existing
// verified records are preserved (description/verificationStatus/location
// are never clobbered), and nothing is deleted.
// ============================================================

const DEFAULT_SCHOOL_IMAGE =
  "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=500&fit=crop";

const CURRENT_ACADEMIC_YEAR = "2025/2026";

// Region names differ between French/English conventions in the DB.
// Match both spellings so we reuse existing Location rows instead of
// creating duplicates.
const REGION_ALIASES = {
  "North West": ["North West", "Northwest"],
  "South West": ["South West", "Southwest"],
  Adamaoua: ["Adamaoua", "Adamawa"],
};

// Doc names that map to existing DB records (same institution).
const SCHOOL_NAME_ALIASES = {
  "Gov't Bilingual High School Limbe": "Government Bilingual High School Limbe",
  "Presbyterian Secondary Mankon": "Presbyterian Boys' Secondary School Mankon",
};

// ============================================================
// Reference data: qualifications for the Cameroon education system
// ============================================================

const QUALIFICATIONS = [
  { name: "FSLC", type: "SCHOOL_LEAVING" },
  { name: "GCE Ordinary Level", type: "SCHOOL_LEAVING" },
  { name: "GCE Advanced Level", type: "SCHOOL_LEAVING" },
  { name: "BEPC", type: "SCHOOL_LEAVING" },
  { name: "Probatoire", type: "SCHOOL_LEAVING" },
  { name: "Baccalauréat", type: "SCHOOL_LEAVING" },
  { name: "Technical and Vocational Certificate", type: "DIPLOMA", field: "TECHNOLOGY" },
  { name: "Higher Technical and Vocational Certificate", type: "DIPLOMA", field: "TECHNOLOGY" },
  { name: "Advanced Technical and Vocational Certificate", type: "DIPLOMA", field: "TECHNOLOGY" },
  { name: "Higher National Diploma", type: "HND", field: "TECHNOLOGY" },
  { name: "Diplôme Universitaire de Technologie", type: "DIPLOMA", field: "TECHNOLOGY" },
  { name: "Licence", type: "BACHELOR" },
  { name: "Bachelor of Science", type: "BACHELOR", field: "SCIENCE" },
  { name: "Bachelor of Arts", type: "BACHELOR", field: "ARTS" },
  { name: "Bachelor of Engineering", type: "BACHELOR", field: "ENGINEERING" },
  { name: "Bachelor of Laws", type: "BACHELOR", field: "LAW" },
  { name: "Bachelor of Business Administration", type: "BACHELOR", field: "BUSINESS" },
  { name: "Master of Science", type: "MASTER", field: "SCIENCE" },
  { name: "Master of Business Administration", type: "MASTER", field: "BUSINESS" },
  { name: "Doctorate", type: "DOCTORATE" },
];

// ============================================================
// Reusable section/program shapes
// ============================================================

const ENGLISH_SECTIONS = [
  {
    section: "GENERAL",
    classesOffered: ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Lower Sixth", "Upper Sixth"],
  },
];

const ENGLISH_TECH_SECTIONS = [
  ...ENGLISH_SECTIONS,
  { section: "TECHNICAL", track: "INDUSTRIAL", classesOffered: ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5"] },
  { section: "TECHNICAL", track: "COMMERCIAL", classesOffered: ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5"] },
];

const FRENCH_SECTIONS = [
  {
    section: "GENERAL",
    classesOffered: ["Sixième", "Cinquième", "Quatrième", "Troisième", "Seconde", "Première", "Terminale"],
  },
];

const O_LEVEL_PROGRAMS = [
  { name: "GCE Ordinary Level", qualification: "GCE Ordinary Level", duration: "5 years", tuition: 90000 },
  { name: "GCE Advanced Level", qualification: "GCE Advanced Level", duration: "2 years", tuition: 120000 },
];

const FRENCH_PROGRAMS = [
  { name: "Baccalauréat", qualification: "Baccalauréat", duration: "2 years", tuition: 90000 },
];

// ============================================================
// The dataset: 40 real Cameroon schools
// ============================================================

const SEED_SCHOOLS = [
  // ---------- Universities (10) ----------
  {
    name: "University of Yaoundé I",
    region: "Centre",
    city: "Yaoundé",
    lat: 3.848,
    lng: 11.502,
    levels: ["HIGHER"],
    languages: ["FRENCH"],
    ownership: "PUBLIC",
    boarding: "DAY",
    annualFee: 250000,
    qualifications: ["Bachelor of Science", "Bachelor of Arts", "Bachelor of Laws", "Master of Science", "Doctorate"],
    faculties: [
      { name: "Faculty of Science", departments: ["Computer Science", "Mathematics", "Physics"] },
      { name: "Faculty of Medicine and Biomedical Sciences", departments: ["Medicine"] },
      { name: "Faculty of Law and Political Science", departments: ["Law"] },
      { name: "Faculty of Arts, Letters and Social Sciences", departments: ["English", "French", "History"] },
      { name: "National Advanced School of Engineering", departments: ["Electrical Engineering", "Computer Engineering"] },
    ],
    programs: [
      { name: "Bachelor of Science in Computer Science", qualification: "Bachelor of Science", department: "Computer Science", duration: "3 years", tuition: 250000 },
      { name: "Bachelor of Science in Mathematics", qualification: "Bachelor of Science", department: "Mathematics", duration: "3 years", tuition: 220000 },
      { name: "Doctor of Medicine", qualification: "Doctorate", department: "Medicine", duration: "7 years", tuition: 500000 },
      { name: "Bachelor of Laws", qualification: "Bachelor of Laws", department: "Law", duration: "4 years", tuition: 200000 },
      { name: "Bachelor of Engineering in Electrical Engineering", qualification: "Bachelor of Science", department: "Electrical Engineering", duration: "4 years", tuition: 320000 },
    ],
  },
  {
    name: "University of Buea",
    region: "South West",
    city: "Buea",
    lat: 4.1516,
    lng: 9.2441,
    levels: ["HIGHER"],
    languages: ["ENGLISH"],
    ownership: "PUBLIC",
    boarding: "DAY",
    annualFee: 220000,
    qualifications: ["Bachelor of Science", "Bachelor of Arts", "Master of Science", "Doctorate"],
    faculties: [
      { name: "Faculty of Health Sciences", departments: ["Medicine", "Nursing"] },
      { name: "Faculty of Science", departments: ["Biology", "Chemistry", "Computer Science"] },
      { name: "Faculty of Arts", departments: ["English", "French"] },
      { name: "Faculty of Social and Management Sciences", departments: ["Economics", "Business Administration"] },
      { name: "Faculty of Education", departments: ["Teacher Education"] },
    ],
    programs: [
      { name: "Bachelor of Medicine and Bachelor of Surgery", qualification: "Doctorate", department: "Medicine", duration: "6 years", tuition: 500000 },
      { name: "Bachelor of Science in Nursing", qualification: "Bachelor of Science", department: "Nursing", duration: "3 years", tuition: 250000 },
      { name: "Bachelor of Science in Biology", qualification: "Bachelor of Science", department: "Biology", duration: "3 years", tuition: 220000 },
      { name: "Bachelor of Science in Computer Science", qualification: "Bachelor of Science", department: "Computer Science", duration: "3 years", tuition: 240000 },
      { name: "Bachelor of Science in Economics", qualification: "Bachelor of Science", department: "Economics", duration: "3 years", tuition: 200000 },
      { name: "Bachelor of Business Administration", qualification: "Bachelor of Business Administration", department: "Business Administration", duration: "3 years", tuition: 240000 },
    ],
  },
  {
    name: "University of Douala",
    region: "Littoral",
    city: "Douala",
    lat: 4.0511,
    lng: 9.7679,
    levels: ["HIGHER"],
    languages: ["FRENCH"],
    ownership: "PUBLIC",
    boarding: "DAY",
    annualFee: 250000,
    qualifications: ["Bachelor of Science", "Bachelor of Business Administration", "Bachelor of Laws", "Licence"],
    faculties: [
      { name: "Faculty of Economics and Applied Management", departments: ["Business Administration", "Economics", "Accounting"] },
      { name: "Faculty of Law and Political Science", departments: ["Law"] },
      { name: "Faculty of Science", departments: ["Computer Science", "Physics"] },
      { name: "Higher Technical Teacher Training College", departments: ["Mechanical Engineering", "Electrical Engineering"] },
      { name: "University Institute of Technology", departments: ["Software Engineering", "Logistics"] },
    ],
    programs: [
      { name: "Bachelor in Business Administration", qualification: "Bachelor of Business Administration", department: "Business Administration", duration: "3 years", tuition: 280000 },
      { name: "Bachelor in Economics", qualification: "Bachelor of Science", department: "Economics", duration: "3 years", tuition: 250000 },
      { name: "Bachelor of Laws", qualification: "Bachelor of Laws", department: "Law", duration: "4 years", tuition: 220000 },
      { name: "Bachelor of Engineering in Electrical Engineering", qualification: "Bachelor of Science", department: "Electrical Engineering", duration: "4 years", tuition: 350000 },
      { name: "Bachelor of Engineering in Mechanical Engineering", qualification: "Bachelor of Science", department: "Mechanical Engineering", duration: "4 years", tuition: 350000 },
    ],
  },
  {
    name: "University of Dschang",
    region: "West",
    city: "Dschang",
    lat: 5.4437,
    lng: 10.0533,
    levels: ["HIGHER"],
    languages: ["FRENCH"],
    ownership: "PUBLIC",
    boarding: "DAY",
    annualFee: 220000,
    qualifications: ["Bachelor of Science", "Bachelor of Arts", "Bachelor of Laws", "Licence"],
    faculties: [
      { name: "Faculty of Agronomy and Agricultural Sciences", departments: ["Agronomy", "Animal Science", "Rural Engineering"] },
      { name: "Faculty of Science", departments: ["Computer Science", "Chemistry", "Biology"] },
      { name: "Faculty of Law and Political Science", departments: ["Law"] },
      { name: "Faculty of Economics and Management", departments: ["Economics", "Accounting"] },
      { name: "Faculty of Letters and Social Sciences", departments: ["Sociology", "History"] },
    ],
    programs: [
      { name: "Bachelor in Agronomy", qualification: "Bachelor of Science", department: "Agronomy", duration: "4 years", tuition: 220000 },
      { name: "Bachelor in Animal Science", qualification: "Bachelor of Science", department: "Animal Science", duration: "4 years", tuition: 220000 },
      { name: "Bachelor of Science in Computer Science", qualification: "Bachelor of Science", department: "Computer Science", duration: "3 years", tuition: 250000 },
      { name: "Bachelor of Laws", qualification: "Bachelor of Laws", department: "Law", duration: "4 years", tuition: 200000 },
    ],
  },
  {
    name: "University of Ngaoundéré",
    region: "Adamaoua",
    city: "Ngaoundéré",
    lat: 7.3167,
    lng: 13.5833,
    levels: ["HIGHER"],
    languages: ["FRENCH"],
    ownership: "PUBLIC",
    boarding: "DAY",
    annualFee: 200000,
    qualifications: ["Bachelor of Science", "Licence"],
    faculties: [
      { name: "Faculty of Agronomy and Agricultural Sciences", departments: ["Agricultural Science", "Animal Science"] },
      { name: "Faculty of Science", departments: ["Computer Science", "Mathematics", "Physics"] },
      { name: "Faculty of Arts and Social Sciences", departments: ["Economics", "Management"] },
      { name: "University Institute of Technology", departments: ["Business Informatics", "Accounting"] },
    ],
    programs: [
      { name: "Bachelor in Agricultural Science", qualification: "Bachelor of Science", department: "Agricultural Science", duration: "4 years", tuition: 200000 },
      { name: "Bachelor in Animal Science", qualification: "Bachelor of Science", department: "Animal Science", duration: "4 years", tuition: 200000 },
      { name: "Bachelor of Science in Computer Science", qualification: "Bachelor of Science", department: "Computer Science", duration: "3 years", tuition: 220000 },
      { name: "Bachelor in Business Informatics", qualification: "Bachelor of Science", department: "Business Informatics", duration: "3 years", tuition: 210000 },
    ],
  },
  {
    name: "International University Bamenda",
    region: "North West",
    city: "Bamenda",
    lat: 5.9631,
    lng: 10.1591,
    levels: ["HIGHER"],
    languages: ["ENGLISH"],
    ownership: "PRIVATE",
    boarding: "DAY",
    annualFee: 350000,
    qualifications: ["Bachelor of Science", "Bachelor of Business Administration"],
    faculties: [
      { name: "Faculty of Business and Economics", departments: ["Business Administration", "Accounting"] },
      { name: "Faculty of Computer Science", departments: ["Computer Science", "Software Engineering"] },
    ],
    programs: [
      { name: "Bachelor of Business Administration", qualification: "Bachelor of Business Administration", department: "Business Administration", duration: "3 years", tuition: 350000 },
      { name: "Bachelor in Accounting", qualification: "Bachelor of Business Administration", department: "Accounting", duration: "3 years", tuition: 330000 },
      { name: "Bachelor of Science in Computer Science", qualification: "Bachelor of Science", department: "Computer Science", duration: "3 years", tuition: 380000 },
    ],
  },
  {
    name: "Université des Montagnes",
    region: "West",
    city: "Bangangté",
    lat: 5.1406,
    lng: 10.5253,
    levels: ["HIGHER"],
    languages: ["FRENCH"],
    ownership: "PRIVATE",
    boarding: "DAY",
    annualFee: 600000,
    qualifications: ["Bachelor of Science", "Bachelor of Business Administration", "Doctorate"],
    faculties: [
      { name: "Faculty of Health Sciences", departments: ["Medicine", "Nursing", "Dentistry"] },
      { name: "Faculty of Science and Technology", departments: ["Computer Science", "Biotechnology"] },
      { name: "Faculty of Business", departments: ["Management", "Accounting"] },
    ],
    programs: [
      { name: "Doctor of Medicine", qualification: "Doctorate", department: "Medicine", duration: "7 years", tuition: 850000 },
      { name: "Bachelor of Science in Nursing", qualification: "Bachelor of Science", department: "Nursing", duration: "3 years", tuition: 450000 },
      { name: "Bachelor of Science in Computer Science", qualification: "Bachelor of Science", department: "Computer Science", duration: "3 years", tuition: 350000 },
      { name: "Bachelor in Management", qualification: "Bachelor of Business Administration", department: "Management", duration: "3 years", tuition: 320000 },
    ],
  },
  {
    name: "ICT University",
    region: "Centre",
    city: "Yaoundé",
    lat: 3.848,
    lng: 11.502,
    levels: ["HIGHER"],
    languages: ["ENGLISH"],
    ownership: "PRIVATE",
    boarding: "DAY",
    annualFee: 400000,
    qualifications: ["Bachelor of Science", "Bachelor of Business Administration", "Master of Science"],
    faculties: [
      { name: "Faculty of Engineering and Technology", departments: ["Computer Science", "Software Engineering", "Networks and Telecommunications"] },
      { name: "Faculty of Business and Management", departments: ["Business Administration", "Accounting"] },
    ],
    programs: [
      { name: "Bachelor of Science in Computer Science", qualification: "Bachelor of Science", department: "Computer Science", duration: "3 years", tuition: 400000 },
      { name: "Bachelor of Science in Software Engineering", qualification: "Bachelor of Science", department: "Software Engineering", duration: "3 years", tuition: 420000 },
      { name: "Bachelor of Business Administration", qualification: "Bachelor of Business Administration", department: "Business Administration", duration: "3 years", tuition: 360000 },
    ],
  },
  {
    name: "Catholic University of Central Africa",
    region: "Centre",
    city: "Yaoundé",
    lat: 3.848,
    lng: 11.502,
    levels: ["HIGHER"],
    languages: ["FRENCH"],
    ownership: "MISSION",
    boarding: "DAY",
    annualFee: 250000,
    qualifications: ["Bachelor of Laws", "Bachelor of Arts", "Licence"],
    faculties: [
      { name: "Faculty of Law", departments: ["Law"] },
      { name: "Faculty of Economics and Management", departments: ["Economics", "Accounting"] },
      { name: "Faculty of Social Sciences", departments: ["Sociology", "Communication"] },
      { name: "Faculty of Theology", departments: ["Theology"] },
    ],
    programs: [
      { name: "Bachelor of Laws", qualification: "Bachelor of Laws", department: "Law", duration: "4 years", tuition: 280000 },
      { name: "Bachelor in Economics", qualification: "Bachelor of Science", department: "Economics", duration: "3 years", tuition: 250000 },
      { name: "Bachelor in Communication", qualification: "Bachelor of Arts", department: "Communication", duration: "3 years", tuition: 240000 },
      { name: "Bachelor in Theology", qualification: "Bachelor of Arts", department: "Theology", duration: "3 years", tuition: 200000 },
    ],
  },
  {
    name: "Catholic University of Cameroon",
    region: "North West",
    city: "Bamenda",
    lat: 5.9631,
    lng: 10.1591,
    levels: ["HIGHER"],
    languages: ["ENGLISH"],
    ownership: "MISSION",
    boarding: "DAY",
    annualFee: 280000,
    qualifications: ["Bachelor of Laws", "Bachelor of Arts", "Bachelor of Science", "Bachelor of Business Administration"],
    faculties: [
      { name: "Faculty of Law", departments: ["Law"] },
      { name: "Faculty of Business and Management", departments: ["Business Administration", "Accounting"] },
      { name: "Faculty of Arts and Humanities", departments: ["Philosophy", "English"] },
      { name: "Faculty of Health Sciences", departments: ["Nursing", "Public Health"] },
    ],
    programs: [
      { name: "Bachelor of Laws", qualification: "Bachelor of Laws", department: "Law", duration: "4 years", tuition: 260000 },
      { name: "Bachelor of Business Administration", qualification: "Bachelor of Business Administration", department: "Business Administration", duration: "3 years", tuition: 300000 },
      { name: "Bachelor in Philosophy", qualification: "Bachelor of Arts", department: "Philosophy", duration: "3 years", tuition: 220000 },
      { name: "Bachelor of Science in Nursing", qualification: "Bachelor of Science", department: "Nursing", duration: "3 years", tuition: 320000 },
    ],
  },

  // ---------- Primary / Nursery schools (10) ----------
  {
    name: "St. Michael's Nursery and Primary School",
    region: "South West",
    city: "Limbe",
    lat: 4.0248,
    lng: 9.2209,
    levels: ["NURSERY", "PRIMARY"],
    languages: ["ENGLISH"],
    ownership: "PRIVATE",
    boarding: "DAY",
    annualFee: 70000,
    qualifications: ["FSLC"],
  },
  {
    name: "Divine Favour Nursery and Primary School",
    region: "North West",
    city: "Bamenda",
    lat: 5.9631,
    lng: 10.1591,
    levels: ["NURSERY", "PRIMARY"],
    languages: ["ENGLISH"],
    ownership: "PRIVATE",
    boarding: "DAY",
    annualFee: 60000,
    qualifications: ["FSLC"],
  },
  {
    name: "Bitame Lucia Nursery and Primary School",
    region: "North West",
    city: "Bamenda",
    lat: 5.9631,
    lng: 10.1591,
    levels: ["NURSERY", "PRIMARY"],
    languages: ["ENGLISH"],
    ownership: "PRIVATE",
    boarding: "DAY",
    annualFee: 55000,
    qualifications: ["FSLC"],
  },
  {
    name: "Obili Prestige Nursery and Primary School",
    region: "Centre",
    city: "Yaoundé",
    lat: 3.848,
    lng: 11.502,
    levels: ["NURSERY", "PRIMARY"],
    languages: ["FRENCH"],
    ownership: "PRIVATE",
    boarding: "DAY",
    annualFee: 90000,
    qualifications: ["FSLC"],
  },
  {
    name: "Government Bilingual Primary School Bamenda",
    region: "North West",
    city: "Bamenda",
    lat: 5.9631,
    lng: 10.1591,
    levels: ["NURSERY", "PRIMARY"],
    languages: ["BILINGUAL"],
    ownership: "PUBLIC",
    boarding: "DAY",
    annualFee: 45000,
    qualifications: ["FSLC"],
  },
  {
    name: "Mabanda Nursery and Primary School",
    region: "South West",
    city: "Kumba",
    lat: 4.6366,
    lng: 9.4469,
    levels: ["NURSERY", "PRIMARY"],
    languages: ["ENGLISH"],
    ownership: "PRIVATE",
    boarding: "DAY",
    annualFee: 50000,
    qualifications: ["FSLC"],
  },
  {
    name: "École Primaire Privée de Douala",
    region: "Littoral",
    city: "Douala",
    lat: 4.0511,
    lng: 9.7679,
    levels: ["NURSERY", "PRIMARY"],
    languages: ["FRENCH"],
    ownership: "PRIVATE",
    boarding: "DAY",
    annualFee: 60000,
    qualifications: ["FSLC"],
  },
  {
    name: "Bamenda Metropolitan Nursery and Primary School",
    region: "North West",
    city: "Bamenda",
    lat: 5.9631,
    lng: 10.1591,
    levels: ["NURSERY", "PRIMARY"],
    languages: ["ENGLISH"],
    ownership: "PRIVATE",
    boarding: "DAY",
    annualFee: 65000,
    qualifications: ["FSLC"],
  },
  {
    name: "Carrefour Enama Nursery and Primary School",
    region: "Littoral",
    city: "Douala",
    lat: 4.0511,
    lng: 9.7679,
    levels: ["NURSERY", "PRIMARY"],
    languages: ["FRENCH"],
    ownership: "PRIVATE",
    boarding: "DAY",
    annualFee: 55000,
    qualifications: ["FSLC"],
  },
  {
    name: "Limbe Metropolitan Nursery and Primary School",
    region: "South West",
    city: "Limbe",
    lat: 4.0248,
    lng: 9.2209,
    levels: ["NURSERY", "PRIMARY"],
    languages: ["ENGLISH"],
    ownership: "PRIVATE",
    boarding: "DAY",
    annualFee: 65000,
    qualifications: ["FSLC"],
  },

  // ---------- Secondary schools (10) ----------
  {
    name: "Lycée Général Leclerc",
    region: "Centre",
    city: "Yaoundé",
    lat: 3.8574,
    lng: 11.5181,
    levels: ["SECONDARY"],
    languages: ["FRENCH"],
    ownership: "PUBLIC",
    boarding: "DAY",
    annualFee: 60000,
    qualifications: ["BEPC", "Probatoire", "Baccalauréat"],
    sections: FRENCH_SECTIONS,
    programs: FRENCH_PROGRAMS,
  },
  {
    name: "American School of Douala",
    region: "Littoral",
    city: "Douala",
    lat: 4.0511,
    lng: 9.7679,
    levels: ["SECONDARY"],
    languages: ["ENGLISH"],
    ownership: "PRIVATE",
    boarding: "DAY",
    annualFee: 350000,
    qualifications: ["GCE Ordinary Level", "GCE Advanced Level"],
    sections: ENGLISH_SECTIONS,
    programs: O_LEVEL_PROGRAMS,
  },
  {
    name: "Collège Libermann",
    region: "Littoral",
    city: "Douala",
    lat: 4.0511,
    lng: 9.7679,
    levels: ["SECONDARY"],
    languages: ["FRENCH"],
    ownership: "MISSION",
    boarding: "DAY",
    annualFee: 150000,
    qualifications: ["BEPC", "Probatoire", "Baccalauréat"],
    sections: FRENCH_SECTIONS,
    programs: FRENCH_PROGRAMS,
  },
  {
    name: "Collège Joss",
    region: "Littoral",
    city: "Douala",
    lat: 4.0511,
    lng: 9.7679,
    levels: ["SECONDARY"],
    languages: ["FRENCH"],
    ownership: "PRIVATE",
    boarding: "DAY",
    annualFee: 120000,
    qualifications: ["BEPC", "Probatoire", "Baccalauréat"],
    sections: FRENCH_SECTIONS,
    programs: FRENCH_PROGRAMS,
  },
  {
    name: "Presbyterian Secondary Mankon",
    region: "North West",
    city: "Bamenda",
    lat: 5.9631,
    lng: 10.1591,
    levels: ["SECONDARY"],
    languages: ["ENGLISH"],
    ownership: "MISSION",
    boarding: "BOARDING",
    annualFee: 110000,
    qualifications: ["GCE Ordinary Level", "GCE Advanced Level"],
    sections: ENGLISH_SECTIONS,
    programs: O_LEVEL_PROGRAMS,
  },
  {
    name: "Baptist Grammar School",
    region: "North West",
    city: "Bamenda",
    lat: 5.9631,
    lng: 10.1591,
    levels: ["SECONDARY"],
    languages: ["ENGLISH"],
    ownership: "MISSION",
    boarding: "DAY",
    annualFee: 95000,
    qualifications: ["GCE Ordinary Level", "GCE Advanced Level"],
    sections: ENGLISH_SECTIONS,
    programs: O_LEVEL_PROGRAMS,
  },
  {
    name: "St. Rita's College",
    region: "North West",
    city: "Bamenda",
    lat: 5.9631,
    lng: 10.1591,
    levels: ["SECONDARY"],
    languages: ["ENGLISH"],
    ownership: "MISSION",
    boarding: "DAY",
    annualFee: 100000,
    qualifications: ["GCE Ordinary Level", "GCE Advanced Level"],
    sections: ENGLISH_SECTIONS,
    programs: O_LEVEL_PROGRAMS,
  },
  {
    name: "Lycée de Bonabéri",
    region: "Littoral",
    city: "Douala",
    lat: 4.0248,
    lng: 9.7291,
    levels: ["SECONDARY"],
    languages: ["FRENCH"],
    ownership: "PUBLIC",
    boarding: "DAY",
    annualFee: 50000,
    qualifications: ["BEPC", "Probatoire", "Baccalauréat"],
    sections: FRENCH_SECTIONS,
    programs: FRENCH_PROGRAMS,
  },
  {
    name: "Saker Baptist College",
    region: "South West",
    city: "Limbe",
    lat: 4.0248,
    lng: 9.2209,
    levels: ["SECONDARY"],
    languages: ["ENGLISH"],
    ownership: "MISSION",
    boarding: "BOARDING",
    annualFee: 120000,
    qualifications: ["GCE Ordinary Level", "GCE Advanced Level"],
    sections: ENGLISH_SECTIONS,
    programs: O_LEVEL_PROGRAMS,
  },
  {
    name: "Alfred Saker College",
    region: "Littoral",
    city: "Douala",
    lat: 4.0511,
    lng: 9.7679,
    levels: ["SECONDARY"],
    languages: ["ENGLISH"],
    ownership: "MISSION",
    boarding: "DAY",
    annualFee: 110000,
    qualifications: ["GCE Ordinary Level", "GCE Advanced Level"],
    sections: ENGLISH_SECTIONS,
    programs: O_LEVEL_PROGRAMS,
  },

  // ---------- Technical schools (5) ----------
  {
    name: "Cameroon College of Arts, Science and Technology (CCAST) Bambili",
    region: "North West",
    city: "Bambili",
    lat: 5.9763,
    lng: 10.233,
    levels: ["SECONDARY"],
    languages: ["ENGLISH"],
    ownership: "PUBLIC",
    boarding: "BOTH",
    annualFee: 150000,
    qualifications: ["GCE Ordinary Level", "GCE Advanced Level", "Higher National Diploma"],
    sections: ENGLISH_TECH_SECTIONS,
    programs: [
      { name: "Higher National Diploma in Computer Science", qualification: "Higher National Diploma", duration: "2 years", tuition: 180000 },
      { name: "Higher National Diploma in Electrical Engineering", qualification: "Higher National Diploma", duration: "2 years", tuition: 180000 },
    ],
  },
  {
    name: "Nazarene College of Health Sciences",
    region: "North West",
    city: "Bambili",
    lat: 5.9763,
    lng: 10.233,
    levels: ["HIGHER"],
    languages: ["ENGLISH"],
    ownership: "MISSION",
    boarding: "BOTH",
    annualFee: 250000,
    qualifications: ["GCE Ordinary Level", "GCE Advanced Level", "Higher National Diploma"],
    sections: ENGLISH_SECTIONS,
    programs: [
      { name: "State Registered Nurse (Diploma)", qualification: "Higher National Diploma", duration: "3 years", tuition: 250000 },
    ],
  },
  {
    name: "Presbyterian Comprehensive Secondary School Kumba",
    region: "South West",
    city: "Kumba",
    lat: 4.6366,
    lng: 9.4469,
    levels: ["SECONDARY"],
    languages: ["ENGLISH"],
    ownership: "MISSION",
    boarding: "BOTH",
    annualFee: 120000,
    qualifications: ["GCE Ordinary Level", "GCE Advanced Level"],
    sections: ENGLISH_TECH_SECTIONS,
    programs: O_LEVEL_PROGRAMS,
  },
  {
    name: "Sacred Heart College Mankon",
    region: "North West",
    city: "Bamenda",
    lat: 5.9631,
    lng: 10.1591,
    levels: ["SECONDARY"],
    languages: ["ENGLISH"],
    ownership: "MISSION",
    boarding: "BOTH",
    annualFee: 110000,
    qualifications: ["GCE Ordinary Level", "GCE Advanced Level"],
    sections: ENGLISH_TECH_SECTIONS,
    programs: O_LEVEL_PROGRAMS,
  },
  {
    name: "Gov't Bilingual High School Limbe",
    region: "South West",
    city: "Limbe",
    lat: 4.0248,
    lng: 9.2209,
    levels: ["SECONDARY"],
    languages: ["BILINGUAL"],
    ownership: "PUBLIC",
    boarding: "DAY",
    annualFee: 50000,
    qualifications: ["GCE Ordinary Level", "GCE Advanced Level"],
    sections: ENGLISH_SECTIONS,
    programs: O_LEVEL_PROGRAMS,
  },

  // ---------- Comprehensive schools (5) ----------
  {
    name: "St. Michael's College Limbe",
    region: "South West",
    city: "Limbe",
    lat: 4.0248,
    lng: 9.2209,
    levels: ["NURSERY", "PRIMARY", "SECONDARY"],
    languages: ["ENGLISH"],
    ownership: "MISSION",
    boarding: "DAY",
    annualFee: 100000,
    qualifications: ["FSLC", "GCE Ordinary Level", "GCE Advanced Level"],
    sections: ENGLISH_SECTIONS,
    programs: O_LEVEL_PROGRAMS,
  },
  {
    name: "International Christian Academy Douala",
    region: "Littoral",
    city: "Douala",
    lat: 4.0511,
    lng: 9.7679,
    levels: ["NURSERY", "PRIMARY", "SECONDARY"],
    languages: ["ENGLISH"],
    ownership: "PRIVATE",
    boarding: "DAY",
    annualFee: 180000,
    qualifications: ["FSLC", "GCE Ordinary Level", "GCE Advanced Level"],
    sections: ENGLISH_SECTIONS,
    programs: O_LEVEL_PROGRAMS,
  },
  {
    name: "Rainbow Bilingual College Yaoundé",
    region: "Centre",
    city: "Yaoundé",
    lat: 3.848,
    lng: 11.502,
    levels: ["NURSERY", "PRIMARY", "SECONDARY"],
    languages: ["BILINGUAL"],
    ownership: "PRIVATE",
    boarding: "DAY",
    annualFee: 150000,
    qualifications: ["FSLC", "GCE Ordinary Level", "GCE Advanced Level"],
    sections: ENGLISH_SECTIONS,
    programs: O_LEVEL_PROGRAMS,
  },
  {
    name: "Collège de la Retraite",
    region: "Littoral",
    city: "Douala",
    lat: 4.0511,
    lng: 9.7679,
    levels: ["NURSERY", "PRIMARY", "SECONDARY"],
    languages: ["FRENCH"],
    ownership: "MISSION",
    boarding: "DAY",
    annualFee: 130000,
    qualifications: ["BEPC", "Probatoire", "Baccalauréat"],
    sections: FRENCH_SECTIONS,
    programs: FRENCH_PROGRAMS,
  },
  {
    name: "Our Lady of Lourdes College Mankon",
    region: "North West",
    city: "Bamenda",
    lat: 5.9631,
    lng: 10.1591,
    levels: ["PRIMARY", "SECONDARY"],
    languages: ["ENGLISH"],
    ownership: "MISSION",
    boarding: "DAY",
    annualFee: 90000,
    qualifications: ["FSLC", "GCE Ordinary Level", "GCE Advanced Level"],
    sections: ENGLISH_SECTIONS,
    programs: O_LEVEL_PROGRAMS,
  },
];

// ============================================================
// Idempotent get-or-create helpers
// ============================================================

async function getOrCreateQualification(name, stats) {
  const reference = QUALIFICATIONS.find((q) => q.name === name);
  const existing = await prisma.qualification.findUnique({ where: { name } });
  if (existing) return existing;
  const created = await prisma.qualification.create({
    data: { name, type: reference?.type ?? "OTHER", field: reference?.field ?? null },
  });
  if (stats) stats.qualificationsCreated++;
  return created;
}

async function getOrCreateLocation({ region, city, lat, lng }) {
  const regions = REGION_ALIASES[region] ?? [region];
  const existing = await prisma.location.findFirst({
    where: { city, OR: regions.map((r) => ({ region: r })) },
    orderBy: { latitude: "desc" },
  });
  if (existing) {
    if (existing.latitude == null && lat != null) {
      await prisma.location.update({
        where: { id: existing.id },
        data: { latitude: lat, longitude: lng ?? null },
      });
    }
    return { location: existing, created: false };
  }
  const location = await prisma.location.create({
    data: { region, city, latitude: lat ?? null, longitude: lng ?? null },
  });
  return { location, created: true };
}

function describeSchool(entry) {
  const type =
    entry.levels.includes("HIGHER")
      ? "higher education institution"
      : entry.levels.includes("SECONDARY")
      ? "school"
      : "primary and nursery school";
  return `${entry.name} is a ${type} located in ${entry.city}, ${entry.region} Region, Cameroon.`;
}

async function getOrCreateSchool(entry, locationId) {
  const searchName = SCHOOL_NAME_ALIASES[entry.name] ?? entry.name;
  const existing = await prisma.school.findFirst({ where: { name: searchName } });
  if (existing) {
    const updates = {
      levels: entry.levels,
      languages: entry.languages,
      ownership: entry.ownership,
      boarding: entry.boarding,
    };
    if (entry.annualFee) updates.annualFee = entry.annualFee;
    await prisma.school.update({ where: { id: existing.id }, data: updates });
    return { school: existing, created: false };
  }
  const school = await prisma.school.create({
    data: {
      name: entry.name,
      description: describeSchool(entry),
      locationId,
      levels: entry.levels,
      languages: entry.languages,
      ownership: entry.ownership,
      boarding: entry.boarding,
      annualFee: entry.annualFee ?? null,
      isDemoData: false,
      verificationStatus: "PENDING",
      images: {
        create: [{ url: DEFAULT_SCHOOL_IMAGE, caption: entry.name, isPrimary: true, order: 0 }],
      },
    },
  });
  return { school, created: true };
}

async function addQualifications(schoolId, names, stats) {
  for (const name of names ?? []) {
    const qualification = await getOrCreateQualification(name, stats);
    await prisma.schoolQualification.upsert({
      where: { schoolId_qualificationId: { schoolId, qualificationId: qualification.id } },
      update: {},
      create: { schoolId, qualificationId: qualification.id },
    });
  }
}

async function addSections(schoolId, sections, stats) {
  for (const section of sections ?? []) {
    const existing = await prisma.schoolSection.findFirst({
      where: { schoolId, section: section.section, track: section.track ?? null },
    });
    if (existing) continue;
    await prisma.schoolSection.create({
      data: {
        schoolId,
        section: section.section,
        track: section.track ?? null,
        classesOffered: section.classesOffered ?? [],
      },
    });
    if (stats) stats.sectionsCreated++;
  }
}

async function addFaculties(schoolId, faculties, stats) {
  const departmentIds = {};
  for (const faculty of faculties ?? []) {
    let record = await prisma.faculty.findUnique({
      where: { schoolId_name: { schoolId, name: faculty.name } },
    });
    if (!record) {
      record = await prisma.faculty.create({ data: { schoolId, name: faculty.name } });
      if (stats) stats.facultiesCreated++;
    }
    for (const department of faculty.departments ?? []) {
      let dept = await prisma.department.findUnique({
        where: { facultyId_name: { facultyId: record.id, name: department } },
      });
      if (!dept) {
        dept = await prisma.department.create({ data: { facultyId: record.id, name: department } });
        if (stats) stats.departmentsCreated++;
      }
      departmentIds[department] = dept.id;
    }
  }
  return departmentIds;
}

async function addPrograms(schoolId, programs, departmentIds = {}, stats) {
  for (const program of programs ?? []) {
    const qualification = await getOrCreateQualification(program.qualification, stats);
    const departmentId = program.department ? departmentIds[program.department] : null;
    const existing = departmentId
      ? await prisma.program.findFirst({ where: { departmentId, name: program.name } })
      : await prisma.program.findFirst({ where: { schoolId, name: program.name } });
    if (existing) continue;
    await prisma.program.create({
      data: {
        name: program.name,
        qualificationId: qualification.id,
        duration: program.duration ?? null,
        tuition: program.tuition ?? null,
        description: program.description ?? null,
        ...(departmentId ? { departmentId } : { schoolId }),
      },
    });
    if (stats) stats.programsCreated++;
  }
}

async function addFee(schoolId, annualFee, stats) {
  if (!annualFee) return;
  const existing = await prisma.schoolFee.findFirst({
    where: { schoolId, academicYear: CURRENT_ACADEMIC_YEAR },
  });
  if (existing) return;
  await prisma.schoolFee.create({
    data: { schoolId, academicYear: CURRENT_ACADEMIC_YEAR, amount: annualFee, category: "tuition" },
  });
  if (stats) stats.feesAdded++;
}

async function addSource(schoolId, stats) {
  const count = await prisma.schoolSource.count({ where: { schoolId } });
  if (count > 0) return;
  await prisma.schoolSource.create({
    data: {
      schoolId,
      sourceType: "MANUAL_ENTRY",
      sourceName: "LewaHub Cameroon School Dataset",
      retrievedAt: new Date(),
      confidence: 0.7,
      status: "PENDING",
    },
  });
  if (stats) stats.sourcesAdded++;
}

// ============================================================
// Main
// ============================================================

async function main() {
  const stats = {
    schoolsCreated: 0,
    schoolsUpdated: 0,
    locationsCreated: 0,
    qualificationsCreated: 0,
    programsCreated: 0,
    sectionsCreated: 0,
    facultiesCreated: 0,
    departmentsCreated: 0,
    feesAdded: 0,
    sourcesAdded: 0,
  };

  console.log("🌱 Seeding LewaHub with the Cameroon school dataset...\n");

  for (const entry of SEED_SCHOOLS) {
    const { location, created: locationCreated } = await getOrCreateLocation(entry);
    if (locationCreated) stats.locationsCreated++;

    const { school, created } = await getOrCreateSchool(entry, location.id);
    if (created) stats.schoolsCreated++;
    else stats.schoolsUpdated++;

    await addQualifications(school.id, entry.qualifications, stats);
    await addSections(school.id, entry.sections, stats);
    const departmentIds = await addFaculties(school.id, entry.faculties, stats);
    await addPrograms(school.id, entry.programs, departmentIds, stats);
    await addFee(school.id, entry.annualFee, stats);
    await addSource(school.id, stats);

    console.log(`${created ? "＋ created" : "✓ updated"} ${school.name}`);
  }

  const [schools, locations, qualifications, programs, faculties, departments, sections] =
    await Promise.all([
      prisma.school.count(),
      prisma.location.count(),
      prisma.qualification.count(),
      prisma.program.count(),
      prisma.faculty.count(),
      prisma.department.count(),
      prisma.schoolSection.count(),
    ]);

  console.log("\n✅ Seed completed successfully!");
  console.log("Changes:", JSON.stringify(stats));
  console.log("Totals — schools:", schools, "| locations:", locations, "| qualifications:", qualifications);
  console.log("Totals — programs:", programs, "| faculties:", faculties, "| departments:", departments, "| sections:", sections);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
