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

import hMNiPf3 from '../../assets/imagecarousel3d/hMNiPf3.jpeg'
import wOCkko2 from '../../assets/imagecarousel3d/wOCkko2.jpeg'
import Ab5Gh7o from '../../assets/imagecarousel3d/Ab5Gh7o.jpeg'
import JIcJTwT from '../../assets/imagecarousel3d/JIcJTwT.jpeg'
import vkNIi6y from '../../assets/imagecarousel3d/vkNIi6y.jpeg'
import iySr14j from '../../assets/imagecarousel3d/iySr14j.jpeg'
import xx4RHkn from '../../assets/imagecarousel3d/xx4RHkn.jpeg'
import QdEnhhr from '../../assets/imagecarousel3d/QdEnhhr.jpeg'

const ImageCarousel3D = () => {
  // Gallery images with Imgur URLs
  const images = [
    {
      id: 1,
      title: 'Maritime Law',
      description: 'International maritime regulations',
      // image: 'https://i.imgur.com/hMNiPf3.jpeg',
      image : hMNiPf3
    },
    {
      id: 2,
      title: 'Maritime Training Excellence',
      description: 'World-class training facilities',
      //image: 'https://i.imgur.com/wOCkko2.jpeg',
      image : wOCkko2
      
      
    },
    {
      id: 3,
      title: 'Port Operations',
      description: 'Modern port management',
      //image: 'https://i.imgur.com/Ab5Gh7o.jpeg',
      image : Ab5Gh7o
    },
    {
      id: 4,
      title: 'Ship Navigation',
      description: 'Advanced navigation systems',
      //image: 'https://i.imgur.com/JIcJTwT.jpeg',
      image : JIcJTwT
    },
    {
      id: 5,
      title: 'Safety Training',
      description: 'International safety standards',
      //image: 'https://i.imgur.com/vkNIi6y.jpeg',
      image : vkNIi6y
    },
    {
      id: 6,
      title: 'Technical Skills',
      description: 'Hands-on technical training',
      //image: 'https://i.imgur.com/iySr14j.jpeg',
      image : iySr14j
    },
    {
      id: 7,
      title: 'Marine Engineering',
      description: 'State-of-the-art engineering',
      //image: 'https://i.imgur.com/8x4RHkn.jpeg',
    image : xx4RHkn
    },
    {
      id: 8,
      title: 'Cargo Handling',
      description: 'Professional cargo operations',
      //image: 'https://i.imgur.com/QdEnhhr.jpeg',
      image : QdEnhhr
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