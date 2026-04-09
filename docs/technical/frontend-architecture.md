# Idea Forge: Frontend Architecture Specification

**Version**: 2.1
**Author**: Michal Xu (Tech Specs Worker)
**Date**: April 9, 2026
**Status**: Complete
**Updated**: Source-specific generation buttons added

---

## 1. Executive Summary

This document specifies the frontend architecture for Idea Forge, an AI-powered idea management platform for solo entrepreneurs. The architecture is designed for:

- **Scalability**: Support 10,000+ ideas with smooth performance
- **Responsiveness**: Desktop (4-col), tablet (2-col), mobile (1-col) layouts
- **Developer Experience**: Clean separation of concerns, typed throughout
- **Performance**: <3s initial load, <500ms dashboard render, <200ms interactions

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14+ (App Router) | Server components, routing, SSR |
| Styling | Tailwind CSS + shadcn/ui | Utility-first CSS, component library |
| State | TanStack Query v5 | Server state, caching, mutations |
| Backend | Firebase v9 (modular) | Auth, Firestore, Hosting |
| Language | TypeScript (strict) | Type safety |

### Key Architectural Decisions

1. **App Router** over Pages Router for modern React patterns and server components
2. **TanStack Query** for server state (not Redux/Zustand) - ideas are server-owned data
3. **Optimistic updates** for status changes and notes - immediate UI feedback
4. **Slide-over pattern** for detail view - maintains grid context on desktop
5. **URL-driven state** for filters/sorts - shareable, bookmarkable views
6. **Polling pattern** for generation status - real-time progress during AI generation
7. **Pipeline-first UI** - prominent "Generate Ideas" as primary action

---

## 2. App Directory Structure

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx                 # Login page with Firebase Auth
│   ├── signup/
│   │   └── page.tsx                 # Registration page
│   └── layout.tsx                   # Auth layout (centered, no nav)
│
├── (dashboard)/
│   ├── page.tsx                     # Main dashboard (ideas grid)
│   ├── ideas/
│   │   └── [id]/
│   │       └── page.tsx             # Idea detail (parallel route target)
│   ├── compare/
│   │   └── page.tsx                 # Compare view (desktop only)
│   ├── @detail/
│   │   ├── default.tsx              # Empty slot when no idea selected
│   │   └── [id]/
│   │       └── page.tsx             # Detail slide-over (parallel route)
│   └── layout.tsx                   # Dashboard layout (header, nav)
│
├── api/
│   └── [...route]/
│       └── route.ts                 # API routes (if needed for server actions)
│
├── layout.tsx                       # Root layout (providers, fonts)
├── loading.tsx                      # Global loading state
├── error.tsx                        # Global error boundary
├── not-found.tsx                    # 404 page
└── globals.css                      # Global styles + Tailwind imports

components/
├── ui/                              # shadcn/ui components (auto-generated)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── sheet.tsx                    # For slide-over panel
│   ├── skeleton.tsx
│   ├── tabs.tsx
│   ├── toast.tsx
│   └── accordion.tsx
│
├── ideas/                           # Idea-specific components
│   ├── idea-card.tsx                # Grid card component
│   ├── idea-grid.tsx                # Grid container
│   ├── idea-list-item.tsx           # List view row
│   ├── idea-detail.tsx              # Detail panel content
│   ├── idea-form.tsx                # Create/edit form
│   ├── idea-skeleton.tsx            # Loading skeleton
│   ├── score-badge.tsx              # Score display badge
│   ├── score-breakdown.tsx          # Score parameters display
│   ├── status-badge.tsx             # Status pill
│   ├── status-dropdown.tsx          # Status change dropdown
│   ├── accordion-sections.tsx       # Strengths/Risks/etc accordions
│   ├── source-badge.tsx             # Source indicator (AI/Manual/Trend)
│   ├── new-badge.tsx                # "NEW" badge for recent ideas
│   └── ai-reasoning-section.tsx     # AI-generated strengths/risks/pitch
│
├── generation/                      # AI Generation components
│   ├── generate-button-group.tsx    # Button group with source dropdown
│   ├── generation-progress.tsx      # Progress indicator during generation
│   ├── generation-settings.tsx      # Settings panel/modal
│   ├── generation-history.tsx       # Past generation runs list
│   ├── source-filter.tsx            # Filter by idea source
│   └── source-icons.tsx             # Icons for each data source
│
├── notes/                           # Notes components
│   ├── notes-list.tsx               # Notes section
│   ├── note-item.tsx                # Individual note
│   └── note-form.tsx                # Add/edit note form
│
├── filters/                         # Filter components
│   ├── filter-bar.tsx               # Desktop filter bar
│   ├── filter-panel.tsx             # Desktop dropdown panel
│   ├── filter-bottom-sheet.tsx      # Mobile bottom sheet
│   ├── status-tabs.tsx              # Status tab navigation
│   ├── sort-dropdown.tsx            # Sort options
│   ├── score-range-slider.tsx       # Score filter slider
│   └── category-checkboxes.tsx      # Category multi-select
│
├── layout/                          # Layout components
│   ├── header.tsx                   # App header
│   ├── mobile-nav.tsx               # Mobile bottom navigation
│   ├── user-menu.tsx                # User dropdown
│   └── search-input.tsx             # Global search
│
├── feedback/                        # Feedback components
│   ├── empty-state.tsx              # Empty states
│   ├── error-boundary.tsx           # Error boundary wrapper
│   ├── loading-spinner.tsx          # Spinner component
│   └── toast-provider.tsx           # Toast notifications
│
└── compare/                         # Compare view components
    ├── compare-container.tsx        # Compare layout
    └── compare-column.tsx           # Single idea column

hooks/
├── use-ideas.ts                     # Ideas query hooks
├── use-idea.ts                      # Single idea query
├── use-notes.ts                     # Notes query hooks
├── use-filters.ts                   # Filter state hook
├── use-keyboard-nav.ts              # Keyboard navigation
├── use-media-query.ts               # Responsive breakpoints
├── use-debounce.ts                  # Input debouncing
├── use-generate-ideas.ts            # Generation mutation hook
├── use-generation-status.ts         # Generation status polling hook
├── use-generation-history.ts        # Generation history query
└── use-generation-settings.ts       # Generation settings query/mutation

lib/
├── firebase/
│   ├── config.ts                    # Firebase initialization
│   ├── auth.ts                      # Auth utilities
│   └── firestore.ts                 # Firestore utilities
│
├── queries/
│   ├── idea-queries.ts              # TanStack Query functions
│   ├── note-queries.ts              # Notes queries
│   ├── generation-queries.ts        # Generation query functions
│   └── query-keys.ts                # Query key factory
│
├── utils/
│   ├── cn.ts                        # Class name utility (clsx + tailwind-merge)
│   ├── format-date.ts               # Date formatting
│   ├── score-utils.ts               # Score tier calculations
│   └── validators.ts                # Form validation
│
└── types/
    ├── idea.ts                      # Idea types
    ├── note.ts                      # Note types
    ├── filters.ts                   # Filter types
    ├── generation.ts                # Generation types
    └── api.ts                       # API response types

providers/
├── query-provider.tsx               # TanStack Query provider
├── auth-provider.tsx                # Firebase Auth context
└── theme-provider.tsx               # Theme context (if dark mode)

config/
├── site.ts                          # Site metadata
└── nav.ts                           # Navigation config
```

---

## 3. Route Specifications

### Route Table

| Route | Page Component | Purpose | Auth Required | Layout |
|-------|----------------|---------|---------------|--------|
| `/` | `(dashboard)/page.tsx` | Main idea grid dashboard | Yes | Dashboard |
| `/ideas/[id]` | `(dashboard)/ideas/[id]/page.tsx` | Direct idea detail (mobile fallback) | Yes | Dashboard |
| `/compare` | `(dashboard)/compare/page.tsx` | Side-by-side comparison | Yes | Dashboard |
| `/login` | `(auth)/login/page.tsx` | User authentication | No | Auth |
| `/signup` | `(auth)/signup/page.tsx` | User registration | No | Auth |

### Parallel Routes (Desktop Detail Panel)

The detail panel uses Next.js parallel routes for the slide-over pattern:

```
app/(dashboard)/
├── page.tsx              # Main content (grid)
├── @detail/              # Parallel route slot
│   ├── default.tsx       # Empty (when no idea selected)
│   └── [id]/page.tsx     # Detail panel content
└── layout.tsx            # Renders both slots
```

**Dashboard Layout Implementation**:
```tsx
// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
  detail,
}: {
  children: React.ReactNode;
  detail: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      {detail}
    </div>
  );
}
```

### URL Structure for Filters

Filters and sorting are URL-driven for shareability:

```
/?status=reviewing&sort=score-desc&category=saas&minScore=3.0&source=ai-generated
```

| Parameter | Type | Values | Default |
|-----------|------|--------|---------|
| `status` | enum | `all`, `new`, `reviewing`, `pursuing`, `parked` | `all` |
| `sort` | enum | `score-desc`, `score-asc`, `date-desc`, `date-asc`, `name-asc`, `name-desc` | `score-desc` |
| `category` | string | Category slug | (none) |
| `minScore` | number | 1.0 - 5.0 | (none) |
| `maxScore` | number | 1.0 - 5.0 | (none) |
| `tags` | string[] | Comma-separated tags | (none) |
| `q` | string | Search query | (none) |
| `source` | enum[] | `ai-generated`, `trend-suggested`, `manual` (comma-separated) | (none) |
| `runId` | string | Filter to specific generation run | (none) |

---

## 4. Component Hierarchy

### 4.1 Dashboard Page

```
DashboardLayout
├── Header
│   ├── Logo
│   ├── **GenerateButtonGroup** ← PRIMARY ACTION (button + dropdown)
│   │   ├── GenerateButton (main button)
│   │   │   ├── SparklesIcon
│   │   │   ├── Label ("Generate Ideas")
│   │   │   └── Spinner (during generation)
│   │   └── SourceDropdown (chevron button)
│   │       ├── "From X/Twitter only"
│   │       ├── "From Polymarket only"
│   │       ├── "From News only"
│   │       ├── "From App Store only"
│   │       ├── ───────────────────
│   │       ├── "X + Polymarket"
│   │       └── "News + App Store"
│   ├── SearchInput (desktop: visible, mobile: icon toggle)
│   ├── NewIdeaButton (secondary - manual entry)
│   ├── SettingsButton (opens SettingsDrawer)
│   └── UserMenu
│       ├── UserAvatar
│       └── DropdownMenu (Settings, Logout)
│
├── **GenerationProgress** ← SHOWS DURING GENERATION (with source indicator)
│   ├── SourceIcon (animated, shows current source being processed)
│   ├── SourceBadges (shows all sources, highlights current)
│   ├── ProgressBar
│   ├── StageLabel (e.g., "Collecting from X/Twitter...")
│   ├── EstimatedTimeRemaining
│   └── CancelButton
│
├── StatusTabs
│   ├── Tab (All) [count badge]
│   ├── Tab (New) [count badge] ← includes newly generated
│   ├── Tab (Reviewing) [count badge]
│   ├── Tab (Pursuing) [count badge]
│   └── Tab (Parked) [count badge]
│
├── ControlBar
│   ├── ResultCount ("47 ideas")
│   ├── SortDropdown
│   ├── **SourceFilter** ← NEW (AI-Generated, Manual, Trend)
│   │   ├── Checkbox (AI-Generated)
│   │   ├── Checkbox (Trend-Suggested)
│   │   └── Checkbox (Manual)
│   └── ViewToggle (Grid/List) [desktop only]
│
├── MainContent
│   ├── FilterPanel (desktop: dropdown) OR FilterBottomSheet (mobile)
│   │   ├── **SourceCheckboxes** ← NEW
│   │   ├── ScoreRangeSlider
│   │   ├── CategoryCheckboxes
│   │   ├── TagChips
│   │   ├── DateDropdown
│   │   ├── ClearButton
│   │   └── ApplyButton
│   │
│   ├── IdeaGrid (view="grid")
│   │   └── IdeaCard (×n)
│   │       ├── **SourceBadge** ← NEW (purple: AI, blue: Trend, gray: Manual)
│   │       ├── **NewBadge** ← NEW (if created < 24h ago, not yet viewed)
│   │       ├── ScoreBadge
│   │       ├── CompanyName
│   │       ├── Brief (truncated)
│   │       ├── TagChips (max 3)
│   │       └── StatusDropdown
│   │
│   └── IdeaList (view="list") [alternative view]
│       └── IdeaListItem (×n)
│
├── EmptyState (when no ideas match)
│   ├── Illustration
│   ├── Title ("No ideas yet" or "Generate your first ideas")
│   ├── Description
│   └── **GenerateButtonGroup** ← PRIMARY CTA (fullWidth variant)
│
├── LoadMoreButton / InfiniteScrollTrigger
│
├── BulkActionBar (when items selected)
│   ├── SelectionCount
│   ├── StatusDropdown
│   ├── CompareButton
│   ├── ArchiveButton
│   └── CancelButton
│
└── **SettingsDrawer** ← NEW (slide-over from right)
    ├── DrawerHeader
    │   ├── Title ("Settings")
    │   └── CloseButton
    └── DrawerContent
        ├── **GenerationSettings**
        │   ├── AutoGenerationToggle (on/off, default: on)
        │   ├── IdeasPerRunSelect (5/10/15/25)
        │   ├── DataSourcesCheckboxes
        │   │   ├── Checkbox (X/Twitter via Grok)
        │   │   ├── Checkbox (Polymarket)
        │   │   └── Checkbox (Google News)
        │   └── PreferredCategoriesSelect (optional)
        └── **GenerationHistory** (collapsible)
            └── HistoryList
                └── HistoryItem (×n)
                    ├── RunId
                    ├── Timestamp
                    ├── IdeasGenerated
                    ├── SourcesUsed
                    └── FilterLink (→ filter by runId)
```

### 4.2 Detail Panel (Slide-Over)

```
DetailSlideOver
├── Overlay (click to close)
└── Panel
    ├── DetailHeader (sticky)
    │   ├── BackButton
    │   ├── CompanyName
    │   ├── **SourceIndicator** ← NEW (shows AI-Generated/Manual/Trend badge)
    │   ├── MoreMenu (Edit, Delete)
    │   └── CloseButton (desktop)
    │
    ├── DetailContent (scrollable)
    │   ├── **SourceMetadata** ← NEW (for AI-generated ideas)
    │   │   ├── SourceBadge (large)
    │   │   ├── GenerationRunId (link to filter)
    │   │   └── SignalSources (what trends inspired this)
    │   │
    │   ├── ScoreSection
    │   │   ├── OverallScoreBadge (large)
    │   │   ├── TierBadge (HOT/WARM/PARK)
    │   │   ├── ScoringMethod ("AI Auto-Scored" or "Manual")
    │   │   └── ScoreBreakdown
    │   │       ├── ParameterBar (Business Potential)
    │   │       ├── ParameterBar (Dev Complexity)
    │   │       ├── ParameterBar (Time to Market)
    │   │       ├── ParameterBar (Competition)
    │   │       └── ParameterBar (Risk Level)
    │   │
    │   ├── BriefSection
    │   │   └── BriefText (full, not truncated)
    │   │
    │   ├── **AIReasoningSection** ← NEW (prominent for AI ideas)
    │   │   ├── ElevatorPitch (highlighted box)
    │   │   ├── StrengthsList (green bullets)
    │   │   └── RisksList (red/amber bullets)
    │   │
    │   ├── AccordionSections
    │   │   ├── Accordion (Business Plan)
    │   │   │   ├── TargetMarket
    │   │   │   ├── Monetization
    │   │   │   ├── GoToMarket
    │   │   │   └── CompetitiveAdvantage
    │   │   ├── Accordion (Detailed Scores)
    │   │   │   └── ScoreParameterTable
    │   │   └── Accordion (Source Signals) ← NEW (for AI ideas)
    │   │       └── SignalsList (what market signals inspired this)
    │   │
    │   ├── TagsSection
    │   │   └── TagChips (all tags)
    │   │
    │   └── NotesSection
    │       ├── NotesList
    │       │   └── NoteItem (×n)
    │       │       ├── NoteContent
    │       │       ├── Timestamp
    │       │       └── EditDeleteButtons
    │       └── AddNoteButton / NoteForm
    │
    └── DetailFooter (sticky)
        └── StatusDropdown (full-width)
```

### 4.3 Mobile Full-Screen Detail

```
MobileDetailView
├── MobileHeader (fixed)
│   ├── BackButton
│   ├── CompanyName (truncated)
│   └── MoreMenu
│
├── ScrollableContent
│   └── (same as DetailContent above)
│
├── SwipeIndicator ("3 of 12")
│
└── MobileFooter (fixed + safe area)
    └── StatusDropdown
```

### 4.4 Compare View (Desktop Only)

```
CompareView
├── CompareHeader
│   ├── Title ("Compare Ideas (3)")
│   ├── DoneButton
│   └── CloseButton
│
├── CompareColumns
│   ├── CompareColumn (Idea A)
│   │   ├── ColumnHeader
│   │   │   ├── CompanyName
│   │   │   ├── OverallScore
│   │   │   └── RemoveButton
│   │   ├── ColumnContent (synchronized scroll)
│   │   │   ├── ScoreBreakdown
│   │   │   ├── StrengthsList
│   │   │   ├── RisksList
│   │   │   └── Brief
│   │   └── ColumnFooter
│   │       └── StatusDropdown
│   │
│   ├── CompareColumn (Idea B)
│   │   └── (same structure)
│   │
│   └── CompareColumn (Idea C) [optional]
│       └── (same structure)
│
└── AddIdeaSlot (if < 3 selected)
    └── AddButton
```

---

## 5. State Management Patterns

### 5.1 Query Key Factory

```typescript
// lib/queries/query-keys.ts

export const ideaKeys = {
  all: ['ideas'] as const,

  lists: () => [...ideaKeys.all, 'list'] as const,
  list: (filters: IdeaFilters) => [...ideaKeys.lists(), filters] as const,

  details: () => [...ideaKeys.all, 'detail'] as const,
  detail: (id: string) => [...ideaKeys.details(), id] as const,

  counts: () => [...ideaKeys.all, 'counts'] as const,
  countByStatus: () => [...ideaKeys.counts(), 'byStatus'] as const,
};

export const noteKeys = {
  all: ['notes'] as const,

  lists: () => [...noteKeys.all, 'list'] as const,
  list: (ideaId: string) => [...noteKeys.lists(), ideaId] as const,

  detail: (noteId: string) => [...noteKeys.all, 'detail', noteId] as const,
};

// NEW: Generation query keys
export const generationKeys = {
  all: ['generation'] as const,

  status: () => [...generationKeys.all, 'status'] as const,
  currentRun: () => [...generationKeys.all, 'currentRun'] as const,

  history: () => [...generationKeys.all, 'history'] as const,
  historyList: () => [...generationKeys.history(), 'list'] as const,
  historyRun: (runId: string) => [...generationKeys.history(), runId] as const,

  settings: () => [...generationKeys.all, 'settings'] as const,
};
```

### 5.2 Ideas Query Hooks

```typescript
// hooks/use-ideas.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ideaKeys } from '@/lib/queries/query-keys';
import { fetchIdeas, createIdea, updateIdea, deleteIdea } from '@/lib/firebase/firestore';
import type { Idea, IdeaFilters, CreateIdeaInput, UpdateIdeaInput } from '@/lib/types/idea';

// Fetch ideas with filters
export function useIdeas(filters: IdeaFilters) {
  return useQuery({
    queryKey: ideaKeys.list(filters),
    queryFn: () => fetchIdeas(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30,   // 30 minutes (formerly cacheTime)
  });
}

// Fetch single idea
export function useIdea(id: string) {
  return useQuery({
    queryKey: ideaKeys.detail(id),
    queryFn: () => fetchIdea(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// Create idea mutation
export function useCreateIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateIdeaInput) => createIdea(input),
    onSuccess: () => {
      // Invalidate all lists to refetch with new idea
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ideaKeys.counts() });
    },
  });
}

// Update idea with optimistic update
export function useUpdateIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIdeaInput }) =>
      updateIdea(id, data),

    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ideaKeys.detail(id) });

      // Snapshot previous value
      const previousIdea = queryClient.getQueryData<Idea>(ideaKeys.detail(id));

      // Optimistically update
      if (previousIdea) {
        queryClient.setQueryData<Idea>(ideaKeys.detail(id), {
          ...previousIdea,
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousIdea };
    },

    // Rollback on error
    onError: (err, { id }, context) => {
      if (context?.previousIdea) {
        queryClient.setQueryData(ideaKeys.detail(id), context.previousIdea);
      }
    },

    // Refetch on success
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ideaKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
    },
  });
}

// Delete idea mutation
export function useDeleteIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteIdea(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ideaKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ideaKeys.counts() });
    },
  });
}

// Status counts for tabs
export function useStatusCounts() {
  return useQuery({
    queryKey: ideaKeys.countByStatus(),
    queryFn: fetchStatusCounts,
    staleTime: 1000 * 60 * 1, // 1 minute (changes more frequently)
  });
}
```

### 5.3 Notes Query Hooks

```typescript
// hooks/use-notes.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noteKeys, ideaKeys } from '@/lib/queries/query-keys';

export function useNotes(ideaId: string) {
  return useQuery({
    queryKey: noteKeys.list(ideaId),
    queryFn: () => fetchNotes(ideaId),
    enabled: !!ideaId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ideaId, content }: { ideaId: string; content: string }) =>
      createNote(ideaId, content),
    onSuccess: (_, { ideaId }) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.list(ideaId) });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ideaId, noteId, content }: { ideaId: string; noteId: string; content: string }) =>
      updateNote(ideaId, noteId, content),
    onSuccess: (_, { ideaId }) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.list(ideaId) });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ideaId, noteId }: { ideaId: string; noteId: string }) =>
      deleteNote(ideaId, noteId),
    onSuccess: (_, { ideaId }) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.list(ideaId) });
    },
  });
}
```

### 5.4 Filter State Hook

```typescript
// hooks/use-filters.ts

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { IdeaFilters, SortOption, StatusFilter } from '@/lib/types/filters';

export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse current filters from URL
  const filters: IdeaFilters = useMemo(() => ({
    status: (searchParams.get('status') as StatusFilter) || 'all',
    sort: (searchParams.get('sort') as SortOption) || 'score-desc',
    category: searchParams.get('category') || undefined,
    minScore: searchParams.get('minScore') ? parseFloat(searchParams.get('minScore')!) : undefined,
    maxScore: searchParams.get('maxScore') ? parseFloat(searchParams.get('maxScore')!) : undefined,
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
    search: searchParams.get('q') || undefined,
  }), [searchParams]);

  // Update filters in URL
  const setFilters = useCallback((updates: Partial<IdeaFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' ||
          (Array.isArray(value) && value.length === 0)) {
        params.delete(key === 'search' ? 'q' : key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else {
        params.set(key === 'search' ? 'q' : key, String(value));
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  // Convenience methods
  const setStatus = useCallback((status: StatusFilter) =>
    setFilters({ status }), [setFilters]);

  const setSort = useCallback((sort: SortOption) =>
    setFilters({ sort }), [setFilters]);

  const setSearch = useCallback((search: string) =>
    setFilters({ search }), [setFilters]);

  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const hasActiveFilters = useMemo(() =>
    filters.status !== 'all' ||
    filters.category ||
    filters.minScore !== undefined ||
    filters.maxScore !== undefined ||
    (filters.tags && filters.tags.length > 0) ||
    filters.search,
  [filters]);

  return {
    filters,
    setFilters,
    setStatus,
    setSort,
    setSearch,
    clearFilters,
    hasActiveFilters,
  };
}
```

### 5.5 Cache Configuration

```typescript
// providers/query-provider.tsx

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Global defaults
        staleTime: 1000 * 60 * 5,        // 5 minutes
        gcTime: 1000 * 60 * 30,          // 30 minutes
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
```

### 5.6 Generation Hooks (UPDATED)

```typescript
// hooks/use-generate-ideas.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generationKeys, ideaKeys } from '@/lib/queries/query-keys';
import { triggerGeneration } from '@/lib/firebase/generation';
import { DataSource } from '@/lib/utils/source-icons';

// Source input can be 'all' or array of specific sources
type SourcesInput = 'all' | DataSource[];

interface GenerationInput {
  sources?: SourcesInput;
  ideasPerRun?: number;
  categories?: string[];
}

interface GenerationResult {
  success: boolean;
  runId: string;
  ideasGenerated: number;
  ideasSaved: number;
  duration: number;
  sourcesUsed: DataSource[];
  errors: string[];
}

// Default sources when 'all' is specified
const ALL_SOURCES: DataSource[] = ['x', 'polymarket', 'googlenews', 'appstore'];

export function useGenerateIdeas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: GenerationInput) => {
      // Resolve 'all' to actual sources array
      const resolvedSources = input.sources === 'all'
        ? ALL_SOURCES
        : input.sources || ALL_SOURCES;

      return triggerGeneration({
        ...input,
        sources: resolvedSources,
      });
    },

    onMutate: async (input) => {
      // Resolve sources for status display
      const resolvedSources = input.sources === 'all'
        ? ALL_SOURCES
        : input.sources || ALL_SOURCES;

      // Set generation status to "running" with source info
      queryClient.setQueryData(generationKeys.status(), {
        isGenerating: true,
        stage: 'collecting',
        sources: resolvedSources,
        currentSource: resolvedSources[0],  // First source being processed
        progress: 0,
        startedAt: new Date().toISOString(),
      });
    },

    onSuccess: (result: GenerationResult) => {
      // Clear generation status
      queryClient.setQueryData(generationKeys.status(), {
        isGenerating: false,
        lastRun: result,
      });

      // Invalidate ideas list to show new ideas
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ideaKeys.counts() });

      // Invalidate history
      queryClient.invalidateQueries({ queryKey: generationKeys.history() });

      // Show success toast with source info
      const sourceLabel = result.sourcesUsed.length === ALL_SOURCES.length
        ? 'all sources'
        : result.sourcesUsed.map(s => sourceConfig[s].shortLabel).join(', ');
      toast.success(`Generated ${result.ideasSaved} ideas from ${sourceLabel}!`);
    },

    onError: (error, input) => {
      const resolvedSources = input.sources === 'all'
        ? ALL_SOURCES
        : input.sources || ALL_SOURCES;

      queryClient.setQueryData(generationKeys.status(), {
        isGenerating: false,
        sources: resolvedSources,
        error: error.message,
      });
    },
  });
}

// Usage examples:
// generate({ sources: 'all' });                    // All 4 sources
// generate({ sources: ['x'] });                    // X/Twitter only
// generate({ sources: ['polymarket', 'appstore'] }); // Specific combo
```

```typescript
// hooks/use-generation-status.ts

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { generationKeys } from '@/lib/queries/query-keys';
import { fetchGenerationStatus } from '@/lib/firebase/generation';
import { DataSource } from '@/lib/utils/source-icons';

interface GenerationStatus {
  isGenerating: boolean;
  stage?: 'collecting' | 'analyzing' | 'generating' | 'scoring' | 'saving';
  sources?: DataSource[];       // All sources being used in this run
  currentSource?: DataSource;   // Which source is currently being processed
  progress?: number;            // 0-100
  startedAt?: string;
  estimatedTimeRemaining?: number;  // seconds
  lastRun?: {
    runId: string;
    timestamp: string;
    ideasGenerated: number;
    sourcesUsed: DataSource[];
    success: boolean;
  };
  error?: string;
}

export function useGenerationStatus() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: generationKeys.status(),
    queryFn: fetchGenerationStatus,

    // Poll every 2 seconds while generation is in progress
    refetchInterval: (query) => {
      const data = query.state.data as GenerationStatus | undefined;
      return data?.isGenerating ? 2000 : false;
    },

    // Stop polling after 10 minutes (timeout)
    refetchIntervalInBackground: false,

    staleTime: 0,  // Always fetch fresh status
  });
}
```

```typescript
// hooks/use-generation-history.ts

import { useQuery } from '@tanstack/react-query';
import { generationKeys } from '@/lib/queries/query-keys';
import { fetchGenerationHistory } from '@/lib/firebase/generation';

interface GenerationRun {
  runId: string;
  timestamp: string;
  ideasGenerated: number;
  ideasSaved: number;
  sources: string[];
  duration: number;
  success: boolean;
  errors?: string[];
}

export function useGenerationHistory(limit = 10) {
  return useQuery({
    queryKey: generationKeys.historyList(),
    queryFn: () => fetchGenerationHistory(limit),
    staleTime: 1000 * 60 * 5,  // 5 minutes
  });
}
```

```typescript
// hooks/use-generation-settings.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { generationKeys } from '@/lib/queries/query-keys';
import { fetchGenerationSettings, updateGenerationSettings } from '@/lib/firebase/generation';

interface GenerationSettings {
  autoGenerationEnabled: boolean;
  generationSources: DataSource[];  // Now includes 'appstore'
  ideasPerRun: number;
  preferredCategories?: string[];
}

// DataSource type (from lib/utils/source-icons.ts)
// type DataSource = 'x' | 'polymarket' | 'googlenews' | 'appstore';

export function useGenerationSettings() {
  return useQuery({
    queryKey: generationKeys.settings(),
    queryFn: fetchGenerationSettings,
    staleTime: 1000 * 60 * 10,  // 10 minutes
  });
}

export function useUpdateGenerationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Partial<GenerationSettings>) =>
      updateGenerationSettings(settings),

    // Optimistic update
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: generationKeys.settings() });
      const previous = queryClient.getQueryData<GenerationSettings>(generationKeys.settings());

      if (previous) {
        queryClient.setQueryData(generationKeys.settings(), {
          ...previous,
          ...newSettings,
        });
      }

      return { previous };
    },

    onError: (err, newSettings, context) => {
      if (context?.previous) {
        queryClient.setQueryData(generationKeys.settings(), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: generationKeys.settings() });
    },
  });
}
```

---

## 6. Component Specifications

### 6.1 IdeaCard

| Property | Type | Description |
|----------|------|-------------|
| `idea` | `Idea` | The idea data object |
| `isSelected` | `boolean` | Whether card is selected for bulk action |
| `onSelect` | `(id: string) => void` | Selection toggle callback |
| `onClick` | `(id: string) => void` | Open detail view |
| `onStatusChange` | `(id: string, status: Status) => void` | Status change callback |

**Internal State**:
| State | Type | Purpose |
|-------|------|---------|
| `isHovered` | `boolean` | Show hover UI (checkbox, shadow) |
| `isDropdownOpen` | `boolean` | Status dropdown state |

**Events Emitted**:
| Event | Trigger | Payload |
|-------|---------|---------|
| `onClick` | Card click (not on dropdown) | `ideaId` |
| `onSelect` | Checkbox click | `ideaId` |
| `onStatusChange` | Dropdown selection | `ideaId`, `newStatus` |

### 6.2 StatusDropdown

| Property | Type | Description |
|----------|------|-------------|
| `value` | `Status` | Current status |
| `onChange` | `(status: Status) => void` | Change handler |
| `disabled` | `boolean` | Disable interactions |
| `fullWidth` | `boolean` | Take full width (for detail footer) |

**Accessibility**:
- `role="combobox"`
- `aria-expanded`
- `aria-haspopup="listbox"`
- Arrow key navigation
- Escape to close

### 6.3 ScoreBadge

| Property | Type | Description |
|----------|------|-------------|
| `score` | `number` | Score value (1.0-5.0) |
| `size` | `'sm' \| 'md' \| 'lg'` | Badge size |
| `showLabel` | `boolean` | Show "/5" or tier label |

**Score to Tier Mapping**:
```typescript
function getScoreTier(score: number): Tier {
  if (score >= 4.0) return 'hot';
  if (score >= 3.0) return 'warm';
  if (score >= 2.0) return 'park';
  return 'discard';
}

const tierColors = {
  hot: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
  warm: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
  park: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' },
  discard: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
};
```

### 6.4 FilterPanel

| Property | Type | Description |
|----------|------|-------------|
| `open` | `boolean` | Panel visibility |
| `onClose` | `() => void` | Close handler |
| `filters` | `IdeaFilters` | Current filter state |
| `onApply` | `(filters: IdeaFilters) => void` | Apply filters |
| `onClear` | `() => void` | Clear all filters |

**Internal State**:
| State | Type | Purpose |
|-------|------|---------|
| `localFilters` | `IdeaFilters` | Pending filter changes |

### 6.5 AccordionSections

| Property | Type | Description |
|----------|------|-------------|
| `strengths` | `string[]` | Strengths list |
| `risks` | `string[]` | Risks list |
| `businessPlan` | `BusinessPlan` | Business plan object |
| `pitch` | `string` | Elevator pitch |
| `scores` | `ScoreBreakdown` | Detailed scores |
| `defaultOpen` | `string[]` | Initially open sections |

### 6.6 NotesList

| Property | Type | Description |
|----------|------|-------------|
| `ideaId` | `string` | Parent idea ID |
| `notes` | `Note[]` | Notes array |
| `onAdd` | `(content: string) => void` | Add note |
| `onEdit` | `(noteId: string, content: string) => void` | Edit note |
| `onDelete` | `(noteId: string) => void` | Delete note |

### 6.7 GenerateButtonGroup (UPDATED)

Replaces single button with a button group that supports source-specific generation.

| Property | Type | Description |
|----------|------|-------------|
| `variant` | `'primary' \| 'secondary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | Button size |
| `fullWidth` | `boolean` | Take full width (for empty state) |

**Internal State**:
| State | Type | Purpose |
|-------|------|---------|
| `isGenerating` | `boolean` | From useGenerationStatus hook |
| `isDropdownOpen` | `boolean` | Source dropdown visibility |

**Data Source Type**:
```typescript
type DataSource = 'x' | 'polymarket' | 'googlenews' | 'appstore';
type SourcesInput = 'all' | DataSource[];
```

**Source Icons**:
```typescript
// lib/utils/source-icons.tsx

import { XIcon, ChartBarIcon, NewspaperIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

export const sourceConfig = {
  x: {
    icon: XIcon,  // X/Twitter logo
    label: 'X/Twitter',
    shortLabel: 'X',
    color: 'text-gray-900',
  },
  polymarket: {
    icon: ChartBarIcon,  // Prediction/chart icon
    label: 'Polymarket',
    shortLabel: 'Polymarket',
    color: 'text-blue-600',
  },
  googlenews: {
    icon: NewspaperIcon,  // Newspaper icon
    label: 'Google News',
    shortLabel: 'News',
    color: 'text-red-500',
  },
  appstore: {
    icon: Squares2X2Icon,  // Grid/apps icon
    label: 'App Store',
    shortLabel: 'Apps',
    color: 'text-blue-500',
  },
} as const;

export type DataSource = keyof typeof sourceConfig;
```

**Implementation**:
```typescript
// components/generation/generate-button-group.tsx

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { sourceConfig, DataSource } from '@/lib/utils/source-icons';

interface GenerateButtonGroupProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function GenerateButtonGroup({
  variant = 'primary',
  size = 'md',
  fullWidth = false
}: GenerateButtonGroupProps) {
  const { mutate: generate, isPending } = useGenerateIdeas();
  const { data: status } = useGenerationStatus();
  const { data: settings } = useGenerationSettings();

  const isGenerating = isPending || status?.isGenerating;

  const handleGenerate = (sources: 'all' | DataSource[]) => {
    generate({
      sources: sources === 'all' ? settings?.generationSources : sources,
      ideasPerRun: settings?.ideasPerRun,
    });
  };

  return (
    <div className={cn('flex', fullWidth && 'w-full')}>
      {/* Primary: Generate from All Sources */}
      <Button
        onClick={() => handleGenerate('all')}
        disabled={isGenerating}
        variant={variant}
        size={size}
        className={cn(
          'gap-2 rounded-r-none',
          fullWidth && 'flex-1'
        )}
      >
        {isGenerating ? (
          <>
            <Spinner className="w-4 h-4" />
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="w-4 h-4" />
            Generate Ideas
          </>
        )}
      </Button>

      {/* Dropdown for specific sources */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={size}
            disabled={isGenerating}
            className="rounded-l-none border-l-0 px-2"
          >
            <ChevronDownIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => handleGenerate(['x'])}>
            <sourceConfig.x.icon className={cn('w-4 h-4 mr-2', sourceConfig.x.color)} />
            From X/Twitter only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleGenerate(['polymarket'])}>
            <sourceConfig.polymarket.icon className={cn('w-4 h-4 mr-2', sourceConfig.polymarket.color)} />
            From Polymarket only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleGenerate(['googlenews'])}>
            <sourceConfig.googlenews.icon className={cn('w-4 h-4 mr-2', sourceConfig.googlenews.color)} />
            From News only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleGenerate(['appstore'])}>
            <sourceConfig.appstore.icon className={cn('w-4 h-4 mr-2', sourceConfig.appstore.color)} />
            From App Store only
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleGenerate(['x', 'polymarket'])}>
            <SparklesIcon className="w-4 h-4 mr-2 text-purple-500" />
            X + Polymarket
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleGenerate(['googlenews', 'appstore'])}>
            <SparklesIcon className="w-4 h-4 mr-2 text-purple-500" />
            News + App Store
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
```

**Mobile Variant** (full-width with sheet instead of dropdown):
```typescript
// On mobile, use a bottom sheet for source selection
export function GenerateButtonMobile() {
  const [sheetOpen, setSheetOpen] = useState(false);
  // ... similar logic with Sheet component
}
```

### 6.8 GenerationProgress (UPDATED)

| Property | Type | Description |
|----------|------|-------------|
| `onCancel` | `() => void` | Cancel handler (optional) |

**Stages with Source-Specific Messages**:
| Stage | Default Label | Source-Specific Label |
|-------|---------------|----------------------|
| `collecting` | "Collecting market data..." | "Collecting from X/Twitter...", "Collecting from Polymarket...", etc. |
| `analyzing` | "Analyzing trends..." | "Analyzing X trends...", "Analyzing prediction markets...", etc. |
| `generating` | "Generating ideas..." | Same for all sources |
| `scoring` | "Scoring ideas..." | Same for all sources |
| `saving` | "Saving to portfolio..." | Same for all sources |

**Progress Breakdown by Source**:
| Stage | Single Source % | Multiple Sources % |
|-------|-----------------|-------------------|
| `collecting` | 0-25% | 0-20% (split across sources) |
| `analyzing` | 25-45% | 20-40% |
| `generating` | 45-70% | 40-70% |
| `scoring` | 70-90% | 70-90% |
| `saving` | 90-100% | 90-100% |

**Implementation**:
```typescript
// components/generation/generation-progress.tsx

import { sourceConfig, DataSource } from '@/lib/utils/source-icons';

interface GenerationStatus {
  isGenerating: boolean;
  stage: 'collecting' | 'analyzing' | 'generating' | 'scoring' | 'saving';
  currentSource?: DataSource;  // Which source is currently being processed
  sources: DataSource[];       // All sources being used
  progress: number;
  estimatedTimeRemaining?: number;
}

export function GenerationProgress({ onCancel }: { onCancel?: () => void }) {
  const { data: status } = useGenerationStatus();

  if (!status?.isGenerating) return null;

  // Source-specific labels for collecting stage
  const getCollectingLabel = (source?: DataSource): string => {
    if (!source) return 'Collecting market data...';
    const labels: Record<DataSource, string> = {
      x: 'Collecting from X/Twitter...',
      polymarket: 'Collecting from Polymarket...',
      googlenews: 'Collecting from Google News...',
      appstore: 'Collecting from App Store...',
    };
    return labels[source];
  };

  // Source-specific labels for analyzing stage
  const getAnalyzingLabel = (source?: DataSource): string => {
    if (!source) return 'Analyzing trends...';
    const labels: Record<DataSource, string> = {
      x: 'Analyzing X trends...',
      polymarket: 'Analyzing prediction markets...',
      googlenews: 'Analyzing news headlines...',
      appstore: 'Analyzing app trends...',
    };
    return labels[source];
  };

  const getStageLabel = (): string => {
    switch (status.stage) {
      case 'collecting':
        return getCollectingLabel(status.currentSource);
      case 'analyzing':
        return getAnalyzingLabel(status.currentSource);
      case 'generating':
        return 'Generating ideas...';
      case 'scoring':
        return 'Scoring ideas...';
      case 'saving':
        return 'Saving to portfolio...';
      default:
        return 'Processing...';
    }
  };

  // Get icon for current source
  const CurrentSourceIcon = status.currentSource
    ? sourceConfig[status.currentSource].icon
    : SparklesIcon;

  return (
    <div className="bg-purple-50 border-b border-purple-200 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Show source icon during collecting/analyzing, spinner otherwise */}
          {status.currentSource && ['collecting', 'analyzing'].includes(status.stage) ? (
            <CurrentSourceIcon className={cn(
              'w-5 h-5 animate-pulse',
              sourceConfig[status.currentSource].color
            )} />
          ) : (
            <Spinner className="w-5 h-5 text-purple-600" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-900">
              {getStageLabel()}
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-600">
              {/* Show source badges for multi-source generation */}
              {status.sources.length > 1 && (
                <span className="flex items-center gap-1">
                  {status.sources.map(src => {
                    const Icon = sourceConfig[src].icon;
                    return (
                      <Icon
                        key={src}
                        className={cn(
                          'w-3 h-3',
                          status.currentSource === src ? 'opacity-100' : 'opacity-40'
                        )}
                      />
                    );
                  })}
                </span>
              )}
              {status.estimatedTimeRemaining && (
                <span>~{Math.ceil(status.estimatedTimeRemaining / 60)} min remaining</span>
              )}
            </div>
          </div>
          <Progress value={status.progress || 0} className="w-32" />
        </div>
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
```

### 6.9 SourceBadge (NEW)

| Property | Type | Description |
|----------|------|-------------|
| `source` | `'ai-generated' \| 'trend-suggested' \| 'manual'` | Idea source |
| `size` | `'sm' \| 'md'` | Badge size |

**Source to Style Mapping**:
```typescript
const sourceStyles = {
  'ai-generated': {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    icon: SparklesIcon,
    label: 'AI Generated',
  },
  'trend-suggested': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: TrendingUpIcon,
    label: 'Trend',
  },
  'manual': {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    icon: PencilIcon,
    label: 'Manual',
  },
};
```

### 6.10 NewBadge (NEW)

| Property | Type | Description |
|----------|------|-------------|
| `createdAt` | `string` | ISO timestamp |
| `viewedAt` | `string \| null` | When user viewed detail (null if never) |

**Display Logic**:
- Show if `createdAt` is within last 24 hours AND `viewedAt` is null
- Pulsing animation to draw attention
- Dismisses when user opens detail view (sets `viewedAt`)

```typescript
export function NewBadge({ createdAt, viewedAt }: NewBadgeProps) {
  const isNew = useMemo(() => {
    if (viewedAt) return false;
    const created = new Date(createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  }, [createdAt, viewedAt]);

  if (!isNew) return null;

  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold bg-green-500 text-white animate-pulse">
      NEW
    </span>
  );
}
```

### 6.11 GenerationSettings (UPDATED)

| Property | Type | Description |
|----------|------|-------------|
| `onClose` | `() => void` | Close panel handler |

**Settings Fields**:
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `autoGenerationEnabled` | `boolean` | `true` | Enable daily auto-generation |
| `ideasPerRun` | `number` | `10` | Ideas to generate per run (5/10/15/25) |
| `generationSources` | `DataSource[]` | `['x', 'polymarket', 'googlenews', 'appstore']` | Data sources (all 4 by default) |
| `preferredCategories` | `string[]` | `[]` | Optional category filter |

**Source Selection UI**:
```typescript
// In GenerationSettings component
<div className="space-y-2">
  <Label>Data Sources</Label>
  {Object.entries(sourceConfig).map(([key, config]) => {
    const Icon = config.icon;
    return (
      <div key={key} className="flex items-center gap-2">
        <Checkbox
          id={`source-${key}`}
          checked={settings.generationSources.includes(key as DataSource)}
          onCheckedChange={(checked) => updateSource(key as DataSource, checked)}
        />
        <Icon className={cn('w-4 h-4', config.color)} />
        <Label htmlFor={`source-${key}`}>{config.label}</Label>
      </div>
    );
  })}
</div>
```

### 6.12 GenerationHistory (NEW)

| Property | Type | Description |
|----------|------|-------------|
| `limit` | `number` | Number of runs to show (default: 5) |
| `onFilterByRun` | `(runId: string) => void` | Filter ideas by run |

**List Item Display**:
```
┌─────────────────────────────────────────────────┐
│ Run #abc123                           2h ago    │
│ 12 ideas generated • X, Polymarket             │
│ [View Ideas →]                                  │
└─────────────────────────────────────────────────┘
```

---

## 7. Data Flow Diagram

### 7.1 Read Flow (Ideas List)

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐    ┌─────────────┐    ┌────────────────┐              │
│  │  URL     │───►│  useFilters │───►│  TanStack      │              │
│  │  Params  │    │  Hook       │    │  Query Cache   │              │
│  └──────────┘    └─────────────┘    └───────┬────────┘              │
│                                             │                        │
│                         ┌───────────────────┘                        │
│                         ▼                                            │
│                  ┌──────────────┐                                    │
│                  │  useIdeas()  │                                    │
│                  │  Hook        │                                    │
│                  └──────┬───────┘                                    │
│                         │                                            │
│           ┌─────────────┴─────────────┐                              │
│           ▼                           ▼                              │
│    ┌─────────────┐             ┌─────────────┐                       │
│    │  Cache Hit  │             │ Cache Miss  │                       │
│    │  (stale?)   │             │ (or stale)  │                       │
│    └──────┬──────┘             └──────┬──────┘                       │
│           │                           │                              │
│           ▼                           ▼                              │
│    Return cached             ┌───────────────┐                       │
│    data immediately          │  fetchIdeas() │                       │
│                              └───────┬───────┘                       │
│                                      │                               │
└──────────────────────────────────────┼───────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          FIREBASE                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Firestore Query                                              │   │
│  │  collection('users/{userId}/ideas')                           │   │
│  │  .where('status', '==', filters.status)                       │   │
│  │  .orderBy(sortField, sortDirection)                           │   │
│  │  .limit(PAGE_SIZE)                                            │   │
│  └─────────────────────────────────────────────────────────────┬─┘   │
│                                                                 │     │
│                                                                 ▼     │
│                                                          ┌──────────┐│
│                                                          │ Firestore││
│                                                          │ Database ││
│                                                          └──────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Write Flow (Status Update with Optimistic Update)

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  User clicks                                                         │
│  "Pursuing" ───────┐                                                │
│                    ▼                                                 │
│            ┌───────────────┐                                         │
│            │ StatusDropdown │                                        │
│            │ onChange()     │                                        │
│            └───────┬───────┘                                         │
│                    │                                                 │
│                    ▼                                                 │
│            ┌───────────────┐                                         │
│            │ useUpdateIdea │                                         │
│            │ .mutate()     │                                         │
│            └───────┬───────┘                                         │
│                    │                                                 │
│    ┌───────────────┼───────────────┐                                │
│    ▼               ▼               ▼                                │
│  onMutate      mutationFn     onSettled                             │
│  (Optimistic)  (Actual call)  (Reconcile)                           │
│                                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                     │
│  │ 1. Cancel  │  │ 3. Call    │  │ 5. Refetch │                     │
│  │ outgoing   │  │ updateIdea │  │ queries    │                     │
│  │ queries    │  │ API        │  │            │                     │
│  │            │  │            │  │            │                     │
│  │ 2. Update  │  │            │  │            │                     │
│  │ cache with │  │            │  │ 6. UI in   │                     │
│  │ new status │  │            │  │ final      │                     │
│  │ (instant)  │  │            │  │ state      │                     │
│  └────────────┘  └─────┬──────┘  └────────────┘                     │
│        │               │               │                             │
│        │               │               │                             │
│  UI updates         ───┼───────────────┘                             │
│  immediately           │                                             │
│        │               │                                             │
│        ▼               ▼                                             │
│  ┌──────────────────────────────────────┐                           │
│  │  onError: Rollback to previous state │                           │
│  └──────────────────────────────────────┘                           │
│                                                                      │
└───────────────────────────────────────────┬─────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          FIREBASE                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  updateDoc(ideaRef, {                                         │   │
│  │    status: 'pursuing',                                        │   │
│  │    updatedAt: serverTimestamp()                               │   │
│  │  })                                                           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.3 Generation Flow (NEW)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  User clicks "Generate Ideas"                                               │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────┐                                                    │
│  │ GenerateIdeasButton │                                                    │
│  │    onClick()        │                                                    │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐      ┌─────────────────────────────────────────┐  │
│  │ useGenerateIdeas()  │─────►│ UI shows GenerationProgress component    │  │
│  │ .mutate()           │      │ (progress bar, stage indicator)          │  │
│  └──────────┬──────────┘      └─────────────────────────────────────────┘  │
│             │                                                               │
│             │  POST /api/generate (with auth token)                        │
│             │                                                               │
└─────────────┼───────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLOUD FUNCTIONS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    generateIdeasHttp                                 │   │
│  │                                                                      │   │
│  │  Stage 1: Collect data from X, Polymarket, Google News (parallel)   │   │
│  │      │                                                               │   │
│  │      ▼                                                               │   │
│  │  Stage 2: Analyze signals with Gemini/Grok                          │   │
│  │      │                                                               │   │
│  │      ▼                                                               │   │
│  │  Stage 3: Generate ideas from signals                               │   │
│  │      │                                                               │   │
│  │      ▼                                                               │   │
│  │  Stage 4: Score ideas (1-5 on each parameter)                       │   │
│  │      │                                                               │   │
│  │      ▼                                                               │   │
│  │  Stage 5: Save to Firestore                                         │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                          │                                                  │
│                          ▼                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Response: { success: true, runId, ideasGenerated, ideasSaved }     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
              │
              │  Response received
              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  onSuccess callback:                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 1. Clear generation status (hide progress bar)                       │   │
│  │ 2. Invalidate ideaKeys.lists() → Refetch ideas                       │   │
│  │ 3. Invalidate ideaKeys.counts() → Update tab counts                  │   │
│  │ 4. Invalidate generationKeys.history() → Update history              │   │
│  │ 5. Show success toast: "Generated 12 new ideas!"                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  IdeaGrid re-renders with new ideas (NewBadge visible, SourceBadge=purple) │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.4 Generation Status Polling Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         POLLING SEQUENCE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  useGenerationStatus() with refetchInterval: 2000 (while isGenerating)     │
│                                                                             │
│  t=0s    ┌────────────────┐                                                 │
│          │ fetch status   │──► { isGenerating: true, stage: 'collecting' } │
│          └────────────────┘    ──► UI shows: "Collecting market data..."   │
│                                                                             │
│  t=2s    ┌────────────────┐                                                 │
│          │ fetch status   │──► { isGenerating: true, stage: 'analyzing' }  │
│          └────────────────┘    ──► UI shows: "Analyzing trends..."         │
│                                                                             │
│  t=4s    ┌────────────────┐                                                 │
│          │ fetch status   │──► { isGenerating: true, stage: 'generating' } │
│          └────────────────┘    ──► UI shows: "Generating ideas..."         │
│                                                                             │
│  t=6s    ┌────────────────┐                                                 │
│          │ fetch status   │──► { isGenerating: true, stage: 'scoring' }    │
│          └────────────────┘    ──► UI shows: "Scoring ideas..."            │
│                                                                             │
│  t=8s    ┌────────────────┐                                                 │
│          │ fetch status   │──► { isGenerating: false, lastRun: {...} }     │
│          └────────────────┘    ──► STOP POLLING                            │
│                                    ──► Hide progress bar                   │
│                                    ──► Invalidate queries                  │
│                                                                             │
│  TIMEOUT (10 min): If still polling, force stop + show error               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.5 Complete Data Flow Overview (Updated for Pipeline-First)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   │
│   │ Generate    │   │  IdeaGrid   │   │ DetailPanel │   │  Settings   │   │
│   │ Button      │   │             │   │             │   │  Drawer     │   │
│   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   │
│          │                 │                 │                  │          │
└──────────┼─────────────────┼─────────────────┼──────────────────┼──────────┘
           │                 │                 │                  │
           ▼                 ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            REACT HOOKS LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   │
│   │useGenerate  │   │  useIdeas   │   │  useIdea    │   │useGeneration│   │
│   │Ideas        │   │  (query)    │   │  (query)    │   │Settings     │   │
│   │(mutation)   │   │             │   │             │   │(query)      │   │
│   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   │
│          │                 │                 │                  │          │
│          └────────────┬────┴────────────┬────┴──────────────────┘          │
│                       ▼                 ▼                                   │
│               ┌─────────────────────────────────────────────────────┐      │
│               │              TanStack Query Cache                    │      │
│               │  ┌─────────────────────────────────────────────┐    │      │
│               │  │ ideas.list.{filters} → Idea[]                │    │      │
│               │  │ ideas.detail.{id}    → Idea                  │    │      │
│               │  │ ideas.counts.byStatus → StatusCounts         │    │      │
│               │  │ generation.status    → GenerationStatus      │ ← NEW    │
│               │  │ generation.history   → GenerationRun[]       │ ← NEW    │
│               │  │ generation.settings  → GenerationSettings    │ ← NEW    │
│               │  │ notes.list.{ideaId}  → Note[]                │    │      │
│               │  └─────────────────────────────────────────────┘    │      │
│               └────────────────────────┬────────────────────────────┘      │
│                                        │                                    │
└────────────────────────────────────────┼────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FIREBASE LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                       lib/firebase/firestore.ts                      │  │
│   │                                                                      │  │
│   │  fetchIdeas(filters)  →  Firestore query with filters               │  │
│   │  fetchIdea(id)        →  getDoc(ideaRef)                            │  │
│   │  createIdea(data)     →  addDoc(ideasCollection, data)              │  │
│   │  updateIdea(id, data) →  updateDoc(ideaRef, data)                   │  │
│   │  deleteIdea(id)       →  deleteDoc(ideaRef)                         │  │
│   │                                                                      │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                     lib/firebase/generation.ts ← NEW                 │  │
│   │                                                                      │  │
│   │  triggerGeneration(config)  →  POST /api/generate (Cloud Function)  │  │
│   │  fetchGenerationStatus()    →  GET /api/generate/status             │  │
│   │  fetchGenerationHistory()   →  Firestore /generationRuns            │  │
│   │  fetchGenerationSettings()  →  Firestore /users/{userId}            │  │
│   │  updateGenerationSettings() →  updateDoc(userRef, settings)         │  │
│   │                                                                      │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                        │                                    │
│                                        ▼                                    │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                          Cloud Firestore                             │  │
│   │                                                                      │  │
│   │  users/{userId}/                                                     │  │
│   │    autoGenerationEnabled: boolean ← NEW                              │  │
│   │    generationSources: string[] ← NEW                                 │  │
│   │    ideasPerRun: number ← NEW                                         │  │
│   │    ideas/                                                            │  │
│   │      {ideaId}/                                                       │  │
│   │        source: 'ai-generated' | 'trend-suggested' | 'manual' ← NEW  │  │
│   │        generationRunId: string ← NEW (for AI ideas)                 │  │
│   │        sourceSignals: string[] ← NEW (for AI ideas)                 │  │
│   │        notes/{noteId}                                                │  │
│   │    generationRuns/ ← NEW                                             │  │
│   │      {runId}/                                                        │  │
│   │        timestamp, ideasGenerated, sources, duration, success        │  │
│   │                                                                      │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                        Cloud Functions ← NEW                         │  │
│   │                                                                      │  │
│   │  generateIdeasHttp    →  POST /api/generate (manual trigger)        │  │
│   │  generateIdeasScheduled →  Daily @ 6 AM UTC (auto trigger)          │  │
│   │                                                                      │  │
│   │  Pipeline: Collect → Analyze → Generate → Score → Save              │  │
│   │                                                                      │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Error Boundary Strategy

### 8.1 Error Boundary Placement

```
RootLayout
├── GlobalErrorBoundary (app/error.tsx)
│   └── "Something went wrong" + Retry button
│
└── DashboardLayout
    ├── HeaderErrorBoundary
    │   └── Minimal header if search/user fails
    │
    ├── GridErrorBoundary
    │   └── "Couldn't load ideas" + Retry
    │
    └── DetailPanelErrorBoundary
        └── "Couldn't load idea details" + Close panel
```

### 8.2 Error Boundary Implementation

```typescript
// components/feedback/error-boundary.tsx

'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service (Sentry, etc.)
    console.error('Error boundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={this.handleReset}>Try again</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 8.3 Query Error Handling

```typescript
// Global error handler for queries
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof FirebaseError) {
          if (error.code === 'permission-denied') return false;
          if (error.code === 'not-found') return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      onError: (error) => {
        // Show toast for mutation errors
        toast.error(getErrorMessage(error));
      },
    },
  },
});

function getErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'permission-denied':
        return 'You don\'t have permission to perform this action';
      case 'not-found':
        return 'The requested item was not found';
      case 'unavailable':
        return 'Service temporarily unavailable. Please try again.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
  return 'An unexpected error occurred';
}
```

### 8.4 Network Error Handling

```typescript
// hooks/use-network-status.ts

import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

```typescript
// components/feedback/offline-banner.tsx

export function OfflineBanner() {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 inset-x-0 bg-yellow-50 border-b border-yellow-200 px-4 py-2 z-50">
      <div className="flex items-center justify-center gap-2 text-sm text-yellow-800">
        <WifiOffIcon className="w-4 h-4" />
        <span>You're offline. Changes will sync when reconnected.</span>
      </div>
    </div>
  );
}
```

---

## 9. Loading State Patterns

### 9.1 Skeleton Components

```typescript
// components/ideas/idea-skeleton.tsx

export function IdeaCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      {/* Score badge */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg" />
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>

      {/* Brief */}
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-3">
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
        <div className="h-6 w-12 bg-gray-200 rounded-full" />
      </div>

      {/* Status dropdown */}
      <div className="h-10 bg-gray-200 rounded-md w-full" />
    </div>
  );
}

export function IdeaGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <IdeaCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

```typescript
// components/ideas/detail-skeleton.tsx

export function DetailSkeleton() {
  return (
    <div className="p-4 lg:p-6 animate-pulse">
      {/* Score section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-gray-200 rounded-xl" />
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </div>

      {/* Brief */}
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>

      {/* Accordion sections */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border-b border-gray-200 py-4">
          <div className="h-5 bg-gray-200 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}
```

### 9.2 Loading States by View

| View | Loading Pattern | Duration Target |
|------|-----------------|-----------------|
| Initial Dashboard | Grid of 8 skeleton cards | <3s |
| Filter Change | Skeleton overlay on grid | <500ms |
| Detail Panel Open | Detail skeleton | <300ms |
| Status Change | Spinner on dropdown | <200ms (optimistic) |
| Note Add | Spinner on button | <500ms |
| AI Generation | Progress bar + message | <10s |

### 9.3 Suspense Boundaries

```typescript
// app/(dashboard)/page.tsx

import { Suspense } from 'react';
import { IdeaGrid } from '@/components/ideas/idea-grid';
import { IdeaGridSkeleton } from '@/components/ideas/idea-skeleton';
import { StatusTabs } from '@/components/filters/status-tabs';

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <StatusTabs />

      <Suspense fallback={<IdeaGridSkeleton count={8} />}>
        <IdeaGrid />
      </Suspense>
    </div>
  );
}
```

### 9.4 Progressive Loading Pattern

```typescript
// components/ideas/idea-grid.tsx

export function IdeaGrid() {
  const { filters } = useFilters();
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } = useIdeas(filters);

  return (
    <div className="relative">
      {/* Show subtle loading indicator for background refetches */}
      {isFetching && !isLoading && (
        <div className="absolute top-0 right-0">
          <LoadingSpinner size="sm" />
        </div>
      )}

      {isLoading ? (
        <IdeaGridSkeleton />
      ) : data?.pages.length === 0 ? (
        <EmptyState
          title="No ideas yet"
          description="Start capturing your business ideas"
          action={{ label: "Add Idea", onClick: openCreateModal }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data?.pages.flatMap(page =>
              page.ideas.map(idea => (
                <IdeaCard key={idea.id} idea={idea} />
              ))
            )}
          </div>

          {hasNextPage && (
            <InfiniteScrollTrigger onIntersect={fetchNextPage} />
          )}
        </>
      )}
    </div>
  );
}
```

---

## 10. Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial Load (FCP) | <1.5s | Lighthouse |
| Time to Interactive | <3.0s | Lighthouse |
| Dashboard Render (100 ideas) | <500ms | React DevTools |
| Detail Panel Open | <300ms | React DevTools |
| Filter Apply | <200ms | User perception |
| Status Change (optimistic) | <50ms | User perception |
| Lighthouse Performance | >85 | Lighthouse |
| Bundle Size (main) | <200KB gzipped | Build output |
| **Generation Trigger** | <200ms | User perception (to show progress) |
| **Generation Complete** | <60s | Cloud Function execution |

---

## 11. Generation UI Patterns (NEW)

### 11.1 Polling Strategy

**TanStack Query Polling Configuration**:

```typescript
// useGenerationStatus hook configuration
useQuery({
  queryKey: generationKeys.status(),
  queryFn: fetchGenerationStatus,

  // Conditional polling: only while generating
  refetchInterval: (query) => {
    const data = query.state.data as GenerationStatus | undefined;
    if (data?.isGenerating) {
      return 2000;  // Poll every 2 seconds
    }
    return false;  // Stop polling
  },

  // Don't poll in background tabs
  refetchIntervalInBackground: false,

  // Always fetch fresh (no stale data)
  staleTime: 0,
});
```

**Polling Lifecycle**:
1. User clicks "Generate Ideas"
2. `useGenerateIdeas` mutation starts → Sets `isGenerating: true` optimistically
3. `useGenerationStatus` starts polling every 2s
4. UI shows `GenerationProgress` component
5. Each poll updates `stage` and `progress` values
6. When `isGenerating: false` returned → Stop polling
7. Cache invalidation triggers idea list refresh

**Timeout Handling**:
```typescript
// Maximum polling duration: 10 minutes
const MAX_POLLING_DURATION = 10 * 60 * 1000;

function useGenerationStatus() {
  const startTimeRef = useRef<number | null>(null);

  return useQuery({
    queryKey: generationKeys.status(),
    queryFn: async () => {
      // Check timeout
      if (startTimeRef.current && Date.now() - startTimeRef.current > MAX_POLLING_DURATION) {
        throw new Error('Generation timed out. Please try again.');
      }
      return fetchGenerationStatus();
    },
    // ...
  });
}
```

### 11.2 Progress States

**State Machine**:
```
┌──────────────┐
│    IDLE      │ ← Default state, button enabled
└──────┬───────┘
       │ Click "Generate"
       ▼
┌──────────────┐
│  COLLECTING  │ ← "Collecting market data..." (0-20%)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  ANALYZING   │ ← "Analyzing trends..." (20-40%)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  GENERATING  │ ← "Generating ideas..." (40-70%)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   SCORING    │ ← "Scoring ideas..." (70-90%)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   SAVING     │ ← "Saving to portfolio..." (90-100%)
└──────┬───────┘
       │
       ├──────────────────┐
       ▼                  ▼
┌──────────────┐   ┌──────────────┐
│   SUCCESS    │   │    ERROR     │
│              │   │              │
│ Toast:       │   │ Toast:       │
│ "Generated   │   │ "Generation  │
│  12 ideas!"  │   │  failed"     │
└──────────────┘   └──────────────┘
```

**Progress Bar Calculation**:
```typescript
const stageProgress: Record<string, { min: number; max: number }> = {
  collecting: { min: 0, max: 20 },
  analyzing: { min: 20, max: 40 },
  generating: { min: 40, max: 70 },
  scoring: { min: 70, max: 90 },
  saving: { min: 90, max: 100 },
};

function calculateProgress(stage: string, stageProgress?: number): number {
  const { min, max } = stageProgress[stage] || { min: 0, max: 0 };
  const range = max - min;
  const localProgress = stageProgress || 50;  // Default to midpoint
  return min + (range * localProgress / 100);
}
```

### 11.3 Error Handling

**Generation Error Types**:
| Error | User Message | Recovery Action |
|-------|--------------|-----------------|
| `RATE_LIMITED` | "Please wait before generating more ideas" | Show countdown timer |
| `SOURCE_FAILED` | "Some data sources unavailable" | Partial results OK, show warning |
| `ALL_SOURCES_FAILED` | "Unable to fetch market data" | Retry button |
| `AI_FAILED` | "AI processing failed" | Retry button |
| `TIMEOUT` | "Generation took too long" | Retry button |
| `UNAUTHORIZED` | "Please log in again" | Redirect to login |

**Error Recovery UI**:
```typescript
function GenerationErrorBanner({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="bg-red-50 border-b border-red-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircleIcon className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-800">{error}</span>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}
```

### 11.4 Source Filtering

**URL Parameter**:
```
/?source=ai-generated,trend-suggested
```

**Filter Component**:
```typescript
function SourceFilter() {
  const { filters, setFilters } = useFilters();
  const sources = filters.source || [];

  const toggleSource = (source: IdeaSource) => {
    if (sources.includes(source)) {
      setFilters({ source: sources.filter(s => s !== source) });
    } else {
      setFilters({ source: [...sources, source] });
    }
  };

  return (
    <div className="flex gap-2">
      <FilterChip
        active={sources.includes('ai-generated')}
        onClick={() => toggleSource('ai-generated')}
        icon={<SparklesIcon />}
        color="purple"
      >
        AI Generated
      </FilterChip>
      <FilterChip
        active={sources.includes('trend-suggested')}
        onClick={() => toggleSource('trend-suggested')}
        icon={<TrendingUpIcon />}
        color="blue"
      >
        Trends
      </FilterChip>
      <FilterChip
        active={sources.includes('manual')}
        onClick={() => toggleSource('manual')}
        icon={<PencilIcon />}
        color="gray"
      >
        Manual
      </FilterChip>
    </div>
  );
}
```

### 11.5 New Idea Highlighting

**NewBadge Visibility Logic**:
```typescript
// In Firestore, when user opens detail view:
async function markIdeaAsViewed(ideaId: string) {
  await updateDoc(doc(db, 'users', userId, 'ideas', ideaId), {
    viewedAt: serverTimestamp(),
  });
}

// NewBadge component logic:
function shouldShowNewBadge(idea: Idea): boolean {
  // Not viewed yet
  if (idea.viewedAt) return false;

  // Created within last 24 hours
  const createdAt = new Date(idea.createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  return hoursDiff < 24;
}
```

**Visual Treatment for New Ideas**:
- Pulsing "NEW" badge in corner
- Subtle purple glow on card border (for AI-generated)
- Cards sorted to top when status tab is "New"

### 11.6 Generation History

**Firestore Structure**:
```
users/{userId}/generationRuns/{runId}
├── runId: string
├── timestamp: Timestamp
├── ideasGenerated: number
├── ideasSaved: number
├── sources: string[]
├── duration: number (ms)
├── success: boolean
└── errors: string[]
```

**History List UI**:
```typescript
function GenerationHistory() {
  const { data: history, isLoading } = useGenerationHistory(5);
  const { setFilters } = useFilters();

  if (isLoading) return <HistorySkeleton />;

  return (
    <div className="space-y-2">
      {history?.map(run => (
        <div key={run.runId} className="p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium">
                {run.ideasGenerated} ideas generated
              </p>
              <p className="text-xs text-gray-500">
                {formatRelativeTime(run.timestamp)} • {run.sources.join(', ')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ runId: run.runId })}
            >
              View Ideas →
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | April 8, 2026 | Michal Xu | Initial frontend architecture specification |
| 2.0 | April 8, 2026 | Michal Xu | **Pipeline-First MVP Update**: Added generation components (GenerateIdeasButton, GenerationProgress, GenerationSettings, SourceBadge, NewBadge, GenerationHistory), generation query keys/hooks, polling strategy, updated data flow diagrams, source filtering, Section 11 (Generation UI Patterns) |
| 2.1 | April 9, 2026 | Michal Xu | **Source-Specific Generation**: Replaced GenerateIdeasButton with GenerateButtonGroup featuring dropdown for source-specific generation, added source-icons.tsx with sourceConfig, updated useGenerateIdeas hook to support `'all' \| DataSource[]`, enhanced GenerationProgress with source-specific messaging, added `appstore` as 4th data source |

---

*This document serves as the technical blueprint for Idea Forge's frontend implementation. All development should reference this specification for consistency. **AI-powered idea generation is now the primary value proposition.***
