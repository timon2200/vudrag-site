/**
 * Vudrag Gallery — Dark Moody Artist Web Experience
 * 
 * Main entry point - orchestrates all modules
 * Native scrolling with luxury multi-slide hero carousel
 */

// CSS Imports (Vite handles these)
import './styles/variables.css';
import './styles/hero-pinned.css';
import './styles/hero-slider.css';
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

// Hero system
import { setupHeroSlider, updateHeroSlider } from './ui/hero-slider.js';

// UI components
import { createStickyHeader, updateStickyHeader } from './ui/sticky-header.js';
import { setupScrollReveal } from './ui/scroll-reveal.js';
import { setupCategoryHub } from './ui/category-hub.js';
import { createMenuOverlay } from './ui/menu-overlay.js';
import { setupArtistSection } from './ui/artist-section.js';
import { setupWorksShowcase } from './ui/works-showcase.js';
import { setupVideoShowcase } from './ui/video-showcase.js';
import { setupFooter } from './ui/footer.js';

import { state } from './state.js';

/**
 * Initialize the experience
 */
async function init() {
    console.log('🎨 Initializing Vudrag Gallery Experience...');

    // Setup hero image slider
    setupHeroSlider();

    // UI enhancements
    createStickyHeader();
    setupScrollReveal();
    await setupCategoryHub();
    await setupArtistSection();
    await setupWorksShowcase();
    await setupVideoShowcase();
    await setupFooter();
    createMenuOverlay();

    // Start lightweight update loop
    setupUpdateLoop();

    // Hide loading screen
    hideLoadingScreen();

    console.log('✅ Experience initialized successfully!');
}

/**
 * Lightweight update loop — scroll-driven hero animations
 */
function setupUpdateLoop() {
    let lastTime = performance.now();

    function update(timestamp) {
        const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
        lastTime = timestamp;
        state.time += dt;

        // Get native scroll position
        const scrollY = window.scrollY;

        // Update hero slider (parallax, fade, storm)
        updateHeroSlider(scrollY, dt);

        // Update sticky header
        updateStickyHeader();

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

/**
 * Hide loading screen with fade
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('loaded');
    }, 600);
}

// Start application
window.addEventListener('error', (e) => console.error('Error:', e.error));
init().catch(console.error);
