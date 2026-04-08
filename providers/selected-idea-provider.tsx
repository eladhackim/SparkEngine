'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface SelectedIdeaContextType {
  selectedIdeaId: string | null;
  selectIdea: (id: string) => void;
  clearSelection: () => void;
}

const SelectedIdeaContext = createContext<SelectedIdeaContextType | null>(null);

export function SelectedIdeaProvider({ children }: { children: ReactNode }) {
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

  const selectIdea = useCallback((id: string) => {
    setSelectedIdeaId(id);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIdeaId(null);
  }, []);

  return (
    <SelectedIdeaContext.Provider value={{ selectedIdeaId, selectIdea, clearSelection }}>
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
