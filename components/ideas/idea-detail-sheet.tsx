'use client';

import { Pencil, Trash2, ChevronLeft, ChevronRight, X, Store, Star, MessageSquareQuote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadge } from './score-badge';
import { StatusDropdown } from './status-dropdown';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ideaKeys } from '@/lib/queries/query-keys';
import { fetchIdea, markIdeaViewed, updateIdea } from '@/lib/firebase/firestore';
import { useAuth } from '@/providers/auth-provider';
import { useSelectedIdea } from '@/providers/selected-idea-provider';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { IdeaStatus } from '@/lib/types/idea';

function ScoreItem({ label, value }: { label: string; value: number }) {
  const getColor = (v: number) => {
    if (v >= 4) return 'bg-green-100 text-green-800';
    if (v >= 3) return 'bg-yellow-100 text-yellow-800';
    if (v >= 2) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium px-2 py-0.5 rounded ${getColor(value)}`}>
        {value}/5
      </span>
    </div>
  );
}

export function IdeaDetailSheet() {
  const { user } = useAuth();
  const {
    selectedIdeaId,
    clearSelection,
    goToNext,
    goToPrevious,
    hasNext,
    hasPrevious,
    currentIndex,
    totalCount,
  } = useSelectedIdea();
  const queryClient = useQueryClient();
  const hasAutoSwitchedToReviewing = useRef(false);

  const { data: idea, isLoading, error } = useQuery({
    queryKey: ideaKeys.detail(selectedIdeaId || ''),
    queryFn: () => (user && selectedIdeaId ? fetchIdea(user.uid, selectedIdeaId) : null),
    enabled: !!user && !!selectedIdeaId,
  });

  // Mark as viewed and auto-switch "new" to "reviewing" when opened
  useEffect(() => {
    if (user && selectedIdeaId && idea) {
      // Mark as viewed
      if (!idea.viewedAt) {
        markIdeaViewed(user.uid, selectedIdeaId);
      }

      // Auto-switch "new" ideas to "reviewing" (only once per sheet open)
      if (idea.status === 'new' && !hasAutoSwitchedToReviewing.current) {
        hasAutoSwitchedToReviewing.current = true;
        updateIdea(user.uid, selectedIdeaId, { status: 'reviewing' })
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ideaKeys.detail(selectedIdeaId) });
            queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ideaKeys.counts() });
          })
          .catch(console.error);
      }
    }
  }, [user, selectedIdeaId, idea, queryClient]);

  // Reset the auto-switch flag when sheet closes
  useEffect(() => {
    if (!selectedIdeaId) {
      hasAutoSwitchedToReviewing.current = false;
    }
  }, [selectedIdeaId]);

  const handleStatusChange = async (newStatus: IdeaStatus) => {
    if (!user || !selectedIdeaId) return;

    try {
      await updateIdea(user.uid, selectedIdeaId, { status: newStatus });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ideaKeys.detail(selectedIdeaId) });
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ideaKeys.counts() });
      toast.success(`Status changed to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  if (!selectedIdeaId) {
    return null;
  }

  return (
    <Sheet open={!!selectedIdeaId} onOpenChange={(open) => !open && clearSelection()}>
      <SheetContent
        className="data-[state=open]:slide-in-from-bottom sm:data-[state=open]:slide-in-from-right w-[95vw] sm:w-full max-w-2xl h-[85vh] sm:h-full overflow-hidden flex flex-col fixed inset-x-0 bottom-0 sm:bottom-auto sm:inset-x-auto sm:top-0 sm:right-0 sm:inset-y-0 mx-auto sm:mx-0 rounded-t-xl sm:rounded-none"
        showCloseButton={false}
      >
        {/* Navigation Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <Button variant="ghost" size="icon" onClick={clearSelection}>
            <X className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {currentIndex >= 0 ? `${currentIndex + 1} / ${totalCount}` : ''}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                disabled={!hasPrevious}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                disabled={!hasNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
        {isLoading ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            Failed to load idea details
          </div>
        ) : !idea ? (
          <div className="p-4 text-center text-muted-foreground">
            Idea not found
          </div>
        ) : (
          <>
            <SheetHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <SheetTitle className="text-2xl sm:text-3xl font-bold">
                    {idea.name}
                  </SheetTitle>
                  <SheetDescription className="mt-2 text-base">
                    {idea.brief}
                  </SheetDescription>
                </div>
                <ScoreBadge score={idea.compositeScore} tier={idea.tier} size="lg" />
              </div>
            </SheetHeader>

            <div className="mt-8 space-y-8">
              <div className="flex items-center gap-4">
                <StatusDropdown
                  status={idea.status}
                  onChange={handleStatusChange}
                />
                <div className="flex gap-2 ml-auto">
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Scores</h3>
                <div className="grid grid-cols-2 gap-4">
                  <ScoreItem label="Business Potential" value={idea.businessPotential} />
                  <ScoreItem label="Development" value={idea.developmentComplexity} />
                  <ScoreItem label="Time to Market" value={idea.timeToMarket} />
                  <ScoreItem label="Competition" value={idea.competitionLevel} />
                  <ScoreItem label="Risk Level" value={idea.riskLevel} />
                </div>
              </div>

              {idea.source === 'ai-generated' && (
                <>
                  {idea.elevatorPitch && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Elevator Pitch</h3>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {idea.elevatorPitch}
                      </p>
                    </div>
                  )}

                  {idea.strengths.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Strengths</h3>
                      <ul className="text-base text-muted-foreground space-y-2">
                        {idea.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-green-500 text-lg">+</span>
                            <span className="leading-relaxed">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {idea.risks.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Risks</h3>
                      <ul className="text-base text-muted-foreground space-y-2">
                        {idea.risks.map((r, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-red-500 text-lg">-</span>
                            <span className="leading-relaxed">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {idea.businessPlan && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Business Plan</h3>
                      <div className="text-base text-muted-foreground space-y-3">
                        <p className="leading-relaxed"><span className="font-medium text-foreground">Target Market:</span> {idea.businessPlan.targetMarket}</p>
                        <p className="leading-relaxed"><span className="font-medium text-foreground">Monetization:</span> {idea.businessPlan.monetization}</p>
                        <p className="leading-relaxed"><span className="font-medium text-foreground">Go-to-Market:</span> {idea.businessPlan.goToMarket}</p>
                        <p className="leading-relaxed"><span className="font-medium text-foreground">Competitive Advantage:</span> {idea.businessPlan.competitiveAdvantage}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Source Metadata - App Store Analysis Details */}
              {idea.sourceMetadata && (
                <div className="space-y-6 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Store className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">App Store Analysis</h3>
                  </div>

                  {/* Apps Analyzed */}
                  {idea.sourceMetadata.appsAnalyzed.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200">
                        Apps Analyzed ({idea.sourceMetadata.appsAnalyzed.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {idea.sourceMetadata.appsAnalyzed.slice(0, 6).map((app, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded-md text-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                                {app.platform === 'ios' ? '🍎' : '🤖'}
                              </span>
                              <span className="truncate font-medium">{app.name}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-muted-foreground">{app.rating.toFixed(1)}</span>
                              <span className="text-xs text-muted-foreground">({app.downloads})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {idea.sourceMetadata.appsAnalyzed.length > 6 && (
                        <p className="text-xs text-muted-foreground">
                          +{idea.sourceMetadata.appsAnalyzed.length - 6} more apps
                        </p>
                      )}
                    </div>
                  )}

                  {/* User Feedback Quotes */}
                  {idea.sourceMetadata.sampleReviews.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MessageSquareQuote className="h-4 w-4 text-purple-600" />
                        <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200">
                          User Feedback
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {idea.sourceMetadata.sampleReviews.slice(0, 4).map((review, i) => (
                          <div key={i} className="p-3 bg-white dark:bg-gray-900 rounded-md text-sm">
                            <p className="text-muted-foreground italic leading-relaxed">
                              &ldquo;{review.quote}&rdquo;
                            </p>
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                              — {review.appName} user
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Analysis Metrics */}
                  <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground border-t border-purple-200 dark:border-purple-800">
                    <span>📊 {idea.sourceMetadata.totalReviewsAnalyzed.toLocaleString()} reviews analyzed</span>
                    <span>📁 Categories: {idea.sourceMetadata.categoriesAnalyzed.join(', ')}</span>
                    <span>📅 {new Date(idea.sourceMetadata.analysisDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {idea.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 text-sm bg-muted rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {idea.sourceSignals && idea.sourceSignals.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Market Signals</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {idea.sourceSignals.map((signal, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        {signal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
                <p>Created: {idea.createdAt.toLocaleDateString()}</p>
                <p>Updated: {idea.updatedAt.toLocaleDateString()}</p>
                <p>Source: {idea.source}</p>
                {idea.noteCount > 0 && <p>Notes: {idea.noteCount}</p>}
              </div>
            </div>
          </>
        )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
