/**
 * Shared Navigation Logic
 * 
 * Centralizes navigation behavior for consistent experience across
 * hamburger menu, footer, and other UI elements.
 */

import { state } from '../state.js';
import { exitContentMode, isInContentMode } from './scroll.js';

/**
 * Handle navigation to a specific target section
 * @param {string} target - specific section identifier ('hero', 'category-hub', 'artist', 'contact')
 */
export function navigateTo(target) {
    console.log(`🧭 Navigating to: ${target}`);

    if (target === 'hero') {
        // Scroll to top
        if (isInContentMode()) {
            exitContentMode();
            // Force reset after a small delay to ensure clean state
            setTimeout(() => {
                state.targetScrollProgress = 0;
            }, 50);
        } else {
            state.targetScrollProgress = 0;
            state.isScrolling = true;
        }
    } else if (target === 'category-hub') {
        // Scroll to end of hero to reveal hub
        state.targetScrollProgress = 1.2;
        state.isScrolling = true;

        // Ensure hub is visible
        setTimeout(() => {
            const hub = document.getElementById('category-hub');
            if (hub) hub.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else if (target === 'artist') {
        // Scroll to artist section
        state.targetScrollProgress = 1.4; // Ensure content mode
        state.isScrolling = true;

        setTimeout(() => {
            const artist = document.getElementById('artist-section');
            if (artist) artist.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else if (target === 'works') {
        // Alias for hero/gallery
        navigateTo('hero');
    } else if (target === 'contact') {
        // Navigate to contact page
        window.location.href = '/contact.html';
    } else {
        console.warn(`Unknown navigation target: ${target}`);
    }
}
