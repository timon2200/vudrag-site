/**
 * Vudrag Gallery — Dark Moody Artist Web Experience
 * 
 * Main entry point - orchestrates all modules
 * Native scrolling with scroll-snap hero carousel
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
import { setupHeroSlider } from './ui/hero-slider.js';

// UI components
import { createStickyHeader } from './ui/sticky-header.js';
import { setupScrollReveal } from './ui/scroll-reveal.js';
import { setupCategoryHub } from './ui/category-hub.js';
import { createMenuOverlay } from './ui/menu-overlay.js';
import { setupArtistSection } from './ui/artist-section.js';
import { setupWorksShowcase } from './ui/works-showcase.js';
import { setupVideoShowcase } from './ui/video-showcase.js';
import { setupFooter } from './ui/footer.js';

/**
 * Initialize the experience — two-phase progressive loading.
 * Phase 1: Hero slider (fast) → dismiss loading screen immediately.
 * Phase 2: Below-fold sections loaded in the background.
 */
async function init() {
    console.log('🎨 Initializing Vudrag Gallery Experience...');

    // ── Phase 1: Hero (blocks loading screen) ──
    await setupHeroSlider();
    hideLoadingScreen();
    console.log('✅ Hero ready — loading screen dismissed');

    // ── Phase 2: Below-fold sections (deferred, non-blocking) ──
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    idleCallback(() => {
        loadBelowFoldSections().then(() => {
            console.log('✅ All sections loaded');
        });
    }, { timeout: 1000 });
}

/**
 * Load all below-fold sections sequentially (runs in background)
 */
async function loadBelowFoldSections() {
    createStickyHeader();
    setupScrollReveal();
    await setupCategoryHub();
    await setupArtistSection();
    await setupVideoShowcase();
    await setupWorksShowcase();
    await setupFooter();
    createMenuOverlay();
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
