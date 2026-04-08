# Idea Forge: Layout & Interaction Patterns

**Status**: Design Specification
**Version**: 1.0
**Date**: April 8, 2026
**Author**: Petra Park (Design Team)

---

## 1. Grid System

### 1.1 Breakpoints

| Breakpoint | Name | Min Width | Max Width | Use Case |
|------------|------|-----------|-----------|----------|
| `xs` | Mobile | 0px | 639px | Phones (portrait) |
| `sm` | Mobile Large | 640px | 767px | Phones (landscape) |
| `md` | Tablet | 768px | 1023px | Tablets, small laptops |
| `lg` | Desktop Narrow | 1024px | 1279px | Laptops, small monitors |
| `xl` | Desktop Wide | 1280px | 1535px | Standard monitors |
| `2xl` | Desktop Extra Wide | 1536px+ | - | Large monitors, ultrawide |

**Tailwind Classes**: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

### 1.2 Column System

| Breakpoint | Columns | Column Width | Gutter | Notes |
|------------|---------|--------------|--------|-------|
| Mobile (`xs`, `sm`) | 1 | 100% | 0px | Single column, full width cards |
| Tablet (`md`) | 2 | ~50% | 16px | Two-column grid |
| Desktop Narrow (`lg`) | 4 | ~25% | 20px | Standard four-column grid |
| Desktop Wide (`xl`, `2xl`) | 4 | ~25% | 24px | Same columns, wider gutters |

**Card Width Calculations**:
```
Mobile:     100% - (2 × padding) = calc(100% - 32px)
Tablet:     (100% - gutter - 2 × padding) / 2 = calc((100% - 16px - 32px) / 2)
Desktop:    (100% - 3 × gutter - 2 × padding) / 4 = calc((100% - 60px - 32px) / 4)
```

### 1.3 Container & Spacing

| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| **Max Content Width** | 100% | 100% | 1440px |
| **Container Padding** | 16px | 24px | 32px |
| **Card Gap (Vertical)** | 16px | 20px | 24px |
| **Card Gap (Horizontal)** | 0px | 16px | 20px/24px |
| **Section Spacing** | 24px | 32px | 40px |

**Tailwind Container Config**:
```css
.container {
  @apply mx-auto px-4 sm:px-6 lg:px-8;
  max-width: 1440px;
}

/* Grid layout */
.idea-grid {
  @apply grid gap-4 md:gap-5 lg:gap-6;
  @apply grid-cols-1 md:grid-cols-2 lg:grid-cols-4;
}
```

### 1.4 Grid Layout Diagram

```
MOBILE (< 640px)                    TABLET (768px - 1023px)
┌──────────────────────────┐        ┌─────────────────────────────┐
│ ← 16px →│ Content │← 16px│        │← 24px →│         │← 24px →│
├──────────────────────────┤        ├─────────┬────16px┬──────────┤
│ ┌──────────────────────┐ │        │ ┌───────┐        ┌───────┐ │
│ │       Card 1         │ │        │ │ Card 1│        │ Card 2│ │
│ └──────────────────────┘ │        │ └───────┘        └───────┘ │
│         ↕ 16px           │        │         ↕ 20px             │
│ ┌──────────────────────┐ │        │ ┌───────┐        ┌───────┐ │
│ │       Card 2         │ │        │ │ Card 3│        │ Card 4│ │
│ └──────────────────────┘ │        │ └───────┘        └───────┘ │
└──────────────────────────┘        └─────────────────────────────┘

DESKTOP (1024px+)
┌─────────────────────────────────────────────────────────────────┐
│ ← 32px →│                   Content                    │← 32px │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────┐ ←20px→ ┌──────┐ ←20px→ ┌──────┐ ←20px→ ┌──────┐      │
│ │Card 1│        │Card 2│        │Card 3│        │Card 4│      │
│ └──────┘        └──────┘        └──────┘        └──────┘      │
│                        ↕ 24px                                   │
│ ┌──────┐        ┌──────┐        ┌──────┐        ┌──────┐      │
│ │Card 5│        │Card 6│        │Card 7│        │Card 8│      │
│ └──────┘        └──────┘        └──────┘        └──────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Page Layouts

### 2.1 Dashboard Layout

The dashboard is the primary interface for browsing and managing ideas.

#### Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER (Fixed)                          │
│  Height: 64px                                                   │
│  [Logo] Idea Forge              [Search] [Filter] [+ New Idea]  │
├─────────────────────────────────────────────────────────────────┤
│                         STATUS TABS                             │
│  Height: 48px                                                   │
│  [All] [Reviewing] [Pursuing] [Parked] [Rejected]               │
├─────────────────────────────────────────────────────────────────┤
│                      SORT/VIEW CONTROLS                         │
│  Height: 44px                                                   │
│  Sort: [Score ▼] [Date] [Name]           View: [Grid] [List]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                     SCROLLABLE CONTENT AREA                     │
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ Idea 1  │ │ Idea 2  │ │ Idea 3  │ │ Idea 4  │               │
│  │ ★ 4.2   │ │ ★ 3.8   │ │ ★ 4.5   │ │ ★ 2.9   │               │
│  │ Brief.. │ │ Brief.. │ │ Brief.. │ │ Brief.. │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ Idea 5  │ │ Idea 6  │ │ Idea 7  │ │ Idea 8  │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                 │
│                    ┌──────────────┐                             │
│                    │  Load More   │                             │
│                    └──────────────┘                             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                      BULK ACTION BAR                            │
│  (Appears when items selected)                                  │
│  Height: 56px                                                   │
│  3 selected    [Set Status ▼] [Compare] [Archive] [✕]          │
└─────────────────────────────────────────────────────────────────┘
```

#### Component Specifications

| Component | Height | Position | Behavior |
|-----------|--------|----------|----------|
| Header | 64px | Fixed top | Always visible, `z-index: 50` |
| Status Tabs | 48px | Sticky below header | Scrolls with content on mobile |
| Sort/View Controls | 44px | Static | Part of content flow |
| Content Area | Flexible | Scrollable | `min-height: calc(100vh - 156px)` |
| Load More Button | 48px | At content end | Visible when more items exist |
| Bulk Action Bar | 56px | Fixed bottom | Appears with selection, `z-index: 40` |

**Tailwind Implementation**:
```css
/* Header */
.dashboard-header {
  @apply fixed top-0 left-0 right-0 h-16 bg-white border-b;
  @apply flex items-center justify-between px-4 lg:px-8;
  z-index: 50;
}

/* Content wrapper */
.dashboard-content {
  @apply pt-16; /* Offset for fixed header */
  min-height: 100vh;
}

/* Status tabs */
.status-tabs {
  @apply sticky top-16 bg-white border-b z-30;
  @apply flex items-center h-12 px-4 lg:px-8 gap-2;
}

/* Bulk action bar */
.bulk-action-bar {
  @apply fixed bottom-0 left-0 right-0 h-14 bg-gray-900 text-white;
  @apply flex items-center justify-between px-4 lg:px-8;
  z-index: 40;
}
```

### 2.2 Detail View Layout

The detail view displays comprehensive information about a single idea.

#### Desktop: Slide-Over Panel

```
┌──────────────────────────────┬──────────────────────────────────┐
│                              │                                  │
│   Dashboard Grid             │   DETAIL PANEL (40% width)       │
│   (Dimmed/Blurred)           │   Min: 400px, Max: 600px         │
│                              │                                  │
│   ┌───────┐  ┌───────┐      │ ┌──────────────────────────────┐ │
│   │ Card  │  │ Card  │      │ │ HEADER (Fixed)               │ │
│   │(dim)  │  │(dim)  │      │ │ [← Back]  Company Name  [⋮]  │ │
│   └───────┘  └───────┘      │ │ Height: 56px                 │ │
│                              │ ├──────────────────────────────┤ │
│   ┌───────┐  ┌───────┐      │ │                              │ │
│   │ Card  │  │ Card  │      │ │ SCROLLABLE CONTENT           │ │
│   │(dim)  │  │(dim)  │      │ │                              │ │
│   └───────┘  └───────┘      │ │ ★ 4.2 / 5.0  Overall Score   │ │
│                              │ │                              │ │
│   ┌───────┐  ┌───────┐      │ │ "Brief description of the    │ │
│   │ Card  │  │ Card  │      │ │ idea in two sentences..."    │ │
│   │(dim)  │  │(dim)  │      │ │                              │ │
│   └───────┘  └───────┘      │ │ ▶ Strengths (3)              │ │
│                              │ │ ▶ Risks (2)                  │ │
│                              │ │ ▶ Business Plan              │ │
│                              │ │ ▶ Elevator Pitch             │ │
│                              │ │ ▶ Detailed Scores            │ │
│                              │ │                              │ │
│                              │ │ MY NOTES                     │ │
│                              │ │ [Add note...]                │ │
│                              │ │                              │ │
│                              │ ├──────────────────────────────┤ │
│                              │ │ STATUS SELECTOR (Fixed)      │ │
│                              │ │ [Reviewing ▼]                │ │
│                              │ │ Height: 64px                 │ │
│                              │ └──────────────────────────────┘ │
└──────────────────────────────┴──────────────────────────────────┘
```

#### Mobile: Full-Screen Overlay

```
┌─────────────────────────────────────┐
│ HEADER (Fixed)                      │
│ [← Back]    Company Name       [⋮]  │
│ Height: 56px                        │
├─────────────────────────────────────┤
│                                     │
│ SCROLLABLE CONTENT                  │
│                                     │
│ ★ 4.2 / 5.0                        │
│ Overall Score                       │
│                                     │
│ ─────────────────────────────────   │
│                                     │
│ "Brief description of the idea     │
│ in one or two sentences that       │
│ captures the essence..."           │
│                                     │
│ ─────────────────────────────────   │
│                                     │
│ ▶ Strengths (3)                    │
│                                     │
│ ▶ Risks (2)                        │
│                                     │
│ ▶ Business Plan                    │
│                                     │
│ ▶ Elevator Pitch                   │
│                                     │
│ ▶ Detailed Scores                  │
│                                     │
│ ─────────────────────────────────   │
│                                     │
│ MY NOTES                           │
│ ┌─────────────────────────────────┐ │
│ │ Add a note...                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ • Note from March 15               │
│ • Note from March 10               │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ STATUS SELECTOR (Fixed Bottom)      │
│ ┌─────────────────────────────────┐ │
│ │       Reviewing ▼               │ │
│ └─────────────────────────────────┘ │
│ Height: 80px (with safe area)       │
└─────────────────────────────────────┘
```

#### Component Specifications

| Component | Desktop | Mobile |
|-----------|---------|--------|
| Panel Width | 40% (min 400px, max 600px) | 100% |
| Header Height | 56px (fixed) | 56px (fixed) |
| Content Padding | 24px | 16px |
| Footer Height | 64px (fixed) | 80px (with safe area) |
| Accordion Gap | 12px | 8px |
| Section Padding | 16px | 12px |

**Tailwind Implementation**:
```css
/* Desktop slide-over */
.detail-panel {
  @apply fixed right-0 top-0 bottom-0 bg-white shadow-xl;
  @apply w-[40%] min-w-[400px] max-w-[600px];
  z-index: 50;
}

/* Mobile full-screen */
@media (max-width: 767px) {
  .detail-panel {
    @apply w-full min-w-0 max-w-none;
  }
}

/* Panel header */
.detail-header {
  @apply sticky top-0 h-14 bg-white border-b;
  @apply flex items-center justify-between px-4 lg:px-6;
}

/* Panel content */
.detail-content {
  @apply flex-1 overflow-y-auto p-4 lg:p-6;
  @apply pb-20 lg:pb-16; /* Space for fixed footer */
}

/* Panel footer */
.detail-footer {
  @apply fixed bottom-0 left-0 right-0 lg:left-auto;
  @apply h-16 lg:h-16 bg-white border-t p-4;
  @apply pb-safe; /* iOS safe area */
}

/* Background overlay */
.detail-overlay {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm;
  z-index: 40;
}
```

### 2.3 Compare View Layout

Side-by-side comparison of up to 3 ideas. **Desktop only**.

```
┌─────────────────────────────────────────────────────────────────┐
│ COMPARE HEADER                                              [✕] │
│ Compare Ideas (3)                                     [Done]    │
│ Height: 56px                                                    │
├───────────────────────┬───────────────────┬─────────────────────┤
│                       │                   │                     │
│   IDEA A              │   IDEA B          │   IDEA C            │
│   ─────────           │   ─────────       │   ─────────         │
│   Company Alpha       │   Company Beta    │   Company Gamma     │
│   ★ 4.2              │   ★ 3.8          │   ★ 4.5            │
│                       │                   │                     │
│   SCORES              │   SCORES          │   SCORES            │
│   ───────             │   ───────         │   ───────           │
│   Business: 4.5       │   Business: 3.0   │   Business: 4.8     │
│   Dev Cmplx: 3.8      │   Dev Cmplx: 4.5  │   Dev Cmplx: 4.2    │
│   Time to Mkt: 4.0    │   Time to Mkt: 3.5│   Time to Mkt: 4.0  │
│   Competition: 4.2    │   Competition: 4.0│   Competition: 5.0  │
│   Risk: 4.5           │   Risk: 3.8       │   Risk: 4.0         │
│                       │                   │                     │
│   STRENGTHS           │   STRENGTHS       │   STRENGTHS         │
│   ───────────         │   ───────────     │   ───────────       │
│   • Point 1           │   • Point 1       │   • Point 1         │
│   • Point 2           │   • Point 2       │   • Point 2         │
│   • Point 3           │   • Point 3       │   • Point 3         │
│                       │                   │                     │
│   RISKS               │   RISKS           │   RISKS             │
│   ─────               │   ─────           │   ─────             │
│   • Risk 1            │   • Risk 1        │   • Risk 1          │
│   • Risk 2            │   • Risk 2        │   • Risk 2          │
│                       │                   │                     │
├───────────────────────┼───────────────────┼─────────────────────┤
│  [Set Pursuing ▼]     │  [Set Parked ▼]   │  [Set Pursuing ▼]   │
│                       │                   │                     │
└───────────────────────┴───────────────────┴─────────────────────┘
```

#### Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Max Ideas | 3 | Maintains scanability |
| Min Width | 1024px | Desktop only |
| Column Width | 33.33% (3 ideas), 50% (2 ideas) | Equal distribution |
| Column Gap | 1px (divider line) | Visual separation |
| Scroll Behavior | Synchronized | All columns scroll together |
| Header Height | 56px | Fixed |
| Footer Height | 64px | Fixed, contains status selectors |

**Tailwind Implementation**:
```css
/* Compare container */
.compare-view {
  @apply fixed inset-0 bg-white z-50;
  @apply hidden lg:flex flex-col; /* Desktop only */
}

/* Compare header */
.compare-header {
  @apply h-14 border-b flex items-center justify-between px-6;
}

/* Compare columns wrapper */
.compare-columns {
  @apply flex-1 flex overflow-hidden;
}

/* Individual column */
.compare-column {
  @apply flex-1 border-r last:border-r-0 overflow-y-auto;
  @apply flex flex-col;
}

/* Synchronized scroll (JS required) */
.compare-column.scroll-sync {
  scroll-behavior: smooth;
}

/* Column content */
.compare-column-content {
  @apply flex-1 p-4 lg:p-6;
}

/* Column footer */
.compare-column-footer {
  @apply h-16 border-t p-4 bg-gray-50;
}
```

---

## 3. Responsive Patterns

### 3.1 Pattern Matrix

| Feature | Mobile (`<768px`) | Desktop (`>=768px`) |
|---------|-------------------|---------------------|
| **Grid columns** | 1 | 2 (tablet) / 4 (desktop) |
| **Detail view** | Full-screen overlay | Slide-over panel (40% width) |
| **Filters** | Bottom sheet | Dropdown panel |
| **Compare** | Not available | Side-by-side (max 3) |
| **Bulk select** | Long-press to enter mode | Checkbox on hover |
| **Navigation** | Swipe between ideas | Arrow keys |
| **Status change** | Action sheet | Inline dropdown |
| **Search** | Expandable (tap icon) | Always visible in header |
| **Note-taking** | Full-screen editor | Inline textarea |
| **Filter panel** | Bottom sheet (swipe up) | Dropdown (click to toggle) |
| **Sort options** | Action sheet | Dropdown menu |

### 3.2 Mobile-First Approach

Content and features designed for mobile first, then enhanced for desktop.

#### Priority Content (Mobile)
1. Idea cards with essential info (name, score, brief, status)
2. Quick status change via action sheet
3. Search functionality
4. Basic filtering

#### Enhanced Features (Desktop)
1. Compare view (side-by-side)
2. Bulk selection via checkboxes
3. Keyboard shortcuts
4. Hover interactions
5. Multi-column grid

### 3.3 Touch vs. Pointer Interactions

| Interaction | Touch (Mobile) | Pointer (Desktop) |
|-------------|----------------|-------------------|
| Open detail | Tap card | Click card |
| Quick actions | Long-press → action sheet | Hover → dropdown |
| Select multiple | Long-press to enter mode, tap to toggle | Checkbox on hover |
| Navigate ideas | Swipe left/right in detail view | Arrow keys |
| Refresh | Pull-to-refresh | Click refresh button |
| Dismiss panel | Swipe down | Click outside or Escape |
| Archive | Swipe left (with undo) | Right-click menu or bulk action |

### 3.4 Breakpoint-Specific Behaviors

```javascript
// Responsive behavior config
const responsiveConfig = {
  mobile: {
    breakpoint: '< 768px',
    grid: { columns: 1 },
    detailView: 'fullscreen',
    filters: 'bottomSheet',
    compare: 'disabled',
    selection: 'longPress',
  },
  tablet: {
    breakpoint: '768px - 1023px',
    grid: { columns: 2 },
    detailView: 'slideOver',
    filters: 'dropdown',
    compare: 'disabled',
    selection: 'checkbox',
  },
  desktop: {
    breakpoint: '>= 1024px',
    grid: { columns: 4 },
    detailView: 'slideOver',
    filters: 'dropdown',
    compare: 'enabled',
    selection: 'checkbox',
  },
};
```

---

## 4. Animation & Transition Patterns

### 4.1 Timing Standards

| Duration | Name | Use Cases |
|----------|------|-----------|
| 100ms | `instant` | Micro-feedback (button press, checkbox) |
| 150ms | `fast` | Hover states, small toggles |
| 200ms | `normal` | Most UI transitions |
| 300ms | `slow` | Panel slides, modal opens |
| 500ms | `deliberate` | Page transitions, loading states |

**CSS Custom Properties**:
```css
:root {
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-deliberate: 500ms;
}
```

### 4.2 Easing Curves

| Name | CSS Value | Use Cases |
|------|-----------|-----------|
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering (slide-in, fade-in) |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements exiting (slide-out, fade-out) |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Elements moving (position changes) |
| `spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful interactions (bounce effect) |

**Tailwind Classes**:
```css
/* Standard easing */
.transition-standard {
  @apply transition-all duration-200 ease-out;
}

/* Panel slide */
.transition-panel {
  @apply transition-transform duration-300 ease-out;
}

/* Modal fade */
.transition-modal {
  @apply transition-opacity duration-200 ease-out;
}
```

### 4.3 Micro-Interactions

#### Button Press
```css
/* Rest state */
.btn {
  @apply transform scale-100;
  @apply transition-transform duration-100 ease-out;
}

/* Pressed state */
.btn:active {
  @apply scale-95;
}

/* Hover state (desktop) */
.btn:hover:not(:active) {
  @apply scale-102; /* Custom: 1.02 */
}
```

#### Checkbox Toggle
```css
.checkbox {
  @apply transition-all duration-150 ease-out;
}

.checkbox-checked {
  /* Checkmark animation */
  animation: checkmark 150ms ease-out forwards;
}

@keyframes checkmark {
  0% { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
}
```

#### Status Badge Change
```css
.status-badge {
  @apply transition-colors duration-200 ease-out;
}

/* Status change pulse */
.status-badge.changed {
  animation: status-pulse 400ms ease-out;
}

@keyframes status-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

### 4.4 Page Transitions

#### Panel Slide-In (Detail View)
```css
/* Initial state (hidden) */
.detail-panel {
  @apply translate-x-full;
  @apply transition-transform duration-300 ease-out;
}

/* Open state */
.detail-panel.open {
  @apply translate-x-0;
}

/* Overlay fade */
.detail-overlay {
  @apply opacity-0;
  @apply transition-opacity duration-200 ease-out;
}

.detail-overlay.visible {
  @apply opacity-100;
}
```

#### Modal Fade
```css
/* Initial state */
.modal {
  @apply opacity-0 scale-95;
  @apply transition-all duration-200 ease-out;
}

/* Open state */
.modal.open {
  @apply opacity-100 scale-100;
}
```

#### Filter Panel (Desktop Dropdown)
```css
/* Initial state */
.filter-panel {
  @apply opacity-0 -translate-y-2;
  @apply transition-all duration-200 ease-out;
  @apply pointer-events-none;
}

/* Open state */
.filter-panel.open {
  @apply opacity-100 translate-y-0;
  @apply pointer-events-auto;
}
```

#### Filter Panel (Mobile Bottom Sheet)
```css
/* Initial state */
.bottom-sheet {
  @apply translate-y-full;
  @apply transition-transform duration-300 ease-out;
}

/* Open state */
.bottom-sheet.open {
  @apply translate-y-0;
}
```

### 4.5 Loading States

#### Skeleton Shimmer
```css
.skeleton {
  @apply bg-gray-200 rounded;
  animation: shimmer 1.5s infinite;
  background: linear-gradient(
    90deg,
    #e5e7eb 0%,
    #f3f4f6 50%,
    #e5e7eb 100%
  );
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

#### Spinner
```css
.spinner {
  @apply w-5 h-5 border-2 border-gray-200 border-t-primary-600 rounded-full;
  animation: spin 750ms linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### Progress Bar (AI Processing)
```css
.progress-bar {
  @apply h-1 bg-gray-200 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-primary-600;
  @apply transition-all duration-300 ease-out;
}

/* Indeterminate progress */
.progress-indeterminate .progress-fill {
  @apply w-1/3;
  animation: progress-indeterminate 1.5s ease-in-out infinite;
}

@keyframes progress-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
```

### 4.6 State Transitions

#### Card Hover (Desktop)
```css
.idea-card {
  @apply transition-all duration-150 ease-out;
  @apply shadow-sm;
}

.idea-card:hover {
  @apply shadow-md -translate-y-0.5;
}
```

#### Selection State
```css
.idea-card.selected {
  @apply ring-2 ring-primary-500 ring-offset-2;
  @apply transition-all duration-150 ease-out;
}
```

#### Accordion Expand
```css
.accordion-content {
  @apply grid;
  @apply transition-all duration-200 ease-out;
  grid-template-rows: 0fr;
}

.accordion-content.expanded {
  grid-template-rows: 1fr;
}

.accordion-inner {
  @apply overflow-hidden;
}

/* Chevron rotation */
.accordion-chevron {
  @apply transition-transform duration-200 ease-out;
}

.accordion-chevron.expanded {
  @apply rotate-180;
}
```

---

## 5. Gesture Patterns (Mobile)

### 5.1 Pull to Refresh

**Trigger**: Pull down from top of scrollable content area
**Threshold**: 80px pull distance
**Feedback**: Spinner appears, rotates with pull distance

```
┌─────────────────────────┐
│                         │
│    ↓ Pull to refresh    │  ← Instruction appears at 40px
│                         │
│         ◌               │  ← Spinner appears at 60px, spins at 80px
│                         │
├─────────────────────────┤
│  [Content refreshes]    │
│                         │
└─────────────────────────┘
```

**Implementation Notes**:
- Use `overscroll-behavior: contain` to prevent browser refresh
- Show loading indicator during API call
- Haptic feedback on threshold (if supported)

### 5.2 Swipe Navigation (Detail View)

**Trigger**: Horizontal swipe in detail view
**Threshold**: 50px swipe distance
**Behavior**: Navigate to previous/next idea

```
         ← Swipe Left               Swipe Right →
┌───────────────────┐         ┌───────────────────┐
│                   │         │                   │
│   Current Idea    │ ──────► │    Next Idea      │
│                   │         │                   │
│                   │ ◄────── │                   │
│                   │         │                   │
└───────────────────┘         └───────────────────┘
```

**Visual Feedback**:
- Partial reveal of adjacent idea during swipe
- Snap animation to complete or cancel
- Dot indicators for position (optional)

### 5.3 Long-Press for Selection Mode

**Trigger**: 500ms press on idea card
**Feedback**: Haptic vibration, card visually highlights

```
State 1: Normal          State 2: Selection Mode
┌───────────┐            ┌───────────┐
│ Idea 1    │            │ ☑ Idea 1  │  ← Checkbox appears
│ ★ 4.2    │  ──────►   │ ★ 4.2    │
│ Brief...  │  (hold)    │ Brief...  │
└───────────┘            └───────────┘

┌───────────┐            ┌───────────┐
│ Idea 2    │            │ ☐ Idea 2  │  ← Can tap to select
│ ★ 3.8    │            │ ★ 3.8    │
└───────────┘            └───────────┘
```

**Exit Selection Mode**:
- Tap "✕" in bulk action bar
- Deselect all items
- Navigate away from page

### 5.4 Swipe to Archive

**Trigger**: Horizontal swipe on card (left direction)
**Threshold**: 100px (30% of card width)
**Behavior**: Archives idea with undo option

```
Step 1: Initial Swipe
┌───────────────────────────────────────────┐
│ ←←←←←←← │ Idea Name        │  ARCHIVE    │
│         │ ★ 4.2           │  (red bg)   │
└───────────────────────────────────────────┘

Step 2: Release past threshold
┌───────────────────────────────────────────┐
│              Idea archived                 │
│                              [UNDO]       │
└───────────────────────────────────────────┘
         ↑ Toast notification (5 seconds)
```

**Implementation Notes**:
- Use `react-swipeable` or native touch events
- Show red background with archive icon as hint
- Keep in list for 5 seconds with undo option
- Animate removal after undo timeout

### 5.5 Dismiss Bottom Sheet

**Trigger**: Swipe down on bottom sheet handle or content
**Threshold**: 100px or velocity > 0.5

```
┌─────────────────────────────────────┐
│              ━━━━━                   │  ← Handle (swipe target)
│                                     │
│  FILTERS                     [Clear]│
│  ─────────────────────────────────  │
│                                     │
│  Score Range                        │
│  [====○========] 5.0 - 10.0        │
│                                     │
│           ↓ Swipe down              │
└─────────────────────────────────────┘
                 │
                 ↓
         (Sheet dismisses)
```

---

## 6. Keyboard Navigation (Desktop)

### 6.1 Global Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `/` or `Cmd+K` | Focus search | Anywhere |
| `n` | New idea | Dashboard (no input focused) |
| `Escape` | Close panel/modal, clear selection | Anywhere |
| `?` | Show keyboard shortcuts help | Anywhere |

### 6.2 Dashboard Navigation

| Key | Action |
|-----|--------|
| `j` | Move to next card |
| `k` | Move to previous card |
| `Enter` | Open selected card detail view |
| `x` | Toggle selection on focused card |
| `a` | Select all visible cards |
| `Shift+A` | Deselect all |

**Focus Ring Implementation**:
```css
.idea-card:focus-visible {
  @apply outline-none ring-2 ring-primary-500 ring-offset-2;
}
```

### 6.3 Detail View Navigation

| Key | Action |
|-----|--------|
| `Escape` | Close detail panel |
| `←` / `h` | Previous idea |
| `→` / `l` | Next idea |
| `s` | Open status dropdown |
| `1-5` | Set status (when dropdown open) |
| `Tab` | Navigate between sections |
| `Space` / `Enter` | Expand/collapse accordion section |

### 6.4 Filter Panel

| Key | Action |
|-----|--------|
| `f` | Toggle filter panel |
| `Tab` | Navigate filter options |
| `Space` | Toggle checkbox |
| `Enter` | Apply filters |
| `Escape` | Close filter panel |

### 6.5 Compare View

| Key | Action |
|-----|--------|
| `c` | Enter compare mode (with selected items) |
| `Escape` | Exit compare mode |
| `1` / `2` / `3` | Focus column 1, 2, or 3 |
| `s` | Change status in focused column |

### 6.6 Implementation Pattern

```javascript
// Keyboard navigation hook
function useKeyboardNav() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip if user is typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case 'j':
          focusNextCard();
          break;
        case 'k':
          focusPrevCard();
          break;
        case 'Enter':
          openFocusedCard();
          break;
        case 'Escape':
          closePanel();
          break;
        case '/':
          e.preventDefault();
          focusSearch();
          break;
        // ... etc
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
```

---

## 7. Accessibility Patterns

### 7.1 Focus Management

#### Panel Open/Close
```javascript
// When opening detail panel
const openDetailPanel = (ideaId) => {
  setDetailOpen(true);
  // After animation completes
  setTimeout(() => {
    closeButtonRef.current?.focus();
  }, 300);
};

// When closing detail panel
const closeDetailPanel = () => {
  setDetailOpen(false);
  // Return focus to the card that opened it
  lastFocusedCardRef.current?.focus();
};
```

#### Modal Focus Trap
```javascript
// Focus trap for modals
function FocusTrap({ children }) {
  const trapRef = useRef();

  useEffect(() => {
    const focusableEls = trapRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    const handleTab = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, []);

  return <div ref={trapRef}>{children}</div>;
}
```

### 7.2 Skip Links

```html
<!-- At the top of the page -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
<a href="#filters" class="skip-link">
  Skip to filters
</a>

<style>
.skip-link {
  @apply absolute -top-10 left-4 z-50;
  @apply bg-primary-600 text-white px-4 py-2 rounded;
  @apply focus:top-4;
  @apply transition-all duration-200;
}
</style>
```

### 7.3 Screen Reader Announcements

#### Live Regions
```html
<!-- Announce dynamic changes -->
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  class="sr-only"
>
  {announcement}
</div>
```

#### Announcement Triggers
| Action | Announcement |
|--------|--------------|
| Ideas loaded | "20 ideas loaded" |
| Filter applied | "Showing 5 ideas matching 'SaaS'" |
| Status changed | "Status changed to Pursuing" |
| Idea archived | "Idea archived. Press Cmd+Z to undo" |
| Selection changed | "3 ideas selected" |
| Panel opened | "Detail panel opened for [Idea Name]" |

### 7.4 Reduced Motion

```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Alternative: Use CSS custom property */
:root {
  --motion-duration: 200ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-duration: 0ms;
  }
}

.animated-element {
  transition-duration: var(--motion-duration);
}
```

### 7.5 Touch Target Sizes

| Element | Minimum Size | Recommended Size |
|---------|--------------|------------------|
| Buttons | 44px × 44px | 48px × 48px |
| Icons (interactive) | 44px × 44px | 44px × 44px |
| List items | 44px height | 48px+ height |
| Checkboxes | 44px tap area | 24px visual, 44px tap |
| Links (inline) | 44px tap area | Natural + padding |

**Implementation**:
```css
/* Icon button with proper touch target */
.icon-button {
  @apply relative w-10 h-10 flex items-center justify-center;
}

.icon-button::before {
  content: '';
  @apply absolute -inset-1; /* Extends tap area */
}

/* Checkbox with larger tap area */
.checkbox-wrapper {
  @apply flex items-center gap-3 py-2 -my-2 px-2 -mx-2;
  /* Creates 44px+ tall tap area */
}
```

### 7.6 Color Contrast

All text must meet WCAG 2.1 AA standards:

| Text Type | Min Ratio | Example |
|-----------|-----------|---------|
| Normal text (< 18px) | 4.5:1 | `text-gray-700` on white |
| Large text (>= 18px bold, >= 24px) | 3:1 | `text-gray-600` on white |
| UI components (icons, borders) | 3:1 | `border-gray-400` |

**Score Badge Colors (Accessible)**:
```css
/* Green - HOT tier */
.score-hot {
  @apply bg-green-100 text-green-800;
  /* Contrast: 4.8:1 ✓ */
}

/* Yellow - WARM tier */
.score-warm {
  @apply bg-yellow-100 text-yellow-800;
  /* Contrast: 4.6:1 ✓ */
}

/* Red - LOW tier */
.score-low {
  @apply bg-red-100 text-red-800;
  /* Contrast: 4.7:1 ✓ */
}
```

### 7.7 ARIA Patterns

#### Card Grid
```html
<div
  role="grid"
  aria-label="Ideas grid"
  aria-rowcount="24"
>
  <div role="row" aria-rowindex="1">
    <article
      role="gridcell"
      aria-label="Company Alpha, score 4.2"
      tabindex="0"
    >
      <!-- Card content -->
    </article>
  </div>
</div>
```

#### Accordion
```html
<div class="accordion">
  <h3>
    <button
      aria-expanded="false"
      aria-controls="strengths-content"
      id="strengths-header"
    >
      Strengths (3)
    </button>
  </h3>
  <div
    id="strengths-content"
    role="region"
    aria-labelledby="strengths-header"
    hidden
  >
    <!-- Content -->
  </div>
</div>
```

#### Status Dropdown
```html
<div class="status-selector">
  <button
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-label="Change status, currently Reviewing"
  >
    Reviewing
  </button>
  <ul role="listbox" aria-label="Status options" hidden>
    <li role="option" aria-selected="true">Reviewing</li>
    <li role="option" aria-selected="false">Pursuing</li>
    <li role="option" aria-selected="false">Parked</li>
    <li role="option" aria-selected="false">Rejected</li>
  </ul>
</div>
```

---

## Appendix A: Component Quick Reference

### Spacing Scale (Tailwind)

| Class | Value | Use Case |
|-------|-------|----------|
| `space-1` / `gap-1` | 4px | Tight grouping |
| `space-2` / `gap-2` | 8px | Related elements |
| `space-3` / `gap-3` | 12px | Default component spacing |
| `space-4` / `gap-4` | 16px | Card padding, section gaps |
| `space-6` / `gap-6` | 24px | Section separation |
| `space-8` / `gap-8` | 32px | Major sections |

### Z-Index Scale

| Level | Value | Use Case |
|-------|-------|----------|
| `base` | 0 | Default content |
| `dropdown` | 10 | Dropdown menus |
| `sticky` | 20 | Sticky headers |
| `fixed` | 30 | Fixed position elements |
| `modal-backdrop` | 40 | Modal/panel overlays |
| `modal` | 50 | Modals, slide-over panels |
| `popover` | 60 | Popovers, tooltips |
| `toast` | 70 | Toast notifications |

### Responsive Visibility

```css
/* Mobile only */
.mobile-only {
  @apply block md:hidden;
}

/* Desktop only */
.desktop-only {
  @apply hidden md:block;
}

/* Tablet and up */
.tablet-up {
  @apply hidden sm:block;
}
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | April 8, 2026 | Petra Park | Initial layout and interaction patterns |

---

*This document is part of the Idea Forge Design System. See also: [Color Tokens](./color-tokens.md), [Typography](./typography.md), [Component Library](./components.md).*
