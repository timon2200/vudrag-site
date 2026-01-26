/**
 * Hero Transition System
 * 
 * Handles the visual transition when user scrolls past the last splat.
 * Hero slides up and fades out, preparing for content overlay.
 */

import { state } from '../state.js';

// DOM elements
let heroSection = null;
let canvasContainer = null;
let textOverlay = null;

// Transition state
let transitionProgress = 0;   // 0 = hero visible, 1 = hero faded
let targetTransitionProgress = 0;

// Configuration
const HERO_TRANSITION = {
    FADE_START: 0.0,           // Start fading immediately
    FADE_END: 0.5,             // Fully faded by 50% overshoot
    LERP_SPEED: 6.0,           // Interpolation speed
};

/**
 * Initialize the hero transition system
 */
export function setupHeroTransition() {
    heroSection = document.getElementById('hero-section');
    canvasContainer = document.getElementById('canvas-container');
    textOverlay = document.getElementById('text-overlay');

    if (!heroSection) {
        console.warn('⚠️ Hero section not found for transition');
        return;
    }

    console.log('🎬 Hero transition system initialized');
}

/**
 * Update hero fade based on scroll overshoot
 * Called from main update loop when scrollProgress > 1.0
 * @param {number} overshoot - Amount past 1.0 (0-0.5+ range)
 * @param {number} dt - Delta time
 */
export function updateHeroTransition(overshoot, dt) {
    if (!heroSection) return;

    // Map overshoot to transition progress
    targetTransitionProgress = Math.min(1, overshoot * 2.0);

    // Smooth interpolation
    transitionProgress += (targetTransitionProgress - transitionProgress) *
        Math.min(1, dt * HERO_TRANSITION.LERP_SPEED);

    // Apply fade
    applyHeroFade();

    return transitionProgress;
}

/**
 * Apply fade effect to hero elements
 */
function applyHeroFade() {
    const t = transitionProgress;

    // Calculate opacity
    let opacity = 1;
    if (t > HERO_TRANSITION.FADE_START) {
        const fadeT = (t - HERO_TRANSITION.FADE_START) /
            (HERO_TRANSITION.FADE_END - HERO_TRANSITION.FADE_START);
        opacity = 1 - Math.min(1, fadeT);
    }

    // Apply to hero
    if (heroSection) {
        heroSection.style.opacity = opacity;
        heroSection.style.pointerEvents = t > 0.2 ? 'none' : 'auto';
    }

    // Apply to text overlay
    if (textOverlay) {
        textOverlay.style.opacity = opacity;
        textOverlay.style.pointerEvents = t > 0.2 ? 'none' : 'auto';
    }

    // Subtle blur on canvas as it fades
    if (canvasContainer) {
        const blur = t * 4;
        canvasContainer.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none';
    }
}

/**
 * Reset hero to initial state
 */
export function resetHeroTransition() {
    if (transitionProgress < 0.01 && targetTransitionProgress < 0.01) return;

    transitionProgress = 0;
    targetTransitionProgress = 0;

    if (heroSection) {
        heroSection.style.opacity = '1';
        heroSection.style.pointerEvents = 'auto';
    }

    if (canvasContainer) {
        canvasContainer.style.filter = 'none';
    }

    if (textOverlay) {
        textOverlay.style.opacity = '1';
        textOverlay.style.pointerEvents = 'auto';
    }
}

/**
 * Get current transition progress
 */
export function getHeroTransitionProgress() {
    return transitionProgress;
}
