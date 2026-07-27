import type { School } from "../types/school";

/**
 * Mock data for the Home page. Replace with a call to the schools service
 * once the catalog API is available.
 */
export const featuredSchools: School[] = [
  {
    id: "saint-benedict-high-school",
    name: "Saint Benedict High School",
    category: "Primary",
    city: "Yaoundé",
    region: "Centre Region",
    rating: 4.8,
    featured: true,
    status: "Evaluated",
    imagePlaceholder: "linear-gradient(135deg, #0F766E, #134E4A)",
  },
  {
    id: "maritime-academy-of-douala",
    name: "Maritime Academy of Douala",
    category: "University",
    city: "Douala",
    region: "Littoral Region",
    rating: 4.2,
    status: "Evaluated",
    imagePlaceholder: "linear-gradient(135deg, #1E293B, #0F172A)",
  },
  {
    id: "summit-excellence-academy",
    name: "Summit Excellence Academy",
    category: "Secondary",
    city: "Bamenda",
    region: "North-West",
    rating: 5.0,
    status: "Pending Review",
    imagePlaceholder: "linear-gradient(135deg, #64748B, #334155)",
  },
  {
    id: "bafoussam-tech-hub",
    name: "Bafoussam Tech Hub",
    category: "Tech Institute",
    city: "Bafoussam",
    region: "West Region",
    rating: 4.5,
    status: "Evaluated",
    imagePlaceholder: "linear-gradient(135deg, #0E7490, #164E63)",
  },
  {
    id: "petit-pas-primary-center",
    name: "Petit-Pas Primary Center",
    category: "Primary",
    city: "Kribi",
    region: "South Region",
    rating: 4.9,
    status: "Evaluated",
    imagePlaceholder: "linear-gradient(135deg, #A16207, #78350F)",
  },
  {
    id: "north-star-science-academy",
    name: "North Star Science Academy",
    category: "Secondary",
    city: "Garoua",
    region: "North Region",
    rating: 4.0,
    status: "Evaluated",
    imagePlaceholder: "linear-gradient(135deg, #0F766E, #0891B2)",
  },
];
