import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  writeBatch,
  type DocumentSnapshot,
  type QueryConstraint,
} from 'firebase/firestore';
import { getDb } from './config';
import type { Idea, Note, CreateIdeaInput, UpdateIdeaInput, getScoreTier } from '@/lib/types/idea';
import type { IdeaFilters, SortOption } from '@/lib/types/filters';

const PAGE_SIZE = 20;

// ============================================
// IDEAS
// ============================================

function parseSortOption(sort: SortOption): { field: string; direction: 'asc' | 'desc' } {
  const [field, direction] = sort.split('-') as [string, 'asc' | 'desc'];
  return { field, direction };
}

export async function fetchIdeas(
  userId: string,
  filters: IdeaFilters,
  cursor?: DocumentSnapshot
): Promise<{ ideas: Idea[]; lastDoc: DocumentSnapshot | null; hasMore: boolean }> {
  const ideasRef = collection(getDb(), 'users', userId, 'ideas');
  const constraints: QueryConstraint[] = [];

  // Status filter
  if (filters.status !== 'all') {
    constraints.push(where('status', '==', filters.status));
  }

  // Category filter
  if (filters.category) {
    constraints.push(where('category', '==', filters.category));
  }

  // Score range filters
  if (filters.minScore !== undefined) {
    constraints.push(where('compositeScore', '>=', filters.minScore));
  }
  if (filters.maxScore !== undefined) {
    constraints.push(where('compositeScore', '<=', filters.maxScore));
  }

  // Source filter
  if (filters.sources && filters.sources.length > 0) {
    constraints.push(where('source', 'in', filters.sources));
  }

  // Generation run filter
  if (filters.runId) {
    constraints.push(where('generationRunId', '==', filters.runId));
  }

  // Sorting
  const { field, direction } = parseSortOption(filters.sort);
  constraints.push(orderBy(field, direction));

  // Pagination
  if (cursor) {
    constraints.push(startAfter(cursor));
  }
  constraints.push(limit(PAGE_SIZE + 1)); // Fetch one extra to check hasMore

  const q = query(ideasRef, ...constraints);
  const snapshot = await getDocs(q);

  const hasMore = snapshot.docs.length > PAGE_SIZE;
  const docs = hasMore ? snapshot.docs.slice(0, PAGE_SIZE) : snapshot.docs;

  const ideas: Idea[] = docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    scoredAt: doc.data().scoredAt?.toDate() || null,
    viewedAt: doc.data().viewedAt?.toDate() || null,
  })) as Idea[];

  return {
    ideas,
    lastDoc: docs[docs.length - 1] || null,
    hasMore,
  };
}

export async function fetchIdea(userId: string, ideaId: string): Promise<Idea | null> {
  const ideaRef = doc(getDb(), 'users', userId, 'ideas', ideaId);
  const snapshot = await getDoc(ideaRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate() || new Date(),
    updatedAt: snapshot.data().updatedAt?.toDate() || new Date(),
    scoredAt: snapshot.data().scoredAt?.toDate() || null,
    viewedAt: snapshot.data().viewedAt?.toDate() || null,
  } as Idea;
}

export async function createIdea(userId: string, input: CreateIdeaInput): Promise<string> {
  const ideasRef = collection(getDb(), 'users', userId, 'ideas');

  // Calculate composite score
  const compositeScore = calculateCompositeScore(input);
  const tier = getScoreTierFromScore(compositeScore);

  const newIdea = {
    ...input,
    status: input.status || 'new',
    tags: input.tags || [],
    source: 'manual' as const,
    dataSource: null,  // Manual ideas don't have a data source
    compositeScore,
    tier,
    scoringMethod: 'manual' as const,
    tradeoffFlags: [],
    sourceSignals: null,
    generationRunId: null,
    elevatorPitch: null,
    strengths: [],
    risks: [],
    businessPlan: null,
    trendAlignment: null,
    founderMarketFit: null,
    growthPotential: null,
    defensibility: null,
    capitalEfficiency: null,
    noteCount: 0,
    viewedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    scoredAt: serverTimestamp(),
  };

  const docRef = await addDoc(ideasRef, newIdea);
  return docRef.id;
}

export async function updateIdea(
  userId: string,
  ideaId: string,
  updates: UpdateIdeaInput
): Promise<void> {
  const ideaRef = doc(getDb(), 'users', userId, 'ideas', ideaId);

  const updateData: Record<string, unknown> = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  // Recalculate composite score if any score changed
  const scoreFields = [
    'businessPotential',
    'developmentComplexity',
    'timeToMarket',
    'competitionLevel',
    'riskLevel',
  ];

  const hasScoreChange = scoreFields.some((f) => f in updates);
  if (hasScoreChange) {
    const currentDoc = await getDoc(ideaRef);
    if (currentDoc.exists()) {
      const currentData = currentDoc.data();
      const merged = {
        businessPotential: updates.businessPotential ?? currentData.businessPotential,
        developmentComplexity: updates.developmentComplexity ?? currentData.developmentComplexity,
        timeToMarket: updates.timeToMarket ?? currentData.timeToMarket,
        competitionLevel: updates.competitionLevel ?? currentData.competitionLevel,
        riskLevel: updates.riskLevel ?? currentData.riskLevel,
      };
      updateData.compositeScore = calculateCompositeScore(merged);
      updateData.tier = getScoreTierFromScore(updateData.compositeScore as number);
      updateData.scoredAt = serverTimestamp();
    }
  }

  await updateDoc(ideaRef, updateData);
}

export async function deleteIdea(userId: string, ideaId: string): Promise<void> {
  const ideaRef = doc(getDb(), 'users', userId, 'ideas', ideaId);
  const notesRef = collection(ideaRef, 'notes');

  // Delete all notes first
  const notesSnap = await getDocs(notesRef);
  const batch = writeBatch(getDb());
  notesSnap.docs.forEach((noteDoc) => {
    batch.delete(noteDoc.ref);
  });

  // Delete the idea
  batch.delete(ideaRef);
  await batch.commit();
}

export async function markIdeaViewed(userId: string, ideaId: string): Promise<void> {
  const ideaRef = doc(getDb(), 'users', userId, 'ideas', ideaId);
  const ideaSnap = await getDoc(ideaRef);

  if (ideaSnap.exists() && !ideaSnap.data().viewedAt) {
    await updateDoc(ideaRef, {
      viewedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

// ============================================
// NOTES
// ============================================

export async function fetchNotes(userId: string, ideaId: string): Promise<Note[]> {
  const notesRef = collection(getDb(), 'users', userId, 'ideas', ideaId, 'notes');
  const q = query(notesRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    content: doc.data().content,
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  }));
}

export async function createNote(userId: string, ideaId: string, content: string): Promise<string> {
  const ideaRef = doc(getDb(), 'users', userId, 'ideas', ideaId);
  const notesRef = collection(ideaRef, 'notes');

  const batch = writeBatch(getDb());

  const noteRef = doc(notesRef);
  batch.set(noteRef, {
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Increment note count - using update with incremental field
  // Note: In a real app, use FieldValue.increment()
  const ideaSnap = await getDoc(ideaRef);
  const currentCount = ideaSnap.data()?.noteCount || 0;
  batch.update(ideaRef, {
    noteCount: currentCount + 1,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
  return noteRef.id;
}

export async function updateNote(
  userId: string,
  ideaId: string,
  noteId: string,
  content: string
): Promise<void> {
  const noteRef = doc(getDb(), 'users', userId, 'ideas', ideaId, 'notes', noteId);
  await updateDoc(noteRef, {
    content,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteNote(userId: string, ideaId: string, noteId: string): Promise<void> {
  const ideaRef = doc(getDb(), 'users', userId, 'ideas', ideaId);
  const noteRef = doc(ideaRef, 'notes', noteId);

  const batch = writeBatch(getDb());
  batch.delete(noteRef);

  // Decrement note count
  const ideaSnap = await getDoc(ideaRef);
  const currentCount = ideaSnap.data()?.noteCount || 0;
  batch.update(ideaRef, {
    noteCount: Math.max(0, currentCount - 1),
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}

// ============================================
// STATUS COUNTS
// ============================================

export async function fetchStatusCounts(
  userId: string
): Promise<Record<string, number>> {
  const ideasRef = collection(getDb(), 'users', userId, 'ideas');
  const snapshot = await getDocs(ideasRef);

  const counts: Record<string, number> = {
    all: 0,
    new: 0,
    reviewing: 0,
    pursuing: 0,
    parked: 0,
    rejected: 0,
  };

  snapshot.docs.forEach((doc) => {
    const status = doc.data().status;
    counts.all++;
    if (status in counts) {
      counts[status]++;
    }
  });

  return counts;
}

// ============================================
// HELPERS
// ============================================

function calculateCompositeScore(idea: {
  businessPotential: number;
  developmentComplexity: number;
  timeToMarket: number;
  competitionLevel: number;
  riskLevel: number;
}): number {
  const weight = 0.2;
  const score =
    idea.businessPotential * weight +
    idea.developmentComplexity * weight +
    idea.timeToMarket * weight +
    idea.competitionLevel * weight +
    idea.riskLevel * weight;

  return Math.round(score * 100) / 100;
}

function getScoreTierFromScore(score: number): string {
  if (score >= 4.0) return 'hot';
  if (score >= 3.0) return 'warm';
  if (score >= 2.0) return 'park';
  return 'discard';
}
