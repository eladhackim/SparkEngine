/**
 * Idea Forge Pipeline Types
 * Core type definitions for the AI-powered idea generation pipeline
 */

// ============================================
// ENUMS
// ============================================

export type IdeaStatus = 'new' | 'reviewing' | 'pursuing' | 'parked' | 'rejected';
export type IdeaCategory = 'games' | 'tools' | 'saas' | 'platforms' | 'mobile' | 'content' | 'services' | 'hardware' | 'other';
export type IdeaSource = 'manual' | 'ai-generated' | 'trend-suggested' | 'imported';
export type DecisionTier = 'hot' | 'warm' | 'park' | 'discard';
export type ScoringMethod = 'manual' | 'ai-auto' | 'ai-assisted';
export type GenerationSource = 'x' | 'polymarket' | 'googlenews';
export type GenerationTrigger = 'manual' | 'scheduled';

// ============================================
// GENERATION CONFIG
// ============================================

export interface GenerationConfig {
  userId: string;
  sources: GenerationSource[];
  ideasPerRun: number;
  categories?: string[];
}

export interface GenerationResult {
  success: boolean;
  ideasGenerated: number;
  ideasSaved: number;
  errors: string[];
  duration: number;
  runId: string;
}

// ============================================
// DATA SOURCE TYPES
// ============================================

export interface XTrendData {
  source: 'x';
  trends: {
    topic: string;
    volume: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    relatedTopics: string[];
  }[];
  painPoints: {
    description: string;
    frequency: number;
    examples: string[];
  }[];
  emergingDiscussions: {
    topic: string;
    growth: number;
    keyPhrases: string[];
  }[];
  fetchedAt: Date;
}

export interface PolymarketData {
  source: 'polymarket';
  markets: {
    question: string;
    probability: number;
    volume: number;
    category: string;
    endDate: Date;
  }[];
  highConfidenceSignals: {
    topic: string;
    probability: number;
    implication: string;
  }[];
  emergingMarkets: {
    question: string;
    volumeGrowth: number;
    category: string;
  }[];
  fetchedAt: Date;
}

export interface GoogleNewsData {
  source: 'googlenews';
  articles: {
    title: string;
    description: string;
    category: string;
    publishedAt: Date;
    source: string;
  }[];
  trendingTopics: string[];
  industrySignals: {
    industry: string;
    headlines: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
  }[];
  fetchedAt: Date;
}

export type SourceData = XTrendData | PolymarketData | GoogleNewsData;

// ============================================
// AI PROCESSING TYPES
// ============================================

export interface AnalyzedSignals {
  opportunities: {
    signal: string;
    sources: string[];
    confidence: number;
    category: string;
    urgency: 'immediate' | 'short-term' | 'long-term';
  }[];
  painPoints: {
    problem: string;
    audience: string;
    severity: number;
    sources: string[];
  }[];
  trendingThemes: string[];
}

export interface RawIdea {
  name: string;
  brief: string;
  category: IdeaCategory;
  tags: string[];
  sourceSignals: string[];
}

export interface GenerationOptions {
  count: number;
  categories?: string[];
}

export interface BusinessPlan {
  targetMarket: string;
  monetization: string;
  goToMarket: string;
  competitiveAdvantage: string;
}

export interface ScoredIdea extends RawIdea {
  // Core scores (1-5)
  businessPotential: number;
  developmentComplexity: number;
  timeToMarket: number;
  competitionLevel: number;
  riskLevel: number;

  // Computed
  compositeScore: number;
  tier: DecisionTier;

  // AI-generated content
  strengths: string[];
  risks: string[];
  businessPlan: BusinessPlan;
  elevatorPitch: string;
}

// ============================================
// FIRESTORE DOCUMENT TYPES
// ============================================

export interface IdeaDocument {
  // Basic info
  name: string;
  brief: string;
  category: IdeaCategory;
  status: IdeaStatus;
  source: IdeaSource;
  tags: string[];

  // Scores
  businessPotential: number;
  developmentComplexity: number;
  timeToMarket: number;
  competitionLevel: number;
  riskLevel: number;
  compositeScore: number;
  tier: DecisionTier;

  // AI content
  strengths: string[];
  risks: string[];
  businessPlan: BusinessPlan;
  elevatorPitch: string;

  // Metadata
  sourceSignals: string[];
  generationRunId: string;
  scoringMethod: ScoringMethod;
  createdAt: FirebaseFirestore.FieldValue;
  updatedAt: FirebaseFirestore.FieldValue;
  noteCount: number;
  viewedAt: FirebaseFirestore.FieldValue | null;
}

export interface GenerationRunDocument {
  runId: string;
  timestamp: FirebaseFirestore.FieldValue;
  ideasGenerated: number;
  ideasSaved: number;
  success: boolean;
  sources: GenerationSource[];
  ideasPerRun: number;
  categories: string[] | null;
  trigger: GenerationTrigger;
  duration: number;
  errors: string[];
  stages?: {
    collecting?: { duration: number; success: boolean };
    analyzing?: { duration: number; signalsFound: number };
    generating?: { duration: number; ideasGenerated: number };
    scoring?: { duration: number };
    saving?: { duration: number; ideasSaved: number };
  };
}
