'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from 'react';
import { type User } from 'firebase/auth';
import { subscribeToAuthState, handleGoogleRedirectResult } from '@/lib/firebase/auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const redirectProcessed = useRef(false);

  useEffect(() => {
    let isMounted = true;

    // Subscribe to auth state changes immediately
    const unsubscribe = subscribeToAuthState((authUser) => {
      if (isMounted) {
        console.log('[Auth] State changed:', authUser?.email || 'null');
        setUser(authUser);
        // Stop loading if redirect is done or user exists
        if (redirectProcessed.current || authUser) {
          setLoading(false);
        }
      }
    });

    // Process Google redirect result in parallel
    handleGoogleRedirectResult()
      .then((redirectUser) => {
        console.log('[Auth] Redirect result:', redirectUser?.email || 'null');
        redirectProcessed.current = true;
        // If we got a user from redirect, force redirect to dashboard
        if (redirectUser && typeof window !== 'undefined') {
          console.log('[Auth] Redirecting to dashboard after Google sign-in');
          window.location.href = '/';
        }
        if (isMounted) {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('[Auth] Redirect error:', error);
        redirectProcessed.current = true;
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
