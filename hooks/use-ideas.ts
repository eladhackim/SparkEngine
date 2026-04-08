'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { type DocumentSnapshot } from 'firebase/firestore';
import { useAuth } from '@/providers/auth-provider';
import { ideaKeys } from '@/lib/queries/query-keys';
import {
  fetchIdeas,
  fetchIdea,
  createIdea,
  updateIdea,
  deleteIdea,
  fetchStatusCounts,
} from '@/lib/firebase/firestore';
import { toast } from 'sonner';
import type { IdeaFilters } from '@/lib/types/filters';
import type { CreateIdeaInput, UpdateIdeaInput, Idea } from '@/lib/types/idea';

export function useIdeas(filters: IdeaFilters) {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: ideaKeys.list(filters),
    queryFn: async ({ pageParam }) => {
      if (!user) throw new Error('Not authenticated');
      return fetchIdeas(user.uid, filters, pageParam as DocumentSnapshot | undefined);
    },
    initialPageParam: undefined as DocumentSnapshot | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.lastDoc : undefined,
    enabled: !!user,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useIdea(ideaId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ideaKeys.detail(ideaId || ''),
    queryFn: () => {
      if (!user || !ideaId) return null;
      return fetchIdea(user.uid, ideaId);
    },
    enabled: !!user && !!ideaId,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useStatusCounts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ideaKeys.countByStatus(),
    queryFn: () => {
      if (!user) throw new Error('Not authenticated');
      return fetchStatusCounts(user.uid);
    },
    enabled: !!user,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useCreateIdea() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateIdeaInput) => {
      if (!user) throw new Error('Not authenticated');
      return createIdea(user.uid, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ideaKeys.counts() });
      toast.success('Idea created!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create idea');
    },
  });
}

export function useUpdateIdea() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ideaId, updates }: { ideaId: string; updates: UpdateIdeaInput }) => {
      if (!user) throw new Error('Not authenticated');
      return updateIdea(user.uid, ideaId, updates);
    },
    onMutate: async ({ ideaId, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ideaKeys.detail(ideaId) });

      // Snapshot previous value
      const previousIdea = queryClient.getQueryData<Idea>(ideaKeys.detail(ideaId));

      // Optimistically update
      if (previousIdea) {
        queryClient.setQueryData(ideaKeys.detail(ideaId), {
          ...previousIdea,
          ...updates,
          updatedAt: new Date(),
        });
      }

      return { previousIdea };
    },
    onError: (error, { ideaId }, context) => {
      // Rollback on error
      if (context?.previousIdea) {
        queryClient.setQueryData(ideaKeys.detail(ideaId), context.previousIdea);
      }
      toast.error(error.message || 'Failed to update idea');
    },
    onSuccess: (_, { ideaId }) => {
      queryClient.invalidateQueries({ queryKey: ideaKeys.detail(ideaId) });
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ideaKeys.counts() });
    },
  });
}

export function useDeleteIdea() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ideaId: string) => {
      if (!user) throw new Error('Not authenticated');
      return deleteIdea(user.uid, ideaId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ideaKeys.counts() });
      toast.success('Idea deleted');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete idea');
    },
  });
}
