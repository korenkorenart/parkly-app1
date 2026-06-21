import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
	return (
		<nav className="navbar">
			<div className="nav-inner container">
				<div className="brand">Parkly</div>
				<div className="links">
					<NavLink to="/" end>בית</NavLink>
					<NavLink to="/dashboard">חניות</NavLink>
					<NavLink to="/map">מפה</NavLink>
					<NavLink to="/favorites">מועדפים</NavLink>
					<NavLink to="/profile">פרופיל</NavLink>
				</div>
			</div>
		</nav>
	)
}
