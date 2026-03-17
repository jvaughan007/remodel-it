# Digital Business Card for Trinity Remodeling

## Overview

A digital business card for Trinity Remodeling, adapted from the consultancy project's (`/Users/joshcodesirl/projects/AIclaudecode/vibecoding/consultancy`) existing `/c` business card feature. The card lives at `/c` as a hidden page that Nick can install as a PWA on his phone to show people in person.

## Design Decisions

- **Visual direction**: Dark & Professional — same layout structure as the consultancy card (dark gradient background, dot grid texture, gradient separator, clean content zones). No diagonal stripe.
- **Brand hierarchy**: Trinity Remodeling (company) is prominent; Nick Stephens (person) is secondary. This is a company brand card, not a personal brand card.
- **Title/subtitle**: "Owner & General Contractor" + "500+ Projects · 15+ Years in DFW" (Decision Council recommendation — keeps GC title for Texas homeowner trust, stats line differentiates)
- **Back face CTA**: Two QR codes — "Save Contact" (vCard download) + "Get a Quote" (links to `/quote` form)
- **No social**: No LinkedIn button or modal. No social media links.
- **Logo**: Uses `trinity-logo.png` (the actual Trinity Remodeling logo) on both front and back faces, not a placeholder.

## Front Face Layout

Top-to-bottom content zones, all on a dark navy gradient background with subtle teal dot grid texture:

1. **Top section** — Trinity Remodeling logo (trinity-logo.png, with subtle glow behind it) + "Trinity Remodeling" in Playfair Display serif, "Nick Stephens" below in Inter, "Owner & General Contractor" in small uppercase teal monospace
2. **Gradient separator** — horizontal line, teal-to-transparent gradient (opacity 0.4)
3. **Stats line** — "500+ Projects · 15+ Years in DFW" in small teal text
4. **Contact info** — three lines with Lucide icons in teal:
   - Mail icon + nicholas@trinity-remodeling.com
   - Phone icon + (817) 809-7997
   - Globe icon + trinity-remodeling.com (in teal tone)
5. **Flip hint** — "flip it" in bottom-right corner, very subtle teal

## Back Face Layout

1. **Teal accent bar** — 3px gradient bar across the top edge
2. **Compact logo** — smaller trinity-logo.png + "Trinity Remodeling" text
3. **Dual QR codes** — side by side, centered:
   - Left: Save Contact → `https://trinity-remodeling.com/api/vcard` (full absolute URL for QR scanning). Icon: `Share2` from lucide-react.
   - Right: Get a Quote → `https://trinity-remodeling.com/quote` (full absolute URL). Icon: `FileText` from lucide-react.
4. **Flip hint** — "flip it" in bottom-right corner

## Color Palette

All colors match the existing Trinity Remodeling website. The card component uses **inline styles with hex values** (not Tailwind theme tokens). This avoids adding `brand-*` tokens to the `@theme` block that would conflict with the existing site's light-themed CSS variables.

| Name | Value | Usage |
|------|-------|-------|
| Deep Navy | `#0A1A2F` | Primary card background |
| Navy Light | `#132D4A` | Gradient endpoint |
| Teal | `#2BB6C9` | Accent color, icons, separator, stats |
| Teal Dark | `#239AA9` | Gradient endpoint for teal bars |
| Soft White | `#F5F5F5` | Primary text (brand name, person name) |
| Card Silver | `#8899AA` | Secondary text (contact info, subtitle). Note: differs from site's `--steel-gray` (#71797E) — this is lighter for dark background readability. |
| Teal Muted | `rgba(43, 182, 201, 0.6)` | Title text, subtle accents |

## Typography

The card uses `font-serif` (Playfair Display) and `font-sans` (Inter) utility classes, which are already configured in the project's `@theme` block and root layout font variables. No new font theme tokens are needed.

| Font | Utility Class | Usage |
|------|---------------|-------|
| Playfair Display | `font-serif` | "Trinity Remodeling" brand name |
| Inter | `font-sans` (default) | Nick's name, contact info, labels |
| System monospace | `font-mono` (built-in Tailwind) | "Owner & General Contractor" title (small, uppercase, tracked) |

All text uses `clamp()` for fluid responsive sizing, matching the consultancy card approach.

## Animation

Identical to the consultancy card:

- **3D flip**: Framer Motion `rotateY` with 0.6s ease `[0.4, 0, 0.2, 1]`
- **Glow shimmer**: `useTransform` on `rotateY` to flash teal glow at the 90-degree midpoint
- **Glow shadow**: `0 0 30px rgba(43, 182, 201, opacity)` (using Trinity's teal instead of cyan)

## Card Sizing

Same responsive approach as the consultancy card:

- **Standalone (PWA)**: `min(92vw, calc(75dvh * 1.7), 700px)`
- **Browser**: `min(90vw, calc(55svh * 1.7), 600px)`
- **Aspect ratio**: `17 / 10`
- **Perspective**: `1200px`

## PWA Configuration

### Manifest (`public/manifest-card.json`)

- `name`: "Nick's Card"
- `short_name`: "Card"
- `start_url`: "/c"
- `display`: "standalone"
- `background_color`: "#0A1A2F"
- `theme_color`: "#2BB6C9"
- Icons: existing `icon-192.png`, `icon-512.png`, `apple-icon.png`

### Layout metadata

- `appleWebApp.capable`: true
- `appleWebApp.title`: "Nick's Card"
- `appleWebApp.statusBarStyle`: "black-translucent"

## vCard API (`/api/vcard`)

Generates a downloadable `.vcf` file. Imports contact data from `@/lib/card-constants` (NOT `@/lib/constants`).

Photo path: `join(process.cwd(), "public/nick-stephens-professional.png")` — note the file is in the public root, not in `public/images/`.

```
FN: Nick Stephens
ORG: Trinity Remodeling
TITLE: Owner & General Contractor
TEL: +18178097997
EMAIL: nicholas@trinity-remodeling.com
URL: https://trinity-remodeling.com
ADR: Dallas, TX
NOTE: Premium home remodeling in DFW — kitchens, bathrooms, whole home, additions, outdoor living, flooring.
PHOTO: (public/nick-stephens-professional.png, base64-encoded)
```

## Contact Constants (`src/lib/card-constants.ts`)

```typescript
export const VCARD = {
  firstName: "Nick",
  lastName: "Stephens",
  fullName: "Nick Stephens",
  title: "Owner & General Contractor",
  org: "Trinity Remodeling",
  email: "nicholas@trinity-remodeling.com",
  phone: "+18178097997",
  phoneFormatted: "(817) 809-7997",
  url: "https://trinity-remodeling.com",
  location: "Dallas, TX",
  note: "Premium home remodeling in DFW — kitchens, bathrooms, whole home, additions, outdoor living, flooring.",
} as const;
```

## Files to Create

| File | Type | Description |
|------|------|-------------|
| `src/app/c/page.tsx` | NEW | Page component with noindex metadata |
| `src/app/c/layout.tsx` | NEW | PWA layout with manifest link, standalone styles |
| `src/app/c/business-card.tsx` | NEW | Main card component (flip animation, QR codes, front/back) |
| `src/app/api/vcard/route.ts` | NEW | vCard download endpoint |
| `src/lib/card-constants.ts` | NEW | Nick's contact data constants |
| `public/manifest-card.json` | NEW | PWA manifest for `/c` route |

## Files to Modify

| File | Change |
|------|--------|
| `src/app/globals.css` | Add `.card-layout-root` styles, PWA standalone landscape handling, body background override for `/c` route |
| `src/app/layout.tsx` | Conditionally hide `<Navigation />`, `<Footer />`, and `<MobileCTA />` when the pathname is `/c`. Use `usePathname()` or restructure into route groups. Simplest approach: move main site pages into a `(main)` route group that renders nav/footer, and let `/c` sit outside it with its own layout. |
| `src/middleware.ts` | Add `/c` and `/api/vcard` to the matcher exclusion pattern to skip unnecessary Supabase auth calls on the card page |

## Root Layout / Route Group Strategy

The root `layout.tsx` currently wraps ALL routes with `<Navigation />`, `<Footer />`, and `<MobileCTA />`. The `/c` route must NOT render these.

**Recommended approach**: Move all existing pages into a `(main)` route group:
- `src/app/(main)/layout.tsx` — contains Navigation, Footer, MobileCTA wrapping
- `src/app/(main)/page.tsx` — existing homepage (moved from `src/app/page.tsx`)
- `src/app/(main)/about/`, `services/`, `gallery/`, `contact/`, `quote/`, `admin/`, etc. — all existing routes moved
- `src/app/layout.tsx` — root layout with just `<html>`, `<body>`, fonts, globals.css (no nav/footer)
- `src/app/c/layout.tsx` — card-specific layout (dark background, standalone PWA)

This ensures `/c` never renders nav/footer without conditional logic or CSS hacks.

**Additional file operations for route group restructuring** (not listed in tables above):
- CREATE `src/app/(main)/layout.tsx` — wraps children with Navigation, Footer, MobileCTA
- MOVE all existing routes (`page.tsx`, `about/`, `services/`, `gallery/`, `contact/`, `quote/`, `admin/`, `tr-admin-gate/`, `auth/`, `api/contact/`, `api/gallery/`, `api/leads/`, `api/auth/`) into `src/app/(main)/`
- The `/c` route and `/api/vcard` stay at the app root, outside the `(main)` group

## Body Background Handling

The root `globals.css` sets `body { background: var(--soft-white) }` (#F5F5F5). The card layout needs dark navy (#0A1A2F). Add a scoped override in globals.css:

```css
.card-layout-root {
  background: #0A1A2F;
}

/* Override body background when card layout is active */
body:has(.card-layout-root) {
  background: #0A1A2F;
}
```

## Dependencies

Already installed in the project:

- `framer-motion` (12.34.3) — 3D flip animation
- `lucide-react` (0.577.0) — Mail, Phone, Globe (front face), Share2, FileText (back face QR labels)
- `next` (16.1.6) — framework, Image component, API routes

Need to install:

- `qrcode` + `@types/qrcode` — QR code generation (toDataURL)

## Key Differences from Consultancy Card

| Aspect | Consultancy | Trinity |
|--------|-------------|---------|
| Brand hierarchy | Personal ("JOSH THE AI GUY") | Company ("Trinity Remodeling") |
| Logo | logo-mark.svg (network node) | trinity-logo.png |
| Compact logo | logo-compact.svg (text+mark) | trinity-logo.png (smaller) |
| Fonts | Space Grotesk + DM Sans + Geist Mono | Playfair Display + Inter |
| Accent color | Blue-to-cyan gradient (#3b82f6→#22d3ee) | Solid teal (#2BB6C9) |
| Back QR 2 | Book a Call (cal.com) | Get a Quote (/quote) |
| LinkedIn button | Yes (below card) | No |
| LinkedIn modal | Yes (QR to profile) | No |
| Stats line | No | Yes ("500+ Projects · 15+ Years in DFW") |
| Title style | "AI Consulting & Automation" monospace | "Owner & General Contractor" monospace |
| vCard photo | josh-contact-photo.png | nick-stephens-professional.png |
