export interface School {
  id: string;
  name: string;
  region: string;
  /** Matches the backend 3-category model: "PrimaryNursery" | "Secondary" | "University" */
  category: string;
  offersHighSchool?: boolean;
  /** Qualification levels drawn from the school's programs (e.g. "Secondary", "Bachelor", "Master") */
  curriculum: string[];
  degreeLevel: string[];
  programs: string[];
  /** True when the school has been verified by LewaHub */
  verified: boolean;
  image: string;
  location: {
    /** null when the school has no geographic coordinates in the database */
    lat: number | null;
    lng: number | null;
    address: string;
  };
  description: string;
  /** Present only when the school came from the nearby endpoint */
  distanceKm?: number;
  distanceMeters?: number;
}

/** Envelope returned by GET /schools/nearby */
export interface NearbyResponse {
  data: School[];
  center: { latitude: number; longitude: number };
  radiusKm: number;
  total: number;
  page: number;
  limit: number;
}

/** Lifecycle of the "schools near me" feature */
export type NearbyStatus =
  | "idle"
  | "locating"
  | "loading"
  | "success"
  | "denied"
  | "unavailable"
  | "timeout"
  | "unsupported"
  | "error";

export interface Filters {
  region: string[];
  /** Single category filter matching the backend: "PrimaryNursery" | "Secondary" | "University" */
  category: string[];
  /** Extra filter: when set to true, shows only Secondary schools that offer High School */
  offersHighSchool?: boolean;
  /** When true, only verified schools are returned */
  verified: boolean;
  searchQuery: string;
  ownership?: string[];
  boarding?: string[];
  programs?: string[];
  language?: string[];
}

export interface SearchState {
  schools: School[];
  filteredSchools: School[];
  filters: Filters;
  isLoading: boolean;
  error: string | null;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export type ViewMode = 'list' | 'map';
