const API_BASE = import.meta.env.VITE_API_BASE || '/api';

document.addEventListener('DOMContentLoaded', async () => {
    setupLogout();
    setupUser();
    await loadFeed();
    setupScrollReveal();
});

function setupLogout() {
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('vudrag_token');
        localStorage.removeItem('vudrag_user');
        window.location.href = '/login.html';
    });
}

function setupUser() {
    const userStr = localStorage.getItem('vudrag_user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            document.getElementById('user-display').textContent = user.name || user.email;
        } catch (e) { }
    }
}

async function loadFeed() {
    const container = document.getElementById('feed-grid');
    const token = localStorage.getItem('vudrag_token');

    try {
        const response = await fetch(`${API_BASE}/archive-posts`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to load');

        const posts = await response.json();

        if (posts.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">No items in the archive yet.</div>';
            return;
        }

        container.innerHTML = posts.map(renderPost).join('');
        // Re-run scroll reveal setup for new elements
        setupScrollReveal();

    } catch (err) {
        console.error(err);
        container.innerHTML = '<div style="text-align: center; color: #a84444;">Unable to retrieve archive data.</div>';
    }
}

function renderPost(post) {
    const blocksHtml = post.content.map(renderBlock).join('');

    return `
        <article class="post-card">
            <header class="post-header">
                <div class="post-meta">
                    <span>${new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    ${post.tags && post.tags.length ? `<span>• ${post.tags[0]}</span>` : ''}
                </div>
                <h2 class="post-title">${post.title}</h2>
            </header>
            <div class="post-content">
                ${blocksHtml}
            </div>
            <div class="post-signature">
                <span class="signature-text">Nikola Vudrag</span>
            </div>
        </article>
    `;
}

function renderBlock(block) {
    if (block.type === 'text') {
        const html = block.value.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '<br>').join('');
        return `<div class="content-block block-text">${html}</div>`;
    }
    else if (block.type === 'image') {
        return `<div class="content-block block-image"><img src="${block.value}" alt="Archive Image" loading="lazy"></div>`;
    }
    else if (block.type === 'video') {
        let src = block.value;
        if (src.includes('youtube.com') || src.includes('youtu.be')) {
            // Simple ID extraction
            let id = '';
            if (src.includes('v=')) id = src.split('v=')[1].split('&')[0];
            else if (src.includes('youtu.be/')) id = src.split('youtu.be/')[1].split('?')[0];

            if (id) {
                src = `https://www.youtube.com/embed/${id}?modestbranding=1&rel=0`;
                return `<div class="content-block block-video"><iframe src="${src}" allowfullscreen></iframe></div>`;
            }
        }
        return `<div class="content-block block-video"><video src="${src}" controls></video></div>`;
    }
    return '';
}

function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });


    document.querySelectorAll('.post-card').forEach(card => observer.observe(card));
}

// === Particles Logic ===
class ParticleSystem {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.settings = {
            count: 40,
            minSize: 1,
            maxSize: 3,
            baseDuration: 20, // Faster by default (was 40)
            direction: 'up', // 'up' or 'down' (default logic is up)
            ...options
        };
    }

    init() {
        if (!this.container) return;
        this.generate();
    }

    generate() {
        if (!this.container) return;
        this.container.innerHTML = '';

        // Ensure container has relative positioning if not absolute
        if (window.getComputedStyle(this.container).position === 'static') {
            this.container.style.position = 'relative';
        }

        for (let i = 0; i < this.settings.count; i++) {
            const particle = document.createElement('div');
            const variant = Math.floor(Math.random() * 3) + 1;
            particle.className = `particle particle--${variant}`;

            const r1 = Math.random();
            const r2 = Math.random();
            const r3 = Math.random();
            const centeredX = (r1 + r2 + r3) / 3 * 100;

            particle.style.left = `${centeredX}%`;
            particle.style.top = `${Math.random() * 100}%`;

            const durationScale = 0.5 + Math.random() * 0.5; // Faster range
            const duration = this.settings.baseDuration * durationScale;
            particle.style.setProperty('--anim-duration', `${duration}s`);
            particle.style.animationDelay = `${Math.random() * 5}s`; // Shorter delay

            const size = this.settings.minSize + Math.random() * (this.settings.maxSize - this.settings.minSize);
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Custom animation speed override
            particle.style.animationDuration = `${duration}s`;

            this.container.appendChild(particle);
        }
    }
}

// Initialize particles for hero
new ParticleSystem('particles', { count: 30, baseDuration: 25 }).init();

// Initialize particles for footer (if exists)
new ParticleSystem('footer-particles', { count: 50, baseDuration: 15 }).init();
