import React, { useEffect, useMemo, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import {
  fetchParkingSpots,
  fetchFavorites,
  addFavorite,
  removeFavorite,
  signOut,
  getSession,
  onAuthStateChange,
} from './lib/supabaseClient'
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
import PrivacyPage from './pages/PrivacyPage'
import ProtectedRoute from './components/ProtectedRoute'
import PaymentPage from './pages/PaymentPage'
import CartPage from './pages/CartPage'

const hasSupabase = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function App() {
  const navigate = useNavigate()

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites')) || []
    } catch {
      return []
    }
  })

  const [data, setData] = useState([])
  const [supabaseConnected, setSupabaseConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [toast, setToast] = useState({ type: '', text: '' })

  const showToast = (type, text) => {
    setToast({ type, text })
    window.setTimeout(() => setToast({ type: '', text: '' }), 3200)
  }

  useEffect(() => {
    const handleGlobalToast = (event) => {
      const { type = 'success', text = '' } = event.detail || {}
      if (text) showToast(type, text)
    }

    window.addEventListener('parkly-toast', handleGlobalToast)

    return () => {
      window.removeEventListener('parkly-toast', handleGlobalToast)
    }
  }, [])

  const userId = useMemo(() => {
    if (session?.user?.id) return session.user.id

    let id = localStorage.getItem('parklyUserId')
    if (!id) {
      id = `demo-user-${Date.now()}`
      localStorage.setItem('parklyUserId', id)
    }

    return id
  }, [session])

  useEffect(() => {
    if (!hasSupabase) return

    let active = true

    getSession()
      .then((sessionData) => {
        if (!active || !sessionData) return
        setSession(sessionData)
        setUser(sessionData.user)
      })
      .catch(() => {})

    const authListener = onAuthStateChange((event, authSession) => {
      if (!active) return

      setSession(authSession)
      setUser(authSession?.user ?? null)

      if (event === 'SIGNED_OUT') {
        setFavorites([])
        localStorage.removeItem('favorites')
        showToast('success', 'התנתקת מהמערכת בהצלחה')
      }
    })

    return () => {
      active = false
      authListener?.data?.subscription?.unsubscribe?.()
    }
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
        showToast('error', 'לא ניתן לטעון חניות מ־Supabase כרגע')
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
      .catch(() => {})

    return () => {
      active = false
    }
  }, [userId])

  const handleSignOut = async () => {
    if (!hasSupabase) {
      setSession(null)
      setUser(null)
      navigate('/login')
      showToast('success', 'התנתקת מהמערכת')
      return
    }

    try {
      await signOut()
      setSession(null)
      setUser(null)
      setFavorites([])
      navigate('/login')
    } catch (error) {
      console.error('שגיאת יציאה:', error)
      showToast('error', 'לא ניתן להתנתק כרגע')
    }
  }

  const toggleFavorite = async (id) => {
    const exists = favorites.includes(id)
    const next = exists ? favorites.filter((i) => i !== id) : [...favorites, id]

    setFavorites(next)
    localStorage.setItem('favorites', JSON.stringify(next))

    if (!hasSupabase) {
      showToast('success', exists ? 'החניה הוסרה מהמועדפים' : 'החניה נשמרה במועדפים')
      return
    }

    try {
      if (exists) {
        await removeFavorite(userId, id)
        showToast('success', 'החניה הוסרה מהמועדפים')
      } else {
        await addFavorite(userId, id)
        showToast('success', 'החניה נשמרה במועדפים')
      }
    } catch (error) {
      setFavorites(favorites)
      localStorage.setItem('favorites', JSON.stringify(favorites))
      console.error('שגיאת שמירת מועדפים:', error)
      showToast('error', 'לא ניתן לעדכן מועדפים כרגע')
    }
  }

  return (
    <div className="app-root">
      <Navbar supabaseConnected={supabaseConnected} user={user} onSignOut={handleSignOut} />

      {toast.text && (
        <div className={`toast ${toast.type}`} role="status" aria-live="polite">
          <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <strong>{toast.text}</strong>
        </div>
      )}

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage supabaseConnected={supabaseConnected} />} />
          <Route path="/login" element={<LoginPage session={session} />} />
          <Route path="/register" element={<RegisterPage session={session} />} />

          <Route
            path="/dashboard"
            element={
              <DashboardPage
                data={data}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                loading={loading}
                userId={userId}
              />
            }
          />

          <Route path="/map" element={<MapPage data={data} />} />

          <Route
            path="/parking/:id"
            element={
              <ParkingDetailsPage
                data={data}
                onToggleFavorite={toggleFavorite}
                favorites={favorites}
                userId={userId}
              />
            }
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute isAuthenticated={!!session || !hasSupabase}>
                <FavoritesPage
                  data={data}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  userId={userId}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={!!session || !hasSupabase}>
                <ProfilePage data={data} favorites={favorites} user={user} userId={userId} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute isAuthenticated={!!session || !hasSupabase}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute isAuthenticated={!!session || !hasSupabase}>
                <CartPage />
              </ProtectedRoute>
            }
          />

          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}