import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <h3 className={styles.logo}>LewaHub</h3>
            <p className={styles.tagline}>
              Connecting students with the best educational institutions in Cameroon
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Quick Links</h4>
              <a href="/" className={styles.link}>Home</a>
              <a href="/search" className={styles.link}>Search</a>
              <a href="/about" className={styles.link}>About</a>
              <a href="/contact" className={styles.link}>Contact</a>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Contact</h4>
              <p className={styles.contactInfo}>info@lewahub.com</p>
              <p className={styles.contactInfo}>Yaoundé, Cameroon</p>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} LewaHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;