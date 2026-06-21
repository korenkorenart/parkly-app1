import React from 'react'

export default function MapPage({ data = [] }) {
  return (
    <main className="container page-section">
      <section className="info-panel" aria-labelledby="map-title">
        <div>
          <p className="eyebrow">מפה חכמה</p>
          <h2 id="map-title">מפת חניות</h2>
          <p>כל החניות שלך במקום אחד עם הצגה ברורה של מצב זמינות ומחיר.</p>
        </div>
      </section>
      <div className="map-placeholder" role="img" aria-label={`מפה עם ${data.length} חניות`}>
        מפה כאן - סימוני חניה: {data.length}
      </div>
    </main>
  )
}