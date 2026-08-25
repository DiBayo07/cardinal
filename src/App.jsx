import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AdminPanel from './pages/AdminPanel'
import CountryLanding from './pages/CountryLanding'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/cp" element={<AdminPanel />} />
      <Route path="/:countryId" element={<CountryLanding />} />
    </Routes>
  )
}

export default App
