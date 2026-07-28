import "../../../styles/home.css";
import Navbar from "../../../components/layout/Navbar/Navbar";
import MobileMenu from "../components/MobileMenu/MobileMenu";
import Hero from "../components/Hero/Hero";
import FeatureCards from "../components/FeatureCards/FeatureCards";
import FeaturedSchools from "../components/FeaturedSchools/FeaturedSchools";
import Newsletter from "../components/Newsletter/Newsletter";
import Footer from "../../../components/layout/Footer/Footer";
import { useNavbar } from "../hooks/useNavbar";

export default function HomePage() {
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useNavbar();

  return (
    <>
      <Navbar onOpenMobileMenu={openMobileMenu} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      <main>
        <Hero />
        <FeatureCards />
        <FeaturedSchools />
        <Newsletter />
      </main>

      <Footer />
    </>
  );
}
