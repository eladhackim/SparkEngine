# Niche Discovery Pipeline Integration Specification

**Version**: 1.0
**Date**: April 8, 2026
**Author**: Theo-Brown (Tech Specs Team)
**Status**: Implementation-Ready
**Priority**: HIGH - Extends core value proposition

---

## Executive Summary

This specification defines how to integrate automated **Niche Discovery**, **Friction Analysis**, and **AI Solution Generation** into the existing Idea Forge pipeline. The integration adds a new data source that:

1. Discovers high-potential app niches from App Store/Play Store data
2. Automatically analyzes friction points in competitor apps
3. Generates AI-powered solution ideas targeting identified friction

This extends the existing pipeline (X, Polymarket, Google News) with a fourth source specifically designed for **app-opportunity discovery**.

### Integration Summary

| Component | Existing Pipeline | New Integration |
|-----------|------------------|-----------------|
| **Trigger** | Daily @ 6 AM UTC | Weekly (separate schedule) |
| **Data Source** | X, Polymarket, News | App Store intelligence |
| **Analysis Method** | Trend analysis | Friction detection |
| **Output** | General business ideas | AI-native app ideas |
| **Gemini Calls** | 3 per run | +5-7 per niche analyzed |

---

## 1. Pipeline Architecture Update

### 1.1 Updated Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        IDEA GENERATION PIPELINE (UPDATED)                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  TRIGGERS                                                                        │
│  ────────                                                                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐         │
│  │ Cloud Scheduler │  │  Manual Trigger │  │  Cloud Scheduler        │         │
│  │ (Daily @ 6 AM)  │  │  (HTTP Endpoint)│  │  (Weekly - Niche)       │         │
│  └────────┬────────┘  └────────┬────────┘  └────────────┬────────────┘         │
│           │                    │                        │                        │
│           └──────────┬─────────┴────────────────────────┘                        │
│                      ▼                                                           │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                    generateIdeas (Cloud Function)                          │  │
│  │  Routes to appropriate pipeline based on source parameter                  │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                      │                                                           │
│          ┌───────────┴───────────┐                                              │
│          ▼                       ▼                                              │
│  ┌─────────────────────┐  ┌──────────────────────────────────────────────────┐ │
│  │  EXISTING PIPELINE  │  │         NEW: NICHE DISCOVERY PIPELINE             │ │
│  │  (trends → ideas)   │  │         (niches → friction → AI solutions)        │ │
│  ├─────────────────────┤  ├──────────────────────────────────────────────────┤ │
│  │ Stage 1: Fetch      │  │ Stage 1: Niche Discovery                         │ │
│  │ - X (Grok)          │  │ - Fetch App Store rankings & reviews             │ │
│  │ - Polymarket        │  │ - Identify high-potential niches                 │ │
│  │ - Google News       │  │ - Score AI disruption potential                  │ │
│  │         ↓           │  │                    ↓                             │ │
│  │ Stage 2: Analyze    │  │ Stage 2: Friction Analysis                       │ │
│  │ - Signal analysis   │  │ - Analyze competitor apps                        │ │
│  │         ↓           │  │ - Extract user pain points                       │ │
│  │ Stage 3: Generate   │  │ - Score friction severity                        │ │
│  │ - Create ideas      │  │                    ↓                             │ │
│  │         ↓           │  │ Stage 3: AI Solution Generation                  │ │
│  │                     │  │ - Map friction to AI capabilities                │ │
│  │                     │  │ - Generate AI-native app concepts                │ │
│  └─────────┬───────────┘  └─────────────────────┬────────────────────────────┘ │
│            │                                    │                              │
│            └──────────────┬─────────────────────┘                              │
│                           ▼                                                    │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │ Stage 4: SCORING (SHARED) - Score on 5 parameters + AI disruption score   │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                           ↓                                                    │
│  ┌───────────────────────────────────────────────────────────────────────────┐ │
│  │ Stage 5: PERSISTENCE (SHARED) - Save to Firestore with source metadata    │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Data Flow: App Store → Friction → AI Solution → Ideas

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    NICHE DISCOVERY DATA FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  DATA SOURCES                                                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ App Store   │  │ Sensortower │  │ App Reviews │  │ Competitor  │            │
│  │ Rankings    │  │ / data.ai   │  │ (AppFollow) │  │ Features    │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         └───────────────────────────────────────────────────┘                   │
│                                    ↓                                            │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ STAGE 1: NICHE DISCOVERY                                                   │  │
│  │ Input: App Store category data, download volumes, review ratings           │  │
│  │ Process: Rank categories by AI disruption potential                        │  │
│  │ Output: Top 3-5 niches with market data and weakness indicators           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                    ↓                                            │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ STAGE 2: FRICTION ANALYSIS                                                 │  │
│  │ Input: Top 3 competitor apps per niche, their reviews                      │  │
│  │ Process: Extract and score friction points from negative reviews          │  │
│  │ Output: Prioritized friction list (P0/P1/P2) with severity scores         │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                    ↓                                            │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ STAGE 3: AI SOLUTION GENERATION                                            │  │
│  │ Input: Friction points, AI capability mapping                              │  │
│  │ Process: Design AI-native solutions for each P0 friction point            │  │
│  │ Output: App concepts with hero features, USP, and implementation spec     │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                    ↓                                            │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ STAGE 4-5: SCORING & STORAGE (shared with existing pipeline)               │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Cloud Function Updates

### 2.1 Main Orchestrator Changes

The existing `generateIdeas` Cloud Function needs the following modifications:

**New Parameters:**
- Accept a `pipelineType` parameter to route between trend-based and niche-discovery pipelines
- Add `nicheDiscoveryOptions` configuration object for niche-specific settings

**Resource Requirements:**
- Memory: Increase from 1GB to 2GB (niche discovery processes more data)
- Timeout: Keep at 540 seconds (9 minutes)
- New secrets: Add Sensortower and AppFollow API keys

**Routing Logic:**
When `pipelineType` is "niche-discovery", route to the new niche discovery pipeline instead of the existing trend-based pipeline.

### 2.2 New Cloud Functions

#### Function: generateNicheIdeasScheduled

| Attribute | Value |
|-----------|-------|
| **Trigger** | Cloud Scheduler |
| **Schedule** | Weekly on Sundays at 2:00 AM UTC |
| **Memory** | 2 GiB |
| **Timeout** | 540 seconds |
| **Required Secrets** | GEMINI_API_KEY, SENSORTOWER_API_KEY, APPFOLLOW_API_KEY |

**Behavior:**
1. Query all users with `nicheDiscoveryEnabled = true`
2. For each user, run the niche discovery pipeline with their configured options
3. Log results and errors per user
4. Continue processing remaining users even if one fails

### 2.3 New Helper Functions

#### Function: discoverNiches

**Purpose:** Identify app niches with high AI disruption potential

**Inputs:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| maxNiches | number | 3 | Maximum niches to return |
| minMarketSize | string | "$100M" | Minimum market size filter |
| minNegativeReviewRate | number | 0.20 | Minimum negative review rate (20%) |
| focusCategories | string[] | all | Optional category filter |

**Process:**
1. Fetch top 20 app categories from Sensortower API
2. For each category, fetch top 10 apps and their metrics
3. Calculate average rating and negative review rate per category
4. Use Gemini to score AI disruption potential (0-100 scale)
5. Filter categories meeting minimum criteria
6. Return top N niches ranked by AI disruption score

**Outputs:**

| Field | Description |
|-------|-------------|
| name | Niche name (e.g., "Calorie Tracking") |
| category | Parent category (e.g., "Health & Fitness") |
| marketSize | Estimated market size |
| topApps | Top 3 competitor apps with metrics |
| avgRating | Average rating across top apps |
| negativeReviewRate | Percentage of 1-2 star reviews |
| aiDisruptionScore | AI-calculated disruption potential (0-100) |

---

#### Function: analyzeFriction

**Purpose:** Extract and score friction points from competitor app reviews

**Inputs:**

| Parameter | Type | Description |
|-----------|------|-------------|
| nicheData | object | Niche profile from discoverNiches |
| maxReviewsPerApp | number | Reviews to analyze per app (default: 200) |

**Process:**
1. For each top app in the niche:
   - Fetch negative reviews (1-3 stars) from AppFollow API
   - Send reviews to Gemini for friction extraction
   - Gemini identifies friction points with categories and severity
2. Consolidate friction points across all competitors
3. Score each friction point using weighted formula
4. Assign priority tier (P0/P1/P2/P3) based on score

**Friction Point Scoring Formula:**

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Frequency | 30% | How often mentioned in reviews |
| Severity | 25% | Impact on user experience |
| Automation Feasibility | 25% | Can AI solve this? |
| Competitive Differentiation | 20% | Uniqueness if solved |

**Score Calculation:** (Frequency × 0.30 + Severity × 0.25 + Feasibility × 0.25 + Differentiation × 0.20) × 20

**Priority Thresholds:**

| Priority | Score Range | Action |
|----------|-------------|--------|
| P0 - Critical | 80-100 | Must solve in hero feature |
| P1 - High | 60-79 | Should solve in MVP |
| P2 - Medium | 40-59 | Nice to have |
| P3 - Low | 0-39 | Future consideration |

**Outputs:**

| Field | Description |
|-------|-------------|
| niche | Niche name |
| competitors | Array of competitor friction analyses |
| consolidatedFriction | Deduplicated, ranked friction list |
| topOpportunities | AI solution opportunities for P0/P1 items |

---

#### Function: generateAISolutions

**Purpose:** Create AI-native app concepts that solve identified friction

**Inputs:**

| Parameter | Type | Description |
|-----------|------|-------------|
| nicheData | object | Niche profile |
| frictionAnalysis | object | Friction analysis results |
| ideasPerNiche | number | Ideas to generate per niche |

**Process:**
1. Collect all P0 and P1 friction points
2. Send to Gemini with AI capability mapping prompt
3. Gemini generates app concepts that:
   - Target specific friction points
   - Include a "hero feature" with 10x improvement
   - Specify AI technologies (Vision, NLP, ML, etc.)
   - Estimate API costs
   - Define clear USP with quantified claims

**Outputs:**

| Field | Description |
|-------|-------------|
| name | App name |
| brief | One-sentence pitch |
| heroFeature | Primary differentiating feature |
| usp | Unique selling proposition with metrics |
| targetFriction | List of friction IDs addressed |
| aiTechnologies | Required AI capabilities |
| estimatedAPICost | Monthly cost per user estimate |
| competitorComparison | How this beats each competitor |
| effortReduction | Quantified improvement (e.g., "90%") |

---

## 3. Scheduler Configuration

### 3.1 Schedule Comparison

| Pipeline | Schedule | Frequency | Rationale |
|----------|----------|-----------|-----------|
| Existing (Trends) | 0 6 * * * | Daily @ 6 AM UTC | Trends change daily |
| NEW (Niche Discovery) | 0 2 * * 0 | Weekly @ 2 AM Sunday | App Store data changes slowly; expensive to run |

### 3.2 Why Weekly for Niche Discovery

1. **Data Stability:** App Store rankings and reviews don't change significantly day-to-day
2. **Cost Efficiency:** Each run costs ~$1.30 in API calls
3. **Quality Over Quantity:** Better to deeply analyze 3 niches weekly than surface-level daily
4. **User Digest:** Weekly cadence creates a "discovery digest" experience

### 3.3 User Settings for Niche Discovery

New user document fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| nicheDiscoveryEnabled | boolean | true | Enable weekly niche discovery |
| nicheIdeasPerRun | number | 5 | Ideas to generate per run (max: 10) |
| maxNiches | number | 3 | Niches to analyze per run (max: 5) |
| minMarketSize | string | "$100M" | Minimum market size filter |
| minNegativeReviewRate | number | 0.20 | Minimum negative review rate |
| focusCategories | string[] | null | Optional category filter |
| lastNicheDiscoveryRun | timestamp | null | Last successful run time |

---

## 4. API Contracts

### 4.1 Data Structures

#### Niche Discovery Output

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| source | string | Always "niche-discovery" | "niche-discovery" |
| niches | array | List of niche profiles | See below |
| fetchedAt | timestamp | When data was fetched | 2026-04-08T02:00:00Z |

#### Niche Profile

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| name | string | Niche name | "Calorie Tracking" |
| category | string | Parent category | "Health & Fitness" |
| marketSize | string | Estimated market | "$3.4B" |
| topApps | array | Top 3 competitor apps | See below |
| avgRating | number | Average rating (1-5) | 4.3 |
| negativeReviewRate | number | % of 1-2 star reviews | 0.28 |
| aiDisruptionScore | number | AI potential (0-100) | 92 |
| competitorWeaknesses | array | Identified weaknesses | ["Manual data entry", "Recipe creation"] |

#### Competitor App

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| name | string | App name | "MyFitnessPal" |
| downloads | string | Download count | "200M+" |
| rating | number | Average rating | 4.7 |
| reviewCount | number | Total reviews | 2300000 |
| negativeReviewRate | number | % negative reviews | 0.28 |

#### Friction Point

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | string | Unique identifier | "FP-MFP-001" |
| description | string | Pain point description | "Manual food search every meal" |
| category | enum | Friction category | "input" |
| severity | number | Severity score (1-5) | 5 |
| frequency | number | Frequency score (1-5) | 5 |
| automationFeasibility | number | AI solvability (1-5) | 5 |
| competitiveDiff | number | Differentiation (1-5) | 4 |
| compositeScore | number | Weighted score (0-100) | 94 |
| priority | enum | Priority tier | "P0" |
| userQuotes | array | Supporting quotes | ["Constantly weighing things..."] |

**Friction Categories:** input, decision, navigation, cognitive, repetitive, waiting

#### AI Solution Idea

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| name | string | App name | "SnapCal" |
| brief | string | One-sentence pitch | "AI predicts and logs meals before you open the app" |
| category | string | App category | "Health & Fitness" |
| heroFeature.name | string | Feature name | "Zero-Touch Predictive Logging" |
| heroFeature.description | string | What it does | "AI logs meals automatically based on patterns" |
| heroFeature.automationLevel | enum | Automation level | "Level 3" |
| heroFeature.demoScenario | string | 30-second demo | "Watch this. It's 7:15 AM..." |
| usp | string | Value proposition | "90% less effort than MyFitnessPal" |
| targetFriction | array | Friction IDs addressed | ["FP-MFP-001", "FP-MFP-002"] |
| aiTechnologies | array | Required AI tech | ["GPT-4o Vision", "On-device ML"] |
| estimatedAPICost | string | Monthly cost/user | "$1.25/user/month" |
| competitorComparison | array | Competitor comparisons | See below |
| effortReduction | string | Improvement metric | "90%" |
| tags | array | Categorization tags | ["ai", "automation", "health"] |

### 4.2 API Endpoints

#### Manual Niche Discovery Trigger

**Endpoint:** POST /api/generateNicheIdeas

**Authentication:** Bearer token (Firebase Auth)

**Request Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| maxNiches | number | No | 3 | Niches to analyze (max: 5) |
| ideasPerNiche | number | No | 3 | Ideas per niche (max: 5) |
| focusCategories | array | No | all | Category filter |
| minNegativeReviewRate | number | No | 0.20 | Min negative rate |

**Success Response:**

| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Always true |
| data.runId | string | Unique run identifier |
| data.nichesAnalyzed | array | Names of analyzed niches |
| data.ideasGenerated | number | Total ideas created |
| data.ideasSaved | number | Ideas saved to Firestore |
| data.duration | number | Execution time (ms) |
| data.avgAIDisruptionScore | number | Average disruption score |

**Error Response:**

| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Always false |
| error | string | Error code |
| message | string | Human-readable message |
| errors | array | Detailed error list (optional) |

**Error Codes:**

| Code | Description |
|------|-------------|
| GENERATION_FAILED | Pipeline execution failed |
| RATE_LIMITED | Too many requests |
| API_ERROR | Third-party API failure |
| UNAUTHORIZED | Invalid or missing auth token |
| NO_QUALIFYING_NICHES | No niches met minimum criteria |

#### Updated Unified Generation Endpoint

**Endpoint:** POST /api/generateIdeas

**Authentication:** Bearer token (Firebase Auth)

This endpoint now supports selective source triggering via the `sources` parameter.

**Request Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| sources | array of strings | No | All enabled | Which sources to trigger |
| ideasPerRun | number | No | 10 | Total ideas to generate |

**Valid Source Values:**

| Value | Description |
|-------|-------------|
| "x" | X/Twitter trends via Grok |
| "polymarket" | Polymarket prediction markets |
| "googlenews" | Google News trends |
| "appstore" | App Store niche discovery |

**Example Requests:**

| Use Case | Request Body |
|----------|--------------|
| Generate all | `{ }` or `{ "sources": ["x", "polymarket", "googlenews", "appstore"] }` |
| Only App Store | `{ "sources": ["appstore"] }` |
| Only markets | `{ "sources": ["polymarket"] }` |
| Multiple sources | `{ "sources": ["x", "googlenews"] }` |

**Behavior:**
- If `sources` is omitted, triggers all sources in user's `defaultSources` setting
- If `sources` is provided, only triggers specified sources (must be in user's `enabledSources`)
- Returns error if user requests source not in their `enabledSources`

---

## 5. Cost Analysis

### 5.1 API Costs Per Run

| Component | API Provider | Calls/Run | Cost/Call | Total/Run |
|-----------|--------------|-----------|-----------|-----------|
| Niche Discovery | Sensortower | 10-20 | $0.01 | $0.10-0.20 |
| Review Fetching | AppFollow | 9-15 | $0.005 | $0.05-0.10 |
| AI Disruption Scoring | Gemini Flash | 10 | $0.002 | $0.02 |
| Friction Analysis | Gemini Pro | 9 | $0.05 | $0.45 |
| AI Solution Generation | Gemini Pro | 3 | $0.08 | $0.24 |
| Idea Scoring | Gemini Pro | 9-15 | $0.03 | $0.27-0.45 |
| Cloud Function | Firebase | 1 | $0.02 | $0.02 |
| **TOTAL** | | | | **$1.15-1.48** |

### 5.2 Monthly Cost Projection

| User Tier | Weekly Runs | Monthly Runs | Monthly Cost |
|-----------|-------------|--------------|--------------|
| Free tier | 0 | 0 | $0 |
| Basic | 1 | 4 | ~$5.00 |
| Pro | 2 | 8 | ~$10.00 |
| Enterprise | 4 | 16 | ~$20.00 |

### 5.3 Combined Pipeline Costs

| Pipeline | Runs/Month | Cost/Run | Monthly Cost |
|----------|------------|----------|--------------|
| Existing (Trends) | 30 | $0.25 | $7.50 |
| NEW (Niche Discovery) | 4 | $1.30 | $5.20 |
| **Combined** | 34 | - | **$12.70** |

### 5.4 Budget Impact

- **Current budget:** ~$8-20/user/month (trend-based only)
- **Updated budget:** ~$13-25/user/month (with niche discovery)
- **Additional cost:** +$5.20/month per user with niche discovery enabled

**Value Justification:** Niche discovery produces higher-quality, more actionable ideas with specific AI implementation paths, whereas trend-based ideas are more general business concepts.

---

## 6. Security Considerations

### 6.1 API Key Management

All API keys must be stored in Cloud Secret Manager:

| Secret Name | Purpose | Rotation |
|-------------|---------|----------|
| SENSORTOWER_API_KEY | App Store intelligence | Quarterly |
| APPFOLLOW_API_KEY | App review fetching | Quarterly |
| GEMINI_API_KEY | AI processing (existing) | Quarterly |

**Access Pattern:** Use `defineSecret()` in Cloud Functions to access secrets at runtime. Never log or expose keys.

### 6.2 Rate Limiting

**Per-User Limits:**

| Operation | Limit |
|-----------|-------|
| Manual trigger | Max 2 per hour, 4 per day |
| Scheduled run | 1 per week per user |

**API-Level Limits (to stay within vendor quotas):**

| API | Requests/Minute | Requests/Day |
|-----|-----------------|--------------|
| Sensortower | 30 | 1,000 |
| AppFollow | 60 | 5,000 |
| Gemini | 60 | 10,000 |

### 6.3 Data Privacy

| Data Type | Storage | Retention | Sharing |
|-----------|---------|-----------|---------|
| User ideas | Firestore (user-scoped) | Until user deletes | Never cross-user |
| App Store data | Cached 7 days | Auto-refresh weekly | Anonymized for trends |
| Review data | In-memory only | Not persisted | Never stored |
| Niche analysis | Firestore (user-scoped) | 90 days | Never cross-user |

### 6.4 Input Validation

All user-provided options must be validated:

| Parameter | Validation Rule |
|-----------|-----------------|
| maxNiches | Integer, 1-5 |
| minMarketSize | Format: "$[0-9]+[MBK]" |
| minNegativeReviewRate | Float, 0.1-0.5 |
| focusCategories | Array, max 10 items |

---

## 7. Firestore Schema Updates

### 7.1 Extended Idea Document

New fields for ideas with source = "niche-discovery":

| Field | Type | Description |
|-------|------|-------------|
| nicheDiscoveryData.niche | string | Source niche name |
| nicheDiscoveryData.marketSize | string | Niche market size |
| nicheDiscoveryData.aiDisruptionScore | number | Niche AI potential (0-100) |
| nicheDiscoveryData.heroFeature | object | Hero feature specification |
| nicheDiscoveryData.usp | string | Unique selling proposition |
| nicheDiscoveryData.targetFriction | array | Friction point IDs addressed |
| nicheDiscoveryData.aiTechnologies | array | Required AI technologies |
| nicheDiscoveryData.estimatedAPICost | string | Cost per user estimate |
| nicheDiscoveryData.competitorComparison | array | Competitor comparisons |
| nicheDiscoveryData.effortReduction | string | Improvement metric |

### 7.2 Generation Run Logs

New fields for niche discovery runs in generationRuns collection:

| Field | Type | Description |
|-------|------|-------------|
| pipelineType | string | "niche-discovery" or "trend-based" |
| nichesAnalyzed | array | Names of analyzed niches |
| avgAIDisruptionScore | number | Average disruption score |
| frictionPointsIdentified | number | Total friction points found |

### 7.3 User Settings

New fields in user document:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| nicheDiscoveryEnabled | boolean | true | Enable weekly discovery |
| nicheIdeasPerRun | number | 5 | Ideas per run |
| nicheDiscoveryOptions | object | See Section 3.3 | Configuration |
| lastNicheDiscoveryRun | timestamp | null | Last run time |
| enabledSources | array of strings | all four | Sources available to user |
| defaultSources | array of strings | all four | Sources used for "Generate All" |

**enabledSources Values:** `["x", "polymarket", "googlenews", "appstore"]`

---

## 8. Manual Generation UI

### 8.1 Current vs. New State

| Aspect | Current State | New State |
|--------|---------------|-----------|
| Generate button | Single "Generate Ideas" | Multiple source-specific buttons |
| Source selection | Triggers ALL sources | User chooses which sources |
| API integration | No sources parameter | Passes selected sources to API |

### 8.2 Button Specifications

| Button | Label | Sources Triggered | Icon | Style |
|--------|-------|-------------------|------|-------|
| Primary | "Generate All" | User's defaultSources | sparkles | Primary/filled |
| X/Twitter | "From X Trends" | x only | twitter/X logo | Secondary/outline |
| Polymarket | "From Markets" | polymarket only | chart | Secondary/outline |
| Google News | "From News" | googlenews only | newspaper | Secondary/outline |
| App Store | "From App Store" | appstore only | store | Secondary/outline |

### 8.3 UI Layout Options

**Option A: Dropdown Menu (Mobile-Friendly)**

```
┌─────────────────────────────┐
│  [Generate Ideas ▼]         │
├─────────────────────────────┤
│  Generate All               │
│  ─────────────────────────  │
│  From X Trends              │
│  From Markets               │
│  From News                  │
│  From App Store             │
└─────────────────────────────┘
```

**Option B: Button Group (Recommended for Desktop)**

```
┌────────────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌───────────┐
│ Generate All   │ │   X    │ │Markets │ │  News  │ │ App Store │
└────────────────┘ └────────┘ └────────┘ └────────┘ └───────────┘
     Primary          Secondary buttons (smaller, outline style)
```

**Responsive Behavior:**
- Desktop: Show button group (Option B)
- Tablet: Show button group with icons only
- Mobile: Collapse to dropdown menu (Option A)

### 8.4 Button Visibility Rules

| Condition | Behavior |
|-----------|----------|
| Source in enabledSources | Show button |
| Source NOT in enabledSources | Hide button |
| Only one source enabled | Hide "Generate All", show single button |
| All sources disabled | Show disabled state with settings link |

### 8.5 Interaction Flow

1. User clicks source-specific button (e.g., "From App Store")
2. Button shows loading state with spinner
3. API call: `POST /generateIdeas { sources: ["appstore"] }`
4. On success: Show toast "Generated X ideas from App Store"
5. Refresh ideas list with new ideas highlighted
6. On error: Show error toast with retry option

### 8.6 Settings Integration

Users can configure default sources in Settings page:

| Setting | Description | UI Element |
|---------|-------------|------------|
| Enabled Sources | Which sources are available | Checkbox list |
| Default Sources | Which sources trigger on "Generate All" | Checkbox list (subset of enabled) |

---

## 9. UI Display Requirements

### 9.1 Ribbon/Badge Specification

App Store-derived ideas must be visually distinguished from other idea sources using a colored ribbon/badge.

**Ribbon Configuration:**

| Element | Value |
|---------|-------|
| Ribbon Text | "App Store Insight" |
| Ribbon Color | Purple/Indigo (#7C3AED or similar) |
| Ribbon Position | Top-left corner of IdeaCard component |
| Tooltip Text | "Generated from competitor friction analysis" |
| Icon | Store icon or lightbulb icon |

### 9.2 Source Badge Comparison

All idea sources should have consistent but distinct visual indicators:

| Idea Source | Badge Text | Color | Hex Code |
|-------------|------------|-------|----------|
| X/Twitter trends | "Trending" | Green | #22C55E |
| Polymarket | "Market Signal" | Blue | #3B82F6 |
| Google News | "News" | Blue | #3B82F6 |
| **App Store Niche** | **"App Store Insight"** | **Purple** | **#7C3AED** |
| Manual entry | (no badge) | - | - |

### 9.3 Display Badge Data Structure

Add to the Idea document schema a new field for UI rendering:

**Field: displayBadge**

| Subfield | Type | Description | Example |
|----------|------|-------------|---------|
| text | string | Badge label text | "App Store Insight" |
| color | string | CSS color value | "#7C3AED" |
| icon | string | Icon identifier | "store" or "lightbulb" |
| tooltip | string | Hover text | "Generated from competitor friction analysis" |

### 9.4 Implementation Notes

1. **Backend Responsibility:** The `saveNicheIdeas` function should populate `displayBadge` automatically based on source type
2. **Frontend Responsibility:** IdeaCard component reads `displayBadge` and renders the ribbon accordingly
3. **Fallback:** If `displayBadge` is missing, frontend should derive badge from `source` field using a mapping table
4. **Accessibility:** Badge colors must meet WCAG contrast requirements; include text labels, not just colors

---

## 10. Implementation Checklist

### Phase 1: Core Infrastructure (Week 1)
- [ ] Add Sensortower API credentials to Secret Manager
- [ ] Add AppFollow API credentials to Secret Manager
- [ ] Create `generateNicheIdeasScheduled` Cloud Function stub
- [ ] Update Firestore security rules for new fields
- [ ] Add user settings fields to Firestore schema (including `enabledSources`, `defaultSources`)
- [ ] Add `displayBadge` field to idea document schema

### Phase 2: Pipeline Implementation (Week 2)
- [ ] Implement `discoverNiches` function
- [ ] Implement `analyzeFriction` function
- [ ] Implement `generateAISolutions` function
- [ ] Implement extended scoring for niche ideas
- [ ] Implement extended persistence with niche metadata

### Phase 3: Integration & Testing (Week 3)
- [ ] Update main orchestrator routing logic
- [ ] Configure weekly Cloud Scheduler job
- [ ] Test end-to-end with sample niches
- [ ] Performance test with 5 niches
- [ ] Validate cost projections

### Phase 4: Frontend Integration (Week 4)
- [ ] Add "Discover Niches" button to dashboard
- [ ] Add niche discovery settings panel
- [ ] Update idea card to display niche-specific data
- [ ] Implement "App Store Insight" ribbon/badge on IdeaCard
- [ ] Add generation history filter for niche runs

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | April 8, 2026 | Theo-Brown | Initial specification |
| 1.1 | April 8, 2026 | Theo-Brown | Added Section 8: UI Display Requirements (ribbon/badge spec) |

---

*This specification extends the Idea Forge pipeline with automated niche discovery, enabling identification of app opportunities with high AI disruption potential.*
