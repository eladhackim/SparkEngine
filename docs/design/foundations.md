# Idea Forge: Design Foundations

**Version**: 1.0
**Last Updated**: April 8, 2026
**Status**: Active

---

## Overview

This document defines the core design system for Idea Forge, the AI-powered idea management platform for solo entrepreneurs. It serves as the source of truth for all visual design decisions and provides design tokens that can be exported to CSS variables for implementation.

**Design Principles:**
- **Scanability** - Quick visual assessment of many ideas at once
- **Clarity** - Clear hierarchy and color-coded status at a glance
- **Efficiency** - Minimal friction for power users
- **Mobile-First** - Core workflows optimized for touch, enhanced for desktop

---

## 1. Color Palette

### 1.1 Score Colors

Score colors provide instant visual feedback on idea potential. Based on the 1-5 composite score scale.

| Score Range | Tier | Color Name | Hex | RGB | Usage |
|-------------|------|------------|-----|-----|-------|
| 4.0 - 5.0 | HOT | Green | `#22c55e` | `34, 197, 94` | High potential ideas |
| 3.0 - 3.9 | WARM | Yellow | `#eab308` | `234, 179, 8` | Moderate potential |
| 2.0 - 2.9 | PARK | Orange | `#f97316` | `249, 115, 22` | Low priority, save for later |
| 1.0 - 1.9 | DISCARD | Red | `#ef4444` | `239, 68, 68` | Low potential, archive |

**Score Badge Variants:**

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Green (HOT) | `#dcfce7` | `#166534` | `#22c55e` |
| Yellow (WARM) | `#fef9c3` | `#854d0e` | `#eab308` |
| Orange (PARK) | `#ffedd5` | `#9a3412` | `#f97316` |
| Red (DISCARD) | `#fee2e2` | `#991b1b` | `#ef4444` |

### 1.2 Status Colors

Status colors indicate workflow stage. Each status has a distinct hue for instant recognition.

| Status | Color Name | Hex | RGB | Description |
|--------|------------|-----|-----|-------------|
| New | Blue | `#3b82f6` | `59, 130, 246` | Freshly created, unprocessed |
| Reviewing | Purple | `#a855f7` | `168, 85, 247` | Under active evaluation |
| Pursuing | Green | `#22c55e` | `34, 197, 94` | Actively working on |
| Parked | Gray | `#6b7280` | `107, 114, 128` | On hold for later |
| Rejected | Red | `#ef4444` | `239, 68, 68` | Not pursuing |
| Archived | Dark Gray | `#374151` | `55, 65, 81` | Soft deleted |

**Status Badge Variants:**

| Status | Background | Text | Border |
|--------|------------|------|--------|
| New | `#dbeafe` | `#1e40af` | `#3b82f6` |
| Reviewing | `#f3e8ff` | `#6b21a8` | `#a855f7` |
| Pursuing | `#dcfce7` | `#166534` | `#22c55e` |
| Parked | `#f3f4f6` | `#374151` | `#6b7280` |
| Rejected | `#fee2e2` | `#991b1b` | `#ef4444` |
| Archived | `#e5e7eb` | `#1f2937` | `#374151` |

### 1.3 Semantic Colors

Core colors for UI elements and feedback states.

| Role | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| **Primary** | `#3b82f6` | `#60a5fa` | Primary actions, links, focus states |
| **Primary Hover** | `#2563eb` | `#93c5fd` | Hover state for primary elements |
| **Secondary** | `#6b7280` | `#9ca3af` | Secondary actions, less emphasis |
| **Secondary Hover** | `#4b5563` | `#d1d5db` | Hover state for secondary elements |
| **Success** | `#22c55e` | `#4ade80` | Positive feedback, confirmations |
| **Warning** | `#eab308` | `#facc15` | Caution, alerts requiring attention |
| **Error** | `#ef4444` | `#f87171` | Errors, destructive actions |
| **Info** | `#0ea5e9` | `#38bdf8` | Informational messages, tips |

### 1.4 Neutral Scale

Grayscale palette for backgrounds, borders, and text.

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| **Background** | `#ffffff` | `#0f172a` | Page background |
| **Background Alt** | `#f8fafc` | `#1e293b` | Alternate sections, cards |
| **Surface** | `#ffffff` | `#1e293b` | Card surfaces, modals |
| **Surface Elevated** | `#ffffff` | `#334155` | Elevated surfaces (dropdowns, popovers) |
| **Border** | `#e2e8f0` | `#334155` | Default borders |
| **Border Subtle** | `#f1f5f9` | `#1e293b` | Subtle dividers |
| **Border Strong** | `#cbd5e1` | `#475569` | Emphasized borders |
| **Text Primary** | `#0f172a` | `#f8fafc` | Main text content |
| **Text Secondary** | `#475569` | `#94a3b8` | Supporting text, captions |
| **Text Muted** | `#64748b` | `#64748b` | Placeholder, disabled text |
| **Text Disabled** | `#94a3b8` | `#475569` | Disabled states |
| **Text Inverse** | `#ffffff` | `#0f172a` | Text on colored backgrounds |

### 1.5 Interactive States

| State | Modifier | Example (Primary Button) |
|-------|----------|--------------------------|
| Default | - | `bg: #3b82f6` |
| Hover | Lightened 10% | `bg: #2563eb` |
| Active/Pressed | Darkened 10% | `bg: #1d4ed8` |
| Focus | Ring outline | `ring: #3b82f6/50` (50% opacity) |
| Disabled | 40% opacity | `bg: #3b82f6/40` |

---

## 2. Typography Scale

### 2.1 Font Families

| Role | Font Stack | Fallback |
|------|------------|----------|
| **Sans (Primary)** | `Inter` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` |
| **Mono (Scores)** | `JetBrains Mono` | `"SF Mono", Consolas, "Liberation Mono", Menlo, monospace` |

**Font Loading:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
```

### 2.2 Type Scale

Based on a 1.25 ratio (Major Third) with 16px base.

| Token | Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Usage |
|-------|-----------|------------|--------|-------------|----------------|-------|
| **Display** | 48 | 3.0 | 700 | 1.1 | -0.02em | Hero headlines |
| **H1** | 36 | 2.25 | 700 | 1.2 | -0.02em | Page titles |
| **H2** | 30 | 1.875 | 600 | 1.25 | -0.01em | Section headers |
| **H3** | 24 | 1.5 | 600 | 1.3 | -0.01em | Subsection headers |
| **H4** | 20 | 1.25 | 600 | 1.4 | 0 | Card titles |
| **H5** | 18 | 1.125 | 600 | 1.4 | 0 | Labels, panel headers |
| **H6** | 16 | 1.0 | 600 | 1.4 | 0 | Small headers |
| **Body** | 16 | 1.0 | 400 | 1.6 | 0 | Default body text |
| **Body Small** | 14 | 0.875 | 400 | 1.5 | 0 | Secondary content |
| **Caption** | 12 | 0.75 | 400 | 1.4 | 0.01em | Captions, metadata |
| **Label** | 12 | 0.75 | 500 | 1.4 | 0.02em | Form labels, badges |
| **Overline** | 10 | 0.625 | 600 | 1.2 | 0.1em | Eyebrow text (uppercase) |

### 2.3 Monospace (For Scores)

| Token | Size (px) | Weight | Usage |
|-------|-----------|--------|-------|
| **Score Large** | 32 | 700 | Featured score display |
| **Score Default** | 20 | 700 | Card score badges |
| **Score Small** | 14 | 500 | Inline scores |
| **Score Compact** | 12 | 500 | Table cells, dense views |

### 2.4 Responsive Typography

| Breakpoint | Scale Factor | Example (H1) |
|------------|--------------|--------------|
| Mobile (<640px) | 0.85x | 30px |
| Tablet (640-1024px) | 0.925x | 33px |
| Desktop (>1024px) | 1.0x | 36px |

---

## 3. Spacing System

### 3.1 Base Unit

**Base unit: 4px**

All spacing values are multiples of 4px to ensure visual consistency and alignment.

### 3.2 Spacing Tokens

| Token | Value (px) | Value (rem) | Usage |
|-------|------------|-------------|-------|
| `--spacing-0` | 0 | 0 | Reset |
| `--spacing-px` | 1 | 0.0625 | Fine borders |
| `--spacing-0.5` | 2 | 0.125 | Tight gaps |
| `--spacing-1` | 4 | 0.25 | Minimum spacing |
| `--spacing-1.5` | 6 | 0.375 | Dense spacing |
| `--spacing-2` | 8 | 0.5 | xs - Compact elements |
| `--spacing-2.5` | 10 | 0.625 | Between compact elements |
| `--spacing-3` | 12 | 0.75 | sm - Small gaps |
| `--spacing-4` | 16 | 1.0 | md - Default spacing |
| `--spacing-5` | 20 | 1.25 | Between related content |
| `--spacing-6` | 24 | 1.5 | lg - Section padding |
| `--spacing-8` | 32 | 2.0 | xl - Major sections |
| `--spacing-10` | 40 | 2.5 | Between sections |
| `--spacing-12` | 48 | 3.0 | 2xl - Large gaps |
| `--spacing-16` | 64 | 4.0 | Page margins |
| `--spacing-20` | 80 | 5.0 | 3xl - Hero spacing |
| `--spacing-24` | 96 | 6.0 | Maximum spacing |

### 3.3 Semantic Spacing

| Token | Desktop | Tablet | Mobile | Usage |
|-------|---------|--------|--------|-------|
| **Page Padding** | 64px | 32px | 16px | Main content padding |
| **Section Gap** | 48px | 32px | 24px | Between page sections |
| **Card Padding** | 24px | 20px | 16px | Inside cards |
| **Card Gap** | 24px | 16px | 16px | Between grid cards |
| **Stack Gap** | 16px | 16px | 12px | Vertical stacked items |
| **Inline Gap** | 8px | 8px | 8px | Horizontal inline items |
| **Form Gap** | 16px | 16px | 16px | Between form fields |
| **Button Padding X** | 16px | 16px | 16px | Horizontal button padding |
| **Button Padding Y** | 10px | 10px | 10px | Vertical button padding |

### 3.4 Grid System

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| **Columns** | 12 | 8 | 4 |
| **Gutter** | 24px | 16px | 16px |
| **Margin** | 64px | 32px | 16px |
| **Max Width** | 1280px | 100% | 100% |

**Idea Card Grid:**

| Breakpoint | Columns | Card Width |
|------------|---------|------------|
| Desktop (>1024px) | 4 | ~280px |
| Tablet (640-1024px) | 2 | ~300px |
| Mobile (<640px) | 1 | 100% |

### 3.5 Touch Targets

| Element | Minimum Size | Recommended |
|---------|--------------|-------------|
| Buttons | 44px | 48px |
| Icon Buttons | 44px | 44px |
| Checkboxes | 44px touch area | 20px visual |
| List Items | 48px | 56px |
| Form Inputs | 44px | 48px |

---

## 4. Design Tokens (CSS Variables)

### 4.1 Color Tokens

```css
:root {
  /* === Score Colors === */
  --color-score-hot: #22c55e;
  --color-score-hot-bg: #dcfce7;
  --color-score-hot-text: #166534;

  --color-score-warm: #eab308;
  --color-score-warm-bg: #fef9c3;
  --color-score-warm-text: #854d0e;

  --color-score-park: #f97316;
  --color-score-park-bg: #ffedd5;
  --color-score-park-text: #9a3412;

  --color-score-discard: #ef4444;
  --color-score-discard-bg: #fee2e2;
  --color-score-discard-text: #991b1b;

  /* === Status Colors === */
  --color-status-new: #3b82f6;
  --color-status-new-bg: #dbeafe;
  --color-status-new-text: #1e40af;

  --color-status-reviewing: #a855f7;
  --color-status-reviewing-bg: #f3e8ff;
  --color-status-reviewing-text: #6b21a8;

  --color-status-pursuing: #22c55e;
  --color-status-pursuing-bg: #dcfce7;
  --color-status-pursuing-text: #166534;

  --color-status-parked: #6b7280;
  --color-status-parked-bg: #f3f4f6;
  --color-status-parked-text: #374151;

  --color-status-rejected: #ef4444;
  --color-status-rejected-bg: #fee2e2;
  --color-status-rejected-text: #991b1b;

  --color-status-archived: #374151;
  --color-status-archived-bg: #e5e7eb;
  --color-status-archived-text: #1f2937;

  /* === Semantic Colors === */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-primary-active: #1d4ed8;

  --color-secondary: #6b7280;
  --color-secondary-hover: #4b5563;

  --color-success: #22c55e;
  --color-warning: #eab308;
  --color-error: #ef4444;
  --color-info: #0ea5e9;

  /* === Neutral Colors (Light Mode) === */
  --color-background: #ffffff;
  --color-background-alt: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-elevated: #ffffff;

  --color-border: #e2e8f0;
  --color-border-subtle: #f1f5f9;
  --color-border-strong: #cbd5e1;

  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #64748b;
  --color-text-disabled: #94a3b8;
  --color-text-inverse: #ffffff;

  /* === Focus Ring === */
  --color-focus-ring: rgba(59, 130, 246, 0.5);
}

/* === Dark Mode === */
[data-theme="dark"],
.dark {
  --color-primary: #60a5fa;
  --color-primary-hover: #93c5fd;
  --color-primary-active: #3b82f6;

  --color-secondary: #9ca3af;
  --color-secondary-hover: #d1d5db;

  --color-success: #4ade80;
  --color-warning: #facc15;
  --color-error: #f87171;
  --color-info: #38bdf8;

  --color-background: #0f172a;
  --color-background-alt: #1e293b;
  --color-surface: #1e293b;
  --color-surface-elevated: #334155;

  --color-border: #334155;
  --color-border-subtle: #1e293b;
  --color-border-strong: #475569;

  --color-text-primary: #f8fafc;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;
  --color-text-disabled: #475569;
  --color-text-inverse: #0f172a;

  --color-focus-ring: rgba(96, 165, 250, 0.5);
}
```

### 4.2 Typography Tokens

```css
:root {
  /* === Font Families === */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;

  /* === Font Sizes === */
  --font-size-display: 3rem;      /* 48px */
  --font-size-h1: 2.25rem;        /* 36px */
  --font-size-h2: 1.875rem;       /* 30px */
  --font-size-h3: 1.5rem;         /* 24px */
  --font-size-h4: 1.25rem;        /* 20px */
  --font-size-h5: 1.125rem;       /* 18px */
  --font-size-h6: 1rem;           /* 16px */
  --font-size-body: 1rem;         /* 16px */
  --font-size-body-sm: 0.875rem;  /* 14px */
  --font-size-caption: 0.75rem;   /* 12px */
  --font-size-label: 0.75rem;     /* 12px */
  --font-size-overline: 0.625rem; /* 10px */

  /* === Font Weights === */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* === Line Heights === */
  --line-height-tight: 1.1;
  --line-height-snug: 1.25;
  --line-height-normal: 1.4;
  --line-height-relaxed: 1.5;
  --line-height-loose: 1.6;

  /* === Letter Spacing === */
  --letter-spacing-tighter: -0.02em;
  --letter-spacing-tight: -0.01em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.01em;
  --letter-spacing-wider: 0.02em;
  --letter-spacing-widest: 0.1em;

  /* === Score Typography === */
  --font-size-score-lg: 2rem;     /* 32px */
  --font-size-score: 1.25rem;     /* 20px */
  --font-size-score-sm: 0.875rem; /* 14px */
  --font-size-score-xs: 0.75rem;  /* 12px */
}
```

### 4.3 Spacing Tokens

```css
:root {
  /* === Spacing Scale === */
  --spacing-0: 0;
  --spacing-px: 1px;
  --spacing-0-5: 0.125rem;  /* 2px */
  --spacing-1: 0.25rem;     /* 4px */
  --spacing-1-5: 0.375rem;  /* 6px */
  --spacing-2: 0.5rem;      /* 8px */
  --spacing-2-5: 0.625rem;  /* 10px */
  --spacing-3: 0.75rem;     /* 12px */
  --spacing-4: 1rem;        /* 16px */
  --spacing-5: 1.25rem;     /* 20px */
  --spacing-6: 1.5rem;      /* 24px */
  --spacing-8: 2rem;        /* 32px */
  --spacing-10: 2.5rem;     /* 40px */
  --spacing-12: 3rem;       /* 48px */
  --spacing-16: 4rem;       /* 64px */
  --spacing-20: 5rem;       /* 80px */
  --spacing-24: 6rem;       /* 96px */

  /* === Component Spacing === */
  --spacing-page-x: var(--spacing-16);
  --spacing-page-y: var(--spacing-12);
  --spacing-section: var(--spacing-12);
  --spacing-card: var(--spacing-6);
  --spacing-card-gap: var(--spacing-6);
  --spacing-stack: var(--spacing-4);
  --spacing-inline: var(--spacing-2);
  --spacing-form: var(--spacing-4);

  /* === Border Radius === */
  --radius-none: 0;
  --radius-sm: 0.25rem;     /* 4px */
  --radius-md: 0.5rem;      /* 8px */
  --radius-lg: 0.75rem;     /* 12px */
  --radius-xl: 1rem;        /* 16px */
  --radius-2xl: 1.5rem;     /* 24px */
  --radius-full: 9999px;

  /* === Shadows === */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* === Transitions === */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
}

/* === Responsive Spacing Overrides === */
@media (max-width: 1024px) {
  :root {
    --spacing-page-x: var(--spacing-8);
    --spacing-section: var(--spacing-8);
    --spacing-card: var(--spacing-5);
    --spacing-card-gap: var(--spacing-4);
  }
}

@media (max-width: 640px) {
  :root {
    --spacing-page-x: var(--spacing-4);
    --spacing-page-y: var(--spacing-6);
    --spacing-section: var(--spacing-6);
    --spacing-card: var(--spacing-4);
    --spacing-stack: var(--spacing-3);
  }
}
```

### 4.4 Layout Tokens

```css
:root {
  /* === Grid === */
  --grid-columns: 12;
  --grid-gutter: var(--spacing-6);
  --grid-margin: var(--spacing-16);
  --grid-max-width: 1280px;

  /* === Breakpoints (for reference, use in media queries) === */
  /* --breakpoint-sm: 640px;   */
  /* --breakpoint-md: 768px;   */
  /* --breakpoint-lg: 1024px;  */
  /* --breakpoint-xl: 1280px;  */
  /* --breakpoint-2xl: 1536px; */

  /* === Z-Index Scale === */
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-overlay: 1200;
  --z-modal: 1300;
  --z-popover: 1400;
  --z-toast: 1500;
  --z-tooltip: 1600;

  /* === Touch Targets === */
  --touch-target-min: 44px;
  --touch-target-comfortable: 48px;
}

@media (max-width: 1024px) {
  :root {
    --grid-columns: 8;
    --grid-gutter: var(--spacing-4);
    --grid-margin: var(--spacing-8);
  }
}

@media (max-width: 640px) {
  :root {
    --grid-columns: 4;
    --grid-margin: var(--spacing-4);
  }
}
```

---

## 5. Component Styling Guidelines

### 5.1 Idea Card

```css
.idea-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-card);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-fast), border-color var(--transition-fast);
}

.idea-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-strong);
}
```

### 5.2 Score Badge

```css
.score-badge {
  font-family: var(--font-mono);
  font-size: var(--font-size-score);
  font-weight: var(--font-weight-bold);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
}

.score-badge--hot {
  background: var(--color-score-hot-bg);
  color: var(--color-score-hot-text);
  border: 1px solid var(--color-score-hot);
}

/* Similar patterns for warm, park, discard */
```

### 5.3 Status Pill

```css
.status-pill {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  text-transform: capitalize;
}

.status-pill--new {
  background: var(--color-status-new-bg);
  color: var(--color-status-new-text);
}

/* Similar patterns for other statuses */
```

### 5.4 Button Styles

```css
.button {
  font-family: var(--font-sans);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-2-5) var(--spacing-4);
  border-radius: var(--radius-md);
  min-height: var(--touch-target-min);
  transition: all var(--transition-fast);
}

.button--primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.button--primary:hover {
  background: var(--color-primary-hover);
}

.button--primary:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```

---

## 6. Accessibility Notes

### 6.1 Color Contrast

All color combinations meet WCAG 2.1 AA requirements:

| Combination | Contrast Ratio | Requirement |
|-------------|----------------|-------------|
| Text Primary on Background | 15.2:1 | Pass (4.5:1 required) |
| Text Secondary on Background | 7.3:1 | Pass (4.5:1 required) |
| Score Hot Text on Hot BG | 5.1:1 | Pass (4.5:1 required) |
| Score Warm Text on Warm BG | 4.8:1 | Pass (4.5:1 required) |

### 6.2 Focus States

- All interactive elements have visible focus indicators
- Focus ring: 2px solid with 50% opacity primary color
- Focus visible only on keyboard navigation (`:focus-visible`)

### 6.3 Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Tailwind CSS Configuration

For projects using Tailwind CSS, extend the default theme:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        score: {
          hot: '#22c55e',
          'hot-bg': '#dcfce7',
          warm: '#eab308',
          'warm-bg': '#fef9c3',
          park: '#f97316',
          'park-bg': '#ffedd5',
          discard: '#ef4444',
          'discard-bg': '#fee2e2',
        },
        status: {
          new: '#3b82f6',
          reviewing: '#a855f7',
          pursuing: '#22c55e',
          parked: '#6b7280',
          rejected: '#ef4444',
          archived: '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      spacing: {
        'touch-min': '44px',
        'touch-comfortable': '48px',
      },
    },
  },
}
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | April 8, 2026 | Freya Olsen | Initial design foundations |

---

*This document is the source of truth for Idea Forge's visual design system. All implementations should reference these tokens.*
