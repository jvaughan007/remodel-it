# Digital Business Card Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a digital business card for Trinity Remodeling at `/c`, adapted from the consultancy project's card feature, with PWA support so Nick can install it on his phone.

**Architecture:** The card is a standalone route (`/c`) isolated from the main site via a `(main)` route group. It uses Framer Motion for a 3D flip animation, QR code generation for Save Contact and Get a Quote CTAs, and a vCard API endpoint. All styling uses inline hex values to avoid conflicts with the site's Tailwind theme.

**Tech Stack:** Next.js 16, React 19, Framer Motion, qrcode library, Lucide icons, Tailwind CSS 4

**Spec:** `docs/superpowers/specs/2026-03-15-digital-business-card-design.md`

**Reference implementation:** `/Users/joshcodesirl/projects/AIclaudecode/vibecoding/consultancy/src/app/c/` (Josh's card — adapt, don't copy verbatim)

---

## Chunk 1: Foundation & Route Isolation

### Task 1: Install qrcode dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install qrcode and types**

```bash
npm install qrcode @types/qrcode
```

- [ ] **Step 2: Verify installation**

```bash
node -e "require('qrcode'); console.log('qrcode OK')"
```

Expected: `qrcode OK`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add qrcode dependency for business card QR generation"
```

---

### Task 2: Restructure routes into (main) route group

The root `layout.tsx` currently wraps ALL routes with Navigation, Footer, and MobileCTA. The `/c` route must not render these. We solve this by moving all existing pages into a `(main)` route group.

**Files:**
- Modify: `src/app/layout.tsx` — strip out Navigation/Footer/MobileCTA, keep only html/body/fonts/globals
- Create: `src/app/(main)/layout.tsx` — wraps children with Navigation, Footer, MobileCTA
- Move: all existing page routes into `src/app/(main)/`

**Important:** `(main)` is a route group — the parentheses mean it does NOT affect URLs. All existing routes keep their same URLs.

- [ ] **Step 1: Create the (main) route group layout**

Create `src/app/(main)/layout.tsx`:

```tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navigation />
      <main className="overflow-x-hidden w-full">{children}</main>
      <Footer />
      <MobileCTA />
    </>
  );
}
```

- [ ] **Step 2: Strip root layout to shell only**

Modify `src/app/layout.tsx` to remove Navigation, Footer, MobileCTA imports and rendering. Keep only the html/body shell with fonts and globals:

```tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trinity Remodeling - Premier Home Remodeling in Dallas/Fort Worth",
  description: "Transform your home with Trinity Remodeling. Professional kitchen, bathroom, and whole home renovations serving Dallas, Fort Worth, Plano, Frisco, and surrounding DFW areas.",
  keywords: "home remodeling, kitchen renovation, bathroom remodel, Dallas, Fort Worth, DFW, contractor, home renovation, interior design",
  authors: [{ name: "Trinity Remodeling" }],
  openGraph: {
    title: "Trinity Remodeling - Premier Home Remodeling in Dallas/Fort Worth",
    description: "Transform your home with professional remodeling services in the DFW area",
    url: "https://trinity-remodeling.com",
    siteName: "Trinity Remodeling",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trinity Remodeling - Premier Home Remodeling in Dallas/Fort Worth",
    description: "Transform your home with professional remodeling services in the DFW area",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Move all existing page routes into (main)**

```bash
cd /Users/joshcodesirl/projects/AIclaudecode/vibecoding/remodel-it/src/app
mkdir -p "(main)"
mv page.tsx "(main)/"
mv about "(main)/"
mv contact "(main)/"
mv gallery "(main)/"
mv quote "(main)/"
mv services "(main)/"
mv admin "(main)/"
mv tr-admin-gate "(main)/"
mv auth "(main)/"
mkdir -p "(main)/api"
mv api/contact "(main)/api/"
mv api/gallery "(main)/api/"
mv api/leads "(main)/api/"
mv api/auth "(main)/api/"
```

Note: Move the api routes that belong to the main site. Keep the `api/` directory at the app root for the new `api/vcard/` route. After moving, if `src/app/api/` is empty, that's fine — we'll create `api/vcard/` in a later task.

- [ ] **Step 4: Verify the site still works**

```bash
npm run build
```

Expected: Build succeeds with no errors. All existing routes should work at the same URLs (route groups don't affect URL paths).

- [ ] **Step 5: Spot-check in dev**

```bash
npm run dev
```

Open `http://localhost:3000` — verify homepage renders with Navigation, Footer, MobileCTA.
Open `http://localhost:3000/about` — verify about page renders normally.
Open `http://localhost:3000/quote` — verify quote form renders normally.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: move site routes into (main) route group for card isolation"
```

---

### Task 3: Update middleware to exclude card routes

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 1: Add /c and /api/vcard to the matcher exclusion**

Update the matcher regex in `src/middleware.ts` to exclude `/c` and `/api/vcard`:

```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|c$|c/|api/vcard|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "perf: exclude /c and /api/vcard from Supabase middleware"
```

---

### Task 4: Add card CSS to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add card-layout-root styles and body background override**

Append to the end of `src/app/globals.css`:

```css
/* ==================== Business Card (/c) ==================== */
.card-layout-root {
  background: #0A1A2F;
}

body:has(.card-layout-root) {
  background: #0A1A2F;
}

@media (display-mode: standalone) and (orientation: landscape) {
  .card-layout-root {
    padding-top: env(safe-area-inset-top, 0.5rem) !important;
    align-items: center !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add card-layout-root styles and PWA landscape handling"
```

---

## Chunk 2: Constants, vCard API & PWA Manifest

### Task 5: Create card constants

**Files:**
- Create: `src/lib/card-constants.ts`

- [ ] **Step 1: Create the constants file**

Create `src/lib/card-constants.ts`:

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

export const VCARD_URL = "https://trinity-remodeling.com/api/vcard";
export const QUOTE_URL = "https://trinity-remodeling.com/quote";
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/card-constants.ts
git commit -m "feat: add card constants for Trinity Remodeling business card"
```

---

### Task 6: Create vCard API endpoint

**Files:**
- Create: `src/app/api/vcard/route.ts`

Reference: `/Users/joshcodesirl/projects/AIclaudecode/vibecoding/consultancy/src/app/api/vcard/route.ts`

- [ ] **Step 1: Create the vCard route**

Create `src/app/api/vcard/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { VCARD } from "@/lib/card-constants";

export async function GET() {
  let photoBase64 = "";
  try {
    const photoPath = join(process.cwd(), "public/nick-stephens-professional.png");
    const photoBuffer = readFileSync(photoPath);
    photoBase64 = photoBuffer.toString("base64");
  } catch {
    // Photo is optional — vCard works without it
  }

  const photoLine = photoBase64
    ? `PHOTO;ENCODING=b;TYPE=PNG:${photoBase64}\n`
    : "";

  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${VCARD.lastName};${VCARD.firstName};;;`,
    `FN:${VCARD.fullName}`,
    `ORG:${VCARD.org}`,
    `TITLE:${VCARD.title}`,
    `TEL;TYPE=CELL:${VCARD.phone}`,
    `EMAIL;TYPE=INTERNET:${VCARD.email}`,
    `URL:${VCARD.url}`,
    `ADR;TYPE=WORK:;;${VCARD.location};;;;`,
    `NOTE:${VCARD.note}`,
    photoLine ? photoLine.trim() : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");

  return new NextResponse(vcf, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="nick-stephens.vcf"',
      "Cache-Control": "public, max-age=86400",
    },
  });
}
```

Note: No `X-SOCIALPROFILE` line — Nick has no social media links. Import from `@/lib/card-constants`, not `@/lib/constants`.

- [ ] **Step 2: Test the endpoint**

```bash
npm run dev
```

```bash
curl -s http://localhost:3000/api/vcard | head -15
```

Expected output should start with:
```
BEGIN:VCARD
VERSION:3.0
N:Stephens;Nick;;;
FN:Nick Stephens
ORG:Trinity Remodeling
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/vcard/route.ts
git commit -m "feat: add vCard download API for business card"
```

---

### Task 7: Create PWA manifest

**Files:**
- Create: `public/manifest-card.json`

- [ ] **Step 1: Create the manifest**

Create `public/manifest-card.json`:

```json
{
  "name": "Nick's Card",
  "short_name": "Card",
  "description": "Digital business card for Trinity Remodeling",
  "start_url": "/c",
  "display": "standalone",
  "background_color": "#0A1A2F",
  "theme_color": "#2BB6C9",
  "icons": [
    {
      "src": "/apple-icon.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add public/manifest-card.json
git commit -m "feat: add PWA manifest for business card"
```

---

## Chunk 3: Card Page & Layout

### Task 8: Create card layout with PWA metadata

**Files:**
- Create: `src/app/c/layout.tsx`

Reference: `/Users/joshcodesirl/projects/AIclaudecode/vibecoding/consultancy/src/app/c/layout.tsx`

- [ ] **Step 1: Create the card layout**

Create `src/app/c/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  manifest: "/manifest-card.json",
  icons: {
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Nick's Card",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#2BB6C9",
};

export default function CardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="card-layout-root flex h-[100svh] items-center justify-center overflow-hidden p-3 landscape:items-center landscape:justify-center landscape:p-2 landscape:pt-[50px] landscape:pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
}
```

Note: Uses `card-layout-root` class (not `bg-brand-bg` like the consultancy) — the background is set via the CSS class we added in Task 4.

- [ ] **Step 2: Create the card page**

Create `src/app/c/page.tsx`:

```tsx
import type { Metadata } from "next";
import { BusinessCard } from "./business-card";

export const metadata: Metadata = {
  title: "Nick Stephens | Trinity Remodeling",
  description: "Digital business card for Trinity Remodeling",
  robots: { index: false, follow: false },
};

export default function CardPage() {
  return <BusinessCard />;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/c/layout.tsx src/app/c/page.tsx
git commit -m "feat: add card page and PWA layout at /c"
```

---

### Task 9: Build the business card component

This is the main component. Adapt from the consultancy card but with Trinity branding, no LinkedIn, and the "Get a Quote" QR code instead of "Book a Call."

**Files:**
- Create: `src/app/c/business-card.tsx`

Reference: `/Users/joshcodesirl/projects/AIclaudecode/vibecoding/consultancy/src/app/c/business-card.tsx`

- [ ] **Step 1: Create the business card component**

Create `src/app/c/business-card.tsx`:

```tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import QRCode from "qrcode";
import Image from "next/image";
import { VCARD, VCARD_URL, QUOTE_URL } from "@/lib/card-constants";
import { Mail, Phone, Globe, Share2, FileText } from "lucide-react";

function useQRCode(url: string) {
  const [src, setSrc] = useState<string>("");
  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 280,
      margin: 2,
      color: { dark: "#0A1A2F", light: "#ffffff" },
      errorCorrectionLevel: "M",
    }).then(setSrc);
  }, [url]);
  return src;
}

function useIsStandalone() {
  const [standalone, setStandalone] = useState(false);
  useEffect(() => {
    setStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        ("standalone" in window.navigator &&
          (window.navigator as unknown as { standalone: boolean }).standalone)
    );
  }, []);
  return standalone;
}

export function BusinessCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const qrContact = useQRCode(VCARD_URL);
  const qrQuote = useQRCode(QUOTE_URL);
  const isStandalone = useIsStandalone();

  const flip = useCallback(() => setIsFlipped((f) => !f), []);

  const rotateY = useMotionValue(0);
  const glowOpacity = useTransform(
    rotateY,
    [0, 70, 90, 110, 180],
    [0, 0, 1, 0, 0]
  );
  const glowShadow = useTransform(
    glowOpacity,
    (v) => `0 0 30px rgba(43, 182, 201, ${v * 0.35})`
  );

  const cardWidth = isStandalone
    ? "min(92vw, calc(75dvh * 1.7), 700px)"
    : "min(90vw, calc(55svh * 1.7), 600px)";

  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-[2dvh] landscape:justify-center landscape:gap-[1.5dvh]"
      style={isStandalone ? { paddingTop: 0 } : undefined}
    >
      {/* Card container */}
      <div
        className="relative cursor-pointer"
        style={{
          perspective: 1200,
          width: cardWidth,
          aspectRatio: "17 / 10",
        }}
        onClick={flip}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            transformStyle: "preserve-3d",
            rotateY,
            boxShadow: glowShadow,
          }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* ==================== FRONT FACE ==================== */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 p-[5%] shadow-2xl shadow-black/40"
            style={{
              backfaceVisibility: "hidden",
              background: "linear-gradient(135deg, #132D4A 0%, #0A1A2F 100%)",
            }}
          >
            {/* Dot grid background texture */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(43, 182, 201, 0.06) 0.5px, transparent 0.5px)",
                backgroundSize: "16px 16px",
              }}
            />

            <div className="relative flex h-full flex-col justify-between">
              {/* Top: Trinity logo + brand name */}
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  {/* Subtle glow behind logo */}
                  <div
                    className="absolute -inset-2 rounded-full blur-xl"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(43, 182, 201, 0.15) 0%, transparent 70%)",
                    }}
                  />
                  <Image
                    src="/trinity-logo.png"
                    alt="Trinity Remodeling"
                    width={40}
                    height={40}
                    className="relative h-[12%] w-auto"
                    style={{ minWidth: 28, minHeight: 28 }}
                  />
                </div>
                <div>
                  <h1 className="font-serif text-[clamp(13px,3.5vw,22px)] font-semibold leading-tight tracking-tight text-[#F5F5F5]">
                    Trinity Remodeling
                  </h1>
                  <p className="mt-0.5 text-[clamp(11px,2.5vw,16px)] text-[#8899AA]">
                    Nick Stephens
                  </p>
                  <p
                    className="mt-1 font-mono text-[clamp(6px,1.5vw,10px)] uppercase"
                    style={{ letterSpacing: "2px", color: "rgba(43, 182, 201, 0.6)" }}
                  >
                    Owner & General Contractor
                  </p>
                </div>
              </div>

              {/* Gradient separator line */}
              <div
                className="my-1 h-px w-full"
                style={{
                  background: "linear-gradient(to right, #2BB6C9, transparent)",
                  opacity: 0.4,
                }}
              />

              {/* Stats line */}
              <p
                className="text-[clamp(7px,1.8vw,11px)]"
                style={{ color: "rgba(43, 182, 201, 0.55)", letterSpacing: "1px" }}
              >
                500+ Projects · 15+ Years in DFW
              </p>

              {/* Contact info */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-[clamp(11px,2.5vw,16px)] text-[#8899AA]">
                  <Mail className="h-3 w-3 shrink-0 text-[#2BB6C9]" />
                  <span>{VCARD.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[clamp(11px,2.5vw,16px)] text-[#8899AA]">
                  <Phone className="h-3 w-3 shrink-0 text-[#2BB6C9]" />
                  <span>{VCARD.phoneFormatted}</span>
                </div>
                <div className="flex items-center gap-2 text-[clamp(11px,2.5vw,16px)] text-[#8899AA]">
                  <Globe className="h-3 w-3 shrink-0 text-[#2BB6C9]" />
                  <span
                    className="font-mono text-[clamp(10px,2.2vw,15px)] tracking-wide"
                    style={{ color: "rgba(43, 182, 201, 0.7)" }}
                  >
                    trinity-remodeling.com
                  </span>
                </div>
              </div>
            </div>

            {/* Flip hint */}
            <div
              className="absolute bottom-1 right-2 text-[clamp(7px,1.5vw,10px)] font-medium"
              style={{ color: "rgba(43, 182, 201, 0.4)" }}
            >
              flip it
            </div>
          </div>

          {/* ==================== BACK FACE ==================== */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-2xl px-[5%] shadow-2xl shadow-black/40"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "linear-gradient(135deg, #132D4A 0%, #0A1A2F 100%)",
            }}
          >
            {/* Dot grid background texture (matches front) */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(43, 182, 201, 0.06) 0.5px, transparent 0.5px)",
                backgroundSize: "16px 16px",
              }}
            />

            {/* Teal gradient bar */}
            <div
              className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl"
              style={{
                background: "linear-gradient(to right, #2BB6C9, #239AA9)",
              }}
            />

            {/* Compact logo */}
            <div className="relative mb-3 mt-4 flex items-center gap-2">
              <Image
                src="/trinity-logo.png"
                alt="Trinity Remodeling"
                width={24}
                height={24}
                className="h-6 w-auto"
              />
              <span className="font-serif text-sm font-semibold text-[#F5F5F5]">
                Trinity Remodeling
              </span>
            </div>

            {/* Dual QR codes side by side */}
            <div className="relative flex w-full items-start justify-center gap-[8%]">
              {/* Save Contact QR */}
              <div className="flex w-[38%] flex-col items-center">
                {qrContact && (
                  <div className="rounded-xl bg-white p-1.5">
                    <img
                      src={qrContact}
                      alt="Scan to save contact"
                      className="w-full rounded-lg"
                      style={{ aspectRatio: "1 / 1" }}
                    />
                  </div>
                )}
                <div className="mt-2 flex items-center gap-1.5">
                  <Share2 className="h-3.5 w-3.5 text-[#2BB6C9]" />
                  <p className="text-[clamp(9px,2vw,13px)] font-semibold text-[#8899AA]">
                    Save Contact
                  </p>
                </div>
              </div>

              {/* Get a Quote QR */}
              <div className="flex w-[38%] flex-col items-center">
                {qrQuote && (
                  <div className="rounded-xl bg-white p-1.5">
                    <img
                      src={qrQuote}
                      alt="Scan to get a quote"
                      className="w-full rounded-lg"
                      style={{ aspectRatio: "1 / 1" }}
                    />
                  </div>
                )}
                <div className="mt-2 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-[#2BB6C9]" />
                  <p className="text-[clamp(9px,2vw,13px)] font-semibold text-[#8899AA]">
                    Get a Quote
                  </p>
                </div>
              </div>
            </div>

            {/* Flip hint */}
            <div
              className="absolute bottom-1 right-2 text-[clamp(7px,1.5vw,10px)] font-medium"
              style={{ color: "rgba(43, 182, 201, 0.4)" }}
            >
              flip it
            </div>
          </div>
        </motion.div>
      </div>

      {/* Brand watermark — hidden in landscape to save space */}
      <p className="shrink-0 text-[11px] landscape:hidden" style={{ color: "rgba(136, 153, 170, 0.4)" }}>
        Trinity Remodeling
      </p>
    </div>
  );
}
```

Key differences from the consultancy card:
- Imports from `@/lib/card-constants` (not `@/lib/constants`)
- Uses `trinity-logo.png` (not `logo-mark.svg` / `logo-compact.svg`)
- All colors via inline hex/rgba (not `brand-*` Tailwind tokens)
- `font-serif` for brand name (not `font-heading`)
- No LinkedIn state, modal, or button
- No `qrLinkedIn` / `showLinkedIn` / `modalRef`
- `qrQuote` with `FileText` icon replaces `qrBooking` with `CalendarCheck`
- Stats line between separator and contact info
- "Trinity Remodeling" prominent, "Nick Stephens" secondary
- QR dark color is `#0A1A2F` (Trinity navy, not `#0f172a`)
- Glow uses Trinity teal `rgba(43, 182, 201, ...)` not consultancy cyan

- [ ] **Step 2: Verify it builds**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Test in browser**

```bash
npm run dev
```

Open `http://localhost:3000/c`:
- Card should render on dark navy background
- No nav/footer/MobileCTA visible
- Front face shows Trinity logo, brand name, Nick's info, stats, contact
- Click to flip — should animate with teal glow shimmer
- Back face shows compact Trinity logo + two QR codes
- QR codes should be scannable (test with phone camera)

- [ ] **Step 4: Commit**

```bash
git add src/app/c/business-card.tsx
git commit -m "feat: implement Trinity Remodeling business card component"
```

---

## Chunk 4: Verification & Final Commit

### Task 10: Full build and verification

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Verify all existing routes still work**

```bash
npm run dev
```

Check these URLs:
- `http://localhost:3000` — homepage with nav/footer
- `http://localhost:3000/about` — about page with nav/footer
- `http://localhost:3000/services` — services page
- `http://localhost:3000/contact` — contact form
- `http://localhost:3000/quote` — quote form
- `http://localhost:3000/c` — business card (NO nav/footer, dark background)
- `http://localhost:3000/api/vcard` — downloads .vcf file

- [ ] **Step 3: Test PWA installability**

Open `http://localhost:3000/c` on a mobile device or use Chrome DevTools:
- Application tab → Manifest should show "Nick's Card"
- Should offer "Add to Home Screen" option

- [ ] **Step 4: Test landscape mode**

Rotate device or resize browser to landscape:
- Card should still be centered and properly sized
- No content clipping

- [ ] **Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "feat: complete Trinity Remodeling digital business card at /c"
```
