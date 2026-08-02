import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../../lib/api";
import SchoolCard from "./SchoolCard";
import styles from "./FeaturedSchools.module.css";

interface School {
  id: string;
  name: string;
  category: string;
  city: string;
  region: string;
  imageUrl?: string;
  verified?: boolean;
  programs?: any[];
}

export default function FeaturedSchools() {
  const { t } = useTranslation();
  const [schools, setSchools] = useState<School[]>([]);
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

        // Map backend schools to frontend School type
        const mappedSchools = ((response.data as any[]) || []).slice(0, 6).map((school: any) => ({
          id: school.id,
          name: school.name,
          type: school.category,
          category: school.category,
          region: school.region,
          city: school.city,
          rating: 4.5, // Placeholder - could fetch real ratings from evaluations
          featured: school.verified,
          status: school.verified ? "Evaluated" : "Pending Review",
          imagePlaceholder: school.imageUrl || "linear-gradient(135deg, #0F766E, #134E4A)",
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
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
            {t("home.featured.loading")}
          </div>
        ) : schools.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
            {t("home.featured.empty")}
          </div>
        ) : (
          schools.map((school) => (
            <SchoolCard key={school.id} school={school as any} />
          ))
        )}
      </div>
    </section>
  );
}