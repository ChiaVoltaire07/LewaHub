import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import InstitutionsListPage from "./pages/InstitutionsListPage";
import InstitutionFormPage from "./pages/InstitutionFormPage";
import EvaluationsPage from "./pages/EvaluationsPage";
import SummaryReviewPage from "./pages/SummaryReviewPage";

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
          <Route path="institutions" element={<InstitutionsListPage />} />
          <Route path="institutions/new" element={<InstitutionFormPage />} />
          <Route path="institutions/:id/edit" element={<InstitutionFormPage />} />
          <Route path="institutions/:id/summary" element={<SummaryReviewPage />} />
          <Route path="evaluations/new" element={<EvaluationsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}