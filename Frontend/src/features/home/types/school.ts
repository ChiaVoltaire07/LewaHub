export type SchoolCategory = "Primary" | "Secondary" | "University" | "Tech Institute";

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
