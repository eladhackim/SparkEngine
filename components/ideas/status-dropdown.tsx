'use client';

import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { IdeaStatus } from '@/lib/types/idea';

interface StatusDropdownProps {
  status: IdeaStatus;
  onChange: (status: IdeaStatus) => void;
  disabled?: boolean;
}

const statusConfig: Record<IdeaStatus, { label: string; color: string; bgColor: string }> = {
  new: { label: 'New', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  reviewing: { label: 'Reviewing', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  pursuing: { label: 'Pursuing', color: 'text-green-700', bgColor: 'bg-green-100' },
  parked: { label: 'Parked', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  rejected: { label: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-100' },
};

// Valid status transitions per state machine
const validTransitions: Record<IdeaStatus, IdeaStatus[]> = {
  new: ['reviewing'],
  reviewing: ['pursuing', 'parked', 'rejected'],
  pursuing: ['reviewing', 'parked'],
  parked: ['reviewing'],
  rejected: [], // Terminal state
};

const allStatuses: IdeaStatus[] = ['new', 'reviewing', 'pursuing', 'parked', 'rejected'];

export function StatusDropdown({ status, onChange, disabled }: StatusDropdownProps) {
  const config = statusConfig[status];
  const availableTransitions = validTransitions[status];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled || availableTransitions.length === 0}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3',
          config.bgColor,
          config.color,
          'border-transparent hover:border-current'
        )}
      >
        {config.label}
        {availableTransitions.length > 0 && <ChevronDown className="h-4 w-4" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {allStatuses.map((s) => {
          const sConfig = statusConfig[s];
          const isCurrentStatus = s === status;
          const isValidTransition = availableTransitions.includes(s);
          const isDisabled = !isCurrentStatus && !isValidTransition;

          return (
            <DropdownMenuItem
              key={s}
              disabled={isDisabled}
              onClick={() => !isDisabled && !isCurrentStatus && onChange(s)}
              className={cn(
                'flex items-center gap-2',
                isDisabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span className={cn('w-2 h-2 rounded-full', sConfig.bgColor)} />
              <span className={cn(isCurrentStatus && 'font-medium')}>{sConfig.label}</span>
              {isCurrentStatus && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
