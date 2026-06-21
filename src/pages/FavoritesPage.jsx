import React from 'react'
import ParkingCard from '../components/ParkingCard'

export default function FavoritesPage({ data = [], favorites = [], onToggleFavorite }) {
	const favs = data.filter((p) => favorites.includes(p.id))
	if (favs.length === 0) return <div className="container">אין מועדפים</div>

	const handleBook = (id) => alert('ההזמנה בוצעה בהצלחה!')

	return (
		<section className="container">
			<h2>המועדפים שלי</h2>
			<div className="grid">
				{favs.map((spot) => (
					<ParkingCard key={spot.id} spot={spot} isFavorite onToggleFavorite={onToggleFavorite} onBook={handleBook} />
				))}
			</div>
		</section>
	)
}
