
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaAnchor, FaShip, FaShippingFast, FaWarehouse, FaBoxes } from 'react-icons/fa';
import './NewsEvents.css';

const newsData = [
  {
    id: 1,
    title: 'Mahapola Academy Hosts Annual Maritime Conference',
    excerpt: 'The Mahapola Ports & Maritime Academy successfully hosted its annual Maritime Conference, bringing together industry experts, students, and stakeholders to discuss the latest trends and challenges in the maritime sector.',
    date: '2025-11-10',
    category: 'Conference',
    image: 'https://c4.wallpaperflare.com/wallpaper/361/145/166/reflection-port-tourist-attraction-water-wallpaper-preview.jpg',
    featured: true
  },
  {
    id: 2,
    title: 'New Training Simulator Enhances Student Learning',
    excerpt: 'The academy has introduced a state-of-the-art training simulator to provide students with hands-on experience in various maritime operations.',
    date: '2025-10-28',
    category: 'Technology',
    image: 'https://e0.pxfuel.com/wallpapers/649/961/desktop-wallpaper-container-ship-ship-berth.jpg'
  },
  {
    id: 3,
    title: 'Academy Partners with Global Shipping Company',
    excerpt: 'Mahapola Ports & Maritime Academy has formed a strategic partnership with a leading global shipping company to offer internships and job opportunities to its graduates.',
    date: '2025-10-20',
    category: 'Partnership',
    image: 'https://media.istockphoto.com/id/968819844/photo/logistics-and-transportation-of-container-cargo-ship-and-cargo-plane-with-working-crane-bridge.jpg?s=612x612&w=0&k=20&c=sxdjLo90_yDs1qAaKsYoHusA1Zzd-FXPEk-QXavsN-8='
  },
  {
    id: 4,
    title: 'Mahapola Alumni Achieve Success in the Industry',
    excerpt: 'Several alumni of Mahapola Ports & Maritime Academy have achieved significant success in their careers, holding key positions in renowned maritime organizations.',
    date: '2025-10-12',
    category: 'Alumni',
    image: 'https://media.istockphoto.com/id/476502554/photo/ship-loaded-in-new-york-container-terminal.jpg?s=612x612&w=0&k=20&c=SurPEfGIV04tdxNf4TBFxUCph6j3c6UrJAeztOFGOHs='
  },
  {
    id: 5,
    title: 'Upcoming Workshop on Port Management',
    excerpt: 'The academy will be conducting a workshop on port management, covering topics such as logistics, operations, and sustainability.',
    date: '2025-10-05',
    category: 'Workshop',
    image: 'https://media.istockphoto.com/id/479431970/photo/container-operation-in-port.jpg?s=612x612&w=0&k=20&c=aNjl9SjxVBOEWPU_zQ4TGxStuY5bnBKDNXwOlgXbhgc='
  },
  {
    id: 6,
    title: 'Maritime Ports Modernization',
    excerpt: 'Major upgrades are underway at the Mahapola Ports to enhance capacity and efficiency, supporting the region’s growing maritime trade.',
    date: '2025-09-28',
    category: 'Development',
    image: 'https://www.easyhaul.com/blog/wp-content/uploads/2022/12/Main-image-maritime-ports.png'
  },
  {
    id: 7,
    title: 'SLPA Maritime Article 2024',
    excerpt: 'A new article highlights the achievements and future plans of the Sri Lanka Ports Authority and Mahapola Academy.',
    date: '2025-09-15',
    category: 'Article',
    image: 'https://www.slpa.lk/uploads/article_main/article_image_2024_08_01_1722483060.jpg'
  },
  {
    id: 8,
    title: 'Historic Port Operations',
    excerpt: 'A look back at the historic operations and milestones achieved at the port over the last decade.',
    date: '2025-09-01',
    category: 'History',
    image: 'https://www.slpa.lk/uploads/article_main/article_image_2017_11_06_1509964653.jpg'
  }
];

const recentPosts = [
  {
    id: 1,
    title: 'Academy Hosts Career Fair for Maritime Students',
    date: 'July 15, 2024',
    image: 'https://media.istockphoto.com/id/968819844/photo/logistics-and-transportation-of-container-cargo-ship-and-cargo-plane-with-working-crane-bridge.jpg?s=612x612&w=0&k=20&c=sxdjLo90_yDs1qAaKsYoHusA1Zzd-FXPEk-QXavsN-8='
  },
  {
    id: 2,
    title: 'New Research Center Opens at Mahapola Academy',
    date: 'July 9, 2024',
    image: 'https://media.istockphoto.com/id/476502554/photo/ship-loaded-in-new-york-container-terminal.jpg?s=612x612&w=0&k=20&c=SurPEfGIV04tdxNf4TBFxUCph6j3c6UrJAeztOFGOHs='
  },
  {
    id: 3,
    title: 'Students Participate in International Maritime Competition',
    date: 'July 3, 2024',
    image: 'https://media.istockphoto.com/id/479431970/photo/container-operation-in-port.jpg?s=612x612&w=0&k=20&c=aNjl9SjxVBOEWPU_zQ4TGxStuY5bnBKDNXwOlgXbhgc='
  }
];

const NewsEvents = () => {
  const [search, setSearch] = useState('');
  const filteredNews = newsData.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.excerpt.toLowerCase().includes(search.toLowerCase())
  );
  const featured = newsData.find(n => n.featured);
  const latest = filteredNews.filter(n => !n.featured).slice(0, 4);
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
      <div style={{height: '80px'}}></div>
      <section className="news-hero" style={{backgroundImage: `url('/assets/images/ocean-bg.jpg')`}}>
        <div className="news-hero-content">
          <h1>News and Events</h1>
          <p>Stay updated with the latest happenings at Mahapola Ports Maritime Academy. Explore our news articles, event announcements, and important updates.</p>
          <div className="search-bar">
            <span className="search-icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="7" stroke="#22292f" strokeWidth="2" />
                <line x1="16.2" y1="16.2" x2="20" y2="20" stroke="#22292f" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <input
              className="search-input"
              type="text"
              placeholder="Search here....."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="featured-news-section">
        <div className="container">
          {featured && (
            <div className="featured-news-card">
              <div className="featured-news-img-container">
                <img src={featured.image} alt={featured.title} className="featured-news-img" />
              </div>
              <div className="featured-news-content">
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <span className="featured-news-date">{featured.date}</span>
              </div>
            </div>
          )}
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
          <h3 className="section-title">Latest News</h3>
          <div className="news-grid">
            {latest.map(item => (
              <div key={item.id} className="news-card">
                <div className="news-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="news-content">
                  <div className="news-category">{item.category}</div>
                  <h4>{item.title}</h4>
                  <p>{item.excerpt}</p>
                  <div className="news-meta">
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="recent-posts-section">
        <div className="container">
          <h3 className="section-title">Recent Posts</h3>
          <div className="recent-posts-list">
            {recentPosts.map(post => (
              <div key={post.id} className="recent-post-card">
                <img src={post.image} alt={post.title} className="recent-post-img" />
                <div className="recent-post-content">
                  <h5>{post.title}</h5>
                  <span className="recent-post-date">{post.date}</span>
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