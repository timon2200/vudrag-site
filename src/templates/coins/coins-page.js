/**
 * Coins Collection Page — "The Vault" Template
 * 
 * Cinematic video hero with audio → scroll-triggered vault-door reveal
 * → collector's vitrine grid with spotlight hovers and detail drawers.
 */

import '../../styles/coins-page.css';

/**
 * Mount the Coins page template
 */
export async function mount(container, collection) {
    const { pageContent, works = [] } = collection;
    const {
        video = {},
        introduction = {},
        vaultTitle = 'Coins & Medals'
    } = pageContent || {};

    container.innerHTML = buildHTML(collection, video, introduction, vaultTitle, works);

    // Initialize all interactive systems
    requestAnimationFrame(() => {
        setupVideoHero(container, video);
        setupVaultReveal(container);
        setupScrollReveal(container);
        setupVitrineInteraction(container);
        setupBackButton(container);
    });
}

// ═══════════════════════════════════════════
// HTML Builder
// ═══════════════════════════════════════════

function buildHTML(collection, video, intro, vaultTitle, works) {
    return `
        ${buildVideoHero(video)}
        ${buildVaultReveal(vaultTitle, intro)}
        ${buildIntroduction(intro)}
        ${buildVitrine(works)}
        ${buildInquire()}
    `;
}

// ─── Video Hero ──────────────────────────────────

function buildVideoHero(video) {
    const hasVideo = video.src && video.type;
    const poster = video.poster || '';

    let videoElement = '';

    if (hasVideo && video.type === 'youtube') {
        const params = [
            'autoplay=1', 'mute=1', 'loop=1', 'controls=0',
            'showinfo=0', 'modestbranding=1', 'rel=0', 'disablekb=1',
            'iv_load_policy=3', 'playsinline=1', `playlist=${video.src}`,
            'enablejsapi=1', 'origin=' + encodeURIComponent(window.location.origin)
        ].join('&');
        videoElement = `
            <iframe
                class="coins-hero__video coins-hero__video--youtube"
                src="https://www.youtube.com/embed/${video.src}?${params}"
                allow="autoplay; encrypted-media"
                allowfullscreen
                tabindex="-1"
            ></iframe>
        `;
    } else if (hasVideo && (video.type === 'mp4' || video.type === 'video')) {
        videoElement = `
            <video
                class="coins-hero__video"
                src="${video.src}"
                autoplay muted loop playsinline
                preload="auto"
            ></video>
        `;
    }

    return `
        <section class="coins-hero" id="coins-hero">
            <div class="coins-hero__video-wrap">
                ${videoElement}
            </div>
            ${poster ? `<img class="coins-hero__poster ${hasVideo ? '' : ''}" src="${poster}" alt="Coins Collection" draggable="false" />` : ''}
            <div class="coins-hero__overlay"></div>
            
            <button class="coins-hero__unmute" id="coins-unmute" aria-label="Enable sound">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
                <span>Enable Sound</span>
            </button>

            <div class="coins-hero__progress">
                <div class="coins-hero__progress-bar" id="coins-progress"></div>
            </div>

            <div class="coins-hero__scroll-hint" id="coins-scroll-hint">
                <span>Scroll to explore</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </div>

            <a href="/" class="coins-hero__back">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span>Back</span>
            </a>
        </section>
    `;
}

// ─── Vault Reveal ────────────────────────────────

function buildVaultReveal(vaultTitle, intro) {
    return `
        <section class="coins-vault" id="coins-vault">
            <div class="coins-vault__watermark" aria-hidden="true">NUMISMATICA</div>
            <div class="coins-vault__door">
                <div class="coins-vault__panel coins-vault__panel--left"></div>
                <div class="coins-vault__panel coins-vault__panel--right"></div>
            </div>
            <div class="coins-vault__content">
                <span class="coins-vault__eyebrow">The Collection</span>
                <h1 class="coins-vault__title">${vaultTitle}</h1>
                <div class="coins-vault__divider"></div>
                ${intro.credential ? `
                    <div class="coins-vault__credential">${intro.credential}</div>
                ` : ''}
            </div>
        </section>
    `;
}

// ─── Introduction ────────────────────────────────

function buildIntroduction(intro) {
    if (!intro.title) return '';

    return `
        <section class="coins-intro" id="coins-intro">
            <div class="coins-intro__content" data-reveal>
                <span class="coins-intro__eyebrow">${intro.eyebrow || ''}</span>
                <h2 class="coins-intro__title">${intro.title}</h2>
                <div class="coins-intro__divider"></div>
                <p class="coins-intro__text">${intro.text || ''}</p>
            </div>
        </section>
    `;
}

// ─── Vitrine Grid ────────────────────────────────

function buildVitrine(works) {
    if (!works.length) return '';

    return `
        <section class="coins-vitrine" id="coins-vitrine">
            <header class="coins-vitrine__header" data-reveal>
                <span class="coins-vitrine__label">The Works</span>
                <h2 class="coins-vitrine__heading">Collector's Vitrine</h2>
                <div class="coins-vitrine__divider"></div>
            </header>
            <div class="coins-vitrine__grid">
                ${works.map((work, i) => buildCoinCard(work, i)).join('')}
            </div>
        </section>
    `;
}

function buildCoinCard(work, index) {
    const hasImage = work.image && work.image.length > 0;

    return `
        <article class="coins-card" data-reveal data-reveal-delay="${Math.min(index, 5)}" data-index="${index}">
            <button class="coins-card__close" aria-label="Close details">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
            <div class="coins-card__image-wrap">
                <div class="coins-card__spotlight"></div>
                ${hasImage
                    ? `<img class="coins-card__image" src="${work.image}" alt="${work.title}" loading="lazy" draggable="false" />`
                    : `<div class="coins-card__placeholder">
                         <svg class="coins-card__placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5">
                             <circle cx="12" cy="12" r="10"/>
                             <circle cx="12" cy="12" r="6"/>
                             <circle cx="12" cy="12" r="2"/>
                         </svg>
                       </div>`
                }
            </div>
            <div class="coins-card__content">
                <div class="coins-card__meta">
                    <span class="coins-card__year">${work.year || ''}</span>
                    <span class="coins-card__denomination">${work.dimensions || ''}</span>
                </div>
                <h3 class="coins-card__title">${work.title}</h3>
                <div class="coins-card__underline"></div>
            </div>
            <div class="coins-card__drawer">
                <p class="coins-card__description">${work.description || ''}</p>
            </div>
        </article>
    `;
}

// ─── Inquire CTA ─────────────────────────────────

function buildInquire() {
    return `
        <section class="coins-inquire" id="coins-inquire">
            <div class="coins-inquire__container" data-reveal>
                <div class="coins-inquire__crown">
                    <span class="coins-inquire__line"></span>
                    <span class="coins-inquire__diamond">◈</span>
                    <span class="coins-inquire__line"></span>
                </div>
                <span class="coins-inquire__label">Commissions & Inquiries</span>
                <h3 class="coins-inquire__title">
                    <span>Let's </span>
                    <span class="coins-inquire__title-accent">Connect</span>
                </h3>
                <p class="coins-inquire__text">
                    For commemorative coin commissions, medal design, or to learn more about the numismatic craft — I welcome your inquiry.
                </p>
                <a href="/contact.html" class="coins-inquire__cta">
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

// ─── Video Hero ──────────────────────────────────

function setupVideoHero(container, videoConfig) {
    const hero = container.querySelector('#coins-hero');
    if (!hero) return;

    const video = hero.querySelector('video.coins-hero__video');
    const iframe = hero.querySelector('iframe.coins-hero__video--youtube');
    const unmuteBtn = hero.querySelector('#coins-unmute');
    const progressBar = hero.querySelector('#coins-progress');
    const scrollHint = hero.querySelector('#coins-scroll-hint');
    const poster = hero.querySelector('.coins-hero__poster');

    let isMuted = true;

    // Show scroll hint after delay
    setTimeout(() => {
        if (scrollHint) scrollHint.classList.add('is-visible');
    }, 5000);

    // If no video, show scroll hint immediately and hide unmute
    if (!video && !iframe) {
        if (scrollHint) scrollHint.classList.add('is-visible');
        if (unmuteBtn) unmuteBtn.classList.add('is-hidden');
        return;
    }

    // Hide poster once video starts playing
    if (video && poster) {
        video.addEventListener('playing', () => {
            poster.classList.add('is-hidden');
        }, { once: true });
    }

    // MP4 video progress tracking
    if (video) {
        video.addEventListener('timeupdate', () => {
            if (video.duration && progressBar) {
                const progress = (video.currentTime / video.duration) * 100;
                progressBar.style.width = `${progress}%`;
            }
        });

        video.addEventListener('ended', () => {
            if (scrollHint) scrollHint.classList.add('is-visible');
        });
    }

    // Unmute toggle
    if (unmuteBtn) {
        unmuteBtn.addEventListener('click', () => {
            isMuted = !isMuted;

            if (video) {
                video.muted = isMuted;
            }

            // Update button state
            const label = unmuteBtn.querySelector('span');
            const svg = unmuteBtn.querySelector('svg');

            if (isMuted) {
                if (label) label.textContent = 'Enable Sound';
                if (svg) svg.innerHTML = `
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                `;
            } else {
                if (label) label.textContent = 'Mute';
                if (svg) svg.innerHTML = `
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
                `;
            }
        });
    }

    // Scroll escape — scroll past hero to vault
    let scrollAccumulator = 0;
    const ESCAPE_THRESHOLD = 100;
    let escaped = false;

    hero.addEventListener('wheel', (e) => {
        if (escaped) return;

        if (e.deltaY > 0) {
            scrollAccumulator += e.deltaY;

            if (scrollAccumulator >= ESCAPE_THRESHOLD) {
                escaped = true;
                scrollAccumulator = 0;

                const vault = container.querySelector('#coins-vault');
                if (vault) {
                    vault.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        } else {
            scrollAccumulator = 0;
        }
    }, { passive: true });

    // Reset escape when scrolling back to top
    window.addEventListener('scroll', () => {
        if (escaped && window.scrollY <= 5) {
            escaped = false;
        }
    }, { passive: true });
}

// ─── Vault Reveal ────────────────────────────────

function setupVaultReveal(container) {
    const vault = container.querySelector('#coins-vault');
    if (!vault) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                vault.classList.add('is-revealed');
                observer.unobserve(vault);
            }
        });
    }, {
        threshold: [0.1, 0.3, 0.5]
    });

    observer.observe(vault);
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
                }, delay * 120);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ─── Vitrine Interaction ─────────────────────────

function setupVitrineInteraction(container) {
    const cards = container.querySelectorAll('.coins-card');

    cards.forEach(card => {
        // Hover tilt effect (desktop only)
        if (window.matchMedia('(hover: hover)').matches) {
            const imageWrap = card.querySelector('.coins-card__image-wrap');
            
            card.addEventListener('mousemove', (e) => {
                if (card.classList.contains('is-expanded')) return;
                
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                const rotateY = (x - 0.5) * 6;   // ±3 degrees
                const rotateX = (0.5 - y) * 4;    // ±2 degrees
                
                card.style.transform = `translateY(-4px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                if (card.classList.contains('is-expanded')) return;
                card.style.transform = '';
            });
        }

        // Click to expand drawer
        card.addEventListener('click', (e) => {
            // Don't toggle if clicking close button
            if (e.target.closest('.coins-card__close')) {
                card.classList.remove('is-expanded');
                card.style.transform = '';
                return;
            }

            // Toggle this card
            const wasExpanded = card.classList.contains('is-expanded');

            // Close all other expanded cards
            cards.forEach(c => {
                if (c !== card) c.classList.remove('is-expanded');
            });

            if (!wasExpanded) {
                card.classList.add('is-expanded');
                card.style.transform = 'translateY(-4px)';

                // Scroll card into view if needed
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            } else {
                card.classList.remove('is-expanded');
                card.style.transform = '';
            }
        });

        // Close button
        const closeBtn = card.querySelector('.coins-card__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                card.classList.remove('is-expanded');
                card.style.transform = '';
            });
        }
    });
}

// ─── Back Button ─────────────────────────────────

function setupBackButton(container) {
    const backBtn = container.querySelector('.coins-hero__back');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/';
        });
    }
}
