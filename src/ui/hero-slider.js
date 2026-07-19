/**
 * Hero Slider — Rolls-Royce–Style Full-Screen Scroll Carousel
 * 
 * Stacked 100vh slides in normal document flow.
 * CSS scroll-snap handles the "magnetic" feel.
 * Supports both image and YouTube video backgrounds.
 * Videos are lazy-loaded: only the active slide plays.
 * Slide data fetched from CMS, with hardcoded fallback.
 */

// ═══════════════════════════════════
// Fallback Slides (used if CMS unavailable)
// ═══════════════════════════════════

const FALLBACK_SLIDES = [
    {
        image: '/images/Network.webp',
        youtubeId: 'BCEdZVVwBC4',
        youtubeIdMobile: 'AL1UjxlcHo0',
        title: 'NET-WORK',
        subtitle: 'Latticework & Light',
        eyebrow: 'The Net-Work Series',
        objectPosition: 'center 50%',
        link: '/collection.html?id=networking',
    },
    {
        image: '/images/Atlas.webp',
        youtubeId: 'PkF5YGPu_YI',
        youtubeIdMobile: '8sbb6UZwZC4',
        startTime: 2,
        title: 'MONUMENTAL',
        subtitle: 'Where Geometry Bears the Weight of Myth',
        eyebrow: 'Polygonal & Hercules',
        objectPosition: 'center 30%',
        link: '/collection.html?id=monumental',
    },
    {
        image: '/images/Forge.webp',
        youtubeId: 'QDHLG4YIkno',
        youtubeIdMobile: 'QDHLG4YIkno',
        title: 'THE FORGE',
        subtitle: 'Where Steel Becomes Spirit',
        eyebrow: 'Studio & Rezervart',
        objectPosition: 'center 35%',
        link: '/forge.html',
    }
];

/**
 * Fetch hero slides from CMS, fall back to hardcoded
 */
async function loadSlides() {
    try {
        const res = await fetch('/api/site-content');
        if (!res.ok) throw new Error('CMS unavailable');
        const data = await res.json();
        if (data.heroSlides && data.heroSlides.length > 0) {
            return data.heroSlides;
        }
    } catch (e) {
        console.warn('⚠️ Could not fetch hero slides from CMS, using fallback');
    }
    return FALLBACK_SLIDES;
}

/**
 * Build the YouTube embed URL for a slide
 */
function buildVideoUrl(slide) {
    const isMobile = window.innerWidth < window.innerHeight;
    const videoId = (isMobile && slide.youtubeIdMobile) ? slide.youtubeIdMobile : slide.youtubeId;
    if (!videoId) return '';

    const params = [
        'autoplay=1',
        'mute=1',
        'loop=1',
        'controls=0',
        'showinfo=0',
        'modestbranding=1',
        'rel=0',
        'disablekb=1',
        'iv_load_policy=3',
        'playsinline=1',
        `playlist=${videoId}`,
        'enablejsapi=1',
        'origin=' + encodeURIComponent(window.location.origin),
        'cc_load_policy=3',
        ...(slide.startTime ? [`start=${slide.startTime}`] : [])
    ].join('&');

    return `https://www.youtube.com/embed/${videoId}?${params}`;
}

/**
 * Build the background HTML — image, or video placeholder + poster
 * Video iframes start empty (data-src) — loaded lazily when active.
 */
function buildBackground(slide, isFirst) {
    const videoUrl = buildVideoUrl(slide);

    if (videoUrl) {
        return `
            <div class="hero-slide__video-wrap">
                <iframe 
                    class="hero-slide__video"
                    ${isFirst ? `src="${videoUrl}"` : ''}
                    data-src="${videoUrl}"
                    frameborder="0"
                    allow="autoplay; encrypted-media"
                    allowfullscreen
                    tabindex="-1"
                ></iframe>
            </div>
            ${slide.image ? `
                <img 
                    class="hero-slide__image hero-slide__image--poster"
                    src="${slide.image}"
                    alt="${slide.title}"
                    style="object-position: ${slide.objectPosition || 'center 50%'}"
                    draggable="false"
                />
            ` : ''}
        `;
    }

    // Default: image background
    return `
        <img 
            class="hero-slide__image"
            src="${slide.image}"
            alt="${slide.title}"
            style="object-position: ${slide.objectPosition || 'center 50%'}"
            draggable="false"
        />
    `;
}

/**
 * Setup the hero slider
 */
export async function setupHeroSlider() {
    const heroSection = document.getElementById('hero-section');
    if (!heroSection) return;

    const slides = await loadSlides();

    // Build stacked slides HTML
    heroSection.innerHTML = slides.map((slide, i) => `
        <section class="hero-slide ${i === 0 ? 'is-active' : ''}" data-index="${i}">
            ${buildBackground(slide, i === 0)}
            <div class="hero-slide__overlay"></div>
            <div class="hero-slide__content">
                <span class="hero-slide__eyebrow">${slide.eyebrow || ''}</span>
                <h2 class="hero-slide__title">${slide.title}</h2>
                <p class="hero-slide__subtitle">${slide.subtitle || ''}</p>
                <a href="${slide.link || '/gallery.html'}" class="hero-slide__cta">
                    <span>Discover</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
        </section>
    `).join('') + `
        <nav class="hero-pagination" aria-label="Slide navigation">
            ${slides.map((_, i) => `
                <button class="hero-pagination__dot ${i === 0 ? 'is-active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}">
                    <span class="hero-pagination__number">${String(i + 1).padStart(2, '0')}</span>
                </button>
            `).join('')}
        </nav>
    `;

    // Preload poster images
    slides.forEach(slide => {
        if (slide.image) {
            const img = new Image();
            img.src = slide.image;
        }
    });

    // Setup scroll-driven active state + lazy video loading
    setupScrollObserver(heroSection);

    // Setup pagination clicks
    setupPagination(heroSection);

    // Setup scroll escape so users can scroll past the slider to content below
    setupScrollEscape(heroSection);

    console.log('🎬 Hero slider initialized —', slides.length, 'slides (lazy video loading)');
}

/**
 * Activate a slide's video (set iframe src from data-src)
 */
function activateVideo(slideEl) {
    const iframe = slideEl.querySelector('.hero-slide__video');
    if (!iframe || !iframe.dataset.src) return;
    // Only set src if it's not already the correct URL
    if (iframe.getAttribute('src') !== iframe.dataset.src) {
        iframe.src = iframe.dataset.src;
    }
}

/**
 * Deactivate a slide's video (remove iframe src to stop playback & free resources)
 */
function deactivateVideo(slideEl) {
    const iframe = slideEl.querySelector('.hero-slide__video');
    if (!iframe) return;
    iframe.removeAttribute('src');
}

/**
 * IntersectionObserver — toggle .is-active and lazy-load/unload videos
 * Uses two thresholds: 0.5 to activate, 0.1 to detect exit.
 */
function setupScrollObserver(heroSection) {
    const slidesEls = heroSection.querySelectorAll('.hero-slide');
    const dots = heroSection.querySelectorAll('.hero-pagination__dot');
    let activeIndex = 0;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const index = parseInt(entry.target.dataset.index, 10);

            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                if (index === activeIndex) return; // already active

                // Deactivate previous
                slidesEls[activeIndex]?.classList.remove('is-active');
                dots[activeIndex]?.classList.remove('is-active');
                deactivateVideo(slidesEls[activeIndex]);

                // Activate new
                activeIndex = index;
                entry.target.classList.add('is-active');
                dots[index]?.classList.add('is-active');
                activateVideo(entry.target);
            }
        });
    }, {
        root: heroSection,
        threshold: [0.1, 0.5]
    });

    slidesEls.forEach(slide => observer.observe(slide));
}

/**
 * Pagination dot clicks — smooth scroll to the corresponding slide
 */
function setupPagination(heroSection) {
    const dots = heroSection.querySelectorAll('.hero-pagination__dot');

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index, 10);
            const targetSlide = heroSection.querySelectorAll('.hero-slide')[index];
            if (targetSlide) {
                targetSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/**
 * Scroll Escape — let users scroll past the slider into the page content.
 * 
 * When the hero slider reaches its last slide and the user keeps scrolling
 * down, we break free and scroll the outer page to the content below.
 * 
 * Handles both wheel (desktop) and touch (mobile) events.
 * 
 * While "escaped", the hero's internal overflow is DISABLED so that
 * scrolling back up moves the outer page rather than snapping between
 * slides. Internal scrolling is only re-enabled once the outer page
 * has fully returned to the top (window.scrollY ≈ 0).
 */
function setupScrollEscape(heroSection) {
    let escapeAccumulator = 0;
    const ESCAPE_THRESHOLD = 80;       // wheel (px of deltaY)
    const TOUCH_ESCAPE_THRESHOLD = 60; // touch (px of upward swipe)
    let escaped = false;

    const pagination = heroSection.querySelector('.hero-pagination');

    /** Check if the hero's internal scroll is at the very bottom */
    function isAtBottom() {
        return heroSection.scrollTop + heroSection.clientHeight >= heroSection.scrollHeight - 5;
    }

    /** Lock the hero's internal scroll so it can't intercept events */
    function lockHeroScroll() {
        heroSection.style.overflowY = 'hidden';
        heroSection.style.scrollSnapType = 'none';
        if (pagination) pagination.style.opacity = '0';
    }

    /** Restore the hero's internal scroll-snap behaviour */
    function unlockHeroScroll() {
        heroSection.style.overflowY = '';
        heroSection.style.scrollSnapType = '';
        if (pagination) pagination.style.opacity = '';
    }

    /** Perform the escape to content below */
    function doEscape() {
        escaped = true;
        escapeAccumulator = 0;
        lockHeroScroll();

        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // ── Wheel (desktop / trackpad) ──────────────────────────────
    heroSection.addEventListener('wheel', (e) => {
        if (escaped) return;

        if (isAtBottom() && e.deltaY > 0) {
            escapeAccumulator += e.deltaY;
            if (escapeAccumulator >= ESCAPE_THRESHOLD) {
                doEscape();
            }
            return;
        }

        // Any normal internal scroll resets the accumulator
        escapeAccumulator = 0;
    }, { passive: true });

    // ── Touch (mobile) ──────────────────────────────────────────
    let touchStartY = 0;
    let touchActive = false;

    heroSection.addEventListener('touchstart', (e) => {
        if (escaped) return;
        touchStartY = e.touches[0].clientY;
        touchActive = true;
        escapeAccumulator = 0;
    }, { passive: true });

    heroSection.addEventListener('touchmove', (e) => {
        if (escaped || !touchActive) return;

        const currentY = e.touches[0].clientY;
        const delta = touchStartY - currentY; // positive = swiping up (scroll down intent)

        if (isAtBottom() && delta > 0) {
            escapeAccumulator += delta;
            touchStartY = currentY; // track incrementally

            if (escapeAccumulator >= TOUCH_ESCAPE_THRESHOLD) {
                doEscape();
                touchActive = false;
            }
            return;
        }

        // Not at bottom or swiping down — reset
        escapeAccumulator = 0;
        touchStartY = currentY;
    }, { passive: true });

    heroSection.addEventListener('touchend', () => {
        touchActive = false;
        escapeAccumulator = 0;
    }, { passive: true });

    // ── Re-entry: when page scrolls back to top, re-enable slider ──
    window.addEventListener('scroll', () => {
        if (escaped && window.scrollY <= 5) {
            escaped = false;
            unlockHeroScroll();
        }
    }, { passive: true });
}

