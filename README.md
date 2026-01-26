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
- **Menu Overlay**: Full-screen luxury menu for easy access.
- **Spring-Physics Line**: Fluid indicator that follows your journey.

### 🎯 Magnetic Scroll Snapping
Weighted scroll behavior that feels physical:
- Sculptures "want" to stay in frame
- 40/60% threshold for commit/revert
- Smooth interpolation with idle detection

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
│   ├── gs_Maska_Vudrag.sog          # Gaussian Splat: Maska
│   ├── gs_Vudrag_galerija_kapljica.sog  # Gaussian Splat: Kapljica
│   └── gs_vudrag_romislav.sog       # Gaussian Splat: Romislav
├── src/
│   ├── main.js                      # Entry point & orchestrator
│   ├── config.js                    # Centralized configuration
│   ├── state.js                     # Global application state
│   ├── shaders/
│   │   └── plasma.glsl.js           # Custom GLSL transition shader
│   ├── systems/
│   │   ├── camera.js                # Orbital camera with sway
│   │   ├── hero-transition.js       # Hero fade-out transition
│   │   ├── particles.js             # Ambient dust particles
│   │   ├── post-effects.js          # HDR bloom, vignette, grading
│   │   ├── scroll.js                # Magnetic snap scroll
│   │   └── splats.js                # Splat loading & transitions
│   ├── ui/
│   │   ├── category-hub.js          # 3D interactive category cards
│   │   ├── debug-panel.js           # Dev: particle tuning
│   │   ├── fluid-navigation.js      # Spring-physics nav line
│   │   ├── interaction-hint.js      # Scroll cue
│   │   ├── menu-overlay.js          # Full-screen hamburger menu
│   │   ├── scroll-reveal.js         # Scroll-triggered reveals
│   │   ├── splat-debug-panel.js     # Dev: splat/camera tuning
│   │   ├── splat-grading-panel.js   # Dev: color grading
│   │   ├── sticky-header.js         # Minimal sticky header
│   │   └── text-overlay.js          # Sculpture title display
│   └── styles/
│       ├── (various css modules)
├── index.html                       # HTML entry with loading screen
├── vite.config.js                   # Vite configuration
├── ARCHITECTURE.md                  # Detailed technical docs
└── PROJECT_TRAJECTORY.md            # Roadmap & vision
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

## ➕ Adding New Sculptures

1. **Add the `.sog` file** to the `public/` directory

2. **Update `src/config.js`**:

```javascript
{
    name: 'NewSculpture',
    file: 'gs_new_sculpture.sog',
    position: [0, 0, 0],
    rotation: [0, 0, 180],      // Usually flipped 180°
    scale: 1.0,
    title: 'NEW SCULPTURE',
    subtitle: 'Your description here',
    number: '04'
}
```

The system automatically handles asset loading, entity creation, shader application, UI overlays, and navigation nodes.

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
| **Canvas 2D** | Fluid navigation overlay |

---

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Deep technical documentation covering systems, shaders, and module architecture
- **[PROJECT_TRAJECTORY.md](./PROJECT_TRAJECTORY.md)** — Roadmap, vision, and future development phases

---

## 🎯 Roadmap

### Phase 1: Hero & Navigation ✅
- [x] Plasma explosion transitions
- [x] HDR post-effects pipeline
- [x] Sticky Header & Global Menu
- [x] Interactive Category Hub

### Phase 2: Content & Polish
- [ ] Gallery App Integration (Route-based)
- [ ] Individual Collection Pages (Grid views)
- [ ] Artist Biography Section
- [ ] Contact/Inquiry Flow

### Phase 3: Production
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
