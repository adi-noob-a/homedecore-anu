# Interior Design Hub — HomeDecore Anu

A content-rich decision-support platform for Indian homeowners planning interior work. Built with Next.js 16 + TypeScript + Tailwind CSS + Framer Motion.

**Live:** [homedecore-anu.vercel.app](https://homedecore-anu.vercel.app)

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | [Next.js](https://nextjs.org/) | ^16.2.10 |
| UI runtime | [React](https://react.dev/) | ^19.2.3 |
| Language | [TypeScript](https://www.typescriptlang.org/) | ^5.3.0 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) | ^3.4.0 |
| Animation | [Framer Motion](https://www.framer.com/motion/) | ^11.18.2 |
| 3D | [three.js](https://threejs.org/) + [@react-three/fiber](https://r3f.docs.pmnd.rs/) 9 + [@react-three/drei](https://github.com/pmndrs/drei) 10 | three ^0.170, fiber ^9.8, drei ^10.7 |
| Icons | [Lucide React](https://lucide.dev/) | ^0.350.0 |
| PDF Export | [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) | ^0.14.0 |
| Database | [Supabase](https://supabase.com/) (@supabase/supabase-js) | ^2.108.1 |
| Package Manager | npm | — |

Also installed: `motion@^12.42.2` (redundant — same as framer-motion, kept for compatibility).

**UI Sketching:** [21st.dev](https://21st.dev/) CLI + MCP server integrated (API key configured).

---

## Project Structure

```
interior-design-platform/
├── phase-1-deliverables/          # Content & design specs (JSON data sources)
│   └── data/                      # All content as typed JSON
│       ├── budget.json
│       ├── calculator.json        # Calculator config, archetypes, formulas
│       ├── comparisons.json       # Side-by-side comparison data
│       ├── countertops.json
│       ├── finishes.json          # Finish tiers, properties, cost hierarchy
│       ├── hardware.json          # German/Indian, Sliding/Swing, Full-height
│       ├── materials.json         # Plywood grades, engineered boards, thickness
│       └── vendor.json            # Vendor selection & red flags
├── public/
│   └── models/                    # Optional GLB/GLTF product models (see README below)
├── src/
│   ├── app/                       # Next.js App Router pages
│   │   ├── layout.tsx             # Root layout — navbar, scroll bar, compare provider
│   │   ├── page.tsx               # Homepage — hero, value teasers, calculator
│   │   ├── globals.css            # Global styles, glass tokens, animations
│   │   ├── materials/page.tsx     # Plywood grades & engineered boards
│   │   ├── finishes/page.tsx      # Sheet, paint & specialty finishes
│   │   ├── hardware/page.tsx      # German/Indian, sliding/swing, full-height
│   │   ├── budget/                # Budget pages (routes defined, content pending)
│   │   ├── countertops/           # Countertop comparison pages
│   │   ├── tools/                 # Interactive tool pages
│   │   └── vendor-selection/      # Vendor guide pages
│   ├── components/                # Shared UI components
│   │   ├── Navbar.tsx             # Global navigation (glassmorphism, smart hide)
│   │   ├── ScrollProgressBar.tsx  # Top-of-page reading progress indicator
│   │   ├── StickyCtaBar.tsx       # "Get Your Estimate" floating CTA
│   │   ├── PageLayout.tsx         # Sidebar + breadcrumb layout (light theme)
│   │   ├── PageTransitionWrapper.tsx  # Page-level fade/slide transitions
│   │   ├── BudgetWizard.tsx       # 4-step budget calculator wizard
│   │   ├── CompareModeProvider.tsx    # Pin-to-compare context + floating table
│   │   ├── ComparisonMatrix.tsx   # Tabbed side-by-side comparison (5 comparisons)
│   │   ├── InteractiveDataCapsule.tsx  # 3-stage progressive disclosure card
│   │   ├── CinematicDataCard.tsx  # Cinematic 3-stage card with tilt, modal, View in 3D
│   │   ├── product-viewer/        # Shared WebGL modal (lazy, one canvas at a time)
│   │   ├── ExpandableCard.tsx     # Simple expand/collapse card
│   │   ├── HardwareGuard.tsx      # Hardware config warning system
│   │   ├── AssetPlaceholder.tsx   # Image/video placeholder with shimmer
│   │   ├── LeadForm.tsx           # Lead capture form (3 fields + timeline)
│   │   ├── ExportPDFButton.tsx    # PDF generation from calculator results
│   │   ├── CustomCursor.tsx       # Custom cursor with hover magnet
│   │   └── ui/
│   │       └── StepIndicator.tsx  # Wizard step dots
│   ├── lib/
│   │   ├── types/index.ts         # All TypeScript types & interfaces
│   │   ├── productModels.ts       # 3D catalog: card id → GLB path or procedural placeholder
│   │   ├── data/index.ts          # Data loaders, calculator engine, constants
│   │   ├── hooks/useCalculatorState.ts  # Calculator state machine + submit
│   │   └── supabaseClient.ts      # Supabase client + lead submission
│   └── publish/                   # Standalone demo components (for reference)
│       ├── Badge.tsx
│       ├── Navbar.tsx
│       ├── StickyCtaBar.tsx
│       ├── ScrollProgressBar.tsx
│       └── demo-scroll-bar.tsx
├── tailwind.config.ts             # Full design system tokens
├── tsconfig.json                  # TypeScript config with @/ path alias
├── supabase-setup.sql             # Database schema for lead capture
└── package.json
```

---

## Design System

### Theme
Dark glassmorphism aesthetic with warm gold/amber accent. Light mode is defined in Tailwind config but not yet toggled.

### Colors
```
Background:   #0F172A (Deep Luxury Slate / bg-primary)
Surface:      #1E293B (Soft Charcoal-Blue)
Text Primary: #F8FAFC (Polished Platinum)
Text Muted:   #94A3B8 (Satin Nickel)
Accent:       #FBBF24 → #F59E0B (Amber-400 to Amber-500)
```

### Glass Tokens
```css
.glass           — bg rgba(30,41,59,0.6) + backdrop-blur(32px) + border rgba(148,163,184,0.08)
.glass-strong    — bg rgba(30,41,59,0.85) + same blur + border 0.12
.glass-hover     — hover: bg 0.8 opacity + brighter border
```

### Typography
```
Headers:    Plus Jakarta Sans (700-800 weight)
Body:       Inter (400 weight, line-height 1.6)
Monospace:  JetBrains Mono (for data, specs, pricing)
```

### CSS Components
- `.btn-amber` — Gold gradient CTA button with scale-on-press
- `.btn-premium` — Larger variant of btn-amber
- `.card-hover` — Lift + shadow on hover
- `.frosted-panel` — Slides up from card bottom on hover (finish swatches)
- `.finish-swatch` — Clickable color circles (brushed brass, satin chrome, etc.)
- `.warning-banner` — Red-tinted alert card
- `.insight-banner` — Amber-tinted tip card
- `.tag-green/red/amber` — Colored pill badges

---

## Data Flow

### Content
All content lives in `phase-1-deliverables/data/*.json`. The `src/lib/data/index.ts` module loads and exposes typed accessors:
- `getComparisons()` → ComparisonData[]
- `getFinishTiers()` → FinishTier[]
- `getArchetype(type)` → ArchetypeDefinition
- `calculateCost(state)` → CalculatorResult
- `getDefaultRooms(type)` → RoomConfig[]

### Calculator Engine
A 4-step wizard (`BudgetWizard`) feeding into `useCalculatorState`:
1. **Step 0 — Property:** Value, type (rental/personal/villa), city tier (1/2/3)
2. **Step 1 — Rooms:** Select spaces, adjust bedroom quantities
3. **Step 2 — Finishes:** Kitchen finish, wardrobe type/finish, countertop, hardware tier
4. **Step 3 — Lead Form:** Name, email, phone, timeline

Results flow through `calculateCost()` which applies multipliers:
- `FINISH_MULTIPLIERS` (0.3–1.8x)
- `WARDROBE_MULTIPLIERS` (1.0–1.8x)
- `HARDWARE_MULTIPLIERS` (1.0–1.5x)
- `COUNTERTOP_MULTIPLIERS` (1.0–2.0x)
- `CITY_TIER_MULTIPLIERS` (0.7–1.0x)

### Supabase
Leads submitted to a `calculations_ledger` table. Requires `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars.

---

## Pages

### Homepage (`/`)
- Hero with animated gradient, 3D tilt cards for materials/finishes/hardware
- Budget calculator section (scrolls to `#calculator`)
- Page transition animations

### Materials (`/materials`)
- **Plywood Grades:** MR 303, BWR 303, BWP 710 — as CinematicDataCards
- **Usage Guide:** Standalone "Where to Use Each Grade" reference table
- **Engineered Boards:** HDHMR, MDF, Particle Board, Blockboard — as cards
- **Thickness Guide:** Standalone reference (horizontal scroll on mobile)
- **Comparison summaries:** HDHMR vs Plywood, MDF vs HDHMR — amber insight cards

### Finishes (`/finishes`)
- **Cost Ladder:** Visual tier comparison (Laminate → Acrylic → DUCO → Lacquered Glass/Rattan → PU)
- **Sheet Finishes:** Laminate, Acrylic — includes matte-vs-glossy & acrylic-vs-laminate comparisons
- **Paint Finishes:** DUCO, PU — includes duco-vs-pu comparison
- **Specialty Finishes:** Lacquered Glass, Rattan

### Hardware (`/hardware`)
- **Hero:** Premium headline + trust badges (10-Year Warranty, Solid Brass, etc.)
- **German vs Indian:** Two cards with spec comparison
- **Sliding vs Swing:** Warning callout for heavy shutter + sliding + budget hardware
- **Full-Height Systems:** Advanced vs Standard, with budget guidance
- **Weight Warning:** Always-visible red alert card

---

## Key Components

### CinematicDataCard
3-stage progressive disclosure card:
- **Stage 1:** Thumbnail, title, badges, tags. Entry animation via `whileInView`.
- **Stage 2:** Inline expand — pros/cons, insight callout, WhatsApp share, "Deep Dive" button.
- **Stage 3:** Full-screen modal (desktop centered, mobile bottom sheet with drag-to-dismiss). Contains spec table, print/PDF, WhatsApp share, and View in 3D when the card has a catalog entry.
- **View in 3D:** Always-visible control on materials, hardware, and finishes cards. Opens one shared viewer (orbit, modest zoom, idle auto-rotate). The card id must exist in `src/lib/productModels.ts`.

Props: `id`, `title`, `shortSummary`, `badgeText`, `pros[]`, `cons[]`, `technicalSpecs[]`, `insightText`, `whatsappText`, `imageLabel`, `tierLabel`, `category`

### InteractiveDataCapsule
Similar 3-stage but with pin-to-compare support + pin icon. Used with `CompareModeProvider`.

### CompareModeProvider
Context provider managing a pin-to-compare system (max 3 items). Pins persist in `localStorage`. A floating "Compare (N)" bar appears at bottom when items are pinned. Opens a side-by-side spec table.

### ComparisonMatrix
Tabbed side-by-side comparisons (5 tabs: Granite/Quartz, HDHMR/Plywood, MDF/HDHMR, Sliding/Swing, German/Indian). Features:
- Context toggle (budget vs premium) — recalculates winners
- Desktop: table layout; Mobile: accordion rows
- Verdict card with dynamic winner per context

### BudgetWizard
4-step form with:
- StepIndicator at top
- Floating cost bar at bottom (real-time cost vs budget range)
- Red flag alerts (sliding+indian, quartz+rental, over-budget)
- Lead capture → Supabase → PDF download

### HardwareGuard
Reactive warning system that detects dangerous combinations:
- Sliding + Indian hardware → track sagging risk
- Heavy finish + Sliding + Indian → structural failure risk
- Heavy finish + Swing + Indian → hinge sagging risk
Animated shake on new warnings. "Upgrade to German" quick-action button.

---

## 3D product viewer

Product cards on `/materials`, `/hardware`, and `/finishes` open a single viewer instead of embedding a canvas in every card. That keeps one WebGL context, stays usable on a phone (drag to orbit, pinch or the on-screen buttons to zoom), and leaves static generation alone — the three.js chunk is loaded with `next/dynamic` and `ssr: false` only after View in 3D is pressed.

Idle auto-rotate pauses while dragging and is disabled when `prefers-reduced-motion: reduce` is set. If WebGL is missing or the context is lost, the dialog stays open with a flat color swatch and a short explanation. A GLB that 404s falls back to the same procedural shape.

There are no shipped models. Each entry in `src/lib/productModels.ts` has `modelUrl: null` and a `placeholder`:

| Placeholder | Used for |
| --- | --- |
| `plywood` | MR / BWR / BWP slabs with visible plies |
| `fibreboard`, `particle`, `blockboard` | HDHMR, MDF, particle board, blockboard |
| `bar-pull`, `knob` | German bar pull, Indian knob |
| `sliding`, `swing`, `wardrobe` | Wardrobe systems |
| `swatch`, `glass`, `rattan` | Laminate, acrylic, DUCO, PU, lacquered glass, rattan |

Colors and roughness come from that same catalog, so a stand-in still matches the product.

### Add a real GLB or GLTF

1. Export Y-up. Any scale is fine — the viewer measures the mesh and frames it. Prefer a binary `.glb` under a few megabytes, with PBR materials packed in the file.
2. Save it under `public/models/`, for example `public/models/fin-laminate.glb`. If you export a `.gltf`, keep its `.bin` and textures in that same folder.
3. Set `modelUrl` on the matching product. The `id` must be the card id (`ply-mr-grade`, `brd-hdhmr`, `hw-german`, `fin-laminate`, …):

```ts
{
  id: "fin-laminate",
  modelUrl: "/models/fin-laminate.glb",
  // placeholder, color, and roughness stay as the fallback
}
```

4. Refresh `next dev`, or rebuild for production. You do not need to touch the page components.

To add a new card later, give `CinematicDataCard` an `id` and add a matching object to `PRODUCT_MODELS`. Leave `modelUrl` null until the file exists.

The app declares React 19. Next 16 aliases browser `react` / `react-dom` to its own compiled React 19 build (`__CLIENT_INTERNALS_…`). Fiber 8’s reconciler still reads the React 18 secret (`__SECRET_INTERNALS_….ReactCurrentBatchConfig`) and crashes as soon as the viewer chunk loads. Fiber 9 and Drei 10 speak the React 19 internals, and their peer range (`react >=19 <19.4`) matches that runtime. Lucide is on 0.469 so its peer dependency allows React 19.

---

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Development server
npm run dev

# Build
npm run build

# Lint
npm run lint
```

### 21st.dev Integration
The project has MCP server integration for UI sketching/components:
- **CLI:** `21st search <query>` — find community components
- **MCP Tools:** `generate`, `get_generation`, `iterate_generation`, `get_take` — sketch UI variants
- **API Key:** Configured in VSCode MCP settings (`21st_sk_*`)

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `TWENTYFIRST_TOKEN` | Optional | 21st.dev CLI API key |

---

## Images & Assets

All images are currently placeholder components (`AssetPlaceholder`) with shimmer animation. The JSON data files define media paths at:
- `/images/{section}/{entity-id}.jpg` (photos)
- `/videos/{section}/{entity-id}.mp4` (videos)
- `/images/comparisons/{comparison-id}/left.jpg` + `right.jpg` (comparison matrix)

Replace these with real assets when available.

---

## TypeScript Types (`src/lib/types/index.ts`)

Key types:
- `StepData` — Complete calculator state (property, rooms, finishes, hardware)
- `CalculatorResult` — Computed cost, breakdown, red flags
- `ComparisonData` — Side-by-side comparison with dimensions
- `FinishTier` — Cost ladder tier definition
- `ArchetypeDefinition` — Property archetype (rental/personal/villa)

All types are exported from `@/lib/types`.

---

## Build & Deploy

- **Hosted on:** Vercel (homedecore-anu.vercel.app)
- **Deploy command:** `vercel --prod` (or push to main branch with Vercel Git integration)
- **Build command:** `next build`
- **Output directory:** `.next`

---

## Content Sources

All written content is derived from a comprehensive interior design reference manual covering:
- Plywood grades (MR/BWR/BWP) and engineered boards (HDHMR/MDF/Particle/Blockboard)
- Finish cost hierarchy (Laminate → Acrylic → DUCO → Lacquered Glass/Rattan → PU)
- Hardware comparisons (German vs Indian, Sliding vs Swing, Full-height systems)
- Budget guidance for rental/personal/villa properties
- Vendor selection red flags and site visit checklist
- Granite vs Quartz countertop comparison
