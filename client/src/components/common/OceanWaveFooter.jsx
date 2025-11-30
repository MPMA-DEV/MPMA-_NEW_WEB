// ============================================
// PREMIUM OCEAN WAVE FOOTER COMPONENT
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import './OceanWaveFooter.css';

const OceanWaveFooter = () => {
  return (
    <footer className="ocean-wave-footer">
      {/* Wavy Top Border */}
      <div className="wave-top">
        <svg viewBox="0 0 1200 150" preserveAspectRatio="none" className="wave-svg">
          <defs>
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="30%" stopColor="#0f172a" />
              <stop offset="70%" stopColor="#164e63" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>
          <path
            d="M0,60 Q150,-10 300,50 T600,30 T900,10 T1200,50 Q1050,100 900,80 T600,110 T300,80 Q150,110 0,80 Q0,70 0,60 Z"
            fill="url(#oceanGradient)"
          />
          <path
            d="M0,80 Q200,20 400,70 T800,50 T1200,80 Q1000,130 800,100 T400,130 T0,100 Q0,90 0,80 Z"
            fill="rgba(8, 145, 178, 0.3)"
          />
        </svg>
      </div>

      <div className="footer-content">
        <div className="footer-grid">
          {/* Academy Information */}
          <div className="academy-section">
            <h2 className="academy-title">Mahapola Ports & Maritime Academy</h2>
            <h3 className="authority-title">Sri Lanka Ports Authority</h3>
            <p className="hub-tagline">Sri Lanka The Maritime Hub</p>
          </div>

          {/* Contact Section */}
          <div className="contact-section">
            <h3 className="contact-title">Contact Us</h3>
            <div className="contact-details">
              <p className="contact-address">
                507, De-La Salle Street, Colombo 15, Sri Lanka.
              </p>
              <div className="contact-phones">
                <p>+94 11 25 22 452</p>
                <p>+94 11 25 23 268</p>
                <p>+94 11 25 27 883</p>
              </div>
              <p className="contact-email">mahapola@slpa.lk</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Mahapola Ports & Maritime Academy. All rights reserved.</p>
        </div>

        {/* Policy Links */}
        <div className="footer-policy-links">
          <Link to="/privacy-policy" className="policy-link">PRIVACY POLICY</Link>
          <span className="policy-divider">|</span>
          <Link to="/terms-of-use" className="policy-link">TERMS OF USE</Link>
          <span className="policy-divider">|</span>
          <Link to="/site-map" className="policy-link">SITE MAP</Link>
        </div>
      </div>
    </footer>
  );
};

export default OceanWaveFooter;