import React from 'react'

export default function MapPage({ data = [] }) {
  const points = data.filter((spot) => spot.lat && spot.lng)
  const available = points.filter((spot) => spot.available).length
  const unavailable = points.length - available
  const bbox = points.length
    ? [
        Math.min(...points.map((spot) => spot.lng)) - 0.15,
        Math.min(...points.map((spot) => spot.lat)) - 0.15,
        Math.max(...points.map((spot) => spot.lng)) + 0.15,
        Math.max(...points.map((spot) => spot.lat)) + 0.15
      ]
    : [34.5, 31.6, 35.2, 32.9]

  return (
    <main className="container page-section">
      <section className="info-panel" aria-labelledby="map-title">
        <div>
          <p className="eyebrow">מפה חכמה</p>
          <h2 id="map-title">מפת חניות</h2>
          <p>כל החניות שלך במפה אחת עם נקודות מיקום, מצב וזמינות.</p>
        </div>
      </section>

      <section className="map-summary-cards">
        <div className="map-stat-card">
          <strong>{points.length}</strong>
          <span>חניות מסומנות</span>
        </div>
        <div className="map-stat-card available-card">
          <strong>{available}</strong>
          <span>פנויות</span>
        </div>
        <div className="map-stat-card unavailable-card">
          <strong>{unavailable}</strong>
          <span>לא זמינות</span>
        </div>
      </section>

      <section className="map-shell">
        <iframe
          title="OpenStreetMap Parkly"
          className="map-frame"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox.map((value) => value.toFixed(4)).join('%2C')}&layer=mapnik`}
          loading="lazy"
        />

        <aside className="map-list" aria-label="רשימת חניות במפה">
          <div className="map-list-header">
            <h3>חניות ברשימה</h3>
            <p>לחץ על כל קישור כדי לפתוח את המיקום ב־OpenStreetMap.</p>
          </div>
          <ul>
            {points.length === 0 ? (
              <li className="map-empty">אין חניות עם מיקום מוגדר להצגה במפה.</li>
            ) : (
              points.map((spot) => (
                <li key={spot.id}>
                  <div>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${spot.lat}&mlon=${spot.lng}#map=14/${spot.lat}/${spot.lng}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {spot.title}
                    </a>
                    <p className="detail-meta">{spot.location} · ₪{spot.price}</p>
                  </div>
                  <span className={spot.available ? 'badge available' : 'badge unavailable'}>
                    {spot.available ? 'פנוי' : 'לא זמין'}
                  </span>
                </li>
              ))
            )}
          </ul>
        </aside>
      </section>
    </main>
  )
}
