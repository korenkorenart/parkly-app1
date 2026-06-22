import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../lib/supabaseClient'

export default function RegisterPage({ session }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (session) {
      navigate('/dashboard', { replace: true })
    }
  }, [session, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const result = await signUp(email, password)
      if (result?.session) {
        navigate('/dashboard')
      } else {
        setSuccess('נרשמת בהצלחה! בדוק את הדואר האלקטרוני שלך לאימות.')
      }
    } catch (err) {
      // Demo mode fallback - allow registration without Supabase
      if (err.message?.includes('Failed to fetch') || err.message?.includes('Supabase')) {
        // Save demo user to localStorage
        const demoUserId = `demo-user-${Date.now()}`
        localStorage.setItem('demoUser', JSON.stringify({ email, password, userId: demoUserId }))
        localStorage.setItem('parklyUserId', demoUserId)
        setSuccess('✅ נרשמת בהצלחה במצב דמו! מעבר לדשבורד...')
        setTimeout(() => navigate('/dashboard'), 1500)
      } else {
        setError(err.message || 'אירעה שגיאה בהרשמה. אנא נסה שוב.')
      }
    }
  }

  return (
    <main className="container page-section">
      <section className="auth-card" aria-labelledby="register-title">
        <h2 id="register-title">הרשמה</h2>
        <p>צור חשבון חדש כדי לשמור חניות ולהזמין בקלות בעתיד.</p>
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
          {success && <p className="form-success">{success}</p>}
          <button type="submit" className="btn primary">הרשם</button>
        </form>
        <p className="auth-note">
          כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link>
        </p>
      </section>
    </main>
  )
}
