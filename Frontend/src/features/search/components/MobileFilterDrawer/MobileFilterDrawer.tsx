import React, { useState } from 'react';
import { X, ChevronDown, Star } from 'lucide-react';
import { Filters } from '../../types';
import { filterOptions } from '../../data/mockSchools';
import styles from './MobileFilterDrawer.module.css';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onToggleArrayFilter: (
    key: 'region' | 'category' | 'curriculum' | 'degreeLevel' | 'feeRange' | 'ownership' | 'boarding' | 'programs' | 'language' | 'distance' | 'minRating',
    value: string
  ) => void;
  onToggleTopRated: () => void;
  onToggleOffersHighSchool?: () => void;
  onReset: () => void;
  resultCount?: number;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onToggleArrayFilter,
  onToggleTopRated,
  onToggleOffersHighSchool,
  onReset,
  resultCount = 237
}) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const activeFilterCount =
    filters.region.length +
    filters.category.length +
    (filters.offersHighSchool ? 1 : 0) +
    filters.curriculum.length +
    filters.degreeLevel.length +
    filters.feeRange.length +
    (filters.ownership?.length || 0) +
    (filters.boarding?.length || 0) +
    (filters.programs?.length || 0) +
    (filters.topRated ? 1 : 0) +
    (filters.distance ? 1 : 0) +
    (filters.minRating ? 1 : 0);

  // Show High School checkbox only when Secondary category is selected
  const secondarySelected = filters.category.includes('Secondary');

  return (
    <>
      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={onClose} />
          <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
            <div className={styles.dragHandle} />
            <div className={styles.header}>
              <h2 className={styles.title}>Filters</h2>
              <button className={styles.closeButton} onClick={onClose} aria-label="Close filters">
                <X size={24} />
              </button>
            </div>
            <div className={styles.content}>
              {/* Minimum Rating */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterLabel}>Minimum Rating</h3>
                <div className={styles.ratingOptions}>
                  {[3, 3.5, 4, 4.5].map(rating => (
                    <button
                      key={rating}
                      className={`${styles.ratingButton} ${filters.minRating === rating ? styles.active : ''}`}
                      onClick={() => onToggleArrayFilter('minRating', rating.toString())}
                    >
                      <Star size={14} fill={filters.minRating === rating ? 'var(--sunbeam)' : 'none'} color={filters.minRating === rating ? 'var(--sunbeam)' : 'var(--ink)'} />
                      <span>{rating}+</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Region */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterLabel}>Region</h3>
                <div className={styles.pillContainer}>
                  {filterOptions.region.map(option => (
                    <button
                      key={option.value}
                      className={`${styles.pill} ${(filters.region || []).includes(option.value) ? styles.active : ''}`}
                      onClick={() => onToggleArrayFilter('region', option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Single 3-category filter replacing the old separate type + level filters */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterLabel}>Category</h3>
                <div className={styles.pillContainer}>
                  {filterOptions.category.map(option => (
                    <button
                      key={option.value}
                      className={`${styles.pill} ${(filters.category || []).includes(option.value) ? styles.active : ''}`}
                      onClick={() => onToggleArrayFilter('category', option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* High School checkbox — only shown when Secondary is active */}
              {secondarySelected && onToggleOffersHighSchool && (
                <div className={styles.filterSection}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!!filters.offersHighSchool}
                      onChange={onToggleOffersHighSchool}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>High School available (Lower/Upper Sixth)</span>
                  </label>
                </div>
              )}

              {/* More Filters - Collapsible */}
              <div className={styles.moreFiltersSection}>
                <button
                  className={styles.moreFiltersButton}
                  onClick={() => setShowMoreFilters(!showMoreFilters)}
                >
                  <span>More filters</span>
                  <ChevronDown size={20} className={showMoreFilters ? styles.rotated : ''} />
                </button>

                {showMoreFilters && (
                  <div className={styles.moreFiltersContent}>
                    {/* Language */}
                    <div className={styles.filterSection}>
                      <h3 className={styles.filterLabel}>Language</h3>
                      <div className={styles.pillContainer}>
                        {filterOptions.language.map(option => (
                          <button
                            key={option.value}
                            className={`${styles.pill} ${(filters.language || []).includes(option.value) ? styles.active : ''}`}
                            onClick={() => onToggleArrayFilter('language', option.value)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ownership */}
                    <div className={styles.filterSection}>
                      <h3 className={styles.filterLabel}>Ownership</h3>
                      <div className={styles.pillContainer}>
                        {['Public', 'Private', 'Faith-based'].map(option => (
                          <button
                            key={option}
                            className={`${styles.pill} ${(filters.ownership || []).includes(option) ? styles.active : ''}`}
                            onClick={() => onToggleArrayFilter('ownership', option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Boarding */}
                    <div className={styles.filterSection}>
                      <h3 className={styles.filterLabel}>Boarding / Day</h3>
                      <div className={styles.pillContainer}>
                        {['Day School', 'Boarding', 'Both'].map(option => (
                          <button
                            key={option}
                            className={`${styles.pill} ${(filters.boarding || []).includes(option) ? styles.active : ''}`}
                            onClick={() => onToggleArrayFilter('boarding', option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Programs */}
                    <div className={styles.filterSection}>
                      <h3 className={styles.filterLabel}>Programs</h3>
                      <div className={styles.pillContainer}>
                        {['STEM', 'Arts', 'Business', 'Sciences', 'Humanities'].map(option => (
                          <button
                            key={option}
                            className={`${styles.pill} ${(filters.programs || []).includes(option) ? styles.active : ''}`}
                            onClick={() => onToggleArrayFilter('programs', option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.footer}>
              <button className={styles.applyButton} onClick={onClose}>
                Show results {resultCount}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileFilterDrawer;
