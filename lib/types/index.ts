// Frontend types (use Date for timestamps)
export * from './idea';
export * from './filters';
export * from './generation';
export * from './user';
export * from './constants';
export * from './preferences';

// Firestore types (use Timestamp) - for direct Firestore operations
// Import these separately when working with Firestore SDK:
// import { Idea as FirestoreIdea } from '@/lib/types/firestore';
export * as Firestore from './firestore';
