import React from 'react';
import { X, LayoutList, Map } from 'lucide-react';
import { Filters, FilterOption } from '../../types';
import { filterOptions } from '../../data/mockSchools';
import styles from './FilterSidebar.module.css';

interface FilterSidebarProps {
  filters: Filters;
  onToggleArrayFilter: (key: 'region' | 'institutionType' | 'curriculum' | 'degreeLevel' | 'feeRange', value: string) => void;
  onToggleTopRated: () => void;
  onReset: () => void;
  onClose?: () => void;
  isMobile?: boolean;
  viewMode?: 'list' | 'map';
  onViewModeChange?: (mode: 'list' | 'map') => void;
}

const FilterSection: React.FC<{
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}> = ({ title, options, selectedValues, onToggle }) => (
  <div className={styles.filterSection}>
    <h3 className={styles.filterTitle}>{title}</h3>
    <div className={styles.filterOptions}>
      {options.map(option => (
        <label key={option.value} className={styles.filterOption}>
          <input
            type="checkbox"
            checked={selectedValues.includes(option.value)}
            onChange={() => onToggle(option.value)}
          />
          <span className={styles.checkbox}></span>
          <span className={styles.optionLabel}>{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onToggleArrayFilter,
  onToggleTopRated,
  onReset,
  onClose,
  isMobile = false,
  viewMode = 'list',
  onViewModeChange
}) => {
  const activeFilterCount = 
    filters.region.length +
    filters.institutionType.length +
    filters.curriculum.length +
    filters.degreeLevel.length +
    filters.feeRange.length +
    (filters.topRated ? 1 : 0);

  return (
    <div className={`${styles.sidebar} ${isMobile ? styles.mobile : ''}`}>
      {isMobile && (
        <div className={styles.mobileHeader}>
          <h2 className={styles.mobileTitle}>Filters</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close filters">
            <X size={24} />
          </button>
        </div>
      )}

      <div className={styles.content}>
        {!isMobile && onViewModeChange && (
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewToggleButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => onViewModeChange('list')}
            >
              <LayoutList size={18} />
              <span>List</span>
            </button>
            <button
              className={`${styles.viewToggleButton} ${viewMode === 'map' ? styles.active : ''}`}
              onClick={() => onViewModeChange('map')}
            >
              <Map size={18} />
              <span>Map</span>
            </button>
          </div>
        )}

        {activeFilterCount > 0 && (
          <div className={styles.header}>
            <h3 className={styles.title}>Filters</h3>
            <button className={styles.resetButton} onClick={onReset}>
              Reset All
            </button>
          </div>
        )}

        <FilterSection
          title="Region"
          options={filterOptions.region}
          selectedValues={filters.region}
          onToggle={(value) => onToggleArrayFilter('region', value)}
        />

        <FilterSection
          title="Institution Type"
          options={filterOptions.institutionType}
          selectedValues={filters.institutionType}
          onToggle={(value) => onToggleArrayFilter('institutionType', value)}
        />

        <FilterSection
          title="Curriculum"
          options={filterOptions.curriculum}
          selectedValues={filters.curriculum}
          onToggle={(value) => onToggleArrayFilter('curriculum', value)}
        />

        <FilterSection
          title="Degree Level"
          options={filterOptions.degreeLevel}
          selectedValues={filters.degreeLevel}
          onToggle={(value) => onToggleArrayFilter('degreeLevel', value)}
        />

        <FilterSection
          title="Fee Range"
          options={filterOptions.feeRange}
          selectedValues={filters.feeRange}
          onToggle={(value) => onToggleArrayFilter('feeRange', value)}
        />

        <div className={styles.filterSection}>
          <label className={styles.topRatedOption}>
            <input
              type="checkbox"
              checked={filters.topRated}
              onChange={onToggleTopRated}
            />
            <span className={styles.checkbox}></span>
            <span className={styles.optionLabel}>Top Rated Only</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;