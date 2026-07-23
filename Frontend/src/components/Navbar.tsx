import { Search } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Search", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#", active: true },
];

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-border-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex-shrink-0">
            <span className="text-2xl font-extrabold text-teal-primary tracking-tight">
              LewaHub
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  link.active
                    ? "text-teal-primary border-b-2 border-teal-primary pb-1"
                    : "text-text-muted hover:text-text-dark"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search schools..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-border-light bg-bg-soft text-sm text-text-dark placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-teal-primary/30 focus:border-teal-primary transition-all"
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-text-muted hover:text-text-dark hover:bg-gray-100 transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}