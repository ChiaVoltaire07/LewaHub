import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../../lib/api";
import SchoolCard from "./SchoolCard";
import SchoolCardSkeleton from "../../../../components/skeletons/SchoolCardSkeleton";
import { HomeSchool } from "../../types/school";
import styles from "./FeaturedSchools.module.css";

export default function FeaturedSchools() {
  const { t } = useTranslation();
  const [schools, setSchools] = useState<HomeSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedSchools = async () => {
      try {
        setLoading(true);
        const response = await api.getSchools({
          page: 1,
          limit: 6,
        });

        if (response.error) {
          setError(response.error);
          return;
        }

        // Map backend schools to the home card shape. Only real fields —
        // no invented ratings or evaluation statuses.
        const mappedSchools = ((response.data as any[]) || [])
          .slice(0, 6)
          .map((school: any): HomeSchool => ({
            id: school.id,
            name: school.name,
            category: school.category,
            region: school.region,
            city: school.city,
            verified: !!school.verified,
            imageUrl: school.imageUrl || undefined,
            programCount: (school.programs || []).length,
          }));

        setSchools(mappedSchools);
      } catch (err: any) {
        setError(err.message || "Failed to load schools");
        console.error("Error loading featured schools:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedSchools();
  }, []);

  if (error) {
    return (
      <section className={styles.section} aria-labelledby="featured-schools-heading">
        <div className={styles.header}>
          <div>
            <h2 id="featured-schools-heading" className={styles.heading}>
              {t("home.featured.title")}
            </h2>
            <p className={styles.subheading}>
              {t("home.featured.error")}: {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-labelledby="featured-schools-heading">
      <div className={styles.header}>
        <div>
          <h2 id="featured-schools-heading" className={styles.heading}>
            {t("home.featured.title")}
          </h2>
          <p className={styles.subheading}>
            {loading ? t("home.featured.loading") : t("home.featured.subtitle")}
          </p>
        </div>

        <a href="/search" className={styles.viewAll}>
          {t("home.featured.viewAll")}
          <ChevronRight size={16} aria-hidden="true" />
        </a>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <>
            {[0, 1, 2].map((i) => (
              <SchoolCardSkeleton key={i} layout="stack" />
            ))}
          </>
        ) : schools.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
            {t("home.featured.empty")}
          </div>
        ) : (
          schools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))
        )}
      </div>
    </section>
  );
}
