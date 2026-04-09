# App Store Niche Discovery: Data Source Integration Specification

**Status**: Draft - Pending Review
**Version**: 1.1
**Date**: April 8, 2026
**Author**: Rotem-Goldman (Tech Specs)
**Related Docs**: backend-pipeline-spec.md, firestore-schema.md

---

## 1. Executive Summary

This specification defines how to integrate App Store and Play Store analysis as a new data source in the Idea Forge generation pipeline. This source analyzes app store trends, user reviews, and market opportunities to generate business ideas—alongside existing sources (X/Twitter, Polymarket, Google News).

### Purpose

The App Store source identifies "friction opportunities" in existing apps—problems users complain about that AI could solve. By analyzing 2-4 star reviews (the most constructive feedback), the system finds validated pain points with proven market demand.

### Integration Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    GENERATION PIPELINE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   DATA SOURCES (Stage 1)                                         │
│   ┌──────────────┐                                               │
│   │ X/Twitter    │──┐                                            │
│   │ (Grok API)   │  │                                            │
│   └──────────────┘  │                                            │
│   ┌──────────────┐  │      ┌─────────────┐    ┌─────────────┐   │
│   │ Polymarket   │──┼─────►│ Analyze     │───►│ Generate    │   │
│   │ (REST API)   │  │      │ Signals     │    │ Ideas       │   │
│   └──────────────┘  │      │ (Gemini)    │    │ (Gemini)    │   │
│   ┌──────────────┐  │      └─────────────┘    └─────────────┘   │
│   │ Google News  │──┤                                            │
│   │ (News API)   │  │                                            │
│   └──────────────┘  │                                            │
│   ┌──────────────┐  │                                            │
│   │ APP STORE    │──┘  ◄── NEW SOURCE                            │
│   │ (AppFollow)  │                                               │
│   └──────────────┘                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. External API Strategy

### 2.1 Recommended API Stack

App store data is not available through official Apple/Google APIs for market intelligence. We recommend a layered approach:

| Priority | Service | Purpose | Monthly Cost | Data Provided |
|----------|---------|---------|--------------|---------------|
| Primary (MVP) | AppFollow | Review aggregation, ratings, basic rankings | $99-299 | Reviews, ratings trends, keyword tracking |
| AI Layer | Grok + Gemini | Synthesize insights, extract pain points | Existing | Pattern recognition, opportunity detection |
| Enterprise (Future) | SensorTower | Full market intelligence | $500-2000+ | Downloads, revenue, market share |
| Alternative | Data.ai | Market intelligence | Enterprise pricing | Similar to SensorTower |

### 2.2 MVP Recommendation

For initial implementation, use **AppFollow API** for data collection combined with **existing Gemini/Grok APIs** for intelligent analysis. This provides 80% of the value at 20% of the enterprise cost.

### 2.3 API Authentication

| Service | Authentication Method | Secret Name |
|---------|----------------------|-------------|
| AppFollow | API Key in request header | APPFOLLOW_API_KEY |
| SensorTower (future) | API Key in request header | SENSORTOWER_API_KEY |
| Grok | Bearer token (existing) | GROK_API_KEY |
| Gemini | API key (existing) | GEMINI_API_KEY |

### 2.4 Rate Limits

| Service | Rate Limit | Recommended Usage |
|---------|------------|-------------------|
| AppFollow Basic | 1,000 requests/day | Sufficient for 1 run/day |
| AppFollow Pro | 5,000 requests/day | Sufficient for 3 runs/day |
| SensorTower | Varies by plan | Check contract |

---

## 3. Data Structures

### 3.1 Source Configuration

When calling the App Store source, the following configuration options are available:

**Categories to Monitor**

| Category ID | Display Name | Priority |
|-------------|--------------|----------|
| health-fitness | Health & Fitness | Primary |
| productivity | Productivity | Primary |
| finance | Finance | Primary |
| education | Education | Secondary |
| lifestyle | Lifestyle | Secondary |
| utilities | Utilities | Secondary |
| business | Business | Secondary |
| food-drink | Food & Drink | Secondary |
| games-casual | Casual Games | Gaming |
| games-puzzle | Puzzle Games | Gaming |
| games-strategy | Strategy Games | Gaming |

**Platform Options**: iOS, Android, or both

**Country/Region Options**: US (default), GB, DE, and other major markets

**Review Analysis Settings**

| Setting | Default | Description |
|---------|---------|-------------|
| Star range | 2-4 stars | Which ratings to analyze (2-4 stars contain the most constructive feedback) |
| Minimum review count | 1,000 | Minimum reviews for an app to be included |
| Lookback period | 90 days | How far back to analyze reviews |
| Sample size per app | 500 | Maximum reviews to process per app |

**App Filter Settings**

| Setting | Default | Description |
|---------|---------|-------------|
| Minimum downloads | 100,000 | Exclude apps below this threshold |
| Monetization types | Free, Freemium, Subscription | Which pricing models to include |

### 3.2 Output Data Structure

The App Store source returns a data package containing the following sections:

**Section 1: Top Apps Analysis**

For each analyzed app, the following information is captured:

| Field | Type | Description |
|-------|------|-------------|
| App ID | Text | Unique identifier (bundle ID) |
| App Name | Text | Display name |
| Platform | Text | iOS or Android |
| Category | Text | App store category |
| Downloads | Number | Estimated total downloads |
| Revenue | Number | Estimated monthly revenue (USD) |
| Rating | Decimal | Current average rating (1.0-5.0) |
| Rating Count | Number | Total number of ratings |
| Monetization | Text | Free, Freemium, Paid, or Subscription |
| Price | Number | Price if paid app (null otherwise) |
| Subscription Price | Number | Monthly price if subscription (null otherwise) |
| Core Features | List | 5-10 key features extracted from description |
| Pain Points | List | Specific pain points from this app's reviews |
| Sentiment Summary | Object | Positive themes, negative themes, wishlist items |

**Section 2: Aggregated Pain Points**

Pain points are aggregated across all analyzed apps:

| Field | Type | Description |
|-------|------|-------------|
| Category | Text | One of the 9 pain point categories (see below) |
| Description | Text | Summary of the pain point |
| Affected Apps | List | App names that have this pain point |
| Total Mentions | Number | How many times mentioned across all reviews |
| Average Severity | Decimal | How frustrated users are (1-5 scale) |
| Opportunity Score | Decimal | Calculated value indicating business opportunity |

**Section 3: Friction Opportunities**

AI-identified opportunities where existing apps fail users:

| Field | Type | Description |
|-------|------|-------------|
| Title | Text | Short name for the opportunity |
| Description | Text | 2-3 sentence explanation |
| Category | Text | App store category this applies to |
| Current Problem | Text | What users hate about current apps |
| AI Solution | Text | How AI/automation could solve it |
| Affected Apps | List | Apps with this problem |
| User Quotes | List | 2-5 actual user complaints |
| Market Size | Number | 1-5 scale based on category revenue |
| Friction Severity | Number | 1-5 scale based on pain point severity |
| AI Solvability | Number | 1-5 scale based on technical feasibility |
| Opportunity Score | Decimal | Weighted composite of the three scores |

**Section 4: Market Trends**

| Field | Type | Description |
|-------|------|-------------|
| Rising Categories | List | Categories with growing downloads/revenue |
| Declining Apps | List | Market leaders losing ground |
| Emerging Features | List | New features gaining traction |

**Section 5: Metadata**

| Field | Type | Description |
|-------|------|-------------|
| Fetched At | Timestamp | When the analysis was performed |
| Apps Analyzed | Number | Total apps included in analysis |
| Reviews Processed | Number | Total reviews analyzed |
| Categories | List | Which categories were analyzed |

---

## 4. Pain Point Classification

### 4.1 Pain Point Categories

All extracted pain points are classified into one of nine categories:

| Category | Identifier | Description | Example Keywords |
|----------|------------|-------------|------------------|
| Manual Effort | manual-effort | Tasks requiring excessive user input | "tedious", "time-consuming", "have to enter", "logging everything" |
| Complexity | complexity | Confusing or overwhelming interfaces | "confusing", "complicated", "hard to find", "learning curve" |
| Missing Feature | missing-feature | Desired functionality not present | "wish it had", "should have", "why can't it", "need" |
| Performance | performance | Speed, stability, battery issues | "slow", "crashes", "freezes", "battery drain", "laggy" |
| Pricing | pricing | Cost complaints or paywall frustration | "expensive", "paywall", "subscription", "used to be free" |
| UI/UX | ui-ux | Design and navigation problems | "ugly", "hard to navigate", "cluttered", "bad design" |
| Accuracy | accuracy | Data or results not reliable | "inaccurate", "wrong", "unreliable", "broken" |
| Integration | integration | Connectivity with other apps/services | "doesn't sync", "can't connect", "no integration" |
| Support | support | Customer service issues | "no response", "unhelpful", "can't contact" |

### 4.2 Pain Point Severity Scale

| Score | Label | User Sentiment | Action Priority |
|-------|-------|----------------|-----------------|
| 5 | Critical | "This app is unusable" | Immediate opportunity |
| 4 | Major | "Very frustrating" | Strong opportunity |
| 3 | Moderate | "Annoying but livable" | Good opportunity |
| 2 | Minor | "Could be better" | Nice to have |
| 1 | Trivial | "Small inconvenience" | Low priority |

### 4.3 Friction Opportunity Scoring

Each friction opportunity is scored on three dimensions:

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Market Size | 33% | Based on combined downloads/revenue of affected apps |
| Friction Severity | 40% | Based on aggregated pain point severity |
| AI Solvability | 27% | Based on technical feasibility of AI solution |

**Opportunity Score Calculation**: The three scores (each 1-5) are weighted and combined to produce a final score of 1.0 to 5.0. Opportunities scoring 3.5 or higher are considered high-potential.

---

## 5. Signal Extraction Process

### 5.1 Review Analysis Pipeline

The review analysis follows this sequence:

```
┌─────────────────────────────────────────────────────────────────┐
│                    REVIEW ANALYSIS PIPELINE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: FETCH APPS                                              │
│  ─────────────────                                               │
│  • Query AppFollow for top apps per category                     │
│  • Filter by minimum downloads (100K+)                           │
│  • Filter by monetization type                                   │
│  • Limit to 10 apps per category, 30 apps total                  │
│                                                                  │
│                          ▼                                       │
│                                                                  │
│  Step 2: FETCH REVIEWS                                           │
│  ─────────────────────                                           │
│  • For each app, request recent reviews                          │
│  • Filter to 2-4 star reviews only                               │
│  • Sample up to 500 reviews per app                              │
│  • Sort by helpfulness votes (most helpful first)                │
│                                                                  │
│                          ▼                                       │
│                                                                  │
│  Step 3: EXTRACT PAIN POINTS                                     │
│  ──────────────────────────                                      │
│  • Send review batches to Gemini for NLP analysis                │
│  • Classify each pain point into one of 9 categories             │
│  • Calculate frequency and severity scores                       │
│  • Extract representative quotes                                 │
│                                                                  │
│                          ▼                                       │
│                                                                  │
│  Step 4: AGGREGATE ACROSS APPS                                   │
│  ─────────────────────────────                                   │
│  • Group similar pain points across different apps               │
│  • Calculate cross-app frequency and severity                    │
│  • Identify patterns that affect multiple competitors            │
│                                                                  │
│                          ▼                                       │
│                                                                  │
│  Step 5: IDENTIFY FRICTION OPPORTUNITIES                         │
│  ───────────────────────────────────────                         │
│  • Send aggregated data to Grok for synthesis                    │
│  • Identify 5-7 high-impact opportunities                        │
│  • Score each opportunity on market size, severity, solvability  │
│  • Generate AI solution proposals                                │
│                                                                  │
│                          ▼                                       │
│                                                                  │
│  Step 6: PACKAGE OUTPUT                                          │
│  ─────────────────────                                           │
│  • Compile all data into AppStoreData structure                  │
│  • Add metadata (timestamp, counts, categories)                  │
│  • Return to main pipeline                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 AI Prompting Strategy

**For Pain Point Extraction (Gemini)**:
- Input: Batch of 50-100 reviews from a single app
- Instruction: Identify distinct user frustrations, classify by category, estimate frequency and severity
- Output: List of pain points with category, description, severity score, and example quotes

**For Friction Opportunity Identification (Grok)**:
- Input: Aggregated pain points from all apps + app metadata
- Instruction: Identify patterns where multiple apps share the same problem and AI could provide a solution
- Output: List of 5-7 friction opportunities with scoring and solution proposals

### 5.3 Why 2-4 Star Reviews?

| Rating | Value for Analysis | Reasoning |
|--------|-------------------|-----------|
| 1 star | Low | Usually venting without specific feedback |
| 2 star | High | Specific complaints, user invested enough to explain |
| 3 star | Highest | Balanced feedback, clear on likes and dislikes |
| 4 star | Medium | Minor issues, often contains "wishlist" items |
| 5 star | Low | Usually just praise, not actionable |

---

## 6. Pipeline Integration

### 6.1 Source Registration

The App Store source is registered alongside existing sources:

| Source | Identifier | API | Default Enabled |
|--------|------------|-----|-----------------|
| X/Twitter | x | Grok API | Yes |
| Polymarket | polymarket | REST API | Yes |
| Google News | googlenews | News API | Yes |
| App Store | appstore | AppFollow + AI | Yes |

### 6.2 Execution Order

All sources are fetched in parallel during Stage 1 of the pipeline. Each source is independent and failures are isolated—if App Store fetch fails, the pipeline continues with other sources.

### 6.3 Signal Transformation

App Store friction opportunities are transformed into the standard signal format used by the `analyzeSignals` stage:

| App Store Field | Standard Signal Field | Transformation |
|-----------------|----------------------|----------------|
| Friction Title | Signal | Direct mapping |
| Friction Category | Category | Map to idea category (see mapping below) |
| Opportunity Score | Confidence | Divide by 5 to normalize to 0-1 |
| Friction Severity | Urgency | 4-5 = "immediate", 3 = "short-term", 1-2 = "long-term" |
| Affected Apps | Sources | Include "appstore" plus list of app names |
| AI Solution | Additional context | Passed to idea generation |

**Category Mapping**:

| App Store Category | Idea Category |
|-------------------|---------------|
| health-fitness | mobile |
| productivity | tools |
| finance | saas |
| education | content |
| lifestyle | mobile |
| utilities | tools |
| business | saas |
| food-drink | mobile |
| games-* | games |

### 6.4 Enhanced Signal Analysis

When App Store data is present, the signal analysis stage gives special attention to friction opportunities because they represent validated market demand (users already complaining about the problem).

The analysis prompt is enhanced to:
1. Prioritize opportunities with App Store evidence
2. Cross-reference App Store pain points with signals from other sources
3. Weight friction opportunities higher when they also appear in X/Twitter discussions or news

---

## 7. Firestore Schema Additions

### 7.1 User Document Changes

Add the following fields to the user document:

| Field Name | Type | Default | Description |
|------------|------|---------|-------------|
| appStoreEnabled | Boolean | true | Whether App Store source is enabled for this user |
| appStoreCategories | Array of text | ["health-fitness", "productivity"] | Categories to monitor |
| appStorePlatforms | Array of text | ["ios", "android"] | Platforms to analyze |
| appStoreCountries | Array of text | ["us"] | Markets to analyze |

Update the existing `generationSources` array to accept a new value: "appstore"

### 7.2 Idea Document Changes

Add a new optional field to ideas:

**appStoreInspiration** (object, optional) - Present only for ideas derived from App Store analysis:

| Sub-field | Type | Description |
|-----------|------|-------------|
| sourceApps | Array of text | App names that inspired this idea (competitors to disrupt) |
| sourceCategory | Text | App store category (e.g., "health-fitness") |
| targetPainPoint | Text | The specific pain point being addressed |
| painPointCategory | Text | One of the 9 pain point categories |
| validatingQuotes | Array of text | User quotes that validate the problem (max 5) |
| proposedAiSolution | Text | How AI could solve this problem |
| marketSizeIndicator | Text | One of: "small", "medium", "large", "massive" |

Add a new value to the `source` field enum: "appstore-friction"

### 7.3 Generation Run Changes

Add the following optional field to generation run documents:

**appStoreMetrics** (object, optional) - Present when App Store source was used:

| Sub-field | Type | Description |
|-----------|------|-------------|
| categoriesAnalyzed | Array of text | Which categories were included |
| appsAnalyzed | Number | Total apps analyzed |
| reviewsProcessed | Number | Total reviews processed |
| frictionOpportunitiesFound | Number | Number of opportunities identified |
| ideasGeneratedFromAppStore | Number | Ideas generated from App Store data |

### 7.4 New Index Requirements

Add the following composite indexes:

| Collection | Fields | Purpose |
|------------|--------|---------|
| ideas | source (asc), compositeScore (desc) | Query ideas by source type |
| ideas | appStoreInspiration.sourceCategory (asc), compositeScore (desc) | Filter by app category |

---

## 8. Configuration Options

### 8.1 User-Configurable Settings

These settings are exposed in the UI and can be modified per-user:

| Setting | Options | Default | UI Control |
|---------|---------|---------|------------|
| Enable App Store source | On/Off | On | Toggle switch |
| Categories to monitor | Multi-select from 11 categories | Health & Fitness, Productivity | Checkbox list |
| Platforms | iOS, Android, or Both | Both | Radio buttons |
| Countries | Multi-select | US only | Checkbox list |

### 8.2 System Configuration (Admin Only)

These settings are configured at deployment and not exposed to users:

**Review Analysis**

| Setting | Value | Rationale |
|---------|-------|-----------|
| Star range | 2-4 | Most constructive feedback |
| Max reviews per app | 500 | Cost control |
| Min reviews to include | 1,000 | Data quality |
| Lookback days | 90 | Recent relevance |

**App Filtering**

| Setting | Value | Rationale |
|---------|-------|-----------|
| Min downloads | 100,000 | Market validation |
| Max apps per category | 10 | Cost control |
| Total max apps | 30 | Processing limits |

**AI Processing**

| Setting | Value | Rationale |
|---------|-------|-----------|
| Max friction opportunities | 7 | Quality over quantity |
| Min opportunity score | 3.0 | Filter low-quality |
| Max quotes per opportunity | 5 | Storage efficiency |

**Cost Controls**

| Setting | Value | Rationale |
|---------|-------|-----------|
| Max reviews per run | 10,000 | AI cost cap |
| Max AI calls per run | 25 | API cost cap |

### 8.3 Category Presets

Pre-defined category bundles for common use cases:

| Preset Name | Categories Included | Target User |
|-------------|---------------------|-------------|
| Mobile Focus | Health & Fitness, Productivity, Lifestyle, Food & Drink | Mobile app builders |
| B2B Focus | Productivity, Business, Finance, Utilities | SaaS founders |
| Consumer Focus | Health & Fitness, Education, Lifestyle, Food & Drink | Consumer app builders |
| Games Focus | Casual Games, Puzzle Games, Strategy Games | Game developers |
| Default | Health & Fitness, Productivity, Finance | General use |

---

## 9. Cost Estimation

### 9.1 Per-Run Costs

| Component | Calculation | Estimated Cost |
|-----------|-------------|----------------|
| AppFollow API | ~100 requests per run | ~$0.10 |
| Gemini (review analysis) | ~20 calls × 500 tokens each | ~$0.10 |
| Grok (friction detection) | ~5 calls × 1000 tokens each | ~$0.05 |
| **Total per run** | | **~$0.25** |

### 9.2 Monthly Subscription Costs

| AppFollow Tier | Monthly Cost | Daily Request Limit | Recommended For |
|----------------|--------------|---------------------|-----------------|
| Basic | $99 | 1,000 | 1 run per day |
| Pro | $299 | 5,000 | 3 runs per day |
| Business | $599 | 15,000 | Heavy usage |

### 9.3 Total Monthly Budget

| Usage Pattern | Per-Run Costs | Subscription | Total Monthly |
|---------------|---------------|--------------|---------------|
| Light (1 run/day) | $7.50 | $99 | ~$107 |
| Standard (1 run/day) | $7.50 | $299 | ~$307 |
| Heavy (3 runs/day) | $22.50 | $299 | ~$322 |

### 9.4 Cost Comparison to Other Sources

| Source | Per-Run Cost | Notes |
|--------|--------------|-------|
| X/Twitter (Grok) | $0.05-0.15 | Existing |
| Polymarket | $0.00 | Free API |
| Google News | $0.00 | Free tier |
| App Store | $0.25 | New source |

The App Store source adds approximately $0.25 per run, making total per-run cost approximately $0.45-0.70 (up from $0.20-0.50).

---

## 10. Error Handling

### 10.1 Failure Scenarios

| Scenario | Behavior | User Impact |
|----------|----------|-------------|
| AppFollow API down | Log error, skip App Store source | Pipeline continues with other sources |
| AppFollow rate limit | Queue for retry, log warning | Delayed data or partial results |
| No apps found for category | Return empty results for category | Other categories still processed |
| Gemini/Grok timeout | Retry up to 3 times with backoff | May have fewer pain points |
| All categories empty | Return null for App Store source | Pipeline continues without App Store |

### 10.2 Graceful Degradation

The pipeline is designed to continue even if App Store source fails completely. Users will see ideas from remaining sources. The generation run log will record the App Store error for debugging.

### 10.3 Retry Policy

| Error Type | Max Retries | Backoff | Notes |
|------------|-------------|---------|-------|
| Rate limit (429) | 3 | Exponential (1s, 2s, 4s) | Respect API limits |
| Server error (5xx) | 3 | Linear (2s, 4s, 6s) | Temporary issues |
| Timeout | 2 | Linear (5s, 10s) | Slow responses |
| Auth error (401/403) | 0 | None | Requires manual fix |

---

## 11. Monitoring and Observability

### 11.1 Metrics to Track

| Metric | Type | Alert Threshold |
|--------|------|-----------------|
| Apps analyzed per run | Counter | Alert if <5 |
| Reviews processed per run | Counter | Alert if <100 |
| Friction opportunities found | Counter | Alert if 0 for 3 runs |
| AppFollow API latency | Timer | Alert if >10s average |
| AppFollow API error rate | Percentage | Alert if >10% |
| Pain points per app (avg) | Gauge | Alert if <2 |

### 11.2 Logging Requirements

Log the following at each stage:

| Stage | Log Level | Information |
|-------|-----------|-------------|
| Start fetch | INFO | Categories, platforms, countries |
| Apps fetched | INFO | Count per category |
| Reviews fetched | DEBUG | Count per app |
| Pain points extracted | INFO | Total count, category breakdown |
| Opportunities identified | INFO | Count, top scores |
| Complete | INFO | Duration, total reviews, total apps |
| Error | ERROR | Stage, error message, stack trace |

### 11.3 Alerts

| Condition | Severity | Action |
|-----------|----------|--------|
| AppFollow fails 3x consecutively | High | Notify on-call, check API status |
| Review processing cost exceeds $1 | Medium | Review cost controls |
| Zero friction opportunities found | Medium | Check data quality |
| API latency >15s | Low | Monitor trend |

---

## 12. Security and Privacy

### 12.1 Data Handling

| Data Type | Storage | Retention | Notes |
|-----------|---------|-----------|-------|
| Raw reviews | Not stored | N/A | Processed in memory only |
| Pain points | Aggregated only | Permanent | No individual reviews stored |
| User quotes | Anonymized | Permanent | Names removed if accidentally included |
| App metadata | Stored | Permanent | Public information only |

### 12.2 API Key Security

All API keys are stored in Cloud Secret Manager and accessed via Firebase Functions secrets. Keys are never logged or exposed to client code.

### 12.3 Privacy Considerations

- App reviews are public data; no special privacy handling required
- User quotes from reviews may occasionally contain names; implement regex filter to remove potential PII before storage
- Do not store reviewer usernames or IDs

---

## 13. Implementation Phases

### Phase 1: MVP (Estimated: 2 weeks)

**Goals**:
- AppFollow API integration working
- Basic review fetching for 2-3 categories
- Gemini-based pain point extraction
- Pipeline integration
- Basic Firestore schema updates

**Deliverables**:
- Fetch function for App Store source
- Pain point extraction working
- Ideas generated from App Store data
- Generation runs include App Store metrics

### Phase 2: Enhancement (Estimated: 2 weeks)

**Goals**:
- Full category support (all 11 categories)
- Friction opportunity detection with Grok
- Market trend analysis
- User configuration UI
- Complete Firestore schema

**Deliverables**:
- Settings page for App Store configuration
- Friction opportunity scoring
- appStoreInspiration field populated on ideas
- Category presets

### Phase 3: Scale (Future)

**Goals**:
- SensorTower integration for enterprise data
- Historical trend analysis
- Competitor tracking alerts
- Custom category creation

**Deliverables**:
- Enterprise API integration
- Trend visualization
- Alert system

---

## 14. Open Questions

| Question | Options | Recommendation | Decision Needed |
|----------|---------|----------------|-----------------|
| Which AppFollow tier? | Basic ($99) or Pro ($299) | Start with Basic, upgrade if needed | Before implementation |
| Include gaming categories? | Yes/No | No for MVP, add in Phase 2 | Product decision |
| Store raw pain points? | Yes/No | No, only aggregated | Confirmed |
| Enable by default for all users? | Yes/No | Yes, with ability to disable | Product decision |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | April 8, 2026 | Rotem-Goldman | Initial specification with code samples |
| 1.1 | April 8, 2026 | Rotem-Goldman | Revised to prose format, removed all code |

---

*End of Specification*
