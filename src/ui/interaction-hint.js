/**
 * Interaction Hint UI
 * 
 * Displays a magnetic scroll indicator at the bottom of the screen
 * when reaching the last sculpture (Romislav).
 * Provides visual feedback for "breaking the scroll barrier".
 */

import { state } from '../state.js';

let hintContainer = null;
let lineElement = null;
let labelElement = null;

/**
 * Create the interaction hint DOM elements
 */
export function createInteractionHint() {
    // Container
    hintContainer = document.createElement('div');
    hintContainer.id = 'interaction-hint';
    hintContainer.style.cssText = `
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        pointer-events: none;
        z-index: 50;
        opacity: 0;
        transition: opacity 0.5s ease;
    `;

    // Label
    labelElement = document.createElement('span');
    labelElement.textContent = 'THE COLLECTION';
    labelElement.style.cssText = `
        font-family: 'Inter', sans-serif;
        font-size: 0.75rem;
        font-weight: 400;
        letter-spacing: 0.3em;
        color: rgba(201, 167, 122, 0.8);
        text-transform: uppercase;
        transform: translateY(0);
        transition: transform 0.1s linear;
    `;

    // Magnetic Line
    lineElement = document.createElement('div');
    lineElement.style.cssText = `
        width: 1px;
        height: 60px;
        background: linear-gradient(to bottom, rgba(201, 167, 122, 0) 0%, rgba(201, 167, 122, 0.8) 50%, rgba(201, 167, 122, 0) 100%);
        transform-origin: top;
        transition: height 0.1s ease-out, opacity 0.1s linear;
    `;

    hintContainer.appendChild(labelElement);
    hintContainer.appendChild(lineElement);
    document.body.appendChild(hintContainer);

    console.log('✨ Interaction hint initialized');
}

/**
 * Update hint based on scroll progress
 * @param {number} scrollProgress - Current scroll progress (0-2.0)
 */
export function updateInteractionHint(scrollProgress) {
    if (!hintContainer) return;

    // Only visible near the end of splat gallery (near 1.0)
    const FADE_IN_START = 0.85;
    const TRANSITION_TRIGGER = 1.15; // Point where we exit to categories

    // 1. Visibility Logic
    let opacity = 0;

    if (scrollProgress < FADE_IN_START) {
        opacity = 0;
    } else if (scrollProgress <= 1.0) {
        // Fade in as we approach Romislav
        opacity = (scrollProgress - FADE_IN_START) / (1.0 - FADE_IN_START);
    } else {
        // Fade out as we push towards transition
        // We want it visible during the "stretch", then fade quickly just before exit
        const fadeOutPoint = 1.10;
        if (scrollProgress < fadeOutPoint) {
            opacity = 1;
        } else {
            opacity = 1 - (scrollProgress - fadeOutPoint) / (TRANSITION_TRIGGER - fadeOutPoint);
        }
    }

    // Clamp opacity
    opacity = Math.max(0, Math.min(1, opacity));
    hintContainer.style.opacity = opacity;

    // 2. Magnetic Interaction Logic (Overshoot)
    if (scrollProgress > 1.0) {
        const overshoot = scrollProgress - 1.0;

        // Stretch the line
        // Base height 60px + stretch factor
        // Heavy resistance feel
        const stretchPixels = overshoot * 400;
        lineElement.style.height = `${60 + stretchPixels}px`;

        // Pull the text down slightly
        labelElement.style.transform = `translateY(${overshoot * 50}px)`;

        // Brighten the line to indicate tension
        lineElement.style.background = `linear-gradient(to bottom, 
            rgba(201, 167, 122, 0) 0%, 
            rgba(201, 167, 122, ${0.8 + overshoot * 2}) 50%, 
            rgba(201, 167, 122, 0) 100%)`;

    } else {
        // Reset state
        lineElement.style.height = '60px';
        labelElement.style.transform = 'translateY(0)';
        lineElement.style.background = `linear-gradient(to bottom, rgba(201, 167, 122, 0) 0%, rgba(201, 167, 122, 0.8) 50%, rgba(201, 167, 122, 0) 100%)`;
    }
}
