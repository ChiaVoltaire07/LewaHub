import { CheckCircle2, Clock3, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { HomeSchool } from "../../types/school";
import styles from "./FeaturedSchools.module.css";

interface SchoolCardProps {
  school: HomeSchool;
}

export default function SchoolCard({ school }: SchoolCardProps) {
  return (
    <article className={styles.card}>
      <div
        className={styles.imageWrap}
        style={
          school.imageUrl
            ? undefined
            : { background: "linear-gradient(135deg, #0F766E, #134E4A)" }
        }
      >
        {school.imageUrl && (
          <img
            src={school.imageUrl}
            alt={school.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
        <div className={styles.imageBadges}>
          <span className={styles.categoryBadge}>{school.category}</span>
        </div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{school.name}</h3>

        <p className={styles.location}>
          <MapPin size={14} aria-hidden="true" />
          {school.city}, {school.region}
        </p>

        <div className={styles.footer}>
          {school.verified ? (
            <span className={`${styles.status} ${styles.statusEvaluated}`}>
              <CheckCircle2 size={14} aria-hidden="true" />
              Verified
            </span>
          ) : (
            <span className={`${styles.status} ${styles.statusPending}`}>
              <Clock3 size={14} aria-hidden="true" />
              Not yet verified
            </span>
          )}

          <Link to={`/school/${school.id}`} className={styles.details}>
            Details
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
