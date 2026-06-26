import React, { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { createPayment } from '../lib/supabaseClient'

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const booking = location.state?.booking

  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ type: '', text: '' })
  const [form, setForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  const spot = booking?.parking_spots
  const amount = Number(spot?.price || booking?.total_price || 0)

  const formattedAmount = useMemo(() => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(amount)
  }, [amount])

  const formatDate = (value) => {
    if (!value) return 'לא זמין'

    return new Intl.DateTimeFormat('he-IL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  }

  const onlyDigits = (value) => value.replace(/\D/g, '')

  const formatCardNumber = (value) => {
    return onlyDigits(value)
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim()
  }

  const formatExpiry = (value) => {
    const digits = onlyDigits(value).slice(0, 4)
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }

  const getCardBrand = () => {
    const digits = onlyDigits(form.cardNumber)

    if (digits.startsWith('4')) return 'VISA'
    if (digits.startsWith('5')) return 'Mastercard'
    if (digits.startsWith('3')) return 'AMEX'

    return 'Parkly Pay'
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setToast({ type: '', text: '' })

    if (name === 'cardNumber') {
      setForm((prev) => ({ ...prev, cardNumber: formatCardNumber(value) }))
      return
    }

    if (name === 'expiry') {
      setForm((prev) => ({ ...prev, expiry: formatExpiry(value) }))
      return
    }

    if (name === 'cvv') {
      setForm((prev) => ({ ...prev, cvv: onlyDigits(value).slice(0, 4) }))
      return
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const cardDigits = onlyDigits(form.cardNumber)
    const cvvDigits = onlyDigits(form.cvv)

    if (form.cardName.trim().length < 2) {
      return 'נא להזין שם מלא כפי שמופיע על הכרטיס'
    }

    if (cardDigits.length !== 16) {
      return 'מספר הכרטיס חייב להכיל 16 ספרות'
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
      return 'נא להזין תוקף בפורמט MM/YY'
    }

    if (cvvDigits.length < 3) {
      return 'CVV חייב להכיל לפחות 3 ספרות'
    }

    if (!amount || amount <= 0) {
      return 'סכום התשלום אינו תקין'
    }

    return ''
  }

  const handlePayment = async (e) => {
    e.preventDefault()

    const errorMessage = validateForm()

    if (errorMessage) {
      setToast({ type: 'error', text: errorMessage })
      return
    }

    try {
      setLoading(true)
      setToast({ type: '', text: '' })

      await createPayment(booking.id, amount)

      const currentCart = JSON.parse(localStorage.getItem('parklyCart') || '[]')
      const nextCart = currentCart.filter((item) => String(item.id) !== String(booking.id))
      localStorage.setItem('parklyCart', JSON.stringify(nextCart))
      window.dispatchEvent(new Event('parkly-cart-updated'))

      setToast({
        type: 'success',
        text: 'התשלום בוצע בהצלחה. מעבירים אותך לפרופיל...',
      })

      window.setTimeout(() => {
        navigate('/profile')
      }, 1300)
    } catch (error) {
      console.error(error)
      setToast({
        type: 'error',
        text: 'לא ניתן לבצע תשלום כרגע. נסי שוב בעוד רגע.',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!booking) {
    return (
      <main className="container page-section payment-page" dir="rtl">
        <section className="empty-state premium-empty">
          <div className="empty-icon">🧾</div>
          <h1>לא נמצאה הזמנה לתשלום</h1>
          <p>חזרי לפרופיל או לעגלה ובחרי הזמנה פעילה כדי להשלים תשלום.</p>

          <div className="actions" style={{ justifyContent: 'center' }}>
            <Link className="btn primary" to="/cart">
              מעבר לעגלה
            </Link>

            <Link className="btn secondary" to="/profile">
              חזרה לפרופיל
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="container page-section payment-page" dir="rtl">
      <section className="payment-hero premium-payment-hero">
        <div>
          <p className="eyebrow">Checkout מאובטח</p>
          <h1>השלמת תשלום ב־Parkly</h1>
          <p>
            עמוד תשלום דמו המדמה חוויית תשלום אמיתית. לא מתבצע חיוב בפועל,
            והנתונים נשמרים רק לצורך הדגמת הפרויקט.
          </p>
        </div>

        <div className="payment-security-badge">
          <span>🔒</span>
          <strong>Secure Demo</strong>
          <small>SSL · Tokenized · No real charge</small>
        </div>
      </section>

      <section className="payment-layout premium-payment-layout">
        <form className="payment-card premium-payment-card" onSubmit={handlePayment} noValidate>
          <div className="checkout-progress">
            <div className="progress-step active">
              <span>1</span>
              <small>פרטי הזמנה</small>
            </div>

            <div className="progress-line" />

            <div className="progress-step active">
              <span>2</span>
              <small>תשלום</small>
            </div>

            <div className="progress-line" />

            <div className="progress-step">
              <span>3</span>
              <small>אישור</small>
            </div>
          </div>

          <div className="payment-card-preview premium-credit-card">
            <div className="credit-card-top">
              <span>Parkly</span>
              <strong>{getCardBrand()}</strong>
            </div>

            <div className="credit-card-chip" />

            <strong className="credit-card-number">
              {form.cardNumber || '4580 0000 0000 0000'}
            </strong>

            <div className="credit-card-bottom">
              <small>{form.cardName || 'שם בעל הכרטיס'}</small>
              <small>{form.expiry || 'MM/YY'}</small>
            </div>
          </div>

          <div className="payment-methods">
            <span>VISA</span>
            <span>Mastercard</span>
            <span>AMEX</span>
            <span>Demo Pay</span>
          </div>

          <div className="form-grid">
            <label>
              שם בעל הכרטיס
              <input
                name="cardName"
                value={form.cardName}
                onChange={handleChange}
                placeholder="ישראל ישראלי"
                autoComplete="cc-name"
                required
              />
            </label>

            <label>
              מספר כרטיס
              <input
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleChange}
                inputMode="numeric"
                placeholder="4580 0000 0000 0000"
                autoComplete="cc-number"
                required
              />
            </label>

            <div className="payment-row">
              <label>
                תוקף
                <input
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                  inputMode="numeric"
                  placeholder="12/28"
                  autoComplete="cc-exp"
                  required
                />
              </label>

              <label>
                CVV
                <input
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                  inputMode="numeric"
                  placeholder="123"
                  autoComplete="cc-csc"
                  required
                />
              </label>
            </div>
          </div>

          <button className="btn primary payment-submit premium-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="button-spinner" />
                מבצע תשלום...
              </>
            ) : (
              `שלם ${formattedAmount}`
            )}
          </button>

          {toast.text && (
            <div className={`card-feedback ${toast.type}`} role="status">
              {toast.text}
            </div>
          )}
        </form>

        <aside className="payment-summary premium-order-summary">
          <div className="summary-header">
            <p className="eyebrow">סיכום הזמנה</p>
            <h2>{spot?.title || 'חניה נבחרת'}</h2>
            <p>{spot?.location || 'מיקום לא זמין'}</p>
          </div>

          <div className="order-mini-card">
            <span>🅿️</span>
            <div>
              <strong>{spot?.title || 'Parkly Parking'}</strong>
              <small>{spot?.location || 'מיקום לא זמין'}</small>
            </div>
          </div>

          <div className="summary-list">
            <p>
              <span>תאריך התחלה</span>
              <strong>{formatDate(booking.starts_at || booking.start_time)}</strong>
            </p>

            <p>
              <span>תאריך סיום</span>
              <strong>{formatDate(booking.ends_at || booking.end_time)}</strong>
            </p>

            <p>
              <span>סטטוס</span>
              <strong>{booking.status || 'ממתין לתשלום'}</strong>
            </p>

            <p>
              <span>אמצעי תשלום</span>
              <strong>כרטיס דמו</strong>
            </p>
          </div>

          <div className="summary-total">
            <span>סה״כ לתשלום</span>
            <strong>{formattedAmount}</strong>
          </div>

          <div className="checkout-security">
            <span>🔐</span>
            <div>
              <strong>תשלום בטוח</strong>
              <small>נתוני אשראי אינם נשמרים במערכת</small>
            </div>
          </div>

          <Link className="btn secondary" to="/cart">
            חזרה לעגלה
          </Link>
        </aside>
      </section>
    </main>
  )
}