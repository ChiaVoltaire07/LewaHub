import React, { useState } from 'react';
import { X, ChevronDown, Star } from 'lucide-react';
import { Filters } from '../../types';
import { filterOptions } from '../../data/mockSchools';
import styles from './MobileFilterDrawer.module.css';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onToggleArrayFilter: (key: 'region' | 'institutionType' | 'schoolLevel' | 'curriculum' | 'degreeLevel' | 'feeRange' | 'ownership' | 'boarding' | 'programs' | 'distance' | 'minRating', value: string) => void;
  onToggleTopRated: () => void;
  onReset: () => void;
  resultCount?: number;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onToggleArrayFilter,
  onToggleTopRated,
  onReset,
  resultCount = 237
}) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const activeFilterCount = 
    filters.region.length +
    filters.institutionType.length +
    filters.curriculum.length +
    filters.degreeLevel.length +
    filters.feeRange.length +
    (filters.ownership?.length || 0) +
    (filters.boarding?.length || 0) +
    (filters.programs?.length || 0) +
    (filters.topRated ? 1 : 0) +
    (filters.distance ? 1 : 0) +
    (filters.minRating ? 1 : 0);

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
              {/* Minimum Rating - Star Tagged */}
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

              {/* Region - Pills */}
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

              {/* Institution Type - Pills */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterLabel}>Institution Type</h3>
                <div className={styles.pillContainer}>
                  {filterOptions.institutionType.map(option => (
                    <button
                      key={option.value}
                      className={`${styles.pill} ${(filters.institutionType || []).includes(option.value) ? styles.active : ''}`}
                      onClick={() => onToggleArrayFilter('institutionType', option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* School Level - Pills */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterLabel}>School Level</h3>
                <div className={styles.pillContainer}>
                  {filterOptions.schoolLevel.map(option => (
                    <button
                      key={option.value}
                      className={`${styles.pill} ${(filters.schoolLevel || []).includes(option.value) ? styles.active : ''}`}
                      onClick={() => onToggleArrayFilter('schoolLevel', option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

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
