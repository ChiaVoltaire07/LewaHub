import "../../../styles/home.css";
import Hero from "../components/Hero/Hero";
import FeatureCards from "../components/FeatureCards/FeatureCards";
import FeaturedSchools from "../components/FeaturedSchools/FeaturedSchools";
import Newsletter from "../components/Newsletter/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureCards />
      <FeaturedSchools />
      <Newsletter />
    </>
  );
}