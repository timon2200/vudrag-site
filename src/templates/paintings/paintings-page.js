/**
 * Paintings Collection Page — Template Module
 * 
 * Dedicated page for Metal Paintings / Plasma Torch art:
 * - Hero section with cover image
 * - Introduction with interactive plasma canvas BACKGROUND
 *   (hover-draw on desktop, touch-draw + ambient on mobile)
 * - Horizontal scroll works gallery
 * - Technique & stats section
 */

import '../../styles/paintings-page.css';

/**
 * Mount the Paintings page template
 */
export async function mount(container, collection) {
    const { pageContent, works = [], segments = [] } = collection;
    const {
        hero = {},
        introduction = {},
        technique = {}
    } = pageContent || {};

    container.innerHTML = buildHTML(collection, hero, introduction, works, technique);

    // Initialize all interactive systems
    requestAnimationFrame(() => {
        setupScrollReveal(container);
        setupPlasmaCanvas(container);
        setupHorizontalGallery(container);
    });
}

// ═══════════════════════════════════════════
// HTML Builder
// ═══════════════════════════════════════════

function buildHTML(collection, hero, intro, works, technique) {
    return `
        ${buildHero(hero)}
        ${buildIntroduction(intro)}
        ${buildWorksGallery(works)}
        ${buildTechnique(technique)}
    `;
}

// ─── Hero ────────────────────────────────

function buildHero(hero) {
    if (!hero.title) return '';

    return `
        <section class="pt-hero" id="pt-hero">
            <img class="pt-hero__image" src="${hero.image}" alt="${hero.title}" draggable="false" />
            <div class="pt-hero__overlay"></div>
            <div class="pt-hero__content" data-reveal>
                <span class="pt-hero__eyebrow">${hero.eyebrow || ''}</span>
                <h1 class="pt-hero__title">${hero.title}</h1>
                <p class="pt-hero__subtitle">${hero.subtitle || ''}</p>
            </div>
            <div class="pt-hero__scroll-hint">
                <span>Scroll to explore</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </div>
        </section>
    `;
}

// ─── Introduction (with plasma canvas background) ────

function buildIntroduction(intro) {
    if (!intro.title) return '';

    return `
        <section class="pt-intro" id="pt-intro">
            <canvas class="pt-intro__canvas" id="pt-plasma-canvas"></canvas>
            <div class="pt-intro__canvas-texture"></div>
            <div class="pt-intro__watermark" aria-hidden="true">PAINTINGS</div>
            <div class="pt-intro__content" data-reveal>
                <span class="pt-intro__eyebrow">${intro.eyebrow || ''}</span>
                <h2 class="pt-intro__title">${intro.title}</h2>
                <div class="pt-intro__divider"></div>
                <p class="pt-intro__text">${intro.text || ''}</p>
                ${intro.quote ? `
                    <blockquote class="pt-intro__quote">
                        <p>"${intro.quote}"</p>
                        <cite>— Nikola Vudrag</cite>
                    </blockquote>
                ` : ''}
            </div>
            <p class="pt-intro__canvas-hint" data-reveal>
                <span class="pt-intro__canvas-hint-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                </span>
                <span class="pt-intro__canvas-hint-desktop">Move your cursor to draw with plasma</span>
                <span class="pt-intro__canvas-hint-mobile">Touch to draw with plasma</span>
            </p>
        </section>
    `;
}

// ─── Works Gallery ─────────────────────────

function buildWorksGallery(works) {
    if (!works.length) return '';

    // Split by segment
    const plasmaTorch = works.filter(w => w.segment === 'Plasma Torch');
    const mirrorSteel = works.filter(w => w.segment === 'Mirror Steel');
    const unsegmented = works.filter(w => !w.segment);

    let allCards = [];

    if (plasmaTorch.length) {
        allCards.push({ type: 'divider', label: 'Plasma Torch', count: plasmaTorch.length });
        plasmaTorch.forEach(w => allCards.push({ type: 'work', data: w }));
    }

    if (mirrorSteel.length) {
        allCards.push({ type: 'divider', label: 'Mirror Steel', count: mirrorSteel.length });
        mirrorSteel.forEach(w => allCards.push({ type: 'work', data: w }));
    }

    if (unsegmented.length) {
        unsegmented.forEach(w => allCards.push({ type: 'work', data: w }));
    }

    return `
        <section class="pt-gallery" id="pt-gallery">
            <header class="pt-gallery__header" data-reveal>
                <span class="pt-gallery__label">The Collection</span>
                <h2 class="pt-gallery__title">Works</h2>
                <div class="pt-gallery__divider"></div>
                <p class="pt-gallery__hint">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    Scroll horizontally to explore
                </p>
            </header>
            <div class="pt-gallery__track-wrapper">
                <div class="pt-gallery__track" id="pt-gallery-track">
                    ${allCards.map((card, i) => {
                        if (card.type === 'divider') {
                            return `
                                <div class="pt-gallery__segment-divider">
                                    <span class="pt-gallery__segment-watermark">${card.label.toUpperCase()}</span>
                                    <div class="pt-gallery__segment-info">
                                        <span class="pt-gallery__segment-count">${card.count} Work${card.count > 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                            `;
                        }
                        const w = card.data;
                        return `
                            <article class="pt-work-card" data-index="${i}">
                                <div class="pt-work-card__image-wrap">
                                    <img class="pt-work-card__image" src="${w.image}" alt="${w.title}" loading="lazy" />
                                </div>
                                <div class="pt-work-card__overlay"></div>
                                <div class="pt-work-card__content">
                                    <div class="pt-work-card__meta">
                                        <span class="pt-work-card__year">${w.year}</span>
                                        ${w.dimensions ? `<span class="pt-work-card__dimensions">${w.dimensions}</span>` : ''}
                                    </div>
                                    <h3 class="pt-work-card__title">${w.title}</h3>
                                    <p class="pt-work-card__description">${w.description}</p>
                                </div>
                                <div class="pt-work-card__glow"></div>
                            </article>
                        `;
                    }).join('')}
                </div>
                <div class="pt-gallery__progress">
                    <div class="pt-gallery__progress-bar" id="pt-gallery-progress"></div>
                </div>
            </div>
        </section>
    `;
}

// ─── Technique & Stats ───────────────────

function buildTechnique(technique) {
    if (!technique.title) return '';

    return `
        <section class="pt-technique" id="pt-technique">
            <div class="pt-technique__watermark" aria-hidden="true">METHOD</div>
            <div class="pt-technique__content" data-reveal>
                <span class="pt-technique__label">The Process</span>
                <h2 class="pt-technique__title">${technique.title}</h2>
                <div class="pt-technique__divider"></div>
                <p class="pt-technique__text">${technique.text || ''}</p>
            </div>
            ${technique.stats ? `
                <div class="pt-technique__stats" data-reveal>
                    ${technique.stats.map(s => `
                        <div class="pt-technique__stat">
                            <span class="pt-technique__stat-value">${s.value}</span>
                            <span class="pt-technique__stat-label">${s.label}</span>
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

// ─── Scroll Reveal ────────────────────────

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

// ─── Plasma Canvas (Intro Background) ─────

function setupPlasmaCanvas(container) {
    const section = container.querySelector('#pt-intro');
    const canvas = container.querySelector('#pt-plasma-canvas');
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let trails = [];
    let isHovering = false;
    let isTouching = false;
    let lastX = 0, lastY = 0;
    let animId = null;
    let canvasVisible = false;
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Ambient particles for idle state (especially mobile)
    let ambientPoints = [];
    let ambientTimer = 0;

    // Resize canvas to match section
    function resize() {
        const rect = section.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    // Particle class
    class Particle {
        constructor(x, y, isAmbient = false) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * (isAmbient ? 1.5 : 4);
            this.vy = (Math.random() - 0.5) * (isAmbient ? 1.5 : 4) - (isAmbient ? 0.5 : 1.5);
            this.life = 1;
            this.decay = isAmbient ? (0.008 + Math.random() * 0.012) : (0.015 + Math.random() * 0.025);
            this.size = isAmbient ? (0.5 + Math.random() * 1.5) : (1 + Math.random() * 2.5);
            this.hue = 25 + Math.random() * 25;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.03;
            this.life -= this.decay;
            this.size *= 0.985;
        }
        draw(ctx) {
            if (this.life <= 0) return;
            const alpha = this.life * 0.7;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 240, ${alpha})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${alpha * 0.4})`;
            ctx.fill();
        }
    }

    // Trail point
    class TrailPoint {
        constructor(x, y, isAmbient = false) {
            this.x = x;
            this.y = y;
            this.life = 1;
            this.decay = isAmbient ? 0.005 : 0.004;
            this.width = isAmbient ? (1 + Math.random() * 1.5) : (2 + Math.random() * 2);
        }
        update() {
            this.life -= this.decay;
        }
    }

    // Get position relative to section
    function getPos(e) {
        const rect = section.getBoundingClientRect();
        if (e.touches) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    // Add trail between two points
    function addTrail(x, y, prevX, prevY, ambient = false) {
        const dx = x - prevX;
        const dy = y - prevY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.max(1, Math.floor(dist / 4));

        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const px = prevX + dx * t;
            const py = prevY + dy * t;
            trails.push(new TrailPoint(px, py, ambient));

            const pCount = ambient ? 1 : Math.min(3, Math.floor(dist / 8) + 1);
            for (let j = 0; j < pCount; j++) {
                particles.push(new Particle(px, py, ambient));
            }
        }
    }

    // ── Desktop: hover to draw ──
    function onMouseMove(e) {
        const pos = getPos(e);
        if (isHovering) {
            addTrail(pos.x, pos.y, lastX, lastY);
        }
        isHovering = true;
        lastX = pos.x;
        lastY = pos.y;
    }

    function onMouseLeave() {
        isHovering = false;
    }

    // ── Mobile: touch to draw ──
    function onTouchStart(e) {
        // Don't prevent default — allow normal scroll.
        // Only draw if the touch is clearly a draw gesture (handled in move)
        isTouching = true;
        const pos = getPos(e);
        lastX = pos.x;
        lastY = pos.y;
    }

    function onTouchMove(e) {
        if (!isTouching) return;
        const pos = getPos(e);
        addTrail(pos.x, pos.y, lastX, lastY);
        lastX = pos.x;
        lastY = pos.y;
    }

    function onTouchEnd() {
        isTouching = false;
    }

    // ── Ambient idle particles ──
    function spawnAmbient(sectionW, sectionH) {
        ambientTimer++;
        if (ambientTimer % (isMobile ? 8 : 20) !== 0) return;

        // Random point near the center area
        const x = sectionW * (0.2 + Math.random() * 0.6);
        const y = sectionH * (0.2 + Math.random() * 0.6);

        // Create a small drifting trail
        const ap = { x, y, targetX: x + (Math.random() - 0.5) * 80, targetY: y + (Math.random() - 0.5) * 60, progress: 0 };
        ambientPoints.push(ap);
    }

    function updateAmbient(sectionW, sectionH) {
        spawnAmbient(sectionW, sectionH);

        for (let i = ambientPoints.length - 1; i >= 0; i--) {
            const ap = ambientPoints[i];
            ap.progress += 0.02;
            if (ap.progress >= 1) {
                ambientPoints.splice(i, 1);
                continue;
            }
            const prevX = ap.x + (ap.targetX - ap.x) * Math.max(0, ap.progress - 0.02);
            const prevY = ap.y + (ap.targetY - ap.y) * Math.max(0, ap.progress - 0.02);
            const curX = ap.x + (ap.targetX - ap.x) * ap.progress;
            const curY = ap.y + (ap.targetY - ap.y) * ap.progress;
            trails.push(new TrailPoint(curX, curY, true));
            if (Math.random() < 0.3) {
                particles.push(new Particle(curX, curY, true));
            }
        }
    }

    // Animation loop
    function animate() {
        const rect = section.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        // Clear with transparency so trails fade
        ctx.fillStyle = 'rgba(5, 5, 8, 0.06)';
        ctx.fillRect(0, 0, w, h);

        // Run ambient when not actively drawing
        if (!isHovering && !isTouching) {
            updateAmbient(w, h);
        }

        // Draw trails (same color logic as before)
        for (let i = trails.length - 1; i >= 0; i--) {
            const t = trails[i];
            t.update();
            if (t.life <= 0) {
                trails.splice(i, 1);
                continue;
            }

            let r, g, b, a;
            if (t.life > 0.7) {
                const f = (t.life - 0.7) / 0.3;
                r = 255; g = Math.floor(200 + 55 * f); b = Math.floor(150 + 100 * f); a = 0.85;
            } else if (t.life > 0.4) {
                const f = (t.life - 0.4) / 0.3;
                r = Math.floor(200 + 55 * f); g = Math.floor(100 + 100 * f); b = 30; a = 0.6;
            } else if (t.life > 0.15) {
                const f = (t.life - 0.15) / 0.25;
                r = Math.floor(80 + 120 * f); g = Math.floor(20 + 80 * f); b = Math.floor(10 + 20 * f); a = 0.4;
            } else {
                const f = t.life / 0.15;
                r = Math.floor(40 + 40 * f); g = Math.floor(38 + 10 * f); b = Math.floor(42 + 5 * f); a = 0.25 * f;
            }

            ctx.beginPath();
            ctx.arc(t.x, t.y, t.width * (0.5 + t.life * 0.5), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
            ctx.fill();

            if (t.life > 0.5) {
                ctx.beginPath();
                ctx.arc(t.x, t.y, t.width * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 160, 60, ${(t.life - 0.5) * 0.1})`;
                ctx.fill();
            }
        }

        // Draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            particles[i].draw(ctx);
        }

        // Cursor glow
        if (isHovering) {
            const grd = ctx.createRadialGradient(lastX, lastY, 0, lastX, lastY, 40);
            grd.addColorStop(0, 'rgba(255, 180, 80, 0.15)');
            grd.addColorStop(0.5, 'rgba(255, 130, 40, 0.05)');
            grd.addColorStop(1, 'rgba(255, 100, 20, 0)');
            ctx.fillStyle = grd;
            ctx.fillRect(lastX - 40, lastY - 40, 80, 80);
        }

        animId = requestAnimationFrame(animate);
    }

    // Visibility observer — only run animation when section is visible
    const visObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !canvasVisible) {
                canvasVisible = true;
                resize();
                animate();
            } else if (!entry.isIntersecting && canvasVisible) {
                canvasVisible = false;
                if (animId) cancelAnimationFrame(animId);
                animId = null;
            }
        });
    }, { threshold: 0.05 });

    visObserver.observe(section);

    // Attach events to the SECTION (not a separate canvas wrapper)
    if (!isMobile) {
        section.addEventListener('mousemove', onMouseMove);
        section.addEventListener('mouseleave', onMouseLeave);
    }

    // Touch events (passive — don't block scroll)
    section.addEventListener('touchstart', onTouchStart, { passive: true });
    section.addEventListener('touchmove', onTouchMove, { passive: true });
    section.addEventListener('touchend', onTouchEnd, { passive: true });

    console.log(`🔥 Plasma Canvas initialized (${isMobile ? 'mobile' : 'desktop'} mode)`);
}

// ─── Horizontal Gallery ────────────────────

function setupHorizontalGallery(container) {
    const track = container.querySelector('#pt-gallery-track');
    const progressBar = container.querySelector('#pt-gallery-progress');
    if (!track) return;

    // Update progress bar on scroll
    track.addEventListener('scroll', () => {
        const scrollLeft = track.scrollLeft;
        const maxScroll = track.scrollWidth - track.clientWidth;
        const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
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
}
