# AI Solution Generator Module Specification

**Status**: Implementation-Ready
**Version**: 1.2
**Date**: April 8, 2026
**Author**: Wei-Ivanov (Tech Specs Team)
**Reference**: `docs/technical/backend-pipeline-spec.md`
**Purpose**: Generate AI-native app ideas from competitor friction analysis

---

## 1. Executive Summary

The AI Solution Generator is a new data source module for the Idea Forge pipeline. Unlike trend-based sources (X, Polymarket, News), this module generates ideas by:

1. **Analyzing competitor friction points** (e.g., "MyFitnessPal requires 90 seconds to log a meal")
2. **Mapping each friction to AI solutions** (e.g., "Zero-touch meal logging via photo + prediction")
3. **Outputting AI-native app ideas** with unique fields that distinguish them from trend-derived ideas

**Key Differentiator**: Ideas from this module are not trend-reactive—they're strategically designed to disrupt existing markets with AI-powered UX transformations.

---

## 2. Architecture Overview

```
��────────────────────────────��────────────────────────────────────────────────┐
│                     AI SOLUTION GENERATOR MODULE                             │
├───────���─────────────────────────────────────────────────────────────��───────┤
│                                                                              │
│  INPUT                                                                       │
│  ─────                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Friction Analysis Data                            │    │
│  │  - Competitor profiles (apps, market share, weaknesses)              │    │
│  │  - Friction points (scored, categorized, with user evidence)         │    │
│  │  - Market context (trends, opportunities, user pain quotes)          │    │
│  └─────────────��───────────────────────────���───────────────────────────┘    │
│                                   │                                          │
│                                   ▼                                          │
│  PROCESSING                                                                  │
│  ──────────                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                  STAGE 1: Friction Clustering                        │    │
│  ��  - Group related friction points across competitors                  │    │
│  │  - Identify cross-app patterns                                       │    │
│  │  - Prioritize by combined score and frequency                        │    │
│  └──────��─────────────────────────────────��───────────────────────────���┘    │
│                                   │                                          │
│                                   ▼                                          │
│  ┌────────────────────────────────────────────────────────────────���────┐    │
│  │                  STAGE 2: AI Solution Mapping                        │    │
│  │  - Map each friction cluster to AI solution patterns                 │    │
│  │  - Select optimal AI approach (vision, NLP, prediction, etc.)        │    │
│  │  - Calculate effort reduction potential                              │    │
│  │  - Determine automation level (Level 2 or 3 only)                    │    │
│  ��─────────────────────────────────────────────────────────────────────┘    │
���                                   │                                          │
│                                   ��                                          │
│  ┌──────���────────────────────────────────��─────────────────────────────┐    │
│  │                  STAGE 3: Idea Generation                            │    │
│  │  - Generate app concept from AI solution                             │    │
│  │  - Create USP statement                                              │    ���
│  │  - Estimate technical requirements and costs                         │    │
│  │  - Output AI-native idea schema                                      │    │
│  └─────────────────────────────────────���───────────────────────────��───┘    │
��                                   │                                          │
│                                   ▼                                          │
│  OUTPUT                                                                      │
│  ──────                                                                      │
│  ┌───��────────────────────────��───────────────────────��────────────────┐    │
│  │                    AI-Native Idea Schema                             │    │
│  │  - Standard idea fields (name, brief, category, tags)                │    │
│  │  - AI-specific fields (frictionSource, aiApproach, effortReduction)  │    │
│  │  - USP and competitive positioning                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──���─────────────────────────────────────────��───────────────────────────��────┘
```

---

## 3. Input Schema

### 3.1 Friction Point Structure

Each friction point represents a specific user pain discovered in competitor analysis.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | String | Unique identifier | "FP-MFP-001" |
| `title` | String | Short description | "Manual Food Search Every Meal" |
| `description` | String | Detailed pain description | "Users must type food names and scroll through 50+ results..." |
| `competitor` | String | Which app this was found in | "MyFitnessPal" |
| `category` | Enum | Type of friction (see below) | "input" |
| `score` | Number (0-100) | Composite friction score | 94 |
| `priority` | Enum | P0/P1/P2/P3 | "P0" |
| `journeyStage` | Enum | Where in user journey | "core-usage" |
| `frequency` | Number (1-5) | How often encountered | 5 |
| `severity` | Number (1-5) | How painful when encountered | 5 |
| `automationFeasibility` | Number (1-5) | How automatable with AI | 5 |
| `currentState.stepsRequired` | Number | Current steps needed | 9 |
| `currentState.timeRequired` | String | Current time needed | "30-45 seconds per item" |
| `currentState.effortLevel` | Enum | low/medium/high/very-high | "high" |
| `desiredState.stepsRequired` | Number | Target steps | 1 |
| `desiredState.timeRequired` | String | Target time | "2 seconds" |
| `desiredState.effortLevel` | Enum | Target effort | "low" |
| `userEvidence` | Array of Strings | Real user quotes | ["Constantly weighing things..."] |
| `isIndustryWide` | Boolean | Affects multiple competitors | true |
| `affectedCompetitors` | Array of Strings | Other apps with same issue | ["Lose It!", "Yazio"] |

**Friction Categories:**
- `input` — Manual data entry, typing, searching
- `navigation` — Too many taps, screens, menus
- `cognitive` — Mental effort, decision fatigue
- `repetitive` — Same actions repeatedly
- `waiting` — Loading, animations, delays
- `decision` — Choices, confirmations, options

### 3.2 Competitor Profile Structure

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | String | App name | "MyFitnessPal" |
| `category` | String | App category | "Calorie Tracking" |
| `primaryJTBD` | String | Job-to-be-done | "Track calorie intake" |
| `valueProposition` | String | Core value prop | "World's largest food database" |
| `targetPersona` | String | Primary user type | "Health-conscious adult" |
| `marketPosition.downloads` | String | Install count | "200M+ lifetime" |
| `marketPosition.monthlyRevenue` | String | Revenue | "$12M" |
| `marketPosition.growthTrend` | Enum | growing/stable/declining | "declining" |
| `pricing.hasFreeTier` | Boolean | Free tier available | true |
| `pricing.premiumPrice` | String | Premium cost | "$79.99/year" |
| `strengths` | Array of Strings | Key advantages | ["Large database", "Brand recognition"] |
| `weaknesses` | Array of Strings | Key disadvantages | ["Slow logging", "Ads"] |
| `frictionPointIds` | Array of Strings | Associated frictions | ["FP-MFP-001", "FP-MFP-002"] |
| `avgFrictionScore` | Number | Average friction | 71.8 |

### 3.3 Market Context Structure

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `category` | String | Market category | "Health & Fitness - Calorie Tracking" |
| `marketSize` | String | TAM | "$10B globally" |
| `trends` | Array of Strings | Market trends | ["AI integration", "Wearable sync"] |
| `userSegments` | Array of Objects | User types | See below |
| `userPriorities` | Array of Strings | What users value | ["Speed", "Accuracy", "Ease of use"] |
| `industryWidePainPoints` | Array of Strings | Common complaints | ["Too much typing", "Inaccurate portions"] |
| `opportunities` | Array of Objects | Identified opportunities | See below |

**User Segment Object:**
| Field | Type | Example |
|-------|------|---------|
| `segment` | String | "Weight Loss Seekers" |
| `size` | String | "60% of market" |
| `primaryNeed` | String | "Quick, accurate calorie tracking" |

**Opportunity Object:**
| Field | Type | Example |
|-------|------|---------|
| `opportunity` | String | "AI-powered photo logging" |
| `confidence` | Enum | "high" |
| `reasoning` | String | "Top complaint, mature AI available" |

### 3.4 Generator Input Parameters

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `maxIdeas` | Number | 10 | Maximum ideas to generate |
| `minFrictionScore` | Number | 60 | Only consider frictions scoring above this |
| `priorityFilter` | Array | null | Only include P0, P1, etc. |
| `categoryFilter` | Array | null | Only include specific friction categories |
| `minAutomationLevel` | Number | 2 | Only Level 2 or Level 3 solutions |

---

## 4. AI Processing Pipeline

### 4.1 Stage 1: Friction Clustering

**Purpose:** Group related friction points across competitors into themes.

**Input:** Array of friction points from all competitors

**Output:** Array of friction clusters

**Cluster Output Structure:**

| Field | Type | Description |
|-------|------|-------------|
| `clusterId` | String | Unique cluster ID (e.g., "CLU-001") |
| `theme` | String | Cluster theme (e.g., "Manual Data Entry") |
| `frictionPointIds` | Array | IDs of frictions in this cluster |
| `combinedScore` | Number | Weighted average score |
| `competitorsAffected` | Number | Count of affected apps |
| `isIndustryWide` | Boolean | True if 2+ competitors |
| `solutionPriority` | Number | Priority ranking for solution |

**Gemini Prompt Design:**

The prompt should instruct Gemini to:
1. Analyze all friction points
2. Group by underlying user problem (not surface symptoms)
3. Combine related issues across apps (e.g., "manual food search" + "typing each ingredient" → "Manual Data Entry")
4. Calculate combined score as weighted average of individual scores
5. Mark as industry-wide if affecting 2+ competitors
6. Return top 10 clusters sorted by: `combined_score × competitors_affected`

**Gemini Configuration:**
- Model: gemini-1.5-pro
- Response format: JSON
- Temperature: 0.3 (low, for consistent clustering)

### 4.2 Stage 2: AI Solution Mapping

**Purpose:** Map each friction cluster to an AI solution approach.

**Input:** Friction clusters + Market context

**Output:** AI solution mapping for each cluster

**Solution Mapping Structure:**

| Field | Type | Description |
|-------|------|-------------|
| `clusterId` | String | Which cluster this solves |
| `solutionName` | String | Solution name (e.g., "Zero-Touch Meal Logging") |
| `solutionDescription` | String | 1-2 sentence description |
| `aiApproaches` | Array | AI approaches used |
| `primaryApproach` | String | Main AI approach |
| `automationLevel` | Number | 2 or 3 only (never 0 or 1) |
| `effortReduction` | Number | Percentage (70-95%) |
| `transformation.before` | String | Current painful experience |
| `transformation.after` | String | New magical experience |
| `technicalRequirements.apis` | Array | APIs needed |
| `technicalRequirements.onDevice` | Array | On-device components |
| `technicalRequirements.infrastructure` | Array | Backend needs |
| `estimatedCostPerUser` | String | Monthly cost estimate |
| `complexity` | Enum | low/medium/high |
| `mvpTimeline` | String | Timeline estimate |

**AI Approaches Available:**

| Approach | Description | Use Case |
|----------|-------------|----------|
| `multimodal-vision` | Image/photo analysis via GPT-4o Vision or Gemini Vision | Extract data from photos |
| `nlp-extraction` | LLM parsing of natural language | Recipe text → ingredients |
| `voice-to-action` | Whisper + LLM for voice commands | "Log my breakfast" |
| `predictive-learning` | On-device ML learning patterns | Predict meals from history |
| `contextual-inference` | Time, location, calendar context | Infer meal type from context |
| `continuous-learning` | Model improves from corrections | Get smarter over time |
| `autonomous-agent` | Multi-step task execution | Complete workflows |
| `proactive-notification` | AI initiates based on patterns | Alert at mealtime |

**Automation Levels:**

| Level | Description | Our Policy |
|-------|-------------|------------|
| 0 | User does everything | Never use |
| 1 | AI suggests, user confirms | Never use (incremental) |
| 2 | AI acts, user can override | Minimum acceptable |
| 3 | AI acts autonomously, user reviews | Ideal target |

**Gemini Prompt Design:**

The prompt should:
1. Present the friction clusters
2. Explain the automation level constraint (Level 2-3 only)
3. List available AI approaches
4. Ask for: solution name, approaches used, automation level, effort reduction %, transformation before/after, technical requirements, cost, complexity, timeline
5. Instruct realistic estimates (not everything is 90%+ reduction)

**Gemini Configuration:**
- Model: gemini-1.5-pro
- Response format: JSON
- Temperature: 0.5 (moderate, for creative but grounded solutions)

### 4.3 Stage 3: Idea Generation

**Purpose:** Generate complete app ideas from solution mappings.

**Input:** Solution mappings + Clusters + Market context + Competitors

**Output:** AI-native idea objects

**Gemini Prompt Design:**

The prompt should:
1. Present solution mappings with their cluster context
2. Instruct generation of brandable app names
3. Require USP statements in the format: "[App] achieves [outcome] that [Competitor] requires [X] to accomplish—with [Y] user action."
4. Request quantified transformation claims
5. Ask for technical overview (APIs, costs, timeline)

**Gemini Configuration:**
- Model: gemini-1.5-pro
- Response format: JSON
- Temperature: 0.7 (higher for creative naming/branding)

---

## 5. Output Schema: AI-Native Idea

### 5.1 How AI-Native Ideas Differ from Regular Ideas

| Field | Regular Idea | AI-Native Idea |
|-------|--------------|----------------|
| `source` | "ai-generated" or "trend-suggested" | "friction-derived" |
| `sourceSignals` | Trend topics, news headlines | Friction point IDs |
| `frictionSource` | Not present | Detailed friction origin |
| `aiApproach` | Not present | AI solution architecture |
| `usp` | Not present | Quantified transformation claim |
| `technicalOverview` | Not present | APIs, costs, timeline |
| `displayLabel` | "AI Generated" or "Trending" | "App Store Insight" |
| `labelColor` | "blue" or "green" | "purple" |
| `labelIcon` | "sparkles" or "trending-up" | "store" |

### 5.2 Standard Fields (Same as Regular Ideas)

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | App/product name |
| `brief` | String | 1-2 sentence description |
| `category` | String | Category (e.g., "Health & Fitness") |
| `tags` | Array of Strings | Filtering tags |
| `status` | Enum | new/exploring/validated/building/parked/discarded |
| `source` | String | Always "friction-derived" for this module |
| `businessPotential` | Number (1-5) | Revenue opportunity score |
| `developmentComplexity` | Number (1-5) | 5 = easiest |
| `timeToMarket` | Number (1-5) | 5 = fastest |
| `competitionLevel` | Number (1-5) | 5 = least competition |
| `riskLevel` | Number (1-5) | 5 = lowest risk |
| `compositeScore` | Number | Weighted average |
| `tier` | Enum | hot/warm/park/discard |
| `strengths` | Array of Strings | Key advantages |
| `risks` | Array of Strings | Key challenges |
| `businessPlan.targetMarket` | String | Who we're targeting |
| `businessPlan.monetization` | String | How we make money |
| `businessPlan.goToMarket` | String | Launch strategy |
| `businessPlan.competitiveAdvantage` | String | Defensibility |
| `elevatorPitch` | String | 2-3 sentence pitch |

### 5.3 AI-Native Specific Fields

**Friction Source Object:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `clusterId` | String | Which cluster addressed | "CLU-001" |
| `clusterTheme` | String | Theme name | "Manual Data Entry" |
| `frictionPointIds` | Array | Original friction IDs | ["FP-MFP-001", "FP-LI-001"] |
| `competitorsDisrupted` | Array | Apps being disrupted | ["MyFitnessPal", "Lose It!"] |
| `combinedFrictionScore` | Number | Cluster score | 92 |
| `isIndustryWide` | Boolean | Cross-competitor issue | true |

**AI Approach Object:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `primary` | String | Main AI approach | "predictive-learning" |
| `secondary` | Array | Supporting approaches | ["multimodal-vision"] |
| `automationLevel` | Number | 2 or 3 | 3 |
| `effortReduction` | Number | Percentage | 95 |
| `description` | String | How AI is used | "On-device ML predicts meals..." |

**USP Object:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `statement` | String | Full USP | "MealSnap logs your meal..." |
| `transformation.before` | String | Current pain | "90 seconds, 15+ taps" |
| `transformation.after` | String | New experience | "5 seconds, 0-1 taps" |
| `quantifiedClaim` | String | Marketing claim | "95% less effort" |
| `primaryCompetitor` | String | Comparison target | "MyFitnessPal" |

**Technical Overview Object:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `coreAPIs` | Array | APIs needed | ["GPT-4o Vision", "Whisper"] |
| `onDeviceComponents` | Array | Local components | ["Core ML prediction model"] |
| `infrastructure` | Array | Backend needs | ["Firebase Functions"] |
| `estimatedCostPerUser` | String | Monthly cost | "$0.50-1.00" |
| `mvpComplexity` | Enum | low/medium/high | "medium" |
| `mvpTimeline` | String | Timeline | "6-8 weeks" |
| `technicalRisks` | Array | Key risks | ["API rate limits"] |

### 5.4 Display Label / Ribbon Fields

Ideas from friction analysis should have a visual ribbon/badge to distinguish them from other idea sources in the UI.

**Display Label Fields:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `displayLabel` | String | Visual label text for UI ribbon | "App Store Insight" |
| `labelColor` | String | Ribbon color identifier | "purple" |
| `labelIcon` | String | Icon identifier for ribbon | "store" |

**Source Differentiation Table:**

| Source Value | Ribbon Text | Color | Icon | Notes |
|--------------|-------------|-------|------|-------|
| `ai-generated` | "AI Generated" | Blue | sparkles | Trend-based ideas from X, Polymarket, News |
| `friction-derived` | "App Store Insight" | Purple | store | Ideas from competitor friction analysis |
| `trend-suggested` | "Trending" | Green | trending-up | Ideas from trending topics |
| `manual` | (no ribbon) | - | - | User-created ideas |

**UI Display Rules:**

1. **Ribbon Position**: Top-left corner of IdeaCard component (same positioning logic as "NEW" badge)
2. **Ribbon Text**: "App Store Insight" — short text that fits standard ribbon width
3. **Ribbon Style**: Purple/indigo color to visually distinguish from trend-based (blue) and manual (gray) ideas
4. **Hover Tooltip**: On hover, display: "Generated from competitor friction analysis"
5. **Priority**: If multiple labels apply, show the most specific (friction-derived > ai-generated > trend-suggested)

**Default Values for Friction-Derived Ideas:**

When generating ideas from this module, automatically set:
- `displayLabel`: "App Store Insight"
- `labelColor`: "purple"
- `labelIcon`: "store"

### 5.5 Example Firestore Document

```
Collection: /users/{userId}/ideas
Document: {auto-generated-id}

{
  "name": "MealSnap",
  "brief": "AI-powered calorie tracking that predicts and logs meals automatically.",
  "category": "Health & Fitness",
  "tags": ["ai", "calorie-tracking", "photo-recognition", "health"],
  "status": "new",
  "source": "friction-derived",

  "displayLabel": "App Store Insight",
  "labelColor": "purple",
  "labelIcon": "store",

  "businessPotential": 5,
  "developmentComplexity": 3,
  "timeToMarket": 3,
  "competitionLevel": 4,
  "riskLevel": 3,
  "compositeScore": 3.7,
  "tier": "warm",

  "strengths": ["Addresses #1 user complaint", "Clear 10x demo", "Mature APIs"],
  "risks": ["API costs scale", "Accuracy varies", "Competitors may copy"],
  "businessPlan": {
    "targetMarket": "Health-conscious adults frustrated with manual tracking",
    "monetization": "Freemium with premium AI features",
    "goToMarket": "Target MyFitnessPal users on social media",
    "competitiveAdvantage": "First-mover on zero-touch, data moat"
  },
  "elevatorPitch": "MealSnap is the calorie tracker that works...",

  "frictionSource": {
    "clusterId": "CLU-001",
    "clusterTheme": "Manual Data Entry",
    "frictionPointIds": ["FP-MFP-001", "FP-LI-001"],
    "competitorsDisrupted": ["MyFitnessPal", "Lose It!", "Yazio"],
    "combinedFrictionScore": 92,
    "isIndustryWide": true
  },

  "aiApproach": {
    "primary": "predictive-learning",
    "secondary": ["multimodal-vision", "contextual-inference"],
    "automationLevel": 3,
    "effortReduction": 95,
    "description": "On-device ML predicts meals; GPT-4o Vision extracts from photos"
  },

  "usp": {
    "statement": "MealSnap logs meals that MyFitnessPal requires 90 seconds for—with one tap.",
    "transformation": {
      "before": "90 seconds, 15+ taps per meal",
      "after": "5 seconds, 0-1 taps per meal"
    },
    "quantifiedClaim": "95% less effort than MyFitnessPal",
    "primaryCompetitor": "MyFitnessPal"
  },

  "technicalOverview": {
    "coreAPIs": ["GPT-4o Vision", "Whisper"],
    "onDeviceComponents": ["Core ML prediction model"],
    "infrastructure": ["Firebase Functions", "Firestore"],
    "estimatedCostPerUser": "$0.50-1.00/month",
    "mvpComplexity": "medium",
    "mvpTimeline": "6-8 weeks",
    "technicalRisks": ["API rate limits", "Photo quality variance"]
  },

  "analysisId": "analysis_20260408",
  "generationRunId": "run_abc123",
  "scoringMethod": "ai-friction-analysis",
  "createdAt": {timestamp},
  "updatedAt": {timestamp}
}
```

---

## 6. Integration with generateIdeas Cloud Function

### 6.1 New Data Source

Add `friction-analysis` as a new source option alongside existing sources:

| Source | Description | Ideas Per Run |
|--------|-------------|---------------|
| `x` | X/Twitter trends via Grok | 3-5 |
| `polymarket` | Prediction market signals | 2-3 |
| `googlenews` | News headlines | 2-3 |
| `friction-analysis` | **Competitor friction analysis** | **5-10** |

### 6.2 Pipeline Integration

The generateIdeas function should branch based on source type:

```
┌─────────────────────────────────────────────────────────────────┐
│                    generateIdeas PIPELINE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STAGE 1: Fetch from sources (parallel)                         │
│  ├─ fetchXTrends() → X data                                     │
│  ├─ fetchPolymarket() → Polymarket data                         │
│  ├─ fetchGoogleNews() → News data                               │
│  └─ fetchFrictionAnalysis() → Friction data     ← NEW           │
│                                                                  │
│  BRANCH A: Trend sources (X, Polymarket, News)                   │
│  ├─ analyzeSignals() → opportunities, pain points               │
│  ���─ generateFromSignals() → raw ideas                           │
│  └─ scoreIdeas() → scored ideas                                  │
│                                                                  │
│  BRANCH B: Friction source                       ← NEW BRANCH   │
│  ├─ clusterFrictions() → friction clusters                      │
│  ├─ mapFrictionsToSolutions() → AI solutions                    │
│  ├─ generateAINativeIdeas() → AI-native ideas                   │
│  ���─ scoreAINativeIdeas() → scored ideas                         │
│                                                                  │
│  STAGE 5: Merge and save                                         │
│  └─ saveIdeas() → all ideas to Firestore                        │
│                                                                  │
└────���────────────────────────────────────────────────────────────┘
```

### 6.3 Fetch Function Behavior

The `fetchFrictionAnalysis` function should:

1. Accept optional `analysisId` parameter
2. If no ID provided, fetch the most recent analysis for the user
3. Query from: `/users/{userId}/frictionAnalyses/{analysisId}`
4. Return the friction data structure or null if not found

### 6.4 Generation Config Updates

Add these fields to the generation config:

| Field | Type | Description |
|-------|------|-------------|
| `sources` | Array | Include "friction-analysis" as option |
| `frictionAnalysisId` | String (optional) | Specific analysis to use |

### 6.5 Scoring Adjustments for AI-Native Ideas

When scoring AI-native ideas, apply bonus factors:

| Condition | Adjustment |
|-----------|------------|
| Industry-wide friction (2+ competitors) | +0.5 to businessPotential |
| Automation Level 3 (fully autonomous) | +0.3 to compositeScore |
| Effort reduction > 90% | +0.3 to businessPotential |

---

## 7. API Endpoints

### 7.1 Upload Friction Analysis

**Endpoint:** `POST /api/friction-analysis`

**Purpose:** Upload friction analysis data for idea generation

**Authentication:** Bearer token (Firebase Auth)

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| `market` | Market Context Object | Yes |
| `competitors` | Array of Competitor Profiles | Yes |
| `frictionPoints` | Array of Friction Points | Yes |

**Response (Success):**

| Field | Type |
|-------|------|
| `success` | true |
| `analysisId` | String |
| `frictionPointCount` | Number |
| `competitorCount` | Number |

### 7.2 Generate from Friction

**Endpoint:** `POST /api/generate`

**Request Body (with friction source):**

| Field | Type | Description |
|-------|------|-------------|
| `sources` | Array | Include "friction-analysis" |
| `ideasPerRun` | Number | How many ideas |
| `frictionAnalysisId` | String (optional) | Specific analysis |

### 7.3 List Friction Analyses

**Endpoint:** `GET /api/friction-analyses`

**Response:**

| Field | Type |
|-------|------|
| `analyses` | Array of analysis summaries |
| `analyses[].id` | String |
| `analyses[].market` | String |
| `analyses[].competitorCount` | Number |
| `analyses[].frictionPointCount` | Number |
| `analyses[].createdAt` | Timestamp |

---

## 8. Cost Estimation

### 8.1 Per-Analysis Costs

| Stage | Gemini Calls | Est. Cost |
|-------|--------------|-----------|
| Friction clustering | 1 | $0.02 - $0.05 |
| Solution mapping | 1 | $0.03 - $0.08 |
| Idea generation | 1 | $0.05 - $0.10 |
| Idea scoring | 1 | $0.03 - $0.08 |
| **Total** | **4** | **$0.15 - $0.35** |

### 8.2 Comparison with Other Sources

| Source | Cost per Run | Ideas per Run | Cost per Idea |
|--------|--------------|---------------|---------------|
| X/Twitter (Grok) | $0.05 - $0.15 | 3-5 | ~$0.03 |
| Polymarket | Free | 2-3 | $0 |
| Google News | Free | 2-3 | $0 |
| **Friction Analysis** | **$0.15 - $0.35** | **5-10** | **~$0.03** |

AI-native ideas cost similar per-idea but have higher strategic value (based on validated user pain).

---

## 9. Security Considerations

### 9.1 Data Isolation

- Friction analyses are user-scoped (`/users/{userId}/frictionAnalyses`)
- Ideas are user-scoped (`/users/{userId}/ideas`)
- No cross-user data access

### 9.2 Rate Limiting

- Same limits as other generation sources
- Max 5 manual runs per hour per user
- Max 1 friction analysis upload per 10 minutes

### 9.3 Input Validation

- Validate friction point structure before processing
- Limit friction points per analysis (max 50)
- Limit competitors per analysis (max 10)

---

## 10. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | April 8, 2026 | Wei-Ivanov | Initial specification |
| 1.1 | April 8, 2026 | Wei-Ivanov | Converted to prose/tables format (no code) |
| 1.2 | April 8, 2026 | Wei-Ivanov | Added display label/ribbon fields (section 5.4) |

---

*This module enables generation of AI-native app ideas from competitor friction analysis—ideas designed to transform markets, not just follow trends.*
