# Idea Forge Design System

**Version**: 1.0
**Last Updated**: April 2026
**Status**: Active

---

## Overview

The Idea Forge Design System provides a comprehensive set of guidelines, tokens, and specifications for building the AI-powered idea management platform. This system ensures visual consistency, accessibility compliance, and a cohesive user experience across all interfaces.

**Design Philosophy:**
- **Scanability** - Quick visual assessment of idea portfolios
- **Progressive Disclosure** - Details on demand, not overwhelming upfront
- **Mobile-First** - Core workflows optimized for touch, enhanced for desktop
- **Accessibility** - WCAG 2.1 AA compliant throughout

---

## Quick Reference

| Token | Value | Notes |
|-------|-------|-------|
| **Primary Color** | `#3b82f6` (Blue 500) | Actions, links, focus states |
| **Font Family** | Inter | UI text, headings |
| **Monospace Font** | JetBrains Mono | Scores, code |
| **Base Spacing** | 4px | All spacing multiples of 4 |
| **Base Font Size** | 16px | 1rem |
| **Border Radius** | 8px (lg) | Cards, buttons |
| **Touch Target** | 44px minimum | WCAG requirement |

### Score Colors

| Score | Tier | Color | Hex |
|-------|------|-------|-----|
| 4.0 - 5.0 | HOT | Green | `#22c55e` |
| 3.0 - 3.9 | WARM | Yellow | `#eab308` |
| 2.0 - 2.9 | PARK | Orange | `#f97316` |
| 1.0 - 1.9 | DISCARD | Red | `#ef4444` |

### Status Colors

| Status | Color | Hex |
|--------|-------|-----|
| New | Blue | `#3b82f6` |
| Reviewing | Purple | `#a855f7` |
| Pursuing | Green | `#22c55e` |
| Parked | Gray | `#6b7280` |
| Rejected | Red | `#ef4444` |
| Archived | Dark Gray | `#374151` |

---

## Documentation

| Document | Description |
|----------|-------------|
| **[foundations.md](./foundations.md)** | Color palette, typography scale, spacing system, and CSS design tokens. The foundational building blocks for all visual design. |
| **[components.md](./components.md)** | UI component specifications including idea cards, score displays, status badges, navigation, filters, forms, and feedback states. |
| **[layout-patterns.md](./layout-patterns.md)** | Grid system, page layouts, responsive patterns, animations, gesture handling, keyboard navigation, and accessibility patterns. |

---

## Implementation Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| **Framework** | Next.js 14+ | App Router, SSR |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Components** | shadcn/ui | Accessible, customizable |
| **State** | TanStack Query | Cache, sync, offline |
| **Backend** | Firebase v9 | Auth, Firestore, Storage |

### Getting Started

1. Install dependencies:
   ```bash
   npm install tailwindcss @tailwindcss/forms
   npx shadcn-ui@latest init
   ```

2. Configure Tailwind with design tokens (see `foundations.md` for complete config)

3. Import component styles and customize shadcn/ui components

4. Follow responsive patterns from `layout-patterns.md`

---

## Design Tokens (CSS Variables)

All design decisions are codified as CSS custom properties. Import these at the root of your application:

```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-score-hot: #22c55e;
  --color-score-warm: #eab308;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-size-base: 1rem;

  /* Spacing */
  --spacing-1: 0.25rem;  /* 4px */
  --spacing-4: 1rem;     /* 16px */
  --spacing-6: 1.5rem;   /* 24px */

  /* Radius */
  --radius-md: 0.5rem;   /* 8px */
  --radius-lg: 0.75rem;  /* 12px */
}
```

See `foundations.md` for the complete token reference.

---

## Responsive Breakpoints

| Breakpoint | Width | Columns | Use Case |
|------------|-------|---------|----------|
| Mobile | < 640px | 1 | Phones |
| Tablet | 640-1023px | 2 | Tablets, small laptops |
| Desktop | >= 1024px | 4 | Laptops, monitors |

---

## Accessibility

This design system is built to meet **WCAG 2.1 AA** standards:

- **Color Contrast**: All text meets 4.5:1 (normal) or 3:1 (large) ratios
- **Touch Targets**: Minimum 44px × 44px interactive areas
- **Keyboard Navigation**: Full keyboard support with visible focus states
- **Screen Readers**: Proper ARIA labels and live regions
- **Reduced Motion**: Respects `prefers-reduced-motion` preference

See `layout-patterns.md` Section 7 for detailed accessibility patterns.

---

## Contributing

When adding new components or patterns:

1. Follow existing token naming conventions
2. Ensure mobile-first responsive design
3. Include accessibility specifications
4. Document all interactive states
5. Add keyboard navigation support

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | April 2026 | Initial design system release |

---

*This design system is the source of truth for Idea Forge's visual design and user experience.*
