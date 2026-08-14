import { useRef } from "react";
import { useParams } from "react-router-dom";
import "../../styles/school-details.css";
import HeroBanner from "./components/HeroBanner";
import StatusBadges from "./components/StatusBadges";
import MainContent from "./components/MainContent";
import BottomActionBar from "./components/BottomActionBar";

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
      <main className="flex-1">
        <HeroBanner schoolId={id} />
        <StatusBadges schoolId={id} />
        <MainContent mapRef={mapRef} schoolId={id} />
      </main>
      <BottomActionBar scrollToMap={scrollToMap} schoolId={id} />
    </div>
  );
}