import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Filters } from '../../types';
import { filterOptions } from '../../data/mockSchools';
import styles from './MobileFilterDrawer.module.css';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onToggleArrayFilter: (
    key: 'region' | 'category' | 'ownership' | 'boarding' | 'programs' | 'language',
    value: string
  ) => void;
  onToggleVerified: () => void;
  onToggleOffersHighSchool?: () => void;
  resultCount?: number;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onToggleArrayFilter,
  onToggleVerified,
  onToggleOffersHighSchool,
  resultCount = 0
}) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

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

              {/* Verified only */}
              <div className={styles.filterSection}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.verified}
                    onChange={onToggleVerified}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Verified schools only</span>
                </label>
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
                        {filterOptions.ownership.map(option => (
                          <button
                            key={option.value}
                            className={`${styles.pill} ${(filters.ownership || []).includes(option.value) ? styles.active : ''}`}
                            onClick={() => onToggleArrayFilter('ownership', option.value)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Boarding */}
                    <div className={styles.filterSection}>
                      <h3 className={styles.filterLabel}>Boarding / Day</h3>
                      <div className={styles.pillContainer}>
                        {filterOptions.boarding.map(option => (
                          <button
                            key={option.value}
                            className={`${styles.pill} ${(filters.boarding || []).includes(option.value) ? styles.active : ''}`}
                            onClick={() => onToggleArrayFilter('boarding', option.value)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Programs (free-text) */}
                    <div className={styles.filterSection}>
                      <h3 className={styles.filterLabel}>Programs</h3>
                      <input
                        type="text"
                        placeholder="Search by program, e.g. Computer Science"
                        value={filters.programs?.[0] || ''}
                        onChange={(e) => onToggleArrayFilter('programs', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--line, #E2E8F0)',
                          fontSize: '14px',
                        }}
                      />
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
