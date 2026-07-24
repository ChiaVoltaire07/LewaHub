import React, { useRef } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import StatusBadges from './components/StatusBadges';
import MainContent from './components/MainContent';
import BottomActionBar from './components/BottomActionBar';
import Footer from './components/Footer';

function App() {
  const mapRef = useRef(null);

  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />
        <StatusBadges />
        <MainContent mapRef={mapRef} />
      </main>
      <Footer />
      <BottomActionBar scrollToMap={scrollToMap} />
    </div>
  );
}

export default App;