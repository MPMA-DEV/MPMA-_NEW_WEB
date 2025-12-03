import React from "react";
import "./InformationSystems.css";

const InformationSystems = () => {
  return (
    <div className="infoSystems-container">
      {/* HERO SECTION */}
      <section className="infoSystems-hero">
        <img
          src="https://stockton.edu/business/images/csis-banner.jpg"
          alt="Information Systems"
          className="infoSystems-hero-img"
        />

        <div className="infoSystems-hero-text">
          <h1>INFORMATION SYSTEMS</h1>
          <p>
            This course teaches students how to analyze, design, and implement 
            information systems used in modern organizations for improving 
            decision-making, workflow efficiency, and business operations.
          </p>

          <div className="infoSystems-btns">
            <button className="course-btn">Explore Courses</button>
            <button className="apply-btn">Apply Now</button>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS SECTION */}
      <section className="infoSystems-highlights">
        <h2>Course Highlights</h2>

        <div className="highlight-grid">
          <div className="highlight-card">
            <span className="star">★</span>
            <h3>System Analysis</h3>
            <p>Understand how systems operate in real business environments.</p>
          </div>

          <div className="highlight-card">
            <span className="star">★</span>
            <h3>Database Concepts</h3>
            <p>Learn database fundamentals and structured data storage.</p>
          </div>

          <div className="highlight-card">
            <span className="star">★</span>
            <h3>Networking Basics</h3>
            <p>Gain foundational knowledge of communication systems.</p>
          </div>

          <div className="highlight-card">
            <span className="star">★</span>
            <h3>IT Project Skills</h3>
            <p>Develop skills needed for IT project planning and execution.</p>
          </div>
        </div>
      </section>

      {/* THREE CARDS SECTION */}
      <section className="infoSystems-details">
        {/* COURSE MODULES CARD */}
        <div className="detail-card">
          <h3>📘 Course Modules</h3>
          <ul>
            <li>Introduction to Information Systems</li>
            <li>System Analysis & Design</li>
            <li>Database Management Systems</li>
            <li>Networking & Communication</li>
            <li>Enterprise Systems</li>
            <li>Cybersecurity Basics</li>
          </ul>
        </div>

        {/* PREREQUISITES CARD */}
        <div className="detail-card">
          <h3> 📝 Prerequisites</h3>
          <ul>
            <li>Basic IT literacy</li>
            <li>Understanding of computer hardware</li>
            <li>Willingness to learn system workflows</li>
          </ul>
        </div>

        {/* COURSE OUTCOMES */}
        <div className="detail-card">
          <h3> 🌐 Learning Outcomes</h3>
          <ul>
            <li>Analyze organizational system requirements</li>
            <li>Model functional business processes</li>
            <li>Apply design techniques for system development</li>
            <li>Work confidently with databases & networks</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default InformationSystems;
