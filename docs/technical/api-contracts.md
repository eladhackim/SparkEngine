# Idea Forge: API Contracts & Data Models Specification

**Status**: Technical Specification
**Version**: 2.1
**Date**: April 8, 2026
**Author**: Evelyn Jones (Tech Specs Worker)

---

## Executive Summary

This document defines the complete API contracts and data models for Idea Forge, an AI-powered idea management platform for solo founders. It covers TypeScript interfaces, data validation rules, state transitions, scoring algorithms, and API response formats.

**MVP Focus: Pipeline-First Architecture**
The primary value proposition is AI-powered idea generation. The system monitors multiple data sources (X/Twitter, Polymarket, Google News), identifies trends, and uses AI to generate scored business ideas automatically.

**Key Design Decisions:**
- **Pipeline-first architecture**: AI generation is the primary feature, not an add-on
- **Cloud Functions backend**: Generation pipeline runs on Firebase Cloud Functions
- **Multi-source analysis**: X (via Grok), Polymarket, Google News for trend detection
- **Auto-scoring**: AI generates and scores ideas in a single pipeline
- **Firestore-first data**: Direct client access with security rules
- **User-scoped data**: All data lives under `/users/{userId}/` path
- **Denormalized scores**: Composite score and tier stored on idea document for efficient queries

---

## 1. TypeScript Interfaces

### 1.1 Core Types

```typescript
// ============================================
// ENUMS & CONSTANTS
// ============================================

/**
 * Idea lifecycle status
 */
export type IdeaStatus = 'new' | 'reviewing' | 'pursuing' | 'parked' | 'rejected';

/**
 * Decision tier based on composite score
 */
export type DecisionTier = 'hot' | 'warm' | 'park' | 'discard';

/**
 * Score source indicator
 */
export type ScoreSource = 'manual' | 'ai' | 'ai_adjusted';

/**
 * AI confidence level for scores
 */
export type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * Data source for trend analysis
 */
export type DataSource = 'x' | 'polymarket' | 'googlenews' | 'appstore';

/**
 * Source of idea creation
 */
export type IdeaSource = 'ai-generated' | 'trend-suggested' | 'manual';

/**
 * Pipeline execution stage
 */
export type GenerationStage = 'collecting' | 'analyzing' | 'generating' | 'scoring' | 'saving';

// ============================================
// CORE ENTITIES
// ============================================

/**
 * Individual score for a parameter
 */
export interface ParameterScore {
  /** Score value (1-5, integers only) */
  value: number;
  /** Source of the score */
  source: ScoreSource;
  /** AI confidence level (only present if source is 'ai' or 'ai_adjusted') */
  confidence?: ConfidenceLevel;
  /** Optional reasoning for the score */
  reasoning?: string;
}

/**
 * Core scoring parameters (5 required)
 */
export interface CoreScores {
  /** Business Potential - Revenue opportunity, market size (1-5) */
  businessPotential: ParameterScore;
  /** Development Complexity - Technical effort required (1-5, higher = easier) */
  developmentComplexity: ParameterScore;
  /** Time to Market - Speed to launch (1-5, higher = faster) */
  timeToMarket: ParameterScore;
  /** Competition Level - Market saturation (1-5, higher = less competition) */
  competitionLevel: ParameterScore;
  /** Risk Level - Overall risk profile (1-5, higher = lower risk) */
  riskLevel: ParameterScore;
}

/**
 * Optional scoring parameters (5 additional)
 * All fields optional - used in v1.1+
 */
export interface OptionalScores {
  /** Trend Alignment - Market timing (1-5) */
  trendAlignment?: ParameterScore;
  /** Founder-Market Fit - Skill match (1-5) */
  founderMarketFit?: ParameterScore;
  /** Growth Potential - Organic growth capability (1-5) */
  growthPotential?: ParameterScore;
  /** Defensibility - Moat potential (1-5) */
  defensibility?: ParameterScore;
  /** Capital Efficiency - Funding requirements (1-5, higher = more efficient) */
  capitalEfficiency?: ParameterScore;
}

/**
 * Complete idea entity
 * Firestore path: /users/{userId}/ideas/{ideaId}
 */
export interface Idea {
  /** Auto-generated Firestore document ID */
  id: string;

  // --- Basic Info ---
  /** Idea name/title */
  name: string;
  /** Brief description */
  brief: string;
  /** Current lifecycle status */
  status: IdeaStatus;
  /** User-defined category (e.g., "SaaS", "Mobile App") */
  category: string;
  /** Array of tags for organization */
  tags: string[];

  // --- Source Tracking (Pipeline) ---
  /** How this idea was created */
  source: IdeaSource;
  /** Signals that inspired this idea (for AI-generated ideas) */
  sourceSignals?: string[];
  /** Links to the generation run that created this idea */
  generationRunId?: string;

  // --- Scoring ---
  /** Core scoring parameters (required) */
  scores: CoreScores;
  /** Optional scoring parameters */
  optionalScores?: OptionalScores;
  /** Calculated composite score (1.0-5.0) */
  compositeScore: number;
  /** Derived decision tier */
  tier: DecisionTier;
  /** Scoring method used */
  scoringMethod: 'manual' | 'ai-auto' | 'ai-assisted';

  // --- AI-Generated Content (for ai-generated ideas) ---
  /** AI content (populated by generation pipeline) */
  aiContent?: AIGeneratedContent;

  // --- Metadata ---
  /** Creation timestamp */
  createdAt: Timestamp;
  /** Last update timestamp */
  updatedAt: Timestamp;
}

/**
 * AI-generated content for ideas created by the pipeline
 */
export interface AIGeneratedContent {
  /** Signals that inspired this idea */
  sourceSignals: string[];
  /** Key advantages (3-5 items) */
  strengths: string[];
  /** Key challenges (3-5 items) */
  risks: string[];
  /** Structured business plan */
  businessPlan: {
    targetMarket: string;
    monetization: string;
    goToMarket: string;
    competitiveAdvantage: string;
  };
  /** Elevator pitch (2-3 sentences) */
  elevatorPitch: string;
  /** Link to the generation run */
  generationRunId: string;
}

/**
 * Note entity (subcollection of Idea)
 * Firestore path: /users/{userId}/ideas/{ideaId}/notes/{noteId}
 */
export interface Note {
  /** Auto-generated Firestore document ID */
  id: string;
  /** Note content */
  content: string;
  /** Creation timestamp */
  createdAt: Timestamp;
  /** Last update timestamp */
  updatedAt: Timestamp;
}

// ============================================
// GENERATION PIPELINE TYPES
// ============================================

/**
 * Configuration for idea generation
 */
export interface GenerationConfig {
  /** Data sources to use for trend analysis */
  sources: DataSource[];
  /** Number of ideas to generate (5-25) */
  ideasPerRun: number;
  /** Optional category filter */
  categories?: string[];
}

/**
 * Result of a generation pipeline run
 */
export interface GenerationResult {
  /** Whether the pipeline completed successfully */
  success: boolean;
  /** Unique identifier for this run */
  runId: string;
  /** Number of ideas generated by AI */
  ideasGenerated: number;
  /** Number of ideas saved to Firestore */
  ideasSaved: number;
  /** Which data sources were actually queried */
  sourcesUsed: DataSource[];
  /** Per-source results */
  sourceResults: SourceResult[];
  /** Errors encountered during execution */
  errors: string[];
  /** Total execution time in milliseconds */
  duration: number;
}

/**
 * Result from a single data source
 */
export interface SourceResult {
  /** Which source this result is for */
  source: DataSource;
  /** Whether fetching from this source succeeded */
  success: boolean;
  /** Number of signals/trends found */
  signalsFound: number;
  /** Error message if failed */
  error?: string;
}

/**
 * Current status of the generation system
 */
export interface GenerationStatus {
  /** Information about the last completed run */
  lastRun: {
    runId: string;
    timestamp: string;  // ISO 8601
    ideasGenerated: number;
    success: boolean;
  } | null;
  /** Next scheduled run timestamp (ISO 8601), null if disabled */
  nextScheduledRun: string | null;
  /** Whether auto-generation is enabled */
  autoGenerationEnabled: boolean;
  /** Whether a generation is currently in progress */
  isRunning: boolean;
  /** Current pipeline stage (only present if isRunning is true) */
  currentStage?: GenerationStage;
}

/**
 * Historical record of a generation run
 * Firestore path: /users/{userId}/generationRuns/{runId}
 */
export interface GenerationRun {
  /** Unique identifier */
  runId: string;
  /** When the run started (ISO 8601) */
  timestamp: string;
  /** Number of ideas generated */
  ideasGenerated: number;
  /** Number of ideas saved */
  ideasSaved: number;
  /** Data sources used */
  sources: DataSource[];
  /** Execution time in milliseconds */
  duration: number;
  /** Whether the run succeeded */
  success: boolean;
  /** Errors encountered (if any) */
  errors?: string[];
}

/**
 * User's generation settings
 * Stored in /users/{userId} document
 */
export interface UserGenerationSettings {
  /** Enable/disable daily auto-generation */
  autoGenerationEnabled: boolean;
  /** Data sources to use */
  generationSources: DataSource[];
  /** Ideas per generation run (5-25) */
  ideasPerRun: number;
  /** Optional category filter for generated ideas */
  preferredCategories?: string[];
}

/**
 * User preferences (includes scoring and generation)
 * Firestore path: /users/{userId}/preferences
 */
export interface UserPreferences {
  // --- Scoring Preferences ---
  /** Weight preset selection */
  weightPreset: 'default' | 'conservative' | 'aggressive' | 'solo_founder' | 'custom';
  /** Custom weights (only used if weightPreset is 'custom') */
  customWeights?: ScoreWeights;
  /** Default category for new ideas */
  defaultCategory?: string;
  /** Favorite tags for quick access */
  favoriteTags?: string[];

  // --- Generation Preferences ---
  /** Enable/disable daily auto-generation */
  autoGenerationEnabled: boolean;
  /** Data sources to use for generation */
  generationSources: DataSource[];
  /** Ideas per generation run */
  ideasPerRun: number;
  /** Optional category filter for generated ideas */
  preferredCategories?: string[];
}

/**
 * Scoring weight configuration
 * All weights must sum to 1.0
 */
export interface ScoreWeights {
  businessPotential: number;
  developmentComplexity: number;
  timeToMarket: number;
  competitionLevel: number;
  riskLevel: number;
  // Optional weights (only applied if parameter has a score)
  trendAlignment?: number;
  founderMarketFit?: number;
  growthPotential?: number;
  defensibility?: number;
  capitalEfficiency?: number;
}
```

### 1.2 Request Types

```typescript
// ============================================
// CREATE OPERATIONS
// ============================================

/**
 * Request to create a new idea (manual entry)
 */
export interface CreateIdeaRequest {
  /** Idea name (1-100 chars, required) */
  name: string;
  /** Brief description (0-500 chars, optional) */
  brief?: string;
  /** Initial status (defaults to 'new') */
  status?: IdeaStatus;
  /** Category (0-50 chars, optional) */
  category?: string;
  /** Tags (max 10 tags, each 1-30 chars) */
  tags?: string[];
  /** Core scores (required for MVP) */
  scores: CreateCoreScoresRequest;
}

/**
 * Core scores for idea creation
 * All scores required, value only (source defaults to 'manual')
 */
export interface CreateCoreScoresRequest {
  businessPotential: number;
  developmentComplexity: number;
  timeToMarket: number;
  competitionLevel: number;
  riskLevel: number;
}

/**
 * Request to create a note
 */
export interface CreateNoteRequest {
  /** Note content (1-2000 chars, required) */
  content: string;
}

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Request to update an idea (partial update)
 * All fields optional - only provided fields are updated
 */
export interface UpdateIdeaRequest {
  /** Updated name */
  name?: string;
  /** Updated brief */
  brief?: string;
  /** Updated status */
  status?: IdeaStatus;
  /** Updated category */
  category?: string;
  /** Updated tags (replaces entire array) */
  tags?: string[];
  /** Updated scores (partial - only update provided scores) */
  scores?: Partial<UpdateCoreScoresRequest>;
  /** Updated optional scores */
  optionalScores?: Partial<UpdateOptionalScoresRequest>;
}

/**
 * Score update request
 * Value only - source set to 'manual' or 'ai_adjusted' based on context
 */
export interface UpdateCoreScoresRequest {
  businessPotential?: number;
  developmentComplexity?: number;
  timeToMarket?: number;
  competitionLevel?: number;
  riskLevel?: number;
}

export interface UpdateOptionalScoresRequest {
  trendAlignment?: number;
  founderMarketFit?: number;
  growthPotential?: number;
  defensibility?: number;
  capitalEfficiency?: number;
}

/**
 * Request to update a note
 */
export interface UpdateNoteRequest {
  /** Updated content (1-2000 chars) */
  content: string;
}

/**
 * Request to change idea status
 * Validated against state machine rules
 */
export interface ChangeStatusRequest {
  /** Target status */
  status: IdeaStatus;
}

// ============================================
// GENERATION OPERATIONS
// ============================================

/**
 * Request to trigger manual idea generation
 */
export interface TriggerGenerationRequest {
  /** Data sources to use: 'all' for all sources, or array of specific sources */
  sources: 'all' | DataSource[];
  /** Number of ideas to generate (5-25, defaults to user's setting) */
  ideasPerRun?: number;
  /** Optional category filter */
  categories?: string[];
}

/**
 * Request to update generation settings
 */
export interface UpdateGenerationSettingsRequest {
  /** Enable/disable auto-generation */
  autoGenerationEnabled?: boolean;
  /** Data sources to use */
  generationSources?: DataSource[];
  /** Ideas per run (5-25) */
  ideasPerRun?: number;
  /** Preferred categories filter */
  preferredCategories?: string[];
}
```

### 1.3 Response Types

```typescript
// ============================================
// RESPONSE TYPES
// ============================================

/**
 * Single idea response
 */
export interface IdeaResponse {
  /** The idea entity */
  data: Idea;
}

/**
 * List of ideas response with pagination
 */
export interface IdeaListResponse {
  /** Array of ideas */
  data: Idea[];
  /** Pagination metadata */
  pagination: PaginationMeta;
  /** Applied filters (echoed back) */
  filters: AppliedFilters;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  /** Total number of matching ideas */
  totalCount: number;
  /** Number of ideas in this response */
  pageSize: number;
  /** Whether more results exist */
  hasMore: boolean;
  /** Cursor for next page (null if no more pages) */
  nextCursor: string | null;
  /** Cursor for previous page (null if first page) */
  prevCursor: string | null;
}

/**
 * Applied filters echoed in response
 */
export interface AppliedFilters {
  statuses?: IdeaStatus[];
  categories?: string[];
  tags?: string[];
  tierFilter?: DecisionTier[];
  scoreRange?: { min: number; max: number };
  sortBy: SortField;
  sortOrder: SortOrder;
}

/**
 * Note list response
 */
export interface NoteListResponse {
  /** Array of notes */
  data: Note[];
  /** Total note count for this idea */
  totalCount: number;
}

/**
 * Generic success response for mutations
 */
export interface MutationResponse<T> {
  /** Operation success indicator */
  success: true;
  /** Updated/created entity */
  data: T;
  /** Human-readable message */
  message: string;
}

/**
 * Error response format
 */
export interface ErrorResponse {
  /** Operation failed */
  success: false;
  /** Error code for programmatic handling */
  error: ErrorCode;
  /** Human-readable error message */
  message: string;
  /** Field-specific validation errors (if applicable) */
  fieldErrors?: Record<string, string>;
  /** Request ID for debugging */
  requestId?: string;
}

// ============================================
// GENERATION RESPONSE TYPES
// ============================================

/**
 * Response from triggering generation
 */
export interface TriggerGenerationResponse {
  success: true;
  data: GenerationResult;
}

/**
 * Response from getting generation status
 */
export interface GenerationStatusResponse {
  success: true;
  data: GenerationStatus;
}

/**
 * Response from getting generation history
 */
export interface GenerationHistoryResponse {
  /** List of past generation runs */
  runs: GenerationRun[];
  /** Whether more runs exist */
  hasMore: boolean;
  /** Cursor for next page */
  nextCursor?: string;
}

/**
 * Response from getting/updating generation settings
 */
export interface GenerationSettingsResponse {
  success: true;
  data: UserGenerationSettings;
}
```

### 1.4 Query & Filter Types

```typescript
// ============================================
// QUERY PARAMETERS
// ============================================

export type SortField = 'createdAt' | 'updatedAt' | 'name' | 'compositeScore' | 'status';
export type SortOrder = 'asc' | 'desc';

/**
 * Query parameters for listing ideas
 */
export interface IdeaQueryParams {
  // --- Filtering ---
  /** Filter by one or more statuses */
  statuses?: IdeaStatus[];
  /** Filter by categories */
  categories?: string[];
  /** Filter by tags (ideas must have ALL specified tags) */
  tags?: string[];
  /** Filter by decision tiers */
  tiers?: DecisionTier[];
  /** Filter by minimum composite score */
  minScore?: number;
  /** Filter by maximum composite score */
  maxScore?: number;
  /** Full-text search in name and brief */
  search?: string;

  // --- Source Filtering (Pipeline) ---
  /** Filter by idea source (ai-generated, manual, etc.) */
  sources?: IdeaSource[];
  /** Filter by specific generation run ID */
  generationRunId?: string;
  /** Only show ideas created in last 24 hours */
  isNew?: boolean;

  // --- Sorting ---
  /** Field to sort by */
  sortBy?: SortField;
  /** Sort direction */
  sortOrder?: SortOrder;

  // --- Pagination ---
  /** Number of results per page (max 100, default 20) */
  pageSize?: number;
  /** Cursor for pagination (from previous response) */
  cursor?: string;
}

/**
 * Query parameters for generation history
 */
export interface GenerationHistoryQueryParams {
  /** Number of runs to return (max 50, default 10) */
  limit?: number;
  /** Cursor for pagination */
  before?: string;
}

/**
 * Query parameters for listing notes
 */
export interface NoteQueryParams {
  /** Sort direction (default: desc - newest first) */
  sortOrder?: SortOrder;
  /** Number of notes to return (max 50, default 20) */
  limit?: number;
}
```

---

## 2. Data Validation Rules

### 2.1 Idea Validation

| Field | Type | Required | Min | Max | Pattern/Rules | Notes |
|-------|------|----------|-----|-----|---------------|-------|
| `name` | string | Yes | 1 | 100 | Trimmed, no leading/trailing whitespace | Must be unique per user (soft validation) |
| `brief` | string | No | 0 | 500 | Trimmed | Empty string treated as null |
| `status` | enum | Yes | - | - | Must be valid IdeaStatus | Defaults to 'new' on create |
| `category` | string | No | 0 | 50 | Trimmed, alphanumeric + spaces | Empty string treated as null |
| `tags` | array | No | 0 | 10 | Each tag: 1-30 chars, lowercase, trimmed | Duplicates removed |
| `scores.*` | number | Yes | 1 | 5 | Integer only (1, 2, 3, 4, or 5) | All 5 core scores required |
| `compositeScore` | number | Auto | 1.0 | 5.0 | Calculated, 2 decimal places | Read-only, computed on write |
| `tier` | enum | Auto | - | - | Derived from compositeScore | Read-only, computed on write |

### 2.2 Note Validation

| Field | Type | Required | Min | Max | Pattern/Rules | Notes |
|-------|------|----------|-----|-----|---------------|-------|
| `content` | string | Yes | 1 | 2000 | Trimmed | Cannot be empty |

### 2.3 Query Parameter Validation

| Parameter | Type | Default | Min | Max | Notes |
|-----------|------|---------|-----|-----|-------|
| `pageSize` | number | 20 | 1 | 100 | Clamped to range |
| `minScore` | number | 1.0 | 1.0 | 5.0 | Must be <= maxScore |
| `maxScore` | number | 5.0 | 1.0 | 5.0 | Must be >= minScore |
| `sortBy` | enum | 'createdAt' | - | - | Must be valid SortField |
| `sortOrder` | enum | 'desc' | - | - | 'asc' or 'desc' |
| `statuses` | array | all | - | 5 | Max 5 values (all statuses) |
| `categories` | array | all | - | 20 | Max 20 categories |
| `tags` | array | all | - | 10 | Max 10 tags (AND logic) |
| `sources` | array | all | - | 3 | Max 3 values (IdeaSource: ai-generated, trend-suggested, manual) |
| `generationRunId` | string | null | - | - | Valid run ID format |
| `isNew` | boolean | false | - | - | Filter for last 24h |

### 2.4 Generation Settings Validation

| Field | Type | Required | Default | Min | Max | Notes |
|-------|------|----------|---------|-----|-----|-------|
| `autoGenerationEnabled` | boolean | No | true | - | - | Toggle auto-generation |
| `generationSources` | array | No | all 4 | 1 | 4 | At least one source required |
| `ideasPerRun` | number | No | 10 | 5 | 25 | Ideas generated per run |
| `preferredCategories` | array | No | null | 0 | 5 | Optional category filter |

**Valid generationSources values**: `'x'`, `'polymarket'`, `'googlenews'`, `'appstore'`

**Generation Request Validation**:
| Field | Type | Required | Default | Min | Max | Notes |
|-------|------|----------|---------|-----|-----|-------|
| `sources` | 'all' \| DataSource[] | Yes | - | - | - | Must be 'all' or array of 1+ valid sources |
| `ideasPerRun` | number | No | user setting | 5 | 25 | Override user's count |
| `categories` | array | No | null | 0 | 5 | Filter categories |

**Valid sources values**: `'all'`, or array containing one or more of: `'x'`, `'polymarket'`, `'googlenews'`, `'appstore'`

### 2.5 Validation Error Format

```typescript
// Example validation error response
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "fieldErrors": {
    "name": "Name is required and must be 1-100 characters",
    "scores.businessPotential": "Score must be an integer between 1 and 5",
    "tags": "Maximum 10 tags allowed"
  }
}
```

---

## 3. State Transitions

### 3.1 Status State Machine

```
                    +-----------+
                    |    NEW    |
                    +-----------+
                          |
                          | start_review
                          v
                    +-----------+
         +----------|  REVIEWING |----------+
         |          +-----------+           |
         |               |                  |
         | park          | pursue           | reject
         v               v                  v
   +-----------+   +-----------+      +-----------+
   |   PARKED  |   |  PURSUING |      |  REJECTED |
   +-----------+   +-----------+      +-----------+
         |
         | resume
         v
   +-----------+
   |  REVIEWING |
   +-----------+
```

### 3.2 Valid Transitions Matrix

| From \ To | new | reviewing | pursuing | parked | rejected |
|-----------|-----|-----------|----------|--------|----------|
| **new** | - | Yes | No | No | No |
| **reviewing** | No | - | Yes | Yes | Yes |
| **pursuing** | No | Yes | - | Yes | No |
| **parked** | No | Yes | No | - | No |
| **rejected** | No | No | No | No | - |

### 3.3 Transition Rules

```typescript
/**
 * Valid status transitions
 */
export const STATUS_TRANSITIONS: Record<IdeaStatus, IdeaStatus[]> = {
  new: ['reviewing'],
  reviewing: ['pursuing', 'parked', 'rejected'],
  pursuing: ['reviewing', 'parked'],
  parked: ['reviewing'],
  rejected: [], // Terminal state
};

/**
 * Validate a status transition
 */
export function isValidTransition(from: IdeaStatus, to: IdeaStatus): boolean {
  if (from === to) return false; // No-op transitions not allowed
  return STATUS_TRANSITIONS[from].includes(to);
}

/**
 * Get human-readable transition action name
 */
export const TRANSITION_ACTIONS: Record<string, string> = {
  'new->reviewing': 'Start Review',
  'reviewing->pursuing': 'Pursue Idea',
  'reviewing->parked': 'Park for Later',
  'reviewing->rejected': 'Reject Idea',
  'pursuing->reviewing': 'Back to Review',
  'pursuing->parked': 'Park Idea',
  'parked->reviewing': 'Resume Review',
};
```

### 3.4 Transition Error Handling

```typescript
// Invalid transition error response
{
  "success": false,
  "error": "INVALID_STATUS_TRANSITION",
  "message": "Cannot transition from 'new' to 'pursuing'. Must first move to 'reviewing'.",
  "fieldErrors": {
    "status": "Invalid transition: new -> pursuing"
  }
}
```

---

## 4. Score Calculation

### 4.1 Default Weights

```typescript
/**
 * Default scoring weights for core parameters
 * Used when weightPreset is 'default' or not set
 */
export const DEFAULT_WEIGHTS: ScoreWeights = {
  businessPotential: 0.25,      // 25% - Revenue potential is key
  developmentComplexity: 0.20,  // 20% - Execution feasibility
  timeToMarket: 0.20,           // 20% - Speed to validate
  competitionLevel: 0.20,       // 20% - Market dynamics
  riskLevel: 0.15,              // 15% - Downside protection
  // Optional parameters (v1.1+) - applied proportionally if present
  trendAlignment: 0.05,
  founderMarketFit: 0.05,
  growthPotential: 0.05,
  defensibility: 0.03,
  capitalEfficiency: 0.02,
};

/**
 * Weight presets for different user profiles
 */
export const WEIGHT_PRESETS: Record<string, ScoreWeights> = {
  default: DEFAULT_WEIGHTS,
  conservative: {
    businessPotential: 0.15,
    developmentComplexity: 0.20,
    timeToMarket: 0.15,
    competitionLevel: 0.20,
    riskLevel: 0.30,  // Higher weight on risk
  },
  aggressive: {
    businessPotential: 0.35,  // Higher weight on potential
    developmentComplexity: 0.15,
    timeToMarket: 0.25,
    competitionLevel: 0.15,
    riskLevel: 0.10,
  },
  solo_founder: {
    businessPotential: 0.20,
    developmentComplexity: 0.25,  // Can I build it alone?
    timeToMarket: 0.25,           // Speed matters
    competitionLevel: 0.15,
    riskLevel: 0.15,
  },
};
```

### 4.2 Composite Score Algorithm

```typescript
/**
 * Calculate composite score from individual parameter scores
 *
 * @param scores - Core scores object
 * @param optionalScores - Optional scores object (may be undefined)
 * @param weights - Weight configuration to use
 * @returns Composite score rounded to 2 decimal places (1.00-5.00)
 */
export function calculateCompositeScore(
  scores: CoreScores,
  optionalScores: OptionalScores | undefined,
  weights: ScoreWeights
): number {
  let weightedSum = 0;
  let totalWeight = 0;

  // Core scores (always present)
  const coreParams: (keyof CoreScores)[] = [
    'businessPotential',
    'developmentComplexity',
    'timeToMarket',
    'competitionLevel',
    'riskLevel',
  ];

  for (const param of coreParams) {
    const score = scores[param].value;
    const weight = weights[param];
    weightedSum += score * weight;
    totalWeight += weight;
  }

  // Optional scores (only if present)
  if (optionalScores) {
    const optionalParams: (keyof OptionalScores)[] = [
      'trendAlignment',
      'founderMarketFit',
      'growthPotential',
      'defensibility',
      'capitalEfficiency',
    ];

    for (const param of optionalParams) {
      const paramScore = optionalScores[param];
      if (paramScore && weights[param]) {
        weightedSum += paramScore.value * weights[param]!;
        totalWeight += weights[param]!;
      }
    }
  }

  // Normalize if total weight doesn't sum to 1.0
  const composite = weightedSum / totalWeight;

  // Round to 2 decimal places
  return Math.round(composite * 100) / 100;
}
```

### 4.3 Decision Tier Derivation

```typescript
/**
 * Decision tier thresholds
 */
export const TIER_THRESHOLDS = {
  hot: { min: 4.0, max: 5.0 },      // 4.00 - 5.00
  warm: { min: 3.0, max: 3.99 },    // 3.00 - 3.99
  park: { min: 2.0, max: 2.99 },    // 2.00 - 2.99
  discard: { min: 1.0, max: 1.99 }, // 1.00 - 1.99
};

/**
 * Derive decision tier from composite score
 *
 * @param compositeScore - Score between 1.0 and 5.0
 * @returns Decision tier
 */
export function getDecisionTier(compositeScore: number): DecisionTier {
  if (compositeScore >= 4.0) return 'hot';
  if (compositeScore >= 3.0) return 'warm';
  if (compositeScore >= 2.0) return 'park';
  return 'discard';
}

/**
 * Tier display metadata
 */
export const TIER_DISPLAY: Record<DecisionTier, { label: string; color: string; action: string }> = {
  hot: { label: 'HOT', color: 'green', action: 'Pursue immediately' },
  warm: { label: 'WARM', color: 'yellow', action: 'Worth exploring' },
  park: { label: 'PARK', color: 'orange', action: 'Save for later' },
  discard: { label: 'DISCARD', color: 'red', action: 'Archive' },
};
```

### 4.4 Score Recalculation Trigger

Composite score and tier MUST be recalculated whenever:
1. Any core score value changes
2. Any optional score is added, updated, or removed
3. User changes their weight preset
4. User updates custom weights

```typescript
/**
 * Hook to recalculate derived fields on idea update
 * Called before Firestore write
 */
function onIdeaUpdate(idea: Idea, weights: ScoreWeights): Idea {
  const compositeScore = calculateCompositeScore(
    idea.scores,
    idea.optionalScores,
    weights
  );
  const tier = getDecisionTier(compositeScore);

  return {
    ...idea,
    compositeScore,
    tier,
    updatedAt: Timestamp.now(),
  };
}
```

---

## 5. API Operation Contracts

### 5.1 Create Idea

**Operation**: Create a new idea in the user's portfolio

**Firestore Path**: `POST /users/{userId}/ideas`

**Input**: `CreateIdeaRequest`

**Output**: `MutationResponse<Idea>`

**Validation**:
1. `name` is required, 1-100 characters
2. All 5 core scores are required, each 1-5 integer
3. `status` defaults to 'new' if not provided
4. `tags` limited to 10, each 1-30 characters

**Processing**:
1. Validate all input fields
2. Trim and normalize strings
3. Remove duplicate tags, convert to lowercase
4. Create ParameterScore objects with source: 'manual'
5. Calculate compositeScore using default weights
6. Derive tier from compositeScore
7. Set createdAt and updatedAt to server timestamp
8. Generate Firestore document ID
9. Write to Firestore

**Side Effects**:
- None for MVP
- Future: May trigger AI scoring if configured

**Error Cases**:
| Error Code | Condition |
|------------|-----------|
| `VALIDATION_ERROR` | Invalid input data |
| `UNAUTHORIZED` | User not authenticated |
| `QUOTA_EXCEEDED` | User has hit idea limit (future) |

**Example**:
```typescript
// Request
const request: CreateIdeaRequest = {
  name: "AI-powered code review tool",
  brief: "Automated code review using GPT-4 for PR comments",
  category: "Developer Tools",
  tags: ["ai", "devtools", "saas"],
  scores: {
    businessPotential: 4,
    developmentComplexity: 3,
    timeToMarket: 3,
    competitionLevel: 2,
    riskLevel: 3,
  },
};

// Response
const response: MutationResponse<Idea> = {
  success: true,
  data: {
    id: "abc123xyz",
    name: "AI-powered code review tool",
    brief: "Automated code review using GPT-4 for PR comments",
    status: "new",
    category: "Developer Tools",
    tags: ["ai", "devtools", "saas"],
    scores: {
      businessPotential: { value: 4, source: "manual" },
      developmentComplexity: { value: 3, source: "manual" },
      timeToMarket: { value: 3, source: "manual" },
      competitionLevel: { value: 2, source: "manual" },
      riskLevel: { value: 3, source: "manual" },
    },
    compositeScore: 3.05,
    tier: "warm",
    createdAt: Timestamp,
    updatedAt: Timestamp,
    scoringMethod: "manual",
  },
  message: "Idea created successfully",
};
```

---

### 5.2 Get Idea

**Operation**: Retrieve a single idea by ID

**Firestore Path**: `GET /users/{userId}/ideas/{ideaId}`

**Input**: `ideaId` (path parameter)

**Output**: `IdeaResponse`

**Validation**:
1. `ideaId` must be valid Firestore document ID

**Processing**:
1. Fetch document from Firestore
2. Return idea data

**Error Cases**:
| Error Code | Condition |
|------------|-----------|
| `IDEA_NOT_FOUND` | Idea with given ID doesn't exist |
| `UNAUTHORIZED` | User not authenticated or doesn't own idea |

---

### 5.3 List Ideas

**Operation**: Retrieve filtered, sorted, paginated list of ideas

**Firestore Path**: `GET /users/{userId}/ideas`

**Input**: `IdeaQueryParams`

**Output**: `IdeaListResponse`

**Validation**:
1. All query params validated per Section 2.3
2. Invalid params use defaults (don't error)

**Processing**:
1. Build Firestore query with filters
2. Apply sorting
3. Apply pagination (cursor-based)
4. Execute query
5. Build response with pagination metadata

**Firestore Query Construction**:
```typescript
// Example query building
let query = db.collection('users').doc(userId).collection('ideas');

// Status filter (uses 'in' operator)
if (params.statuses?.length) {
  query = query.where('status', 'in', params.statuses);
}

// Score range filter
if (params.minScore) {
  query = query.where('compositeScore', '>=', params.minScore);
}
if (params.maxScore) {
  query = query.where('compositeScore', '<=', params.maxScore);
}

// Tier filter
if (params.tiers?.length) {
  query = query.where('tier', 'in', params.tiers);
}

// Sorting
query = query.orderBy(params.sortBy || 'createdAt', params.sortOrder || 'desc');

// Pagination
if (params.cursor) {
  const cursorDoc = await db.doc(params.cursor).get();
  query = query.startAfter(cursorDoc);
}
query = query.limit(params.pageSize || 20);
```

**Index Requirements**:
Composite indexes needed for multi-field queries:
1. `(status, compositeScore, createdAt)`
2. `(tier, createdAt)`
3. `(category, compositeScore)`

**Error Cases**:
| Error Code | Condition |
|------------|-----------|
| `UNAUTHORIZED` | User not authenticated |
| `INVALID_CURSOR` | Pagination cursor is invalid |

---

### 5.4 Update Idea

**Operation**: Partially update an existing idea

**Firestore Path**: `PATCH /users/{userId}/ideas/{ideaId}`

**Input**: `UpdateIdeaRequest`

**Output**: `MutationResponse<Idea>`

**Validation**:
1. At least one field must be provided
2. Each provided field validated per Section 2.1
3. Score values must be 1-5 integers

**Processing**:
1. Fetch existing idea
2. Merge provided fields with existing data
3. If any score changed, recalculate compositeScore and tier
4. Update `updatedAt` timestamp
5. Write to Firestore
6. Return updated idea

**Side Effects**:
- Triggers compositeScore recalculation if scores changed
- Updates `updatedAt` timestamp

**Error Cases**:
| Error Code | Condition |
|------------|-----------|
| `VALIDATION_ERROR` | Invalid input data |
| `IDEA_NOT_FOUND` | Idea doesn't exist |
| `UNAUTHORIZED` | User doesn't own idea |

---

### 5.5 Change Status

**Operation**: Change idea status with state machine validation

**Firestore Path**: `PATCH /users/{userId}/ideas/{ideaId}/status`

**Input**: `ChangeStatusRequest`

**Output**: `MutationResponse<Idea>`

**Validation**:
1. Target status must be valid IdeaStatus
2. Transition must be allowed per state machine (Section 3)

**Processing**:
1. Fetch existing idea
2. Validate transition is allowed
3. Update status and updatedAt
4. Write to Firestore
5. Return updated idea

**Error Cases**:
| Error Code | Condition |
|------------|-----------|
| `INVALID_STATUS_TRANSITION` | Transition not allowed |
| `IDEA_NOT_FOUND` | Idea doesn't exist |
| `UNAUTHORIZED` | User doesn't own idea |

---

### 5.6 Delete Idea

**Operation**: Delete an idea and all its notes

**Firestore Path**: `DELETE /users/{userId}/ideas/{ideaId}`

**Input**: `ideaId` (path parameter)

**Output**: `MutationResponse<{ id: string }>`

**Processing**:
1. Verify idea exists
2. Delete all notes in subcollection (batch)
3. Delete idea document
4. Return confirmation

**Side Effects**:
- Deletes all notes subcollection documents

**Error Cases**:
| Error Code | Condition |
|------------|-----------|
| `IDEA_NOT_FOUND` | Idea doesn't exist |
| `UNAUTHORIZED` | User doesn't own idea |

---

### 5.7 Create Note

**Operation**: Add a note to an idea

**Firestore Path**: `POST /users/{userId}/ideas/{ideaId}/notes`

**Input**: `CreateNoteRequest`

**Output**: `MutationResponse<Note>`

**Validation**:
1. `content` required, 1-2000 characters

**Processing**:
1. Validate content
2. Create note with timestamps
3. Write to notes subcollection

**Error Cases**:
| Error Code | Condition |
|------------|-----------|
| `VALIDATION_ERROR` | Invalid content |
| `IDEA_NOT_FOUND` | Parent idea doesn't exist |
| `UNAUTHORIZED` | User doesn't own idea |

---

### 5.8 List Notes

**Operation**: Get all notes for an idea

**Firestore Path**: `GET /users/{userId}/ideas/{ideaId}/notes`

**Input**: `NoteQueryParams`

**Output**: `NoteListResponse`

**Processing**:
1. Query notes subcollection
2. Sort by createdAt (configurable direction)
3. Apply limit
4. Return notes with count

---

### 5.9 Update Note

**Operation**: Update note content

**Firestore Path**: `PATCH /users/{userId}/ideas/{ideaId}/notes/{noteId}`

**Input**: `UpdateNoteRequest`

**Output**: `MutationResponse<Note>`

**Validation**:
1. `content` required, 1-2000 characters

---

### 5.10 Delete Note

**Operation**: Delete a note

**Firestore Path**: `DELETE /users/{userId}/ideas/{ideaId}/notes/{noteId}`

**Input**: `noteId` (path parameter)

**Output**: `MutationResponse<{ id: string }>`

---

## 5.5 Generation Pipeline Endpoints

### 5.5.1 Trigger Generation

**Operation**: Manually trigger idea generation pipeline

**Endpoint**: `POST /api/generate`

**Authentication**: Bearer token (Firebase Auth)

**Input**: `TriggerGenerationRequest`

```typescript
{
  sources: 'all' | ('x' | 'polymarket' | 'googlenews' | 'appstore')[];  // Required
  ideasPerRun?: number;  // Default: user's setting (5-25)
  categories?: string[];  // Optional filter
}
```

**Example Requests**:
```typescript
// All sources
POST /api/generate
{ "sources": "all" }

// Single source
POST /api/generate
{ "sources": ["polymarket"] }

// Multiple specific sources
POST /api/generate
{ "sources": ["x", "appstore"], "ideasPerRun": 15 }

// With category filter
POST /api/generate
{ "sources": ["x", "googlenews"], "categories": ["SaaS", "Mobile Apps"] }
```

**Output**: `TriggerGenerationResponse`

```typescript
{
  success: true,
  data: {
    runId: "run_1712582400_abc123def",
    ideasGenerated: 10,
    ideasSaved: 10,
    sourcesUsed: ["x", "polymarket", "googlenews", "appstore"],
    sourceResults: [
      { source: "x", success: true, signalsFound: 15 },
      { source: "polymarket", success: true, signalsFound: 8 },
      { source: "googlenews", success: true, signalsFound: 12 },
      { source: "appstore", success: false, signalsFound: 0, error: "Rate limited" }
    ],
    errors: ["appstore: Rate limited"],
    duration: 45230  // milliseconds
  }
}
```

**Validation**:
1. User must be authenticated
2. No generation already in progress for this user
3. Rate limit: max 5 manual triggers per hour
4. `ideasPerRun` must be 5-25 if provided
5. `sources` must contain at least one valid source

**Processing**:
1. Check rate limits and existing runs
2. Fetch signals from configured sources (parallel)
3. Analyze signals with AI (Gemini)
4. Generate ideas from signals
5. Score all generated ideas
6. Save to Firestore under user's ideas collection
7. Log generation run metadata
8. Return result

**Error Cases**:
| Error Code | HTTP | Condition |
|------------|------|-----------|
| `GENERATION_IN_PROGRESS` | 409 | Another generation is already running |
| `RATE_LIMITED` | 429 | Too many requests (max 5/hour) |
| `SOURCES_UNAVAILABLE` | 503 | All data sources failed |
| `GENERATION_FAILED` | 500 | Pipeline execution failed |
| `INVALID_GENERATION_CONFIG` | 400 | Invalid settings provided |
| `UNAUTHORIZED` | 401 | User not authenticated |

---

### 5.5.2 Get Generation Status

**Operation**: Get current generation status and last run info

**Endpoint**: `GET /api/generate/status`

**Authentication**: Bearer token (Firebase Auth)

**Input**: None

**Output**: `GenerationStatusResponse`

```typescript
{
  success: true,
  data: {
    lastRun: {
      runId: "run_1712582400_abc123def",
      timestamp: "2026-04-08T06:00:00Z",
      ideasGenerated: 10,
      success: true
    },
    nextScheduledRun: "2026-04-09T06:00:00Z",
    autoGenerationEnabled: true,
    isRunning: false,
    currentStage: null
  }
}
```

**When generation is in progress**:
```typescript
{
  success: true,
  data: {
    lastRun: { ... },
    nextScheduledRun: "2026-04-09T06:00:00Z",
    autoGenerationEnabled: true,
    isRunning: true,
    currentStage: "generating"  // 'collecting' | 'analyzing' | 'generating' | 'scoring' | 'saving'
  }
}
```

**Error Cases**:
| Error Code | HTTP | Condition |
|------------|------|-----------|
| `UNAUTHORIZED` | 401 | User not authenticated |

---

### 5.5.3 Get Generation History

**Operation**: Get historical generation runs

**Endpoint**: `GET /api/generate/history`

**Authentication**: Bearer token (Firebase Auth)

**Input**: `GenerationHistoryQueryParams`

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `limit` | number | 10 | 50 | Number of runs to return |
| `before` | string | null | - | Cursor for pagination |

**Output**: `GenerationHistoryResponse`

```typescript
{
  runs: [
    {
      runId: "run_1712582400_abc123def",
      timestamp: "2026-04-08T06:00:00Z",
      ideasGenerated: 10,
      ideasSaved: 10,
      sources: ["x", "polymarket", "googlenews"],
      duration: 45230,
      success: true
    },
    {
      runId: "run_1712496000_xyz789ghi",
      timestamp: "2026-04-07T06:00:00Z",
      ideasGenerated: 8,
      ideasSaved: 8,
      sources: ["x", "googlenews"],
      duration: 38500,
      success: true,
      errors: ["Polymarket: Connection timeout"]
    }
  ],
  hasMore: true,
  nextCursor: "run_1712409600_jkl456mno"
}
```

**Error Cases**:
| Error Code | HTTP | Condition |
|------------|------|-----------|
| `UNAUTHORIZED` | 401 | User not authenticated |
| `INVALID_CURSOR` | 400 | Invalid pagination cursor |

---

### 5.5.4 Get Generation Settings

**Operation**: Get user's generation settings

**Endpoint**: `GET /api/settings/generation`

**Authentication**: Bearer token (Firebase Auth)

**Input**: None

**Output**: `GenerationSettingsResponse`

```typescript
{
  success: true,
  data: {
    autoGenerationEnabled: true,
    generationSources: ["x", "polymarket", "googlenews"],
    ideasPerRun: 10,
    preferredCategories: ["SaaS", "Mobile Apps"]
  }
}
```

**Error Cases**:
| Error Code | HTTP | Condition |
|------------|------|-----------|
| `UNAUTHORIZED` | 401 | User not authenticated |

---

### 5.5.5 Update Generation Settings

**Operation**: Update user's generation settings

**Endpoint**: `PATCH /api/settings/generation`

**Authentication**: Bearer token (Firebase Auth)

**Input**: `UpdateGenerationSettingsRequest`

```typescript
{
  autoGenerationEnabled?: boolean,
  generationSources?: ('x' | 'polymarket' | 'googlenews')[],
  ideasPerRun?: number,
  preferredCategories?: string[]
}
```

**Output**: `GenerationSettingsResponse`

**Validation**:
1. `generationSources` must have at least 1 source if provided
2. `ideasPerRun` must be 5-25 if provided
3. `preferredCategories` max 5 categories if provided

**Error Cases**:
| Error Code | HTTP | Condition |
|------------|------|-----------|
| `VALIDATION_ERROR` | 400 | Invalid settings |
| `UNAUTHORIZED` | 401 | User not authenticated |

---

## 6. Query Parameters Specification

### 6.1 Filtering

| Parameter | Type | Behavior | Example |
|-----------|------|----------|---------|
| `statuses` | `IdeaStatus[]` | Include ideas matching ANY status | `?statuses=new,reviewing` |
| `categories` | `string[]` | Include ideas matching ANY category | `?categories=SaaS,Mobile` |
| `tags` | `string[]` | Include ideas having ALL tags (AND logic) | `?tags=ai,b2b` |
| `tiers` | `DecisionTier[]` | Include ideas matching ANY tier | `?tiers=hot,warm` |
| `minScore` | `number` | Minimum composite score (inclusive) | `?minScore=3.5` |
| `maxScore` | `number` | Maximum composite score (inclusive) | `?maxScore=4.5` |
| `search` | `string` | Full-text search in name + brief | `?search=mobile app` |
| `sources` | `IdeaSource[]` | Filter by idea source | `?sources=ai-generated,manual` |
| `generationRunId` | `string` | Filter by specific generation run | `?generationRunId=run_123` |
| `isNew` | `boolean` | Only ideas from last 24 hours | `?isNew=true` |

### 6.2 Sorting

| Parameter | Type | Default | Options |
|-----------|------|---------|---------|
| `sortBy` | `SortField` | `createdAt` | `createdAt`, `updatedAt`, `name`, `compositeScore`, `status` |
| `sortOrder` | `SortOrder` | `desc` | `asc`, `desc` |

**Sorting Examples**:
- Newest first: `?sortBy=createdAt&sortOrder=desc` (default)
- Highest score first: `?sortBy=compositeScore&sortOrder=desc`
- Alphabetical: `?sortBy=name&sortOrder=asc`

### 6.3 Pagination

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `pageSize` | `number` | 20 | 1-100 | Items per page |
| `cursor` | `string` | null | - | Opaque cursor from previous response |

**Pagination Behavior**:
- Uses cursor-based pagination (Firestore-native)
- Cursor is the document path of the last item
- `hasMore: true` indicates more results exist
- Forward pagination only for MVP
- Cursor is URL-safe base64 encoded

---

## 7. Error Codes

### 7.1 Error Code Reference

#### General Errors

| Code | HTTP Status | Description | User Message |
|------|-------------|-------------|--------------|
| `UNAUTHORIZED` | 401 | User not authenticated | "Please sign in to continue" |
| `FORBIDDEN` | 403 | User doesn't have access to resource | "You don't have access to this item" |
| `VALIDATION_ERROR` | 400 | Input validation failed | "Please check your input" |
| `INVALID_CURSOR` | 400 | Pagination cursor malformed | "Invalid page cursor" |
| `RATE_LIMITED` | 429 | Too many requests | "Please slow down" |
| `QUOTA_EXCEEDED` | 403 | User quota reached (future) | "You've reached your idea limit" |
| `INTERNAL_ERROR` | 500 | Unexpected server error | "Something went wrong" |

#### Idea & Note Errors

| Code | HTTP Status | Description | User Message |
|------|-------------|-------------|--------------|
| `IDEA_NOT_FOUND` | 404 | Idea document doesn't exist | "Idea not found" |
| `NOTE_NOT_FOUND` | 404 | Note document doesn't exist | "Note not found" |
| `INVALID_STATUS_TRANSITION` | 400 | Status change not allowed | "This status change is not allowed" |

#### Generation Pipeline Errors

| Code | HTTP Status | Description | User Message |
|------|-------------|-------------|--------------|
| `GENERATION_IN_PROGRESS` | 409 | Another generation is already running | "Generation already in progress. Please wait." |
| `GENERATION_FAILED` | 500 | Pipeline execution failed | "Idea generation failed. Please try again." |
| `SOURCES_UNAVAILABLE` | 503 | All data sources failed | "Unable to fetch trend data. Please try again later." |
| `INVALID_GENERATION_CONFIG` | 400 | Invalid generation settings | "Invalid generation settings" |
| `AI_UNAVAILABLE` | 503 | AI service temporarily unavailable | "AI features temporarily unavailable" |

#### Source-Specific Errors

| Code | HTTP Status | Description | User Message |
|------|-------------|-------------|--------------|
| `SOURCE_X_UNAVAILABLE` | 503 | X/Twitter API unavailable | "X/Twitter data source is temporarily unavailable" |
| `SOURCE_POLYMARKET_UNAVAILABLE` | 503 | Polymarket API unavailable | "Polymarket data source is temporarily unavailable" |
| `SOURCE_NEWS_UNAVAILABLE` | 503 | Google News API unavailable | "News data source is temporarily unavailable" |
| `SOURCE_APPSTORE_UNAVAILABLE` | 503 | App Store API unavailable | "App Store data source is temporarily unavailable" |

**Note**: Source-specific errors are included in the `sourceResults` array of `GenerationResult`. The pipeline continues with remaining sources if one fails (graceful degradation). `SOURCES_UNAVAILABLE` is only returned if ALL requested sources fail.

### 7.2 Error Response Schema

```typescript
interface ErrorResponse {
  success: false;
  error: ErrorCode;
  message: string;
  fieldErrors?: Record<string, string>;  // For VALIDATION_ERROR
  retryAfter?: number;                   // For RATE_LIMITED (seconds)
  requestId?: string;                    // For debugging
}
```

### 7.3 Validation Error Details

```typescript
// Example: Multiple validation errors
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Please check your input",
  "fieldErrors": {
    "name": "Name must be between 1 and 100 characters",
    "scores.businessPotential": "Score must be an integer from 1 to 5",
    "tags": "Maximum 10 tags allowed",
    "tags[3]": "Tag must be between 1 and 30 characters"
  }
}
```

---

## 8. Pagination Specification

### 8.1 Strategy: Cursor-Based Pagination

**Why Cursor-Based**:
- Firestore-native (efficient with `startAfter`)
- Consistent results even when data changes
- No "skip N" performance issues at scale
- Works well with real-time updates

**Limitations**:
- No "jump to page N" support
- Forward pagination only (MVP)
- Cannot know total page count without full scan

### 8.2 Cursor Format

```typescript
/**
 * Cursor is the encoded document path
 * Format: base64url(documentPath)
 *
 * Example: "dXNlcnMvdXNlcjEyMy9pZGVhcy9hYmMxMjM"
 *          decodes to "users/user123/ideas/abc123"
 */
function encodeCursor(docPath: string): string {
  return Buffer.from(docPath).toString('base64url');
}

function decodeCursor(cursor: string): string {
  return Buffer.from(cursor, 'base64url').toString('utf8');
}
```

### 8.3 Response Format

```typescript
interface PaginationMeta {
  /** Total matching documents (may be expensive - consider omitting) */
  totalCount: number;

  /** Number of items in current response */
  pageSize: number;

  /** True if more results exist after this page */
  hasMore: boolean;

  /** Cursor for fetching next page, null if no more pages */
  nextCursor: string | null;

  /** Cursor for previous page (null for MVP - forward only) */
  prevCursor: string | null;
}
```

### 8.4 Example Paginated Request/Response

```typescript
// First page request
GET /users/{userId}/ideas?pageSize=10&sortBy=compositeScore&sortOrder=desc

// Response
{
  "data": [/* 10 ideas */],
  "pagination": {
    "totalCount": 47,
    "pageSize": 10,
    "hasMore": true,
    "nextCursor": "dXNlcnMvdXNlcjEyMy9pZGVhcy9pZGVhMTA",
    "prevCursor": null
  },
  "filters": {
    "sortBy": "compositeScore",
    "sortOrder": "desc"
  }
}

// Next page request
GET /users/{userId}/ideas?pageSize=10&sortBy=compositeScore&sortOrder=desc&cursor=dXNlcnMvdXNlcjEyMy9pZGVhcy9pZGVhMTA

// Response
{
  "data": [/* next 10 ideas */],
  "pagination": {
    "totalCount": 47,
    "pageSize": 10,
    "hasMore": true,
    "nextCursor": "dXNlcnMvdXNlcjEyMy9pZGVhcy9pZGVhMjA",
    "prevCursor": null
  },
  "filters": { ... }
}
```

### 8.5 Page Size Limits

| Context | Default | Min | Max |
|---------|---------|-----|-----|
| Ideas list | 20 | 1 | 100 |
| Notes list | 20 | 1 | 50 |

---

## 9. Firestore Schema

### 9.1 Collection Structure

```
/users/{userId}
  /preferences (document)
  /ideas/{ideaId}
    /notes/{noteId}
  /generationRuns/{runId}
```

**User Document Fields** (for generation):
```typescript
{
  // Generation settings (stored on user document)
  autoGenerationEnabled: boolean;    // Default: true
  generationSources: string[];       // Default: ['x', 'polymarket', 'googlenews']
  ideasPerRun: number;               // Default: 10
  preferredCategories?: string[];    // Optional
}
```

### 9.2 Security Rules (Overview)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Ideas subcollection
      match /ideas/{ideaId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;

        // Notes sub-subcollection
        match /notes/{noteId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }

      // Generation runs subcollection (read-only for client, written by Cloud Functions)
      match /generationRuns/{runId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if false;  // Only Cloud Functions can write
      }

      // Preferences document
      match /preferences {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 9.3 Required Indexes

```json
{
  "indexes": [
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "compositeScore", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "tier", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "compositeScore", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "source", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "generationRunId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "generationRuns",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

## 10. Open Questions for Product

1. **Note Limit**: Should there be a maximum number of notes per idea? Suggested: 100 notes per idea.

2. **Soft Delete**: Should deleted ideas be soft-deleted (archived) or hard-deleted? Current spec assumes hard delete.

3. **Total Count Performance**: Getting `totalCount` requires a separate query. For large portfolios, should we skip this and just use `hasMore`?

4. **Tag Case Sensitivity**: Currently normalizing to lowercase. Should original case be preserved for display?

5. **Category Standardization**: Should categories be free-form or from a predefined list?

6. **Status Undo**: Should users be able to "undo" a status change within a time window?

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | April 8, 2026 | Evelyn Jones | Initial specification |
| 2.0 | April 8, 2026 | Evelyn Jones | **Pipeline-First MVP Update**: Added generation pipeline types, endpoints, error codes, source filtering, generation settings validation |
| 2.1 | April 8, 2026 | Evelyn Jones | **Source-Specific Generation**: Added 'appstore' source, source-specific triggers ('all' or array), per-source results in GenerationResult, source-specific error codes |

---

*End of API Contracts & Data Models Specification*
