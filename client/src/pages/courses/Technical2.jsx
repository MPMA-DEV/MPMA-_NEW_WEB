import React from 'react'
import './Technical2.css'

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

export default function TechnicalII() {
	return (
		<div className="ms-page">
			
			{/* HERO SECTION */}
			<section className="ms-hero">
				<div className="ms-hero-left">
					<img
						className="ms-hero-image"
						src="https://images.stockcake.com/public/8/0/8/8080cbcd-cc14-42e1-a00f-86d35fb1db74_large/cluttered-tech-workshop-stockcake.jpg````"
						alt="Workshop"
					/>
				</div>

				<div className="ms-hero-right">
					<h1 className="ms-title">TECHNICAL II (Workshop Practice)</h1>
					<p className="ms-subtitle">
						Hands-on workshop skills for maritime maintenance, repair, and 
						fabrication work essential for vessel and port operations.
					</p>

					<div className="ms-hero-actions">
						<button className="btn btn-primary">Apply Now</button>
						<button className="btn btn-outline">Download Brochure</button>
					</div>
				</div>
			</section>

			{/* HIGHLIGHTS */}
			<section className="ms-middle">
				<h2 className="ms-section-title">Course Highlights</h2>
				<p className="ms-section-desc">
					Discover what makes this course exceptional and why it's the right 
					choice for your maritime career.
				</p>
			</section>

			{/* FEATURE CARDS */}
			<section className="ms-features">
				<div className="ms-feature-card">
					<div className="ms-feature-icon">⭐</div>
					<div className="ms-feature-text">Practical Workshop Training</div>
				</div>

				<div className="ms-feature-card">
					<div className="ms-feature-icon">⭐</div>
					<div className="ms-feature-text">Industry-Standard Tools</div>
				</div>

				<div className="ms-feature-card">
					<div className="ms-feature-icon">⭐</div>
					<div className="ms-feature-text">Certification in Multiple Skills</div>
				</div>

				<div className="ms-feature-card">
					<div className="ms-feature-icon">⭐</div>
					<div className="ms-feature-text">Direct Industry Placement</div>
				</div>
			</section>

			{/* MODULES + PREREQUISITES + ADVANCED */}
			<section className="ms-modules">

				{/* LEFT CARD – COURSE MODULES */}
				<div className="ms-mod-card ms-mod-left">
					<div className="ms-mod-icon"><BookIcon /></div>
					<h3>Course Modules</h3>
					<ul>
						<li>Welding & Fabrication</li>
						<li>Machining Operations</li>
						<li>Maintenance Procedures</li>
						<li>Tool & Equipment Usage</li>
						<li>Quality Control</li>
						<li>Safety Practices</li>
					</ul>
				</div>

				{/* CENTER CARD – PREREQUISITES */}
				<div className="ms-mod-card ms-mod-center">
					<div className="ms-mod-icon"><ChecklistIcon /></div>
					<h3>Prerequisites</h3>
					<ul>
						<li>Basic mechanical aptitude</li>
						<li>Physical fitness</li>
						<li>Safety awareness</li>
					</ul>
				</div>

				{/* RIGHT CARD – ADVANCED MODULES */}
				<div className="ms-mod-card ms-mod-right">
					<div className="ms-mod-icon"><GlobeIcon /></div>
					<h3>Career Paths</h3>
					<ul>
						<li>Marine Mechanic</li>
						<li>Welding Specialist</li>
						<li>Maintenance Technician</li>
						<li>Workshop Supervisor</li>
						<li>Equipment Fabricator</li>
					</ul>
				</div>

			</section>
		</div>
	)
}
