# User Stories: Detail View & Mobile UX

**Document**: User Stories - UX Flows
**Product**: Idea Forge
**Version**: 1.0
**Date**: April 8, 2026
**Author**: Yonatan Weiss

---

## Overview

This document defines user stories for the **detail view experience** and **mobile UX** patterns. These stories ensure a seamless experience across desktop and mobile devices, with appropriate interaction patterns for each platform.

**Target User**: Solo founder/entrepreneur accessing Idea Forge on desktop, tablet, and mobile devices.

**Reference**: `docs/ideation/concepts.md` Section 4 (UX Design)

---

## 1. Detail View

### US-DETAIL-01: View Idea Details

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

**Priority:** P0
**Complexity:** Medium

---

### US-DETAIL-02: Expandable Sections

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

**Priority:** P0
**Complexity:** Low

---

### US-DETAIL-03: Quick Status Change

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

**Priority:** P0
**Complexity:** Low

---

### US-DETAIL-04: Keyboard Navigation

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

**Priority:** P1
**Complexity:** Medium

---

## 2. Mobile Experience

### US-MOBILE-01: Single Column Grid

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

**Priority:** P0
**Complexity:** Low

---

### US-MOBILE-02: Full-Screen Detail View

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

**Priority:** P0
**Complexity:** Medium

---

### US-MOBILE-03: Swipe Gestures

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

**Priority:** P1
**Complexity:** Medium

---

### US-MOBILE-04: Bottom Sheet Filters

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

**Priority:** P1
**Complexity:** Medium

---

### US-MOBILE-05: Long-Press Selection

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

**Priority:** P1
**Complexity:** Medium

---

## 3. Responsive Behavior

### US-RESPONSIVE-01: Breakpoint Handling

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

**Priority:** P0
**Complexity:** Medium

---

## 4. UX Fundamentals

Stories that cover essential UX patterns for a polished user experience.

---

### US-UX-LOADING-01: Loading States

**As a** solo founder
**I want** to see loading indicators while data loads
**So that** I know the app is working and not frozen

**Acceptance Criteria:**
- [ ] Given the dashboard is loading, when fetching ideas from Firestore, then skeleton cards are displayed in the grid
- [ ] Given skeleton cards are shown, when displayed, then they match the card dimensions and layout
- [ ] Given a detail view is loading, when fetching idea details, then skeleton content placeholders are shown for each section
- [ ] Given an action is processing (save, delete, status change), when waiting, then the action button shows a spinner
- [ ] Given an action button shows a spinner, when processing, then the button is disabled to prevent double-clicks
- [ ] Given loading completes successfully, when data arrives, then skeletons transition smoothly to actual content
- [ ] Given loading takes > 3 seconds, when waiting, then a subtle message appears (e.g., "Still loading...")
- [ ] Given loading fails, when an error occurs, then an error state with "Retry" button appears
- [ ] Given I click "Retry", when clicked, then the loading process restarts

**Priority:** P0
**Complexity:** Medium

---

## Summary

| Story ID | Title | Priority | Complexity |
|----------|-------|----------|------------|
| **Detail View** | | | |
| US-DETAIL-01 | View Idea Details | P0 | Medium |
| US-DETAIL-02 | Expandable Sections | P0 | Low |
| US-DETAIL-03 | Quick Status Change | P0 | Low |
| US-DETAIL-04 | Keyboard Navigation | P1 | Medium |
| **Mobile Experience** | | | |
| US-MOBILE-01 | Single Column Grid | P0 | Low |
| US-MOBILE-02 | Full-Screen Detail View | P0 | Medium |
| US-MOBILE-03 | Swipe Gestures | P1 | Medium |
| US-MOBILE-04 | Bottom Sheet Filters | P1 | Medium |
| US-MOBILE-05 | Long-Press Selection | P1 | Medium |
| **Responsive** | | | |
| US-RESPONSIVE-01 | Breakpoint Handling | P0 | Medium |
| **UX Fundamentals** | | | |
| **US-UX-LOADING-01** | **Loading States** | **P0** | **Medium** |

**P0 Stories (MVP):** 7
**P1 Stories (v1.1+):** 4

---

## Breakpoint Reference

| Breakpoint | Width | Grid Columns | Detail View | Primary Input |
|------------|-------|--------------|-------------|---------------|
| Mobile | < 768px | 1 | Full-screen | Touch |
| Tablet | 768px - 1023px | 2 | Slide-over | Touch + Keyboard |
| Desktop | >= 1024px | 4 | Slide-over | Keyboard + Mouse |

---

## Dependencies

- **US-DETAIL-01** through **US-DETAIL-04** depend on core dashboard implementation
- **US-MOBILE-02** and **US-MOBILE-03** require gesture library (e.g., react-spring, framer-motion)
- **US-MOBILE-04** requires bottom sheet component
- **US-MOBILE-05** depends on bulk action API endpoints
- **US-RESPONSIVE-01** should be implemented alongside initial grid development
- **US-UX-LOADING-01** should be implemented early as it applies to all views (grid, detail, actions)

---

## Related Documents

- [User Stories: Core Lifecycle](user-stories-lifecycle.md)
- [User Stories: Management](user-stories-management.md)
- [Concept Document](../ideation/concepts.md)

---

*Document created for Product Specification phase.*
