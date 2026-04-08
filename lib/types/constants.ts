/**
 * Shared constants for validation and collection paths
 */

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

// ============================================
// DEFAULT WEIGHTS
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

// ============================================
// TRADEOFF FLAGS
// ============================================

/**
 * Auto-computed flags based on score patterns
 */
export type TradeoffFlag =
  | 'high-risk-high-reward'  // businessPotential >= 4 AND riskLevel <= 2
  | 'hidden-gem'             // businessPotential >= 4 AND competitionLevel >= 4
  | 'grind-play'             // businessPotential >= 3 AND developmentComplexity <= 2
  | 'quick-win'              // timeToMarket >= 4 AND capitalEfficiency >= 4
  | 'moonshot';              // businessPotential = 5 AND (developmentComplexity <= 2 OR riskLevel <= 2)

export const TRADEOFF_FLAG_LABELS: Record<TradeoffFlag, string> = {
  'high-risk-high-reward': 'High Risk / High Reward',
  'hidden-gem': 'Hidden Gem',
  'grind-play': 'Grind Play',
  'quick-win': 'Quick Win',
  'moonshot': 'Moonshot',
};
