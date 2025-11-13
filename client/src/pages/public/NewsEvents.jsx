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
      <section className="page-hero">
        <div className="container">
          <h1>News & Events</h1>
          <p>Stay updated with the latest from Mahapola Maritime Academy</p>
        </div>
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