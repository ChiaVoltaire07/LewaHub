/** The 3 categories that match the backend data model exactly. */
export type SchoolCategory = "PrimaryNursery" | "Secondary" | "University";

export type EvaluationStatus = "Evaluated" | "Pending Review";

export interface School {
  id: string;
  name: string;
  category: SchoolCategory;
  region: string;
  city: string;
  rating: number;
  featured?: boolean;
  status: EvaluationStatus;
  /** CSS gradient used as a placeholder until real school photos are wired up. */
  imagePlaceholder: string;
}
