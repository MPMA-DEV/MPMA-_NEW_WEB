// ============================================
// SCROLL TRIGGERED VIDEO COMPONENT
// Video that plays when scrolled into view
// ============================================

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import './ScrollTriggeredVideo.css';

const ScrollTriggeredVideo = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setIsLoaded(true);
      console.log('Video metadata loaded');
    };

    const handleCanPlay = () => {
      console.log('Video can play');
    };

    const handleError = (e) => {
      console.error('Video error:', e);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Auto-play when in view (muted for browser policy)
            video.play().catch((error) => {
              console.error('Autoplay failed:', error);
              // If autoplay fails, user will need to click play button
              setIsPlaying(false);
            }).then(() => {
              console.log('Video playing');
              setIsPlaying(true);
            });
          } else {
            setIsInView(false);
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      {
        threshold: 0.3, // 30% of video must be visible (more lenient)
        rootMargin: '0px'
      }
    );

    observer.observe(video);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      observer.disconnect();
    };
  }, []);


  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch((error) => {
        console.error('Play failed:', error);
      });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div className="scroll-video-container">
      <motion.div
        className="scroll-video-wrapper"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.video
          ref={videoRef}
          className="scroll-triggered-video"
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <source src="/assets/videos/video.mp4" type="video/mp4" />
          <source src="/assets/videos/video.webm" type="video/webm" />
          Your browser does not support the video tag.
        </motion.video>

        {/* Video Overlay */}
        <div className="video-overlay">
          {!isInView && (
            <motion.div
              className="video-placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="placeholder-icon">🎬</div>
              <p>Scroll down to play video</p>
            </motion.div>
          )}


          {/* Scroll Indicator */}
          {!isInView && (
            <motion.div
              className="scroll-indicator"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="scroll-arrow">↓</div>
              <span>Scroll Down</span>
            </motion.div>
          )}

          {/* Video Controls */}
          {isInView && isLoaded && (
            <motion.div
              className="video-controls visible"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                className="control-btn play-pause-btn"
                onClick={togglePlayPause}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                className="control-btn mute-btn"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
            </motion.div>
          )}
        </div>

        {/* Loading Indicator */}
        {!isLoaded && (
          <motion.div
            className="video-loading"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <div className="loading-spinner"></div>
            <p>Loading video...</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ScrollTriggeredVideo;