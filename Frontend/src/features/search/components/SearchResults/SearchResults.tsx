import React from 'react';
import { useTranslation } from 'react-i18next';
import { School } from '../../types';
import SearchCard from '../SearchCard/SearchCard';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
  schools: School[];
  isLoading: boolean;
  onViewDetails?: (school: School) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  schools,
  isLoading,
  onViewDetails
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>{t("search.loading")}</p>
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>{t("search.noResults")}</p>
        <p className={styles.emptyText}>Try adjusting your filters or search query</p>
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