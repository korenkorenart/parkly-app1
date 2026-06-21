import React, { useMemo, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import parkingData from './data/parkingData'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import MapPage from './pages/MapPage'
import ParkingDetailsPage from './pages/ParkingDetailsPage'
import FavoritesPage from './pages/FavoritesPage'
import ProfilePage from './pages/ProfilePage'
import TermsPage from './pages/TermsPage'

export default function App() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites')) || []
    } catch {
      return []
    }
  })

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const exists = prev.includes(id)
      const next = exists ? prev.filter((i) => i !== id) : [...prev, id]
      localStorage.setItem('favorites', JSON.stringify(next))
      return next
    })
  }

  const data = useMemo(() => parkingData, [])

  return (
    <div className="app-root">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage data={data} favorites={favorites} onToggleFavorite={toggleFavorite} />} />
          <Route path="/map" element={<MapPage data={data} />} />
          <Route path="/parking/:id" element={<ParkingDetailsPage data={data} onToggleFavorite={toggleFavorite} favorites={favorites} />} />
          <Route path="/favorites" element={<FavoritesPage data={data} favorites={favorites} onToggleFavorite={toggleFavorite} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
