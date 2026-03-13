
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaAnchor, FaShip, FaShippingFast, FaWarehouse, FaBoxes } from 'react-icons/fa';
import './NewsEvents.css';
import i1 from '../../assets/newsevents/i1.jpg'
import i2 from '../../assets/newsevents/i2.jpg'
import i3 from '../../assets/newsevents/i3.jpg'
import i4 from '../../assets/newsevents/i4.jpg'
import i5 from '../../assets/newsevents/i5.jpg'
import i6 from '../../assets/newsevents/i6.jpg'
import i7 from '../../assets/newsevents/i7.jpg'
import i8 from '../../assets/newsevents/i8.jpg'

const newsData = [
  {
    id: 1,
    title: 'Mahapola Academy Hosts Annual Maritime Conference',
    excerpt: 'The Mahapola Ports & Maritime Academy successfully hosted its annual Maritime Conference, bringing together industry experts, students, and stakeholders to discuss the latest trends and challenges in the maritime sector.',
    date: '2025-11-10',
    category: 'Conference',
    //image: 'https://c4.wallpaperflare.com/wallpaper/361/145/166/reflection-port-tourist-attraction-water-wallpaper-preview.jpg',
    image: i1,
    
  },
  {
    id: 2,
    title: 'New Training Simulator Enhances Student Learning',
    excerpt: 'The academy has introduced a state-of-the-art training simulator to provide students with hands-on experience in various maritime operations.',
    date: '2025-10-28',
    category: 'Technology',
    //image: 'https://e0.pxfuel.com/wallpapers/649/961/desktop-wallpaper-container-ship-ship-berth.jpg'
    image : i2,
  },
  {
    id: 3,
    title: 'Academy Partners with Global Shipping Company',
    excerpt: 'Mahapola Ports & Maritime Academy has formed a strategic partnership with a leading global shipping company to offer internships and job opportunities to its graduates.',
    date: '2025-10-20',
    category: 'Partnership',
    image: i3
    //image: 'https://media.istockphoto.com/id/968819844/photo/logistics-and-transportation-of-container-cargo-ship-and-cargo-plane-with-working-crane-bridge.jpg?s=612x612&w=0&k=20&c=sxdjLo90_yDs1qAaKsYoHusA1Zzd-FXPEk-QXavsN-8='
  },
  {
    id: 4,
    title: 'Mahapola Alumni Achieve Success in the Industry',
    excerpt: 'Several alumni of Mahapola Ports & Maritime Academy have achieved significant success in their careers, holding key positions in renowned maritime organizations.',
    date: '2025-10-12',
    category: 'Alumni',
    image: i4
    //image: 'https://media.istockphoto.com/id/476502554/photo/ship-loaded-in-new-york-container-terminal.jpg?s=612x612&w=0&k=20&c=SurPEfGIV04tdxNf4TBFxUCph6j3c6UrJAeztOFGOHs='
  },
  {
    id: 5,
    title: 'Upcoming Workshop on Port Management',
    excerpt: 'The academy will be conducting a workshop on port management, covering topics such as logistics, operations, and sustainability.',
    date: '2025-10-05',
    category: 'Workshop',
    image: i5
   // image: 'https://media.istockphoto.com/id/479431970/photo/container-operation-in-port.jpg?s=612x612&w=0&k=20&c=aNjl9SjxVBOEWPU_zQ4TGxStuY5bnBKDNXwOlgXbhgc='
  },
  {
    id: 6,
    title: 'Maritime Ports Modernization',
    excerpt: 'Major upgrades are underway at the Mahapola Ports to enhance capacity and efficiency, supporting the region’s growing maritime trade.',
    date: '2025-09-28',
    category: 'Development',
    image: i6
    //image: 'https://www.easyhaul.com/blog/wp-content/uploads/2022/12/Main-image-maritime-ports.png'
  },
  {
    id: 7,
    title: 'SLPA Maritime Article 2024',
    excerpt: 'A new article highlights the achievements and future plans of the Sri Lanka Ports Authority and Mahapola Academy.',
    date: '2025-09-15',
    category: 'Article',
    image: i7
    //image: 'https://www.slpa.lk/uploads/article_main/article_image_2024_08_01_1722483060.jpg'
  },
  {
    id: 8,
    title: 'Historic Port Operations',
    excerpt: 'A look back at the historic operations and milestones achieved at the port over the last decade.',
    date: '2025-09-01',
    category: 'History',
    image: i8
    //image: 'https://www.slpa.lk/uploads/article_main/article_image_2017_11_06_1509964653.jpg'
  }
];

const recentPosts = [
  {
    id: 1,
    title: 'Academy Hosts Career Fair for Maritime Students',
    date: 'July 15, 2024',
    //image: 'https://media.istockphoto.com/id/968819844/photo/logistics-and-transportation-of-container-cargo-ship-and-cargo-plane-with-working-crane-bridge.jpg?s=612x612&w=0&k=20&c=sxdjLo90_yDs1qAaKsYoHusA1Zzd-FXPEk-QXavsN-8='
  },
  {
    id: 2,
    title: 'New Research Center Opens at Mahapola Academy',
    date: 'July 9, 2024',
    //image: 'https://media.istockphoto.com/id/476502554/photo/ship-loaded-in-new-york-container-terminal.jpg?s=612x612&w=0&k=20&c=SurPEfGIV04tdxNf4TBFxUCph6j3c6UrJAeztOFGOHs='
  },
  {
    id: 3,
    title: 'Students Participate in International Maritime Competition',
    date: 'July 3, 2024',
   // image: 'https://media.istockphoto.com/id/479431970/photo/container-operation-in-port.jpg?s=612x612&w=0&k=20&c=aNjl9SjxVBOEWPU_zQ4TGxStuY5bnBKDNXwOlgXbhgc='
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
      {/* Hero Section */}
      <div className="news-hero">
        {/* Bubble Animation */}
        <div className="bubbles">
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
        </div>
        <div className="news-hero-content">
          <h1 className="hero-title">News & Events</h1>
          <p className="hero-subtitle">
            Stay updated with the latest happenings at Mahapola Ports & Maritime Academy
          </p>
        </div>
        <div className="wave-container">
          <svg className="wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,90 1440,60 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </div>

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
    </div>
  );
};

export default NewsEvents;