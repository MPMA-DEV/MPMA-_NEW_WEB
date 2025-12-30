import React from 'react'
import './Technical1.css'

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

export default function TechnicalI() {
	return (
		<div className="tech-page">
			
			{/* HERO SECTION */}
			<section className="tech-hero">
				<div className="tech-hero-left">
					<img
						className="tech-hero-image"
						src="https://www.monash.edu.my/__data/assets/image/0007/3362632/electrical-engineering.jpg"
						alt="Electrical engineering lab"
					/>
				</div>

				<div className="tech-hero-right">
					<h1 className="tech-title">
						TECHNICAL I (Electrical & Electronic, Industrial Engineering)
					</h1>

					<p className="tech-subtitle">
						Specialized training in maritime electrical and electronic systems,
						covering power generation, distribution, industry-grade equipment,
						and electronic navigation systems.
					</p>

					<div className="tech-hero-actions">
						<button className="btn btn-primary">Apply Now</button>
						<button className="btn btn-outline">Download Brochure</button>
					</div>
				</div>
			</section>

			{/* COURSE HIGHLIGHTS */}
			<section className="tech-middle">
				<h2 className="tech-section-title">Course Highlights</h2>
				<p className="tech-section-desc">
					Discover what makes this course exceptional and why it’s the ideal
					specialization for a future in the maritime electrical & electronic
					engineering field.
				</p>
			</section>

			{/* FEATURES */}
			<section className="tech-features">
				<div className="tech-feature-card">
					<div className="tech-feature-icon">⭐</div>
					<div className="tech-feature-text">Advanced Technical Training</div>
				</div>

				<div className="tech-feature-card">
					<div className="tech-feature-icon">⭐</div>
					<div className="tech-feature-text">Modern Laboratory Facilities</div>
				</div>

				<div className="tech-feature-card">
					<div className="tech-feature-icon">⭐</div>
					<div className="tech-feature-text">Industry-standard Equipment</div>
				</div>

				<div className="tech-feature-card">
					<div className="tech-feature-icon">⭐</div>
					<div className="tech-feature-text">High-demand Specialization</div>
				</div>
			</section>

			{/* MODULES + PREREQUISITES */}
			<section className="tech-modules">

				<div className="tech-mod-card tech-mod-left">
					<div className="tech-mod-icon"><BookIcon /></div>
					<h3>Course Modules</h3>
					<ul>
						<li>Marine Electrical Systems</li>
						<li>Electronic Navigation Equipment</li>
						<li>Power Generation & Distribution</li>
						<li>Control Systems</li>
						<li>Troubleshooting & Maintenance</li>
						<li>Electronic Communication</li>
					</ul>
				</div>

				<div className="tech-mod-card tech-mod-center">
					<div className="tech-mod-icon"><ChecklistIcon /></div>
					<h3>Prerequisites</h3>
					<ul>
						<li>Basic electrical knowledge</li>
						<li>Mathematics & Physics</li>
						<li>Technical aptitude</li>
					</ul>
				</div>

				<div className="tech-mod-card tech-mod-right">
					<div className="tech-mod-icon"><GlobeIcon /></div>
					<h3>Career Pathways</h3>
					<ul>
						<li>Marine Electrician</li>
						<li>Electronics Technician</li>
						<li>Automation Specialist</li>
						<li>Equipment Maintenance Officer</li>
						<li>Technical Superintendent</li>
					</ul>
				</div>

			</section>
		</div>
	)
}
