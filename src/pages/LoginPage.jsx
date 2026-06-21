import React from 'react'

export default function LoginPage() {
	return (
		<section className="auth container">
			<h2>התחברות</h2>
			<form onSubmit={(e) => e.preventDefault()}>
				<label>אימייל<input type="email" name="email" required /></label>
				<label>סיסמה<input type="password" name="password" required /></label>
				<button className="btn primary">התחבר</button>
			</form>
		</section>
	)
}
