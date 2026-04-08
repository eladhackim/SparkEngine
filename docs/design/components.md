# Idea Forge: Component Specifications

**Version**: 1.0
**Author**: Hila Mor
**Date**: 2026-04-08
**Status**: Complete

---

## Overview

This document specifies the UI components for Idea Forge, an AI-powered idea management platform. All components are designed for implementation with **Tailwind CSS + shadcn/ui** on **Next.js 14+**.

### Design Tokens Reference

```
Colors:
  Primary:     #3b82f6 (blue-500)
  Success:     #22c55e (green-500)
  Warning:     #eab308 (yellow-500)
  Danger:      #ef4444 (red-500)
  Purple:      #a855f7 (purple-500)
  Gray:        #6b7280 (gray-500)
  Dark Gray:   #374151 (gray-700)

Typography:
  Font Family: Inter, system-ui, sans-serif
  Base Size:   16px
  Scale:       xs(12px), sm(14px), base(16px), lg(18px), xl(20px), 2xl(24px)

Spacing:
  Unit:        4px
  Scale:       1(4px), 2(8px), 3(12px), 4(16px), 5(20px), 6(24px), 8(32px)

Radius:
  sm:          4px
  md:          6px
  lg:          8px
  full:        9999px

Shadows:
  sm:          0 1px 2px rgba(0,0,0,0.05)
  md:          0 4px 6px rgba(0,0,0,0.1)
  lg:          0 10px 15px rgba(0,0,0,0.1)
```

---

## 1. Idea Card Component

The primary component for displaying ideas in grid and list views.

### 1.1 Grid Card Variant

**Dimensions**: ~250px width (flexible), auto height
**Min Width**: 240px | **Max Width**: 280px

```
Visual Structure:
┌─────────────────────────────┐
│  ┌───────┐                  │  <- Score badge (top-left)
│  │  8.5  │  Company Name    │  <- Company name (bold)
│  └───────┘                  │
│                             │
│  "Brief description of the  │  <- Brief (2-line max, ellipsis)
│  idea in one or two lines"  │
│                             │
│  [SaaS] [AI] [Fintech]      │  <- Tags (max 3 visible)
│                             │
│  ┌───────────────────────┐  │
│  │     Reviewing  ▼      │  │  <- Status dropdown
│  └───────────────────────┘  │
└─────────────────────────────┘
```

**Anatomy**:
| Part | Specs |
|------|-------|
| Container | bg-white, rounded-lg, shadow-sm, border border-gray-200, p-4 |
| Score Badge | w-14, h-14, rounded-lg, font-bold, text-xl, color by score |
| Company Name | text-lg, font-semibold, text-gray-900, truncate |
| Brief | text-sm, text-gray-600, line-clamp-2 (2 lines max) |
| Tags Container | flex, flex-wrap, gap-1, mt-3 |
| Tag Chip | px-2, py-0.5, rounded-full, text-xs, bg-gray-100, text-gray-700 |
| Status Dropdown | w-full, mt-3 |

**States**:

| State | Visual Change |
|-------|---------------|
| Default | As described above |
| Hover | shadow-md, border-gray-300, cursor-pointer |
| Selected | ring-2, ring-primary, bg-blue-50 |
| Loading | Skeleton placeholder for content |

**Hover Interaction** (Desktop):
```
┌─────────────────────────────┐
│ ☐  ┌───────┐                │  <- Checkbox appears (top-left corner)
│    │  8.5  │  Company Name  │
│    └───────┘                │
│  ...                        │
│                             │
│  ┌───────────────────────┐  │
│  │     Reviewing  ▼      │  │  <- Status dropdown always visible
│  └───────────────────────┘  │
└─────────────────────────────┘
```

### 1.2 List Row Variant

**Dimensions**: Full width, 56px height

```
Visual Structure:
┌────────────────────────────────────────────────────────────────────────┐
│ ☐ │ 8.5 │ Company Name │ Brief description truncated... │ [SaaS] │ Reviewing │ Mar 15 │
└────────────────────────────────────────────────────────────────────────┘

Column widths:
│40px│56px│  180px       │       flex-1                   │  80px  │   100px   │  80px  │
```

**Anatomy**:
| Part | Specs |
|------|-------|
| Container | bg-white, border-b border-gray-100, px-4, py-3, flex items-center |
| Checkbox | w-5, h-5, rounded, border-gray-300 |
| Score Badge | w-10, h-6, rounded, text-sm, font-semibold, centered |
| Company Name | font-medium, text-gray-900, w-[180px], truncate |
| Brief | text-sm, text-gray-500, flex-1, truncate |
| Tag | Same as grid card tag |
| Status Badge | px-2.5, py-1, rounded-full, text-xs, font-medium |
| Date | text-sm, text-gray-400, w-[80px] |

**States**:

| State | Visual Change |
|-------|---------------|
| Default | As described above |
| Hover | bg-gray-50 |
| Selected | bg-blue-50 |

### 1.3 Mobile Card Variant

**Dimensions**: Full width (single column), auto height

Same structure as Grid Card but:
- Full width with 16px horizontal margins
- Status dropdown replaced with tap-to-open action sheet
- No checkbox on default view (appears in selection mode)
- Min tap target: 44px x 44px for interactive elements

### 1.4 Accessibility

- **Role**: `article` with `aria-label="Idea: {companyName}"`
- **Checkbox**: `aria-label="Select {companyName}"`
- **Score Badge**: `aria-label="Score: {score} out of 10"`
- **Focus State**: ring-2, ring-offset-2, ring-primary
- **Keyboard**: Tab to card, Enter/Space to open detail

---

## 2. Score Display Component

### 2.1 Score Badge Variants

**Color Rules**:
| Score Range | Color | Hex | Tailwind Class |
|-------------|-------|-----|----------------|
| 8.0 - 10.0 | Green | #22c55e | bg-green-500, text-white |
| 6.0 - 7.9 | Yellow | #eab308 | bg-yellow-500, text-gray-900 |
| 0 - 5.9 | Red | #ef4444 | bg-red-500, text-white |

**Large Badge** (Detail View Header):
```
┌───────────┐
│           │
│    8.5    │  56px x 56px
│   /10     │  text-2xl (score), text-xs (/10)
│           │
└───────────┘
```
Specs: w-14, h-14, rounded-xl, flex flex-col items-center justify-center

**Medium Badge** (Grid Card):
```
┌───────┐
│  8.5  │  40px x 40px
└───────┘  text-lg, font-bold
```
Specs: w-10, h-10, rounded-lg, flex items-center justify-center

**Small Badge** (List Row):
```
┌─────┐
│ 8.5 │  40px x 24px
└─────┘  text-sm, font-semibold
```
Specs: w-10, h-6, rounded, flex items-center justify-center

### 2.2 Score Radar Chart (Detail View)

For displaying all 5 parameter scores in the detail view.

```
Visual Structure:
           Market Potential
                 (9)
                  /\
                 /  \
    Time to    /    \  Technical
    Market    /      \ Feasibility
     (7)    /   ◆    \    (8)
            \        /
             \      /
              \    /
               \  /
    Risk (6)    \/    Uniqueness (8)

Legend below:
● Market Potential: 9/10
● Technical Feasibility: 8/10
● Uniqueness: 8/10
● Risk Level: 6/10
● Time to Market: 7/10
```

**Specs**:
- Container: w-full, max-w-sm, aspect-square
- Chart: SVG-based radar chart
- Points: 5 axes at 72° intervals
- Fill: primary color at 20% opacity
- Stroke: primary color at full opacity
- Labels: text-xs, text-gray-600

**Alternative: Bar Chart** (simpler implementation)
```
Market Potential    ████████████████░░░░ 8.0
Tech Feasibility    ██████████████████░░ 9.0
Uniqueness          ████████████████░░░░ 8.0
Risk Level          ████████████░░░░░░░░ 6.0
Time to Market      ██████████████░░░░░░ 7.0
```

Specs:
- Container: w-full, space-y-2
- Label: text-sm, text-gray-600, w-[140px]
- Bar Container: flex-1, h-4, bg-gray-100, rounded-full
- Bar Fill: h-full, rounded-full, bg-{color based on score}
- Score Value: text-sm, font-medium, w-[40px], text-right

### 2.3 Accessibility

- **Score Badge**: `role="img"` with `aria-label="Score {value} out of 10, {tier} potential"`
- **Chart**: `role="img"` with `aria-label` describing all scores
- **Color**: Scores also display numeric value (not color-only indication)

---

## 3. Status Components

### 3.1 Status Badge/Pill

Compact display of current status.

**Color Mapping**:
| Status | Background | Text | Border |
|--------|------------|------|--------|
| New | bg-blue-100 | text-blue-700 | border-blue-200 |
| Reviewing | bg-purple-100 | text-purple-700 | border-purple-200 |
| Pursuing | bg-green-100 | text-green-700 | border-green-200 |
| Parked | bg-gray-100 | text-gray-700 | border-gray-200 |
| Rejected | bg-red-100 | text-red-700 | border-red-200 |
| Archived | bg-gray-200 | text-gray-800 | border-gray-300 |

**Specs**:
```
┌─────────────┐
│  Reviewing  │  px-2.5, py-1, rounded-full
└─────────────┘  text-xs, font-medium, border
```

### 3.2 Status Dropdown Menu

Interactive component for changing status.

```
Closed State:
┌───────────────────────────┐
│  Reviewing           ▼   │
└───────────────────────────┘

Open State:
┌───────────────────────────┐
│  Reviewing           ▲   │
├───────────────────────────┤
│  ● New                    │
│  ◉ Reviewing              │  <- Current (checkmark)
│  ○ Pursuing               │
│  ○ Parked                 │
│  ○ Rejected               │
│  ─────────────────────────│
│  ○ Archive                │  <- Separated, destructive-ish
└───────────────────────────┘
```

**Anatomy**:
| Part | Specs |
|------|-------|
| Trigger | w-full, px-3, py-2, border border-gray-300, rounded-md, bg-white |
| Dropdown | absolute, w-full, mt-1, bg-white, rounded-md, shadow-lg, border, z-50 |
| Option | px-3, py-2, hover:bg-gray-50, cursor-pointer |
| Selected Option | bg-gray-50, font-medium, with checkmark icon |
| Divider | border-t, border-gray-200, my-1 |

**States**:
| State | Visual |
|-------|--------|
| Default | border-gray-300 |
| Hover | border-gray-400 |
| Open | ring-2, ring-primary, border-primary |
| Disabled | opacity-50, cursor-not-allowed |

### 3.3 Accessibility

- **Trigger**: `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`
- **Dropdown**: `role="listbox"`
- **Options**: `role="option"`, `aria-selected`
- **Keyboard**: Arrow keys to navigate, Enter to select, Escape to close

---

## 4. Navigation Components

### 4.1 Header

**Desktop Layout**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo] Idea Forge              [Search........] [Filter] [+ New Idea] │
└─────────────────────────────────────────────────────────────────────────┘
Height: 64px
```

**Anatomy**:
| Part | Specs |
|------|-------|
| Container | h-16, bg-white, border-b border-gray-200, px-4, flex items-center justify-between |
| Logo | h-8, w-auto |
| Brand Text | text-xl, font-bold, text-gray-900 |
| Search | w-64, lg:w-96 (see Search Input spec) |
| Filter Button | Secondary button variant |
| New Button | Primary button variant |

**Mobile Layout**:
```
┌─────────────────────────────────────┐
│  [Logo] Idea Forge          [≡]    │
└─────────────────────────────────────┘
Height: 56px
```
- Hamburger menu opens slide-over with search, filter access
- "New Idea" moves to floating action button (FAB)

### 4.2 Status Tabs

Horizontal tab navigation for filtering by status.

```
┌─────────────────────────────────────────────────────────────────────┐
│  [All (42)]  [New (8)]  [Reviewing (12)]  [Pursuing (5)]  [Parked (17)]  │
└─────────────────────────────────────────────────────────────────────┘
```

**Anatomy**:
| Part | Specs |
|------|-------|
| Container | flex, gap-2, overflow-x-auto, border-b border-gray-200, px-4, py-2 |
| Tab | px-3, py-2, text-sm, font-medium, rounded-md |
| Tab (Inactive) | text-gray-500, hover:text-gray-700, hover:bg-gray-50 |
| Tab (Active) | text-primary, bg-primary/10 |
| Count Badge | ml-1.5, text-xs, text-gray-400 |

**Mobile**: Horizontally scrollable with fade indicators on edges

### 4.3 Sort/View Toggles

```
Sort: [Score ▼] [Date] [Name]    View: [▦] [≡]
                                       Grid List
```

**Anatomy**:
| Part | Specs |
|------|-------|
| Container | flex, items-center, gap-4 |
| Label | text-sm, text-gray-500 |
| Sort Buttons | Segmented button group |
| View Toggle | Icon-only toggle group |
| Active Sort | bg-gray-100, text-gray-900 |
| Active View | bg-primary, text-white |

### 4.4 Bottom Navigation (Mobile)

Fixed bottom bar for primary mobile navigation.

```
┌─────────────────────────────────────────────────────────────┐
│   [🏠]         [🔍]         [📊]         [👤]               │
│   Home       Search       Compare      Profile             │
└─────────────────────────────────────────────────────────────┘
Height: 64px (+ safe area bottom)
```

**Anatomy**:
| Part | Specs |
|------|-------|
| Container | fixed bottom-0, w-full, h-16, bg-white, border-t border-gray-200, flex |
| Nav Item | flex-1, flex flex-col items-center justify-center, py-2 |
| Icon | w-6, h-6 |
| Label | text-xs, mt-1 |
| Active | text-primary |
| Inactive | text-gray-500 |

**Accessibility**:
- `role="navigation"`, `aria-label="Main navigation"`
- Each item: `role="link"`, `aria-current="page"` when active

---

## 5. Filter Components

### 5.1 Filter Panel (Desktop Dropdown)

Appears below filter button, overlays content.

```
┌─────────────────────────────────────────┐
│ FILTERS                          [Clear]│
├─────────────────────────────────────────┤
│ Score Range                             │
│ [●═══════════════○] 5.0 - 10.0         │
├─────────────────────────────────────────┤
│ Date Created                            │
│ [Last 7 days              ▼]           │
├─────────────────────────────────────────┤
│ Categories                              │
│ ☑ SaaS  ☑ Mobile  ☐ Hardware           │
│ ☐ Consumer  ☑ B2B  ☐ Marketplace       │
├─────────────────────────────────────────┤
│ Tags                                    │
│ [AI ×] [Fintech ×] [+ Add tag]         │
├─────────────────────────────────────────┤
│              [Apply Filters]            │
└─────────────────────────────────────────┘
Width: 320px
```

**Anatomy**:
| Part | Specs |
|------|-------|
| Container | absolute, right-0, mt-2, w-80, bg-white, rounded-lg, shadow-lg, border, z-50 |
| Header | px-4, py-3, border-b, flex justify-between items-center |
| Title | text-sm, font-semibold, text-gray-900, uppercase tracking-wide |
| Clear Link | text-sm, text-primary, hover:underline |
| Section | px-4, py-3, border-b last:border-b-0 |
| Section Title | text-sm, font-medium, text-gray-700, mb-2 |
| Apply Button | Primary button, w-full |

### 5.2 Filter Bottom Sheet (Mobile)

Slides up from bottom, covers ~70% of screen.

```
┌─────────────────────────────────────────┐
│─────────────────────────────────────────│ <- Drag handle
│ Filters                          [Done] │
├─────────────────────────────────────────┤
│                                         │
│ (Same content as desktop panel)         │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  [Clear All]        [Apply Filters]     │ <- Sticky footer
└─────────────────────────────────────────┘
```

**Anatomy**:
| Part | Specs |
|------|-------|
| Overlay | fixed inset-0, bg-black/50, z-40 |
| Sheet | fixed bottom-0, w-full, max-h-[70vh], bg-white, rounded-t-2xl, z-50 |
| Drag Handle | w-12, h-1, bg-gray-300, rounded-full, mx-auto, my-3 |
| Header | px-4, py-3, border-b, flex justify-between |
| Content | overflow-y-auto, px-4, pb-24 |
| Footer | fixed bottom-0, w-full, px-4, py-3, bg-white, border-t, flex gap-3 |

**Gestures**:
- Swipe down to dismiss
- Tap outside (overlay) to dismiss

### 5.3 Score Range Slider

Dual-thumb slider for min/max score filtering.

```
Score Range
[●════════════════●] 5.0 - 10.0
Min: 5.0          Max: 10.0
```

**Specs**:
| Part | Specs |
|------|-------|
| Container | w-full |
| Track | h-2, bg-gray-200, rounded-full |
| Active Track | h-2, bg-primary, rounded-full |
| Thumb | w-5, h-5, bg-white, border-2 border-primary, rounded-full, shadow |
| Labels | text-sm, text-gray-600 |

**Interaction**:
- Drag thumbs to adjust range
- Tap on track to move nearest thumb
- Min cannot exceed max (and vice versa)

### 5.4 Date Dropdown

Predefined date range selector.

**Options**:
- All time
- Today
- Last 7 days
- Last 30 days
- Last 90 days
- This year

Use standard Select component (see Form Elements).

### 5.5 Category Checkboxes

Grid of checkboxes for multi-select.

```
☑ SaaS      ☑ Mobile    ☐ Hardware
☐ Consumer  ☑ B2B       ☐ Marketplace
```

**Specs**:
- Grid: grid grid-cols-3 gap-2
- Use Checkbox component (see Form Elements)

### 5.6 Tag Chips (Removable)

Selected tags with remove capability.

```
[AI ×] [Fintech ×] [+ Add tag]
```

**Specs**:
| Part | Specs |
|------|-------|
| Chip | inline-flex items-center, px-2.5, py-1, rounded-full, bg-primary/10, text-primary |
| Text | text-sm |
| Remove Button | ml-1, w-4, h-4, hover:bg-primary/20, rounded-full |
| Add Button | px-2.5, py-1, border border-dashed border-gray-300, rounded-full, text-sm, text-gray-500 |

### 5.7 Accessibility

- **Slider**: `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-label`
- **Checkboxes**: Properly labeled with `aria-checked`
- **Bottom Sheet**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **Focus Trap**: Bottom sheet traps focus while open

---

## 6. Form Elements

### 6.1 Search Input

```
┌─────────────────────────────────────────┐
│ 🔍  Search ideas...                     │
└─────────────────────────────────────────┘
```

**Specs**:
| Part | Specs |
|------|-------|
| Container | relative, w-full |
| Icon | absolute left-3, w-5, h-5, text-gray-400 |
| Input | w-full, pl-10, pr-4, py-2, border border-gray-300, rounded-lg, text-sm |
| Placeholder | text-gray-400 |
| Focus | ring-2 ring-primary, border-primary |

**Clear Button** (appears when has value):
```
┌─────────────────────────────────────────┐
│ 🔍  Product management tool         [×] │
└─────────────────────────────────────────┘
```

### 6.2 Text Input

Standard single-line text input.

```
Label
┌─────────────────────────────────────────┐
│ Input value                             │
└─────────────────────────────────────────┘
Helper text or error message
```

**Specs**:
| Part | Specs |
|------|-------|
| Label | text-sm, font-medium, text-gray-700, mb-1.5 |
| Input | w-full, px-3, py-2, border border-gray-300, rounded-md, text-sm |
| Helper | text-xs, text-gray-500, mt-1 |
| Error | text-xs, text-red-500, mt-1 |

**States**:
| State | Visual |
|-------|--------|
| Default | border-gray-300 |
| Hover | border-gray-400 |
| Focus | ring-2 ring-primary, border-primary |
| Error | border-red-500, ring-red-500 |
| Disabled | bg-gray-50, text-gray-500, cursor-not-allowed |

### 6.3 Textarea

Multi-line text input for notes.

```
My Notes
┌─────────────────────────────────────────┐
│ This is a note about the idea.          │
│ It can span multiple lines.             │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

**Specs**:
- Same as Text Input
- Min height: 96px (min-h-24)
- Resize: vertical only (resize-y)
- Line height: 1.5

### 6.4 Dropdown Select

```
Closed:
┌─────────────────────────────────────────┐
│ Select option...                    ▼   │
└─────────────────────────────────────────┘

Open:
┌─────────────────────────────────────────┐
│ Select option...                    ▲   │
├─────────────────────────────────────────┤
│   Option 1                              │
│ ✓ Option 2 (selected)                   │
│   Option 3                              │
└─────────────────────────────────────────┘
```

Use shadcn/ui Select component. Same styling as Status Dropdown.

### 6.5 Checkbox

```
☐ Unchecked    ☑ Checked    ☐ Indeterminate (-)
```

**Specs**:
| Part | Specs |
|------|-------|
| Box | w-4, h-4, rounded, border border-gray-300 |
| Checked | bg-primary, border-primary |
| Checkmark | text-white, w-3, h-3 |
| Label | ml-2, text-sm, text-gray-700 |

**States**:
| State | Visual |
|-------|--------|
| Default | border-gray-300 |
| Hover | border-gray-400 |
| Checked | bg-primary, border-primary |
| Focus | ring-2 ring-offset-2 ring-primary |
| Disabled | opacity-50 |

### 6.6 Radio Button

```
○ Option 1    ◉ Option 2 (selected)    ○ Option 3
```

**Specs**:
| Part | Specs |
|------|-------|
| Circle | w-4, h-4, rounded-full, border-2 border-gray-300 |
| Selected | border-primary |
| Dot | w-2, h-2, bg-primary, rounded-full (centered) |
| Label | ml-2, text-sm, text-gray-700 |

### 6.7 Buttons

**Primary Button**:
```
┌───────────────────┐
│   + New Idea      │  bg-primary, text-white, hover:bg-primary/90
└───────────────────┘
```

**Secondary Button**:
```
┌───────────────────┐
│     Filter        │  bg-white, text-gray-700, border, hover:bg-gray-50
└───────────────────┘
```

**Ghost Button**:
```
┌───────────────────┐
│     Cancel        │  bg-transparent, text-gray-600, hover:bg-gray-100
└───────────────────┘
```

**Destructive Button**:
```
┌───────────────────┐
│     Delete        │  bg-red-500, text-white, hover:bg-red-600
└───────────────────┘
```

**Button Specs**:
| Size | Specs |
|------|-------|
| Small | px-3, py-1.5, text-sm |
| Default | px-4, py-2, text-sm |
| Large | px-6, py-3, text-base |

All buttons: rounded-md, font-medium, transition-colors, focus:ring-2 focus:ring-offset-2

### 6.8 Accessibility

- All inputs have associated `<label>` elements
- Error messages linked via `aria-describedby`
- Required fields marked with `aria-required="true"`
- Buttons have descriptive text or `aria-label`
- Focus visible on all interactive elements

---

## 7. Feedback Components

### 7.1 Toast Notifications

Temporary feedback messages at bottom-right (desktop) or bottom-center (mobile).

```
┌─────────────────────────────────────────────┐
│ ✓  Status updated to "Pursuing"      [Undo] │
└─────────────────────────────────────────────┘
```

**Variants**:
| Type | Icon | Colors |
|------|------|--------|
| Success | ✓ | bg-green-50, text-green-800, border-green-200 |
| Error | ✕ | bg-red-50, text-red-800, border-red-200 |
| Warning | ⚠ | bg-yellow-50, text-yellow-800, border-yellow-200 |
| Info | ℹ | bg-blue-50, text-blue-800, border-blue-200 |

**Specs**:
| Part | Specs |
|------|-------|
| Container | fixed bottom-4 right-4 (desktop), bottom-20 inset-x-4 (mobile) |
| Toast | flex items-center, px-4, py-3, rounded-lg, shadow-lg, border |
| Icon | w-5, h-5, mr-3, flex-shrink-0 |
| Message | text-sm, flex-1 |
| Action | text-sm, font-medium, ml-4, underline |
| Close | w-5, h-5, ml-2 |

**Behavior**:
- Auto-dismiss after 5 seconds (user can hover to pause)
- Undo action available for 5 seconds
- Stack multiple toasts vertically
- Max 3 visible at once

### 7.2 Loading Skeletons

Placeholder content while data loads.

**Card Skeleton**:
```
┌─────────────────────────────┐
│  ┌───────┐ ░░░░░░░░░░░░░   │
│  │ ░░░░░ │                  │
│  └───────┘                  │
│                             │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░░░░░░░░       │
│                             │
│  ░░░░░  ░░░░                │
│                             │
│  ░░░░░░░░░░░░░░░░░░░░░░    │
└─────────────────────────────┘
```

**Specs**:
| Part | Specs |
|------|-------|
| Base | bg-gray-200, rounded |
| Animation | animate-pulse |
| Score Area | w-14, h-14, rounded-lg |
| Title Line | h-5, w-3/4, rounded |
| Text Line | h-4, w-full, rounded |
| Short Line | h-4, w-2/3, rounded |

### 7.3 Empty States

Shown when no content matches filters or initial state.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                        [Illustration]                        │
│                                                             │
│                     No ideas found                          │
│                                                             │
│         Try adjusting your filters or create                │
│         your first idea to get started.                     │
│                                                             │
│                    [+ Create Idea]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Variants**:
| Context | Title | Description | Action |
|---------|-------|-------------|--------|
| No ideas | "No ideas yet" | "Start capturing your business ideas" | "+ Create Idea" |
| No results | "No ideas found" | "Try adjusting your filters" | "Clear Filters" |
| Search empty | "No matches" | "No ideas match '{query}'" | "Clear Search" |

**Specs**:
| Part | Specs |
|------|-------|
| Container | flex flex-col items-center justify-center, py-16, text-center |
| Illustration | w-48, h-48, mb-6, text-gray-300 |
| Title | text-lg, font-semibold, text-gray-900, mb-2 |
| Description | text-sm, text-gray-500, max-w-sm, mb-6 |
| Action | Primary or Secondary button |

### 7.4 Error States

Shown when something goes wrong.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                        [Error Icon]                          │
│                                                             │
│                   Something went wrong                       │
│                                                             │
│         We couldn't load your ideas. Please try             │
│         again or contact support if the issue persists.     │
│                                                             │
│                    [Try Again]                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Specs**: Same as Empty State, with red accent color for icon

### 7.5 Offline Indicator

Persistent banner when offline.

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠  You're offline. Changes will sync when reconnected.    │
└─────────────────────────────────────────────────────────────┘
```

**Specs**:
| Part | Specs |
|------|-------|
| Container | fixed top-0 inset-x-0, bg-yellow-50, border-b border-yellow-200, px-4, py-2 |
| Icon | w-4, h-4, text-yellow-600 |
| Text | text-sm, text-yellow-800 |

**Behavior**:
- Appears when navigator.onLine is false
- Auto-dismisses when connection restored
- Page content shifts down to accommodate

### 7.6 Accessibility

- **Toasts**: `role="alert"`, `aria-live="polite"` (or "assertive" for errors)
- **Skeletons**: `aria-busy="true"`, `aria-label="Loading"`
- **Empty States**: Focusable action button, descriptive text
- **Offline Banner**: `role="status"`, `aria-live="polite"`

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Columns | Notes |
|------------|-------|---------|-------|
| Mobile | < 640px | 1 | Bottom nav, full-screen modals |
| Tablet | 640px - 1024px | 2 | Slide-over panels |
| Desktop | > 1024px | 4 | Full feature set |

**CSS (Tailwind)**:
```css
sm: 640px   /* @media (min-width: 640px) */
md: 768px   /* @media (min-width: 768px) */
lg: 1024px  /* @media (min-width: 1024px) */
xl: 1280px  /* @media (min-width: 1280px) */
```

---

## 9. Keyboard Shortcuts (Desktop)

| Shortcut | Action |
|----------|--------|
| `j` / `k` | Navigate down/up in list |
| `Enter` | Open selected idea |
| `Escape` | Close detail panel |
| `←` / `→` | Previous/next idea in detail view |
| `e` | Edit selected idea |
| `s` | Open status dropdown |
| `n` | New idea |
| `/` | Focus search |
| `?` | Show shortcuts help |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-08 | Hila Mor | Initial component specifications |

---

*This document serves as the blueprint for development. All components should be implemented using shadcn/ui where applicable, with Tailwind CSS for styling.*
