# Interactive UI/UX Component Specification
## Project: Interior Materials & Budgeting Guide
### Phase 1: Content Parsing & IA — Deliverable 2

---

## 1. COST LADDER — "Finish Cost Hierarchy"

### Component Name
`CostLadder`

### Route
`/tools/cost-ladder`

### Visual Design
A vertical stepped ladder visualization with 6 tiers. Each tier is a horizontal card. The ladder ascends from bottom (least expensive) to top (most expensive). Each tier card glows/highlights on hover and shows a tooltip with detailed cost context.

### Tier Order (Bottom → Top)
```
Tier 6: PU (Polyurethane) Paint        ← Most Expensive
Tier 5: Lacquered Glass = Rattan       ← Premium Tier
Tier 4: DUCO Paint                     ← Mid-Premium
Tier 3: Acrylic Sheets                 ← Mid-Range
Tier 2: Laminate Sheets                ← Budget-Friendly
Tier 1: [Base Board Only — No Finish]  ← Structural Only
```

**Source:** "Different Themes, Different Costs" — Laminate < Acrylic < DUCO ≈ Rattan = Lacquered Glass < PU

### Interactive Behavior

| State | Behavior |
|-------|----------|
| **Default** | All tiers visible, muted/desaturated palette. Tier labels only. |
| **Hover** | Tier card expands vertically, reveals: material thumbnail icon, 2-sentence summary, budget archetype badge (Rental/Personal/Villa), "Learn More →" link |
| **Click** | Navigates to the full material page. PU → /finishes/paint-finishes#pu, Acrylic → /finishes/sheet-finishes#acrylic, etc. |
| **Compare Mode** | User can select 2 tiers (checkboxes) — a side-panel slides in showing head-to-head comparison |
| **Filter by Budget** | Dropdown: "I'm building a Rental / Personal / Villa home" — highlights recommended tiers with a green border and "Recommended" badge |

### Tier Card Data (from PDF)

#### Tier 1: Base Board (No Finish) — ₹
- **Description:** Structural core only — plywood, MDF, HDHMR, or particle board. No decorative surface applied.
- **Context:** Reference point. Any finish below costs extra.
- **Budget Fit:** Used in utility areas, back panels, invisible carcass work.

#### Tier 2: Laminate Sheets — ₹₹
- **Description:** Thin decorative layers made from paper and resin. Affordable, scratch-resistant, easy to clean. Available in matte, glossy, textured, wood-finish, high-gloss, exterior, and anti-finger variants.
- **Key Quote:** "Budget-friendly & durable finish. Cannot be used without a base board."
- **Best For:** All furniture types. Rental homes (~7-8% budget). Kitchens (matte recommended for low maintenance).
- **Limitations:** Slightly more visible joints compared to acrylic. May show scratches more readily in high-use areas.
- **Budget Badge:** Rental ✓ | Personal ✓ | Villa ○

#### Tier 3: Acrylic Sheets — ₹₹₹
- **Description:** High-gloss plastic sheets creating a glass-like, mirror-finish. More scratch-resistant than laminate. Seamless finish with minimal joints. Shows fingerprints less than gloss-laminate.
- **Key Quote:** "Acrylic finish is recommended for kitchens as it is easy to clean and has better scratch resistance."
- **Best For:** Kitchen cabinets. Modern premium furniture. Personal homes (~10% budget) and villas.
- **Limitations:** Shows fingerprints and scratches — needs careful handling. Higher cost than laminate.
- **Budget Badge:** Rental ✗ | Personal ✓ | Villa ✓

#### Tier 4: DUCO Paint — ₹₹₹₹
- **Description:** Spray-paint finish, smooth and even surface — described as "car paint for furniture." Available in matte, satin, and gloss. Allows custom colours with seamless, modern look.
- **Key Quote:** "Choose DUCO for a clean look on a controlled budget."
- **Best For:** Kitchen cabinets, wardrobes, TV units, doors, custom furniture. Modern/minimal interiors.
- **Limitations:** Less durable than PU in high-usage areas. More expensive than laminates. Can scratch. Multiple coats needed = longer application time.
- **Budget Badge:** Rental ✗ | Personal ✓ | Villa ✓
- **Parity Note:** ≈ Rattan and ≈ Lacquered Glass in cost tier

#### Tier 5a: Lacquered Glass — ₹₹₹₹
- **Description:** Painted glass sheet with glossy finish, paint sealed at the back. Coloured glass giving a smooth, shiny, reflective surface.
- **Key Quote:** "Ultra-premium, glossy finish. Moisture resistant & elegant. Fragile and higher cost."
- **Best For:** Kitchen shutters, wardrobes, wall panels, TV units, premium interiors.
- **Limitations:** Fragile, heavy, more expensive than laminates or acrylic.
- **Budget Badge:** Rental ✗ | Personal ○ | Villa ✓

#### Tier 5b: Rattan — ₹₹₹₹
- **Description:** Natural woven material made from plant fibres. Woven cane pattern adding texture and natural feel.
- **Key Quote:** "Natural, textured & stylish. Great for accent panels. Avoid wet or humid areas."
- **Best For:** Wardrobe shutters, crockery units, shoe cabinets, bed backs, accent furniture. Modern-boho or European style interiors.
- **Limitations:** Not moisture friendly. Needs careful maintenance. Mostly decorative (not structural).
- **Budget Badge:** Rental ✗ | Personal ○ | Villa ✓

#### Tier 6: PU (Polyurethane) Paint — ₹₹₹₹₹
- **Description:** Premium multi-layer coating with superior smoothness. "Strong protective coating that gives furniture a rich, showroom-quality finish."
- **Key Quote:** "Choose PU for premium durability and long-term performance."
- **Best For:** Wardrobes, kitchen shutters, doors, TV units, premium furniture. High-usage areas.
- **Limitations:** Costliest finish option. Needs skilled application. Touch-ups are difficult.
- **Budget Badge:** Rental ✗ | Personal ○ | Villa ✓

### Media & Animation Hooks (see `media-animation-schema.md` for full spec)
- `media.card_image` loaded from `finishes.json` per entity
- **Enter:** `staggerIn` — 100ms delay between tiers, triggered on viewport
- **Hover:** `lift` + `expand` — tier card lifts 4px, expands vertically to reveal description
- **Budget filter dropdown:** `slideDown` 200ms; `glow` on active selection
- **Compare mode panel:** `slideInLeft` 300ms
- **Budget badge:** `badgeFlip` — flips to show "why recommended" on back
- **Scroll:** `lazyReveal` — each tier enters individually as user scrolls

### Technical Implementation Notes
- Use CSS `scroll-snap` for mobile horizontal scroll through tiers
- Animate tier expansion with `max-height` transition and `opacity` fade on description text
- Store tier data in `finishes.json` with a `costTier` integer field
- Compare mode uses a two-column overlay drawn from `comparisons.json`
- Animations via Framer Motion `motion.div` with `useInView` trigger

---

## 2. SIDE-BY-SIDE COMPARISON MATRIX

### Component Name
`ComparisonMatrix`

### Route
`/tools/comparison-matrix`

### Architecture
A tabbed interface with 5 pre-configured comparisons. Each tab renders a responsive two-column table with category rows and winner indicators.

### Tab 1: Granite vs Quartz
**Source:** "Granite vs Quartz" FAQ section

| Dimension | Granite | Quartz |
|-----------|---------|--------|
| **Type** | Natural stone | Engineered stone |
| **Porosity** | Porous — absorbs liquids slowly if sealer not applied | Non-porous in good-quality brands; does not absorb liquids |
| **Colour Range** | Commonly darker colours (black hides stains best) | Wide range of colours and patterns |
| **Best For** | Indian households — heavy cooking and spice usage | Theme-based and modern kitchens |
| **Maintenance** | Lower maintenance with darker colours | Lighter shades require regular cleaning |
| **Cost** | More economical | Nearly double the cost of granite |
| **Durability** | Durable and cost-effective | Durable but only from reputed brands |
| **Risk** | Can stain without sealer | Low-quality quartz CAN absorb liquids |
| **Verdict** | Best for: investment/rental projects | Best for: personal homes with adequate budget |

**Winner Highlight Rules:**
- Budget-sensitive → Granite gets green badge
- Premium/long-term personal → Quartz gets green badge
- Show "Caution" badge on Quartz if "reputed brand" condition is unchecked

### Tab 2: HDHMR vs Plywood
**Source:** "HDHMR VS PLY" section

| Dimension | HDHMR | Plywood |
|-----------|-------|---------|
| **Type** | Engineered board from wood fibres | Multiple layers of natural wood veneer |
| **Density** | High density, smooth uniform surface | Layered structure, natural variations possible |
| **Moisture Resistance** | Better than regular MDF; not for continuous water exposure | BWP grade handles continuous water; MR/BWR for moderate |
| **Strength** | Good, but less than plywood structurally | Stronger, better load-bearing capacity |
| **Screw Holding** | Good | Better |
| **Best For** | Shutters, CNC designs, painted/PU finishes | Carcass, kitchen cabinets, wardrobes, wet areas (BWP) |
| **Surface Quality** | Smooth — no undulations or wavy laminate | May have grain texture — depends on face veneer |
| **Cost** | Cost-effective compared to plywood | More expensive than HDHMR |
| **Limitations** | Not for continuous water exposure areas | Face veneer quality varies by brand |
| **Verdict** | Best for: shutters (smooth surface) | Best for: carcass (structural strength) |

**Winner Highlight Rules:**
- Context: "What are you building?" → Shutters = HDHMR wins; Carcass/Kithcen wet area = Plywood (BWP) wins

### Tab 3: MDF vs HDHMR
**Source:** "MDF VS HDHMR" section

| Dimension | MDF | HDHMR |
|-----------|-----|-------|
| **Density** | Medium | High |
| **Moisture Resistance** | Low — swells if exposed to water | Better moisture resistance |
| **Strength** | Weaker | Stronger and more durable |
| **Screw Holding** | Poor — may cause shutter issues over time | Better screw-holding capacity |
| **Surface** | Very smooth — ideal for paint/laminates | Smooth, paint-ready surface |
| **Best For** | Dry areas only: bedroom furniture, wall panels, CNC jaali panels, cut designs | Kitchen shutters, wardrobes, CNC designs, painted finishes, humid areas |
| **Cost** | More economical | More expensive than MDF |
| **Risk** | Not recommended for carcasses; may cause shutter issues over time | Not for outdoor use |
| **Verdict** | Best for: CNC decorative work (jaali panels) ONLY | Best for: structural use, kitchens, wardrobes |

**Winner Highlight Rules:**
- Context: "CNC/jaali work?" → MDF acceptable; "Structural/carcass?" → HDHMR mandatory; "Kitchen?" → HDHMR only

### Tab 4: Sliding vs Swing Wardrobes
**Source:** "Wardrobe: Sliding vs Swing" section

| Dimension | Sliding | Swing |
|-----------|---------|-------|
| **Mechanism** | Sliding channels (top/bottom rail) | Hinges |
| **Space Requirement** | No clearance needed — saves space | Needs clearance space in front for door opening |
| **Access** | Limited — one side at a time | Full access — entire wardrobe at once |
| **Hardware Quality Dependency** | HIGH — poor channels cause wobbling, misalignment, getting stuck | Lower dependency — hinges are durable and easy to replace |
| **Maintenance** | Higher if inferior hardware used | Lower long-term maintenance |
| **Load Distribution** | On tracks — can misalign over time | Better load distribution on carcass and shutters |
| **Best For** | Compact bedrooms | Any bedroom with adequate space |
| **Risk** | Poor-quality sliding channels = major long-term frustration | Minimal risk with standard hinges |
| **Verdict** | Only with high-quality hardware | More reliable, structurally stable over time |

**Winner Highlight Rules:**
- Small bedroom + premium budget → Sliding can win
- Any other scenario → Swing wins
- Show "⚠ Requires premium hardware" badge on Sliding

### Tab 5: German vs Indian Accessories
**Source:** "Accessories" section

| Dimension | German-Based | Indian-Based |
|-----------|-------------|--------------|
| **Durability** | Higher durability | Good for regular residential use |
| **Engineering** | Precision engineering | Simpler mechanisms |
| **Load Bearing** | Advanced load-bearing and motion technology | Lower load ratings |
| **Soft-Close** | Smoother soft-close mechanisms | Basic soft-close or none |
| **Longevity** | Better performance, especially in kitchens and high-usage areas | Suitable for moderate use |
| **Service** | May need specialist service | Wide availability and easy servicing |
| **Cost** | Higher cost | Cost-effective |
| **Best For** | Long-term personal homes, premium kitchens | Budget-controlled projects, investment properties |
| **Verdict** | Best for: long-term use, premium performance | Best for: budget-sensitive, investment projects |

### Media & Animation Hooks (see `media-animation-schema.md` for full spec)
- `media.left_image` + `media.right_image` loaded from `comparisons.json` per comparison
- **Tab bar:** `fadeIn` 300ms; `borderGlow` on active tab; smooth tab transition 200ms
- **Row labels:** `slideInRight` 200ms staggered
- **Values:** `slideInLeft` (left) + `slideInRight` (right) staggered 150ms
- **Winner badges:** `scaleIn` 400ms with bounce — only appear after user selects context
- **Context dropdown:** triggers winner recalculation with `flip` animation 300ms
- **Caution tooltips:** `fadeIn` 150ms on hover
- **Row highlight:** hover triggers subtle background shift + 1px left border accent on winner side
- **Media load:** images lazy-loaded with blur placeholder

### Technical Implementation Notes
- Each tab is a React component receiving `comparisonId` prop
- Data fetched from `comparisons.json`
- "Winner" column computed client-side based on user context (budget archetype, room type, usage)
- Responsive: stacks vertically on mobile with expandable rows
- Print-friendly CSS for generating comparison PDF
- Share button generates a URL with query params: `?tab=granite-quartz&budget=personal`

---

## 3. BUDGET ALLOCATION CALCULATOR BUILDER

### Component Name
`BudgetCalculator`

### Route
`/tools/budget-calculator`

### Architecture
A 3-step wizard with progressive disclosure.

### Step 1: Property Profile
**Fields:**
- Property Value (₹) — number input with lakh/crore toggle
- Property Type — segmented control: Rental Investment | Personal Home | Villa
- City Tier — dropdown: Tier 1 / Tier 2 / Tier 3 (affects labour cost multiplier)

**Auto-Calculated Output:**
- Budget Range: ₹X — ₹Y
- Formula: Property Value × Budget Percentage

**Budget Percentages (from PDF):**
| Property Type | Percentage | Formula |
|---------------|------------|---------|
| Rental Investment | 7-8% | Property Value × 0.07 to 0.08 |
| Personal Home | 10% | Property Value × 0.10 |
| Villa | 10% | Property Value × 0.10 |

### Step 2: Room Configuration
**Interactive floor plan selector:**
- Checkbox list of rooms with quantity selectors
- Pre-filled defaults based on property type

**Rental Defaults:**
- [x] Living Room (TV unit)
- [x] Bedroom × N (wardrobes — swing)
- [x] Kitchen (without tall units, laminate finish)
- [ ] Shoe unit (optional — toggle)

**Personal Home Defaults:**
- [x] Living Room (TV unit)
- [x] Bedroom × N (wardrobes)
- [x] Kitchen (acrylic, with tall unit & wicker baskets)
- [x] Crockery unit
- [x] Pooja/prayer unit
- [x] Utility (washing machine + dishwasher provision)
- [x] Shoe unit

**Villa Defaults:**
- [x] Foyer (statement storage units)
- [x] Living Room
- [x] Bedroom × N (premium wardrobes — Aristo)
- [x] Kitchen (acrylic / lacquered glass)
- [x] Crockery unit
- [x] Pooja room (dedicated)
- [x] Study room
- [x] Family room
- [x] Gazebo
- [x] Utility

### Step 3: Finish & Material Selection
**Per-room finish picker:**
- Kitchen Finish: Laminate | Acrylic | DUCO | Lacquered Glass | PU
- Wardrobe Type: Swing | Sliding | Full-Height (Russian rail)
- Wardrobe Finish: Laminate | Acrylic | DUCO | PU
- Countertop: Granite | Quartz
- Hardware Tier: Indian | German

**Real-time cost bar:**
A horizontal bar showing:
- Green zone: Within budget range
- Yellow zone: Approaching upper limit (90-100%)
- Red zone: Over budget
- Percentage indicator: "Your selections use ~X% of recommended budget"

### Step 4: Summary & Red Flags
**Line-item breakdown table:**
| Category | Estimated % of Budget | Amount (₹) |
|----------|----------------------|------------|
| Kitchen | ~25-30% | ₹X |
| Wardrobes | ~20-25% | ₹X |
| Living/Dining | ~15-20% | ₹X |
| Bedroom Furniture | ~10-15% | ₹X |
| Electrical + Plumbing | ~10-15% | ₹X |
| Painting + Finishing | ~8-10% | ₹X |
| False Ceiling | ~5-8% | ₹X |
| Logistics + Cleaning + Floor Protection | ~3-5% | ₹X |

**Red Flag Checklist (inline alerts):**
- ⚠ Floor protection not budgeted → "Damage during installation is often not covered without it."
- ⚠ Deep cleaning not included → "Required after painting to remove marks and dust."
- ⚠ Quote does not mention electrical work for false ceiling
- ⚠ Acrylic/Glass in kitchen → "Ensure transport and handling costs are in the lump-sum."

**Export Options:**
- Download as PDF checklist
- Email summary to self
- Share link with vendor

### Media & Animation Hooks (see `media-animation-schema.md` for full spec)
- `media.archetype_image` loaded from `calculator.json` per archetype type
- **Step container:** `fadeIn` 300ms; step change: crossfade 200ms
- **Step indicators:** `pulse` on next uncompleted step; active step fill animation 300ms
- **Budget bar:** `progressBar: true` — fills with `linear-gradient` transition 500ms
- **Category breakdown:** `slideUp` 150ms stagger; `lift` on category row hover
- **Red flag triggers:** `fadeIn` + red glow 500ms — appear when condition met; `shake` for critical flags
- **Export buttons:** `pulse` on PDF download hover
- **Step transition:** horizontal slide (current out left, next in from right) 300ms ease-in-out
- **Budget escalation timeline:** (on /budget/quote-increases page) — scroll-triggered progress line with percentage counters that count up from 0 to target (0% → 30-50% → 10-20%)

### Technical Implementation Notes
- State managed via React Context or Zustand store
- All room defaults, finish costs, and percentage splits from `calculator.json`
- Budget bar uses CSS `linear-gradient` with dynamic stop points
- Step navigation uses URL hash: `/tools/budget-calculator#step-2`
- Print stylesheet for PDF export

---

## 4. RED FLAG ALERT SYSTEM

### Component Name
`RedFlagAlerts`

### Route
`/tools/red-flag-alerts`

### Visual Design
A dashboard of alert cards. Each card has:
- Severity icon (🔴 Critical / 🟡 Warning / 🔵 Info)
- One-line headline
- Expandable detail section
- "What to ask instead" CTA
- Cross-link to related guide page

### Alert Cards (from PDF)

#### 🔴 CRITICAL — Experience Centre Material Mismatch
**Headline:** "What's shown in the experience centre may not be what you get."
**Detail:** Sales teams in showrooms often claim furniture is made of plywood, while the actual core material used is frequently HDHMR or other boards. "An experience centre is a display — not proof of execution quality."
**What To Do:**
- Visit an 80% completed site to see the actual carcass material
- Check brands of plywood, hinges, and channels on-site
- Verify if reputed hardware brands are actually being used
**Cross-Link:** /vendor-selection/experience-centres

#### 🔴 CRITICAL — Quote Escalation After Design
**Headline:** "The quote increased significantly after the design phase."
**Detail:** This is the #1 complaint in online reviews of interior companies. Design additions can cause 30-50% cost rise. Basic vs premium material choices, size revisions, and additions like glass shutters and profiling all inflate the final bill.
**What To Do:**
- Always ask for a lump-sum estimate upfront
- Ask: "What costs are NOT included in this estimate?"
- Ask: "How much will this increase after the design phase?"
- If the answer is "nothing much" — be cautious
**Cross-Link:** /budget/quote-increases

#### 🟡 WARNING — Missing Deep Cleaning Fee
**Headline:** "Is deep cleaning included in your quote?"
**Detail:** Deep cleaning is needed after painting to remove marks and dust. Many companies exclude this from initial quotes, leading to surprise charges at handover.
**What To Ask:** "Does your quote include deep cleaning after painting and installation?"
**Cross-Link:** /budget/hidden-costs

#### 🟡 WARNING — No Floor Protection Coverage
**Headline:** "Floor protection: if it's not in the quote, damage won't be covered."
**Detail:** Installation work can damage flooring. Most companies will NOT cover floor damage repair unless floor protection is explicitly included in the contract.
**What To Ask:** "Is floor protection included? If my floor gets damaged during installation, who pays?"
**Cross-Link:** /budget/hidden-costs

#### 🟡 WARNING — Client Visit Denial
**Headline:** "Company says clients don't allow visits after handover? Treat it as a red flag."
**Detail:** If a company claims previous clients don't permit site visits, it's not an instant rejection — but it IS a sign of weak client relationships and potentially hidden quality issues.
**What To Do:** Insist on seeing at least one completed project. Also ask to visit a site at 80% completion — this is where you learn the most about material and hardware quality.
**Cross-Link:** /vendor-selection/site-visits

#### 🔵 INFO — False Ceiling Scope Gap
**Headline:** "Does the false ceiling quote include painting and electrical work?"
**Detail:** False ceiling quotes often exclude the painting and electrical work needed to complete the ceiling. Ensure these are explicitly mentioned in the estimate.
**What To Ask:** "Does your false ceiling estimate include painting and electrical point work?"
**Cross-Link:** /budget/hidden-costs

#### 🔵 INFO — Vendor Accountability Gap (Small Firms)
**Headline:** "Smaller firms offer flexibility, but accountability can be unclear."
**Detail:** Small interior companies often care deeply about reputation and offer flexible pricing. However, their processes may not be fully streamlined, and accountability can be unclear if expectations aren't documented.
**What To Do:** Document every commitment in writing. Specify material brands, grades, thicknesses, and hardware types in the contract.
**Cross-Link:** /vendor-selection/big-vs-small

#### 🔵 INFO — Vendor Personal Attention Gap (Large Firms)
**Headline:** "Handling 100-150 projects/month means you may feel like just another project."
**Detail:** Large established companies have smoother processes and dedicated teams, but personal attention to your specific budget and vision may be limited. Quote increases after design are still common even with large firms.
**What To Do:** Ask who your single point of contact will be. Ask how change requests are handled and priced.
**Cross-Link:** /vendor-selection/big-vs-small

### Media & Animation Hooks (see `media-animation-schema.md` for full spec)
- **Severity filter bar:** `slideDown` 200ms; `glow` on active filter; filter click staggers out non-matching cards
- **Critical cards:** `scaleIn` 400ms with red border flash; `lift` + red `glow` on hover; expand with `max-height` transition 300ms
- **Warning cards:** `fadeIn` 300ms; `lift` + yellow `glow` on hover; expand `max-height` transition 300ms
- **Info cards:** `fadeIn` 300ms; `lift` + blue `glow` on hover; expand `max-height` transition 200ms
- **"What to do" section:** `slideDown` on expand; checklist items slide-in staggered
- **"Mark as Reviewed" toggle:** `scaleIn` 100ms; strikethrough animation on card
- **Progress bar:** fills as cards reviewed; counter animation on number
- **Red flag pulse:** when card enters viewport, subtle red pulse circles severity icon for 1.5s
- **Card media:** icons loaded from `vendor.json` per severity (`media.icon_critical`, `media.icon_warning`, `media.icon_info`)

### Technical Implementation Notes
- Cards rendered from `red-flags` array in `vendor.json`
- Severity determines sort order and visual treatment
- Each card has a "Mark as Reviewed" toggle that persists to localStorage
- Dashboard shows "X of Y flags reviewed" progress bar
- Share as checklist via URL hash

---

## 5. EXPERIENCE CENTRE vs 80% SITE — VISUAL ASSET SLOTS

### Component Name
`SplitViewComparison`

### Route
`/vendor-selection/experience-centres`

### Layout
Two-column split view. Left column = Experience Centre (showroom). Right column = 80% Completed Site (real execution). Side-by-side with callout annotations.

### Media Sources
Data from `vendor.json > experienceCentres.media.comparison`:
- **Left:** `image: /images/vendor/experience-centre-showroom.jpg`, `video: /videos/vendor/experience-centre-tour.mp4`, animation: `panRightOnScroll`
- **Right:** `image: /images/vendor/80-percent-site-carcass.jpg`, `video: /videos/vendor/80-percent-site-tour.mp4`, animation: `panLeftOnScroll`

### Callout Annotations
Three annotated comparison points rendered as overlay callouts:
1. **Misrepresentation:** "Sales claim: 'Made of plywood'" → "Reality: Often HDHMR or other boards"
2. **Hardware Gap:** "Premium hinges in showroom" → "Low-cost channels in actual project"
3. **Finish Gap:** "Flawless finish on display" → "Visible joints and gaps in execution"

### Animation Behavior
- **Scrolling:** Both images pan in opposite directions (left pans right, right pans left) creating a parallax reveal effect
- **Callouts:** Appear with staggered `fadeIn` + `slideUp` as user scrolls past each
- **Hover:** Each callout expands to show the full "what to check" checklist

---

## 6. GLOBAL UI PATTERNS

### 6.1 "Takeaway" Callout Component
Used across all content pages. A highlighted box with:
- Lightbulb icon
- Bold label: "The Takeaway"
- Concise decision-guidance text from the PDF
- Example: "Use MR plywood for dry areas, BWP plywood for kitchens and bathrooms."

### 6.2 "Best For / Avoid" Tag System
Each material/finish/hardware entity has two tag rows:
- Green tags: "Best For: Kitchens", "Best For: Shutters"
- Red tags: "Avoid: Wet Areas", "Avoid: Outdoor Use"
- Data from `applications` and `limitations` arrays in JSON modules

### 6.3 Budget Archetype Badge
A small pill badge appearing on material/finish cards:
- 🏠 Rental — green outline
- 🏡 Personal — blue outline
- 🏰 Villa — gold outline
- Filled = recommended, outline = optional, absent = not recommended

### 6.4 Cross-Link Inline Recommendations
At the bottom of every content page, a "You might also want to read" section with 2-3 contextual links.

### 6.5 Mobile Responsiveness
- All comparison tables collapse to accordion rows below 768px
- Cost Ladder switches from vertical stepped to horizontal scrollable cards on mobile
- Budget Calculator becomes single-column with step dots
- Red Flag dashboard stacks cards vertically

### 6.6 Accessibility
- All interactive elements keyboard-navigable (Tab, Enter, Arrow keys)
- ARIA labels on comparison winner badges
- Color not the sole indicator of severity (icons + text)
- Focus traps in the budget calculator wizard
