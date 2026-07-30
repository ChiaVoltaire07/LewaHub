import { Routes, Route } from "react-router-dom";
import HomePage from "./features/home/pages/HomePage";
import { SearchPage } from "./features/search";
import About from "./pages/about/About";
import ContactPage from "./pages/contact/ContactPage";
import SchoolDetailsPage from "./pages/school-details/SchoolDetailsPage";
import AdminRoutes from "./Admin/AdminRoutes";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/school/:id?" element={<SchoolDetailsPage />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}
