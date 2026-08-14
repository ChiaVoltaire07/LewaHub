import { useEffect, useState } from 'react';
import { FilterOptions } from '../types';
import api from '../../../lib/api';
import { filterOptions as staticOptions } from '../data/mockSchools';

const toArray = (value: string[] | undefined) => value ?? [];

const toOption = (value: string) => ({ value, label: value });

/**
 * Distinct region / program / speciality options for the filter dropdowns.
 * Served from GET /schools/filters (database is the source of truth). While the
 * request is in flight — or if it fails — falls back to the static option lists
 * so the UI never renders empty dropdowns.
 */
export const useFilterOptions = () => {
  const [options, setOptions] = useState<FilterOptions>({
    regions: toArray(staticOptions.region.map((o) => o.value)),
    programs: toArray(staticOptions.program.map((o) => o.value)),
    specialities: toArray(staticOptions.speciality.map((o) => o.value)),
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await api.getFilterOptions();
        if (cancelled) return;
        if (response.error) {
          // Keep static fallback, silently.
          return;
        }
        const payload: any = (response as any).data || response;
        const next = {
          regions: toArray(payload.regions),
          programs: toArray(payload.programs),
          specialities: toArray(payload.specialities),
        };
        if (next.regions.length > 0 || next.programs.length > 0 || next.specialities.length > 0) {
          setOptions(next);
        }
      } catch (err) {
        // Fallback to static options.
        console.error('Failed to load filter options:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    regions: options.regions.map(toOption),
    programs: options.programs.map(toOption),
    specialities: options.specialities.map(toOption),
    isLoading,
  };
};
