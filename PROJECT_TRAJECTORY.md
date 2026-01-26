# Project Trajectory: Vudrag Sculpture Portfolio

> **Status:** Hero & Navigation Core Complete ✅ — Building Collection Pages
> **Stack:** Vite + PlayCanvas + Gaussian Splatting + Custom GLSL

---

## Current State

The **Hero Section** and **Core Navigation** are complete.

- **Hero 3D Experience**: Full Gaussian Splat support with plasma transitions and HDR.
- **Category Hub**: Implemented with 3D-tilt interactive cards and scroll reveal.
- **Navigation**: Sticky header with progress bar, full-screen menu overlay, and fluid physics line.
- **Transition System**: Seamless "fade-to-blur" transition from 3D hero to 2D content.

---

## Vision: The Digital Monograph

> **Philosophy:** "Timeless elegance with a modern edge."

The site functions as a **digital brand embassy**, not an online store. It prioritizes storytelling, silence, and "weighted" interaction over immediate commerce.

### Core Principles
1.  **The Atelier (Homepage):** A "Brand Universe" entry point. Full-screen video of the artist at work (clay, marble dust). Minimal text.
2.  **The Collection:** Organized by **Series** (e.g., "Elemental Fragments"), not by product type.
3.  **The Singular Page:** A "viewing room" experience for each sculpture.
    *   No public prices.
    *   "Request the Portfolio" instead of "Add to Cart".
    *   Macro photography to show "Material Truth".
4.  **Commissioning Journey:** A dedicated section selling the collaborative process of creating a legacy piece.
5.  **The Archive:** Password-protected portal for existing clients (provenance, installation guides).

---

## Phase 1: Hero Integration & Polish

| Task | Status | Notes |
|------|--------|-------|
| Plasma explosion transitions | ✅ Done | Custom GLSL vertex shader |
| HDR post-effects pipeline | ✅ Done | CameraFrame with tunable panels |
| Fluid navigation system | ✅ Done | Spring-physics simulation |
| Magnetic scroll snapping | ✅ Done | 40/60 threshold with idle detection |
| Debug panels (P/E/S/G/D/M) | ✅ Done | Development-only tuning |
| Hero gradient overlay | ✅ Done | Depth enhancement |
| Loading screen | ✅ Done | Premium spinner with font preload |

### Remaining Hero Polish
- [ ] **Fine-tune per-sculpture color grading** — adjust brightness/contrast/saturation via `G` panel
- [ ] **Mobile optimization** — reduce particles, simplify post-effects
- [ ] **Loading progress indicator** — show actual asset loading percentage

---

## Phase 2: Gallery App Integration

You have a **separate gallery web app** that needs to be integrated into this main branch.

### Integration Strategy

| Approach | Pros | Cons |
|----------|------|------|
| **A) Embed as iframe** | Quick, isolated | Poor UX transitions |
| **B) Merge codebase** | Seamless. Single build | Migration effort |
| **C) Route-based lazy load** | Clean separation, shared shell | Requires routing setup |

**Recommended: Option C — Route-based integration**

```
vudrag-site-2/
├── src/
│   ├── main.js              # Entry orchestrator
│   ├── routes/
│   │   ├── hero-gallery.js  # Current splat hero (default route)
│   │   └── collection/
│   │       └── gallery.js   # Imported gallery app
│   └── shared/
│       ├── header.js        # Sticky header component
│       └── transitions.js   # Shared animation utilities
```

### Integration Action Items
- [ ] **Analyze gallery app structure** — identify dependencies and entry points
- [ ] **Create shared navigation** — unified header/footer across both experiences
- [ ] **Implement route transitions** — smooth PlayCanvas-to-gallery crossfades
- [ ] **Shared state management** — sync scroll position, active category, etc.

---

## Phase 3: Website Sections (Beyond Hero)

Following the "Unified Scene Strategy" from the Patek design approach:

### 3.1 Category Hub (Post-Hero)
The section that appears after the splat gallery:

- [x] **Design category cards** — Persona, Sumerian, Portraits, Coins, Monuments
- [x] **Fade-and-slide reveals** — 20px upward motion, 0.8s duration
- [x] **Scroll-triggered animations** — staggered timing per category
- [x] **PlayCanvas integration** — 3D card tilt effect (CSS 3D transform)

### 3.2 Collection Pages
Individual category deep-dives:

- [ ] **Gallery grid layout** — asymmetric, editorial style
- [ ] **Full-screen sculpture viewer** — extended splat experience
- [ ] **Material close-ups** — mandatory macro shots per design spec
- [ ] **Curator notes** — narrative body text with generous leading

### 3.3 Artist Section
- [ ] **Biography page** — artist statement with Cormorant Garamond typography
- [ ] **Process video** — silent loops (no controls visible)
- [ ] **"Net-work" philosophy** — conceptual content integration

### 3.4 Commissioning Journey
- [ ] **Process methodology** — from consultation to maquette to installation
- [ ] **Bespoke promise** — selling the collaboration/legacy
- [ ] **Appointment request** — high-touch form

### 3.5 The Archive (Client Portal)
- [ ] **Password protection** — exclusive access authentication
- [ ] **Provenance docs** — digital certificates of authenticity
- [ ] **Installation guides** — technical PDFs
- [ ] **Past works** — list of acquired pieces

### 3.6 Contact & Salon
- [ ] **Minimal contact interface** — single email, phone, salon address
- [ ] **Privacy focus** — "By Appointment" messaging

---

## Phase 4: Navigation & UX

### 4.1 Header System
- [x] **Sticky minimal header** — 1px white line + logo + menu items (progress bar included)
- [x] **Scroll-aware reveal** — appears after hero section
- [x] **Mobile hamburger** — full-screen menu overlay

### 4.2 Page Transitions
- [ ] **Fade and lift** — 0.8s duration, 20px vertical offset
- [ ] **Progress indicators** — subtle, inline with luxury aesthetic
- [ ] **Preload next sections** — prevent loading jank

### 4.3 Scroll Behavior
- [ ] **Weighted scroll feel** — custom scroll physics site-wide
- [ ] **Parallax depth** — text 100%, images 85% scroll speed
- [ ] **Hover ease-out curves** — no instant snaps

---

## Phase 5: Production Readiness

### 5.1 Performance
- [ ] **Lazy load splat assets** — load on-demand per category
- [ ] **Image optimization** — WebP format, responsive srcset
- [ ] **Code splitting** — separate chunks for hero vs. collection
- [ ] **Mobile-first optimization** — detect device, reduce complexity

### 5.2 SEO & Accessibility
- [ ] **Meta tags** — per-page title, description, OG images
- [ ] **Semantic HTML** — proper heading hierarchy
- [ ] **Keyboard navigation** — ensure all interactions are accessible
- [ ] **ARIA labels** — for interactive 3D elements

### 5.3 Analytics & Tracking
- [ ] **View tracking** — which sculptures get attention
- [ ] **Scroll depth** — engagement metrics
- [ ] **Inquiry funnel** — conversion tracking

---

## Technical Decisions

### Why Continue with PlayCanvas?
The hero section proves PlayCanvas is the right choice:

1. **Native Gaussian Splat support** — first-class `.sog` file loading
2. **Custom shader injection** — `gsplatModifyVS` for plasma effects
3. **HDR pipeline** — CameraFrame provides cinematic quality
4. **Performance** — WebGL2/WebGPU with tree-shaking via ES modules

### State Architecture
Maintain centralized state in `state.js`:

```javascript
export const state = {
    // Core
    app: null,
    camera: null,
    
    // Splats
    splatEntities: [],
    currentSplatIndex: 0,
    
    // Scroll
    scrollProgress: 0,
    targetScrollProgress: 0,
    
    // Section (for future routing)
    currentSection: 'hero', // 'hero' | 'collection' | 'artist' | 'contact'
    
    // Gallery integration
    galleryState: null // Imported gallery app state
};
```

---

## Immediate Next Steps

### Priority 1: Collection Pages (Phase 3.2)
The Category Hub is ready but links to nowhere. We need to build the grid views for each category.
1. Create `src/sections/` directory structure.
2. Build a reusable `CollectionGrid` component.
3. Connect Category Hub clicks to the routing system.

### Priority 2: Gallery App Integration (Phase 2)
Decide on the integration strategy for the existing gallery app.
- **Recommended**: Route-based integration (Option C above).

### Priority 3: Content Population (Phase 2.5)
We have the structured data (`content/collections_data.js`). Now we need to:
1.  **Refine category-hub.js**: Update categories to match the new 6-part structure: Persona, Elemental, Sumerian, Nature, Portraits, Numismatics.
2.  **Asset Gathering**: Locate high-res images for "Iron Maiden", "Waterdrop", "Tesla", "Euro Coins" to replace placeholders.
3.  **Implement Detail View**: Create the "Viewing Room" layout to display the rich text descriptions we now have.

---

## File Structure (Target)

```
vudrag-site-2/
├── public/
│   ├── splats/           # .sog files organized by category
│   ├── images/           # Hero and category imagery
│   └── videos/           # Process loops (silent)
├── src/
│   ├── main.js           # Entry orchestrator
│   ├── config.js         # Centralized configuration
│   ├── state.js          # Global state
│   ├── router.js         # Section/page routing
│   ├── systems/          # PlayCanvas systems
│   │   ├── camera.js
│   │   ├── particles.js
│   │   ├── post-effects.js
│   │   ├── scroll.js
│   │   └── splats.js
│   ├── ui/               # Overlay components
│   │   ├── fluid-navigation.js
│   │   ├── text-overlay.js
│   │   ├── sticky-header.js
│   │   └── category-hub.js
│   ├── sections/         # Page sections
│   │   ├── hero.js
│   │   ├── collection.js
│   │   ├── artist.js
│   │   └── contact.js
│   ├── gallery/          # Integrated gallery app
│   │   └── (imported components)
│   └── styles/           # CSS modules
│       ├── variables.css
│       ├── typography.css
│       └── components.css
├── index.html
├── ARCHITECTURE.md
├── PROJECT_TRAJECTORY.md  # This file
└── vite.config.js
```

---

## Design System Reference

Quick reference from the style guide:

| Token | Value | RAL Approx | Usage |
|-------|-------|------------|-------|
| `--color-canvas` | `#212121` | RAL 7021 | Primary background (Dark Grey) |
| `--color-surface` | `#383E42` | RAL 7016 | Content panels (Anthracite) |
| `--color-ink` | `#0A0A0A` | RAL 9005 | Headlines (Jet Black) - sparse |
| `--color-stone` | `#7E8479` | RAL 7004 | Body text (Signal Grey) |
| `--color-light` | `#F6F6F6` | RAL 9016 | Accents (Pure White) - restrained |
| `--font-primary` | `Cormorant` | N/A | Display/Lead |
| `--font-secondary` | `Inter` | N/A | UI/Body |

---

*Document created: January 2026*
*Last updated: January 2026*
