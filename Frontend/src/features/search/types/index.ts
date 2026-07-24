export interface School {
  id: string;
  name: string;
  region: string;
  institutionType: string;
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
  institutionType: string[];
  curriculum: string[];
  degreeLevel: string[];
  feeRange: string[];
  topRated: boolean;
  searchQuery: string;
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