import { useState, useCallback } from 'react';
import { Filters } from '../types';

const initialFilters: Filters = {
  region: [],
  category: [],
  offersHighSchool: undefined,
  verified: false,
  searchQuery: '',
  ownership: [],
  boarding: [],
  programs: [],
  language: [],
  specialities: []
};

// Support pre-filtering from a URL query param (e.g. footer "Explore" links
// like /search?category=Secondary). Additive — does not change existing behavior.
const getInitialFilters = (): Filters => {
  if (typeof window === "undefined") return initialFilters;
  const category = new URLSearchParams(window.location.search).get("category");
  return category ? { ...initialFilters, category: [category] } : initialFilters;
};

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>(getInitialFilters);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const updateFilter = useCallback(<K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayFilter = useCallback((
    key: 'region' | 'category' | 'ownership' | 'boarding' | 'programs' | 'language' | 'specialities',
    value: string
  ) => {
    setFilters(prev => {
      const currentArray = (prev[key] as string[]) || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  }, []);

  const toggleVerified = useCallback(() => {
    setFilters(prev => ({ ...prev, verified: !prev.verified }));
  }, []);

  const toggleOffersHighSchool = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      offersHighSchool: prev.offersHighSchool ? undefined : true,
    }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const setProgramFilter = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, programs: value ? [value] : [] }));
  }, []);

  const setSpecialityFilter = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, specialities: value ? [value] : [] }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const openFilterDrawer = useCallback(() => {
    setIsFilterDrawerOpen(true);
  }, []);

  const closeFilterDrawer = useCallback(() => {
    setIsFilterDrawerOpen(false);
  }, []);

  const hasActiveFilters =
    filters.region.length > 0 ||
    filters.category.length > 0 ||
    !!filters.offersHighSchool ||
    filters.verified ||
    (filters.ownership?.length || 0) > 0 ||
    (filters.boarding?.length || 0) > 0 ||
    (filters.programs?.length || 0) > 0 ||
    (filters.language?.length || 0) > 0 ||
    (filters.specialities?.length || 0) > 0;

  return {
    filters,
    isFilterDrawerOpen,
    updateFilter,
    toggleArrayFilter,
    toggleVerified,
    toggleOffersHighSchool,
    setSearchQuery,
    setProgramFilter,
    setSpecialityFilter,
    resetFilters,
    openFilterDrawer,
    closeFilterDrawer,
    hasActiveFilters
  };
};
