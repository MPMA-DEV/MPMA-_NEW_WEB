import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaAnchor, FaShip, FaCertificate, FaUserGraduate, FaChevronRight } from 'react-icons/fa';
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

      {/* Stats Section with Scrollytelling */}
      <ScrollytellingSection direction="up" delay={0.2}>
        <section className="stats-section">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2>Our Achievements</h2>
              <p>Excellence in maritime education and training</p>
            </motion.div>

            <div className="stats-grid">
              <motion.div
                className="stat-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="stat-icon-wrapper">
                  <FaUserGraduate className="stat-icon" />
                </div>
                <motion.h3
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                  viewport={{ once: true }}
                >
                  5000+
                </motion.h3>
                <p>Students Trained</p>
              </motion.div>

              <motion.div
                className="stat-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="stat-icon-wrapper">
                  <FaCertificate className="stat-icon" />
                </div>
                <motion.h3
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
                  viewport={{ once: true }}
                >
                  25+
                </motion.h3>
                <p>Courses Offered</p>
              </motion.div>

              <motion.div
                className="stat-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="stat-icon-wrapper">
                  <FaShip className="stat-icon" />
                </div>
                <motion.h3
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
                  viewport={{ once: true }}
                >
                  50+
                </motion.h3>
                <p>Expert Instructors</p>
              </motion.div>

              <motion.div
                className="stat-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="stat-icon-wrapper">
                  <FaAnchor className="stat-icon" />
                </div>
                <motion.h3
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
                  viewport={{ once: true }}
                >
                  95%
                </motion.h3>
                <p>Success Rate</p>
              </motion.div>
            </div>
          </div>
        </section>
      </ScrollytellingSection>

      {/* Video Section - Plays on Scroll */}
      <section className="video-section">
        <div className="container">
          <motion.div
            className="video-content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Experience Maritime Excellence</h2>
            <p>Watch our immersive video showcasing the world of maritime training and education</p>
          </motion.div>

          <motion.div
            className="video-container"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <ScrollTriggeredVideo />
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <ScrollytellingSection direction="left" delay={0.3}>
        <section className="about-section">
          <div className="container">
            <div className="about-content">
              <motion.div
                className="about-text"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2>About Our Academy</h2>
                <p>
                  Mahapola Ports & Maritime Academy is Sri Lanka's premier maritime education
                  and training institution, committed to excellence in seafaring education and
                  professional development.
                </p>
                <p>
                  With state-of-the-art facilities and experienced instructors, we provide
                  comprehensive training programs that meet international maritime standards
                  and prepare our students for successful careers in the maritime industry.
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Link to="/about" className="btn btn-primary">
                    Learn More About Us
                    <FaChevronRight className="btn-arrow" />
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                className="about-image"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="image-placeholder">
                  <FaShip className="placeholder-icon" />
                  <p>Maritime Training Center</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </ScrollytellingSection>
    </div>
  );
};

export default Home;