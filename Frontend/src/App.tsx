import { Routes, Route } from 'react-router-dom'
import About from './pages/About'
import ContactPage from './pages/ContactPage'
import SchoolDetailsPage from './pages/SchoolDetailsPage'
import { SearchPage } from './features/search'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/school/:id" element={<SchoolDetailsPage />} />
    </Routes>
  )
}

export default App
