'use client';

import { Suspense, useState, useRef, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/providers/auth-provider';
import { IdeaGrid } from '@/components/ideas/idea-grid';
import { GenerateButton } from '@/components/generation/generate-button';
import { GenerationProgress } from '@/components/generation/generation-progress';
import { StatusTabs } from '@/components/filters/status-tabs';
import { SortDropdown } from '@/components/filters/sort-dropdown';
import { useFilters } from '@/hooks/use-filters';
import { ideaKeys } from '@/lib/queries/query-keys';
import { fetchStatusCounts } from '@/lib/firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { GenerationStage } from '@/lib/types/generation';

const GENERATE_FUNCTION_URL = 'https://generateideashttp-b7kq6socsa-uc.a.run.app';

// Stage timing for simulated progress (in ms)
const STAGE_TIMINGS: Record<GenerationStage, number> = {
  collecting: 3000,
  analyzing: 5000,
  generating: 8000,
  scoring: 4000,
  saving: 2000,
};

const STAGES: GenerationStage[] = ['collecting', 'analyzing', 'generating', 'scoring', 'saving'];

function DashboardContent() {
  const { user } = useAuth();
  const { filters, setStatus, setSort } = useFilters();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState<GenerationStage | undefined>();
  const [ideasGenerated, setIdeasGenerated] = useState<number | undefined>();
  const stageTimersRef = useRef<NodeJS.Timeout[]>([]);
  const queryClient = useQueryClient();

  // Start simulated stage progression
  const startStageProgression = useCallback(() => {
    // Clear any existing timers
    stageTimersRef.current.forEach(clearTimeout);
    stageTimersRef.current = [];

    let cumulativeTime = 0;
    STAGES.forEach((stage, index) => {
      const timer = setTimeout(() => {
        setCurrentStage(stage);
      }, cumulativeTime);
      stageTimersRef.current.push(timer);
      cumulativeTime += STAGE_TIMINGS[stage];
    });
  }, []);

  // Stop stage progression
  const stopStageProgression = useCallback(() => {
    stageTimersRef.current.forEach(clearTimeout);
    stageTimersRef.current = [];
  }, []);

  // Get status counts for tabs
  const { data: counts } = useQuery({
    queryKey: ideaKeys.countByStatus(),
    queryFn: () => {
      if (!user) throw new Error('Not authenticated');
      return fetchStatusCounts(user.uid);
    },
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds
  });

  const handleGenerate = async (options: { sources: string[] | 'all'; count: number }) => {
    if (!user) {
      toast.error('Please sign in to generate ideas');
      return;
    }

    // Prevent multiple concurrent generations
    if (isGenerating) {
      toast.info('Generation already in progress...');
      return;
    }

    setIsGenerating(true);
    setCurrentStage('collecting');
    setIdeasGenerated(undefined);
    startStageProgression();

    try {
      // Get Firebase ID token for authentication
      const idToken = await user.getIdToken();

      // Build request body - 'all' means omit sources to use all defaults
      const requestBody: Record<string, unknown> = {
        ideasPerRun: options.count,
      };

      // Only include sources if specific sources were requested
      if (options.sources !== 'all') {
        requestBody.sources = options.sources;
      }

      const response = await fetch(GENERATE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Generation failed');
      }

      const result = await response.json();
      const savedCount = result.data?.ideasSaved || 0;

      stopStageProgression();
      setCurrentStage(undefined);
      setIdeasGenerated(savedCount);
      toast.success(`Generated ${savedCount} new ideas!`);

      // Refresh the ideas list
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ideaKeys.counts() });
    } catch (error) {
      console.error('Generation error:', error);
      stopStageProgression();
      setCurrentStage(undefined);
      toast.error(error instanceof Error ? error.message : 'Failed to generate ideas. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ideas</h1>
          <p className="text-muted-foreground">
            Manage and evaluate your business ideas
          </p>
        </div>
        <GenerateButton onGenerate={handleGenerate} isGenerating={isGenerating} />
      </div>

      {/* Generation Progress (shows when generating) */}
      <GenerationProgress
        isGenerating={isGenerating}
        currentStage={currentStage}
        ideasGenerated={ideasGenerated}
      />

      {/* Filters Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <StatusTabs
          value={filters.status}
          onChange={setStatus}
          counts={counts}
        />
        <SortDropdown value={filters.sort} onChange={setSort} />
      </div>

      {/* Ideas Grid */}
      <IdeaGrid filters={filters} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
