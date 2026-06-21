import React from 'react'
import { useParams } from 'react-router-dom'

export default function ParkingDetailsPage({ data = [], onToggleFavorite = () => {}, favorites = [] }) {
  const { id } = useParams()
  const spot = data.find((p) => p.id === id)
  if (!spot) return <div className="container">חניה לא נמצאה</div>

  const handleBook = () => alert('ההזמנה בוצעה בהצלחה!')

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
          <button className="btn primary" onClick={handleBook} disabled={!spot.available}>{spot.available ? 'הזמן עכשיו' : 'לא זמין'}</button>
        </div>
      </section>
    </main>
  )
}
