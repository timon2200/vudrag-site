/**
 * Splat Hero — Full 3D Gaussian Splat Experience
 * 
 * Dedicated page restoring the complete PlayCanvas-based splat hero section
 * with fluid navigation, text overlays, plasma transitions, particles,
 * and post-processing effects.
 */
import {
    Application,
    FILLMODE_FILL_WINDOW,
    RESOLUTION_AUTO
} from 'playcanvas';

import { CONFIG, SCROLL } from './templates/splat-hero/config.js';
import { state } from './state.js';
import { setupCamera, updateCamera, getTransitionIntensity } from './templates/splat-hero/systems/camera.js';
import { setupParticles, updateParticleInteraction } from './templates/splat-hero/systems/particles.js';
import { loadAssets, setupSplats, applyCustomShaders, updateSplatTransitions, updateSplatInteraction } from './templates/splat-hero/systems/splats.js';
import { setupPostEffects, updatePostEffects, adjustEffectsForTransition, createPostEffectsDebugPanel } from './templates/splat-hero/systems/post-effects.js';
import { createTextOverlay, updateTextOverlay } from './templates/splat-hero/ui/text-overlay.js';
import { setupFluidNavigation, updateFluidNavigation } from './templates/splat-hero/ui/fluid-navigation.js';
import { createInteractionHint, updateInteractionHint } from './templates/splat-hero/ui/interaction-hint.js';

/**
 * Initialize the full 3D splat hero experience
 */
async function init() {
    console.log('🎨 Initializing Splat Hero Experience...');

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

    // Mouse tracking
    window.addEventListener('mousemove', (e) => {
        state.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        state.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    });

    // Load assets
    await loadAssets();

    // Setup scene systems
    setupCamera();
    setupSplats();
    setupParticles();

    // Setup UI
    createTextOverlay();
    setupFluidNavigation();
    createInteractionHint();

    // Setup scroll controls
    setupSplatScroll();

    // Start update loop
    setupUpdateLoop();

    // Apply shaders and post-effects after materials are ready
    setTimeout(() => {
        applyCustomShaders();
        setupPostEffects();
        createPostEffectsDebugPanel();
    }, 500);

    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('loaded');
    }, 800);

    console.log('✅ Splat Hero Experience initialized!');
}

/**
 * Setup scroll controls for navigating between splats
 */
function setupSplatScroll() {
    const scrollHint = document.getElementById('scroll-hint');
    const numSplats = CONFIG.splats.length;

    // Wheel events
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        state.lastScrollTime = performance.now();
        state.isScrolling = true;
        state.targetScrollProgress = Math.max(0, Math.min(1, state.targetScrollProgress + e.deltaY * 0.0008));

        if (state.targetScrollProgress > 0.05) {
            scrollHint?.classList.add('hidden');
        } else {
            scrollHint?.classList.remove('hidden');
        }
    }, { passive: false });

    // Touch events
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        state.lastScrollTime = performance.now();
        state.isScrolling = true;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        const delta = (touchStartY - e.touches[0].clientY) * 0.003;
        touchStartY = e.touches[0].clientY;
        state.targetScrollProgress = Math.max(0, Math.min(1, state.targetScrollProgress + delta));
        state.lastScrollTime = performance.now();
    }, { passive: true });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === ' ') {
            const nextIndex = Math.min(state.currentSplatIndex + 1, numSplats - 1);
            state.targetScrollProgress = nextIndex / (numSplats - 1);
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            const prevIndex = Math.max(state.currentSplatIndex - 1, 0);
            state.targetScrollProgress = prevIndex / (numSplats - 1);
            e.preventDefault();
        }
    });
}

/**
 * Magnetic snap behavior for splats
 */
function updateMagneticSnap() {
    const now = performance.now();
    const timeSinceScroll = now - state.lastScrollTime;

    if (timeSinceScroll < SCROLL.IDLE_TIMEOUT) {
        state.isScrolling = true;
        return;
    }

    state.isScrolling = false;
    const numSplats = CONFIG.splats.length;

    // Snap to nearest splat
    const splatProgress = state.targetScrollProgress * (numSplats - 1);
    const currentIndex = Math.floor(splatProgress);
    const fractionalPart = splatProgress - currentIndex;

    let snapToIndex;
    if (fractionalPart < SCROLL.SNAP_THRESHOLD) {
        snapToIndex = currentIndex;
    } else if (fractionalPart > (1 - SCROLL.SNAP_THRESHOLD)) {
        snapToIndex = Math.min(currentIndex + 1, numSplats - 1);
    } else {
        snapToIndex = fractionalPart < 0.5 ? currentIndex : Math.min(currentIndex + 1, numSplats - 1);
    }

    const snapProgress = snapToIndex / (numSplats - 1);
    state.targetScrollProgress += (snapProgress - state.targetScrollProgress) * 0.05;
}

/**
 * Main update loop — drives all systems
 */
function setupUpdateLoop() {
    const app = state.app;
    const device = app.graphicsDevice;
    const uTime = device.scope.resolve('uTime');

    app.on('update', (dt) => {
        state.time += dt;
        uTime.setValue(state.time);

        // Magnetic snap
        updateMagneticSnap();

        // Smooth scroll interpolation
        const lerpSpeed = state.isScrolling ? 12.0 : 6.0;
        state.scrollProgress += (state.targetScrollProgress - state.scrollProgress) * Math.min(1, dt * lerpSpeed);

        // Calculate current position
        const numSplats = CONFIG.splats.length;
        const clampedProgress = Math.min(1, state.scrollProgress);
        const splatProgress = clampedProgress * (numSplats - 1);
        const currentIndex = Math.floor(Math.min(splatProgress, numSplats - 1.001));
        const transitionT = splatProgress - currentIndex;

        // Update 3D systems
        updateSplatTransitions(currentIndex, transitionT, dt);
        updateSplatInteraction(dt);
        updateParticleInteraction(dt);
        updateCamera(dt);

        // Post-effects
        const transitionIntensity = getTransitionIntensity();
        adjustEffectsForTransition(transitionIntensity);
        updatePostEffects();

        // Update UI
        updateTextOverlay(currentIndex, transitionT);
        updateFluidNavigation(dt);
        updateInteractionHint(state.scrollProgress);

        // Track current index
        state.currentSplatIndex = currentIndex;
    });
}

// Start
window.addEventListener('error', (e) => console.error('Error:', e.error));
init().catch(console.error);
