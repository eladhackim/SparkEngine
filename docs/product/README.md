# Idea Forge - Product Specifications

**Status**: Specification Complete (Pipeline-First)
**Version**: 2.0
**Date**: April 8, 2026

---

## Quick Links

| Document | Purpose |
|----------|---------|
| [Product Requirements Document](prd.md) | Vision, goals, scope, non-functional requirements |
| [Feature Roadmap](features-roadmap.md) | Feature inventory, priority matrix, release phases |
| [User Stories - Lifecycle](user-stories-lifecycle.md) | Generate, Score, Track workflows |
| [User Stories - Management](user-stories-management.md) | Browse, Filter, Compare, Bulk Actions |
| [User Stories - UX](user-stories-ux.md) | Detail View, Mobile Experience, Responsive Behavior |
| [User Stories - Edge Cases](user-stories-edge-cases.md) | Error Handling, Empty States, Data Management, Limits |
| [Cross-Document Review](review-notes.md) | Consistency analysis and gap identification |
| **[Backend Pipeline Spec](../technical/backend-pipeline-spec.md)** | **AI generation pipeline architecture (MVP-critical)** |

---

## Document Overview

| Document | Purpose | Author | Status |
|----------|---------|--------|--------|
| PRD | Product vision, goals, scope, NFRs | Product Team | Complete |
| Feature Roadmap | 48 features inventoried, prioritized, phased | Amelia Goldstein / Noah-Volkov | Complete (v2.0) |
| User Stories - Lifecycle | 9 stories (6 P0, 3 P1) | Yonatan Weiss | Complete |
| User Stories - Management | 14 stories (5 P0, 4 P1, 5 P2) | Noah Volkov | Complete |
| User Stories - UX | 10 stories (6 P0, 4 P1) | Yonatan Weiss | Complete |
| User Stories - Edge Cases | 11 stories (5 P0, 4 P1, 2 P2) | Noah Volkov | Complete |
| Review Notes | Consistency review, gaps identified | Amelia Goldstein | Complete |
| Backend Pipeline Spec | AI generation pipeline architecture | Engineering | NEW |

**Total User Stories**: 44
**Total Features**: 48 (across 4 phases)

---

## Suggested Reading Order

For new team members or stakeholders:

1. **PRD** (prd.md) - Start here for vision, target user, and scope boundaries
2. **Feature Roadmap** (features-roadmap.md) - Understand what's being built and when
3. **User Stories - Lifecycle** - Core generate/score/track workflows
4. **User Stories - Management** - Browse, filter, compare capabilities
5. **User Stories - UX** - Platform-specific experiences (desktop/mobile)
6. **User Stories - Edge Cases** - Error handling and system resilience
7. **Review Notes** (review-notes.md) - Critical issues that need resolution

---

## MVP Summary

> **Pipeline-First Approach**: AI-powered idea generation is the core product value. The dashboard exists to review and manage generated ideas.

The Minimum Viable Product includes **29 features** and **24 P0 stories** enabling a solo founder to:

### Primary: AI Generation Pipeline (MVP-Critical)
- **One-Click Generation**: Manual trigger to generate new ideas on demand
- **Daily Automation**: Scheduled idea generation via Cloud Functions
- **Generation Settings**: Configure categories, focus areas, creativity level
- **Source Indicators**: Visual badges showing idea source (AI, manual, trend-based)
- **Progress UI**: Real-time feedback during generation
- **"NEW" Badges**: Highlight recently generated ideas (< 24 hours)
- **Trade-off Flags**: Auto-flags for High Risk/Reward, Hidden Gem, Quick Win, Moonshot

### Secondary: Dashboard & Management
- **View & Browse**: 4-column grid (desktop), 1-column (mobile), idea cards with scores
- **Filter & Sort**: Status tabs, sort by score/date/name, category filtering
- **Manage Ideas**: Create manually, edit, delete, change status
- **Track Progress**: Notes per idea, status workflow (New → Reviewing → Pursuing → Parked)
- **Evaluate**: AI-generated scores, decision tiers (HOT/WARM/PARK/DISCARD)
- **Detail View**: Slide-over panel (desktop), full-screen (mobile), accordion sections
- **System Feedback**: Loading states, error handling, toast notifications

**What's NOT in MVP**:
- Grok integration (X/Twitter trends) - v1.1
- Auto-suggestion mode - v1.1
- Polymarket integration - v1.2
- Compare view - v1.2
- Bulk actions - v1.2
- Keyboard navigation - v1.1
- Search - v1.1

---

## Release Phases

| Phase | Focus | Features | Key Capability |
|-------|-------|----------|----------------|
| **MVP (P0)** | AI Generation Pipeline + Dashboard | 29 | Generate ideas (manual + daily automated), review, manage |
| **v1.1 (P1)** | Enhanced AI & Grok | 11 | X/Twitter trends, auto-suggestions, enhanced UX |
| **v1.2 (P2)** | Market Signals & Advanced | 8 | Polymarket, score refresh, compare, bulk actions |
| **v2.0 (Future)** | Intelligence | 6 | Analytics, recommendations, advanced automation |

---

## Open Questions

### RESOLVED

| ID | Question | Resolution | Date |
|----|----------|------------|------|
| ~~OQ-01~~ | ~~Is AI Generation in MVP or not?~~ | **RESOLVED**: AI Generation IS MVP-CRITICAL. Pipeline-First approach. See DEC-15 (Updated). | 2026-04-08 |
| ~~OQ-02~~ | ~~Re-Score priority: P1 or P3?~~ | **RESOLVED**: P2 - aligned with roadmap v2.0 | 2026-04-08 |
| ~~OQ-03~~ | ~~Compare View priority: P1 or P2?~~ | **RESOLVED**: P2 - aligned with roadmap v2.0 | 2026-04-08 |
| ~~OQ-04~~ | ~~Trend Suggestions priority: P1 or P2?~~ | **RESOLVED**: P1 - Grok integration is v1.1 | 2026-04-08 |

### HIGH - Resolve Before Sprint Planning

| ID | Question | Context | Recommendation |
|----|----------|---------|----------------|
| OQ-05 | Status values: Include "Rejected"? | PRD includes it, other docs omit it | Standardize all docs |

### MEDIUM - Resolve Before Implementation

| ID | Question | Context | Options |
|----|----------|---------|---------|
| OQ-06 | Delete undo capability? | Currently no undo per spec | Confirm intentional |
| OQ-07 | Offline editing scope? | Firestore handles offline, but UX implications | Define behavior |
| OQ-08 | Error monitoring service? | Production error tracking needed | Sentry recommended |

### LOW - Document for Future Reference

| ID | Question | Context |
|----|----------|---------|
| OQ-09 | Maximum ideas limit? | Currently no limit; monitor performance at scale |
| OQ-10 | Character limits final? | Name: 100, Brief: 500, Note: 2000 - confirm |

---

## Decision Log

Key product decisions already made:

| ID | Decision | Choice | Rationale |
|----|----------|--------|-----------|
| DEC-01 | **Target User** | Solo founder | Personal tool, not team collaboration |
| DEC-02 | **Multi-user** | No | Simplifies auth, permissions, data model |
| DEC-03 | **Sharing** | No | Personal workflow, no external collaboration |
| DEC-04 | **Export** | No | Not needed for personal use |
| DEC-05 | **Billing** | No | Personal tool, no monetization |
| DEC-06 | **Version History** | No | Keep it simple |
| DEC-07 | **Push Notifications** | No | Nice-to-have, not essential |
| DEC-08 | **Native Mobile Apps** | No | Responsive web is sufficient |
| DEC-09 | **Database** | Firestore | Proven, offline support, real-time sync |
| DEC-10 | **Auth** | Firebase Auth | Email/password + Google OAuth |
| DEC-11 | **AI Provider (MVP)** | Gemini | Free tier, structured JSON output - NOW IN MVP |
| DEC-12 | **AI Provider (v1.1)** | Grok | Unique X/Twitter trend data |
| DEC-13 | **Scoring Scale** | 1-5 integers | Simple, intuitive |
| DEC-14 | **Decision Tiers** | HOT/WARM/PARK/DISCARD | Clear action mapping |
| **DEC-15** | **AI Generation Scope** | **AI Generation is MVP-CRITICAL (Pipeline-First)** | Dashboard is secondary to generation. Generate ideas (manual + daily automated) from day one. (PM Decision 2026-04-08, Updated) |

---

## Story Coverage Summary

| Category | P0 (MVP) | P1 (v1.1) | P2 (v1.2) | Total |
|----------|----------|-----------|-----------|-------|
| Lifecycle (Generate/Score/Track) | 8 | 1 | - | 9 |
| Management (Browse/Filter/Compare) | 5 | 4 | 5 | 14 |
| UX (Detail/Mobile/Responsive) | 6 | 4 | - | 10 |
| Edge Cases (Error/Empty/Data/Limits) | 5 | 4 | 2 | 11 |
| **Total** | **24** | **13** | **7** | **44** |

*Note: P0 count increased due to Pipeline-First decision moving AI generation stories to MVP.*

---

## Known Gaps

From cross-document review (see [review-notes.md](review-notes.md)):

### Resolved Gaps (Pipeline-First Update)
- ~~IM-08: Edit Idea fields~~ - Added as US-EDIT-01 (P0)
- ~~Single idea delete~~ - Added as US-MANAGE-01 (P0)
- ~~Generation settings (AI-08)~~ - Now PIPE-03 (P0)

### Missing User Stories (Post-MVP)
- Keyboard navigation (UX-01) - v1.1
- Swipe gestures (UX-02) - v1.2
- Filter interfaces (UX-03, UX-04) - v1.1
- Batch processing (AI-07) - v1.1

### Terminology Inconsistencies
- Status values need standardization across all documents
- "Rejected" status appears in PRD but not in other docs

---

## Next Steps

### Immediate (Before Development)
1. ~~**Resolve OQ-01**~~: **DONE** - AI IS MVP-CRITICAL (Pipeline-First)
2. ~~**Align priorities**~~: **DONE** - Roadmap v2.0 aligns all priorities
3. **Standardize terminology**: Status values across all docs
4. **Review Backend Pipeline Spec**: Validate AI generation architecture

### After Decisions
1. **Tech Spec Phase**: Architecture diagrams, API contracts, Firestore schema
2. **Design Phase**: Wireframes, mockups, component library
3. **Sprint Planning**: Break MVP into development sprints (29 features)

### Post-MVP Planning (v1.1)
1. Grok integration specifications
2. Auto-suggestion pipeline design
3. Performance testing strategy

---

## Document Maintenance

| Action | Frequency | Owner |
|--------|-----------|-------|
| Update decision log | After each product decision | Product Manager |
| Update roadmap priorities | After priority changes | Product Team |
| Add new user stories | Before each phase begins | Spec Workers |
| Review consistency | Before major milestones | QA/Product |

---

## Contact

For questions about these specifications:
- **Product decisions**: Product Manager
- **User stories**: Respective authors (see Document Overview)
- **Technical questions**: Engineering Team (after tech spec phase)

---

*Product Specifications Index created by Noah-Volkov*
*Last Updated: April 8, 2026 (v2.0 - Pipeline-First reorganization)*
