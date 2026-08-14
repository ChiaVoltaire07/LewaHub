import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/search", label: "Search" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function ContactNavbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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
          {NAV_LINKS.map(({ to, label }) => {
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
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="md:hidden p-2 text-teal-primary"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          className="md:hidden border-t border-border-light bg-white px-4 py-3 flex flex-col gap-1"
          aria-label="Mobile"
        >
          {NAV_LINKS.map(({ to, label }) => {
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
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
