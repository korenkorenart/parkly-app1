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
    <section className="page-section">
      <header className="page-header">
        <div>
          <p className="eyebrow">כאן נמצאות כל החניות</p>
          <h1>מצא חניה שמתאימה לך</h1>
          <p className="page-description">מסננים לפי מחיר וזמינות, ושומרים חניות למועדפים.</p>
        </div>
      </header>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="grid">
        {filtered.map((spot) => (
          <ParkingCard key={spot.id} spot={spot} isFavorite={favorites.includes(spot.id)} onToggleFavorite={onToggleFavorite} onBook={handleBook} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <h2>אין חניות מתאימות כרגע</h2>
          <p>נסה לשנות את הסינון או להסיר את המיון.</p>
        </div>
      )}
    </section>
  )
}
