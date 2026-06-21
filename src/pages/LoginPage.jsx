import React from 'react'

export default function LoginPage() {
  return (
    <main className="container page-section">
      <section className="auth-card" aria-labelledby="login-title">
        <h2 id="login-title">התחברות</h2>
        <p>הזן את האימייל והסיסמה שלך כדי להמשיך.</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            אימייל
            <input type="email" name="email" required aria-required="true" />
          </label>
          <label>
            סיסמה
            <input type="password" name="password" required aria-required="true" />
          </label>
          <button type="submit" className="btn primary">התחבר</button>
        </form>
      </section>
    </main>
  )
}
