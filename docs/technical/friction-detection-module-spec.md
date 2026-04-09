# Friction Detection Module Specification

**Status**: Implementation-Ready
**Version**: 1.1
**Date**: April 8, 2026
**Author**: Aviv-Yamamoto
**Priority**: HIGH - New data source for idea generation pipeline
**Reference**: `docs/technical/backend-pipeline-spec.md`

---

## Executive Summary

This document specifies the **Friction Detection Module** - an automated system that analyzes app store reviews to identify user pain points and friction patterns. The module integrates with the existing idea generation pipeline as a new data source, feeding friction opportunities to Gemini for AI-powered idea generation.

### Key Capabilities

1. **Automated Review Fetching**: Pull reviews from App Store and Google Play
2. **AI-Powered Analysis**: Use Gemini to extract friction points from reviews
3. **Pattern Classification**: Categorize and score friction patterns
4. **Pipeline Integration**: Feed structured friction data to idea generation

---

## 1. Architecture Overview

The Friction Detection Module operates as a 4-stage pipeline:

### Stage 1: Review Collection
The system fetches user reviews from app stores using scraping libraries. Reviews are collected for registered competitor apps on a configurable schedule.

**Triggers:**
- Scheduled: Weekly (Sunday 2 AM UTC)
- Manual: HTTP endpoint for on-demand analysis

### Stage 2: Friction Extraction
Collected reviews are sent to Gemini in batches for AI-powered analysis. The AI identifies friction patterns, extracts user quotes, and classifies pain points.

### Stage 3: Pattern Aggregation
Similar friction points are grouped together. Frequency counts are calculated. Severity scores are derived from sentiment and review ratings.

### Stage 4: Scoring & Persistence
Each friction point receives a composite score based on weighted criteria. Results are saved to Firestore and made available to the idea generation pipeline.

### Output
The module exports structured friction data as a new source for the `generateIdeas` function, alongside existing sources (X, Polymarket, Google News).

---

## 2. Review Analysis API

### 2.1 Supported Platforms

| Platform | Fetch Method | Rate Limits | Data Available |
|----------|--------------|-------------|----------------|
| App Store | app-store-scraper npm package | ~10 requests/minute | Public reviews |
| Google Play | google-play-scraper npm package | ~10 requests/minute | Public reviews |

### 2.2 Review Fetch Configuration

When fetching reviews, the following parameters are supported:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| appId | string | required | App identifier (package name for Android, numeric ID for iOS) |
| platform | enum | required | "ios" or "android" |
| country | string | "us" | Country code for localized reviews |
| count | number | 200 | Number of reviews to fetch (max 500) |
| sort | enum | "recent" | Sort order: "recent" or "helpful" |

### 2.3 Fetched Review Structure

Each fetched review contains:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique review identifier |
| platform | enum | "ios" or "android" |
| appId | string | Source app identifier |
| rating | number | User rating (1-5 stars) |
| text | string | Review body text |
| title | string | Review title (iOS only) |
| userName | string | Reviewer display name |
| date | timestamp | Review submission date |
| version | string | App version reviewed (when available) |
| helpful | number | Helpful vote count (when available) |

### 2.4 Competitor App Registry

The module maintains a registry of competitor apps to analyze. Each entry contains:

| Field | Type | Description |
|-------|------|-------------|
| name | string | Human-readable app name (e.g., "MyFitnessPal") |
| category | string | App category (e.g., "health-fitness") |
| iosAppId | string | Numeric App Store ID |
| androidAppId | string | Google Play package name |
| keywords | array | Keywords for matching to generated ideas |

**Initial Registry:**

| App Name | Category | iOS ID | Android Package |
|----------|----------|--------|-----------------|
| MyFitnessPal | health-fitness | 341232718 | com.myfitnesspal.android |
| Lose It! | health-fitness | 297368629 | com.fitnow.loseit |
| Yazio | health-fitness | 946099227 | com.yazio.android |

Additional apps can be added to the registry as needed.

---

## 3. Friction Extraction (AI Analysis)

### 3.1 Analysis Approach

Reviews are processed in batches of 50 to stay within Gemini token limits. Only negative and neutral reviews (1-3 stars) are analyzed for friction points.

### 3.2 Gemini Prompt Requirements

The extraction prompt instructs Gemini to:

1. **Identify distinct friction points** - Unique user pain points, complaints, or frustrations
2. **Categorize each friction point** - Assign to one of the defined categories
3. **Rate severity** - Score from 1 (minor annoyance) to 5 (app-breaking)
4. **Count frequency** - How many reviews mention this issue
5. **Extract quotes** - 2-3 exact quotes per friction point
6. **Assess AI addressability** - Whether AI can solve this (high/medium/low)
7. **Extract keywords** - Key terms associated with this friction

### 3.3 Friction Categories

| Category | Code | Description | AI Solution Potential |
|----------|------|-------------|----------------------|
| Input Friction | input | Manual data entry requirements | High - auto-fill, prediction, OCR |
| Decision Friction | decision | Choices user must make | Medium - suggested defaults |
| Navigation Friction | navigation | Difficulty reaching features | Medium - smart shortcuts |
| Cognitive Friction | cognitive | Learning curve, complexity | High - guidance, simplification |
| Repetitive Friction | repetitive | Same actions done repeatedly | High - automation, patterns |
| Waiting Friction | waiting | Loading, processing delays | Low - infrastructure dependent |
| Accuracy Friction | accuracy | Data quality issues | Medium - validation, anomaly detection |
| Paywall Friction | paywall | Features behind payment | N/A - business decision |
| Reliability Friction | reliability | Crashes, bugs, errors | N/A - engineering issue |
| Other | other | Doesn't fit above categories | Varies |

### 3.4 Extracted Friction Structure

For each friction point extracted, Gemini returns:

| Field | Type | Description |
|-------|------|-------------|
| frictionId | string | Unique identifier for deduplication |
| category | enum | One of the friction categories above |
| description | string | Clear, actionable description of the friction |
| severity | number | 1-5 scale (1=minor, 5=blocking) |
| frequency | number | Count of reviews mentioning this |
| userQuotes | array | 2-5 exact quotes from reviews |
| sentiment | enum | "negative", "frustrated", or "angry" |
| aiAddressability | enum | "high", "medium", or "low" |
| keywords | array | Relevant keywords for this friction |

### 3.5 Post-Processing

After extraction, similar friction points are merged:
- Group by category + overlapping keywords
- Sum frequency counts
- Keep highest severity
- Combine quotes (limit to 5 total)
- Union keywords

---

## 4. Friction Classification Schema

### 4.1 FrictionPoint Document Structure

The FrictionPoint is the primary data structure stored in Firestore.

**Core Identifiers:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Firestore document ID |
| appId | string | yes | Source app identifier |
| appName | string | yes | Human-readable app name |

**Classification:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| category | enum | yes | One of 10 friction categories |
| subcategory | string | no | Optional refinement |
| description | string | yes | Clear, actionable description (max 500 chars) |

**Scores (embedded object):**

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| frequency | number | 1-5 | How often this friction is mentioned |
| severity | number | 1-5 | Level of user frustration |
| automationFeasibility | number | 1-5 | How solvable via AI (5=easily automated) |
| competitiveDifferentiation | number | 1-5 | Uniqueness of solving this (5=no competitor solves) |

**Computed Scores:**

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| compositeScore | number | 0-100 | Weighted aggregate of scores |
| priorityTier | enum | P0-P3 | Priority classification |

**Evidence (embedded object):**

| Field | Type | Description |
|-------|------|-------------|
| reviewCount | number | Total reviews mentioning this friction |
| userQuotes | array | Up to 5 direct quotes from reviews |
| platforms | array | Platforms where seen: "ios", "android", or both |
| ratingCorrelation | number | Average rating when this friction is mentioned |

**AI Analysis (embedded object):**

| Field | Type | Description |
|-------|------|-------------|
| addressability | enum | "high", "medium", or "low" |
| solutionType | array | Applicable AI solution types (see below) |
| dataRequirements | array | Data needed to implement solution |
| technicalComplexity | enum | "low", "medium", or "high" |
| suggestedApproach | string | Brief recommended implementation approach |

**Solution Types:**

| Type | Description |
|------|-------------|
| prediction | ML-based prediction of user intent or values |
| recognition | Computer vision for images, objects, text |
| generation | AI content generation (text, suggestions) |
| automation | Workflow automation based on patterns |
| nlp | Natural language processing for input |
| analysis | Data analysis and insights |
| coaching | AI guidance and recommendations |
| integration | External service integration |

**Metadata (embedded object):**

| Field | Type | Description |
|-------|------|-------------|
| createdAt | timestamp | Document creation time |
| updatedAt | timestamp | Last modification time |
| analysisVersion | string | Version of analysis algorithm used |
| reviewDateRange.start | timestamp | Earliest review analyzed |
| reviewDateRange.end | timestamp | Latest review analyzed |
| sourceRunId | string | Links to the analysis run that created this |

### 4.2 Scoring Algorithm

**Composite Score Calculation:**

The composite score (0-100) is calculated as a weighted sum of the four score criteria, then multiplied by 20 to convert from 1-5 scale to 0-100 scale.

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Frequency | 30% | How often users encounter this |
| Severity | 25% | User frustration level |
| Automation Feasibility | 25% | AI solvability |
| Competitive Differentiation | 20% | Uniqueness opportunity |

**Formula:** `compositeScore = (frequency × 0.30 + severity × 0.25 + automationFeasibility × 0.25 + competitiveDifferentiation × 0.20) × 20`

**Frequency Score Mapping:**

| Review Count | Score |
|--------------|-------|
| 20+ mentions | 5 |
| 10-19 mentions | 4 |
| 5-9 mentions | 3 |
| 2-4 mentions | 2 |
| 1 mention | 1 |

**Priority Tier Assignment:**

| Composite Score | Tier | Description |
|-----------------|------|-------------|
| 80-100 | P0 | Critical - address in MVP |
| 60-79 | P1 | High - address in v1.0 |
| 40-59 | P2 | Medium - roadmap item |
| 0-39 | P3 | Low - document only |

---

## 5. Pipeline Integration

### 5.1 Friction as Data Source

The friction module integrates with the existing idea generation pipeline as a new data source, alongside X/Twitter, Polymarket, and Google News.

**Source Identifier:** "friction"

**Output Format:**

The `fetchFrictionSignals` function returns data formatted for the pipeline:

| Field | Type | Description |
|-------|------|-------------|
| source | string | Always "friction" |
| opportunities | array | Structured friction opportunities |
| topPainPoints | array | Top 10 pain points with quotes |
| categoryBreakdown | array | Count and severity by category |
| fetchedAt | timestamp | When data was retrieved |

**Opportunity Structure:**

| Field | Type | Description |
|-------|------|-------------|
| description | string | Friction point description |
| category | string | Friction category |
| severity | number | 1-5 severity score |
| aiAddressability | enum | "high", "medium", or "low" |
| suggestedSolutions | array | Applicable AI solution types |
| evidenceStrength | number | Review count mentioning this |
| sourceApp | string | App where friction was found |

**Pain Point Summary:**

| Field | Type | Description |
|-------|------|-------------|
| problem | string | Friction description |
| audience | string | Affected user group (e.g., "MyFitnessPal users") |
| frequency | number | Mention count |
| userQuotes | array | 2 representative quotes |

### 5.2 Friction-to-Idea Generation Prompt

When generating ideas from friction data, the Gemini prompt instructs the AI to:

1. Generate ideas that **directly solve** identified friction points
2. Prioritize **high severity + high AI-addressability** friction
3. Leverage the specific **AI capabilities** identified (prediction, recognition, etc.)
4. Include the **friction points each idea solves** with explanation
5. Note the **source app** where friction was found
6. Explain the **differentiator** - what makes this solution unique

**Generated Idea Structure (friction-based):**

| Field | Type | Description |
|-------|------|-------------|
| name | string | Product/app name |
| brief | string | One-sentence description |
| category | string | SaaS, Mobile, Tool, Platform |
| tags | array | Relevant keywords |
| frictionSolved | array | Friction points this addresses |
| aiCapabilities | array | AI solution types used |
| differentiator | string | Unique competitive advantage |

**Friction Solved Entry:**

| Field | Type | Description |
|-------|------|-------------|
| description | string | The friction point solved |
| sourceApp | string | Original app with this friction |
| howSolved | string | How the idea addresses it |

### 5.3 Pipeline Integration Points

**Option A: Combined Sources**
When friction is included alongside other sources (X, Polymarket, News), the data flows through the standard `analyzeSignals` step where Gemini cross-references all sources.

**Option B: Friction-Only Mode**
When friction is the only source, a specialized `generateIdeasFromFriction` function is used that directly converts friction data to ideas without the intermediate signal analysis step.

**Configuration:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| sources | array | all | Include "friction" to enable |
| frictionMinScore | number | 60 | Minimum composite score to include |
| frictionLimit | number | 50 | Max friction points to fetch |

---

## 6. Firestore Schema

### 6.1 FrictionPoints Collection

**Path:** `/frictionPoints/{frictionId}`

**Indexes Required:**
- compositeScore (descending) - for priority queries
- category + compositeScore - for filtered queries
- appName + compositeScore - for app-specific queries
- priorityTier + createdAt - for tier-based queries

**Document Fields:** (See Section 4.1 for complete structure)

### 6.2 FrictionAnalysisRuns Collection

**Path:** `/frictionAnalysisRuns/{runId}`

This collection tracks each friction analysis execution for monitoring and debugging.

| Field | Type | Description |
|-------|------|-------------|
| runId | string | Unique run identifier |
| timestamp | timestamp | When analysis started |
| config.apps | array | App IDs analyzed |
| config.reviewCount | number | Reviews processed per app |
| config.platforms | array | Platforms included |
| results.frictionPointsFound | number | Total friction points identified |
| results.byPriority.P0 | number | Count of P0 friction points |
| results.byPriority.P1 | number | Count of P1 friction points |
| results.byPriority.P2 | number | Count of P2 friction points |
| results.byPriority.P3 | number | Count of P3 friction points |
| results.byCategory | map | Count per friction category |
| duration | number | Processing time in milliseconds |
| apiCalls.gemini | number | Gemini API calls made |
| apiCalls.reviewFetch | number | Review fetch calls made |
| status | enum | "completed", "failed", or "partial" |
| errors | array | Error messages if any |

### 6.3 Generated Ideas Linkage

When ideas are generated from friction data, the idea document in `/users/{userId}/ideas/{ideaId}` includes additional fields:

| Field | Type | Description |
|-------|------|-------------|
| frictionSources.frictionPointIds | array | References to /frictionPoints documents |
| frictionSources.frictionDescriptions | array | Cached descriptions for display |
| frictionSources.sourceApps | array | Apps where friction was found |
| generationType | enum | "trend-based", "friction-based", or "manual" |

### 6.4 Security Rules

**FrictionPoints Collection:**
- Read: Allowed for authenticated users
- Write: Denied (Cloud Functions only)

**FrictionAnalysisRuns Collection:**
- Read: Allowed for authenticated users
- Write: Denied (Cloud Functions only)

---

## 7. API Endpoints

### 7.1 Analyze Friction Endpoint

**Endpoint:** POST `/analyzeFriction`

**Authentication:** Bearer token (admin only)

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| appNames | array | yes | App names to analyze (from registry) |
| reviewCount | number | no | Reviews per app (default: 200) |

**Response (Success):**

| Field | Type | Description |
|-------|------|-------------|
| success | boolean | true |
| runId | string | Analysis run identifier |
| frictionPointsFound | number | Total friction points identified |
| byPriority | object | Count per priority tier |
| duration | number | Processing time in ms |

**Response (Error):**

| Field | Type | Description |
|-------|------|-------------|
| success | boolean | false |
| error | string | Error code |
| message | string | Human-readable error message |

### 7.2 Get Friction Endpoint

**Endpoint:** GET `/api/friction`

**Authentication:** Bearer token

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| category | string | all | Filter by friction category |
| minScore | number | 0 | Minimum composite score |
| priorityTier | string | all | Filter by P0/P1/P2/P3 |
| appName | string | all | Filter by source app |
| limit | number | 50 | Maximum results to return |

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| frictionPoints | array | Array of FrictionPoint documents |

### 7.3 Scheduled Analysis

**Schedule:** Weekly, Sunday 2:00 AM UTC

**Behavior:** Automatically analyzes all apps in the competitor registry with default settings (200 reviews per app).

---

## 8. Cost Estimation

### 8.1 Per-Analysis Run Costs

| Component | Cost per App | Notes |
|-----------|--------------|-------|
| Review scraping | Free | Using npm packages |
| Gemini extraction (4 batches of 50 reviews) | $0.10 - $0.20 | ~2000 tokens input, ~1000 output per batch |
| Gemini scoring | $0.02 - $0.05 | Smaller prompts |
| Cloud Functions | $0.01 | ~5 min execution |
| Firestore writes | <$0.01 | 10-20 documents |
| **Total per app** | **$0.15 - $0.30** | |

### 8.2 Monthly Cost Estimate

| Scenario | Calculation | Monthly Cost |
|----------|-------------|--------------|
| Weekly scheduled (3 apps) | 4 runs × 3 apps × $0.25 | $3.00 |
| Manual runs (estimated 5) | 5 runs × 1 app × $0.25 | $1.25 |
| **Total estimated** | | **$4 - $6** |

---

## 9. Implementation Checklist

### Phase 1: Core Infrastructure
- Create `frictionPoints` Firestore collection
- Create `frictionAnalysisRuns` Firestore collection
- Add Firestore indexes for queries
- Configure security rules
- Set up GEMINI_API_KEY secret

### Phase 2: Review Fetching
- Install google-play-scraper and app-store-scraper packages
- Implement review fetch functions
- Create competitor app registry configuration
- Test fetching with sample apps

### Phase 3: AI Analysis
- Implement friction extraction function with Gemini
- Implement post-processing and deduplication
- Implement scoring algorithm
- Test extraction with sample reviews

### Phase 4: Pipeline Integration
- Implement fetchFrictionSignals data source function
- Add "friction" to pipeline source options
- Implement friction-to-idea generation prompt
- Test end-to-end idea generation from friction

### Phase 5: Endpoints & Scheduling
- Deploy analyzeFriction HTTP endpoint
- Configure Cloud Scheduler for weekly runs
- Deploy getFriction query endpoint
- Set up monitoring and alerting

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | April 8, 2026 | Aviv-Yamamoto | Initial specification |
| 1.1 | April 8, 2026 | Aviv-Yamamoto | Removed code snippets, converted to prose/tables |

---

*This module extends the idea generation pipeline with automated friction detection from app store reviews.*
