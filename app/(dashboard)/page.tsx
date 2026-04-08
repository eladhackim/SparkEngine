'use client';

import { Suspense, useState } from 'react';
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

const GENERATE_FUNCTION_URL = 'https://generateideashttp-b7kq6socsa-uc.a.run.app';

function DashboardContent() {
  const { user } = useAuth();
  const { filters, setStatus, setSort } = useFilters();
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

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

  const handleGenerate = async (options: { sources: string[]; count: number }) => {
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
    try {
      // Get Firebase ID token for authentication
      const idToken = await user.getIdToken();

      const response = await fetch(GENERATE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          sources: options.sources,
          ideasPerRun: options.count,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Generation failed');
      }

      const result = await response.json();
      toast.success(`Generated ${result.data?.ideasSaved || 0} new ideas!`);

      // Refresh the ideas list
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ideaKeys.counts() });
    } catch (error) {
      console.error('Generation error:', error);
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
      <GenerationProgress isGenerating={isGenerating} />

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
