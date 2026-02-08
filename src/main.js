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
import './styles/artist-section.css';
import './styles/works-showcase.css';
import './styles/video-showcase.css';
import './styles/footer.css';

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
import { setupArtistSection } from './ui/artist-section.js';
import { setupWorksShowcase } from './ui/works-showcase.js';
import { setupVideoShowcase } from './ui/video-showcase.js';
import { setupFooter } from './ui/footer.js';

/**
 * Initialize the experience
 */
async function init() {
    console.log('🎨 Initializing Vudrag SuperSplat Experience...');

    // Restore state early (before UI setup) so navigation knows the correct state
    restoreScrollStateEarly();

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
    await setupCategoryHub();
    await setupArtistSection();
    await setupWorksShowcase();
    await setupVideoShowcase();
    await setupFooter();
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

    // Cache DOM references once — never query inside the frame loop
    const canvasContainer = document.getElementById('canvas-container');
    let wasInContentZone = false;

    // Input handling
    window.addEventListener('mousemove', (e) => {
        // Normalize mouse coordinates to -1 to 1 range
        state.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        state.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    });

    app.on('update', (dt) => {
        state.time += dt;
        uTime.setValue(state.time);

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

        // === PERFORMANCE OPTIMIZATION ===
        // When fully in content mode (scrollProgress > 1.3), skip expensive 3D operations
        const isInContentZone = state.scrollProgress > 1.3;

        if (isInContentZone) {
            // Hide canvas AND stop PlayCanvas GPU rendering
            if (!wasInContentZone) {
                if (canvasContainer) {
                    canvasContainer.style.visibility = 'hidden';
                    canvasContainer.style.pointerEvents = 'none';
                }
                app.autoRender = false;
                wasInContentZone = true;
                console.log('⏸️ 3D rendering paused for content mode');
            }

            // Only do minimal updates needed for scroll tracking
            state.currentSplatIndex = currentIndex;

            // Lightweight UI updates
            updateStickyHeader();
            updateContentSlide(state.scrollProgress);
            updateCategoryHubVisibility(state.scrollProgress);
            updateInteractionHint(state.scrollProgress);
            return; // Skip all expensive 3D operations
        }

        // Restore canvas visibility and GPU rendering when returning to splat gallery
        if (wasInContentZone) {
            if (canvasContainer) {
                canvasContainer.style.visibility = 'visible';
                canvasContainer.style.pointerEvents = 'auto';
            }
            app.autoRender = true;
            wasInContentZone = false;
            console.log('▶️ 3D rendering resumed');
        }

        // Update sticky header
        updateStickyHeader();

        // Update systems (expensive 3D operations)
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

    // If returning from sculpture page, skip the loading animation entirely
    const isReturning = state._pendingScrollRestore != null;

    if (isReturning) {
        // Immediately hide loading screen and restore position
        loadingScreen.classList.add('loaded');
        restoreScrollPosition();
    } else {
        // Normal first load - show loading animation
        setTimeout(() => {
            loadingScreen.classList.add('loaded');
        }, 800);
    }
}

/**
 * Save scroll position before navigating to sculpture page
 */
function setupScrollPositionSave() {
    // Listen for clicks on sculpture or gallery links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href*="sculpture.html"], a[href*="gallery.html"]');
        if (link) {
            const contentArea = document.getElementById('content-area');
            sessionStorage.setItem('vudrag_scroll_position', JSON.stringify({
                scrollProgress: state.scrollProgress,
                targetScrollProgress: state.targetScrollProgress,
                windowScrollY: window.scrollY,
                contentAreaScrollTop: contentArea ? contentArea.scrollTop : 0,
                wasInContentMode: contentArea ? contentArea.classList.contains('is-visible') : false
            }));
        }
    });
}

/**
 * Early state restoration - called at the start of init() before UI setup
 * This ensures navigation and other components initialize with correct state
 */
function restoreScrollStateEarly() {
    const saved = sessionStorage.getItem('vudrag_scroll_position');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            // Only restore state values, not UI - UI restoration happens later
            state.scrollProgress = data.scrollProgress;
            state.targetScrollProgress = data.targetScrollProgress;
            // Store the data for later UI restoration
            state._pendingScrollRestore = data;
            console.log('📍 Early state restore:', { scrollProgress: data.scrollProgress });
        } catch (e) {
            console.warn('Could not parse saved scroll position:', e);
        }
    }
}

/**
 * Restore scroll position when returning from sculpture page
 * This handles UI restoration after DOM is ready
 */
function restoreScrollPosition() {
    const data = state._pendingScrollRestore;
    if (!data) return;

    try {
        const { windowScrollY, contentAreaScrollTop, wasInContentMode } = data;

        // If we were in content mode, restore that state
        const contentArea = document.getElementById('content-area');
        if (wasInContentMode && contentArea) {
            // Restore content mode state
            contentArea.classList.add('is-visible');
            contentArea.style.transform = 'translateY(0)';
            contentArea.style.opacity = '1';
            contentArea.style.visibility = 'visible';
            contentArea.style.pointerEvents = 'auto';

            // Restore content area scroll position after a short delay to let DOM settle
            setTimeout(() => {
                contentArea.scrollTop = contentAreaScrollTop || 0;
            }, 50);
        }

        // Restore window scroll (for legacy/fallback)
        if (windowScrollY > 0 && !wasInContentMode) {
            window.scrollTo(0, windowScrollY);
        }

        // Clear after restore (only restore once)
        sessionStorage.removeItem('vudrag_scroll_position');
        delete state._pendingScrollRestore;

        console.log('📍 UI scroll position restored', { wasInContentMode, contentAreaScrollTop });
    } catch (e) {
        console.warn('Could not restore scroll position:', e);
    }
}

// Start application
window.addEventListener('error', (e) => console.error('Error:', e.error));
init().then(() => {
    setupScrollPositionSave();
}).catch(console.error);

