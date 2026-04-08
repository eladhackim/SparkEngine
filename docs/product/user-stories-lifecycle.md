# User Stories: Core Idea Lifecycle

**Document**: User Stories - Lifecycle Flow
**Product**: Idea Forge
**Version**: 1.0
**Date**: April 8, 2026
**Author**: Yonatan Weiss

---

## Overview

This document defines user stories for the **core idea lifecycle**: Generate -> Score -> Track. These stories cover the foundational workflows that enable a solo founder to capture, evaluate, and manage business ideas.

**Target User**: Solo founder/entrepreneur who needs fast idea generation, structured evaluation, and portfolio tracking.

---

## 1. Idea Generation Flow

### US-GEN-01: Manual Idea Entry

**As a** solo founder
**I want** to manually add an idea with basic details
**So that** I can track concepts I discover elsewhere (conversations, articles, shower thoughts)

**Acceptance Criteria:**
- [ ] Given I am on the dashboard, when I click "Add Idea", then a form opens for manual entry
- [ ] Given the form is open, when I enter a company name and brief description, then I can save the idea
- [ ] Given I submit a valid idea, when the save completes, then the idea appears in my portfolio with status "New"
- [ ] Given I submit an idea, when saved, then `createdAt` and `updatedAt` timestamps are automatically set
- [ ] Given I leave required fields empty, when I try to save, then validation errors are shown

**Priority:** P0
**Complexity:** Low

---

### US-GEN-02: AI-Assisted Generation

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

**Priority:** P0
**Complexity:** Medium

---

### US-GEN-03: Trend-Based Suggestions

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

**Priority:** P1
**Complexity:** High

---

## 2. Scoring Flow

### US-SCORE-01: View Idea Scores

**As a** solo founder
**I want** to see overall and breakdown scores for each idea
**So that** I can quickly assess potential without deep-diving every time

**Acceptance Criteria:**
- [ ] Given I view an idea card, when displayed, then the overall score (1.0-5.0) is prominently visible
- [ ] Given I click on an idea, when the detail view opens, then I see breakdown scores: Market Potential, Technical Feasibility, Uniqueness, Risk Level, Time to Market
- [ ] Given I view scores, when displayed, then each score uses a 1-5 scale with visual indicators (color coding: red/yellow/green)
- [ ] Given an idea has no scores yet, when displayed, then a "Not Scored" indicator is shown with option to request scoring
- [ ] Given I view the dashboard, when sorting, then I can sort ideas by overall score (high to low, low to high)

**Priority:** P0
**Complexity:** Low

---

### US-SCORE-02: Understand Score Reasoning

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

**Priority:** P0
**Complexity:** Medium

---

### US-SCORE-03: Re-Score Ideas

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

**Priority:** P1
**Complexity:** Medium

---

## 3. Tracking Flow

### US-TRACK-01: Add Notes to Ideas

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

**Priority:** P0
**Complexity:** Low

---

### US-TRACK-02: Change Idea Status

**As a** solo founder
**I want** to move ideas through statuses (New -> Reviewing -> Pursuing -> Parked)
**So that** I can organize my pipeline and focus on what matters

**Acceptance Criteria:**
- [ ] Given I view an idea, when I click the status badge, then a dropdown shows available statuses: New, Reviewing, Pursuing, Parked
- [ ] Given I select a new status, when I confirm, then the idea's status updates immediately
- [ ] Given I change a status, when updated, then `updatedAt` timestamp is refreshed
- [ ] Given I am on the dashboard, when I click status tabs, then I can filter ideas by status (All / New / Reviewing / Pursuing / Parked)
- [ ] Given an idea is marked "Pursuing", when displayed, then it is visually distinguished (e.g., highlighted border or badge)
- [ ] Given I mark an idea "Parked", when viewing later, then it remains accessible but deprioritized in default sorting

**Priority:** P0
**Complexity:** Low

---

### US-TRACK-03: View Idea History

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

**Priority:** P1
**Complexity:** Low

---

## Summary

| Story ID | Title | Priority | Complexity |
|----------|-------|----------|------------|
| US-GEN-01 | Manual Idea Entry | P0 | Low |
| US-GEN-02 | AI-Assisted Generation | P0 | Medium |
| US-GEN-03 | Trend-Based Suggestions | P1 | High |
| US-SCORE-01 | View Idea Scores | P0 | Low |
| US-SCORE-02 | Understand Score Reasoning | P0 | Medium |
| US-SCORE-03 | Re-Score Ideas | P1 | Medium |
| US-TRACK-01 | Add Notes to Ideas | P0 | Low |
| US-TRACK-02 | Change Idea Status | P0 | Low |
| US-TRACK-03 | View Idea History | P1 | Low |

**P0 Stories (MVP):** 6
**P1 Stories (v1.1+):** 3

---

## Dependencies

- **US-GEN-02** and **US-GEN-03** require AI service integration (Gemini for MVP, Grok for trends)
- **US-SCORE-01** through **US-SCORE-03** depend on scoring system implementation
- **US-TRACK-01** depends on Notes subcollection in Firestore
- All stories depend on Firebase Authentication and Firestore setup

---

*Document created for Product Specification phase.*
