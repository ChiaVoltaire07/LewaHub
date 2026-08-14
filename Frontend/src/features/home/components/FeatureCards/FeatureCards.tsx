import { Search, Users, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import FeatureCard from "./FeatureCard";
import styles from "./FeatureCards.module.css";

export default function FeatureCards() {
  const { t } = useTranslation();

  return (
    <section className={styles.section} aria-label="Quick actions">
      <FeatureCard
        tone="primary"
        icon={<Search size={22} aria-hidden="true" />}
        title={t("home.features.comprehensive.title")}
        description={t("home.features.comprehensive.desc")}
        actionLabel={t("home.hero.cta")}
        href="/search"
      />
      <FeatureCard
        tone="light"
        icon={<Users size={22} aria-hidden="true" />}
        title={t("home.features.verified.title")}
        description={t("home.features.verified.desc")}
        actionLabel={t("home.hero.learnMore")}
        href="/about"
      />
      <FeatureCard
        tone="accent"
        icon={<Mail size={22} aria-hidden="true" />}
        title={t("home.features.compare.title")}
        description={t("home.features.compare.desc")}
        actionLabel={t("contact.title")}
        href="/contact"
      />
    </section>
  );
}