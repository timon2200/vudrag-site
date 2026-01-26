/**
 * Text Overlay UI Component
 * Displays artwork titles, subtitles, and numbers
 */
import { CONFIG } from '../config.js';
import { state } from '../state.js';

/**
 * Create HTML text overlay for artwork information
 */
export function createTextOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'text-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 50;
    `;
    document.body.appendChild(overlay);

    CONFIG.splats.forEach((splatConfig, index) => {
        const section = document.createElement('div');
        section.className = 'artwork-info';
        section.dataset.index = index;
        section.style.cssText = `
            position: absolute;
            left: 8vw;
            top: 50%;
            transform: translateY(-50%) translateX(-30px);
            opacity: 0;
            transition: opacity 0.4s ease, transform 0.4s ease;
        `;
        section.innerHTML = `
            <span style="
                display: block;
                font-family: 'Cormorant Garamond', Georgia, serif;
                font-size: clamp(0.875rem, 1.5vw, 1rem);
                font-weight: 300;
                color: #c9a77a;
                letter-spacing: 0.3em;
                margin-bottom: 1rem;
                text-transform: uppercase;
            ">${splatConfig.number}</span>
            <h2 style="
                font-family: 'Cormorant Garamond', Georgia, serif;
                font-size: clamp(3rem, 8vw, 6rem);
                font-weight: 300;
                color: #f0ebe3;
                letter-spacing: 0.02em;
                line-height: 1.1;
                margin: 0 0 0.5rem 0;
                text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
            ">${splatConfig.title}</h2>
            <p style="
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: clamp(0.875rem, 1.5vw, 1.125rem);
                font-weight: 300;
                color: #6b6b7a;
                letter-spacing: 0.1em;
                margin: 0;
            ">${splatConfig.subtitle}</p>
        `;
        overlay.appendChild(section);
    });

    // Load fonts
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Inter:wght@300&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Show first section after a delay
    setTimeout(() => {
        const firstSection = overlay.querySelector('[data-index="0"]');
        if (firstSection) {
            firstSection.style.opacity = '1';
            firstSection.style.transform = 'translateY(-50%) translateX(0)';
        }
    }, 1000);

    state.textOverlay = overlay;
}

/**
 * Update text overlay visibility based on scroll position
 */
export function updateTextOverlay(currentIndex, transitionT) {
    if (!state.textOverlay) return;

    const sections = state.textOverlay.querySelectorAll('.artwork-info');

    sections.forEach((section, index) => {
        let opacity = 0;
        let xOffset = -30;

        if (index === currentIndex) {
            if (transitionT < 0.4) {
                opacity = 1;
                xOffset = 0;
            } else {
                opacity = 1 - (transitionT - 0.4) / 0.6;
                xOffset = -(transitionT - 0.4) * 50;
            }
        } else if (index === currentIndex + 1) {
            if (transitionT > 0.5) {
                opacity = (transitionT - 0.5) / 0.5;
                xOffset = (1 - opacity) * -30;
            }
        }

        section.style.opacity = Math.max(0, Math.min(1, opacity));
        section.style.transform = `translateY(-50%) translateX(${xOffset}px)`;
    });
}
