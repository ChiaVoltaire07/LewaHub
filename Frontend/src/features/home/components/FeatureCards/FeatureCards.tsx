import { Search, Users, Mail } from "lucide-react";
import FeatureCard from "./FeatureCard";
import styles from "./FeatureCards.module.css";

export default function FeatureCards() {
  return (
    <section className={styles.section} aria-label="Quick actions">
      <FeatureCard
        tone="primary"
        icon={<Search size={22} aria-hidden="true" />}
        title="Search school"
        description="Discover educational institutions that match your goals."
        actionLabel="Get started"
        href="/search"
      />
      <FeatureCard
        tone="light"
        icon={<Users size={22} aria-hidden="true" />}
        title="About us"
        description="Learn about our mission to digitize Cameroon's education portal."
        actionLabel="Our story"
        href="/about"
      />
      <FeatureCard
        tone="accent"
        icon={<Mail size={22} aria-hidden="true" />}
        title="Contact us"
        description="Have questions? Our support team is here to help you navigate."
        actionLabel="Reach out"
        href="/contact"
      />
    </section>
  );
}
