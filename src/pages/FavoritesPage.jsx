import React, { useState } from 'react'
import ParkingCard from '../components/ParkingCard'
import { createBooking } from '../lib/supabaseClient'

export default function FavoritesPage({ data = [], favorites = [], onToggleFavorite, userId }) {
  const [bookingStatus, setBookingStatus] = useState(null)
  const favs = data.filter((p) => favorites.includes(p.id))

  const handleBook = async (id) => {
    try {
      await createBooking(userId, id)
      setBookingStatus('ההזמנה נוצרה בהצלחה!')
    } catch (error) {
      console.error('Favorites booking failed:', error)
      setBookingStatus('לא ניתן להזמין כרגע. נסה שוב מאוחר יותר.')
    }
  }

  return (
    <main className="container page-section">
      <section className="page-header">
        <div>
          <p className="eyebrow">מועדפים</p>
          <h1>החניות השמורות שלך</h1>
          <p className="page-description">מציג את כל החניות שסימנת לשמירה. שמור והזמן חניה במהירות.</p>
        </div>
      </section>

      {bookingStatus && (
        <div className="empty-state" style={{ borderColor: 'rgba(34, 197, 94, 0.2)', background: 'rgba(34, 197, 94, 0.08)' }}>
          <h2>{bookingStatus}</h2>
        </div>
      )}

      {favs.length === 0 ? (
        <div className="empty-state">
          <h2>אין עדיין חניות שמורות</h2>
          <p>עבור אל עמוד החניות ושמור חניה כדי לראות אותה כאן.</p>
        </div>
      ) : (
        <div className="grid">
          {favs.map((spot) => (
            <ParkingCard key={spot.id} spot={spot} isFavorite onToggleFavorite={onToggleFavorite} onBook={handleBook} />
          ))}
        </div>
      )}
    </main>
  )
}
