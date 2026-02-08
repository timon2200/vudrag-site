/**
 * Login Page - Interactive Effects
 * 
 * Particle system, cursor-following ambient effects,
 * and form interaction logic.
 */

// API Base URL - uses environment variable in production
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// Check if user is already logged in - redirect to collectors club
function checkAuthAndRedirect() {
    const token = localStorage.getItem('vudrag_token');
    if (token) {
        // User is already authenticated, go directly to collectors club
        window.location.href = '/archive.html';
        return true;
    }
    return false;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, skip to collectors club
    if (checkAuthAndRedirect()) return;

    // Setup interactive effects
    const particleSystem = new ParticleSystem();
    particleSystem.init();

    setupMouseGlow(particleSystem); // Pass system for updates
    setupFormInteraction(particleSystem);
    setupRecoveryInteraction();
});

/**
 * Handle form submission and visual feedback
 */
function setupFormInteraction(particleSystem) {
    const form = document.getElementById('login-form');
    if (!form) return;

    // Trigger visual shockwave on any interaction (focus/click)
    const triggerShock = () => {
        const particles = document.getElementById('particles');
        if (particles) {
            particles.classList.remove('shockwave');
            void particles.offsetWidth; // Force reflow
            particles.classList.add('shockwave');
        }
    };

    // Create validation elements dynamically
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input');
        if (!input) return;

        // Create message container if not exists
        if (!group.querySelector('.validation-message')) {
            const msg = document.createElement('div');
            msg.className = 'validation-message';
            msg.innerHTML = `
                <div class="validation-icon">!</div>
                <span class="validation-text">Required Field</span>
            `;
            group.appendChild(msg);
        }

        // Clear error on input
        input.addEventListener('input', () => {
            group.classList.remove('error');
            const msg = group.querySelector('.validation-message');
            if (msg) msg.classList.remove('active');
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        triggerShock(); // Big shock on submit

        // Validate
        let isValid = true;
        formGroups.forEach(group => {
            const input = group.querySelector('input');
            const msg = group.querySelector('.validation-message');

            if (input && !input.validity.valid) {
                isValid = false;
                group.classList.add('error');
                if (msg) {
                    const text = msg.querySelector('.validation-text');
                    if (input.validity.valueMissing) {
                        text.textContent = 'Please fill in this field';
                    } else if (input.validity.typeMismatch) {
                        text.textContent = 'Invalid format';
                    }
                    msg.classList.add('active');
                }
            }
        });

        if (!isValid) {
            return;
        }

        const btn = form.querySelector('.btn-submit');
        const btnText = form.querySelector('.btn-text');
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Visual Processing State
        btn.style.opacity = '0.7';
        btn.style.cursor = 'wait';
        btnText.textContent = 'Verifying Credentials...';

        try {
            // Real Authentication Call
            const response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();

                // Store Auth Data
                localStorage.setItem('vudrag_token', data.token);
                localStorage.setItem('vudrag_user', JSON.stringify(data.user)); // Optional: store user info

                // === Vault Unlock Animation Sequence ===

                // 1. Trigger button animation
                btn.classList.add('access-granted');
                btnText.textContent = 'Access Granted';

                // 2. Create screen flash overlay
                const flash = document.createElement('div');
                flash.className = 'screen-flash';
                document.body.appendChild(flash);

                // 3. Trigger particle surge
                const particles = document.getElementById('particles');
                if (particles) {
                    particles.classList.add('access-surge');
                }

                // 4. Clean up flash and redirect
                setTimeout(() => {
                    flash.remove();
                }, 1500);

                // Redirect to Collectors Club after animation completes
                setTimeout(() => {
                    // Ideally check role, but for now redirect all valid users
                    window.location.href = '/archive.html';
                }, 1800);

            } else {
                throw new Error('Invalid credentials');
            }

        } catch (error) {
            // Error Visuals
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';

            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btnText.textContent = 'Access Denied';
            btn.style.borderColor = 'var(--color-error)';
            btnText.style.color = 'var(--color-error)';

            // Revert
            setTimeout(() => {
                btnText.textContent = 'Enter Club';
                btn.style.borderColor = '';
                btnText.style.color = '';
            }, 2000);
        }
    });
}

/**
 * Particle System Class
 * Handles generation and management of dust particles
 */
class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particles');
        this.settings = {
            count: 25, // Reduced from 50
            minSize: 1,
            maxSize: 3,
            baseDuration: 41
        };
    }

    init() {
        if (!this.container) return;
        this.generate();
    }

    generate() {
        if (!this.container) return;

        // Clear existing
        this.container.innerHTML = '';

        // Update Base Duration CSS Variable for Animation Sync
        document.documentElement.style.setProperty('--base-duration', `${this.settings.baseDuration}s`);

        for (let i = 0; i < this.settings.count; i++) {
            const particle = document.createElement('div');

            // Randomly assign movement variation (1, 2, or 3)
            const variant = Math.floor(Math.random() * 3) + 1;
            particle.className = `particle particle--${variant}`;

            // Centered Distribution (Gaussian-ish approximation)
            // Average of 3 random numbers pulls values toward 0.5 (center)
            const r1 = Math.random();
            const r2 = Math.random();
            const r3 = Math.random();
            const centeredX = (r1 + r2 + r3) / 3 * 100;

            particle.style.left = `${centeredX}%`;
            particle.style.top = `${Math.random() * 100}%`;

            // Randomize duration slightly around the base
            const durationScale = 0.8 + Math.random() * 0.4;
            const duration = this.settings.baseDuration * durationScale;
            particle.style.setProperty('--anim-duration', `${duration}s`);

            // Staggered delays
            particle.style.animationDelay = `${Math.random() * 12}s`;

            // Dynamic Size
            const size = this.settings.minSize + Math.random() * (this.settings.maxSize - this.settings.minSize);
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            this.container.appendChild(particle);
        }
    }
}

/**
 * Setup "Vault Torch" Spotlight with physics lag
 */
function setupMouseGlow() {
    const root = document.documentElement;
    const particlesContainer = document.getElementById('particles');

    // Config
    const spring = 0.12; // Lower = "heavier" light

    // State
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    // Track mouse
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    // Animation Loop
    function animate() {
        // Smooth interpolation (Lerp)
        currentX += (targetX - currentX) * spring;
        currentY += (targetY - currentY) * spring;

        // Update CSS Variables for the Spotlight Mask and Glow
        root.style.setProperty('--mouse-x', `${currentX}px`);
        root.style.setProperty('--mouse-y', `${currentY}px`);

        // Update percentage for the "Reactive Sheen" on text
        const pctX = (currentX / window.innerWidth) * 100;
        root.style.setProperty('--mouse-x-pct', pctX);

        // Parallax Effect for Particles
        // Subtle opposite movement to mouse
        if (particlesContainer) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const tiltX = (currentX - centerX) * -0.02; // Reverse small movement
            const tiltY = (currentY - centerY) * -0.02;

            particlesContainer.style.transform = `translate(${tiltX}px, ${tiltY}px)`;
        }

        requestAnimationFrame(animate);
    }

    animate();
}


/**
 * Handle Recovery Form Logic
 */
function setupRecoveryInteraction() {
    const loginPanel = document.querySelector('.sculpture__pedestal'); // Gets the first one (Login)
    const recoveryPanel = document.getElementById('recovery-panel');
    const forgotLink = document.getElementById('forgot-link');
    const backBtn = document.getElementById('back-to-login');
    const recoveryForm = document.getElementById('recovery-form');

    if (!forgotLink || !recoveryPanel) return;

    // Toggle Views
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginPanel.style.display = 'none';
        recoveryPanel.style.display = 'block';
    });

    backBtn.addEventListener('click', () => {
        recoveryPanel.style.display = 'none';
        loginPanel.style.display = 'block';
    });

    // Handle Submit
    recoveryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('recovery-email').value;
        const btn = recoveryForm.querySelector('.btn-submit');
        const btnText = recoveryForm.querySelector('.btn-text');
        const msg = document.getElementById('recovery-message');

        if (!email) return;

        btnText.textContent = 'Sending...';
        btn.style.opacity = '0.7';

        try {
            const res = await fetch(`${API_BASE}/request-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            // UI Feedback
            msg.textContent = 'If an account exists, a reset link has been sent.';
            msg.style.color = '#c9a77a';
            btnText.textContent = 'Sent';

            setTimeout(() => {
                // Reset UI
                recoveryPanel.style.display = 'none';
                loginPanel.style.display = 'block';
                btnText.textContent = 'Send Reset Link';
                btn.style.opacity = '1';
                msg.textContent = '';
                document.getElementById('recovery-email').value = '';
            }, 3000);

        } catch (err) {
            console.error(err);
            msg.textContent = 'Error sending email. Try again.';
            msg.style.color = '#ff6b6b';
            btnText.textContent = 'Try Again';
            btn.style.opacity = '1';
        }
    });
}
