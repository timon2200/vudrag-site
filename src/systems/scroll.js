/**
 * Scroll & Input Control System
 * Handles mouse wheel, touch, and keyboard navigation
 * 
 * Two modes:
 * 1. Hero Mode: Custom scroll controls hero parallax/fade (scrollProgress 0-1)
 * 2. Content Mode: Native scrolling inside content-area overlay
 */
import { SCROLL } from '../config.js';
import { state } from '../state.js';

// Reference to content area for event routing
let contentArea = null;

// Shared scroll hint reference
let scrollHint = null;

// Fake scrollable element for triggering mobile browser address bar hide
let fakeScrollElement = null;

export function setupScrollControl() {
    scrollHint = document.getElementById('scroll-hint');
    contentArea = document.getElementById('content-area');

    // Create fake scrollable element to trigger mobile browser address bar behavior
    setupFakeScrollForMobile();

    // Mouse wheel - routes to either custom scroll or content area
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Touch support
    let touchStartY = 0;
    let touchExitAccumulator = 0;
    const TOUCH_EXIT_THRESHOLD = 80;

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        state.lastScrollTime = performance.now();
        state.isScrolling = true;
        touchExitAccumulator = 0;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const deltaY = touchY - touchStartY; // Positive = swiping down

        // Handle content mode - check for pull-to-dismiss gesture
        if (contentArea?.classList.contains('is-visible')) {
            if (contentArea.scrollTop <= 0 && deltaY > 0) {
                touchExitAccumulator += deltaY * 0.5;

                if (touchExitAccumulator > TOUCH_EXIT_THRESHOLD) {
                    exitContentMode();
                    touchExitAccumulator = 0;
                    touchStartY = touchY;
                }
            } else {
                touchExitAccumulator = 0;
            }

            touchStartY = touchY;
            return;
        }

        // Hero mode - custom scroll handling
        const delta = (touchStartY - touchY) * 0.003;
        touchStartY = touchY;
        state.targetScrollProgress = Math.max(0, Math.min(2.0, state.targetScrollProgress + delta));
        state.lastScrollTime = performance.now();

        // Hide scroll hint on touch scroll
        if (state.targetScrollProgress > 0.05) {
            scrollHint?.classList.add('hidden');
        } else {
            scrollHint?.classList.remove('hidden');
        }

        // Update fake scroll position for mobile browser address bar
        updateFakeScroll();
    }, { passive: true });

    window.addEventListener('touchend', () => {
        state.lastScrollTime = performance.now();
        touchExitAccumulator = 0;
    }, { passive: true });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (contentArea?.classList.contains('is-visible')) return;

        if (e.key === 'ArrowDown' || e.key === ' ') {
            state.targetScrollProgress = Math.min(2.0, state.targetScrollProgress + 0.3);
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            state.targetScrollProgress = Math.max(0, state.targetScrollProgress - 0.3);
            e.preventDefault();
        }
    });

    // Listen for scroll within content area to detect scroll-to-top
    if (contentArea) {
        contentArea.addEventListener('scroll', handleContentScroll);
    }
}

/**
 * Handle wheel events - routes between hero scroll and content scroll
 */
let exitScrollAccumulator = 0;
const EXIT_SCROLL_THRESHOLD = 50;

function handleWheel(e) {
    const scrollHint = document.getElementById('scroll-hint');
    const isContentVisible = contentArea?.classList.contains('is-visible');

    if (isContentVisible) {
        if (contentArea.scrollTop <= 0 && e.deltaY < 0) {
            exitScrollAccumulator += Math.abs(e.deltaY);

            if (exitScrollAccumulator > EXIT_SCROLL_THRESHOLD) {
                e.preventDefault();
                exitContentMode();
                exitScrollAccumulator = 0;
                return;
            }
        } else {
            exitScrollAccumulator = 0;
        }

        return;
    }

    // Hero mode - use custom scroll
    e.preventDefault();

    state.lastScrollTime = performance.now();
    state.isScrolling = true;

    const delta = e.deltaY;
    state.targetScrollProgress = Math.max(0, Math.min(2.0, state.targetScrollProgress + delta * 0.0008));

    if (state.targetScrollProgress > 0.05) {
        scrollHint?.classList.add('hidden');
    } else {
        scrollHint?.classList.remove('hidden');
    }
}

/**
 * Handle scroll within content area
 */
function handleContentScroll() {
    state.contentScrollTop = contentArea?.scrollTop || 0;

    if (state.contentScrollTop > 0) {
        exitScrollAccumulator = 0;
    }
}

/**
 * Enter content mode - show content overlay
 */
export function enterContentMode() {
    if (!contentArea) return;

    contentArea.classList.add('is-visible');
    contentArea.scrollTop = 0;
    exitScrollAccumulator = 0;

    contentArea.style.pointerEvents = 'auto';
    contentArea.focus();

    console.log('📄 Entered content mode');
}

/**
 * Exit content mode - return to hero with animation
 */
export function exitContentMode() {
    if (!contentArea) return;

    contentArea.classList.remove('is-visible');

    // Soft exit: animate back toward hero
    state.targetScrollProgress = 0.8;
    state.lastScrollTime = performance.now();
    state.isScrolling = true;

    console.log('🎨 Animating back to hero');
}

/**
 * Check if content mode is active
 */
export function isInContentMode() {
    return contentArea?.classList.contains('is-visible') || false;
}

/**
 * Update content slide animation during transition
 * Called from main update loop
 * @param {number} scrollProgress - Current scroll progress
 */
export function updateContentSlide(scrollProgress) {
    if (!contentArea) return;

    if (scrollProgress <= 1.0) {
        // Hidden below viewport
        contentArea.style.transform = 'translateY(100vh)';
        contentArea.style.opacity = '0';
        contentArea.style.visibility = 'hidden';
        contentArea.style.pointerEvents = 'none';
    } else if (scrollProgress >= 1.3) {
        // Fully visible — enter content mode if not already
        if (!isInContentMode()) {
            // Will be handled by enterContentMode via magnetic snap
        }
    } else {
        // Transition phase: slide up from 100vh to 0
        const progress = (scrollProgress - 1.0) / 0.3; // 0 to 1
        const eased = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
        const slideY = 100 * (1 - eased);
        const opacity = eased;

        contentArea.style.transform = `translateY(${slideY}vh)`;
        contentArea.style.opacity = String(opacity);
        contentArea.style.visibility = 'visible';
        contentArea.style.pointerEvents = progress > 0.5 ? 'auto' : 'none';
    }
}

/**
 * Apply magnetic snap behavior when user stops scrolling
 * Simplified for image hero (no splat indices)
 */
export function updateMagneticSnap() {
    // Skip if content mode is active
    if (isInContentMode()) return;

    const now = performance.now();
    const timeSinceScroll = now - state.lastScrollTime;

    // Only apply snap when user stops scrolling
    if (timeSinceScroll < SCROLL.IDLE_TIMEOUT) {
        state.isScrolling = true;
        return;
    }

    state.isScrolling = false;

    // Overshoot region (>1.0) - entering content area
    if (state.targetScrollProgress > 1.0) {
        const COMMIT_THRESHOLD = 1.1;

        // If committed, enter content mode
        if (state.targetScrollProgress >= COMMIT_THRESHOLD) {
            enterContentMode();
            return;
        }

        // Below commit - elastic snap back to 1.0
        const overshoot = state.targetScrollProgress - 1.0;
        const snapStrength = 0.08;
        state.targetScrollProgress -= overshoot * snapStrength;
        return;
    }

    // Hero range (0-1): snap to either 0 or stay put
    // No splat indices to snap to — just gentle damping toward 0 if close
    if (state.targetScrollProgress < 0.05) {
        state.targetScrollProgress += (0 - state.targetScrollProgress) * 0.05;
    }
}

/**
 * Create a fake scrollable element to trigger mobile browser address bar behavior
 */
function setupFakeScrollForMobile() {
    if (!('ontouchstart' in window)) return;

    fakeScrollElement = document.createElement('div');
    fakeScrollElement.id = 'fake-scroll-container';
    fakeScrollElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        pointer-events: none;
        z-index: -1;
        opacity: 0;
    `;

    const fakeContent = document.createElement('div');
    fakeContent.style.cssText = `
        height: 300vh;
        width: 100%;
    `;

    fakeScrollElement.appendChild(fakeContent);
    document.body.appendChild(fakeScrollElement);

    fakeScrollElement.scrollTop = window.innerHeight;

    console.log('📱 Fake scroll element created for mobile browser behavior');
}

/**
 * Update fake scroll position based on actual scroll progress
 */
function updateFakeScroll() {
    if (!fakeScrollElement) return;

    const viewportHeight = window.innerHeight;
    const targetScroll = viewportHeight + (state.targetScrollProgress * viewportHeight);

    fakeScrollElement.scrollTop = targetScroll;
}
