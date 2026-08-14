import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./features/home/pages/HomePage";
import { SearchPage } from "./features/search";
import About from "./pages/about/About";
import ContactPage from "./pages/contact/ContactPage";
import SchoolDetailsPage from "./pages/school-details/SchoolDetailsPage";
import PrivacyPolicyPage from "./pages/privacy/PrivacyPolicyPage";
import TermsPage from "./pages/terms/TermsPage";

// Admin imports
import {
  AdminAuthProvider,
  AdminRoute,
  AdminLayout,
  LoginPage,
  DashboardPage,
  SchoolsPage,
  SchoolDetailsPage as AdminSchoolDetailsPage,
  EditSchoolPage,
  CreateSchoolPage,
  ImagesPage,
  SettingsPage,
} from "./Admin";

export default function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/school/:id?" element={<SchoolDetailsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>

        {/* Admin Login (No Auth Required) */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/schools" element={<SchoolsPage />} />
            <Route path="/admin/schools/new" element={<CreateSchoolPage />} />
            <Route path="/admin/schools/:id" element={<AdminSchoolDetailsPage />} />
            <Route path="/admin/schools/:id/edit" element={<EditSchoolPage />} />
            <Route path="/admin/images" element={<ImagesPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}