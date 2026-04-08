import type { IdeaStatus, IdeaSource, DecisionTier } from './idea';

export type SortField = 'createdAt' | 'updatedAt' | 'name' | 'compositeScore' | 'status';
export type SortOrder = 'asc' | 'desc';
export type SortOption = `${SortField}-${SortOrder}`;

export type StatusFilter = IdeaStatus | 'all';

export interface IdeaFilters {
  status: StatusFilter;
  sort: SortOption;
  category?: string;
  minScore?: number;
  maxScore?: number;
  tags?: string[];
  search?: string;
  sources?: IdeaSource[];
  runId?: string;
}

export const defaultFilters: IdeaFilters = {
  status: 'all',
  sort: 'compositeScore-desc',
};
