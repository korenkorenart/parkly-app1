import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  FaBars,
  FaHeart,
  FaHome,
  FaMapMarkedAlt,
  FaMoon,
  FaParking,
  FaShoppingCart,
  FaSun,
  FaTimes,
  FaUserCircle,
} from 'react-icons/fa'

export default function Navbar({ supabaseConnected, user, onSignOut }) {
  const [open, setOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('parklyTheme') === 'dark')

  const closeMenu = () => setOpen(false)

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
    localStorage.setItem('parklyTheme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    const updateCartCount = () => {
      try {
        setCartCount((JSON.parse(localStorage.getItem('parklyCart')) || []).length)
      } catch {
        setCartCount(0)
      }
    }

    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    window.addEventListener('parkly-cart-updated', updateCartCount)

    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('parkly-cart-updated', updateCartCount)
    }
  }, [])

  const firstLetter = user?.email ? user.email.charAt(0).toUpperCase() : 'P'

  return (
    <nav className="navbar" aria-label="ניווט ראשי באתר">
      <div className="nav-inner container">
        <div className="nav-brand-wrap">
          <NavLink to="/" className="brand" onClick={closeMenu}>
            <span className="brand-icon">
              <FaParking />
            </span>
            <span>Parkly</span>
          </NavLink>

          <button
            className="btn subtle mobile-toggle"
            aria-label={open ? 'סגור תפריט' : 'פתח תפריט'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className={`links ${open ? 'open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaHome className="nav-icon" />
            בית
          </NavLink>

          <NavLink to="/dashboard" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaParking className="nav-icon" />
            חניות
          </NavLink>

          <NavLink to="/map" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaMapMarkedAlt className="nav-icon" />
            מפה
          </NavLink>

          <NavLink to="/favorites" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaHeart className="nav-icon" />
            מועדפים
          </NavLink>

          <NavLink
            to="/cart"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? 'active cart-nav-link' : 'cart-nav-link')}
          >
            <FaShoppingCart className="nav-icon" />
            עגלה
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>

          <NavLink to="/profile" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaUserCircle className="nav-icon" />
            פרופיל
          </NavLink>
        </div>

        <div className="user-chip" aria-live="polite">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setDarkMode((value) => !value)}
            aria-label={darkMode ? 'עבור למצב בהיר' : 'עבור למצב כהה'}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <div className="user-avatar">{firstLetter}</div>

          <div className="user-chip-text">
            {user ? (
              <>
                <strong>שלום, {user.email}</strong>
                <span>מחובר לחשבון</span>
              </>
            ) : (
              <>
                <strong>{supabaseConnected ? 'לא מחובר' : 'מצב דמו'}</strong>
                <span>Parkly Demo</span>
              </>
            )}
          </div>

          {user && (
            <button type="button" className="btn subtle logout-btn" onClick={onSignOut}>
              התנתק
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}