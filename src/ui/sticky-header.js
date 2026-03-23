/**
 * Sticky Header
 * 
 * Minimalist navigation that appears after scrolling past the hero section.
 * Uses native scroll position — no custom state dependencies.
 */

import { toggleMenu } from './menu-overlay.js';

// DOM references
let header = null;
let progressBar = null;
let backLink = null;

// State
let isVisible = false;

// Configuration
const HEADER_CONFIG = {
    LOGO_TEXT: 'VUDRAG'
};

/**
 * Create and inject the sticky header into the DOM
 */
export function createStickyHeader() {
    header = document.createElement('header');
    header.className = 'sticky-header';
    header.innerHTML = `
        <button class="menu-toggle" aria-label="Open menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
        
        <a href="#" class="logo">${HEADER_CONFIG.LOGO_TEXT}</a>
        
        <a href="#" class="back-link" id="back-to-gallery">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Gallery</span>
        </a>
        
        <div class="scroll-progress" id="scroll-progress-bar"></div>
    `;

    document.body.appendChild(header);

    // Cache element references
    progressBar = document.getElementById('scroll-progress-bar');
    backLink = document.getElementById('back-to-gallery');

    // Hide back-link on the main index page — it's only for sub-pages
    const isIndexPage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
    if (backLink && isIndexPage) {
        backLink.style.display = 'none';
    }

    // Setup event listeners
    setupHeaderEvents();

    // Setup native scroll listener for show/hide
    window.addEventListener('scroll', handleScroll, { passive: true });

    console.log('📍 Sticky header created');
}

/**
 * Setup header event listeners
 */
function setupHeaderEvents() {
    // Logo click - scroll to top
    const logo = header.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Back to gallery link
    const back = document.getElementById('back-to-gallery');
    if (back) {
        back.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Menu toggle
    const menuToggle = header.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            toggleMenu();
        });
    }
}

/**
 * Handle native scroll — show/hide header based on scroll position
 * On the index page, the sticky header never shows (static header handles it)
 */
function handleScroll() {
    if (!header) return;

    // Don't show on index page — static header is already present
    const isIndexPage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
    if (isIndexPage) return;

    const scrollY = window.scrollY;
    const threshold = window.innerHeight * 0.8;

    const shouldShow = scrollY > threshold;

    if (shouldShow && !isVisible) {
        isVisible = true;
        header.classList.add('visible');
    } else if (!shouldShow && isVisible) {
        isVisible = false;
        header.classList.remove('visible');
    }

    // Update scroll progress bar
    if (progressBar) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollY / docHeight : 0;
        progressBar.style.width = `${progress * 100}%`;
    }
}

/**
 * Destroy the sticky header
 */
export function destroyStickyHeader() {
    if (header) {
        window.removeEventListener('scroll', handleScroll);
        header.remove();
        header = null;
        progressBar = null;
    }
}
