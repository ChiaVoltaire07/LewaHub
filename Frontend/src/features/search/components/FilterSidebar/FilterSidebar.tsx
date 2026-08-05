import React from 'react';
import { X, LayoutList, Map } from 'lucide-react';
import { Filters, FilterOption } from '../../types';
import { filterOptions } from '../../data/mockSchools';
import styles from './FilterSidebar.module.css';

interface FilterSidebarProps {
  filters: Filters;
  onToggleArrayFilter: (
    key: 'region' | 'category' | 'curriculum' | 'degreeLevel' | 'feeRange' | 'ownership' | 'boarding' | 'programs' | 'language' | 'distance' | 'minRating',
    value: string
  ) => void;
  onToggleTopRated: () => void;
  onToggleOffersHighSchool?: () => void;
  onReset: () => void;
  onClose?: () => void;
  isMobile?: boolean;
  viewMode?: 'list' | 'map';
  onViewModeChange?: (mode: 'list' | 'map') => void;
  resultCount?: number;
  onProgramChange?: (value: string) => void;
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
  onToggleTopRated,
  onToggleOffersHighSchool,
  onReset,
  onClose,
  isMobile = false,
  viewMode = 'list',
  onViewModeChange,
  resultCount = 0,
  onProgramChange
}) => {
  const activeFilterCount =
    filters.region.length +
    filters.category.length +
    (filters.offersHighSchool ? 1 : 0) +
    filters.curriculum.length +
    filters.degreeLevel.length +
    filters.feeRange.length +
    (filters.topRated ? 1 : 0) +
    (filters.ownership?.length || 0) +
    (filters.boarding?.length || 0) +
    (filters.programs?.length || 0) +
    (filters.language?.length || 0) +
    (filters.minRating !== undefined ? 1 : 0);

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

        {/* Region second */}
        <FilterSection
          title="Region"
          options={filterOptions.region}
          selectedValues={filters.region}
          onToggle={(value) => onToggleArrayFilter('region', value)}
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

        {/* Programs (free-text) */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Programs</h3>
          <input
            type="text"
            placeholder="Search by program, e.g. Computer Science"
            value={filters.programs?.[0] || ''}
            onChange={(e) => onProgramChange?.(e.target.value)}
            className={styles.textInput}
          />
        </div>

        {/* Minimum rating */}
        <FilterSection
          title="Minimum Rating"
          options={filterOptions.minRating}
          selectedValues={filters.minRating !== undefined ? [String(filters.minRating)] : []}
          onToggle={(value) => onToggleArrayFilter('minRating', value)}
        />

        {/* Curriculum */}
        <FilterSection
          title="Curriculum"
          options={filterOptions.curriculum}
          selectedValues={filters.curriculum}
          onToggle={(value) => onToggleArrayFilter('curriculum', value)}
        />

        {/* Degree Level */}
        <FilterSection
          title="Degree Level"
          options={filterOptions.degreeLevel}
          selectedValues={filters.degreeLevel}
          onToggle={(value) => onToggleArrayFilter('degreeLevel', value)}
        />

        {/* Fee Range */}
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