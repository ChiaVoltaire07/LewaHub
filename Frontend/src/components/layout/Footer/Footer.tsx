import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GraduationCap, Mail, MapPin } from "lucide-react";

const linkClass =
  "inline-flex items-center gap-1.5 text-sm text-white/65 transition-colors hover:text-teal-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-light/60 focus-visible:rounded-sm rounded-sm";

const headingClass =
  "text-xs font-semibold uppercase tracking-[0.14em] text-white/90 mb-4";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0E1D15] text-white">
      <div
        className="h-1 bg-gradient-to-r from-teal-primary via-teal-dark to-teal-light/40"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1.1fr] gap-x-10 gap-y-10">
          {/* Brand + Contact */}
          <div className="space-y-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-light/60 rounded-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-primary/15 ring-1 ring-teal-light/20">
                <GraduationCap className="h-5 w-5 text-teal-light" />
              </span>
              <span className="text-2xl font-bold tracking-tight text-white">
                LewaHub
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-white/70">
              {t("footer.tagline")}
            </p>

            <div className="space-y-3 pt-1">
              <h3 className={headingClass}>{t("footer.contactTitle")}</h3>
              <a href="mailto:support@LewaHub.cm" className={linkClass}>
                <Mail className="h-4 w-4 text-teal-light" aria-hidden="true" />
                {t("footer.email")}
              </a>
              <div className={linkClass}>
                <MapPin className="h-4 w-4 text-teal-light" aria-hidden="true" />
                {t("footer.location")}
              </div>
            </div>
          </div>

          {/* Explore */}
          <nav aria-label={t("footer.exploreTitle")} className="space-y-4">
            <h3 className={headingClass}>{t("footer.exploreTitle")}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/search" className={linkClass}>
                  {t("footer.findSchools")}
                </Link>
              </li>
              <li>
                <Link to="/search?category=PrimaryNursery" className={linkClass}>
                  {t("footer.primaryNursery")}
                </Link>
              </li>
              <li>
                <Link to="/search?category=Secondary" className={linkClass}>
                  {t("footer.secondarySchools")}
                </Link>
              </li>
              <li>
                <Link to="/search" className={linkClass}>
                  {t("footer.technicalSchools")}
                </Link>
              </li>
              <li>
                <Link to="/search?category=University" className={linkClass}>
                  {t("footer.universities")}
                </Link>
              </li>
              <li>
                <Link to="/search" className={linkClass}>
                  {t("footer.programs")}
                </Link>
              </li>
            </ul>
          </nav>

          {/* LewaHub */}
          <nav aria-label="LewaHub" className="space-y-4">
            <h3 className={headingClass}>{t("footer.lewahubTitle")}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className={linkClass}>
                  {t("footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className={linkClass}>
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label={t("footer.legalTitle")} className="space-y-4">
            <h3 className={headingClass}>{t("footer.legalTitle")}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className={linkClass}>
                  {t("footer.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link to="/terms" className={linkClass}>
                  {t("footer.termsOfService")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50">
            {t("footer.copyright", { year })}
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-xs text-white/60 transition-colors hover:text-teal-light"
            >
              {t("footer.privacyPolicy")}
            </Link>
            <Link
              to="/terms"
              className="text-xs text-white/60 transition-colors hover:text-teal-light"
            >
              {t("footer.termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
