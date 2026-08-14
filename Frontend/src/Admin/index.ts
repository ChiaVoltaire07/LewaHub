/**
 * Admin Panel Exports
 */

// Pages
export { LoginPage } from "./pages/LoginPage";
export { DashboardPage } from "./pages/DashboardPage";
export { SchoolsPage } from "./pages/SchoolsPage";
export { SchoolDetailsPage } from "./pages/SchoolDetailsPage";
export { EditSchoolPage } from "./pages/EditSchoolPage";
export { CreateSchoolPage } from "./pages/CreateSchoolPage";
export { SettingsPage } from "./pages/SettingsPage";
export { ImagesPage } from "./pages/ImagesPage";

// Layout
export { AdminLayout } from "./components/layout/AdminLayout";
export { AdminSidebar } from "./components/layout/AdminSidebar";
export { AdminHeader } from "./components/layout/AdminHeader";

// Common Components
export { AdminRoute } from "./components/common/AdminRoute";
export { ConfirmDialog } from "./components/common/ConfirmDialog";
export { AdminSkeleton } from "./components/common/AdminSkeleton";
export { StatusBadge } from "./components/common/StatusBadge";
export { PageHeader } from "./components/common/PageHeader";

// School Components
export { SchoolForm } from "./components/school/SchoolForm";
export { ImageManager } from "./components/school/ImageManager";
export { MapPreview } from "./components/school/MapPreview";

// Hooks
export { AdminAuthProvider, useAdminAuth } from "./hooks/useAdminAuth";

// Services
export { adminApi } from "./services/adminApi";

// Types
export * from "./types";
