import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FilterBar from '../components/FilterBar'
import ParkingCard from '../components/ParkingCard'
import { createBooking } from '../lib/supabaseClient'

export default function DashboardPage({
  data = [],
  favorites = [],
  onToggleFavorite,
  loading,
  userId,
}) {
  const navigate = useNavigate()

  const [filters, setFilters] = useState({
    query: '',
    maxPrice: '',
    onlyAvailable: false,
    sort: 'none',
  })

  const [bookingStatus, setBookingStatus] = useState(null)
  const [createdBooking, setCreatedBooking] = useState(null)
  const [bookingLoadingId, setBookingLoadingId] = useState(null)

  const filtered = useMemo(() => {
    let list = [...data]

    if (filters.maxPrice) {
      list = list.filter((p) => Number(p.price) <= Number(filters.maxPrice))
    }

    if (filters.onlyAvailable) {
      list = list.filter((p) => p.available)
    }

    if (filters.query && filters.query.trim()) {
      const q = filters.query.trim().toLowerCase()

      list = list.filter((p) => {
        return (
          (p.title || '').toLowerCase().includes(q) ||
          (p.location || '').toLowerCase().includes(q)
        )
      })
    }

    if (filters.sort === 'price-asc') {
      list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
    }

    if (filters.sort === 'price-desc') {
      list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
    }

    return list
  }, [data, filters])

  const availableCount = useMemo(() => {
    return data.filter((spot) => spot.available).length
  }, [data])

  const unavailableCount = useMemo(() => {
    return data.filter((spot) => !spot.available).length
  }, [data])

  const prices = useMemo(() => {
    return data.map((spot) => Number(spot.price)).filter((price) => !Number.isNaN(price))
  }, [data])

  const cheapest = useMemo(() => {
    if (!prices.length) return '-'
    return `₪${Math.min(...prices)}`
  }, [prices])

  const averagePrice = useMemo(() => {
    if (!prices.length) return '-'
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length
    return `₪${Math.round(avg)}`
  }, [prices])

  const availabilityPercent = useMemo(() => {
    if (!data.length) return 0
    return Math.round((availableCount / data.length) * 100)
  }, [availableCount, data.length])

  const recommendedSpots = useMemo(() => {
    return [...data]
      .filter((spot) => spot.available)
      .sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
      .slice(0, 3)
  }, [data])

  const priceBuckets = useMemo(() => {
    const cheap = data.filter((spot) => Number(spot.price || 0) <= 15).length
    const medium = data.filter(
      (spot) => Number(spot.price || 0) > 15 && Number(spot.price || 0) <= 30
    ).length
    const premium = data.filter((spot) => Number(spot.price || 0) > 30).length

    return [
      { label: 'עד ₪15', value: cheap },
      { label: '₪16–30', value: medium },
      { label: '₪31+', value: premium },
    ]
  }, [data])

  const maxBucketValue = useMemo(() => {
    return Math.max(...priceBuckets.map((bucket) => bucket.value), 1)
  }, [priceBuckets])

  const saveToCart = (booking) => {
    const currentCart = JSON.parse(localStorage.getItem('parklyCart') || '[]')
    const exists = currentCart.some((item) => String(item.id) === String(booking.id))

    if (!exists) {
      localStorage.setItem('parklyCart', JSON.stringify([...currentCart, booking]))
      window.dispatchEvent(new Event('parkly-cart-updated'))
    }
  }

  const showGlobalToast = (type, text) => {
    window.dispatchEvent(
      new CustomEvent('parkly-toast', {
        detail: { type, text },
      })
    )
  }

  const handleBook = async (spotId) => {
    const spot = data.find((item) => String(item.id) === String(spotId))

    if (!spot || !spot.available || bookingLoadingId) return

    try {
      setBookingLoadingId(spotId)
      setBookingStatus(null)
      setCreatedBooking(null)

      const booking = await createBooking(userId, spotId)

      const bookingForCart = {
        ...booking,
        parking_spots: booking?.parking_spots || spot,
      }

      saveToCart(bookingForCart)
      setCreatedBooking(bookingForCart)
      setBookingStatus('ההזמנה נוצרה בהצלחה! בחרי איך להמשיך.')
      showGlobalToast('success', 'החניה נוספה לעגלת הקניות')
    } catch (error) {
      console.error('Dashboard booking failed:', error)
      setBookingStatus('לא ניתן להזמין כרגע. נסי שוב מאוחר יותר.')
      showGlobalToast('error', 'לא ניתן ליצור הזמנה כרגע')
    } finally {
      setBookingLoadingId(null)
    }
  }

  const handleGoToCart = () => {
    navigate('/cart')
  }

  const handleContinueBooking = () => {
    setBookingStatus(null)
    setCreatedBooking(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="page-section dashboard-page" dir="rtl">
      <header className="page-header premium-dashboard-header">
        <div>
          <p className="eyebrow">Parkly Dashboard</p>
          <h1 className="hero-small">מצא חניה חכמה לפי מחיר, זמינות ומיקום</h1>
          <p className="page-description">
            דשבורד חכם לחיפוש חניות, ניתוח זמינות, השוואת מחירים ושמירת חניות
            מועדפות — הכל במקום אחד.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <Link className="btn primary" to="/map">
            📍 מעבר למפה
          </Link>

          <Link className="btn secondary" to="/cart">
            🛒 עגלת קניות
          </Link>
        </div>
      </header>

      <section className="dashboard-banner premium-dashboard-banner">
        <div>
          <p className="eyebrow">Live Parking Overview</p>
          <h2>🚗 חניות זמינות בסביבה</h2>
          <p>
            השווי מחירים, בדקי זמינות, שמרי מועדפים והזמיני חניה בשניות מתוך
            חוויית משתמש שמדמה מערכת אמיתית.
          </p>

          <div className="banner-actions">
            <Link className="btn primary" to="/map">
              📍 צפה במפה
            </Link>

            <Link className="btn secondary" to="/favorites">
              ❤️ מועדפים שלי
            </Link>
          </div>
        </div>

        <div className="availability-ring-card">
          <div
            className="availability-ring"
            style={{ '--value': `${availabilityPercent}%` }}
          >
            <strong>{availabilityPercent}%</strong>
            <span>זמינות</span>
          </div>

          <p>{availableCount} מתוך {data.length || 0} חניות פנויות כרגע</p>
        </div>
      </section>

      <section className="dashboard-kpi-grid">
        <article className="dashboard-kpi-card">
          <span>🅿️</span>
          <strong>{data.length}</strong>
          <small>סה״כ חניות</small>
        </article>

        <article className="dashboard-kpi-card">
          <span>🟢</span>
          <strong>{availableCount}</strong>
          <small>חניות זמינות</small>
        </article>

        <article className="dashboard-kpi-card">
          <span>🔴</span>
          <strong>{unavailableCount}</strong>
          <small>לא זמינות</small>
        </article>

        <article className="dashboard-kpi-card">
          <span>💸</span>
          <strong>{averagePrice}</strong>
          <small>מחיר ממוצע</small>
        </article>

        <article className="dashboard-kpi-card">
          <span>🏷️</span>
          <strong>{cheapest}</strong>
          <small>הכי זול</small>
        </article>

        <article className="dashboard-kpi-card">
          <span>❤️</span>
          <strong>{favorites.length}</strong>
          <small>מועדפים</small>
        </article>
      </section>

      <section className="dashboard-insights-grid">
        <article className="dashboard-chart-card">
          <div className="section-title">
            <p className="eyebrow">Price Insights</p>
            <h2>התפלגות מחירים</h2>
            <p>חלוקה של החניות לפי טווחי מחיר.</p>
          </div>

          <div className="price-bars">
            {priceBuckets.map((bucket) => (
              <div className="price-bar-row" key={bucket.label}>
                <span>{bucket.label}</span>

                <div className="price-bar-track">
                  <div
                    className="price-bar-fill"
                    style={{ width: `${(bucket.value / maxBucketValue) * 100}%` }}
                  />
                </div>

                <strong>{bucket.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="recommended-card">
          <div className="section-title">
            <p className="eyebrow">Recommended</p>
            <h2>החניות המומלצות</h2>
            <p>החניות הזולות והזמינות ביותר כרגע.</p>
          </div>

          <div className="recommended-list">
            {recommendedSpots.length === 0 ? (
              <p className="detail-meta">אין חניות מומלצות כרגע.</p>
            ) : (
              recommendedSpots.map((spot) => (
                <Link className="recommended-item" to={`/parking/${spot.id}`} key={spot.id}>
                  <span>🅿️</span>
                  <div>
                    <strong>{spot.title}</strong>
                    <small>{spot.location}</small>
                  </div>
                  <b>₪{spot.price}</b>
                </Link>
              ))
            )}
          </div>
        </article>
      </section>

      <FilterBar filters={filters} onChange={setFilters} />

      {bookingStatus && (
        <div className="booking-success-panel">
          <div>
            <span>✅</span>
            <h2>{bookingStatus}</h2>
            <p>אפשר לעבור לעגלה כדי להשלים Checkout או להמשיך לחפש חניות נוספות.</p>
          </div>

          {createdBooking && (
            <div className="actions">
              <button className="btn primary" onClick={handleGoToCart}>
                מעבר לעגלת הקניות
              </button>

              <button className="btn secondary" onClick={handleContinueBooking}>
                המשך להזמין באתר
              </button>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="empty-state premium-empty">
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <div className="spinner" aria-hidden="true" />
            <h2>טוען חניות...</h2>
            <p>מעדכן רשימת חניות מהשרת.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid">
            {filtered.map((spot) => (
              <ParkingCard
                key={spot.id}
                spot={spot}
                isFavorite={favorites.includes(spot.id)}
                onToggleFavorite={onToggleFavorite}
                onBook={handleBook}
                bookingLoading={bookingLoadingId === spot.id}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state premium-empty">
              <div className="empty-icon">🔎</div>
              <h2>אין חניות מתאימות כרגע</h2>
              <p>נסי לשנות את הסינון, להוריד מגבלת מחיר או להציג גם חניות לא זמינות.</p>
            </div>
          )}
        </>
      )}
    </section>
  )
}