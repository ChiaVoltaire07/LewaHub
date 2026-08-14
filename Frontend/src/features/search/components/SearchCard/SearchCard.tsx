import React from 'react';
import { MapPin, ExternalLink, CheckCircle } from 'lucide-react';
import { School } from '../../types';
import { formatDistance } from '../../utils/formatDistance';
import SmartImage from '../../../../components/skeletons/SmartImage';
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
  const distanceParts = formatDistance(school.distanceKm);
  const distanceLabel = distanceParts.meters != null
    ? `${distanceParts.meters} m`
    : distanceParts.km != null
      ? `${distanceParts.km} km`
      : null;

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <SmartImage
          src={school.image || DEFAULT_SCHOOL_IMAGE}
          alt={school.name}
          containerClassName={styles.imageContainerInner}
          className={styles.image}
          fallbackSrc={DEFAULT_SCHOOL_IMAGE}
          imgProps={{ style: { transition: 'opacity 0.5s ease, transform 0.3s ease' } }}
        />
        {school.verified && (
          <span className={styles.topRatedBadge}>
            <CheckCircle size={12} style={{ verticalAlign: '-2px' }} /> Verified
          </span>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.schoolName}>{school.name}</h3>
        </div>

        <div className={styles.location}>
          <MapPin size={14} />
          <span>
            {school.region} &bull; {categoryLabel(school.category)}
            {school.offersHighSchool && ' (incl. High School)'}
          </span>
        </div>

        {distanceLabel && (
          <div className={styles.distance}>
            {distanceLabel}
          </div>
        )}

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
