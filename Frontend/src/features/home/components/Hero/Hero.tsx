import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./Hero.module.css";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className={styles.hero}>
      <motion.span
        className={styles.badge}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Education Excellence in Cameroon
      </motion.span>

      <motion.h1
        className={styles.heading}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
      >
        {t("home.hero.title")}
      </motion.h1>

      <motion.p
        className={styles.description}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        {t("home.hero.subtitle")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
      >
        <SearchBar />
      </motion.div>
    </section>
  );
}