import React, { useEffect, useState } from 'react'
import { fetchBookings } from '../lib/supabaseClient'

export default function ProfilePage({ data = [], favorites = [] }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const userId = localStorage.getItem('parklyUserId')
    if (!userId) return

    setLoading(true)
    fetchBookings(userId)
      .then((rows) => setBookings(rows))
      .catch((error) => console.error('Error fetching bookings:', error))
      .finally(() => setLoading(false))
  }, [])

  const favoriteSpots = data.filter((spot) => favorites.includes(spot.id))
  const userId = localStorage.getItem('parklyUserId') || 'Guest'

  return (
    <main className="container page-section">
      <section className="info-panel" aria-labelledby="profile-title">
        <p className="eyebrow">פרופיל</p>
        <h2 id="profile-title">חשבונך</h2>
        <p>כאן יופיעו פרטי משתמש, מועדפים והזמנות מתוזמנות.</p>
        <div className="profile-summary">
          <div>
            <strong>{favoriteSpots.length}</strong>
            <span>חניות שמורות</span>
          </div>
          <div>
            <strong>{bookings.length}</strong>
            <span>הזמנות</span>
          </div>
          <div>
            <strong>{userId}</strong>
            <span>מזהה משתמש</span>
          </div>
        </div>
      </section>

      <section className="page-section profile-favorites">
        <header className="page-header">
          <div>
            <p className="eyebrow">מועדפים שלי</p>
            <h1>חניות שמורות</h1>
            <p className="page-description">יש לך {favoriteSpots.length} חניות שמורות.</p>
          </div>
        </header>

        {favoriteSpots.length === 0 ? (
          <div className="empty-state">
            <h2>אין עדיין חניות שמורות</h2>
            <p>שמור חניה מדף החניות כדי לראות אותה כאן.</p>
          </div>
        ) : (
          <div className="grid">
            {favoriteSpots.map((spot) => (
              <article key={spot.id} className="parking-card">
                <h3>{spot.title}</h3>
                <p className="detail-meta">{spot.location} · ₪{spot.price}</p>
                <p>{spot.description}</p>
                <div className="actions">
                  <a className="btn secondary" href={`https://www.openstreetmap.org/?mlat=${spot.lat}&mlon=${spot.lng}#map=14/${spot.lat}/${spot.lng}`} target="_blank" rel="noreferrer">
                    פתח במפה
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="page-section">
        <header className="page-header">
          <div>
            <p className="eyebrow">הזמנות שלי</p>
            <h1>סיכום הזמנות</h1>
            <p className="page-description">בדוק את ההזמנות האחרונות שלך ישירות מהמסד.</p>
          </div>
        </header>

        {loading ? (
          <div className="empty-state">
            <h2>טוען הזמנות...</h2>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <h2>אין הזמנות עדיין</h2>
            <p>הזמן חניה כדי לראות פה פרטי הזמנה.</p>
          </div>
        ) : (
          <div className="grid">
            {bookings.map((booking) => (
              <article key={booking.id} className="parking-card">
                <h3>הזמנה #{booking.id}</h3>
                <p className="detail-meta">סטטוס: {booking.status}</p>
                <p>חניה: {booking.parking_spot_id}</p>
                <p>מתחילה: {new Date(booking.starts_at).toLocaleString('he-IL')}</p>
                <p>נגמרת: {new Date(booking.ends_at).toLocaleString('he-IL')}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
