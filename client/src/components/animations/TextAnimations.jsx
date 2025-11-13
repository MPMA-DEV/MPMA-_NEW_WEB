// ============================================
// TEXT ANIMATIONS COMPONENT
// Various text animation effects
// ============================================

import React from 'react';
import { motion } from 'framer-motion';
import './TextAnimations.css';

// Fade in word by word
export const FadeInWords = ({ text, delay = 0 }) => {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.div
      className="text-animation-container"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className="text-word"
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.div>
  );
};

// Typewriter effect
export const TypewriterText = ({ text, speed = 50 }) => {
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <div className="typewriter-text">
      {displayText}
      <span className="typewriter-cursor">|</span>
    </div>
  );
};

// Gradient animated text
export const GradientText = ({ children, gradient }) => {
  return (
    <motion.span
      className="gradient-text"
      style={{
        background: gradient || 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #f59e0b 100%)',
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
};

// Split text with stagger animation
export const SplitText = ({ text, delay = 0 }) => {
  const letters = text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.div
      className="split-text-container"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={child}
          className="split-letter"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Glitch text effect
export const GlitchText = ({ children }) => {
  return (
    <div className="glitch-text" data-text={children}>
      {children}
    </div>
  );
};

// Rotating words
export const RotatingWords = ({ words, interval = 2000 }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <div className="rotating-words-container">
      <motion.span
        key={currentIndex}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="rotating-word"
      >
        {words[currentIndex]}
      </motion.span>
    </div>
  );
};