# Idea Forge: Product Requirements Document

**Status**: Draft
**Version**: 1.2
**Date**: April 8, 2026
**Author**: Product Team

---

## 1. Executive Summary

### Product Identity

| Attribute | Value |
|-----------|-------|
| **Product Name** | Idea Forge |
| **Tagline** | "Your AI-Powered Idea Pipeline" |
| **Vision** | Idea Forge **automatically generates validated business ideas** using AI and real-time market signals. The dashboard lets you review, score, and manage your portfolio of AI-generated opportunities. |

### Core Value Proposition

> **Generation is PRIMARY. Management is SECONDARY.**

Idea Forge is an **automated idea generation pipeline** that:
1. **Monitors** multiple data sources (X/Twitter via Grok, Polymarket, Google News)
2. **Detects** emerging trends, pain points, and market opportunities
3. **Generates** scored, validated business ideas automatically (daily + on-demand)
4. **Presents** ideas in a dashboard for review, filtering, and tracking

**The pipeline runs automatically** - you wake up to new ideas in your portfolio every day.

### Target User

**Solo entrepreneurs and indie builders** who:
- Want a **constant stream** of validated business/app ideas without manual research
- Need AI to surface opportunities they would otherwise miss
- Want to review and filter ideas, not research and create them
- Seek automated market intelligence that works while they sleep
- Currently waste hours on manual trend research and brainstorming

### Key Differentiators

| vs. Competitors | Idea Forge |
|-----------------|------------|
| **One-shot validators** | Continuous pipeline - new ideas daily |
| **Manual brainstorming** | AI generates from real-time market signals |
| **Point-in-time research** | Always-fresh data from X, Polymarket, News |
| **Generic AI chatbots** | Structured, scored, actionable ideas |

### Success Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| **Ideas Generated** | Total ideas created (manual + AI) | 100+ in first month of use |
| **Validation Rate** | Ideas moved from "New" to scored status | >80% within 24 hours |
| **Decision Clarity** | Ideas with clear HOT/WARM/PARK/DISCARD tier | 100% of scored ideas |
| **Portfolio Coverage** | Ideas with complete scoring (all 5 core parameters) | >90% |
| **Time to First Idea** | Time from login to first generated idea | <2 minutes |
| **Cost Efficiency** | Cost per fully processed idea | <$0.50 |

**What Winning Looks Like**:
- Every idea is captured, scored, and categorized within minutes
- The best opportunities (HOT tier: 4.0-5.0 score) surface automatically
- Portfolio stays fresh with continuous market signal monitoring
- Decision-making shifts from gut instinct to data-driven evaluation

---

## 2. Problem Statement

### Pain Points for Solo Founders

| Pain Point | Impact | Current Workaround |
|------------|--------|-------------------|
| **Idea Sprawl** | Ideas scattered across notes, docs, messages | Manual consolidation (time-consuming) |
| **No Structured Evaluation** | Gut-feeling decisions lead to wasted effort | Ad-hoc research (inconsistent) |
| **Point-in-Time Validation** | Ideas become stale as markets shift | Re-research manually (often forgotten) |
| **Analysis Paralysis** | Too many ideas, no clear comparison framework | Pick randomly or abandon ideas |
| **Research Overhead** | Hours spent on manual market research per idea | Skip validation entirely |

### Current Solutions and Their Gaps

| Solution Category | Examples | Critical Gap |
|-------------------|----------|--------------|
| **AI Idea Generators** | ValidatorAI, IdeaProof | One-shot validation only—no portfolio, no tracking |
| **Problem Discovery** | BigIdeasDB | No generation, heavy paywall, data without action |
| **Business Planning** | IdeaBuddy | Manual input only, no AI intelligence |
| **Trend Tools** | Exploding Topics | Shows trends but doesn't turn them into ideas |
| **Spreadsheets** | Google Sheets, Notion | No AI, no scoring, purely manual management |
| **Enterprise Tools** | Brightidea, IdeaScale | Overkill for solo use, expensive, team-focused |

**The Gap**: No single platform owns the end-to-end idea lifecycle:
- Generation tools don't validate
- Validation tools don't track portfolios
- Portfolio tools lack AI intelligence
- Everything is point-in-time, not real-time

### Why Now

1. **AI API Costs Have Dropped**: Full idea processing now costs ~$0.35-0.50/idea (viable for personal use)
2. **Grok Provides Unique X/Twitter Data**: Access to 500M posts/day of real-time trend signals
3. **Polymarket is US-Accessible**: CFTC-regulated prediction markets provide market viability signals
4. **Solo Founders Are Underserved**: Enterprise tools dominate; indie hackers lack right-sized solutions
5. **Real-Time AI is Mature**: Streaming responses, structured outputs, and multi-model pipelines are production-ready

---

## 3. Product Goals

### Primary Goal

> **Automatically surface validated business opportunities from market signals - no manual research required.**

The pipeline does the work:
- ✅ **Auto-monitors** X/Twitter, Polymarket, Google News for signals
- ✅ **Auto-generates** 5-15 scored business ideas daily
- ✅ **Auto-scores** every idea on 5 parameters with AI reasoning
- ✅ **Auto-categorizes** ideas into HOT/WARM/PARK/DISCARD tiers

**You just review and decide.**

### Secondary Goals

| Goal | Description | Success Indicator |
|------|-------------|-------------------|
| **Zero Manual Research** | AI handles all market analysis | 0 hours spent on research |
| **Daily Fresh Ideas** | New opportunities every morning | 5-15 new ideas per day |
| **Instant Scoring** | Every generated idea is pre-scored | 100% ideas scored on arrival |
| **Decision Clarity** | Clear tiers make action obvious | HOT ideas pursued within 24h |
| **Affordable Scale** | Explore broadly without cost anxiety | <$0.50 per idea, <$20/month |

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    IDEA FORGE PIPELINE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  6:00 AM (Daily) or Manual Trigger                          │
│            │                                                 │
│            ▼                                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  COLLECT: X/Twitter + Polymarket + Google News      │    │
│  └─────────────────────────────────────────────────────┘    │
│            │                                                 │
│            ▼                                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ANALYZE: Identify trends, pain points, opportunities│    │
│  └─────────────────────────────────────────────────────┘    │
│            │                                                 │
│            ▼                                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  GENERATE: Create 5-15 business ideas from signals   │    │
│  └─────────────────────────────────────────────────────┘    │
│            │                                                 │
│            ▼                                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  SCORE: Rate each idea, generate strengths/risks     │    │
│  └─────────────────────────────────────────────────────┘    │
│            │                                                 │
│            ▼                                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  DELIVER: Ideas appear in your dashboard, ready to   │    │
│  │           review with full scores and analysis       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Non-Goals (Explicit Exclusions)

- **Not a team collaboration tool** - This is a personal power tool
- **Not a business planning suite** - Focus is on idea generation, not full plans
- **Not a CRM or project management tool** - Ideas that become projects move elsewhere
- **Not a manual brainstorming tool** - AI generates, you review

---

## 4. Scope Definition

### MVP Scope (Pipeline-First)

**The MVP is the automated generation pipeline + dashboard to review results.**

#### Core Pipeline Features (MVP)

| Feature Area | Included | Details |
|--------------|----------|---------|
| **Daily Scheduled Generation** | ✅ | Runs automatically at 6 AM UTC via Cloud Scheduler |
| **Manual Generation Trigger** | ✅ | "Generate Ideas" button in dashboard |
| **Multi-Source Data Collection** | ✅ | X/Twitter (via Grok), Polymarket, Google News |
| **AI Signal Analysis** | ✅ | Gemini analyzes trends, identifies opportunities |
| **AI Idea Generation** | ✅ | Gemini generates 5-15 ideas per run from signals |
| **AI Auto-Scoring** | ✅ | Every idea scored on 5 parameters automatically |
| **AI Content Generation** | ✅ | Strengths, risks, business plan, elevator pitch |
| **Source Indicators** | ✅ | Ideas show "AI-Generated" vs "Manual" source |
| **Generation Settings** | ✅ | Configure sources, ideas per run, auto-generation toggle |

#### Dashboard Features (MVP)

| Feature Area | Included | Details |
|--------------|----------|---------|
| **Core Dashboard** | ✅ | Grid view of ideas with cards, filtering, sorting |
| **Idea Management** | ✅ | View, edit, delete, status tracking |
| **Manual Idea Entry** | ✅ | Add ideas manually (secondary to AI generation) |
| **Score Display** | ✅ | 5 core parameters, composite score, decision tier |
| **AI Reasoning Display** | ✅ | View strengths, risks, business plan, pitch |
| **Status Workflow** | ✅ | New → Reviewing → Pursuing → Parked → Rejected |
| **Detail View** | ✅ | Expandable sections with full idea details |
| **Notes** | ✅ | Personal notes per idea |
| **Filtering/Sorting** | ✅ | By status, score, category, date, source |
| **Firebase Auth** | ✅ | Single-user authentication |
| **Responsive Web** | ✅ | Desktop (primary), mobile (supported) |

### Post-MVP Features (v1.1+)

| Feature | Phase | Rationale |
|---------|-------|-----------|
| **Compare View** | v1.1 | Side-by-side comparison of up to 3 ideas |
| **Keyboard Navigation** | v1.1 | Power user shortcuts (j/k, etc.) |
| **Advanced Filters** | v1.1 | Filter by tags, category, date range |
| **Score Refresh** | v2.0 | Re-score existing ideas with fresh data |
| **Trend Alerts** | v2.0 | Notifications when markets shift |
| **Custom Generation Prompts** | v2.0 | User-provided topics for targeted generation |

### Explicitly Out of Scope

| Feature | Reason |
|---------|--------|
| **Multi-user / Team features** | Personal tool—single user only |
| **Sharing / Collaboration** | No need for personal workflow |
| **Export functionality** | Not needed for personal use |
| **Billing / Subscriptions** | Personal tool, no monetization |
| **Version history** | Keep it simple |
| **Push notifications** | Nice-to-have, not essential |
| **Native mobile apps** | Responsive web is sufficient |
| **Offline support** | Always-connected use case |

### Key Constraints

| Constraint | Implication |
|------------|-------------|
| **Personal Tool** | No multi-user complexity, no permissions, no sharing |
| **Single Firebase User** | All data under one user document tree |
| **No Billing System** | No Stripe, no subscription management |
| **AI API Dependencies** | Must handle rate limits, costs, and potential outages |
| **Budget Conscious** | Target <$0.50/idea, leverage free tiers where possible |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Metric | Requirement | Rationale |
|--------|-------------|-----------|
| **Initial Load** | <3 seconds (empty cache) | Fast access to portfolio |
| **Dashboard Render** | <500ms for 100 ideas | Smooth browsing experience |
| **Idea Generation** | <10 seconds (AI response) | Acceptable wait for AI processing |
| **Search/Filter** | <200ms response | Instant feel for interactions |
| **Detail Panel Open** | <300ms | Snappy navigation |

### 5.2 Scalability

| Dimension | Requirement | Notes |
|-----------|-------------|-------|
| **Idea Volume** | Support 10,000+ ideas per user | Firestore pagination handles this |
| **Concurrent Requests** | Handle 10 simultaneous AI requests | Rate limiting at API layer |
| **Data Growth** | No degradation with portfolio growth | Proper indexing, pagination |
| **Cost Scaling** | Linear cost growth with usage | No surprise billing spikes |

### 5.3 Reliability

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| **Data Persistence** | Zero data loss | Firestore with automatic backups |
| **Uptime** | 99.5% availability | Firebase hosting SLA |
| **AI Fallbacks** | Graceful degradation if AI unavailable | Queue requests, retry logic |
| **Error Recovery** | Auto-retry failed operations | Exponential backoff |
| **Offline Tolerance** | Show cached data if briefly offline | Firestore offline persistence |

### 5.4 Security

| Requirement | Implementation |
|-------------|----------------|
| **Authentication** | Firebase Auth (email/password, Google OAuth) |
| **Authorization** | Firestore security rules—user can only access own data |
| **Data Isolation** | All ideas under `/users/{userId}/ideas/` path |
| **API Keys** | Server-side only, never exposed to client |
| **HTTPS** | Enforced for all connections |
| **Session Management** | Firebase Auth token refresh |

### 5.5 Usability

| Requirement | Target |
|-------------|--------|
| **Keyboard Navigation** | Full keyboard support (j/k navigation, shortcuts) |
| **Mobile Responsiveness** | Fully functional on mobile browsers |
| **Accessibility** | WCAG 2.1 AA compliance |
| **Error Messages** | Clear, actionable error feedback |
| **Loading States** | Skeleton screens, progress indicators |

---

## 6. Document Structure

*The following sections will be completed by specialized team members.*

### 6.1 User Stories

> **[PLACEHOLDER]** - To be completed by UX team
>
> This section will contain:
> - User personas and journey maps
> - Detailed user stories with acceptance criteria
> - Use case scenarios
> - Edge cases and error states

### 6.2 Feature Roadmap

> **[PLACEHOLDER]** - To be completed by Product team
>
> This section will contain:
> - Detailed MVP feature specifications
> - Phase-by-phase feature breakdown
> - Feature dependencies and sequencing
> - Release milestones

### 6.3 Technical Specifications

> **[PLACEHOLDER]** - To be completed by Engineering team
>
> This section will contain:
> - System architecture diagrams
> - API contracts and data models
> - AI integration specifications
> - Infrastructure and deployment details
> - Firestore schema and security rules

### 6.4 UI/UX Specifications

The complete design system documentation is available in `/docs/design/`:

| Document | Description |
|----------|-------------|
| [README.md](../design/README.md) | Design system overview, quick reference, implementation guide |
| [foundations.md](../design/foundations.md) | Color palette, typography scale, spacing system, CSS design tokens |
| [components.md](../design/components.md) | Component specifications for cards, badges, forms, navigation, feedback |
| [layout-patterns.md](../design/layout-patterns.md) | Grid system, page layouts, responsive patterns, animations, accessibility |

**Key Design Decisions:**

| Aspect | Decision |
|--------|----------|
| **Score Colors** | Green (HOT), Yellow (WARM), Orange (PARK), Red (DISCARD) |
| **Status Colors** | Blue (New), Purple (Reviewing), Green (Pursuing), Gray (Parked), Red (Rejected) |
| **Typography** | Inter (UI) + JetBrains Mono (scores) |
| **Spacing** | 4px base unit, 18-token scale |
| **Grid** | 1/2/4 columns for mobile/tablet/desktop |
| **Tech Stack** | Tailwind CSS + shadcn/ui components |
| **Accessibility** | WCAG 2.1 AA compliant, 44px touch targets |

**Core Interaction Patterns:**
- **Dashboard**: Grid/list view toggle, status tabs, filtering, sorting
- **Detail View**: Slide-over panel (desktop), full-screen overlay (mobile)
- **Compare View**: Side-by-side comparison of up to 3 ideas (desktop only)
- **Mobile**: Pull-to-refresh, swipe navigation, long-press for selection
- **Desktop**: Full keyboard navigation (j/k, arrows, shortcuts)

### 6.5 Testing Strategy

> **[PLACEHOLDER]** - To be completed by QA team
>
> This section will contain:
> - Test plan and coverage requirements
> - Unit, integration, and E2E test strategies
> - Performance testing approach
> - AI output quality validation

---

## Appendix A: Scoring System Reference

### Core Parameters (5 Required)

| Parameter | What It Measures | Scale |
|-----------|------------------|-------|
| Business Potential | Revenue opportunity, market size, monetization | 1-5 |
| Development Complexity | Technical effort, team size, maintenance | 1-5 |
| Time to Market | MVP timeline, dependencies, blockers | 1-5 |
| Competition Level | Market saturation, barriers, differentiation | 1-5 |
| Risk Level | Technical, market, execution, regulatory risks | 1-5 |

### Decision Tiers

| Score Range | Tier | Recommended Action |
|-------------|------|-------------------|
| 4.0 - 5.0 | **HOT** 🔥 | Pursue immediately |
| 3.0 - 3.9 | **WARM** ☀️ | Worth exploring |
| 2.0 - 2.9 | **PARK** 🅿️ | Save for later |
| 1.0 - 1.9 | **DISCARD** ❌ | Archive |

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **Idea Forge** | The product name for this AI-powered idea management platform |
| **Living Portfolio** | A collection of ideas that are continuously monitored and updated |
| **Composite Score** | Weighted average of all scoring parameters (1.0-5.0) |
| **Decision Tier** | Category (HOT/WARM/PARK/DISCARD) based on composite score |
| **Signal Detection** | Process of identifying market trends from Grok/Polymarket |
| **Idea Generation** | AI-powered creation of business/app ideas from signals |
| **Validation Layer** | Cross-reference step that verifies market timing and viability |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | April 8, 2026 | Product Team | Initial PRD structure and core sections |
| 1.1 | April 8, 2026 | Amelia Goldstein | Clarified MVP scope: AI Generation moved to v1.1 |
| 1.2 | April 8, 2026 | Wei-Bergman | **PIVOTED to pipeline-first MVP** per user clarification. AI generation is now core MVP, not v1.1. Automated pipeline is the primary value proposition. |

---

*This PRD is a living document. Sections marked [PLACEHOLDER] will be completed by assigned team members.*
