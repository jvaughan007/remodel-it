# Services Page: Grid + Inline Detail Panel

## Problem

Clicking a service card updates a disconnected detail section below the fold. Users don't notice the change. No scroll behavior, no animation retrigger, no selected-card indicator. The "Learn More" button silently sets state with zero feedback.

## Decision

Unanimous decision council recommendation: **Grid + Inline Detail Panel** hybrid pattern.

Eliminated: Carousel (hides 5/6 services, ~1% interaction past first slide), Pure Tabs (6 tabs overflow mobile, loses visual card grid).

## Design

### Card Grid (unchanged layout)
- 6 service cards: 3-col desktop, 2-col tablet, 1-col mobile
- Each card shows: image, title, price badge, timeline, short description, 3 bullet features, "View Details" button with chevron
- All cards always visible for scanning and comparison

### Inline Detail Panel
- **Desktop/tablet (2-3 col)**: Clicking a card inserts a full-width detail panel between that card's row and the next row. Selected card gets teal ring + downward arrow connecting to panel.
- **Mobile (1 col)**: Accordion pattern -- detail expands directly below the tapped card.
- Only one panel open at a time. Clicking same card closes it. Clicking different card moves/swaps panel.

### Detail Panel Contents
- Full description paragraph
- All 6 features (with checkmarks)
- Large service image
- Price range and timeline badges
- Prominent CTA: "Get Free Quote for [Service Name]" linking to `/quote?service=[slug]`

### Quote Form Pre-selection
- `/quote` page reads `?service=` query param
- Pre-selects the "Type of Project" dropdown matching the service slug
- Existing `slug` fields in service data map to quote form option values

### Animation
- Panel open/close: Framer Motion `AnimatePresence` with height animation (~300ms ease-out)
- Content crossfade when switching services within same row
- Respect `prefers-reduced-motion`

### What to Remove
- The entire "Featured Service Detail" section (current lines 253-317 in services/page.tsx)

### What Stays Unchanged
- Hero section, Process section, Service Areas section, bottom CTA section
- Navigation, footer, all other pages
- Service data structure (already has all needed fields)

## Files to Modify
- `src/app/services/page.tsx` -- Rewrite card interaction, add inline detail panel, remove old detail section
- `src/app/quote/page.tsx` -- Read `?service=` query param, pre-select service type dropdown

## Tech
- React state: `expandedService` (number | null) replaces `activeService`
- Framer Motion: `AnimatePresence`, `motion.div` with layout animations
- Grid row tracking: Math based on card index and columns-per-breakpoint
- Tailwind CSS v4 for responsive breakpoints
