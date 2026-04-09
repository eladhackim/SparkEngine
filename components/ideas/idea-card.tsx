'use client';

import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScoreBadge } from './score-badge';
import { SourceBadge } from './source-badge';
import { StatusDropdown } from './status-dropdown';
import { useSelectedIdea } from '@/providers/selected-idea-provider';
import type { Idea, IdeaStatus } from '@/lib/types/idea';

interface IdeaCardProps {
  idea: Idea;
  onStatusChange?: (ideaId: string, status: IdeaStatus) => void;
}

export function IdeaCard({ idea, onStatusChange }: IdeaCardProps) {
  const { selectIdea } = useSelectedIdea();

  const handleClick = () => {
    selectIdea(idea.id);
  };

  const handleStatusChange = (status: IdeaStatus) => {
    if (onStatusChange) {
      onStatusChange(idea.id, status);
    }
  };

  const isNew = !idea.viewedAt;

  // Calculate how recent the idea is
  const daysSinceCreated = Math.floor(
    (Date.now() - idea.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isRecent = daysSinceCreated <= 1;

  // Determine which source to display
  // Prefer dataSource (actual data source) over source (how it was created)
  const displaySource = idea.dataSource || (idea.source !== 'manual' ? idea.source : null);
  const showSourceBadge = displaySource !== null;

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all hover:shadow-md hover:border-primary/30',
        isNew && 'ring-2 ring-primary/20'
      )}
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{idea.name}</h3>
              {isNew && (
                <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-medium bg-primary text-primary-foreground rounded">
                  NEW
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {showSourceBadge && displaySource && (
                <SourceBadge source={displaySource} size="sm" />
              )}
              {isRecent && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {daysSinceCreated === 0 ? 'Today' : 'Yesterday'}
                </span>
              )}
            </div>
          </div>
          <ScoreBadge score={idea.compositeScore} tier={idea.tier} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {idea.brief || 'No description'}
        </p>

        {/* Tags */}
        {idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {idea.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 text-[10px] bg-muted rounded-full"
              >
                {tag}
              </span>
            ))}
            {idea.tags.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] text-muted-foreground">
                +{idea.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Status */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between"
        >
          <StatusDropdown status={idea.status} onChange={handleStatusChange} />
          <span className="text-xs text-muted-foreground">{idea.category}</span>
        </div>
      </CardContent>
    </Card>
  );
}
