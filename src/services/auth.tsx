import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { User, PersonaType, LookingFor } from '../models';
import { getUserById, DEMO_USER_ID } from '../data/users';
import { load, save, remove } from './storage';

// Mock authentication. Structured like a real auth provider so a backend
// (JWT, OAuth, etc.) can replace the internals without touching consumers.

export interface OnboardingData {
  persona: PersonaType;
  interests: string[];
  lookingFor: LookingFor[];
  skills: string[];
}

interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string; // not persisted in the mock beyond a flag
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  needsOnboarding: boolean;
  signup: (input: SignupInput) => void;
  login: (email: string) => boolean;
  logout: () => void;
  completeOnboarding: (data: OnboardingData) => void;
  updateUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'currentUser';
const ONBOARDED_KEY = 'onboarded';

function makeNewUser(input: SignupInput): User {
  return {
    id: `u-${Date.now()}`,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    persona: 'Student',
    headline: 'New to Talorax',
    location: '',
    about: '',
    lookingFor: [],
    canHelpWith: [],
    skills: [],
    interests: [],
    education: [],
    experience: [],
    followerIds: [],
    connectionIds: [],
    projectIds: [],
    createdAt: new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    load<User | null>(STORAGE_KEY, null),
  );
  const [onboarded, setOnboarded] = useState<boolean>(() =>
    load<boolean>(ONBOARDED_KEY, false),
  );

  const persist = useCallback((u: User | null) => {
    setUser(u);
    if (u) save(STORAGE_KEY, u);
    else remove(STORAGE_KEY);
  }, []);

  const signup = useCallback(
    (input: SignupInput) => {
      const newUser = makeNewUser(input);
      persist(newUser);
      setOnboarded(false);
      save(ONBOARDED_KEY, false);
    },
    [persist],
  );

  // Mock login: if the email matches a seeded user, log in as them (already
  // onboarded); otherwise log in as the demo user. Real auth replaces this.
  const login = useCallback(
    (email: string): boolean => {
      const normalized = email.trim().toLowerCase();
      const seeded = getUserById(DEMO_USER_ID);
      // Try to find a seeded user by email for a richer demo.
      const matched =
        [seeded].find((u) => u && u.email.toLowerCase() === normalized) ??
        seeded;
      if (matched) {
        persist(matched);
        setOnboarded(true);
        save(ONBOARDED_KEY, true);
        return true;
      }
      return false;
    },
    [persist],
  );

  const logout = useCallback(() => {
    persist(null);
    setOnboarded(false);
    remove(ONBOARDED_KEY);
  }, [persist]);

  const completeOnboarding = useCallback(
    (data: OnboardingData) => {
      setUser((prev) => {
        if (!prev) return prev;
        const headlineByPersona: Record<PersonaType, string> = {
          Student: `${data.interests[0] ?? 'Aspiring Professional'} Student`,
          'Recent graduate': `Recent Graduate · ${data.interests[0] ?? 'Professional'}`,
          Professional: `${data.interests[0] ?? 'Professional'}`,
          'Career changer': `Career Changer · ${data.interests[0] ?? 'Tech'}`,
          Freelancer: `Freelance ${data.skills[0] ?? 'Professional'}`,
          Entrepreneur: `Entrepreneur · ${data.interests[0] ?? 'Founder'}`,
        };
        const updated: User = {
          ...prev,
          persona: data.persona,
          interests: data.interests,
          lookingFor: data.lookingFor,
          skills: data.skills,
          canHelpWith: data.skills.slice(0, 3),
          headline: headlineByPersona[data.persona],
        };
        save(STORAGE_KEY, updated);
        return updated;
      });
      setOnboarded(true);
      save(ONBOARDED_KEY, true);
    },
    [],
  );

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...patch };
      save(STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      needsOnboarding: Boolean(user) && !onboarded,
      signup,
      login,
      logout,
      completeOnboarding,
      updateUser,
    }),
    [user, onboarded, signup, login, logout, completeOnboarding, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
