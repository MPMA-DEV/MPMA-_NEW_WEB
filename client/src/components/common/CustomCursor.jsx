// ============================================
// CUSTOM CURSOR COMPONENT
// Animated custom mouse pointer
// ============================================

import React, { useEffect, useState } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  // State to track cursor position
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // State to track if cursor is hovering over clickable element
  const [isHovering, setIsHovering] = useState(false);
  
  // State to track if cursor is clicking
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Update cursor position on mouse move
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    // Detect hover over clickable elements
    const handleMouseOver = (e) => {
      // Check if element is clickable
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.onclick ||
        target.classList.contains('clickable') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      }
    };

    // Reset hover state
    const handleMouseOut = () => {
      setIsHovering(false);
    };

    // Track mouse clicks
    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <div
        className={`custom-cursor ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
      
      {/* Cursor ring/follower */}
      <div
        className={`custom-cursor-ring ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
};

export default CustomCursor;