# Project Trajectory: Vudrag Sculpture Portfolio

> **Status:** Client Feedback Implemented — Homepage restructured, Press page live, Collection renames complete  
> **Stack:** Vite + PlayCanvas + GSAP + Gaussian Splatting + Custom GLSL  
> **Live:** [vudrag.varazdin.studio](https://vudrag.varazdin.studio)  
> **Brand:** From Atom to Atlas

---

## Current State (March 2026)

The site is **deployed and live** at `vudrag.varazdin.studio`. The full homepage experience, two collection pages, press page, CMS, and deployment pipeline are operational. Recent client feedback has been implemented: hero slider reordered, collections renamed, selection section restructured to 3 cards, and a new editorial press page added.

### What's Built & Working

- **Homepage Hero Slider**: GSAP ScrollTrigger-driven cinematic carousel with desert storm particle system (800+ particles, wisps, embers) and scroll-driven parallax.
- **3D Splat Gallery** (`gallery.html`): Full PlayCanvas-powered Gaussian Splat viewer with plasma transitions, HDR post-processing, and fluid spring-physics navigation.
- **Collection Template System** (`collection.html`): Dynamic page router that fetches collection data from CMS and mounts the appropriate template (Network, Coins, or fallback to gallery).
- **Network Collection Page**: Premium welded-sculpture showcase with works gallery grid, draggable split-screen finish comparator (Silver vs. Rust), and cinematic detail panels.
- **Coins Collection Page**: Numismatics showcase with a responsive grid and cinematic slide-in side panel for coin details, replacing in-card drawers.
- **Sculpture Detail Pages** (`sculpture.html`): Ken Burns hero, floating info cards, process/technique/vision sections, technical gallery with lightbox, and related works grid.
- **Video Showcase Section**: CMS-driven film/video content display.
- **Artist Biography Section**: With portrait, video background (YouTube embed), quote, and bio.
- **Category Hub**: 3D tilt cards for 6 collections: Net-Work, Monumental, Coins, Portraits, Paintings, Public Work.
- **Works Showcase (The Selection)**: 3-card layout linking to Net-Work, Exhibitions, and Articles/Press.
- **Press Page** (`press.html`): Editorial "Chronicle" layout with featured Forbes article, 2-column grid with breakout cards, scroll-reveal, and media inquiry CTA.
- **Contact Page**: Sculptural presentation with ambient particles and glow effects.
- **Archive Page**: Password-protected client portal with block-based posts.
- **Login & Auth System**: JWT authentication, email-based password reset (Resend API), user management.
- **CMS Admin Panel**: Visual content editor for all site sections.
- **Deployment Pipeline**: Git-based deploy via cPanel + `.cpanel.yml` + automated workflow.
- **Image Optimization**: All images converted to WebP format.

---

## Vision: The Digital Monograph

> **Philosophy:** "Timeless elegance with a modern edge."

The site functions as a **digital brand embassy**, not an online store. It prioritizes storytelling, silence, and "weighted" interaction over immediate commerce.

### Core Principles
1. **The Atelier (Homepage):** A "Brand Universe" entry point with cinematic hero slider.
2. **The Collection:** Organized by **Series** (e.g., "Net-Work", "Monumental", "Coins"), each with a unique template.
3. **The Singular Page:** A "viewing room" experience for each sculpture — no public prices, "Inquire" instead of "Buy".
4. **The Chronicle:** Press page showcasing critical writing and media coverage.
5. **The Archive:** Password-protected portal for existing clients.
5. **Contact & Salon:** Minimal, by-appointment messaging.

---

## Completed Phases

### Phase 1: Hero & Navigation ✅
| Task | Status |
|------|--------|
| GSAP ScrollTrigger hero slider | ✅ Done |
| Desert storm particle system (800+ particles) | ✅ Done |
| Gaussian Splat plasma transitions (custom GLSL) | ✅ Done |
| HDR post-effects pipeline (CameraFrame) | ✅ Done |
| Fluid spring-physics navigation | ✅ Done |
| Magnetic scroll snapping (40/60 threshold) | ✅ Done |
| Sticky header with progress bar | ✅ Done |
| Full-screen menu overlay | ✅ Done |
| 3D interactive category hub cards | ✅ Done |
| Loading screen with font preload | ✅ Done |

### Phase 2: Content Pages ✅
| Task | Status |
|------|--------|
| Sculpture detail pages (Ken Burns, info cards, gallery) | ✅ Done |
| Artist biography section (video background) | ✅ Done |
| Contact page (sculptural design, particles) | ✅ Done |
| Dynamic footer (CMS-powered) | ✅ Done |
| Video divider components | ✅ Done |
| Video showcase section (film data) | ✅ Done |
| Works showcase grid | ✅ Done |

### Phase 3: CMS & Admin ✅
| Task | Status |
|------|--------|
| Express.js headless CMS | ✅ Done |
| Admin panel UI | ✅ Done |
| JWT auth + user management | ✅ Done |
| Password reset flow (Resend email) | ✅ Done |
| Image cropper component | ✅ Done |
| Site content editor (footer, contact, artist) | ✅ Done |
| Asset management with uploads | ✅ Done |
| Archive posts system | ✅ Done |
| Film management | ✅ Done |

### Phase 4: Collection Pages (In Progress)
| Task | Status |
|------|--------|
| Collection template router (`collection-page.js`) | ✅ Done |
| Network collection page (works grid, finish comparator) | ✅ Done |
| Coins collection page (grid + side panel details) | ✅ Done |
| Coin asset optimization (WebP conversion) | ✅ Done |
| Hero slider reorder (Net-Work → Monumental → The Forge) | ✅ Done |
| Collection renames (Monumental, Paintings, Public Work) | ✅ Done |
| Selection restructure (9 cards → 3 cards) | ✅ Done |
| Press/Articles page (10 curated articles) | ✅ Done |
| CMS/fallback data sync | ✅ Done |
| Brand tagline update ("From Atom to Atlas") | ✅ Done |
| Monumental collection page template | 🔲 Next |

### Phase 5: Deployment ✅
| Task | Status |
|------|--------|
| cPanel hosting (CloudLinux Passenger, Node.js 22) | ✅ Done |
| Git-based deploy via `.cpanel.yml` | ✅ Done |
| Automated deploy workflow (`.agent/workflows/deploy.md`) | ✅ Done |
| AutoSSL (Let's Encrypt) | ✅ Done |
| Cloudflare DNS configuration | ✅ Done |
| WebP image optimization (all images) | ✅ Done |
| Splat lazy loading (eager first + background rest) | ✅ Done |

---

## Immediate Next Steps

### Priority 1: Monumental Collection Page
Design and implement the "Monumental" collection page featuring:
- **Poseidon** — cinematic hero feature
- **Atlas** — major feature piece
- **Labours of Hercules** — themed series

### Priority 2: Remaining Collection Pages
Build templates for remaining collections:
- Portraits (bronze busts)
- Paintings (metal paintings / plasma torch)
- Public Work (monuments & interventions)

### Priority 3: Polish & Mobile
- [ ] Mobile optimization (responsive layouts, reduced GPU load)
- [ ] SEO meta tags per page
- [ ] Accessibility (keyboard nav, ARIA labels)
- [ ] Performance profiling
- [ ] Analytics integration

---

## Technical Decisions

### Stack Choices
| Technology | Rationale |
|------------|-----------|
| **PlayCanvas** | Native Gaussian Splat `.sog` support, custom shader injection, HDR pipeline |
| **GSAP + ScrollTrigger** | Cinematic scroll-driven hero slider with compressed timing |
| **Lenis** | Smooth scroll behavior |
| **Swiper** | Touch-friendly carousels |
| **Express.js flat-file CMS** | Lightweight, no database needed, JSON data in `cms/data/` |
| **Vite** | Fast builds, ES module support, multi-page app config |

### Architecture Pattern
The site uses a **multi-page app (MPA)** pattern with Vite:
- 10 HTML entry points compiled separately
- Shared UI components imported per page
- Dynamic template routing for collection pages via `?id=` query param
- CMS API provides content; frontend fetches on load with graceful fallbacks

---

## Design System Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#050508` | Deep void canvas |
| `--accent` | `#c9a77a` | Warm gold highlights |
| `--stone` | `#6b6b7a` | Muted body text |
| `--font-primary` | `Cormorant Garamond` | Display/Lead |
| `--font-secondary` | `Inter` | UI/Body |
| `--font-signature` | `Mrs Saint Delafield` | Cursive signatures |
| Transition | `0.8s cubic-bezier` | Luxurious ease |

---

*Document created: January 2025*  
*Last updated: March 2026*
