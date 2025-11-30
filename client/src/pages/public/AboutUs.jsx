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

      {/* Our Achievements Section */}
      <section className="achievements-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Our Achievements</h2>
            <p>Building excellence in maritime education</p>
          </motion.div>

          <div className="achievements-grid">
            <motion.div
              className="achievement-card"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="achievement-icon">
                <FaUserGraduate />
              </div>
              <h3>5000+</h3>
              <p>Graduates Worldwide</p>
            </motion.div>

            <motion.div
              className="achievement-card"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="achievement-icon">
                <FaCertificate />
              </div>
              <h3>30+</h3>
              <p>International Certifications</p>
            </motion.div>

            <motion.div
              className="achievement-card"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", bounce: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="achievement-icon">
                <FaTrophy />
              </div>
              <h3>25 Years</h3>
              <p>Excellence in Training</p>
            </motion.div>

            <motion.div
              className="achievement-card"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring", bounce: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="achievement-icon">
                <FaGlobe />
              </div>
              <h3>50+</h3>
              <p>Global Partnerships</p>
            </motion.div>

            <motion.div
              className="achievement-card"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, type: "spring", bounce: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="achievement-icon">
                <FaChalkboardTeacher />
              </div>
              <h3>100+</h3>
              <p>Expert Instructors</p>
            </motion.div>

            <motion.div
              className="achievement-card"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6, type: "spring", bounce: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="achievement-icon">
                <FaAward />
              </div>
              <h3>Top Rated</h3>
              <p>Maritime Institute</p>
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