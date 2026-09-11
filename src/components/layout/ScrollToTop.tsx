import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls to top on route change so navigating between pages feels right.
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
