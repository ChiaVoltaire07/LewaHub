import { useRef } from "react";
import { useParams } from "react-router-dom";
import "../../styles/school-details.css";
import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import StatusBadges from "./components/StatusBadges";
import MainContent from "./components/MainContent";
import BottomActionBar from "./components/BottomActionBar";
import Footer from "../../components/layout/Footer/Footer";

export default function SchoolDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const mapRef = useRef<HTMLDivElement | null>(null);

  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col school-details-page">
      <Navbar />
      <main className="flex-1">
        <HeroBanner schoolId={id} />
        <StatusBadges />
        <MainContent mapRef={mapRef} schoolId={id} />
      </main>
      <Footer />
      <BottomActionBar scrollToMap={scrollToMap} />
    </div>
  );
}
