'use client';

import { Sparkles, TrendingUp, Newspaper, Store, AtSign, PencilLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DataSource } from '@/lib/types/generation';
import type { IdeaSource } from '@/lib/types/idea';

type SourceType = DataSource | IdeaSource;

interface SourceBadgeProps {
  source: SourceType;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'ribbon';
  className?: string;
}

interface SourceConfig {
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const sourceConfigs: Record<string, SourceConfig> = {
  // DataSource types (for generation/filters)
  x: {
    label: 'X Trends',
    shortLabel: 'X',
    icon: AtSign,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
  },
  twitter: {
    label: 'X Trends',
    shortLabel: 'X',
    icon: AtSign,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
  },
  polymarket: {
    label: 'Markets',
    shortLabel: 'Markets',
    icon: TrendingUp,
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
  },
  googlenews: {
    label: 'News',
    shortLabel: 'News',
    icon: Newspaper,
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-300',
  },
  news: {
    label: 'News',
    shortLabel: 'News',
    icon: Newspaper,
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-300',
  },
  appstore: {
    label: 'App Store Insight',
    shortLabel: 'App Store',
    icon: Store,
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300',
  },
  // IdeaSource types (for displaying on ideas)
  'ai-generated': {
    label: 'AI Generated',
    shortLabel: 'AI',
    icon: Sparkles,
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300',
  },
  'trend-suggested': {
    label: 'Trend',
    shortLabel: 'Trend',
    icon: TrendingUp,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
  },
  manual: {
    label: 'Manual',
    shortLabel: 'Manual',
    icon: PencilLine,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-300',
  },
  imported: {
    label: 'Imported',
    shortLabel: 'Import',
    icon: PencilLine,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-300',
  },
};

const sizeClasses = {
  sm: {
    badge: 'px-1.5 py-0.5 text-[10px] gap-0.5',
    ribbon: 'px-2 py-0.5 text-[10px] gap-1',
    icon: 'h-2.5 w-2.5',
  },
  md: {
    badge: 'px-2 py-1 text-xs gap-1',
    ribbon: 'px-3 py-1 text-xs gap-1.5',
    icon: 'h-3 w-3',
  },
  lg: {
    badge: 'px-2.5 py-1.5 text-sm gap-1.5',
    ribbon: 'px-4 py-1.5 text-sm gap-2',
    icon: 'h-4 w-4',
  },
};

export function SourceBadge({
  source,
  size = 'sm',
  variant = 'badge',
  className,
}: SourceBadgeProps) {
  const config = sourceConfigs[source];

  if (!config) {
    return null;
  }

  const Icon = config.icon;
  const label = size === 'sm' ? config.shortLabel : config.label;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeClasses[size][variant],
        variant === 'ribbon' && 'rounded-md',
        className
      )}
    >
      <Icon className={cn(sizeClasses[size].icon)} />
      <span>{label}</span>
    </span>
  );
}

// Helper to get source config for external use
export function getSourceConfig(source: SourceType): SourceConfig | undefined {
  return sourceConfigs[source];
}

// Export configs for use in dropdowns
export const dataSourceOptions: { value: DataSource; label: string }[] = [
  { value: 'x', label: 'X Trends' },
  { value: 'polymarket', label: 'Markets' },
  { value: 'googlenews', label: 'News' },
  { value: 'appstore', label: 'App Store' },
];
