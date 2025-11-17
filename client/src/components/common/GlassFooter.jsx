// ============================================
// PREMIUM GLASS FOOTER COMPONENT
// Maritime-themed frosted-glass footer
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import { FaAnchor, FaMapMarkerAlt, FaPhone, FaEnvelope, FaChevronRight } from 'react-icons/fa';
import './GlassFooter.css';

const GlassFooter = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Course Streams', path: '/courses/equipment-operations' },
    { name: 'Results', path: '/results/certification-registration' },
    { name: 'News & Events', path: '/news-events' },
    { name: 'Contact', path: '/contact' },
  ];

  const contactInfo = [
    { icon: FaMapMarkerAlt, text: '507, De-La Salle Street, Colombo 15, Sri Lanka.' },
    { icon: FaPhone, text: '+94 11 25 22 452' },
    { icon: FaPhone, text: '+94 11 25 23 268' },
    { icon: FaPhone, text: '+94 11 25 27 883' },
    { icon: FaEnvelope, text: 'mahapola@slpa.lk' },
  ];

  return (
    <footer className="glass-footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section footer-brand">
          <div className="footer-logo">
            <FaAnchor className="footer-logo-icon" />
            <div className="footer-logo-text">
              <h2 className="footer-brand-name">Mahapola Ports & Maritime Academy</h2>
              <p className="footer-brand-subtitle">Sri Lanka Ports Authority</p>
              <p className="footer-brand-tagline">Sri Lanka the Maritime Hub</p>
            </div>
          </div>
          <div className="footer-map">
            <iframe
              title="Mahapola Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.3947753824845!2d79.86583931477426!3d6.961891395019456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259692f0164cb%3A0x5c2e690d87f5c4e1!2sDe%20La%20Salle%20St%2C%20Colombo!5e0!3m2!1sen!2slk!4v1234567890123"
              width="100%"
              height="180"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Contact Details */}
        <div className="footer-section footer-contact">
          <h4 className="footer-section-title">Contact Us</h4>
          <div className="footer-contact-list">
            {contactInfo.map((item, index) => (
              <div key={index} className="footer-contact-item">
                <item.icon className="footer-contact-icon" />
                <span className="footer-contact-text">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section footer-links">
          <h4 className="footer-section-title">Quick Links</h4>
          <div className="footer-links-list">
            {quickLinks.map((link) => (
              <Link key={link.path} to={link.path} className="footer-link">
                <FaChevronRight className="footer-link-icon" />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-bottom-links">
            <Link to="/privacy-policy" className="footer-bottom-link">PRIVACY POLICY</Link>
            <span className="footer-divider">|</span>
            <Link to="/terms-of-use" className="footer-bottom-link">TERMS OF USE</Link>
            <span className="footer-divider">|</span>
            <Link to="/site-map" className="footer-bottom-link">SITE MAP</Link>
          </div>
          <p className="footer-copyright">
            © 2023 Mahapola Ports & Maritime Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default GlassFooter;
