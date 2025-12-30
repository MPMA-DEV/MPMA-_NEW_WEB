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