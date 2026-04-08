import type { IdeaFilters } from '@/lib/types/filters';

export const ideaKeys = {
  all: ['ideas'] as const,

  lists: () => [...ideaKeys.all, 'list'] as const,
  list: (filters: IdeaFilters) => [...ideaKeys.lists(), filters] as const,

  details: () => [...ideaKeys.all, 'detail'] as const,
  detail: (id: string) => [...ideaKeys.details(), id] as const,

  counts: () => [...ideaKeys.all, 'counts'] as const,
  countByStatus: () => [...ideaKeys.counts(), 'byStatus'] as const,
};

export const noteKeys = {
  all: ['notes'] as const,

  lists: () => [...noteKeys.all, 'list'] as const,
  list: (ideaId: string) => [...noteKeys.lists(), ideaId] as const,

  detail: (noteId: string) => [...noteKeys.all, 'detail', noteId] as const,
};

export const generationKeys = {
  all: ['generation'] as const,

  status: () => [...generationKeys.all, 'status'] as const,
  currentRun: () => [...generationKeys.all, 'currentRun'] as const,

  history: () => [...generationKeys.all, 'history'] as const,
  historyList: () => [...generationKeys.history(), 'list'] as const,
  historyRun: (runId: string) => [...generationKeys.history(), runId] as const,

  settings: () => [...generationKeys.all, 'settings'] as const,
};

export const userKeys = {
  all: ['user'] as const,
  current: () => [...userKeys.all, 'current'] as const,
  preferences: () => [...userKeys.all, 'preferences'] as const,
};
