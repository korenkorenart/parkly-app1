import React from 'react'

export default function MapPage({ data = [] }) {
  return (
    <section className="container">
      <h2>מפת חניות (דמו)</h2>
      <div className="map-placeholder">מפה כאן - סימוני חניה: {data.length}</div>
    </section>
  )
}