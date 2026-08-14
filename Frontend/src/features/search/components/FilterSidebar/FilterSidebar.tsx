import React from 'react';
import { X, LayoutList, Map } from 'lucide-react';
import { Filters, FilterOption } from '../../types';
import { filterOptions } from '../../data/mockSchools';
import FilterSelect from './FilterSelect';
import styles from './FilterSidebar.module.css';

interface FilterSidebarProps {
  filters: Filters;
  onToggleArrayFilter: (
    key: 'region' | 'category' | 'ownership' | 'boarding' | 'programs' | 'language' | 'specialities',
    value: string
  ) => void;
  onToggleVerified: () => void;
  onToggleOffersHighSchool?: () => void;
  onReset: () => void;
  onClose?: () => void;
  isMobile?: boolean;
  viewMode?: 'list' | 'map';
  onViewModeChange?: (mode: 'list' | 'map') => void;
  resultCount?: number;
  onProgramChange?: (value: string) => void;
  onRegionChange?: (value: string) => void;
  onSpecialityChange?: (value: string) => void;
  /** Distinct options served by GET /schools/filters (fallback: static lists) */
  regionOptions?: FilterOption[];
  programOptions?: FilterOption[];
  specialityOptions?: FilterOption[];
}

const FilterSection: React.FC<{
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}> = ({ title, options, selectedValues, onToggle }) => (
  <div className={styles.filterSection}>
    <h3 className={styles.filterTitle}>{title}</h3>
    <div className={styles.pillContainer}>
      {options.map(option => (
        <button
          key={option.value}
          className={`${styles.pill} ${(selectedValues || []).includes(option.value) ? styles.active : ''}`}
          onClick={() => onToggle(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onToggleArrayFilter,
  onToggleVerified,
  onToggleOffersHighSchool,
  onReset,
  onClose,
  isMobile = false,
  viewMode = 'list',
  onViewModeChange,
  resultCount = 0,
  onProgramChange,
  onRegionChange,
  onSpecialityChange,
  regionOptions = filterOptions.region,
  programOptions = filterOptions.program,
  specialityOptions = filterOptions.speciality
}) => {
  const activeFilterCount =
    filters.region.length +
    filters.category.length +
    (filters.offersHighSchool ? 1 : 0) +
    (filters.verified ? 1 : 0) +
    (filters.ownership?.length || 0) +
    (filters.boarding?.length || 0) +
    (filters.programs?.length || 0) +
    (filters.language?.length || 0) +
    (filters.specialities?.length || 0);

  // The "High School available" checkbox only makes sense when Secondary is selected
  const secondarySelected = filters.category.includes('Secondary');

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

        <div className={styles.header}>
          <h3 className={styles.title}>Filters</h3>
          {activeFilterCount > 0 && (
            <button className={styles.resetButton} onClick={onReset}>
              Clear all
            </button>
          )}
        </div>

        {/* Results count — live feedback that a filter click did something */}
        <div className={styles.resultCount}>
          {resultCount} {resultCount === 1 ? 'school' : 'schools'} found
        </div>

        {/* Level/category first (broadest cut) */}
        <FilterSection
          title="Level / Category"
          options={filterOptions.category}
          selectedValues={filters.category}
          onToggle={(value) => onToggleArrayFilter('category', value)}
        />

        {/* High School checkbox — only shown when "Secondary" is an active category filter */}
        {secondarySelected && onToggleOffersHighSchool && (
          <div className={styles.filterSection}>
            <label className={styles.topRatedOption}>
              <input
                type="checkbox"
                checked={!!filters.offersHighSchool}
                onChange={onToggleOffersHighSchool}
              />
              <span className={styles.checkbox}></span>
              <span className={styles.optionLabel}>High School available (Lower/Upper Sixth)</span>
            </label>
          </div>
        )}

        {/* Region — single-select dropdown */}
        <FilterSelect
          title="Region"
          value={filters.region[0] || ''}
          options={regionOptions}
          placeholder="Any region"
          onChange={(value) => onRegionChange?.(value)}
        />

        {/* Language of instruction */}
        <FilterSection
          title="Language"
          options={filterOptions.language}
          selectedValues={filters.language || []}
          onToggle={(value) => onToggleArrayFilter('language', value)}
        />

        {/* Ownership */}
        <FilterSection
          title="Ownership"
          options={filterOptions.ownership}
          selectedValues={filters.ownership || []}
          onToggle={(value) => onToggleArrayFilter('ownership', value)}
        />

        {/* Boarding / Day */}
        <FilterSection
          title="Boarding / Day"
          options={filterOptions.boarding}
          selectedValues={filters.boarding || []}
          onToggle={(value) => onToggleArrayFilter('boarding', value)}
        />

        {/* Program — single-select dropdown */}
        <FilterSelect
          title="Program"
          value={filters.programs?.[0] || ''}
          options={programOptions}
          placeholder="Any program"
          onChange={(value) => onProgramChange?.(value)}
        />

        {/* Speciality / field of study — single-select dropdown */}
        <FilterSelect
          title="Speciality"
          value={filters.specialities?.[0] || ''}
          options={specialityOptions}
          placeholder="Any speciality"
          onChange={(value) => onSpecialityChange?.(value)}
        />

        <div className={styles.filterSection}>
          <label className={styles.topRatedOption}>
            <input
              type="checkbox"
              checked={filters.verified}
              onChange={onToggleVerified}
            />
            <span className={styles.checkbox}></span>
            <span className={styles.optionLabel}>Verified schools only</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
