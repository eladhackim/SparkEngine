// ============================================
// ENUMS & CONSTANTS
// ============================================

export type IdeaStatus = 'new' | 'reviewing' | 'pursuing' | 'parked' | 'rejected';
export type DecisionTier = 'hot' | 'warm' | 'park' | 'discard';
export type ScoringMethod = 'manual' | 'ai-auto' | 'ai-assisted';
export type IdeaSource = 'ai-generated' | 'trend-suggested' | 'manual' | 'imported';
export type IdeaCategory = 'games' | 'tools' | 'saas' | 'platforms' | 'mobile' | 'content' | 'services' | 'hardware' | 'other';

// ============================================
// BUSINESS PLAN
// ============================================

export interface BusinessPlan {
  targetMarket: string;
  monetization: string;
  goToMarket: string;
  competitiveAdvantage: string;
}

// ============================================
// IDEA ENTITY
// ============================================

export interface Idea {
  id: string;

  // Basic fields
  name: string;
  brief: string;
  category: IdeaCategory;
  status: IdeaStatus;
  source: IdeaSource;
  tags: string[];

  // Core scoring (required)
  businessPotential: number;
  developmentComplexity: number;
  timeToMarket: number;
  competitionLevel: number;
  riskLevel: number;

  // Optional scoring
  trendAlignment: number | null;
  founderMarketFit: number | null;
  growthPotential: number | null;
  defensibility: number | null;
  capitalEfficiency: number | null;

  // Computed
  compositeScore: number;
  tier: DecisionTier;
  tradeoffFlags: string[];

  // Pipeline source tracking (AI-generated ideas)
  sourceSignals: string[] | null;
  generationRunId: string | null;

  // AI content
  elevatorPitch: string | null;
  strengths: string[];
  risks: string[];
  businessPlan: BusinessPlan | null;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  scoredAt: Date | null;
  scoringMethod: ScoringMethod;
  noteCount: number;

  // Freshness tracking
  viewedAt: Date | null;
}

// ============================================
// NOTE ENTITY
// ============================================

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// INPUT TYPES
// ============================================

export interface CreateIdeaInput {
  name: string;
  brief: string;
  category: IdeaCategory;
  status?: IdeaStatus;
  tags?: string[];
  businessPotential: number;
  developmentComplexity: number;
  timeToMarket: number;
  competitionLevel: number;
  riskLevel: number;
}

export interface UpdateIdeaInput {
  name?: string;
  brief?: string;
  category?: IdeaCategory;
  status?: IdeaStatus;
  tags?: string[];
  businessPotential?: number;
  developmentComplexity?: number;
  timeToMarket?: number;
  competitionLevel?: number;
  riskLevel?: number;
}

// ============================================
// SCORE UTILITIES
// ============================================

export function getScoreTier(score: number): DecisionTier {
  if (score >= 4.0) return 'hot';
  if (score >= 3.0) return 'warm';
  if (score >= 2.0) return 'park';
  return 'discard';
}

export const tierColors: Record<DecisionTier, { bg: string; text: string; border: string }> = {
  hot: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
  warm: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
  park: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' },
  discard: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
};

export const statusLabels: Record<IdeaStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  pursuing: 'Pursuing',
  parked: 'Parked',
  rejected: 'Rejected',
};

export const sourceLabels: Record<IdeaSource, string> = {
  'ai-generated': 'AI Generated',
  'trend-suggested': 'Trend',
  manual: 'Manual',
  imported: 'Imported',
};
