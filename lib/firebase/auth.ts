import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, getDb } from './config';

const googleProvider = new GoogleAuthProvider();

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(getAuth(), email, password);
  await updateLastLogin(result.user.uid);
  return result.user;
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(getAuth(), email, password);
  await createUserDocument(result.user);
  return result.user;
}

export async function signInWithGoogle(): Promise<void> {
  // Use redirect instead of popup to avoid COOP issues
  await signInWithRedirect(getAuth(), googleProvider);
}

export async function handleGoogleRedirectResult(): Promise<User | null> {
  const result = await getRedirectResult(getAuth());
  if (result) {
    const userDoc = await getDoc(doc(getDb(), 'users', result.user.uid));
    if (!userDoc.exists()) {
      await createUserDocument(result.user);
    } else {
      await updateLastLogin(result.user.uid);
    }
    return result.user;
  }
  return null;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(getAuth());
}

async function createUserDocument(user: User): Promise<void> {
  const userRef = doc(getDb(), 'users', user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
    onboardingComplete: false,
    autoGenerationEnabled: true,
    generationSources: ['x', 'polymarket', 'googlenews'],
    ideasPerRun: 10,
    preferredCategories: null,
    lastGenerationRun: null,
    generationRunCount: 0,
  });
}

async function updateLastLogin(uid: string): Promise<void> {
  const userRef = doc(getDb(), 'users', uid);
  await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
}

export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(getAuth(), callback);
}

export function getCurrentUser(): User | null {
  return getAuth().currentUser;
}
