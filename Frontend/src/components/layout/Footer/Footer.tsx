import { Share2, Globe } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>LewaHub</span>
          <p className={styles.description}>
            Empowering families to make the best educational choices for their
            children since 2024.
          </p>
        </div>

        <nav className={styles.links} aria-label="Footer">
          <a href="/privacy" className={styles.link}>
            Privacy Policy
          </a>
          <a href="/terms" className={styles.link}>
            Terms of Service
          </a>
          <a href="/support" className={styles.link}>
            Support
          </a>
        </nav>

        <div className={styles.meta}>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} LewaHub School Catalog. All rights reserved.
          </span>
          <div className={styles.social}>
            <a href="/" aria-label="Share" className={styles.socialIcon}>
              <Share2 size={16} />
            </a>
            <a href="/" aria-label="Website" className={styles.socialIcon}>
              <Globe size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
