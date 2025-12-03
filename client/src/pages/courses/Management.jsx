import React from "react";
import "./Management.css";

const Management = () => {
  return (
    <div className="management-page">

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section-management">
        <div className="management-hero-content">
          <img
            src="https://cdn.uconnectlabs.com/wp-content/uploads/sites/258/2024/10/b84598e904351f946b7b97a4061a06cd-image.png"
            alt="Management Course"
            className="management-hero-image"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/images/port-bg.jpg'; }}
          />

          <div className="management-hero-text">
            <h1>MANAGEMENT</h1>
            <p>
              Leadership and management skills for maritime professionals,
              covering port management, shipping operations, and maritime business.
            </p>

            <div className="management-buttons">
              <button className="apply-btn">Apply Now</button>
              <button className="brochure-btn">Download Brochure</button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COURSE HIGHLIGHTS ===== */}
      <section className="management-highlights">
        <h2>Course Highlights</h2>
        <p>
          Discover what makes this course exceptional and why it's the right choice
          for your maritime career.
        </p>

        <div className="highlight-boxes">
          <div className="highlight-box">⭐ MBA-Level Curriculum</div>
          <div className="highlight-box">⭐ Industry Mentorship Program</div>
          <div className="highlight-box">⭐ Case Study Approach</div>
          <div className="highlight-box">⭐ Networking Opportunities</div>
        </div>
      </section>

      {/* ===== MODULES & PREREQUISITES ===== */}
      <section className="management-content-grid">

        {/* ==== MODULES 1 ==== */}
        <div className="management-card">
          <h3>📘 Course Modules</h3>
          <ul>
            <li>Maritime Business Management</li>
            <li>Port Operations Management</li>
            <li>Human Resource Management</li>
            <li>Financial Management</li>
            <li>Strategic Planning</li>
            <li>International Maritime Law</li>
          </ul>
        </div>

        {/* ==== PREREQUISITES ==== */}
        <div className="management-card">
          <h3>👤 Prerequisites</h3>
          <ul>
            <li>Bachelor’s degree or equivalent</li>
            <li>Minimum 2 years work experience</li>
            <li>English proficiency</li>
          </ul>
        </div>

        {/* ==== MODULES 2 ==== */}
        <div className="management-card">
          <h3>🌐 Course Modules</h3>
          <ul>
            <li>Port Manager</li>
            <li>Shipping Operations Manager</li>
            <li>Maritime Business Analyst</li>
            <li>Terminal Manager</li>
            <li>Maritime Consultant</li>
          </ul>
        </div>

      </section>

    </div>
  );
};

export default Management;
