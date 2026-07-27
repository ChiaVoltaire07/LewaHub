import { CheckCircle2, Clock3, MapPin, Star, ArrowRight } from "lucide-react";
import type { School } from "../../types/school";
import styles from "./FeaturedSchools.module.css";

interface SchoolCardProps {
  school: School;
}

export default function SchoolCard({ school }: SchoolCardProps) {
  const isEvaluated = school.status === "Evaluated";

  return (
    <article className={styles.card}>
      <div
        className={styles.imageWrap}
        style={{ background: school.imagePlaceholder }}
      >
        <div className={styles.imageBadges}>
          <span className={styles.categoryBadge}>{school.category}</span>
          {school.featured && (
            <span className={styles.featuredBadge}>Featured</span>
          )}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.rating}>
          <div className={styles.stars} aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={14}
                fill={index < Math.round(school.rating) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span className={styles.ratingValue}>({school.rating.toFixed(1)}/5)</span>
        </div>

        <h3 className={styles.name}>{school.name}</h3>

        <p className={styles.location}>
          <MapPin size={14} aria-hidden="true" />
          {school.city}, {school.region}
        </p>

        <div className={styles.footer}>
          <span className={`${styles.status} ${isEvaluated ? styles.statusEvaluated : styles.statusPending}`}>
            {isEvaluated ? (
              <CheckCircle2 size={14} aria-hidden="true" />
            ) : (
              <Clock3 size={14} aria-hidden="true" />
            )}
            {school.status}
          </span>

          <a href={`/schools/${school.id}`} className={styles.details}>
            Details
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
