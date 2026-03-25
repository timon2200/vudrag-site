# Vudrag | Sculptures in Light

> An immersive web experience showcasing sculptural works through 3D Gaussian Splats, cinematic scroll-driven transitions, and premium luxury aesthetics.

![PlayCanvas](https://img.shields.io/badge/PlayCanvas-≥2.5-orange)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF)
![GSAP](https://img.shields.io/badge/GSAP-≥3.14-88CE02)
![License](https://img.shields.io/badge/license-Private-red)

**Live Site:** [vudrag.varazdin.studio](https://vudrag.varazdin.studio)  
**Admin Panel:** [vudrag.varazdin.studio/cms-admin](https://vudrag.varazdin.studio/cms-admin)

---

## ✨ Features

### 🎬 Cinematic Hero Slider
GSAP ScrollTrigger-driven carousel with atmospheric effects:
- Scroll-driven slide transitions with compressed ~0.6s timing
- Intra-slide text parallax — per-element depth shift while scrolling within each slide
- Desert storm particle system — 800+ sandstorm particles, 14+ organic wisps, embers, and floating dust
- Cinematic typography with animated progress indicator

### 🎨 3D Gaussian Splat Gallery
Photorealistic sculptures rendered using Gaussian Splatting (`.sog` files) with:
- Custom GLSL plasma explosion/implosion transitions
- HDR post-processing (bloom, vignette, color grading)
- Fluid spring-physics navigation with adaptive titles
- Magnetic scroll snapping (40/60% threshold)

**Current Gallery:** Maska, Kapljica, Romislav

### 🖼️ Collection Pages
Dynamic template-routed collection pages (`/collection.html?id=...`):
- **Network** — Welded-sculpture showcase with works gallery grid, draggable split-screen finish comparator, and cinematic detail panels
- **Coins & Medals** — Responsive grid with slide-in side panel for detailed coin/medal information
- **Polygonal** — (In design — Poseidon, Atlas, Labours of Hercules)

### 🖼️ Sculpture Detail Pages
Rich cinematic pages for each piece featuring:
- Ken Burns hero with scroll-based zoom
- Floating info cards (materials, dimensions, collection, concept)
- Process, technique, vision, and story sections
- Technical gallery with lightbox
- Related works grid and sculptural inquiry CTA

### 📬 Contact Page
Sculptural presentation with ambient floating particles, glowing background, signature styling, and interactive email link.

### 🔒 Authentication & Archive
- JWT-based admin authentication
- Email password reset via Resend API
- Password-protected archive for client-only content (block-based posts)

### 🎥 Video Integration
- GSAP-powered video dividers for cinematic section transitions
- Video showcase section with CMS-managed film data
- Artist section with YouTube embed background

### ⚡ Category Hub & Navigation
- Interactive 3D tilt cards for browsing collections
- Sticky minimal header with progress bar
- Full-screen luxury menu overlay
- Spring-physics fluid navigation line

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/timon2200/vudrag-site.git
cd vudrag-site
npm install
npm run dev
```

The site is available at `http://localhost:3000`.

### Starting the CMS

```bash
cd cms
npm install
node server.js
```

CMS Admin Panel: [http://localhost:3001/cms-admin](http://localhost:3001/cms-admin)

Vite automatically proxies `/api` requests to port 3001.

### Build & Deploy

```bash
npm run build                    # Build frontend → dist/
git add -A && git commit -m "Your changes"
git push origin main
```

Then in cPanel: **Git Version Control** → Update from Remote → Deploy HEAD Commit → Restart Node.js App.

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full deployment guide.

---

## 📁 Project Structure

```
vudrag-site/
├── src/
│   ├── main.js                       # Homepage orchestrator
│   ├── collection-page.js            # Dynamic collection template router
│   ├── gallery-app.js                # PlayCanvas 3D gallery
│   ├── sculpture-page.js             # Sculpture detail page
│   ├── contact.js, archive.js        # Content pages
│   ├── login.js, reset-password.js   # Auth pages
│   ├── splat-hero.js, splat-viewer.js # Standalone splat experiences
│   ├── config.js, state.js           # Configuration & global state
│   ├── shaders/                       # Custom GLSL (plasma, particle-wave)
│   ├── systems/                       # PlayCanvas systems (camera, scroll, splats, particles, post-effects)
│   ├── templates/                     # Collection page templates
│   │   ├── network/network-page.js   # Network collection
│   │   ├── coins/coins-page.js       # Coins collection
│   │   └── splat-hero/               # Reusable splat hero template
│   ├── ui/                            # 18 UI components (hero-slider, desert-storm, category-hub, ...)
│   └── styles/                        # 23 CSS files (per-component)
├── admin/                             # CMS admin panel (static HTML/JS/CSS)
├── cms/
│   ├── server.js                      # Express API server (~862 lines)
│   ├── services/mailer.js             # Resend email service
│   └── data/                          # JSON flat-file database (9 files)
├── public/                            # Static assets
│   ├── gs_*.sog                       # Gaussian Splat files (3)
│   ├── images/                        # WebP images, coins, works
│   ├── models/, textures/, environments/
│   └── splats/                        # Additional splat files
├── content/                           # Artist bio, collections data
├── design/                            # Strategic design brief
├── 9 HTML entry points               # index, gallery, collection, sculpture, contact, archive, login, splat-hero, splat-viewer
└── vite.config.js                     # Multi-page Vite config
```

---

## 🎛️ Development Mode

Debug panels available in development (`npm run dev`):

| Key | Panel | Purpose |
|-----|-------|---------|
| `P` | Particles | Tune emitter radius, scale, count |
| `E` | Post-Effects | Tune bloom, vignette, grading |
| `S` | Splat | Tune camera sway, positions |
| `G` | Color Grading | Per-sculpture color adjustment |

---

## 🖥️ CMS

A lightweight headless CMS powers all dynamic content via flat-file JSON.

### What You Can Manage

| Section | Description |
|---------|-------------|
| **Collections** | Category hub content, nested works, page types |
| **Sculptures** | Rich narrative content for detail pages |
| **Splats** | 3D splat transforms, color grading |
| **Films** | Video showcase data |
| **Site Content** | Footer, contact, artist section, social links |
| **Assets** | Upload/manage images, splats, environments |
| **Users** | Admin accounts and permissions |
| **Archive** | Block-based posts for client portal |
| **Settings** | Email templates, system preferences |

Login: `ADMIN_PASSWORD` env variable (cPanel) or `cms/.env` (local).

See **[cms/README.md](./cms/README.md)** for API reference.

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#050508` | Deep void canvas |
| Accent | `#c9a77a` | Warm gold highlights |
| Stone | `#6b6b7a` | Muted text |
| Display Font | Cormorant Garamond | Elegant serif headings |
| Body Font | Inter | Clean sans-serif |
| Signature Font | Mrs Saint Delafield | Cursive signature |
| Transition | `0.8s cubic-bezier` | Luxurious ease |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **[Vite](https://vitejs.dev/)** | Build tool & dev server (multi-page) |
| **[PlayCanvas](https://playcanvas.com/)** | 3D WebGL/WebGPU engine |
| **[GSAP](https://gsap.com/)** | ScrollTrigger hero slider, animations |
| **[Lenis](https://lenis.darkroom.engineering/)** | Smooth scroll behavior |
| **[Swiper](https://swiperjs.com/)** | Touch-friendly carousels |
| **Gaussian Splatting** | Photorealistic 3D capture rendering |
| **Custom GLSL** | Plasma transition & particle shaders |
| **CameraFrame** | HDR post-processing pipeline |
| **Express.js** | CMS API server |
| **Resend** | Transactional email (password resets) |

---

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Deep technical docs: systems, shaders, module architecture
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** — Production hosting guide (cPanel, DNS, SSL, deploy workflow)
- **[PROJECT_TRAJECTORY.md](./PROJECT_TRAJECTORY.md)** — Roadmap, vision, and development status
- **[cms/README.md](./cms/README.md)** — CMS server documentation with full API reference
- **[design/strategic_brief.md](./design/strategic_brief.md)** — Design philosophy & brand strategy

---

## 🎯 Roadmap

### Phase 1–3: Core Experience ✅
- [x] GSAP hero slider with desert storm particles
- [x] PlayCanvas Gaussian Splat gallery with plasma transitions
- [x] Sculpture detail pages, artist section, contact page
- [x] Headless CMS with admin panel
- [x] JWT auth, password reset, user management

### Phase 4: Collection Pages (In Progress)
- [x] Collection template router system
- [x] Network collection page (works grid, finish comparator)
- [x] Coins collection page (grid + side panel)
- [ ] Polygonal collection page (Poseidon, Atlas, Hercules)
- [ ] Remaining collection templates

### Phase 5: Production ✅
- [x] cPanel hosting (CloudLinux Passenger, Node.js 22)
- [x] Git-based deploy workflow
- [x] AutoSSL, Cloudflare DNS
- [x] WebP image optimization
- [x] Lazy splat loading

### Phase 6: Polish
- [ ] Mobile optimization
- [ ] SEO & accessibility
- [ ] Performance profiling
- [ ] Analytics integration

---

## 👤 Artist

**Nikola Vudrag** — Sculptor working at the intersection of traditional craft and digital preservation. The "Net-work" philosophy explores how connected forms create meaning through their relationships.

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

<div align="center">
  <sub>Built with ❤️ using PlayCanvas + Vite + GSAP</sub>
</div>
