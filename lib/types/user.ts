/**
 * User-related type definitions for Spark
 */

import type { DataSource } from './generation';

// ============================================
// ENUMS
// ============================================

/**
 * Selected weight preset for scoring
 */
export type WeightPreset =
  | 'default'        // Balanced weights
  | 'conservative'   // Higher weight on Risk, Competition
  | 'aggressive'     // Higher weight on Business Potential, Growth
  | 'solo-founder'   // Higher weight on Complexity, Time to Market
  | 'custom';        // User-defined weights

// ============================================
// USER DOCUMENT
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
  createdAt: Date;
  lastLoginAt: Date;
  onboardingComplete: boolean;
  schemaVersion?: number;

  // Generation Settings
  autoGenerationEnabled: boolean;
  generationSources: DataSource[];
  ideasPerRun: number; // 5-25, default 10
  preferredCategories: string[] | null; // Max 5

  // Generation State
  lastGenerationRun: Date | null;
  generationRunCount: number;
}

// ============================================
// USER SETTINGS DOCUMENT
// ============================================

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
// INPUT TYPES
// ============================================

/**
 * Input type for updating user generation settings
 */
export interface UpdateGenerationSettingsInput {
  autoGenerationEnabled?: boolean;
  generationSources?: DataSource[];
  ideasPerRun?: number;
  preferredCategories?: string[] | null;
}
