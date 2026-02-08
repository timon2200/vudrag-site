/**
 * Footer Section - Premium Dark Footer
 * 
 * Elegant site footer with gold accents, animated elements,
 * and luxury Patek-inspired aesthetic.
 */

import { observeElement } from './scroll-reveal.js';

// CMS API URL
const CMS_API = import.meta.env.VITE_API_BASE || '/api';

// Fallback social links (used if CMS unavailable)
const FALLBACK_SOCIAL_LINKS = [
    { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/vudrag_art/' },
    { name: 'Facebook', icon: 'facebook', url: 'https://web.facebook.com/nikola.vudrag.77' },
    { name: 'Interview', icon: 'article', url: 'https://www.contemporaryartissue.com/a-conversation-with-nikola-vudrag/' }
];

// Fallback navigation links
const FALLBACK_NAV_LINKS = [
    { label: 'Collections', href: '#category-hub' },
    { label: 'Artist', href: '#artist-section' },
    { label: 'Inquire', href: '/contact.html' },
    { label: 'Collectors Club', href: '/login.html' }
];

/**
 * Setup and render the global footer
 */
export async function setupFooter() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    // Check if footer already exists
    if (document.getElementById('main-footer')) return;

    // Create footer element
    const footer = document.createElement('footer');
    footer.id = 'main-footer';
    footer.className = 'site-footer';

    // Render structure matching footer.css
    footer.innerHTML = `
        <div class="footer__border-accent"></div>
        
        <div class="footer__container">
            <!-- Brand Column -->
            <div class="footer__brand" data-reveal>
                <div class="footer__logo">
                    <span class="footer__logo-text">VUDRAG</span>
                    <span class="footer__logo-dot"></span>
                </div>
                <div class="footer__tagline">Sculpting in Light & Shadow</div>
                <p class="footer__description">
                    Exploring the intersection of classical craftsmanship and modern industrial art. 
                    Each piece tells a story of transformation, resilience, and raw power.
                </p>
            </div>

            <!-- Navigation Column -->
            <div class="footer__navigation" data-reveal data-reveal-delay="1">
                <h4 class="footer__heading">Explore</h4>
                <div class="footer__links">
                    <!-- Links injected via JS -->
                </div>
            </div>

            <!-- Contact Column -->
            <div class="footer__contact" data-reveal data-reveal-delay="2">
                <h4 class="footer__heading">Connect</h4>
                <div class="footer__contact-info">
                    <a href="mailto:studio@vudrag.com" class="footer__email">studio@vudrag.com</a>
                    <div class="footer__location">Varaždin • Zagreb • Dubai</div>
                </div>
                <div class="footer__social">
                    <!-- Social icons injected via JS -->
                </div>
            </div>
        </div>

        <!-- Signature Section -->
        <div class="footer__signature" data-reveal>
            <div class="footer__signature-line"></div>
            <div class="footer__monogram">NV</div>
            <div class="footer__signature-line"></div>
        </div>
        
        <!-- Bottom Bar -->
        <div class="footer__bottom">
            <div class="footer__copyright">
                &copy; ${new Date().getFullYear()} Nikola Vudrag. All Rights Reserved.
            </div>
            <div class="footer__crafted">
                Crafted with <span class="footer__crafted-icon">✦</span> by varazdin.studio
            </div>
        </div>

        <!-- Ambient Glows -->
        <div class="footer__glow footer__glow--left"></div>
        <div class="footer__glow footer__glow--right"></div>
    `;

    // Append to content area
    contentArea.appendChild(footer);

    // Populate links
    const linksContainer = footer.querySelector('.footer__links');
    FALLBACK_NAV_LINKS.forEach(link => {
        const a = document.createElement('a');
        a.href = link.href;
        a.className = 'footer__link';
        if (link.href.startsWith('#')) {
            a.dataset.target = link.href.substring(1);
        }
        a.innerHTML = `
            ${link.label}
            <span class="footer__link-arrow">→</span>
        `;
        linksContainer.appendChild(a);
    });

    // Populate social icons
    const socialContainer = footer.querySelector('.footer__social');
    FALLBACK_SOCIAL_LINKS.forEach(social => {
        const a = document.createElement('a');
        a.href = social.url;
        a.className = 'footer__social-link';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.ariaLabel = social.name;
        a.innerHTML = `
            ${getSocialIcon(social.icon)}
            <div class="footer__social-glow"></div>
        `;
        socialContainer.appendChild(a);
    });

    // Initialize animations
    setupFooterAnimations(footer);

    console.log('✅ Footer initialized');
}

// ... (existing code) ...

/**
 * Get SVG icon for social platform
 */
function getSocialIcon(platform) {
    const icons = {
        instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="18" cy="6" r="1" fill="currentColor"/>
        </svg>`,
        linkedin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="2" width="20" height="20" rx="2"/>
            <path d="M8 11v5M8 8v.01M12 16v-5c0-1 1-2 2-2s2 1 2 2v5"/>
        </svg>`,
        artsy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
        </svg>`,
        facebook: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>`,
        article: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>`
    };
    return icons[platform] || '';
}

/**
 * Setup footer animations and reveal effects
 */
function setupFooterAnimations(footer) {
    // Reveal animations for content blocks
    const revealElements = footer.querySelectorAll('[data-reveal]');
    revealElements.forEach(el => observeElement(el));

    // Animated border accent
    const borderAccent = footer.querySelector('.footer__border-accent');
    if (borderAccent) {
        observeElement(borderAccent);
    }

    // Social link hover effects with magnetic feel
    const socialLinks = footer.querySelectorAll('.footer__social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-4px) scale(1.1)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
        });
    });

    // Link arrow animation and click handling
    const navLinks = footer.querySelectorAll('.footer__link');
    navLinks.forEach(link => {
        // Hover effects
        link.addEventListener('mouseenter', () => {
            const arrow = link.querySelector('.footer__link-arrow');
            if (arrow) arrow.style.transform = 'translateX(8px)';
        });
        link.addEventListener('mouseleave', () => {
            const arrow = link.querySelector('.footer__link-arrow');
            if (arrow) arrow.style.transform = '';
        });

        // Navigation handling
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            if (target) {
                import('../systems/navigation.js').then(({ navigateTo }) => {
                    navigateTo(target);
                });
            } else {
                // Allow default navigation (e.g. for /login.html)
                const href = link.getAttribute('href');
                if (href) window.location.href = href;
            }
        });
    });

    // Cursor proximity glow for NV monogram
    setupMonogramGlow(footer);
}

/**
 * Setup cursor proximity glow effect for the NV monogram
 */
function setupMonogramGlow(footer) {
    const monogram = footer.querySelector('.footer__monogram');
    if (!monogram) return;

    // Detect if touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
        // Mobile: Add pulsating animation class
        monogram.classList.add('footer__monogram--pulse');
    } else {
        // Desktop: Track cursor proximity
        let animationFrame = null;

        const updateGlow = (e) => {
            if (animationFrame) cancelAnimationFrame(animationFrame);

            animationFrame = requestAnimationFrame(() => {
                const rect = monogram.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
                const maxDistance = 400; // Max distance for effect
                const intensity = Math.max(0, 1 - distance / maxDistance);

                // Apply glow based on proximity
                const glowSize = 20 + intensity * 60;
                const glowOpacity = 0.3 + intensity * 0.7;

                monogram.style.textShadow = `0 0 ${glowSize}px rgba(201, 167, 122, ${glowOpacity})`;
                monogram.style.opacity = 0.6 + intensity * 0.4;
                monogram.style.setProperty('--stroke-color', `rgba(201, 167, 122, ${0.4 + intensity * 0.6})`);
            });
        };

        // Only track when footer is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.addEventListener('mousemove', updateGlow);
                } else {
                    document.removeEventListener('mousemove', updateGlow);
                    // Reset glow
                    monogram.style.textShadow = '';
                    monogram.style.opacity = '';
                }
            });
        }, { threshold: 0.1 });

        observer.observe(footer);
    }
}
