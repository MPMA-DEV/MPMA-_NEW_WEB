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

      {/* About Our Academy Section */}
      <section className="about-academy-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>About Our Academy</h2>
            <p>Building maritime professionals for over two decades</p>
          </motion.div>

          <div className="about-circles-row">
            <motion.div
              className="about-circle-item"
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="circle-wrapper">
                <div className="about-circle blue-circle">
                  <FaShip className="circle-icon" />
                </div>
              </div>
              <h3>TRAINING</h3>
            </motion.div>

            <motion.div
              className="about-circle-item"
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="circle-wrapper">
                <div className="about-circle orange-circle">
                  <FaCertificate className="circle-icon" />
                </div>
              </div>
              <h3>CERTIFICATION</h3>
            </motion.div>

            <motion.div
              className="about-circle-item"
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="circle-wrapper">
                <div className="about-circle purple-circle">
                  <FaGlobe className="circle-icon" />
                </div>
              </div>
              <h3>GLOBAL</h3>
            </motion.div>

            <motion.div
              className="about-circle-item"
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="circle-wrapper">
                <div className="about-circle green-circle">
                  <FaGraduationCap className="circle-icon" />
                </div>
              </div>
              <h3>EXCELLENCE</h3>
            </motion.div>

            <motion.div
              className="about-circle-item"
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="circle-wrapper">
                <div className="about-circle teal-circle">
                  <FaAnchor className="circle-icon" />
                </div>
              </div>
              <h3>MARITIME</h3>
            </motion.div>
          </div>

          <motion.div
            className="about-description"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>The Core Values of Our Academy</h3>
            <p>
              Mahapola Ports & Maritime Academy stands as Sri Lanka's premier maritime education institution,
              dedicated to shaping the next generation of seafaring professionals. With world-class training facilities,
              internationally recognized certifications, and a commitment to excellence, we prepare our students
              for successful careers in the global maritime industry.
            </p>
          </motion.div>

          <motion.div
            className="about-cta"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <Link to="/about" className="btn btn-about">
              Learn More About Us
              <FaChevronRight className="btn-arrow" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Announcements / News Section */}
      <section className="announcements-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Latest Updates</h2>
            <p>Stay informed about important announcements and events</p>
          </motion.div>

          <div className="announcements-grid">
            <motion.div
              className="announcement-card"
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="announcement-icon">
                <FaCalendarAlt />
              </div>
              <div className="announcement-content">
                <h3>New Intake 2025</h3>
                <p>Applications are now open for our upcoming maritime training programs. Limited seats available.</p>
                <span className="announcement-date">Starting: January 15, 2025</span>
                <Link to="/registration" className="announcement-link">Apply Now →</Link>
              </div>
            </motion.div>

            <motion.div
              className="announcement-card"
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="announcement-icon">
                <FaBullhorn />
              </div>
              <div className="announcement-content">
                <h3>Maritime Career Fair</h3>
                <p>Join us for our annual career fair featuring top shipping companies and recruitment opportunities.</p>
                <span className="announcement-date">Date: December 10, 2025</span>
                <Link to="/news" className="announcement-link">Learn More →</Link>
              </div>
            </motion.div>

            <motion.div
              className="announcement-card"
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", bounce: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="announcement-icon">
                <FaCertificate />
              </div>
              <div className="announcement-content">
                <h3>New Simulator Facility</h3>
                <p>We are proud to announce the launch of our advanced navigation and engine room simulators.</p>
                <span className="announcement-date">Now Available</span>
                <Link to="/about" className="announcement-link">Explore Facilities →</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FaAnchor className="cta-icon" />
            <h2>Start Your Maritime Journey Today</h2>
            <p>Join thousands of successful graduates who are now sailing the world's oceans</p>
            <Link to="/registration" className="btn btn-cta">
              Join Now
              <FaChevronRight className="btn-arrow" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact Highlight Section */}
      <section className="contact-highlight-section">
        <div className="container">
          <motion.div
            className="contact-highlight-grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div className="contact-info">
                <h4>Address</h4>
                <p>507 De-La Salle Street<br />Colombo 15, Sri Lanka</p>
              </div>
            </div>

            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <div className="contact-info">
                <h4>Phone</h4>
                <p>+94 11 2 234567<br />+94 77 1234567</p>
              </div>
            </div>

            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <div className="contact-info">
                <h4>Email</h4>
                <p>info@mahapola.lk<br />admissions@mahapola.lk</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-map-preview">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798006604756!2d79.86315!3d6.93711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTYnMTMuNiJOIDc5wrA1MSc0Ny4zIkU!5e0!3m2!1sen!2slk!4v1234567890"
                  width="100%"
                  height="120"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Academy Location"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// comment for a initial commit
export default Home;