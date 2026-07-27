import { Routes, Route } from 'react-router-dom'
import About from './pages/About'
import ContactPage from './pages/ContactPage'

function App() {
  return (
    <Routes>
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  )
}

export default App
