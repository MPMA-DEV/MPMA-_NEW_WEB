// ============================================
// PREMIUM GLASS NAVBAR COMPONENT
// Maritime-themed frosted-glass navigation
// ============================================

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaAnchor, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import './GlassNavbar.css';

const GlassNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();


  // Results pages
  const resultsPages = [
    { name: 'Certification Registration', path: '/results/certification-registration' },
    { name: 'External Results', path: '/results/external-results' },
    { name: 'Internal Results', path: '/results/internal-results' },
  ];


  // Registration pages - Application Process
  const registrationPages = [
    { name: 'Personal Information', path: '/registration/personal-information' },
    { name: 'Course Selection', path: '/registration/course-selection' },
    { name: 'Additional Information', path: '/registration/additional-information' },
    { name: 'Documents', path: '/registration/documents' },
    { name: 'Confirmation / Application Summary', path: '/registration/confirmation' },
    { name: 'Submit Success', path: '/submit-success' },
  ];

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdown) setOpenDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);

  const handleDropdownClick = (e, dropdownName) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <nav className={`glass-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <img src="/assets/images/logo.png" alt="Logo" className="navbar-logo" />
        </Link>
        
        {/* Desktop Menu */}
        <div className="navbar-menu">
          <Link
            to="/"
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>

          <Link
            to="/about"
            className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}
          >
            About Us
          </Link>

          <Link
            to="/courses"
            className={`nav-item ${location.pathname === '/courses' ? 'active' : ''}`}
          >
            Courses
          </Link>

          {/* Results Dropdown */}
          <div
            className="nav-item dropdown"
            onClick={(e) => handleDropdownClick(e, 'results')}
          >
            <span className="dropdown-trigger">
              Results
              <FaChevronDown className={`dropdown-icon ${openDropdown === 'results' ? 'open' : ''}`} />
            </span>
            {openDropdown === 'results' && (
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <div className="dropdown-header">Results & Verification</div>
                {resultsPages.map((result) => (
                  <Link
                    key={result.path}
                    to={result.path}
                    className="dropdown-item"
                  >
                    {result.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/news-events"
            className={`nav-item ${location.pathname === '/news-events' ? 'active' : ''}`}
          >
            News & Events
          </Link>

          <Link
            to="/contact"
            className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`}
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-nav-item">Home</Link>
          <Link to="/about" className="mobile-nav-item">About Us</Link>

          <Link to="/courses" className="mobile-nav-item">Courses</Link>

          <div className="mobile-nav-section">
            <div className="mobile-section-title">Results</div>
            {resultsPages.map((result) => (
              <Link key={result.path} to={result.path} className="mobile-nav-item sub">
                {result.name}
              </Link>
            ))}
          </div>

          <Link to="/news-events" className="mobile-nav-item">News & Events</Link>
          <Link to="/contact" className="mobile-nav-item">Contact Us</Link>
        </div>
      )}
    </nav>
  );
};

export default GlassNavbar;
