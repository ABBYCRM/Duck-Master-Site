---
name: Duck Master mobile/tablet CSS patterns
description: CSS patterns added for mobile/tablet harmonization pass; key classes and what they do.
---

# Duck Master Mobile/Tablet CSS Patterns

**Why:** Mobile pass added ~15 CSS patterns on top of the existing 30+ handbook tricks.

## Key new patterns in index.css

| Pattern | Class / rule | What it does |
|---|---|---|
| 064 | `--safe-top/bottom/left/right` tokens | `env(safe-area-inset-*)` for notched phones |
| 073 | `scroll-padding-top` on `html` | Anchors clear sticky header |
| 066 | `-webkit-tap-highlight-color: transparent` | No blue flash on mobile tap |
| 067 | `user-select: none` on buttons | No accidental text selection |
| 093 | `overscroll-behavior-y: none` on body | No pull-to-refresh bleed |
| 044 | `overscroll-behavior: contain` on sidebar | Sidebar scroll stays contained |
| 060 | `touch-action: pan-x` on `.scroll-snap-x` | Horizontal pans don't block vertical |
| 030b | `:active { scale: 0.97 }` on touch cards | Press feedback on hover-none devices |
| 056 | `.mobile-nav-outer` grid-template-rows | Smooth height animation without JS |
| 048 | `body:has(.mobile-nav-outer[data-open])` | Locks body scroll when drawer open |
| 070 | `.pill-scroll` + `.pill-scroll-wrap` | Momentum horizontal pill scroll with right-fade |
| 025 | `.accordion-body` grid-template-rows | Smooth accordion expand (footer, FAQ) |
| 107 | `.back-to-top` | Fixed floating button, appears after 300px scroll |
| 053 | `.article-with-sidebar` container query | Sidebar visible only at ≥720px container |
| 042 | `.guide-h1`, `.guide-lead`, `.guide-section-h2` | Fluid type scale for guide articles |
| 027 | `.module-hero`, `.module-hero-inner` | Compact, clamp-padded module hero |

## Component changes

- **PageLayout.tsx**: animated mobile nav drawer, accordion footer on mobile, back-to-top button, "Directory" link visible on mobile, breadcrumb truncation with `min-w-0`
- **GuidePage.tsx**: mobile pill scroll for related modules/guides (shown below article on mobile); desktop sidebar uses `article-sidebar` container-query class
- **ModulePage.tsx**: pill scroll for use-cases and related modules on mobile; `active:scale-95` on tool cards; compact hero; prev/next shows "Prev"/"Next" text on mobile instead of full label

## How to apply

Any new page using `PageLayout` gets back-to-top and safe-area footer for free.
For horizontal scrollable content on mobile, use `.pill-scroll-wrap > .pill-scroll`.
For smooth height transitions (drawers, accordions), use `.accordion-body[data-open]` + `.accordion-inner`.
