/**
 * Idea Forge Pipeline Types
 * Core type definitions for the AI-powered idea generation pipeline
 */

// ============================================
// ENUMS
// ============================================

export type IdeaStatus = 'new' | 'reviewing' | 'pursuing' | 'parked' | 'rejected';
export type IdeaCategory = 'games' | 'tools' | 'saas' | 'platforms' | 'mobile' | 'content' | 'services' | 'hardware' | 'other';
export type IdeaSource = 'manual' | 'ai-generated' | 'trend-suggested' | 'imported' | 'friction-derived';
export type DecisionTier = 'hot' | 'warm' | 'park' | 'discard';
export type ScoringMethod = 'manual' | 'ai-auto' | 'ai-assisted';
export type GenerationSource = 'x' | 'polymarket' | 'googlenews' | 'appstore';
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

// ============================================
// APP STORE DATA TYPES
// ============================================

export type FrictionCategory =
  | 'input'
  | 'navigation'
  | 'cognitive'
  | 'repetitive'
  | 'waiting'
  | 'decision'
  | 'accuracy'
  | 'paywall'
  | 'reliability'
  | 'other';

export type FrictionPriority = 'P0' | 'P1' | 'P2' | 'P3';

export type AISolutionType =
  | 'prediction'
  | 'recognition'
  | 'generation'
  | 'automation'
  | 'nlp'
  | 'analysis'
  | 'coaching'
  | 'integration';

export type AIApproach =
  | 'multimodal-vision'
  | 'nlp-extraction'
  | 'voice-to-action'
  | 'predictive-learning'
  | 'contextual-inference'
  | 'continuous-learning'
  | 'autonomous-agent'
  | 'proactive-notification';

export interface CompetitorApp {
  name: string;
  appId: string;
  platform: 'ios' | 'android';
  category: string;
  downloads: string;
  rating: number;
  reviewCount: number;
  negativeReviewRate: number;
}

export interface FrictionPoint {
  id: string;
  appId: string;
  appName: string;
  category: FrictionCategory;
  description: string;
  scores: {
    frequency: number; // 1-5
    severity: number; // 1-5
    automationFeasibility: number; // 1-5
    competitiveDifferentiation: number; // 1-5
  };
  compositeScore: number; // 0-100
  priority: FrictionPriority;
  evidence: {
    reviewCount: number;
    userQuotes: string[];
    platforms: ('ios' | 'android')[];
    ratingCorrelation: number;
  };
  aiAnalysis: {
    addressability: 'high' | 'medium' | 'low';
    solutionTypes: AISolutionType[];
    suggestedApproach: string;
  };
  metadata: {
    createdAt: Date;
    analysisVersion: string;
    sourceRunId: string;
  };
}

export interface NicheProfile {
  name: string;
  category: string;
  marketSize: string;
  topApps: CompetitorApp[];
  avgRating: number;
  negativeReviewRate: number;
  aiDisruptionScore: number; // 0-100
  competitorWeaknesses: string[];
}

export interface FrictionOpportunity {
  title: string;
  description: string;
  category: string;
  currentProblem: string;
  aiSolution: string;
  affectedApps: string[];
  userQuotes: string[];
  marketSize: number; // 1-5
  frictionSeverity: number; // 1-5
  aiSolvability: number; // 1-5
  opportunityScore: number; // 1.0-5.0
}

export interface AppStoreData {
  source: 'appstore';
  niches: NicheProfile[];
  frictionPoints: FrictionPoint[];
  opportunities: FrictionOpportunity[];
  metadata: {
    appsAnalyzed: number;
    reviewsProcessed: number;
    categoriesAnalyzed: string[];
  };
  fetchedAt: Date;
}

// ============================================
// AI-NATIVE IDEA TYPES
// ============================================

export interface FrictionSource {
  clusterId: string;
  clusterTheme: string;
  frictionPointIds: string[];
  competitorsDisrupted: string[];
  combinedFrictionScore: number;
  isIndustryWide: boolean;
}

export interface AIApproachDetails {
  primary: AIApproach;
  secondary: AIApproach[];
  automationLevel: 2 | 3;
  effortReduction: number; // percentage
  description: string;
}

export interface USPDetails {
  statement: string;
  transformation: {
    before: string;
    after: string;
  };
  quantifiedClaim: string;
  primaryCompetitor: string;
}

export interface TechnicalOverview {
  coreAPIs: string[];
  onDeviceComponents: string[];
  infrastructure: string[];
  estimatedCostPerUser: string;
  mvpComplexity: 'low' | 'medium' | 'high';
  mvpTimeline: string;
  technicalRisks: string[];
}

/**
 * Source metadata for displaying analysis details in UI
 */
export interface SourceMetadata {
  // Apps that were analyzed to generate this idea
  appsAnalyzed: Array<{
    name: string;
    platform: 'ios' | 'android';
    rating: number;
    reviewCount: number;
    downloads: string;
    category: string;
  }>;
  // Sample user quotes from reviews that informed this idea
  sampleReviews: Array<{
    appName: string;
    quote: string;
    rating: number;
  }>;
  // Categories that were analyzed
  categoriesAnalyzed: string[];
  // Total metrics
  totalReviewsAnalyzed: number;
  analysisDate: string;
}

export interface AINativeIdea extends ScoredIdea {
  // Override source type
  source: 'friction-derived';

  // Display label for UI ribbon
  displayLabel: string;
  labelColor: string;
  labelIcon: string;

  // Friction source details
  frictionSource: FrictionSource;

  // AI approach used
  aiApproach: AIApproachDetails;

  // Unique selling proposition
  usp: USPDetails;

  // Technical implementation details
  technicalOverview: TechnicalOverview;

  // Source metadata for UI display
  sourceMetadata?: SourceMetadata;
}

// ============================================
// APP STORE NICHE DISCOVERY TYPES
// ============================================

export interface NicheDiscoveryConfig {
  maxNiches: number;
  ideasPerNiche: number;
  focusCategories?: string[];
  minNegativeReviewRate: number;
  minMarketSize: string;
}

export interface NicheDiscoveryResult {
  success: boolean;
  runId: string;
  nichesAnalyzed: string[];
  ideasGenerated: number;
  ideasSaved: number;
  avgAIDisruptionScore: number;
  duration: number;
  errors: string[];
}

export type SourceData = XTrendData | PolymarketData | GoogleNewsData | AppStoreData;

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

// ============================================
// SSE PROGRESS STREAMING TYPES
// ============================================

export type ProgressStage = 'collecting' | 'analyzing' | 'generating' | 'scoring' | 'saving';

// Stage-specific data types
export interface CollectingProgressData {
  categoriesTotal: number;
  categoriesCompleted: number;
  currentCategory: string;
  appsFound: number;
  reviewsFound: number;
}

export interface AnalyzingProgressData {
  appsTotal: number;
  appsCompleted: number;
  currentApp: string;
  frictionPointsFound: number;
}

export interface GeneratingProgressData {
  clustersTotal: number;
  ideasGenerated: number;
  currentCluster: string;
}

export interface ScoringProgressData {
  ideasTotal: number;
  ideasScored: number;
}

export interface SavingProgressData {
  ideasTotal: number;
  ideasSaved: number;
}

export type StageProgressData =
  | CollectingProgressData
  | AnalyzingProgressData
  | GeneratingProgressData
  | ScoringProgressData
  | SavingProgressData;

// SSE Event Types
export interface ProgressEvent {
  type: 'progress';
  stage: ProgressStage;
  progress: number; // 0-100
  data: StageProgressData;
  timestamp: string;
}

export interface CompleteEvent {
  type: 'complete';
  runId: string;
  ideasGenerated: number;
  ideasSaved: number;
  duration: number;
}

export interface ErrorEvent {
  type: 'error';
  stage: string;
  message: string;
  recoverable: boolean;
}

export type SSEEvent = ProgressEvent | CompleteEvent | ErrorEvent;

// Progress callback type for pipeline stages
export type ProgressCallback = (event: SSEEvent) => void;
