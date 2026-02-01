/**
 * Works Showcase - Bento Grid Layout
 * 
 * An asymmetric grid showcasing artwork with varying card sizes,
 * 3D hover effects, and elegant reveal animations.
 */

import { observeElement } from './scroll-reveal.js';

// CMS API Base URL
const CMS_API = import.meta.env.VITE_API_BASE || '/api';

// Fallback works data - used when CMS is unavailable
// Order matters for bento grid layout! Cards are placed left-to-right, top-to-bottom.
const FALLBACK_WORKS = [
    {
        id: 'iron-maiden',
        title: 'Iron Maiden',
        series: 'Persona',
        year: '2023',
        size: 'large',
        image: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=800&q=80'
    },
    {
        id: 'vitreolum',
        title: 'Vitreolum',
        series: 'Net-work',
        year: '2023',
        size: 'medium',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'
    },
    {
        id: 'sumerian-moon',
        title: 'Sumerian Moon',
        series: 'Elemental',
        year: '2025',
        size: 'medium',
        image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80'
    },
    {
        id: 'relic',
        title: 'The Relic',
        series: 'Persona',
        year: '2022',
        size: 'medium',
        image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80'
    },
    {
        id: 'tomislav',
        title: 'Tomislavus Rex',
        series: 'Monuments',
        year: '2025',
        size: 'medium',
        image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80'
    },
    {
        id: 'madonna',
        title: 'Madonna & the Veil',
        series: 'Net-work',
        year: '2025',
        size: 'large',
        image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&q=80'
    },
    {
        id: 'waterdrop',
        title: 'Waterdrop',
        series: 'Elemental',
        year: '2025',
        size: 'tall',
        image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=600&q=80'
    },
    {
        id: 'tolkien',
        title: 'J.R.R. Tolkien',
        series: 'Portraits',
        year: '2024',
        size: 'wide',
        image: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=800&q=80'
    }
];

// Current works data (populated from CMS or fallback)
let WORKS = [...FALLBACK_WORKS];

// 3D Tilt configuration for cards
const TILT_CONFIG = {
    maxRotation: 8,
    perspective: 1200,
    scale: 1.02,
    transitionSpeed: 0.4
};

/**
 * Fetch grid order and sculptures from CMS
 */
async function fetchWorksFromCMS() {
    try {
        const [gridOrder, sculptures] = await Promise.all([
            fetch(`${CMS_API}/grid-order`).then(r => r.ok ? r.json() : []),
            fetch(`${CMS_API}/sculptures`).then(r => r.ok ? r.json() : {})
        ]);

        if (!gridOrder || gridOrder.length === 0) {
            console.log('📋 No CMS grid order, using fallback');
            return FALLBACK_WORKS;
        }

        // Merge grid order with sculpture details
        return gridOrder.map(item => {
            const sculpture = sculptures[item.id] || {};
            const fallbackWork = FALLBACK_WORKS.find(w => w.id === item.id) || {};

            return {
                id: item.id,
                size: item.size,
                title: sculpture.title || fallbackWork.title || item.id,
                series: sculpture.series || fallbackWork.series || 'Unknown',
                year: sculpture.year || fallbackWork.year || '',
                image: sculpture.heroImage || fallbackWork.image || 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=800&q=80'
            };
        });
    } catch (err) {
        console.warn('⚠️ CMS unavailable, using fallback works:', err.message);
        return FALLBACK_WORKS;
    }
}

/**
 * Initialize the works showcase section
 */
export async function setupWorksShowcase() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) {
        console.warn('⚠️ Content area not found for works showcase');
        return null;
    }

    // Fetch works from CMS (with fallback)
    WORKS = await fetchWorksFromCMS();
    console.log(`📋 Loaded ${WORKS.length} works for showcase`);

    const sectionElement = createWorksShowcaseDOM();
    contentArea.appendChild(sectionElement);

    // Setup 3D tilt on cards
    const cards = sectionElement.querySelectorAll('.works-card');
    cards.forEach((card, index) => {
        setupCardTilt(card);

        // Add reveal with stagger
        card.setAttribute('data-reveal', 'true');
        card.setAttribute('data-reveal-delay', String((index % 4) + 1));
        observeElement(card);
    });

    // Register header for reveal
    const header = sectionElement.querySelector('.works-showcase__header');
    if (header) observeElement(header);

    console.log('✨ Works showcase initialized with Bento grid');
    return sectionElement;
}

/**
 * Create the works showcase DOM structure
 */
function createWorksShowcaseDOM() {
    const section = document.createElement('section');
    section.className = 'works-showcase';
    section.id = 'works-showcase';

    section.innerHTML = `
        <div class="works-showcase__watermark" aria-hidden="true">WORKS</div>
        
        <header class="works-showcase__header" data-reveal>
            <span class="works-showcase__label">Selected Works</span>
            <h2 class="works-showcase__title">The Sculptures</h2>
            <div class="works-showcase__divider"></div>
        </header>

        <div class="works-showcase__grid">
            ${WORKS.map(work => createWorkCardHTML(work)).join('')}
        </div>

        <div class="works-showcase__cta" data-reveal>
            <a href="/gallery.html" class="works-showcase__link">
                <span>View Full Collection</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </a>
        </div>
    `;

    return section;
}

/**
 * Create HTML for a single work card
 */
function createWorkCardHTML(work) {
    return `
        <a href="/sculpture.html?id=${work.id}" class="works-card works-card--${work.size}" data-work="${work.id}">
            <div class="works-card__image-wrap">
                <img 
                    class="works-card__image" 
                    src="${work.image}" 
                    alt="${work.title}"
                    loading="lazy"
                />
            </div>
            <div class="works-card__overlay"></div>
            <div class="works-card__content">
                <span class="works-card__series">${work.series}</span>
                <h3 class="works-card__title">${work.title}</h3>
                <span class="works-card__year">${work.year}</span>
            </div>
            <div class="works-card__shine"></div>
        </a>
    `;
}

/**
 * Setup 3D tilt effect on a card
 */
function setupCardTilt(card) {
    const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
        const yPercent = (e.clientY - rect.top) / rect.height - 0.5;

        const rotateX = -yPercent * TILT_CONFIG.maxRotation;
        const rotateY = xPercent * TILT_CONFIG.maxRotation;

        card.style.transform = `
            perspective(${TILT_CONFIG.perspective}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(${TILT_CONFIG.scale}, ${TILT_CONFIG.scale}, ${TILT_CONFIG.scale})
        `;

        // Update shine position
        const shine = card.querySelector('.works-card__shine');
        if (shine) {
            const posX = (xPercent + 0.5) * 100;
            const posY = (yPercent + 0.5) * 100;
            shine.style.background = `radial-gradient(
                circle at ${posX}% ${posY}%,
                rgba(255, 255, 255, 0.15) 0%,
                transparent 50%
            )`;
            shine.style.opacity = '1';
        }
    };

    const handleMouseEnter = () => {
        card.style.transition = `transform 0.15s ease-out`;
    };

    const handleMouseLeave = () => {
        card.style.transition = `transform ${TILT_CONFIG.transitionSpeed}s ease-out`;
        card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';

        const shine = card.querySelector('.works-card__shine');
        if (shine) shine.style.opacity = '0';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
}

/**
 * Get works data (for external use)
 */
export function getWorksData() {
    return WORKS;
}
