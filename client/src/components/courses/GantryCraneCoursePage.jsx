import React, { useState } from 'react';
import './GantryCraneCoursePage.css';
import { FaBookOpen, FaDollarSign, FaUserCheck, FaChalkboardTeacher, FaDesktop, FaFileAlt, FaBriefcase } from 'react-icons/fa';

const TABS = [
  { label: 'Course Content', icon: <FaBookOpen /> },
  { label: 'Fees', icon: <FaDollarSign /> },
  { label: 'Entry Requirement', icon: <FaUserCheck /> },
  { label: 'Lecturers', icon: <FaChalkboardTeacher /> },
];


export default function GantryCraneCoursePage() {
  const [activeTab, setActiveTab] = useState(0);
  const images = [
    'https://mintra.com/assets/courses/gantry-cranes-training/_lsMfitJpg/Gantry-Cranes-Training.jpg',
    'https://www.marineinsight.com/wp-content/uploads/2018/11/Port-Gantry-Cranes.png',
    'https://t4.ftcdn.net/jpg/01/96/13/15/360_F_196131517_QYdnr3aoebusjZu3yTBdUk0DcrDBB0LS.jpg',
  ];

  const [loading, setLoading] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [imgVisible, setImgVisible] = useState([false, false, false]);
  const imgRefs = React.useRef([null, null, null]);
  React.useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx);
            setTimeout(() => {
              setImgVisible(v => {
                const arr = [...v];
                arr[idx] = true;
                return arr;
              });
            }, idx * 200); // stagger 0.2s
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    imgRefs.current.forEach((ref, idx) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <div className="gccp-root">
      {/* Header (dummy) */}
      <header className="gccp-header">
        <h1>Mahapola Ports & Maritime Academy</h1>
      </header>

      {/* Hero Section (animated) */}
      <section className="gccp-hero-alt prime-hero-bg">
        <div className="prime-hero-overlay" />
        <div className="prime-hero-content">
          <h2
            className={`prime-hero-title crane-hero-anim ${heroVisible ? 'ch-anim-in' : ''}`}
          >
            Course On Gantry-Crane Operator’s Training
          </h2>
          <div className="prime-hero-actions-vertical">
            <a
              href="#course-schedule"
              className={`prime-hero-link crane-link-anim ${heroVisible ? 'cl-anim-in' : ''}`}
            >
              Course Schedule
            </a>
            <button
              className={`prime-hero-btn crane-btn-anim crane-btn-animated ${heroVisible ? 'cb-anim-in' : ''}`}
              onClick={e => {
                setLoading(true);
                // Ripple effect
                const btn = e.currentTarget;
                const ripple = document.createElement('span');
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.className = 'crane-btn-ripple';
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 500);
              }}
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
          {[0,1].map(idx => (
            <div
              key={idx}
              className={`gccp-image-card crane-img-anim${imgVisible[idx] ? ' ci-anim-in' : ''}`}
              ref={el => imgRefs.current[idx] = el}
              data-idx={idx}
            >
              <img src={images[idx]} alt={`Gantry Crane ${idx+1}`} className="gccp-img" loading="lazy" />
            </div>
          ))}
        </div>
        <div className="gccp-image-row">
          <div
            className={`gccp-image-card crane-img-anim${imgVisible[2] ? ' ci-anim-in' : ''}`}
            ref={el => imgRefs.current[2] = el}
            data-idx={2}
          >
            <img src={images[2]} alt="Gantry Crane 3" className="gccp-img" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Title + Date Section */}
      <section className="gccp-title-date">
        <h2 className="gccp-title">COURSE ON GANTRY-CRANE OPERATOR'S TRAINING – COURSE SCHEDULE</h2>
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
