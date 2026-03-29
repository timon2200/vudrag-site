/**
 * Press Page — "The Chronicle"
 *
 * Award-winning editorial layout for Nikola Vudrag press coverage.
 * - Dramatic hero with ghosted watermark
 * - Featured article spotlight (Forbes)
 * - Staggered 2-column grid with full-width breakouts
 * - Scroll-reveal animations with stagger
 */

// Shared CSS
import './styles/variables.css';
import './styles/menu-overlay.css';
import './styles/footer.css';
import './styles/press-page.css';

// Shared UI
import { createMenuOverlay } from './ui/menu-overlay.js';
import { setupFooter } from './ui/footer.js';

// ═══════════════════════════════════════════
// Article Data (client-provided, ordered)
// ═══════════════════════════════════════════

const ARTICLES = [
    {
        publication: 'Forbes',
        title: 'Personal Structures 2024',
        description: 'Coverage of the Personal Structures exhibition at the 60th Venice Biennale, featuring Nikola Vudrag\'s monumental steel sculptures alongside leading contemporary artists.',
        excerpt: 'The 60th Venice Biennale brings together artists from around the world to explore the boundaries of personal expression through monumental sculpture, painting, and installation.',
        url: 'https://www.forbes.com/sites/nargessbanks/2024/05/17/personal-structures-2024/',
        year: '2024',
        featured: true
    },
    {
        publication: 'Contemporary Art Issue',
        title: 'Personal Structures — Beyond Boundaries',
        description: 'Coverage of Vudrag\'s participation in Personal Structures at Palazzo Mora, Venice — where steel Atlas and Prometheus sculptures confront the viewer with mythological weight.',
        url: 'https://www.contemporaryartissue.com/nikola-vudrag-at-personal-structures-beyond-boundaries/',
        year: '2024'
    },
    {
        publication: 'ITSLIQUID',
        title: 'Featured Artist: Nikola Vudrag',
        description: 'In the timeless dance of humanity\'s narrative, Vudrag\'s inspiration arises from the depths of philosophical, esoteric, and theological wisdom.',
        url: 'https://www.itsliquid.com/featuredartist-nikolavudrag.html',
        year: '2024'
    },
    {
        publication: 'Croatia Week',
        title: 'Sculpture "Iron Maiden" Sells for €712,000',
        description: 'Croatian artist Nikola Vudrag\'s mesh sculpture sold for an incredible €712,000 at the TOP CHARITY Grand Charity Auction — more than half the auction\'s total proceeds.',
        url: 'https://www.croatiaweek.com/sculpture-iron-maiden-by-croatian-artist-nikola-vudrag-sells-for-an-incredible-e-712000/',
        year: '2023',
        breakout: true
    },
    {
        publication: 'Symbol Quorum',
        title: 'Nikola Vudrag: World-Class Sculptures',
        description: 'After the Iron Maiden sculpture was sold at a charity auction in Warsaw for a whopping €712,000, everyone wants a piece of Varaždin sculptor Nikola Vudrag\'s genius mind.',
        url: 'https://symbol-quorum.com/en/nikola-vudrag-world-class-sculptures/',
        year: '2024'
    },
    {
        publication: 'Plotkopedia',
        title: 'TOP CHARITY 2023 Grand Charity Auction',
        description: 'Historic result of the grand charity auction where Vudrag\'s Iron Maiden sculpture broke records, raising over €1.3 million for children in Ghana, Ukraine, and Poland.',
        url: 'https://plotkopedia.com/en/exclusive/rafal-brzoska-and-omenaa-mensah-break-more-records-historic-result-of-the-top-charity-2023-grand-charity-auction/',
        year: '2023'
    },
    {
        publication: 'Croatia Week',
        title: 'Nikola Vudrag Debuts in Dubai\'s Jetex Space',
        description: 'Croatian sculptor Nikola Vudrag debuts The Seven Realms at Dubai\'s prestigious Jetex FBO Terminal, bridging Croatian craftsmanship with Middle Eastern audiences.',
        url: 'https://www.croatiaweek.com/croatian-sculptor-nikola-vudrag-debuts-in-dubais-jetex-space-with-the-seven-realms/',
        year: '2023',
        breakout: true
    },
    {
        publication: 'Croatia Week',
        title: 'Nikola Vudrag at Malta Biennale',
        description: 'Croatian sculptor pays tribute to ancient myths and philanthropy at the first Malta Biennale with his luminous Corten steel Apples of the Hesperides.',
        url: 'https://www.croatiaweek.com/nikola-vudrag-at-malta-biennale/',
        year: '2024'
    },
    {
        publication: 'Contemporary Art Issue',
        title: 'The Artistic and Philanthropic Impact of Nikola Vudrag',
        description: 'An exploration of the artistic and philanthropic impact of Nikola Vudrag\'s steel sculptures, spanning exhibitions and charitable initiatives.',
        url: 'https://www.contemporaryartissue.com/the-artistic-and-philanthropic-impact-of-nikola-vudrag/',
        year: '2024'
    },
    {
        publication: 'ArtCritic',
        title: 'Forging the Myth in Steel',
        description: 'Critical analysis of Croatian sculptor Nikola Vudrag, who forges ancient myths and light in Corten steel to question our contemporary relationship with form, light, and tradition.',
        url: 'https://www.artcritic.com/en/nikola-vudrag-forging-the-myth-in-steel/',
        year: '2025',
        breakout: true
    }
];

// ═══════════════════════════════════════════
// HTML Builders
// ═══════════════════════════════════════════

// Back button omitted — press.html has a static header with menu toggle

function buildHero() {
    return `
        <section class="press-hero">
            <div class="press-hero__bg">
                <img src="/images/the press.jpeg" alt="Nikola Vudrag Press" />
                <div class="press-hero__overlay"></div>
            </div>
            <div class="press-hero__watermark" aria-hidden="true">PRESS</div>
            <div class="press-hero__content">
                <span class="press-hero__eyebrow">Selected Press & Critical Writing</span>
                <h1 class="press-hero__title">The Chronicle</h1>
                <p class="press-hero__subtitle">
                    Coverage, criticism, and conversations — from Venice to Warsaw, Dubai to Malta.
                </p>
                <div class="press-hero__divider"></div>
                <span class="press-hero__count">${ARTICLES.length} Articles</span>
            </div>
        </section>
    `;
}

function buildFeaturedArticle() {
    const article = ARTICLES.find(a => a.featured);
    if (!article) return '';

    return `
        <section class="press-featured" data-reveal>
            <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="press-featured__card" id="press-featured-card">
                <span class="press-featured__badge">Featured Article</span>
                <span class="press-featured__year">${article.year}</span>
                <span class="press-featured__publication">${article.publication}</span>
                <h2 class="press-featured__title">${article.title}</h2>
                <div class="press-featured__divider"></div>
                <blockquote class="press-featured__excerpt">
                    <p>${article.excerpt || article.description}</p>
                </blockquote>
                <span class="press-featured__cta">
                    Read on ${article.publication}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M7 17L17 7M17 7H7M17 7V17"/>
                    </svg>
                </span>
            </a>
        </section>
    `;
}

function buildEditorialGrid() {
    const gridArticles = ARTICLES.filter(a => !a.featured);
    let articleIndex = 2; // Start at 02 since Forbes is 01

    return `
        <section class="press-grid">
            <div class="press-grid__inner">
                ${gridArticles.map((article) => {
                    const num = String(articleIndex++).padStart(2, '0');
                    const breakoutClass = article.breakout ? ' press-article--breakout' : '';

                    return `
                        <a href="${article.url}" target="_blank" rel="noopener noreferrer"
                           class="press-article${breakoutClass}" data-reveal>
                            <span class="press-article__number">${num}</span>
                            <span class="press-article__publication">${article.publication}</span>
                            <h3 class="press-article__title">${article.title}</h3>
                            <p class="press-article__description">${article.description}</p>
                            <div class="press-article__footer">
                                <span class="press-article__year">${article.year}</span>
                                <span class="press-article__cta">
                                    Read Article
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <path d="M7 17L17 7M17 7H7M17 7V17"/>
                                    </svg>
                                </span>
                            </div>
                        </a>
                    `;
                }).join('')}
            </div>
        </section>
    `;
}



// ═══════════════════════════════════════════
// Scroll Reveal System
// ═══════════════════════════════════════════

function setupScrollReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    let staggerIndex = 0;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = staggerIndex * 100;
                staggerIndex++;

                setTimeout(() => {
                    el.classList.add('is-revealed');
                }, delay);

                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ═══════════════════════════════════════════
// Watermark Parallax
// ═══════════════════════════════════════════

function setupParallax() {
    const watermark = document.querySelector('.press-hero__watermark');
    if (!watermark) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                watermark.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.3}px))`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ═══════════════════════════════════════════
// Initialize
// ═══════════════════════════════════════════

async function init() {
    const root = document.getElementById('press-root');
    if (!root) return;

    // Build page
    root.innerHTML = `
        <div class="press-page">
            ${buildHero()}
            ${buildFeaturedArticle()}
            ${buildEditorialGrid()}
        </div>
    `;

    // Setup interactive systems
    requestAnimationFrame(() => {
        setupScrollReveal();
        setupParallax();
    });

    // Setup shared UI
    createMenuOverlay();
    await setupFooter();

    // Force-reveal footer
    const footer = document.getElementById('main-footer');
    if (footer) {
        footer.querySelectorAll('[data-reveal]').forEach(el => {
            el.classList.add('is-revealed');
        });
    }

    // Hide loading screen
    setTimeout(() => {
        const ls = document.getElementById('loading-screen');
        if (ls) ls.classList.add('loaded');
    }, 300);

    console.log('📰 Press page — The Chronicle — initialized');
}

window.addEventListener('error', (e) => console.error('Error:', e.error));
init().catch(console.error);
