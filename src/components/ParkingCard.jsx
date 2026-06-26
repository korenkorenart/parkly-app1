import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

export default function ParkingCard({
  spot,
  isFavorite,
  onToggleFavorite,
  onBook,
  bookingLoading = false,
}) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const available = Boolean(spot.available)
  const price = Number(spot.price || 0)
  const isCheap = price > 0 && price <= 15

  const rating = useMemo(() => {
    const seed = String(spot.id || spot.title || '').length
    return (4.3 + (seed % 7) / 10).toFixed(1)
  }, [spot.id, spot.title])

  const distance = useMemo(() => {
    const seed = String(spot.location || spot.title || '').length
    return `${(1.1 + (seed % 9) / 2).toFixed(1)} ק״מ`
  }, [spot.location, spot.title])

  const popularity = useMemo(() => {
    const seed = String(spot.id || '').length
    if (isCheap) return 'הכי משתלם'
    if (seed % 2 === 0) return 'פופולרי'
    return 'בחירה מומלצת'
  }, [spot.id, isCheap])

  const showMessage = (type, text, duration = 2600) => {
    setMessage({ type, text })
    window.setTimeout(() => setMessage({ type: '', text: '' }), duration)
  }

  const handleFavorite = async () => {
    try {
      setBusy(true)
      await onToggleFavorite(spot.id)
      showMessage('success', isFavorite ? 'החניה הוסרה מהמועדפים' : 'החניה נשמרה במועדפים')
    } catch (error) {
      console.error('Favorite update failed:', error)
      showMessage('error', 'לא הצלחנו לעדכן מועדפים כרגע')
    } finally {
      setBusy(false)
    }
  }

  const handleBook = async () => {
    if (!available) {
      showMessage('error', 'החניה אינה זמינה להזמנה כרגע')
      return
    }

    try {
      setBusy(true)
      await onBook(spot.id)
      showMessage('success', 'ההזמנה נוצרה ונוספה לעגלת הקניות')
      window.dispatchEvent(new Event('parkly-cart-updated'))
    } catch (error) {
      console.error('Booking failed:', error)
      showMessage('error', 'לא הצלחנו לבצע הזמנה כרגע')
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="parking-card premium-parking-card" aria-labelledby={`spot-${spot.id}`}>
      <div className="parking-image-panel">
        <div className="parking-image-gradient">
          <span className="parking-icon">🅿️</span>

          <div className="parking-image-badges">
            <span className={available ? 'badge available' : 'badge unavailable'}>
              {available ? 'פנוי עכשיו' : 'לא זמין'}
            </span>

            <span className="badge glass">{popularity}</span>
          </div>
        </div>
      </div>

      <div className="card-top-line">
        <div>
          <p className="mini-label">חניה זמינה באזור</p>
          <h3 id={`spot-${spot.id}`}>{spot.title}</h3>
        </div>

        <button
          type="button"
          className={`favorite-pill ${isFavorite ? 'active' : ''}`}
          onClick={handleFavorite}
          disabled={busy || bookingLoading}
          aria-label={isFavorite ? 'הסר מהמועדפים' : 'שמור במועדפים'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>

      <p className="location-line">📍 {spot.location}</p>

      <p className="card-desc">
        {spot.description || 'חניה נוחה באזור מרכזי, מתאימה לנהגים שמחפשים פתרון מהיר ובטוח.'}
      </p>

      <div className="quick-info">
        <div>
          <strong>₪{price}</strong>
          <span>לשעה</span>
        </div>

        <div>
          <strong>{distance}</strong>
          <span>מרחק משוער</span>
        </div>

        <div>
          <strong>{rating}</strong>
          <span>דירוג ⭐</span>
        </div>
      </div>

      <div className="spot-badges">
        {isCheap && <span className="badge cheap">מחיר משתלם</span>}
        {isFavorite && <span className="badge favorite">שמורה</span>}
        <span className="badge neutral">עדכון בזמן אמת</span>
      </div>

      <div className="actions upgraded-actions">
        <Link to={`/parking/${spot.id}`} className="btn secondary">
          פרטים
        </Link>

        {spot.lat && spot.lng && (
          <a
            className="btn secondary"
            href={`https://www.openstreetmap.org/?mlat=${spot.lat}&mlon=${spot.lng}#map=14/${spot.lat}/${spot.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            מפה
          </a>
        )}

        <button
          className="btn primary"
          onClick={handleBook}
          disabled={!available || busy || bookingLoading}
        >
          {busy || bookingLoading ? 'מזמין...' : available ? 'הזמן עכשיו' : 'לא זמין'}
        </button>
      </div>

      {message.text && (
        <div className={`card-feedback ${message.type}`} role="status" aria-live="polite">
          {message.text}
        </div>
      )}
    </article>
  )
}