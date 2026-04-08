'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { DataSource } from '@/lib/types/generation';

interface GenerateButtonProps {
  onGenerate?: (options: GenerateOptions) => void;
  isGenerating?: boolean;
}

interface GenerateOptions {
  sources: DataSource[];
  count: number;
}

const sourceLabels: Record<DataSource, string> = {
  x: 'X (Twitter)',
  polymarket: 'Polymarket',
  googlenews: 'Google News',
};

export function GenerateButton({ onGenerate, isGenerating = false }: GenerateButtonProps) {
  const [sources, setSources] = useState<DataSource[]>(['x', 'polymarket', 'googlenews']);
  const [count, setCount] = useState(10);

  const handleGenerate = () => {
    if (sources.length === 0) {
      toast.error('Please select at least one data source');
      return;
    }

    if (onGenerate) {
      onGenerate({ sources, count });
    } else {
      // Mock generation for now
      toast.info('Generation will be connected when Cloud Functions are deployed');
    }
  };

  const toggleSource = (source: DataSource) => {
    setSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  return (
    <div className="flex items-center gap-2">
      {/* Main Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        size="lg"
        className="gap-2"
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

      {/* Quick Settings Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
          disabled={isGenerating}
        >
          <Settings className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Generation Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Data Sources
          </DropdownMenuLabel>
          {Object.entries(sourceLabels).map(([key, label]) => (
            <DropdownMenuCheckboxItem
              key={key}
              checked={sources.includes(key as DataSource)}
              onCheckedChange={() => toggleSource(key as DataSource)}
            >
              {label}
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Ideas per run
          </DropdownMenuLabel>
          {[5, 10, 15, 20, 25].map((n) => (
            <DropdownMenuCheckboxItem
              key={n}
              checked={count === n}
              onCheckedChange={() => setCount(n)}
            >
              {n} ideas
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
