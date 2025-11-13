// ============================================
// SCROLLYTELLING SECTION COMPONENT
// Scroll-based storytelling animations
// ============================================

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './ScrollytellingSection.css';

const ScrollytellingSection = ({ children, direction = 'up', delay = 0 }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Different animation directions
  const animations = {
    up: {
      y: useTransform(scrollYProgress, [0, 1], [100, -100]),
      opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]),
    },
    down: {
      y: useTransform(scrollYProgress, [0, 1], [-100, 100]),
      opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]),
    },
    left: {
      x: useTransform(scrollYProgress, [0, 1], [100, -100]),
      opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]),
    },
    right: {
      x: useTransform(scrollYProgress, [0, 1], [-100, 100]),
      opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]),
    },
    scale: {
      scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.8]),
      opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]),
    },
  };

  return (
    <motion.div
      ref={ref}
      className="scrollytelling-section"
      style={animations[direction]}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollytellingSection;