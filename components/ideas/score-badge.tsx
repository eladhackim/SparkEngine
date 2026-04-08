import { cn } from '@/lib/utils';
import type { DecisionTier } from '@/lib/types/idea';

interface ScoreBadgeProps {
  score: number;
  tier: DecisionTier;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const tierConfig: Record<DecisionTier, { bg: string; text: string; label: string }> = {
  hot: { bg: 'bg-green-100', text: 'text-green-800', label: 'HOT' },
  warm: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'WARM' },
  park: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'PARK' },
  discard: { bg: 'bg-red-100', text: 'text-red-800', label: 'DISCARD' },
};

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export function ScoreBadge({ score, tier, size = 'md', showLabel = false }: ScoreBadgeProps) {
  const config = tierConfig[tier];

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-semibold',
          config.bg,
          config.text,
          sizeClasses[size]
        )}
      >
        {score.toFixed(1)}
      </div>
      {showLabel && (
        <span className={cn('text-xs font-medium', config.text)}>{config.label}</span>
      )}
    </div>
  );
}
