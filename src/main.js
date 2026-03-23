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
 * Initialize the experience
 */
async function init() {
    console.log('🎨 Initializing Vudrag Gallery Experience...');

    // Setup hero scroll carousel
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

    // Hide loading screen
    hideLoadingScreen();

    console.log('✅ Experience initialized successfully!');
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
