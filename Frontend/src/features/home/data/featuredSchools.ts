import type { School } from "../types/school";

/**
 * Mock data for the Home page featured schools carousel.
 * Replace with a live API call once the catalog service is wired up.
 *
 * Categories must match the backend 3-category model exactly:
 *   "PrimaryNursery" | "Secondary" | "University"
 */
export const featuredSchools: School[] = [
  {
    id: "saint-benedict-high-school",
    name: "Saint Benedict High School",
    category: "Secondary",
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
    // Tech institutes fall under University in the 3-category model
    category: "University",
    city: "Bafoussam",
    region: "West Region",
    rating: 4.5,
    status: "Evaluated",
    imagePlaceholder: "linear-gradient(135deg, #0E7490, #164E63)",
  },
  {
    id: "petit-pas-primary-center",
    name: "Petit-Pas Primary Center",
    category: "PrimaryNursery",
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
