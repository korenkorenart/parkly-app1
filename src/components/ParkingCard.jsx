import React from 'react'
import { Link } from 'react-router-dom'

export default function ParkingCard({ spot, isFavorite, onToggleFavorite, onBook }) {
  return (
    <article className="parking-card">
      <div className="card-head">
        <h3>{spot.title}</h3>
        <div className="spot-badges">
          <span className={spot.available ? 'badge available' : 'badge unavailable'}>{spot.available ? 'פנוי' : 'לא זמין'}</span>
          {isFavorite && <span className="badge favorite">שמור</span>}
        </div>
      </div>
      <div className="meta">{spot.location}</div>
      <p>{spot.description}</p>
      <div className="card-foot">
        <div className="price-tag">₪{spot.price}</div>
        <div className="actions">
          <Link to={`/parking/${spot.id}`} className="btn">פרטים</Link>
          {spot.lat && spot.lng && (
            <a
              className="btn secondary map-link"
              href={`https://www.openstreetmap.org/?mlat=${spot.lat}&mlon=${spot.lng}#map=14/${spot.lat}/${spot.lng}`}
              target="_blank"
              rel="noreferrer"
            >
              מפה
            </a>
          )}
          <button className="btn" onClick={() => onToggleFavorite(spot.id)}>{isFavorite ? 'הוסר' : 'שמור'}</button>
          <button className="btn primary" onClick={() => onBook(spot.id)} disabled={!spot.available}>הזמן</button>
        </div>
      </div>
    </article>
  )
}
