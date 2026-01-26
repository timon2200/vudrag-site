# Project Trajectory: Vudrag Sculpture Portfolio

> **Status:** Hero section complete ✅ — Roadmap to production website
> **Stack:** Vite + PlayCanvas + Gaussian Splatting + Custom GLSL

---

## Current State

The hero section is **complete and stunning** — a full-viewport PlayCanvas experience featuring:

- **3 Gaussian Splat sculptures** with plasma transitions (Maska, Kapljica, Romislav)
- **HDR post-processing** (bloom, vignette, color grading via CameraFrame)
- **Fluid spring-physics navigation line**
- **Magnetic scroll snapping** with smooth transitions
- **Pinned hero behavior** ready for content overlay

---

## Vision: The Digital Monograph

Following the Design System guidelines, the site will function as a **digital viewing room** — dark, quiet, intimate. Every interaction feels "weighted" and substantial, mirroring the physicality of the sculptures.

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

- [ ] **Design category cards** — Persona, Sumerian, Portraits, Coins, Monuments
- [ ] **Fade-and-slide reveals** — 20px upward motion, 0.8s duration
- [ ] **Scroll-triggered animations** — staggered timing per category
- [ ] **PlayCanvas integration** — 3D card effect on hover

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

### 3.4 Contact / Inquiry
- [ ] **Minimal form design** — bottom-border-only inputs per design spec
- [ ] **Portfolio request CTA** — text link with expanding underline hover
- [ ] **Direct inquiry flow** — smooth, non-commercial feel

---

## Phase 4: Navigation & UX

### 4.1 Header System
- [ ] **Sticky minimal header** — 1px white line + logo + menu items
- [ ] **Scroll-aware reveal** — appears after hero section
- [ ] **Mobile hamburger** — anthracite panel overlay

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

Choose where to focus:

### Option A: Complete the Gallery Integration
If you have the separate gallery app ready to merge:
1. Share the gallery app location/structure
2. Identify the integration approach (iframe, merge, or route)
3. Create shared navigation components

### Option B: Build Category Hub Section
Extend the current site with the post-hero content:
1. Design category card components
2. Implement scroll-triggered reveals
3. Create transition from splat hero to category grid

### Option C: Polish & Ship Hero MVP
Make the current hero section production-ready:
1. Add more sculptures to the collection
2. Fine-tune mobile experience
3. Deploy and gather feedback

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

| Token | Value | Usage |
|-------|-------|-------|
| `--color-canvas` | `#212121` | Primary background |
| `--color-surface` | `#383E42` | Secondary/overlay |
| `--color-ink` | `#0A0A0A` | Headlines |
| `--color-stone` | `#7E8479` | Body text |
| `--color-light` | `#F6F6F6` | Interaction states |
| `--font-primary` | Cormorant Garamond | Display/body |
| `--page-margin` | `8vw` | Gallery margins |
| `--transition-slow` | `0.8s cubic-bezier` | Page transitions |

---

*Document created: January 2026*
*Last updated: January 2026*
