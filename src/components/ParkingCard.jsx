import React from 'react'
import { Link } from 'react-router-dom'

export default function ParkingCard({ spot, isFavorite, onToggleFavorite, onBook }) {
  return (
    <article className="parking-card">
      <h3>{spot.title}</h3>
      <div className="meta">{spot.location} • ₪{spot.price} • {spot.available ? 'פנוי' : 'לא פנוי'}</div>
      <p>{spot.description}</p>
      <div className="actions">
        <Link to={`/parking/${spot.id}`} className="btn">פרטים</Link>
        <button className="btn" onClick={() => onToggleFavorite(spot.id)}>{isFavorite ? 'הוסר' : 'שמור'}</button>
        <button className="btn primary" onClick={() => onBook(spot.id)} disabled={!spot.available}>הזמן</button>
      </div>
    </article>
  )
}
