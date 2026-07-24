import React from 'react';
import { X } from 'lucide-react';
import FilterSidebar from '../FilterSidebar/FilterSidebar';
import { Filters } from '../../types';
import styles from './MobileFilterDrawer.module.css';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onToggleArrayFilter: (key: 'region' | 'institutionType' | 'curriculum' | 'degreeLevel' | 'feeRange', value: string) => void;
  onToggleTopRated: () => void;
  onReset: () => void;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onToggleArrayFilter,
  onToggleTopRated,
  onReset
}) => {
  return (
    <>
      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={onClose} />
          <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
            <div className={styles.header}>
              <h2 className={styles.title}>Filters</h2>
              <button className={styles.closeButton} onClick={onClose} aria-label="Close filters">
                <X size={24} />
              </button>
            </div>
            <div className={styles.content}>
              <FilterSidebar
                filters={filters}
                onToggleArrayFilter={onToggleArrayFilter}
                onToggleTopRated={onToggleTopRated}
                onReset={onReset}
                isMobile={true}
              />
            </div>
            <div className={styles.footer}>
              <button className={styles.applyButton} onClick={onClose}>
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileFilterDrawer;