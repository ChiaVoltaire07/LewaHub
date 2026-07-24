const quickLinks = [
  { name: "Privacy Policy", href: "#" },
  { name: "Terms of Service", href: "#" },
  { name: "Support", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border-light mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
         
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-teal-primary">LewaHub</span>
            <p className="text-sm text-text-muted mt-2 max-w-md">
              Building a transparent educational future for Cameroon, one school
              at a time.
            </p>
          </div>

          
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex items-center gap-5">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-text-muted hover:text-teal-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <p className="text-xs text-text-muted">
              &copy; 2026 LewaHub School Catalog. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}