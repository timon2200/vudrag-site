/**
 * Reset Password Logic
 */

// Basic Particle System for consistency (Simplified version of login.js)
class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particles');
        this.settings = { count: 30, minSize: 1, maxSize: 3, baseDuration: 41 };
    }
    init() {
        if (!this.container) return;
        this.container.innerHTML = '';
        const docStyle = document.documentElement.style;
        docStyle.setProperty('--base-duration', `${this.settings.baseDuration}s`);

        for (let i = 0; i < this.settings.count; i++) {
            const p = document.createElement('div');
            const variant = Math.floor(Math.random() * 3) + 1;
            p.className = `particle particle--${variant}`;

            // Random positioning
            p.style.left = `${Math.random() * 100}%`;
            p.style.top = `${Math.random() * 100}%`;

            const size = this.settings.minSize + Math.random() * (this.settings.maxSize - this.settings.minSize);
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;

            p.style.setProperty('--anim-duration', `${this.settings.baseDuration * (0.8 + Math.random() * 0.4)}s`);
            p.style.animationDelay = `${Math.random() * 12}s`;

            this.container.appendChild(p);
        }
    }
}

// Mouse Glow Effect
function setupMouseGlow() {
    const root = document.documentElement;
    let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
    let currentX = targetX, currentY = targetY;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function animate() {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        root.style.setProperty('--mouse-x', `${currentX}px`);
        root.style.setProperty('--mouse-y', `${currentY}px`);
        root.style.setProperty('--mouse-x-pct', (currentX / window.innerWidth) * 100);
        requestAnimationFrame(animate);
    }
    animate();
}

document.addEventListener('DOMContentLoaded', () => {
    // Visuals
    new ParticleSystem().init();
    setupMouseGlow();

    // Logic
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const form = document.getElementById('reset-form');
    const errorBanner = document.getElementById('error-banner');

    if (!token) {
        showError('Invalid link. Missing security token.');
        form.style.display = 'none';
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const p1 = document.getElementById('new-password').value;
        const p2 = document.getElementById('confirm-password').value;
        const btn = form.querySelector('.btn-submit');
        const btnText = form.querySelector('.btn-text');

        if (p1 !== p2) {
            showError('Passwords do not match.');
            return;
        }

        if (p1.length < 6) {
            showError('Password must be at least 6 characters.');
            return;
        }

        btnText.textContent = 'Updating...';
        btn.style.opacity = '0.7';
        hideError();

        try {
            const res = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: p1 })
            });

            const data = await res.json();

            if (res.ok) {
                btnText.textContent = 'Success';
                btn.style.borderColor = 'var(--color-gold)';
                form.innerHTML = `
                    <div style="text-align: center; color: var(--color-gold); padding: 2rem 0;">
                        <h3 style="margin-bottom: 1rem;">Access Restored</h3>
                        <p style="color: #ccc; margin-bottom: 2rem;">Your credentials have been updated.</p>
                        <a href="/login.html" class="btn-submit" style="display: inline-block; text-decoration: none; color: white;">
                            Return to Login
                        </a>
                    </div>
                `;
            } else {
                throw new Error(data.error || 'Failed to update password');
            }
        } catch (err) {
            console.error(err);
            showError(err.message || 'Server error. Link may be expired.');
            btnText.textContent = 'Update Credentials';
            btn.style.opacity = '1';
        }
    });

    function showError(msg) {
        errorBanner.textContent = msg;
        errorBanner.style.display = 'block';
    }

    function hideError() {
        errorBanner.style.display = 'none';
    }
});
