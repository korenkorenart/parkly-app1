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
      // Demo mode fallback - check if user exists in demo
      const demoUser = localStorage.getItem('demoUser')
      if (demoUser) {
        const parsed = JSON.parse(demoUser)
        if (parsed.email === email && parsed.password === password) {
          localStorage.setItem('parklyUserId', parsed.userId)
          navigate('/dashboard')
          return
        }
      }

      // If network error, allow demo login anyway
      if (err.message?.includes('Failed to fetch') || err.message?.includes('Supabase')) {
        const demoUserId = `demo-user-${Date.now()}`
        localStorage.setItem('demoUser', JSON.stringify({ email, password, userId: demoUserId }))
        localStorage.setItem('parklyUserId', demoUserId)
        navigate('/dashboard')
      } else {
        setError(err.message || 'אירעה שגיאה בהתחברות. אנא בדוק את הנתונים ונסה שוב.')
      }
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
