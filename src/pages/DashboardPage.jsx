import React, { useState, useMemo } from 'react'
import FilterBar from '../components/FilterBar'
import ParkingCard from '../components/ParkingCard'

export default function DashboardPage({ data = [], favorites = [], onToggleFavorite }) {
	const [filters, setFilters] = useState({ maxPrice: '', onlyAvailable: false, sort: 'none' })

	const filtered = useMemo(() => {
		let list = [...data]
		if (filters.maxPrice) list = list.filter((p) => p.price <= Number(filters.maxPrice))
		if (filters.onlyAvailable) list = list.filter((p) => p.available)
		if (filters.sort === 'price-asc') list.sort((a, b) => a.price - b.price)
		if (filters.sort === 'price-desc') list.sort((a, b) => b.price - a.price)
		return list
	}, [data, filters])

	const handleBook = (id) => {
		alert('ההזמנה בוצעה בהצלחה!')
	}

	return (
		<section>
			<h1>רשימת חניות</h1>
			<FilterBar filters={filters} onChange={setFilters} />
			<div className="grid">
				{filtered.map((spot) => (
					<ParkingCard key={spot.id} spot={spot} isFavorite={favorites.includes(spot.id)} onToggleFavorite={onToggleFavorite} onBook={handleBook} />
				))}
			</div>
		</section>
	)
}
