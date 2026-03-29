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

import {
    Application,
    Asset,
    Entity,
    Color,
    Vec3,
    Curve,
    CurveSet,
    Texture,
    FILLMODE_FILL_WINDOW,
    RESOLUTION_AUTO,
    BLEND_ADDITIVEALPHA,
    PIXELFORMAT_SRGBA8,
    ADDRESS_CLAMP_TO_EDGE
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

    // Separate works by segment
    const monumental = works.filter(w => w.segment === 'Monumental');

    container.innerHTML = buildHTML(splatHero, introduction, monumental, scale);

    requestAnimationFrame(() => {
        setupSplatViewer(container, splatHero);
        setupScrollReveal(container);
        setupParallax(container);
        setupScaleAnimation(container);
        setupGalleryLightbox(container);
        setupTorchLight(container);
    });
}


// ═══════════════════════════════════════════
// HTML Builders
// ═══════════════════════════════════════════

function buildHTML(splatHero, intro, monumental, scale) {
    return `
        ${buildSplatHero(splatHero)}
        ${buildIntroduction(intro)}
        ${buildChapterDivider('I', 'Monumental', `${monumental.length} Works`)}
        ${buildPanoramicSection(monumental, 'monumental')}
        ${buildScaleSection(scale)}
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
                            ${work.photoCredit ? `<span class="pw-pano-card__photo-credit">${work.photoCredit}</span>` : ''}
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
                        <div class="pw-pano-card__torch"></div>
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

            // ── 3D PlayCanvas Particles ──────────────────────
            const particlesEntity = setup3DParticles(app);

            // ── Camera orbit with smooth sway ──
            let time = 0;
            let mouseInfluenceX = 0, mouseInfluenceY = 0;
            let targetMouseX = 0, targetMouseY = 0;
            const baseDistance = 3.5;
            const verticalOffset = 0.5;
            const swaySpeed = 0.25;
            const swayAmplitude = 0.15;

            // Particle mouse-reactive rotation state
            let particleTargetPitch = 0;
            let particleTargetYaw = 0;
            let particleCurrentPitch = 0;
            let particleCurrentYaw = 0;

            // Pre-allocate vectors to avoid GC churn (no allocations in the update loop)
            const _targetPos = new Vec3();
            const _newPos = new Vec3();

            // Use the hero section for mouse events so hover works over text overlays too
            const heroSection = container.querySelector('#pw-splat-hero') || wrap;

            heroSection.addEventListener('mousemove', (e) => {
                const rect = heroSection.getBoundingClientRect();
                targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            });

            heroSection.addEventListener('mouseleave', () => {
                targetMouseX = 0;
                targetMouseY = 0;
            });

            heroSection.addEventListener('touchmove', (e) => {
                const rect = heroSection.getBoundingClientRect();
                targetMouseX = ((e.touches[0].clientX - rect.left) / rect.width - 0.5) * 2;
                targetMouseY = ((e.touches[0].clientY - rect.top) / rect.height - 0.5) * 2;
            }, { passive: true });

            heroSection.addEventListener('touchend', () => {
                targetMouseX = 0;
                targetMouseY = 0;
            });

            app.on('update', (dt) => {
                time += dt;

                // Smooth mouse influence (lerp toward target — snappy response)
                mouseInfluenceX += (targetMouseX - mouseInfluenceX) * Math.min(1, dt * 6);
                mouseInfluenceY += (targetMouseY - mouseInfluenceY) * Math.min(1, dt * 6);

                // Front-facing oscillation + strong mouse orbit
                const autoSway = Math.sin(time * swaySpeed) * swayAmplitude;
                const totalSway = autoSway + (mouseInfluenceX * 0.8);

                // Camera position — pronounced horizontal arc on hover
                const x = Math.sin(totalSway) * baseDistance * 0.3;
                const z = Math.cos(totalSway) * baseDistance;

                // Vertical breathing + mouse Y influence
                const breathe = Math.sin(time * 0.4) * 0.03;
                const y = verticalOffset + breathe + (mouseInfluenceY * 0.4);

                // Smooth camera movement via lerp (reuse pre-allocated Vec3s)
                const currentPos = camera.getPosition();
                _targetPos.set(x, y, z);
                const lerpFactor = 1 - Math.pow(0.05, dt);
                _newPos.lerp(currentPos, _targetPos, lerpFactor);

                camera.setPosition(_newPos);
                camera.lookAt(0, 0.35, 0);

                // ── Particle rotation: exaggerated mouse reaction + looping 45° sway ──
                if (particlesEntity) {
                    const mouseIntensity = 25; // Exaggerated rotation from mouse
                    particleTargetPitch = -(mouseInfluenceY * mouseIntensity);
                    particleTargetYaw = (mouseInfluenceX * mouseIntensity);

                    // Looping 45° autonomous rotation with varied frequency
                    const autoRotPitch = Math.sin(time * 0.35) * 45;
                    const autoRotYaw = Math.sin(time * 0.22) * 45;

                    const finalPitch = particleTargetPitch + autoRotPitch;
                    const finalYaw = particleTargetYaw + autoRotYaw;

                    // Smooth lerp for the whole particle entity
                    const pLerp = Math.min(1, dt * 1.8);
                    particleCurrentPitch += (finalPitch - particleCurrentPitch) * pLerp;
                    particleCurrentYaw += (finalYaw - particleCurrentYaw) * pLerp;

                    particlesEntity.setEulerAngles(particleCurrentPitch, particleCurrentYaw, 0);
                }

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


// ─── Torch Light (mouse-follow glow on panoramic cards) ──

function setupTorchLight(container) {
    const cards = container.querySelectorAll('.pw-pano-card');
    cards.forEach(card => {
        const torch = card.querySelector('.pw-pano-card__torch');
        if (!torch) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
            const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
            torch.style.setProperty('--torch-x', `${x}%`);
            torch.style.setProperty('--torch-y', `${y}%`);
        });
    });
}


// ─── 3D PlayCanvas Particle System ──────────────────────

function setup3DParticles(app) {
    // Procedural soft glow texture
    const size = 64;
    const texCanvas = document.createElement('canvas');
    texCanvas.width = size;
    texCanvas.height = size;
    const ctx = texCanvas.getContext('2d');

    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new Texture(app.graphicsDevice, {
        width: size,
        height: size,
        format: PIXELFORMAT_SRGBA8,
        mipmaps: true,
        addressU: ADDRESS_CLAMP_TO_EDGE,
        addressV: ADDRESS_CLAMP_TO_EDGE
    });
    texture.setSource(texCanvas);

    // Particle entity
    const particles = new Entity('HeroParticles');
    particles.setPosition(0, 0.5, 0);

    // Alpha: fade in, sustain, fade out — subtle but visible
    const alphaCurve = new Curve([0, 0, 0.15, 0.45, 0.7, 0.4, 1, 0]);

    // Scale: small dust motes
    const scaleCurve = new Curve([0, 0.005, 0.3, 0.018, 0.7, 0.012, 1, 0.003]);

    // Color: light neutral gray
    const colorCurve = new CurveSet([
        [0, 0.75, 0.5, 0.8, 1, 0.7],    // R — light gray
        [0, 0.75, 0.5, 0.8, 1, 0.7],    // G — light gray
        [0, 0.78, 0.5, 0.83, 1, 0.73]   // B — very slightly cool
    ]);

    particles.addComponent('particlesystem', {
        numParticles: 200,
        lifetime: 18,
        rate: 0.06,
        rate2: 0.14,

        // Wide spherical emission
        emitterShape: 1,
        emitterRadius: 5.0,

        // Slow upward drift with slight horizontal wander
        velocityGraph: new CurveSet([
            [0, -0.04, 1, 0.04],   // X drift
            [0, 0.03,  1, 0.08],   // Y upward
            [0, -0.04, 1, 0.04]    // Z drift
        ]),

        scaleGraph: scaleCurve,
        alphaGraph: alphaCurve,
        colorGraph: colorCurve,
        colorMap: texture,

        // Normal blend for subtle dust (not glowing)
        blend: BLEND_ADDITIVEALPHA,
        depthWrite: false,
        lighting: false,
        halfLambert: false,

        // Per-particle rotation: looping ±45° with random frequency
        // rotationSpeedGraph is min, rotationSpeedGraph2 is max (random between)
        rotationSpeedGraph: new Curve([0, -45]),
        rotationSpeedGraph2: new Curve([0, 45]),

        intensity: 1.0,

        loop: true,
        autoPlay: true,
        preWarm: true,
        sort: 1
    });

    app.root.addChild(particles);
    particles.particlesystem.reset();
    particles.particlesystem.play();

    console.log('✨ 3D PlayCanvas ember particles active');
    return particles;
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
