// ============================================
// 3D IMAGE CAROUSEL COMPONENT
// Swiper 3D Coverflow Gallery
// ============================================

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './ImageCarousel3D.css';

const ImageCarousel3D = () => {
  // Gallery images with sample URLs
  const images = [
    {
      id: 1,
      title: 'Maritime Training Excellence',
      description: 'World-class training facilities',
      image: 'https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=800',
    },
    {
      id: 2,
      title: 'Port Operations',
      description: 'Modern port management',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800',
    },
    {
      id: 3,
      title: 'Ship Navigation',
      description: 'Advanced navigation systems',
      image: 'https://images.unsplash.com/photo-1589310243389-96a5483d1bb5?w=800',
    },
    {
      id: 4,
      title: 'Safety Training',
      description: 'International safety standards',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
    },
    {
      id: 5,
      title: 'Technical Skills',
      description: 'Hands-on technical training',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800',
    },
    {
      id: 6,
      title: 'Marine Engineering',
      description: 'State-of-the-art engineering',
      image: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800',
    },
    {
      id: 7,
      title: 'Cargo Handling',
      description: 'Professional cargo operations',
      image: 'https://images.unsplash.com/photo-1568544261634-62a89a6e0e9f?w=800',
    },
    {
      id: 8,
      title: 'Maritime Law',
      description: 'International maritime regulations',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    },
  ];

  return (
    <div className="carousel-3d-container">
      {/* Gallery Header */}
      <motion.div 
        className="gallery-header"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="gallery-title">Maritime Gallery</h2>
        <p className="gallery-subtitle">Explore our world of maritime excellence</p>
      </motion.div>

      {/* Swiper 3D Carousel */}
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        loop={true}
        loopedSlides={8}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          reverseDirection: false,
        }}
        speed={800}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
          type: 'bullets',
        }}
        navigation={false}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="swiper-3d"
      >
        {images.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="swiper-slide-content">
              <div className="slide-image">
                <img 
                  src={item.image} 
                  alt={item.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'linear-gradient(135deg, rgba(62, 103, 131, 0.4) 0%, rgba(90, 138, 170, 0.3) 100%)';
                  }}
                />
              </div>
              <div className="slide-info">
                <h3 className="slide-title">{item.title}</h3>
                <p className="slide-description">{item.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Pagination Bullets */}
      <div className="swiper-pagination"></div>
    </div>
  );
};

export default ImageCarousel3D;