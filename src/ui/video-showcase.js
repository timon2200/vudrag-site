/**
 * Film Showcase - Cinematic Scroll
 * 
 * Vertical scroll-driven stacked letterbox strips.
 * Active strip expands, brightens, and reveals metadata;
 * non-active strips compress, darken, and blur.
 * Click-to-play lightbox with YouTube embed.
 */

import { observeElement } from './scroll-reveal.js';

const CMS_API = import.meta.env.VITE_API_BASE || '/api';

// Module-level cache for loaded films (used by lightbox click handler)
let _loadedFilms = [];

// Hardcoded fallback if API is unreachable
const FALLBACK_FILMS = [
    { id: 'dubai-build-impossible', title: 'Dubai — Build The Impossible', category: 'Exhibition', youtubeId: '7-uhfMFcx7Y' },
    { id: 'thompson-coin-necklace', title: 'Thompson Coin Necklace', category: 'Process', youtubeId: 'rIlK_HQCXF4' },
    { id: 'vudrag-legacy-trailer', title: 'Vudrag Legacy Trailer', category: 'Film', youtubeId: 'ra1X5YLkFi0' },
    { id: 'dubai-hedonist-gallery', title: 'Dubai Hedonist Gallery — Opening Ceremony', category: 'Exhibition', youtubeId: 'rnDmBogTZy4' },
    { id: 'thompson-coin', title: 'Thompson Coin', category: 'Process', youtubeId: 'sWl-7BQHmC4' },
    { id: 'kovnica-novca', title: 'Kovnica Novca', category: 'Documentary', youtubeId: 'jkFG8-GsZq8' }
];

/**
 * Fetch films from CMS API, falling back to hardcoded data
 */
async function loadFilms() {
    try {
        const response = await fetch(`${CMS_API}/films`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const films = await response.json();
        // Derive thumbnail from youtubeId
        return films.map(f => ({
            ...f,
            thumbnail: f.youtubeId ? `https://img.youtube.com/vi/${f.youtubeId}/maxresdefault.jpg` : ''
        }));
    } catch (err) {
        console.warn('⚠️ Films API unavailable, using fallback data:', err.message);
        return FALLBACK_FILMS.map(f => ({
            ...f,
            thumbnail: `https://img.youtube.com/vi/${f.youtubeId}/maxresdefault.jpg`
        }));
    }
}

/**
 * Initialize the film showcase section
 */
export async function setupVideoShowcase() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) {
        console.warn('⚠️ Content area not found for film showcase');
        return null;
    }

    // Fetch films from CMS
    const films = await loadFilms();
    _loadedFilms = films;

    const sectionElement = createFilmShowcaseDOM(films);
    contentArea.appendChild(sectionElement);

    // Setup scroll-driven strip activation
    setupScrollActivation(sectionElement);

    // Setup lightbox
    setupLightbox(sectionElement);

    // Setup header reveal
    const header = sectionElement.querySelector('.film-showcase__header');
    if (header) observeElement(header);

    // Setup strip reveal animations
    const strips = sectionElement.querySelectorAll('.film-strip');
    strips.forEach((strip, index) => {
        strip.setAttribute('data-reveal', 'true');
        strip.setAttribute('data-reveal-delay', String(index + 1));
        observeElement(strip);
    });

    // Setup expand/collapse
    setupExpandCollapse(sectionElement);

    // Observe the expand CTA for reveal
    const expandCta = sectionElement.querySelector('.film-showcase__expand');
    if (expandCta) observeElement(expandCta);

    console.log('🎬 Film showcase (Cinematic Scroll) initialized');
    return sectionElement;
}

/**
 * Create the film showcase DOM
 */
function createFilmShowcaseDOM(films) {
    const section = document.createElement('section');
    section.className = 'film-showcase';
    section.id = 'film-showcase';

    section.innerHTML = `
        <div class="film-showcase__watermark" aria-hidden="true">FILM</div>
        
        <header class="film-showcase__header" data-reveal>
            <span class="film-showcase__label">Film Projects</span>
            <h2 class="film-showcase__title">Moving Image</h2>
            <p class="film-showcase__subtitle">Where fire meets form — glimpses into the forging process, artist reflections, and the stories steel carries within.</p>
            <div class="film-showcase__divider"></div>
        </header>

        <div class="film-showcase__strips-wrapper film-showcase__strips-wrapper--collapsed">
            <div class="film-showcase__strips">
                ${films.map((film, i) => createFilmStripHTML(film, i)).join('')}
            </div>
            <div class="film-showcase__fade-overlay"></div>
        </div>

        <div class="film-showcase__expand" data-reveal>
            <button class="film-showcase__expand-btn">
                <span class="film-showcase__expand-text">Explore all films</span>
                <svg class="film-showcase__expand-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M6 9l6 6 6-6"/>
                </svg>
            </button>
            <span class="film-showcase__expand-count">${films.length} films</span>
        </div>
    `;

    // Add lightbox container
    const lightbox = document.createElement('div');
    lightbox.className = 'film-lightbox';
    lightbox.innerHTML = `
        <div class="film-lightbox__backdrop"></div>
        <div class="film-lightbox__content">
            <button class="film-lightbox__close" aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
            <div class="film-lightbox__player"></div>
            <div class="film-lightbox__info">
                <span class="film-lightbox__category"></span>
                <h3 class="film-lightbox__title"></h3>
                <span class="film-lightbox__meta"></span>
            </div>
        </div>
    `;
    // Append to document.body — NOT inside the section.
    // .content-section has will-change:transform which creates a new containing block,
    // breaking position:fixed on descendants (they behave as position:absolute).
    document.body.appendChild(lightbox);

    return section;
}

/**
 * Create HTML for a single film strip
 */
function createFilmStripHTML(film, index) {
    return `
        <article class="film-strip" data-film-id="${film.id}" data-index="${index}">
            <div class="film-strip__frame">
                <div class="film-strip__thumbnail-wrap">
                    <img 
                        class="film-strip__thumbnail" 
                        src="${film.thumbnail}" 
                        alt="${film.title}"
                        loading="lazy"
                    />
                </div>
                <div class="film-strip__overlay"></div>
                
                <div class="film-strip__play">
                    <svg viewBox="0 0 80 80" fill="none">
                        <circle class="film-strip__play-ring" cx="40" cy="40" r="38" />
                        <polygon class="film-strip__play-tri" points="32,24 32,56 58,40" />
                    </svg>
                </div>

                <div class="film-strip__progress">
                    <div class="film-strip__progress-bar"></div>
                </div>
            </div>

            <div class="film-strip__info">
                <div class="film-strip__info-inner">
                    <span class="film-strip__category">${film.category}</span>
                    <h3 class="film-strip__title">${film.title}</h3>
                </div>
                <div class="film-strip__gold-line"></div>
            </div>

            <div class="film-strip__glow"></div>
        </article>
    `;
}

/**
 * Scroll-driven strip activation
 * The strip closest to the viewport center expands; others compress and blur.
 */
function setupScrollActivation(section) {
    const strips = section.querySelectorAll('.film-strip');
    if (!strips.length) return;

    // Use IntersectionObserver for initial trigger, then refine with scroll listener
    const scrollContainer = document.getElementById('content-area') || window;

    let rafPending = false;

    function updateActiveStrip() {
        const viewportCenter = window.innerHeight / 2;
        const maxDist = window.innerHeight * 0.6;

        let closestStrip = null;
        let closestDistance = Infinity;

        // Single pass: compute rect once per strip, find closest AND set proximity
        const stripData = [];
        for (let i = 0; i < strips.length; i++) {
            const strip = strips[i];
            const rect = strip.getBoundingClientRect();
            const stripCenter = rect.top + rect.height / 2;
            const distance = Math.abs(stripCenter - viewportCenter);
            const proximity = Math.max(0, 1 - distance / maxDist);
            stripData.push({ strip, distance, proximity });

            if (distance < closestDistance) {
                closestDistance = distance;
                closestStrip = strip;
            }
        }

        // Apply in a second pass (reads done, now writes)
        for (let i = 0; i < stripData.length; i++) {
            const { strip, proximity } = stripData[i];
            strip.style.setProperty('--proximity', proximity.toFixed(3));

            if (strip === closestStrip && proximity > 0.3) {
                strip.classList.add('is-active');
            } else {
                strip.classList.remove('is-active');
            }
        }
    }

    // Throttle to one update per animation frame
    function onScroll() {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
            updateActiveStrip();
            rafPending = false;
        });
    }

    // Listen on the content-area scroll (the site uses a custom scroll container)
    if (scrollContainer !== window && scrollContainer) {
        scrollContainer.addEventListener('scroll', onScroll, { passive: true });
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Also run on resize
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial pass
    requestAnimationFrame(() => {
        updateActiveStrip();
    });
}

/**
 * Lightbox for click-to-play
 */
function setupLightbox(section) {
    // Lightbox is on document.body (not inside section) to escape stacking context
    const lightbox = document.querySelector('.film-lightbox');
    if (!lightbox) return;

    const backdrop = lightbox.querySelector('.film-lightbox__backdrop');
    const closeBtn = lightbox.querySelector('.film-lightbox__close');
    const playerArea = lightbox.querySelector('.film-lightbox__player');
    const lbTitle = lightbox.querySelector('.film-lightbox__title');
    const lbCategory = lightbox.querySelector('.film-lightbox__category');
    const lbMeta = lightbox.querySelector('.film-lightbox__meta');

    function openLightbox(film) {
        lbTitle.textContent = film.title;
        lbCategory.textContent = film.category;
        lbMeta.textContent = film.category;

        if (film.youtubeId) {
            playerArea.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${film.youtubeId}?autoplay=1&rel=0&modestbranding=1"
                    allow="autoplay; encrypted-media"
                    allowfullscreen
                ></iframe>
            `;
        } else {
            playerArea.innerHTML = `
                <div class="film-lightbox__placeholder">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <rect x="2" y="2" width="20" height="20" rx="2"/>
                        <path d="M10 8l6 4-6 4V8z"/>
                    </svg>
                    <p>Film coming soon</p>
                </div>
            `;
        }

        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
        // Destroy iframe after animation
        setTimeout(() => {
            playerArea.innerHTML = '';
        }, 400);
    }

    // Click on strips to open
    const strips = section.querySelectorAll('.film-strip');
    strips.forEach(strip => {
        strip.addEventListener('click', () => {
            const filmId = strip.dataset.filmId;
            const film = _loadedFilms.find(f => f.id === filmId);
            if (film) openLightbox(film);
        });
    });

    // Close handlers
    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
            closeLightbox();
        }
    });
}

/**
 * Expand / Collapse toggle for the strips container
 */
function setupExpandCollapse(section) {
    const wrapper = section.querySelector('.film-showcase__strips-wrapper');
    const expandBtn = section.querySelector('.film-showcase__expand-btn');
    const expandBlock = section.querySelector('.film-showcase__expand');
    if (!wrapper || !expandBtn) return;

    let isExpanded = false;

    expandBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;

        if (isExpanded) {
            // Expand: measure full height then animate
            const strips = wrapper.querySelector('.film-showcase__strips');
            const fullHeight = strips.scrollHeight;
            wrapper.style.maxHeight = fullHeight + 'px';
            wrapper.classList.remove('film-showcase__strips-wrapper--collapsed');
            wrapper.classList.add('film-showcase__strips-wrapper--expanded');

            // Update button text
            expandBlock.querySelector('.film-showcase__expand-text').textContent = 'Show less';
            expandBlock.classList.add('film-showcase__expand--flipped');
        } else {
            // Collapse back
            wrapper.style.maxHeight = '';
            wrapper.classList.add('film-showcase__strips-wrapper--collapsed');
            wrapper.classList.remove('film-showcase__strips-wrapper--expanded');

            expandBlock.querySelector('.film-showcase__expand-text').textContent = 'Explore all films';
            expandBlock.classList.remove('film-showcase__expand--flipped');

            // Scroll the film section into view so the user isn't stranded
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}
