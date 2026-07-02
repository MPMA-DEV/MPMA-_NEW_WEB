import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import './GlassNavbar.css';

// Base URL of the main website
const MAIN_SITE_URL = 'http://localhost:3001';

const GlassNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Results pages
  const resultsPages = [
    { name: 'Certificate Verification', path: '/results/certificate-verification' },
    { name: 'External Results', path: '/results/external-results' },
    { name: 'Internal Results', path: '/results/internal-results' },
  ];

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdown) setOpenDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);

  const handleDropdownClick = (e: React.MouseEvent, dropdownName: string) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <nav className={`glass-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <a href={MAIN_SITE_URL} className="navbar-brand">
          <img src="/assets/images/logo.png" alt="Logo" className="navbar-logo" />
        </a>
        
        {/* Desktop Menu */}
        <div className="navbar-menu">
          <a href={`${MAIN_SITE_URL}/`} className="nav-item">
            Home
          </a>

          <a href={`${MAIN_SITE_URL}/about`} className="nav-item">
            About Us
          </a>

          <a href={`${MAIN_SITE_URL}/courses`} className="nav-item">
            Courses
          </a>

          {/* Results Dropdown */}
          <div
            className="nav-item dropdown"
            onClick={(e) => handleDropdownClick(e, 'results')}
          >
            <span className="dropdown-trigger flex items-center gap-1 cursor-pointer">
              Results
              <ChevronDown size={12} className={`dropdown-icon ${openDropdown === 'results' ? 'open' : ''}`} />
            </span>
            {openDropdown === 'results' && (
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <div className="dropdown-header">Results & Verification</div>
                {resultsPages.map((result) => (
                  <a
                    key={result.path}
                    href={`${MAIN_SITE_URL}${result.path}`}
                    className="dropdown-item"
                  >
                    {result.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href={`${MAIN_SITE_URL}/news-events`} className="nav-item">
            News & Events
          </a>

          <a href={`${MAIN_SITE_URL}/contact`} className="nav-item">
            Contact Us
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <a href={`${MAIN_SITE_URL}/`} className="mobile-nav-item">Home</a>
          <a href={`${MAIN_SITE_URL}/about`} className="mobile-nav-item">About Us</a>
          <a href={`${MAIN_SITE_URL}/courses`} className="mobile-nav-item">Courses</a>

          <div className="mobile-nav-section">
            <div className="mobile-section-title">Results</div>
            {resultsPages.map((result) => (
              <a key={result.path} href={`${MAIN_SITE_URL}${result.path}`} className="mobile-nav-item sub">
                {result.name}
              </a>
            ))}
          </div>

          <a href={`${MAIN_SITE_URL}/news-events`} className="mobile-nav-item">News & Events</a>
          <a href={`${MAIN_SITE_URL}/contact`} className="mobile-nav-item">Contact Us</a>
        </div>
      )}
    </nav>
  );
};

export default GlassNavbar;
