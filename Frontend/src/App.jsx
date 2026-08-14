import Navbar from './components/Navbar'
import Hero from './components/Hero'
import QuickLinks from './components/QuickLinks'
import FeaturedSchools from './components/FeaturedSchools'
import NewsletterCTA from './components/NewsletterCTA'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main>
        <Hero />
        <QuickLinks />
        <FeaturedSchools />
        <NewsletterCTA />
      </main>
      <Footer />
    </div>
  )
}