import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const NAV_LINKS = [
  { to: "/", labelKey: "nav.home" },
  { to: "/search", labelKey: "nav.search" },
  { to: "/about", labelKey: "nav.about" },
  { to: "/contact", labelKey: "nav.contact" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fr" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border-light shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link
          to="/"
          className="text-xl font-bold text-teal-primary tracking-tight"
        >
          LewaHub
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {NAV_LINKS.map(({ to, labelKey }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors pb-0.5 border-b-2 ${
                  isActive
                    ? "text-teal-primary border-teal-primary"
                    : "text-text-muted border-transparent hover:text-teal-primary"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleLanguage}
            className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded border border-teal-primary text-teal-primary hover:bg-teal-light transition-colors"
            aria-label={t("common.switchLanguage")}
          >
            {i18n.language === "en" ? "FR" : "EN"}
          </button>

          <button
            type="button"
            className="md:hidden p-2 text-teal-primary"
            aria-label={mobileOpen ? t("common.close") : t("common.menu")}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="md:hidden border-t border-border-light bg-white px-4 py-3 flex flex-col gap-1"
          aria-label="Mobile"
        >
          {NAV_LINKS.map(({ to, labelKey }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-teal-light text-teal-primary"
                    : "text-text-dark hover:bg-bg-soft"
                }`}
              >
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}