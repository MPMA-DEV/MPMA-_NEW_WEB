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

  // Course streams data - expandable list for additional courses
  const courseStreams = [
    { name: 'Equipment Operations & Logistics', path: '/courses/equipment-operations' },
    { name: 'Fire Safety & Occupational Health', path: '/courses/fire-safety' },
    { name: 'Information Systems', path: '/courses/information-systems' },
    { name: 'Management', path: '/courses/management' },
    { name: 'Maritime & Seamanship', path: '/courses/maritime-seamanship' },
    { name: 'Technical 1', path: '/courses/technical-1' },
    { name: 'Technical 2', path: '/courses/technical-2' },
    { name: 'Forklift Tug Operations', path: '/courses/forklift-tug-operations' },
    { name: 'Crane Operator Training', path: '/courses/crane-operator-training' },
    { name: 'Movers Operators Training', path: '/courses/movers-operators' },
    { name: 'Crane Operator Training 2', path: '/courses/crane-operator-training-2' },
    // Space for additional courses - easily expandable
  ];

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
          <FaAnchor className="brand-icon" />
          <div className="brand-text">
            <span className="brand-name">Mahapola Ports & Maritime Academy</span>
            <span className="brand-subtitle">Sri Lanka Ports Authority</span>
          </div>
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

          {/* Course Streams Dropdown */}
          <div
            className="nav-item dropdown"
            onClick={(e) => handleDropdownClick(e, 'courses')}
          >
            <span className="dropdown-trigger">
              Course Streams
              <FaChevronDown className={`dropdown-icon ${openDropdown === 'courses' ? 'open' : ''}`} />
            </span>
            {openDropdown === 'courses' && (
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <div className="dropdown-header">All Course Streams</div>
                {courseStreams.map((course) => (
                  <Link
                    key={course.path}
                    to={course.path}
                    className="dropdown-item"
                  >
                    {course.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

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

          {/* Registration Dropdown */}
          <div
            className="nav-item dropdown apply-dropdown"
            onClick={(e) => handleDropdownClick(e, 'registration')}
          >
            <span className="dropdown-trigger apply-btn">
              Apply Now
              <FaChevronDown className={`dropdown-icon ${openDropdown === 'registration' ? 'open' : ''}`} />
            </span>
            {openDropdown === 'registration' && (
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <div className="dropdown-header">Application Process</div>
                {registrationPages.map((reg) => (
                  <Link
                    key={reg.path}
                    to={reg.path}
                    className="dropdown-item"
                  >
                    {reg.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
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

          <div className="mobile-nav-section">
            <div className="mobile-section-title">Course Streams</div>
            {courseStreams.map((course) => (
              <Link key={course.path} to={course.path} className="mobile-nav-item sub">
                {course.name}
              </Link>
            ))}
          </div>

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

          <div className="mobile-nav-section">
            <div className="mobile-section-title">Apply Now</div>
            {registrationPages.map((reg) => (
              <Link key={reg.path} to={reg.path} className="mobile-nav-item sub">
                {reg.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default GlassNavbar;
