import React from 'react'
import ParkingCard from '../components/ParkingCard'

export default function FavoritesPage({ data = [], favorites = [], onToggleFavorite }) {
  const favs = data.filter((p) => favorites.includes(p.id))

  const handleBook = (id) => alert('ההזמנה בוצעה בהצלחה!')

  return (
    <main className="container page-section">
      <section className="page-header">
        <div>
          <p className="eyebrow">מועדפים</p>
          <h1>החניות השמורות שלך</h1>
          <p className="page-description">מציג את כל החניות שסימנת לשמירה. שמור והזמן חניה במהירות.</p>
        </div>
      </section>

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
