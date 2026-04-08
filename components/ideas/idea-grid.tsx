'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type DocumentSnapshot } from 'firebase/firestore';
import { useAuth } from '@/providers/auth-provider';
import { ideaKeys } from '@/lib/queries/query-keys';
import { fetchIdeas, updateIdea } from '@/lib/firebase/firestore';
import { IdeaCard } from './idea-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Inbox, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { IdeaFilters } from '@/lib/types/filters';
import type { IdeaStatus } from '@/lib/types/idea';

interface IdeaGridProps {
  filters: IdeaFilters;
}

export function IdeaGrid({ filters }: IdeaGridProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ideaKeys.list(filters),
    queryFn: async ({ pageParam }) => {
      if (!user) throw new Error('Not authenticated');
      return fetchIdeas(user.uid, filters, pageParam as DocumentSnapshot | undefined);
    },
    initialPageParam: undefined as DocumentSnapshot | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.lastDoc : undefined,
    enabled: !!user,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ ideaId, status }: { ideaId: string; status: IdeaStatus }) => {
      if (!user) throw new Error('Not authenticated');
      await updateIdea(user.uid, ideaId, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ideaKeys.counts() });
      toast.success('Status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const handleStatusChange = (ideaId: string, status: IdeaStatus) => {
    updateStatusMutation.mutate({ ideaId, status });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-red-500 mb-4">
          {error instanceof Error ? error.message : 'Failed to load ideas'}
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </div>
    );
  }

  // Get all ideas from all pages
  const ideas = data?.pages.flatMap((page) => page.ideas) || [];

  // Empty state
  if (ideas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-medium text-lg mb-1">No ideas found</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          {filters.status !== 'all'
            ? `No ideas with status "${filters.status}". Try a different filter.`
            : 'Generate your first ideas using the button above.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {/* Load More */}
      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load more'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
