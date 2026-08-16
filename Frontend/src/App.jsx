import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import QuickLinks from './components/QuickLinks.jsx';
import FeaturedSchools from './components/FeaturedSchools.jsx';
import CTA from './components/CTA.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main>
        <Hero />
        <QuickLinks />
        <FeaturedSchools />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}