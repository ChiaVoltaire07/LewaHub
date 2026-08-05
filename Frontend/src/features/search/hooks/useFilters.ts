import { useState, useCallback } from 'react';
import { Filters } from '../types';

const initialFilters: Filters = {
  region: [],
  category: [],
  offersHighSchool: undefined,
  curriculum: [],
  degreeLevel: [],
  feeRange: [],
  topRated: false,
  searchQuery: '',
  distance: undefined,
  minRating: undefined,
  ownership: [],
  boarding: [],
  programs: [],
  language: []
};

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const updateFilter = useCallback(<K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayFilter = useCallback((
    key: 'region' | 'category' | 'curriculum' | 'degreeLevel' | 'feeRange' | 'ownership' | 'boarding' | 'programs' | 'language' | 'distance' | 'minRating',
    value: string
  ) => {
    setFilters(prev => {
      // Handle single-value filters (distance, minRating)
      if (key === 'distance' || key === 'minRating') {
        const numValue = parseFloat(value);
        return { ...prev, [key]: prev[key] === numValue ? undefined : numValue };
      }
      // Handle array filters
      const currentArray = (prev[key] as string[]) || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  }, []);

  const toggleTopRated = useCallback(() => {
    setFilters(prev => ({ ...prev, topRated: !prev.topRated }));
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
    filters.curriculum.length > 0 ||
    filters.degreeLevel.length > 0 ||
    filters.feeRange.length > 0 ||
    filters.topRated ||
    (filters.ownership?.length || 0) > 0 ||
    (filters.boarding?.length || 0) > 0 ||
    (filters.programs?.length || 0) > 0 ||
    (filters.language?.length || 0) > 0 ||
    filters.minRating !== undefined;

  return {
    filters,
    isFilterDrawerOpen,
    updateFilter,
    toggleArrayFilter,
    toggleTopRated,
    toggleOffersHighSchool,
    setSearchQuery,
    setProgramFilter,
    resetFilters,
    openFilterDrawer,
    closeFilterDrawer,
    hasActiveFilters
  };
};
