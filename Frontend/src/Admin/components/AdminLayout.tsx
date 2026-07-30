import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/institutions", label: "Institutions" },
  { to: "/admin/evaluations/new", label: "Evaluations" },
];

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = (() => {
    if (location.pathname === "/admin/dashboard") return "Dashboard";
    if (location.pathname.startsWith("/admin/institutions")) {
      if (location.pathname.includes("/new")) return "Add Institution";
      if (location.pathname.includes("/edit")) return "Edit Institution";
      if (location.pathname.includes("/summary")) return "AI Summary Review";
      return "Institutions";
    }
    if (location.pathname.startsWith("/admin/evaluations")) return "Record Evaluation";
    return "Admin";
  })();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6">
        <h1 className="text-[var(--sunbeam)] text-xl font-bold tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>
          LewaHub
        </h1>
        <p className="text-white/60 text-xs mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin/dashboard"}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white w-full transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--paper, #F7F5EF)" }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-screen w-[220px] flex-col z-30"
        style={{ backgroundColor: "var(--forest, #1F5D45)" }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <header
        className="md:hidden flex items-center justify-between px-4 py-3 z-40 relative"
        style={{ backgroundColor: "var(--forest, #1F5D45)" }}
      >
        <div>
          <span className="text-[var(--sunbeam)] font-bold" style={{ fontFamily: "Fraunces, serif" }}>
            LewaHub
          </span>
          <span className="text-white/60 text-xs ml-2">Admin</span>
        </div>
        <span className="text-white text-sm font-medium truncate mx-2">{pageTitle}</span>
        <button
          onClick={() => setMenuOpen(true)}
          className="text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-[260px] z-50 transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "var(--forest, #1F5D45)" }}
      >
        <div className="flex justify-end p-3">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {sidebarContent}
      </div>

      {/* Main content */}
      <main className="md:ml-[220px] min-h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}