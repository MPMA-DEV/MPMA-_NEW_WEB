// ============================================
// FOOTER COMPONENT
// Main footer with wave animation
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChevronRight
} from 'react-icons/fa';
import { CONTACT_INFO } from '../../utils/constants';
import './Footer.css';

const Footer = () => {
  // Current year for copyright
  const currentYear = new Date().getFullYear();

  // Quick links
  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'News & Events', path: '/news-events' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Apply Now', path: '/registration/personal-information' },
  ];

  // Course categories
  const courseCategories = [
    { name: 'Equipment Operations', path: '/courses/equipment-operations' },
    { name: 'Fire Safety', path: '/courses/fire-safety' },
    { name: 'Maritime & Seamanship', path: '/courses/maritime-seamanship' },
    { name: 'Technical Training', path: '/courses/technical' },
    { name: 'Management', path: '/courses/management' },
  ];

  // Social media links
  const socialLinks = [
    { icon: <FaFacebookF />, url: 'https://facebook.com/mahapola', name: 'Facebook' },
    { icon: <FaTwitter />, url: 'https://twitter.com/mahapola', name: 'Twitter' },
    { icon: <FaLinkedinIn />, url: 'https://linkedin.com/company/mahapola', name: 'LinkedIn' },
    { icon: <FaInstagram />, url: 'https://instagram.com/mahapola', name: 'Instagram' },
    { icon: <FaYoutube />, url: 'https://youtube.com/mahapola', name: 'YouTube' },
  ];

  return (
    <footer className="footer">
      {/* Animated ocean waves */}
      <div className="footer-waves">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
        <div className="wave wave4"></div>
      </div>

      {/* Main footer content */}
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* Academy Info */}
            <div className="footer-column">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <span>🚢</span>
                </div>
                <div className="footer-logo-text">
                  <h3>MAHAPOLA</h3>
                  <p>Ports & Maritime Academy</p>
                </div>
              </div>
              <p className="footer-description">
                Leading maritime education and training institution in Sri Lanka,
                committed to excellence in seafaring education and professional development.
              </p>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={link.path} className="footer-link">
                      <FaChevronRight className="link-icon" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Courses */}
            <div className="footer-column">
              <h4>Courses</h4>
              <ul className="footer-links">
                {courseCategories.map((course, index) => (
                  <motion.li
                    key={course.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <Link to={course.path} className="footer-link">
                      <FaChevronRight className="link-icon" />
                      {course.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-column">
              <h4>Contact Us</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>{CONTACT_INFO.address}</span>
                </div>
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <span>{CONTACT_INFO.phone}</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <span>{CONTACT_INFO.email}</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="social-links">
                <h5>Follow Us</h5>
                <div className="social-icons">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="copyright">
              <p>&copy; {currentYear} Mahapola Ports & Maritime Academy. All rights reserved.</p>
            </div>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;