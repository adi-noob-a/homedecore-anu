# Media & Animation Schema — Specification
## Phase 1 Extension: Media Hooks & Micro-Interaction Blueprint

This document defines the exact fields added to each JSON module and the interactive spec to support image/video assets and scroll-triggered animations.

---

## 1. FIELDS ADDED TO JSON MODULES

### 1.1 Top-Level Module Field
Every `<module>.json` file now includes:
```json
"media": {
  "hero_image": "string (path or URL)",
  "hero_video": "string (path or URL)",
  "thumbnail": "string (path or URL)",
  "icons": {
    "default": "string",
    "active": "string",
    "hover": "string"
  }
}
```

### 1.2 Per-Entity Media Block
Every material, finish, grade, board, comparison, archetype, red flag, and visit type now has:
```json
"media": {
  "card_image": "string (path or URL path placeholder)",
  "card_video": "string (path or URL path placeholder)",
  "icon": "string (icon class or SVG path)",
  "diagram": "string — references an exploded view / cross-section diagram"
}
```

### 1.3 Animation & Micro-Interaction Block
Every interactive entity now has:
```json
"animation": {
  "enter": {
    "type": "string — fadeIn | slideUp | slideInLeft | scaleIn | staggerIn",
    "delay": "number in ms",
    "duration": "number in ms",
    "trigger": "string — onViewport | onHover | onClick | onScroll | auto"
  },
  "hover": {
    "effect": "string — lift | glow | pulse | expand | borderGlow",
    "target": "string — card | button | icon | badge",
    "feedback": "string — tooltip | modal | overlay | scale up"
  },
  "scroll": {
    "parallax": "boolean",
    "progressBar": "boolean — shows reading/scrolling progress",
    "reveal": "string — lazyReveal | progressiveDisclosure"
  },
  "microInteraction": {
    "type": "string — counter | timelineProgress | badgeFlip | tierBounce",
    "repeatable": "boolean"
  }
}
```

---

## 2. EXACT PLACEHOLDER PATHS

Use these placeholder URLs in the `media.card_image` and `media.card_video` fields. They follow the convention:
```
/images/{section}/{entity-id}.{ext}
/videos/{section}/{entity-id}.{ext}
```

### 2.1 Image Placeholders
```
/images/budget/quote-increases.jpg
/images/budget/hidden-costs-checklist.jpg
/images/budget/project-budgets-rental.jpg
/images/budget/project-budgets-personal.jpg
/images/budget/project-budgets-villa.jpg
/images/materials/plywood-mr-grade.jpg
/images/materials/plywood-bwr-grade.jpg
/images/materials/plywood-bwp-grade.jpg
/images/materials/payload-cross-section.jpg
/images/materials/hdhmr-board.jpg
/images/materials/mdf-board.jpg
/images/materials/particle-board.jpg
/images/materials/blockboard.jpg
/images/materials/plywood-thickness-guide.jpg
/images/finishes/laminate-sheets.jpg
/images/finishes/laminate-matte-vs-glossy.jpg
/images/finishes/acrylic-sheets.jpg
/images/finishes/duco-paint.jpg
/images/finishes/pu-paint.jpg
/images/finishes/lacquered-glass.jpg
/images/finishes/rattan-finish.jpg
/images/hardware/german-accessories.jpg
/images/hardware/indian-accessories.jpg
/images/hardware/sliding-wardrobe.jpg
/images/hardware/swing-wardrobe.jpg
/images/hardware/full-height-rail.jpg
/images/hardware/full-height-standard.jpg
/images/vendor/big-company.jpg
/images/vendor/small-company.jpg
/images/vendor/experience-centre.jpg
/images/vendor/80-percent-site.jpg
/images/vendor/client-visit.jpg
/images/countertops/granite-slab.jpg
/images/countertops/quartz-slab.jpg
```

### 2.2 Comparison Matrix Images
The comparison matrix has a special dual-image field on each comparison:
```json
"media": {
  "left_image": "/images/comparisons/{comparison-id}/left.jpg",
  "right_image": "/images/comparisons/{comparison-id}/right.jpg",
  "winner_badge_image": "/images/comparisons/winner-badge.svg"
}
```

### 2.3 Budget Calculator Images
```json
"media": {
  "archetype_image": "/images/calculator/archetype-{type}.jpg",
  "step_bg_image": "/images/calculator/step-{number}.jpg",
  "budget_bar_bg": "/images/calculator/budget-bar-bg.svg"
}
```

### 2.4 Red Flag Card Icons
```json
"media": {
  "icon_critical": "/images/red-flags/icon-critical.svg",
  "icon_warning": "/images/red-flags/icon-warning.svg",
  "icon_info": "/images/red-flags/icon-info.svg"
}
```

---

## 3. ANIMATION SPEC: KEY INTERACTIVE COMPONENTS

### 3.1 Cost Ladder Animations

| Tier Element | Enter Animation | Hover Animation | Scroll Behavior |
|-------------|----------------|-----------------|-----------------|
| Ladder container | `fadeIn` 200ms | — | `parallax: true` (subtle vertical shift) |
| Individual tiers | `staggerIn` 100ms delay per tier | `lift` + `expand` (reveals description) | `reveal: lazyReveal` — each tier enters on scroll |
| Budget filter dropdown | `slideDown` 200ms | `glow` on active selection | — |
| Compare mode panel | `slideInLeft` 300ms | — | — |
| "Learn More" link | — | `pulse` arrow icon | — |
| Budget badge | — | `badgeFlip` — flips to show recommendation detail | — |

### 3.2 Comparison Matrix Animations

| Element | Enter Animation | Hover Animation | Interaction Feedback |
|---------|----------------|-----------------|---------------------|
| Tab bar | `fadeIn` 300ms | `borderGlow` on active tab | Click: smooth tab transition 200ms |
| Row labels | `slideInRight` 200ms staggered | — | — |
| Values (left) | `slideInLeft` 150ms stagger | `scaleIn` on hover row | — |
| Values (right) | `slideInRight` 150ms stagger | `scaleIn` on hover row | — |
| Winner badges | `scaleIn` 400ms bounce | — | Conditional: only appear after user selects context |
| Context question | — | — | Dropdown change triggers winner recalculation with `flip` animation |
| Caution tooltips | — | Appear on hover with `fadeIn` 150ms | — |

### 3.3 Budget Calculator Animations

| Element | Enter Animation | Hover Animation | Progress Behavior |
|---------|----------------|-----------------|-------------------|
| Step container | `fadeIn` 300ms | — | Step change: crossfade 200ms |
| Step indicators (dots) | — | `pulse` on next uncompleted step | Active step: fill animation 300ms |
| Budget bar | — | — | `progressBar: true` — fills with `linear-gradient` transition 500ms |
| Category breakdown | `slideUp` 150ms stagger | `lift` on category row | — |
| Red flag triggers | `fadeIn` + red glow 500ms | — | Appear when condition met — shake animation for critical |
| Export buttons | — | `pulse` on PDF download | — |

### 3.4 Red Flag Alert Animations

| Element | Enter Animation | Hover Animation | Interaction |
|---------|----------------|-----------------|-------------|
| Severity filter bar | `slideDown` 200ms | `glow` on active filter | Filter click: stagger out non-matching cards |
| Critical cards | `scaleIn` 400ms with red border flash | `lift` + red `glow` edge | Expand: `max-height` transition 300ms |
| Warning cards | `fadeIn` 300ms | `lift` + yellow `glow` edge | Expand: `max-height` transition 300ms |
| Info cards | `fadeIn` 300ms | `lift` + blue `glow` edge | Expand: `max-height` transition 200ms |
| "What to do" section | `slideDown` on expand | — | Checklist items: slide-in staggered |
| "Mark as Reviewed" toggle | — | `scaleIn` 100ms | Strikethrough animation on card |
| Progress bar | `progressBar: true` — fills as cards reviewed | — | Counter animation on number |

### 3.5 Page-Level Scroll-Triggered Animations

| Event | Animation | Target Elements |
|-------|-----------|-----------------|
| Hero section enters | `fadeIn` + `slideUp` 500ms | Page title, subtitle, CTA buttons |
| Section visible | `lazyReveal` 400ms | Section header, cards, tables |
| Comparison context changes | `flip` animation 300ms | Winner badges recalculate |
| Budget escalation timeline | Timeline `progressBar` fills on scroll | Percentage indicators animate from 0 → target |
| Sticky navigation | Scroll-triggered sticky header with `slideDown` | Table of contents / section nav |
| Cross-link suggestions | `fadeIn` 200ms after main content | "You might also want to read" section |

---

## 4. EXPERIENCE CENTRE vs 80% SITE — VISUAL ASSET SLOTS

This is a dedicated two-column visual comparison for `/vendor-selection/experience-centres`.

### Layout
```
┌──────────────────────┬──────────────────────┐
│   Experience Centre   │   80% Completed Site  │
│   (Showroom)          │   (Real Execution)    │
├──────────────────────┼──────────────────────┤
│   [hero_image]        │   [hero_image]         │
│   Polished, curated   │   Raw, in-progress     │
│   lighting, staged    │   visible carcass,     │
│   furniture           │   exposed wiring       │
├──────────────────────┼──────────────────────┤
│  What they show you:  │  What you find:        │
│  "Made of plywood"    │  "Actually HDHMR/MDF" │
│  Premium hinges       │  Low-cost channels     │
│  Flawless finish      │  Visible gaps/joints   │
└──────────────────────┴──────────────────────┘
```

### Media Fields (added to `vendor.json > experienceCentres`)
```json
"media": {
  "comparison": {
    "type": "splitView",
    "left": {
      "label": "Experience Centre",
      "image": "/images/vendor/experience-centre-showroom.jpg",
      "video": "/images/vendor/experience-centre-tour.mp4",
      "animation": "panRightOnScroll"
    },
    "right": {
      "label": "80% Completed Site",
      "image": "/images/vendor/80-percent-site-carcass.jpg",
      "video": "/images/vendor/80-percent-site-tour.mp4",
      "animation": "panLeftOnScroll"
    }
  },
  "callouts": [
    {
      "type": "misrepresentation",
      "headline": "Sales claim: 'Made of plywood'",
      "reality": "Often HDHMR or other boards",
      "icon": "/images/vendor/icon-misrepresentation.svg"
    },
    {
      "type": "hardware",
      "headline": "Premium hinges in showroom",
      "reality": "Low-cost channels in actual project",
      "icon": "/images/vendor/icon-hardware-gap.svg"
    },
    {
      "type": "finish",
      "headline": "Flawless finish on display",
      "reality": "Visible joints and gaps in execution",
      "icon": "/images/vendor/icon-finish-gap.svg"
    }
  ]
}
```

---

## 5. MICRO-INTERACTIONS: DETAILED BEHAVIORS

### 5.1 Cost Ladder Tier Bounce
When a user selects a budget archetype from the filter dropdown, the recommended tiers bounce (scale 1.0 → 1.05 → 1.0) in sequence, top to bottom, with 80ms delay between each. Non-recommended tiers fade to 50% opacity.

### 5.2 Budget Escalation Timeline (Quote Increases Page)
A horizontal animated timeline. As the user scrolls, a progress line fills from left to right, revealing percentage markers at key points:
- 0%: Initial Quote
- 30-50%: After Design Additions + Hidden Costs (Elec/Plumb/Paint)
- 10-20%: Size Revisions + Glass Shutters & Profiling

Each marker pops with a `scaleIn` animation when the progress line reaches it. The percentage number counts up from 0 to its target value.

### 5.3 Red Flag Pulse
When a red flag card enters the viewport, a subtle red pulse animation circles the severity icon for 1.5 seconds, then settles into a slow hover glow.

### 5.4 Comparison Matrix Row Highlight
Hovering any row highlights both cells (left and right) with a subtle background color shift and a 1px left border accent on the winner side.

### 5.5 Budget Calculator Step Transition
Moving between steps triggers a horizontal slide transition (current step slides out left, next step slides in from right) with 300ms ease-in-out. Step dots at the top animate a fill transition.

### 5.6 Badge Flip
Budget fit badges (Rental ✓ / Personal ✗ / Villa ✓) flip like a card on hover to show the rationale reason on the back face.

---

## 6. IMPLEMENTATION NOTES

### 6.1 React Libraries Recommended
- **Animations:** Framer Motion (`motion.div`, `AnimatePresence`, `useInView`, `useScroll`)
- **Lazy loading:** `react-lazy-load-image-component` for images
- **Parallax:** Custom `useScrollParallax` hook or `react-parallax`
- **Timeline:** Custom `AnimatedTimeline` component using GSAP or Framer Motion `useScroll`
- **Progress bar:** Framer Motion `useMotionValue` + `useSpring`

### 6.2 Performance Constraints
- All animations must respect `prefers-reduced-motion` media query
- Images: lazy-loaded with blur placeholder (20px base64 blurhash)
- Videos: autoplay muted, `loading="lazy"`, poster frame required
- Stagger animations: cap at 200ms total stagger window
- Parallax: disable on mobile (< 768px)
