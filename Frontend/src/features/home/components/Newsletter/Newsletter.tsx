import { FormEvent, useState } from "react";
import { Rocket } from "lucide-react";
import styles from "./Newsletter.module.css";

export default function Newsletter() {
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
            Join the future of education
          </h2>
          <p className={styles.description}>
            Get notified about upcoming entrance exams, new school evaluations,
            and scholarship opportunities across the country.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="newsletter-email" className={styles.srOnly}>
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.submit}>
              Subscribe Now
            </button>
          </form>

          {submitted && (
            <p className={styles.confirmation} role="status">
              You're subscribed. Watch your inbox for the next update.
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
