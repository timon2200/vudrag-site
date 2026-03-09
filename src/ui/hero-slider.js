/**
 * Hero Slider — GSAP ScrollTrigger Cinematic Carousel
 * 
 * Full-viewport hero with 3 slides driven by GSAP ScrollTrigger.
 * All transitions are GSAP-native for buttery-smooth, interruptible animations.
 * 
 * Features:
 * - GSAP handles pinning, scrubbing, and scroll-snap
 * - GSAP-driven crossfade and Ken Burns image transitions
 * - GSAP-driven staggered text reveal animations
 * - Unique particle overlay effect (desert storm)
 * - Mouse parallax on images
 * - Vertical progress indicator
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupDesertStorm, setEffect, pauseDesertStorm, resumeDesertStorm, setStormIntensity, triggerBurst } from './desert-storm.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════
// Slide Configuration
// ═══════════════════════════════════

const SLIDES = [
    {
        image: '/images/VUDRAG-BOOK-MMXXV_Page_03_Image_0001.jpg',
        title: 'IRON MAIDEN',
        subtitle: 'Monumental Steel',
        eyebrow: 'Nikola Vudrag',
        effect: 'sandstorm',
        objectPosition: 'center 35%',
    },
    {
        image: '/images/VUDRAG-BOOK-MMXXV_Page_20_Image_0001.jpg',
        title: 'NETWORKING',
        subtitle: 'Latticework & Light',
        eyebrow: 'The Net-Work Series',
        effect: 'embers',
        objectPosition: 'center 50%',
    },
    {
        image: '/images/VUDRAG-BOOK-MMXXV_Page_40_Image_0001.jpg',
        title: 'ROMISLAV',
        subtitle: 'Bronze & Memory',
        eyebrow: 'Portrait Series',
        effect: 'dust',
        objectPosition: 'center 30%',
    }
];



// State
let heroSection = null;
let scrollZone = null;
let slideElements = [];
let contentEl = null;
let progressFill = null;
let progressNumbers = [];
let currentSlide = 0;
let isHeroVisible = true;
let heroFade = 1;

// Active GSAP transition timeline (killable for interrupts)
let activeTransition = null;

// Mobile fallback auto-advance
let autoAdvanceTimer = null;
let isMobile = false;

// GSAP ScrollTrigger instance
let heroScrollTrigger = null;

/**
 * Setup the hero slider
 */
export function setupHeroSlider() {
    heroSection = document.getElementById('hero-section');
    scrollZone = document.getElementById('hero-scroll-zone');
    if (!heroSection) return;

    isMobile = window.innerWidth < 768 || 'ontouchstart' in window;

    // Build slides HTML
    const slidesHTML = SLIDES.map((slide, i) => `
        <div class="hero-slide ${i === 0 ? 'active' : ''}" data-slide="${i}">
            <div class="hero-image-wrapper">
                <img 
                    class="hero-image" 
                    src="${slide.image}" 
                    alt="${slide.title}"
                    style="object-position: ${slide.objectPosition}"
                    draggable="false"
                />
            </div>
        </div>
    `).join('');

    // Build progress indicator
    const progressHTML = `
        <div class="hero-progress" aria-hidden="true">
            <div class="hero-progress-track">
                <div class="hero-progress-fill"></div>
            </div>
            <div class="hero-progress-numbers">
                ${SLIDES.map((_, i) => `<span class="hero-progress-num ${i === 0 ? 'active' : ''}" data-num="${i}">${String(i + 1).padStart(2, '0')}</span>`).join('')}
            </div>
        </div>
    `;

    // Active slide content (shared, updates on transition)
    heroSection.innerHTML = `
        ${slidesHTML}
        <div class="hero-gradient-overlay"></div>
        <div class="hero-content">
            <div class="hero-decorative-top">
                <span class="hero-slide-counter">01</span>
                <div class="hero-decorative-line"></div>
                <span class="hero-eyebrow">${SLIDES[0].eyebrow}</span>
            </div>
            <h1 class="hero-title">${SLIDES[0].title}</h1>
            <p class="hero-subtitle">${SLIDES[0].subtitle}</p>
            <div class="hero-decorative-bottom">
                <a href="/gallery.html" class="hero-cta">
                    <span>EXPLORE THE WORK</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
        </div>
        ${progressHTML}
        <div id="scroll-hint">
            <span>Scroll to explore</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
        </div>
    `;

    // Cache DOM refs
    slideElements = heroSection.querySelectorAll('.hero-slide');
    contentEl = heroSection.querySelector('.hero-content');
    progressFill = heroSection.querySelector('.hero-progress-fill');
    progressNumbers = heroSection.querySelectorAll('.hero-progress-num');

    // Preload all images
    SLIDES.forEach((slide, i) => {
        const img = new Image();
        img.src = slide.image;
        img.onload = () => {
            const imgEl = slideElements[i]?.querySelector('.hero-image');
            if (imgEl) imgEl.classList.add('loaded');
        };
    });


    // Setup desert storm on hero
    setupDesertStorm(heroSection);
    setEffect(SLIDES[0].effect);

    // Setup GSAP ScrollTrigger for desktop, auto-advance for mobile
    if (isMobile) {
        startAutoAdvance();
    } else {
        setupScrollTrigger();
    }

    console.log('🎬 Hero slider initialized with', SLIDES.length, 'slides (GSAP ScrollTrigger)');
}

/**
 * Setup GSAP ScrollTrigger — handles pinning, scrubbing, and snapping
 */
function setupScrollTrigger() {
    if (!heroSection) return;

    // Scroll distance — 200vh for responsive slide switching
    const scrollDistance = window.innerHeight * 2;

    // Build snap points: one per slide [0, 0.5, 1] for 3 slides
    const snapPoints = SLIDES.map((_, i) => i / (SLIDES.length - 1));

    heroScrollTrigger = ScrollTrigger.create({
        trigger: heroSection,
        pin: true,
        start: 'top top',
        end: `+=${scrollDistance}`,
        scrub: 0.3,          // Fast catch-up for responsive feel
        anticipatePin: 1,    // Pre-pins slightly early to avoid visual jump
        snap: {
            snapTo: snapPoints,
            duration: { min: 0.2, max: 0.6 },   // Quick magnetic snap
            delay: 0.08,                          // Minimal pause before snapping
            ease: 'power2.inOut',                 // Smooth easing curve
        },
        onUpdate: (self) => {
            const progress = self.progress;

            // Determine target slide from scroll progress
            const targetSlide = Math.min(
                SLIDES.length - 1,
                Math.floor(progress * SLIDES.length)
            );
            const clampedSlide = Math.min(SLIDES.length - 1, targetSlide);

            if (clampedSlide !== currentSlide) {
                goToSlide(clampedSlide);
            }

            // Smooth progress bar update
            if (progressFill) {
                gsap.to(progressFill, {
                    height: `${progress * 100}%`,
                    duration: 0.3,
                    ease: 'power2.out',
                    overwrite: true,
                });
            }

            // ── Scroll-driven text parallax ──
            // Compute intra-slide progress (0→1 within each slide's scroll range)
            const slideCount = SLIDES.length;
            const slideProgress = (progress * slideCount) - clampedSlide;
            // Center it: -0.5 to +0.5 so text rests at center when snapped
            const centered = Math.max(-0.5, Math.min(0.5, slideProgress - 0.5));

            if (contentEl) {
                const topDecor = contentEl.querySelector('.hero-decorative-top');
                const title = contentEl.querySelector('.hero-title');
                const subtitle = contentEl.querySelector('.hero-subtitle');
                const bottomDecor = contentEl.querySelector('.hero-decorative-bottom');

                // Each element shifts at a different rate for depth
                if (topDecor) {
                    gsap.to(topDecor, {
                        y: centered * -30,
                        duration: 0.4,
                        ease: 'power2.out',
                        overwrite: 'auto',
                    });
                }
                if (title) {
                    gsap.to(title, {
                        y: centered * -20,
                        duration: 0.4,
                        ease: 'power2.out',
                        overwrite: 'auto',
                    });
                }
                if (subtitle) {
                    gsap.to(subtitle, {
                        y: centered * -12,
                        duration: 0.4,
                        ease: 'power2.out',
                        overwrite: 'auto',
                    });
                }
                if (bottomDecor) {
                    gsap.to(bottomDecor, {
                        y: centered * -8,
                        duration: 0.4,
                        ease: 'power2.out',
                        overwrite: 'auto',
                    });
                }
            }

            // Subtle image parallax on the active slide
            const activeSlideEl = slideElements[clampedSlide];
            if (activeSlideEl) {
                const activeImg = activeSlideEl.querySelector('.hero-image');
                if (activeImg) {
                    gsap.to(activeImg, {
                        y: centered * 15,
                        duration: 0.5,
                        ease: 'power2.out',
                        overwrite: 'auto',
                    });
                }
            }

            // Scroll hint
            const scrollHint = document.getElementById('scroll-hint');
            if (scrollHint) {
                if (progress > 0.02) {
                    scrollHint.classList.add('hidden');
                } else {
                    scrollHint.classList.remove('hidden');
                }
            }
        },
        onLeave: () => {
            // Hero stays visible — content scrolls over it naturally.
            // Just pause heavy effects for performance.
            pauseDesertStorm();
        },
        onEnterBack: () => {
            // Resume effects when scrolling back into hero zone
            isHeroVisible = true;
            resumeDesertStorm();
        },
        onEnter: () => {
            heroSection.style.visibility = 'visible';
            isHeroVisible = true;
            resumeDesertStorm();
        },
    });

    // Performance: hide hero completely once it's well below viewport
    ScrollTrigger.create({
        trigger: heroSection,
        start: 'bottom top-=50%',
        onEnter: () => {
            // Hero is well above viewport — hide for performance
            isHeroVisible = false;
            heroSection.style.visibility = 'hidden';
        },
        onLeaveBack: () => {
            // Scrolling back up — show hero again
            heroSection.style.visibility = 'visible';
            isHeroVisible = true;
        },
    });
}

/**
 * Go to a specific slide with cinematic GSAP-driven transition
 * All animations are GSAP tweens — interruptible and buttery smooth
 */
function goToSlide(index) {
    if (index === currentSlide) return;

    // Kill any active transition for clean interrupts
    if (activeTransition) {
        activeTransition.kill();
        activeTransition = null;

        // Clean up: if we killed a transition midway, ensure only the outgoing
        // and incoming slides are visible. Force all others to 0 opacity.
        slideElements.forEach((el, i) => {
            if (i !== currentSlide && i !== index) {
                gsap.set(el, { opacity: 0 });
                el.classList.remove('active');
            }
        });
    }

    const prevIndex = currentSlide;
    currentSlide = index;

    const prevSlideEl = slideElements[prevIndex];
    const nextSlideEl = slideElements[currentSlide];
    const slide = SLIDES[currentSlide];

    // Create a master timeline for this transition
    const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => {
            activeTransition = null;
        }
    });
    activeTransition = tl;

    // === Phase 1: Text exit — fast simultaneous fade ===
    const textElements = contentEl ? [
        contentEl.querySelector('.hero-decorative-top'),
        contentEl.querySelector('.hero-title'),
        contentEl.querySelector('.hero-subtitle'),
        contentEl.querySelector('.hero-decorative-bottom'),
    ].filter(Boolean) : [];

    if (textElements.length) {
        tl.to(textElements, {
            y: -15,
            opacity: 0,
            duration: 0.2,
            stagger: 0.02,
            ease: 'power2.in',
        });
    }

    // === Phase 2: Image crossfade + Ken Burns (fast) ===
    tl.add(() => {
        triggerBurst();
        // Swap text content immediately during crossfade
        if (contentEl) {
            contentEl.querySelector('.hero-slide-counter').textContent = String(currentSlide + 1).padStart(2, '0');
            contentEl.querySelector('.hero-eyebrow').textContent = slide.eyebrow;
            contentEl.querySelector('.hero-title').textContent = slide.title;
            contentEl.querySelector('.hero-subtitle').textContent = slide.subtitle;
        }
        setEffect(slide.effect);
        updateProgress(currentSlide);
    });

    // Outgoing: quick fade + subtle zoom
    if (prevSlideEl) {
        const prevImg = prevSlideEl.querySelector('.hero-image');
        tl.to(prevSlideEl, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: () => {
                prevSlideEl.classList.remove('active');
            }
        }, '<');
        if (prevImg) {
            tl.to(prevImg, {
                scale: 1.12,
                x: -4,
                y: -2,
                duration: 0.4,
                ease: 'power2.inOut',
            }, '<');
        }
    }

    // Incoming: fast fade in + Ken Burns settle
    if (nextSlideEl) {
        nextSlideEl.classList.add('active');
        const nextImg = nextSlideEl.querySelector('.hero-image');

        gsap.set(nextSlideEl, { opacity: 0 });
        if (nextImg) {
            gsap.set(nextImg, { scale: 1.10, x: 5, y: 3 });
        }

        tl.to(nextSlideEl, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.inOut',
        }, '<0.05');

        if (nextImg) {
            tl.to(nextImg, {
                scale: 1.08,
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'power2.out',
            }, '<');
        }
    }

    // === Phase 3: Text enter — fast staggered reveal ===
    if (textElements.length) {
        tl.set(textElements, { y: 12, opacity: 0 });
        tl.to(textElements, {
            y: 0,
            opacity: 1,
            duration: 0.25,
            stagger: 0.03,
            ease: 'power2.out',
        }, '-=0.15');
    }
}

/**
 * Update the vertical progress indicator
 */
function updateProgress(slideIndex) {
    progressNumbers.forEach((num, i) => {
        num.classList.toggle('active', i === slideIndex);
    });
}

/**
 * Mobile auto-advance fallback
 */
function startAutoAdvance() {
    autoAdvanceTimer = setInterval(() => {
        if (!isHeroVisible) return;
        const next = (currentSlide + 1) % SLIDES.length;
        goToSlide(next);
    }, 5000);
}

/**
 * Update hero slider — called from main rAF loop
 * Scroll logic is entirely GSAP; this handles mobile fade only.
 * @param {number} scrollY - Current window.scrollY
 * @param {number} dt - Delta time in seconds
 */
export function updateHeroSlider(scrollY, dt) {
    if (!heroSection || !isHeroVisible) return;

    // Mobile: handle hero fade manually
    if (isMobile) {
        const viewportH = window.innerHeight;
        const scrollRatio = Math.min(scrollY / viewportH, 1.5);
        if (scrollRatio < 0.1) {
            heroFade = 1;
        } else if (scrollRatio > 0.6) {
            heroFade = 0;
        } else {
            heroFade = 1 - (scrollRatio - 0.1) / 0.5;
        }

        if (contentEl) contentEl.style.opacity = heroFade;
        heroSection.style.opacity = heroFade;

        if (heroFade < 0.02 && isHeroVisible) {
            isHeroVisible = false;
            pauseDesertStorm();
            heroSection.style.visibility = 'hidden';
        } else if (heroFade >= 0.02 && !isHeroVisible) {
            isHeroVisible = true;
            resumeDesertStorm();
            heroSection.style.visibility = 'visible';
        }

        setStormIntensity(heroFade);

        // Scroll hint
        const scrollHint = document.getElementById('scroll-hint');
        if (scrollHint) {
            scrollHint.classList.toggle('hidden', scrollY > 50);
        }
    }
}

/**
 * Get current hero fade for external systems
 */
export function getHeroFade() {
    return heroFade;
}
