import React from 'react'

export default function RegisterPage() {
	return (
		<section className="auth container">
			<h2>הרשמה</h2>
			<form onSubmit={(e) => e.preventDefault()}>
				<label>שם מלא<input name="name" required /></label>
				<label>אימייל<input type="email" name="email" required /></label>
				<label>סיסמה<input type="password" name="password" required /></label>
				<button className="btn primary">הרשם</button>
			</form>
		</section>
	)
}
