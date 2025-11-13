// ============================================
// SPLASH SCREEN COMPONENT
// Animated splash screen with video and 3D carousel
// ============================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCarousel3D from './ImageCarousel3D';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Wait a bit before hiding splash screen
          setTimeout(() => {
            setIsVisible(false);
            if (onComplete) onComplete();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated background gradient */}
          <div className="splash-background">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
          </div>

          {/* Video background */}
          <div className="splash-video-container">
            <video
              className="splash-video"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/assets/videos/video.mp4" type="video/mp4" />
            </video>
            <div className="video-overlay"></div>
          </div>

          {/* Main content */}
          <div className="splash-content">
            {/* Animated logo */}
            <motion.div
              className="splash-logo"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 1,
                ease: [0.6, 0.05, 0.01, 0.9],
              }}
            >
              <div className="logo-ship-container">
                <motion.span
                  className="logo-ship"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  🚢
                </motion.span>
              </div>
            </motion.div>

            {/* Academy name */}
            <motion.div
              className="splash-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1>MAHAPOLA</h1>
              <p>Ports & Maritime Academy</p>
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="splash-tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Navigating Excellence in Maritime Education
            </motion.p>

            {/* 3D Image Carousel */}
            <motion.div
              className="splash-carousel"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <ImageCarousel3D />
            </motion.div>

            {/* Loading progress bar */}
            <motion.div
              className="splash-progress-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="progress-text">{progress}%</p>
            </motion.div>

            {/* Animated waves */}
            <div className="splash-waves">
              <div className="wave-line wave-1"></div>
              <div className="wave-line wave-2"></div>
              <div className="wave-line wave-3"></div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;