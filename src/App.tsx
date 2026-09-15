import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/auth';
import { AppStateProvider } from './services/appState';
import { CreateFlowProvider } from './services/createFlow';
import { Layout } from './components/layout/Layout';
import { RequireAuth, RedirectIfAuthed } from './components/layout/guards';
import { ScrollToTop } from './components/layout/ScrollToTop';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { OpportunityDetailPage } from './pages/OpportunityDetailPage';
import { RadarPage } from './pages/RadarPage';
import { AskPage } from './pages/AskPage';
import { CollabDetailPage } from './pages/CollabDetailPage';
import { FindCollabPage } from './pages/FindCollabPage';
import { JobsPage } from './pages/JobsPage';
import { FindJobPage } from './pages/FindJobPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppStateProvider>
          <CreateFlowProvider>
            <ScrollToTop />
            <Routes>
              {/* Public */}
              <Route
                path="/"
                element={
                  <RedirectIfAuthed>
                    <LandingPage />
                  </RedirectIfAuthed>
                }
              />
              <Route
                path="/login"
                element={
                  <RedirectIfAuthed>
                    <LoginPage />
                  </RedirectIfAuthed>
                }
              />
              <Route
                path="/signup"
                element={
                  <RedirectIfAuthed>
                    <SignupPage />
                  </RedirectIfAuthed>
                }
              />
              <Route path="/onboarding" element={<OnboardingPage />} />

              {/* Authenticated app (shares the nav shell) */}
              <Route
                element={
                  <RequireAuth>
                    <Layout />
                  </RequireAuth>
                }
              >
                <Route path="/home" element={<HomePage />} />
                <Route path="/discover" element={<DiscoverPage />} />
                <Route path="/opportunities" element={<OpportunitiesPage />} />
                <Route
                  path="/opportunities/:id"
                  element={<OpportunityDetailPage />}
                />
                <Route path="/radar" element={<RadarPage />} />
                <Route path="/ask" element={<AskPage />} />
                <Route path="/collabs/find" element={<FindCollabPage />} />
                <Route path="/collabs/:id" element={<CollabDetailPage />} />
                <Route path="/jobs/find" element={<FindJobPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/messages" element={<MessagesPage />} />
              </Route>

              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </CreateFlowProvider>
        </AppStateProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
