import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SchoolsListPage from "./pages/SchoolsListPage";
import SchoolFormPage from "./pages/SchoolFormPage";
import SettingsPage from "./pages/SettingsPage";
import DraftReviewPage from "./pages/DraftReviewPage";

export default function AdminRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          path=""
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="schools" element={<SchoolsListPage />} />
          <Route path="schools/new" element={<SchoolFormPage />} />
          <Route path="schools/:id/edit" element={<SchoolFormPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="drafts" element={<DraftReviewPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}