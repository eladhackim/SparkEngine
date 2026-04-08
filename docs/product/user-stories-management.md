# User Stories: Idea Management

**Product**: Idea Forge
**Epic**: Idea Management & Organization
**Author**: Noah-Volkov
**Date**: April 8, 2026
**Status**: Draft

---

## Overview

This document defines user stories for managing, browsing, filtering, comparing, and performing bulk actions on ideas within Idea Forge. These features enable solo founders to efficiently organize and navigate their idea portfolio.

**Target User**: Solo founder/entrepreneur managing a portfolio of business/app ideas.

**Related Documents**:
- [Concept Document](../ideation/concepts.md)

---

## 1. Browsing & Discovery

Stories that enable users to view and navigate their idea portfolio.

---

### US-BROWSE-01: Grid View of Ideas

**As a** solo founder
**I want** to see all my ideas in a grid/card layout
**So that** I can scan my portfolio quickly and get an overview of all opportunities

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when I load the page, then I see ideas displayed in a 4-column grid (desktop) or 1-column grid (mobile)
- [ ] Given I have ideas in my portfolio, when I view the grid, then each card shows: company name, overall score (1.0-5.0), brief description, status badge, and category tag
- [ ] Given an idea has a HOT score (4.0-5.0), when I view the card, then it displays a visual indicator (e.g., fire icon or highlight)
- [ ] Given the grid is loaded, when I scroll down, then additional ideas load seamlessly (infinite scroll or pagination)
- [ ] Given I have no ideas, when I view the grid, then I see an empty state prompting me to generate or add my first idea

**Priority:** P0
**Complexity:** Medium

---

### US-BROWSE-02: Filter by Status

**As a** solo founder
**I want** to filter ideas by status (All/Reviewing/Pursuing/Parked)
**So that** I can focus on ideas at a specific stage of evaluation

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when I view the filter controls, then I see status tabs: All, Reviewing, Pursuing, Parked
- [ ] Given I click on "Reviewing" tab, when the filter applies, then I only see ideas with status="reviewing"
- [ ] Given I click on "Pursuing" tab, when the filter applies, then I only see ideas with status="pursuing"
- [ ] Given I click on "Parked" tab, when the filter applies, then I only see ideas with status="parked"
- [ ] Given I click on "All" tab, when the filter applies, then I see all ideas regardless of status
- [ ] Given I apply a status filter, when ideas are filtered, then the count of displayed ideas updates in the UI
- [ ] Given I apply a status filter and have other filters active, when filtering, then both filters combine (AND logic)

**Priority:** P0
**Complexity:** Low

---

### US-BROWSE-03: Sort Ideas

**As a** solo founder
**I want** to sort ideas by score, date, or name
**So that** I can find what I'm looking for and prioritize my review

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when I view sort controls, then I see options: Score (High-Low), Score (Low-High), Date (Newest), Date (Oldest), Name (A-Z), Name (Z-A)
- [ ] Given I select "Score (High-Low)", when sort applies, then ideas display with highest overall score first
- [ ] Given I select "Date (Newest)", when sort applies, then ideas display with most recently created/updated first
- [ ] Given I select "Name (A-Z)", when sort applies, then ideas display alphabetically by company name
- [ ] Given I change sort order, when the grid updates, then my filter selections remain intact
- [ ] Given I have a sort selected, when I return to the dashboard later in the same session, then my sort preference persists

**Priority:** P0
**Complexity:** Low

---

### US-BROWSE-04: Search Ideas

**As a** solo founder
**I want** to search ideas by name or description
**So that** I can find specific concepts quickly without scrolling

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when I view the page, then I see a search input field prominently displayed
- [ ] Given I type "game" in search, when I press enter or after a debounce delay, then I see only ideas where company name OR brief contains "game" (case-insensitive)
- [ ] Given I have a search term active, when I view results, then matching text is highlighted in the cards
- [ ] Given I search for a term with no matches, when results display, then I see an empty state: "No ideas match your search"
- [ ] Given I clear the search field, when the field is empty, then all ideas (respecting other active filters) display again
- [ ] Given I have filters active and search, when combined, then search applies within the filtered results (AND logic)

**Priority:** P1
**Complexity:** Medium

---

## 2. Filtering & Organization

Stories that enable users to narrow down and organize their idea portfolio.

---

### US-FILTER-01: Filter by Category

**As a** solo founder
**I want** to filter ideas by category (Games, Tools, SaaS, etc.)
**So that** I can focus on specific types of business opportunities

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when I open filter controls, then I see a category dropdown with options: All Categories, Games, Tools, SaaS, Platforms, Mobile Apps, Content, Services, Hardware, Other
- [ ] Given I select "Games" category, when filter applies, then I only see ideas where category="Games"
- [ ] Given I select "All Categories", when filter applies, then category filter is cleared
- [ ] Given I apply a category filter with other filters, when combined, then all filters work together (AND logic)
- [ ] Given a category has zero ideas, when I view the dropdown, then that category still appears but shows (0) count

**Priority:** P1
**Complexity:** Low

---

### US-FILTER-02: Filter by Score Range

**As a** solo founder
**I want** to filter ideas by score range (HOT/WARM/PARK)
**So that** I can quickly see my best opportunities or find ideas to revisit

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when I open filter controls, then I see score range options: All Scores, HOT (4.0-5.0), WARM (3.0-3.9), PARK (2.0-2.9), DISCARD (1.0-1.9)
- [ ] Given I select "HOT", when filter applies, then I only see ideas with overall score >= 4.0
- [ ] Given I select "WARM", when filter applies, then I only see ideas with overall score >= 3.0 AND < 4.0
- [ ] Given I select "PARK", when filter applies, then I only see ideas with overall score >= 2.0 AND < 3.0
- [ ] Given I select "DISCARD", when filter applies, then I only see ideas with overall score >= 1.0 AND < 2.0
- [ ] Given I have score filter active with other filters, when combined, then all filters apply together (AND logic)

**Priority:** P1
**Complexity:** Low

---

### US-FILTER-03: Filter by Tags

**As a** solo founder
**I want** to filter ideas by custom tags
**So that** I can organize and find ideas by my own criteria (e.g., "AI", "fintech", "quick-win")

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when I open filter controls, then I see a tags filter showing all unique tags from my portfolio
- [ ] Given I select tag "AI", when filter applies, then I only see ideas that have "AI" in their tags array
- [ ] Given I select multiple tags, when filter applies, then I see ideas that have ANY of the selected tags (OR logic within tags)
- [ ] Given I clear tag selection, when filter clears, then all ideas display (respecting other active filters)
- [ ] Given I have no ideas with tags, when I view tag filter, then it shows empty state or is disabled
- [ ] Given I add a new tag to an idea, when I return to tag filter, then the new tag appears in the filter options

**Priority:** P2
**Complexity:** Medium

---

## 3. Comparison & Analysis

Stories that enable users to compare ideas side-by-side for decision-making.

---

### US-COMPARE-01: Compare Two Ideas

**As a** solo founder
**I want** to compare two ideas side-by-side
**So that** I can decide which opportunity to pursue when choosing between options

**Acceptance Criteria:**
- [ ] Given I am on the dashboard (desktop), when I initiate compare mode, then I can select up to 2 ideas for comparison
- [ ] Given I have selected 2 ideas, when I click "Compare", then a comparison view opens showing both ideas side-by-side
- [ ] Given I am in comparison view, when I view the layout, then I see: company names, briefs, all score parameters, status, category, strengths, risks
- [ ] Given I am in comparison view, when I want to change my selection, then I can remove an idea and select a different one
- [ ] Given I am on mobile, when I try to compare, then I see a message that comparison is desktop-only (or a simplified stacked view)
- [ ] Given I am in comparison view, when I click close, then I return to the main dashboard with my filters preserved

**Priority:** P1
**Complexity:** High

---

### US-COMPARE-02: Score Breakdown Comparison

**As a** solo founder
**I want** to see score breakdowns compared visually
**So that** I can understand the specific trade-offs between ideas

**Acceptance Criteria:**
- [ ] Given I am in comparison view with 2 ideas, when I view scores, then I see a visual comparison (bar chart or radar chart) of all score parameters
- [ ] Given the visual comparison displays, when I view it, then each parameter shows: Business Potential, Development Complexity, Time to Market, Competition Level, Risk Level
- [ ] Given two ideas have different scores, when I view the chart, then the difference is clearly visible (color-coded, with actual numbers)
- [ ] Given an idea scores higher in a parameter, when displayed, then that idea's bar/segment is visually emphasized (e.g., green highlight)
- [ ] Given I hover/tap on a score parameter, when interacting, then I see a tooltip explaining what that parameter measures

**Priority:** P2
**Complexity:** Medium

---

### US-COMPARE-03: Quick Compare from Grid

**As a** solo founder
**I want** to select ideas from the grid to compare
**So that** I can initiate comparison without losing my browsing context

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when I hover over an idea card (desktop), then I see a "Compare" checkbox or icon
- [ ] Given I check the compare checkbox on one idea, when I check another idea, then a "Compare Selected (2)" button appears
- [ ] Given I have 2 ideas selected for comparison, when I click "Compare Selected", then the comparison view opens with those ideas
- [ ] Given I have ideas selected, when I click on a card normally (not the compare checkbox), then the detail view opens (compare selection preserved)
- [ ] Given I have 2 ideas selected and try to select a third, when I click, then the oldest selection is deselected (or I see a max selection warning)
- [ ] Given I want to cancel comparison selection, when I click "Clear Selection", then all compare checkboxes are cleared

**Priority:** P2
**Complexity:** Medium

---

## 4. Bulk Actions

Stories that enable users to perform operations on multiple ideas at once.

---

### US-BULK-01: Bulk Status Change

**As a** solo founder
**I want** to change the status of multiple ideas at once
**So that** I can quickly organize my portfolio after a review session

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when I enter selection mode, then I can select multiple ideas via checkboxes
- [ ] Given I have selected 3+ ideas, when I view bulk actions, then I see "Change Status" option
- [ ] Given I have ideas selected and click "Change Status", when the dialog opens, then I can choose: Reviewing, Pursuing, Parked
- [ ] Given I select "Pursuing" as new status, when I confirm, then all selected ideas update to status="pursuing"
- [ ] Given bulk status change completes, when I view the grid, then the updated ideas show their new status badges
- [ ] Given I change status in bulk, when the operation completes, then I see a success toast: "Updated 5 ideas to Pursuing"
- [ ] Given some ideas fail to update, when the operation completes, then I see which specific ideas failed and why

**Priority:** P2
**Complexity:** Medium

---

### US-BULK-02: Bulk Delete/Archive

**As a** solo founder
**I want** to archive or delete multiple ideas at once
**So that** I can clean up my portfolio and remove ideas I've evaluated and dismissed

**Acceptance Criteria:**
- [ ] Given I have multiple ideas selected, when I view bulk actions, then I see "Archive Selected" and "Delete Selected" options
- [ ] Given I click "Archive Selected", when I confirm, then selected ideas move to status="parked" (soft archive)
- [ ] Given I click "Delete Selected", when I click, then I see a confirmation dialog: "Permanently delete X ideas? This cannot be undone."
- [ ] Given I confirm deletion, when the operation completes, then selected ideas are permanently removed from Firestore
- [ ] Given I cancel the deletion confirmation, when the dialog closes, then no ideas are deleted and selection is preserved
- [ ] Given I delete ideas in bulk, when the operation completes, then I see a success toast: "Deleted 3 ideas"
- [ ] Given I archive ideas in bulk, when the operation completes, then I see a success toast: "Archived 5 ideas"

**Priority:** P2
**Complexity:** Medium

---

## 5. Basic Idea Operations

Stories that enable users to edit and delete individual ideas.

---

### US-EDIT-01: Edit Idea

**As a** solo founder
**I want** to edit an existing idea's details
**So that** I can refine and update information as I learn more

**Acceptance Criteria:**
- [ ] Given I am viewing an idea's detail, when I click "Edit", then all editable fields become active (name, brief, category, tags)
- [ ] Given I am in edit mode, when I modify the company name, then the change is reflected in the input field
- [ ] Given I am in edit mode, when I modify the brief description, then the change is reflected in the textarea
- [ ] Given I am in edit mode, when I change the category, then I can select from the category dropdown
- [ ] Given I am in edit mode, when I add or remove tags, then the tags array updates accordingly
- [ ] Given I have made changes, when I click "Save", then the idea updates in Firestore with new values
- [ ] Given I save changes, when the save completes, then `updatedAt` timestamp is refreshed
- [ ] Given I save changes, when successful, then I see a success toast: "Changes saved"
- [ ] Given I want to cancel, when I click "Cancel", then all changes are discarded and view mode resumes
- [ ] Given validation fails (e.g., empty name), when I try to save, then inline errors are shown
- [ ] Given I am in edit mode, when I press Escape, then edit mode is cancelled

**Priority:** P0
**Complexity:** Medium

---

### US-MANAGE-01: Delete Single Idea

**As a** solo founder
**I want** to delete an individual idea
**So that** I can remove ideas I no longer want to track

**Acceptance Criteria:**
- [ ] Given I am viewing an idea's detail, when I click the overflow menu (⋮), then I see a "Delete" option
- [ ] Given I click "Delete", when clicked, then a confirmation dialog appears: "Delete this idea? This cannot be undone."
- [ ] Given the confirmation dialog is open, when I click "Delete" to confirm, then the idea is permanently removed from Firestore
- [ ] Given deletion completes, when successful, then the detail panel closes and I return to the grid
- [ ] Given deletion completes, when successful, then I see a success toast: "Idea deleted"
- [ ] Given deletion completes, when viewing the grid, then the deleted idea is no longer visible
- [ ] Given I click "Cancel" on the confirmation dialog, when cancelled, then no action is taken and the dialog closes
- [ ] Given deletion fails, when an error occurs, then the idea remains and an error message is shown

**Priority:** P0
**Complexity:** Low

---

## Summary

| Story ID | Title | Priority | Complexity |
|----------|-------|----------|------------|
| US-BROWSE-01 | Grid View of Ideas | P0 | Medium |
| US-BROWSE-02 | Filter by Status | P0 | Low |
| US-BROWSE-03 | Sort Ideas | P0 | Low |
| US-BROWSE-04 | Search Ideas | P1 | Medium |
| US-FILTER-01 | Filter by Category | P1 | Low |
| US-FILTER-02 | Filter by Score Range | P1 | Low |
| US-FILTER-03 | Filter by Tags | P2 | Medium |
| US-COMPARE-01 | Compare Two Ideas | P1 | High |
| US-COMPARE-02 | Score Breakdown Comparison | P2 | Medium |
| US-COMPARE-03 | Quick Compare from Grid | P2 | Medium |
| US-BULK-01 | Bulk Status Change | P2 | Medium |
| US-BULK-02 | Bulk Delete/Archive | P2 | Medium |
| **US-EDIT-01** | **Edit Idea** | **P0** | **Medium** |
| **US-MANAGE-01** | **Delete Single Idea** | **P0** | **Low** |

**Total Stories:** 14
**P0 (Must Have):** 5
**P1 (Should Have):** 4
**P2 (Nice to Have):** 5

---

## Implementation Notes

### Dependencies
- US-BROWSE-01 (Grid View) must be implemented first as foundation
- All filter stories depend on US-BROWSE-01
- Compare stories depend on US-BROWSE-01 and ideally US-BROWSE-03 (Quick Compare)
- Bulk actions depend on selection mechanism from US-COMPARE-03
- US-EDIT-01 and US-MANAGE-01 depend on US-DETAIL-01 (Detail View) from user-stories-ux.md

### Technical Considerations
- Search (US-BROWSE-04) may require Firestore full-text search solution or client-side filtering for small datasets
- Tags filter (US-FILTER-03) requires Firestore array-contains queries
- Comparison view (US-COMPARE-01) is desktop-only per UX spec
- Score range filtering aligns with decision tiers from scoring system
- US-EDIT-01 requires form validation and optimistic UI updates
- US-MANAGE-01 requires Firestore delete with confirmation UX

### Suggested Implementation Order
1. US-BROWSE-01 (Grid View) - Foundation
2. US-BROWSE-02 (Filter by Status) - Core navigation
3. US-BROWSE-03 (Sort Ideas) - Basic organization
4. **US-EDIT-01 (Edit Idea) - Core CRUD operation**
5. **US-MANAGE-01 (Delete Idea) - Core CRUD operation**
6. US-FILTER-01, US-FILTER-02 (Category, Score filters) - Enhanced filtering
7. US-BROWSE-04 (Search) - Discovery
8. US-COMPARE-03, US-COMPARE-01 (Quick Compare, Compare View) - Decision support
9. US-COMPARE-02 (Score Breakdown) - Enhanced comparison
10. US-FILTER-03 (Tags) - Custom organization
11. US-BULK-01, US-BULK-02 (Bulk Actions) - Efficiency features
