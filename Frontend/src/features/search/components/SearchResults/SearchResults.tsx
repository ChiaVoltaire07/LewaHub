import React from 'react';
import { useTranslation } from 'react-i18next';
import { School } from '../../types';
import SearchCard from '../SearchCard/SearchCard';
import SchoolCardSkeleton from '../../../../components/skeletons/SchoolCardSkeleton';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
  schools: School[];
  isLoading: boolean;
  onViewDetails?: (school: School) => void;
  /** Optional custom empty-state hint (e.g. "expand your search radius") */
  emptyHint?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  schools,
  isLoading,
  onViewDetails,
  emptyHint
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className={styles.grid} aria-busy="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <SchoolCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>{t("search.noResults")}</p>
        <p className={styles.emptyText}>
          {emptyHint || 'Try adjusting your filters or search query'}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {schools.map(school => (
        <SearchCard
          key={school.id}
          school={school}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default SearchResults;