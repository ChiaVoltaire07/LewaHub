import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  School,
  Image as ImageIcon,
  Settings,
  LogOut,
  X
} from "lucide-react";
import { useAdminAuth } from "../../hooks/useAdminAuth";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/schools", icon: School, label: "Schools" },
  { to: "/admin/images", icon: ImageIcon, label: "Images" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, admin } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-border-light">
      {/* Logo & Close Button */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
        <Link to="/admin" className="text-xl font-bold text-teal-primary tracking-tight">
          LewaHub Admin
        </Link>
        <button
          onClick={onClose}
          className="md:hidden p-2 text-text-muted hover:text-text-dark rounded-lg hover:bg-bg-soft transition-colors"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to ||
            (to !== "/admin" && location.pathname.startsWith(to));

          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-light text-teal-primary"
                  : "text-text-dark hover:bg-bg-soft"
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Admin Info & Logout */}
      <div className="border-t border-border-light px-3 py-4">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
            Signed in as
          </p>
          <p className="text-sm font-medium text-text-dark truncate">{admin?.name}</p>
          <p className="text-xs text-text-muted truncate">{admin?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-dark hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
