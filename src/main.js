/**
 * Vudrag SuperSplat - Dark Moody Artist Web Experience
 * 
 * Main entry point - orchestrates all modules
 * PlayCanvas-based with custom shader plasma transitions
 * 
 * Patek-inspired: Pinned hero, scroll reveals, luxury typography
 */
import {
    Application,
    FILLMODE_FILL_WINDOW,
    RESOLUTION_AUTO
} from 'playcanvas';

// CSS Imports (Vite handles these)
import './styles/variables.css';
import './styles/hero-pinned.css';
import './styles/scroll-reveal.css';
import './styles/luxury-typography.css';
import './styles/sticky-header.css';
import './styles/category-hub.css';
import './styles/menu-overlay.css';
import './styles/gallery-overlay.css';

import { CONFIG, IS_DEV } from './config.js';

import { state, SECTIONS } from './state.js';
import { setupCamera, updateCamera, getTransitionIntensity } from './systems/camera.js';
import { setupParticles, updateParticleInteraction } from './systems/particles.js';
import { loadAssets, setupSplats, applyCustomShaders, updateSplatTransitions, updateSplatInteraction } from './systems/splats.js';
import { setupScrollControl, updateMagneticSnap, updateContentSlide } from './systems/scroll.js';
import { createTextOverlay, updateTextOverlay } from './ui/text-overlay.js';
import { setupPostEffects, updatePostEffects, adjustEffectsForTransition, createPostEffectsDebugPanel } from './systems/post-effects.js';
import { setupFluidNavigation, updateFluidNavigation } from './ui/fluid-navigation.js';

// Patek-style enhancements
import { setupHeroTransition, updateHeroTransition, resetHeroTransition } from './systems/hero-transition.js';
import { createStickyHeader, updateStickyHeader } from './ui/sticky-header.js';
import { setupScrollReveal } from './ui/scroll-reveal.js';
import { setupCategoryHub, updateCategoryHubVisibility } from './ui/category-hub.js';
import { createInteractionHint, updateInteractionHint } from './ui/interaction-hint.js';
import { createMenuOverlay } from './ui/menu-overlay.js';

/**
 * Initialize the experience
 */
async function init() {
    console.log('🎨 Initializing Vudrag SuperSplat Experience...');

    const container = document.getElementById('canvas-container');
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    state.app = new Application(canvas, {
        graphicsDeviceOptions: {
            antialias: false,
            alpha: false,
            preserveDrawingBuffer: false,
            powerPreference: 'high-performance'
        }
    });

    const app = state.app;

    app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(RESOLUTION_AUTO);
    app.start();

    window.addEventListener('resize', () => app.resizeCanvas());

    // Load assets
    await loadAssets();

    // Setup scene
    setupCamera();
    setupSplats();

    // Setup UI
    createTextOverlay();
    setupFluidNavigation();

    // Setup effects
    setupParticles();

    // Setup debug panel (development only)
    if (IS_DEV) {
        const { createParticleDebugPanel } = await import('./ui/debug-panel.js');
        createParticleDebugPanel();
    }

    // Setup controls
    setupScrollControl();

    // Patek-style enhancements
    createStickyHeader();
    setupScrollReveal();
    setupCategoryHub();
    createInteractionHint();
    createMenuOverlay();

    setupUpdateLoop();

    // Apply custom shaders and post-effects after materials are ready
    setTimeout(() => {
        applyCustomShaders();
        setupPostEffects();

        // Setup debug panels (development only)
        if (IS_DEV) {
            createPostEffectsDebugPanel();

            // Splat & camera debug panel
            import('./ui/splat-debug-panel.js').then(({ createSplatDebugPanel }) => {
                createSplatDebugPanel();
            });

            // Splat grading panel (per-splat color grading)
            import('./ui/splat-grading-panel.js').then(({ createSplatGradingPanel }) => {
                createSplatGradingPanel();
            });
        }
    }, 500);

    hideLoadingScreen();

    console.log('✅ Experience initialized successfully!');
}

/**
 * Main update loop
 */
function setupUpdateLoop() {
    const app = state.app;
    const device = app.graphicsDevice;
    const uTime = device.scope.resolve('uTime');

    // Input handling
    window.addEventListener('mousemove', (e) => {
        // Normalize mouse coordinates to -1 to 1 range
        state.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        state.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    });

    app.on('update', (dt) => {
        state.time += dt;
        uTime.setValue(state.time);

        // Update sticky header (all sections)
        updateStickyHeader();

        // === CONTINUOUS SPLAT GALLERY UPDATE ===

        // Apply magnetic snap behavior
        updateMagneticSnap();

        // Smooth interpolation - faster when scrolling, slower when snapping
        const lerpSpeed = state.isScrolling ? 12.0 : 6.0;
        state.scrollProgress += (state.targetScrollProgress - state.scrollProgress) * Math.min(1, dt * lerpSpeed);

        // Calculate current position (clamped to splat range for transitions)
        const numSplats = CONFIG.splats.length;
        const clampedProgress = Math.min(1, state.scrollProgress);
        const splatProgress = clampedProgress * (numSplats - 1);
        const currentIndex = Math.floor(Math.min(splatProgress, numSplats - 1.001));
        const transitionT = splatProgress - currentIndex;

        // Update systems
        updateSplatTransitions(currentIndex, transitionT, dt);
        updateSplatInteraction(dt);
        updateParticleInteraction(dt);
        updateTextOverlay(currentIndex, transitionT);
        updateCamera(dt);

        // Update post-effects with dynamic transition adjustment
        const transitionIntensity = getTransitionIntensity();
        adjustEffectsForTransition(transitionIntensity);
        updatePostEffects();

        // Update fluid navigation
        updateFluidNavigation(dt);

        state.currentSplatIndex = currentIndex;

        // Hero scroll-away effect (when scrollProgress > 1.0)
        if (state.scrollProgress > 1.0) {
            const overshoot = state.scrollProgress - 1.0;
            updateHeroTransition(overshoot, dt);
        } else {
            // Reset hero if we've scrolled back
            resetHeroTransition();
        }

        // Animate content slide during transition
        updateContentSlide(state.scrollProgress);

        // Update category hub visibility (triggers reveals)
        updateCategoryHubVisibility(state.scrollProgress);

        // Update interactive scroll hint
        updateInteractionHint(state.scrollProgress);
    });
}

/**
 * Hide loading screen with fade
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('loaded');
    }, 800);
}

// Start application
window.addEventListener('error', (e) => console.error('Error:', e.error));
init().catch(console.error);

