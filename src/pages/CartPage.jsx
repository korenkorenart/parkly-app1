import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function CartPage() {
  const navigate = useNavigate()

  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('parklyCart')) || []
    } catch {
      return []
    }
  })

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      return sum + Number(item?.parking_spots?.price || 0)
    }, 0)
  }, [cartItems])

  const serviceFee = cartItems.length > 0 ? 5 : 0
  const finalTotal = total + serviceFee

  const updateCart = (nextCart) => {
    setCartItems(nextCart)
    localStorage.setItem('parklyCart', JSON.stringify(nextCart))
    window.dispatchEvent(new Event('parkly-cart-updated'))
  }

  const removeFromCart = (bookingId) => {
    updateCart(cartItems.filter((item) => String(item.id) !== String(bookingId)))
  }

  const clearCart = () => {
    const approved = window.confirm('לנקות את כל עגלת הקניות?')
    if (!approved) return
    updateCart([])
  }

  const goToPayment = (booking) => {
    navigate('/payment', {
      state: { booking },
    })
  }

  const goToFirstPayment = () => {
    if (!cartItems.length) return
    goToPayment(cartItems[0])
  }

  return (
    <main className="container page-section cart-page" dir="rtl">
      <section className="cart-hero">
        <div>
          <p className="eyebrow">עגלת קניות</p>
          <h1>החניות שבחרת מחכות לך</h1>
          <p>
            בדקי את ההזמנות שלך, הסירי פריטים שלא רלוונטיים והמשיכי לתשלום בצורה
            מהירה ונוחה.
          </p>
        </div>

        <div className="cart-hero-card">
          <span>🛒</span>
          <strong>{cartItems.length}</strong>
          <small>פריטים בעגלה</small>
        </div>
      </section>

      {cartItems.length === 0 ? (
        <section className="empty-state premium-empty">
          <div className="empty-icon">🛒</div>
          <h2>העגלה שלך ריקה</h2>
          <p>בחרי חניה מהדשבורד והוסיפי אותה לעגלה כדי להמשיך להזמנה.</p>

          <Link className="btn primary" to="/dashboard">
            חיפוש חניות
          </Link>
        </section>
      ) : (
        <section className="cart-layout premium-cart-layout">
          <div className="cart-list">
            {cartItems.map((booking, index) => {
              const spot = booking.parking_spots
              const price = Number(spot?.price || 0)

              return (
                <article key={booking.id} className="cart-product-card">
                  <div className="cart-product-media">
                    <span>🅿️</span>
                  </div>

                  <div className="cart-product-content">
                    <div className="booking-card-header">
                      <div>
                        <p className="mini-label">פריט #{index + 1} בעגלה</p>
                        <h3>{spot?.title || 'חניה'}</h3>
                        <p className="detail-meta">📍 {spot?.location || 'מיקום לא זמין'}</p>
                      </div>

                      <span className="status-pill available">ממתין לתשלום</span>
                    </div>

                    <div className="cart-product-meta">
                      <div>
                        <strong>₪{price}</strong>
                        <span>מחיר לשעה</span>
                      </div>

                      <div>
                        <strong>Demo</strong>
                        <span>תשלום מאובטח</span>
                      </div>

                      <div>
                        <strong>מיידי</strong>
                        <span>אישור הזמנה</span>
                      </div>
                    </div>

                    <div className="actions">
                      {spot?.id && (
                        <Link className="btn secondary" to={`/parking/${spot.id}`}>
                          צפייה בחניה
                        </Link>
                      )}

                      <button className="btn primary" onClick={() => goToPayment(booking)}>
                        מעבר לתשלום
                      </button>

                      <button className="btn danger" onClick={() => removeFromCart(booking.id)}>
                        הסרה מהעגלה
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <aside className="cart-checkout-panel">
            <p className="eyebrow">סיכום הזמנה</p>
            <h2>Checkout</h2>

            <div className="summary-list">
              <p>
                <span>מספר חניות</span>
                <strong>{cartItems.length}</strong>
              </p>

              <p>
                <span>סכום ביניים</span>
                <strong>₪{total}</strong>
              </p>

              <p>
                <span>עמלת שירות דמו</span>
                <strong>₪{serviceFee}</strong>
              </p>
            </div>

            <div className="summary-total">
              <span>סה״כ לתשלום</span>
              <strong>₪{finalTotal}</strong>
            </div>

            <div className="checkout-security">
              <span>🔒</span>
              <div>
                <strong>תשלום דמו מאובטח</strong>
                <small>לא מתבצע חיוב אמיתי בפרויקט</small>
              </div>
            </div>

            <button className="btn primary checkout-btn" onClick={goToFirstPayment}>
              המשך לתשלום
            </button>

            <Link className="btn secondary" to="/dashboard">
              המשך חיפוש חניות
            </Link>

            <button className="btn danger" onClick={clearCart}>
              ניקוי עגלה
            </button>
          </aside>
        </section>
      )}
    </main>
  )
}