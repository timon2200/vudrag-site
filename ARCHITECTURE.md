# Vudrag — Architecture Documentation

> A dark, cinematic web experience showcasing sculptural works with 3D Gaussian Splats, GSAP-driven hero transitions, and a lightweight CMS.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vite** | 5.4 | Build tool & dev server (multi-page app) |
| **PlayCanvas** | ≥2.5 | 3D engine for Gaussian Splat rendering |
| **GSAP** | ≥3.14 | ScrollTrigger hero slider, scroll-driven animations |
| **Lenis** | ≥1.3 | Smooth scroll behavior |
| **Swiper** | ≥12.1 | Touch-friendly carousels |
| **Express.js** | — | CMS API server |
| **Custom GLSL** | — | Plasma transition & particle wave shaders |
| **CameraFrame** | — | PlayCanvas HDR post-processing |

---

## Project Structure

```
vudrag-site/
├── index.html                          # Homepage (hero slider + sections)
├── gallery.html                        # 3D Gaussian Splat gallery
├── collection.html                     # Dynamic collection template router
├── sculpture.html                      # Sculpture detail page
├── contact.html                        # Contact page
├── archive.html                        # Password-protected archive
├── login.html                          # Authentication page
├── splat-hero.html                     # Standalone splat hero experience
├── splat-viewer.html                   # Interactive splat viewer
├── vite.config.js                      # Vite config (9 entry points)
├── package.json                        # Frontend dependencies
├── .cpanel.yml                         # cPanel deployment tasks
├── .env / .env.production              # Environment variables
├── src/
│   ├── main.js                         # Homepage entry ─ orchestrates all modules
│   ├── collection-page.js              # Collection template router (network/coins/…)
│   ├── gallery-app.js                  # PlayCanvas 3D gallery logic
│   ├── sculpture-page.js              # Sculpture detail page logic
│   ├── contact.js                      # Contact page logic
│   ├── archive.js                      # Archive page logic
│   ├── login.js                        # Login page logic
│   ├── reset-password.js              # Password reset logic
│   ├── splat-hero.js                   # Standalone splat hero page
│   ├── splat-viewer.js                 # Interactive splat viewer page
│   ├── config.js                       # Centralized splat configuration
│   ├── state.js                        # Global application state
│   ├── shaders/
│   │   ├── plasma.glsl.js             # Plasma explosion transition shader
│   │   └── particle-wave.glsl.js      # Particle wave shader
│   ├── systems/
│   │   ├── camera.js                   # Orbital camera with sway & breathing
│   │   ├── hero-transition.js         # Hero fade/blur when scrolling past
│   │   ├── navigation.js              # Page navigation utilities
│   │   ├── particles.js               # Ambient dust particle system
│   │   ├── post-effects.js            # HDR bloom, vignette, color grading
│   │   ├── scroll.js                   # Magnetic snap scroll behavior
│   │   └── splats.js                   # Splat loading, transitions, shaders
│   ├── templates/
│   │   ├── network/
│   │   │   └── network-page.js        # Network collection template (~25KB)
│   │   ├── coins/
│   │   │   └── coins-page.js          # Coins collection template (~22KB)
│   │   ├── polygonal/
│   │   │   └── polygonal-page.js      # Handles Monumental & Polygonal (~35KB)
│   │   ├── paintings/
│   │   │   └── paintings-page.js      # Interactive Plasma Canvas (~21KB)
│   │   ├── public-works/
│   │   │   └── public-works-page.js   # Digital Monograph template (~25KB)
│   │   └── splat-hero/                # Reusable splat hero template
│   │       ├── config.js, state.js
│   │       ├── shaders/, systems/, ui/
│   │       └── data/
│   ├── ui/
│   │   ├── hero-slider.js             # GSAP ScrollTrigger hero carousel
│   │   ├── desert-storm.js            # Desert storm particle system (800+)
│   │   ├── category-hub.js            # 3D tilt cards for collections
│   │   ├── artist-section.js          # Artist biography section
│   │   ├── works-showcase.js          # Portfolio grid display
│   │   ├── video-showcase.js          # Film/video showcase section
│   │   ├── video-divider.js           # Cinematic video transitions
│   │   ├── footer.js                   # CMS-powered dynamic footer
│   │   ├── sticky-header.js           # Minimal sticky header
│   │   ├── menu-overlay.js            # Full-screen hamburger menu
│   │   ├── scroll-reveal.js           # Scroll-triggered reveal animations
│   │   ├── fluid-navigation.js        # Spring-physics navigation line
│   │   ├── text-overlay.js            # Sculpture title/subtitle display
│   │   ├── interaction-hint.js        # Scroll interaction cue
│   │   ├── debug-panel.js             # Particle tuning (dev only)
│   │   ├── splat-debug-panel.js       # Splat & camera tuning (dev only)
│   │   ├── splat-grading-panel.js     # Color grading panel (dev only)
│   │   └── pedestal-transform-panel.js # Pedestal debug panel (dev only)
│   ├── styles/                         # 23 CSS files (per-component)
│   │   ├── variables.css               # Design tokens
│   │   ├── hero-slider.css, hero-pinned.css
│   │   ├── network-page.css (~31KB), coins-page.css (~22KB)
│   │   ├── sculpture-page.css (~37KB)
│   │   ├── contact.css, login.css, archive.css
│   │   ├── artist-section.css, footer.css, video-showcase.css
│   │   ├── category-hub.css, works-showcase.css
│   │   ├── menu-overlay.css, sticky-header.css
│   │   ├── scroll-reveal.css, luxury-typography.css
│   │   ├── gallery-overlay.css, video-divider.css
│   │   ├── main-background.css, maska-effects.css
│   │   └── force-bg.css
│   ├── data/
│   │   └── galleries.js               # Frontend gallery fallback data
│   └── sections/                       # (empty — reserved)
├── content/
│   ├── artist_bio.md                   # Artist biography text
│   ├── collections_data.js            # Structured collections (legacy)
│   └── collections_update_example.js  # Example update script
├── public/
│   ├── gs_*.sog                       # Gaussian Splat files (3)
│   ├── images/                         # WebP images (hero, works, coins, weld-process)
│   │   ├── coins/                     # 35 coin photos (PNG originals + WebP)
│   │   └── works/                     # 17 work images (WebP)
│   ├── models/                         # GLB 3D models (pedestal)
│   ├── splats/                         # Additional splat files
│   ├── textures/                       # Title textures
│   └── environments/                   # HDR environment maps
├── admin/
│   ├── index.html                     # Admin panel UI (~23KB)
│   ├── src/
│   │   ├── app.js                     # Admin panel JavaScript
│   │   └── image-cropper.js           # Image cropper component
│   └── styles/
│       ├── admin.css                  # Admin panel styles
│       └── image-cropper.css          # Cropper styles
├── cms/
│   ├── server.js                       # Express API (~862 lines)
│   ├── package.json                   # CMS dependencies
│   ├── services/
│   │   └── mailer.js                  # Resend email service
│   ├── data/                           # JSON flat-file database
│   │   ├── collections.json           # Collections & works (~35KB)
│   │   ├── sculptures.json            # Detail page narratives
│   │   ├── site-content.json          # Footer, contact, artist section
│   │   ├── splats.json                # 3D splat configuration
│   │   ├── galleries.json             # Gallery definitions
│   │   ├── films.json                 # Film/video showcase data
│   │   ├── archive-posts.json         # Archive posts (client portal)
│   │   ├── grid-order.json            # Works showcase display order
│   │   └── users.json                 # Admin user accounts
│   └── README.md                       # CMS API documentation
├── design/
│   └── strategic_brief.md             # Design philosophy & structure
├── .agent/
│   ├── workflows/
│   │   └── deploy.md                  # Deployment workflow
│   └── skills/
│       ├── compress-glb/              # GLB compression skill
│       └── vudrag-voice/              # Copy writing style guide
├── ARCHITECTURE.md                     # This file
├── DEPLOYMENT.md                       # Hosting & deploy guide
├── PROJECT_TRAJECTORY.md              # Roadmap & status
└── README.md                          # Project overview
```

---

## Running the Project

### Local Development
```bash
npm install
npm run dev     # Frontend at http://localhost:3000

# In a separate terminal:
cd cms && npm install && node server.js  # CMS at http://localhost:3001
```

Vite proxies `/api` requests to port 3001 automatically.

### Production
Hosted on **cPanel with CloudLinux Passenger** at [vudrag.varazdin.studio](https://vudrag.varazdin.studio). Both frontend and CMS are served by a single Node.js app.

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full deploy workflow.

---

## Application Architecture

### Multi-Page App (MPA)

The site is built as a **multi-page application** with 9 HTML entry points compiled by Vite:

| Entry | HTML | JS Entry | Purpose |
|-------|------|----------|---------|
| Homepage | `index.html` | `src/main.js` | Hero slider, sections, category hub |
| Gallery | `gallery.html` | `src/gallery-app.js` | PlayCanvas 3D splat gallery |
| Collection | `collection.html` | `src/collection-page.js` | Dynamic template router |
| Sculpture | `sculpture.html` | `src/sculpture-page.js` | Individual sculpture detail |
| Contact | `contact.html` | `src/contact.js` | Contact information |
| Archive | `archive.html` | `src/archive.js` | Password-protected client portal |
| Login | `login.html` | `src/login.js` | Authentication |
| Splat Hero | `splat-hero.html` | `src/splat-hero.js` | Standalone splat experience |
| Splat Viewer | `splat-viewer.html` | `src/splat-viewer.js` | Interactive splat viewer |

### Homepage Flow (`main.js`) — Progressive Loading

The homepage uses a **two-phase progressive loading** strategy so the hero slider appears instantly while below-fold sections load in the background:

**Phase 1 — Hero (blocks loading screen):**
```
await setupHeroSlider()   → CMS fetch + DOM build (~200ms)
hideLoadingScreen()       → Dismiss loading screen immediately
```

**Phase 2 — Below-fold (deferred via `requestIdleCallback`):**
```
createStickyHeader()     → Minimal header (appears after hero)
setupScrollReveal()      → Intersection Observer for reveals
setupCategoryHub()       → 3D tilt cards (fetches from CMS)
setupArtistSection()     → Artist bio (fetches from CMS)
setupVideoShowcase()     → Film section (fetches from CMS)
setupWorksShowcase()     → Portfolio grid (fetches from CMS)
setupFooter()            → Dynamic footer (fetches from CMS)
createMenuOverlay()      → Full-screen navigation menu
```

### Collection Template System (`collection-page.js`)

The collection page uses a **dynamic template router**:

1. Reads `?id=` from URL
2. Fetches collection data from `GET /api/collections/:id`
3. Routes based on `collection.pageType`:
   - `"network"` → `src/templates/network/network-page.js`
   - `"coins"` → `src/templates/coins/coins-page.js`
   - Default → redirects to `gallery.html?category=...`
4. Calls `templateModule.mount(root, collection)` to render
5. Initializes shared UI (menu overlay, footer)

### CMS Data Flow

All dynamic content is fetched from the CMS API:

```
Frontend Component  →  GET /api/endpoint  →  CMS reads JSON file  →  Returns data
                                                cms/data/*.json
```

**Public endpoints** (no auth): `collections`, `collections/:id`, `sculptures`, `sculptures/:id`, `site-content`, `grid-order`, `films`, `config.json`

**Protected endpoints** (JWT required): All `POST`, `PUT`, `DELETE` operations, plus `splats`, `galleries`, `assets`, `users`, `archive-posts`, `settings`

---

## The Hero Slider System

### GSAP ScrollTrigger Carousel

The homepage hero uses GSAP ScrollTrigger for cinematic slide transitions:

- **Scroll-driven transitions** with compressed ~0.6s timing
- **Intra-slide text parallax** — per-element depth shift within slides
- **Desert storm** atmospheric particle system (800+ sandstorm particles, 14+ organic wisps, embers, floating dust)
- Three slides featuring: Atlas, Forge, Network (images from `public/images/`)

---

## The 3D Gaussian Splat System

### Splat Gallery (`gallery-app.js`)

The PlayCanvas-powered gallery showcases photorealistic 3D sculptures:

**Current Splats:**
| Sculpture | File | Size |
|-----------|------|------|
| Maska | `gs_Maska_Vudrag.sog` | 7.1MB |
| Kapljica | `gs_Vudrag_galerija_kapljica.sog` | 11.5MB |
| Romislav | `gs_vudrag_romislav.sog` | 2.6MB |

### Plasma Transition System

Transitions between sculptures use a single-uniform GLSL shader:

```
uTransition: 0 ═══════► 0.5 ═══════► 1
             normal     peak        invisible
                      explosion
```

- **Outgoing splat**: `transitionValue` 0 → 1
- **Incoming splat**: `transitionValue` 1 → 0
- **At 0.5**: Peak plasma explosion, opacity crossfade
- **Magnetic snap**: < 40% → snaps back, > 60% → commits to next

### Camera System

Front-facing orbital camera with:
- Gentle auto-sway oscillation
- Dynamic distance (pull back during transitions)
- Subtle vertical breathing
- Mouse-responsive rotation

### Post-Processing (CameraFrame HDR)

| Effect | Settings |
|--------|----------|
| Bloom | intensity: 0.06, mipLevel: 1 |
| Vignette | inner: 0.4, outer: 1.1, curvature: 0.6 |
| Color Grading | brightness: 1.0, contrast: 1.05, saturation: 1.1 |

Effects intensify during plasma transitions (increased bloom, tighter vignette).

---

## State Management

### Global State (`src/state.js`)

```javascript
export const state = {
    app: null,              // PlayCanvas Application instance
    camera: null,           // Camera entity
    splatEntities: [],      // Gaussian splat entities
    splatAssets: [],        // Loaded splat assets
    time: 0,                // Elapsed time for animations
    scrollProgress: 0,      // Current scroll position (0-1)
    targetScrollProgress: 0,// Target scroll (smooth interpolation)
    currentSplatIndex: 0,   // Currently displayed sculpture
    isLoaded: false,
    lastScrollTime: 0,
    isScrolling: false,
    mouse: { x: 0, y: 0 }, // Normalized mouse position (-1 to 1)
    particles: null,
    textOverlay: null,
    debugPanel: null
};
```

---

## Design System

### Premium Aesthetic (Patek Philippe-inspired)

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#050508` | Deep void canvas |
| Accent | `#c9a77a` | Warm gold highlights |
| Surface | `#383E42` | Elevated panels, cards |
| Stone | `#6b6b7a` | Muted body text |
| Light | `#F6F6F6` | Accents (restrained) |
| Display Font | Cormorant Garamond | Elegant serif headings |
| Body Font | Inter | Clean sans-serif UI |
| Signature Font | Mrs Saint Delafield | Cursive signatures |

### Component Styling Pattern

Each UI component has its own CSS file imported at the page level:
```javascript
import './styles/hero-slider.css';
import './styles/category-hub.css';
// etc.
```

---

## Debug Mode

In development (`npm run dev`), debug panels are available:

| Key | Panel | Purpose |
|-----|-------|---------|
| `P` | Particles | Tune emitter radius, scale, count, lifetime |
| `E` | Post-Effects | Tune bloom, vignette, color grading |
| `S` | Splat | Tune camera sway, splat positions |
| `G` | Color Grading | Per-sculpture color adjustment |

---

## Adding a New Collection Template

1. Create `src/templates/<name>/<name>-page.js`
2. Export a `mount(rootElement, collectionData)` function
3. Add CSS file to `src/styles/<name>-page.css`
4. Add case to `collection-page.js` switch statement:
   ```javascript
   case 'your-type':
       templateModule = await import('./templates/<name>/<name>-page.js');
       break;
   ```
5. Set `pageType: 'your-type'` on the collection in CMS

---

## Adding a New Sculpture to the 3D Gallery

1. Add the `.sog` file to `public/` (root of public dir)
2. Update `src/config.js`:
   ```javascript
   {
       name: 'NewSculpture',
       file: 'gs_new_sculpture.sog',
       position: [0, 0, 0],
       rotation: [0, 0, 180],
       scale: 1.0,
       title: 'NEW SCULPTURE',
       subtitle: 'Description here',
       number: '04'
   }
   ```
3. The system auto-handles: loading, entity creation, shader application, text overlay, nav node, and transition logic.

---

## Known Quirks

1. **Shader uniforms must be set BEFORE enabling entities** to prevent visual flash
2. **Particles require a colorMap texture** or they won't render
3. **PlayCanvas ES modules** — use named imports, not `pc.*` prefix
4. **Gaussian splat `.sog` files** — currently in `public/` root
5. **CameraFrame requires camera component** to be present before setup
6. **`dist/` is committed to git** — frontend is built locally before pushing
7. **Collection pages require CMS** — they fetch data from `/api/collections/:id`

---

## External Resources

- [PlayCanvas Gaussian Splatting Docs](https://developer.playcanvas.com/user-manual/gaussian-splatting/)
- [Custom Shaders Reference](https://developer.playcanvas.com/user-manual/gaussian-splatting/building/custom-shaders/)
- [CameraFrame API](https://api.playcanvas.com/engine/classes/CameraFrame.html)
- [PlayCanvas Engine API](https://api.playcanvas.com/)
- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)