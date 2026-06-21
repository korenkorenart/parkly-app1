import React, { useEffect, useMemo, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { fetchParkingSpots, fetchFavorites, addFavorite, removeFavorite } from './lib/supabaseClient'
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

const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

export default function App() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites')) || []
    } catch {
      return []
    }
  })
  const [data, setData] = useState(parkingData)
  const [supabaseConnected, setSupabaseConnected] = useState(false)
  const [loading, setLoading] = useState(false)

  const userId = useMemo(() => {
    let id = localStorage.getItem('parklyUserId')
    if (!id) {
      id = `demo-user-${Date.now()}`
      localStorage.setItem('parklyUserId', id)
    }
    return id
  }, [])

  useEffect(() => {
    if (!hasSupabase) return

    let active = true
    setLoading(true)

    fetchParkingSpots()
      .then((rows) => {
        if (active && Array.isArray(rows) && rows.length > 0) {
          setData(rows)
          setSupabaseConnected(true)
        }
      })
      .catch(() => {
        setSupabaseConnected(false)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    fetchFavorites(userId)
      .then((ids) => {
        if (active) {
          setFavorites(ids)
          localStorage.setItem('favorites', JSON.stringify(ids))
        }
      })
      .catch(() => {
        /* fallback to local favorites */
      })

    return () => {
      active = false
    }
  }, [userId])

  const toggleFavorite = async (id) => {
    const exists = favorites.includes(id)
    const next = exists ? favorites.filter((i) => i !== id) : [...favorites, id]
    setFavorites(next)
    localStorage.setItem('favorites', JSON.stringify(next))

    if (!hasSupabase) return

    try {
      if (exists) {
        await removeFavorite(userId, id)
      } else {
        await addFavorite(userId, id)
      }
    } catch (error) {
      setFavorites(favorites)
      localStorage.setItem('favorites', JSON.stringify(favorites))
      console.error('שגיאת שמירת מועדפים:', error)
    }
  }

  return (
    <div className="app-root">
      <Navbar supabaseConnected={supabaseConnected} />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage supabaseConnected={supabaseConnected} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage data={data} favorites={favorites} onToggleFavorite={toggleFavorite} loading={loading} />} />
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
