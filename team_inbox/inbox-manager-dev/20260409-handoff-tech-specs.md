# Technical Specifications Handoff - Idea Forge MVP

**From**: Tech Specs Team
**To**: Development Manager
**Date**: April 9, 2026
**Priority**: HIGH - Ready for Implementation

---

## Executive Summary

All technical specifications for **Idea Forge Pipeline-First MVP** are complete and implementation-ready. The core value proposition is **automated daily idea generation** from market signals - the dashboard is secondary.

**Total documentation**: ~379KB across 6 specification documents.

---

## What We're Building

**Idea Forge** is an AI-powered idea generation pipeline for solo founders that:

1. **Automatically generates** 5-15 scored business ideas daily
2. **Monitors** 4 data sources: X/Twitter (Grok), Polymarket, Google News, App Store
3. **Scores** every idea with AI reasoning (strengths, risks, business plan)
4. **Presents** ideas in a dashboard for review, filtering, and tracking

**The pipeline runs automatically at 6 AM UTC** + manual triggers with source-specific options.

---

## Specification Documents

| Document | Location | What It Covers |
|----------|----------|----------------|
| **Master Index** | `docs/technical/tech-specs.md` | Start here - architecture overview, MVP matrix, implementation sequence |
| **Backend Pipeline** | `docs/technical/backend-pipeline-spec.md` | Cloud Functions, data sources, AI processing, scheduler |
| **Frontend Architecture** | `docs/technical/frontend-architecture.md` | Next.js structure, components, state management, generation UI |
| **API Contracts** | `docs/technical/api-contracts.md` | TypeScript interfaces, endpoints, validation, error codes |
| **Database Schema** | `docs/technical/firestore-schema.md` | Firestore collections, indexes, security rules |
| **Auth & Security** | `docs/technical/auth-security.md` | Firebase Auth, Cloud Functions auth, rate limiting |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14+ (App Router), Tailwind CSS, shadcn/ui, TanStack Query |
| Backend | Firebase Cloud Functions (Node.js 20) |
| Database | Cloud Firestore |
| Auth | Firebase Authentication (Email + Google OAuth) |
| AI | Gemini API (generation + scoring), Grok API (X/Twitter trends) |
| Scheduler | Cloud Scheduler (daily runs) |
| Secrets | Cloud Secret Manager (API keys) |

---

## MVP Feature Summary

### Pipeline Features (PRIMARY)
- Daily scheduled generation (Cloud Scheduler @ 6 AM UTC)
- Manual "Generate Ideas" button (all sources)
- Source-specific generation dropdown:
  - From X/Twitter only
  - From Polymarket only
  - From Google News only
  - From App Store only
- 4 data source integrations
- AI signal analysis (Gemini)
- AI idea generation (5-15 ideas per run)
- AI auto-scoring (5 parameters + reasoning)
- Generation settings panel
- Generation history view

### Dashboard Features (SECONDARY)
- Idea grid with cards
- Status tabs (New, Reviewing, Pursuing, Parked)
- Filtering and sorting
- Detail slide-over panel
- Source badges + "NEW" badges
- Manual idea CRUD
- Notes per idea
- Responsive (desktop + mobile)

---

## Implementation Sequence (Recommended)

### Phase 1: Pipeline Infrastructure
1. Firebase project setup + Secret Manager
2. Cloud Functions scaffolding
3. Data source integrations (Grok, Polymarket, News API, App Store)
4. AI processing (Gemini analysis + generation + scoring)
5. Firestore persistence
6. Cloud Scheduler configuration

### Phase 2: Dashboard Foundation
1. Next.js app scaffolding
2. Firebase Auth integration
3. TanStack Query setup
4. Core layout + routing

### Phase 3: Generation UI
1. GenerateButtonGroup (with source dropdown)
2. GenerationProgress indicator
3. GenerationSettings panel
4. GenerationHistory view

### Phase 4: Idea Management
1. IdeaGrid + IdeaCard
2. DetailSlideOver
3. Filtering + sorting
4. Notes system

### Phase 5: Polish
1. Loading states (skeletons)
2. Error handling
3. Mobile responsiveness
4. Performance optimization

---

## Key Technical Decisions Already Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State management | TanStack Query | Caching, optimistic updates, polling |
| Polling vs WebSockets | Polling (2s) | Simpler, generation is ~30-60s |
| API key storage | Cloud Secret Manager | Industry standard, runtime injection |
| Generation rate limit | 5/hour manual | Balances usability and cost |
| Default ideas per run | 10 | Good balance, configurable 5-25 |

---

## Cost Estimates

| Item | Cost |
|------|------|
| Per generation run | ~$0.22 - $0.55 |
| Monthly (daily runs + ~10 manual) | ~$9 - $22 |

---

## Open Questions (Need Decisions)

1. **API key rotation** - What's the procedure if a key is compromised?
2. **Generation failure alerts** - Email? Slack? Dashboard notification?
3. **Cost monitoring** - Alert threshold for unexpected spikes?
4. **Fallback behavior** - If all sources fail, retry? Notify user?

---

## Getting Started

1. Read `docs/technical/tech-specs.md` for the complete overview
2. Set up Firebase project with required services
3. Configure Secret Manager with API keys (Gemini, Grok, News API)
4. Start with Phase 1: Pipeline Infrastructure

---

## Questions?

All specs are designed to be implementation-ready. If anything is unclear or needs clarification, the Tech Specs team is available.

---

*Tech Specs Team*
*Specifications complete: April 9, 2026*
