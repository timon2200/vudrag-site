/**
 * Menu Overlay
 * 
 * Full-screen navigation overlay that appears when clicking the hamburger menu.
 * Provides access to major site sections.
 * Content fetched from CMS, with hardcoded fallback.
 */

import { navigateTo } from '../systems/navigation.js';

// CMS API URL
const CMS_API = import.meta.env.VITE_API_BASE || '/api';

let overlay = null;
let isOpen = false;

// Fallback menu data
const FALLBACK_MENU = {
    links: [
        { label: 'Gallery', target: 'hero' },
        { label: 'Collections', target: 'category-hub' },
        { label: 'Artist', target: 'artist' },
        { label: 'Inquire', target: 'contact' },
        { label: 'Collectors Club', href: '/login.html' }
    ],
    brand: 'Nikola Vudrag',
    tagline: 'From Atom to Atlas'
};

/**
 * Fetch menu content from CMS
 */
async function fetchMenuContent() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(`${CMS_API}/site-content`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('CMS unavailable');
        const data = await response.json();

        if (data.footer) {
            // Map footer navLinks to menu format
            const navLinks = (data.footer.navLinks && data.footer.navLinks.length > 0)
                ? data.footer.navLinks.map(link => {
                    if (link.href.startsWith('#')) {
                        return { label: link.label, target: link.href.substring(1) };
                    }
                    return { label: link.label, href: link.href };
                })
                : FALLBACK_MENU.links;

            return {
                links: navLinks,
                brand: data.footer.brand || FALLBACK_MENU.brand,
                tagline: data.footer.tagline || FALLBACK_MENU.tagline
            };
        }
        return FALLBACK_MENU;
    } catch (err) {
        console.warn('⚠️ CMS unavailable, using fallback menu content');
        return FALLBACK_MENU;
    }
}

/**
 * Create and inject the menu overlay
 */
export async function createMenuOverlay() {
    // Check if already exists
    if (document.querySelector('.menu-overlay')) return;

    // Fetch content from CMS
    const menuData = await fetchMenuContent();

    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';

    // Build links HTML
    const linksHTML = menuData.links.map(link => {
        if (link.target) {
            return `<a href="#" class="menu-link" data-target="${link.target}">${link.label}</a>`;
        }
        return `<a href="${link.href}" class="menu-link">${link.label}</a>`;
    }).join('\n            ');

    overlay.innerHTML = `
        <button class="menu-close" aria-label="Close menu">
            <span></span>
            <span></span>
        </button>
        
        <div class="menu-overlay-content">
            ${linksHTML}
            
            <div class="menu-info">
                ${menuData.brand}<br>
                ${menuData.tagline}
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Event listeners
    const closeBtn = overlay.querySelector('.menu-close');
    closeBtn.addEventListener('click', closeMenu);

    const links = overlay.querySelectorAll('.menu-link');
    links.forEach(link => {
        link.addEventListener('click', handleMenuClick);
    });

    // Listen for global toggle events (from static header)
    window.addEventListener('toggle-menu', toggleMenu);

    console.log('🍔 Menu overlay created (CMS-driven)');
}

/**
 * Open the menu overlay
 */
export function openMenu() {
    if (!overlay) createMenuOverlay();

    isOpen = true;
    overlay.classList.add('visible');

    // Disable main scroll
    document.body.style.overflow = 'hidden';
}

/**
 * Close the menu overlay
 */
export function closeMenu() {
    if (!overlay) return;

    isOpen = false;
    overlay.classList.remove('visible');

    // Re-enable scroll
    document.body.style.overflow = '';
}

/**
 * Toggle menu state
 */
export function toggleMenu() {
    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

/**
 * Handle menu link clicks
 */
function handleMenuClick(e) {
    const target = e.target.getAttribute('data-target');

    if (target) {
        e.preventDefault();
        closeMenu();
        navigateTo(target);
    }
    // If no target, allow default link behavior (e.g. /login.html)
}

