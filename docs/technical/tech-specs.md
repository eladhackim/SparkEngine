# Idea Forge: Technical Specifications Index

**Status**: Implementation-Ready
**Version**: 1.1
**Date**: April 8, 2026
**Updated**: Pipeline-First MVP

---

## 1. Executive Summary

### Product Overview

**Idea Forge** is a **pipeline-first** AI-powered idea management platform for solo founders. The platform automatically generates business ideas from real-time market signals, scores them using AI, and presents them in a clean dashboard for evaluation.

### Core Value Proposition

> **Generation is PRIMARY, Dashboard is SECONDARY**

The automated idea generation pipeline is the heart of the product:
- **Daily Scheduled Generation**: Pipeline runs automatically at 6:00 AM UTC
- **Multi-Source Data**: Aggregates signals from X/Twitter, Polymarket, and Google News
- **AI Analysis**: Uses Grok and Gemini to analyze trends and generate scored ideas
- **Manual Trigger**: Users can also trigger generation on-demand via UI button

### Target User

- **Primary**: Solo entrepreneurs and indie hackers
- **Use Case**: Automated discovery of business opportunities
- **Model**: Single-user application (no teams, no sharing, no multi-tenancy)

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Pipeline** | Firebase Cloud Functions | Automated idea generation orchestration |
| **AI** | Grok API + Gemini API | Data fetching (X/Twitter) + Analysis/Generation |
| **Data Sources** | Polymarket + News API | Market predictions + trending headlines |
| **Frontend** | Next.js 14+ (App Router) | Server components, routing, SSR |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS, component library |
| **State** | TanStack Query v5 | Server state, caching, mutations |
| **Backend** | Firebase v9 (modular) | Auth, Firestore, Hosting, Functions |
| **Database** | Cloud Firestore | NoSQL document database |
| **Auth** | Firebase Authentication | Email/Password + Google OAuth |
| **Secrets** | Cloud Secret Manager | API keys for Grok, Gemini, News API |
| **Scheduler** | Cloud Scheduler | Daily 6 AM UTC trigger |
| **Language** | TypeScript (strict) | End-to-end type safety |

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Pipeline-first** | Automated generation is the primary value, dashboard is secondary |
| **Cloud Functions orchestration** | Reliable, scalable, and cost-effective for daily jobs |
| **Multi-source validation** | Cross-referencing signals increases idea quality |
| **AI auto-scoring** | Eliminates friction - ideas arrive pre-scored |
| **Firestore-first** | Direct client access with security rules, no REST API layer |
| **User-scoped data** | All data under `/users/{userId}/` for simple isolation |
| **TanStack Query** | Optimistic updates, caching, and real-time sync |
| **App Router** | Modern React patterns and server components |
| **URL-driven filters** | Shareable, bookmarkable views |

---

## 2. Specification Documents

### Quick Reference Table

| Specification | Document | Key Contents | Author |
|---------------|----------|--------------|--------|
| **Pipeline** | [Backend Pipeline](./backend-pipeline-spec.md) | Cloud Functions, data sources, AI processing, scheduler | Ideation Manager |
| **Database** | [Firestore Schema](./firestore-schema.md) | Collections, documents, indexes, security rules | Hana Rosenberg |
| **Frontend** | [Frontend Architecture](./frontend-architecture.md) | App Router, components, state management, hooks | Michal Xu |
| **Data Models** | [API Contracts](./api-contracts.md) | TypeScript interfaces, validation, state machine | Evelyn Jones |
| **Security** | [Auth & Security](./auth-security.md) | Auth flows, protected routes, security rules | Noah Harris |

### Document Purpose

- **Backend Pipeline**: The core value - automated idea generation from market signals using AI
- **Firestore Schema**: Implementation-ready database structure with complete field definitions, indexes, and security rules
- **Frontend Architecture**: Component hierarchy, routing, state management patterns, and data flow diagrams
- **API Contracts**: TypeScript types, validation rules, status transitions, and scoring algorithms
- **Auth & Security**: Authentication flows, session management, and security best practices

---

## 3. Architecture Overview

### Pipeline-First System Architecture

The generation pipeline is the primary flow - ideas are created automatically. The dashboard is the secondary flow for reviewing and managing generated ideas.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRIMARY FLOW: GENERATION PIPELINE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                           TRIGGERS                                           │
│              ┌─────────────────┬─────────────────┐                          │
│              │ Cloud Scheduler │  Manual Trigger │                          │
│              │ (Daily @ 6 AM)  │  (HTTP/UI)      │                          │
│              └────────┬────────┴────────┬────────┘                          │
│                       │                 │                                    │
│                       └────────┬────────┘                                    │
│                                ▼                                             │
│              ┌─────────────────────────────────┐                            │
│              │    generateIdeas (Cloud Fn)     │                            │
│              │    Orchestrates entire pipeline │                            │
│              └─────────────────────────────────┘                            │
│                                │                                             │
│     ┌──────────────────────────┼──────────────────────────┐                 │
│     │                          │                          │                  │
│     ▼                          ▼                          ▼                  │
│ ┌─────────┐             ┌───────────┐             ┌───────────┐             │
│ │  Grok   │             │ Polymarket│             │ News API  │             │
│ │(X/Twitter)            │  (Markets)│             │(Headlines)│             │
│ └────┬────┘             └─────┬─────┘             └─────┬─────┘             │
│      │                        │                         │                    │
│      └────────────────────────┼─────────────────────────┘                   │
│                               ▼                                              │
│              ┌─────────────────────────────────┐                            │
│              │  Gemini AI                       │                            │
│              │  - Analyze signals               │                            │
│              │  - Generate ideas                │                            │
│              │  - Score & rank                  │                            │
│              └─────────────────────────────────┘                            │
│                               │                                              │
│                               ▼                                              │
│              ┌─────────────────────────────────┐                            │
│              │  Cloud Firestore                 │                            │
│              │  - Save scored ideas             │                            │
│              │  - Log generation run            │                            │
│              └─────────────────────────────────┘                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                │
                                │ Ideas ready for review
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SECONDARY FLOW: DASHBOARD                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         USER (Solo Founder)                          │   │
│  │  - View generated ideas with scores                                  │   │
│  │  - Trigger manual generation                                         │   │
│  │  - Change status (new → reviewing → pursuing/parked/rejected)        │   │
│  │  - Add notes                                                         │   │
│  │  - Filter/sort ideas                                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                │                                            │
│                                ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       NEXT.JS 14+ APP                                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │   │
│  │  │  App Router │  │  TanStack   │  │  shadcn/ui  │                  │   │
│  │  │  (Dashboard)│  │  Query      │  │  Components │                  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                │                                            │
│                                ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      CLOUD FIRESTORE                                 │   │
│  │  /users/{userId}/ideas         - AI-generated + manual ideas        │   │
│  │  /users/{userId}/generationRuns - Pipeline execution history        │   │
│  │  /users/{userId}/settings      - Generation preferences             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Summary

**Pipeline Flow (Primary)**:
```
Scheduler/Manual → Cloud Function → Data Sources → AI Analysis → Firestore (ideas saved)
```

**Dashboard Flow (Secondary)**:
```
User Action → React Component → TanStack Mutation → Firestore SDK → Cloud Firestore
                  ↑                    │
                  │                    ▼
            UI Update ←──── Optimistic Update + Cache Invalidation
```

---

## 4. MVP Feature Matrix

### 4.1 Pipeline Features (PRIMARY)

These are the core value features - automated idea generation.

| Feature | Pipeline | Database | Frontend | API | Security |
|---------|:--------:|:--------:|:--------:|:---:|:--------:|
| **Daily Scheduled Generation** | [Scheduler](./backend-pipeline-spec.md#6-scheduler-configuration) | [GenerationRuns](./firestore-schema.md#34-generation-run-document) | - | - | [API Keys](./backend-pipeline-spec.md#12-security-considerations) |
| **Manual Generation Trigger** | [HTTP Trigger](./backend-pipeline-spec.md#21-main-orchestrator-generateideas) | [GenerationRuns](./firestore-schema.md#34-generation-run-document) | [GenerateButton](./backend-pipeline-spec.md#81-manual-trigger-button) | [POST /generate](./backend-pipeline-spec.md#71-manual-trigger-endpoint) | [Auth Required](./backend-pipeline-spec.md#12-security-considerations) |
| **X/Twitter Data Collection** | [Grok API](./backend-pipeline-spec.md#31-xtwitter-via-grok-api) | - | - | - | [Rate Limits](./backend-pipeline-spec.md#103-rate-limiting) |
| **Polymarket Data Collection** | [REST API](./backend-pipeline-spec.md#32-polymarket-api) | - | - | - | - |
| **Google News Collection** | [News API](./backend-pipeline-spec.md#33-google-news-api) | - | - | - | [API Key](./backend-pipeline-spec.md#12-security-considerations) |
| **AI Signal Analysis** | [Gemini](./backend-pipeline-spec.md#41-signal-analysis) | - | - | - | - |
| **AI Idea Generation** | [Gemini](./backend-pipeline-spec.md#42-idea-generation) | [Idea Document](./firestore-schema.md#32-idea-document) | - | - | - |
| **AI Auto-Scoring** | [Gemini](./backend-pipeline-spec.md#43-idea-scoring) | [Scoring Fields](./firestore-schema.md#32-idea-document) | - | - | - |
| **Generation Settings** | - | [User Document](./firestore-schema.md#31-user-document) | [SettingsPanel](./backend-pipeline-spec.md#82-generation-settings-panel) | [User Settings](./firestore-schema.md#35-settings-document) | [Owner Only](./firestore-schema.md#6-security-rules) |
| **Generation History** | - | [GenerationRuns](./firestore-schema.md#34-generation-run-document) | - | [GET /history](./backend-pipeline-spec.md#73-generation-history-endpoint) | [Read Only](./firestore-schema.md#6-security-rules) |
| **NEW Badge (Freshness)** | - | [viewedAt Field](./firestore-schema.md#32-idea-document) | [IdeaCard](./frontend-architecture.md#41-dashboard-page) | - | - |

### 4.2 Dashboard Features (SECONDARY)

| Feature | Database | Frontend | API | Security | Notes |
|---------|:--------:|:--------:|:---:|:--------:|-------|
| **User Registration** | - | [Auth pages](./frontend-architecture.md#2-app-directory-structure) | - | [Registration flow](./auth-security.md#21-emailpassword-registration) | Email/Password + Google OAuth |
| **User Login** | - | [Auth pages](./frontend-architecture.md#2-app-directory-structure) | - | [Login flow](./auth-security.md#22-emailpassword-login) | Session persistence |
| **Logout** | - | [UserMenu](./frontend-architecture.md#41-dashboard-page) | - | [Logout flow](./auth-security.md#25-logout-flow) | Clears all session data |
| **Create Idea** | [Idea document](./firestore-schema.md#32-idea-document) | [IdeaForm](./frontend-architecture.md#41-dashboard-page) | [Create Idea](./api-contracts.md#51-create-idea) | [Security rules](./firestore-schema.md#6-security-rules) | All 5 core scores required |
| **View Ideas Grid** | [Indexes](./firestore-schema.md#5-required-firestore-indexes) | [IdeaGrid](./frontend-architecture.md#41-dashboard-page) | [List Ideas](./api-contracts.md#53-list-ideas) | [Read rules](./firestore-schema.md#6-security-rules) | Pagination, filtering, sorting |
| **View Idea Detail** | [Idea document](./firestore-schema.md#32-idea-document) | [DetailSlideOver](./frontend-architecture.md#42-detail-panel-slide-over) | [Get Idea](./api-contracts.md#52-get-idea) | [Read rules](./firestore-schema.md#6-security-rules) | Slide-over on desktop |
| **Update Idea** | [Idea document](./firestore-schema.md#32-idea-document) | [IdeaForm](./frontend-architecture.md#41-dashboard-page) | [Update Idea](./api-contracts.md#54-update-idea) | [Update rules](./firestore-schema.md#6-security-rules) | Partial updates supported |
| **Delete Idea** | [Data lifecycle](./firestore-schema.md#7-data-lifecycle) | [MoreMenu](./frontend-architecture.md#42-detail-panel-slide-over) | [Delete Idea](./api-contracts.md#56-delete-idea) | [Delete rules](./firestore-schema.md#6-security-rules) | Soft-delete recommended |
| **Change Status** | [Status enum](./firestore-schema.md#32-idea-document) | [StatusDropdown](./frontend-architecture.md#62-statusdropdown) | [Change Status](./api-contracts.md#55-change-status) | [Update rules](./firestore-schema.md#6-security-rules) | State machine validated |
| **Score Idea** | [Scoring fields](./firestore-schema.md#32-idea-document) | [ScoreBreakdown](./frontend-architecture.md#42-detail-panel-slide-over) | [Score calculation](./api-contracts.md#4-score-calculation) | [Validation](./firestore-schema.md#6-security-rules) | 5 core parameters |
| **Filter Ideas** | [Indexes](./firestore-schema.md#5-required-firestore-indexes) | [FilterPanel](./frontend-architecture.md#64-filterpanel) | [Query params](./api-contracts.md#6-query-parameters-specification) | - | URL-driven state |
| **Sort Ideas** | [Indexes](./firestore-schema.md#5-required-firestore-indexes) | [SortDropdown](./frontend-architecture.md#41-dashboard-page) | [Query params](./api-contracts.md#62-sorting) | - | Score, date, name |
| **Add Note** | [Note document](./firestore-schema.md#33-note-document) | [NoteForm](./frontend-architecture.md#42-detail-panel-slide-over) | [Create Note](./api-contracts.md#57-create-note) | [Note rules](./firestore-schema.md#6-security-rules) | 2000 char limit |
| **View Notes** | [Notes subcollection](./firestore-schema.md#33-note-document) | [NotesList](./frontend-architecture.md#42-detail-panel-slide-over) | [List Notes](./api-contracts.md#58-list-notes) | [Read rules](./firestore-schema.md#6-security-rules) | Sorted by date |
| **Edit Note** | [Note document](./firestore-schema.md#33-note-document) | [NoteItem](./frontend-architecture.md#42-detail-panel-slide-over) | [Update Note](./api-contracts.md#59-update-note) | [Update rules](./firestore-schema.md#6-security-rules) | Content only |
| **Delete Note** | [Data lifecycle](./firestore-schema.md#7-data-lifecycle) | [NoteItem](./frontend-architecture.md#42-detail-panel-slide-over) | [Delete Note](./api-contracts.md#510-delete-note) | [Delete rules](./firestore-schema.md#6-security-rules) | Hard delete |
| **Compare Ideas** | - | [CompareView](./frontend-architecture.md#44-compare-view-desktop-only) | - | - | Desktop only, max 3 |
| **Loading States** | - | [Skeleton components](./frontend-architecture.md#9-loading-state-patterns) | - | - | <3s initial load |
| **Error Handling** | - | [Error boundaries](./frontend-architecture.md#8-error-boundary-strategy) | [Error codes](./api-contracts.md#7-error-codes) | [Auth errors](./auth-security.md#7-error-handling-reference) | User-friendly messages |

---

## 5. Open Questions Summary

### 5.1 Product Decisions Needed

| # | Question | Source | Suggested Default | Impact |
|---|----------|--------|-------------------|--------|
| 1 | **Tag limit per idea** | Firestore Schema | Max 10 tags | Low |
| 2 | **Note limit per idea** | API Contracts | 100 notes/idea | Low |
| 3 | **Archived idea retention** | Firestore Schema | Indefinite | Medium |
| 4 | **Category list** | API Contracts | Free-form vs. predefined | Low |
| 5 | **Status undo capability** | API Contracts | Not supported | Low |
| 6 | **Tag case sensitivity** | API Contracts | Normalize to lowercase | Low |

### 5.2 Security Decisions Needed

| # | Question | Source | Suggested Default | Impact |
|---|----------|--------|-------------------|--------|
| 1 | **Email verification** | Auth & Security | Not required (MVP) | Medium |
| 2 | **Account deletion** | Auth & Security | Allow with confirmation | High |
| 3 | **Session duration** | Auth & Security | 5 days | Low |
| 4 | **Audit logging** | Auth & Security | Not for MVP | Low |

### 5.3 Technical Decisions Needed

| # | Question | Source | Suggested Default | Impact |
|---|----------|--------|-------------------|--------|
| 1 | **Full-text search** | Firestore Schema | Client-side for MVP | High |
| 2 | **Total count queries** | API Contracts | Skip for performance | Medium |
| 3 | **AI rate limiting** | Auth & Security | 10/minute | Medium |
| 4 | **Backward pagination** | API Contracts | Forward-only (MVP) | Low |

### 5.4 Pipeline Decisions Needed

| # | Question | Source | Suggested Default | Impact |
|---|----------|--------|-------------------|--------|
| 1 | **API key rotation strategy** | Backend Pipeline | Manual rotation quarterly | Medium |
| 2 | **Generation failure alerting** | Backend Pipeline | Email + Slack webhook | Medium |
| 3 | **Cost monitoring approach** | Backend Pipeline | Firebase billing alerts at thresholds | High |
| 4 | **Fallback if all sources fail** | Backend Pipeline | Fail run, retry next scheduled | Low |
| 5 | **Max ideas per manual trigger** | Backend Pipeline | 25 ideas | Low |
| 6 | **Rate limit for manual triggers** | Backend Pipeline | 5 per hour per user | Medium |
| 7 | **Generation run retention** | Firestore Schema | Last 100 runs per user | Low |
| 8 | **Source weighting in analysis** | Backend Pipeline | Equal weight | Low |

---

## 6. Implementation Sequence

### Recommended Implementation Order

```
Phase 1: Pipeline Infrastructure (CORE VALUE)
├── 1.1 Firebase Functions Setup
│   ├── Initialize Firebase Functions project
│   ├── Configure TypeScript + ESLint
│   ├── Set up local emulator suite
│   └── Configure deployment scripts
│
├── 1.2 Secret Manager Configuration
│   ├── Create secrets for GROK_API_KEY
│   ├── Create secrets for GEMINI_API_KEY
│   ├── Create secrets for NEWS_API_KEY
│   └── Grant Cloud Functions access to secrets
│
├── 1.3 Data Source Integrations
│   ├── Implement Grok API client (X/Twitter trends)
│   ├── Implement Polymarket API client
│   ├── Implement News API client
│   └── Add error handling and retry logic
│
├── 1.4 AI Processing Pipeline
│   ├── Implement signal analysis (Gemini)
│   ├── Implement idea generation (Gemini)
│   ├── Implement scoring (Gemini)
│   └── Implement composite score calculation
│
├── 1.5 Firestore Persistence
│   ├── Implement idea saving (Admin SDK)
│   ├── Implement generation run logging
│   ├── Test with emulator
│   └── Deploy to staging
│
└── 1.6 Scheduler Configuration
    ├── Create Cloud Scheduler job (6 AM UTC)
    ├── Configure retry policy
    ├── Test scheduled execution
    └── Monitor first few runs

Phase 2: Foundation
├── 2.1 Firebase Project Setup
│   ├── Create Firebase project (if not exists)
│   ├── Enable Auth providers (Email, Google)
│   ├── Create Firestore database
│   └── Configure environment variables
│
├── 2.2 Auth Implementation
│   ├── Firebase SDK initialization
│   ├── AuthContext provider
│   ├── Registration flow (Email + Google)
│   ├── Login flow (Email + Google)
│   ├── Session persistence
│   └── Logout flow
│
└── 2.3 Security Setup
    ├── Deploy Firestore security rules
    ├── Deploy Firestore indexes (12 composite)
    ├── Configure protected routes middleware
    └── Test user isolation

Phase 3: Core Data Layer
├── 3.1 Firestore Schema
│   ├── User document (with generation settings)
│   ├── Idea document (with pipeline fields)
│   ├── Note subcollection structure
│   ├── GenerationRuns subcollection
│   └── Settings document structure
│
├── 3.2 TypeScript Types
│   ├── Core entity interfaces
│   ├── GenerationRun interface
│   ├── Request/response types
│   ├── Enum definitions (including GenerationSource)
│   └── Query parameter types
│
└── 3.3 TanStack Query Setup
    ├── Query client configuration
    ├── Query key factory
    ├── Idea queries/mutations
    ├── Note queries/mutations
    └── GenerationRun queries

Phase 4: Frontend Scaffolding
├── 4.1 Layout Structure
│   ├── Root layout (providers)
│   ├── Auth layout (login/signup)
│   └── Dashboard layout (header, nav)
│
├── 4.2 Page Routes
│   ├── Landing page (/)
│   ├── Login page (/login)
│   ├── Signup page (/signup)
│   └── Dashboard page (/dashboard)
│
└── 4.3 Core UI Components
    ├── shadcn/ui setup
    ├── Button, Card, Input, etc.
    ├── Toast notifications
    └── "Generate Ideas" button

Phase 5: Idea Management
├── 5.1 Idea List (generated ideas)
│   ├── IdeaGrid component
│   ├── IdeaCard component (with NEW badge)
│   ├── Pagination (infinite scroll)
│   └── Empty state
│
├── 5.2 Idea Create (manual fallback)
│   ├── IdeaForm component
│   ├── Score input controls
│   ├── Validation logic
│   └── Composite score calculation
│
├── 5.3 Idea Update
│   ├── Edit mode in form
│   ├── Optimistic updates
│   └── Status change dropdown
│
└── 5.4 Idea Delete
    ├── Confirmation dialog
    ├── Soft-delete (archive)
    └── Hard-delete option

Phase 6: Filtering & Sorting
├── 6.1 Status Tabs
│   ├── Tab navigation
│   ├── Status counts
│   └── URL sync
│
├── 6.2 Source Filter (new)
│   ├── AI-generated vs Manual toggle
│   ├── Generation run filter
│   └── NEW ideas filter
│
├── 6.3 Filter Panel
│   ├── Category filter
│   ├── Score range slider
│   ├── Tag filter
│   └── Clear filters
│
└── 6.4 Sort Controls
    ├── Sort dropdown
    └── Sort direction toggle

Phase 7: Detail View
├── 7.1 Slide-over Panel
│   ├── Parallel route setup
│   ├── Animation/transition
│   └── Mobile full-screen
│
├── 7.2 Detail Content
│   ├── Score breakdown
│   ├── AI-generated content (pitch, strengths, risks)
│   ├── Source signals display
│   └── Tags display
│
└── 7.3 Notes System
    ├── Notes list
    ├── Add note form
    ├── Edit note inline
    └── Delete note

Phase 8: Generation Settings & History
├── 8.1 Generation Settings Panel
│   ├── Auto-generation toggle
│   ├── Ideas per run selector
│   ├── Source checkboxes (X, Polymarket, News)
│   └── Category preferences
│
└── 8.2 Generation History
    ├── Run history list
    ├── Run details (ideas generated, duration)
    └── Error display

Phase 9: Polish
├── 9.1 Loading States
│   ├── Skeleton components
│   ├── Suspense boundaries
│   ├── Generation in-progress indicator
│   └── Progress indicators
│
├── 9.2 Error Handling
│   ├── Error boundaries
│   ├── Toast notifications
│   ├── Generation failure handling
│   └── Retry mechanisms
│
├── 9.3 Responsive Design
│   ├── Mobile layout
│   ├── Tablet layout
│   └── Desktop layout
│
└── 9.4 Performance
    ├── Bundle optimization
    ├── Query optimization
    └── Core Web Vitals
```

---

## 7. Performance Targets

### Pipeline Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Full pipeline execution | <5 minutes | Cloud Function logs |
| Data source fetch (each) | <30 seconds | Function timing |
| AI analysis | <60 seconds | Function timing |
| AI generation (10 ideas) | <90 seconds | Function timing |
| AI scoring (10 ideas) | <60 seconds | Function timing |
| Firestore batch write | <5 seconds | Function timing |
| Cost per run | <$0.50 | Billing reports |

### Dashboard Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial Load (FCP) | <1.5s | Lighthouse |
| Time to Interactive | <3.0s | Lighthouse |
| Dashboard Render (100 ideas) | <500ms | React DevTools |
| Detail Panel Open | <300ms | React DevTools |
| Filter Apply | <200ms | User perception |
| Status Change (optimistic) | <50ms | User perception |
| Manual generation trigger | <10 seconds | User perception |
| Lighthouse Performance | >85 | Lighthouse |
| Bundle Size (main) | <200KB gzipped | Build output |

---

## 8. File Structure Reference

```
idea-forge/
│
├── functions/                  # Firebase Cloud Functions (PIPELINE)
│   ├── src/
│   │   ├── index.ts           # Function exports
│   │   ├── generateIdeas.ts   # Main orchestrator
│   │   ├── pipeline/
│   │   │   ├── index.ts       # Pipeline runner
│   │   │   ├── sources/
│   │   │   │   ├── x.ts       # Grok API client
│   │   │   │   ├── polymarket.ts
│   │   │   │   └── googlenews.ts
│   │   │   ├── ai/
│   │   │   │   ├── analyzeSignals.ts
│   │   │   │   ├── generateIdeas.ts
│   │   │   │   └── scoreIdeas.ts
│   │   │   └── persistence/
│   │   │       └── saveIdeas.ts
│   │   └── types/
│   │       └── pipeline.ts
│   ├── package.json
│   └── tsconfig.json
│
├── app/                        # Next.js App (DASHBOARD)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── page.tsx
│   │   ├── @detail/[id]/page.tsx
│   │   ├── settings/page.tsx  # Generation settings
│   │   └── layout.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                     # shadcn/ui
│   ├── ideas/                  # Idea components
│   ├── notes/                  # Note components
│   ├── filters/                # Filter components
│   ├── generation/             # Generation components
│   │   ├── generate-button.tsx
│   │   ├── generation-settings.tsx
│   │   └── generation-history.tsx
│   └── layout/                 # Layout components
│
├── hooks/
│   ├── use-ideas.ts
│   ├── use-notes.ts
│   ├── use-filters.ts
│   └── use-generation.ts      # Generation hooks
│
├── lib/
│   ├── firebase/
│   │   ├── config.ts
│   │   ├── auth.ts
│   │   └── firestore.ts
│   ├── queries/
│   │   └── query-keys.ts
│   └── types/
│       ├── idea.ts
│       ├── note.ts
│       └── generation.ts      # Generation types
│
├── providers/
│   ├── query-provider.tsx
│   └── auth-provider.tsx
│
├── firestore.rules
├── firestore.indexes.json
├── firebase.json              # Firebase config
└── next.config.js
```

---

## 9. Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | April 8, 2026 | Initial technical specifications release |
| 1.1 | April 8, 2026 | Pipeline-First MVP: Added pipeline spec, updated architecture, reordered implementation phases |

---

## 10. Contributors

| Specification | Author | Role |
|---------------|--------|------|
| Backend Pipeline | Ideation Manager | Manager |
| Firestore Schema | Hana Rosenberg | Tech Specs Worker |
| Frontend Architecture | Michal Xu | Tech Specs Worker |
| API Contracts | Evelyn Jones | Tech Specs Worker |
| Auth & Security | Noah Harris | Tech Specs Worker |
| Tech Specs Index | Hana Rosenberg | Tech Specs Worker |

---

*This document serves as the master index for all Idea Forge technical specifications. Developers should start here and reference individual specification documents for implementation details.*
