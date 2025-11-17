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
      image: 'https://www.rmanews.net/wp-content/uploads/2023/08/c-users-gcpi-robby-desktop-prs-medallion-shipping-1.jpeg',
    },
    {
      id: 2,
      title: 'Port Operations',
      description: 'Modern port management',
      image: 'https://www.nmuc.edu.my/wp-content/uploads/2024/07/operations-media-split-1-jpg.webp',
    },
    {
      id: 3,
      title: 'Ship Navigation',
      description: 'Advanced navigation systems',
      image: 'https://dvzpv6x5302g1.cloudfront.net/AcuCustom/Sitename/DAM/077/Bridge_simulator_training_for_ship_navigation_Main.jpg',
    },
    {
      id: 4,
      title: 'Safety Training',
      description: 'International safety standards',
      image: 'https://www.chas.co.uk/wp-content/uploads/2022/04/shutterstock_1809693421.jpg',
    },
    {
      id: 5,
      title: 'Technical Skills',
      description: 'Hands-on technical training',
      image: 'https://imageio.forbes.com/specials-images/imageserve/62ea057f9f71bb80937b70bb/The-Most-In-Demand-Technical-Skills---And-How-To-Develop-Them/0x0.jpg?width=960&dpr=1.5',
    },
    {
      id: 6,
      title: 'Marine Engineering',
      description: 'State-of-the-art engineering',
      image: 'https://www.chitkara.edu.in/blogs/wp-content/uploads/2022/05/Nautical-Science.jpg',
    },
    {
      id: 7,
      title: 'Cargo Handling',
      description: 'Professional cargo operations',
      image: 'https://www.gslogisticslib.com/wp-content/uploads/2024/05/SC2-1024x576.png',
    },
    {
      id: 8,
      title: 'Maritime Law',
      description: 'International maritime regulations',
      image: 'https://blog.seaplify.com/wp-content/uploads/2023/12/Maritime-Law-Principles-1600x800.webp',
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