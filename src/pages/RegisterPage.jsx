import React from 'react'

export default function RegisterPage() {
  return (
    <main className="container page-section">
      <section className="auth-card" aria-labelledby="register-title">
        <h2 id="register-title">הרשמה</h2>
        <p>צור חשבון חדש כדי לשמור חניות ולהזמין בקלות בעתיד.</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            שם מלא
            <input name="name" required aria-required="true" />
          </label>
          <label>
            אימייל
            <input type="email" name="email" required aria-required="true" />
          </label>
          <label>
            סיסמה
            <input type="password" name="password" required aria-required="true" />
          </label>
          <button type="submit" className="btn primary">הרשם</button>
        </form>
      </section>
    </main>
  )
}
