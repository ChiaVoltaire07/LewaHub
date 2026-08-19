import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./hooks/useAdminAuth";
import { AdminRoute } from "./components/common/AdminRoute";
import { AdminLayout } from "./components/layout/AdminLayout";

const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage }))
);
const SchoolsPage = lazy(() =>
  import("./pages/SchoolsPage").then((m) => ({ default: m.SchoolsPage }))
);
const AdminSchoolDetailsPage = lazy(() =>
  import("./pages/SchoolDetailsPage").then((m) => ({ default: m.SchoolDetailsPage }))
);
const EditSchoolPage = lazy(() =>
  import("./pages/EditSchoolPage").then((m) => ({ default: m.EditSchoolPage }))
);
const CreateSchoolPage = lazy(() =>
  import("./pages/CreateSchoolPage").then((m) => ({ default: m.CreateSchoolPage }))
);
const ImagesPage = lazy(() =>
  import("./pages/ImagesPage").then((m) => ({ default: m.ImagesPage }))
);
const SettingsPage = lazy(() =>
  import("./pages/SettingsPage").then((m) => ({ default: m.SettingsPage }))
);

function AdminPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-soft">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-teal-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-muted">Loading...</p>
      </div>
    </div>
  );
}

export default function AdminRoutes() {
  return (
    <AdminAuthProvider>
      <Suspense fallback={<AdminPageLoader />}>
        {/* Admin Login (No Auth Required) */}
        <Routes>
          <Route path="login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="" element={<DashboardPage />} />
              <Route path="schools" element={<SchoolsPage />} />
              <Route path="schools/new" element={<CreateSchoolPage />} />
              <Route path="schools/:id" element={<AdminSchoolDetailsPage />} />
              <Route path="schools/:id/edit" element={<EditSchoolPage />} />
              <Route path="images" element={<ImagesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </AdminAuthProvider>
  );
}
