/**
 * Firebase Configuration
 *
 * This file initializes Firebase and exports the configured instances.
 * Based on the configuration defined in docs/technical/auth-security.md
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';

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

// Validate required config
const requiredKeys = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
];

for (const key of requiredKeys) {
  if (!process.env[key]) {
    console.warn(`Missing required Firebase config: ${key}`);
  }
}

// ============================================
// SINGLETON INITIALIZATION
// ============================================

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  // Connect to emulators in development
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_USE_EMULATORS === 'true'
  ) {
    console.log('Connecting to Firebase emulators...');

    // Auth emulator
    connectAuthEmulator(auth, 'http://localhost:9099', {
      disableWarnings: true,
    });

    // Firestore emulator
    connectFirestoreEmulator(db, 'localhost', 8080);

    console.log('Connected to Firebase emulators');
  }
} else {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };

// ============================================
// TYPE EXPORTS
// ============================================

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
