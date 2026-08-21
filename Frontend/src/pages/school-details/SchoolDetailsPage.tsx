import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/school-details.css";
import HeroBanner from "./components/HeroBanner";
import StatusBadges from "./components/StatusBadges";
import MainContent from "./components/MainContent";
import BottomActionBar from "./components/BottomActionBar";
import { SchoolContext } from "./context/SchoolContext";
import api from "../../lib/api";
import type { SchoolDetail } from "../../types/school";

export default function SchoolDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [school, setSchool] = useState<SchoolDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSchool = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const response = await api.getSchool(id);
    if (response.error) {  // ← Check for error instead
  setError(response.error);
  setSchool(null);
} else {
  setSchool(response.data as SchoolDetail);
  setError(null);
}
    setLoading(false);
  };

  useEffect(() => {
    loadSchool();
  }, [id]);

  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <SchoolContext.Provider value={{ school, error, loading }}>
      <div className="min-h-screen flex flex-col school-details-page">
        <main className="flex-1">
          <HeroBanner />
          <StatusBadges />
          <MainContent mapRef={mapRef} />
        </main>
        <BottomActionBar scrollToMap={scrollToMap} />
      </div>
    </SchoolContext.Provider>
  );
}
