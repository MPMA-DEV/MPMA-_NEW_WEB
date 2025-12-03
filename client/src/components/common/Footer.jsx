// ============================================
// PREMIUM MARITIME WAVY FOOTER COMPONENT
// ============================================


import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaAnchor } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="maritime-footer">
      <div className="wave-container">
        <svg className="ocean-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#164e63" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <path
            d="M0,60 Q300,0 600,60 T1200,60 L1200,120 L0,120 Z"
            fill="url(#waveGradient)"
          />
          <path
            d="M0,80 Q300,40 600,80 T1200,80 L1200,120 L0,120 Z"
            fill="rgba(56,189,248,0.18)"
            opacity="0.7"
          />
        </svg>
      </div>
      <div className="footer-main">
        <div className="footer-grid">
          {/* Academy Branding */}
          <div className="brand-section">
            <div className="brand-header">
              <FaAnchor className="brand-anchor" />
              <div className="brand-text">
                <h2>Mahapola Ports & Maritime Academy</h2>
                <h3>Sri Lanka Ports Authority</h3>
              </div>
            </div>
            <p className="brand-tagline">Sri Lanka The Maritime Hub</p>
          </div>
          {/* Contact Information */}
          <div className="contact-section">
            <h3>Contact Us</h3>
            <div className="contact-details">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>507, De-La Salle Street, Colombo 15, Sri Lanka.</span>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <div className="phone-numbers">
                  <span>+94 11 25 22 452</span>
                  <span>+94 11 25 23 268</span>
                  <span>+94 11 25 27 883</span>
                </div>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>mahapola@slpa.lk</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Mahapola Ports & Maritime Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;