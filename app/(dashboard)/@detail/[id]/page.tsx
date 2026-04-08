'use client';

import { useParams, useRouter } from 'next/navigation';
import { X, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadge } from '@/components/ideas/score-badge';
import { StatusDropdown } from '@/components/ideas/status-dropdown';
import { useQuery } from '@tanstack/react-query';
import { ideaKeys } from '@/lib/queries/query-keys';
import { fetchIdea, markIdeaViewed } from '@/lib/firebase/firestore';
import { useAuth } from '@/providers/auth-provider';
import { useEffect } from 'react';
import type { Idea } from '@/lib/types/idea';

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const ideaId = params.id as string;

  const { data: idea, isLoading, error } = useQuery({
    queryKey: ideaKeys.detail(ideaId),
    queryFn: () => (user ? fetchIdea(user.uid, ideaId) : null),
    enabled: !!user && !!ideaId,
  });

  // Mark as viewed when opened
  useEffect(() => {
    if (user && ideaId && idea && !idea.viewedAt) {
      markIdeaViewed(user.uid, ideaId);
    }
  }, [user, ideaId, idea]);

  const handleClose = () => {
    router.back();
  };

  const handleStatusChange = (newStatus: string) => {
    // Will implement with mutation
    console.log('Status changed to:', newStatus);
  };

  return (
    <Sheet open onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
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
                  <SheetTitle className="text-xl font-semibold">
                    {idea.name}
                  </SheetTitle>
                  <SheetDescription className="mt-1">
                    {idea.brief}
                  </SheetDescription>
                </div>
                <ScoreBadge score={idea.compositeScore} tier={idea.tier} size="lg" />
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Status & Actions */}
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

              {/* Scores */}
              <div className="space-y-3">
                <h3 className="font-medium">Scores</h3>
                <div className="grid grid-cols-2 gap-3">
                  <ScoreItem label="Business Potential" value={idea.businessPotential} />
                  <ScoreItem label="Development" value={idea.developmentComplexity} />
                  <ScoreItem label="Time to Market" value={idea.timeToMarket} />
                  <ScoreItem label="Competition" value={idea.competitionLevel} />
                  <ScoreItem label="Risk Level" value={idea.riskLevel} />
                </div>
              </div>

              {/* AI Content (if available) */}
              {idea.source === 'ai-generated' && (
                <>
                  {idea.elevatorPitch && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Elevator Pitch</h3>
                      <p className="text-sm text-muted-foreground">
                        {idea.elevatorPitch}
                      </p>
                    </div>
                  )}

                  {idea.strengths.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Strengths</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {idea.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-500">+</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {idea.risks.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Risks</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {idea.risks.map((r, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-red-500">-</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {idea.businessPlan && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Business Plan</h3>
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>
                          <span className="font-medium text-foreground">Target Market:</span>{' '}
                          {idea.businessPlan.targetMarket}
                        </p>
                        <p>
                          <span className="font-medium text-foreground">Monetization:</span>{' '}
                          {idea.businessPlan.monetization}
                        </p>
                        <p>
                          <span className="font-medium text-foreground">Go-to-Market:</span>{' '}
                          {idea.businessPlan.goToMarket}
                        </p>
                        <p>
                          <span className="font-medium text-foreground">Competitive Advantage:</span>{' '}
                          {idea.businessPlan.competitiveAdvantage}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Tags */}
              {idea.tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-muted rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Signals (for AI-generated) */}
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

              {/* Metadata */}
              <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
                <p>Created: {idea.createdAt.toLocaleDateString()}</p>
                <p>Updated: {idea.updatedAt.toLocaleDateString()}</p>
                <p>Source: {idea.source}</p>
                {idea.noteCount > 0 && <p>Notes: {idea.noteCount}</p>}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

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
