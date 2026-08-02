import { useState, useEffect, useCallback } from 'react';
import { School, Filters } from '../types';
import { searchSchools } from '../services/searchApi';

const initialFilters: Filters = {
  region: [],
  category: [],
  curriculum: [],
  degreeLevel: [],
  feeRange: [],
  topRated: false,
  searchQuery: ''
};

export const useSearch = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (searchFilters: Filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchSchools(searchFilters);
      setSchools(results);
      setFilteredSchools(results);
    } catch (err) {
      setError('Failed to fetch schools. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(filters);
  }, [filters, performSearch]);

  const updateFilter = useCallback(<K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  return {
    schools,
    filteredSchools,
    filters,
    isLoading,
    error,
    updateFilter,
    resetFilters,
    performSearch
  };
};
