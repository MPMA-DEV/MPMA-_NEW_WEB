// ============================================
// LOADING SPINNER COMPONENT
// Port-themed loading animation
// ============================================

import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  // Determine size class
  const sizeClass = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large',
  }[size] || 'spinner-medium';

  return (
    <div className="loading-spinner-container">
      {/* Ship wheel spinner */}
      <div className={`loading-spinner ${sizeClass}`}>
        <div className="spinner-wheel">
          {/* Create 8 spokes for the ship wheel */}
          {[...Array(8)].map((_, index) => (
            <div key={index} className="spinner-spoke" style={{ transform: `rotate(${index * 45}deg)` }}>
              <div className="spoke-line" />
            </div>
          ))}
        </div>
        
        {/* Center circle */}
        <div className="spinner-center" />
        
        {/* Animated waves */}
        <div className="spinner-waves">
          <div className="wave wave-1" />
          <div className="wave wave-2" />
          <div className="wave wave-3" />
        </div>
      </div>
      
      {/* Loading text */}
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;