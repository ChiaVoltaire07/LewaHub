import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Rocket } from "lucide-react";
import styles from "./Newsletter.module.css";

export default function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className={styles.section} aria-labelledby="newsletter-heading">
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 id="newsletter-heading" className={styles.heading}>
            {t("home.newsletter.title")}
          </h2>
          <p className={styles.description}>
            {t("home.newsletter.subtitle")}
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="newsletter-email" className={styles.srOnly}>
              {t("home.newsletter.placeholder")}
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder={t("home.newsletter.placeholder")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.submit}>
              {t("home.newsletter.button")}
            </button>
          </form>

          {submitted && (
            <p className={styles.confirmation} role="status">
              {t("home.newsletter.success")}
            </p>
          )}
        </div>

        <div className={styles.iconCircle} aria-hidden="true">
          <Rocket size={44} />
        </div>
      </div>
    </section>
  );
}