# Idea Forge: Feature Priority & Roadmap Matrix

**Status**: Product Specification (Pipeline-First Update)
**Version**: 2.0
**Date**: April 8, 2026
**Author**: Amelia Goldstein (Product Specs Worker)
**Updated By**: Noah-Volkov (Pipeline-First reorganization)

---

## 1. Feature Inventory

### 1.1 Core Dashboard

| ID | Feature | Description |
|----|---------|-------------|
| CD-01 | Main Grid View | 4-column (desktop) / 1-column (mobile) responsive grid layout |
| CD-02 | Idea Cards | Display name, overall score, brief, status, category on cards |
| CD-03 | Status Tabs | Filter by All / Reviewing / Pursuing / Parked |
| CD-04 | Sort Controls | Sort by Score, Date, Name |
| CD-05 | Filter Panel | Filter by status, category, tags, score range |
| CD-06 | Mobile Responsive | Responsive breakpoints, touch-optimized interactions |
| CD-07 | Empty States | Helpful UI when no ideas exist or filters return nothing |

### 1.2 Idea Management

| ID | Feature | Description |
|----|---------|-------------|
| IM-01 | Detail View | Slide-over panel (desktop) / full-screen (mobile) for idea details |
| IM-02 | Accordion Sections | Expandable sections: Strengths, Risks, Business Plan, Pitch, Notes |
| IM-03 | Status Dropdown | Quick status changes from detail view |
| IM-04 | Notes System | Add/edit/delete notes per idea (subcollection) |
| IM-05 | Compare View | Side-by-side comparison of up to 3 ideas (desktop only) |
| IM-06 | Bulk Select | Multi-select for bulk status changes (long-press mobile / hover checkbox desktop) |
| IM-07 | Manual Idea Entry | Create ideas manually without AI |
| IM-08 | Edit Idea | Edit existing idea fields |
| IM-09 | Delete Idea | Delete/archive ideas |

### 1.3 AI Generation

| ID | Feature | Description |
|----|---------|-------------|
| AI-01 | Gemini Integration | API integration for structured idea refinement |
| AI-02 | Manual Prompt Mode | User provides prompt/topic, AI generates ideas |
| AI-03 | Grok Integration | API integration for trend detection and idea generation |
| AI-04 | Auto-Suggestion Mode | System monitors trends, auto-generates ideas for review |
| AI-05 | Polymarket Integration | Prediction market data for viability signals |
| AI-06 | Idea Acceptance Flow | Review, accept/reject auto-generated ideas into portfolio |
| AI-07 | Batch Processing | Process multiple ideas efficiently |
| AI-08 | Generation Settings | Configure AI parameters, creativity level, focus areas |

### 1.4 Scoring System

| ID | Feature | Description |
|----|---------|-------------|
| SC-01 | Core Parameters | 5 required scores: Business Potential, Dev Complexity, Time to Market, Competition, Risk |
| SC-02 | Optional Parameters | 5 additional scores: Trend Alignment, Founder Fit, Growth Potential, Defensibility, Capital Efficiency |
| SC-03 | Composite Score | Weighted average producing 1.0-5.0 overall score |
| SC-04 | Decision Tiers | Visual tier badges: HOT, WARM, PARK, DISCARD |
| SC-05 | Weight Presets | Pre-configured weighting: Conservative, Aggressive, Solo Founder |
| SC-06 | Custom Weights | User-configurable parameter weights |
| SC-07 | Trade-off Flags | Auto-flags: High Risk/High Reward, Hidden Gem, Quick Win, Moonshot |
| SC-08 | Score Visualization | Radar charts, bar graphs for score breakdown |
| SC-09 | Score Refresh | Re-score ideas based on updated market data |

### 1.5 UX/Navigation

| ID | Feature | Description |
|----|---------|-------------|
| UX-01 | Keyboard Navigation | j/k scroll, e edit, s status change shortcuts |
| UX-02 | Swipe Gestures | Mobile swipe for navigation and actions |
| UX-03 | Bottom Sheet Filters | Mobile-optimized filter interface |
| UX-04 | Dropdown Panel Filters | Desktop filter dropdown panel |
| UX-05 | Loading States | Skeleton loaders, progress indicators |
| UX-06 | Error Handling | User-friendly error messages and recovery |
| UX-07 | Toast Notifications | Action confirmations, status updates |
| UX-08 | Search | Full-text search across idea names and briefs |
| UX-09 | Trend Alerts | Notifications when monitored trends shift |

### 1.6 AI Generation Pipeline (NEW - MVP)

| ID | Feature | Description |
|----|---------|-------------|
| PIPE-01 | Manual Generation Trigger | One-click button to generate new ideas on demand |
| PIPE-02 | Daily Scheduled Generation | Automated daily idea generation via Cloud Functions |
| PIPE-03 | Generation Settings Panel | Configure generation parameters, categories, focus areas |
| PIPE-04 | Source Indicators on Cards | Visual badges showing idea source (AI, manual, trend-based) |
| PIPE-05 | Generation Progress UI | Real-time progress indicator during idea generation |
| PIPE-06 | "NEW" Badge for Fresh Ideas | Visual indicator for recently generated ideas (< 24 hours) |

---

## 2. Priority Matrix

### User Value Key
- **Critical**: Core functionality, app unusable without it
- **High**: Major value add, significant user need
- **Medium**: Nice to have, improves experience
- **Low**: Minor enhancement, future polish

### Effort Key
- **XS**: < 2 hours
- **S**: 2-4 hours
- **M**: 1-2 days
- **L**: 3-5 days
- **XL**: 1+ weeks

### 2.1 Core Dashboard

| Feature | User Value | Effort | Dependencies | Priority |
|---------|-----------|--------|--------------|----------|
| CD-01 Main Grid View | Critical | M | Firebase setup | **P0** |
| CD-02 Idea Cards | Critical | S | CD-01 | **P0** |
| CD-03 Status Tabs | Critical | S | CD-01 | **P0** |
| CD-04 Sort Controls | High | S | CD-01 | **P0** |
| CD-05 Filter Panel | High | M | CD-01, CD-03 | **P0** |
| CD-06 Mobile Responsive | High | M | CD-01 | **P0** |
| CD-07 Empty States | Medium | XS | CD-01 | **P0** |

### 2.2 Idea Management

| Feature | User Value | Effort | Dependencies | Priority |
|---------|-----------|--------|--------------|----------|
| IM-01 Detail View | Critical | M | CD-02 | **P0** |
| IM-02 Accordion Sections | High | S | IM-01 | **P0** |
| IM-03 Status Dropdown | Critical | XS | IM-01 | **P0** |
| IM-04 Notes System | High | M | IM-01, Firebase | **P0** |
| IM-05 Compare View | Medium | L | IM-01 | **P2** |
| IM-06 Bulk Select | Medium | M | CD-01 | **P2** |
| IM-07 Manual Idea Entry | Critical | M | Firebase | **P0** |
| IM-08 Edit Idea | Critical | S | IM-01 | **P0** |
| IM-09 Delete Idea | High | XS | IM-01 | **P0** |

### 2.3 AI Generation

| Feature | User Value | Effort | Dependencies | Priority |
|---------|-----------|--------|--------------|----------|
| AI-01 Gemini Integration | Critical | L | Firebase, API keys | **P0** |
| AI-02 Manual Prompt Mode | Critical | M | AI-01 | **P0** |
| AI-03 Grok Integration | High | L | AI-01 | **P1** |
| AI-04 Auto-Suggestion Mode | High | XL | AI-03 | **P1** |
| AI-05 Polymarket Integration | Medium | L | AI-01 | **P2** |
| AI-06 Idea Acceptance Flow | High | M | AI-04 | **P1** |
| AI-07 Batch Processing | Medium | M | AI-01 | **P1** |
| AI-08 Generation Settings | Low | S | AI-01 | **P1** |

### 2.4 Scoring System

| Feature | User Value | Effort | Dependencies | Priority |
|---------|-----------|--------|--------------|----------|
| SC-01 Core Parameters | Critical | S | Firebase schema | **P0** |
| SC-02 Optional Parameters | Medium | S | SC-01 | **P1** |
| SC-03 Composite Score | Critical | S | SC-01 | **P0** |
| SC-04 Decision Tiers | High | XS | SC-03 | **P0** |
| SC-05 Weight Presets | Medium | S | SC-03 | **P1** |
| SC-06 Custom Weights | Low | M | SC-05 | **P2** |
| SC-07 Trade-off Flags | High | S | SC-03 | **P0** |
| SC-08 Score Visualization | Medium | M | SC-01 | **P2** |
| SC-09 Score Refresh | High | L | SC-01, AI-01 | **P2** |

### 2.5 UX/Navigation

| Feature | User Value | Effort | Dependencies | Priority |
|---------|-----------|--------|--------------|----------|
| UX-01 Keyboard Navigation | Medium | S | CD-01, IM-01 | **P1** |
| UX-02 Swipe Gestures | Medium | M | CD-06 | **P2** |
| UX-03 Bottom Sheet Filters | High | S | CD-05 | **P1** |
| UX-04 Dropdown Panel Filters | High | S | CD-05 | **P1** |
| UX-05 Loading States | High | S | All views | **P0** |
| UX-06 Error Handling | Critical | S | All views | **P0** |
| UX-07 Toast Notifications | High | XS | None | **P0** |
| UX-08 Search | High | M | CD-01 | **P1** |
| UX-09 Trend Alerts | Medium | L | AI-03, AI-04 | **P2** |

### 2.6 AI Generation Pipeline (NEW)

| Feature | User Value | Effort | Dependencies | Priority |
|---------|-----------|--------|--------------|----------|
| PIPE-01 Manual Generation Trigger | Critical | M | AI-01 | **P0** |
| PIPE-02 Daily Scheduled Generation | Critical | L | AI-01, Cloud Functions | **P0** |
| PIPE-03 Generation Settings Panel | High | M | AI-01 | **P0** |
| PIPE-04 Source Indicators on Cards | High | S | CD-02 | **P0** |
| PIPE-05 Generation Progress UI | High | S | PIPE-01 | **P0** |
| PIPE-06 "NEW" Badge for Fresh Ideas | High | XS | CD-02 | **P0** |

---

## 3. Release Roadmap

### MVP (P0) - Core Dashboard + AI Generation Pipeline

**Goal**: First usable version - view, manage, organize ideas AND generate new ideas via AI

**Timeline Dependency**: Foundation for all future phases

#### Core Dashboard & Management
| Feature | Status |
|---------|--------|
| CD-01 Main Grid View | Required |
| CD-02 Idea Cards | Required |
| CD-03 Status Tabs | Required |
| CD-04 Sort Controls | Required |
| CD-05 Filter Panel | Required |
| CD-06 Mobile Responsive | Required |
| CD-07 Empty States | Required |
| IM-01 Detail View | Required |
| IM-02 Accordion Sections | Required |
| IM-03 Status Dropdown | Required |
| IM-04 Notes System | Required |
| IM-07 Manual Idea Entry | Required |
| IM-08 Edit Idea | Required |
| IM-09 Delete Idea | Required |

#### AI Generation Pipeline (NEW)
| Feature | Status |
|---------|--------|
| AI-01 Gemini Integration | Required |
| AI-02 Manual Prompt Mode | Required |
| PIPE-01 Manual Generation Trigger | Required |
| PIPE-02 Daily Scheduled Generation | Required |
| PIPE-03 Generation Settings Panel | Required |
| PIPE-04 Source Indicators on Cards | Required |
| PIPE-05 Generation Progress UI | Required |
| PIPE-06 "NEW" Badge for Fresh Ideas | Required |

#### Scoring & UX
| Feature | Status |
|---------|--------|
| SC-01 Core Parameters | Required |
| SC-03 Composite Score | Required |
| SC-04 Decision Tiers | Required |
| SC-07 Trade-off Flags | Required |
| UX-05 Loading States | Required |
| UX-06 Error Handling | Required |
| UX-07 Toast Notifications | Required |

**Total MVP Features**: 29

---

### v1.1 (P1) - Enhanced AI & Grok Integration

**Goal**: Add X/Twitter trend-based generation and enhanced UX

**Dependency**: MVP complete

| Feature | Status |
|---------|--------|
| AI-03 Grok Integration | Required |
| AI-04 Auto-Suggestion Mode | Required |
| AI-06 Idea Acceptance Flow | Required |
| AI-07 Batch Processing | Required |
| AI-08 Generation Settings (Advanced) | Required |
| SC-02 Optional Parameters | Required |
| SC-05 Weight Presets | Required |
| UX-01 Keyboard Navigation | Required |
| UX-03 Bottom Sheet Filters | Required |
| UX-04 Dropdown Panel Filters | Required |
| UX-08 Search | Required |

**Total v1.1 Features**: 11

---

### v1.2 (P2) - Market Signals & Advanced Features

**Goal**: Polymarket integration, score refresh, and advanced UX

**Dependency**: v1.1 complete (Grok working)

| Feature | Status |
|---------|--------|
| AI-05 Polymarket Integration | Required |
| SC-06 Custom Weights | Required |
| SC-08 Score Visualization | Required |
| SC-09 Score Refresh | Required |
| IM-05 Compare View | Required |
| IM-06 Bulk Select | Required |
| UX-02 Swipe Gestures | Required |
| UX-09 Trend Alerts | Required |

**Total v1.2 Features**: 8

---

### v2.0 (Future) - Intelligence

**Goal**: Advanced analytics and continuous intelligence

**Dependency**: v1.3 complete (all integrations working)

| Feature | Status |
|---------|--------|
| Scheduled Score Refresh | Planned |
| Trend Alert Dashboard | Planned |
| Historical Score Tracking | Planned |
| Idea Lifecycle Analytics | Planned |
| Portfolio Performance Metrics | Planned |
| AI-Powered Recommendations | Planned |

**Total v2.0 Features**: 6 (conceptual, to be detailed)

---

## 4. MVP Definition

### IN MVP (Must Have)

| Category | Features | Rationale |
|----------|----------|-----------|
| **Core Dashboard** | Grid view, cards, tabs, sort, filter, mobile responsive, empty states | Foundation - can't use app without viewing ideas |
| **Idea Management** | Detail view, accordion, status dropdown, notes, manual entry, edit, delete | Core workflow - create, view, update, track ideas |
| **AI Generation Pipeline** | Gemini integration, manual trigger, daily scheduled generation, settings panel, source indicators, progress UI, "NEW" badges | Core value - automated idea generation is the product's differentiator |
| **Scoring** | Core 5 parameters, composite score, decision tiers, trade-off flags | Value differentiation - scores make ideas actionable |
| **UX** | Loading states, error handling, toast notifications | Polish - app feels complete and professional |

**MVP Feature Count**: 29 features

### NOT IN MVP (Deferred)

| Feature | Reason for Deferral |
|---------|---------------------|
| **Grok Integration (AI-03)** | v1.1 - Start with Gemini, add X/Twitter trends later |
| **Auto-Suggestion Mode (AI-04)** | v1.1 - Requires Grok for trend monitoring |
| **Polymarket Integration (AI-05)** | v1.2 - Nice-to-have validation layer |
| **Compare View (IM-05)** | v1.2 - Users can open multiple tabs initially |
| **Bulk Select (IM-06)** | v1.2 - Single status changes work for MVP scale |
| **Optional Parameters (SC-02)** | v1.1 - 5 core params sufficient initially |
| **Weight Presets (SC-05)** | v1.1 - Default weights work for MVP |
| **Custom Weights (SC-06)** | v1.2 - Power user feature |
| **Score Visualization (SC-08)** | v1.2 - Numbers sufficient for MVP |
| **Score Refresh (SC-09)** | v1.2 - Add after core generation works |
| **Keyboard Navigation (UX-01)** | v1.1 - Power user feature |
| **Swipe Gestures (UX-02)** | v1.2 - Enhancement |
| **Bottom Sheet Filters (UX-03)** | v1.1 - Mobile enhancement |
| **Dropdown Panel Filters (UX-04)** | v1.1 - Desktop enhancement |
| **Search (UX-08)** | v1.1 - Optimization for larger portfolios |
| **Trend Alerts (UX-09)** | v1.2 - Requires Grok integration |

**Deferred Feature Count**: 19 features

### MVP Boundaries

```
+--------------------------------------------------+
|               MVP SCOPE (Pipeline-First)          |
|                                                  |
|  [Generate Ideas] --> [View Grid] --> [Review]   |
|        |                   |              |      |
|        v                   v              v      |
|  [Daily Auto-Gen]    [Filter/Sort]   [Details]   |
|        |                   |              |      |
|        v                   v              v      |
|  [Settings Panel]   [Source Badges]  [Notes]     |
|        |                   |              |      |
|        v                   v              v      |
|  [Progress UI]     [NEW Badges]   [Status]       |
|                                                  |
|  Scores: AI-generated + trade-off flags          |
|  AI: Gemini integration (manual + scheduled)     |
|  Data: Firebase Firestore + Cloud Functions      |
|                                                  |
+--------------------------------------------------+
```

---

## 5. Success Criteria per Phase

### MVP Success Criteria

**Key Deliverables**:
- [ ] Firebase project configured with security rules
- [ ] Firestore schema implemented per data architecture
- [ ] Cloud Functions deployed for scheduled generation
- [ ] Gemini API integration complete
- [ ] Web app deployed (Next.js on Firebase Hosting)
- [ ] All 29 MVP features functional

**User Can**:
- [ ] **Generate ideas with one click** (manual trigger)
- [ ] **Ideas are generated automatically daily** (scheduled generation)
- [ ] **AI-generated ideas appear with source badges**
- [ ] Configure generation settings (categories, focus areas)
- [ ] See "NEW" badges on recently generated ideas
- [ ] See generation progress in real-time
- [ ] Create ideas manually with all required fields
- [ ] View all ideas in a responsive grid
- [ ] Filter ideas by status (tabs)
- [ ] Sort ideas by score, date, or name
- [ ] Filter ideas by category, tags, score range
- [ ] Open idea detail view
- [ ] Edit any idea field
- [ ] Change idea status
- [ ] Add, edit, delete notes on ideas
- [ ] Delete/archive ideas
- [ ] See trade-off flags on scored ideas
- [ ] Use app on mobile and desktop

**Technical Milestones**:
- [ ] Firestore reads/writes < 200ms p95
- [ ] Page load < 2 seconds
- [ ] Gemini API latency < 10 seconds for idea generation
- [ ] Daily scheduled generation runs reliably
- [ ] Mobile Lighthouse score > 85
- [ ] Zero critical accessibility violations

---

### v1.1 Success Criteria

**Key Deliverables**:
- [ ] Grok API integration complete
- [ ] Auto-suggestion pipeline working
- [ ] Trend monitoring active
- [ ] All 11 v1.1 features functional

**User Can**:
- [ ] Enable auto-suggestion mode (Grok-powered)
- [ ] Review and accept/reject trend-based ideas
- [ ] Process multiple ideas in batch
- [ ] See 10 scoring parameters on ideas
- [ ] Use weight presets to adjust scoring
- [ ] Navigate with keyboard shortcuts
- [ ] Use optimized filter interfaces (bottom sheet, dropdown)
- [ ] Search across all ideas

**Technical Milestones**:
- [ ] Grok API integration stable
- [ ] Trend monitoring runs on schedule
- [ ] API cost tracking implemented
- [ ] Error recovery for API failures
- [ ] Rate limiting for abuse prevention

---

### v1.2 Success Criteria

**Key Deliverables**:
- [ ] Polymarket API integration complete
- [ ] Score refresh mechanism working
- [ ] Advanced comparison features
- [ ] All 8 v1.2 features functional

**User Can**:
- [ ] See Polymarket viability signals on ideas
- [ ] Trigger manual score refresh
- [ ] Set custom scoring weights
- [ ] Compare up to 3 ideas side-by-side
- [ ] Bulk-select and update multiple ideas
- [ ] View score visualizations (radar charts)
- [ ] Use swipe gestures on mobile
- [ ] Receive trend alerts when markets shift

**Technical Milestones**:
- [ ] Polymarket data refresh < 15 minutes stale
- [ ] Score refresh completes in < 10 seconds
- [ ] Alert delivery < 5 minutes from trigger
- [ ] Full pipeline cost < $0.50/idea

---

### v2.0 Success Criteria

**Key Deliverables**:
- [ ] Scheduled automation system
- [ ] Analytics dashboard
- [ ] Historical tracking
- [ ] All v2.0 features functional

**User Can**:
- [ ] View idea performance over time
- [ ] See portfolio-level analytics
- [ ] Receive AI-powered recommendations
- [ ] Review trend alert history
- [ ] Configure automated refreshes

**Technical Milestones**:
- [ ] Historical data retention policy implemented
- [ ] Analytics queries < 500ms
- [ ] Automation reliability > 99%
- [ ] Monthly cost projections accurate

---

## 6. Dependency Graph

```
                    [Firebase Setup]
                          |
                          v
              +------------------------+
              |        MVP (P0)         |
              |   Core Dashboard        |
              |   AI Generation Pipeline|
              |   Gemini + Cloud Funcs  |
              |   Trade-off Flags       |
              +------------------------+
                          |
                          v
              +------------------------+
              |       v1.1 (P1)         |
              |   Grok Integration      |
              |   Auto-Suggestions      |
              |   Enhanced UX           |
              +------------------------+
                          |
                          v
              +------------------------+
              |       v1.2 (P2)         |
              |   Polymarket            |
              |   Score Refresh         |
              |   Compare/Bulk          |
              |   Trend Alerts          |
              +------------------------+
                          |
                          v
              +------------------------+
              |       v2.0 (Future)     |
              |   Intelligence Layer    |
              |   Advanced Analytics    |
              +------------------------+
```

---

## 7. Risk Assessment by Phase

| Phase | Primary Risks | Mitigation |
|-------|---------------|------------|
| **MVP** | Gemini API changes, response quality, Cloud Functions reliability | Fallback prompts, output validation, cost monitoring, robust error handling |
| **v1.1** | Grok API access, X data reliability | Gemini fallback for generation, caching |
| **v1.2** | Polymarket availability, regulatory, score refresh performance | Optional feature, graceful degradation, caching |
| **v2.0** | Cost at scale, automation reliability | Aggressive caching, batch processing, alerts |

---

## 8. Summary

| Metric | Value |
|--------|-------|
| Total Features Identified | 48 |
| MVP Features | 29 (60%) |
| v1.1 Features | 11 (23%) |
| v1.2 Features | 8 (17%) |
| v2.0 Features | 6 (conceptual) |

**Updated Approach (Pipeline-First)**: Ship MVP with AI generation pipeline from day one. The product's core value is automated idea generation - validate this immediately rather than starting with manual-only. Gemini + Cloud Functions enable daily automated generation in MVP.

**Key MVP Capabilities**:
- One-click manual generation trigger
- Daily scheduled generation (automated)
- Generation settings panel
- Source indicators and "NEW" badges
- Real-time generation progress UI

---

*Document created by Worker Amelia-Goldstein*
*Updated by Worker Noah-Volkov (Pipeline-First reorganization)*
*Ready for Product Manager review*
