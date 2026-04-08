'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { IdeaFilters, StatusFilter, SortOption } from '@/lib/types/filters';
import { defaultFilters } from '@/lib/types/filters';

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse filters from URL
  const filters: IdeaFilters = useMemo(() => {
    const status = (searchParams.get('status') as StatusFilter) || defaultFilters.status;
    const sort = (searchParams.get('sort') as SortOption) || defaultFilters.sort;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('q') || undefined;
    const minScore = searchParams.get('minScore')
      ? parseFloat(searchParams.get('minScore')!)
      : undefined;
    const maxScore = searchParams.get('maxScore')
      ? parseFloat(searchParams.get('maxScore')!)
      : undefined;

    return {
      status,
      sort,
      category,
      search,
      minScore,
      maxScore,
    };
  }, [searchParams]);

  // Update URL with new filters
  const setFilters = useCallback(
    (newFilters: Partial<IdeaFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update each filter
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === defaultFilters[key as keyof IdeaFilters]) {
          params.delete(key === 'search' ? 'q' : key);
        } else {
          params.set(key === 'search' ? 'q' : key, String(value));
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Convenience setters
  const setStatus = useCallback(
    (status: StatusFilter) => setFilters({ status }),
    [setFilters]
  );

  const setSort = useCallback(
    (sort: SortOption) => setFilters({ sort }),
    [setFilters]
  );

  const setSearch = useCallback(
    (search: string) => setFilters({ search: search || undefined }),
    [setFilters]
  );

  const setCategory = useCallback(
    (category: string | undefined) => setFilters({ category }),
    [setFilters]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return {
    filters,
    setFilters,
    setStatus,
    setSort,
    setSearch,
    setCategory,
    clearFilters,
  };
}
