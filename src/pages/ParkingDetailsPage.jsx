import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createBooking } from '../lib/supabaseClient'

export default function ParkingDetailsPage({
  data = [],
  onToggleFavorite = () => {},
  favorites = [],
  userId,
}) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [bookingStatus, setBookingStatus] = useState('')
  const [createdBooking, setCreatedBooking] = useState(null)
  const [loading, setLoading] = useState(false)

  const spot = data.find((p) => String(p.id) === String(id))

  if (!spot) {
    return (
      <main className="container page-section" dir="rtl">
        <div className="empty-state">
          <h1>חניה לא נמצאה</h1>
          <p>ייתכן שהחניה נמחקה או שהקישור אינו תקין.</p>
          <button className="btn primary" onClick={() => navigate('/dashboard')}>
            חזרה לחיפוש חניות
          </button>
        </div>
      </main>
    )
  }

  const buildBookingForNavigation = (bookingRow) => ({
    ...(bookingRow || {}),
    id: bookingRow?.id || crypto.randomUUID(),
    user_id: userId,
    parking_spot_id: spot.id,
    status: bookingRow?.status || 'confirmed',
    starts_at: bookingRow?.starts_at || new Date().toISOString(),
    ends_at: bookingRow?.ends_at || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    parking_spots: spot,
  })

  const saveToCart = (booking) => {
    const currentCart = JSON.parse(localStorage.getItem('parklyCart') || '[]')
    const exists = currentCart.some((item) => String(item.id) === String(booking.id))

    if (!exists) {
      localStorage.setItem('parklyCart', JSON.stringify([...currentCart, booking]))
    }
  }

  const handleBook = async () => {
    if (!spot.available || loading) return

    try {
      setLoading(true)
      setBookingStatus('')

      const bookingRow = await createBooking(userId, spot.id)
      const bookingForNavigation = buildBookingForNavigation(bookingRow)

      setCreatedBooking(bookingForNavigation)
      saveToCart(bookingForNavigation)

      setBookingStatus('ההזמנה נקלטה בהצלחה! בחרי איך להמשיך.')
    } catch (error) {
      console.error('Booking failed:', error)
      setBookingStatus('אירעה שגיאה בהזמנה, נסי שוב מאוחר יותר.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoToPayment = () => {
    if (!createdBooking) return

    navigate('/payment', {
      state: {
        booking: createdBooking,
      },
    })
  }

  const handleGoToCart = () => {
    navigate('/cart')
  }

  return (
    <main className="container page-section parking-details-page" dir="rtl">
      <section className="parking-card" aria-labelledby="parking-title">
        <div>
          <p className="eyebrow">פרטי חניה</p>
          <h2 id="parking-title">{spot.title}</h2>

          <p className="detail-meta">
            {spot.location} • ₪{spot.price} • {spot.available ? 'פנוי' : 'לא פנוי'}
          </p>
        </div>

        <p>{spot.description}</p>

        <div className="actions">
          <button className="btn secondary" onClick={() => onToggleFavorite(spot.id)}>
            {favorites.includes(spot.id) ? 'הסר מהמועדפים' : 'שמור במועדפים'}
          </button>

          {spot.lat && spot.lng && (
            <a
              className="btn secondary map-link"
              href={`https://www.openstreetmap.org/?mlat=${spot.lat}&mlon=${spot.lng}#map=14/${spot.lat}/${spot.lng}`}
              target="_blank"
              rel="noreferrer"
            >
              פתח במפה
            </a>
          )}

          <button className="btn primary" onClick={handleBook} disabled={!spot.available || loading}>
            {loading ? 'מבצע הזמנה...' : spot.available ? 'הזמן עכשיו' : 'לא זמין'}
          </button>
        </div>

        {bookingStatus && (
          <div className="card-feedback success" role="status" style={{ marginTop: '16px' }}>
            {bookingStatus}
          </div>
        )}

        {createdBooking && (
          <div className="booking-next-actions">
            <h3>מה תרצי לעשות עכשיו?</h3>

            <div className="actions">
              <button className="btn primary" onClick={handleGoToPayment}>
                מעבר לתשלום
              </button>

              <button className="btn secondary" onClick={handleGoToCart}>
                המשך הזמנה
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}