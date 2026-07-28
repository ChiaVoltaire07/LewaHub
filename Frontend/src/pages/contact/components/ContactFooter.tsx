import { Link } from "react-router-dom";

export default function ContactFooter() {
  return (
    <footer className="mt-auto border-t border-border-light bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-lg font-bold text-teal-primary">LewaHub</p>
          <p className="mt-1 text-sm text-text-muted max-w-sm">
            Your reliable guide to educational institutions in Cameroon.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm">
          <Link to="/about" className="text-text-muted hover:text-teal-primary transition-colors">
            About
          </Link>
          <Link to="/search" className="text-text-muted hover:text-teal-primary transition-colors">
            Search schools
          </Link>
          <Link to="/contact" className="text-text-muted hover:text-teal-primary transition-colors">
            Contact
          </Link>
        </div>
      </div>
      <div className="border-t border-border-light py-4 text-center text-xs text-text-muted">
        © 2026 LewaHub School Catalog. All rights reserved.
      </div>
    </footer>
  );
}
