'use client';

import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { StatusFilter } from '@/lib/types/filters';

interface StatusTabsProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
  counts?: Record<string, number>;
}

const statuses: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'pursuing', label: 'Pursuing' },
  { value: 'parked', label: 'Parked' },
];

export function StatusTabs({ value, onChange, counts }: StatusTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as StatusFilter)}>
      <TabsList className="h-auto flex-wrap">
        {statuses.map((status) => {
          const count = counts?.[status.value];
          return (
            <TabsTrigger
              key={status.value}
              value={status.value}
              className="gap-1.5"
            >
              {status.label}
              {count !== undefined && count > 0 && (
                <span
                  className={cn(
                    'ml-1 rounded-full px-1.5 py-0.5 text-xs',
                    value === status.value
                      ? 'bg-primary-foreground text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {count}
                </span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
