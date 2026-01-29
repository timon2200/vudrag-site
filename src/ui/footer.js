/**
 * Footer Section - Premium Dark Footer
 * 
 * Elegant site footer with gold accents, animated elements,
 * and luxury Patek-inspired aesthetic.
 */

import { observeElement } from './scroll-reveal.js';

// CMS API URL
const CMS_API = '/api';

// Fallback social links (used if CMS unavailable)
const FALLBACK_SOCIAL_LINKS = [
    { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/nikola.vudrag' },
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/in/nikolavudrag' },
    { name: 'Artsy', icon: 'artsy', url: 'https://artsy.net/artist/nikola-vudrag' }
];

// Fallback navigation links
const FALLBACK_NAV_LINKS = [
    { label: 'Collections', href: '#category-hub' },
    { label: 'Artist', href: '#artist-section' },
    { label: 'Inquire', href: '/contact.html' }
];

// Fallback footer content
const FALLBACK_CONTENT = {
    brand: 'VUDRAG',
    tagline: 'Sculptures in Light',
    description: 'Creating photorealistic bronze sculptures that bridge classical mastery with contemporary vision.',
    email: 'studio@nikolavudrag.com',
    location: 'Varaždin, Croatia',
    navLinks: FALLBACK_NAV_LINKS,
    socialLinks: FALLBACK_SOCIAL_LINKS
};

// Module-level content variable
let footerContent = FALLBACK_CONTENT;

/**
 * Fetch footer content from CMS
 */
async function fetchFooterContent() {
    try {
        const response = await fetch(`${CMS_API}/site-content`);
        if (!response.ok) throw new Error('CMS unavailable');
        const data = await response.json();
        return {
            brand: data.footer?.brand || FALLBACK_CONTENT.brand,
            tagline: data.footer?.tagline || FALLBACK_CONTENT.tagline,
            description: data.footer?.description || FALLBACK_CONTENT.description,
            email: data.footer?.email || FALLBACK_CONTENT.email,
            location: data.footer?.location || FALLBACK_CONTENT.location,
            navLinks: data.footer?.navLinks || FALLBACK_NAV_LINKS,
            socialLinks: data.footer?.socialLinks || FALLBACK_SOCIAL_LINKS
        };
    } catch (err) {
        console.warn('⚠️ CMS unavailable, using fallback footer content');
        return FALLBACK_CONTENT;
    }
}

/**
 * Create the footer section
 */
export async function setupFooter() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) {
        console.warn('⚠️ Content area not found for footer');
        return null;
    }

    // Fetch content from CMS
    footerContent = await fetchFooterContent();

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = createFooterMarkup();

    contentArea.appendChild(footer);

    // Setup animations and reveals
    setupFooterAnimations(footer);

    console.log('✨ Footer section initialized');
    return footer;
}

/**
 * Generate footer HTML structure
 */
function createFooterMarkup() {
    return `
        <!-- Decorative top border -->
        <div class="footer__border-accent"></div>

        <!-- Main footer content -->
        <div class="footer__container">
            <!-- Brand column -->
            <div class="footer__brand" data-reveal>
                <div class="footer__logo">
                    <span class="footer__logo-text">${footerContent.brand}</span>
                    <span class="footer__logo-dot"></span>
                </div>
                <p class="footer__tagline">${footerContent.tagline}</p>
                <p class="footer__description">${footerContent.description}</p>
            </div>

            <!-- Navigation column -->
            <div class="footer__nav" data-reveal data-reveal-delay="1">
                <h4 class="footer__heading">Explore</h4>
                <nav class="footer__links">
                    ${footerContent.navLinks
            .filter(link => {
                const lower = link.label.toLowerCase();
                // Remove Works/Gallery as requested
                return !lower.includes('work') && !lower.includes('gallery');
            })
            .map(link => {
                // Map labels/hrefs to targets if not present
                let target = '';
                let label = link.label;
                const lowerLabel = link.label.toLowerCase();

                if (lowerLabel.includes('collection')) target = 'category-hub';
                else if (lowerLabel.includes('about') || lowerLabel.includes('artist')) {
                    target = 'artist';
                    label = 'Artist';
                }
                else if (lowerLabel.includes('contact') || lowerLabel.includes('inquire')) {
                    target = 'contact';
                    label = 'Inquire';
                }

                return `
                        <a href="${link.href}" class="footer__link" data-target="${target}">
                            <span class="footer__link-text">${label}</span>
                            <span class="footer__link-arrow">▸</span>
                        </a>
                    `}).join('')}
                </nav>
            </div>

            <!-- Contact column -->
            <div class="footer__contact" data-reveal data-reveal-delay="2">
                <h4 class="footer__heading">Contact</h4>
                <div class="footer__contact-info">
                    <a href="mailto:${footerContent.email}" class="footer__email">
                        ${footerContent.email}
                    </a>
                    <p class="footer__location">${footerContent.location}</p>
                </div>
                
                <!-- Social links -->
                <div class="footer__social">
                    ${footerContent.socialLinks.map(social => `
                        <a href="${social.url}" 
                           class="footer__social-link" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           aria-label="${social.name}">
                            ${getSocialIcon(social.icon)}
                            <span class="footer__social-glow"></span>
                        </a>
                    `).join('')}
                </div>
            </div>
        </div>

        <!-- Decorative signature element -->
        <div class="footer__signature" data-reveal data-reveal-delay="3">
            <div class="footer__signature-line"></div>
            <span class="footer__monogram">NV</span>
            <div class="footer__signature-line"></div>
        </div>

        <!-- Bottom bar -->
        <div class="footer__bottom">
            <p class="footer__copyright">
                © ${new Date().getFullYear()} Nikola Vudrag. All rights reserved.
            </p>
            <p class="footer__crafted">
                <span class="footer__crafted-icon">◈</span>
                Crafted by <a href="https://studio.varazdin" class="footer__studio-link" target="_blank" rel="noopener">studio.varaždin</a>
            </p>
        </div>

        <!-- Ambient glow effects -->
        <div class="footer__glow footer__glow--left"></div>
        <div class="footer__glow footer__glow--right"></div>
    `;
}

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
