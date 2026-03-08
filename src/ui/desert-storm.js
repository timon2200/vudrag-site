/**
 * Desert Storm Canvas Effect — Cinematic Multi-Layer System
 * 
 * Canvas-based particle overlay with three effect variants:
 * - sandstorm: fine elongated wind-driven sand streaks with depth layers
 * - embers: warm floating embers rising with soft glow pulses
 * - dust: gentle atmospheric dust motes with drift
 * 
 * Each particle is drawn as an elongated streak aligned to its velocity,
 * creating a cinematic wind-driven look. Three depth layers (near/mid/far)
 * provide parallax depth. Organic bezier-curve wisps add smoky atmosphere.
 */

// ═══════════════════════════════════
// Depth Layer Definitions
// ═══════════════════════════════════

const LAYERS = {
    far: { speedMul: 0.4, sizeMul: 0.45, opacityMul: 0.5, count: 0.35 },
    mid: { speedMul: 0.7, sizeMul: 0.75, opacityMul: 0.8, count: 0.40 },
    near: { speedMul: 1.0, sizeMul: 1.0, opacityMul: 1.0, count: 0.25 },
};

// ═══════════════════════════════════
// Effect Presets
// ═══════════════════════════════════

const EFFECTS = {
    sandstorm: {
        totalParticles: 800,
        windAngle: Math.PI * 0.85,
        windSpeed: { min: 100, max: 300 },
        // Streak dimensions (length, width) — elongated grains
        streakLength: { min: 6, max: 28 },
        streakWidth: { min: 0.5, max: 2.0 },
        particleOpacity: { min: 0.12, max: 0.65 },
        // Organic wisps (bezier curves)
        wispCount: 14,
        wispSegments: 6,
        wispLength: { min: 150, max: 500 },
        wispOpacity: { min: 0.04, max: 0.14 },
        wispWidth: { min: 1.0, max: 4.0 },
        colors: [
            [201, 167, 122],
            [180, 150, 110],
            [160, 140, 105],
            [140, 120, 90],
            [220, 195, 155],
        ],
        turbulence: { speed: { min: 1.5, max: 4 }, amplitude: { min: 8, max: 24 } },
        gravity: 0,
        angleSpread: 0.5,
    },
    embers: {
        totalParticles: 160,
        windAngle: -Math.PI * 0.5,
        windSpeed: { min: 30, max: 110 },
        streakLength: { min: 3, max: 8 },
        streakWidth: { min: 1.0, max: 3.0 },
        particleOpacity: { min: 0.18, max: 0.75 },
        wispCount: 0,
        wispSegments: 0,
        wispLength: { min: 0, max: 0 },
        wispOpacity: { min: 0, max: 0 },
        wispWidth: { min: 0, max: 0 },
        colors: [
            [255, 160, 50],
            [255, 120, 30],
            [255, 200, 80],
            [220, 100, 20],
            [255, 180, 60],
        ],
        turbulence: { speed: { min: 0.5, max: 2.5 }, amplitude: { min: 12, max: 35 } },
        gravity: -22,
        angleSpread: 0.6,
    },
    dust: {
        totalParticles: 220,
        windAngle: Math.PI * 0.7,
        windSpeed: { min: 14, max: 40 },
        streakLength: { min: 2, max: 7 },
        streakWidth: { min: 0.5, max: 2.0 },
        particleOpacity: { min: 0.06, max: 0.3 },
        wispCount: 7,
        wispSegments: 5,
        wispLength: { min: 80, max: 220 },
        wispOpacity: { min: 0.02, max: 0.07 },
        wispWidth: { min: 0.5, max: 2.5 },
        colors: [
            [180, 180, 190],
            [160, 160, 170],
            [140, 140, 155],
            [200, 200, 210],
        ],
        turbulence: { speed: { min: 0.3, max: 1.5 }, amplitude: { min: 5, max: 16 } },
        gravity: 3,
        angleSpread: 0.5,
    }
};

// ═══════════════════════════════════
// State
// ═══════════════════════════════════

let canvas = null;
let ctx = null;
let particles = [];
let wisps = [];
let animFrameId = null;
let isRunning = false;
let lastTime = 0;
let currentEffect = 'sandstorm';
let globalTime = 0;
let burstTimer = 0; // for transition bursts

// ═══════════════════════════════════
// Particle Factory
// ═══════════════════════════════════

function rand(min, max) { return min + Math.random() * (max - min); }

function createParticle(w, h, layer, offscreen = false) {
    const cfg = EFFECTS[currentEffect];
    const L = LAYERS[layer];

    const baseSpeed = rand(cfg.windSpeed.min, cfg.windSpeed.max) * L.speedMul;
    const angleVariation = (Math.random() - 0.5) * cfg.angleSpread;
    const angle = cfg.windAngle + angleVariation;

    const streakLen = rand(cfg.streakLength.min, cfg.streakLength.max) * L.sizeMul;
    const streakW = rand(cfg.streakWidth.min, cfg.streakWidth.max) * L.sizeMul;
    const opacity = rand(cfg.particleOpacity.min, cfg.particleOpacity.max) * L.opacityMul;
    const color = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];

    const vx = Math.cos(angle) * baseSpeed;
    const vy = Math.sin(angle) * baseSpeed * 0.35 + (Math.random() - 0.5) * 20 + cfg.gravity;

    // Spawn position
    let x, y;
    if (offscreen) {
        if (currentEffect === 'embers') {
            x = Math.random() * w;
            y = h + Math.random() * 60;
        } else {
            // Come from the right (sand blows left)
            x = w + Math.random() * 120;
            y = Math.random() * h;
        }
    } else {
        x = Math.random() * w;
        y = Math.random() * h;
    }

    return {
        x, y, vx, vy,
        streakLen, streakW,
        opacity, color, layer,
        angle, // direction for streak alignment
        turbPhase: Math.random() * Math.PI * 2,
        turbSpeed: rand(cfg.turbulence.speed.min, cfg.turbulence.speed.max),
        turbAmp: rand(cfg.turbulence.amplitude.min, cfg.turbulence.amplitude.max),
        // Ember glow
        glowPhase: Math.random() * Math.PI * 2,
        glowSpeed: 1.2 + Math.random() * 2.5,
        // Lifetime shimmer
        shimmerPhase: Math.random() * Math.PI * 2,
    };
}

// ═══════════════════════════════════
// Organic Wisp Factory (Bezier)
// ═══════════════════════════════════

function createWisp(w, h) {
    const cfg = EFFECTS[currentEffect];
    if (cfg.wispCount === 0) return null;

    const length = rand(cfg.wispLength.min, cfg.wispLength.max);
    const opacity = rand(cfg.wispOpacity.min, cfg.wispOpacity.max);
    const width = rand(cfg.wispWidth.min, cfg.wispWidth.max);
    const color = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];
    const segments = cfg.wispSegments;

    // Control points for bezier wisp
    const controlPoints = [];
    const startX = w + Math.random() * 200;
    const startY = Math.random() * h;

    for (let i = 0; i <= segments; i++) {
        controlPoints.push({
            x: startX - (length / segments) * i,
            y: startY + (Math.random() - 0.5) * 40,
            // Each control point undulates independently
            undulatePhase: Math.random() * Math.PI * 2,
            undulateSpeed: 0.5 + Math.random() * 1.5,
            undulateAmp: 5 + Math.random() * 20,
        });
    }

    return {
        controlPoints,
        opacity,
        width,
        color,
        speed: 60 + Math.random() * 180,
        length,
        fadePhase: Math.random() * Math.PI * 2,
    };
}

// ═══════════════════════════════════
// Rebuild on effect change
// ═══════════════════════════════════

function rebuildParticles() {
    if (!canvas) return;
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    const cfg = EFFECTS[currentEffect];

    particles = [];
    for (const [layerName, layerCfg] of Object.entries(LAYERS)) {
        const count = Math.floor(cfg.totalParticles * layerCfg.count);
        for (let i = 0; i < count; i++) {
            particles.push(createParticle(w, h, layerName));
        }
    }

    wisps = [];
    for (let i = 0; i < cfg.wispCount; i++) {
        const wisp = createWisp(w, h);
        if (wisp) wisps.push(wisp);
    }
}

// ═══════════════════════════════════
// Setup
// ═══════════════════════════════════

export function setupDesertStorm(container) {
    if (!container) return;

    canvas = document.createElement('canvas');
    canvas.id = 'desert-storm-canvas';
    canvas.style.cssText = `
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 3;
        opacity: 0;
        transition: opacity 1.5s ease;
    `;
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    rebuildParticles();

    // Fade in
    requestAnimationFrame(() => { canvas.style.opacity = '1'; });

    isRunning = true;
    lastTime = performance.now();
    animFrameId = requestAnimationFrame(animate);

    console.log('🏜️ Cinematic desert storm initialized');
}

function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

// ═══════════════════════════════════
// Animation Loop
// ═══════════════════════════════════

function animate(timestamp) {
    if (!isRunning) return;

    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;
    globalTime += dt;

    if (burstTimer > 0) burstTimer -= dt;

    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;

    ctx.clearRect(0, 0, w, h);

    // Draw wisps first (behind particles)
    drawWisps(dt, w, h);

    // Draw particles
    drawParticles(dt, w, h);

    animFrameId = requestAnimationFrame(animate);
}

// ═══════════════════════════════════
// Wisp Rendering (Organic Bezier)
// ═══════════════════════════════════

function drawWisps(dt, w, h) {
    for (let i = 0; i < wisps.length; i++) {
        const wisp = wisps[i];
        const pts = wisp.controlPoints;

        // Move all control points leftward
        let allOffscreen = true;
        for (let j = 0; j < pts.length; j++) {
            pts[j].x -= wisp.speed * dt;
            // Undulate Y
            pts[j].undulatePhase += pts[j].undulateSpeed * dt;
            pts[j].y += Math.sin(pts[j].undulatePhase) * pts[j].undulateAmp * dt;

            if (pts[j].x > -50) allOffscreen = false;
        }

        // Reset if fully off screen
        if (allOffscreen) {
            wisps[i] = createWisp(w, h);
            if (!wisps[i]) { wisps.splice(i, 1); i--; }
            continue;
        }

        // Fade pulsation
        wisp.fadePhase += dt * 0.8;
        const fadeMul = 0.6 + 0.4 * Math.sin(wisp.fadePhase);

        // Draw bezier path
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);

        for (let j = 1; j < pts.length - 1; j++) {
            const cpX = (pts[j].x + pts[j + 1].x) / 2;
            const cpY = (pts[j].y + pts[j + 1].y) / 2;
            ctx.quadraticCurveTo(pts[j].x, pts[j].y, cpX, cpY);
        }

        if (pts.length > 1) {
            const last = pts[pts.length - 1];
            ctx.lineTo(last.x, last.y);
        }

        const [r, g, b] = wisp.color;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${wisp.opacity * fadeMul})`;
        ctx.lineWidth = wisp.width;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Second pass — soft glow line (wider, more transparent)
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let j = 1; j < pts.length - 1; j++) {
            const cpX = (pts[j].x + pts[j + 1].x) / 2;
            const cpY = (pts[j].y + pts[j + 1].y) / 2;
            ctx.quadraticCurveTo(pts[j].x, pts[j].y, cpX, cpY);
        }
        if (pts.length > 1) {
            const last = pts[pts.length - 1];
            ctx.lineTo(last.x, last.y);
        }
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${wisp.opacity * fadeMul * 0.25})`;
        ctx.lineWidth = wisp.width * 4;
        ctx.stroke();
    }
}

// ═══════════════════════════════════
// Particle Rendering (Elongated Streaks)
// ═══════════════════════════════════

function drawParticles(dt, w, h) {
    const isEmbers = currentEffect === 'embers';
    const burstMultiplier = burstTimer > 0 ? 1.5 : 1.0;

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Physics
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.turbPhase += p.turbSpeed * dt;
        p.y += Math.sin(p.turbPhase) * p.turbAmp * dt;
        p.x += Math.cos(p.turbPhase * 0.7) * p.turbAmp * 0.3 * dt;

        // Reset if off-screen
        if (p.x < -30 || p.x > w + 30 || p.y < -30 || p.y > h + 30) {
            Object.assign(p, createParticle(w, h, p.layer, true));
        }

        // Compute draw opacity
        let drawOpacity = p.opacity;
        if (isEmbers) {
            p.glowPhase += p.glowSpeed * dt;
            drawOpacity *= 0.4 + 0.6 * Math.sin(p.glowPhase);
        }

        // Shimmer
        p.shimmerPhase += dt * 2;
        drawOpacity *= (0.7 + 0.3 * Math.sin(p.shimmerPhase)) * burstMultiplier;
        drawOpacity = Math.max(0, Math.min(1, drawOpacity));

        const [r, g, b] = p.color;

        // Calculate streak direction from velocity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const dirX = speed > 0.01 ? p.vx / speed : Math.cos(p.angle);
        const dirY = speed > 0.01 ? p.vy / speed : Math.sin(p.angle);

        // Draw elongated streak (a short line segment)
        const halfLen = p.streakLen * 0.5;
        const x1 = p.x - dirX * halfLen;
        const y1 = p.y - dirY * halfLen;
        const x2 = p.x + dirX * halfLen;
        const y2 = p.y + dirY * halfLen;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${drawOpacity})`;
        ctx.lineWidth = p.streakW;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Ember glow halo
        if (isEmbers && p.streakW > 1.5) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.streakLen * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${drawOpacity * 0.12})`;
            ctx.fill();
        }
    }
}

// ═══════════════════════════════════
// Public API
// ═══════════════════════════════════

/**
 * Switch to a different effect type
 */
export function setEffect(type) {
    if (!EFFECTS[type] || type === currentEffect) return;
    currentEffect = type;
    rebuildParticles();
}

/**
 * Trigger a particle burst (called during slide transitions)
 */
export function triggerBurst() {
    burstTimer = 0.4;
    // Add extra temporary particles
    if (!canvas) return;
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    const cfg = EFFECTS[currentEffect];
    const burstCount = Math.floor(cfg.totalParticles * 0.3);
    for (let i = 0; i < burstCount; i++) {
        const layerNames = Object.keys(LAYERS);
        const layer = layerNames[Math.floor(Math.random() * layerNames.length)];
        particles.push(createParticle(w, h, layer, true));
    }
}

export function pauseDesertStorm() {
    if (!isRunning) return;
    isRunning = false;
    if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
}

export function resumeDesertStorm() {
    if (isRunning || !canvas) return;
    isRunning = true;
    lastTime = performance.now();
    animFrameId = requestAnimationFrame(animate);
}

export function setStormIntensity(intensity) {
    if (!canvas) return;
    canvas.style.opacity = Math.max(0, Math.min(1, intensity));
}

export function destroyDesertStorm() {
    pauseDesertStorm();
    if (canvas && canvas.parentElement) canvas.parentElement.removeChild(canvas);
    window.removeEventListener('resize', resizeCanvas);
    canvas = null; ctx = null; particles = []; wisps = [];
}
