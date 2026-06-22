import React from 'react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div>© {new Date().getFullYear()} Parkly</div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem' }}>
          <a href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>מדיניות הפרטיות</a>
          <a href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>תנאי שימוש</a>
        </div>
      </div>
    </footer>
  )
}
