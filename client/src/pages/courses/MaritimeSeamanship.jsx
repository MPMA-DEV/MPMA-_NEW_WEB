import React from 'react'
import './MaritimeSeamanship.css'

const BookIcon = () => (
	<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M3 19.5A2.5 2.5 0 0 1 5.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
		<path d="M21 4.5H7.5A2 2 0 0 0 5.5 6.5v11A2 2 0 0 0 7.5 19.5H21V4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
	</svg>
)

const ChecklistIcon = () => (
	<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M9 11l1.5 1.5L15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
		<path d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
	</svg>
)

const GlobeIcon = () => (
	<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
		<path d="M2.05 12H21.95" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
		<path d="M12 2.05C14.4 4 15.9 7 16 12c0.1 5-0.9 8-4 9.95" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
	</svg>
)

export default function MaritimeSeamanship() {
	return (
		<div className="ms-page">
			<section className="ms-hero">
				<div className="ms-hero-left">
					<img
						className="ms-hero-image"
						src="https://media.istockphoto.com/id/1221717274/photo/filipino-deck-officer-on-deck-of-vessel-or-ship.jpg?s=612x612&w=0&k=20&c=PYXCtiq9s_yMtxcqmXJ9CgffciHvFcQpn2AjCENsQo8="
						alt="maritime items"
					/>
				</div>
				<div className="ms-hero-right">
					<h1 className="ms-title">MARITIME & SEAMANSHIP</h1>
					<p className="ms-subtitle">
						Fundamental seamanship skills, vessel operations, and maritime
						traditions essential for all maritime professionals.
					</p>
					<div className="ms-hero-actions">
						<button className="btn btn-primary">Apply Now</button>
						<button className="btn btn-outline">Download Brochure</button>
					</div>
				</div>
			</section>

			<section className="ms-middle">
				<h2 className="ms-section-title">Course Highlights</h2>
				<p className="ms-section-desc">
					This course builds a strong foundation in seamanship through hands-on
					training and practical instruction ideal for those pursuing a
					maritime career or seeking to strengthen vessel operations skills.
				</p>
			</section>

			<section className="ms-features">
				<div className="ms-feature-card">
					<div className="ms-feature-icon">⭐</div>
					<div className="ms-feature-text">Traditional Seamanship Skills</div>
				</div>
				<div className="ms-feature-card">
					<div className="ms-feature-icon">⭐</div>
					<div className="ms-feature-text">Practical Vessel Training</div>
				</div>
				<div className="ms-feature-card">
					<div className="ms-feature-icon">⭐</div>
					<div className="ms-feature-text">Time-honored Maritime Traditions</div>
				</div>
				<div className="ms-feature-card">
					<div className="ms-feature-icon">⭐</div>
					<div className="ms-feature-text">Foundation for Maritime Careers</div>
				</div>
			</section>

			<section className="ms-modules">
				<div className="ms-mod-card ms-mod-left">
					<div className="ms-mod-icon"><BookIcon /></div>
					<h3>Course Modules</h3>
					<ul>
						<li>Basic Seamanship</li>
						<li>Rope Work &amp; Knots</li>
						<li>Navigation Basics</li>
						<li>Vessel Handling</li>
						<li>Maritime Weather</li>
						<li>Ship Construction</li>
					</ul>
				</div>

				<div className="ms-mod-card ms-mod-center">
					<div className="ms-mod-icon"><ChecklistIcon /></div>
					<h3>Prerequisites</h3>
					<ul>
						<li>Physical fitness</li>
						<li>Swimming ability</li>
						<li>Basic education qualification</li>
					</ul>
				</div>

				<div className="ms-mod-card ms-mod-right">
					<div className="ms-mod-icon"><GlobeIcon /></div>
					<h3>Advanced Modules</h3>
					<ul>
						<li>Deck Officer</li>
						<li>Able Seaman</li>
						<li>Port Pilot</li>
						<li>Harbor Master</li>
						<li>Maritime Instructor</li>
					</ul>
				</div>
			</section>
		</div>
	)
}

