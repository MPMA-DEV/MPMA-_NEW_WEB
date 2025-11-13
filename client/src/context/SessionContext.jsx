// ============================================
// SESSION TIMEOUT CONTEXT
// Manages session timeout (5 minutes inactivity)
// ============================================

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { SESSION_TIMEOUT } from '../utils/constants';
import toast from 'react-hot-toast';

// Create context
const SessionContext = createContext(null);

// Custom hook to use session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};

// Session Provider Component
export const SessionProvider = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  
  // Reference to store timeout ID
  const timeoutRef = useRef(null);
  
  // Reference to store warning timeout ID
  const warningTimeoutRef = useRef(null);
  
  // State to track if warning is shown
  const [showWarning, setShowWarning] = useState(false);
  
  // Time remaining (in seconds)
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Reset the session timeout
  const resetTimeout = useCallback(() => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    
    // Hide warning if shown
    setShowWarning(false);
    
    // Only set timeout if user is authenticated
    if (isAuthenticated) {
      // Show warning 1 minute before timeout (at 4 minutes)
      const warningTime = SESSION_TIMEOUT - 60000; // 4 minutes
      
      warningTimeoutRef.current = setTimeout(() => {
        setShowWarning(true);
        setTimeRemaining(60); // 60 seconds remaining
        
        // Show toast notification
        toast('Your session will expire in 1 minute due to inactivity', {
          icon: '⚠️',
          duration: 5000,
        });
        
        // Start countdown
        const countdownInterval = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
      }, warningTime);
      
      // Set logout timeout (5 minutes)
      timeoutRef.current = setTimeout(() => {
        handleSessionExpired();
      }, SESSION_TIMEOUT);
    }
  }, [isAuthenticated]);

  // Handle session expired
  const handleSessionExpired = () => {
    toast.error('Session expired due to inactivity. Please login again.');
    logout();
  };

  // Extend session (when user clicks "Stay logged in")
  const extendSession = () => {
    resetTimeout();
    toast.success('Session extended');
  };

  // Activity event handler
  const handleActivity = useCallback(() => {
    if (isAuthenticated) {
      resetTimeout();
    }
  }, [isAuthenticated, resetTimeout]);

  // Set up event listeners for user activity
  useEffect(() => {
    if (isAuthenticated) {
      // Events that indicate user activity
      const events = [
        'mousedown',
        'mousemove',
        'keypress',
        'scroll',
        'touchstart',
        'click',
      ];

      // Add event listeners
      events.forEach((event) => {
        document.addEventListener(event, handleActivity);
      });

      // Initialize timeout
      resetTimeout();

      // Cleanup function
      return () => {
        events.forEach((event) => {
          document.removeEventListener(event, handleActivity);
        });
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (warningTimeoutRef.current) {
          clearTimeout(warningTimeoutRef.current);
        }
      };
    }
  }, [isAuthenticated, handleActivity, resetTimeout]);

  // Context value
  const value = {
    showWarning,
    timeRemaining,
    extendSession,
    resetTimeout,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};