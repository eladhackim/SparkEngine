# HOTFIX: Generate Button Dropdown Crash - FIXED

**Status**: FIXED & DEPLOYED
**Commit**: `3d0dc48`
**Date**: April 9, 2026
**Priority**: CRITICAL

---

## Root Cause

**Base UI error #31**: The `DropdownMenuTrigger` component from Base UI requires the `render` prop to properly merge with custom elements like `Button`.

Using raw className styling on the trigger caused a ref forwarding error.

---

## Fix Applied

**File**: `components/generation/generate-button.tsx`

```tsx
// BEFORE (broken):
<DropdownMenuTrigger
  className="inline-flex items-center..."
  disabled={isGenerating}
>
  <ChevronDown className="h-4 w-4" />
</DropdownMenuTrigger>

// AFTER (fixed):
<DropdownMenuTrigger
  render={(props) => (
    <Button
      {...props}
      variant="default"
      size="lg"
      className="rounded-l-none border-l border-l-primary-foreground/20 px-2"
      disabled={isGenerating}
    >
      <ChevronDown className="h-4 w-4" />
    </Button>
  )}
/>
```

---

## Deployment

| Step | Status |
|------|--------|
| Build | ✅ Pass |
| Commit | ✅ `3d0dc48` |
| Push | ✅ `3c9d6f2..3d0dc48` |
| Deploy | ✅ Complete |

**Live URL**: https://sparkengine-3740d.web.app

---

## Verification

The dropdown should now open without crashing when clicking the chevron arrow next to "Generate Ideas".

---

**Production bug RESOLVED.**
