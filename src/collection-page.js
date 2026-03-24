/**
 * Collection Page — Dynamic Template Router
 * 
 * Reads ?id= from URL, fetches collection data from CMS,
 * and dynamically mounts the correct template based on pageType.
 */

// Shared CSS
import './styles/variables.css';
import './styles/menu-overlay.css';
import './styles/footer.css';

// Shared UI components
import { createMenuOverlay } from './ui/menu-overlay.js';
import { setupFooter } from './ui/footer.js';

// CMS API Base
const CMS_API = import.meta.env.VITE_API_BASE || '/api';

/**
 * Fetch a single collection from CMS
 */
async function fetchCollection(id) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${CMS_API}/collections/${id}`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Collection not found');
        return await response.json();
    } catch (err) {
        console.error(`Failed to fetch collection "${id}":`, err);
        return null;
    }
}

/**
 * Initialize collection page
 */
async function init() {
    const params = new URLSearchParams(window.location.search);
    const collectionId = params.get('id');

    if (!collectionId) {
        console.error('No collection ID in URL');
        window.location.href = '/';
        return;
    }

    // Fetch collection data
    const collection = await fetchCollection(collectionId);
    if (!collection) {
        console.error('Collection not found, redirecting home');
        window.location.href = '/';
        return;
    }

    // Update page title
    document.title = `${collection.title} | Nikola Vudrag`;

    // Get mount point
    const root = document.getElementById('collection-root');

    // Load template based on pageType
    const pageType = collection.pageType || 'gallery';
    
    try {
        let templateModule;
        
        switch (pageType) {
            case 'network':
                templateModule = await import('./templates/network/network-page.js');
                break;
            // Future templates:
            // case 'slider': templateModule = await import('./templates/slider/slider-page.js'); break;
            // case 'film': templateModule = await import('./templates/film/film-page.js'); break;
            default:
                // Fallback to gallery for unknown types
                window.location.href = `/gallery.html?category=${collectionId}`;
                return;
        }

        // Mount the template
        await templateModule.mount(root, collection);

    } catch (err) {
        console.error('Failed to load template:', err);
        root.innerHTML = `
            <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 1rem;">
                <p style="color: #8a8a96; letter-spacing: 0.15em; text-transform: uppercase; font-size: 0.8rem;">Collection unavailable</p>
                <a href="/" style="color: #c9a77a; text-decoration: none; letter-spacing: 0.1em;">Return Home</a>
            </div>
        `;
    }

    // Setup shared UI
    createMenuOverlay();
    await setupFooter();

    // Force-reveal footer elements (scroll-reveal observer may not trigger on this layout)
    const footer = document.getElementById('main-footer');
    if (footer) {
        footer.querySelectorAll('[data-reveal]').forEach(el => {
            el.classList.add('is-revealed');
        });
    }

    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.classList.add('loaded');
    }, 300);

    console.log(`✅ Collection page loaded: ${collection.title} (${pageType})`);
}

// Start
window.addEventListener('error', (e) => console.error('Error:', e.error));
init().catch(console.error);
