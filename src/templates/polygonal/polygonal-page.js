/**
 * Polygonal Collection Page — "The Forge of Olympus"
 * 
 * Cloud-draped Prometheus hero → collection intro → Poseidon exhibition wall
 * → Labours of Hercules journey → Venice Biennale Atlas/Prometheus feature
 * → Open menagerie gallery → Diamond vault → Inquire CTA
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

    // Fetch Hercules Labors works from public-works collection for image matching
    let herculesWorks = [];
    try {
        const res = await fetch(`${CMS_API}/collections/public-works`);
        if (res.ok) {
            const pw = await res.json();
            herculesWorks = (pw.works || []).filter(w => w.segment === 'Hercules Labors');
        }
    } catch (e) {
        console.warn('Could not fetch Hercules Labors data');
    }

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
        ${buildVeniceFeature(venice, herculesWorks)}
        ${buildDiamondVault(closedWorks)}
        ${buildInquire()}
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

    return `
        <article class="pg-labour ${isEven ? 'pg-labour--reversed' : ''}" data-reveal data-reveal-delay="${Math.min(index, 3)}">
            <div class="pg-labour__image-wrap">
                ${image
                    ? `<img class="pg-labour__image" src="${image}" alt="${labour.title}" loading="lazy" draggable="false" />`
                    : `<div class="pg-labour__placeholder"></div>`
                }
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

// ─── Venice Biennale — Atlas & Prometheus ────────

function buildVeniceFeature(venice, herculesWorks) {
    if (!venice.title) return '';

    const atlasWork = herculesWorks.find(w => w.title === 'Atlas');
    const prometheusWork = herculesWorks.find(w => w.title === 'Prometheus');

    // Prefer BTS images from venice data, fall back to sculpture work images
    const atlasImage = venice.atlas?.image || atlasWork?.image || '';
    const prometheusImage = venice.prometheus?.image || prometheusWork?.image || '';

    return `
        <section class="pg-venice" id="pg-venice">
            <div class="pg-venice__watermark" aria-hidden="true">FORGE</div>
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
            <div class="pg-venice__split" data-reveal>
                <div class="pg-venice__panel pg-venice__panel--atlas">
                    ${atlasImage ? `<img class="pg-venice__image" src="${atlasImage}" alt="Bearing Atlas" loading="lazy" draggable="false" />` : ''}
                    <div class="pg-venice__panel-content">
                        <span class="pg-venice__panel-label">${venice.atlas?.label || 'BEARING'}</span>
                        <h3 class="pg-venice__panel-title">${venice.atlas?.title || 'The Weight of Form'}</h3>
                        <p class="pg-venice__panel-text">${venice.atlas?.description || ''}</p>
                    </div>
                </div>
                <div class="pg-venice__divider-line">
                    <div class="pg-venice__divider-glow"></div>
                </div>
                <div class="pg-venice__panel pg-venice__panel--prometheus">
                    ${prometheusImage ? `<img class="pg-venice__image" src="${prometheusImage}" alt="Forging Prometheus" loading="lazy" draggable="false" />` : ''}
                    <div class="pg-venice__panel-content">
                        <span class="pg-venice__panel-label">${venice.prometheus?.label || 'FORGING'}</span>
                        <h3 class="pg-venice__panel-title">${venice.prometheus?.title || 'Fire as Language'}</h3>
                        <p class="pg-venice__panel-text">${venice.prometheus?.description || ''}</p>
                    </div>
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

// ─── Inquire CTA ─────────────────────────────────

function buildInquire() {
    return `
        <section class="pg-inquire" id="pg-inquire">
            <div class="pg-inquire__container" data-reveal>
                <div class="pg-inquire__crown">
                    <span class="pg-inquire__line"></span>
                    <span class="pg-inquire__diamond">◈</span>
                    <span class="pg-inquire__line"></span>
                </div>
                <span class="pg-inquire__label">Commissions & Inquiries</span>
                <h3 class="pg-inquire__title">
                    <span>Let's </span>
                    <span class="pg-inquire__title-accent">Connect</span>
                </h3>
                <p class="pg-inquire__text">
                    For monumental sculpture commissions, exhibition inquiries, or to discuss a collaborative project — I welcome your message.
                </p>
                <a href="/contact.html" class="pg-inquire__cta">
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
