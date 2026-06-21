import React, { useState, useMemo } from 'react'
import FilterBar from '../components/FilterBar'
import ParkingCard from '../components/ParkingCard'
import { createBooking } from '../lib/supabaseClient'

export default function DashboardPage({ data = [], favorites = [], onToggleFavorite, loading }) {
  const [filters, setFilters] = useState({ maxPrice: '', onlyAvailable: false, sort: 'none' })
  const [bookingStatus, setBookingStatus] = useState(null)

  const filtered = useMemo(() => {
    let list = [...data]
    if (filters.maxPrice) list = list.filter((p) => p.price <= Number(filters.maxPrice))
    if (filters.onlyAvailable) list = list.filter((p) => p.available)
    if (filters.sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    if (filters.sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    return list
  }, [data, filters])

  const handleBook = async (id) => {
    try {
      const userId = localStorage.getItem('parklyUserId') || `demo-user-${Date.now()}`
      await createBooking(userId, id)
      setBookingStatus('ההזמנה נוצרה בהצלחה!')
    } catch (error) {
      console.error('Dashboard booking failed:', error)
      setBookingStatus('לא ניתן להזמין כרגע. נסה שוב מאוחר יותר.')
    }
  }

  return (
    <section className="page-section dashboard-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">כאן נמצאות כל החניות</p>
          <h1>מצא חניה שמתאימה לך</h1>
          <p className="page-description">מסננים לפי מחיר וזמינות, ושומרים חניות למועדפים.</p>
        </div>
      </header>

      <section className="dashboard-banner">
        <div>
          <h2>הצעות חניה חמות</h2>
          <p>גלה את החניות הטובות ביותר בעיר, השווה מחירים ושמור את החניה שמתאימה לך. דף הדאשבורד עכשיו עם מראה גדול ובולט.</p>
        </div>
        <div className="dashboard-metrics">
          <div className="dashboard-stat">
            <strong>{filtered.length}</strong>
            <span>חניות זמינות</span>
          </div>
          <div className="dashboard-stat">
            <strong>{favorites.length}</strong>
            <span>מועדפים שמורים</span>
          </div>
        </div>
      </section>

      <FilterBar filters={filters} onChange={setFilters} />

      {bookingStatus && (
        <div className="empty-state" style={{ borderColor: 'rgba(34, 197, 94, 0.2)', background: 'rgba(34, 197, 94, 0.08)' }}>
          <h2>{bookingStatus}</h2>
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <h2>טוען חניות...</h2>
          <p>מביא את החניות מהשרת, זה לא אמור לקחת הרבה זמן.</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </section>
  )
}
