import React from "react";
import "./FireSafety.css";

export default function FireSafety() {
  return (
    <div className="fire-page">

      {/* Hero Section */}
      <div className="fire-hero">

        <img
          src="https://www.ehsinternational.com/wp-content/uploads/2023/11/fire-courses-21.jpg"
          alt="Fire training"
          className="fire-hero-img"
        />

        <div className="fire-hero-content">
          <h1>FIRE & SAFETY & OCCUPATIONAL HEALTH</h1>

          <p>
            Essential training in maritime fire safety, emergency response,
            and occupational health management aboard vessels and maritime facilities.
          </p>

          <div className="fire-buttons">
            <button className="apply-btn">Apply Now</button>
            <button className="brochure-btn">Download Brochure</button>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <h2 className="fire-title">Course Highlights</h2>
      <p className="fire-subtitle">
        Discover what makes this course exceptional and why it's the right choice
        for your maritime career.
      </p>

      <div className="highlight-cards">
        <div className="highlight-card">★ STCW Compliant Training</div>
        <div className="highlight-card">★ Practical Fire Fighting Exercises</div>
        <div className="highlight-card">★ Emergency Simulation Training</div>
        <div className="highlight-card">★ Industry-Recognized Certification</div>
      </div>

      {/* Three Box Section */}
      <div className="info-grid">

        <div className="info-card">
          <h3>📘 Course Modules</h3>
          <ul>
            <li>Fire Prevention & Detection</li>
            <li>Emergency Response Procedures</li>
            <li>Personal Safety Equipment</li>
            <li>Occupational Health Standards</li>
            <li>Risk Assessment</li>
            <li>Safety Management Systems</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>📝 Prerequisites</h3>
          <ul>
            <li>Basic safety awareness</li>
            <li>Medical fitness certificate</li>
            <li>Basic first aid knowledge</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>📘 Course Modules</h3>
          <ul>
            <li>Safety Officer</li>
            <li>Fire Safety Inspector</li>
            <li>Emergency Response Coordinator</li>
            <li>Occupational Health Specialist</li>
            <li>Safety Training Instructor</li>
          </ul>
        </div>

      </div>

    </div>
  );
}
