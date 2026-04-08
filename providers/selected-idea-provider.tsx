'use client';

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';

interface SelectedIdeaContextType {
  selectedIdeaId: string | null;
  selectIdea: (id: string) => void;
  clearSelection: () => void;
  // Navigation
  setIdeaIds: (ids: string[]) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  currentIndex: number;
  totalCount: number;
}

const SelectedIdeaContext = createContext<SelectedIdeaContextType | null>(null);

export function SelectedIdeaProvider({ children }: { children: ReactNode }) {
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const ideaIdsRef = useRef<string[]>([]);

  const selectIdea = useCallback((id: string) => {
    setSelectedIdeaId(id);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIdeaId(null);
  }, []);

  const setIdeaIds = useCallback((ids: string[]) => {
    ideaIdsRef.current = ids;
  }, []);

  const getCurrentIndex = () => {
    if (!selectedIdeaId) return -1;
    return ideaIdsRef.current.indexOf(selectedIdeaId);
  };

  const goToNext = useCallback(() => {
    const currentIdx = getCurrentIndex();
    if (currentIdx >= 0 && currentIdx < ideaIdsRef.current.length - 1) {
      setSelectedIdeaId(ideaIdsRef.current[currentIdx + 1]);
    }
  }, [selectedIdeaId]);

  const goToPrevious = useCallback(() => {
    const currentIdx = getCurrentIndex();
    if (currentIdx > 0) {
      setSelectedIdeaId(ideaIdsRef.current[currentIdx - 1]);
    }
  }, [selectedIdeaId]);

  const currentIndex = getCurrentIndex();
  const hasNext = currentIndex >= 0 && currentIndex < ideaIdsRef.current.length - 1;
  const hasPrevious = currentIndex > 0;

  return (
    <SelectedIdeaContext.Provider value={{
      selectedIdeaId,
      selectIdea,
      clearSelection,
      setIdeaIds,
      goToNext,
      goToPrevious,
      hasNext,
      hasPrevious,
      currentIndex,
      totalCount: ideaIdsRef.current.length,
    }}>
      {children}
    </SelectedIdeaContext.Provider>
  );
}

export function useSelectedIdea() {
  const context = useContext(SelectedIdeaContext);
  if (!context) {
    throw new Error('useSelectedIdea must be used within a SelectedIdeaProvider');
  }
  return context;
}
