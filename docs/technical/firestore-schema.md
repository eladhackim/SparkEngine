# Idea Forge: Firestore Database Schema Specification

**Status**: Implementation-Ready
**Version**: 1.1
**Date**: April 8, 2026
**Author**: Hana Rosenberg (Tech Specs)
**Updated**: Pipeline-First MVP Integration

---

## 1. Executive Summary

This document defines the complete Firestore database schema for Idea Forge, a **pipeline-first** AI-powered idea management platform for solo founders. The platform's core value proposition is automated idea generation from multiple market data sources (X/Twitter, Polymarket, Google News).

The schema is optimized for:

- **Pipeline-first architecture**: AI-generated ideas are the primary source, with manual entry as secondary
- **Single-user isolation**: All data scoped under `/users/{userId}/`
- **Performance at scale**: Supports 10,000+ ideas per user with efficient pagination
- **Generation tracking**: Full audit trail of automated generation runs
- **Flexible scoring**: 5 core + 5 optional parameters with weighted composite calculation
- **Real-time sync**: Firestore real-time listeners for live updates
- **Offline-first**: Firestore offline persistence enabled

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **User-scoped subcollections** | All data under `/users/{userId}/` ensures complete isolation and simple security rules |
| **Notes as subcollection** | `/users/{userId}/ideas/{ideaId}/notes` enables efficient pagination for ideas with many notes |
| **Flat scoring structure** | Scoring fields stored directly on idea document (not nested) for efficient querying and indexing |
| **Computed composite score** | Client computes composite; server validates on write for consistency |
| **Soft-delete via status** | Ideas are archived (status=`rejected`) not hard-deleted, preserving data integrity |
| **Server timestamps** | All timestamps use Firestore server timestamps for consistency |

---

## 2. Collection Hierarchy

```
/users/{userId}
    ├── /ideas/{ideaId}
    │       └── /notes/{noteId}
    ├── /generationRuns/{runId}
    └── /settings/{settingsId}
```

### Visual Hierarchy

```
Firebase Project (idea-forge)
│
└── Firestore Database
    │
    └── users (collection)
        │
        └── {userId} (document)
            │
            ├── ideas (subcollection)
            │   │
            │   └── {ideaId} (document)
            │       │
            │       └── notes (subcollection)
            │           │
            │           └── {noteId} (document)
            │
            ├── generationRuns (subcollection)
            │   │
            │   └── {runId} (document)
            │
            └── settings (subcollection)
                │
                └── preferences (document)
```

---

## 3. Document Schemas

### 3.1 User Document

**Path**: `/users/{userId}`

The user document is automatically created on first authentication. It stores profile data and generation settings.

#### Profile Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `uid` | `string` | Yes | - | Firebase Auth UID (matches document ID) |
| `email` | `string` | Yes | - | User's email address |
| `displayName` | `string` | No | `null` | Display name from Auth provider |
| `photoURL` | `string` | No | `null` | Profile photo URL from Auth provider |
| `createdAt` | `timestamp` | Yes | Server timestamp | Account creation time |
| `lastLoginAt` | `timestamp` | Yes | Server timestamp | Most recent login |
| `onboardingComplete` | `boolean` | No | `false` | Has completed onboarding flow |

#### Generation Settings Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `autoGenerationEnabled` | `boolean` | No | `true` | Whether scheduled daily generation is enabled |
| `generationSources` | `array<string>` | No | `['x', 'polymarket', 'googlenews']` | Data sources for idea generation |
| `ideasPerRun` | `number` | No | `10` | Number of ideas to generate per run (5-25) |
| `preferredCategories` | `array<string>` | No | `null` | Optional category filter for generation (max 5) |

#### Generation State Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `lastGenerationRun` | `timestamp` | No | `null` | When the last generation run completed |
| `generationRunCount` | `number` | No | `0` | Total number of generation runs for this user |

#### Generation Source Enum Values

```typescript
type GenerationSource = 'x' | 'polymarket' | 'googlenews';
```

**Example Document**:
```json
{
  "uid": "abc123xyz",
  "email": "founder@example.com",
  "displayName": "Jane Founder",
  "photoURL": "https://example.com/photo.jpg",
  "createdAt": "2026-04-08T12:00:00Z",
  "lastLoginAt": "2026-04-08T18:00:00Z",
  "onboardingComplete": true,

  "autoGenerationEnabled": true,
  "generationSources": ["x", "polymarket", "googlenews"],
  "ideasPerRun": 10,
  "preferredCategories": null,

  "lastGenerationRun": "2026-04-08T06:00:00Z",
  "generationRunCount": 15
}
```

---

### 3.2 Idea Document

**Path**: `/users/{userId}/ideas/{ideaId}`

The idea document stores all idea data including scoring parameters. This is the primary entity in the system.

#### Basic Fields

| Field | Type | Required | Constraints | Default | Description |
|-------|------|----------|-------------|---------|-------------|
| `id` | `string` | Yes | Auto-generated | - | Document ID (Firestore auto-ID) |
| `name` | `string` | Yes | 1-100 chars | - | Idea/company name |
| `brief` | `string` | Yes | 1-500 chars | - | Short description of the idea |
| `category` | `string` | Yes | Enum (see below) | `"other"` | Business category |
| `status` | `string` | Yes | Enum (see below) | `"new"` | Current workflow status |
| `source` | `string` | No | Enum (see below) | `"manual"` | How the idea was created |
| `tags` | `array<string>` | No | Max 10 tags, each 1-30 chars | `[]` | User-defined tags |

#### Category Enum Values

```typescript
type IdeaCategory =
  | "games"      // Gaming applications
  | "tools"      // Developer/productivity tools
  | "saas"       // Software as a Service
  | "platforms"  // Platform/marketplace businesses
  | "mobile"     // Mobile-first applications
  | "content"    // Content/media businesses
  | "services"   // Service-based businesses
  | "hardware"   // Hardware products
  | "other";     // Uncategorized
```

#### Status Enum Values

```typescript
type IdeaStatus =
  | "new"        // Just created, not yet evaluated
  | "reviewing"  // Under active evaluation
  | "pursuing"   // Decided to pursue this idea
  | "parked"     // Saved for later consideration
  | "rejected";  // Not pursuing (soft-delete equivalent)
```

#### Source Enum Values

```typescript
type IdeaSource =
  | "manual"          // User entered manually
  | "ai-generated"    // Generated via AI pipeline
  | "trend-suggested" // Auto-suggested from trends
  | "imported";       // Imported from external source
```

#### Pipeline Source Tracking Fields

These fields track the origin of AI-generated ideas and link back to generation runs.

| Field | Type | Required | Constraints | Default | Description |
|-------|------|----------|-------------|---------|-------------|
| `sourceSignals` | `array<string>` | No | Max 10 items | `null` | Market signals that inspired this idea (AI-generated only) |
| `generationRunId` | `string` | No | - | `null` | Links to `/generationRuns/{runId}` (AI-generated only) |

#### Freshness Tracking Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `viewedAt` | `timestamp` | No | `null` | When user first viewed this idea (for "NEW" badge) |

#### Core Scoring Fields (5 Required)

All scores are integers from 1-5. Higher values are always better (favorable).

| Field | Type | Required | Range | Description |
|-------|------|----------|-------|-------------|
| `businessPotential` | `number` | Yes | 1-5 | Revenue opportunity, market size, monetization clarity |
| `developmentComplexity` | `number` | Yes | 1-5 | Ease of development (5=easy, 1=very complex) |
| `timeToMarket` | `number` | Yes | 1-5 | Speed to launch (5=fast, 1=very slow) |
| `competitionLevel` | `number` | Yes | 1-5 | Competitive position (5=low competition, 1=dominated market) |
| `riskLevel` | `number` | Yes | 1-5 | Risk assessment (5=low risk, 1=very high risk) |

#### Optional Scoring Fields (5 Optional - v1.1+)

These fields are optional and only used when AI scoring is enabled.

| Field | Type | Required | Range | Description |
|-------|------|----------|-------|-------------|
| `trendAlignment` | `number` | No | 1-5 | Alignment with current market trends |
| `founderMarketFit` | `number` | No | 1-5 | Match with user's skills/experience |
| `growthPotential` | `number` | No | 1-5 | Organic/viral growth potential |
| `defensibility` | `number` | No | 1-5 | Ability to build sustainable moats |
| `capitalEfficiency` | `number` | No | 1-5 | Path to profitability with minimal funding |

#### Computed Score Fields

| Field | Type | Required | Range | Description |
|-------|------|----------|-------|-------------|
| `compositeScore` | `number` | Yes | 1.0-5.0 | Weighted average of scores (2 decimal places) |
| `tier` | `string` | Yes | Enum | Decision tier based on composite score |

#### Tier Enum Values

```typescript
type DecisionTier =
  | "hot"      // 4.0 - 5.0: Pursue immediately
  | "warm"     // 3.0 - 3.9: Worth exploring
  | "park"     // 2.0 - 2.9: Save for later
  | "discard"; // 1.0 - 1.9: Not viable
```

#### AI Content Fields

These fields are populated by the AI generation pipeline. They are optional for manually created ideas.

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `elevatorPitch` | `string` | No | Max 500 chars | Concise 2-3 sentence pitch |
| `strengths` | `array<string>` | No | Max 5 items, each max 200 chars | AI-identified key advantages |
| `risks` | `array<string>` | No | Max 5 items, each max 200 chars | AI-identified key challenges |
| `businessPlan` | `object` | No | See sub-fields | Structured business plan summary |

**Business Plan Sub-fields**:
```typescript
interface BusinessPlan {
  targetMarket: string;      // Max 500 chars
  monetization: string;      // Max 500 chars
  goToMarket: string;        // Max 500 chars
  competitiveAdvantage: string; // Max 500 chars
}
```

#### Metadata Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `createdAt` | `timestamp` | Yes | Server timestamp | Idea creation time |
| `updatedAt` | `timestamp` | Yes | Server timestamp | Last modification time |
| `scoredAt` | `timestamp` | No | `null` | Last time scores were updated |
| `scoringMethod` | `string` | No | `"manual"` | How scores were set |
| `noteCount` | `number` | No | `0` | Denormalized count of notes |

#### Scoring Method Enum Values

```typescript
type ScoringMethod =
  | "manual"       // User entered scores manually
  | "ai-auto"      // AI scored automatically
  | "ai-assisted"; // AI suggested, user confirmed/adjusted
```

#### Trade-off Flags (v1.1+)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tradeoffFlags` | `array<string>` | No | Auto-computed flags based on score patterns |

**Flag Values**:
```typescript
type TradeoffFlag =
  | "high-risk-high-reward"  // businessPotential >= 4 AND riskLevel <= 2
  | "hidden-gem"             // businessPotential >= 4 AND competitionLevel >= 4
  | "grind-play"             // businessPotential >= 3 AND developmentComplexity <= 2
  | "quick-win"              // timeToMarket >= 4 AND capitalEfficiency >= 4
  | "moonshot";              // businessPotential = 5 AND (developmentComplexity <= 2 OR riskLevel <= 2)
```

#### Complete Idea Document Example (AI-Generated)

```json
{
  "id": "idea_abc123",
  "name": "AI Writing Assistant",
  "brief": "An AI-powered tool that helps content creators write better blog posts faster by suggesting improvements and generating outlines.",
  "category": "saas",
  "status": "new",
  "source": "ai-generated",
  "tags": ["ai", "content", "b2b"],

  "businessPotential": 4,
  "developmentComplexity": 3,
  "timeToMarket": 4,
  "competitionLevel": 2,
  "riskLevel": 3,

  "trendAlignment": 5,
  "founderMarketFit": null,
  "growthPotential": 3,
  "defensibility": 2,
  "capitalEfficiency": 4,

  "compositeScore": 3.45,
  "tier": "warm",
  "tradeoffFlags": ["quick-win"],

  "sourceSignals": [
    "Twitter: High demand for AI writing tools among content creators",
    "Google News: AI productivity tools trending in tech sector"
  ],
  "generationRunId": "run_1712588400000_abc123xyz",

  "elevatorPitch": "AI Writing Assistant helps content creators write 3x faster by providing real-time suggestions and auto-generated outlines.",
  "strengths": [
    "Strong market demand for AI writing tools",
    "Can be built with existing LLM APIs",
    "Clear SaaS monetization path"
  ],
  "risks": [
    "Highly competitive market with established players",
    "Dependency on third-party AI APIs",
    "Potential for commoditization"
  ],
  "businessPlan": {
    "targetMarket": "Content marketers at SMBs and freelance writers",
    "monetization": "Subscription SaaS: $19/mo personal, $49/mo pro, $99/mo team",
    "goToMarket": "Content marketing + Product Hunt launch + influencer partnerships",
    "competitiveAdvantage": "Focus on specific niche (blog posts) rather than general writing"
  },

  "createdAt": "2026-04-08T06:00:00Z",
  "updatedAt": "2026-04-08T06:00:00Z",
  "scoredAt": "2026-04-08T06:00:00Z",
  "scoringMethod": "ai-auto",
  "noteCount": 0,
  "viewedAt": null
}
```

#### Complete Idea Document Example (Manual)

```json
{
  "id": "idea_def456",
  "name": "Fitness Tracking App",
  "brief": "A simple mobile app to track daily workouts and nutrition.",
  "category": "mobile",
  "status": "reviewing",
  "source": "manual",
  "tags": ["fitness", "health", "mobile"],

  "businessPotential": 3,
  "developmentComplexity": 4,
  "timeToMarket": 4,
  "competitionLevel": 2,
  "riskLevel": 3,

  "trendAlignment": null,
  "founderMarketFit": null,
  "growthPotential": null,
  "defensibility": null,
  "capitalEfficiency": null,

  "compositeScore": 3.20,
  "tier": "warm",
  "tradeoffFlags": [],

  "sourceSignals": null,
  "generationRunId": null,

  "elevatorPitch": null,
  "strengths": [],
  "risks": [],
  "businessPlan": null,

  "createdAt": "2026-04-08T12:00:00Z",
  "updatedAt": "2026-04-08T15:30:00Z",
  "scoredAt": "2026-04-08T12:00:00Z",
  "scoringMethod": "manual",
  "noteCount": 2,
  "viewedAt": "2026-04-08T12:00:00Z"
}
```

---

### 3.3 Note Document

**Path**: `/users/{userId}/ideas/{ideaId}/notes/{noteId}`

Notes are stored as a subcollection under each idea for efficient pagination.

| Field | Type | Required | Constraints | Default | Description |
|-------|------|----------|-------------|---------|-------------|
| `id` | `string` | Yes | Auto-generated | - | Document ID |
| `content` | `string` | Yes | 1-2000 chars | - | Note text content |
| `createdAt` | `timestamp` | Yes | Server timestamp | - | Note creation time |
| `updatedAt` | `timestamp` | Yes | Server timestamp | - | Last edit time |

**Example Document**:
```json
{
  "id": "note_xyz789",
  "content": "Talked to 3 content creators today. All said they would pay for a tool that helps with outlines. Key insight: they care more about structure than grammar fixes.",
  "createdAt": "2026-04-08T14:00:00Z",
  "updatedAt": "2026-04-08T14:00:00Z"
}
```

---

### 3.4 Generation Run Document

**Path**: `/users/{userId}/generationRuns/{runId}`

Generation runs track each automated idea generation pipeline execution. This collection is **write-only from Cloud Functions** - the client can read but never write to this collection.

#### Basic Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `runId` | `string` | Yes | - | Document ID (same as document path ID) |
| `timestamp` | `timestamp` | Yes | Server timestamp | When the run started |

#### Results Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `ideasGenerated` | `number` | Yes | - | Number of ideas generated in this run |
| `ideasSaved` | `number` | Yes | - | Number of ideas successfully saved to Firestore |
| `success` | `boolean` | Yes | - | Whether the overall run succeeded |

#### Configuration Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `sources` | `array<string>` | Yes | - | Which sources were used (`x`, `polymarket`, `googlenews`) |
| `ideasPerRun` | `number` | Yes | - | Target number of ideas for this run |
| `categories` | `array<string>` | No | `null` | Category filter applied (if any) |

#### Metadata Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `trigger` | `string` | Yes | - | How the run was triggered (`manual` or `scheduled`) |
| `duration` | `number` | Yes | - | Total run duration in milliseconds |
| `errors` | `array<string>` | No | `[]` | Error messages from failed stages |

#### Trigger Enum Values

```typescript
type GenerationTrigger = 'manual' | 'scheduled';
```

#### Stage Details (Optional - for debugging)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `stages` | `object` | No | Per-stage execution details |
| `stages.collecting` | `object` | No | `{ duration: number, success: boolean }` |
| `stages.analyzing` | `object` | No | `{ duration: number, signalsFound: number }` |
| `stages.generating` | `object` | No | `{ duration: number, ideasGenerated: number }` |
| `stages.scoring` | `object` | No | `{ duration: number }` |
| `stages.saving` | `object` | No | `{ duration: number, ideasSaved: number }` |

**Example Document**:
```json
{
  "runId": "run_1712588400000_abc123xyz",
  "timestamp": "2026-04-08T06:00:00Z",

  "ideasGenerated": 12,
  "ideasSaved": 12,
  "success": true,

  "sources": ["x", "polymarket", "googlenews"],
  "ideasPerRun": 10,
  "categories": null,

  "trigger": "scheduled",
  "duration": 45230,
  "errors": [],

  "stages": {
    "collecting": { "duration": 8500, "success": true },
    "analyzing": { "duration": 12000, "signalsFound": 25 },
    "generating": { "duration": 15000, "ideasGenerated": 12 },
    "scoring": { "duration": 8000 },
    "saving": { "duration": 1730, "ideasSaved": 12 }
  }
}
```

---

### 3.5 Settings Document

**Path**: `/users/{userId}/settings/preferences`

User preferences for scoring weights and display options.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `weightPreset` | `string` | No | `"default"` | Selected weight preset |
| `customWeights` | `object` | No | `null` | Custom weight values (if preset=custom) |
| `defaultSort` | `string` | No | `"score-desc"` | Default sort order |
| `defaultView` | `string` | No | `"grid"` | Preferred view mode |
| `showArchivedIdeas` | `boolean` | No | `false` | Show rejected ideas in list |

#### Weight Preset Enum Values

```typescript
type WeightPreset =
  | "default"        // Balanced weights
  | "conservative"   // Higher weight on Risk, Competition
  | "aggressive"     // Higher weight on Business Potential, Growth
  | "solo-founder"   // Higher weight on Complexity, Time to Market
  | "custom";        // User-defined weights
```

#### Custom Weights Object

All weights are decimals that must sum to 1.0:

```typescript
interface CustomWeights {
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
```

**Example Document**:
```json
{
  "weightPreset": "solo-founder",
  "customWeights": null,
  "defaultSort": "score-desc",
  "defaultView": "grid",
  "showArchivedIdeas": false
}
```

---

## 4. Composite Score Calculation

### 4.1 Formula

The composite score is calculated as a weighted average of scoring parameters:

```
compositeScore = Sum(parameterValue * parameterWeight)
```

### 4.2 Default Weights (MVP)

For MVP, only the 5 core parameters are used with equal weights:

| Parameter | Weight | Formula Contribution |
|-----------|--------|----------------------|
| businessPotential | 0.20 | score * 0.20 |
| developmentComplexity | 0.20 | score * 0.20 |
| timeToMarket | 0.20 | score * 0.20 |
| competitionLevel | 0.20 | score * 0.20 |
| riskLevel | 0.20 | score * 0.20 |
| **Total** | **1.00** | |

### 4.3 Full Weights (v1.1+)

When optional parameters are provided:

| Parameter | Default Weight |
|-----------|---------------|
| businessPotential | 0.20 |
| developmentComplexity | 0.15 |
| timeToMarket | 0.15 |
| competitionLevel | 0.15 |
| riskLevel | 0.15 |
| trendAlignment | 0.05 |
| founderMarketFit | 0.05 |
| growthPotential | 0.05 |
| defensibility | 0.03 |
| capitalEfficiency | 0.02 |
| **Total** | **1.00** |

### 4.4 Handling Missing Optional Parameters

When optional parameters are null:
1. Redistribute their weight proportionally among present parameters
2. Or exclude them and recalculate with only core parameters

**Recommended approach**: For MVP, always use 5-parameter calculation. Only include optional parameters when ALL are provided.

### 4.5 Calculation Example

```typescript
// MVP calculation with core parameters only
function calculateCompositeScore(idea: Idea): number {
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

// Example: scores of 4, 3, 4, 2, 3
// = (4*0.2) + (3*0.2) + (4*0.2) + (2*0.2) + (3*0.2)
// = 0.8 + 0.6 + 0.8 + 0.4 + 0.6
// = 3.20
```

### 4.6 Tier Assignment

```typescript
function assignTier(compositeScore: number): DecisionTier {
  if (compositeScore >= 4.0) return "hot";
  if (compositeScore >= 3.0) return "warm";
  if (compositeScore >= 2.0) return "park";
  return "discard";
}
```

---

## 5. Required Firestore Indexes

### 5.1 Single-Field Indexes (Automatic)

Firestore automatically indexes all fields. No action required for:
- `status`
- `category`
- `compositeScore`
- `createdAt`
- `updatedAt`
- `name`
- `tier`

### 5.2 Composite Indexes (Manual Configuration)

Create these indexes in `firestore.indexes.json`:

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
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "name", "order": "ASCENDING" }
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
        { "fieldPath": "tier", "order": "ASCENDING" },
        { "fieldPath": "compositeScore", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "compositeScore", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "notes",
      "queryScope": "COLLECTION",
      "fields": [
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
        { "fieldPath": "compositeScore", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "source", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "compositeScore", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "generationRuns",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### 5.3 Index Usage by Query

| Query Pattern | Index Required |
|---------------|----------------|
| Ideas by status, sorted by score | `status ASC, compositeScore DESC` |
| Ideas by status, sorted by date (newest) | `status ASC, createdAt DESC` |
| Ideas by status, sorted by date (updated) | `status ASC, updatedAt DESC` |
| Ideas by status, sorted by name | `status ASC, name ASC` |
| Ideas by category, sorted by score | `category ASC, compositeScore DESC` |
| Ideas by tier, sorted by score | `tier ASC, compositeScore DESC` |
| Ideas by status + category, sorted by score | `status ASC, category ASC, compositeScore DESC` |
| Notes by idea, sorted by date | `createdAt DESC` (subcollection) |
| Ideas by source, sorted by date (newest) | `source ASC, createdAt DESC` |
| Ideas by generation run, sorted by score | `generationRunId ASC, compositeScore DESC` |
| Ideas by source + status, sorted by score | `source ASC, status ASC, compositeScore DESC` |
| Generation runs, sorted by date (newest) | `timestamp DESC` |

---

## 6. Security Rules

### 6.1 Complete Rules File

Create `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Check if user owns this resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Validate string field with length constraints
    function isValidString(field, minLen, maxLen) {
      return field is string
        && field.size() >= minLen
        && field.size() <= maxLen;
    }

    // Validate score is integer 1-5
    function isValidScore(score) {
      return score is int && score >= 1 && score <= 5;
    }

    // Validate optional score (null or 1-5)
    function isValidOptionalScore(score) {
      return score == null || isValidScore(score);
    }

    // Validate composite score is number 1.0-5.0
    function isValidCompositeScore(score) {
      return score is number && score >= 1.0 && score <= 5.0;
    }

    // Validate idea status enum
    function isValidStatus(status) {
      return status in ['new', 'reviewing', 'pursuing', 'parked', 'rejected'];
    }

    // Validate idea category enum
    function isValidCategory(category) {
      return category in ['games', 'tools', 'saas', 'platforms', 'mobile', 'content', 'services', 'hardware', 'other'];
    }

    // Validate tier enum
    function isValidTier(tier) {
      return tier in ['hot', 'warm', 'park', 'discard'];
    }

    // Validate idea source enum
    function isValidSource(source) {
      return source in ['manual', 'ai-generated', 'trend-suggested', 'imported'];
    }

    // Validate scoring method enum
    function isValidScoringMethod(method) {
      return method in ['manual', 'ai-auto', 'ai-assisted'];
    }

    // Validate tags array
    function isValidTags(tags) {
      return tags is list
        && tags.size() <= 10;
      // Note: Individual tag validation (1-30 chars) should be done client-side
    }

    // Validate optional string array (sourceSignals, strengths, risks)
    function isValidOptionalStringArray(arr, maxSize) {
      return arr == null || (arr is list && arr.size() <= maxSize);
    }

    // Validate timestamp is server timestamp
    function isServerTimestamp(field) {
      return field == request.time;
    }

    // ============================================
    // USER DOCUMENT RULES
    // ============================================

    match /users/{userId} {
      // Allow user to read their own document
      allow read: if isOwner(userId);

      // Allow user to create their own document (on first login)
      allow create: if isOwner(userId)
        && request.resource.data.uid == userId
        && isValidString(request.resource.data.email, 3, 320)
        && isServerTimestamp(request.resource.data.createdAt)
        && isServerTimestamp(request.resource.data.lastLoginAt);

      // Allow user to update their own document
      allow update: if isOwner(userId)
        && request.resource.data.uid == userId
        && request.resource.data.email == resource.data.email // Email cannot change
        && request.resource.data.createdAt == resource.data.createdAt // CreatedAt cannot change
        && isServerTimestamp(request.resource.data.lastLoginAt);

      // Never allow delete (soft-delete pattern)
      allow delete: if false;

      // ============================================
      // IDEAS SUBCOLLECTION RULES
      // ============================================

      match /ideas/{ideaId} {
        // Allow owner to read all their ideas
        allow read: if isOwner(userId);

        // Allow owner to create ideas with validation
        allow create: if isOwner(userId)
          && isValidString(request.resource.data.name, 1, 100)
          && isValidString(request.resource.data.brief, 1, 500)
          && isValidCategory(request.resource.data.category)
          && isValidStatus(request.resource.data.status)
          && isValidSource(request.resource.data.source)
          && isValidScoringMethod(request.resource.data.scoringMethod)
          && isValidScore(request.resource.data.businessPotential)
          && isValidScore(request.resource.data.developmentComplexity)
          && isValidScore(request.resource.data.timeToMarket)
          && isValidScore(request.resource.data.competitionLevel)
          && isValidScore(request.resource.data.riskLevel)
          && isValidCompositeScore(request.resource.data.compositeScore)
          && isValidTier(request.resource.data.tier)
          && isValidOptionalStringArray(request.resource.data.sourceSignals, 10)
          && isValidOptionalStringArray(request.resource.data.strengths, 5)
          && isValidOptionalStringArray(request.resource.data.risks, 5)
          && isServerTimestamp(request.resource.data.createdAt)
          && isServerTimestamp(request.resource.data.updatedAt);

        // Allow owner to update ideas with validation
        allow update: if isOwner(userId)
          && isValidString(request.resource.data.name, 1, 100)
          && isValidString(request.resource.data.brief, 1, 500)
          && isValidCategory(request.resource.data.category)
          && isValidStatus(request.resource.data.status)
          && isValidSource(request.resource.data.source)
          && isValidScoringMethod(request.resource.data.scoringMethod)
          && isValidScore(request.resource.data.businessPotential)
          && isValidScore(request.resource.data.developmentComplexity)
          && isValidScore(request.resource.data.timeToMarket)
          && isValidScore(request.resource.data.competitionLevel)
          && isValidScore(request.resource.data.riskLevel)
          && isValidCompositeScore(request.resource.data.compositeScore)
          && isValidTier(request.resource.data.tier)
          && isValidOptionalStringArray(request.resource.data.sourceSignals, 10)
          && isValidOptionalStringArray(request.resource.data.strengths, 5)
          && isValidOptionalStringArray(request.resource.data.risks, 5)
          && request.resource.data.createdAt == resource.data.createdAt // CreatedAt cannot change
          && request.resource.data.source == resource.data.source // Source cannot change
          && request.resource.data.generationRunId == resource.data.generationRunId // RunId cannot change
          && isServerTimestamp(request.resource.data.updatedAt);

        // Allow owner to delete ideas (hard delete for permanent removal)
        allow delete: if isOwner(userId);

        // ============================================
        // NOTES SUBCOLLECTION RULES
        // ============================================

        match /notes/{noteId} {
          // Allow owner to read all notes
          allow read: if isOwner(userId);

          // Allow owner to create notes with validation
          allow create: if isOwner(userId)
            && isValidString(request.resource.data.content, 1, 2000)
            && isServerTimestamp(request.resource.data.createdAt)
            && isServerTimestamp(request.resource.data.updatedAt);

          // Allow owner to update notes
          allow update: if isOwner(userId)
            && isValidString(request.resource.data.content, 1, 2000)
            && request.resource.data.createdAt == resource.data.createdAt // CreatedAt cannot change
            && isServerTimestamp(request.resource.data.updatedAt);

          // Allow owner to delete notes
          allow delete: if isOwner(userId);
        }
      }

      // ============================================
      // GENERATION RUNS SUBCOLLECTION RULES
      // ============================================

      match /generationRuns/{runId} {
        // Allow owner to read generation run history
        allow read: if isOwner(userId);

        // No write from client - only Cloud Functions can write
        // Cloud Functions use Admin SDK which bypasses security rules
        allow create, update, delete: if false;
      }

      // ============================================
      // SETTINGS SUBCOLLECTION RULES
      // ============================================

      match /settings/{settingsId} {
        // Allow owner to read settings
        allow read: if isOwner(userId);

        // Allow owner to create/update settings
        allow create, update: if isOwner(userId);

        // Never allow delete
        allow delete: if false;
      }
    }

    // ============================================
    // CATCH-ALL: DENY EVERYTHING ELSE
    // ============================================

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 6.2 Security Rules Summary

| Collection | Read | Create | Update | Delete |
|------------|------|--------|--------|--------|
| `/users/{userId}` | Owner only | Owner only | Owner only | Never |
| `/users/{userId}/ideas/{ideaId}` | Owner only | Owner + validation | Owner + validation | Owner only |
| `/users/{userId}/ideas/{ideaId}/notes/{noteId}` | Owner only | Owner + validation | Owner + validation | Owner only |
| `/users/{userId}/generationRuns/{runId}` | Owner only | Never (Cloud Functions only) | Never | Never |
| `/users/{userId}/settings/{settingsId}` | Owner only | Owner only | Owner only | Never |

**Note**: Generation runs are created exclusively by Cloud Functions using the Admin SDK, which bypasses security rules. The client can only read generation run history.

### 6.3 Rate Limiting Considerations

Firestore doesn't have built-in rate limiting. Implement these at the application layer:

| Operation | Recommended Limit | Implementation |
|-----------|-------------------|----------------|
| Idea creation | 100/hour/user | Client-side throttle + Cloud Function validation |
| Note creation | 50/hour/idea | Client-side throttle |
| Batch operations | 500 documents | Firestore batch limit |
| Real-time listeners | 10 concurrent | Client connection management |

---

## 7. Data Lifecycle

### 7.1 Document Creation

#### User Document
- **When**: On first successful Firebase Auth login
- **How**: Cloud Function `onUserCreate` trigger or client-side on auth state change
- **Required fields**: `uid`, `email`, `createdAt`, `lastLoginAt`

```typescript
// Client-side user creation
async function createUserDocument(user: User): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      onboardingComplete: false
    });
  }
}
```

#### Idea Document
- **When**: User creates new idea manually or accepts AI-generated idea
- **How**: Client-side form submission
- **Required fields**: All core fields + scores + timestamps

```typescript
// Create new idea
async function createIdea(userId: string, ideaData: IdeaInput): Promise<string> {
  const ideasRef = collection(db, 'users', userId, 'ideas');

  const newIdea = {
    ...ideaData,
    compositeScore: calculateCompositeScore(ideaData),
    tier: assignTier(calculateCompositeScore(ideaData)),
    source: 'manual',
    noteCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(ideasRef, newIdea);
  return docRef.id;
}
```

### 7.2 Document Updates

#### Timestamp Management
- `updatedAt` must be set to `serverTimestamp()` on every update
- `createdAt` must never be modified after creation

```typescript
// Update idea
async function updateIdea(
  userId: string,
  ideaId: string,
  updates: Partial<Idea>
): Promise<void> {
  const ideaRef = doc(db, 'users', userId, 'ideas', ideaId);

  // Recalculate composite score if any score changed
  const scoreFields = [
    'businessPotential', 'developmentComplexity', 'timeToMarket',
    'competitionLevel', 'riskLevel'
  ];

  const hasScoreChange = scoreFields.some(f => f in updates);

  const updateData: any = {
    ...updates,
    updatedAt: serverTimestamp()
  };

  if (hasScoreChange) {
    // Fetch current values, merge with updates, recalculate
    const current = (await getDoc(ideaRef)).data();
    const merged = { ...current, ...updates };
    updateData.compositeScore = calculateCompositeScore(merged);
    updateData.tier = assignTier(updateData.compositeScore);
  }

  await updateDoc(ideaRef, updateData);
}
```

### 7.3 Soft Delete vs Hard Delete

#### Soft Delete (Recommended for Ideas)
- Change `status` to `"rejected"`
- Idea remains in database but hidden from default views
- Preserves data for potential recovery or analytics

```typescript
// Soft delete (archive) an idea
async function archiveIdea(userId: string, ideaId: string): Promise<void> {
  await updateIdea(userId, ideaId, { status: 'rejected' });
}
```

#### Hard Delete (Notes, User Request)
- Permanently removes document from Firestore
- Use for notes deletion or when user explicitly requests permanent removal
- Include confirmation dialog in UI

```typescript
// Hard delete an idea and all its notes
async function deleteIdea(userId: string, ideaId: string): Promise<void> {
  const ideaRef = doc(db, 'users', userId, 'ideas', ideaId);
  const notesRef = collection(ideaRef, 'notes');

  // Delete all notes first (subcollection)
  const notesSnap = await getDocs(notesRef);
  const batch = writeBatch(db);
  notesSnap.docs.forEach(noteDoc => {
    batch.delete(noteDoc.ref);
  });

  // Delete the idea
  batch.delete(ideaRef);

  await batch.commit();
}
```

### 7.4 Generation Data Lifecycle

#### Generation Run History Retention

- **Retention Policy**: Keep last 100 runs per user
- **Archival**: Older runs can be archived to Cloud Storage for analytics
- **Cleanup**: Implement Cloud Function to prune old runs monthly

```typescript
// Prune old generation runs (keep last 100)
async function pruneGenerationRuns(userId: string): Promise<void> {
  const runsRef = collection(db, 'users', userId, 'generationRuns');
  const runsQuery = query(runsRef, orderBy('timestamp', 'desc'), limit(1000));
  const snapshot = await getDocs(runsQuery);

  if (snapshot.size > 100) {
    const batch = writeBatch(db);
    const toDelete = snapshot.docs.slice(100); // Keep first 100

    for (const doc of toDelete) {
      batch.delete(doc.ref);
    }

    await batch.commit();
  }
}
```

#### AI-Generated Idea Field Limits

| Field | Max Items | Max Chars Per Item | Total Max Chars |
|-------|-----------|-------------------|-----------------|
| `sourceSignals` | 10 | 200 | 2000 |
| `strengths` | 5 | 200 | 1000 |
| `risks` | 5 | 200 | 1000 |
| `elevatorPitch` | N/A | N/A | 500 |
| `businessPlan.targetMarket` | N/A | N/A | 500 |
| `businessPlan.monetization` | N/A | N/A | 500 |
| `businessPlan.goToMarket` | N/A | N/A | 500 |
| `businessPlan.competitiveAdvantage` | N/A | N/A | 500 |

#### Freshness Tracking (viewedAt)

The `viewedAt` field enables the "NEW" badge feature:

```typescript
// Mark idea as viewed (first time only)
async function markIdeaViewed(userId: string, ideaId: string): Promise<void> {
  const ideaRef = doc(db, 'users', userId, 'ideas', ideaId);
  const ideaSnap = await getDoc(ideaRef);

  if (ideaSnap.exists() && !ideaSnap.data().viewedAt) {
    await updateDoc(ideaRef, {
      viewedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
}

// Query for unviewed ideas (new ideas)
function getUnviewedIdeasQuery(userId: string) {
  const ideasRef = collection(db, 'users', userId, 'ideas');
  return query(
    ideasRef,
    where('viewedAt', '==', null),
    orderBy('createdAt', 'desc')
  );
}
```

---

### 7.5 Note Count Denormalization

Keep `noteCount` on the idea document in sync with actual notes:

```typescript
// Add note with count update
async function addNote(
  userId: string,
  ideaId: string,
  content: string
): Promise<string> {
  const ideaRef = doc(db, 'users', userId, 'ideas', ideaId);
  const notesRef = collection(ideaRef, 'notes');

  const batch = writeBatch(db);

  // Add the note
  const noteRef = doc(notesRef);
  batch.set(noteRef, {
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // Increment note count
  batch.update(ideaRef, {
    noteCount: increment(1),
    updatedAt: serverTimestamp()
  });

  await batch.commit();
  return noteRef.id;
}

// Delete note with count update
async function deleteNote(
  userId: string,
  ideaId: string,
  noteId: string
): Promise<void> {
  const ideaRef = doc(db, 'users', userId, 'ideas', ideaId);
  const noteRef = doc(ideaRef, 'notes', noteId);

  const batch = writeBatch(db);
  batch.delete(noteRef);
  batch.update(ideaRef, {
    noteCount: increment(-1),
    updatedAt: serverTimestamp()
  });

  await batch.commit();
}
```

---

## 8. Migration Considerations

### 8.1 Schema Versioning

Add a `schemaVersion` field to support future migrations:

```typescript
// Add to user document
{
  schemaVersion: 1,
  // ... other fields
}

// Add to idea document
{
  schemaVersion: 1,
  // ... other fields
}
```

### 8.2 Adding New Fields

When adding new fields in future versions:

1. **Optional fields**: Add with `null` default, backfill asynchronously
2. **Required fields**: Add migration script before deployment
3. **Enum changes**: Add new values (never remove existing ones)

```typescript
// Migration script example: Add new field to all ideas
async function migrateIdeasV2(userId: string): Promise<void> {
  const ideasRef = collection(db, 'users', userId, 'ideas');
  const snapshot = await getDocs(ideasRef);

  const batch = writeBatch(db);
  let count = 0;

  for (const ideaDoc of snapshot.docs) {
    if (!ideaDoc.data().schemaVersion || ideaDoc.data().schemaVersion < 2) {
      batch.update(ideaDoc.ref, {
        schemaVersion: 2,
        newField: null,  // Add new field with default
        updatedAt: serverTimestamp()
      });
      count++;

      // Firestore batch limit is 500
      if (count >= 400) {
        await batch.commit();
        count = 0;
      }
    }
  }

  if (count > 0) {
    await batch.commit();
  }
}
```

### 8.3 Breaking Changes

For breaking schema changes:

1. Create new collection (e.g., `ideas_v2`)
2. Run migration script to copy/transform data
3. Update client code to use new collection
4. Keep old collection read-only for rollback period
5. Delete old collection after confirmation

### 8.4 Backup Strategy

- **Automatic**: Enable Firestore scheduled backups (daily)
- **Pre-migration**: Export full database before any migration
- **Point-in-time**: Use Firestore point-in-time recovery (if enabled)

```bash
# Manual backup command
gcloud firestore export gs://your-bucket/backups/$(date +%Y%m%d)
```

---

## 9. TypeScript Type Definitions

For client-side type safety, use these definitions:

```typescript
// types/firestore.ts

import { Timestamp } from 'firebase/firestore';

// ============================================
// ENUMS
// ============================================

export type IdeaStatus = 'new' | 'reviewing' | 'pursuing' | 'parked' | 'rejected';
export type IdeaCategory = 'games' | 'tools' | 'saas' | 'platforms' | 'mobile' | 'content' | 'services' | 'hardware' | 'other';
export type IdeaSource = 'manual' | 'ai-generated' | 'trend-suggested' | 'imported';
export type DecisionTier = 'hot' | 'warm' | 'park' | 'discard';
export type ScoringMethod = 'manual' | 'ai-auto' | 'ai-assisted';
export type WeightPreset = 'default' | 'conservative' | 'aggressive' | 'solo-founder' | 'custom';
export type TradeoffFlag = 'high-risk-high-reward' | 'hidden-gem' | 'grind-play' | 'quick-win' | 'moonshot';
export type GenerationSource = 'x' | 'polymarket' | 'googlenews';
export type GenerationTrigger = 'manual' | 'scheduled';

// ============================================
// DOCUMENT INTERFACES
// ============================================

export interface User {
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
  ideasPerRun: number;
  preferredCategories: string[] | null;

  // Generation State
  lastGenerationRun: Timestamp | null;
  generationRunCount: number;
}

export interface BusinessPlan {
  targetMarket: string;
  monetization: string;
  goToMarket: string;
  competitiveAdvantage: string;
}

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
  tradeoffFlags: TradeoffFlag[];

  // Pipeline source tracking (AI-generated ideas)
  sourceSignals: string[] | null;
  generationRunId: string | null;

  // AI content
  elevatorPitch: string | null;
  strengths: string[];
  risks: string[];
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

export interface Note {
  id: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface StageDetails {
  collecting?: { duration: number; success: boolean };
  analyzing?: { duration: number; signalsFound: number };
  generating?: { duration: number; ideasGenerated: number };
  scoring?: { duration: number };
  saving?: { duration: number; ideasSaved: number };
}

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
  duration: number;
  errors: string[];

  // Stage details (optional - for debugging)
  stages?: StageDetails;
}

export interface CustomWeights {
  businessPotential: number;
  developmentComplexity: number;
  timeToMarket: number;
  competitionLevel: number;
  riskLevel: number;
  trendAlignment?: number;
  founderMarketFit?: number;
  growthPotential?: number;
  defensibility?: number;
  capitalEfficiency?: number;
}

export interface UserSettings {
  weightPreset: WeightPreset;
  customWeights: CustomWeights | null;
  defaultSort: string;
  defaultView: string;
  showArchivedIdeas: boolean;
}

// ============================================
// INPUT TYPES (for forms)
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

export interface CreateNoteInput {
  content: string;
}
```

---

## 10. Summary Checklist

### Pre-Implementation Checklist

- [ ] Create Firebase project
- [ ] Enable Firestore in production mode
- [ ] Enable Firebase Auth (Email/Password + Google)
- [ ] Deploy `firestore.rules`
- [ ] Deploy `firestore.indexes.json`
- [ ] Enable Firestore scheduled backups
- [ ] Set up Firebase Functions (for future migrations)

### Schema Implementation Checklist

- [ ] Create TypeScript types (`types/firestore.ts`)
- [ ] Implement user document creation on auth (with generation settings defaults)
- [ ] Implement idea CRUD operations (with pipeline field support)
- [ ] Implement note CRUD operations with count sync
- [ ] Implement composite score calculation
- [ ] Implement tier assignment
- [ ] Implement settings read/write
- [ ] Add real-time listeners for ideas
- [ ] Add pagination for ideas list
- [ ] Add offline persistence configuration
- [ ] Implement viewedAt freshness tracking for "NEW" badges
- [ ] Implement generation run history read (client-side)
- [ ] Set up Cloud Functions for generation pipeline (writes to generationRuns)

### Validation Checklist

- [ ] Test security rules with Firebase Emulator
- [ ] Test all query patterns with sample data (including source/runId queries)
- [ ] Verify index creation (check Firestore console for 12 composite indexes)
- [ ] Test offline mode behavior
- [ ] Test concurrent updates
- [ ] Load test with 1000+ ideas
- [ ] Verify generationRuns are read-only from client
- [ ] Test generation run history pagination
- [ ] Verify viewedAt updates correctly on first view

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | April 8, 2026 | Hana Rosenberg | Initial schema specification |
| 1.1 | April 8, 2026 | Hana Rosenberg | Pipeline-first MVP: Added generation settings to User, GenerationRuns collection, pipeline fields to Idea, new indexes, updated security rules |

---

*End of Firestore Schema Specification*
