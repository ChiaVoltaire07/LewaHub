import React from 'react';
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
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Searching schools...</p>
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>No schools found</p>
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