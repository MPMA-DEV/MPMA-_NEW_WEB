import React, { useState } from 'react';
import './NewsEvents.css';

const NewsEvents = () => {
  const [news] = useState([
    {
      id: 1,
      title: 'New Maritime Training Facility Opened',
      excerpt: 'State-of-the-art training facility inaugurated...',
      date: '2025-11-01',
      category: 'Facilities'
    },
    {
      id: 2,
      title: 'International Accreditation Achieved',
      excerpt: 'Academy receives international maritime certification...',
      date: '2025-10-15',
      category: 'Achievement'
    },
    {
      id: 3,
      title: 'New Course Offerings for 2026',
      excerpt: 'Expanded curriculum to meet industry demands...',
      date: '2025-10-01',
      category: 'Academic'
    }
  ]);

  return (
    <div className="news-page">
      {/* Modern Energetic Hero Section */}
      <section className="news-hero-modern">
        {/* Animated Background Elements */}
        <div className="hero-bg-pattern"></div>
        
        {/* Floating Maritime Shapes */}
        <div className="floating-shapes">
          <div className="shape shape-wave-1"></div>
          <div className="shape shape-wave-2"></div>
          <div className="shape shape-circle-1"></div>
          <div className="shape shape-circle-2"></div>
          <div className="shape shape-arc-1"></div>
          <div className="shape shape-arc-2"></div>
        </div>

        {/* Animated Dots Background */}
        <div className="dots-background"></div>

        {/* Hero Content */}
        <div className="hero-content-wrapper">
          <div className="hero-content">
            <h1 className="hero-title">News & Events</h1>
            <p className="hero-subtitle">
              Stay updated with the latest announcements, achievements, and happenings.
            </p>
          </div>
        </div>

        {/* Bottom Wave Decoration */}
        <div className="hero-bottom-wave"></div>
      </section>

      <section className="news-section">
        <div className="container">
          <div className="news-grid">
            {news.map(item => (
              <div key={item.id} className="news-card">
                <div className="news-category">{item.category}</div>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
                <div className="news-meta">
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsEvents;