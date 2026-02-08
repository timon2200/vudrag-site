/**
 * Category Hub - Interactive 3D Card Component
 * 
 * Creates category selection cards with real-time mouse-tracked 3D tilt effect.
 * Cards feature images and titles for each artwork category.
 */

import { observeElement } from './scroll-reveal.js';
import { isInContentMode } from '../systems/scroll.js';
import { state } from '../state.js';

// CMS API URL
const CMS_API = import.meta.env.VITE_API_BASE || '/api';

// Fallback category data (used if CMS unavailable)
const FALLBACK_CATEGORIES = [
    {
        id: 'networking',
        title: 'Networking',
        subtitle: 'THE NET-WORK TECHNIQUE',
        description: 'Semi-transparent lattices where light and shadow become the true medium',
        count: 16,
        image: '/images/collections/networking.jpg'
    },
    {
        id: 'portraits',
        title: 'Portraits',
        subtitle: 'BRONZE BUSTS',
        description: 'The private pulse behind the public face, forged in bronze',
        count: 7,
        image: '/images/collections/portraits.jpg'
    },
    {
        id: 'coins',
        title: 'Coins',
        subtitle: 'MEDALS & NUMISMATICS',
        description: 'Microrealism engraved in negative form — miniature universes of precision',
        count: 12,
        image: '/images/collections/coins.jpg'
    },
    {
        id: 'polygonal',
        title: 'Polygonal',
        subtitle: 'GEOMETRIC FORMS',
        description: 'Mathematical precision meets mythological weight in polygon-plate sculpture',
        count: 6,
        image: '/images/collections/polygonal.jpg'
    },
    {
        id: 'public-works',
        title: 'Public Works',
        subtitle: 'MONUMENTAL & INTERVENTIONS',
        description: 'Large-scale commissions transforming the dialogue between art and community',
        count: 19,
        image: '/images/collections/public-works.jpg'
    }
];

// Current categories (populated from CMS or fallback)
let CATEGORIES = [...FALLBACK_CATEGORIES];

// 3D Tilt configuration
const TILT_CONFIG = {
    maxRotation: 6,       // Maximum rotation in degrees (subtle)
    perspective: 1000,    // Perspective depth in px
    scale: 1.02,          // Scale on hover
    transitionSpeed: 0.5, // Transition duration in seconds
    trackingSpeed: 0.15   // Smooth tracking transition speed
};

// Track active card for cleanup
let activeCard = null;

// Cached hub element reference (set after setup)
let hubElement = null;

/**
 * Fetch categories from CMS (uses Collections/Galleries data)
 */
async function fetchCategoriesFromCMS() {
    try {
        // Create a timeout signal (2 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(`${CMS_API}/collections`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('CMS unavailable');
        const collections = await response.json();
        if (collections && collections.length > 0) {
            // Map collections to category card format
            return collections.map(collection => ({
                id: collection.id,
                title: collection.title,
                subtitle: collection.subtitle || '',
                description: collection.description || '',
                image: collection.image || '',
                count: collection.works?.length || 0
            }));
        }
        return FALLBACK_CATEGORIES;
    } catch (err) {
        console.warn('⚠️ CMS unavailable or timed out, using fallback categories');
        return FALLBACK_CATEGORIES;
    }
}

/**
 * Initialize the category hub section
 */
export async function setupCategoryHub() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) {
        console.warn('⚠️ Content area not found for category hub');
        return null;
    }

    // Fetch categories from CMS
    CATEGORIES = await fetchCategoriesFromCMS();

    const hub = createCategoryHubDOM();
    contentArea.appendChild(hub);

    // Setup 3D tilt effects on all cards
    const cards = hub.querySelectorAll('.category-card');
    cards.forEach((card, index) => {
        setupCardTilt(card);

        // Add reveal attributes with stagger
        card.setAttribute('data-reveal', 'true');
        card.setAttribute('data-reveal-delay', String(index + 1));

        // Register with scroll reveal observer
        observeElement(card);
    });

    // Cache reference for per-frame visibility updates
    hubElement = hub;

    console.log('✨ Category hub initialized with 3D cards');
    return hub;
}

/**
 * Create the category hub DOM structure
 */
function createCategoryHubDOM() {
    const hub = document.createElement('div');
    hub.className = 'category-hub';
    hub.id = 'category-hub';

    hub.innerHTML = `
        <div class="category-hub__watermark" aria-hidden="true">COLLECTION</div>
        <header class="category-hub__header" data-reveal>
            <span class="category-hub__subtitle">Curated Series</span>
            <h2 class="category-hub__title">The Collection</h2>
            <div class="category-hub__divider"></div>
        </header>
        <div class="category-hub__grid reveal-stagger">
            ${CATEGORIES.map(cat => createCardHTML(cat)).join('')}
        </div>
    `;

    // Add click handlers for navigation
    const cards = hub.querySelectorAll('.category-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const categoryId = card.dataset.category;
            handleCategoryClick(categoryId);
        });
    });

    return hub;
}

/**
 * Create HTML for a single category card
 */
function createCardHTML(category) {
    return `
        <article class="category-card" data-category="${category.id}">
            <img 
                class="category-card__image" 
                src="${category.image}" 
                alt="${category.title}"
                loading="lazy"
            />
            <div class="category-card__overlay"></div>
            <div class="category-card__content">
                <span class="category-card__label">${category.subtitle}</span>
                <h3 class="category-card__title">${category.title}</h3>
                <span class="category-card__count">${category.count} works</span>
            </div>
        </article>
    `;
}

/**
 * Setup 3D tilt effect on a card element
 */
function setupCardTilt(card) {
    // Mouse move handler - calculate and apply 3D rotation
    const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();

        // Calculate mouse position relative to card center (-0.5 to 0.5)
        const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
        const yPercent = (e.clientY - rect.top) / rect.height - 0.5;

        // Calculate rotation values (inverted for natural feel)
        const rotateX = -yPercent * TILT_CONFIG.maxRotation;
        const rotateY = xPercent * TILT_CONFIG.maxRotation;

        // Apply 3D transform
        card.style.transform = `
            perspective(${TILT_CONFIG.perspective}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(${TILT_CONFIG.scale}, ${TILT_CONFIG.scale}, ${TILT_CONFIG.scale})
        `;

        // Update shine/highlight position
        updateCardShine(card, xPercent, yPercent);
    };

    // Mouse enter - enable smooth tracking
    const handleMouseEnter = () => {
        activeCard = card;
        // Use subtle transition for smooth tracking instead of instant snapping
        card.style.transition = `transform ${TILT_CONFIG.trackingSpeed}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    };

    // Mouse leave - reset to flat
    const handleMouseLeave = () => {
        activeCard = null;
        card.style.transition = `transform ${TILT_CONFIG.transitionSpeed}s ease-out`;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';

        // Reset shine
        const shine = card.querySelector('.category-card__shine');
        if (shine) {
            shine.style.opacity = '0';
        }
    };

    // Touch start - set active
    const handleTouchStart = (e) => {
        activeCard = card;
        card.style.transition = `transform ${TILT_CONFIG.trackingSpeed}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    };

    // Touch move - emulate mouse move
    const handleTouchMove = (e) => {
        if (activeCard !== card) return;

        // Prevent scroll while interacting with card
        // e.preventDefault(); // Optional: decide if we want to block scroll

        const touch = e.touches[0];
        const rect = card.getBoundingClientRect();

        // Calculate touch position relative to card center (-0.5 to 0.5)
        const xPercent = (touch.clientX - rect.left) / rect.width - 0.5;
        const yPercent = (touch.clientY - rect.top) / rect.height - 0.5;

        // Clamp values to avoid extreme flips if touch goes out of bounds
        const xClamped = Math.max(-0.5, Math.min(0.5, xPercent));
        const yClamped = Math.max(-0.5, Math.min(0.5, yPercent));

        // Calculate rotation values
        const rotateX = -yClamped * TILT_CONFIG.maxRotation;
        const rotateY = xClamped * TILT_CONFIG.maxRotation;

        // Apply 3D transform
        card.style.transform = `
            perspective(${TILT_CONFIG.perspective}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(${TILT_CONFIG.scale}, ${TILT_CONFIG.scale}, ${TILT_CONFIG.scale})
        `;

        // Update shine/highlight position
        updateCardShine(card, xClamped, yClamped);
    };

    // Touch end/cancel - reset
    const handleTouchEnd = () => {
        activeCard = null;
        card.style.transition = `transform ${TILT_CONFIG.transitionSpeed}s ease-out`;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';

        // Reset shine
        const shine = card.querySelector('.category-card__shine');
        if (shine) {
            shine.style.opacity = '0';
        }
    };

    // Attach event listeners
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    // Touch listeners
    card.addEventListener('touchstart', handleTouchStart, { passive: true });
    card.addEventListener('touchmove', handleTouchMove, { passive: true });
    card.addEventListener('touchend', handleTouchEnd);
    card.addEventListener('touchcancel', handleTouchEnd);

    // Add shine element for highlight effect
    const shine = document.createElement('div');
    shine.className = 'category-card__shine';
    shine.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 255, 255, 0.15) 0%,
            transparent 60%
        );
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease-out;
    `;
    card.appendChild(shine);
}

/**
 * Update the shine/highlight position on card
 */
function updateCardShine(card, xPercent, yPercent) {
    const shine = card.querySelector('.category-card__shine');
    if (!shine) return;

    // Convert -0.5 to 0.5 range to percentage
    const posX = (xPercent + 0.5) * 100;
    const posY = (yPercent + 0.5) * 100;

    shine.style.background = `radial-gradient(
        circle at ${posX}% ${posY}%,
        rgba(255, 255, 255, 0.2) 0%,
        transparent 50%
    )`;
    shine.style.opacity = '1';
}

/**
 * Handle category card click
 */
function handleCategoryClick(categoryId) {
    console.log(`📂 Category selected: ${categoryId}`);

    // Find the category data
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;

    // Visual feedback
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
        card.classList.remove('is-active');
        if (card.dataset.category === categoryId) {
            card.classList.add('is-active');
        }
    });

    // Save scroll position before navigating (so we can restore on return)
    const contentArea = document.getElementById('content-area');
    sessionStorage.setItem('vudrag_scroll_position', JSON.stringify({
        scrollProgress: state.scrollProgress,
        targetScrollProgress: state.targetScrollProgress,
        windowScrollY: window.scrollY,
        contentAreaScrollTop: contentArea ? contentArea.scrollTop : 0,
        wasInContentMode: contentArea ? contentArea.classList.contains('is-visible') : false
    }));

    // Navigate to category gallery
    window.location.href = `/gallery.html?category=${categoryId}`;
}

/**
 * Update category hub visibility based on scroll
 * The content-area slide is now handled by hero-transition.js
 * This just triggers card reveals when visible
 */
export function updateCategoryHubVisibility(scrollProgress) {
    const hub = hubElement;
    if (!hub) return;

    // Reveal cards when:
    // 1. scrollProgress > 1.1 (matches the COMMIT_THRESHOLD in scroll.js)
    // 2. OR if we are explicitly in content mode (handles slow scroll / snap cases)
    const shouldReveal = scrollProgress > 1.1 || isInContentMode();

    if (shouldReveal && !hub.classList.contains('is-revealed')) {
        hub.classList.add('is-revealed');

        // Trigger individual card reveals with stagger
        const cards = hub.querySelectorAll('.category-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('is-revealed');
            }, index * 100);
        });

        // Reveal header
        const header = hub.querySelector('.category-hub__header');
        if (header) {
            header.classList.add('is-revealed');
        }
    } else if (scrollProgress <= 1.0 && hub.classList.contains('is-revealed')) {
        // Reset when scrolling back to splats
        hub.classList.remove('is-revealed');
        const cards = hub.querySelectorAll('.category-card');
        cards.forEach(card => card.classList.remove('is-revealed'));

        const header = hub.querySelector('.category-hub__header');
        if (header) {
            header.classList.remove('is-revealed');
        }
    }
}

/**
 * Get category data (for external use)
 */
export function getCategories() {
    return CATEGORIES;
}
