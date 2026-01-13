// ============================================
// VIDEO BACKGROUND HERO COMPONENT
// Hero section with video background
// ============================================

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaAnchor, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import './VideoBackgroundHero.css';

const VideoBackgroundHero = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setIsLoaded(true);
      // Auto-play video when loaded
      video.play().catch((error) => {
        console.error('Video autoplay failed:', error);
      });
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const scrollToContent = () => {
    const heroContentSection = document.querySelector('.hero-content-section');
    if (heroContentSection) {
      heroContentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="video-hero-section">
      {/* Video Background */}
      <div className="video-hero-background">
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
        >
          <source src="/assets/videos/video.mp4" type="video/mp4" />
          <source src="/assets/videos/video.webm" type="video/webm" />
        </video>
        
        {/* Elegant Overlay */}
        <div className="video-hero-overlay"></div>
      </div>

      {/* Hero Content on Video */}
      <div className="video-hero-content">
        <motion.div
          className="hero-text-wrapper"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Main Title */}
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Mahapola Ports & Maritime Academy
          </motion.h1>

          {/* Action Buttons */}
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <a href="/courses" className="btn-hero btn-hero-secondary">
              <span>Courses</span>
              <span className="btn-arrow">→</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      {/* Mute Button */}
      {isLoaded && (
        <motion.button
          className="mute-toggle-btn"
          onClick={toggleMute}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, delay: 2 }}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </motion.button>
      )}
    </section>
  );
};

export default VideoBackgroundHero;
