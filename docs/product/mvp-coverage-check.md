# MVP Feature Coverage Verification

**Document**: MVP Coverage Check
**Product**: Idea Forge
**Version**: 1.1
**Date**: April 8, 2026
**Author**: Yonatan Weiss (updated by Amelia Goldstein)

---

> **Update (2026-04-08)**: MVP scope expanded to include AI generation pipeline. Generation is now the primary user flow, with dashboard as secondary management interface. This represents a significant priority shift from the original "manual-first" approach.

---

## Overview

This document verifies that all P0 (MVP) features from the roadmap have corresponding user stories with adequate coverage.

**Source Documents:**
- `docs/product/features-roadmap.md` - Feature definitions and priorities
- `docs/product/user-stories-lifecycle.md` - Generation, Scoring, Tracking flows
- `docs/product/user-stories-management.md` - Browsing, Filtering, Comparison, Bulk actions
- `docs/product/user-stories-ux.md` - Detail View, Mobile, Responsive

---

## 1. P0 Features from Roadmap

Total MVP Features: **26** (updated from 20)

### AI Generation Pipeline (6 features) - NEW

| ID | Feature | Description |
|----|---------|-------------|
| PIPE-01 | Manual Generation Trigger | Button to manually trigger AI idea generation |
| PIPE-02 | Daily Scheduled Generation | Automated daily generation of new ideas |
| PIPE-03 | Generation Settings Panel | Configure generation parameters (frequency, focus areas) |
| PIPE-04 | Source Indicators | Show where ideas originated (AI-generated vs manual) |
| PIPE-05 | Generation Progress UI | Visual feedback during AI generation process |
| PIPE-06 | "NEW" Badge | Badge to highlight newly generated ideas |

### Core Dashboard (7 features)
| ID | Feature | Description |
|----|---------|-------------|
| CD-01 | Main Grid View | 4-column (desktop) / 1-column (mobile) responsive grid layout |
| CD-02 | Idea Cards | Display name, overall score, brief, status, category on cards |
| CD-03 | Status Tabs | Filter by All / Reviewing / Pursuing / Parked |
| CD-04 | Sort Controls | Sort by Score, Date, Name |
| CD-05 | Filter Panel | Filter by status, category, tags, score range |
| CD-06 | Mobile Responsive | Responsive breakpoints, touch-optimized interactions |
| CD-07 | Empty States | Helpful UI when no ideas exist or filters return nothing |

### Idea Management (7 features)
| ID | Feature | Description |
|----|---------|-------------|
| IM-01 | Detail View | Slide-over panel (desktop) / full-screen (mobile) for idea details |
| IM-02 | Accordion Sections | Expandable sections: Strengths, Risks, Business Plan, Pitch, Notes |
| IM-03 | Status Dropdown | Quick status changes from detail view |
| IM-04 | Notes System | Add/edit/delete notes per idea (subcollection) |
| IM-07 | Manual Idea Entry | Create ideas manually without AI |
| IM-08 | Edit Idea | Edit existing idea fields |
| IM-09 | Delete Idea | Delete/archive ideas |

### Scoring System (3 features)
| ID | Feature | Description |
|----|---------|-------------|
| SC-01 | Core Parameters | 5 required scores: Business Potential, Dev Complexity, Time to Market, Competition, Risk |
| SC-03 | Composite Score | Weighted average producing 1.0-5.0 overall score |
| SC-04 | Decision Tiers | Visual tier badges: HOT, WARM, PARK, DISCARD |

### UX/Navigation (3 features)
| ID | Feature | Description |
|----|---------|-------------|
| UX-05 | Loading States | Skeleton loaders, progress indicators |
| UX-06 | Error Handling | User-friendly error messages and recovery |
| UX-07 | Toast Notifications | Action confirmations, status updates |

---

## 2. Coverage Matrix

### AI Generation Pipeline Features (NEW)

| P0 Feature | User Story ID(s) | Coverage | Notes |
|------------|------------------|----------|-------|
| PIPE-01 Manual Generation Trigger | US-PIPELINE-01 | **Full** | "Generate Ideas" button with prompt input |
| PIPE-02 Daily Scheduled Generation | US-PIPELINE-02 | **Full** | Scheduled generation with configurable frequency |
| PIPE-03 Generation Settings Panel | US-PIPELINE-03 | **Full** | Settings for quantity, focus areas, creativity |
| PIPE-04 Source Indicators | US-PIPELINE-04 | **Full** | AI-generated vs manual source badges |
| PIPE-05 Generation Progress UI | US-PIPELINE-01 (AC#2) | **Partial** | Progress indicator covered in trigger story |
| PIPE-06 "NEW" Badge | US-PIPELINE-01 (AC#3) | **Partial** | New badge covered in trigger story acceptance criteria |

### Core Dashboard Features

| P0 Feature | User Story ID(s) | Coverage | Notes |
|------------|------------------|----------|-------|
| CD-01 Main Grid View | US-BROWSE-01 | **Full** | Grid layout with 4-col desktop, 1-col mobile covered |
| CD-02 Idea Cards | US-BROWSE-01 | **Full** | Card content (name, score, brief, status, category) specified |
| CD-03 Status Tabs | US-BROWSE-02 | **Full** | All/Reviewing/Pursuing/Parked tabs covered |
| CD-04 Sort Controls | US-BROWSE-03 | **Full** | Score, Date, Name sorting covered |
| CD-05 Filter Panel | US-BROWSE-02 | **Partial** | Status filtering P0, but category/score range filters are P1 stories |
| CD-06 Mobile Responsive | US-MOBILE-01, US-MOBILE-02, US-RESPONSIVE-01 | **Full** | Breakpoints and mobile patterns covered |
| CD-07 Empty States | US-BROWSE-01 | **Partial** | Empty state mentioned but not comprehensive |

### Idea Management Features

| P0 Feature | User Story ID(s) | Coverage | Notes |
|------------|------------------|----------|-------|
| IM-01 Detail View | US-DETAIL-01 | **Full** | Slide-over and full-screen patterns covered |
| IM-02 Accordion Sections | US-DETAIL-02 | **Full** | All sections specified |
| IM-03 Status Dropdown | US-DETAIL-03 | **Full** | Quick status change covered |
| IM-04 Notes System | US-TRACK-01 | **Full** | Add/edit/delete notes covered |
| IM-07 Manual Idea Entry | US-GEN-01 | **Full** | Manual creation flow covered |
| IM-08 Edit Idea | — | **MISSING** | No user story for editing existing ideas |
| IM-09 Delete Idea | — | **MISSING** | No P0 story; US-BULK-02 covers bulk delete but is P2 |

### Scoring System Features

| P0 Feature | User Story ID(s) | Coverage | Notes |
|------------|------------------|----------|-------|
| SC-01 Core Parameters | US-SCORE-01 | **Full** | Score breakdown display covered |
| SC-03 Composite Score | US-SCORE-01 | **Full** | Overall score (1.0-5.0) covered |
| SC-04 Decision Tiers | US-BROWSE-01, US-SCORE-01 | **Partial** | HOT indicator mentioned; tier badges need explicit AC |

### UX/Navigation Features

| P0 Feature | User Story ID(s) | Coverage | Notes |
|------------|------------------|----------|-------|
| UX-05 Loading States | — | **MISSING** | No dedicated story for loading states |
| UX-06 Error Handling | Multiple (partial) | **Partial** | Mentioned in US-GEN-02, US-DETAIL-03, but no comprehensive story |
| UX-07 Toast Notifications | US-DETAIL-03 (partial) | **Partial** | Toast mentioned in status change; needs broader coverage |

---

## 3. Coverage Summary

| Status | Count | Percentage |
|--------|-------|------------|
| **Full Coverage** | 16 | 62% |
| **Partial Coverage** | 7 | 27% |
| **Missing Coverage** | 3 | 11% |

**Total P0 Features**: 26 (was 20)

### Full Coverage (16 features)
- **Pipeline (NEW)**: PIPE-01, PIPE-02, PIPE-03, PIPE-04
- **Core Dashboard**: CD-01, CD-02, CD-03, CD-04, CD-06
- **Idea Management**: IM-01, IM-02, IM-03, IM-04, IM-07
- **Scoring**: SC-01, SC-03

### Partial Coverage (7 features)
- **Pipeline (NEW)**: PIPE-05 (Progress UI), PIPE-06 ("NEW" Badge) - covered via other story ACs
- **Core Dashboard**: CD-05 (Filter Panel), CD-07 (Empty States)
- **Scoring**: SC-04 (Decision Tiers)
- **UX**: UX-06 (Error Handling), UX-07 (Toast Notifications)

### Missing Coverage (3 features)
- **IM-08 (Edit Idea)** - Critical gap - being added to consolidated stories
- **IM-09 (Delete Idea)** - Critical gap - being added to consolidated stories
- **UX-05 (Loading States)** - Important for UX polish - being added

---

## 4. Gap Report

### Pipeline Features - FULL COVERAGE

> **Good News**: The new AI Generation Pipeline features (PIPE-01 through PIPE-06) have **full story coverage** via the new US-PIPELINE-* stories being added in the consolidated user-stories.md. No gaps for the pipeline.

### Critical Gaps (Must Address)

#### Gap 1: IM-08 Edit Idea - **NO USER STORY**

**Feature**: Edit existing idea fields (company name, brief, category, tags, etc.)

**Impact**: High - Users cannot modify ideas after creation, fundamental CRUD operation missing

**Recommendation**: Create new story **US-EDIT-01: Edit Idea Details**

```
### US-EDIT-01: Edit Idea Details

**As a** solo founder
**I want** to edit an existing idea's details
**So that** I can refine my ideas as I learn more or correct mistakes

**Acceptance Criteria:**
- [ ] Given I am viewing an idea's detail, when I click "Edit", then the fields become editable
- [ ] Given I am in edit mode, when I modify company name, brief, category, or tags, then changes are reflected
- [ ] Given I have made changes, when I click "Save", then the idea updates in Firestore
- [ ] Given I save changes, when successful, then `updatedAt` timestamp refreshes
- [ ] Given I want to cancel, when I click "Cancel", then changes are discarded
- [ ] Given validation fails, when I try to save, then errors are shown inline
- [ ] Given I save successfully, when complete, then a confirmation toast appears

**Priority:** P0
**Complexity:** Low
```

---

#### Gap 2: IM-09 Delete Idea - **NO P0 USER STORY**

**Feature**: Delete or archive individual ideas

**Impact**: High - Users cannot remove ideas they don't want; US-BULK-02 is P2 (bulk only)

**Recommendation**: Create new story **US-MANAGE-01: Delete/Archive Idea**

```
### US-MANAGE-01: Delete/Archive Idea

**As a** solo founder
**I want** to delete or archive an individual idea
**So that** I can remove ideas I've decided against or declutter my portfolio

**Acceptance Criteria:**
- [ ] Given I am viewing an idea's detail, when I click the overflow menu (⋮), then I see "Archive" and "Delete" options
- [ ] Given I click "Archive", when confirmed, then the idea status changes to "parked" (soft archive)
- [ ] Given I click "Delete", when I click, then a confirmation dialog appears: "Permanently delete this idea?"
- [ ] Given I confirm deletion, when successful, then the idea is removed from Firestore
- [ ] Given I confirm deletion, when successful, then I return to the grid with a confirmation toast
- [ ] Given I cancel deletion, when I dismiss the dialog, then no action is taken
- [ ] Given I delete an idea, when viewing the grid, then the deleted idea no longer appears

**Priority:** P0
**Complexity:** Low
```

---

#### Gap 3: UX-05 Loading States - **NO USER STORY**

**Feature**: Skeleton loaders and progress indicators across the app

**Impact**: Medium - Poor perceived performance without loading states

**Recommendation**: Create new story **US-UX-01: Loading States**

```
### US-UX-01: Loading States

**As a** solo founder
**I want** to see loading indicators while content loads
**So that** I know the app is working and can anticipate when content will appear

**Acceptance Criteria:**
- [ ] Given I load the dashboard, when ideas are fetching, then skeleton cards display in the grid
- [ ] Given I open a detail panel, when content is loading, then skeleton placeholders show for each section
- [ ] Given I trigger an action (save, delete, status change), when processing, then a loading spinner appears on the action button
- [ ] Given I generate ideas via AI (future), when waiting, then a progress indicator shows generation status
- [ ] Given loading takes > 3 seconds, when waiting, then a helpful message appears (e.g., "Still loading...")
- [ ] Given content fails to load, when timeout occurs, then an error state with retry option appears

**Priority:** P0
**Complexity:** Low
```

---

### Moderate Gaps (Should Enhance)

#### Gap 4: CD-07 Empty States - **PARTIAL COVERAGE**

**Current**: US-BROWSE-01 mentions "no ideas" empty state briefly

**Recommendation**: Expand US-BROWSE-01 or create **US-UX-02: Empty States**

**Suggested Additional Acceptance Criteria:**
- [ ] Given I have no ideas, when I view the dashboard, then I see an engaging empty state with CTA to "Add Your First Idea"
- [ ] Given I apply filters that match nothing, when results are empty, then I see "No ideas match your filters" with "Clear Filters" button
- [ ] Given I search with no matches, when results are empty, then I see "No ideas found for '[search term]'"
- [ ] Given an idea has no notes, when I view the Notes section, then I see "No notes yet - add your first note"

---

#### Gap 5: SC-04 Decision Tiers - **PARTIAL COVERAGE**

**Current**: US-BROWSE-01 mentions HOT indicator; tier badges not fully specified

**Recommendation**: Expand US-SCORE-01 with explicit tier criteria

**Suggested Additional Acceptance Criteria:**
- [ ] Given an idea scores 4.0-5.0, when displayed, then it shows a "HOT" tier badge (red/fire)
- [ ] Given an idea scores 3.0-3.9, when displayed, then it shows a "WARM" tier badge (yellow/orange)
- [ ] Given an idea scores 2.0-2.9, when displayed, then it shows a "PARK" tier badge (blue/gray)
- [ ] Given an idea scores 1.0-1.9, when displayed, then it shows a "DISCARD" tier badge (gray/muted)
- [ ] Given I view the grid, when scanning cards, then tier badges are consistently visible and color-coded

---

#### Gap 6: UX-06 Error Handling - **PARTIAL COVERAGE**

**Current**: Error handling mentioned in US-GEN-02, US-DETAIL-03, but not comprehensive

**Recommendation**: Create **US-UX-03: Error Handling** or add to US-UX-01

**Suggested Acceptance Criteria:**
- [ ] Given a network error occurs, when any action fails, then a user-friendly error message appears (not technical jargon)
- [ ] Given an error occurs, when displayed, then a "Retry" option is available where applicable
- [ ] Given Firestore write fails, when saving, then the UI reverts to previous state with error message
- [ ] Given the app loses connection, when offline, then a banner indicates "You're offline"
- [ ] Given an error is shown, when I dismiss it, then I can continue using the app normally

---

#### Gap 7: UX-07 Toast Notifications - **PARTIAL COVERAGE**

**Current**: Toast mentioned in US-DETAIL-03 for status change only

**Recommendation**: Expand coverage or create **US-UX-04: Toast Notifications**

**Suggested Acceptance Criteria:**
- [ ] Given I successfully create an idea, when saved, then toast: "Idea created"
- [ ] Given I successfully edit an idea, when saved, then toast: "Changes saved"
- [ ] Given I successfully delete an idea, when confirmed, then toast: "Idea deleted"
- [ ] Given I change status, when updated, then toast: "Status updated to [new status]"
- [ ] Given I add a note, when saved, then toast: "Note added"
- [ ] Given an action fails, when error occurs, then error toast appears (red/warning style)
- [ ] Given a toast appears, when displayed, then it auto-dismisses after 3-4 seconds
- [ ] Given a toast appears, when I click X, then it dismisses immediately

---

## 5. Recommendations Summary

### Immediate Actions (Before MVP Development)

| Action | Type | Target Document | Status |
|--------|------|-----------------|--------|
| Create **US-PIPELINE-01** (Manual Generation) | New Story | user-stories.md | ⏳ In Progress |
| Create **US-PIPELINE-02** (Scheduled Generation) | New Story | user-stories.md | ⏳ In Progress |
| Create **US-PIPELINE-03** (Generation Settings) | New Story | user-stories.md | ⏳ In Progress |
| Create **US-PIPELINE-04** (Source Indicators) | New Story | user-stories.md | ⏳ In Progress |
| Create **US-EDIT-01** (Edit Idea) | New Story | user-stories.md | ⏳ In Progress |
| Create **US-MANAGE-01** (Delete/Archive Idea) | New Story | user-stories.md | ⏳ In Progress |
| Create **US-UX-01** (Loading States) | New Story | user-stories.md | ⏳ In Progress |

### Enhancements (Can Do Inline)

| Action | Type | Target Document |
|--------|------|-----------------|
| Expand US-BROWSE-01 with empty state ACs | Add ACs | user-stories-management.md |
| Expand US-SCORE-01 with tier badge ACs | Add ACs | user-stories-lifecycle.md |
| Create **US-UX-02** (Empty States) OR add to US-BROWSE-01 | New/Expand | user-stories-ux.md |
| Create **US-UX-03** (Error Handling) | New Story | user-stories-ux.md |
| Create **US-UX-04** (Toast Notifications) | New Story | user-stories-ux.md |

### Priority Order

**Pipeline Features (HIGHEST - per MVP scope expansion):**
1. **US-PIPELINE-01** - Manual generation trigger (primary user flow)
2. **US-PIPELINE-02** - Scheduled generation (automated discovery)
3. **US-PIPELINE-03** - Generation settings (user control)
4. **US-PIPELINE-04** - Source indicators (transparency)

**Original Gaps:**
5. **US-EDIT-01** - Critical CRUD operation
6. **US-MANAGE-01** - Critical CRUD operation
7. **US-UX-01** - Essential for perceived performance
8. Tier badge expansion - Quick enhancement
9. Empty states expansion - Quick enhancement
10. US-UX-03, US-UX-04 - Can be added incrementally

---

## 6. Final Coverage After Fixes

If all recommendations are implemented:

| Status | Count | Percentage |
|--------|-------|------------|
| **Full Coverage** | 26 | 100% |
| **Partial Coverage** | 0 | 0% |
| **Missing Coverage** | 0 | 0% |

**New Stories Required**: 7-10 (depending on consolidation approach)

*Pipeline Stories (NEW - being added):*
- US-PIPELINE-01: Manual Generation Trigger (required)
- US-PIPELINE-02: Scheduled Generation (required)
- US-PIPELINE-03: Generation Settings (required)
- US-PIPELINE-04: Source Indicators (required)

*Original Gap Stories:*
- US-EDIT-01 (required)
- US-MANAGE-01 (required)
- US-UX-01 (required)
- US-UX-02 (optional, can merge)
- US-UX-03 (optional, can merge)
- US-UX-04 (optional, can merge)

---

## Related Documents

- [Features Roadmap](features-roadmap.md)
- [User Stories (Consolidated)](user-stories.md) - NEW: Combined and prioritized stories
- [User Stories: Lifecycle](user-stories-lifecycle.md) - Superseded by consolidated doc
- [User Stories: Management](user-stories-management.md) - Superseded by consolidated doc
- [User Stories: UX](user-stories-ux.md) - Superseded by consolidated doc

---

*Document created for MVP verification phase.*
*Updated 2026-04-08: Added AI Generation Pipeline features (PIPE-01 through PIPE-06) per MVP scope expansion.*
