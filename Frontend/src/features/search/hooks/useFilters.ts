import { useState, useCallback } from 'react';
import { Filters } from '../types';

const initialFilters: Filters = {
  region: [],
  institutionType: [],
  curriculum: [],
  degreeLevel: [],
  feeRange: [],
  topRated: false,
  searchQuery: ''
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

  const toggleArrayFilter = useCallback((key: 'region' | 'institutionType' | 'curriculum' | 'degreeLevel' | 'feeRange', value: string) => {
    setFilters(prev => {
      const currentArray = prev[key];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  }, []);

  const toggleTopRated = useCallback(() => {
    setFilters(prev => ({ ...prev, topRated: !prev.topRated }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
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

  const hasActiveFilters = filters.region.length > 0 ||
    filters.institutionType.length > 0 ||
    filters.curriculum.length > 0 ||
    filters.degreeLevel.length > 0 ||
    filters.feeRange.length > 0 ||
    filters.topRated;

  return {
    filters,
    isFilterDrawerOpen,
    updateFilter,
    toggleArrayFilter,
    toggleTopRated,
    setSearchQuery,
    resetFilters,
    openFilterDrawer,
    closeFilterDrawer,
    hasActiveFilters
  };
};