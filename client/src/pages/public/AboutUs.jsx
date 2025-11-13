import React from 'react';
import { FaBullseye, FaEye, FaTrophy, FaHandshake } from 'react-icons/fa';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="container">
          <h1>About Mahapola Maritime Academy</h1>
          <p>Premier Maritime Education Since 1985</p>
        </div>
      </section>

      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card">
              <FaBullseye className="mission-icon" />
              <h3>Our Mission</h3>
              <p>To provide world-class maritime education and training</p>
            </div>
            <div className="mission-card">
              <FaEye className="mission-icon" />
              <h3>Our Vision</h3>
              <p>To be the leading maritime academy in South Asia</p>
            </div>
            <div className="mission-card">
              <FaTrophy className="mission-icon" />
              <h3>Our Values</h3>
              <p>Excellence, Integrity, and Innovation</p>
            </div>
            <div className="mission-card">
              <FaHandshake className="mission-icon" />
              <h3>Our Commitment</h3>
              <p>Dedicated to student success and industry needs</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <h2>Our Story</h2>
          <p>
            Founded in 1985, Mahapola Ports & Maritime Academy has been at the forefront of 
            maritime education in Sri Lanka. With state-of-the-art facilities and experienced 
            instructors, we have trained thousands of maritime professionals who serve in ports 
            and vessels worldwide.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;