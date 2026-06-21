import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
	return (
		<section className="hero container">
			<h1>ברוכים הבאים ל־Parkly</h1>
			<p>מצאו וחגגו חניה בקלות — השוואת מחירים, זמינות ושמירה במועדפים.</p>
			<div className="hero-actions">
				<Link to="/dashboard" className="btn primary">התחילו</Link>
				<Link to="/terms" className="btn">תנאי שימוש</Link>
			</div>
		</section>
	)
}
