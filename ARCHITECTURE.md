# Vudrag SuperSplat - Architecture Documentation

> A dark, moody web experience showcasing 3D Gaussian Splat sculptures with custom plasma transitions, HDR post-processing, and fluid navigation.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **PlayCanvas** | 3D engine (ES modules via npm) |
| **Vite** | Build tool & dev server |
| **Gaussian Splatting** | 3D rendering technique for photorealistic sculptures |
| **Custom GLSL Shaders** | Plasma explosion/implosion transitions |
| **CameraFrame** | HDR post-processing (bloom, vignette, color grading) |
| **Canvas 2D** | Fluid navigation overlay with spring physics |

## Project Structure

```
vudrag-site-2/
├── src/
│   ├── main.js              # Entry point - orchestrates all modules
│   ├── config.js            # Centralized configuration
│   ├── state.js             # Global application state
│   ├── shaders/
│   │   └── plasma.glsl.js   # Custom GLSL plasma transition shader
│   ├── systems/
│   │   ├── camera.js        # Orbital camera with sway and breathing
│   │   ├── particles.js     # Ambient dust particle system
│   │   ├── post-effects.js  # HDR bloom, vignette, color grading
│   │   ├── scroll.js        # Magnetic snap scroll behavior
│   │   └── splats.js        # Gaussian splat loading & transitions
│   └── ui/
│       ├── debug-panel.js       # Particle tuning (dev only)
│       ├── fluid-navigation.js  # Spring-physics navigation line
│       ├── splat-debug-panel.js # Splat & camera tuning (dev only)
│       └── text-overlay.js      # Sculpture title/subtitle display
├── index.html               # HTML entry point with loading screen
├── style.css                # Global styles
├── package.json             # Dependencies (playcanvas, vite)
├── vite.config.js           # Vite configuration
├── gs_*.sog                 # Gaussian Splat asset files
└── ARCHITECTURE.md          # This file
```

## Running the Project

```bash
npm install
npm run dev     # Development server at localhost:3000 or 3001
npm run build   # Production build
```

---

## Core Architecture

### State Management

All application state is centralized in `src/state.js`:

```javascript
export const state = {
    app: null,              // PlayCanvas Application instance
    camera: null,           // Camera entity
    splatEntities: [],      // Array of gaussian splat entities
    splatAssets: [],        // Loaded splat assets
    time: 0,                // Elapsed time for animations
    scrollProgress: 0,      // Current scroll position (0-1)
    targetScrollProgress: 0, // Target scroll (for smooth interpolation)
    currentSplatIndex: 0,   // Currently displayed sculpture
    isLoaded: false,
    lastScrollTime: 0,      // For magnetic snap detection
    isScrolling: false,     // Whether user is actively scrolling
    mouse: { x: 0, y: 0 },  // Normalized mouse position (-1 to 1)
    particles: null,        // Ambient particle entity
    textOverlay: null,      // Text overlay container
    debugPanel: null        // Debug panel element
};
```

### Configuration

All configurable values are in `src/config.js`:

```javascript
export const CONFIG = {
    splats: [
        {
            name: 'Maska',
            file: 'gs_Maska_Vudrag.sog',
            position: [0, 0.25, 0],
            rotation: [-5, -45, 185],
            scale: 0.80,
            title: 'MASKA',
            subtitle: 'The face beneath the surface',
            number: '01'
        },
        // ... more splats
    ],
    camera: {
        baseDistance: 3.5,
        minDistance: 2.8,
        verticalOffset: 0.4,
        fov: 50
    },
    transition: {
        speed: 3.0,
        plasmaIntensity: 1.5
    },
    colors: {
        background: new Color(0.015, 0.015, 0.025, 1)
    }
};

export const SCROLL = {
    SNAP_THRESHOLD: 0.4,
    IDLE_TIMEOUT: 150
};
```

---

## Module System

### Main Entry Point (`src/main.js`)

Orchestrates initialization and the update loop:

1. Creates PlayCanvas Application
2. Loads splat assets
3. Sets up camera, splats, particles, post-effects
4. Sets up UI (text overlay, fluid navigation)
5. Conditionally loads debug panels in dev mode
6. Runs the main update loop

### Systems

#### Splats (`src/systems/splats.js`)
- `loadAssets()` - Async load of all `.sog` splat files
- `setupSplats()` - Create entities with position, rotation, scale
- `applyCustomShaders()` - Inject plasma GLSL shader into materials
- `updateSplatTransitions()` - Handle transition values based on scroll
- `updateSplatInteraction()` - Mouse-responsive rotation

#### Camera (`src/systems/camera.js`)
- `setupCamera()` - Create camera with background color and FOV
- `updateCamera()` - Orbital movement with auto-sway and breathing
- `getTransitionIntensity()` - Calculate current transition intensity

#### Particles (`src/systems/particles.js`)
- `createParticleTexture()` - Procedural soft gradient texture
- `setupParticles()` - Configure ambient dust particle system
- `updateParticleInteraction()` - Gentle rotation based on mouse

#### Post-Effects (`src/systems/post-effects.js`)
- `setupPostEffects()` - Initialize CameraFrame for HDR processing
- `updatePostEffects()` - Per-frame effect updates
- `adjustEffectsForTransition()` - Intensify bloom during plasma explosions
- `createPostEffectsDebugPanel()` - Dev panel for tuning effects

#### Scroll (`src/systems/scroll.js`)
- `setupScrollControl()` - Mouse wheel, touch, keyboard handlers
- `updateMagneticSnap()` - Sticky snap behavior when idle

### UI Components

#### Text Overlay (`src/ui/text-overlay.js`)
- Creates HTML-based sculpture titles and subtitles
- Positioned on the left side of the screen
- Fades based on transition state
- Uses Google Fonts: Cormorant Garamond + Inter

#### Fluid Navigation (`src/ui/fluid-navigation.js`)
- Canvas 2D overlay with spring-physics simulation
- Vertical line with nodes for each sculpture
- Active indicator blob follows scroll position
- Particles spawn on node proximity
- Adaptive title display

#### Debug Panels (dev only)
- **Particle Panel** (`debug-panel.js`) - Tune particle radius, scale, count, lifetime
- **Splat Panel** (`splat-debug-panel.js`) - Tune camera sway, splat positions
- **Post-Effects Panel** - Tune bloom, vignette, color grading

---

## The Transition System

### Overview

The transition between sculptures uses a **single-uniform system**:

```
uTransition: 0 ═══════► 0.5 ═══════► 1
             normal     peak        invisible
                      explosion
```

### How It Works

1. **Outgoing splat** (current): `transitionValue` goes from 0 → 1 as you scroll
2. **Incoming splat** (next): `transitionValue` goes from 1 → 0 as you scroll
3. **At 0.5**: Both splats are at peak explosion, crossfading opacity

### Key Function: `updateSplatTransitions()`

```javascript
export function updateSplatTransitions(currentIndex, transitionT, dt) {
    state.splatEntities.forEach((entity, index) => {
        let targetTransition;

        if (index < currentIndex) {
            targetTransition = 1.0;  // Already passed
        } else if (index === currentIndex) {
            targetTransition = transitionT;  // Current: 0→1
        } else if (index === currentIndex + 1) {
            targetTransition = 1.0 - transitionT;  // Next: 1→0
        } else {
            targetTransition = 1.0;  // Future: invisible
        }

        // Smooth interpolation
        entity.transitionValue += (targetTransition - entity.transitionValue) * Math.min(1, dt * 8.0);
        
        // Update shader BEFORE visibility check
        material.setParameter('uTransition', entity.transitionValue);
        
        // Only visible when transition < 0.85
        entity.enabled = entity.transitionValue < 0.85;
    });
}
```

### Magnetic Snap Behavior

The scroll has a "sticky" feel - sculptures want to stay in their normal state:

- **< 40% scrolled**: Snaps back to current
- **> 60% scrolled**: Commits to next
- **IDLE_TIMEOUT**: 150ms before snap kicks in

---

## The Shader System

### GLSL Shader Injection

PlayCanvas gaussian splats support custom vertex shader chunks via `gsplatModifyVS`:

```javascript
material.getShaderChunks('glsl').set('gsplatModifyVS', PLASMA_SHADER_GLSL);
```

### Shader Uniforms

| Uniform | Type | Description |
|---------|------|-------------|
| `uTime` | float | Elapsed time for animation |
| `uTransition` | float | 0=normal, 0.5=peak explosion, 1=invisible |

### Shader Functions

#### 1. `modifySplatCenter(inout vec3 center)`
Displaces gaussian splat positions for explosion effect:
```glsl
float explosionAmount = 1.0 - abs(uTransition * 2.0 - 1.0);  // Peaks at 0.5
center += direction * explosionForce * noise;
center.y += explosionAmount * noiseVal * 0.6;  // Upward drift
// Spiral motion
center.x += sin(angle) * dist * explosionAmount * 0.4;
center.z += cos(angle) * dist * explosionAmount * 0.4;
```

#### 2. `modifySplatRotationScale(...)`
Shrinks splats during explosion:
```glsl
float shrink = 1.0 - explosionAmount * explosionAmount * 0.6;
scale *= shrink;
```

#### 3. `modifySplatColor(vec3 center, inout vec4 color)`
Adds plasma glow and controls opacity:
```glsl
// Hot plasma colors
color.rgb = mix(color.rgb, hotColor, heatBlend * 0.7);
color.rgb = mix(color.rgb, whiteHot, smoothstep(0.5, 1.0, explosionAmount) * 0.4);

// Opacity fade
float opacity = 1.0 - smoothstep(0.2, 0.6, uTransition);
if (uTransition > 0.8) opacity = 0.0;  // Hard cutoff
color.a *= opacity;
```

---

## Post-Processing System

HDR post-processing via PlayCanvas `CameraFrame`:

### Configuration

```javascript
const POST_EFFECTS = {
    bloom: {
        enabled: true,
        intensity: 0.06,
        lastMipLevel: 1
    },
    vignette: {
        enabled: true,
        inner: 0.4,
        outer: 1.1,
        curvature: 0.6,
        intensity: 15
    },
    grading: {
        enabled: true,
        brightness: 1.0,
        contrast: 1.05,
        saturation: 1.1
    }
};
```

### Dynamic Transition Effects

During plasma explosions, effects intensify:
- Bloom intensity increases
- Vignette tightens
- Creates dramatic focus on the transition

---

## Fluid Navigation System

A minimal elegant navigation line with **spring-physics dynamics**.

### Features

- **Spring-mass simulation**: Control points flex and flow
- **Node indicators**: Dots for each sculpture position
- **Active indicator**: Fluid blob follows scroll position
- **Particle effects**: Spawn on node proximity
- **Adaptive titles**: Show current sculpture name

### Configuration

```javascript
const NAV_CONFIG = {
    SPRING_STIFFNESS: 0.015,
    DAMPING: 0.85,
    LINE_X: 50,
    LINE_TOP_Y: 100,
    LINE_BOTTOM_Y_OFFSET: 100,
    NODE_RADIUS: 4,
    BASE_LINE_WIDTH: 1,
    ACTIVE_LINE_WIDTH: 2,
    TITLE_OFFSET: 25
};
```

### Physics Update Loop

Each frame:
1. Calculate target positions based on scroll progress
2. Apply spring forces to control points
3. Apply damping for smooth settling
4. Render curved line through control points
5. Render active indicator and particles

---

## Particle System

Ambient floating dust particles for atmosphere:

```javascript
particles.addComponent('particlesystem', {
    numParticles: 250,
    lifetime: 30,
    emitterShape: 1,  // Sphere
    emitterRadius: 8.0,
    blend: BLEND_NORMAL,
    colorMap: texture,  // Procedurally generated
    // ...
});
```

### Procedural Texture

Particles need a soft gradient texture, created programmatically:

```javascript
const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
```

### Mouse Interaction

Particles gently rotate based on mouse position for a parallax effect.

---

## Adding a New Sculpture

1. **Add the .sog file** to the project root
2. **Update `src/config.js`**:

```javascript
{
    name: 'NewSculpture',
    file: 'gs_new_sculpture.sog',
    position: [0, 0, 0],
    rotation: [0, 0, 180],  // Usually flipped
    scale: 1.0,             // Adjust as needed
    title: 'NEW SCULPTURE',
    subtitle: 'Description here',
    number: '04'
}
```

That's it! The system automatically handles:
- Asset loading
- Entity creation
- Shader application
- Text overlay creation
- Fluid navigation node
- Transition logic (works with any number of splats)

---

## Camera System

The camera maintains a front-facing position with gentle movement:

```javascript
// Gentle sway oscillation
const autoSway = Math.sin(state.time * swaySpeed) * swayAmplitude;

// Dynamic distance - pull back during transitions
const dynamicDistance = baseDistance + transitionIntensity * 0.4;

// Position - mostly in front with X sway
const x = Math.sin(totalSway) * dynamicDistance * 0.3;
const z = Math.cos(totalSway) * dynamicDistance;

// Subtle vertical breathing
const breathe = Math.sin(state.time * 0.4) * 0.03;

camera.setPosition(x, y, z);
camera.lookAt(0, 0.25, 0);
```

---

## Debug Mode

In development (`npm run dev`), debug panels are available:

| Panel | Toggle Key | Purpose |
|-------|------------|---------|
| Particle Panel | `P` | Tune emitter radius, scale, count, lifetime |
| Post-Effects Panel | `E` | Tune bloom, vignette, color grading |
| Splat Panel | `S` | Tune camera sway, splat positions |

All panels feature:
- Real-time sliders
- Live value display
- "Log Current Values" button for copying to config

---

## Common Modifications

### Change transition speed
```javascript
// In splats.js updateSplatTransitions()
const speed = 8.0;  // Higher = snappier transitions
```

### Change explosion intensity
```glsl
// In plasma.glsl.js
float explosionForce = explosionAmount * explosionAmount * 2.5;  // Higher = more spread
```

### Change snap threshold
```javascript
// In config.js
export const SCROLL = {
    SNAP_THRESHOLD: 0.4,  // Higher = harder to commit to next
    IDLE_TIMEOUT: 150     // ms before snap kicks in
};
```

### Adjust particle density
```javascript
// In particles.js
numParticles: 250,    // More particles
lifetime: 30,         // Longer lifetime
emitterRadius: 8.0,   // Larger spawn area
```

### Adjust post-effects
```javascript
// In post-effects.js POST_EFFECTS object
bloom: { intensity: 0.06 },  // Higher = more glow
vignette: { inner: 0.4, outer: 1.1 },  // Tighter = more focus
```

---

## Known Quirks

1. **Shader uniforms must be set BEFORE enabling entities** to prevent flash
2. **Particles require a colorMap texture** or they won't render
3. **PlayCanvas ES modules** - use named imports, not `pc.*` prefix
4. **Gaussian splat .sog files** must be in project root (or update paths)
5. **CameraFrame requires camera component** to be present before setup

---

## Performance Considerations

- Gaussian splats are GPU-intensive
- Particle count affects performance on mobile
- Post-effects add GPU overhead
- Consider reducing for mobile:
  - `numParticles` and `emitterRadius`
  - Bloom `intensity` and `lastMipLevel`
  - Disable vignette if needed
- The plasma shader uses noise functions - could be simplified if needed

---

## External Resources

- [PlayCanvas Gaussian Splatting Docs](https://developer.playcanvas.com/user-manual/gaussian-splatting/)
- [Custom Shaders Reference](https://developer.playcanvas.com/user-manual/gaussian-splatting/building/custom-shaders/)
- [CameraFrame API](https://api.playcanvas.com/engine/classes/CameraFrame.html)
- [PlayCanvas Engine API](https://api.playcanvas.com/)
- [PlayCanvas UI](https://developer.playcanvas.com/user-manual/user-interface/)