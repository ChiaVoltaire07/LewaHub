import { useRef } from 'react'
import HeroBanner from '../components/HeroBanner'
import StatusBadges from '../components/StatusBadges'
import MainContent from '../components/MainContent'
import BottomActionBar from '../components/BottomActionBar'

function SchoolDetailsPage() {
  const mapRef = useRef<HTMLDivElement>(null)

  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroBanner />
        <StatusBadges />
        <MainContent mapRef={mapRef} />
      </main>
      <BottomActionBar scrollToMap={scrollToMap} />
    </div>
  )
}

export default SchoolDetailsPage
