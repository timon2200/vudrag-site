/**
 * Polygonal Collection Page — "Labours of Hercules"
 * 
 * Cloud-draped hero → collection intro → Poseidon exhibition wall
 * → Labours of Hercules journey → Unfinished Labours (locked cards)
 * → Venice Biennale Atlas feature → Diamond vault
 */

import '../../styles/polygonal-page.css';

// CMS API Base
const CMS_API = import.meta.env.VITE_API_BASE || '/api';

/**
 * Mount the Polygonal page template
 */
export async function mount(container, collection) {
    const { pageContent, works = [] } = collection;
    const {
        hero = {},
        introduction = {},
        labours = [],
        venice = {}
    } = pageContent || {};

    // Hercules works are stored in this collection's own pageContent
    const herculesWorks = pageContent?.herculesWorks || [];

    // Separate polygonal works by segment
    const closedWorks = works.filter(w => w.segment === 'Closed Lighting');

    container.innerHTML = buildHTML(hero, introduction, works, labours, venice, closedWorks, herculesWorks);

    requestAnimationFrame(() => {
        setupCloudParallax(container);
        setupScrollReveal(container);
    });
}

// ═══════════════════════════════════════════
// HTML Builders
// ═══════════════════════════════════════════

function buildHTML(hero, intro, works, labours, venice, closedWorks, herculesWorks) {
    return `
        ${buildCloudHero(hero)}
        ${buildIntroduction(intro)}
        ${buildPoseidonWall(works)}
        ${buildLaboursJourney(labours, herculesWorks)}
        ${buildUnfinishedLabours(labours)}
        ${buildVeniceFeature(venice, herculesWorks)}
        ${buildDiamondVault(closedWorks)}
    `;
}

// ─── Cloud Hero ──────────────────────────────────

function buildCloudHero(hero) {
    return `
        <section class="pg-hero" id="pg-hero">
            <div class="pg-hero__clouds">
                <div class="pg-hero__cloud pg-hero__cloud--1"></div>
                <div class="pg-hero__cloud pg-hero__cloud--2"></div>
                <div class="pg-hero__cloud pg-hero__cloud--3"></div>
            </div>
            <div class="pg-hero__image-wrap">
                ${hero.image ? `<img class="pg-hero__image" src="${hero.image}" alt="Prometheus" draggable="false" />` : ''}
            </div>
            <div class="pg-hero__overlay"></div>
            <div class="pg-hero__content">
                <span class="pg-hero__eyebrow">${hero.eyebrow || ''}</span>
                <h1 class="pg-hero__title">${hero.title || 'POLYGONAL'}</h1>
                <p class="pg-hero__subtitle">${hero.subtitle || ''}</p>
            </div>
            <div class="pg-hero__chain" aria-hidden="true">
                <svg viewBox="0 0 2 200" preserveAspectRatio="none">
                    <line x1="1" y1="0" x2="1" y2="200" stroke="currentColor" stroke-width="0.5" stroke-dasharray="4 6"/>
                </svg>
            </div>
            <div class="pg-hero__scroll-hint">
                <span>Scroll to explore</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </div>
        </section>
    `;
}

// ─── Introduction ────────────────────────────────

function buildIntroduction(intro) {
    if (!intro.title) return '';

    return `
        <section class="pg-intro" id="pg-intro">
            <div class="pg-intro__bg"></div>
            <div class="pg-intro__watermark" aria-hidden="true">POLYGONAL</div>
            <div class="pg-intro__content" data-reveal>
                <span class="pg-intro__eyebrow">${intro.eyebrow || ''}</span>
                <h2 class="pg-intro__title">${intro.title}</h2>
                <div class="pg-intro__divider"></div>
                <p class="pg-intro__text">${intro.text || ''}</p>
                ${intro.quote ? `
                    <blockquote class="pg-intro__quote">
                        <p>"${intro.quote}"</p>
                        <cite>— Nikola Vudrag</cite>
                    </blockquote>
                ` : ''}
            </div>
        </section>
    `;
}

// ─── Poseidon Exhibition Wall ────────────────────

function buildPoseidonWall(works) {
    const poseidon = works.find(w => w.title && w.title.includes('Poseidon'));
    if (!poseidon) return '';

    return `
        <section class="pg-poseidon" id="pg-poseidon">
            <div class="pg-poseidon__watermark" aria-hidden="true">POSEIDON</div>
            <div class="pg-poseidon__image-area" data-reveal>
                <img class="pg-poseidon__image" src="${poseidon.image}" alt="${poseidon.title}" draggable="false" loading="lazy" />
            </div>
            <div class="pg-poseidon__info" data-reveal>
                <span class="pg-poseidon__eyebrow">The Olympian</span>
                <h2 class="pg-poseidon__title">${poseidon.title}</h2>
                <div class="pg-poseidon__divider"></div>
                <p class="pg-poseidon__description">${poseidon.description}</p>
                <div class="pg-poseidon__stats">
                    <span class="pg-poseidon__stat">${poseidon.dimensions}</span>
                    <span class="pg-poseidon__stat-sep">·</span>
                    <span class="pg-poseidon__stat">${poseidon.year}</span>
                    <span class="pg-poseidon__stat-sep">·</span>
                    <span class="pg-poseidon__stat">CorTen Steel</span>
                    <span class="pg-poseidon__stat-sep">·</span>
                    <span class="pg-poseidon__stat">Island of St. Catherine, Biograd</span>
                </div>
            </div>
        </section>
    `;
}

// ─── Labours of Hercules ─────────────────────────

function buildLaboursJourney(labours, herculesWorks) {
    if (!labours.length) return '';

    // Filter out #12 (Atlas & Prometheus feature — shown separately)
    const displayLabours = labours.filter(l => !l.isFeature);

    return `
        <section class="pg-labours" id="pg-labours">
            <div class="pg-labours__watermark" aria-hidden="true">HERCULES</div>
            <header class="pg-labours__header" data-reveal>
                <span class="pg-labours__label">The Journey</span>
                <h2 class="pg-labours__title">The Labours of Hercules</h2>
                <div class="pg-labours__divider"></div>
                <p class="pg-labours__intro-text">In the story of Hercules, the twelve labours are a journey of character formation. The symbolic nature of the number twelve lies in its representation of a complete cycle encompassing the entirety of the human personality.</p>
            </header>
            <div class="pg-labours__list">
                ${displayLabours.map((labour, i) => buildLabourBand(labour, i, herculesWorks)).join('')}
            </div>
        </section>
    `;
}

function buildLabourBand(labour, index, herculesWorks) {
    const isEven = index % 2 === 1;
    const num = String(labour.number).padStart(2, '0');

    // Find matching work data for image (exact title or contains full work name)
    const matchedWork = herculesWorks.find(w =>
        w.title === labour.work ||
        (labour.work && w.title.toLowerCase().includes(labour.work.toLowerCase()))
    );
    const image = matchedWork?.image || '';
    const desc = matchedWork?.description || '';
    const dims = matchedWork?.dimensions || '';
    const year = matchedWork?.year || '';
    const photoCredit = matchedWork?.photoCredit || '';

    return `
        <article class="pg-labour ${isEven ? 'pg-labour--reversed' : ''}" data-reveal data-reveal-delay="${Math.min(index, 3)}">
            <div class="pg-labour__image-wrap">
                ${image
                    ? `<img class="pg-labour__image" src="${image}" alt="${labour.title}" loading="lazy" draggable="false" />`
                    : `<div class="pg-labour__placeholder"></div>`
                }
                ${photoCredit ? `<span class="pg-labour__photo-credit">${photoCredit}</span>` : ''}
            </div>
            <div class="pg-labour__content">
                <span class="pg-labour__number">${num}</span>
                <h3 class="pg-labour__title">${labour.title}</h3>
                ${labour.credential ? `<span class="pg-labour__credential">${labour.credential}</span>` : ''}
                <div class="pg-labour__meta">
                    ${year ? `<span>${year}</span>` : ''}
                    ${dims ? `<span>${dims}</span>` : ''}
                </div>
                <p class="pg-labour__description">${desc}</p>
            </div>
        </article>
    `;
}

// ─── Unfinished Labours ──────────────────────────

function buildUnfinishedLabours(labours) {
    // Vudrag's 12 Labours of Hercules (numbering per artist's reference)
    const canonical = [
        { number: 1, title: 'The Cretan Bull', myth: 'Father of the Minotaur, subdued by bare hands alone.' },
        { number: 2, title: 'The Erymanthian Boar', myth: 'A beast of the wild mountains, brought back alive through snow and silence.' },
        { number: 3, title: 'The Ceryneian Hind', myth: 'Sacred to Artemis, captured through patience — not force.' },
        { number: 4, title: 'The Augean Stables', myth: 'Thirty years of filth, cleansed by rerouting two rivers in a single day.' },
        { number: 5, title: 'The Stymphalian Birds', myth: 'Man-eating birds with bronze beaks, driven from the marshes by sound.' },
        { number: 6, title: 'The Lernaean Hydra', myth: 'The serpent of many heads — cut one, two more arise from the wound.' },
        { number: 7, title: 'The Mares of Diomedes', myth: 'Flesh-eating horses, tamed by turning predator into prey.' },
        { number: 8, title: 'The Gardens of the Hesperides', myth: 'Golden fruit guarded at the edge of the world, beyond the sunset.' },
        { number: 9, title: 'The Nemean Lion', myth: 'The invulnerable beast whose hide no weapon could pierce.' },
        { number: 10, title: 'The Cattle of Geryon', myth: 'A thousand-mile journey to claim the red cattle of the three-bodied giant.' },
        { number: 11, title: 'The Girdle of Hippolyta', myth: 'The Amazon queen\'s belt — a prize requiring diplomacy before force.' },
        { number: 12, title: 'Cerberus', myth: 'The three-headed guardian of the underworld, dragged into daylight.' }
    ];

    // Match by labour number — completed labours have matching numbers
    const completedNumbers = new Set(labours.map(l => l.number));
    const unfinished = canonical.filter(c => !completedNumbers.has(c.number));

    if (!unfinished.length) return '';

    return `
        <section class="pg-unfinished" id="pg-unfinished">
            <div class="pg-unfinished__watermark" aria-hidden="true">XII</div>
            <header class="pg-unfinished__header" data-reveal>
                <span class="pg-unfinished__label">The Labours Yet to Come</span>
                <h2 class="pg-unfinished__title">In the Studio</h2>
                <div class="pg-unfinished__divider"></div>
                <p class="pg-unfinished__intro">The cycle continues. Each remaining labour awaits its translation from myth into steel — from the architect's table to the plasma torch.</p>
            </header>
            <div class="pg-unfinished__grid">
                ${unfinished.map((u, i) => `
                    <div class="pg-unfinished__card" data-reveal data-reveal-delay="${Math.min(i, 4)}">
                        <div class="pg-unfinished__card-lock">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                                <rect x="3" y="11" width="18" height="11" rx="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                        </div>
                        <span class="pg-unfinished__card-number">${String(u.number).padStart(2, '0')}</span>
                        <h3 class="pg-unfinished__card-title">${u.title}</h3>
                        <p class="pg-unfinished__card-myth">${u.myth}</p>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

// ─── Venice Biennale — Atlas Feature ─────────────

function buildVeniceFeature(venice, herculesWorks) {
    if (!venice.title) return '';

    const atlasWork = herculesWorks.find(w => w.title === 'Atlas');
    const atlasImage = venice.atlas?.image || atlasWork?.image || '';

    return `
        <section class="pg-venice" id="pg-venice">
            <div class="pg-venice__watermark" aria-hidden="true">ATLAS</div>
            <header class="pg-venice__header" data-reveal>
                <span class="pg-venice__eyebrow">${venice.eyebrow}</span>
                <h2 class="pg-venice__title">${venice.title}</h2>
                <div class="pg-venice__divider"></div>
                <p class="pg-venice__subtitle">${venice.subtitle}</p>
            </header>
            ${venice.text ? `
                <div class="pg-venice__philosophy" data-reveal>
                    <p class="pg-venice__philosophy-text">${venice.text}</p>
                </div>
            ` : ''}
            <div class="pg-venice__atlas-feature" data-reveal>
                <div class="pg-venice__atlas-image-wrap">
                    ${atlasImage ? `<img class="pg-venice__image" src="${atlasImage}" alt="Atlas — The Weight of Form" loading="lazy" draggable="false" />` : ''}
                    <div class="pg-venice__atlas-overlay"></div>
                </div>
                <div class="pg-venice__atlas-content">
                    <span class="pg-venice__panel-label">${venice.atlas?.label || 'BEARING'}</span>
                    <h3 class="pg-venice__panel-title">${venice.atlas?.title || 'The Weight of Form'}</h3>
                    <p class="pg-venice__panel-text">${venice.atlas?.description || ''}</p>
                </div>
            </div>
        </section>
    `;
}



// ─── Diamond Vault ───────────────────────────────

function buildDiamondVault(closedWorks) {
    if (!closedWorks.length) return '';

    return `
        <section class="pg-vault" id="pg-vault">
            <div class="pg-vault__watermark" aria-hidden="true">LIGHT</div>
            <header class="pg-vault__header" data-reveal>
                <span class="pg-vault__label">Closed Lighting</span>
                <h2 class="pg-vault__title">The Vault of Light</h2>
                <div class="pg-vault__divider"></div>
            </header>
            <div class="pg-vault__grid">
                ${closedWorks.map((w, i) => `
                    <article class="pg-vault__card" data-reveal data-reveal-delay="${i}">
                        <div class="pg-vault__card-image-wrap">
                            <div class="pg-vault__card-glow"></div>
                            ${w.image
                                ? `<img class="pg-vault__card-image" src="${w.image}" alt="${w.title}" loading="lazy" draggable="false" />`
                                : `<div class="pg-vault__card-placeholder"></div>`
                            }
                        </div>
                        <div class="pg-vault__card-content">
                            <div class="pg-vault__card-meta">
                                <span class="pg-vault__card-year">${w.year || ''}</span>
                                ${w.dimensions ? `<span class="pg-vault__card-dims">${w.dimensions}</span>` : ''}
                            </div>
                            <h3 class="pg-vault__card-title">${w.title}</h3>
                            <p class="pg-vault__card-desc">${w.description || ''}</p>
                        </div>
                    </article>
                `).join('')}
            </div>
        </section>
    `;
}




// ═══════════════════════════════════════════
// Interactive Systems
// ═══════════════════════════════════════════

// ─── Cloud Parallax ──────────────────────────────

function setupCloudParallax(container) {
    const hero = container.querySelector('#pg-hero');
    if (!hero) return;

    const clouds = hero.querySelectorAll('.pg-hero__cloud');
    const scrollHint = hero.querySelector('.pg-hero__scroll-hint');

    // Show scroll hint after delay
    setTimeout(() => {
        if (scrollHint) scrollHint.classList.add('is-visible');
    }, 3000);

    // Parallax clouds on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;

            if (scrollY < heroHeight * 1.5) {
                clouds.forEach((cloud, i) => {
                    const speed = 0.3 + i * 0.15;
                    cloud.style.transform = `translateY(${-scrollY * speed}px)`;
                });
            }
            ticking = false;
        });
    }, { passive: true });
}

// ─── Scroll Reveal ───────────────────────────────

function setupScrollReveal(container) {
    const elements = container.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.revealDelay || '0', 10);
                setTimeout(() => {
                    entry.target.classList.add('is-revealed');
                }, delay * 150);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}
