/**
 * Sculpture Page - Main Entry Point
 * 
 * Cinematic full-bleed sculpture detail page with:
 * - Ken Burns hero zoom effect
 * - Title reveal on scroll
 * - Floating info cards
 * - Technical gallery (blueprint + lightbox)
 */

// CSS Imports
import './styles/variables.css';
import './styles/sculpture-page.css';

// CMS API Base
const CMS_API = import.meta.env.VITE_API_BASE || '/api';

// State
let currentSculpture = null;
let scrollY = 0;
let heroHeight = 0;

/**
 * Fetch sculpture data from CMS
 */
async function fetchSculpture(id) {
    try {
        const response = await fetch(`${CMS_API}/sculptures/${id}`);
        if (!response.ok) throw new Error('Sculpture not found');
        return await response.json();
    } catch (err) {
        console.warn(`Failed to fetch sculpture "${id}", using default`);
        return null;
    }
}

/**
 * Fetch all sculptures for related works
 */
async function fetchAllSculptures() {
    try {
        const response = await fetch(`${CMS_API}/sculptures`);
        if (!response.ok) throw new Error('Failed to fetch sculptures');
        return await response.json();
    } catch (err) {
        console.warn('Failed to fetch sculptures list');
        return {};
    }
}

/**
 * Initialize the sculpture page
 */
async function init() {
    // Get sculpture ID from URL
    const params = new URLSearchParams(window.location.search);
    const sculptureId = params.get('id') || 'iron-maiden';

    // Fetch from CMS
    currentSculpture = await fetchSculpture(sculptureId);

    if (!currentSculpture) {
        // Fallback default if API fails
        currentSculpture = {
            id: sculptureId,
            title: 'Sculpture',
            series: 'Collection',
            year: '2024',
            materials: 'Mixed media',
            dimensions: '—',
            collection: 'Private Collection',
            concept: 'A sculptural exploration.',
            statement: '"Art speaks where words fail."',
            heroImage: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=1600&q=80',
            gallery: [],
            related: []
        };
    }

    // Populate page content
    populatePage(currentSculpture);

    // Setup Ken Burns hero
    setupKenBurnsHero();

    // Setup scroll-based animations
    setupScrollAnimations();

    // Setup mouse-following glow on process cards
    setupMouseGlowEffect();

    // Setup technical gallery (blueprint + lightbox)
    setupTechnicalGallery(currentSculpture.gallery);

    // Setup related works
    setupRelatedWorks(currentSculpture.related);

    // Reveal page
    setTimeout(() => {
        document.getElementById('sculpture-page').classList.add('loaded');
    }, 100);

    console.log('🎨 Sculpture page initialized:', currentSculpture.title);
}

/**
 * Populate page with sculpture data
 */
function populatePage(sculpture) {
    // Update page title
    document.title = `${sculpture.title} | Nikola Vudrag`;

    // Hero image
    const heroImg = document.getElementById('hero-image');
    heroImg.src = sculpture.heroImage;
    heroImg.alt = sculpture.title;

    // Title section
    document.getElementById('title-series').textContent = sculpture.series;
    document.getElementById('title-name').textContent = sculpture.title;
    document.getElementById('title-year').textContent = sculpture.year;

    // Apply custom title texture if specified
    const titleSection = document.getElementById('sculpture-title');
    if (sculpture.titleTexture && titleSection) {
        titleSection.style.setProperty('--title-texture', `url('${sculpture.titleTexture}')`);
    }

    // Info cards
    document.getElementById('info-materials').textContent = sculpture.materials;
    document.getElementById('info-dimensions').textContent = sculpture.dimensions;
    document.getElementById('info-collection').textContent = sculpture.collection;
    document.getElementById('info-concept').textContent = sculpture.concept;

    // Statement
    document.getElementById('statement-text').textContent = sculpture.statement;

    // === NEW SECTIONS ===

    // Process & Technique Section
    const processSection = document.getElementById('sculpture-process');
    if (processSection) {
        if (sculpture.process || sculpture.technique) {
            document.getElementById('process-text').textContent = sculpture.process || '';
            document.getElementById('technique-text').textContent = sculpture.technique || '';

            // Process background images
            const processBg = document.getElementById('process-bg');
            if (processBg && sculpture.processImage) {
                processBg.style.backgroundImage = `url('${sculpture.processImage}')`;
            }

            const techniqueBg = document.getElementById('technique-bg');
            if (techniqueBg && sculpture.techniqueImage) {
                techniqueBg.style.backgroundImage = `url('${sculpture.techniqueImage}')`;
            }

            processSection.style.display = 'block';
        } else {
            processSection.style.display = 'none';
        }
    }

    // Vision Statement Section
    const visionSection = document.getElementById('sculpture-vision');
    if (visionSection) {
        if (sculpture.vision || sculpture.inspiration) {
            document.getElementById('vision-text').textContent = sculpture.vision || '';
            document.getElementById('inspiration-text').textContent = sculpture.inspiration || '';

            // Vision background image (uses one of the detail images as ambient bg)
            const visionBg = document.getElementById('vision-bg');
            if (visionBg && sculpture.detailImages?.[0]) {
                visionBg.style.backgroundImage = `url('${sculpture.detailImages[0]}')`;
            }

            visionSection.style.display = 'block';
        } else {
            visionSection.style.display = 'none';
        }
    }

    // Technical Specifications Section
    const specsSection = document.getElementById('sculpture-specs');
    if (specsSection) {
        const hasSpecs = sculpture.weight || sculpture.lighting || sculpture.installationNotes;
        if (hasSpecs) {
            document.getElementById('specs-weight').textContent = sculpture.weight || '—';
            document.getElementById('specs-lighting').textContent = sculpture.lighting || '—';
            document.getElementById('specs-installation').textContent = sculpture.installationNotes || '—';
            specsSection.style.display = 'block';
        } else {
            specsSection.style.display = 'none';
        }
    }

    // Story & Context Section
    const storySection = document.getElementById('sculpture-story');
    if (storySection) {
        if (sculpture.story || sculpture.context) {
            const storyText = document.getElementById('story-text');
            if (storyText && sculpture.story) {
                storyText.innerHTML = `<p>${sculpture.story}</p>`;
            }
            document.getElementById('context-text').textContent = sculpture.context || '';

            // Story side image (uses storyImage as background)
            const storyBg = document.getElementById('story-bg');
            if (storyBg && sculpture.storyImage) {
                storyBg.style.backgroundImage = `url('${sculpture.storyImage}')`;
            } else if (storyBg) {
                // Hide the image column if no image
                storyBg.closest('.sculpture-story__image-column').style.display = 'none';
            }

            storySection.style.display = 'block';
        } else {
            storySection.style.display = 'none';
        }
    }
}

/**
 * Mouse-following glow effect on process cards
 */
function setupMouseGlowEffect() {
    const processCards = document.querySelectorAll('.sculpture-process__column');

    processCards.forEach(card => {
        let rafId = null;

        card.addEventListener('mousemove', (e) => {
            // Throttle with RAF for smooth performance
            if (rafId) return;

            rafId = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);
                rafId = null;
            });
        });

        card.addEventListener('mouseleave', () => {
            // Reset to center on leave
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });
}

/**
 * Ken Burns hero with scroll-based zoom
 */
function setupKenBurnsHero() {
    const hero = document.getElementById('sculpture-hero');
    const heroImage = document.getElementById('hero-image');
    const scrollIndicator = hero.querySelector('.sculpture-hero__scroll-indicator');

    heroHeight = window.innerHeight;

    // Initial subtle animation
    heroImage.style.transform = 'scale(1.02)';

    const handleScroll = () => {
        scrollY = window.scrollY;

        // Ken Burns zoom: 1.0 to 1.15 over first viewport
        const zoomProgress = Math.min(scrollY / heroHeight, 1);
        const scale = 1.02 + (zoomProgress * 0.13); // 1.02 to 1.15

        // Subtle upward pan
        const translateY = zoomProgress * -5; // Move up slightly

        heroImage.style.transform = `scale(${scale}) translateY(${translateY}%)`;

        // Fade out scroll indicator
        if (scrollIndicator) {
            scrollIndicator.style.opacity = Math.max(0, 1 - (scrollY / 200));
        }

        // Parallax hero (slides up slower than scroll)
        const heroParallax = scrollY * 0.4;
        hero.style.transform = `translateY(-${heroParallax}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => { heroHeight = window.innerHeight; });
}

/**
 * Scroll-based reveal animations
 */
function setupScrollAnimations() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // Title section parallax
    const titleSection = document.getElementById('sculpture-title');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;

        // Title emerges as we scroll past hero
        if (scrollY > heroHeight * 0.3) {
            const progress = Math.min((scrollY - heroHeight * 0.3) / (heroHeight * 0.5), 1);
            titleSection.style.opacity = progress;
            titleSection.style.transform = `translateY(${(1 - progress) * 50}px)`;
        }
    }, { passive: true });
}

/**
 * Technical Gallery: Blueprint thumbnails + Lightbox modal
 */
let lightboxImages = [];
let currentLightboxIndex = 0;

function setupTechnicalGallery(images) {
    const grid = document.getElementById('tech-grid');
    if (!grid || !images) return;

    lightboxImages = images;

    // Technical descriptions for each view
    const techLabels = [
        { fig: 'FIG. 01', desc: 'Front elevation' },
        { fig: 'FIG. 02', desc: 'Detail study' },
        { fig: 'FIG. 03', desc: 'Light interaction' },
        { fig: 'FIG. 04', desc: 'Surface texture' },
        { fig: 'FIG. 05', desc: 'Profile view' }
    ];

    images.forEach((src, index) => {
        const label = techLabels[index % techLabels.length];

        const thumb = document.createElement('div');
        thumb.className = 'blueprint-thumb';
        thumb.style.setProperty('--delay', `${index * 0.1}s`);
        thumb.setAttribute('data-reveal', 'true');
        thumb.setAttribute('data-index', index);

        thumb.innerHTML = `
            <div class="blueprint-thumb__image-wrap">
                <img class="blueprint-thumb__image" src="${src}" alt="${label.desc}" loading="lazy">
            </div>
            <div class="blueprint-thumb__label">
                <span class="blueprint-thumb__fig">${label.fig}</span>
                <span class="blueprint-thumb__desc">${label.desc}</span>
            </div>
        `;

        // Click to open lightbox
        thumb.addEventListener('click', () => openLightbox(index));

        grid.appendChild(thumb);
    });

    // Observe thumbs for reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.style.getPropertyValue('--delay')) * 1000 || 0;
                setTimeout(() => entry.target.classList.add('is-revealed'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    grid.querySelectorAll('.blueprint-thumb').forEach(t => observer.observe(t));
    setupLightboxControls();
}

function setupLightboxControls() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxImage();
    document.getElementById('lightbox').classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-image');
    img.style.transform = 'scale(1)';
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    const img = document.getElementById('lightbox-image');
    // Fade out current image
    img.classList.add('transitioning');

    setTimeout(() => {
        currentLightboxIndex = (currentLightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
        updateLightboxImage();
    }, 350);
}

function updateLightboxImage() {
    const img = document.getElementById('lightbox-image');
    const counter = document.getElementById('lightbox-counter');
    const figLabel = document.getElementById('lightbox-fig');
    const caption = document.getElementById('lightbox-caption');

    const techLabels = [
        { fig: 'FIG. 01', desc: 'Front elevation' },
        { fig: 'FIG. 02', desc: 'Detail study' },
        { fig: 'FIG. 03', desc: 'Light interaction' },
        { fig: 'FIG. 04', desc: 'Surface texture' },
        { fig: 'FIG. 05', desc: 'Profile view' }
    ];

    const label = techLabels[currentLightboxIndex % techLabels.length];
    const total = lightboxImages.length;
    const current = currentLightboxIndex + 1;

    // Set the new image source and wait for load
    img.onload = () => {
        img.classList.remove('transitioning');
    };
    img.src = lightboxImages[currentLightboxIndex];
    counter.textContent = `${String(current).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    figLabel.textContent = label.fig;
    caption.textContent = label.desc;
}

/**
 * Setup related works grid
 */
async function setupRelatedWorks(relatedIds) {
    const grid = document.getElementById('related-grid');
    if (!grid || !relatedIds || relatedIds.length === 0) return;

    // Fetch all sculptures to get related works data
    const allSculptures = await fetchAllSculptures();

    relatedIds.forEach(id => {
        const sculpture = allSculptures[id];
        if (!sculpture) return;

        const card = document.createElement('a');
        card.className = 'related-card';
        card.href = `/sculpture.html?id=${id}`;

        card.innerHTML = `
            <div class="related-card__image-wrap">
                <img class="related-card__image" src="${sculpture.heroImage}" alt="${sculpture.title}" loading="lazy">
            </div>
            <div class="related-card__content">
                <span class="related-card__series">${sculpture.series}</span>
                <h3 class="related-card__title">${sculpture.title}</h3>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
