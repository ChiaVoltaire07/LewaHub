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

  // Add array filter chips
  filters.region.forEach(value => {
    const option = filterOptions.region.find(opt => opt.value === value);
    if (option) activeChips.push({ key: 'region', label: option.label, value });
  });

  filters.institutionType.forEach(value => {
    const option = filterOptions.institutionType.find(opt => opt.value === value);
    if (option) activeChips.push({ key: 'institutionType', label: option.label, value });
  });

  filters.curriculum.forEach(value => {
    const option = filterOptions.curriculum.find(opt => opt.value === value);
    if (option) activeChips.push({ key: 'curriculum', label: option.label, value });
  });

  filters.degreeLevel.forEach(value => {
    const option = filterOptions.degreeLevel.find(opt => opt.value === value);
    if (option) activeChips.push({ key: 'degreeLevel', label: option.label, value });
  });

  filters.feeRange.forEach(value => {
    const option = filterOptions.feeRange.find(opt => opt.value === value);
    if (option) activeChips.push({ key: 'feeRange', label: option.label, value });
  });

  // Add top rated chip
  if (filters.topRated) {
    activeChips.push({ key: 'topRated', label: 'Top Rated' });
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