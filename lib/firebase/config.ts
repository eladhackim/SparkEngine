import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';

/**
 * Firebase configuration loaded from environment variables.
 *
 * IMPORTANT: All NEXT_PUBLIC_ prefixed variables are exposed to the client.
 * This is safe because Firebase security is enforced via:
 * 1. Firebase Auth (authentication)
 * 2. Firestore Security Rules (authorization)
 * 3. Domain restrictions in Firebase Console
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton instances (lazy initialized)
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

// Track if emulators have been connected (to avoid double connection)
let emulatorsConnected = false;

/**
 * Get Firebase app instance (lazy initialization).
 * Only initializes when called from client-side code.
 */
function getFirebaseApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    throw new Error('Firebase cannot be initialized on the server');
  }

  if (_app) return _app;

  if (!getApps().length) {
    _app = initializeApp(firebaseConfig);
  } else {
    _app = getApp();
  }

  return _app;
}

/**
 * Get Firebase Auth instance (lazy initialization).
 */
function getFirebaseAuth(): Auth {
  if (_auth) return _auth;

  const app = getFirebaseApp();
  _auth = getAuth(app);

  // Connect to emulators in development
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_USE_EMULATORS === 'true' &&
    !emulatorsConnected
  ) {
    console.log('Connecting to Firebase emulators...');
    connectAuthEmulator(_auth, 'http://localhost:9099', { disableWarnings: true });
    emulatorsConnected = true;
  }

  return _auth;
}

/**
 * Get Firestore instance (lazy initialization).
 */
function getFirestoreDb(): Firestore {
  if (_db) return _db;

  const app = getFirebaseApp();
  _db = getFirestore(app);

  // Connect to emulators in development
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_USE_EMULATORS === 'true' &&
    !emulatorsConnected
  ) {
    connectFirestoreEmulator(_db, 'localhost', 8080);
    emulatorsConnected = true;
  }

  return _db;
}

// Export getters that provide lazy initialization
// These create proxy objects that only initialize Firebase when accessed
export const app = new Proxy({} as FirebaseApp, {
  get(_, prop) {
    return Reflect.get(getFirebaseApp(), prop);
  },
});

export const auth = new Proxy({} as Auth, {
  get(_, prop) {
    return Reflect.get(getFirebaseAuth(), prop);
  },
});

export const db = new Proxy({} as Firestore, {
  get(_, prop) {
    return Reflect.get(getFirestoreDb(), prop);
  },
});

export default app;

// Type exports for convenience
export type { FirebaseApp } from 'firebase/app';
export type { Auth, User, UserCredential } from 'firebase/auth';
export type {
  Firestore,
  DocumentReference,
  DocumentSnapshot,
  CollectionReference,
  Query,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
