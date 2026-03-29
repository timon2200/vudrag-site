/**
 * Coins Lab — Interactive Numismatic Showcase
 * 
 * Main orchestrator: coin data, grid builder, interactions, panel management.
 * Uses CSS-based lighting on grid cards (performance) and WebGL2 PBR
 * in the detail panel (fidelity).
 */

import './styles/coins-lab.css';

// ═══════════════════════════════════════════
// Coin Data
// ═══════════════════════════════════════════

const BASE_PATH = '/images/coins/transparent';

const COINS = [
    {
        id: 'tesla-gold',
        file: 'tesla gold',
        title: 'Nikola Tesla',
        subtitle: '20 Euro Cent · 2023',
        description: 'Official Croatian 20 euro cent for eurozone circulation. Tesla\'s portrait emerges from electromagnetic waves across the national checkerboard — identity and invention fused in 40mm of engraved steel.',
    },
    {
        id: 'tesla-silver',
        file: 'tesla sliver',
        title: 'Nikola Tesla',
        subtitle: '50 Euro Cent · 2023',
        description: 'The fifty-cent variant renders the same sculptural portrait in silver-toned alloy. Identical composition, distinct material — each denomination reads the die differently.',
    },
    {
        id: 'dalmatiner',
        file: 'dalmatiner',
        title: 'Dalmatian',
        subtitle: '1 Euro · Croatia 2023',
        description: 'Croatia\'s one-euro coin presents the Dalmatian — a breed born on the Adriatic coast. High-relief engraving captures the muscular stance against the national checkerboard.',
    },
    {
        id: 'tomislav-2eur',
        file: 'kralj tomislav 2 eur',
        title: 'King Tomislav',
        subtitle: '2 Euro · Croatia 2023',
        description: 'The two-euro denomination bears King Tomislav, first Croatian sovereign (925 AD). His regalia is rendered in exacting relief, twelve European stars forming the outer ring.',
    },
    {
        id: 'cent',
        file: 'cent',
        title: 'Euro Cent',
        subtitle: '1 Cent · Hrvatska 2023',
        description: 'The national monogram HR rises from the Croatian checkerboard, encircled by European stars. Precision at the smallest scale — even the one-cent die demands perfection.',
    },
    {
        id: 'tomislav',
        file: 'kralj tomislav',
        title: 'King Tomislav',
        subtitle: 'Commemorative Medal',
        description: 'A commemorative portrait medal of Croatia\'s founding king. Deeper relief than circulation coinage allows — the engraver\'s art freed from mechanical constraints.',
    },
    {
        id: 'kravata',
        file: 'kravata',
        title: 'The Cravat',
        subtitle: 'Cultural Heritage Medal',
        description: 'Celebrating Croatia\'s gift to world fashion — the necktie. Hand-engraved detailing renders the textile knot in metal, a paradox of softness in steel.',
    },
    {
        id: 'kuna',
        file: 'kuna',
        title: 'Kuna',
        subtitle: 'Croatian Currency · Pre-Euro',
        description: 'The pine marten (kuna), namesake of Croatia\'s pre-Euro currency. This die captures the animal mid-stride — each strand of fur individually engraved.',
    },
    {
        id: 'hrvatska',
        file: 'hrvatska',
        title: 'Republika Hrvatska',
        subtitle: 'Kuna Series · Reverse',
        description: 'The reverse face of the Croatian kuna series, displaying the national coat of arms with the five historical shields of the Croatian lands.',
    },
    {
        id: 'petrovic',
        file: 'drazen petrovic',
        title: 'Dražen Petrović',
        subtitle: 'Memorial Medal',
        description: 'A memorial medal honoring Croatia\'s greatest basketball player. The portrait captures Petrović\'s fierce determination — intensity translated from hardwood to hardened steel.',
    },
    {
        id: 'fasizam',
        file: 'fasizam',
        title: 'Anti-Fascism',
        subtitle: 'Commemorative Medal',
        description: 'A commemorative medal marking Croatia\'s anti-fascist resistance. The composition balances historical gravity with sculptural restraint.',
    },
    {
        id: 'fakultet',
        file: 'fakultet',
        title: 'Faculty Medal',
        subtitle: 'Academic Distinction',
        description: 'An academic medal commissioned for institutional merit. Classical allegorical composition rendered through contemporary engraving technique.',
    },
    {
        id: '30-hkn',
        file: '30 obljetnca',
        title: '30th Anniversary',
        subtitle: 'Croatian National Bank',
        description: 'Marking three decades of the Croatian National Bank. The commemorative medal traces the institution\'s journey from independence to eurozone membership.',
    },
    {
        id: 'guster',
        file: 'guster 2',
        title: 'Gušterica',
        subtitle: 'Commemorative Coin',
        description: 'The Adriatic wall lizard — a symbol of Mediterranean Croatia — captured in mid-motion. Microscopic scale detail reveals each ridge along the reptile\'s spine.',
    },
    {
        id: 'visnjan',
        file: 'visnjan',
        title: 'Višnjan Observatory',
        subtitle: 'Science & Discovery',
        description: 'Commemorating the Višnjan Science and Education Centre, known for asteroid discoveries. Celestial motifs orbit the observatory\'s dome in intricate low-relief.',
    },
    {
        id: 'visnjanj',
        file: 'visnjanj',
        title: 'Višnjan Observatory',
        subtitle: 'Reverse · Asteroid Map',
        description: 'The reverse face maps the asteroid trajectories discovered from Višnjan. Scientific precision meets the engraver\'s hand — data rendered as art.',
    },
];


// ═══════════════════════════════════════════
// Page Builder
// ═══════════════════════════════════════════

function buildPage() {
    return `
        <main class="coins-lab">
            ${buildHero()}
            ${buildGridSection()}
            ${buildPanel()}
        </main>
    `;
}

function buildHero() {
    return `
        <section class="coins-lab__hero">
            <div class="coins-lab__watermark" aria-hidden="true">NUMISMATICA</div>
            <span class="coins-lab__eyebrow" data-reveal>The Collection</span>
            <h1 class="coins-lab__title" data-reveal>Coins & Medals</h1>
            <div class="coins-lab__divider" data-reveal></div>
            <p class="coins-lab__intro" data-reveal>Hand-engraved dies for the Croatian National Bank, European Central Bank, and commemorative commissions. Each coin carries the sculptor's fingerprint — precision at 40 mm.</p>
        </section>
    `;
}

function buildGridSection() {
    return `
        <section class="coins-lab__grid-section">
            <header class="coins-lab__grid-header" data-reveal>
                <span class="coins-lab__grid-label">The Works</span>
                <h2 class="coins-lab__grid-heading">Collector's Vitrine</h2>
                <div class="coins-lab__grid-divider"></div>
            </header>
            <div class="coins-lab__grid">
                ${COINS.map((coin, i) => buildCard(coin, i)).join('')}
            </div>
        </section>
    `;
}

function buildCard(coin, index) {
    const imgSrc = `${BASE_PATH}/${coin.file}.png`;
    return `
        <article class="coin-card" data-index="${index}" data-reveal data-reveal-delay="${Math.min(index, 7)}">
            <div class="coin-card__vitrine">
                <img class="coin-card__coin"
                    src="${imgSrc}"
                    alt="${coin.title}"
                    loading="lazy"
                    draggable="false" />
                <div class="coin-card__shine"></div>
                <div class="coin-card__specular"></div>
            </div>
            <div class="coin-card__info">
                <span class="coin-card__subtitle">${coin.subtitle}</span>
                <h3 class="coin-card__title">${coin.title}</h3>
            </div>
        </article>
    `;
}

function buildPanel() {
    return `
        <div class="coin-panel" id="coin-panel">
            <div class="coin-panel__backdrop"></div>
            <aside class="coin-panel__sheet">
                <button class="coin-panel__close" aria-label="Close panel">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1.5">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
                <div class="coin-panel__vitrine" id="panel-vitrine">
                    <img class="coin-panel__coin" id="panel-coin-img" src="" alt="" draggable="false" />
                    <div class="coin-panel__shine"></div>
                    <div class="coin-panel__specular"></div>
                </div>
                <div class="coin-panel__hint">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1.5" opacity="0.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    Move cursor to shift light
                </div>
                <div class="coin-panel__body">
                    <span class="coin-panel__eyebrow" id="panel-eyebrow"></span>
                    <h3 class="coin-panel__title" id="panel-title"></h3>
                    <div class="coin-panel__panel-divider"></div>
                    <p class="coin-panel__description" id="panel-description"></p>
                </div>
            </aside>
        </div>
    `;
}


// ═══════════════════════════════════════════
// Interactions
// ═══════════════════════════════════════════

let activeCard = null;

function setupInteractions(root) {
    setupCardHover(root);
    setupCardClick(root);
    setupPanel(root);
    setupScrollReveal(root);
}

// ─── Card Hover (tilt + light) ─────────────

function setupCardHover(root) {
    if (!window.matchMedia('(hover: hover)').matches) return;

    const cards = root.querySelectorAll('.coin-card');

    cards.forEach(card => {
        const vitrine = card.querySelector('.coin-card__vitrine');
        const coinImg = card.querySelector('.coin-card__coin');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            // Card tilt (subtle)
            const rotateY = (x - 0.5) * 6;
            const rotateX = (0.5 - y) * 4;
            card.style.transform =
                `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

            // Coin image tilt (dramatic 3D)
            if (coinImg) {
                const coinRY = (x - 0.5) * 22;
                const coinRX = (0.5 - y) * 18;
                coinImg.style.transform =
                    `perspective(400px) rotateX(${coinRX}deg) rotateY(${coinRY}deg) scale(1.06)`;
            }

            // Light position on vitrine
            const vRect = vitrine.getBoundingClientRect();
            const lx = ((e.clientX - vRect.left) / vRect.width) * 100;
            const ly = ((e.clientY - vRect.top) / vRect.height) * 100;
            vitrine.style.setProperty('--shine-x', `${lx}%`);
            vitrine.style.setProperty('--shine-y', `${ly}%`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            if (coinImg) coinImg.style.transform = '';
            vitrine.style.removeProperty('--shine-x');
            vitrine.style.removeProperty('--shine-y');
        });
    });
}

// ─── Card Click → Open Panel ───────────────

function setupCardClick(root) {
    const cards = root.querySelectorAll('.coin-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const index = parseInt(card.dataset.index, 10);
            openPanel(root, COINS[index], card);
        });
    });
}

// ─── Detail Panel ──────────────────────────

function setupPanel(root) {
    const panel = root.querySelector('#coin-panel');
    if (!panel) return;

    const backdrop = panel.querySelector('.coin-panel__backdrop');
    const closeBtn = panel.querySelector('.coin-panel__close');
    const vitrine = panel.querySelector('#panel-vitrine');
    const coinImg = panel.querySelector('#panel-coin-img');

    // Mouse tracking for tilt and light
    const sheet = panel.querySelector('.coin-panel__sheet');
    if (vitrine && coinImg) {
        if (window.matchMedia('(hover: hover)').matches) {
            sheet.addEventListener('mousemove', (e) => {
                const rect = vitrine.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                // Restrict tilt within reasonable bounds even if cursor moves outside vitrine into sheet
                const clampedX = Math.max(-0.5, Math.min(1.5, x));
                const clampedY = Math.max(-0.5, Math.min(1.5, y));

                // Coin image tilt (dramatic 3D)
                const coinRY = (clampedX - 0.5) * 22;
                const coinRX = (0.5 - clampedY) * 18;
                coinImg.style.transform =
                    `perspective(400px) rotateX(${coinRX}deg) rotateY(${coinRY}deg) scale(1.06)`;

                // Light position on vitrine
                const lx = clampedX * 100;
                const ly = clampedY * 100;
                vitrine.style.setProperty('--shine-x', `${lx}%`);
                vitrine.style.setProperty('--shine-y', `${ly}%`);
            });

            sheet.addEventListener('mouseleave', () => {
                coinImg.style.transform = '';
                vitrine.style.removeProperty('--shine-x');
                vitrine.style.removeProperty('--shine-y');
            });
        }
    }

    // Close handlers
    const close = () => closePanel(root);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('is-open')) close();
    });
}

async function openPanel(root, coin, card) {
    const panel = root.querySelector('#coin-panel');

    // Set text content
    const eyebrow = root.querySelector('#panel-eyebrow');
    const title = root.querySelector('#panel-title');
    const desc = root.querySelector('#panel-description');
    const coinImg = root.querySelector('#panel-coin-img');

    if (eyebrow) eyebrow.textContent = coin.subtitle;
    if (title) title.textContent = coin.title;
    if (desc) desc.textContent = coin.description;

    // Set image source
    if (coinImg) {
        coinImg.src = `${BASE_PATH}/${coin.file}.png`;
        coinImg.alt = coin.title;
    }

    // Highlight card
    if (activeCard) activeCard.classList.remove('is-active');
    card.classList.add('is-active');
    activeCard = card;

    // Open panel
    panel.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closePanel(root) {
    const panel = root.querySelector('#coin-panel');
    panel.classList.remove('is-open');
    document.body.style.overflow = '';

    if (activeCard) {
        activeCard.classList.remove('is-active');
        activeCard = null;
    }
}

// ─── Scroll Reveal ─────────────────────────

function setupScrollReveal(root) {
    const elements = root.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.revealDelay || '0', 10);
                setTimeout(() => {
                    entry.target.classList.add('is-revealed');
                }, delay * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
    });

    elements.forEach(el => observer.observe(el));
}


// ═══════════════════════════════════════════
// Initialize
// ═══════════════════════════════════════════

function init() {
    const root = document.getElementById('coins-lab-root');
    if (!root) return;

    root.innerHTML = buildPage();

    requestAnimationFrame(() => {
        setupInteractions(root);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
