import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage({ supabaseConnected }) {
  const stats = [
    { value: '500+', label: 'חניות זמינות' },
    { value: '1,800+', label: 'משתמשים מרוצים' },
    { value: '98%', label: 'חיסכון בזמן חיפוש' },
  ]

  const features = [
    {
      icon: '⚡',
      title: 'הזמנה מהירה',
      text: 'מצאי חניה זמינה, שמרי אותה ועברי לתשלום בתוך כמה שניות.',
    },
    {
      icon: '🗺️',
      title: 'מפה חכמה',
      text: 'ראי את החניות על המפה ובחרי את המיקום שהכי מתאים לך.',
    },
    {
      icon: '💳',
      title: 'תשלום דמו מאובטח',
      text: 'זרימת תשלום מקצועית המדמה חוויית Checkout אמיתית.',
    },
    {
      icon: '❤️',
      title: 'מועדפים אישיים',
      text: 'שמרי חניות קבועות וחזרי אליהן במהירות מהפרופיל שלך.',
    },
  ]

  const steps = [
    { number: '01', title: 'מחפשים', text: 'מסננים לפי מחיר, זמינות ומיקום.' },
    { number: '02', title: 'בוחרים', text: 'פותחים פרטי חניה ובודקים מחיר ומפה.' },
    { number: '03', title: 'מזמינים', text: 'יוצרים הזמנה ומוסיפים לעגלת הקניות.' },
    { number: '04', title: 'משלמים', text: 'עוברים לתשלום דמו וחוזרים לפרופיל.' },
  ]

  const reviews = [
    {
      name: 'נועה לוי',
      text: 'מצאתי חניה ליד העבודה תוך פחות מדקה. הממשק ברור ונוח מאוד.',
    },
    {
      name: 'דניאל כהן',
      text: 'העגלת קניות והתשלום גורמים למערכת להרגיש כמו מוצר אמיתי.',
    },
    {
      name: 'מאיה אברהם',
      text: 'אהבתי שאפשר לשמור מועדפים ולראות את כל ההזמנות בפרופיל.',
    },
  ]

  return (
    <section className="home-page" dir="rtl">
      <section className="home-hero">
        <div className="home-content">
          <p className="eyebrow">Parkly Smart Parking</p>

          <h1>מצא חניה קרובה, זמינה ומשתלמת בלי להסתובב בעיר</h1>

          <p>
            Parkly היא מערכת חכמה למציאת חניות, שמירת מועדפים, הזמנת חניה,
            עגלת קניות ותשלום דמו — הכל בחוויית משתמש פשוטה, מהירה ובעברית מלאה.
          </p>

          <div className="hero-actions">
            <Link className="btn primary" to="/dashboard">
              מצא חניה עכשיו
            </Link>

            <Link className="btn secondary" to="/map">
              צפה במפה
            </Link>
          </div>

          <div className="connection-note">
            {supabaseConnected
              ? '● מחובר ל־Supabase בזמן אמת'
              : '● מצב דמו פעיל — המערכת מוכנה לחיבור נתונים'}
          </div>
        </div>

        <div className="hero-preview">
          <div className="preview-map-card">
            <div className="map-dots">
              <span className="dot dot-one" />
              <span className="dot dot-two" />
              <span className="dot dot-three" />
            </div>

            <div className="preview-floating-card main">
              <span className="badge available">פנוי עכשיו</span>
              <h3>חניון שרונה</h3>
              <p>₪12 לשעה · 2.1 ק״מ ממך</p>
            </div>

            <div className="preview-floating-card secondary">
              <span className="badge cheap">הכי משתלם</span>
              <h3>חניון הבורסה</h3>
              <p>₪10 לשעה · זמינות גבוהה</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-stats">
        {stats.map((item) => (
          <div className="home-stat-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="home-section">
        <div className="section-title">
          <p className="eyebrow">למה Parkly?</p>
          <h2>כל מה שצריך כדי להזמין חניה בצורה חכמה</h2>
          <p>
            המערכת משלבת חיפוש, מפה, מועדפים, הזמנות ותשלום כדי ליצור חוויית
            שימוש מלאה כמו במוצר אמיתי.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-title">
          <p className="eyebrow">איך זה עובד?</p>
          <h2>ארבעה צעדים פשוטים עד לחניה</h2>
        </div>

        <div className="steps-grid">
          {steps.map((step) => (
            <article className="step-card" key={step.number}>
              <strong>{step.number}</strong>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section reviews-section">
        <div className="section-title">
          <p className="eyebrow">חוויית משתמש</p>
          <h2>מה משתמשים אומרים?</h2>
        </div>

        <div className="reviews-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.name}>
              <div className="stars">★★★★★</div>
              <p>״{review.text}״</p>
              <strong>{review.name}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <p className="eyebrow">מוכנה להתחיל?</p>
          <h2>מצאי את החניה הבאה שלך כבר עכשיו</h2>
          <p>היכנסי לדשבורד, בחרי חניה, הוסיפי לעגלה ועברי לתשלום.</p>
        </div>

        <Link className="btn primary" to="/dashboard">
          התחלת חיפוש
        </Link>
      </section>
    </section>
  )
}