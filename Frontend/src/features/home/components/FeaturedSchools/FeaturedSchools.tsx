import { ChevronRight } from "lucide-react";
import { featuredSchools } from "../../data/featuredSchools";
import SchoolCard from "./SchoolCard";
import styles from "./FeaturedSchools.module.css";

export default function FeaturedSchools() {
  return (
    <section className={styles.section} aria-labelledby="featured-schools-heading">
      <div className={styles.header}>
        <div>
          <h2 id="featured-schools-heading" className={styles.heading}>
            Featured Schools
          </h2>
          <p className={styles.subheading}>
            Top-rated institutions hand-picked for excellence and verified quality.
          </p>
        </div>

        <a href="/search" className={styles.viewAll}>
          View all schools
          <ChevronRight size={16} aria-hidden="true" />
        </a>
      </div>

      <div className={styles.grid}>
        {featuredSchools.map((school) => (
          <SchoolCard key={school.id} school={school} />
        ))}
      </div>
    </section>
  );
}
