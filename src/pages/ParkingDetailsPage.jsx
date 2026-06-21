import React from 'react'
import { useParams } from 'react-router-dom'

export default function ParkingDetailsPage({ data = [], onToggleFavorite = () => {}, favorites = [] }) {
	const { id } = useParams()
	const spot = data.find((p) => p.id === id)
	if (!spot) return <div className="container">חניה לא נמצאה</div>

	const handleBook = () => alert('ההזמנה בוצעה בהצלחה!')

	return (
		<section className="container">
			<h2>{spot.title}</h2>
			<div className="meta">{spot.location} • ₪{spot.price} • {spot.available ? 'פנוי' : 'לא פנוי'}</div>
			<p>{spot.description}</p>
			<div className="actions">
				<button className="btn" onClick={() => onToggleFavorite(spot.id)}>{favorites.includes(spot.id) ? 'הוסר' : 'שמור'}</button>
				<button className="btn primary" onClick={handleBook} disabled={!spot.available}>הזמן</button>
			</div>
		</section>
	)
}
