import React from 'react';
import { motion } from 'framer-motion';
import {
  FaBullseye, FaEye, FaTrophy, FaHandshake,
  FaShip, FaCompass, FaStar, FaHeart
} from 'react-icons/fa';
import './MissionCards.css';

const MissionCards = () => {
  const cards = [
    {
      icon: FaBullseye,
      title: "Our Mission",
      text: "To provide world-class maritime education and training",
      gradient: "from-blue-500 to-purple-600",
      bgPattern: "ocean"
    },
    {
      icon: FaEye,
      title: "Our Vision",
      text: "To be the leading maritime academy in South Asia",
      gradient: "from-purple-500 to-pink-600",
      bgPattern: "waves"
    },
    {
      icon: FaTrophy,
      title: "Our Values",
      text: "Excellence, Integrity, and Innovation",
      gradient: "from-green-500 to-teal-600",
      bgPattern: "stars"
    },
    {
      icon: FaHandshake,
      title: "Our Commitment",
      text: "Dedicated to student success and industry needs",
      gradient: "from-orange-500 to-red-600",
      bgPattern: "compass"
    }
  ];

  return (
    <div className="mission-cards-container">
      <div className="mission-cards-grid">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className={`mission-card ${card.bgPattern}`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              type: "spring",
              bounce: 0.4
            }}
            whileHover={{
              y: -10,
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="card-background">
              <div className="card-shine"></div>
              <div className="card-particles">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="particle" style={{
                    animationDelay: `${i * 0.5}s`,
                    left: `${20 + i * 15}%`,
                    top: `${10 + (i % 2) * 60}%`
                  }}></div>
                ))}
              </div>
            </div>

            <div className="card-content">
              <motion.div
                className={`card-icon bg-gradient-to-br ${card.gradient}`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <card.icon />
              </motion.div>

              <motion.h3
                className="card-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {card.title}
              </motion.h3>

              <motion.p
                className="card-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {card.text}
              </motion.p>
            </div>

            <div className="card-border"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MissionCards;