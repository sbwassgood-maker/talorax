import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../services/auth';

// Requires an authenticated (and onboarded) user. Sends unauthenticated users
// to the landing page and half-registered users into onboarding.
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, needsOnboarding } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}

// For public/auth pages: if already logged in and onboarded, go to home.
export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const { isAuthenticated, needsOnboarding } = useAuth();
  if (isAuthenticated && !needsOnboarding) {
    return <Navigate to="/home" replace />;
  }
  return <>{children}</>;
}
