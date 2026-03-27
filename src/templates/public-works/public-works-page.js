/**
 * Public Works Page — "Opus Magnum" v2
 * 
 * Cinematic full-bleed layout. Every work is monumental.
 * 
 * Sections:
 * 1. Gaussian Splat Hero — interactive 3D Tomislavus Rex
 * 2. Introduction — centered editorial text
 * 3. Monumental Showcase — full-bleed panoramic cards
 * 4. Scale Visualization — monolith silhouette towers
 * 5. Hercules Labors — full-bleed panoramic cards
 * 6. Inquire CTA
 */

import '../../styles/public-works-page.css';

// PlayCanvas imports for Gaussian Splat
import {
    Application,
    Asset,
    Entity,
    Color,
    Vec3,
    FILLMODE_FILL_WINDOW,
    RESOLUTION_AUTO
} from 'playcanvas';

/**
 * Mount the Public Works page template
 */
export async function mount(container, collection) {
    const { pageContent, works = [] } = collection;
    const {
        splatHero = {},
        introduction = {},
        scale = {}
    } = pageContent || {};

    // Separate works by segment (no Metal Paintings)
    const monumental = works.filter(w => w.segment === 'Monumental');
    const herculesLabors = works.filter(w => w.segment === 'Hercules Labors');

    container.innerHTML = buildHTML(splatHero, introduction, monumental, herculesLabors, scale);

    requestAnimationFrame(() => {
        setupSplatViewer(container, splatHero);
        setupScrollReveal(container);
        setupParallax(container);
        setupScaleAnimation(container);
        setupGalleryLightbox(container);
    });
}


// ═══════════════════════════════════════════
// HTML Builders
// ═══════════════════════════════════════════

function buildHTML(splatHero, intro, monumental, herculesLabors, scale) {
    return `
        ${buildSplatHero(splatHero)}
        ${buildIntroduction(intro)}
        ${buildChapterDivider('I', 'Monumental', `${monumental.length} Works`)}
        ${buildPanoramicSection(monumental, 'monumental')}
        ${buildScaleSection(scale)}
        ${buildChapterDivider('II', 'The Labors of Hercules', `${herculesLabors.length} Works`)}
        ${buildPanoramicSection(herculesLabors, 'hercules')}
        ${buildInquire()}
    `;
}


// ─── Gaussian Splat Hero ─────────────────────────

function buildSplatHero(hero) {
    return `
        <section class="pw-splat-hero" id="pw-splat-hero">
            <div class="pw-splat-hero__canvas-wrap" id="pw-splat-canvas-wrap">
                <img class="pw-splat-hero__fallback" 
                     src="${hero.fallbackImage || '/images/95.webp'}" 
                     alt="Tomislavus Rex Croatorum"
                     draggable="false" />
            </div>
            <div class="pw-splat-hero__overlay"></div>
            <div class="pw-splat-hero__vignette"></div>
            <div class="pw-splat-hero__content">
                <span class="pw-splat-hero__eyebrow">${hero.eyebrow || ''}</span>
                <h1 class="pw-splat-hero__title">${hero.title || 'PUBLIC WORKS'}</h1>
                <p class="pw-splat-hero__subtitle">${hero.subtitle || ''}</p>
                <div class="pw-splat-hero__interact-hint" id="pw-interact-hint">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                        <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" opacity="0.4"/>
                    </svg>
                    <span>Interact with the sculpture</span>
                </div>
            </div>
            <div class="pw-splat-hero__scroll-hint">
                <span>Scroll to explore</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </div>
            <div class="pw-splat-hero__scanline" aria-hidden="true"></div>
        </section>
    `;
}


// ─── Introduction ─────────────────────────────────

function buildIntroduction(intro) {
    if (!intro.title) return '';

    return `
        <section class="pw-intro" id="pw-intro">
            <div class="pw-intro__bg">
                <img class="pw-intro__bg-image" src="/images/works/dijmanti-rusted-varazdin-stari-grad.webp" alt="" loading="lazy" draggable="false" aria-hidden="true" />
            </div>
            <div class="pw-intro__watermark" aria-hidden="true">OPUS</div>
            <div class="pw-intro__content" data-reveal>
                <span class="pw-intro__eyebrow">${intro.eyebrow || ''}</span>
                <h2 class="pw-intro__title">${intro.title}</h2>
                <div class="pw-intro__divider"></div>
                <p class="pw-intro__text">${intro.text || ''}</p>
                ${intro.quote ? `
                    <blockquote class="pw-intro__quote">
                        <p>"${intro.quote}"</p>
                        <cite>— Nikola Vudrag</cite>
                    </blockquote>
                ` : ''}
            </div>
        </section>
    `;
}


// ─── Chapter Divider ──────────────────────────────

function buildChapterDivider(number, title, count) {
    return `
        <div class="pw-chapter" data-reveal>
            <div class="pw-chapter__lines">
                <span class="pw-chapter__line"></span>
                <span class="pw-chapter__diamond">◈</span>
                <span class="pw-chapter__line"></span>
            </div>
            <span class="pw-chapter__number">${number}</span>
            <h2 class="pw-chapter__title">${title}</h2>
            <span class="pw-chapter__count">${count}</span>
        </div>
    `;
}


// ─── Panoramic Full-Bleed Section ─────────────────

function buildPanoramicSection(works, sectionId) {
    if (!works.length) return '';

    return `
        <section class="pw-panoramic" id="pw-${sectionId}">
            ${works.map((work, i) => {
                const hasGallery = work.galleryImages && work.galleryImages.length > 1;
                return `
                    <article class="pw-pano-card" data-reveal>
                        <div class="pw-pano-card__image-wrap" data-parallax="0.06">
                            ${work.image
                                ? `<img class="pw-pano-card__image" src="${work.image}" alt="${work.title}" loading="lazy" decoding="async" draggable="false" />`
                                : `<div class="pw-pano-card__placeholder"><span>${work.title.charAt(0)}</span></div>`
                            }
                            <div class="pw-pano-card__gradient"></div>
                            ${hasGallery ? `
                                <button class="pw-pano-card__gallery-btn" data-gallery='${JSON.stringify(work.galleryImages)}' aria-label="View gallery">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                                        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                                    </svg>
                                    <span>${work.galleryImages.length} images</span>
                                </button>
                            ` : ''}
                        </div>
                        <div class="pw-pano-card__info">
                            <div class="pw-pano-card__meta">
                                <span class="pw-pano-card__index">${String(i + 1).padStart(2, '0')}</span>
                                ${work.year ? `<span class="pw-pano-card__year">${work.year}</span>` : ''}
                                ${work.dimensions ? `<span class="pw-pano-card__dims">${work.dimensions}</span>` : ''}
                            </div>
                            <h3 class="pw-pano-card__title">${work.title}</h3>
                            <p class="pw-pano-card__description">${work.description || ''}</p>
                        </div>
                    </article>
                `;
            }).join('')}
        </section>
    `;
}


// ─── Scale Visualization (Monolith Towers) ────────

function buildScaleSection(scale) {
    if (!scale || !scale.works) return '';

    const maxHeight = Math.max(...scale.works.map(w => w.height));
    const humanHeight = 1.8;

    return `
        <section class="pw-scale" id="pw-scale">
            <header class="pw-scale__header" data-reveal>
                <span class="pw-scale__label">In Perspective</span>
                <h2 class="pw-scale__title">${scale.title || 'The Scale of Ambition'}</h2>
                <div class="pw-scale__divider"></div>
            </header>
            <div class="pw-scale__skyline" data-reveal>
                <div class="pw-scale__ground"></div>
                ${scale.works.map((w, i) => {
                    const heightPct = (w.height / maxHeight) * 100;
                    return `
                        <div class="pw-scale__monolith" data-scale-index="${i}" style="--monolith-height: ${heightPct}%;">
                            <div class="pw-scale__monolith-block" data-animated="false">
                                <span class="pw-scale__monolith-height">${w.height}${w.unit}</span>
                            </div>
                            <span class="pw-scale__monolith-label">${w.label}</span>
                        </div>
                    `;
                }).join('')}
                <div class="pw-scale__monolith pw-scale__monolith--human" style="--monolith-height: ${(humanHeight / maxHeight) * 100}%;">
                    <div class="pw-scale__monolith-block pw-scale__monolith-block--human" data-animated="false">
                        <svg class="pw-scale__human-svg" viewBox="0 0 24 60" fill="none" stroke="currentColor" stroke-width="1.2">
                            <circle cx="12" cy="5" r="4"/>
                            <line x1="12" y1="9" x2="12" y2="35"/>
                            <line x1="12" y1="15" x2="4" y2="25"/>
                            <line x1="12" y1="15" x2="20" y2="25"/>
                            <line x1="12" y1="35" x2="6" y2="55"/>
                            <line x1="12" y1="35" x2="18" y2="55"/>
                        </svg>
                        <span class="pw-scale__monolith-height">${humanHeight}m</span>
                    </div>
                    <span class="pw-scale__monolith-label">Human</span>
                </div>
            </div>
        </section>
    `;
}


// ─── Inquire CTA ──────────────────────────────────

function buildInquire() {
    return `
        <section class="pw-inquire" id="pw-inquire">
            <div class="pw-inquire__container" data-reveal>
                <div class="pw-inquire__crown">
                    <span class="pw-inquire__line"></span>
                    <span class="pw-inquire__diamond">◈</span>
                    <span class="pw-inquire__line"></span>
                </div>
                <span class="pw-inquire__label">Commissions & Inquiries</span>
                <h3 class="pw-inquire__title">
                    <span>Let's </span>
                    <span class="pw-inquire__title-accent">Connect</span>
                </h3>
                <p class="pw-inquire__text">
                    For monumental sculpture commissions, public art proposals, or site-specific installation inquiries — I welcome your message.
                </p>
                <a href="/contact.html" class="pw-inquire__cta">
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

// ─── Gaussian Splat Viewer ────────────────────────

async function setupSplatViewer(container, heroConfig) {
    const wrap = container.querySelector('#pw-splat-canvas-wrap');
    if (!wrap) return;

    // Check WebGL2 support
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2');
    if (!gl) {
        console.warn('WebGL2 not supported, using fallback image');
        return;
    }

    // Dynamically import CameraFrame for post-effects
    let CameraFrame;
    try {
        const pcModule = await import('playcanvas');
        CameraFrame = pcModule.CameraFrame;
    } catch (e) {
        console.warn('CameraFrame not available');
    }

    try {
        const canvas = document.createElement('canvas');
        canvas.className = 'pw-splat-hero__canvas';
        wrap.insertBefore(canvas, wrap.firstChild);

        const app = new Application(canvas, {
            graphicsDeviceOptions: {
                antialias: false,
                alpha: true,
                preserveDrawingBuffer: false,
                powerPreference: 'high-performance'
            }
        });

        app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
        app.setCanvasResolution(RESOLUTION_AUTO);
        app.start();

        // Resize handler
        const resizeHandler = () => app.resizeCanvas();
        window.addEventListener('resize', resizeHandler);

        // Camera setup
        const clearCol = new Color(0.02, 0.02, 0.03, 1);
        const camera = new Entity('camera');
        camera.addComponent('camera', {
            fov: 50,
            clearColor: clearCol,
            nearClip: 0.1,
            farClip: 100
        });
        camera.setPosition(0, 0.5, 3.5);
        camera.lookAt(0, 0.4, 0);
        app.root.addChild(camera);

        // ── Post-Effects (bloom, grading, vignette — NO chromatic aberration) ──
        let cameraFrame = null;
        if (CameraFrame) {
            try {
                cameraFrame = new CameraFrame(app, camera.camera);

                // Rendering
                cameraFrame.rendering.toneMapping = 0; // LINEAR
                cameraFrame.rendering.sharpness = 0.0;

                // Bloom — subtle HDR glow
                cameraFrame.bloom.intensity = 0.01;
                cameraFrame.bloom.blurLevel = 12;

                // Color grading — contrasty and saturated
                cameraFrame.grading.enabled = true;
                cameraFrame.grading.brightness = 1.0;
                cameraFrame.grading.contrast = 1.35;
                cameraFrame.grading.saturation = 1.65;
                cameraFrame.grading.tint = new Color(1, 1, 1, 1);

                // Vignette — cinematic dark edges
                cameraFrame.vignette.intensity = 1.0;
                cameraFrame.vignette.inner = 0.4;
                cameraFrame.vignette.outer = 1.2;
                cameraFrame.vignette.curvature = 0.5;
                cameraFrame.vignette.color = new Color(0, 0, 0);

                // NO chromatic aberration
                cameraFrame.fringing.intensity = 0;

                cameraFrame.enabled = true;
                cameraFrame.update();

                console.log('🎬 Public Works post-effects enabled (no chromatic aberration)');
            } catch (e) {
                console.warn('Post-effects setup failed:', e);
            }
        }

        // Load the splat
        const splatFile = heroConfig.splatFile || 'gs_vudrag_romislav.sog';
        const splatAsset = new Asset('tomislav-splat', 'gsplat', {
            url: `/${splatFile}`
        });

        app.assets.add(splatAsset);
        app.assets.load(splatAsset);

        splatAsset.ready(() => {
            const splatEntity = new Entity('tomislav');
            splatEntity.addComponent('gsplat', {
                asset: splatAsset
            });
            splatEntity.setPosition(0, 0.4, 0);
            splatEntity.setLocalEulerAngles(-175, 30, 0);
            splatEntity.setLocalScale(0.7, 0.7, 0.7);
            app.root.addChild(splatEntity);

            // Hide fallback image once splat is visible
            const fallback = wrap.querySelector('.pw-splat-hero__fallback');
            if (fallback) {
                fallback.style.opacity = '0';
                setTimeout(() => fallback.style.display = 'none', 1000);
            }

            // Show interaction hint
            const hint = container.querySelector('#pw-interact-hint');
            if (hint) {
                setTimeout(() => hint.classList.add('is-visible'), 2000);
            }

            // ── Camera orbit with smooth sway ──
            let time = 0;
            let mouseInfluenceX = 0, mouseInfluenceY = 0;
            let targetMouseX = 0, targetMouseY = 0;
            const baseDistance = 3.5;
            const verticalOffset = 0.5;
            const swaySpeed = 0.25;
            const swayAmplitude = 0.15;

            // Pre-allocate vectors to avoid GC churn (no allocations in the update loop)
            const _targetPos = new Vec3();
            const _newPos = new Vec3();

            wrap.addEventListener('mousemove', (e) => {
                const rect = wrap.getBoundingClientRect();
                targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            });

            wrap.addEventListener('mouseleave', () => {
                targetMouseX = 0;
                targetMouseY = 0;
            });

            wrap.addEventListener('touchmove', (e) => {
                const rect = wrap.getBoundingClientRect();
                targetMouseX = ((e.touches[0].clientX - rect.left) / rect.width - 0.5) * 2;
                targetMouseY = ((e.touches[0].clientY - rect.top) / rect.height - 0.5) * 2;
            }, { passive: true });

            wrap.addEventListener('touchend', () => {
                targetMouseX = 0;
                targetMouseY = 0;
            });

            app.on('update', (dt) => {
                time += dt;

                // Smooth mouse influence (lerp toward target)
                mouseInfluenceX += (targetMouseX - mouseInfluenceX) * Math.min(1, dt * 4);
                mouseInfluenceY += (targetMouseY - mouseInfluenceY) * Math.min(1, dt * 4);

                // Gentle front-facing oscillation
                const autoSway = Math.sin(time * swaySpeed) * swayAmplitude;
                const totalSway = autoSway + (mouseInfluenceX * 0.3);

                // Camera position — mostly in front with gentle X sway
                const x = Math.sin(totalSway) * baseDistance * 0.3;
                const z = Math.cos(totalSway) * baseDistance;

                // Subtle vertical breathing + mouse Y influence
                const breathe = Math.sin(time * 0.4) * 0.03;
                const y = verticalOffset + breathe + (mouseInfluenceY * 0.15);

                // Smooth camera movement via lerp (reuse pre-allocated Vec3s)
                const currentPos = camera.getPosition();
                _targetPos.set(x, y, z);
                const lerpFactor = 1 - Math.pow(0.05, dt);
                _newPos.lerp(currentPos, _targetPos, lerpFactor);

                camera.setPosition(_newPos);
                camera.lookAt(0, 0.35, 0);

                // Update post-effects each frame
                if (cameraFrame && cameraFrame.enabled) {
                    cameraFrame.update();
                }
            });
        });

        // Visibility management — pause when not visible
        const visObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    app.autoRender = true;
                } else {
                    app.autoRender = false;
                }
            });
        }, { threshold: 0.05 });

        const heroSection = container.querySelector('#pw-splat-hero');
        if (heroSection) visObs.observe(heroSection);

        console.log('✅ Public Works Splat Viewer initialized');
    } catch (err) {
        console.warn('Splat viewer failed to initialize:', err);
    }
}


// ─── Scroll Reveal ────────────────────────────────

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
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
    });

    elements.forEach(el => observer.observe(el));
}


// ─── Parallax ─────────────────────────────────────

function setupParallax(container) {
    const parallaxEls = container.querySelectorAll('[data-parallax]');
    if (!parallaxEls.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            parallaxEls.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.05;
                const rect = el.getBoundingClientRect();
                const elCenter = rect.top + rect.height / 2;
                const viewCenter = window.innerHeight / 2;
                const offset = (elCenter - viewCenter) * speed;
                el.style.transform = `translateY(${offset}px) scale(1.08)`;
            });
            ticking = false;
        });
    }, { passive: true });
}


// ─── Scale Monolith Animation ─────────────────────

function setupScaleAnimation(container) {
    const skyline = container.querySelector('.pw-scale__skyline');
    if (!skyline) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const blocks = skyline.querySelectorAll('.pw-scale__monolith-block');
                blocks.forEach((block, i) => {
                    setTimeout(() => {
                        block.dataset.animated = 'true';
                    }, i * 150);
                });
                observer.unobserve(skyline);
            }
        });
    }, { threshold: 0.25 });

    observer.observe(skyline);
}


// ─── Gallery Lightbox ─────────────────────────────

function setupGalleryLightbox(container) {
    const galleryBtns = container.querySelectorAll('.pw-pano-card__gallery-btn');
    galleryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const images = JSON.parse(btn.dataset.gallery);
            openLightbox(images);
        });
    });
}

function openLightbox(images) {
    if (document.querySelector('.pw-lightbox')) return;

    let currentIndex = 0;

    const lightbox = document.createElement('div');
    lightbox.className = 'pw-lightbox';
    lightbox.innerHTML = `
        <div class="pw-lightbox__overlay"></div>
        <button class="pw-lightbox__close" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
        <div class="pw-lightbox__content">
            <img class="pw-lightbox__image" src="${images[0]}" alt="" />
        </div>
        <div class="pw-lightbox__nav">
            <button class="pw-lightbox__prev" aria-label="Previous">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </button>
            <span class="pw-lightbox__counter">${currentIndex + 1} / ${images.length}</span>
            <button class="pw-lightbox__next" aria-label="Next">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
    `;

    document.body.appendChild(lightbox);
    requestAnimationFrame(() => lightbox.classList.add('is-open'));

    const img = lightbox.querySelector('.pw-lightbox__image');
    const counter = lightbox.querySelector('.pw-lightbox__counter');

    function showImage(index) {
        currentIndex = index;
        img.src = images[currentIndex];
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    lightbox.querySelector('.pw-lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.pw-lightbox__overlay').addEventListener('click', closeLightbox);
    lightbox.querySelector('.pw-lightbox__prev').addEventListener('click', () => {
        showImage((currentIndex - 1 + images.length) % images.length);
    });
    lightbox.querySelector('.pw-lightbox__next').addEventListener('click', () => {
        showImage((currentIndex + 1) % images.length);
    });

    // Keyboard
    function onKey(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage((currentIndex - 1 + images.length) % images.length);
        if (e.key === 'ArrowRight') showImage((currentIndex + 1) % images.length);
    }
    document.addEventListener('keydown', onKey);

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        document.removeEventListener('keydown', onKey);
        setTimeout(() => lightbox.remove(), 400);
    }
}
