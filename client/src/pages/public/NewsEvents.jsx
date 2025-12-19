import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaAnchor, FaShip, FaShippingFast, FaWarehouse, FaBoxes } from 'react-icons/fa';
import './NewsEvents.css';

const NewsEvents = () => {
  const [news] = useState([
    {
      id: 1,
      title: 'New Maritime Training Facility Opened',
      excerpt: 'State-of-the-art training facility inaugurated with cutting-edge equipment and simulators for comprehensive maritime education.',
      date: '2025-11-01',
      category: 'Facilities',
      image: '/assets/images/news1.jpg'
    },
    {
      id: 2,
      title: 'International Accreditation Achieved',
      excerpt: 'Academy receives international maritime certification recognizing excellence in maritime training and education standards.',
      date: '2025-10-15',
      category: 'Achievement',
      image: '/assets/images/news2.jpg'
    },
    {
      id: 3,
      title: 'New Course Offerings for 2026',
      excerpt: 'Expanded curriculum to meet industry demands with specialized programs in modern port operations and logistics.',
      date: '2025-10-01',
      category: 'Academic',
      image: '/assets/images/news3.jpg'
    },
    {
      id: 4,
      title: 'Student Success Stories',
      excerpt: 'Our graduates excel in leading maritime companies across the globe, making significant contributions to the industry.',
      date: '2025-09-20',
      category: 'Students',
      image: '/assets/images/news4.jpg'
    }
  ]);

  // Floating port icons configuration
  const floatingIcons = [
    { Icon: FaAnchor, delay: 0, duration: 6, x: '10%', startY: '20%' },
    { Icon: FaShip, delay: 1, duration: 7, x: '85%', startY: '60%' },
    { Icon: FaShippingFast, delay: 2, duration: 8, x: '70%', startY: '25%' },
    { Icon: FaWarehouse, delay: 1.5, duration: 7.5, x: '25%', startY: '70%' },
    { Icon: FaBoxes, delay: 0.5, duration: 6.5, x: '90%', startY: '35%' },
    { Icon: FaAnchor, delay: 2.5, duration: 8, x: '15%', startY: '80%' },
    { Icon: FaShip, delay: 3, duration: 6, x: '60%', startY: '15%' },
  ];

  return (
    <div className="news-events-page">
      {/* Wavy Header Section */}
      <section className="news-wavy-header">
        {/* Background with floating icons */}
        <div className="wavy-bg-container">
          {/* Floating Port Icons */}
          {floatingIcons.map((item, index) => (
            <motion.div
              key={index}
              className="floating-port-icon"
              style={{ left: item.x, top: item.startY }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <item.Icon />
            </motion.div>
          ))}

          {/* Animated Wave Layers */}
          <div className="wave-layer wave-layer-1"></div>
          <div className="wave-layer wave-layer-2"></div>
          <div className="wave-layer wave-layer-3"></div>
        </div>

        {/* Header Content */}
        <div className="wavy-header-content">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="header-text-content"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="wavy-header-title"
            >
              News & Events
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="wavy-header-subtitle"
            >
              Stay updated with the latest happenings at Mahapola Ports & Maritime Academy
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="header-decorative-line"
            ></motion.div>
          </motion.div>
        </div>
      </section>

      {/* News Grid Section */}
      <section className="news-section">
        <div className="container">
          <div className="news-grid">
            {news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="news-card"
              >
                <div className="news-card-image">
                  <div className="news-category-badge">{item.category}</div>
                </div>
                <div className="news-card-content">
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <div className="news-meta">
                    <span className="news-date">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <a href="#" className="read-more">
                      <span>Read More</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsEvents;