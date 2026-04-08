# Idea Forge: Authentication & Security Specification

**Status**: Draft
**Version**: 1.1
**Date**: April 8, 2026
**Author**: Noah Harris (Tech Specs)
**Updated**: Pipeline-First MVP security additions

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Authentication Flow Diagrams](#2-authentication-flow-diagrams)
3. [Firebase Auth Configuration](#3-firebase-auth-configuration)
4. [Protected Route Strategy](#4-protected-route-strategy)
5. [Session Management](#5-session-management)
6. [Cloud Functions Authentication](#6-cloud-functions-authentication) *(NEW - Pipeline)*
7. [API Key Security](#7-api-key-security) *(UPDATED - Cloud Secret Manager)*
8. [Firestore Security Rules](#8-firestore-security-rules) *(UPDATED - generationRuns)*
9. [Input Validation](#9-input-validation) *(NEW - Generation Settings)*
10. [Error Handling Reference](#10-error-handling-reference) *(UPDATED - Generation Errors)*
11. [Rate Limiting Strategy](#11-rate-limiting-strategy) *(UPDATED - Generation Limits)*
12. [Security Best Practices](#12-security-best-practices)
13. [Implementation Checklist](#13-implementation-checklist) *(UPDATED)*

---

## 1. Executive Summary

### Overview

Idea Forge is a **single-user, personal tool** for solo entrepreneurs to manage their idea portfolio. This simplifies our security model significantly:

- **No multi-tenancy**: One user per account, no team features
- **No sharing**: All data is private to the owner
- **No admin roles**: Single permission level per user
- **No billing**: No payment-related security concerns

### Security Architecture Principles

| Principle | Implementation |
|-----------|----------------|
| **Defense in Depth** | Multiple layers: Firebase Auth + Firestore Rules + Server-side validation |
| **Least Privilege** | Users can only access their own data (`/users/{userId}/...`) |
| **Fail Secure** | Default deny; explicit allow rules only |
| **Zero Trust** | Never trust client input; validate everything server-side |

### Authentication Methods

| Method | Status | Use Case |
|--------|--------|----------|
| **Email/Password** | Primary | Standard sign-up and login |
| **Google OAuth** | Primary | One-click sign-in, trusted provider |
| Apple OAuth | Future | iOS users (post-MVP) |
| GitHub OAuth | Out of Scope | Not target audience |

### Data Isolation Model

```
Firestore Structure:
/users/{userId}                    # User profile document
/users/{userId}/ideas/{ideaId}     # Ideas collection
/users/{userId}/ideas/{ideaId}/notes/{noteId}  # Notes subcollection
```

**Critical Security Rule**: A user can ONLY access documents where `{userId}` matches their `auth.uid`.

---

## 2. Authentication Flow Diagrams

### 2.1 Email/Password Registration

```
                                    REGISTRATION FLOW

    User                    Client App              Firebase Auth           Firestore
     |                          |                        |                      |
     |  1. Enter email/pass     |                        |                      |
     |------------------------->|                        |                      |
     |                          |                        |                      |
     |                          |  2. createUserWithEmailAndPassword()          |
     |                          |----------------------->|                      |
     |                          |                        |                      |
     |                          |                        | 3. Validate email    |
     |                          |                        |    format & password |
     |                          |                        |    strength          |
     |                          |                        |                      |
     |                          |  4. Return UserCredential + ID Token          |
     |                          |<-----------------------|                      |
     |                          |                        |                      |
     |                          |  5. Create user profile document              |
     |                          |------------------------------------------------>|
     |                          |                        |                      |
     |                          |  6. Set auth state in context                 |
     |                          |                        |                      |
     |  7. Redirect to /dashboard                        |                      |
     |<-------------------------|                        |                      |
```

### 2.2 Email/Password Login

```
                                    LOGIN FLOW

    User                    Client App              Firebase Auth           Firestore
     |                          |                        |                      |
     |  1. Enter credentials    |                        |                      |
     |------------------------->|                        |                      |
     |                          |                        |                      |
     |                          |  2. signInWithEmailAndPassword()              |
     |                          |----------------------->|                      |
     |                          |                        |                      |
     |                          |                        | 3. Verify credentials|
     |                          |                        |                      |
     |                          |  4. Return UserCredential + ID Token          |
     |                          |<-----------------------|                      |
     |                          |                        |                      |
     |                          |  5. Fetch user profile                        |
     |                          |------------------------------------------------>|
     |                          |                        |                      |
     |                          |  6. Set auth state                            |
     |                          |                        |                      |
     |  7. Redirect to /dashboard                        |                      |
     |<-------------------------|                        |                      |
```

### 2.3 Google OAuth Login

```
                                    GOOGLE OAUTH FLOW

    User                    Client App              Firebase Auth         Google OAuth        Firestore
     |                          |                        |                     |                 |
     |  1. Click "Sign in       |                        |                     |                 |
     |     with Google"         |                        |                     |                 |
     |------------------------->|                        |                     |                 |
     |                          |                        |                     |                 |
     |                          |  2. signInWithPopup(GoogleAuthProvider)      |                 |
     |                          |----------------------->|                     |                 |
     |                          |                        |                     |                 |
     |  3. Google consent popup |                        |                     |                 |
     |<--------------------------------------------------------|<-------------|                 |
     |                          |                        |                     |                 |
     |  4. User authorizes      |                        |                     |                 |
     |-------------------------------------------------------->|------------->|                 |
     |                          |                        |                     |                 |
     |                          |                        |  5. Exchange code   |                 |
     |                          |                        |     for tokens      |                 |
     |                          |                        |<--------------------|                 |
     |                          |                        |                     |                 |
     |                          |  6. Return UserCredential + ID Token         |                 |
     |                          |<-----------------------|                     |                 |
     |                          |                        |                     |                 |
     |                          |  7. Check if new user                        |                 |
     |                          |  8. Create/update profile                    |                 |
     |                          |---------------------------------------------------------------->|
     |                          |                        |                     |                 |
     |  9. Redirect to /dashboard                        |                     |                 |
     |<-------------------------|                        |                     |                 |
```

### 2.4 Session Refresh (Automatic)

```
                                    TOKEN REFRESH FLOW

    Client App              Firebase SDK              Firebase Auth
        |                        |                        |
        |  (Background)          |                        |
        |  Token expires in      |                        |
        |  <5 minutes            |                        |
        |----------------------->|                        |
        |                        |                        |
        |                        |  Auto-refresh token    |
        |                        |----------------------->|
        |                        |                        |
        |                        |  New ID Token          |
        |                        |<-----------------------|
        |                        |                        |
        |  Updated auth state    |                        |
        |<-----------------------|                        |
        |                        |                        |
        |  (Transparent to user - no interruption)        |
```

### 2.5 Logout Flow

```
                                    LOGOUT FLOW

    User                    Client App              Firebase Auth           Local Storage
     |                          |                        |                      |
     |  1. Click "Sign Out"     |                        |                      |
     |------------------------->|                        |                      |
     |                          |                        |                      |
     |                          |  2. signOut()          |                      |
     |                          |----------------------->|                      |
     |                          |                        |                      |
     |                          |  3. Clear auth state   |                      |
     |                          |<-----------------------|                      |
     |                          |                        |                      |
     |                          |  4. Clear local data   |                      |
     |                          |------------------------------------------------>|
     |                          |                        |                      |
     |                          |  5. Clear React state                         |
     |                          |                        |                      |
     |  6. Redirect to /login   |                        |                      |
     |<-------------------------|                        |                      |
```

---

## 3. Firebase Auth Configuration

### 3.1 Firebase Project Setup

```typescript
// lib/firebase/config.ts

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  // Connect to emulators in development
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
} else {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
```

### 3.2 Auth Configuration

```typescript
// lib/firebase/auth.config.ts

import {
  GoogleAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  setPersistence
} from 'firebase/auth';
import { auth } from './config';

// Google OAuth Provider Configuration
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account', // Always show account selector
});

// Session Persistence Configuration
export type PersistenceType = 'local' | 'session' | 'none';

export const setAuthPersistence = async (type: PersistenceType = 'local') => {
  const persistenceMap = {
    local: browserLocalPersistence,    // Survives browser close
    session: browserSessionPersistence, // Cleared on tab close
    none: inMemoryPersistence,          // Cleared on page refresh
  };

  await setPersistence(auth, persistenceMap[type]);
};

// Default: local persistence (remember user across sessions)
// Consider session persistence for shared/public computers
```

### 3.3 Auth Service Functions

```typescript
// lib/firebase/auth.service.ts

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { googleProvider } from './auth.config';

// Types
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
  provider: 'email' | 'google';
}

// Create user profile document in Firestore
const createUserProfile = async (user: User, provider: 'email' | 'google'): Promise<void> => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      provider,
    });
  } else {
    // Update last login timestamp
    await setDoc(userRef, { updatedAt: serverTimestamp() }, { merge: true });
  }
};

// Email/Password Registration
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  // Update display name if provided
  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }

  // Create user profile in Firestore
  await createUserProfile(credential.user, 'email');

  // Send verification email (optional, enable if needed)
  // await sendEmailVerification(credential.user);

  return credential;
};

// Email/Password Login
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await createUserProfile(credential.user, 'email'); // Update last login
  return credential;
};

// Google OAuth Login
export const loginWithGoogle = async (): Promise<UserCredential> => {
  const credential = await signInWithPopup(auth, googleProvider);
  await createUserProfile(credential.user, 'google');
  return credential;
};

// Sign Out
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

// Password Reset
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// Get Current User (synchronous check)
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
```

### 3.4 Auth Context Provider

```typescript
// contexts/AuthContext.tsx

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import {
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  logout as firebaseLogout,
  resetPassword,
} from '@/lib/firebase/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleError = (err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred';
    setError(errorMessage);
    throw err; // Re-throw for component-level handling
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await loginWithEmail(email, password);
    } catch (err) {
      handleError(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
    } catch (err) {
      handleError(err);
    }
  };

  const register = async (email: string, password: string, displayName?: string) => {
    try {
      setError(null);
      await registerWithEmail(email, password, displayName);
    } catch (err) {
      handleError(err);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await firebaseLogout();
    } catch (err) {
      handleError(err);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      setError(null);
      await resetPassword(email);
    } catch (err) {
      handleError(err);
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    loginWithGoogle: handleGoogleLogin,
    register,
    logout,
    resetPassword: handleResetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

---

## 4. Protected Route Strategy

### 4.1 Route Protection Matrix

| Route | Auth Required | Redirect If Unauthenticated | Redirect If Authenticated | Notes |
|-------|---------------|----------------------------|---------------------------|-------|
| `/` | No | - | `/dashboard` | Landing page, redirects logged-in users |
| `/login` | No | - | `/dashboard` | Login page |
| `/register` | No | - | `/dashboard` | Registration page |
| `/forgot-password` | No | - | `/dashboard` | Password reset request |
| `/dashboard` | Yes | `/login` | - | Main app interface |
| `/dashboard/[ideaId]` | Yes | `/login` | - | Idea detail view |
| `/settings` | Yes | `/login` | - | User settings |
| `/api/*` | Varies | 401 JSON | - | API routes (see below) |

### 4.2 Middleware Configuration

```typescript
// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/settings'];

// Routes that should redirect authenticated users
const authRoutes = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Firebase auth session cookie
  // Note: Firebase Auth uses IndexedDB by default, not cookies
  // For SSR protection, we use a custom session cookie
  const session = request.cookies.get('__session')?.value;

  // Redirect authenticated users away from auth pages
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Protect authenticated routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
```

### 4.3 Server Component Auth Check

```typescript
// lib/auth/server.ts

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth } from '@/lib/firebase/admin';

export async function getAuthenticatedUser() {
  const cookieStore = cookies();
  const session = cookieStore.get('__session')?.value;

  if (!session) {
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(session, true);
    return decodedToken;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}
```

### 4.4 Client Component Auth Check (HOC)

```typescript
// components/auth/withAuth.tsx

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';

interface WithAuthOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { redirectTo = '/login', requireAuth = true } = options;

  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (requireAuth && !user) {
          router.push(redirectTo);
        }
        if (!requireAuth && user) {
          router.push('/dashboard');
        }
      }
    }, [user, loading, router]);

    // Show loading state
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
        </div>
      );
    }

    // Don't render if not authorized
    if (requireAuth && !user) {
      return null;
    }

    if (!requireAuth && user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
```

### 4.5 Protected Layout Pattern

```typescript
// app/(protected)/layout.tsx

import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth/server';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will redirect to /login if not authenticated
  await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation, sidebar, etc. */}
      <main>{children}</main>
    </div>
  );
}
```

---

## 5. Session Management

### 5.1 Token Storage Strategy

| Storage Type | What's Stored | Location | Security |
|--------------|---------------|----------|----------|
| **ID Token** | JWT with user claims | Firebase SDK (IndexedDB) | Auto-managed by SDK |
| **Refresh Token** | Long-lived token | Firebase SDK (IndexedDB) | Auto-managed by SDK |
| **Session Cookie** | Server-verified session | HTTP-only cookie | Set via API route |

### 5.2 Token Lifecycle

```
                          TOKEN LIFECYCLE

    ┌─────────────────────────────────────────────────────────────┐
    │                                                             │
    │  ID Token                                                   │
    │  ├── Lifetime: 1 hour                                       │
    │  ├── Contains: uid, email, custom claims                    │
    │  └── Auto-refreshed by Firebase SDK when <5min remaining    │
    │                                                             │
    │  Refresh Token                                              │
    │  ├── Lifetime: ~1 year (or until revoked)                   │
    │  ├── Used to obtain new ID tokens                           │
    │  └── Revoked on: password change, security event, logout    │
    │                                                             │
    │  Session Cookie (optional, for SSR)                         │
    │  ├── Lifetime: Configurable (5 days default)                │
    │  ├── HTTP-only, Secure, SameSite=Strict                     │
    │  └── Verified server-side with Firebase Admin SDK           │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘
```

### 5.3 Session Persistence Options

```typescript
// lib/firebase/session.ts

import {
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  setPersistence
} from 'firebase/auth';
import { auth } from './config';

/**
 * Session Persistence Levels:
 *
 * LOCAL (default):
 *   - Token persists in IndexedDB
 *   - Survives browser close
 *   - User stays logged in until explicit logout
 *   - Best for: Personal devices
 *
 * SESSION:
 *   - Token persists only for current tab/session
 *   - Cleared when browser tab closes
 *   - Best for: Shared/public computers
 *
 * NONE:
 *   - Token only in memory
 *   - Cleared on page refresh
 *   - Best for: High-security requirements (not typical)
 */

export type SessionPersistence = 'local' | 'session' | 'none';

const persistenceMap = {
  local: browserLocalPersistence,
  session: browserSessionPersistence,
  none: inMemoryPersistence,
};

export async function setSessionPersistence(type: SessionPersistence): Promise<void> {
  await setPersistence(auth, persistenceMap[type]);
}

// Default: local persistence for personal tool
// Call this before any auth operations
export async function initializeAuthPersistence(): Promise<void> {
  await setSessionPersistence('local');
}
```

### 5.4 Session Cookie for SSR (Optional)

```typescript
// app/api/auth/session/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

const COOKIE_OPTIONS = {
  name: '__session',
  maxAge: 60 * 60 * 24 * 5, // 5 days
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

// Create session cookie from ID token
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: COOKIE_OPTIONS.maxAge * 1000, // milliseconds
    });

    // Set the cookie
    const response = NextResponse.json({ success: true, uid: decodedToken.uid });
    response.cookies.set(COOKIE_OPTIONS.name, sessionCookie, COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 401 });
  }
}

// Clear session cookie
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_OPTIONS.name);
  return response;
}
```

### 5.5 Multi-Tab Behavior

```typescript
// hooks/useAuthSync.ts

'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

/**
 * Firebase Auth automatically syncs auth state across tabs
 * via IndexedDB. This hook adds optional callbacks for
 * handling cross-tab auth events.
 */
export function useAuthSync(options?: {
  onLogin?: () => void;
  onLogout?: () => void;
}) {
  useEffect(() => {
    // This listener fires on ALL auth state changes,
    // including those triggered from other tabs
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        options?.onLogin?.();
      } else {
        options?.onLogout?.();
      }
    });

    return () => unsubscribe();
  }, [options]);
}

/**
 * Multi-tab behavior:
 *
 * 1. LOGIN in Tab A:
 *    - Tab A: onAuthStateChanged fires immediately
 *    - Tab B: onAuthStateChanged fires within ~100ms
 *    - Both tabs now show authenticated state
 *
 * 2. LOGOUT in Tab A:
 *    - Tab A: onAuthStateChanged fires, user is null
 *    - Tab B: onAuthStateChanged fires, user is null
 *    - Both tabs redirect to login
 *
 * 3. TOKEN REFRESH:
 *    - Handled automatically by Firebase SDK
 *    - All tabs share the same refreshed token
 *
 * No manual BroadcastChannel needed - Firebase handles this.
 */
```

### 5.6 Logout Flow

```typescript
// lib/firebase/auth.service.ts (logout addition)

export const logout = async (): Promise<void> => {
  // 1. Sign out from Firebase Auth (clears IndexedDB tokens)
  await signOut(auth);

  // 2. Clear session cookie if using SSR sessions
  try {
    await fetch('/api/auth/session', { method: 'DELETE' });
  } catch {
    // Cookie deletion is best-effort
  }

  // 3. Clear any local app state (handled by AuthContext)
  // React state clears automatically on re-render

  // 4. Redirect handled by calling component or auth listener
};
```

---

## 6. Cloud Functions Authentication

> **NEW SECTION** - Added for Pipeline-First MVP

### 6.1 HTTP-Triggered Functions Auth

All HTTP-triggered Cloud Functions that access user data MUST verify Firebase Auth tokens:

```typescript
// functions/src/middleware/auth.ts

import * as admin from 'firebase-admin';
import { Request, Response } from 'express';

export interface AuthenticatedRequest extends Request {
  user: admin.auth.DecodedIdToken;
}

/**
 * Verify Firebase Auth token from Authorization header
 * All HTTP-triggered functions MUST use this before accessing user data
 */
export async function verifyAuthToken(
  req: Request,
  res: Response
): Promise<admin.auth.DecodedIdToken | null> {
  const authHeader = req.headers.authorization;

  // Check for Bearer token
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Missing or invalid authorization header',
    });
    return null;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Invalid or expired token',
    });
    return null;
  }
}
```

### 6.2 Usage in Generation Endpoint

```typescript
// functions/src/generateIdeas.ts

import { onRequest } from 'firebase-functions/v2/https';
import { verifyAuthToken } from './middleware/auth';

export const generateIdeasHttp = onRequest(
  {
    secrets: [GROK_API_KEY, GEMINI_API_KEY, NEWS_API_KEY],
    memory: '1GiB',
    timeoutSeconds: 540,
    cors: true,
  },
  async (req, res) => {
    // CRITICAL: Verify authentication FIRST
    const decodedToken = await verifyAuthToken(req, res);
    if (!decodedToken) {
      return; // Response already sent by verifyAuthToken
    }

    const userId = decodedToken.uid;

    // Now safe to proceed with user-scoped operations
    const config: GenerationConfig = {
      userId,
      sources: req.body.sources || ['x', 'polymarket', 'googlenews'],
      ideasPerRun: req.body.ideasPerRun || 10,
      categories: req.body.categories,
    };

    const result = await runGenerationPipeline(config);
    res.json(result);
  }
);
```

### 6.3 Scheduled Functions Auth

Scheduled functions run with Admin SDK privileges (no user token needed), but MUST properly scope data access:

```typescript
// functions/src/scheduledGeneration.ts

import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';

export const generateIdeasScheduled = onSchedule(
  {
    schedule: '0 6 * * *',
    timeZone: 'UTC',
    secrets: [GROK_API_KEY, GEMINI_API_KEY, NEWS_API_KEY],
    memory: '1GiB',
    timeoutSeconds: 540,
  },
  async (event) => {
    // Admin SDK has full access - be careful!
    // Only process users who have explicitly opted in
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .where('autoGenerationEnabled', '==', true)
      .get();

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;

      // CRITICAL: All writes MUST be under /users/{userId}/...
      // Never write to other users' data
      const config: GenerationConfig = {
        userId, // Scoped to this specific user
        sources: userDoc.data().generationSources || ['x', 'polymarket', 'googlenews'],
        ideasPerRun: userDoc.data().ideasPerRun || 10,
      };

      try {
        await runGenerationPipeline(config);
      } catch (error) {
        console.error(`Generation failed for user ${userId}:`, error);
        // Continue with other users - don't let one failure stop all
      }
    }
  }
);
```

### 6.4 Client-Side Token Passing

```typescript
// lib/api/generation.ts

import { auth } from '@/lib/firebase/config';

export async function triggerGeneration(options: GenerationOptions): Promise<GenerationResult> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated');
  }

  // Get fresh ID token
  const idToken = await user.getIdToken();

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`, // CRITICAL: Include token
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Generation failed');
  }

  return response.json();
}
```

---

## 7. API Key Security

> **UPDATED SECTION** - Cloud Secret Manager for Pipeline API Keys

### 7.1 API Key Storage Strategy

| API Key | Storage Location | Access | Notes |
|---------|------------------|--------|-------|
| `GROK_API_KEY` | Cloud Secret Manager | Cloud Functions only | X/Twitter trend analysis |
| `GEMINI_API_KEY` | Cloud Secret Manager | Cloud Functions only | Signal analysis, idea generation, scoring |
| `NEWS_API_KEY` | Cloud Secret Manager | Cloud Functions only | Google News headlines |
| `FIREBASE_ADMIN_*` | Environment / Secret Manager | Server-side only | Admin SDK credentials |

### 7.2 Cloud Secret Manager Setup

```bash
# Create secrets in Google Cloud Secret Manager
gcloud secrets create GROK_API_KEY --project=your-project-id
gcloud secrets create GEMINI_API_KEY --project=your-project-id
gcloud secrets create NEWS_API_KEY --project=your-project-id

# Add secret versions
echo -n "xai-your-grok-key" | gcloud secrets versions add GROK_API_KEY --data-file=- --project=your-project-id
echo -n "your-gemini-key" | gcloud secrets versions add GEMINI_API_KEY --data-file=- --project=your-project-id
echo -n "your-news-api-key" | gcloud secrets versions add NEWS_API_KEY --data-file=- --project=your-project-id

# Grant Cloud Functions access to secrets
gcloud secrets add-iam-policy-binding GROK_API_KEY \
  --member="serviceAccount:your-project-id@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --project=your-project-id
```

### 7.3 Using Secrets in Cloud Functions

```typescript
// functions/src/generateIdeas.ts

import { defineSecret } from 'firebase-functions/params';

// Define secrets - values are injected at runtime, never in code
const GROK_API_KEY = defineSecret('GROK_API_KEY');
const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');
const NEWS_API_KEY = defineSecret('NEWS_API_KEY');

export const generateIdeasHttp = onRequest(
  {
    // Declare which secrets this function needs
    secrets: [GROK_API_KEY, GEMINI_API_KEY, NEWS_API_KEY],
    memory: '1GiB',
    timeoutSeconds: 540,
    cors: true,
  },
  async (req, res) => {
    // Access secrets at runtime - NEVER log these
    const grokKey = GROK_API_KEY.value();
    const geminiKey = GEMINI_API_KEY.value();
    const newsKey = NEWS_API_KEY.value();

    // Use keys for API calls...
  }
);
```

### 7.4 Security Rules for API Keys

**CRITICAL - Never do these:**

```typescript
// ❌ NEVER log API keys
console.log('Using API key:', apiKey);

// ❌ NEVER include in error responses
res.json({ error: 'API failed', key: apiKey });

// ❌ NEVER store in Firestore
await db.collection('config').doc('keys').set({ grokKey: apiKey });

// ❌ NEVER expose in client-side code
export const GROK_KEY = 'xai-...'; // This will be in bundle!
```

**ALWAYS do these:**

```typescript
// ✅ Access via Secret Manager at runtime
const apiKey = GROK_API_KEY.value();

// ✅ Log operations without key values
console.log('Calling Grok API...');

// ✅ Mask in any diagnostic output
console.log('Key configured:', apiKey ? 'yes' : 'no');
```

---

## 8. Firestore Security Rules

> **UPDATED SECTION** - Added generationRuns collection rules

### 8.1 Complete Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ═══════════════════════════════════════════════════════════════
    // HELPER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Check if authenticated user owns this resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Check if a field exists and is a string
    function isValidString(field) {
      return field is string && field.size() > 0;
    }

    // Check if a field exists and is a string within length limit
    function isValidStringWithLimit(field, maxLength) {
      return field is string && field.size() > 0 && field.size() <= maxLength;
    }

    // Check if a field is a valid score (1-5)
    function isValidScore(score) {
      return score is number && score >= 1 && score <= 5;
    }

    // Check if a field is a valid status enum
    function isValidStatus(status) {
      return status in ['new', 'reviewing', 'pursuing', 'parked', 'rejected'];
    }

    // Check if a field is a valid category enum
    function isValidCategory(category) {
      return category in ['Games', 'Tools', 'SaaS', 'Platforms', 'Mobile Apps', 'Content', 'Services', 'Hardware', 'Other'];
    }

    // Check if timestamp is server timestamp or valid
    function isValidTimestamp(ts) {
      return ts == request.time || ts is timestamp;
    }

    // ═══════════════════════════════════════════════════════════════
    // USER DOCUMENTS
    // ═══════════════════════════════════════════════════════════════

    match /users/{userId} {
      // Users can only read/write their own profile
      allow read: if isOwner(userId);

      allow create: if isOwner(userId)
        && isValidString(request.resource.data.uid)
        && request.resource.data.uid == userId
        && isValidString(request.resource.data.email)
        && isValidTimestamp(request.resource.data.createdAt);

      allow update: if isOwner(userId)
        && request.resource.data.uid == resource.data.uid // Can't change uid
        && isValidTimestamp(request.resource.data.updatedAt);

      // Users cannot delete their profile (soft delete via status if needed)
      allow delete: if false;

      // ═══════════════════════════════════════════════════════════
      // IDEAS SUBCOLLECTION
      // ═══════════════════════════════════════════════════════════

      match /ideas/{ideaId} {
        // Only owner can read their ideas
        allow read: if isOwner(userId);

        // Create validation
        allow create: if isOwner(userId)
          && isValidStringWithLimit(request.resource.data.name, 100)
          && isValidStringWithLimit(request.resource.data.brief, 500)
          && isValidStatus(request.resource.data.status)
          && isValidCategory(request.resource.data.category)
          && isValidTimestamp(request.resource.data.createdAt)
          && isValidTimestamp(request.resource.data.updatedAt)
          // Optional score validation (scores may not exist on create)
          && (
            !('scores' in request.resource.data) ||
            (
              isValidScore(request.resource.data.scores.businessPotential)
              && isValidScore(request.resource.data.scores.developmentComplexity)
              && isValidScore(request.resource.data.scores.timeToMarket)
              && isValidScore(request.resource.data.scores.competitionLevel)
              && isValidScore(request.resource.data.scores.riskLevel)
            )
          );

        // Update validation
        allow update: if isOwner(userId)
          && isValidStringWithLimit(request.resource.data.name, 100)
          && isValidStringWithLimit(request.resource.data.brief, 500)
          && isValidStatus(request.resource.data.status)
          && isValidCategory(request.resource.data.category)
          && isValidTimestamp(request.resource.data.updatedAt)
          // Immutable fields
          && request.resource.data.createdAt == resource.data.createdAt
          // Score validation if scores exist
          && (
            !('scores' in request.resource.data) ||
            (
              isValidScore(request.resource.data.scores.businessPotential)
              && isValidScore(request.resource.data.scores.developmentComplexity)
              && isValidScore(request.resource.data.scores.timeToMarket)
              && isValidScore(request.resource.data.scores.competitionLevel)
              && isValidScore(request.resource.data.scores.riskLevel)
            )
          );

        // Delete - owner can delete their own ideas
        allow delete: if isOwner(userId);

        // ═══════════════════════════════════════════════════════
        // NOTES SUBCOLLECTION
        // ═══════════════════════════════════════════════════════

        match /notes/{noteId} {
          // Only owner can read notes
          allow read: if isOwner(userId);

          // Create validation
          allow create: if isOwner(userId)
            && isValidStringWithLimit(request.resource.data.content, 2000)
            && isValidTimestamp(request.resource.data.createdAt)
            && isValidTimestamp(request.resource.data.updatedAt);

          // Update validation
          allow update: if isOwner(userId)
            && isValidStringWithLimit(request.resource.data.content, 2000)
            && isValidTimestamp(request.resource.data.updatedAt)
            // Immutable fields
            && request.resource.data.createdAt == resource.data.createdAt;

          // Delete - owner can delete their own notes
          allow delete: if isOwner(userId);
        }
      }

      // ═══════════════════════════════════════════════════════════
      // GENERATION RUNS SUBCOLLECTION (NEW - Pipeline)
      // ═══════════════════════════════════════════════════════════

      match /generationRuns/{runId} {
        // Users can READ their own generation history
        allow read: if isOwner(userId);

        // CRITICAL: Writing is restricted to Cloud Functions (Admin SDK)
        // Client cannot create, update, or delete runs
        // This ensures generation metadata integrity
        allow create, update, delete: if false;

        // Note: Cloud Functions using Admin SDK bypass these rules
        // Only client-side access is restricted
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // DEFAULT DENY
    // ═══════════════════════════════════════════════════════════════

    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 8.2 Field Validation Summary

| Collection | Field | Type | Constraint |
|------------|-------|------|------------|
| `users` | `uid` | string | Required, must match auth.uid |
| `users` | `email` | string | Required |
| `users` | `displayName` | string | Optional |
| `users` | `createdAt` | timestamp | Required, immutable |
| `users` | `updatedAt` | timestamp | Required |
| `ideas` | `name` | string | Required, max 100 chars |
| `ideas` | `brief` | string | Required, max 500 chars |
| `ideas` | `status` | string | Enum: new, reviewing, pursuing, parked, rejected |
| `ideas` | `category` | string | Enum: Games, Tools, SaaS, etc. |
| `ideas` | `scores.*` | number | Optional, range 1-5 |
| `ideas` | `createdAt` | timestamp | Required, immutable |
| `ideas` | `updatedAt` | timestamp | Required |
| `notes` | `content` | string | Required, max 2000 chars |
| `notes` | `createdAt` | timestamp | Required, immutable |
| `notes` | `updatedAt` | timestamp | Required |
| `generationRuns` | `runId` | string | Required, immutable |
| `generationRuns` | `timestamp` | timestamp | Required |
| `generationRuns` | `ideasGenerated` | number | Required |
| `generationRuns` | `ideasSaved` | number | Required |
| `generationRuns` | `sources` | array | Required |
| `generationRuns` | `duration` | number | Required (milliseconds) |
| `generationRuns` | `errors` | array | Optional |

### 8.3 Firestore Indexes

```json
// firestore.indexes.json

{
  "indexes": [
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "scores.overall", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "notes",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "generationRuns",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## 9. Input Validation

> **NEW SECTION** - Generation Settings Validation

### 9.1 Generation Settings Schema

```typescript
// types/generation.ts

export interface UserGenerationSettings {
  autoGenerationEnabled: boolean;      // Default: true
  generationSources: GenerationSource[]; // Default: all sources
  ideasPerRun: number;                 // Default: 10, min: 5, max: 25
  preferredCategories?: string[];      // Optional, max 5
  generationTime?: string;             // Future: custom schedule
}

export type GenerationSource = 'x' | 'polymarket' | 'googlenews';

export interface GenerationRequest {
  sources?: GenerationSource[];
  ideasPerRun?: number;
  categories?: string[];
}
```

### 9.2 Server-Side Input Validation

```typescript
// functions/src/validation/generationSettings.ts

import DOMPurify from 'isomorphic-dompurify';

const VALID_SOURCES: GenerationSource[] = ['x', 'polymarket', 'googlenews'];
const VALID_CATEGORIES = [
  'Games', 'Tools', 'SaaS', 'Platforms',
  'Mobile Apps', 'Content', 'Services', 'Hardware', 'Other'
];

const MIN_IDEAS_PER_RUN = 5;
const MAX_IDEAS_PER_RUN = 25;
const MAX_CATEGORIES = 5;
const MAX_CATEGORY_LENGTH = 50;

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Sanitize string input - remove HTML, trim whitespace
 */
function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
}

/**
 * Validate and sanitize generation settings from user input
 * Throws ValidationError if input is invalid
 */
export function validateGenerationSettings(data: any): UserGenerationSettings {
  const validated: Partial<UserGenerationSettings> = {};

  // Validate autoGenerationEnabled (boolean)
  if (data.autoGenerationEnabled !== undefined) {
    validated.autoGenerationEnabled = Boolean(data.autoGenerationEnabled);
  }

  // Validate generationSources (array of valid sources)
  if (data.generationSources !== undefined) {
    if (!Array.isArray(data.generationSources)) {
      throw new ValidationError('generationSources must be an array', 'generationSources');
    }

    // Filter to only valid sources
    validated.generationSources = data.generationSources
      .filter((s: any) => VALID_SOURCES.includes(s as GenerationSource));

    if (validated.generationSources.length === 0) {
      throw new ValidationError(
        'At least one valid source required (x, polymarket, googlenews)',
        'generationSources'
      );
    }
  }

  // Validate ideasPerRun (number in range)
  if (data.ideasPerRun !== undefined) {
    const count = Number(data.ideasPerRun);

    if (isNaN(count)) {
      throw new ValidationError('ideasPerRun must be a number', 'ideasPerRun');
    }

    // Clamp to valid range
    validated.ideasPerRun = Math.min(
      MAX_IDEAS_PER_RUN,
      Math.max(MIN_IDEAS_PER_RUN, Math.round(count))
    );
  }

  // Validate preferredCategories (array of sanitized strings)
  if (data.preferredCategories !== undefined) {
    if (!Array.isArray(data.preferredCategories)) {
      throw new ValidationError('preferredCategories must be an array', 'preferredCategories');
    }

    validated.preferredCategories = data.preferredCategories
      .slice(0, MAX_CATEGORIES) // Limit to max categories
      .map((c: any) => sanitizeString(String(c)).slice(0, MAX_CATEGORY_LENGTH))
      .filter((c: string) => c.length > 0); // Remove empty strings
  }

  return validated as UserGenerationSettings;
}

/**
 * Validate generation request from API call
 */
export function validateGenerationRequest(data: any): GenerationRequest {
  const validated: GenerationRequest = {};

  // Validate sources
  if (data.sources !== undefined) {
    if (!Array.isArray(data.sources)) {
      throw new ValidationError('sources must be an array', 'sources');
    }
    validated.sources = data.sources.filter((s: any) =>
      VALID_SOURCES.includes(s as GenerationSource)
    );
  }

  // Validate ideasPerRun
  if (data.ideasPerRun !== undefined) {
    const count = Number(data.ideasPerRun);
    if (isNaN(count)) {
      throw new ValidationError('ideasPerRun must be a number', 'ideasPerRun');
    }
    validated.ideasPerRun = Math.min(MAX_IDEAS_PER_RUN, Math.max(MIN_IDEAS_PER_RUN, Math.round(count)));
  }

  // Validate categories
  if (data.categories !== undefined) {
    if (!Array.isArray(data.categories)) {
      throw new ValidationError('categories must be an array', 'categories');
    }
    validated.categories = data.categories
      .slice(0, MAX_CATEGORIES)
      .map((c: any) => sanitizeString(String(c)).slice(0, MAX_CATEGORY_LENGTH))
      .filter((c: string) => c.length > 0);
  }

  return validated;
}
```

### 9.3 Validation in Cloud Function

```typescript
// functions/src/generateIdeas.ts

import { validateGenerationRequest, ValidationError } from './validation/generationSettings';

export const generateIdeasHttp = onRequest(
  { /* ... config ... */ },
  async (req, res) => {
    // 1. Verify authentication
    const decodedToken = await verifyAuthToken(req, res);
    if (!decodedToken) return;

    // 2. Validate input BEFORE any processing
    let validatedInput: GenerationRequest;
    try {
      validatedInput = validateGenerationRequest(req.body);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: error.message,
          field: error.field,
        });
        return;
      }
      throw error;
    }

    // 3. Proceed with validated input
    const config: GenerationConfig = {
      userId: decodedToken.uid,
      sources: validatedInput.sources || ['x', 'polymarket', 'googlenews'],
      ideasPerRun: validatedInput.ideasPerRun || 10,
      categories: validatedInput.categories,
    };

    const result = await runGenerationPipeline(config);
    res.json(result);
  }
);
```

### 9.4 Validation Constraints Summary

| Field | Type | Min | Max | Default | Notes |
|-------|------|-----|-----|---------|-------|
| `generationSources` | array | 1 item | 3 items | All sources | Must be valid enum values |
| `ideasPerRun` | number | 5 | 25 | 10 | Rounded to integer |
| `preferredCategories` | array | 0 items | 5 items | None | Each max 50 chars |
| `autoGenerationEnabled` | boolean | - | - | true | Coerced to boolean |

---

## 10. Error Handling Reference

> **UPDATED SECTION** - Added Generation-Specific Errors

### 10.1 Firebase Auth Error Codes

| Error Code | User Message | Recovery Action | Technical Notes |
|------------|--------------|-----------------|-----------------|
| `auth/email-already-in-use` | This email is already registered | Show login link | Check existing account |
| `auth/invalid-email` | Please enter a valid email address | Highlight email field | Client-side validation should catch |
| `auth/operation-not-allowed` | This sign-in method is not enabled | Contact support | Enable in Firebase Console |
| `auth/weak-password` | Password must be at least 6 characters | Show password requirements | Min 6 chars by default |
| `auth/user-disabled` | This account has been disabled | Contact support | Admin action required |
| `auth/user-not-found` | No account found with this email | Show signup link | Consider security implications |
| `auth/wrong-password` | Incorrect password | Show forgot password link | Rate limited by Firebase |
| `auth/invalid-credential` | Invalid email or password | Show both options | Generic error for security |
| `auth/too-many-requests` | Too many attempts. Please try again later | Wait and retry | Temporary block, usually 1 hour |
| `auth/network-request-failed` | Network error. Check your connection | Retry | Offline or connectivity issue |
| `auth/popup-closed-by-user` | Sign-in was cancelled | Retry prompt | User closed OAuth popup |
| `auth/popup-blocked` | Please allow popups for this site | Instructions to enable | Browser blocking OAuth popup |
| `auth/cancelled-popup-request` | Only one popup can be open at a time | N/A | Multiple popup attempts |
| `auth/account-exists-with-different-credential` | An account already exists with this email | Link accounts or login with original method | Email linked to different provider |
| `auth/requires-recent-login` | Please sign in again to continue | Re-authenticate | For sensitive operations |

### 10.2 Generation-Specific Error Codes

| Error Code | HTTP Status | User Message | Recovery Action | Technical Notes |
|------------|-------------|--------------|-----------------|-----------------|
| `GENERATION_IN_PROGRESS` | 409 | A generation is already running. Please wait for it to complete. | Show progress indicator | Check `isGenerating` flag in user doc |
| `RATE_LIMITED` | 429 | Too many generation requests. Try again in X minutes. | Show countdown timer | Max 5 requests per hour |
| `SOURCES_UNAVAILABLE` | 503 | Data sources are temporarily unavailable. Please try again later. | Retry with backoff | All sources failed to fetch |
| `GENERATION_FAILED` | 500 | Generation failed. Please try again. | Retry button | Pipeline error (logged server-side) |
| `AI_QUOTA_EXCEEDED` | 503 | AI quota exceeded. Try again tomorrow. | Show reset time (midnight UTC) | Gemini/Grok rate limits hit |
| `VALIDATION_ERROR` | 400 | Invalid request parameters. | Highlight invalid field | Input validation failed |
| `PARTIAL_SUCCESS` | 207 | Generation completed with some errors. | Show which sources failed | Some sources failed, ideas still generated |

### 10.3 Generation Error Handler

```typescript
// lib/errors/generation.errors.ts

export interface GenerationError {
  code: string;
  httpStatus: number;
  message: string;
  action: 'retry' | 'wait' | 'fix' | 'contact';
  retryAfter?: number; // seconds
}

const generationErrors: Record<string, GenerationError> = {
  'GENERATION_IN_PROGRESS': {
    code: 'GENERATION_IN_PROGRESS',
    httpStatus: 409,
    message: 'A generation is already running. Please wait for it to complete.',
    action: 'wait',
  },
  'RATE_LIMITED': {
    code: 'RATE_LIMITED',
    httpStatus: 429,
    message: 'Too many generation requests. Please wait before trying again.',
    action: 'wait',
    retryAfter: 3600, // 1 hour
  },
  'SOURCES_UNAVAILABLE': {
    code: 'SOURCES_UNAVAILABLE',
    httpStatus: 503,
    message: 'Data sources are temporarily unavailable. Please try again later.',
    action: 'retry',
    retryAfter: 300, // 5 minutes
  },
  'GENERATION_FAILED': {
    code: 'GENERATION_FAILED',
    httpStatus: 500,
    message: 'Generation failed. Please try again.',
    action: 'retry',
  },
  'AI_QUOTA_EXCEEDED': {
    code: 'AI_QUOTA_EXCEEDED',
    httpStatus: 503,
    message: 'AI quota exceeded. Try again tomorrow.',
    action: 'wait',
    retryAfter: 86400, // 24 hours
  },
  'VALIDATION_ERROR': {
    code: 'VALIDATION_ERROR',
    httpStatus: 400,
    message: 'Invalid request parameters.',
    action: 'fix',
  },
};

export function getGenerationError(code: string): GenerationError {
  return generationErrors[code] || {
    code: 'UNKNOWN_ERROR',
    httpStatus: 500,
    message: 'An unexpected error occurred. Please try again.',
    action: 'retry',
  };
}
```

### 10.4 Error Handler Utility

```typescript
// lib/firebase/auth.errors.ts

export interface AuthError {
  code: string;
  message: string;
  action?: 'login' | 'signup' | 'reset' | 'retry' | 'support' | 'wait';
}

const errorMessages: Record<string, AuthError> = {
  'auth/email-already-in-use': {
    code: 'auth/email-already-in-use',
    message: 'This email is already registered. Would you like to log in instead?',
    action: 'login',
  },
  'auth/invalid-email': {
    code: 'auth/invalid-email',
    message: 'Please enter a valid email address.',
  },
  'auth/weak-password': {
    code: 'auth/weak-password',
    message: 'Password must be at least 6 characters long.',
  },
  'auth/user-not-found': {
    code: 'auth/user-not-found',
    message: 'No account found with this email. Would you like to sign up?',
    action: 'signup',
  },
  'auth/wrong-password': {
    code: 'auth/wrong-password',
    message: 'Incorrect password. Forgot your password?',
    action: 'reset',
  },
  'auth/invalid-credential': {
    code: 'auth/invalid-credential',
    message: 'Invalid email or password. Please try again.',
  },
  'auth/too-many-requests': {
    code: 'auth/too-many-requests',
    message: 'Too many failed attempts. Please wait a few minutes and try again.',
    action: 'wait',
  },
  'auth/network-request-failed': {
    code: 'auth/network-request-failed',
    message: 'Network error. Please check your connection and try again.',
    action: 'retry',
  },
  'auth/popup-closed-by-user': {
    code: 'auth/popup-closed-by-user',
    message: 'Sign-in was cancelled. Click to try again.',
    action: 'retry',
  },
  'auth/popup-blocked': {
    code: 'auth/popup-blocked',
    message: 'Popup was blocked. Please allow popups for this site and try again.',
    action: 'retry',
  },
  'auth/user-disabled': {
    code: 'auth/user-disabled',
    message: 'This account has been disabled. Please contact support.',
    action: 'support',
  },
};

export function getAuthError(error: unknown): AuthError {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code;
    return errorMessages[code] || {
      code,
      message: 'An unexpected error occurred. Please try again.',
      action: 'retry',
    };
  }

  return {
    code: 'unknown',
    message: 'An unexpected error occurred. Please try again.',
    action: 'retry',
  };
}
```

### 10.5 Firestore Error Codes

| Error Code | User Message | Recovery Action |
|------------|--------------|-----------------|
| `permission-denied` | You don't have permission to access this data | Verify login, contact support if persists |
| `not-found` | The requested data was not found | Check URL, navigate to dashboard |
| `already-exists` | This item already exists | Refresh and check for duplicates |
| `resource-exhausted` | Too many requests. Please slow down | Implement backoff, wait |
| `unavailable` | Service temporarily unavailable | Retry with exponential backoff |
| `deadline-exceeded` | Request timed out | Retry, check connection |
| `cancelled` | Operation was cancelled | Retry if needed |

---

## 11. Rate Limiting Strategy

> **UPDATED SECTION** - Added Generation-Specific Limits

### 11.1 Firebase Built-in Limits

| Resource | Limit | Notes |
|----------|-------|-------|
| **Auth Operations** | 100 requests/IP/minute | Sign-in, sign-up, password reset |
| **Auth SMS** | 100 SMS/phone/day | Not applicable (no phone auth) |
| **Firestore Reads** | 50,000/day (free tier) | ~1,667 reads/hour |
| **Firestore Writes** | 20,000/day (free tier) | ~833 writes/hour |
| **Firestore Deletes** | 20,000/day (free tier) | Same as writes |

### 11.2 Generation-Specific Rate Limits

| Endpoint | Limit | Window | HTTP Response | Notes |
|----------|-------|--------|---------------|-------|
| `POST /api/generate` | 5 requests | 1 hour | 429 `RATE_LIMITED` | Manual generation trigger |
| `POST /api/generate` | 1 concurrent | - | 409 `GENERATION_IN_PROGRESS` | Only one generation at a time |
| Scheduled generation | 1 run | 24 hours | Skip if already run | Automatic daily generation |

### 11.3 Generation Rate Limit Implementation

```typescript
// functions/src/rateLimit/generation.ts

import * as admin from 'firebase-admin';

interface GenerationRateLimitResult {
  allowed: boolean;
  reason?: 'RATE_LIMITED' | 'GENERATION_IN_PROGRESS';
  retryAfter?: number; // seconds
  remaining?: number;
}

const HOURLY_LIMIT = 5;
const HOUR_IN_MS = 60 * 60 * 1000;

/**
 * Check if user can trigger a new generation
 * Returns { allowed: true } or { allowed: false, reason: '...' }
 */
export async function checkGenerationRateLimit(
  userId: string
): Promise<GenerationRateLimitResult> {
  const db = admin.firestore();
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  const userData = userDoc.data() || {};

  // Check for concurrent generation
  if (userData.isGenerating === true) {
    return {
      allowed: false,
      reason: 'GENERATION_IN_PROGRESS',
    };
  }

  // Check hourly rate limit
  const now = Date.now();
  const hourAgo = now - HOUR_IN_MS;

  // Get generation count in last hour
  const lastHourTimestamp = userData.lastGenerationHourStart || 0;
  const hourlyCount = userData.hourlyGenerationCount || 0;

  // Reset counter if hour has passed
  if (lastHourTimestamp < hourAgo) {
    // New hour, reset counter
    return {
      allowed: true,
      remaining: HOURLY_LIMIT - 1,
    };
  }

  // Check if under limit
  if (hourlyCount >= HOURLY_LIMIT) {
    const resetTime = lastHourTimestamp + HOUR_IN_MS;
    const retryAfter = Math.ceil((resetTime - now) / 1000);

    return {
      allowed: false,
      reason: 'RATE_LIMITED',
      retryAfter,
    };
  }

  return {
    allowed: true,
    remaining: HOURLY_LIMIT - hourlyCount - 1,
  };
}

/**
 * Mark generation as started (acquire lock)
 */
export async function startGeneration(userId: string): Promise<void> {
  const db = admin.firestore();
  const userRef = db.collection('users').doc(userId);

  const now = Date.now();
  const hourAgo = now - HOUR_IN_MS;

  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    const userData = userDoc.data() || {};

    // Reset hour counter if needed
    const lastHourTimestamp = userData.lastGenerationHourStart || 0;
    const shouldResetHour = lastHourTimestamp < hourAgo;

    transaction.update(userRef, {
      isGenerating: true,
      lastGenerationTimestamp: admin.firestore.FieldValue.serverTimestamp(),
      lastGenerationHourStart: shouldResetHour ? now : lastHourTimestamp,
      hourlyGenerationCount: shouldResetHour ? 1 : admin.firestore.FieldValue.increment(1),
    });
  });
}

/**
 * Mark generation as complete (release lock)
 */
export async function endGeneration(userId: string): Promise<void> {
  const db = admin.firestore();
  const userRef = db.collection('users').doc(userId);

  await userRef.update({
    isGenerating: false,
  });
}
```

### 11.4 Using Rate Limits in Generation Endpoint

```typescript
// functions/src/generateIdeas.ts

import {
  checkGenerationRateLimit,
  startGeneration,
  endGeneration
} from './rateLimit/generation';

export const generateIdeasHttp = onRequest(
  { /* ... config ... */ },
  async (req, res) => {
    // 1. Verify authentication
    const decodedToken = await verifyAuthToken(req, res);
    if (!decodedToken) return;

    const userId = decodedToken.uid;

    // 2. Check rate limits BEFORE any expensive operations
    const rateLimitResult = await checkGenerationRateLimit(userId);

    if (!rateLimitResult.allowed) {
      const status = rateLimitResult.reason === 'GENERATION_IN_PROGRESS' ? 409 : 429;
      res.status(status).json({
        success: false,
        error: rateLimitResult.reason,
        message: rateLimitResult.reason === 'GENERATION_IN_PROGRESS'
          ? 'A generation is already running. Please wait for it to complete.'
          : `Too many requests. Try again in ${rateLimitResult.retryAfter} seconds.`,
        retryAfter: rateLimitResult.retryAfter,
      });
      return;
    }

    // 3. Acquire generation lock
    await startGeneration(userId);

    try {
      // 4. Run pipeline
      const result = await runGenerationPipeline({ userId, ...validatedInput });

      res.json({
        success: true,
        data: result,
        remaining: rateLimitResult.remaining,
      });
    } finally {
      // 5. ALWAYS release lock, even on error
      await endGeneration(userId);
    }
  }
);
```

### 11.5 Client-Side Throttling

```typescript
// lib/utils/throttle.ts

/**
 * Throttle function calls to prevent abuse
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= limit) {
      lastCall = now;
      return func(...args);
    }

    return undefined;
  };
}

/**
 * Debounce function calls (for search, auto-save)
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
```

### 11.6 Application-Level Rate Limits

```typescript
// lib/rateLimit.ts

interface RateLimitConfig {
  maxRequests: number;  // Max requests in window
  windowMs: number;     // Time window in milliseconds
}

const rateLimits: Record<string, RateLimitConfig> = {
  // AI Generation (expensive operation)
  aiGeneration: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 10 per minute
  },
  // Idea creation
  createIdea: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 30 per minute
  },
  // Note creation
  createNote: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 60 per minute
  },
  // Search queries
  search: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 30 per minute
  },
};

class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  canMakeRequest(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get existing requests for this key
    const existing = this.requests.get(key) || [];

    // Filter to only requests within the window
    const recentRequests = existing.filter(time => time > windowStart);

    // Check if under limit
    if (recentRequests.length >= config.maxRequests) {
      return false;
    }

    // Add this request
    recentRequests.push(now);
    this.requests.set(key, recentRequests);

    return true;
  }

  getRemainingRequests(key: string, config: RateLimitConfig): number {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    const existing = this.requests.get(key) || [];
    const recentRequests = existing.filter(time => time > windowStart);
    return Math.max(0, config.maxRequests - recentRequests.length);
  }
}

export const rateLimiter = new RateLimiter();
export { rateLimits };
```

### 11.7 Abuse Prevention

| Threat | Mitigation |
|--------|------------|
| **Brute Force Login** | Firebase's built-in rate limiting (100/min/IP) |
| **Credential Stuffing** | Same as above + CAPTCHA on repeated failures (future) |
| **API Abuse** | Client-side rate limiting + Firestore security rules |
| **Scraping** | Auth required for all data + pagination limits |
| **DDoS** | Firebase/GCP infrastructure protection |

---

## 12. Security Best Practices

### 12.1 Environment Variable Management

```bash
# .env.local (NEVER commit to git)

# Firebase Client Config (safe to expose - restricted by domain)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin (SERVER-SIDE ONLY - never expose)
FIREBASE_ADMIN_PROJECT_ID=project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@project-id.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# AI API Keys (SERVER-SIDE ONLY)
GEMINI_API_KEY=sk-...
GROK_API_KEY=xai-...

# Environment
NODE_ENV=development
NEXT_PUBLIC_USE_EMULATORS=true
```

```gitignore
# .gitignore

# Environment files
.env
.env.local
.env.*.local

# Firebase
.firebase/
firebase-debug.log
firestore-debug.log

# Service account keys
*-service-account.json
service-account*.json
```

### 12.2 API Key Protection (Legacy - See Section 7 for Pipeline Keys)

```typescript
// lib/api/server-only.ts

// This file should ONLY be imported in server components or API routes
// Next.js will throw an error if imported in client components

import 'server-only';

// AI API clients - only available server-side
export const geminiApiKey = process.env.GEMINI_API_KEY;
export const grokApiKey = process.env.GROK_API_KEY;

if (!geminiApiKey) {
  console.warn('GEMINI_API_KEY not set');
}

if (!grokApiKey) {
  console.warn('GROK_API_KEY not set');
}
```

### 12.3 XSS Prevention

```typescript
// lib/utils/sanitize.ts

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  // Remove any HTML tags and encode special characters
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML allowed
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize rich text content (if allowing limited HTML in future)
 */
export function sanitizeRichText(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
}

/**
 * Escape for use in JSON
 */
export function escapeForJson(input: string): string {
  return JSON.stringify(input).slice(1, -1);
}
```

### 12.4 CSRF Considerations

```typescript
// For Firebase Auth with Firestore:
// - Firebase Auth tokens are bearer tokens (not cookies by default)
// - CSRF is primarily a concern for cookie-based auth
// - Our session cookie approach uses SameSite=Strict

// If implementing custom API routes that modify data:

// middleware.ts addition
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For mutating requests, verify origin
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // Allow requests from same origin only
    if (origin && !origin.includes(host || '')) {
      return NextResponse.json(
        { error: 'CSRF validation failed' },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}
```

### 12.5 Content Security Policy

```typescript
// next.config.js

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https: blob:;
  connect-src 'self'
    https://*.firebaseio.com
    https://*.googleapis.com
    https://*.firebase.com
    https://firestore.googleapis.com
    https://identitytoolkit.googleapis.com
    wss://*.firebaseio.com;
  frame-src 'self' https://accounts.google.com https://*.firebaseapp.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### 12.6 Sensitive Data Handling

| Data Type | Storage | Encryption | Access Control |
|-----------|---------|------------|----------------|
| **User Email** | Firestore | At rest (GCP) | Owner only |
| **User Password** | Firebase Auth | Hashed (bcrypt-like) | Never accessible |
| **Ideas/Notes** | Firestore | At rest (GCP) | Owner only |
| **API Keys** | Environment vars | N/A (server-side only) | Server processes only |
| **Session Tokens** | IndexedDB/Cookie | TLS in transit | Browser/server only |

---

## 13. Implementation Checklist

> **UPDATED SECTION** - Added Pipeline Security Items

### Pre-Development

- [ ] Firebase project created with correct region
- [ ] Firebase Auth enabled with Email/Password and Google providers
- [ ] Firestore database created in production mode
- [ ] Environment variables configured locally
- [ ] Firebase Admin SDK service account key secured
- [ ] `.gitignore` updated to exclude sensitive files

### Authentication Implementation

- [ ] Firebase SDK initialized with singleton pattern
- [ ] Auth context provider implemented
- [ ] Email/password registration working
- [ ] Email/password login working
- [ ] Google OAuth login working
- [ ] Logout functionality working
- [ ] Password reset flow working
- [ ] Auth state persistence configured (local)

### Route Protection

- [ ] Middleware protecting authenticated routes
- [ ] Public routes accessible without auth
- [ ] Auth routes redirecting logged-in users
- [ ] Server-side auth checks for SSR pages
- [ ] Deep linking preserved on auth redirects

### Session Management

- [ ] Token refresh working automatically
- [ ] Multi-tab sync verified
- [ ] Session cookie implemented (if using SSR)
- [ ] Logout clears all session data

### Firestore Security

- [ ] Security rules deployed
- [ ] User isolation verified (can't access other users' data)
- [ ] Field validation rules working
- [ ] Indexes created for queries
- [ ] Delete operations require auth

### Error Handling

- [ ] All Firebase Auth errors mapped to user messages
- [ ] Error UI components showing appropriate actions
- [ ] Network errors handled gracefully
- [ ] Rate limit errors show appropriate message

### Security Hardening

- [ ] Environment variables not exposed to client
- [ ] API keys server-side only
- [ ] CSP headers configured
- [ ] XSS sanitization in place
- [ ] HTTPS enforced in production

### Testing

- [ ] Unit tests for auth service functions
- [ ] Integration tests for auth flows
- [ ] Security rules tested with Firebase emulator
- [ ] Manual testing of all auth scenarios
- [ ] Error scenarios tested

### Pipeline Security (NEW)

- [ ] All AI API keys stored in Cloud Secret Manager
- [ ] Secrets granted to Cloud Functions service account
- [ ] HTTP Cloud Functions verify Firebase Auth tokens
- [ ] Rate limiting enforced for generation endpoints (5/hour)
- [ ] Concurrent generation lock working (409 response)
- [ ] Generation runs collection is read-only for clients
- [ ] Input validation for all generation settings
- [ ] Sensitive prompts/responses never logged
- [ ] Generation errors return appropriate codes
- [ ] Scheduled function properly scopes data to user
- [ ] Admin SDK usage doesn't bypass user isolation
- [ ] API key rotation procedure documented

### Pipeline Testing

- [ ] Rate limit blocks 6th request in 1 hour
- [ ] Concurrent generation returns 409
- [ ] Invalid input returns 400 with field name
- [ ] Token verification rejects expired tokens
- [ ] Generation runs cannot be created by client
- [ ] Scheduled generation only processes opted-in users

---

## Open Questions for Security Review

1. **Email Verification**: Should we require email verification before allowing full access? Current spec allows immediate access after registration.

2. **Account Deletion**: Should users be able to delete their accounts entirely? Current rules only allow profile updates, not deletion.

3. **Session Duration**: Is 5 days appropriate for session cookie expiry? Could be shorter for higher security, longer for convenience.

4. **Rate Limiting Granularity**: Should we implement more aggressive rate limiting for AI generation operations to control costs?

5. **Audit Logging**: Should we log authentication events (login, logout, failed attempts) for security monitoring?

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | April 8, 2026 | Noah Harris | Initial specification |
| 1.1 | April 8, 2026 | Noah Harris | Pipeline-First MVP security additions: Cloud Functions auth, API key security via Secret Manager, generation rate limits, generationRuns rules, input validation, generation error codes |

---

*This specification should be reviewed by the security team before implementation begins.*
