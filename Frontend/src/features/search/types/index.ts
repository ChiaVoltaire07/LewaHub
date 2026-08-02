export interface School {
  id: string;
  name: string;
  region: string;
  /** Matches the backend 3-category model: "PrimaryNursery" | "Secondary" | "University" */
  category: string;
  offersHighSchool?: boolean;
  curriculum: string[];
  degreeLevel: string[];
  programs: string[];
  feeRange: string;
  rating: number;
  topRated: boolean;
  image: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
}

export interface Filters {
  region: string[];
  /** Single category filter matching the backend: "PrimaryNursery" | "Secondary" | "University" */
  category: string[];
  /** Extra filter: when set to true, shows only Secondary schools that offer High School */
  offersHighSchool?: boolean;
  curriculum: string[];
  degreeLevel: string[];
  feeRange: string[];
  topRated: boolean;
  searchQuery: string;
  distance?: number;
  minRating?: number;
  ownership?: string[];
  boarding?: string[];
  programs?: string[];
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
