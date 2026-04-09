'use client';

import { useState } from 'react';
import { Sparkles, Loader2, ChevronDown, AtSign, TrendingUp, Newspaper, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { DataSource } from '@/lib/types/generation';

interface GenerateButtonProps {
  onGenerate?: (options: GenerateOptions) => void;
  isGenerating?: boolean;
}

interface GenerateOptions {
  sources: DataSource[] | 'all';
  count: number;
}

interface SourceOption {
  value: DataSource;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  color: string;
}

const sourceOptions: SourceOption[] = [
  { value: 'x', label: 'From X Trends', shortLabel: 'X', icon: AtSign, color: 'text-blue-600' },
  { value: 'polymarket', label: 'From Markets', shortLabel: 'Markets', icon: TrendingUp, color: 'text-green-600' },
  { value: 'googlenews', label: 'From News', shortLabel: 'News', icon: Newspaper, color: 'text-orange-600' },
  { value: 'appstore', label: 'From App Store', shortLabel: 'App Store', icon: Store, color: 'text-purple-600' },
];

export function GenerateButton({ onGenerate, isGenerating = false }: GenerateButtonProps) {
  const [count] = useState(10);

  const handleGenerateAll = () => {
    if (onGenerate) {
      onGenerate({ sources: 'all', count });
    } else {
      toast.info('Generation will be connected when Cloud Functions are deployed');
    }
  };

  const handleGenerateFromSource = (source: DataSource) => {
    if (onGenerate) {
      onGenerate({ sources: [source], count });
    } else {
      const option = sourceOptions.find(s => s.value === source);
      toast.info(`Generate from ${option?.shortLabel || source} - will be connected when Cloud Functions are deployed`);
    }
  };

  return (
    <div className="flex items-center">
      {/* Main Generate Button with Dropdown */}
      <div className="flex">
        <Button
          onClick={handleGenerateAll}
          disabled={isGenerating}
          size="lg"
          className="gap-2 rounded-r-none"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Ideas
            </>
          )}
        </Button>

        {/* Source Selection Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-l-none border-l border-l-primary-foreground/20 px-2"
            disabled={isGenerating}
          >
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Generate from specific source</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {sourceOptions.map((option) => {
              const Icon = option.icon;
              return (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleGenerateFromSource(option.value)}
                  className="cursor-pointer"
                >
                  <Icon className={`h-4 w-4 mr-2 ${option.color}`} />
                  {option.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
