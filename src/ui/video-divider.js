/**
 * Video Divider - Ambient Section Break Component
 * 
 * Creates an atmospheric video divider between sections
 * using YouTube embed with oversized cropping.
 */

import { observeElement } from './scroll-reveal.js';

// YouTube video ID for ambient background
const VIDEO_ID = 'FWGdlVFq39g';

/**
 * Create and append a video divider section
 * @param {HTMLElement} container - Parent container to append to
 * @param {Object} options - Configuration options
 */
export function createVideoDivider(container, options = {}) {
    const {
        height = '40vh',
        text = '',
        id = 'video-divider'
    } = options;

    const divider = document.createElement('section');
    divider.className = 'video-divider';
    divider.id = id;
    divider.style.setProperty('--divider-height', height);

    divider.innerHTML = `
        <!-- Video Background -->
        <div class="video-divider__bg">
            <iframe
                src="https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${VIDEO_ID}&playsinline=1&rel=0&showinfo=0&modestbranding=1&disablekb=1&fs=0"
                frameborder="0" allow="autoplay; encrypted-media" allowfullscreen
                title="Ambient video divider"></iframe>
        </div>
        
        <!-- Gradient Overlay -->
        <div class="video-divider__overlay"></div>
        
        <!-- Optional centered text -->
        ${text ? `
        <div class="video-divider__content" data-reveal>
            <p class="video-divider__text">${text}</p>
        </div>
        ` : ''}
        
        <!-- Decorative lines -->
        <div class="video-divider__lines">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    container.appendChild(divider);

    // Register reveal elements
    const revealElements = divider.querySelectorAll('[data-reveal]');
    revealElements.forEach(el => observeElement(el));

    console.log('🎬 Video divider created');
    return divider;
}
