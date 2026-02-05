import React from 'react';

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaAnchor, FaShip, FaCertificate, FaUserGraduate, FaChevronRight,
  FaCheckCircle, FaGraduationCap, FaGlobe, FaChalkboardTeacher,
  FaCompass, FaWrench, FaLifeRing, FaLanguage, FaBullhorn,
  FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope, FaQuoteLeft,
  FaBriefcase, FaTrophy, FaAward, FaBullseye
} from 'react-icons/fa';
import ScrollytellingSection from '../../components/animations/ScrollytellingSection';
import ScrollTriggeredVideo from '../../components/animations/ScrollTriggeredVideo';
import VideoBackgroundHero from '../../components/animations/VideoBackgroundHero';
import ImageCarousel3D from '../../components/animations/ImageCarousel3D';
import './Home.css';

const Home = () => {

  return (
    <div className="home-page">
      {/* Video Background Hero Section with Content */}
      <VideoBackgroundHero />

      {/* SVG Clip Path for Wavy Button */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="wavyBtnShape" clipPathUnits="objectBoundingBox">
            <path d="M0.02,0.3 C0.05,0.1 0.15,0 0.3,0.05 C0.5,0.02 0.7,0 0.85,0.08 C0.95,0.15 1,0.35 0.98,0.5 C1,0.7 0.95,0.85 0.85,0.92 C0.7,1 0.5,0.98 0.3,0.95 C0.15,1 0.05,0.9 0.02,0.7 C0,0.55 0,0.45 0.02,0.3" />
          </clipPath>
        </defs>
      </svg>

      {/* Enroll Today Section */}
      <section className="enroll-section">
        <div className="container">
          <div className="enroll-wrapper">
            <motion.div
              className="enroll-content"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2>Start Your Maritime Journey</h2>
              <p>
                Join Mahapola Ports & Maritime Academy and gain internationally recognized certifications with hands-on training.
              </p>
              <Link to="/courses" className="enroll-btn">
                Enroll Now <FaChevronRight />
              </Link>
            </motion.div>
            <motion.div
              className="enroll-image"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img src="https://i.imgur.com/PDXtxlh.png" alt="Maritime Career" />
              <img src="https://i.imgur.com/8ruwNMP.png" alt="Maritime Training" />
              <img src="https://i.imgur.com/HW0kh7d.png" alt="Maritime Professional" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3D Image Carousel Slider */}
      <section className="carousel-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <ImageCarousel3D />
          </motion.div>
        </div>
      </section>

      {/* Mini About Section */}
      <section className="mini-about-section">
        <div className="container">
          <motion.div
            className="mini-about-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mini-about-icon">
              <FaAnchor />
            </div>
            <h2>Pioneering Excellence in Maritime Education Since 1995</h2>
            <p>
              Mahapola Ports & Maritime Academy stands as Sri Lanka's leading institution for maritime training and education. 
              We are committed to shaping the next generation of skilled seafarers through government-recognized programs, 
              world-class facilities, and internationally certified courses that meet the highest standards of maritime excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Our Academy Section */}
      <section className="about-academy-section">
        <div className="about-content-wrap">
          <div className="about-left">
            <h2>About Our Academy</h2>
            <p>Building maritime professionals for over two decades</p>
          </div>
          <div className="about-center">
            <div className="keyword-list">
              <span>TRAINING</span>
              <span>CERTIFICATION</span>
              <span>GLOBAL</span>
              <span>EXCELLENCE</span>
              <span>MARITIME</span>
            </div>
          </div>
          <div className="about-right">
            <Link to="/about" className="learn-more-btn">Learn More About Us</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

// comment for a initial commit
export default Home;