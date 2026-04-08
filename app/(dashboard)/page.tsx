'use client';

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
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

function DashboardContent() {
  const { user } = useAuth();
  const { filters, setStatus, setSort } = useFilters();

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
        <GenerateButton />
      </div>

      {/* Generation Progress (shows when generating) */}
      <GenerationProgress isGenerating={false} />

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
