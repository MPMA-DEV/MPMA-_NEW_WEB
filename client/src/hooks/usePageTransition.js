// ============================================
// PAGE TRANSITION HOOK
// Custom hook for page transition effects
// ============================================

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePageTransition = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    // Add page transition class
    document.body.classList.add('page-transitioning');

    // Remove class after animation
    const timer = setTimeout(() => {
      document.body.classList.remove('page-transitioning');
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);
};

export default usePageTransition;