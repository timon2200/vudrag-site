/**
 * Sticky Header
 * 
 * Minimalist navigation that appears after scrolling past the hero section.
 * Patek-style: centered logo, hamburger menu, blur background.
 */

import { state, SECTIONS } from '../state.js';
import { toggleMenu } from './menu-overlay.js';

// DOM references
let header = null;
let progressBar = null;
let backLink = null;

// State
let isVisible = false;
let lastScrollY = 0;

// Configuration
const HEADER_CONFIG = {
    SHOW_THRESHOLD: 0.3,       // Show after this scroll progress in hero
    HIDE_ON_SCROLL_UP: false,  // Whether to hide when scrolling up
    LOGO_TEXT: 'VUDRAG'
};

/**
 * Create and inject the sticky header into the DOM
 */
export function createStickyHeader() {
    // Create header element
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

    // Setup event listeners
    setupHeaderEvents();

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
            scrollToTop();
        });
    }

    // Back to gallery link
    const backLink = document.getElementById('back-to-gallery');
    if (backLink) {
        backLink.addEventListener('click', (e) => {
            e.preventDefault();

            // Return to gallery - scroll to top regardless of section
            scrollToTop();
        });
    }

    // Menu toggle (placeholder for future menu)
    const menuToggle = header.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            toggleMenu();
        });
    }
}

/**
 * Smooth scroll to top
 */
function scrollToTop() {
    state.targetScrollProgress = 0;
    state.scrollProgress = 0;
}

/**
 * Update header visibility based on scroll state
 * Call this from your main update loop
 */
export function updateStickyHeader() {
    if (!header) return;

    const shouldShow = determineShouldShow();

    if (shouldShow && !isVisible) {
        showHeader();
    } else if (!shouldShow && isVisible) {
        hideHeader();
    }

    // Update scroll progress bar
    updateProgressBar();

    // Update back link visibility based on section
    updateBackLink();
}

/**
 * Determine if header should be visible
 */
function determineShouldShow() {
    // Show in category hub
    if (state.currentSection === SECTIONS.CATEGORY_HUB) {
        return true;
    }

    // Show after scrolling past threshold in splat gallery
    if (state.currentSection === SECTIONS.SPLAT_GALLERY) {
        return state.scrollProgress > HEADER_CONFIG.SHOW_THRESHOLD;
    }

    return false;
}

/**
 * Show the header
 */
function showHeader() {
    isVisible = true;
    header.classList.add('visible');
}

/**
 * Hide the header
 */
function hideHeader() {
    isVisible = false;
    header.classList.remove('visible');
}

/**
 * Update scroll progress bar
 */
function updateProgressBar() {
    if (!progressBar) return;

    let progress = 0;

    if (state.currentSection === SECTIONS.SPLAT_GALLERY) {
        progress = state.scrollProgress;
    } else if (state.currentSection === SECTIONS.CATEGORY_HUB) {
        // Could track hub scroll progress here
        progress = 1;
    }

    progressBar.style.width = `${progress * 100}%`;
}

/**
 * Update back link visibility
 */
function updateBackLink() {
    if (!backLink) return;

    // Show only when not in splat gallery
    if (state.currentSection === SECTIONS.SPLAT_GALLERY) {
        backLink.style.opacity = '0';
        backLink.style.pointerEvents = 'none';
    } else {
        backLink.style.opacity = '1';
        backLink.style.pointerEvents = 'auto';
    }
}

/**
 * Destroy the sticky header
 */
export function destroyStickyHeader() {
    if (header) {
        header.remove();
        header = null;
        progressBar = null;
    }
}
