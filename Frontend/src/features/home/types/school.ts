/** The 3 categories that match the backend data model exactly. */
export type SchoolCategory = "PrimaryNursery" | "Secondary" | "University";

/**
 * Minimal display shape for school cards on the home page.
 * Only real backend-backed fields are represented — no invented ratings or statuses.
 */
export interface HomeSchool {
  id: string;
  name: string;
  category: SchoolCategory;
  region: string;
  city: string;
  /** True when LewaHub has verified the school (backend `verified` flag) */
  verified?: boolean;
  /** Real photo URL when one exists; cards fall back to a neutral gradient */
  imageUrl?: string;
  programCount?: number;
}
