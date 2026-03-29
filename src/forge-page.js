/**
 * THE FORGE — Page Module
 * Where Steel Becomes Spirit
 * 
 * Sections:
 *  1. Hero — Full-bleed cinematic YouTube background
 *  2. Flipbook — Artist biography as interactive page-turn
 *  3. Rezervart — Creative institution showcase
 *  4. Studio — Artist portrait and team
 *  5. CTA — Let's Connect bridge to contact
 */

import './styles/forge-page.css';
import { PageFlip } from 'page-flip';

// ═══════════════════════════════════════════
// Boot
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('forge-container');
    if (!container) return;

    // Build page content
    container.innerHTML = buildHTML();

    // Initialize interactive systems
    requestAnimationFrame(() => {
        setupScrollReveal(container);
        setupFlipbook(container);
        setupYouTubeHero();
    });

    // Dismiss loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => loadingScreen.classList.add('loaded'), 600);
    }

    // Load shared components (menu, footer)
    try {
        const [menuModule, footerModule] = await Promise.all([
            import('./ui/menu-overlay.js'),
            import('./ui/footer.js')
        ]);
        menuModule.initMenuOverlay();
        footerModule.initFooter();
    } catch (e) {
        console.warn('Shared components failed to load:', e);
    }
});


// ═══════════════════════════════════════════
// HTML Builders
// ═══════════════════════════════════════════

function buildHTML() {
    return `
        ${buildHero()}
        ${buildBioFlipbook()}
        ${buildRezervar()}
        ${buildStudio()}
        ${buildCTA()}
    `;
}

// ─── Hero ────────────────────────────────────────

function buildHero() {
    const desktopVideoId = 'QDHLG4YIkno';
    const mobileVideoId = 'QDHLG4YIkno';
    const isMobile = window.innerWidth < 768;
    const videoId = isMobile ? mobileVideoId : desktopVideoId;

    const params = [
        'autoplay=1', 'mute=1', 'loop=1', 'controls=0',
        'showinfo=0', 'modestbranding=1', 'rel=0', 'disablekb=1',
        'iv_load_policy=3', 'playsinline=1', `playlist=${videoId}`,
        'enablejsapi=1', 'origin=' + encodeURIComponent(window.location.origin)
    ].join('&');

    return `
        <section class="forge-hero" id="forge-hero">
            <div class="forge-hero__video-wrap">
                <iframe
                    id="forge-hero-video"
                    class="forge-hero__video forge-hero__video--youtube"
                    src="https://www.youtube.com/embed/${videoId}?${params}"
                    allow="autoplay; encrypted-media"
                    allowfullscreen
                    tabindex="-1"
                ></iframe>
            </div>
            <img class="forge-hero__poster" src="/images/Forge.webp" alt="The Forge" draggable="false" />
            <div class="forge-hero__overlay"></div>
            <div class="forge-hero__content">
                <span class="forge-hero__eyebrow">Studio & Rezervart</span>
                <h1 class="forge-hero__title">THE FORGE</h1>
                <p class="forge-hero__subtitle">Where Steel Becomes Spirit</p>
            </div>
            <div class="forge-hero__scroll">
                <span>Explore</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </div>
        </section>
    `;
}


// ─── Biography Flipbook ─────────────────────────

function buildBioFlipbook() {
    const pages = [
        { type: 'cover', content: '<h2 class="forge-fb-cover-title">BIOGRAPHY</h2><p class="forge-fb-cover-subtitle">Nikola Vudrag</p>' },
        { type: 'inner', content: '' }, // Blank inner cover
        {
            number: 'Page I',
            title: 'The Origins',
            text: 'Raised amidst the forges and workshops of his family\'s metalworking legacy, Nikola Vudrag developed an early bond with metal\'s transformative power. His education at the Academy of Applied Arts in Rijeka and the Academy of Fine Arts in Zagreb — enriched by studies in art therapy and medal-making — fostered an innovative approach that blends technical rigor with psychological depth.'
        },
        { type: 'image', image: '/images/weld-process-04.webp' },
        {
            number: 'Page II',
            title: 'The Net-Work Philosophy',
            text: 'Vudrag\'s signature method begins with piles of short steel rods — mute, identical fragments. Through a ritual of up to 20,000 individual welds, he transforms these industrial units into organic lattices. Each weld is executed as a single, mindful breath. An austere primary form dissolves into a spectral web — the calculated framework testifies to humanity\'s hunger for perfection, while the wandering infill celebrates our fallibility.'
        },
        { type: 'image', image: '/images/weld-process-06.webp' },
        {
            number: 'Page III',
            title: 'Medallic Mastery',
            text: 'A rare craft combining centuries-old techniques with cutting-edge technology. Vudrag is a master medalist for the Croatian National Bank, creating the national side of Croatia\'s euro coins. His micro-realism is achieved through traditional hand-engraving, often on reliefs not exceeding 1.2 millimetres — where precision becomes a form of meditation.'
        },
        {
            number: 'Page IV',
            title: 'Monumental Works',
            text: 'From the world\'s largest Nikola Tesla sculpture — a twelve-metre form rendered as a functioning powerline pylon — to the five-metre Atlas figure supporting a building in Rovinj, Vudrag\'s practice spans across scales that defy convention. At every magnitude, entropy yields to intent: chaos transformed into form.'
        },
        { type: 'inner', content: '' }, // Blank
        {
            number: 'Page V',
            quote: '"In a culture of infinite replication, each net-work stands as an absolute original — time\'s irreplicable signature welded into steel."'
        },
        { type: 'inner', content: '' }, // Blank inner back cover
        { type: 'back-cover', content: '<div class="forge-fb-back-logo">◈</div>' }
    ];

    let pagesHTML = pages.map((page, i) => {
        const isHard = (page.type === 'cover' || page.type === 'back-cover' || page.type === 'inner');
        const density = isHard ? 'hard' : 'soft';
        
        let contentHTML = '';
        if (page.type === 'cover' || page.type === 'back-cover' || page.type === 'inner') {
            contentHTML = page.content;
        } else if (page.type === 'image') {
            contentHTML = `<img class="forge-flipbook__page-image full-bleed" src="${page.image}" alt="" loading="lazy" draggable="false" />`;
        } else {
            contentHTML = `
                <div class="forge-flipbook__page-content">
                    ${page.number ? `<span class="forge-flipbook__page-number">${page.number}</span>` : ''}
                    ${page.title ? `<h3 class="forge-flipbook__page-title">${page.title}</h3>` : ''}
                    ${page.text ? `<p class="forge-flipbook__page-text">${page.text}</p>` : ''}
                    ${page.quote ? `<p class="forge-flipbook__page-quote">${page.quote}</p>` : ''}
                </div>
            `;
        }
        
        return `
            <div class="forge-flipbook__page page--${page.type || 'text'}" data-density="${density}">
                <div class="page-content">
                    ${contentHTML}
                </div>
            </div>
        `;
    }).join('');

    return `
        <section class="forge-bio" id="forge-bio">
            <div class="forge-bio__watermark" aria-hidden="true">BIOGRAPHY</div>
            <header class="forge-bio__header" data-reveal>
                <span class="forge-bio__label">The Artist</span>
                <h2 class="forge-bio__title">Nikola Vudrag</h2>
                <div class="forge-bio__divider"></div>
            </header>
            <div class="forge-flipbook" data-reveal>
                <div class="forge-flipbook__viewport" id="forge-flipbook-container">
                    ${pagesHTML}
                </div>
                <div class="forge-flipbook__nav">
                    <button class="forge-flipbook__btn" id="forge-fb-prev" aria-label="Previous page">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    <span class="forge-flipbook__counter" id="forge-fb-counter">-- / --</span>
                    <button class="forge-flipbook__btn" id="forge-fb-next" aria-label="Next page">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </button>
                    <span class="forge-flipbook__hint">Drag to turn page</span>
                </div>
            </div>
        </section>
    `;
}


// ─── Rezervart ───────────────────────────────────

function buildRezervar() {
    return `
        <section class="forge-rezervart" id="forge-rezervart" data-reveal>
            <div class="forge-rezervart__image-wrap">
                <img class="forge-rezervart__image" src="/images/weld-process-02.webp" alt="Rezervart Workshop" loading="lazy" draggable="false" />
            </div>
            <div class="forge-rezervart__overlay"></div>
            <div class="forge-rezervart__content">
                <span class="forge-rezervart__eyebrow">Creative Institution</span>
                <h2 class="forge-rezervart__title">Rezervart</h2>
                <div class="forge-rezervart__divider"></div>
                <p class="forge-rezervart__text">
                    The largest art centre in Croatia, based in Varaždin. Rezervart is both sanctuary and laboratory — a space where industrial heritage and artistic ambition coalesce into something unprecedented. Within its walls, raw materials undergo the same alchemical transformation that defines Vudrag's practice: force and precision transmuting rigid elements into living form.
                </p>
            </div>
        </section>
    `;
}


// ─── Studio / About Us ──────────────────────────

function buildStudio() {
    return `
        <section class="forge-studio" id="forge-studio">
            <div class="forge-studio__content" data-reveal>
                <span class="forge-studio__label">The Studio</span>
                <h2 class="forge-studio__title">About Us</h2>
                <img class="forge-studio__portrait" src="/images/vudrag author.webp" alt="Nikola Vudrag in the studio" loading="lazy" draggable="false" />
                <div class="forge-studio__divider"></div>
                <p class="forge-studio__text">
                    Behind every monumental form stands a team forged in the same fire. The Vudrag studio is a collective of artisans, engineers, and dreamers — each contributing their unique discipline to the alchemy of steel. From concept sketches to the final weld, the studio operates as a single organism: methodical, precise, yet always open to the moment when material speaks louder than intention.
                </p>
            </div>
        </section>
    `;
}


// ─── CTA ─────────────────────────────────────────

function buildCTA() {
    return `
        <section class="forge-cta" id="forge-cta">
            <div class="forge-cta__container" data-reveal>
                <div class="forge-cta__crown">
                    <span class="forge-cta__line"></span>
                    <span class="forge-cta__diamond">◈</span>
                    <span class="forge-cta__line"></span>
                </div>
                <span class="forge-cta__label">Commissions & Inquiries</span>
                <h3 class="forge-cta__title">
                    <span>Let's </span>
                    <span class="forge-cta__title-accent">Connect</span>
                </h3>
                <p class="forge-cta__text">
                    For commissions, exhibitions, or simply to share your thoughts on the interplay of form and light — I welcome your message.
                </p>
                <a href="/contact.html" class="forge-cta__link">
                    <span>Get in Touch</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
        </section>
    `;
}


// ═══════════════════════════════════════════
// Interactive Systems
// ═══════════════════════════════════════════

// ─── YouTube Hero Background ─────────────────────

function setupYouTubeHero() {
    const poster = document.querySelector('.forge-hero__poster');
    if (poster) {
        // Hide poster after short delay for YouTube to start
        setTimeout(() => poster.classList.add('is-hidden'), 3000);
    }
}


// ─── Flipbook Navigation ─────────────────────────

function setupFlipbook(container) {
    const viewport = container.querySelector('#forge-flipbook-container');
    if (!viewport) return;

    const prevBtn = container.querySelector('#forge-fb-prev');
    const nextBtn = container.querySelector('#forge-fb-next');
    const counter = container.querySelector('#forge-fb-counter');

    const pageFlip = new PageFlip(viewport, {
        width: 450, // base page width
        height: 600, // base page height
        size: 'stretch', // set layout format
        minWidth: 315,
        maxWidth: 500,
        minHeight: 420,
        maxHeight: 700,
        maxShadowOpacity: 0.5, // shadows
        showCover: true,
        mobileScrollSupport: false 
    });

    // load pages
    pageFlip.loadFromHTML(viewport.querySelectorAll('.forge-flipbook__page'));

    // events
    pageFlip.on('flip', (e) => {
        if (counter) {
            counter.textContent = `${e.data + 1} / ${pageFlip.getPageCount()}`;
        }
    });

    if (counter && pageFlip.getPageCount() > 0) {
        counter.textContent = `1 / ${pageFlip.getPageCount()}`;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            pageFlip.flipPrev();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            pageFlip.flipNext();
        });
    }
}


// ─── Scroll Reveal ───────────────────────────────

function setupScrollReveal(container) {
    const elements = container.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}
