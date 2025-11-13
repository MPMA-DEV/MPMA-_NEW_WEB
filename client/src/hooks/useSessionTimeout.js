// ============================================
// SESSION TIMEOUT HOOK
// Custom hook for session timeout functionality
// ============================================

import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { SESSION_TIMEOUT } from '../utils/constants';

const useSessionTimeout = () => {
  const { isAuthenticated, logout } = useAuth();
  const timeoutRef = useRef(null);

  // Reset timeout on user activity
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isAuthenticated) {
      timeoutRef.current = setTimeout(() => {
        logout();
        alert('Session expired due to inactivity');
      }, SESSION_TIMEOUT);
    }
  };

  useEffect(() => {
    // Events that reset the timeout
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    const resetOnActivity = () => resetTimeout();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetOnActivity);
    });

    // Initialize timeout
    resetTimeout();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetOnActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAuthenticated]);

  return { resetTimeout };
};

export default useSessionTimeout;