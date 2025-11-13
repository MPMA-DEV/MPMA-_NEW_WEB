// ============================================
// MORPHING SHAPES COMPONENT
// SVG shape morphing animations
// ============================================

import React from 'react';
import { motion } from 'framer-motion';
import './MorphingShapes.css';

const MorphingShapes = () => {
  // Different ship and wave shapes
  const shapes = {
    ship1: "M10,50 L20,30 L40,30 L50,50 Z",
    ship2: "M10,50 L15,25 L45,25 L50,50 Z",
    wave1: "M0,20 Q25,10 50,20 T100,20",
    wave2: "M0,20 Q25,30 50,20 T100,20",
  };

  return (
    <div className="morphing-shapes-container">
      {/* Morphing ship */}
      <svg className="morphing-svg" viewBox="0 0 100 100">
        <motion.path
          d={shapes.ship1}
          fill="var(--color-primary-600)"
          animate={{
            d: [shapes.ship1, shapes.ship2, shapes.ship1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* Morphing wave */}
      <svg className="morphing-svg wave" viewBox="0 0 100 40">
        <motion.path
          d={shapes.wave1}
          stroke="var(--color-secondary-500)"
          strokeWidth="2"
          fill="none"
          animate={{
            d: [shapes.wave1, shapes.wave2, shapes.wave1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* Pulsing circle */}
      <svg className="morphing-svg circle" viewBox="0 0 100 100">
        <motion.circle
          cx="50"
          cy="50"
          r="20"
          fill="var(--color-accent-500)"
          animate={{
            r: [20, 30, 20],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* Rotating anchor */}
      <svg className="morphing-svg anchor" viewBox="0 0 100 100">
        <motion.g
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ originX: '50%', originY: '50%' }}
        >
          <path
            d="M50,20 L50,60 M30,60 L70,60 M50,60 Q40,70 30,80 M50,60 Q60,70 70,80"
            stroke="var(--color-primary-700)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="20"
            r="5"
            fill="var(--color-primary-700)"
          />
        </motion.g>
      </svg>
    </div>
  );
};

export default MorphingShapes;