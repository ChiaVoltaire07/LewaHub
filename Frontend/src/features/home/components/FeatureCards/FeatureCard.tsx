import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import styles from "./FeatureCards.module.css";

export type FeatureCardTone = "primary" | "light" | "accent";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  tone?: FeatureCardTone;
  href: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  actionLabel,
  tone = "light",
  href,
}: FeatureCardProps) {
  return (
    <a href={href} className={`${styles.card} ${styles[tone]}`}>
      <div className={styles.iconWrap}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <span className={styles.action}>
        {actionLabel}
        <ArrowRight size={16} aria-hidden="true" />
      </span>
    </a>
  );
}
