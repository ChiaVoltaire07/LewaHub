import { motion } from "framer-motion";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./Hero.module.css";

export default function Hero() {
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
        Find the best school for your future
      </motion.h1>

      <motion.p
        className={styles.description}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        Navigate through thousands of verified primary, secondary, and higher
        education institutions across Cameroon with confidence and clarity.
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
