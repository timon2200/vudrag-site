/**
 * Network Collection Page — Template Module
 * 
 * Cinematic long-form page for the Net-Work collection:
 * - Hero slider (2 slides: texture + creation video)
 * - Collection introduction with watermark
 * - 4-pattern showcase (Shield, Brut, Organic, Sumerian)
 * - Horizontal scroll works gallery with integrated hover cards
 * - Technique & philosophy section
 */

import '../../styles/network-page.css';

/**
 * Mount the Network page template
 */
export async function mount(container, collection) {
    const { pageContent, works = [], segments = [] } = collection;
    const {
        heroSlides = [],
        introduction = {},
        patterns = [],
        technique = {}
    } = pageContent || {};

    container.innerHTML = buildHTML(collection, heroSlides, introduction, patterns, works, technique);

    // Initialize all interactive systems
    requestAnimationFrame(() => {
        setupHeroSlider(container);
        setupScrollReveal(container);
        setupPatternCards(container);
        setupHorizontalGallery(container);
    });
}

// ═══════════════════════════════════════════
// HTML Builder
// ═══════════════════════════════════════════

function buildHTML(collection, heroSlides, intro, patterns, works, technique) {
    return `
        ${buildHeroSlider(heroSlides)}
        ${buildIntroduction(intro)}
        ${buildWorksGallery(works)}
        ${buildPatternShowcase(patterns)}
    `;
}

// ─── Hero Slider ────────────────────────────

function buildHeroSlider(slides) {
    if (!slides.length) return '';

    return `
        <section class="nw-hero" id="nw-hero">
            ${slides.map((slide, i) => `
                <div class="nw-hero__slide ${i === 0 ? 'is-active' : ''}" data-index="${i}">
                    ${buildSlideBackground(slide, i === 0)}
                    <div class="nw-hero__overlay"></div>
                    <div class="nw-hero__content">
                        <span class="nw-hero__eyebrow">${slide.eyebrow || ''}</span>
                        <h1 class="nw-hero__title">${slide.title}</h1>
                        <p class="nw-hero__subtitle">${slide.subtitle || ''}</p>
                    </div>
                </div>
            `).join('')}
            <nav class="nw-hero__pagination" aria-label="Slide navigation">
                ${slides.map((_, i) => `
                    <button class="nw-hero__dot ${i === 0 ? 'is-active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}">
                        <span class="nw-hero__dot-number">${String(i + 1).padStart(2, '0')}</span>
                    </button>
                `).join('')}
            </nav>
            <div class="nw-hero__scroll-hint">
                <span>Scroll to explore</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </div>
        </section>
    `;
}

function buildSlideBackground(slide, isFirst) {
    if (slide.youtubeId) {
        const isMobile = window.innerWidth < window.innerHeight;
        const videoId = slide.youtubeId;
        const params = [
            'autoplay=1', 'mute=1', 'loop=1', 'controls=0',
            'showinfo=0', 'modestbranding=1', 'rel=0', 'disablekb=1',
            'iv_load_policy=3', 'playsinline=1', `playlist=${videoId}`,
            'enablejsapi=1', 'origin=' + encodeURIComponent(window.location.origin)
        ].join('&');
        const videoUrl = `https://www.youtube.com/embed/${videoId}?${params}`;

        return `
            <div class="nw-hero__video-wrap">
                <iframe
                    class="nw-hero__video"
                    ${isFirst ? `src="${videoUrl}"` : ''}
                    data-src="${videoUrl}"
                    frameborder="0"
                    allow="autoplay; encrypted-media"
                    allowfullscreen
                    tabindex="-1"
                ></iframe>
            </div>
            ${slide.image ? `<img class="nw-hero__image nw-hero__image--poster" src="${slide.image}" alt="${slide.title}" draggable="false" />` : ''}
        `;
    }

    return `<img class="nw-hero__image" src="${slide.image}" alt="${slide.title}" draggable="false" />`;
}

// ─── Introduction ────────────────────────────

function buildIntroduction(intro) {
    if (!intro.title) return '';

    return `
        <section class="nw-intro" id="nw-intro">
            <div class="nw-intro__watermark" aria-hidden="true">NET-WORK</div>
            <div class="nw-intro__content" data-reveal>
                <span class="nw-intro__eyebrow">${intro.eyebrow || ''}</span>
                <h2 class="nw-intro__title">${intro.title}</h2>
                <div class="nw-intro__divider"></div>
                <p class="nw-intro__text">${intro.text || ''}</p>
                ${intro.quote ? `
                    <blockquote class="nw-intro__quote">
                        <p>"${intro.quote}"</p>
                        <cite>— Nikola Vudrag</cite>
                    </blockquote>
                ` : ''}
            </div>
        </section>
    `;
}

// ─── Pattern Showcase ────────────────────────

function buildPatternShowcase(patterns) {
    if (!patterns.length) return '';

    return `
        <section class="nw-patterns" id="nw-patterns">
            <div class="nw-patterns__watermark" aria-hidden="true">PATTERNS</div>
            <header class="nw-patterns__header" data-reveal>
                <span class="nw-patterns__label">Four Disciplines</span>
                <h2 class="nw-patterns__title">The Welding Patterns</h2>
                <div class="nw-patterns__divider"></div>
            </header>
            <div class="nw-patterns__grid">
                ${patterns.map((p, i) => {
                    const imgs = p.images || [p.image, p.image];
                    const labels = p.finishLabels || ['Finish A', 'Finish B'];
                    return `
                    <article class="nw-pattern-card" data-reveal data-reveal-delay="${i + 1}">
                        <div class="nw-comparator" data-comparator>
                            <div class="nw-comparator__image-wrap nw-comparator__image-wrap--left">
                                <img class="nw-comparator__image" src="${imgs[0]}" alt="${p.title} — ${labels[0]}" loading="lazy" draggable="false" />
                            </div>
                            <div class="nw-comparator__image-wrap nw-comparator__image-wrap--right">
                                <img class="nw-comparator__image" src="${imgs[1]}" alt="${p.title} — ${labels[1]}" loading="lazy" draggable="false" />
                            </div>
                            <div class="nw-comparator__divider" data-comparator-handle>
                                <div class="nw-comparator__line"></div>
                                <div class="nw-comparator__handle">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <path d="M8 5l-5 7 5 7"/><path d="M16 5l5 7-5 7"/>
                                    </svg>
                                </div>
                            </div>
                            <span class="nw-comparator__label nw-comparator__label--left">${labels[0]}</span>
                            <span class="nw-comparator__label nw-comparator__label--right">${labels[1]}</span>
                        </div>
                        <div class="nw-pattern-card__content">
                            <span class="nw-pattern-card__number">${String(i + 1).padStart(2, '0')}</span>
                            <h3 class="nw-pattern-card__title">${p.title}</h3>
                            <span class="nw-pattern-card__subtitle">${p.subtitle}</span>
                            <p class="nw-pattern-card__description">${p.description}</p>
                        </div>
                    </article>
                `}).join('')}
            </div>
        </section>
    `;
}

function buildWorksGallery(works) {
    if (!works.length) return '';

    // Split by segment
    const wall = works.filter(w => w.segment === 'Wall');
    const pedestal = works.filter(w => w.segment === 'Self Standing' || !w.segment);

    function buildWorkCard(w, i) {
        return `
            <article class="nw-work-card" data-index="${i}">
                <div class="nw-work-card__image-wrap">
                    <img class="nw-work-card__image" src="${w.image}" alt="${w.title}" loading="lazy" />
                </div>
                <div class="nw-work-card__overlay"></div>
                <div class="nw-work-card__content">
                    <div class="nw-work-card__meta">
                        <span class="nw-work-card__year">${w.year}</span>
                        ${w.dimensions ? `<span class="nw-work-card__dimensions">${w.dimensions}</span>` : ''}
                    </div>
                    <h3 class="nw-work-card__title">${w.title}</h3>
                    <p class="nw-work-card__description">${w.description}</p>
                </div>
                <div class="nw-work-card__glow"></div>
            </article>
        `;
    }

    function buildRow(label, items, rowId) {
        if (!items.length) return '';
        return `
            <div class="nw-gallery__row" id="${rowId}">
                <span class="nw-gallery__row-label">${label}</span>
                <div class="nw-gallery__row-track" data-loop-track>
                    ${items.map((w, i) => buildWorkCard(w, i)).join('')}
                </div>
            </div>
        `;
    }

    return `
        <section class="nw-gallery" id="nw-gallery">
            <header class="nw-gallery__header" data-reveal>
                <span class="nw-gallery__label">The Collection</span>
                <h2 class="nw-gallery__title">Works</h2>
                <div class="nw-gallery__divider"></div>
                <p class="nw-gallery__hint">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    Scroll horizontally to explore
                </p>
            </header>
            <div class="nw-gallery__rows">
                ${buildRow('WALL', wall, 'nw-row-wall')}
                ${buildRow('SELF STANDING', pedestal, 'nw-row-pedestal')}
            </div>
            <div class="nw-gallery__progress">
                <div class="nw-gallery__progress-bar" id="nw-gallery-progress"></div>
            </div>
        </section>
    `;
}

// ─── Technique & Philosophy ────────────────

function buildTechnique(technique) {
    if (!technique.title) return '';

    // 8 weld process images
    const weldSteps = [
        { src: '/images/weld-process-01.webp', label: 'Raw Rods' },
        { src: '/images/weld-process-02.webp', label: 'First Welds' },
        { src: '/images/weld-process-03.webp', label: 'Building Form' },
        { src: '/images/weld-process-04.webp', label: 'Lattice Growth' },
        { src: '/images/weld-process-05.webp', label: 'Density' },
        { src: '/images/weld-process-06.webp', label: 'Shaping' },
        { src: '/images/weld-process-07.webp', label: 'Refinement' },
        { src: '/images/weld-process-08.webp', label: 'Completion' }
    ];

    return `
        <section class="nw-technique" id="nw-technique">
            <div class="nw-technique__watermark" aria-hidden="true">METHOD</div>
            <div class="nw-technique__content" data-reveal>
                <span class="nw-technique__label">The Process</span>
                <h2 class="nw-technique__title">${technique.title}</h2>
                <div class="nw-technique__divider"></div>
                <p class="nw-technique__text">${technique.text || ''}</p>
            </div>
            <div class="nw-weld-strip" data-reveal>
                <div class="nw-weld-strip__track">
                    ${weldSteps.map((step, i) => `
                        <figure class="nw-weld-strip__item">
                            <div class="nw-weld-strip__image-wrap">
                                <img class="nw-weld-strip__image" src="${step.src}" alt="${step.label}" loading="lazy" />
                                <span class="nw-weld-strip__number">${String(i + 1).padStart(2, '0')}</span>
                            </div>
                            <figcaption class="nw-weld-strip__label">${step.label}</figcaption>
                        </figure>
                    `).join('')}
                </div>
            </div>
            ${technique.stats ? `
                <div class="nw-technique__stats" data-reveal>
                    ${technique.stats.map(s => `
                        <div class="nw-technique__stat">
                            <span class="nw-technique__stat-value">${s.value}</span>
                            <span class="nw-technique__stat-label">${s.label}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </section>
    `;
}



// ═══════════════════════════════════════════
// Interactive Systems
// ═══════════════════════════════════════════

// ─── Hero Slider ────────────────────────────

function setupHeroSlider(container) {
    const hero = container.querySelector('#nw-hero');
    if (!hero) return;

    const slides = hero.querySelectorAll('.nw-hero__slide');
    const dots = hero.querySelectorAll('.nw-hero__dot');
    let activeIndex = 0;

    // IntersectionObserver for slide activation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const index = parseInt(entry.target.dataset.index, 10);

            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                if (index === activeIndex) return;

                // Deactivate previous
                slides[activeIndex]?.classList.remove('is-active');
                dots[activeIndex]?.classList.remove('is-active');
                deactivateVideo(slides[activeIndex]);

                // Activate new
                activeIndex = index;
                entry.target.classList.add('is-active');
                dots[index]?.classList.add('is-active');
                activateVideo(entry.target);
            }
        });
    }, {
        root: hero,
        threshold: [0.1, 0.5]
    });

    slides.forEach(slide => observer.observe(slide));

    // Pagination clicks
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index, 10);
            const targetSlide = slides[index];
            if (targetSlide) {
                targetSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Scroll escape — let users scroll past slider to content
    let escapeAccumulator = 0;
    const ESCAPE_THRESHOLD = 120;
    let escaped = false;
    const pagination = hero.querySelector('.nw-hero__pagination');

    hero.addEventListener('wheel', (e) => {
        if (escaped) return;

        const atBottom = hero.scrollTop + hero.clientHeight >= hero.scrollHeight - 2;

        if (atBottom && e.deltaY > 0) {
            escapeAccumulator += e.deltaY;

            if (escapeAccumulator >= ESCAPE_THRESHOLD) {
                escaped = true;
                escapeAccumulator = 0;

                hero.style.overflowY = 'hidden';
                hero.style.scrollSnapType = 'none';
                if (pagination) pagination.style.opacity = '0';

                const intro = container.querySelector('#nw-intro');
                if (intro) {
                    intro.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            return;
        }

        escapeAccumulator = 0;
    }, { passive: true });

    window.addEventListener('scroll', () => {
        if (escaped && window.scrollY <= 5) {
            escaped = false;
            hero.style.overflowY = '';
            hero.style.scrollSnapType = '';
            if (pagination) pagination.style.opacity = '';
        }
    }, { passive: true });
}

function activateVideo(slideEl) {
    const iframe = slideEl?.querySelector('.nw-hero__video');
    if (!iframe || !iframe.dataset.src) return;
    if (iframe.getAttribute('src') !== iframe.dataset.src) {
        iframe.src = iframe.dataset.src;
    }
}

function deactivateVideo(slideEl) {
    const iframe = slideEl?.querySelector('.nw-hero__video');
    if (!iframe) return;
    iframe.removeAttribute('src');
}

// ─── Scroll Reveal ────────────────────────────

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
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ─── Comparator Drag ────────────────────────────

function setupPatternCards(container) {
    const comparators = container.querySelectorAll('[data-comparator]');

    comparators.forEach(comp => {
        const rightWrap = comp.querySelector('.nw-comparator__image-wrap--right');
        const divider = comp.querySelector('[data-comparator-handle]');
        if (!rightWrap || !divider) return;

        let isDragging = false;
        let position = 50; // percent

        function updatePosition(clientX) {
            const rect = comp.getBoundingClientRect();
            const x = clientX - rect.left;
            position = Math.max(5, Math.min(95, (x / rect.width) * 100));

            requestAnimationFrame(() => {
                rightWrap.style.clipPath = `inset(0 0 0 ${position}%)`;
                rightWrap.style.webkitClipPath = `inset(0 0 0 ${position}%)`;
                divider.style.left = `${position}%`;
            });
        }

        // Mouse events
        comp.addEventListener('mousedown', (e) => {
            isDragging = true;
            comp.classList.add('is-dragging');
            updatePosition(e.clientX);
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updatePosition(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                comp.classList.remove('is-dragging');
            }
        });

        // Touch events
        comp.addEventListener('touchstart', (e) => {
            isDragging = true;
            comp.classList.add('is-dragging');
            updatePosition(e.touches[0].clientX);
        }, { passive: true });

        comp.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updatePosition(e.touches[0].clientX);
            e.preventDefault();
        }, { passive: false });

        comp.addEventListener('touchend', () => {
            isDragging = false;
            comp.classList.remove('is-dragging');
        });
    });
}

// ─── Horizontal Gallery (Dual Row + Loop) ────────────

function setupHorizontalGallery(container) {
    const tracks = container.querySelectorAll('[data-loop-track]');
    const progressBar = container.querySelector('#nw-gallery-progress');
    if (!tracks.length) return;

    tracks.forEach((track, trackIndex) => {
        // Clone cards for seamless looping
        const cards = [...track.children];
        if (cards.length > 1) {
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                track.appendChild(clone);
            });
        }

        // Update progress bar on first track scroll
        if (trackIndex === 0 && progressBar) {
            track.addEventListener('scroll', () => {
                const scrollLeft = track.scrollLeft;
                const maxScroll = track.scrollWidth - track.clientWidth;
                const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
                progressBar.style.width = `${progress}%`;
            }, { passive: true });
        }

        // Infinite loop reset
        track.addEventListener('scroll', () => {
            const scrollLeft = track.scrollLeft;
            const halfScroll = track.scrollWidth / 2;

            if (scrollLeft >= halfScroll) {
                track.style.scrollBehavior = 'auto';
                track.scrollLeft = scrollLeft - halfScroll;
                track.style.scrollBehavior = '';
            } else if (scrollLeft <= 0) {
                track.style.scrollBehavior = 'auto';
                track.scrollLeft = scrollLeft + halfScroll;
                track.style.scrollBehavior = '';
            }
        }, { passive: true });

        // Mouse drag scrolling for desktop
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;

        track.addEventListener('mousedown', (e) => {
            isDragging = true;
            track.classList.add('is-dragging');
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        track.addEventListener('mouseleave', () => {
            isDragging = false;
            track.classList.remove('is-dragging');
        });

        track.addEventListener('mouseup', () => {
            isDragging = false;
            track.classList.remove('is-dragging');
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 1.5;
            track.scrollLeft = scrollLeft - walk;
        });
    });
}

