# Vudrag | Sculptures in Light

> An immersive 3D web experience showcasing photorealistic Gaussian Splat sculptures with cinematic transitions and luxury aesthetics.

![PlayCanvas](https://img.shields.io/badge/PlayCanvas-2.1-orange)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF)
![License](https://img.shields.io/badge/license-Private-red)

---

## ✨ Features

### 🎨 Gaussian Splat Sculptures
Photorealistic 3D sculptures rendered using cutting-edge Gaussian Splatting technology. Each sculpture is captured as a `.sog` file and rendered in real-time with full HDR lighting.

**Current Collection:**
| Sculpture | Description |
|-----------|-------------|
| **Maska** | "The face beneath the surface" |
| **Kapljica** | "Where stone meets water" |
| **Romislav** | "Ancient whispers in marble" |

### 🌟 Plasma Explosion Transitions
Custom GLSL shaders create mesmerizing plasma explosion/implosion effects when transitioning between sculptures:
- Particles burst outward in spiraling patterns
- Hot plasma color gradients (orange → white-hot)
- Smooth opacity crossfades at peak explosion
- GPU-accelerated vertex manipulation

### 🎬 Cinematic Post-Processing
HDR rendering pipeline via PlayCanvas CameraFrame:
- **Bloom** — Soft glow on bright elements
- **Vignette** — Focus attention to center
- **Color Grading** — Per-sculpture tone adjustment

### ⚡ Fluid Navigation & Category Hub
- **Category 3D Cards**: Interactive tilt-enabled cards for browsing collections.
- **Sticky Header**: Minimal navigation that reveals after the hero section.
- **Menu Overlay**: Full-screen luxury menu with navigation to all sections.
- **Spring-Physics Line**: Fluid indicator that follows your journey.

### 🎯 Magnetic Scroll Snapping
Weighted scroll behavior that feels physical:
- Sculptures "want" to stay in frame
- 40/60% threshold for commit/revert
- Smooth interpolation with idle detection

### 🖼️ Sculpture Detail Pages
Rich cinematic detail pages for each sculpture featuring:
- **Ken Burns Hero**: Scroll-based zoom effect on hero image
- **Floating Info Cards**: Materials, dimensions, collection, concept
- **Process & Technique Sections**: Behind-the-scenes narrative
- **Vision & Story Sections**: Artist statement and context
- **Technical Gallery**: Blueprint-style documentation with lightbox
- **Inquire Section**: Elegant sculptural CTA linking to contact
- **Related Works**: Dynamic grid of related pieces

### 📬 Contact Page
Sculptural presentation of contact information:
- Ambient floating particles and glowing background
- Elegant typography with signature styling
- Interactive email link with hover glow effects
- Decorative crown and base ornaments

### 🎥 Video Integration
Atmospheric video elements throughout the experience:
- **Video Dividers**: Cinematic section transitions
- **Artist Section Background**: YouTube embed with oversized cropping
- Dynamic loading with graceful fallbacks

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/timon2200/vudrag-site.git
cd vudrag-site

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:3000` (or 3001 if 3000 is occupied).

### Starting the CMS

```bash
# In a separate terminal
cd cms
npm install
node server.js
```

CMS Admin Panel: [http://localhost:3001/admin](http://localhost:3001/admin)

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

---

## 📁 Project Structure

```
vudrag-site/
├── public/
│   ├── gs_*.sog                      # Gaussian Splat files
│   └── textures/                     # Title textures
├── src/
│   ├── main.js                       # Entry point & orchestrator
│   ├── config.js                     # Centralized configuration
│   ├── state.js                      # Global application state
│   ├── contact.js                    # Contact page logic
│   ├── sculpture-page.js             # Sculpture detail page
│   ├── shaders/
│   │   └── plasma.glsl.js            # Custom GLSL transition shader
│   ├── systems/
│   │   ├── camera.js                 # Orbital camera with sway
│   │   ├── hero-transition.js        # Hero fade-out transition
│   │   ├── particles.js              # Ambient dust particles
│   │   ├── post-effects.js           # HDR bloom, vignette, grading
│   │   ├── scroll.js                 # Magnetic snap scroll
│   │   └── splats.js                 # Splat loading & transitions
│   ├── ui/
│   │   ├── artist-section.js         # Artist biography section
│   │   ├── category-hub.js           # 3D interactive category cards
│   │   ├── footer.js                 # Dynamic CMS-powered footer
│   │   ├── menu-overlay.js           # Full-screen hamburger menu
│   │   ├── sticky-header.js          # Minimal sticky header
│   │   ├── video-divider.js          # Cinematic video transitions
│   │   └── works-showcase.js         # Portfolio grid display
│   └── styles/
│       ├── artist-section.css        # Artist section styles
│       ├── contact.css               # Contact page styles
│       ├── footer.css                # Footer styles
│       ├── sculpture-page.css        # Detail page styles
│       └── video-divider.css         # Video component styles
├── admin/
│   ├── index.html                    # CMS admin panel
│   ├── src/app.js                    # Admin panel JavaScript
│   └── styles/admin.css              # Admin panel styles
├── cms/
│   ├── server.js                     # Express API server
│   └── data/
│       ├── splats.json               # 3D splat configuration
│       ├── galleries.json            # Gallery definitions
│       ├── collections.json          # Category hub content
│       ├── sculptures.json           # Detail page narratives
│       ├── site-content.json         # Footer & contact content
│       └── grid-order.json           # Splat display order
├── index.html                        # Main page
├── sculpture.html                    # Sculpture detail template
├── contact.html                      # Contact page
└── vite.config.js                    # Vite configuration
```

---

## 🎛️ Development Mode

Debug panels are available in development (`npm run dev`):

| Key | Panel | Purpose |
|-----|-------|---------|
| `P` | Particles | Tune emitter radius, scale, count |
| `E` | Post-Effects | Tune bloom, vignette, grading |
| `S` | Splat | Tune camera sway, positions |
| `G` | Color Grading | Per-sculpture color adjustment |

All panels feature real-time sliders with a **"Log Current Values"** button to copy settings to config.

---

## 🖥️ CMS (Content Management System)

A lightweight headless CMS powers the portfolio's dynamic content.

### Accessing the Admin Panel

| Interface | URL |
|-----------|-----|
| **Admin Panel** | [http://localhost:3001/admin](http://localhost:3001/admin) |
| **API** | [http://localhost:3001/api/*](http://localhost:3001/api/) |

Login uses the password defined in `cms/.env` as `ADMIN_PASSWORD`.

### What You Can Manage

| Section | Description |
|---------|-------------|
| **Splats** | 3D splat transforms, positions, rotations, and color grading |
| **Galleries** | Sculpture series metadata (artist, year, material) |
| **Collections** | Category hub content and nested works |
| **Sculptures** | Rich narrative content for detail pages |
| **Assets** | Upload/manage `.sog` files, images, and environments |
| **Site Content** | Footer, contact page text, artist section, and social links |

### Site Content Editor

The Site Content section allows editing of:

**Artist Section:**
- Portrait image
- Name, born date, tagline
- Quote and background video URL
- Biography (intro, education, philosophy)
- Technique highlight (title, description, effect)

**Footer:**
- Brand name and tagline
- Description text
- Email and location
- Navigation and social links

**Contact Page:**
- Label and title lines
- Invitation text
- Email address and signature

### Data Storage

All content is stored as flat-file JSON in `cms/data/`:
- `splats.json` — 3D splat configuration
- `galleries.json` — Gallery definitions
- `collections.json` — Category hub content
- `sculptures.json` — Detail page narratives
- `site-content.json` — Footer, contact, and artist section content
- `grid-order.json` — Display ordering

See **[cms/README.md](./cms/README.md)** for full API documentation.

---

## 🎨 Design System

Following a **Patek Philippe-inspired** premium aesthetic:

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#050508` | Deep void canvas |
| Accent | `#c9a77a` | Warm gold highlights |
| Stone | `#6b6b7a` | Muted text |
| Display Font | Cormorant Garamond | Elegant serifs |
| Body Font | Inter | Clean sans-serif |
| Signature Font | Mrs Saint Delafield | Cursive signature |
| Transition | `0.8s cubic-bezier` | Luxurious ease |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **[PlayCanvas](https://playcanvas.com/)** | 3D WebGL/WebGPU engine |
| **[Vite](https://vitejs.dev/)** | Build tool & dev server |
| **Gaussian Splatting** | Photorealistic 3D capture rendering |
| **Custom GLSL** | Plasma transition shaders |
| **CameraFrame** | HDR post-processing pipeline |
| **Express.js** | CMS API server |
| **Canvas 2D** | Fluid navigation overlay |

---

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Deep technical documentation covering systems, shaders, and module architecture
- **[PROJECT_TRAJECTORY.md](./PROJECT_TRAJECTORY.md)** — Roadmap, vision, and future development phases
- **[cms/README.md](./cms/README.md)** — CMS server documentation with full API reference

---

## 🎯 Roadmap

### Phase 1: Hero & Navigation ✅
- [x] Plasma explosion transitions
- [x] HDR post-effects pipeline
- [x] Sticky Header & Global Menu
- [x] Interactive Category Hub

### Phase 2: Content & Polish ✅
- [x] Sculpture Detail Pages (Ken Burns hero, info cards, technical gallery)
- [x] Artist Biography Section with video background
- [x] Contact/Inquiry Flow with sculptural design
- [x] Dynamic Footer with CMS integration
- [x] Inquire section on sculpture pages
- [x] Video divider components

### Phase 3: CMS & Admin ✅
- [x] Headless CMS with Express.js
- [x] Admin panel for content management
- [x] Site Content editor (footer, contact, artist)
- [x] Asset management with drag-and-drop ordering

### Phase 4: Production
- [ ] Mobile optimization
- [ ] SEO & accessibility
- [ ] Performance profiling
- [ ] Analytics integration

---

## 📖 Resources

- [PlayCanvas Gaussian Splatting](https://developer.playcanvas.com/user-manual/gaussian-splatting/)
- [Custom Shaders Reference](https://developer.playcanvas.com/user-manual/gaussian-splatting/building/custom-shaders/)
- [CameraFrame API](https://api.playcanvas.com/engine/classes/CameraFrame.html)
- [PlayCanvas Engine API](https://api.playcanvas.com/)

---

## 👤 Artist

**Nikola Vudrag** — Sculptor working at the intersection of traditional craft and digital preservation. The "Net-work" philosophy explores how connected forms create meaning through their relationships.

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

<div align="center">
  <sub>Built with ❤️ using PlayCanvas + Vite</sub>
</div>
