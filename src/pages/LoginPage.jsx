import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../lib/supabaseClient'

export default function LoginPage({ session }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (session) {
      navigate('/dashboard', { replace: true })
    }
  }, [session, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'אירעה שגיאה בהתחברות. אנא בדוק את הנתונים ונסה שוב.')
    }
  }

  return (
    <main className="container page-section">
      <section className="auth-card" aria-labelledby="login-title">
        <h2 id="login-title">התחברות</h2>
        <p>הזן את האימייל והסיסמה שלך כדי להמשיך.</p>
        <form onSubmit={handleSubmit}>
          <label>
            אימייל
            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required aria-required="true" />
          </label>
          <label>
            סיסמה
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required aria-required="true" />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn primary">התחבר</button>
        </form>
        <p className="auth-note">
          אין לך חשבון? <Link to="/register">הרשם כאן</Link>
        </p>
      </section>
    </main>
  )
}
