# Cross-Document Consistency Review

**Product**: Idea Forge
**Date**: April 8, 2026
**Reviewer**: Amelia Goldstein (Product Specs Worker)
**Status**: QA Review - Updated

---

## Resolution Status (Updated 2026-04-08)

| Issue | Status | Resolution |
|-------|--------|------------|
| CRITICAL-01: AI Generation MVP Conflict | ✅ RESOLVED | PM decided AI is v1.1. PRD updated to remove AI from MVP scope. |
| Priority Mismatches (5) | ✅ BEING CORRECTED | Will be aligned in consolidated user-stories.md |
| Missing MVP Stories (4) | ✅ BEING ADDED | Edit, Delete, Loading stories being added to consolidated doc |
| Terminology Inconsistencies | ⏳ PENDING | Status value standardization still needed |

---

## 1. Documents Reviewed

| Document | Author | Date | Purpose |
|----------|--------|------|---------|
| `docs/product/prd.md` | Product Team | Apr 8, 2026 | Core requirements and scope |
| `docs/product/features-roadmap.md` | Amelia Goldstein | Apr 8, 2026 | Feature inventory and priorities |
| `docs/product/user-stories-lifecycle.md` | Yonatan Weiss | Apr 8, 2026 | Generate/Score/Track workflows |
| `docs/product/user-stories-management.md` | Noah Volkov | Apr 8, 2026 | Browse/Filter/Compare workflows |

---

## 2. Critical Issues Found

### ~~CRITICAL-01: AI Generation MVP Scope Conflict~~ RESOLVED

**Severity**: ~~CRITICAL - Blocking~~ **RESOLVED**

**Resolution**: PM decided AI Generation is **v1.1, NOT MVP**. PRD Section 4 has been updated:
- Removed "AI Generation" row from MVP scope table
- Added clarification note: "AI-assisted generation (Gemini, Grok) is planned for v1.1, not MVP"
- Added "AI Generation (Gemini)" to Post-MVP v1.1 features

**Original Issue** (for reference):
- PRD originally listed AI Generation in MVP scope
- Roadmap correctly had AI as P1/v1.1
- User story US-GEN-02 was marked P0 (will be corrected in consolidated doc)

**Status**: ✅ PRD fixed. User story priorities being aligned in consolidation.

---

### CRITICAL-02: Re-Score Priority Mismatch ⏳ PENDING

**Severity**: HIGH

| Document | Feature/Story | Priority |
|----------|---------------|----------|
| user-stories-lifecycle.md | US-SCORE-03: Re-Score Ideas | **P1** |
| features-roadmap.md | SC-09: Score Refresh | **P3** |

**Gap**: 2 priority levels apart (P1 vs P3)

**Impact**: User story expects re-scoring in v1.1, but roadmap schedules it for v1.3. Development planning will conflict.

**Recommendation**: Align to P3 (roadmap) - re-scoring requires AI and is a future enhancement.

**Resolution Status**: Will be corrected in consolidated user-stories.md.

---

### CRITICAL-03: Compare View Priority Mismatch ⏳ PENDING

**Severity**: MEDIUM

| Document | Feature/Story | Priority |
|----------|---------------|----------|
| user-stories-management.md | US-COMPARE-01: Compare Two Ideas | **P1** |
| features-roadmap.md | IM-05: Compare View | **P2** |

**Gap**: 1 priority level apart

**Impact**: Story expects comparison in v1.1, roadmap schedules for v1.2.

**Recommendation**: Align to P2 (roadmap) since comparison is a "nice-to-have" for decision support, not core workflow.

**Resolution Status**: Will be corrected in consolidated user-stories.md.

---

### CRITICAL-04: Trend Suggestions Priority Mismatch ⏳ PENDING

**Severity**: MEDIUM

| Document | Feature/Story | Priority |
|----------|---------------|----------|
| user-stories-lifecycle.md | US-GEN-03: Trend-Based Suggestions | **P1** |
| features-roadmap.md | AI-03 (Grok) + AI-04 (Auto-Suggestion) | **P2** |

**Gap**: 1 priority level apart

**Impact**: Story expects trends in v1.1, roadmap schedules for v1.2.

**Recommendation**: Align to P2 (roadmap) since Grok integration requires Gemini foundation first.

**Resolution Status**: Will be corrected in consolidated user-stories.md.

---

## 3. Terminology Inconsistencies

### TERM-01: Status Values

| Document | Status Values Used |
|----------|-------------------|
| PRD (Section 4) | New → Reviewing → Pursuing → Parked → **Rejected** |
| Roadmap (CD-03) | All / Reviewing / Pursuing / Parked |
| user-stories-lifecycle.md | New, Reviewing, Pursuing, Parked |
| user-stories-management.md | All, Reviewing, Pursuing, Parked |

**Issues**:
1. PRD includes "Rejected" status, other docs omit it
2. Roadmap/stories omit "New" from status tabs (but "New" exists as a status)

**Recommendation**:
- Standardize on: `new`, `reviewing`, `pursuing`, `parked`, `rejected`
- Status tabs should be: All / New / Reviewing / Pursuing / Parked / Rejected
- Update CD-03 description in roadmap

---

### TERM-02: Feature Naming

| Roadmap Term | User Story Term | Same Concept? |
|--------------|-----------------|---------------|
| CD-03 Status Tabs | US-BROWSE-02 Filter by Status | Yes |
| CD-05 Filter Panel | US-FILTER-01, US-FILTER-02, US-FILTER-03 | Yes (combined) |
| IM-03 Status Dropdown | US-TRACK-02 Change Idea Status | Yes |
| SC-04 Decision Tiers | US-SCORE-01 (mentions tiers) | Yes |

**Recommendation**: No action needed - naming differences are acceptable as roadmap uses technical feature names while stories use user-facing language.

---

## 4. Gap Analysis

### 4.1 MVP Features Missing User Stories

| Feature ID | Feature Name | Priority | User Story? | Gap |
|------------|--------------|----------|-------------|-----|
| IM-08 | Edit Idea | P0 | **MISSING** | No dedicated story for editing idea fields |
| CD-06 | Mobile Responsive | P0 | Partial | Mentioned in US-BROWSE-01 but no dedicated criteria |
| CD-07 | Empty States | P0 | Partial | Mentioned in US-BROWSE-01 but no dedicated criteria |
| UX-05 | Loading States | P0 | **MISSING** | No user story for loading UX |
| UX-06 | Error Handling | P0 | **MISSING** | No user story for error states |
| UX-07 | Toast Notifications | P0 | **MISSING** | No user story for confirmations |

**Impact**: 4 MVP features have no user stories. QA won't have acceptance criteria to test against.

**Recommendation**: Add user stories for IM-08, UX-05, UX-06, UX-07 (or fold into existing stories as acceptance criteria).

---

### 4.2 Post-MVP Features Missing User Stories

| Feature ID | Feature Name | Priority | User Story? |
|------------|--------------|----------|-------------|
| UX-01 | Keyboard Navigation | P1 | **MISSING** |
| UX-02 | Swipe Gestures | P2 | **MISSING** |
| UX-03 | Bottom Sheet Filters | P1 | **MISSING** |
| UX-04 | Dropdown Panel Filters | P1 | **MISSING** |
| AI-06 | Idea Acceptance Flow | P2 | Partial (in US-GEN-02/03) |
| AI-07 | Batch Processing | P2 | **MISSING** |
| AI-08 | Generation Settings | P3 | **MISSING** |

**Impact**: UX polish features lack acceptance criteria. Lower priority for now.

**Recommendation**: Create UX-focused user stories before v1.1 development begins.

---

### 4.3 User Stories Without Clear Feature Mapping

| Story ID | Story Name | Priority | Feature Mapping | Gap |
|----------|------------|----------|-----------------|-----|
| US-TRACK-03 | View Idea History | P1 | None specific | Roadmap has timestamps but no "history view" feature |

**Recommendation**: Either add a feature for history view (staleness indicators, filtering by staleness) or clarify that this is covered by existing timestamp display in cards/details.

---

## 5. Alignment Matrix

### 5.1 Core Dashboard Features

| Feature (Roadmap) | PRD Section | User Story ID | Priority Match | Status |
|-------------------|-------------|---------------|----------------|--------|
| CD-01 Main Grid View | Section 4 ✓ | US-BROWSE-01 | P0 = P0 | ALIGNED |
| CD-02 Idea Cards | Section 4 ✓ | US-BROWSE-01 | P0 = P0 | ALIGNED |
| CD-03 Status Tabs | Section 4 ✓ | US-BROWSE-02 | P0 = P0 | ALIGNED |
| CD-04 Sort Controls | Section 4 ✓ | US-BROWSE-03 | P0 = P0 | ALIGNED |
| CD-05 Filter Panel | Section 4 ✓ | US-FILTER-01, 02, 03 | P0 vs P1/P2 | **MISMATCH** |
| CD-06 Mobile Responsive | Section 4 ✓ | (in US-BROWSE-01) | P0 | PARTIAL |
| CD-07 Empty States | Section 4 ✓ | (in US-BROWSE-01) | P0 | PARTIAL |

**Note on CD-05**: Roadmap bundles all filtering into one P0 feature, but user stories split into category (P1), score range (P1), and tags (P2). This is acceptable - CD-05 covers basic filtering, advanced filtering comes in P1/P2.

---

### 5.2 Idea Management Features

| Feature (Roadmap) | PRD Section | User Story ID | Priority Match | Status |
|-------------------|-------------|---------------|----------------|--------|
| IM-01 Detail View | Section 4 ✓ | US-SCORE-01, US-SCORE-02 | P0 = P0 | ALIGNED |
| IM-02 Accordion Sections | Section 4 ✓ | US-SCORE-02 | P0 = P0 | ALIGNED |
| IM-03 Status Dropdown | Section 4 ✓ | US-TRACK-02 | P0 = P0 | ALIGNED |
| IM-04 Notes System | Section 4 ✓ | US-TRACK-01 | P0 = P0 | ALIGNED |
| IM-05 Compare View | Section 4 (Post-MVP) | US-COMPARE-01 | P2 vs P1 | **MISMATCH** |
| IM-06 Bulk Select | Section 4 (Post-MVP) | US-BULK-01, US-BULK-02 | P2 = P2 | ALIGNED |
| IM-07 Manual Idea Entry | Section 4 ✓ | US-GEN-01 | P0 = P0 | ALIGNED |
| IM-08 Edit Idea | Section 4 ✓ | **MISSING** | P0 | **GAP** |
| IM-09 Delete Idea | Section 4 ✓ | US-BULK-02 (partial) | P0 vs P2 | **PARTIAL** |

**Note on IM-09**: Single delete is P0 in roadmap, but only bulk delete story exists (P2). Need single delete acceptance criteria.

---

### 5.3 AI Generation Features

| Feature (Roadmap) | PRD Section | User Story ID | Priority Match | Status |
|-------------------|-------------|---------------|----------------|--------|
| AI-01 Gemini Integration | Section 4 (v1.1) ✅ | US-GEN-02 | P1 = P1 | ✅ ALIGNED (after story fix) |
| AI-02 Manual Prompt Mode | Section 4 (v1.1) ✅ | US-GEN-02 | P1 = P1 | ✅ ALIGNED (after story fix) |
| AI-03 Grok Integration | Section 4 (v1.2) | US-GEN-03 | P2 vs P1 | ⏳ Story being fixed to P2 |
| AI-04 Auto-Suggestion Mode | Section 4 (v1.2) | US-GEN-03 | P2 vs P1 | ⏳ Story being fixed to P2 |
| AI-05 Polymarket Integration | Section 4 (v1.3) | None | P3 | NO STORY |
| AI-06 Idea Acceptance Flow | Not explicit | (in US-GEN-02, 03) | P2 | PARTIAL |
| AI-07 Batch Processing | Not explicit | None | P2 | NO STORY |
| AI-08 Generation Settings | Not explicit | None | P3 | NO STORY |

> **Note**: PRD Section 4 now correctly shows AI Generation as v1.1 (Post-MVP). User story priorities being aligned in consolidated doc.

---

### 5.4 Scoring System Features

| Feature (Roadmap) | PRD Section | User Story ID | Priority Match | Status |
|-------------------|-------------|---------------|----------------|--------|
| SC-01 Core Parameters | Section 4 ✓ | US-SCORE-01 | P0 = P0 | ALIGNED |
| SC-02 Optional Parameters | Section 4 (Post-MVP) | US-SCORE-01 (partial) | P1 | PARTIAL |
| SC-03 Composite Score | Section 4 ✓ | US-SCORE-01 | P0 = P0 | ALIGNED |
| SC-04 Decision Tiers | Section 4 ✓ | US-SCORE-01 | P0 = P0 | ALIGNED |
| SC-05 Weight Presets | Section 4 (Post-MVP) | None explicit | P1 | NO STORY |
| SC-06 Custom Weights | Section 4 (Post-MVP) | None | P3 | NO STORY |
| SC-07 Trade-off Flags | Appendix A ✓ | US-SCORE-02 | P1 = P0 | **MISMATCH** |
| SC-08 Score Visualization | Not explicit | US-COMPARE-02 | P2 = P2 | ALIGNED |
| SC-09 Score Refresh | Section 4 (v2.0) | US-SCORE-03 | P3 vs P1 | **MISMATCH** |

---

### 5.5 UX/Navigation Features

| Feature (Roadmap) | PRD Section | User Story ID | Priority Match | Status |
|-------------------|-------------|---------------|----------------|--------|
| UX-01 Keyboard Navigation | Section 5.5 ✓ | None | P1 | NO STORY |
| UX-02 Swipe Gestures | Not explicit | None | P2 | NO STORY |
| UX-03 Bottom Sheet Filters | Not explicit | None | P1 | NO STORY |
| UX-04 Dropdown Panel Filters | Not explicit | None | P1 | NO STORY |
| UX-05 Loading States | Section 5.5 ✓ | None | P0 | **NO STORY (MVP)** |
| UX-06 Error Handling | Section 5.5 ✓ | None | P0 | **NO STORY (MVP)** |
| UX-07 Toast Notifications | Not explicit | None | P0 | **NO STORY (MVP)** |
| UX-08 Search | Section 4 (Post-MVP) | US-BROWSE-04 | P1 = P1 | ALIGNED |
| UX-09 Trend Alerts | Section 4 (v2.0) | None | P3 | NO STORY |

---

## 6. Recommendations

### 6.1 Critical Fixes Required

| ID | Issue | Fix Required | Owner | Status |
|----|-------|--------------|-------|--------|
| FIX-01 | AI Generation MVP conflict | ~~Decide: Is AI in MVP or not?~~ | Product Manager | ✅ DONE |
| FIX-02 | US-SCORE-03 vs SC-09 priority | Align to P3 in consolidated doc | Wei Bergman | ⏳ In Progress |
| FIX-03 | US-COMPARE-01 vs IM-05 priority | Align to P2 in consolidated doc | Wei Bergman | ⏳ In Progress |
| FIX-04 | US-GEN-03 vs AI-03/04 priority | Align to P2 in consolidated doc | Wei Bergman | ⏳ In Progress |
| FIX-05 | SC-07 trade-off flags priority | Align to P1 in consolidated doc | Wei Bergman | ⏳ In Progress |

> **Note**: FIX-01 resolved by updating PRD v1.1. FIX-02 through FIX-05 being resolved in consolidated user-stories.md by Wei Bergman.

---

### 6.2 Missing User Stories to Add

| Priority | Feature | Suggested Story Title |
|----------|---------|----------------------|
| **P0** | IM-08 Edit Idea | US-MANAGE-01: Edit Idea Fields |
| **P0** | UX-05, UX-06, UX-07 | US-UX-01: System Feedback (loading, errors, toasts) |
| P1 | UX-01 Keyboard Navigation | US-UX-02: Keyboard Shortcuts |
| P1 | UX-03/UX-04 Filter Interfaces | US-UX-03: Platform-Optimized Filters |
| P2 | AI-07 Batch Processing | US-AI-01: Batch Idea Processing |
| P3 | AI-08 Generation Settings | US-AI-02: AI Configuration |

---

### 6.3 Terminology Standardization

| Item | Current State | Recommended Standard |
|------|---------------|---------------------|
| Status values | Inconsistent across docs | `new`, `reviewing`, `pursuing`, `parked`, `rejected` |
| Status tabs | Missing "New" and "Rejected" | Add all statuses to tab options |

---

### 6.4 Document Updates Summary

| Document | Updates Needed | Status |
|----------|----------------|--------|
| **prd.md** | ~~Clarify AI Generation scope~~ | ✅ DONE (v1.1) |
| **features-roadmap.md** | Update CD-03 status tab values; clarify SC-07 priority | ⏳ Pending |
| **user-stories-lifecycle.md** | ~~Being replaced by consolidated doc~~ | ✅ Superseded |
| **user-stories-management.md** | ~~Being replaced by consolidated doc~~ | ✅ Superseded |
| **user-stories.md (NEW)** | Consolidated doc with corrected priorities | ⏳ In Progress |
| **Missing stories** | Edit, Delete, Loading, Error handling | ⏳ Being added |

---

## 7. Summary

### Alignment Score (Updated)

| Category | Issues | Severity | Status |
|----------|--------|----------|--------|
| MVP Scope Alignment | ~~1 critical conflict~~ | ~~BLOCKING~~ | ✅ RESOLVED |
| Priority Alignment | 5 mismatches | HIGH | ⏳ Being corrected |
| Terminology Consistency | 2 issues | MEDIUM | ⏳ Pending |
| Story Coverage | 4 MVP gaps, 7 post-MVP gaps | HIGH | ⏳ Being added |

### ~~Blocking Issue~~ RESOLVED

~~The AI Generation MVP conflict (CRITICAL-01) must be resolved before any development begins.~~

**CRITICAL-01 is now RESOLVED.** PM decided AI is v1.1, PRD has been updated. No blocking issues remain.

### Resolution Progress

1. ✅ **DONE**: CRITICAL-01 - AI Generation removed from MVP (PRD v1.1)
2. ⏳ **In Progress**: Priority mismatches being fixed in consolidated user-stories.md
3. ⏳ **In Progress**: Missing MVP user stories being added
4. ⏳ **Pending**: Terminology standardization

---

*Review completed by Worker Amelia-Goldstein*
*Updated: 2026-04-08 - CRITICAL-01 resolved*
