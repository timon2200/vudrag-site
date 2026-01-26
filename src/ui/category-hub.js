/**
 * Category Hub - Interactive 3D Card Component
 * 
 * Creates category selection cards with real-time mouse-tracked 3D tilt effect.
 * Cards feature images and titles for each artwork category.
 */

import { observeElement } from './scroll-reveal.js';
import { isInContentMode } from '../systems/scroll.js';

// Category data based on artist works
const CATEGORIES = [
    {
        id: 'persona',
        title: 'Persona',
        subtitle: 'NET-WORK SERIES',
        description: 'Steel lattice faces exploring identity and expression',
        count: 7,
        image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&q=80'
    },
    {
        id: 'sumerian',
        title: 'Sumerian',
        subtitle: 'ELEMENTAL WORKS',
        description: 'Ancient scripts reimagined in modern steel',
        count: 5,
        image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80'
    },
    {
        id: 'portraits',
        title: 'Portraits',
        subtitle: 'BRONZE & STEEL',
        description: 'Classical busts capturing the private spirit',
        count: 8,
        image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80'
    },
    {
        id: 'coins',
        title: 'Coins & Medals',
        subtitle: 'NUMISMATIC ART',
        description: 'Micro-engraved currency and collector pieces',
        count: 6,
        image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=600&q=80'
    },
    {
        id: 'monuments',
        title: 'Monuments',
        subtitle: 'PUBLIC SCULPTURE',
        description: 'Monumental works for public spaces',
        count: 4,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'
    }
];

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

/**
 * Initialize the category hub section
 */
export function setupCategoryHub() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) {
        console.warn('⚠️ Content area not found for category hub');
        return null;
    }

    const hubElement = createCategoryHubDOM();
    contentArea.appendChild(hubElement);

    // Setup 3D tilt effects on all cards
    const cards = hubElement.querySelectorAll('.category-card');
    cards.forEach((card, index) => {
        setupCardTilt(card);

        // Add reveal attributes with stagger
        card.setAttribute('data-reveal', 'true');
        card.setAttribute('data-reveal-delay', String(index + 1));

        // Register with scroll reveal observer
        observeElement(card);
    });

    console.log('✨ Category hub initialized with 3D cards');
    return hubElement;
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

    // Attach event listeners
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

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

    // TODO: Navigate to category gallery
    // This will integrate with the separate gallery app later
}

/**
 * Update category hub visibility based on scroll
 * The content-area slide is now handled by hero-transition.js
 * This just triggers card reveals when visible
 */
export function updateCategoryHubVisibility(scrollProgress) {
    const hub = document.getElementById('category-hub');
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
