import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer premium-footer" dir="rtl">
      <div className="container footer-grid">
        <section>
          <h2 className="footer-logo">🚗 Parkly</h2>

          <p className="footer-description">
            מערכת חכמה למציאת חניות, שמירת מועדפים, הזמנת חניה וביצוע תשלום
            בצורה מהירה, נוחה ובטוחה.
          </p>

          <div className="footer-badges">
            <span>⚡ Real Time</span>
            <span>🔒 Secure</span>
            <span>📍 Smart Parking</span>
          </div>
        </section>

        <section>
          <h3>ניווט מהיר</h3>

          <nav className="footer-links">
            <Link to="/">בית</Link>
            <Link to="/dashboard">חניות</Link>
            <Link to="/map">מפה</Link>
            <Link to="/favorites">מועדפים</Link>
            <Link to="/profile">הפרופיל שלי</Link>
            <Link to="/cart">עגלת קניות</Link>
          </nav>
        </section>

        <section>
          <h3>מידע</h3>

          <nav className="footer-links">
            <Link to="/privacy">מדיניות פרטיות</Link>
            <Link to="/terms">תנאי שימוש</Link>
          </nav>

          <div className="footer-contact">
            <p>📧 support@parkly.app</p>
            <p>📱 +972-50-1234567</p>
            <p>📍 ישראל</p>
          </div>
        </section>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <span>
            © {new Date().getFullYear()} Parkly. כל הזכויות שמורות.
          </span>

          <span>
            Developed with React • Vite • Supabase
          </span>
        </div>
      </div>
    </footer>
  )
}