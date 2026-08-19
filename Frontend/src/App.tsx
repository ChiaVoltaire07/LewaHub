import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";

const HomePage = lazy(() => import("./features/home/pages/HomePage"));
const SearchPage = lazy(() =>
  import("./features/search/pages/SearchPage").then((m) => ({ default: m.default }))
);
const About = lazy(() => import("./pages/about/About"));
const ContactPage = lazy(() => import("./pages/contact/ContactPage"));
const SchoolDetailsPage = lazy(() => import("./pages/school-details/SchoolDetailsPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/privacy/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/terms/TermsPage"));

const AdminRoutes = lazy(() => import("./Admin/AdminRoutes"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary"></div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
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

        {/* All Admin Routes (lazy-loaded as a group) */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Suspense>
  );
}
