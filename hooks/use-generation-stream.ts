'use client';

import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/providers/auth-provider';
import type {
  GenerationStage,
  DataSource,
  StageProgressData,
  SSEEvent,
  ProgressEvent,
  CompleteEvent,
  CollectingProgressData,
  AnalyzingProgressData,
  GeneratingProgressData,
  SavingProgressData,
} from '@/lib/types/generation';

interface GenerationProgress {
  stage: GenerationStage;
  progress: number;
  data: StageProgressData;
  isComplete: boolean;
  error: string | null;
  result: {
    runId: string;
    ideasGenerated: number;
    ideasSaved: number;
    duration: number;
  } | null;
}

interface GenerationOptions {
  sources: DataSource[];
  ideasPerRun?: number;
  categories?: string[];
}

const GENERATE_URL = process.env.NEXT_PUBLIC_GENERATE_IDEAS_URL ||
  'https://us-central1-sparkengine-3740d.cloudfunctions.net/generateIdeasHttp';

export function useGenerationStream() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startGeneration = useCallback(async (options: GenerationOptions) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Abort any existing generation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsGenerating(true);
    setProgress({
      stage: 'collecting',
      progress: 0,
      data: {
        categoriesTotal: options.sources.length,
        categoriesCompleted: 0,
        currentCategory: 'Starting...',
        appsFound: 0,
        reviewsFound: 0,
      } as CollectingProgressData,
      isComplete: false,
      error: null,
      result: null,
    });

    try {
      const idToken = await user.getIdToken();

      // Use fetch with streaming for POST
      const response = await fetch(`${GENERATE_URL}?stream=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          sources: options.sources,
          ideasPerRun: options.ideasPerRun || 10,
          categories: options.categories,
          stream: true,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep the last incomplete line in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6)) as SSEEvent;
              handleEvent(event);
            } catch {
              // Ignore parsing errors (heartbeat comments, etc.)
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Generation was cancelled
        setProgress((prev) => prev ? {
          ...prev,
          error: 'Generation cancelled',
        } : null);
      } else {
        console.error('[SSE] Generation error:', error);
        setProgress((prev) => prev ? {
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error',
        } : null);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }, [user]);

  const handleEvent = useCallback((event: SSEEvent) => {
    switch (event.type) {
      case 'progress':
        setProgress({
          stage: event.stage,
          progress: event.progress,
          data: event.data,
          isComplete: false,
          error: null,
          result: null,
        });
        break;

      case 'complete':
        setProgress((prev) => prev ? {
          ...prev,
          stage: 'saving',
          progress: 100,
          isComplete: true,
          result: {
            runId: event.runId,
            ideasGenerated: event.ideasGenerated,
            ideasSaved: event.ideasSaved,
            duration: event.duration,
          },
        } : null);
        setIsGenerating(false);
        break;

      case 'error':
        setProgress((prev) => prev ? {
          ...prev,
          error: event.message,
        } : null);
        if (!event.recoverable) {
          setIsGenerating(false);
        }
        break;
    }
  }, []);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(null);
    setIsGenerating(false);
  }, []);

  return {
    progress,
    isGenerating,
    startGeneration,
    cancelGeneration,
    resetProgress,
  };
}

// Helper functions to get typed stage data
export function isCollectingData(data: StageProgressData): data is CollectingProgressData {
  return 'appsFound' in data;
}

export function isAnalyzingData(data: StageProgressData): data is AnalyzingProgressData {
  return 'frictionPointsFound' in data;
}

export function isGeneratingData(data: StageProgressData): data is GeneratingProgressData {
  return 'ideasGenerated' in data && 'clustersTotal' in data;
}

export function isSavingData(data: StageProgressData): data is SavingProgressData {
  return 'ideasSaved' in data && !('clustersTotal' in data);
}
