import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cancelBooking, fetchBookings } from '../lib/supabaseClient'

export default function ProfilePage({ data = [], favorites = [], user = null, userId }) {
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' })

  const favoriteSpots = useMemo(() => {
    return data.filter((spot) => favorites.includes(spot.id))
  }, [data, favorites])

  const activeBookings = useMemo(() => {
    return bookings.filter((booking) => booking.status !== 'cancelled')
  }, [bookings])

  const totalEstimatedSpend = useMemo(() => {
    return activeBookings.reduce((sum, booking) => {
      return sum + Number(booking?.parking_spots?.price || 0)
    }, 0)
  }, [activeBookings])

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'P'

  const loadBookings = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const rows = await fetchBookings(userId)
      setBookings((rows || []).filter((booking) => booking.status !== 'cancelled'))
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setActionMessage({ type: 'error', text: 'לא ניתן לטעון את ההזמנות כרגע' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [userId])

  const showMessage = (type, text) => {
    setActionMessage({ type, text })
    window.setTimeout(() => setActionMessage({ type: '', text: '' }), 3000)
  }

  const handleGoToPayment = (booking) => {
    navigate('/payment', { state: { booking } })
  }

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm('לבטל את ההזמנה הזו?')
    if (!confirmCancel) return

    const previousBookings = bookings

    try {
      setActionLoadingId(bookingId)
      setBookings((prev) => prev.filter((booking) => String(booking.id) !== String(bookingId)))

      await cancelBooking(bookingId)
      await loadBookings()

      showMessage('success', 'ההזמנה בוטלה והוסרה מהרשימה')
    } catch (error) {
      console.error('Error cancelling booking:', error)
      setBookings(previousBookings)
      showMessage('error', 'לא ניתן לבטל את ההזמנה כרגע')
    } finally {
      setActionLoadingId(null)
    }
  }

  const formatDate = (value) => {
    if (!value) return 'לא זמין'

    return new Date(value).toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatTime = (value) => {
    if (!value) return 'לא זמין'

    return new Date(value).toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getBookingStart = (booking) => booking.starts_at || booking.start_time || booking.start_date
  const getBookingEnd = (booking) => booking.ends_at || booking.end_time || booking.end_date

  const renderFavoriteCard = (spot) => (
    <article key={spot.id} className="profile-favorite-card">
      <div className="favorite-card-icon">❤️</div>

      <div>
        <p className="mini-label">חניה מועדפת</p>
        <h3>{spot.title}</h3>
        <p className="detail-meta">📍 {spot.location}</p>
      </div>

      <div className="favorite-card-footer">
        <strong>₪{spot.price}</strong>
        <Link className="btn secondary" to={`/parking/${spot.id}`}>
          פרטים
        </Link>
      </div>
    </article>
  )

  const renderBookingCard = (booking) => {
    const spot = booking.parking_spots
    const title = spot?.title || 'חניה'
    const location = spot?.location || 'מיקום לא זמין'
    const price = spot?.price ? `₪${spot.price}` : 'לא זמין'
    const start = getBookingStart(booking)
    const end = getBookingEnd(booking)
    const isCancelling = actionLoadingId === booking.id

    return (
      <article key={booking.id} className="profile-booking-card">
        <div className="profile-booking-media">
          <span>🅿️</span>
        </div>

        <div className="profile-booking-content">
          <div className="booking-card-header">
            <div>
              <p className="mini-label">הזמנה פעילה</p>
              <h3>{title}</h3>
              <p className="detail-meta">📍 {location}</p>
            </div>

            <span className="status-pill available">מאושרת</span>
          </div>

          <div className="booking-details-list premium-details-list">
            <p>
              <span>תאריך</span>
              <strong>{formatDate(start)}</strong>
            </p>

            <p>
              <span>שעה</span>
              <strong>{formatTime(start)}–{formatTime(end)}</strong>
            </p>

            <p>
              <span>מחיר משוער</span>
              <strong>{price}</strong>
            </p>

            <p>
              <span>סטטוס</span>
              <strong>מאושרת</strong>
            </p>
          </div>

          <div className="actions">
            {spot?.id && (
              <Link className="btn secondary" to={`/parking/${spot.id}`}>
                צפייה בחניה
              </Link>
            )}

            <button className="btn primary" onClick={() => handleGoToPayment(booking)}>
              מעבר לתשלום
            </button>

            <button
              className="btn danger"
              onClick={() => handleCancelBooking(booking.id)}
              disabled={isCancelling}
            >
              {isCancelling ? 'מבטל...' : 'ביטול הזמנה'}
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <main className="container page-section profile-page" dir="rtl">
      <section className="premium-profile-hero">
        <div className="profile-user-card">
          <div className="profile-avatar">{userInitial}</div>

          <div>
            <p className="eyebrow">הפרופיל שלי</p>
            <h1>שלום, {user?.email || 'משתמש Parkly'}</h1>
            <p>
              כאן אפשר לנהל את החניות השמורות, לראות הזמנות פעילות ולעבור
              לתשלום בצורה מהירה.
            </p>
          </div>
        </div>

        <div className="profile-summary clean-summary">
          <div>
            <strong>{favoriteSpots.length}</strong>
            <span>חניות שמורות</span>
          </div>

          <div>
            <strong>{activeBookings.length}</strong>
            <span>הזמנות פעילות</span>
          </div>

          <div>
            <strong>₪{totalEstimatedSpend}</strong>
            <span>סכום משוער</span>
          </div>
        </div>
      </section>

      {actionMessage.text && (
        <div className={`card-feedback ${actionMessage.type}`} role="status">
          {actionMessage.text}
        </div>
      )}

      <section className="profile-dashboard-strip">
        <div>
          <span>🔐</span>
          <strong>{user ? 'מחובר לחשבון מאובטח' : 'מצב אורח'}</strong>
          <small>Supabase Authentication</small>
        </div>

        <div>
          <span>🛒</span>
          <strong>עגלה ותשלום</strong>
          <small>Checkout דמו מלא</small>
        </div>

        <div>
          <span>📍</span>
          <strong>חניות בזמן אמת</strong>
          <small>נתונים מ־Supabase</small>
        </div>
      </section>

      <section className="page-section profile-favorites">
        <header className="page-header">
          <div>
            <p className="eyebrow">מועדפים שלי</p>
            <h2>חניות שמורות</h2>
            <p className="page-description">כל החניות ששמרת לגישה מהירה.</p>
          </div>
        </header>

        {favoriteSpots.length === 0 ? (
          <div className="empty-state premium-empty">
            <div className="empty-icon">❤️</div>
            <h2>אין עדיין חניות שמורות</h2>
            <p>שמרי חניה מדף החניות כדי לראות אותה כאן.</p>
            <Link className="btn primary" to="/dashboard">
              חיפוש חניות
            </Link>
          </div>
        ) : (
          <div className="profile-favorites-grid">{favoriteSpots.map(renderFavoriteCard)}</div>
        )}
      </section>

      <section className="page-section">
        <header className="page-header">
          <div>
            <p className="eyebrow">הזמנות שלי</p>
            <h2>סיכום הזמנות</h2>
            <p className="page-description">ההזמנות הפעילות שבוצעו דרך Parkly.</p>
          </div>
        </header>

        {loading ? (
          <div className="empty-state premium-empty">
            <div className="spinner" aria-hidden="true" />
            <h2>טוען הזמנות...</h2>
          </div>
        ) : activeBookings.length === 0 ? (
          <div className="empty-state premium-empty">
            <div className="empty-icon">🧾</div>
            <h2>אין הזמנות פעילות</h2>
            <p>הזמיני חניה כדי לראות כאן את פרטי ההזמנה.</p>
            <Link className="btn primary" to="/dashboard">
              מציאת חניה
            </Link>
          </div>
        ) : (
          <div className="profile-booking-grid">{activeBookings.map(renderBookingCard)}</div>
        )}
      </section>
    </main>
  )
}