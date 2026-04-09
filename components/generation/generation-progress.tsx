'use client';

import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import type { GenerationStage, StageProgressData } from '@/lib/types/generation';
import { stageLabels, stageProgress } from '@/lib/types/generation';
import {
  isCollectingData,
  isAnalyzingData,
  isGeneratingData,
  isSavingData,
} from '@/hooks/use-generation-stream';

interface GenerationProgressProps {
  isGenerating: boolean;
  currentStage?: GenerationStage;
  progress?: number; // Real progress from SSE (0-100)
  stageData?: StageProgressData; // Rich stage-specific data
  error?: string;
  ideasGenerated?: number;
}

const stages: GenerationStage[] = ['collecting', 'analyzing', 'generating', 'scoring', 'saving'];

function getStageDetails(stage: GenerationStage, data?: StageProgressData): string {
  if (!data) return stageLabels[stage];

  switch (stage) {
    case 'collecting':
      if (isCollectingData(data)) {
        const { appsFound, reviewsFound, currentCategory } = data;
        if (appsFound > 0 || reviewsFound > 0) {
          return `Found ${appsFound} apps, ${reviewsFound.toLocaleString()} reviews`;
        }
        return `Fetching: ${currentCategory}`;
      }
      break;

    case 'analyzing':
      if (isAnalyzingData(data)) {
        const { appsCompleted, appsTotal, frictionPointsFound, currentApp } = data;
        if (frictionPointsFound > 0) {
          return `Analyzed ${appsCompleted}/${appsTotal} apps, ${frictionPointsFound} friction points found`;
        }
        return `Analyzing: ${currentApp}`;
      }
      break;

    case 'generating':
      if (isGeneratingData(data)) {
        const { ideasGenerated, currentCluster } = data;
        if (ideasGenerated > 0) {
          return `Generated ${ideasGenerated} ideas`;
        }
        return `Generating from: ${currentCluster}`;
      }
      break;

    case 'scoring':
      return stageLabels[stage];

    case 'saving':
      if (isSavingData(data)) {
        const { ideasSaved, ideasTotal } = data;
        if (ideasSaved > 0) {
          return `Saved ${ideasSaved}/${ideasTotal} ideas`;
        }
      }
      return stageLabels[stage];
  }

  return stageLabels[stage];
}

export function GenerationProgress({
  isGenerating,
  currentStage,
  progress: realProgress,
  stageData,
  error,
  ideasGenerated,
}: GenerationProgressProps) {
  if (!isGenerating && !error && !ideasGenerated) {
    return null;
  }

  const currentStageIndex = currentStage ? stages.indexOf(currentStage) : -1;

  // Use real progress from SSE if available, otherwise fallback to stage-based estimate
  const progress = realProgress !== undefined
    ? realProgress
    : currentStage
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
            {/* Progress Bar with percentage */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
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

            {/* Current Stage Details - with rich data */}
            {currentStage && (
              <p className="text-center text-sm text-muted-foreground">
                {getStageDetails(currentStage, stageData)}
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
