'use client';

import { Sparkles, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import type { GenerationStage } from '@/lib/types/generation';
import { stageLabels, stageProgress } from '@/lib/types/generation';

interface GenerationProgressProps {
  isGenerating: boolean;
  currentStage?: GenerationStage;
  error?: string;
  ideasGenerated?: number;
}

const stages: GenerationStage[] = ['collecting', 'analyzing', 'generating', 'scoring', 'saving'];

export function GenerationProgress({
  isGenerating,
  currentStage,
  error,
  ideasGenerated,
}: GenerationProgressProps) {
  if (!isGenerating && !error && !ideasGenerated) {
    return null;
  }

  const currentStageIndex = currentStage ? stages.indexOf(currentStage) : -1;
  const progress = currentStage
    ? stageProgress[currentStage].max
    : error
    ? 0
    : 100;

  return (
    <Card className="mb-6 overflow-hidden">
      <CardContent className="p-4">
        {error ? (
          <div className="flex items-center gap-3 text-red-600">
            <XCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        ) : isGenerating ? (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Stages */}
            <div className="grid grid-cols-5 gap-2 text-xs">
              {stages.map((stage, index) => {
                const isActive = index === currentStageIndex;
                const isComplete = index < currentStageIndex;

                return (
                  <div
                    key={stage}
                    className={cn(
                      'flex flex-col items-center gap-1 text-center',
                      isActive && 'text-primary',
                      isComplete && 'text-green-600',
                      !isActive && !isComplete && 'text-muted-foreground'
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : isActive ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-current" />
                    )}
                    <span className="hidden sm:inline">
                      {stageLabels[stage].replace('...', '')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Current Stage Label */}
            {currentStage && (
              <p className="text-center text-sm text-muted-foreground">
                {stageLabels[currentStage]}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>
              Successfully generated {ideasGenerated} new{' '}
              {ideasGenerated === 1 ? 'idea' : 'ideas'}!
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
