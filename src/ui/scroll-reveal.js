/**
 * Scroll Reveal System
 * 
 * IntersectionObserver-based reveal animations for Patek-style
 * fade-and-slide entrance effects on scroll.
 */

// Configuration
const REVEAL_CONFIG = {
    ROOT_MARGIN: '-50px',      // Offset from viewport edge
    THRESHOLD: 0.1,            // 10% visible triggers reveal
    STAGGER_DELAY: 100         // ms between staggered children
};

// Observer instance
let revealObserver = null;

/**
 * Initialize the scroll reveal system
 */
export function setupScrollReveal() {
    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
        console.warn('⚠️ IntersectionObserver not supported, revealing all');
        revealAllElements();
        return;
    }

    // Use content-area as root if it exists (for custom scrolling context)
    const contentArea = document.getElementById('content-area');

    // Create observer
    revealObserver = new IntersectionObserver(handleIntersection, {
        root: contentArea || null,
        rootMargin: REVEAL_CONFIG.ROOT_MARGIN,
        threshold: REVEAL_CONFIG.THRESHOLD
    });

    // Observe all reveal elements
    observeRevealElements();

    console.log('✨ Scroll reveal system initialized');
}

/**
 * Handle intersection changes
 */
function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;

            // Add revealed class
            element.classList.add('is-revealed');

            // Handle stagger containers
            if (element.classList.contains('reveal-stagger')) {
                staggerChildren(element);
            }

            // Stop observing once revealed
            revealObserver.unobserve(element);
        }
    });
}

/**
 * Stagger reveal children of a container
 */
function staggerChildren(container) {
    const children = container.children;

    Array.from(children).forEach((child, index) => {
        setTimeout(() => {
            child.classList.add('is-revealed');
        }, index * REVEAL_CONFIG.STAGGER_DELAY);
    });
}

/**
 * Observe all elements with [data-reveal]
 */
function observeRevealElements() {
    const elements = document.querySelectorAll('[data-reveal]');
    const staggerContainers = document.querySelectorAll('.reveal-stagger');

    elements.forEach(el => {
        revealObserver.observe(el);
    });

    staggerContainers.forEach(el => {
        revealObserver.observe(el);
    });

    console.log(`📍 Observing ${elements.length} reveal elements`);
}

/**
 * Add new element to be observed (for dynamically added content)
 */
export function observeElement(element) {
    if (revealObserver && element) {
        revealObserver.observe(element);
    }
}

/**
 * Reveal all elements immediately (fallback)
 */
function revealAllElements() {
    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach(el => {
        el.classList.add('is-revealed');
    });
}

/**
 * Reset all reveals (for re-entering sections)
 */
export function resetReveals() {
    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach(el => {
        el.classList.remove('is-revealed');
    });

    // Re-observe
    if (revealObserver) {
        observeRevealElements();
    }
}

/**
 * Apply parallax effect to elements
 * Call this from rAF or scroll handler
 */
export function updateParallax(scrollY) {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + scrollY;

        // Only apply if element is near viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const yOffset = (scrollY - elementTop) * speed * 0.2;
            el.style.transform = `translateY(${yOffset}px)`;
        }
    });
}

/**
 * Cleanup observer
 */
export function destroyScrollReveal() {
    if (revealObserver) {
        revealObserver.disconnect();
        revealObserver = null;
    }
}
