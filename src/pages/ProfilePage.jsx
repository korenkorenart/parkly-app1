import React, { useEffect, useState } from 'react'
import { fetchBookings } from '../lib/supabaseClient'

export default function ProfilePage() {
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

  return (
    <main className="container page-section">
      <section className="info-panel" aria-labelledby="profile-title">
        <p className="eyebrow">פרופיל</p>
        <h2 id="profile-title">חשבונך</h2>
        <p>כאן יופיעו פרטי משתמש, מועדפים והזמנות מתוזמנות.</p>
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
