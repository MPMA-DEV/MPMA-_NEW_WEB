import React, { useState } from 'react';
import '../../components/courses/GantryCraneCoursePage.css';
import { FaBookOpen, FaDollarSign, FaUserCheck, FaChalkboardTeacher, FaDesktop, FaFileAlt, FaBriefcase } from 'react-icons/fa';

const TABS = [
  { label: 'Course Content', icon: <FaBookOpen /> },
  { label: 'Fees', icon: <FaDollarSign /> },
  { label: 'Entry Requirement', icon: <FaUserCheck /> },
  { label: 'Lecturers', icon: <FaChalkboardTeacher /> },
];

export default function PrimeMoversOperatorsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const images = [
    'https://d1mth8wtev5prz.cloudfront.net/wp-content/uploads/2023/10/prime-1.webp',
    'https://d1mth8wtev5prz.cloudfront.net/wp-content/uploads/2023/10/prime-2.webp',
    'https://d1mth8wtev5prz.cloudfront.net/wp-content/uploads/2023/11/shutterstock_2350059729-1-scaled.webp',
  ];

  const [loading, setLoading] = useState(false);
  return (
    <div className="gccp-root">
      {/* Header (dummy) */}
      <header className="gccp-header">
        <h1>Mahapola Ports & Maritime Academy</h1>
      </header>

      {/* Hero Section with overlay */}
      <section className="gccp-hero-alt prime-hero-bg">
        <div className="prime-hero-overlay" />
        <div className="prime-hero-content">
          <h2 className="prime-hero-title">Course On Prime-Movers Operator's Training</h2>
          <div className="prime-hero-actions-vertical">
            <a href="#course-schedule" className="prime-hero-link">Course Schedule</a>
            <button
              className="prime-hero-btn"
              onClick={() => setLoading(true)}
              disabled={loading}
              tabIndex={0}
            >
              {loading ? 'Loading...' : 'Apply Now'}
            </button>
          </div>
        </div>
      </section>

      {/* Animated Image Gallery */}
      <section className="gccp-image-gallery">
        <div className="gccp-image-row">
          <div className="gccp-image-card">
            <img src={images[0]} alt="Prime Mover 1" className="gccp-img" loading="lazy" />
          </div>
          <div className="gccp-image-card">
            <img src={images[1]} alt="Prime Mover 2" className="gccp-img" loading="lazy" />
          </div>
        </div>
        <div className="gccp-image-row">
          <div className="gccp-image-card">
            <img src={images[2]} alt="Prime Mover 3" className="gccp-img" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Title + Date Section */}
      <section className="gccp-title-date">
        <h2 className="gccp-title">COURSE ON PRIME-MOVERS OPERATOR'S TRAINING – COURSE SCHEDULE</h2>
        <p className="gccp-date">NEXT COMMENCING DATE : 2017-10-29</p>
      </section>

      {/* Tabbed Section */}
      <nav className="gccp-tabs">
        {TABS.map((tab, idx) => (
          <div
            key={tab.label}
            className={`gccp-tab${activeTab === idx ? ' active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            <span className="gccp-tab-icon">{tab.icon}</span>
            <span className="gccp-tab-label">{tab.label}</span>
          </div>
        ))}
      </nav>

      {/* Tab Content */}
      <section className="gccp-tab-content">
        {activeTab === 0 && (
          <div className="gccp-course-content">
            <div className="gccp-week">
              <h4>WEEK 1</h4>
              <div className="gccp-lectures">
                <span className="gccp-lecture-pill">LECTURE 1.1 - Introduction</span>
                <span className="gccp-lecture-pill">LECTURE 1.2</span>
              </div>
            </div>
            <div className="gccp-week">
              <h4>WEEK 2</h4>
              <div className="gccp-lectures">
                <span className="gccp-lecture-pill">LECTURE 2.0</span>
              </div>
            </div>
            <div className="gccp-how-to-apply">HOW TO APPLY</div>
          </div>
        )}
        {activeTab === 1 && (
          <div className="gccp-tab-placeholder">Fees information coming soon.</div>
        )}
        {activeTab === 2 && (
          <div className="gccp-tab-placeholder">Entry requirements coming soon.</div>
        )}
        {activeTab === 3 && (
          <div className="gccp-tab-placeholder">Lecturer details coming soon.</div>
        )}
      </section>

      {/* Many Ways To Learn Section */}
      <section className="gccp-learn-ways">
        <h3 className="gccp-learn-title">THERE ARE MANY WAYS TO LEARN</h3>
        <div className="gccp-learn-icons">
          <div className="gccp-learn-circle">
            <span className="gccp-learn-badge">1</span>
            <FaDesktop className="gccp-learn-icon" />
            <span className="gccp-learn-label">REGISTRATION</span>
          </div>
          <div className="gccp-learn-circle">
            <span className="gccp-learn-badge">2</span>
            <FaFileAlt className="gccp-learn-icon" />
            <span className="gccp-learn-label">DOCUMENTATION</span>
          </div>
          <div className="gccp-learn-circle">
            <span className="gccp-learn-badge">3</span>
            <FaBriefcase className="gccp-learn-icon" />
            <span className="gccp-learn-label">GET STARTED NOW</span>
          </div>
        </div>
      </section>

      {/* Footer (dummy) */}
      <footer className="gccp-footer">
        <p>© 2025 Mahapola Ports & Maritime Academy</p>
      </footer>
    </div>
  );
}
