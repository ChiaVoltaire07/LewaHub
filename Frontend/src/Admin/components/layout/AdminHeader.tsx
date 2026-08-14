import { Menu } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  breadcrumbs?: Array<{ label: string; to?: string }>;
  onMenuClick: () => void;
}

export function AdminHeader({ title, breadcrumbs, onMenuClick }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border-light">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 text-text-muted hover:text-text-dark rounded-lg hover:bg-bg-soft transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div>
            <h1 className="text-xl font-semibold text-text-dark">{title}</h1>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                {breadcrumbs.map((crumb, index) => (
                  <span key={index}>
                    {index > 0 && <span className="mx-1">/</span>}
                    {crumb.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
