// ============================================
// HEADER COMPONENT
// Main navigation header with animations
// ============================================

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaPhone, FaEnvelope, FaChevronDown, FaAnchor } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for scroll behavior
  const [isScrolled, setIsScrolled] = useState(false);
  
  // State for dropdown menus
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Get current location
  const location = useLocation();

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location]);

  // Navigation items with dropdowns
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    {
      name: 'Course Streams',
      path: '/courses',
      dropdown: [
        { name: 'EQUIPMENT OPERATIONS & LOGISTICS', path: '/courses/equipment-operations' },
        { name: 'FIRE SAFETY & OCCUPATIONAL HEALTH', path: '/courses/fire-safety' },
        { name: 'INFORMATION SYSTEMS', path: '/courses/information-systems' },
        { name: 'MANAGEMENT', path: '/courses/management' },
        { name: 'MARITIME & SEAMANSHIP', path: '/courses/maritime-seamanship' },
        { name: 'TECHNICAL (Electrical & Electronic, Industrial Engineering)', path: '/courses/technical-1' },
        { name: 'TECHNICAL (Workshop Practice)', path: '/courses/technical-2' },
      ],
    },
    {
      name: 'Results',
      path: '/results',
      dropdown: [
        { name: 'Certificate Verification', path: '/results/certificate-verification' },
        { name: 'Internal Exam Results', path: '/results/internal-results' },
        { name: 'External Exam Results', path: '/results/external-results' },
      ],
    },
    { name: 'News & Events', path: '/news-events' },
    { name: 'Contact', path: '/contact' },
  ];

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle dropdown
  const toggleDropdown = (itemName) => {
    if (openDropdown === itemName) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(itemName);
    }
  };

  return (
    <>
      {/* Top bar with contact info */}
      <div className="header-topbar">
        <div className="container">
          <div className="topbar-content">
            <div className="topbar-left">
              <a href="tel:+94112345678" className="topbar-link">
                <FaPhone /> +94 11 234 5678
              </a>
              <a href="mailto:info@mahapola.lk" className="topbar-link">
                <FaEnvelope /> info@mahapola.lk
              </a>
            </div>
            <div className="topbar-right">
              <Link to="/registration/personal-information" className="btn-apply">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="header-content">
            {/* Logo */}
            <Link to="/" className="header-logo">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="logo-container"
              >
                <div className="logo-icon">
                  <FaAnchor style={{ color: 'yellow', fontSize: '1.5rem' }} />
                </div>
                <div className="logo-text">
                  <h1>Mahapola Ports & Maritime Academy</h1>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="desktop-nav">
              <ul className="nav-list">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="nav-item"
                    onMouseEnter={() => item.dropdown && setOpenDropdown(item.name)}
                    onMouseLeave={() => item.dropdown && setOpenDropdown(null)}
                  >
                    {item.dropdown ? (
                      <>
                        <span className="nav-link dropdown-trigger">
                          {item.name} <FaChevronDown className="dropdown-icon" />
                        </span>
                        <AnimatePresence>
                          {openDropdown === item.name && (
                            <motion.ul
                              className="dropdown-menu"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.dropdown.map((dropItem) => (
                                <li key={dropItem.name}>
                                  <Link
                                    to={dropItem.path}
                                    className="dropdown-link"
                                  >
                                    {dropItem.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Mobile menu button */}
            <button
              className="mobile-menu-btn"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="mobile-nav-list">
                {navItems.map((item) => (
                  <li key={item.name} className="mobile-nav-item">
                    {item.dropdown ? (
                      <>
                        <button
                          className="mobile-nav-link"
                          onClick={() => toggleDropdown(item.name)}
                        >
                          {item.name} <FaChevronDown className={`dropdown-icon ${openDropdown === item.name ? 'open' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {openDropdown === item.name && (
                            <motion.ul
                              className="mobile-dropdown"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              {item.dropdown.map((dropItem) => (
                                <li key={dropItem.name}>
                                  <Link
                                    to={dropItem.path}
                                    className="mobile-dropdown-link"
                                  >
                                    {dropItem.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
                <li className="mobile-nav-item">
                  <Link to="/registration/personal-information" className="btn-apply-mobile">
                    Apply Now
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;