import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaBullseye, FaEye, FaTrophy, FaHandshake,
  FaCheckCircle, FaShip, FaGlobe, FaChalkboardTeacher,
  FaBriefcase, FaGraduationCap, FaWrench, FaCompass,
  FaLanguage, FaLifeRing, FaCertificate, FaUserGraduate, FaQuoteLeft, FaAward
} from 'react-icons/fa';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-page">
      {/* About Hero Section */}
      <section className="about-hero-section">
        <div className="about-hero-bg">
          <div className="wave-pattern"></div>
          <div className="dots-pattern"></div>
        </div>
        <div className="about-hero-content">
          <motion.div
            className="about-hero-text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              About Us
            </motion.h1>
            <motion.p
              className="about-hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Discover our history, values, and commitment to shaping the future of maritime excellence.
            </motion.p>
          </motion.div>
          <motion.div
            className="hero-decorative-elements"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="anchor-shape"></div>
            <div className="compass-shape"></div>
            <div className="wave-shape"></div>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="mvv-section">
        <div className="container">
          <div className="mvv-grid">
            {/* Mission */}
            <motion.div
              className="mvv-column mission-column"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, type: "spring", bounce: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -15, scale: 1.05 }}
            >
              <motion.div 
                className="mvv-top"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="mvv-icon"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, type: "spring", bounce: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  <FaBullseye />
                </motion.div>
              </motion.div>
              <motion.div 
                className="mvv-content"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.h3 
                  className="mvv-title"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  MISSION
                </motion.h3>
                <motion.p 
                  className="mvv-text"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  viewport={{ once: true }}
                >
                  To provide world-class maritime education and training through state-of-the-art 
                  facilities, internationally certified programs, and expert faculty.
                </motion.p>
                <motion.div 
                  className="mvv-underline mission-underline"
                  initial={{ width: 0 }}
                  whileInView={{ width: "60px" }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                ></motion.div>
              </motion.div>
            </motion.div>

            {/* Vision */}
            <motion.div
              className="mvv-column vision-column"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, type: "spring", bounce: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -15, scale: 1.05 }}
            >
              <motion.div 
                className="mvv-top"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="mvv-icon"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.5, type: "spring", bounce: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  <FaEye />
                </motion.div>
              </motion.div>
              <motion.div 
                className="mvv-content"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.h3 
                  className="mvv-title"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  viewport={{ once: true }}
                >
                  VISION
                </motion.h3>
                <motion.p 
                  className="mvv-text"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  To be the leading maritime training academy in South Asia, recognized globally 
                  for excellence in maritime education and professional development.
                </motion.p>
                <motion.div 
                  className="mvv-underline vision-underline"
                  initial={{ width: 0 }}
                  whileInView={{ width: "60px" }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  viewport={{ once: true }}
                ></motion.div>
              </motion.div>
            </motion.div>

            {/* Values */}
            <motion.div
              className="mvv-column values-column"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3, type: "spring", bounce: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -15, scale: 1.05 }}
            >
              <motion.div 
                className="mvv-top"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="mvv-icon"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.6, type: "spring", bounce: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  <FaAward />
                </motion.div>
              </motion.div>
              <motion.div 
                className="mvv-content"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                viewport={{ once: true }}
              >
                <motion.h3 
                  className="mvv-title"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  VALUES
                </motion.h3>
                <motion.p 
                  className="mvv-text"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  viewport={{ once: true }}
                >
                  Excellence, Integrity, Innovation, and Commitment to student success and 
                  industry leadership in maritime training and education.
                </motion.p>
                <motion.div 
                  className="mvv-underline values-underline"
                  initial={{ width: 0 }}
                  whileInView={{ width: "60px" }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  viewport={{ once: true }}
                ></motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Four Decades Timeline Section */}
      <section className="timeline-section">
        <div className="timeline-full-container">
          <motion.div 
            className="timeline-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="timeline-main-title"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Four Decades of Maritime Excellence
            </motion.h2>
            <motion.p 
              className="timeline-subtitle"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Building on a legacy of professional training and industry leadership
            </motion.p>
          </motion.div>

          <div className="timeline-wrapper">
            <motion.div 
              className="timeline-vertical-line"
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
              viewport={{ once: true }}
            ></motion.div>

            {/* 1985 - Left */}
            <motion.div 
              className="timeline-item-wrapper timeline-item-left"
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <motion.div 
                className="timeline-year-left"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6, type: "spring", bounce: 0.5 }}
                viewport={{ once: true }}
              >
                1985
              </motion.div>
              <motion.div 
                className="timeline-circle"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.3, transition: { duration: 0.2 } }}
              ></motion.div>
              <motion.div 
                className="timeline-card"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <h3>Foundation & First Batch</h3>
                <p>Established as Sri Lanka's premier maritime training institution with the first batch of 50 cadets.</p>
              </motion.div>
            </motion.div>

            {/* 1995 - Right */}
            <motion.div 
              className="timeline-item-wrapper timeline-item-right"
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.9, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <motion.div 
                className="timeline-card"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                viewport={{ once: true }}
              >
                <h3>International Recognition</h3>
                <p>Received STCW accreditation and began offering internationally recognized maritime certifications.</p>
              </motion.div>
              <motion.div 
                className="timeline-circle"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 1.1, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.3, transition: { duration: 0.2 } }}
              ></motion.div>
              <motion.div 
                className="timeline-year-right"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.0, type: "spring", bounce: 0.5 }}
                viewport={{ once: true }}
              >
                1995
              </motion.div>
            </motion.div>

            {/* 2005 - Left */}
            <motion.div 
              className="timeline-item-wrapper timeline-item-left"
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.7, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <motion.div 
                className="timeline-year-left"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8, type: "spring", bounce: 0.5 }}
                viewport={{ once: true }}
              >
                2005
              </motion.div>
              <motion.div 
                className="timeline-circle"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.3, transition: { duration: 0.2 } }}
              ></motion.div>
              <motion.div 
                className="timeline-card"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                viewport={{ once: true }}
              >
                <h3>State-of-the-Art Simulators</h3>
                <p>Invested in advanced navigation and engine room simulators, enhancing practical training capabilities.</p>
              </motion.div>
            </motion.div>

            {/* 2015 - Right */}
            <motion.div 
              className="timeline-item-wrapper timeline-item-right"
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.8, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <motion.div 
                className="timeline-card"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                viewport={{ once: true }}
              >
                <h3>Global Expansion</h3>
                <p>Established international partnerships, expanded training facilities, and increased graduate output worldwide.</p>
              </motion.div>
              <motion.div 
                className="timeline-circle"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 1.0, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.3, transition: { duration: 0.2 } }}
              ></motion.div>
              <motion.div 
                className="timeline-year-right"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9, type: "spring", bounce: 0.5 }}
                viewport={{ once: true }}
              >
                2015
              </motion.div>
            </motion.div>

            {/* 2020 - Left */}
            <motion.div 
              className="timeline-item-wrapper timeline-item-left"
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.9, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <motion.div 
                className="timeline-year-left"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.0, type: "spring", bounce: 0.5 }}
                viewport={{ once: true }}
              >
                2020
              </motion.div>
              <motion.div 
                className="timeline-circle"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 1.1, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.3, transition: { duration: 0.2 } }}
              ></motion.div>
              <motion.div 
                className="timeline-card"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                viewport={{ once: true }}
              >
                <h3>Digital Transformation</h3>
                <p>Implemented advanced e-learning platforms and virtual training modules to adapt to global challenges.</p>
              </motion.div>
            </motion.div>

            {/* 2025 - Right */}
            <motion.div 
              className="timeline-item-wrapper timeline-item-right"
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.0, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <motion.div 
                className="timeline-card"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                viewport={{ once: true }}
              >
                <h3>Excellence & Innovation</h3>
                <p>Celebrating 40 years of maritime excellence with cutting-edge AI-integrated training and sustainable shipping initiatives.</p>
              </motion.div>
              <motion.div 
                className="timeline-circle"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 1.2, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.3, transition: { duration: 0.2 } }}
              ></motion.div>
              <motion.div 
                className="timeline-year-right"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.1, type: "spring", bounce: 0.5 }}
                viewport={{ once: true }}
              >
                2025
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Why Choose Us</h2>
            <p>Your pathway to a successful maritime career</p>
          </motion.div>

          <div className="features-grid">
            <motion.div
              className="feature-card"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, type: "spring", bounce: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">
                <FaCheckCircle />
              </div>
              <h3>Government Recognized</h3>
              <p>Fully accredited by Sri Lanka Ports Authority with internationally recognized certifications</p>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", bounce: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">
                <FaShip />
              </div>
              <h3>Modern Maritime Simulators</h3>
              <p>State-of-the-art simulation technology for hands-on training experience</p>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3, type: "spring", bounce: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">
                <FaGlobe />
              </div>
              <h3>International Standard Courses</h3>
              <p>Programs aligned with STCW and IMO international maritime standards</p>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring", bounce: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">
                <FaChalkboardTeacher />
              </div>
              <h3>Highly Qualified Instructors</h3>
              <p>Expert faculty with extensive maritime industry experience</p>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5, type: "spring", bounce: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">
                <FaBriefcase />
              </div>
              <h3>Supportive Learning Environment</h3>
              <p>Collaborative atmosphere with modern facilities and dedicated student support services</p>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, type: "spring", bounce: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">
                <FaTrophy />
              </div>
              <h3>Proven Track Record</h3>
              <p>Over 5000+ successful graduates serving in prestigious maritime organizations globally</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Overview Section */}
      <section className="programs-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Our Programs</h2>
            <p>Comprehensive maritime training courses</p>
          </motion.div>

          <div className="programs-grid">
            <motion.div
              className="program-card"
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="program-icon">
                <FaGraduationCap />
              </div>
              <h3>Basic Seafaring</h3>
              <p>Foundational maritime skills and knowledge for aspiring seafarers</p>
              <Link to="/courses" className="program-link">Learn More →</Link>
            </motion.div>

            <motion.div
              className="program-card"
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="program-icon">
                <FaWrench />
              </div>
              <h3>Marine Engineering</h3>
              <p>Technical expertise in ship machinery and propulsion systems</p>
              <Link to="/courses" className="program-link">Learn More →</Link>
            </motion.div>

            <motion.div
              className="program-card"
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", bounce: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="program-icon">
                <FaCompass />
              </div>
              <h3>Navigation & Safety</h3>
              <p>Advanced navigation techniques and maritime safety protocols</p>
              <Link to="/courses" className="program-link">Learn More →</Link>
            </motion.div>

            <motion.div
              className="program-card"
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring", bounce: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="program-icon">
                <FaLanguage />
              </div>
              <h3>Maritime English</h3>
              <p>Specialized English communication for maritime professionals</p>
              <Link to="/courses" className="program-link">Learn More →</Link>
            </motion.div>

            <motion.div
              className="program-card"
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, type: "spring", bounce: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="program-icon">
                <FaLifeRing />
              </div>
              <h3>Safety Training</h3>
              <p>Comprehensive safety and survival courses for seafarers</p>
              <Link to="/courses" className="program-link">Learn More →</Link>
            </motion.div>

            <motion.div
              className="program-card"
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6, type: "spring", bounce: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="program-icon">
                <FaCertificate />
              </div>
              <h3>Professional Certifications</h3>
              <p>International maritime certifications and endorsements</p>
              <Link to="/courses" className="program-link">Learn More →</Link>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Student Success Stories</h2>
            <p>Hear from our graduates who are now sailing the world</p>
          </motion.div>

          <div className="testimonials-grid">
            <motion.div
              className="testimonial-card"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.4 }}
              viewport={{ once: true }}
            >
              <FaQuoteLeft className="quote-icon" />
              <p className="testimonial-text">
                "The training I received at Mahapola Academy was exceptional. The modern simulators
                and experienced instructors prepared me perfectly for my career at sea. I'm now serving
                as a Third Officer on an international vessel."
              </p>
              <div className="testimonial-author">
                <div className="author-image">
                  <FaUserGraduate />
                </div>
                <div className="author-info">
                  <h4>Kamal Perera</h4>
                  <p>Third Officer, International Shipping</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="testimonial-card"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.4 }}
              viewport={{ once: true }}
            >
              <FaQuoteLeft className="quote-icon" />
              <p className="testimonial-text">
                "Mahapola Academy provided me with world-class maritime education. The international
                standard courses and professional environment gave me the confidence to pursue my dreams.
                I highly recommend this academy to anyone aspiring for a maritime career."
              </p>
              <div className="testimonial-author">
                <div className="author-image">
                  <FaUserGraduate />
                </div>
                <div className="author-info">
                  <h4>Sanduni Fernando</h4>
                  <p>Marine Engineer, Container Ship</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="testimonial-card"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", bounce: 0.4 }}
              viewport={{ once: true }}
            >
              <FaQuoteLeft className="quote-icon" />
              <p className="testimonial-text">
                "The hands-on training and safety courses at Mahapola were outstanding. The academy's
                focus on practical skills and international certifications made me job-ready. I secured
                my position within months of graduation."
              </p>
              <div className="testimonial-author">
                <div className="author-image">
                  <FaUserGraduate />
                </div>
                <div className="author-info">
                  <h4>Pradeep Silva</h4>
                  <p>Safety Officer, Cruise Line</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;