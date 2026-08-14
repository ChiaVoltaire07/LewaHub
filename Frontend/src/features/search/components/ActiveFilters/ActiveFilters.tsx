import React from 'react';
import { X } from 'lucide-react';
import { Filters } from '../../types';
import { filterOptions } from '../../data/mockSchools';
import styles from './ActiveFilters.module.css';

interface ActiveFiltersProps {
  filters: Filters;
  onRemoveFilter: (key: keyof Filters, value?: string) => void;
  onClearAll: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll
}) => {
  const activeChips: { key: keyof Filters; label: string; value?: string }[] = [];

  filters.region.forEach(value => {
    const option = filterOptions.region.find(opt => opt.value === value);
    if (option) activeChips.push({ key: 'region', label: option.label, value });
  });

  filters.category.forEach(value => {
    const option = filterOptions.category.find(opt => opt.value === value);
    if (option) activeChips.push({ key: 'category', label: option.label, value });
  });

  filters.language?.forEach(value => {
    const option = filterOptions.language.find(opt => opt.value === value);
    if (option) activeChips.push({ key: 'language', label: option.label, value });
  });

  filters.ownership?.forEach(value => {
    const option = filterOptions.ownership.find(opt => opt.value === value);
    if (option) activeChips.push({ key: 'ownership', label: option.label, value });
  });

  filters.boarding?.forEach(value => {
    const option = filterOptions.boarding.find(opt => opt.value === value);
    if (option) activeChips.push({ key: 'boarding', label: option.label, value });
  });

  if (filters.programs?.[0]) {
    activeChips.push({ key: 'programs', label: filters.programs[0], value: filters.programs[0] });
  }

  // Show "High School available" as a chip when active
  if (filters.offersHighSchool) {
    activeChips.push({ key: 'offersHighSchool', label: 'High School available' });
  }

  if (filters.verified) {
    activeChips.push({ key: 'verified', label: 'Verified schools only' });
  }

  if (activeChips.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.chips}>
        {activeChips.map((chip, index) => (
          <div key={`${chip.key}-${chip.value}-${index}`} className={styles.chip}>
            <span className={styles.chipLabel}>{chip.label}</span>
            <button
              className={styles.removeButton}
              onClick={() => onRemoveFilter(chip.key, chip.value)}
              aria-label={`Remove ${chip.label} filter`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <button className={styles.clearAll} onClick={onClearAll}>
        Clear All
      </button>
    </div>
  );
};

export default ActiveFilters;
