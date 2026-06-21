import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar({ supabaseConnected }) {
  return (
    <nav className="navbar" aria-label="ניווט ראשי באתר">
      <div className="nav-inner container">
        <div className="brand">Parkly</div>
        <div className="links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>בית</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>חניות</NavLink>
          <NavLink to="/map" className={({ isActive }) => (isActive ? 'active' : '')}>מפה</NavLink>
          <NavLink to="/favorites" className={({ isActive }) => (isActive ? 'active' : '')}>מועדפים</NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>פרופיל</NavLink>
        </div>
        <div className="status-chip" aria-live="polite">
          {supabaseConnected ? 'מחובר ל‑Supabase' : 'מצב דמו'}
        </div>
      </div>
    </nav>
  )
}
