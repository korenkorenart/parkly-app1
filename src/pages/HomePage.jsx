import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <main>
      <section className="hero container" aria-labelledby="home-hero-title">
        <div>
          <p className="eyebrow">Parkly</p>
          <h1 id="home-hero-title">חיפוש חניה מודרני כולל חוויית משתמש חכמה</h1>
          <p>מצא חניה קרובה, השווה מחירים, שמור מועדפים ונהל הזמנות במקום אחד.</p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn primary">התחילו</Link>
            <Link to="/terms" className="btn secondary">תנאי שימוש</Link>
          </div>
        </div>
      </section>

      <section className="container page-section">
        <div className="grid">
          <article className="summary-card">
            <h2>מצוין למשתמשי עיר</h2>
            <p>השתמש ב־Parkly לתכנון חניה מהיר, נוח ובטוח בסביבה עירונית.</p>
          </article>
          <article className="summary-card">
            <h2>כלי חכם לסעות לעבודה</h2>
            <p>מצא את החניה המחוברים ביותר, שמור בחירת חניה למועדפים ונהל אותן בלחיצה.</p>
          </article>
          <article className="summary-card">
            <h2>פתרון לטווח הרחב</h2>
            <p>עובד על מכשירים ניידים וטאבלטים עם חוויית RTL שמותאמת לשפה העברית.</p>
          </article>
        </div>
      </section>
    </main>
  )
}
