/**
 * Firestore Type Definitions for Idea Forge
 *
 * This file contains all TypeScript interfaces for Firestore documents.
 * Based on the schema defined in docs/technical/firestore-schema.md
 */

import { Timestamp } from 'firebase/firestore';

// ============================================
// ENUMS
// ============================================

/**
 * Workflow status for ideas
 * - new: Just created, not yet evaluated
 * - reviewing: Under active evaluation
 * - pursuing: Decided to pursue this idea
 * - parked: Saved for later consideration
 * - rejected: Not pursuing (soft-delete equivalent)
 */
export type IdeaStatus = 'new' | 'reviewing' | 'pursuing' | 'parked' | 'rejected';

/**
 * Business category for ideas
 */
export type IdeaCategory =
  | 'games'      // Gaming applications
  | 'tools'      // Developer/productivity tools
  | 'saas'       // Software as a Service
  | 'platforms'  // Platform/marketplace businesses
  | 'mobile'     // Mobile-first applications
  | 'content'    // Content/media businesses
  | 'services'   // Service-based businesses
  | 'hardware'   // Hardware products
  | 'other';     // Uncategorized

/**
 * How the idea was created
 * - manual: User entered manually
 * - ai-generated: Generated via AI pipeline
 * - trend-suggested: Auto-suggested from trends
 * - imported: Imported from external source
 */
export type IdeaSource = 'manual' | 'ai-generated' | 'trend-suggested' | 'imported';

/**
 * Decision tier based on composite score
 * - hot: 4.0 - 5.0: Pursue immediately
 * - warm: 3.0 - 3.9: Worth exploring
 * - park: 2.0 - 2.9: Save for later
 * - discard: 1.0 - 1.9: Not viable
 */
export type DecisionTier = 'hot' | 'warm' | 'park' | 'discard';

/**
 * How scores were set
 * - manual: User entered scores manually
 * - ai-auto: AI scored automatically
 * - ai-assisted: AI suggested, user confirmed/adjusted
 */
export type ScoringMethod = 'manual' | 'ai-auto' | 'ai-assisted';

/**
 * Selected weight preset for scoring
 */
export type WeightPreset =
  | 'default'        // Balanced weights
  | 'conservative'   // Higher weight on Risk, Competition
  | 'aggressive'     // Higher weight on Business Potential, Growth
  | 'solo-founder'   // Higher weight on Complexity, Time to Market
  | 'custom';        // User-defined weights

/**
 * Auto-computed flags based on score patterns
 */
export type TradeoffFlag =
  | 'high-risk-high-reward'  // businessPotential >= 4 AND riskLevel <= 2
  | 'hidden-gem'             // businessPotential >= 4 AND competitionLevel >= 4
  | 'grind-play'             // businessPotential >= 3 AND developmentComplexity <= 2
  | 'quick-win'              // timeToMarket >= 4 AND capitalEfficiency >= 4
  | 'moonshot';              // businessPotential = 5 AND (developmentComplexity <= 2 OR riskLevel <= 2)

/**
 * Data sources for idea generation
 */
export type GenerationSource = 'x' | 'polymarket' | 'googlenews';

/**
 * How the generation run was triggered
 */
export type GenerationTrigger = 'manual' | 'scheduled';

// ============================================
// DOCUMENT INTERFACES
// ============================================

/**
 * User Document
 * Path: /users/{userId}
 *
 * The user document is automatically created on first authentication.
 * It stores profile data and generation settings.
 */
export interface User {
  // Profile Fields
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  onboardingComplete: boolean;
  schemaVersion?: number;

  // Generation Settings
  autoGenerationEnabled: boolean;
  generationSources: GenerationSource[];
  ideasPerRun: number; // 5-25, default 10
  preferredCategories: string[] | null; // Max 5

  // Generation State
  lastGenerationRun: Timestamp | null;
  generationRunCount: number;
}

/**
 * Business Plan structure for AI-generated ideas
 */
export interface BusinessPlan {
  targetMarket: string;        // Max 500 chars
  monetization: string;        // Max 500 chars
  goToMarket: string;          // Max 500 chars
  competitiveAdvantage: string; // Max 500 chars
}

/**
 * Idea Document
 * Path: /users/{userId}/ideas/{ideaId}
 *
 * The idea document stores all idea data including scoring parameters.
 * This is the primary entity in the system.
 */
export interface Idea {
  id: string;

  // Basic fields
  name: string;           // 1-100 chars
  brief: string;          // 1-500 chars
  category: IdeaCategory;
  status: IdeaStatus;
  source: IdeaSource;
  tags: string[];         // Max 10 tags, each 1-30 chars

  // Core scoring (required, 1-5)
  businessPotential: number;
  developmentComplexity: number;
  timeToMarket: number;
  competitionLevel: number;
  riskLevel: number;

  // Optional scoring (v1.1+, 1-5 or null)
  trendAlignment: number | null;
  founderMarketFit: number | null;
  growthPotential: number | null;
  defensibility: number | null;
  capitalEfficiency: number | null;

  // Computed scores
  compositeScore: number;     // 1.0-5.0, 2 decimal places
  tier: DecisionTier;
  tradeoffFlags: TradeoffFlag[];

  // Pipeline source tracking (AI-generated ideas)
  sourceSignals: string[] | null;    // Max 10 items, each max 200 chars
  generationRunId: string | null;

  // AI content (optional for manual ideas)
  elevatorPitch: string | null;      // Max 500 chars
  strengths: string[];               // Max 5 items, each max 200 chars
  risks: string[];                   // Max 5 items, each max 200 chars
  businessPlan: BusinessPlan | null;

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  scoredAt: Timestamp | null;
  scoringMethod: ScoringMethod;
  noteCount: number;
  schemaVersion?: number;

  // Freshness tracking
  viewedAt: Timestamp | null;
}

/**
 * Note Document
 * Path: /users/{userId}/ideas/{ideaId}/notes/{noteId}
 *
 * Notes are stored as a subcollection under each idea for efficient pagination.
 */
export interface Note {
  id: string;
  content: string;         // 1-2000 chars
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Stage details for generation run debugging
 */
export interface StageDetails {
  collecting?: { duration: number; success: boolean };
  analyzing?: { duration: number; signalsFound: number };
  generating?: { duration: number; ideasGenerated: number };
  scoring?: { duration: number };
  saving?: { duration: number; ideasSaved: number };
}

/**
 * Generation Run Document
 * Path: /users/{userId}/generationRuns/{runId}
 *
 * Generation runs track each automated idea generation pipeline execution.
 * This collection is write-only from Cloud Functions - the client can read but never write.
 */
export interface GenerationRun {
  runId: string;
  timestamp: Timestamp;

  // Results
  ideasGenerated: number;
  ideasSaved: number;
  success: boolean;

  // Configuration
  sources: GenerationSource[];
  ideasPerRun: number;
  categories: string[] | null;

  // Metadata
  trigger: GenerationTrigger;
  duration: number;          // milliseconds
  errors: string[];

  // Stage details (optional - for debugging)
  stages?: StageDetails;
}

/**
 * Custom weights for scoring calculation
 * All weights are decimals that must sum to 1.0
 */
export interface CustomWeights {
  // Core (required, must sum to at least 0.8)
  businessPotential: number;      // Default: 0.20
  developmentComplexity: number;  // Default: 0.15
  timeToMarket: number;           // Default: 0.15
  competitionLevel: number;       // Default: 0.15
  riskLevel: number;              // Default: 0.15

  // Optional (if used, remaining weight distributed here)
  trendAlignment?: number;        // Default: 0.05
  founderMarketFit?: number;      // Default: 0.05
  growthPotential?: number;       // Default: 0.05
  defensibility?: number;         // Default: 0.03
  capitalEfficiency?: number;     // Default: 0.02
}

/**
 * User Settings Document
 * Path: /users/{userId}/settings/preferences
 *
 * User preferences for scoring weights and display options.
 */
export interface UserSettings {
  weightPreset: WeightPreset;
  customWeights: CustomWeights | null;
  defaultSort: string;           // Default: 'score-desc'
  defaultView: string;           // Default: 'grid'
  showArchivedIdeas: boolean;    // Default: false
}

// ============================================
// INPUT TYPES (for forms)
// ============================================

/**
 * Input type for creating a new idea
 */
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

/**
 * Input type for updating an existing idea
 */
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

/**
 * Input type for creating a new note
 */
export interface CreateNoteInput {
  content: string;
}

/**
 * Input type for updating user generation settings
 */
export interface UpdateGenerationSettingsInput {
  autoGenerationEnabled?: boolean;
  generationSources?: GenerationSource[];
  ideasPerRun?: number;
  preferredCategories?: string[] | null;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Default weights for MVP (5 core parameters, equal weight)
 */
export const DEFAULT_CORE_WEIGHTS: Record<string, number> = {
  businessPotential: 0.20,
  developmentComplexity: 0.20,
  timeToMarket: 0.20,
  competitionLevel: 0.20,
  riskLevel: 0.20,
};

/**
 * Full weights for v1.1+ (all 10 parameters)
 */
export const DEFAULT_FULL_WEIGHTS: Record<string, number> = {
  businessPotential: 0.20,
  developmentComplexity: 0.15,
  timeToMarket: 0.15,
  competitionLevel: 0.15,
  riskLevel: 0.15,
  trendAlignment: 0.05,
  founderMarketFit: 0.05,
  growthPotential: 0.05,
  defensibility: 0.03,
  capitalEfficiency: 0.02,
};

/**
 * Calculate composite score from idea scores
 * MVP calculation uses only 5 core parameters with equal weights
 */
export function calculateCompositeScore(idea: Pick<Idea,
  'businessPotential' | 'developmentComplexity' | 'timeToMarket' |
  'competitionLevel' | 'riskLevel'>
): number {
  const coreWeight = 0.20;

  const score = (
    idea.businessPotential * coreWeight +
    idea.developmentComplexity * coreWeight +
    idea.timeToMarket * coreWeight +
    idea.competitionLevel * coreWeight +
    idea.riskLevel * coreWeight
  );

  // Round to 2 decimal places
  return Math.round(score * 100) / 100;
}

/**
 * Assign decision tier based on composite score
 */
export function assignTier(compositeScore: number): DecisionTier {
  if (compositeScore >= 4.0) return 'hot';
  if (compositeScore >= 3.0) return 'warm';
  if (compositeScore >= 2.0) return 'park';
  return 'discard';
}

/**
 * Compute trade-off flags based on score patterns
 */
export function computeTradeoffFlags(idea: Idea): TradeoffFlag[] {
  const flags: TradeoffFlag[] = [];

  // high-risk-high-reward: businessPotential >= 4 AND riskLevel <= 2
  if (idea.businessPotential >= 4 && idea.riskLevel <= 2) {
    flags.push('high-risk-high-reward');
  }

  // hidden-gem: businessPotential >= 4 AND competitionLevel >= 4
  if (idea.businessPotential >= 4 && idea.competitionLevel >= 4) {
    flags.push('hidden-gem');
  }

  // grind-play: businessPotential >= 3 AND developmentComplexity <= 2
  if (idea.businessPotential >= 3 && idea.developmentComplexity <= 2) {
    flags.push('grind-play');
  }

  // quick-win: timeToMarket >= 4 AND capitalEfficiency >= 4
  if (idea.timeToMarket >= 4 && (idea.capitalEfficiency ?? 0) >= 4) {
    flags.push('quick-win');
  }

  // moonshot: businessPotential = 5 AND (developmentComplexity <= 2 OR riskLevel <= 2)
  if (idea.businessPotential === 5 && (idea.developmentComplexity <= 2 || idea.riskLevel <= 2)) {
    flags.push('moonshot');
  }

  return flags;
}

// ============================================
// VALIDATION CONSTANTS
// ============================================

export const VALIDATION = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
  BRIEF_MIN_LENGTH: 1,
  BRIEF_MAX_LENGTH: 500,
  NOTE_MIN_LENGTH: 1,
  NOTE_MAX_LENGTH: 2000,
  TAG_MIN_LENGTH: 1,
  TAG_MAX_LENGTH: 30,
  MAX_TAGS: 10,
  SCORE_MIN: 1,
  SCORE_MAX: 5,
  IDEAS_PER_RUN_MIN: 5,
  IDEAS_PER_RUN_MAX: 25,
  IDEAS_PER_RUN_DEFAULT: 10,
  MAX_SOURCE_SIGNALS: 10,
  MAX_STRENGTHS: 5,
  MAX_RISKS: 5,
  ELEVATOR_PITCH_MAX_LENGTH: 500,
  BUSINESS_PLAN_FIELD_MAX_LENGTH: 500,
} as const;

// ============================================
// COLLECTION PATHS
// ============================================

export const COLLECTIONS = {
  USERS: 'users',
  IDEAS: 'ideas',
  NOTES: 'notes',
  GENERATION_RUNS: 'generationRuns',
  SETTINGS: 'settings',
} as const;

export const SETTINGS_DOC_ID = 'preferences';
