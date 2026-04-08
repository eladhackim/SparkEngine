# Idea Forge: Concept Document

**Status**: Validated Concept
**Date**: April 8, 2026
**Research Team**: Emma Clark, Ayelet Davis, Aviv Ben-David, Hannah Davidov

---

## Executive Summary

**Idea Forge** is a web-based dashboard that uses AI (Grok, Polymarket, Gemini) to generate, score, and manage business/app ideas. It serves as a "money generator" - surfacing opportunities ranging from casual games to SaaS platforms - with structured evaluation for informed decision-making.

### The Opportunity

The market for AI-powered idea tools is **fragmented**. No single platform owns the end-to-end idea lifecycle:
- Generation tools don't validate
- Validation tools don't track portfolios
- Portfolio tools lack AI intelligence
- Everything is point-in-time, not real-time

**Idea Forge fills this gap** by unifying generation, validation, scoring, and portfolio management in one living system.

### Why Now

1. **AI API costs have dropped** - Full idea processing costs ~$0.35-0.50/idea
2. **Grok provides unique X/Twitter data** - 500M posts/day of trend signals
3. **Polymarket is now US-accessible** - CFTC regulated prediction markets
4. **Solo founders are underserved** - Enterprise tools dominate; indie hackers need better

---

## 1. Product Vision

### Core Value Proposition

> "The only platform where entrepreneurs generate, validate, score, and track ideas in one place - with real-time market intelligence that keeps ideas fresh."

### Target User

**You** - A serial entrepreneur/builder who needs:
- Fast idea generation from market signals
- Structured evaluation before committing time
- Portfolio tracking across many potential projects
- Quick filtering to find the best opportunities
- Notes and status tracking as ideas evolve

### Key Differentiators

1. **Unified Lifecycle** - Generate → Validate → Score → Track → Compare
2. **Living Portfolio** - Ideas are continuously monitored, not snapshot-validated
3. **Real-Time Market Data** - Grok's X integration + Polymarket signals
4. **Affordable Exploration** - Generous free tier, not per-report pricing

---

## 2. Technical Architecture

### AI Integration Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    IDEA FORGE PIPELINE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STAGE 1: SIGNAL DETECTION                                      │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │   Polymarket    │    │      Grok       │                     │
│  │   (Viability)   │    │   (Trends)      │                     │
│  │  >80% = signal  │    │  X/Twitter data │                     │
│  └────────┬────────┘    └────────┬────────┘                     │
│           └────────────┬─────────┘                              │
│                        ▼                                        │
│  STAGE 2: IDEA GENERATION (Grok)                                │
│  • Raw ideas from signals                                       │
│  • Diverse categories: games, tools, platforms                  │
│                        │                                        │
│                        ▼                                        │
│  STAGE 3: REFINEMENT (Gemini)                                   │
│  • Structured JSON output                                       │
│  • Score, categorize, format                                    │
│  • Business plan generation                                     │
│                        │                                        │
│                        ▼                                        │
│  STAGE 4: VALIDATION (Cross-reference)                          │
│  • Market timing check                                          │
│  • Final scoring                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### AI Service Breakdown

| Service | Role | Cost | Unique Value |
|---------|------|------|--------------|
| **Grok** | Trend detection, idea generation | $0.20-$3/M tokens | Real-time X/Twitter (500M posts/day) |
| **Polymarket** | Market viability signals | Free API | Prediction market probabilities |
| **Gemini** | Structured output, refinement | Free tier available | Native JSON Schema support |

**Estimated cost per idea**: $0.35-0.50 fully processed

### Phased Implementation

1. **Phase 1**: Gemini only (free tier, quick start)
2. **Phase 2**: Add Grok (unique X data)
3. **Phase 3**: Add Polymarket (validation layer)
4. **Phase 4**: Full automation pipeline

---

## 3. Scoring System

### Parameters (10 Total)

**Core (5 Required)**:
| Parameter | What It Measures |
|-----------|------------------|
| Business Potential | Revenue opportunity, market size, monetization |
| Development Complexity | Technical effort, team size, maintenance |
| Time to Market | MVP timeline, dependencies, blockers |
| Competition Level | Market saturation, barriers, differentiation |
| Risk Level | Technical, market, execution, regulatory risks |

**Additional (5 Optional)**:
| Parameter | What It Measures |
|-----------|------------------|
| Trend Alignment | Market timing, wave riding |
| Founder-Market Fit | Skills match, domain expertise |
| Growth Potential | Viral mechanics, organic channels |
| Defensibility | Moats, network effects, barriers |
| Capital Efficiency | Path to profitability, funding needs |

### Scoring Mechanics

- **Scale**: 1-5 integers (simple, intuitive)
- **Weighting**: Customizable weights with presets (Conservative, Aggressive, Solo Founder)
- **Composite**: Weighted average producing 1.0-5.0 overall score

### Decision Tiers

| Score | Tier | Action |
|-------|------|--------|
| 4.0 - 5.0 | **HOT** | Pursue immediately |
| 3.0 - 3.9 | **WARM** | Worth exploring |
| 2.0 - 2.9 | **PARK** | Save for later |
| 1.0 - 1.9 | **DISCARD** | Archive |

### Trade-off Flags

| Flag | Condition |
|------|-----------|
| High Risk / High Reward | High potential but significant risks |
| Hidden Gem | Great potential, low competition |
| Quick Win | Fast and cheap to validate |
| Moonshot | Huge potential, major challenges |

---

## 4. UX Design

### Dashboard Views

**Main Grid View**:
- 4 columns (desktop), 1 column (mobile)
- Cards show: name, score, brief, status, category
- Status tabs: All / Reviewing / Pursuing / Parked
- Sort by: Score, Date, Name

**Detail View**:
- Slide-over panel (desktop) / Full-screen (mobile)
- Accordion sections: Strengths, Risks, Business Plan, Pitch, Notes
- Status dropdown for quick changes
- Keyboard navigation (j/k, e, s)

**Compare View** (Desktop only):
- Side-by-side comparison of up to 3 ideas
- Score breakdown visualization
- Quick action buttons

### Information Hierarchy

| Tier | Content | Visibility |
|------|---------|------------|
| **1 (Card)** | Name, overall score, brief, status, category | Always visible |
| **2 (Detail)** | Full brief, all scores, tags | On card click |
| **3 (Expandable)** | Strengths, risks, business plan, pitch, notes | On section expand |

### Mobile Strategy

| Aspect | Mobile | Desktop |
|--------|--------|---------|
| Grid | 1 column | 4 columns |
| Detail view | Full-screen | Slide-over panel |
| Navigation | Swipe gestures | Keyboard shortcuts |
| Bulk select | Long-press | Checkbox on hover |
| Filters | Bottom sheet | Dropdown panel |

---

## 5. Data Architecture (Firebase)

### Firestore Structure

```
/users/{userId}
  - email, displayName, preferences

/users/{userId}/ideas/{ideaId}
  - companyName: string
  - brief: string
  - status: "new" | "reviewing" | "pursuing" | "parked" | "rejected"
  - category: string
  - tags: string[]
  - strengths: string[]
  - risks: string[]
  - businessPlan: { monetization, goToMarket, targetMarket, competitiveAdvantage }
  - elevatorPitch: string
  - scores: { overall, marketPotential, technicalFeasibility, uniqueness, riskLevel, timeToMarket }
  - createdAt, updatedAt

/users/{userId}/ideas/{ideaId}/notes/{noteId}
  - content, createdAt, updatedAt
```

### Key Design Decisions

- **Ideas as subcollection of Users** - Natural security boundary
- **Notes as subcollection of Ideas** - Keeps idea documents bounded
- **Denormalized scores** - Fast filtering without joins
- **Array tags** - Supports Firestore array-contains queries

### Required Indexes

- status + scores.overall
- category + scores.overall
- tags (array-contains) + scores.overall
- Score range queries

---

## 6. Competitive Positioning

### Market Landscape

| Category | Key Players | Gap |
|----------|-------------|-----|
| AI Idea Generators | ValidatorAI, IdeaProof | No portfolio, one-shot only |
| Problem Discovery | BigIdeasDB | No generation, paywall |
| Business Planning | IdeaBuddy | Manual, no AI |
| Trend Tools | Exploding Topics | Data only, no ideas |
| Enterprise | Brightidea | Overkill for solo |

### Our Positioning

| Against | Our Counter |
|---------|-------------|
| ValidatorAI | "We don't just validate once - we monitor continuously" |
| BigIdeasDB | "We don't just find problems - we generate and validate solutions" |
| Notion Templates | "We're not just structure - we're AI-powered intelligence" |
| Exploding Topics | "We don't just show trends - we turn them into actionable ideas" |

---

## 7. Strengths

1. **Unified Platform** - Only end-to-end solution in market
2. **Real-Time Intelligence** - Grok's X data is unique differentiator
3. **Affordable** - ~$0.35/idea vs $19-49/report competitors
4. **Living Portfolio** - Ideas stay fresh, not snapshots
5. **Solo-Founder Focused** - Right-sized for target market
6. **Proven Tech Stack** - Firebase, modern APIs, no exotic tech
7. **Clear Business Model** - Freemium with paid tiers

---

## 8. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| **API Dependencies** | High | Multi-provider fallbacks, caching |
| **Grok X data access changes** | High | Gemini fallback for generation |
| **Cost overruns at scale** | Medium | Aggressive caching, batch processing |
| **Competitor copies features** | Medium | Move fast, build data moat |
| **User adoption** | Medium | Generous free tier, viral hooks |
| **AI output quality** | Medium | Human review layer, feedback loops |
| **Polymarket regulatory changes** | Low | It's a nice-to-have, not core |

---

## 9. Product Decisions (Resolved)

| Question | Decision | Rationale |
|----------|----------|-----------|
| **Sharing** | No | Personal tool, single user |
| **Export** | No | Not needed for personal workflow |
| **Generation** | Both manual + auto | Maximum flexibility |
| **Pricing** | N/A | Personal tool, no billing |
| **Notifications** | Optional/Later | Nice-to-have, not MVP |
| **Version History** | No | Keep it simple |

### Architecture Simplifications

Since this is a **personal tool**:
- No multi-user auth complexity
- No team/collaboration features
- No billing/subscription system
- No sharing permissions
- Single Firebase user document tree

This reduces scope by ~40% and accelerates MVP timeline.

---

## 10. Recommended Next Steps

### Immediate (Product Spec Phase)

1. **Validate** architecture with tech team
2. **Decide** open questions above
3. **Design** detailed user flows
4. **Define** API contracts for AI services
5. **Prototype** key interactions

### Implementation Priority

| Phase | Focus | Deliverable |
|-------|-------|-------------|
| **MVP** | Core dashboard | View ideas, filter, sort, status, notes |
| **v1.1** | AI Generation | Gemini integration (manual prompts) |
| **v1.2** | Auto-Suggestions | Grok trend monitoring + auto-generated ideas |
| **v1.3** | Market Signals | Polymarket validation layer |
| **v2.0** | Intelligence | Score refresh, trend alerts |

### Idea Generation Modes

Since you want **both** manual and auto:

1. **Manual Mode**:
   - You provide a prompt/topic/signal
   - AI generates ideas based on your input
   - Full control over direction

2. **Auto-Suggestion Mode**:
   - System monitors trends (Grok + Polymarket)
   - Periodically generates new ideas automatically
   - You review and accept/reject into portfolio
   - Can run daily/weekly or on-demand

### Tech Spec Inputs

- Firebase project setup + security rules
- AI API integration patterns
- Responsive web framework (Next.js recommended)
- State management (React Query)

---

## 11. Summary Recommendation

**Proceed with Idea Forge.**

As a **personal tool**, this is well-scoped and buildable:
- **Technical feasibility**: AI integration is proven, cost-effective (~$0.35/idea)
- **Simplified scope**: No auth complexity, no billing, no collaboration
- **Clear value**: Replaces your spreadsheets + manual research with AI-powered pipeline

**Confidence Level**: HIGH

**Key Success Factors**:
1. Nail the core loop first (generate → score → track)
2. Start with Gemini (free tier) to validate workflow
3. Add Grok for unique trend data once core works
4. Keep UI simple - this is a power tool, not a consumer app

---

## Research References

- Track 1: [AI Integration Research](research/track1-ai-integration.md)
- Track 2: [Scoring System Design](research/track2-scoring-system.md)
- Track 3: [Competitive Analysis](research/track3-competitive-analysis.md)
- Track 4: [UX/Data Architecture](research/track4-ux-architecture.md)

---

*Document synthesized by Ideation Manager from parallel research tracks.*
*Ready for Product Specification phase.*
