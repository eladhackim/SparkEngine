# Idea Forge: UX & Data Architecture Research

**Track**: 4 of 4
**Author**: Worker Hannah-Davidov
**Date**: 2026-04-08
**Status**: Research Complete

---

## Executive Summary

This document outlines the UX concepts and data architecture for Idea Forge, a web-based dashboard for AI-generated idea management. The design prioritizes:
- **Scanability**: Quick assessment of many ideas at once
- **Progressive disclosure**: Details on demand, not overwhelming upfront
- **Mobile-first**: Core workflows work on phone, enhanced on desktop
- **Query efficiency**: Firebase structure optimized for common filters

---

## 1. Dashboard UX Concepts

### 1.1 Main Views

#### A. Idea List View (Default)

**Layout Description:**
```
┌─────────────────────────────────────────────────────────┐
│  [Logo] Idea Forge          [Search] [Filter] [+ New]  │
├─────────────────────────────────────────────────────────┤
│  Status Tabs: [All] [Reviewing] [Pursuing] [Parked]    │
├─────────────────────────────────────────────────────────┤
│  Sort: [Score ▼] [Date] [Name]    View: [Grid] [List]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Idea 1  │ │ Idea 2  │ │ Idea 3  │ │ Idea 4  │       │
│  │ ★ 8.5   │ │ ★ 7.2   │ │ ★ 9.1   │ │ ★ 6.8   │       │
│  │ Brief.. │ │ Brief.. │ │ Brief.. │ │ Brief.. │       │
│  │ [tag]   │ │ [tag]   │ │ [tag]   │ │ [tag]   │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Idea 5  │ │ Idea 6  │ │ Idea 7  │ │ Idea 8  │       │
│  │ ...     │ │ ...     │ │ ...     │ │ ...     │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                         │
│                    [Load More]                          │
└─────────────────────────────────────────────────────────┘
```

**Key Elements:**
- **Grid view** (default): 4 columns desktop, 2 columns tablet, 1 column mobile
- **List view** (toggle): Single column with more detail per row
- **Status tabs**: Quick filter by workflow status
- **Pagination**: Infinite scroll with "Load More" button (not auto-load for control)

#### B. Idea Detail View (Slide-over Panel)

**Layout Description:**
```
┌──────────────────────┬──────────────────────────────────┐
│  [Grid of cards      │  ┌────────────────────────────┐  │
│   dimmed/blurred]    │  │ [←] Company Name    [⋮]   │  │
│                      │  ├────────────────────────────┤  │
│                      │  │ Status: [Reviewing ▼]     │  │
│                      │  │ Overall Score: ★ 8.5/10   │  │
│                      │  ├────────────────────────────┤  │
│                      │  │ THE BRIEF                  │  │
│                      │  │ "Two-sentence description  │  │
│                      │  │  of the idea..."          │  │
│                      │  ├────────────────────────────┤  │
│                      │  │ ▶ Strengths (3)           │  │
│                      │  │ ▶ Risks (2)               │  │
│                      │  │ ▶ Business Plan           │  │
│                      │  │ ▶ Elevator Pitch          │  │
│                      │  │ ▶ Detailed Scores         │  │
│                      │  ├────────────────────────────┤  │
│                      │  │ MY NOTES                   │  │
│                      │  │ [Add note...]             │  │
│                      │  │ • Note from 3/15          │  │
│                      │  │ • Note from 3/10          │  │
│                      │  └────────────────────────────┘  │
└──────────────────────┴──────────────────────────────────┘
```

**Interaction Pattern:**
- Click card → slide-over panel from right (desktop) or full-screen (mobile)
- Swipe left/right to navigate between ideas (mobile)
- Arrow keys to navigate (desktop)
- Sections are **accordion-style** - collapsed by default, expand on click
- Deep link support: `/ideas/{ideaId}` opens directly to detail view

#### C. Filter Panel

**Desktop (Dropdown panel):**
```
┌─────────────────────────────────────┐
│ FILTERS                      [Clear]│
├─────────────────────────────────────┤
│ Score Range                         │
│ [====○========] 5.0 - 10.0         │
├─────────────────────────────────────┤
│ Date Created                        │
│ [Last 7 days ▼]                    │
├─────────────────────────────────────┤
│ Categories                          │
│ ☑ SaaS  ☑ Mobile  ☐ Hardware       │
│ ☐ Consumer  ☑ B2B  ☐ Marketplace   │
├─────────────────────────────────────┤
│ Tags                                │
│ [AI] [Fintech] [+]                 │
├─────────────────────────────────────┤
│        [Apply Filters]              │
└─────────────────────────────────────┘
```

**Mobile (Bottom sheet):**
- Same content, presented as a bottom sheet that slides up
- Sticky "Apply" button at bottom
- Swipe down to dismiss

### 1.2 Key Interactions

#### A. Status Management

**Pattern**: Quick status change via dropdown on card or detail view

```
Card hover (desktop):
┌─────────────┐
│ Idea Name   │
│ ★ 8.5      │
│ Brief...    │
│ ─────────── │
│ [Reviewing▼]│  ← Status dropdown appears on hover
└─────────────┘

Status options:
┌─────────────┐
│ ◉ Reviewing │
│ ○ Pursuing  │
│ ○ Parked    │
│ ○ Rejected  │
│ ─────────── │
│ ○ Archive   │
└─────────────┘
```

**Mobile**: Long-press card → action sheet with status options

#### B. Bulk Actions

**Selection Mode:**
- Desktop: Checkbox appears on card hover, click to select
- Mobile: Long-press to enter selection mode, tap to add/remove

**Bulk Action Bar (appears when items selected):**
```
┌─────────────────────────────────────────────────────────┐
│ 3 selected    [Set Status ▼] [Compare] [Archive] [✕]   │
└─────────────────────────────────────────────────────────┘
```

#### C. Compare View (Side-by-Side)

**Layout (Desktop only - not available on mobile):**
```
┌─────────────────────────────────────────────────────────┐
│ Compare Ideas (3)                              [Done]   │
├───────────────────┬───────────────────┬─────────────────┤
│ Idea A            │ Idea B            │ Idea C          │
│ ★ 8.5            │ ★ 7.2            │ ★ 9.1          │
├───────────────────┼───────────────────┼─────────────────┤
│ Market Score: 9   │ Market Score: 6   │ Market Score: 8 │
│ Tech Score: 8     │ Tech Score: 9     │ Tech Score: 10  │
│ Risk Score: 7     │ Risk Score: 5     │ Risk Score: 8   │
├───────────────────┼───────────────────┼─────────────────┤
│ Strengths         │ Strengths         │ Strengths       │
│ • Point 1         │ • Point 1         │ • Point 1       │
│ • Point 2         │ • Point 2         │ • Point 2       │
├───────────────────┼───────────────────┼─────────────────┤
│ [Set Pursuing]    │ [Set Parked]      │ [Set Pursuing]  │
└───────────────────┴───────────────────┴─────────────────┘
```

**Limit**: Max 3 ideas for comparison (keeps it scannable)

#### D. Search

**Behavior:**
- Search box in header, always visible
- Searches: company name, brief, tags, notes
- Results update as you type (debounced 300ms)
- Recent searches saved locally
- Search within current filter context (additive)

### 1.3 Mobile vs Desktop Strategy

| Feature | Mobile | Desktop |
|---------|--------|---------|
| Grid columns | 1 | 4 (2 on narrow) |
| Detail view | Full-screen overlay | Slide-over panel (40% width) |
| Filters | Bottom sheet | Dropdown panel |
| Compare | Not available | Side-by-side (max 3) |
| Bulk select | Long-press to enter mode | Checkbox on hover |
| Navigation | Swipe between ideas | Arrow keys |
| Status change | Action sheet | Inline dropdown |
| Note-taking | Full-screen editor | Inline textarea |

**Mobile-First Features:**
- Single-column card view
- Pull-to-refresh
- Swipe gestures for navigation
- Bottom navigation bar
- Touch-friendly tap targets (min 44px)

**Desktop-Enhanced Features:**
- Multi-column grid
- Keyboard shortcuts (j/k navigate, e edit, s status)
- Compare view
- Hover previews
- Bulk selection via checkboxes

---

## 2. Data Architecture (Firebase)

### 2.1 Firestore Collection Structure

```
/users/{userId}
  - email: string
  - displayName: string
  - photoURL: string | null
  - createdAt: timestamp
  - preferences: {
      defaultView: "grid" | "list"
      defaultSort: "score" | "date" | "name"
      theme: "light" | "dark" | "system"
    }

/users/{userId}/ideas/{ideaId}
  - companyName: string
  - brief: string (1-2 sentences)
  - status: "new" | "reviewing" | "pursuing" | "parked" | "rejected" | "archived"
  - category: string (e.g., "SaaS", "Mobile", "B2B")
  - tags: string[] (user-defined tags)

  # AI-Generated Content
  - strengths: string[] (3-5 bullet points)
  - risks: string[] (2-4 bullet points)
  - businessPlan: {
      monetization: string
      goToMarket: string
      targetMarket: string
      competitiveAdvantage: string
    }
  - elevatorPitch: string (30-second version)

  # Scores (all 1-10 scale)
  - scores: {
      overall: number
      marketPotential: number
      technicalFeasibility: number
      uniqueness: number
      riskLevel: number
      timeToMarket: number
    }

  # Metadata
  - createdAt: timestamp
  - updatedAt: timestamp
  - generatedBy: string (AI model version)

/users/{userId}/ideas/{ideaId}/notes/{noteId}
  - content: string
  - createdAt: timestamp
  - updatedAt: timestamp | null
```

### 2.2 Why This Structure?

**Ideas as subcollection of Users:**
- Natural security boundary (user owns their ideas)
- Efficient queries (all user's ideas in one path)
- Scales per-user without affecting others
- No cross-user queries needed for MVP

**Notes as subcollection of Ideas:**
- Keeps idea document size bounded
- Can query/paginate notes independently
- Easy to delete all notes with idea

**Denormalized fields in Ideas:**
- `category` as string (not reference) - fast filtering, no joins
- `tags` as array - supports Firestore array-contains queries
- `scores.overall` duplicated at top level for easy sorting

### 2.3 Query Patterns & Indexes

**Common Queries:**

```javascript
// All ideas for user, sorted by score
db.collection('users/{userId}/ideas')
  .orderBy('scores.overall', 'desc')
  .limit(20)

// Filter by status
db.collection('users/{userId}/ideas')
  .where('status', '==', 'reviewing')
  .orderBy('scores.overall', 'desc')

// Filter by score range
db.collection('users/{userId}/ideas')
  .where('scores.overall', '>=', 7)
  .where('scores.overall', '<=', 10)
  .orderBy('scores.overall', 'desc')

// Filter by category + sort
db.collection('users/{userId}/ideas')
  .where('category', '==', 'SaaS')
  .orderBy('scores.overall', 'desc')

// Filter by tag (array-contains)
db.collection('users/{userId}/ideas')
  .where('tags', 'array-contains', 'AI')
  .orderBy('scores.overall', 'desc')

// Date range (recent ideas)
db.collection('users/{userId}/ideas')
  .where('createdAt', '>=', sevenDaysAgo)
  .orderBy('createdAt', 'desc')
```

**Required Composite Indexes:**

```json
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "scores.overall", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "scores.overall", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "tags", "arrayConfig": "CONTAINS" },
        { "fieldPath": "scores.overall", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ideas",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "scores.overall", "order": "ASCENDING" },
        { "fieldPath": "scores.overall", "order": "DESCENDING" }
      ]
    }
  ]
}
```

### 2.4 Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Ideas subcollection
      match /ideas/{ideaId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;

        // Notes subcollection
        match /notes/{noteId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
  }
}
```

**Security Considerations:**
- All data is user-scoped (no public access)
- Auth required for all operations
- No cross-user data access possible
- Document-level ownership validation

### 2.5 Offline Support

**Recommended Approach:**
- Enable Firestore persistence (built-in)
- Cache last-viewed ideas locally
- Queue writes when offline, sync on reconnect
- Show offline indicator in UI
- Optimistic updates for status changes

```javascript
// Enable offline persistence
firebase.firestore().enablePersistence({ synchronizeTabs: true });
```

**Offline Limitations:**
- Search may not work fully offline (client-side only)
- New idea generation requires network (AI API call)
- Some filters may have stale data

---

## 3. Idea Card Content Structure

### 3.1 Information Hierarchy

**Tier 1: Above the Fold (Card Preview)**
Always visible on card in grid/list view:
1. Company Name (bold, 16-18px)
2. Overall Score (prominent, colored badge: green ≥8, yellow 6-7.9, red <6)
3. Brief (truncated to 2 lines, ~80 chars)
4. Status badge (color-coded pill)
5. Primary category tag

**Tier 2: Quick Glance (Detail View - Visible)**
Shown immediately when opening detail view:
1. Full brief
2. All individual scores (as bar chart or radar)
3. Status selector
4. Tags

**Tier 3: Expandable Sections (Collapsed by Default)**
User clicks to expand:
1. Strengths (bulleted list)
2. Risks (bulleted list)
3. Business Plan (subsections: monetization, GTM, target market, competitive advantage)
4. Elevator Pitch (blockquote style)
5. User Notes (chronological, with add button)

### 3.2 Visual Card Design

**Grid Card (Desktop ~250px wide):**
```
┌─────────────────────────┐
│ ┌─────┐                 │
│ │ 8.5 │ Company Name    │
│ └─────┘                 │
│                         │
│ "Brief description of   │
│ the idea in one or two  │
│ lines..."              │
│                         │
│ [SaaS] [AI]             │
│                         │
│ ┌─────────────────────┐ │
│ │    Reviewing ▼      │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**List Row (Full width):**
```
┌───────────────────────────────────────────────────────────────────┐
│ ☐ │ 8.5 │ Company Name │ Brief description truncated... │ [SaaS] │ Reviewing │ Mar 15 │
└───────────────────────────────────────────────────────────────────┘
```

### 3.3 Color Coding

**Scores:**
- 8.0-10.0: Green (#22c55e) - High potential
- 6.0-7.9: Yellow (#eab308) - Moderate
- 0-5.9: Red (#ef4444) - Low potential

**Status:**
- New: Blue (#3b82f6)
- Reviewing: Purple (#a855f7)
- Pursuing: Green (#22c55e)
- Parked: Gray (#6b7280)
- Rejected: Red (#ef4444)
- Archived: Dark gray (#374151)

---

## 4. Key UX Principles

### 4.1 Progressive Disclosure
- Show summary, reveal details on demand
- Accordion sections in detail view
- "Show more" for long lists
- Tooltips for score explanations

### 4.2 Efficiency Over Polish
- Keyboard shortcuts for power users
- Bulk actions for managing many ideas
- Quick status change without opening detail
- Remember user's last filter/sort preferences

### 4.3 Scanability
- Consistent card layout
- Color coding for instant assessment
- Score prominently displayed
- Status visible at glance

### 4.4 Forgiving Interactions
- Undo for status changes (5 second toast)
- Soft delete (archive) before hard delete
- Confirm destructive bulk actions
- Offline resilience with clear feedback

### 4.5 Mobile Gestures
- Pull to refresh
- Swipe between ideas in detail view
- Long-press for actions
- Swipe to archive (optional, with undo)

---

## 5. Recommended Tech Stack

Based on requirements (web, Firebase, responsive):

| Layer | Recommendation | Rationale |
|-------|----------------|-----------|
| Framework | Next.js 14+ (App Router) | SSR, routing, API routes |
| UI Library | Tailwind CSS + shadcn/ui | Rapid development, consistent design |
| State | React Query (TanStack) | Cache, sync, offline support |
| Firebase | v9 modular SDK | Tree-shaking, modern API |
| Auth | Firebase Auth | Already using Firebase |
| Search | Client-side filtering | MVP simplicity; Algolia later if needed |
| Mobile | Responsive web (PWA optional) | Single codebase |

---

## 6. Open Questions for Product Decision

1. **Sharing**: Will users ever share ideas with others? (Affects data model)
2. **Export**: Need to export ideas to PDF/CSV? (Affects detail view design)
3. **Idea Generation**: How does new idea generation work? (Manual prompt vs auto-suggest)
4. **Notifications**: Any alerts when ideas are auto-scored differently? (Affects backend needs)
5. **Versioning**: Keep history of AI-generated content if regenerated? (Affects storage)

---

## 7. Next Steps

1. **Validate** this architecture with full team
2. **Prototype** key interactions (detail view, filtering)
3. **Define** API contract for idea generation
4. **Set up** Firebase project with indexes and rules
5. **Build** MVP focusing on core loop: view, filter, status, notes

---

*Document complete. Ready for implementation phase.*
