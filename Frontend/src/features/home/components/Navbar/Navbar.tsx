import { Search, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../hooks/useNavbar";
import styles from "./Navbar.module.css";

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export default function Navbar({ onOpenMobileMenu }: NavbarProps) {
  const { pathname } = useLocation();

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          LewaHub
        </Link>

        <nav className={styles.links} aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`${styles.link} ${isActive ? styles.linkActive : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <div className={styles.quickSearch}>
            <Search size={16} className={styles.quickSearchIcon} aria-hidden="true" />
            <input
              type="search"
              placeholder="Quick search..."
              aria-label="Quick search"
              className={styles.quickSearchInput}
            />
          </div>

          <button
            type="button"
            className={styles.hamburger}
            onClick={onOpenMobileMenu}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
