/**
 * Contact Page - Interactive Effects
 * 
 * Particle system, cursor-following ambient effects,
 * and CMS-driven content for the sculpture-inspired contact page.
 */

// CMS API URL
const CMS_API = '/api';

// Fallback content (used if CMS unavailable)
const FALLBACK_CONTENT = {
    label: 'Correspondence',
    titleLine1: 'Get in',
    titleLine2: 'Touch',
    text: 'For commissions, exhibitions, or simply to share your thoughts on the interplay of form and light—I welcome your message.',
    email: 'studio@nikolavudrag.com',
    signatureName: 'Nikola Vudrag',
    signatureLocation: 'Varaždin, Croatia'
};

/**
 * Fetch contact content from CMS
 */
async function fetchContactContent() {
    try {
        const response = await fetch(`${CMS_API}/site-content`);
        if (!response.ok) throw new Error('CMS unavailable');
        const data = await response.json();
        return {
            label: data.contact?.label || FALLBACK_CONTENT.label,
            titleLine1: data.contact?.titleLine1 || FALLBACK_CONTENT.titleLine1,
            titleLine2: data.contact?.titleLine2 || FALLBACK_CONTENT.titleLine2,
            text: data.contact?.text || FALLBACK_CONTENT.text,
            email: data.contact?.email || FALLBACK_CONTENT.email,
            signatureName: data.contact?.signatureName || FALLBACK_CONTENT.signatureName,
            signatureLocation: data.contact?.signatureLocation || FALLBACK_CONTENT.signatureLocation
        };
    } catch (err) {
        console.warn('⚠️ CMS unavailable, using fallback contact content');
        return FALLBACK_CONTENT;
    }
}

/**
 * Populate page with CMS content
 */
function populateContent(content) {
    // Label
    const label = document.querySelector('.sculpture__label');
    if (label) label.textContent = content.label;

    // Title
    const titleWord = document.querySelector('.sculpture__title-word');
    const titleAccent = document.querySelector('.sculpture__title-accent');
    if (titleWord) titleWord.textContent = content.titleLine1;
    if (titleAccent) titleAccent.textContent = content.titleLine2;

    // Invitation text
    const text = document.querySelector('.sculpture__text');
    if (text) text.textContent = content.text;

    // Email
    const emailLink = document.querySelector('.sculpture__email');
    if (emailLink) {
        emailLink.href = `mailto:${content.email}`;
        emailLink.textContent = content.email;
    }

    // Signature
    const signatureName = document.querySelector('.signature__text');
    const signatureLocation = document.querySelector('.signature__location');
    if (signatureName) signatureName.textContent = content.signatureName;
    if (signatureLocation) signatureLocation.textContent = content.signatureLocation;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Load and populate CMS content
    const content = await fetchContactContent();
    populateContent(content);

    // Setup interactive effects
    createParticles();
    setupEmailInteraction();
    setupMouseGlow();
});

/**
 * Create floating gold particles
 */
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random positioning
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${50 + Math.random() * 50}%`;

        // Random animation timing
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.animationDuration = `${6 + Math.random() * 6}s`;

        // Random size
        const size = 1 + Math.random() * 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        container.appendChild(particle);
    }
}

/**
 * Setup email hover interaction with sound-like glow pulse
 */
function setupEmailInteraction() {
    const emailFrame = document.querySelector('.sculpture__email-frame');
    if (!emailFrame) return;

    const email = emailFrame.querySelector('.sculpture__email');

    // Add subtle magnetic effect
    emailFrame.addEventListener('mousemove', (e) => {
        const rect = emailFrame.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / 20;
        const deltaY = (e.clientY - centerY) / 20;

        email.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });

    emailFrame.addEventListener('mouseleave', () => {
        email.style.transform = '';
    });
}

/**
 * Create cursor-following ambient glow
 */
function setupMouseGlow() {
    // Create glow element
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(201, 167, 122, 0.08) 0%, transparent 70%);
        pointer-events: none;
        z-index: 2;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        opacity: 0;
    `;
    document.body.appendChild(glow);

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });

    // Smooth follow animation
    function animateGlow() {
        // Ease towards mouse position
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;

        glow.style.left = `${glowX}px`;
        glow.style.top = `${glowY}px`;

        requestAnimationFrame(animateGlow);
    }

    animateGlow();
}
