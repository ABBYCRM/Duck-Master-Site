---
name: Duck Master CSS handbook tricks
description: CSS patterns from two handbooks applied to index.css; do not wipe without re-applying.
---

## Sources

1. "The Free Web-Making Mega Handbook" (PDF, 448 pages, 430 recipes) — Snippets 079–221.
2. "CSS Tricks Compendium" (TXT, 120 patterns, 12 sections).

## Applied patterns (index.css)

From Handbook: fluid gutter (clamp), fluid headings (clamp), auto-fit grid, scroll-snap strip, glass panel (backdrop-filter), soft card shadow, hover lift (translateY), smooth transition, multi-line clamp, mask fade, uppercase tracking, content-visibility: auto, radial dot grid bg, focus-visible ring, spotlight hero gradient, design tokens (CSS custom properties).

From Compendium: animated gradient text (003), rotating conic glow border on hover (001, @property --glow-angle), spotlight hero (009), scroll-driven progress bar (090, animation-timeline: scroll), stagger entry via --card-i custom prop (082), @starting-style (088), text-wrap: balance/pretty (033/034), tabular-nums (037), :focus-within on search (047), ::selection (069), themed scrollbars (097), skip link (112), reduced-motion safety net (081), color-mix() hover tints (105), container queries on tool grid (023), CSS nesting in .tool-card (110), print styles (119), prefers-contrast (114), touch targets (115).

**Why:** Do not reset index.css to a blank slate without re-applying these — the visual identity and performance patterns depend on them.
