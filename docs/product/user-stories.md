# Idea Forge - User Stories (Master Document)

**Product**: Idea Forge
**Version**: 1.0
**Date**: April 8, 2026
**Status**: Consolidated

---

## Overview

This document consolidates all user stories for Idea Forge, the AI-powered idea generation and validation dashboard for solo entrepreneurs.

### Story Count Summary

| Priority | Count | Description |
|----------|-------|-------------|
| **P0** | 24 | Must-have for MVP (includes AI generation pipeline) |
| **P1** | 13 | Should-have for v1.1+ |
| **P2** | 9 | Nice-to-have for future |
| **Total** | **46** | All stories |

> **PRIORITY SHIFT (April 8, 2026)**: Automated idea generation is now **MVP-critical**. AI pipeline stories (US-PIPELINE-01 through US-PIPELINE-04) added as P0. US-GEN-02, US-SCORE-02, and US-ERROR-01 restored to P0.

### Source Documents

| Section | Source File | Author | Stories |
|---------|-------------|--------|---------|
| 1. Core Idea Lifecycle | `user-stories-lifecycle.md` | Yonatan Weiss | 9 |
| 2. Idea Management | `user-stories-management.md` | Noah-Volkov | 12 |
| 3. Detail View & Mobile UX | `user-stories-ux.md` | Yonatan Weiss | 10 |
| 4. Error Handling & Edge Cases | `user-stories-edge-cases.md` | Noah-Volkov | 11 |
| 5. Idea Generation Pipeline | *inline (this doc)* | Yonatan Weiss | 4 |

### MVP Scope (P0 Stories)

The MVP includes **24 P0 stories** covering the **full AI-powered workflow**:
- **AI idea generation pipeline** (manual trigger, scheduled generation, settings, source tracking)
- AI-assisted idea generation from prompts
- Score display with AI-generated reasoning (strengths, risks, trade-offs)
- Manual idea entry as fallback
- Notes and status tracking
- Grid view with filtering and sorting
- Detail view with expandable sections
- Mobile-responsive design
- Empty states and data persistence
- Network error handling
- AI generation error handling

---

## 1. Core Idea Lifecycle

*Source: `user-stories-lifecycle.md` | Author: Yonatan Weiss*

Stories covering the foundational workflow: **Generate → Score → Track**

### 1.1 Idea Generation Flow

#### US-GEN-01: Manual Idea Entry

**As a** solo founder
**I want** to manually add an idea with basic details
**So that** I can track concepts I discover elsewhere (conversations, articles, shower thoughts)

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when I click "Add Idea", then a form opens for manual entry
- [ ] Given the form is open, when I enter a company name and brief description, then I can save the idea
- [ ] Given I submit a valid idea, when the save completes, then the idea appears in my portfolio with status "New"
- [ ] Given I submit an idea, when saved, then `createdAt` and `updatedAt` timestamps are automatically set
- [ ] Given I leave required fields empty, when I try to save, then validation errors are shown

**Priority:** P0 | **Complexity:** Low

---

#### US-GEN-02: AI-Assisted Generation

**As a** solo founder
**I want** to generate ideas from a topic or prompt using AI
**So that** I can quickly explore new directions without starting from scratch

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when I click "Generate Ideas", then a prompt input appears
- [ ] Given I enter a topic (e.g., "AI tools for remote teams"), when I submit, then the system calls the AI service to generate ideas
- [ ] Given the AI returns results, when generation completes, then I see a list of suggested ideas with names, briefs, and preliminary scores
- [ ] Given I see generated ideas, when I click "Add to Portfolio" on any idea, then it is saved to my ideas collection
- [ ] Given AI generation is in progress, when waiting, then a loading indicator is displayed
- [ ] Given the AI service fails, when an error occurs, then a user-friendly error message is shown with retry option
- [ ] Given I generate ideas, when adding them, then each idea is tagged with `source: "ai-generated"` for tracking

**Priority:** P0 | **Complexity:** Medium

> **Priority Restored (April 8, 2026)**: AI generation is now MVP-critical. Restored to P0.

---

#### US-GEN-03: Trend-Based Suggestions

**As a** solo founder
**I want** the system to suggest ideas based on trending topics
**So that** I don't miss market opportunities while they're hot

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when there are new trend-based suggestions, then a "Suggestions" badge or section is visible
- [ ] Given I view suggestions, when I open the section, then I see AI-generated ideas derived from current trends (Grok/X data)
- [ ] Given a suggestion is displayed, when I view it, then I can see the trend source that inspired it (e.g., "Trending on X: #AIAgents")
- [ ] Given I like a suggestion, when I click "Add to Portfolio", then it is saved with the trend context preserved
- [ ] Given I dismiss a suggestion, when I click "Dismiss", then it is removed from my suggestions list
- [ ] Given suggestions exist, when I view them, then each shows a freshness indicator (how recent the trend is)

**Priority:** P2 | **Complexity:** High

> **Priority Change**: Moved from P1 to P2. Trend-based suggestions require Grok integration (v1.2).

---

### 1.2 Scoring Flow

#### US-SCORE-01: View Idea Scores

**As a** solo founder
**I want** to see overall and breakdown scores for each idea
**So that** I can quickly assess potential without deep-diving every time

**Acceptance Criteria:**
- [ ] Given I view an idea card, when displayed, then the overall score (1.0-5.0) is prominently visible
- [ ] Given I click on an idea, when the detail view opens, then I see breakdown scores: Market Potential, Technical Feasibility, Uniqueness, Risk Level, Time to Market
- [ ] Given I view scores, when displayed, then each score uses a 1-5 scale with visual indicators (color coding: red/yellow/green)
- [ ] Given an idea has no scores yet, when displayed, then a "Not Scored" indicator is shown with option to request scoring
- [ ] Given I view the dashboard, when sorting, then I can sort ideas by overall score (high to low, low to high)

**Priority:** P0 | **Complexity:** Low

---

#### US-SCORE-02: Understand Score Reasoning

**As a** solo founder
**I want** to see AI-generated strengths and risks
**So that** I understand why an idea scored how it did and can make informed decisions

**Acceptance Criteria:**
- [ ] Given I view an idea's detail, when I expand the "Strengths" section, then I see a bulleted list of AI-identified advantages
- [ ] Given I view an idea's detail, when I expand the "Risks" section, then I see a bulleted list of AI-identified challenges and concerns
- [ ] Given strengths/risks are displayed, when I read them, then each point is specific and actionable (not generic platitudes)
- [ ] Given an idea has been scored, when I view details, then I can see the business plan summary (monetization, go-to-market, target market, competitive advantage)
- [ ] Given an idea exists, when I view the elevator pitch, then a concise 1-2 sentence pitch is displayed
- [ ] Given trade-off flags apply (High Risk/High Reward, Hidden Gem, Quick Win, Moonshot), when viewing scores, then the appropriate flag badge is shown

**Priority:** P0 | **Complexity:** Medium

> **Priority Restored (April 8, 2026)**: AI-generated reasoning is now MVP-critical. Restored to P0.

---

#### US-SCORE-03: Re-Score Ideas

**As a** solo founder
**I want** to refresh an idea's score
**So that** I can see if market conditions have changed since initial evaluation

**Acceptance Criteria:**
- [ ] Given I am viewing an idea's detail, when I click "Re-Score", then a new AI evaluation is triggered
- [ ] Given re-scoring is in progress, when waiting, then a loading state is shown on the score section
- [ ] Given re-scoring completes, when new scores arrive, then all scores, strengths, and risks are updated
- [ ] Given re-scoring completes, when updated, then `updatedAt` timestamp reflects the refresh time
- [ ] Given I re-score an idea, when complete, then I can compare old vs. new scores (score delta shown)
- [ ] Given re-scoring fails, when an error occurs, then previous scores are preserved and error message is shown

**Priority:** P2 | **Complexity:** Medium

> **Priority Change**: Moved from P1 to P2. Re-scoring requires AI refresh functionality (v2.0).

---

### 1.3 Tracking Flow

#### US-TRACK-01: Add Notes to Ideas

**As a** solo founder
**I want** to add notes to an idea
**So that** I can capture research, thoughts, and learnings over time

**Acceptance Criteria:**
- [ ] Given I am viewing an idea's detail, when I scroll to the Notes section, then I see existing notes (if any) and an "Add Note" button
- [ ] Given I click "Add Note", when the input appears, then I can type freeform text
- [ ] Given I save a note, when saved, then it appears in the notes list with a timestamp
- [ ] Given I have multiple notes, when viewing, then notes are displayed in reverse chronological order (newest first)
- [ ] Given I want to edit a note, when I click edit, then I can modify and save the updated content
- [ ] Given I want to delete a note, when I click delete, then a confirmation is shown before permanent removal
- [ ] Given notes exist, when viewing the idea card, then a note count indicator is visible

**Priority:** P0 | **Complexity:** Low

---

#### US-TRACK-02: Change Idea Status

**As a** solo founder
**I want** to move ideas through statuses (New → Reviewing → Pursuing → Parked)
**So that** I can organize my pipeline and focus on what matters

**Acceptance Criteria:**
- [ ] Given I view an idea, when I click the status badge, then a dropdown shows available statuses: New, Reviewing, Pursuing, Parked
- [ ] Given I select a new status, when I confirm, then the idea's status updates immediately
- [ ] Given I change a status, when updated, then `updatedAt` timestamp is refreshed
- [ ] Given I am on the dashboard, when I click status tabs, then I can filter ideas by status (All / New / Reviewing / Pursuing / Parked)
- [ ] Given an idea is marked "Pursuing", when displayed, then it is visually distinguished (e.g., highlighted border or badge)
- [ ] Given I mark an idea "Parked", when viewing later, then it remains accessible but deprioritized in default sorting

**Priority:** P0 | **Complexity:** Low

*Related: US-DETAIL-03 (Quick Status Change from Detail View)*

---

#### US-TRACK-03: View Idea History

**As a** solo founder
**I want** to see when an idea was created and last updated
**So that** I can track freshness and know which ideas need attention

**Acceptance Criteria:**
- [ ] Given I view an idea card, when displayed, then I can see the creation date (e.g., "Added 3 days ago")
- [ ] Given I view an idea's detail, when displayed, then I see both `createdAt` and `updatedAt` timestamps in human-readable format
- [ ] Given an idea was recently updated, when viewing the card, then a "Recently Updated" indicator may be shown
- [ ] Given I am on the dashboard, when sorting, then I can sort by "Date Added" (newest/oldest first)
- [ ] Given an idea has not been updated in 30+ days, when displayed, then a staleness indicator is shown (e.g., "Needs Review")
- [ ] Given I filter by staleness, when applied, then I see only ideas that haven't been touched recently

**Priority:** P1 | **Complexity:** Low

---

## 2. Idea Management

*Source: `user-stories-management.md` | Author: Noah-Volkov*

Stories for managing, browsing, filtering, comparing, and performing bulk actions on ideas.

### 2.1 Browsing & Discovery

#### US-BROWSE-01: Grid View of Ideas

**As a** solo founder
**I want** to see all my ideas in a grid/card layout
**So that** I can scan my portfolio quickly and get an overview of all opportunities

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when I load the page, then I see ideas displayed in a 4-column grid (desktop) or 1-column grid (mobile)
- [ ] Given I have ideas in my portfolio, when I view the grid, then each card shows: company name, overall score (1.0-5.0), brief description, status badge, and category tag
- [ ] Given an idea has a HOT score (4.0-5.0), when I view the card, then it displays a visual indicator (e.g., fire icon or highlight)
- [ ] Given the grid is loaded, when I scroll down, then additional ideas load seamlessly (infinite scroll or pagination)
- [ ] Given I have no ideas, when I view the grid, then I see an empty state prompting me to generate or add my first idea

**Priority:** P0 | **Complexity:** Medium

---

#### US-BROWSE-02: Filter by Status

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

**Priority:** P0 | **Complexity:** Low

---

#### US-BROWSE-03: Sort Ideas

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

**Priority:** P0 | **Complexity:** Low

---

#### US-BROWSE-04: Search Ideas

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

**Priority:** P1 | **Complexity:** Medium

---

### 2.2 Filtering & Organization

#### US-FILTER-01: Filter by Category

**As a** solo founder
**I want** to filter ideas by category (Games, Tools, SaaS, etc.)
**So that** I can focus on specific types of business opportunities

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when I open filter controls, then I see a category dropdown with options: All Categories, Games, Tools, SaaS, Platforms, Mobile Apps, Content, Services, Hardware, Other
- [ ] Given I select "Games" category, when filter applies, then I only see ideas where category="Games"
- [ ] Given I select "All Categories", when filter applies, then category filter is cleared
- [ ] Given I apply a category filter with other filters, when combined, then all filters work together (AND logic)
- [ ] Given a category has zero ideas, when I view the dropdown, then that category still appears but shows (0) count

**Priority:** P1 | **Complexity:** Low

---

#### US-FILTER-02: Filter by Score Range

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

**Priority:** P1 | **Complexity:** Low

---

#### US-FILTER-03: Filter by Tags

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

**Priority:** P2 | **Complexity:** Medium

---

### 2.3 Comparison & Analysis

#### US-COMPARE-01: Compare Two Ideas

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

**Priority:** P1 | **Complexity:** High

---

#### US-COMPARE-02: Score Breakdown Comparison

**As a** solo founder
**I want** to see score breakdowns compared visually
**So that** I can understand the specific trade-offs between ideas

**Acceptance Criteria:**
- [ ] Given I am in comparison view with 2 ideas, when I view scores, then I see a visual comparison (bar chart or radar chart) of all score parameters
- [ ] Given the visual comparison displays, when I view it, then each parameter shows: Business Potential, Development Complexity, Time to Market, Competition Level, Risk Level
- [ ] Given two ideas have different scores, when I view the chart, then the difference is clearly visible (color-coded, with actual numbers)
- [ ] Given an idea scores higher in a parameter, when displayed, then that idea's bar/segment is visually emphasized (e.g., green highlight)
- [ ] Given I hover/tap on a score parameter, when interacting, then I see a tooltip explaining what that parameter measures

**Priority:** P2 | **Complexity:** Medium

---

#### US-COMPARE-03: Quick Compare from Grid

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

**Priority:** P2 | **Complexity:** Medium

---

### 2.4 Bulk Actions

#### US-BULK-01: Bulk Status Change

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

**Priority:** P2 | **Complexity:** Medium

---

#### US-BULK-02: Bulk Delete/Archive

**As a** solo founder
**I want** to archive or delete multiple ideas at once
**So that** I can clean up my portfolio and remove ideas I've evaluated and dismissed

**Acceptance Criteria:**
- [ ] Given I have multiple ideas selected, when I view bulk actions, then I see "Archive Selected" and "Delete Selected" options
- [ ] Given I click "Archive Selected", when I confirm, then selected ideas move to status="parked" (soft archive)
- [ ] Given I click "Delete Selected", when I click, then I see a confirmation dialog: "Permanently delete X ideas? This cannot be undone."
- [ ] Given I confirm deletion, when the operation completes, then selected ideas are permanently removed from Firestore and grid updates
- [ ] Given I cancel the deletion confirmation, when the dialog closes, then no ideas are deleted and selection is preserved
- [ ] Given I delete ideas in bulk, when the operation completes, then I see a success toast: "Deleted 3 ideas"
- [ ] Given I archive ideas in bulk, when the operation completes, then I see a success toast: "Archived 5 ideas"

**Priority:** P2 | **Complexity:** Medium

---

## 3. Detail View & Mobile UX

*Source: `user-stories-ux.md` | Author: Yonatan Weiss*

Stories for the detail view experience and mobile UX patterns.

### 3.1 Detail View

#### US-DETAIL-01: View Idea Details

**As a** solo founder
**I want** to open an idea's detail panel from the grid
**So that** I can see the full brief, all scores, and tags without leaving the dashboard

**Acceptance Criteria:**
- [ ] Given I am on the dashboard grid, when I click an idea card, then a detail panel opens
- [ ] Given the detail panel opens on desktop, when displayed, then it appears as a slide-over panel from the right (not a modal)
- [ ] Given the detail panel is open, when I view it, then I see the full brief (not truncated)
- [ ] Given the detail panel is open, when I view it, then I see all score breakdowns: Market Potential, Technical Feasibility, Uniqueness, Risk Level, Time to Market
- [ ] Given the detail panel is open, when I view it, then I see all tags associated with the idea
- [ ] Given the detail panel is open, when I click outside the panel or press Escape, then the panel closes
- [ ] Given the detail panel is open, when I view the URL, then it reflects the selected idea (deep-linkable)

**Priority:** P0 | **Complexity:** Medium

---

#### US-DETAIL-02: Expandable Sections

**As a** solo founder
**I want** accordion sections for Strengths, Risks, Business Plan, Pitch, and Notes
**So that** I can focus on specific information without visual overload

**Acceptance Criteria:**
- [ ] Given the detail panel is open, when displayed, then I see collapsible sections: Strengths, Risks, Business Plan, Pitch, Notes
- [ ] Given a section is collapsed, when I click its header, then it expands to show content
- [ ] Given a section is expanded, when I click its header, then it collapses to hide content
- [ ] Given multiple sections, when I expand one, then other sections remain in their current state (independent toggle)
- [ ] Given I expand a section, when I close and reopen the detail panel, then sections remember their last state (per session)
- [ ] Given a section has no content (e.g., no notes yet), when displayed, then an empty state message is shown with appropriate CTA
- [ ] Given I am on mobile, when sections expand, then the view scrolls to show the expanded content

**Priority:** P0 | **Complexity:** Low

---

#### US-DETAIL-03: Quick Status Change

**As a** solo founder
**I want** to change an idea's status directly from the detail view
**So that** I can update status without returning to the grid

**Acceptance Criteria:**
- [ ] Given the detail panel is open, when I view it, then I see a status dropdown prominently displayed
- [ ] Given I click the status dropdown, when options appear, then I see: New, Reviewing, Pursuing, Parked
- [ ] Given I select a new status, when I confirm, then the status updates immediately (optimistic UI)
- [ ] Given I change status, when updated, then the grid card reflects the new status without page refresh
- [ ] Given I change status, when updated, then a subtle confirmation toast appears
- [ ] Given I change status to "Pursuing", when updated, then the card in the grid shows visual distinction (highlight)
- [ ] Given the status update fails, when an error occurs, then the UI reverts and shows an error message

**Priority:** P0 | **Complexity:** Low

*Related: US-TRACK-02 (Change Idea Status - general workflow)*

---

#### US-DETAIL-04: Keyboard Navigation

**As a** solo founder
**I want** to navigate ideas using keyboard shortcuts on desktop
**So that** I can review my portfolio quickly without using the mouse

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when I press `j`, then the next idea in the grid is selected/highlighted
- [ ] Given I am on the dashboard, when I press `k`, then the previous idea in the grid is selected/highlighted
- [ ] Given an idea is selected, when I press `Enter` or `o`, then the detail panel opens for that idea
- [ ] Given the detail panel is open, when I press `j`, then the panel shows the next idea
- [ ] Given the detail panel is open, when I press `k`, then the panel shows the previous idea
- [ ] Given the detail panel is open, when I press `e`, then edit mode is activated (if applicable)
- [ ] Given edit mode is active, when I press `Cmd/Ctrl + s`, then changes are saved
- [ ] Given I press `Escape`, when the detail panel is open, then the panel closes
- [ ] Given keyboard navigation is available, when I press `?`, then a keyboard shortcuts help overlay appears
- [ ] Given I am typing in an input field, when I press navigation keys, then keyboard shortcuts are disabled (no interference)

**Priority:** P1 | **Complexity:** Medium

---

### 3.2 Mobile Experience

#### US-MOBILE-01: Single Column Grid

**As a** solo founder on mobile
**I want** idea cards to stack in a single column
**So that** cards are readable and tappable on a small screen

**Acceptance Criteria:**
- [ ] Given I am on mobile (< 768px width), when I view the dashboard, then cards display in a single column
- [ ] Given cards are in single column, when displayed, then each card takes full width with appropriate padding
- [ ] Given I scroll the grid, when scrolling, then the experience is smooth with momentum scrolling
- [ ] Given I view a card on mobile, when displayed, then all essential info remains visible: name, score, brief (truncated), status
- [ ] Given the card has a long title, when displayed, then the title truncates with ellipsis rather than wrapping excessively
- [ ] Given I tap a card, when tapped, then the tap target is at least 44x44 points (accessibility)

**Priority:** P0 | **Complexity:** Low

---

#### US-MOBILE-02: Full-Screen Detail View

**As a** solo founder on mobile
**I want** idea details to open as a full-screen view
**So that** I can focus on one idea without the grid distracting me

**Acceptance Criteria:**
- [ ] Given I am on mobile, when I tap an idea card, then a full-screen detail view opens (not slide-over)
- [ ] Given the full-screen view opens, when displayed, then it covers the entire viewport
- [ ] Given the full-screen view is open, when I view it, then a back button/arrow is visible in the header
- [ ] Given I tap the back button, when tapped, then I return to the grid at my previous scroll position
- [ ] Given the full-screen view is open, when I swipe from the left edge, then I can navigate back (iOS gesture)
- [ ] Given the detail view is scrollable, when content exceeds viewport, then I can scroll within the detail view
- [ ] Given I open the detail view, when the URL updates, then I can share/bookmark the direct link to this idea

**Priority:** P0 | **Complexity:** Medium

---

#### US-MOBILE-03: Swipe Gestures

**As a** solo founder on mobile
**I want** to swipe between ideas in the detail view
**So that** I can review multiple ideas quickly without going back to the grid

**Acceptance Criteria:**
- [ ] Given I am in full-screen detail view on mobile, when I swipe left, then the next idea's detail view appears
- [ ] Given I am in full-screen detail view on mobile, when I swipe right, then the previous idea's detail view appears
- [ ] Given I swipe between ideas, when transitioning, then a smooth slide animation occurs
- [ ] Given I am on the first idea, when I swipe right, then a resistance/bounce indicates no previous idea
- [ ] Given I am on the last idea, when I swipe left, then a resistance/bounce indicates no next idea
- [ ] Given I am mid-swipe, when I release before 50% threshold, then the view snaps back to current idea
- [ ] Given swipe navigation is available, when viewing details, then a subtle indicator shows current position (e.g., "3 of 12")

**Priority:** P1 | **Complexity:** Medium

---

#### US-MOBILE-04: Bottom Sheet Filters

**As a** solo founder on mobile
**I want** filters to open as a bottom sheet
**So that** I can easily access and apply filters with one hand

**Acceptance Criteria:**
- [ ] Given I am on mobile, when I tap the filter button, then a bottom sheet slides up from the bottom
- [ ] Given the bottom sheet opens, when displayed, then it covers approximately 60% of the screen height
- [ ] Given the bottom sheet is open, when I drag down, then I can dismiss it
- [ ] Given the bottom sheet is open, when displayed, then I see filter options: Status, Category, Score Range, Tags
- [ ] Given I select filter options, when applied, then the grid updates to show filtered results
- [ ] Given I have active filters, when viewing the filter button, then a badge indicates active filter count
- [ ] Given the bottom sheet is open, when I tap "Clear All", then all filters reset
- [ ] Given the bottom sheet is open, when I tap "Apply" or outside the sheet, then the sheet closes
- [ ] Given the bottom sheet is open, when I tap the dimmed background, then the sheet closes

**Priority:** P1 | **Complexity:** Medium

---

#### US-MOBILE-05: Long-Press Selection

**As a** solo founder on mobile
**I want** to long-press cards to enter selection mode
**So that** I can perform bulk actions on multiple ideas

**Acceptance Criteria:**
- [ ] Given I am on the mobile grid, when I long-press a card (500ms+), then selection mode activates
- [ ] Given selection mode is active, when I long-pressed a card, then that card is selected (checkbox visible)
- [ ] Given selection mode is active, when I tap additional cards, then they toggle selection
- [ ] Given selection mode is active, when displayed, then a toolbar appears showing: selected count, bulk actions (Archive, Change Status, Delete)
- [ ] Given selection mode is active, when I tap "Select All", then all visible cards are selected
- [ ] Given selection mode is active, when I tap outside cards or press "Cancel", then selection mode exits
- [ ] Given I have cards selected, when I tap a bulk action, then a confirmation dialog appears for destructive actions
- [ ] Given selection mode is active, when I scroll, then selection persists across scroll
- [ ] Given I perform a bulk action, when complete, then selection mode exits and a confirmation toast appears

**Priority:** P1 | **Complexity:** Medium

---

### 3.3 Responsive Behavior

#### US-RESPONSIVE-01: Breakpoint Handling

**As a** solo founder
**I want** the dashboard to gracefully transition between desktop, tablet, and mobile layouts
**So that** I have an optimal experience on any device

**Acceptance Criteria:**
- [ ] Given the viewport is >= 1024px (desktop), when displayed, then the grid shows 4 columns and detail opens as slide-over
- [ ] Given the viewport is 768px - 1023px (tablet), when displayed, then the grid shows 2 columns and detail opens as slide-over
- [ ] Given the viewport is < 768px (mobile), when displayed, then the grid shows 1 column and detail opens full-screen
- [ ] Given I resize the browser window, when crossing a breakpoint, then the layout transitions smoothly (no jarring jumps)
- [ ] Given I am on tablet in landscape, when I rotate to portrait, then the layout adjusts appropriately
- [ ] Given the detail panel is open on desktop, when I resize below 768px, then the panel converts to full-screen view
- [ ] Given I am on a touch device at tablet size, when interacting, then touch targets are at least 44x44 points
- [ ] Given any breakpoint, when displayed, then no horizontal scrolling occurs (content fits viewport)
- [ ] Given I am on desktop, when displayed, then keyboard navigation is available
- [ ] Given I am on mobile/tablet touch device, when displayed, then swipe gestures are available

**Priority:** P0 | **Complexity:** Medium

---

## 4. Error Handling & Edge Cases

*Source: `user-stories-edge-cases.md` | Author: Noah-Volkov*

Stories for error states, edge cases, empty states, and data handling.

### 4.1 Error Handling

#### US-ERROR-01: AI Generation Failure

**As a** solo founder
**I want** clear feedback when AI idea generation fails
**So that** I understand what went wrong and can take action to resolve it

**Acceptance Criteria:**
- [ ] Given I trigger idea generation, when Gemini/Grok API returns an error, then I see a user-friendly error message (not raw API error)
- [ ] Given API failure occurs, when error displays, then message indicates: "Unable to generate ideas right now. Please try again."
- [ ] Given API failure occurs, when I view the error, then I see a "Retry" button to attempt generation again
- [ ] Given API rate limit is exceeded, when error displays, then message indicates: "Generation limit reached. Please wait a few minutes."
- [ ] Given API is down for extended period, when error persists, then I see: "Our AI service is temporarily unavailable. Your existing ideas are safe."
- [ ] Given generation fails, when I retry successfully, then the error state clears and new ideas appear normally
- [ ] Given generation fails multiple times, when I've retried 3x, then I see option to "Contact Support" or "Try Later"

**Priority:** P0 | **Complexity:** Medium

> **Priority Restored (April 8, 2026)**: AI generation is MVP-critical, so AI error handling is also P0.

---

#### US-ERROR-02: Network Connectivity Issues

**As a** solo founder
**I want** the app to handle network issues gracefully
**So that** I don't lose work and understand when I'm offline

**Acceptance Criteria:**
- [ ] Given I lose internet connection, when the app detects offline state, then I see a non-intrusive banner: "You're offline. Changes will sync when reconnected."
- [ ] Given I'm offline, when I try to generate ideas, then the action is blocked with message: "Idea generation requires internet connection"
- [ ] Given I'm offline, when I browse existing ideas, then I can still view cached/previously loaded ideas (read-only)
- [ ] Given I'm offline, when I try to edit an idea, then changes are queued locally (Firestore offline persistence)
- [ ] Given I reconnect to internet, when connection restores, then queued changes sync automatically to Firestore
- [ ] Given I reconnect, when sync completes, then the offline banner disappears and I see brief "Synced" confirmation
- [ ] Given sync fails after reconnection, when conflict occurs, then I see specific error and option to retry sync

**Priority:** P0 | **Complexity:** High

---

#### US-ERROR-03: Data Validation Errors

**As a** solo founder
**I want** clear error messages when I enter invalid data
**So that** I can fix my input and complete my action

**Acceptance Criteria:**
- [ ] Given I submit a form with empty required field, when validation runs, then I see inline error: "[Field name] is required"
- [ ] Given I enter text exceeding max length, when I type, then I see character counter turning red and input is blocked at limit
- [ ] Given I enter invalid characters in a field, when validation runs, then I see inline error explaining valid format
- [ ] Given I submit invalid data, when error displays, then the invalid field is highlighted (red border) and focused
- [ ] Given multiple fields are invalid, when validation runs, then all errors display simultaneously (not one at a time)
- [ ] Given I fix an invalid field, when I correct the input, then the error message clears immediately (real-time validation)
- [ ] Given I'm adding a tag, when tag already exists on idea, then I see: "This tag is already added"

**Priority:** P1 | **Complexity:** Low

---

### 4.2 Empty States

#### US-EMPTY-01: No Ideas Yet (First-Time User)

**As a** solo founder visiting for the first time
**I want** a welcoming empty state with clear next steps
**So that** I understand how to get started with the platform

**Acceptance Criteria:**
- [ ] Given I have zero ideas in my portfolio, when I view the dashboard, then I see an illustrated empty state (not just blank space)
- [ ] Given empty state displays, when I read it, then I see: headline "Your idea portfolio is empty", subtext explaining the value proposition
- [ ] Given empty state displays, when I view actions, then I see prominent CTA: "Generate Your First Idea" button
- [ ] Given empty state displays, when I view secondary action, then I see: "Or add an idea manually" link
- [ ] Given I click "Generate Your First Idea", when clicked, then the AI generation flow initiates
- [ ] Given I add my first idea, when it saves, then empty state is replaced with the idea grid showing my first card
- [ ] Given I'm a returning user with ideas, when I view dashboard, then I never see the first-time empty state

**Priority:** P0 | **Complexity:** Low

---

#### US-EMPTY-02: No Matching Results (Filter/Search)

**As a** solo founder
**I want** helpful feedback when my filter or search returns nothing
**So that** I can adjust my criteria or understand my portfolio better

**Acceptance Criteria:**
- [ ] Given I apply filters that match no ideas, when results display, then I see: "No ideas match your filters"
- [ ] Given no filter results, when I view the empty state, then I see which filters are active (e.g., "Status: Pursuing, Category: Games")
- [ ] Given no filter results, when I view actions, then I see: "Clear filters" button to reset
- [ ] Given I search for a term with no matches, when results display, then I see: "No ideas found for '[search term]'"
- [ ] Given no search results, when I view suggestions, then I see: "Try a different search term or check your spelling"
- [ ] Given no results from combined filter + search, when I view actions, then I can clear search OR clear filters independently
- [ ] Given no matching results, when I view the state, then I do NOT see "Generate new idea" (that's confusing in filter context)

**Priority:** P1 | **Complexity:** Low

---

#### US-EMPTY-03: No Notes on Idea

**As a** solo founder
**I want** a prompt when viewing an idea with no notes
**So that** I'm encouraged to document my thoughts and progress

**Acceptance Criteria:**
- [ ] Given I open idea detail with no notes, when notes section displays, then I see: "No notes yet"
- [ ] Given notes section is empty, when I view it, then I see helpful prompt: "Add notes to track your thoughts, research, and progress on this idea"
- [ ] Given notes section is empty, when I view actions, then I see prominent "Add First Note" button or input field ready for typing
- [ ] Given I add my first note, when it saves, then the empty state is replaced with the note displayed
- [ ] Given I delete all notes from an idea, when notes section displays, then empty state returns

**Priority:** P2 | **Complexity:** Low

---

### 4.3 Data Management

#### US-DATA-01: Delete Idea Confirmation

**As a** solo founder
**I want** confirmation before permanently deleting an idea
**So that** I don't accidentally lose valuable work

**Acceptance Criteria:**
- [ ] Given I click delete on an idea, when action triggers, then a confirmation modal appears (not immediate deletion)
- [ ] Given confirmation modal displays, when I read it, then I see: "Delete [Idea Name]?" with warning "This action cannot be undone"
- [ ] Given confirmation modal displays, when I view the idea preview, then I see the idea name and brief to confirm I'm deleting the right one
- [ ] Given confirmation modal displays, when I view buttons, then I see: "Cancel" (secondary) and "Delete" (destructive/red)
- [ ] Given I click "Cancel", when modal closes, then the idea remains unchanged
- [ ] Given I click "Delete", when deletion completes, then idea is removed from Firestore and grid updates
- [ ] Given deletion completes, when I return to dashboard, then I see toast: "Idea deleted" with NO undo option (permanent delete per spec)
- [ ] Given deletion fails (network error), when error occurs, then modal shows error and idea is NOT deleted

**Priority:** P0 | **Complexity:** Low

---

#### US-DATA-02: Data Persistence

**As a** solo founder
**I want** confidence that my data is reliably saved
**So that** I don't lose ideas, notes, or changes I've made

**Acceptance Criteria:**
- [ ] Given I make any change (status, notes, edits), when I save, then data persists to Firestore immediately
- [ ] Given I save data, when operation completes, then I see brief visual confirmation (checkmark, "Saved" text, or subtle animation)
- [ ] Given I close browser after saving, when I return later, then all my data is intact and current
- [ ] Given I make rapid changes, when saving, then each change is captured (no race conditions losing data)
- [ ] Given Firestore write fails, when error occurs, then I see error message and change is NOT lost (stays in local state for retry)
- [ ] Given I'm editing a note, when I navigate away without saving, then I see: "You have unsaved changes. Discard?" prompt
- [ ] Given auto-save is implemented, when I stop typing for 2 seconds, then changes save automatically with subtle indicator

**Priority:** P0 | **Complexity:** Medium

---

#### US-DATA-03: Loading States

**As a** solo founder
**I want** clear loading indicators when content is being fetched
**So that** I know the app is working and not frozen

**Acceptance Criteria:**
- [ ] Given I load the dashboard, when ideas are fetching, then I see skeleton cards (not blank space or spinner)
- [ ] Given skeleton loaders display, when they appear, then they match the layout of real cards (same size, spacing)
- [ ] Given I open idea detail, when content loads, then I see skeleton loader for the detail panel
- [ ] Given I trigger AI generation, when processing, then I see: animated spinner + "Generating ideas..." message
- [ ] Given AI generation takes >5 seconds, when waiting, then I see progress update: "This may take a moment..."
- [ ] Given any loading state, when content loads, then skeleton/spinner smoothly transitions to real content (no jarring flash)
- [ ] Given loading fails, when timeout occurs (>30s), then loading state is replaced with error state (see US-ERROR-01/02)

**Priority:** P1 | **Complexity:** Medium

---

### 4.4 Limits & Constraints

#### US-LIMIT-01: Maximum Ideas

**As a** solo founder
**I want** to understand any limits on my idea portfolio
**So that** I can manage my portfolio size appropriately

**Acceptance Criteria:**
- [ ] Given this is a personal tool, when using the app, then there is NO hard limit on number of ideas (reasonable use assumed)
- [ ] Given I have 100+ ideas, when performance is measured, then dashboard still loads in <2 seconds (pagination/virtualization if needed)
- [ ] Given I have many ideas, when viewing dashboard, then I see total count displayed: "47 ideas" in header or filter area
- [ ] Given performance degrades with scale, when >500 ideas exist, then the app recommends archiving old ideas (soft warning, not blocking)
- [ ] Given a future paid tier exists, when limits apply, then approaching limit shows: "You have 45/50 ideas. Upgrade for unlimited."
- [ ] Given I'm at capacity (if limits exist), when I try to add, then I see: "Portfolio full. Archive or delete ideas to add more."

**Priority:** P2 | **Complexity:** Low

**Design Decision:** For MVP personal tool, no hard limits. Monitor performance at scale.

---

#### US-LIMIT-02: Text Length Limits

**As a** solo founder
**I want** reasonable text length limits with clear feedback
**So that** I can write within constraints and the UI displays content properly

**Acceptance Criteria:**
- [ ] Given I'm writing a note, when typing, then I see character counter: "234 / 2000 characters"
- [ ] Given I approach the limit (90%), when typing, then character counter turns orange as warning
- [ ] Given I reach the limit, when at max, then character counter turns red and further input is blocked
- [ ] Given idea name field, when editing, then limit is 100 characters with counter
- [ ] Given idea brief field, when editing, then limit is 500 characters with counter
- [ ] Given note content, when editing, then limit is 2000 characters per note
- [ ] Given AI generates content exceeding limits, when displayed, then content is gracefully truncated with "..." and "Show more" option
- [ ] Given long text in grid cards, when displayed, then brief is truncated to 2 lines with ellipsis (CSS truncation)
- [ ] Given I paste text exceeding limit, when pasted, then text is truncated to limit with toast: "Text truncated to fit character limit"

**Priority:** P1 | **Complexity:** Low

**Field Limits:**
| Field | Max Characters |
|-------|----------------|
| Idea Name | 100 |
| Brief | 500 |
| Note Content | 2,000 |
| Tag | 30 |
| Elevator Pitch | 1,000 |

---

## 5. Idea Generation Pipeline

*New section added April 8, 2026 | Author: Yonatan Weiss*

Stories for the AI-powered idea generation pipeline - the core value proposition of Idea Forge.

> **Priority Shift**: Generation is now the primary user flow. Users start by generating ideas, then manage them in the dashboard.

---

### 5.1 Generation Triggers

#### US-PIPELINE-01: Manual Generation Trigger

**As a** solo founder
**I want** to trigger idea generation manually with a button
**So that** I can generate new AI-powered ideas on demand

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when I click "Generate Ideas", then the generation process starts
- [ ] Given generation is running, when in progress, then I see a progress indicator with status message
- [ ] Given generation completes, when new ideas arrive, then they appear in the grid with "NEW" badge
- [ ] Given generation completes, when viewing new ideas, then each idea has scores, strengths, and risks populated
- [ ] Given generation fails, when an error occurs, then I see a user-friendly error message with "Retry" option
- [ ] Given I click "Retry", when retrying, then a new generation attempt is made

**Priority:** P0 | **Complexity:** Medium

---

#### US-PIPELINE-02: Scheduled Generation

**As a** solo founder
**I want** ideas generated automatically on a daily schedule
**So that** I wake up to fresh opportunities without manual effort

**Acceptance Criteria:**
- [ ] Given I enable auto-generation in settings, when the scheduled time arrives, then ideas are generated automatically
- [ ] Given auto-generation runs, when new ideas are created, then they are added to my portfolio with "NEW" badge
- [ ] Given I open the app after scheduled generation, when viewing dashboard, then I see notification: "X new ideas generated"
- [ ] Given I want to disable auto-generation, when I toggle it off in settings, then no scheduled runs occur
- [ ] Given I want to change schedule, when I update the time in settings, then future runs use the new schedule
- [ ] Given scheduled generation fails, when I next open the app, then I see notification about the failure

**Priority:** P0 | **Complexity:** High

---

### 5.2 Generation Configuration

#### US-PIPELINE-03: Generation Settings

**As a** solo founder
**I want** to configure generation settings
**So that** I can control what types of ideas are generated

**Acceptance Criteria:**
- [ ] Given I open settings, when I view the generation config section, then I see source toggles: X/Twitter Trends, Polymarket Signals, News/RSS
- [ ] Given I toggle a source off, when I save settings, then that source is excluded from future generations
- [ ] Given I set target idea count (e.g., 5, 10, 15), when generating, then approximately that many ideas are created
- [ ] Given I set focus areas (e.g., "AI tools", "mobile games"), when generating, then ideas are biased toward those areas
- [ ] Given I save settings, when returning later, then my preferences are persisted
- [ ] Given I want to reset settings, when I click "Reset to Defaults", then all generation settings return to defaults

**Priority:** P0 | **Complexity:** Medium

---

### 5.3 Source Tracking

#### US-PIPELINE-04: Source Indicators

**As a** solo founder
**I want** to see where each idea came from
**So that** I can understand its origin and the signal that inspired it

**Acceptance Criteria:**
- [ ] Given I view an idea card in the grid, when displayed, then I see a source badge: "Manual", "AI-Generated", or "Trend-Suggested"
- [ ] Given an AI-generated idea, when I view details, then I see which AI model created it (Gemini/Grok)
- [ ] Given a trend-suggested idea, when I view details, then I see the trend source (e.g., "Trending on X: #AIAgents")
- [ ] Given I open filter controls, when I view filter options, then I can filter by source type
- [ ] Given I filter by "AI-Generated", when filter applies, then I only see ideas with source="ai-generated"
- [ ] Given I filter by "Manual", when filter applies, then I only see ideas I created manually

**Priority:** P0 | **Complexity:** Low

---

## Summary Tables

### All P0 Stories (MVP - AI-Powered Workflow)

| ID | Title | Section | Complexity |
|----|-------|---------|------------|
| US-GEN-01 | Manual Idea Entry | 1. Lifecycle | Low |
| **US-GEN-02** | **AI-Assisted Generation** | **1. Lifecycle** | **Medium** |
| US-SCORE-01 | View Idea Scores | 1. Lifecycle | Low |
| **US-SCORE-02** | **Understand Score Reasoning** | **1. Lifecycle** | **Medium** |
| US-TRACK-01 | Add Notes to Ideas | 1. Lifecycle | Low |
| US-TRACK-02 | Change Idea Status | 1. Lifecycle | Low |
| US-BROWSE-01 | Grid View of Ideas | 2. Management | Medium |
| US-BROWSE-02 | Filter by Status | 2. Management | Low |
| US-BROWSE-03 | Sort Ideas | 2. Management | Low |
| US-DETAIL-01 | View Idea Details | 3. UX | Medium |
| US-DETAIL-02 | Expandable Sections | 3. UX | Low |
| US-DETAIL-03 | Quick Status Change | 3. UX | Low |
| US-MOBILE-01 | Single Column Grid | 3. UX | Low |
| US-MOBILE-02 | Full-Screen Detail View | 3. UX | Medium |
| US-RESPONSIVE-01 | Breakpoint Handling | 3. UX | Medium |
| **US-ERROR-01** | **AI Generation Failure** | **4. Edge Cases** | **Medium** |
| US-ERROR-02 | Network Connectivity Issues | 4. Edge Cases | High |
| US-EMPTY-01 | No Ideas Yet (First-Time User) | 4. Edge Cases | Low |
| US-DATA-01 | Delete Idea Confirmation | 4. Edge Cases | Low |
| US-DATA-02 | Data Persistence | 4. Edge Cases | Medium |
| **US-PIPELINE-01** | **Manual Generation Trigger** | **5. Pipeline** | **Medium** |
| **US-PIPELINE-02** | **Scheduled Generation** | **5. Pipeline** | **High** |
| **US-PIPELINE-03** | **Generation Settings** | **5. Pipeline** | **Medium** |
| **US-PIPELINE-04** | **Source Indicators** | **5. Pipeline** | **Low** |

**Total P0:** 24 stories (full AI-powered workflow)

---

### All P1 Stories (Should Have - v1.1+)

| ID | Title | Section | Complexity | Notes |
|----|-------|---------|------------|-------|
| US-TRACK-03 | View Idea History | 1. Lifecycle | Low | |
| US-BROWSE-04 | Search Ideas | 2. Management | Medium | |
| US-FILTER-01 | Filter by Category | 2. Management | Low | |
| US-FILTER-02 | Filter by Score Range | 2. Management | Low | |
| US-COMPARE-01 | Compare Two Ideas | 2. Management | High | |
| US-DETAIL-04 | Keyboard Navigation | 3. UX | Medium | |
| US-MOBILE-03 | Swipe Gestures | 3. UX | Medium | |
| US-MOBILE-04 | Bottom Sheet Filters | 3. UX | Medium | |
| US-MOBILE-05 | Long-Press Selection | 3. UX | Medium | |
| US-ERROR-03 | Data Validation Errors | 4. Edge Cases | Low | |
| US-EMPTY-02 | No Matching Results | 4. Edge Cases | Low | |
| US-DATA-03 | Loading States | 4. Edge Cases | Medium | |
| US-LIMIT-02 | Text Length Limits | 4. Edge Cases | Low | |

**Total P1:** 13 stories (enhancement features)

> **Note**: US-GEN-02, US-SCORE-02, and US-ERROR-01 were moved back to P0 per priority shift.

---

### All P2 Stories (Nice to Have - v1.2+)

| ID | Title | Section | Complexity | Notes |
|----|-------|---------|------------|-------|
| US-GEN-03 | Trend-Based Suggestions | 1. Lifecycle | High | *Moved from P1* (v1.2) |
| US-SCORE-03 | Re-Score Ideas | 1. Lifecycle | Medium | *Moved from P1* (v2.0) |
| US-FILTER-03 | Filter by Tags | 2. Management | Medium | |
| US-COMPARE-02 | Score Breakdown Comparison | 2. Management | Medium | |
| US-COMPARE-03 | Quick Compare from Grid | 2. Management | Medium | |
| US-BULK-01 | Bulk Status Change | 2. Management | Medium | |
| US-BULK-02 | Bulk Delete/Archive | 2. Management | Medium | |
| US-EMPTY-03 | No Notes on Idea | 4. Edge Cases | Low | |
| US-LIMIT-01 | Maximum Ideas | 4. Edge Cases | Low | |

**Total P2:** 9 stories

---

## Dependency Map

```
FOUNDATION
├── US-BROWSE-01 (Grid View) ─────────────────────┐
│   └── All filtering, sorting, and display       │
│                                                  │
├── Firebase Auth + Firestore Setup               │
│   └── All data persistence stories              │
│                                                  │
CORE FEATURES (Build in order)                    │
├── US-GEN-01 (Manual Entry)                      │
├── US-GEN-02 (AI Generation)                     │
│   └── Requires: Gemini API integration          │
│   └── Blocks: US-ERROR-01 (AI Failure)          │
├── US-SCORE-01 → US-SCORE-02 (Scoring)          │
├── US-TRACK-01 (Notes)                          │
│   └── Requires: Notes subcollection            │
├── US-TRACK-02 (Status) → US-DETAIL-03          │
│                                                  │
DASHBOARD VIEWS                                   │
├── US-BROWSE-01 (Grid) ◄─────────────────────────┘
│   ├── US-BROWSE-02 (Status Filter)
│   ├── US-BROWSE-03 (Sort)
│   ├── US-DETAIL-01 (Detail Panel)
│   │   └── US-DETAIL-02 (Accordion)
│   │   └── US-DETAIL-03 (Quick Status)
│   └── US-RESPONSIVE-01 (Breakpoints)
│
MOBILE (Implement alongside desktop)
├── US-MOBILE-01 (Single Column) ← US-RESPONSIVE-01
├── US-MOBILE-02 (Full-Screen Detail)
│   └── US-MOBILE-03 (Swipe Gestures)
├── US-MOBILE-04 (Bottom Sheet Filters)
└── US-MOBILE-05 (Long-Press) → US-BULK-01/02

ENHANCEMENT FEATURES (After core)
├── US-BROWSE-04 (Search)
├── US-FILTER-01 (Category Filter)
├── US-FILTER-02 (Score Filter)
├── US-COMPARE-01 → US-COMPARE-02
│   └── US-COMPARE-03 (Quick Compare)
└── US-GEN-03 (Trend Suggestions)
    └── Requires: Grok API integration

ERROR HANDLING (Implement alongside features)
├── US-ERROR-01 (AI Failure) ← US-GEN-02
├── US-ERROR-02 (Network) ← Firestore offline
├── US-ERROR-03 (Validation)
├── US-EMPTY-01 (First-Time)
├── US-EMPTY-02 (No Results)
├── US-DATA-01 (Delete Confirm)
├── US-DATA-02 (Persistence)
└── US-DATA-03 (Loading States)
```

---

## Cross-References

### Related Story Groups

| Theme | Stories |
|-------|---------|
| **Generation Pipeline** | US-PIPELINE-01, US-PIPELINE-02, US-PIPELINE-03, US-PIPELINE-04, US-GEN-02, US-ERROR-01 |
| **Status Management** | US-TRACK-02, US-DETAIL-03, US-BROWSE-02 |
| **AI Integration** | US-GEN-02, US-GEN-03, US-SCORE-02, US-SCORE-03, US-ERROR-01, US-PIPELINE-* |
| **Filtering** | US-BROWSE-02, US-FILTER-01, US-FILTER-02, US-FILTER-03, US-MOBILE-04, US-PIPELINE-04 |
| **Bulk Operations** | US-BULK-01, US-BULK-02, US-MOBILE-05, US-COMPARE-03 |
| **Data Safety** | US-DATA-01, US-DATA-02, US-ERROR-02 |
| **Mobile Patterns** | US-MOBILE-01 through US-MOBILE-05, US-RESPONSIVE-01 |

---

## Open Questions

1. **Undo for delete?** - Current spec says no undo. Confirm this is intentional for simplicity.
2. **Offline editing scope** - Can users edit all fields offline, or just notes?
3. **Error monitoring** - Which service for production error tracking? (Sentry recommended)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | April 8, 2026 | Wei-Bergman | Consolidated from 4 source documents |
| 1.1 | April 8, 2026 | Wei-Bergman | Priority corrections per PM decision: AI features moved to v1.1+ |
| 1.2 | April 8, 2026 | Yonatan-Weiss | **PRIORITY SHIFT**: AI generation now MVP-critical. Added Section 5 (Pipeline stories US-PIPELINE-01 to 04). Restored US-GEN-02, US-SCORE-02, US-ERROR-01 to P0. Total P0: 24, P1: 13 |

---

*This master document consolidates all user stories for Idea Forge. Individual source files are preserved for reference.*
