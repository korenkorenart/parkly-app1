import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { createBooking } from '../lib/supabaseClient'

export default function ParkingDetailsPage({ data = [], onToggleFavorite = () => {}, favorites = [], userId }) {
  const [bookingStatus, setBookingStatus] = useState(null)
  const { id } = useParams()
  const spot = data.find((p) => p.id === id)
  if (!spot) return <div className="container">חניה לא נמצאה</div>

  const handleBook = async () => {
    if (!spot.available) return

    try {
      await createBooking(userId, spot.id)
      setBookingStatus('ההזמנה נקלטה בהצלחה!')
    } catch (error) {
      console.error('Booking failed:', error)
      setBookingStatus('אירעה שגיאה בהזמנה, נסה שוב מאוחר יותר.')
    }
  }

  return (
    <main className="container page-section">
      <section className="parking-card" aria-labelledby="parking-title">
        <div>
          <p className="eyebrow">פרטי חניה</p>
          <h2 id="parking-title">{spot.title}</h2>
          <p className="detail-meta">{spot.location} • ₪{spot.price} • {spot.available ? 'פנוי' : 'לא פנוי'}</p>
        </div>
        <p>{spot.description}</p>
        <div className="actions">
          <button className="btn secondary" onClick={() => onToggleFavorite(spot.id)}>{favorites.includes(spot.id) ? 'הוסר מהמועדפים' : 'שמור במועדפים'}</button>
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
          <button className="btn primary" onClick={handleBook} disabled={!spot.available}>{spot.available ? 'הזמן עכשיו' : 'לא זמין'}</button>
        </div>
        {bookingStatus && <p className="page-description" style={{ marginTop: '14px' }}>{bookingStatus}</p>}
      </section>
    </main>
  )
}
