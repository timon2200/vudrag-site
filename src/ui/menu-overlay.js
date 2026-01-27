/**
 * Menu Overlay
 * 
 * Full-screen navigation overlay that appears when clicking the hamburger menu.
 * Provides access to major site sections.
 */

import { state, SECTIONS } from '../state.js';

let overlay = null;
let isOpen = false;

/**
 * Create and inject the menu overlay
 */
export function createMenuOverlay() {
    // Check if already exists
    if (document.querySelector('.menu-overlay')) return;

    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';

    overlay.innerHTML = `
        <button class="menu-close" aria-label="Close menu">
            <span></span>
            <span></span>
        </button>
        
        <div class="menu-overlay-content">
            <a href="#" class="menu-link" data-target="hero">Gallery</a>
            <a href="#" class="menu-link" data-target="category-hub">Collections</a>
            <a href="#" class="menu-link" data-target="artist">Artist</a>
            <a href="#" class="menu-link" data-target="contact">Inquire</a>
            
            <div class="menu-info">
                Nikola Vudrag<br>
                Sculptures in Light
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Event listeners
    const closeBtn = overlay.querySelector('.menu-close');
    closeBtn.addEventListener('click', closeMenu);

    const links = overlay.querySelectorAll('.menu-link');
    links.forEach(link => {
        link.addEventListener('click', handleMenuClick);
    });

    console.log('🍔 Menu overlay created');
}

/**
 * Open the menu overlay
 */
export function openMenu() {
    if (!overlay) createMenuOverlay();

    isOpen = true;
    overlay.classList.add('visible');

    // Disable main scroll
    document.body.style.overflow = 'hidden';
}

/**
 * Close the menu overlay
 */
export function closeMenu() {
    if (!overlay) return;

    isOpen = false;
    overlay.classList.remove('visible');

    // Re-enable scroll
    document.body.style.overflow = '';
}

/**
 * Toggle menu state
 */
export function toggleMenu() {
    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

/**
 * Handle menu link clicks
 */
function handleMenuClick(e) {
    e.preventDefault();
    const target = e.target.getAttribute('data-target');

    closeMenu();

    // Navigate based on target
    // For now, we mainly have hero/gallery logic
    if (target === 'hero') {
        // Scroll to top
        state.targetScrollProgress = 0;
        state.isScrolling = true;
    } else if (target === 'category-hub') {
        // Scroll to end of hero to reveal hub
        // Assuming hub reveals after scroll progress 1.0
        state.targetScrollProgress = 1.2;
        state.isScrolling = true;
    } else if (target === 'contact') {
        // Navigate to contact page
        window.location.href = '/contact.html';
        return;
    }

    // Log for unimplemented sections
    console.log(`Navigate to: ${target}`);
}
