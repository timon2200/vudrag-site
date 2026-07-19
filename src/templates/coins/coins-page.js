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
        ${buildVitrine(works, collection)}
        ${buildSidePanel()}
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
            'enablejsapi=1', 'origin=' + encodeURIComponent(window.location.origin),
            'cc_load_policy=3'
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

function buildVitrine(works, collection) {
    if (!works.length) return '';

    const segments = collection.segments || [];
    let segmentsHTML = '';

    if (segments.length > 0) {
        segmentsHTML = segments.map(segmentName => {
            const segmentedWorks = works.filter(w => w.segment === segmentName);
            if (!segmentedWorks.length) return '';
            
            return `
                <div class="coins-vitrine__segment" data-reveal>
                    <h3 class="coins-vitrine__segment-label">${segmentName}</h3>
                    <div class="coins-vitrine__grid">
                        ${segmentedWorks.map((work) => {
                            const originalIndex = works.indexOf(work);
                            return buildCoinCard(work, originalIndex);
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    } else {
        segmentsHTML = `
            <div class="coins-vitrine__grid">
                ${works.map((work, i) => buildCoinCard(work, i)).join('')}
            </div>
        `;
    }

    return `
        <section class="coins-vitrine" id="coins-vitrine">
            <header class="coins-vitrine__header" data-reveal>
                <span class="coins-vitrine__label">The Works</span>
                <h2 class="coins-vitrine__heading">Collector's Vitrine</h2>
                <div class="coins-vitrine__divider"></div>
            </header>
            ${segmentsHTML}
        </section>
    `;
}

function buildCoinCard(work, index) {
    const hasImage = work.image && work.image.length > 0;

    const desc = (work.description || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

    return `
        <article class="coins-card" data-reveal data-reveal-delay="${Math.min(index, 5)}" data-index="${index}" data-description="${desc}">
            <div class="coins-card__image-wrap">
                <div class="coins-card__spotlight"></div>
                <div class="coins-card__specular"></div>
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
            </div>
        </article>
    `;
}

// ─── Side Panel ──────────────────────────────────

function buildSidePanel() {
    return `
        <div class="coins-panel" id="coins-panel">
            <div class="coins-panel__backdrop"></div>
            <aside class="coins-panel__sheet">
                <button class="coins-panel__close" aria-label="Close panel">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
                <div class="coins-panel__image-wrap" id="panel-image-wrap">
                    <img class="coins-panel__image" id="panel-image" src="" alt="" draggable="false" />
                    <div class="coins-panel__spotlight"></div>
                    <div class="coins-panel__specular"></div>
                </div>
                <div class="coins-panel__body">
                    <span class="coins-panel__eyebrow"></span>
                    <h3 class="coins-panel__title"></h3>
                    <div class="coins-panel__divider"></div>
                    <p class="coins-panel__description"></p>
                </div>
            </aside>
        </div>
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
    const overlay = hero.querySelector('.coins-hero__overlay');

    let isMuted = true;
    let ytPlayer = null;

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

    // ── YouTube IFrame Player API ──
    if (iframe && videoConfig.type === 'youtube') {
        // Load YouTube IFrame API if not already loaded
        if (!window.YT || !window.YT.Player) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        }

        const initYTPlayer = () => {
            ytPlayer = new window.YT.Player(iframe, {
                events: {
                    onReady: () => {
                        // Attempt to force disable captions
                        try {
                            if (typeof ytPlayer.unloadModule === 'function') {
                                ytPlayer.unloadModule('captions');
                                ytPlayer.unloadModule('cc');
                            }
                        } catch (e) {
                            console.warn('Could not unload captions module:', e);
                        }

                        // Hide poster once we know the player is ready and playing
                        if (poster) {
                            setTimeout(() => poster.classList.add('is-hidden'), 1500);
                        }
                    },
                    onStateChange: () => {
                        // State transitions can re-enable captions, so force disable them again
                        try {
                            if (typeof ytPlayer.unloadModule === 'function') {
                                ytPlayer.unloadModule('captions');
                                ytPlayer.unloadModule('cc');
                            }
                        } catch (e) {
                            // ignore
                        }
                    }
                }
            });
        };

        // Wait for API to be available
        if (window.YT && window.YT.Player) {
            initYTPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initYTPlayer;
        }
    }

    // Hide poster once video starts playing (MP4)
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

    // ── Toggle mute helper ──
    function toggleMute() {
        isMuted = !isMuted;

        // Toggle on YouTube player
        if (ytPlayer && ytPlayer.isMuted) {
            if (isMuted) {
                ytPlayer.mute();
            } else {
                ytPlayer.unMute();
            }
        }

        // Toggle on native video
        if (video) {
            video.muted = isMuted;
        }

        // Update button state
        if (unmuteBtn) {
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
        }
    }

    // Click anywhere on overlay to toggle mute
    if (overlay) {
        overlay.style.cursor = 'pointer';
        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMute();
        });
    }

    // Keep button click working too
    if (unmuteBtn) {
        unmuteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMute();
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

// ─── Vitrine Interaction (hover tilt + side panel) ─

function setupVitrineInteraction(container) {
    const cards = container.querySelectorAll('.coins-card');

    // Hover tilt (desktop only)
    if (window.matchMedia('(hover: hover)').matches) {
        cards.forEach(card => {
            const imgWrap = card.querySelector('.coins-card__image-wrap');
            const coinImg = card.querySelector('.coins-card__image');

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                // Card tilt (subtle)
                const rotateY = (x - 0.5) * 6;
                const rotateX = (0.5 - y) * 4;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

                // Coin image tilt (dramatic 3D)
                if (coinImg) {
                    const coinRY = (x - 0.5) * 22;
                    const coinRX = (0.5 - y) * 18;
                    coinImg.style.transform = `perspective(400px) rotateX(${coinRX}deg) rotateY(${coinRY}deg) scale(1.06)`;
                }

                // Light position
                if (imgWrap) {
                    const wRect = imgWrap.getBoundingClientRect();
                    const lx = ((e.clientX - wRect.left) / wRect.width) * 100;
                    const ly = ((e.clientY - wRect.top) / wRect.height) * 100;
                    imgWrap.style.setProperty('--shine-x', `${lx}%`);
                    imgWrap.style.setProperty('--shine-y', `${ly}%`);
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                if (coinImg) coinImg.style.transform = '';
                if (imgWrap) {
                    imgWrap.style.removeProperty('--shine-x');
                    imgWrap.style.removeProperty('--shine-y');
                }
            });
        });
    }

    // Click → open side panel
    setupSidePanel(container, cards);
}

// ─── Side Panel ──────────────────────────────────

function setupSidePanel(container, cards) {
    const panel = container.querySelector('#coins-panel');
    if (!panel) return;

    const backdrop = panel.querySelector('.coins-panel__backdrop');
    const sheet = panel.querySelector('.coins-panel__sheet');
    const closeBtn = panel.querySelector('.coins-panel__close');
    const panelImageWrap = panel.querySelector('#panel-image-wrap');
    const panelImage = panel.querySelector('#panel-image');
    const panelEyebrow = panel.querySelector('.coins-panel__eyebrow');
    const panelTitle = panel.querySelector('.coins-panel__title');
    const panelDesc = panel.querySelector('.coins-panel__description');

    let activeCard = null;

    // Hover effect for side panel image
    if (window.matchMedia('(hover: hover)').matches && panelImageWrap && panelImage) {
        sheet.addEventListener('mousemove', (e) => {
            const rect = panelImageWrap.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const clampedX = Math.max(-0.5, Math.min(1.5, x));
            const clampedY = Math.max(-0.5, Math.min(1.5, y));

            const coinRY = (clampedX - 0.5) * 22;
            const coinRX = (0.5 - clampedY) * 18;
            panelImage.style.transform = `perspective(400px) rotateX(${coinRX}deg) rotateY(${coinRY}deg) scale(1.06)`;

            const lx = clampedX * 100;
            const ly = clampedY * 100;
            panelImageWrap.style.setProperty('--shine-x', `${lx}%`);
            panelImageWrap.style.setProperty('--shine-y', `${ly}%`);
        });

        sheet.addEventListener('mouseleave', () => {
            panelImage.style.transform = '';
            panelImageWrap.style.removeProperty('--shine-x');
            panelImageWrap.style.removeProperty('--shine-y');
        });
    }

    function openPanel(card) {
        const index = parseInt(card.dataset.index, 10);
        const img = card.querySelector('.coins-card__image');
        const title = card.querySelector('.coins-card__title');
        const year = card.querySelector('.coins-card__year');
        const denom = card.querySelector('.coins-card__denomination');

        // Populate panel
        if (panelImage) {
            panelImage.src = img ? img.src : '';
            panelImage.alt = img ? img.alt : '';
            panelImage.style.display = img ? '' : 'none';
        }
        if (panelTitle) panelTitle.textContent = title ? title.textContent : '';
        if (panelEyebrow) panelEyebrow.textContent = [year?.textContent, denom?.textContent].filter(Boolean).join(' · ');

        // Get description from CMS data embedded in card
        // We read it from the works array via the index
        const descEl = card.closest('.coins-vitrine');
        // Fetch description from data attribute or fallback
        if (panelDesc) panelDesc.textContent = card.dataset.description || '';

        // Highlight active card
        if (activeCard) activeCard.classList.remove('is-active');
        card.classList.add('is-active');
        activeCard = card;

        // Open
        panel.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closePanel() {
        panel.classList.remove('is-open');
        document.body.style.overflow = '';
        if (activeCard) {
            activeCard.classList.remove('is-active');
            activeCard = null;
        }
    }

    // Card click
    cards.forEach(card => {
        card.addEventListener('click', () => openPanel(card));
    });

    // Close triggers
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    if (backdrop) backdrop.addEventListener('click', closePanel);

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('is-open')) {
            closePanel();
        }
    });
}

