/**
 * Scroll & Input Control System
 * Handles mouse wheel, touch, and keyboard navigation with magnetic snap behavior
 * 
 * Two modes:
 * 1. Splat Gallery Mode: Custom scroll with magnetic snapping (scrollProgress 0-1)
 * 2. Content Mode: Native scrolling inside content-area overlay
 */
import { CONFIG, SCROLL } from '../config.js';
import { state } from '../state.js';

// Reference to content area for event routing
let contentArea = null;

/**
 * Setup all scroll and input event handlers
 */
export function setupScrollControl() {
    const scrollHint = document.getElementById('scroll-hint');
    contentArea = document.getElementById('content-area');

    // Mouse wheel - routes to either custom scroll or content area
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Touch support
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        state.lastScrollTime = performance.now();
        state.isScrolling = true;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        // Skip if content area is visible - let it handle touch
        if (contentArea?.classList.contains('is-visible')) return;

        const touchY = e.touches[0].clientY;
        const delta = (touchStartY - touchY) * 0.003;
        touchStartY = touchY;
        state.targetScrollProgress = Math.max(0, Math.min(2.0, state.targetScrollProgress + delta));
        state.lastScrollTime = performance.now();
    }, { passive: true });

    window.addEventListener('touchend', () => {
        state.lastScrollTime = performance.now();
    }, { passive: true });

    // Keyboard navigation (only in splat mode)
    window.addEventListener('keydown', (e) => {
        // Skip if content area is visible
        if (contentArea?.classList.contains('is-visible')) return;

        const numSplats = CONFIG.splats.length;
        if (e.key === 'ArrowDown' || e.key === ' ') {
            const nextIndex = Math.min(state.currentSplatIndex + 1, numSplats - 1);
            state.targetScrollProgress = nextIndex / (numSplats - 1);
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            const prevIndex = Math.max(state.currentSplatIndex - 1, 0);
            state.targetScrollProgress = prevIndex / (numSplats - 1);
            e.preventDefault();
        }
    });

    // Listen for scroll within content area to detect scroll-to-top
    if (contentArea) {
        contentArea.addEventListener('scroll', handleContentScroll);
    }
}

/**
 * Handle wheel events - routes between splat scroll and content scroll
 */
// Accumulator for pull-to-dismiss behavior
let exitScrollAccumulator = 0;
const EXIT_SCROLL_THRESHOLD = 50; // Pixels of upward scroll needed to exit

/**
 * Handle wheel events - routes between splat scroll and content scroll
 */
function handleWheel(e) {
    const scrollHint = document.getElementById('scroll-hint');
    const isContentVisible = contentArea?.classList.contains('is-visible');

    if (isContentVisible) {
        // Content area is visible - check if we should return to gallery

        // Only track accumulation if we are at the very top (or negative due to bounce)
        if (contentArea.scrollTop <= 0 && e.deltaY < 0) {
            // Accumulate upward scroll (deltaY is negative when scrolling up)
            exitScrollAccumulator += Math.abs(e.deltaY);

            // If threshold crossed, trigger exit
            if (exitScrollAccumulator > EXIT_SCROLL_THRESHOLD) {
                e.preventDefault();
                exitContentMode();
                exitScrollAccumulator = 0; // Reset
                return;
            }
        } else {
            // Reset accumulator if scrolling down or not at top
            exitScrollAccumulator = 0;
        }

        // If explicitly preventing default for bounce handling, do it here
        // Otherwise let the event bubble to content area naturally
        return;
    }

    // Splat gallery mode - use custom scroll
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
    // Track when user is at top for potential exit
    state.contentScrollTop = contentArea?.scrollTop || 0;

    // Reset accumulator if user scrolls down into content
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
    contentArea.scrollTop = 0; // Start at top
    exitScrollAccumulator = 0; // Reset accumulator

    console.log('📄 Entered content mode');
}

/**
 * Exit content mode - return to splat gallery with animation
 */
export function exitContentMode() {
    if (!contentArea) return;

    // Remove the is-visible class so JS can control the transform
    contentArea.classList.remove('is-visible');

    // Soft Exit: Set target to 1.15 instead of 1.25
    // This allows the elastic physics (in updateMagneticSnap) to gently "pull" 
    // the view back to 1.0 (Romislav) rather than snapping instantly.
    // Reduced from 1.25 to 1.15 to prevent "bounce" from triggering hero fade-out
    state.targetScrollProgress = 1.15;

    state.lastScrollTime = performance.now();
    state.isScrolling = true;

    console.log('🎨 Animating back to splat gallery');
}

/**
 * Check if content mode is active
 */
export function isInContentMode() {
    return contentArea?.classList.contains('is-visible') || false;
}

/**
 * Update content slide animation during transition
 * Called from main update loop when scrollProgress > 1.0
 * @param {number} scrollProgress - Current scroll progress
 */
export function updateContentSlide(scrollProgress) {
    if (!contentArea) return;

    // Only animate during transition phase (1.0 to 1.3)
    // After 1.3, content mode is fully active with no transform
    if (scrollProgress <= 1.0) {
        // Hidden below viewport
        contentArea.style.transform = 'translateY(100vh)';
        contentArea.style.opacity = '0';
        contentArea.style.visibility = 'hidden';
        contentArea.style.pointerEvents = 'none';
    } else if (scrollProgress >= 1.3) {
        // Fully visible (content mode handles this)
        if (!isInContentMode()) {
            // Will be handled by enterContentMode
        }
    } else {
        // Transition phase: slide up from 100vh to 0
        const progress = (scrollProgress - 1.0) / 0.3; // 0 to 1
        const eased = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
        const slideY = 100 * (1 - eased); // 100vh to 0
        const opacity = eased;

        contentArea.style.transform = `translateY(${slideY}vh)`;
        contentArea.style.opacity = String(opacity);
        contentArea.style.visibility = 'visible';
        contentArea.style.pointerEvents = progress > 0.5 ? 'auto' : 'none';
    }
}

/**
 * Apply magnetic snap behavior when user stops scrolling
 * Only applies in splat gallery mode
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

    const numSplats = CONFIG.splats.length;

    // Overshoot region (>1.0) - entering content area
    if (state.targetScrollProgress > 1.0) {
        // Lower threshold to 1.1 (approx 70% visible) for "auto-scroll" feel
        const COMMIT_THRESHOLD = 1.1;

        // If committed, enter content mode
        if (state.targetScrollProgress >= COMMIT_THRESHOLD) {
            enterContentMode();
            return;
        }

        // Below commit - elastic snap back
        const overshoot = state.targetScrollProgress - 1.0;
        // Reduced strength for softer return
        const snapStrength = 0.08;
        state.targetScrollProgress -= overshoot * snapStrength;
        return;
    }

    // Normal splat range (0-1): snap to nearest splat
    const splatProgress = state.targetScrollProgress * (numSplats - 1);
    const currentIndex = Math.floor(splatProgress);
    const fractionalPart = splatProgress - currentIndex;

    let snapToIndex;

    if (fractionalPart < SCROLL.SNAP_THRESHOLD) {
        snapToIndex = currentIndex;
    } else if (fractionalPart > (1 - SCROLL.SNAP_THRESHOLD)) {
        snapToIndex = Math.min(currentIndex + 1, numSplats - 1);
    } else {
        if (fractionalPart < 0.5) {
            snapToIndex = currentIndex;
        } else {
            snapToIndex = Math.min(currentIndex + 1, numSplats - 1);
        }
    }

    const snapProgress = snapToIndex / (numSplats - 1);
    // Reduced snap speed for smoother feel (was 0.08)
    state.targetScrollProgress += (snapProgress - state.targetScrollProgress) * 0.05;
}
