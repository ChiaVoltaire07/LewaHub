import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { School } from '../../types';
import styles from './SearchCard.module.css';

interface SearchCardProps {
  school: School;
  onViewDetails?: (school: School) => void;
}

/** Convert the internal category key to a human-readable label */
function categoryLabel(category: string): string {
  switch (category) {
    case 'PrimaryNursery': return 'Primary / Nursery';
    case 'Secondary': return 'Secondary';
    case 'University': return 'University';
    default: return category;
  }
}

const DEFAULT_SCHOOL_IMAGE =
  'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

const SearchCard: React.FC<SearchCardProps> = ({ school, onViewDetails }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={school.image || DEFAULT_SCHOOL_IMAGE}
          alt={school.name}
          className={styles.image}
        />
        {school.topRated && <span className={styles.topRatedBadge}>Top Rated</span>}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.schoolName}>{school.name}</h3>
          <div className={styles.rating}>
            <span className={styles.ratingValue}>{school.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className={styles.location}>
          <MapPin size={14} />
          <span>
            {school.region} &bull; {categoryLabel(school.category)}
            {school.offersHighSchool && ' (incl. High School)'}
          </span>
        </div>

        <div className={styles.tags}>
          {school.curriculum.slice(0, 2).map((curr, idx) => (
            <span key={idx} className={styles.tag}>{curr}</span>
          ))}
          {school.degreeLevel.slice(0, 2).map((degree, idx) => (
            <span key={idx} className={styles.tag}>{degree}</span>
          ))}
        </div>

        <div className={styles.programs}>
          <span className={styles.programsCount}>
            {school.programs.length} {school.programs.length === 1 ? 'Program' : 'Programs'}
          </span>
        </div>

        <button
          className={styles.viewButton}
          onClick={() => onViewDetails?.(school)}
        >
          View Programs
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
};

export default SearchCard;
