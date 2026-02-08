/**
 * Fluid Navigation System
 * 
 * A minimal elegant navigation line with magnetic/fluid physics.
 * Renders as a vertical line that flexes and flows with spring dynamics.
 */
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { isInContentMode } from '../systems/scroll.js';

// Canvas and context
let canvas = null;
let ctx = null;

// Physics configuration
const PHYSICS = {
    TENSION: 0.15,           // Spring strength
    DAMPING: 0.85,           // Velocity decay
    WAVE_SPEED: 0.08,        // Scroll wave propagation
    POINTS_PER_SEGMENT: 8    // Control points between nodes
};

// Visual configuration
const STYLE = {
    LINE_WIDTH: 2,
    NODE_RADIUS: 4,
    ACTIVE_RADIUS: 8,
    COLOR_LINE: 'rgba(201, 167, 122, 0.4)',
    COLOR_NODE: 'rgba(201, 167, 122, 0.6)',
    COLOR_ACTIVE: 'rgba(201, 167, 122, 1.0)',
    COLOR_GLOW: 'rgba(201, 167, 122, 0.15)',
    COLOR_TEXT: 'rgba(201, 167, 122, 0.9)',
    MARGIN_RIGHT: 60,
    MARGIN_VERTICAL: 0.25,   // 25% from top/bottom = 50% height
    TITLE_OFFSET: 25         // Distance of title from node
};

// Control points array
let points = [];
let nodes = [];
let activeIndicator = { y: 0, vy: 0 };

// Particle system for micro-effects
let particles = [];
const MAX_PARTICLES = 30;

// Hover state - now continuous per node
let mousePos = { x: -1000, y: -1000 }; // Mouse position on canvas
const HOVER_RADIUS = 60; // Max distance for hover effect

/**
 * Initialize the fluid navigation system
 */
export function setupFluidNavigation() {
    // Create canvas overlay
    canvas = document.createElement('canvas');
    canvas.id = 'fluid-nav-canvas';

    // Check initial state to determine starting opacity
    // This handles page restore from sculpture detail page
    const initialOpacity = state.scrollProgress > 1.3 ? 0 : 1;

    canvas.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 200px;
        height: 100%;
        pointer-events: ${initialOpacity > 0 ? 'auto' : 'none'};
        cursor: pointer;
        z-index: 100;
        opacity: ${initialOpacity};
        transition: opacity 0.4s ease-out;
    `;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    // Add click handler for node selection
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleCanvasHover);

    // Handle resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize points
    initializePoints();

    console.log('🌊 Fluid navigation initialized');
}

/**
 * Resize canvas to match window
 */
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 200 * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = '200px';
    canvas.style.height = '100%';

    // Reinitialize points for new dimensions
    initializePoints();
}

/**
 * Create control points along the navigation line
 */
function initializePoints() {
    const numSplats = CONFIG.splats.length;
    const height = window.innerHeight;
    const marginTop = height * STYLE.MARGIN_VERTICAL;
    const marginBottom = height * STYLE.MARGIN_VERTICAL;
    const usableHeight = height - marginTop - marginBottom;
    const x = 200 - STYLE.MARGIN_RIGHT;

    // Clear existing
    points = [];
    nodes = [];

    // Calculate node positions
    for (let i = 0; i < numSplats; i++) {
        const t = numSplats > 1 ? i / (numSplats - 1) : 0.5;
        const y = marginTop + t * usableHeight;
        nodes.push({
            x,
            y,
            baseX: x,
            baseY: y,
            splat: CONFIG.splats[i],
            hoverIntensity: 0 // Smooth hover value (0-1)
        });
    }

    // Create control points between nodes
    for (let i = 0; i < numSplats - 1; i++) {
        const startNode = nodes[i];
        const endNode = nodes[i + 1];

        for (let j = 0; j <= PHYSICS.POINTS_PER_SEGMENT; j++) {
            const t = j / PHYSICS.POINTS_PER_SEGMENT;
            const baseY = startNode.baseY + t * (endNode.baseY - startNode.baseY);

            points.push({
                x,
                y: baseY,
                vx: 0,
                vy: 0,
                baseX: x,
                baseY,
                segment: i,
                t
            });
        }
    }

    // Initialize active indicator
    activeIndicator.y = nodes[0]?.y || marginTop;
    activeIndicator.vy = 0;
}

/**
 * Handle click events on the canvas to select nodes
 * @param {MouseEvent} event
 */
function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Find if click is near any node
    const clickRadius = 20; // Generous click target

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const dx = clickX - node.x;
        const dy = clickY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < clickRadius) {
            // Calculate target scroll progress for this node
            const numSplats = CONFIG.splats.length;
            const targetProgress = numSplats > 1 ? i / (numSplats - 1) : 0;

            // Update state to navigate to this sculpture
            state.targetScrollProgress = targetProgress;
            state.isScrolling = true;
            state.lastScrollTime = Date.now();

            // Spawn particles for visual feedback
            spawnParticles(i, 2, 1);

            console.log(`🎯 Navigating to: ${node.splat?.title || node.splat?.name}`);
            break;
        }
    }
}

/**
 * Handle mouse hover - track position for smooth distance-based effects
 * @param {MouseEvent} event
 */
function handleCanvasHover(event) {
    const rect = canvas.getBoundingClientRect();
    mousePos.x = event.clientX - rect.left;
    mousePos.y = event.clientY - rect.top;

    // Check if near any node for cursor change
    const clickRadius = 20;
    let isOverNode = false;

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const dx = mousePos.x - node.x;
        const dy = mousePos.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < clickRadius) {
            isOverNode = true;
            break;
        }
    }

    canvas.style.cursor = isOverNode ? 'pointer' : 'default';
}

/**
 * Spawn particles at a node
 * @param {number} nodeIndex - Index of the node
 * @param {number} intensity - Particle count multiplier
 * @param {number} direction - Direction of approach: 1 = from above (cursor moving down), -1 = from below (cursor moving up)
 */
function spawnParticles(nodeIndex, intensity = 1, direction = 1) {
    const node = nodes[nodeIndex];
    if (!node) return;

    const count = Math.floor(6 * intensity);
    for (let i = 0; i < count && particles.length < MAX_PARTICLES; i++) {
        // Particles spray in the same direction as cursor movement
        // If cursor comes from above (direction=1), particles spray downward
        const baseVy = direction * (1.5 + Math.random() * 1.5);

        particles.push({
            x: node.x + (Math.random() - 0.5) * 15,
            y: node.y + direction * 5, // Start slightly offset in direction of approach
            vx: (Math.random() - 0.5) * 2.5 - 0.5, // Bias toward left (away from edge)
            vy: baseVy,
            life: 1.0,
            decay: 0.015 + Math.random() * 0.015,
            size: 1.5 + Math.random() * 2
        });
    }
}

/**
 * Update physics simulation
 */
export function updateFluidNavigation(dt) {
    if (!ctx || !canvas) return;

    const numSplats = CONFIG.splats.length;
    const scrollProgress = state.scrollProgress;
    const targetProgress = state.targetScrollProgress;
    const isScrolling = state.isScrolling;

    // Calculate visibility based on scroll
    // Hide navigation when in content mode OR when scroll has passed the content threshold
    let navOpacity = 1;
    if (isInContentMode() || scrollProgress > 1.3) {
        navOpacity = 0;
    } else if (scrollProgress > 1.0) {
        // Fade out as we push towards transition (1.0 -> 1.15)
        navOpacity = 1 - (scrollProgress - 1.0) / 0.15;
        navOpacity = Math.max(0, Math.min(1, navOpacity));
    }

    // Update canvas visibility and interaction
    canvas.style.opacity = navOpacity;
    canvas.style.pointerEvents = navOpacity > 0.1 ? 'auto' : 'none';

    // PERF: Skip all physics + rendering when fully invisible
    if (navOpacity <= 0.01) return;

    // Calculate target Y for active indicator
    const height = window.innerHeight;
    const marginTop = height * STYLE.MARGIN_VERTICAL;
    const usableHeight = height - 2 * marginTop;
    const targetY = marginTop + scrollProgress * usableHeight;

    // Spring physics for active indicator
    const indicatorTension = isScrolling ? 0.12 : 0.08;
    const indicatorDamping = 0.8;
    activeIndicator.vy += (targetY - activeIndicator.y) * indicatorTension;
    activeIndicator.vy *= indicatorDamping;
    activeIndicator.y += activeIndicator.vy;

    // Detect when indicator crosses a node for particle bursts
    nodes.forEach((node, i) => {
        const distToNode = Math.abs(activeIndicator.y - node.y);
        const wasTouching = node._wasTouching || false;
        const isTouching = distToNode < 12; // Within 12px of node center

        // Trigger particles when we first touch a node
        if (isTouching && !wasTouching) {
            // Direction: 1 = coming from above (moving down), -1 = from below (moving up)
            const direction = activeIndicator.vy > 0 ? 1 : -1;
            spawnParticles(i, 1.5, direction);
        }
        node._wasTouching = isTouching;

        // Calculate hover intensity based on mouse distance with log falloff
        const dx = mousePos.x - node.x;
        const dy = mousePos.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Logarithmic falloff: intensity = 1 - log(1 + distance/scale) / log(1 + maxDist/scale)
        // This creates a curve that's intense near the node and falls off more gradually
        const logScale = 10; // Controls how "sharp" the log curve is
        const maxDist = HOVER_RADIUS;
        let targetHover = 0;

        if (distance < maxDist) {
            // Log falloff: stays high near center, drops off smoothly
            const normalizedDist = distance / maxDist;
            targetHover = 1 - Math.log(1 + normalizedDist * logScale) / Math.log(1 + logScale);
            targetHover = Math.max(0, targetHover);
        }

        // Smooth interpolation toward target hover intensity
        const hoverSpeed = 0.15; // How fast hover responds (0-1)
        node.hoverIntensity += (targetHover - node.hoverIntensity) * hoverSpeed;
    });

    // Update control points
    const scrollDelta = targetProgress - scrollProgress;
    const waveOffset = scrollDelta * 30; // Horizontal wave based on scroll momentum

    points.forEach((point, i) => {
        // Target position with wave distortion
        let targetX = point.baseX;
        let targetY = point.baseY;

        // Wave effect from scroll momentum
        const distFromIndicator = Math.abs(point.baseY - activeIndicator.y);
        const waveFalloff = Math.exp(-distFromIndicator * 0.01);
        targetX += waveOffset * waveFalloff;

        // Ripple effect propagating from indicator
        const ripplePhase = (point.baseY - activeIndicator.y) * 0.05 + state.time * 3;
        const rippleAmount = Math.sin(ripplePhase) * 3 * waveFalloff * Math.abs(scrollDelta) * 10;
        targetX += rippleAmount;

        // Spring physics
        point.vx += (targetX - point.x) * PHYSICS.TENSION;
        point.vy += (targetY - point.y) * PHYSICS.TENSION;
        point.vx *= PHYSICS.DAMPING;
        point.vy *= PHYSICS.DAMPING;
        point.x += point.vx;
        point.y += point.vy;
    });

    // Update particles
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.02; // Upward drift
        p.life -= p.decay;
        return p.life > 0;
    });

    // Ambient particle spawning along line
    if (Math.random() < 0.05) {
        const randomPoint = points[Math.floor(Math.random() * points.length)];
        if (randomPoint) {
            particles.push({
                x: randomPoint.x + (Math.random() - 0.5) * 10,
                y: randomPoint.y,
                vx: (Math.random() - 0.5) * 0.5,
                vy: -0.5 - Math.random() * 0.5,
                life: 0.5 + Math.random() * 0.5,
                decay: 0.015,
                size: 1 + Math.random()
            });
        }
    }

    // Render
    render(scrollProgress, isScrolling, navOpacity);
}

/**
 * Render the navigation
 */
function render(scrollProgress, isScrolling, opacity) {
    ctx.clearRect(0, 0, 200, window.innerHeight);

    // Skip rendering if essentially invisible
    if (opacity <= 0.01) return;

    ctx.save(); // Save state for globalAlpha
    ctx.globalAlpha = opacity;

    const numSplats = CONFIG.splats.length;

    // Glow effect behind line
    renderGlow();

    // Draw curved line through points
    ctx.beginPath();
    ctx.strokeStyle = STYLE.COLOR_LINE;
    ctx.lineWidth = STYLE.LINE_WIDTH;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);

        // Catmull-Rom to Bezier for smooth curves
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[Math.max(i - 1, 0)];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[Math.min(i + 2, points.length - 1)];

            // Calculate control points
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
    }

    ctx.stroke();

    // Draw node points and titles
    nodes.forEach((node, i) => {
        const isActive = Math.abs(i - scrollProgress * (numSplats - 1)) < 0.5;
        const hover = node.hoverIntensity; // Smooth 0-1 value

        // Hover glow effect (scales with intensity)
        if (hover > 0.01 && !isActive) {
            const glowRadius = STYLE.NODE_RADIUS * (3 + hover * 2);
            const hoverGlow = ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, glowRadius
            );
            hoverGlow.addColorStop(0, `rgba(201, 167, 122, ${0.35 * hover})`);
            hoverGlow.addColorStop(0.5, `rgba(201, 167, 122, ${0.12 * hover})`);
            hoverGlow.addColorStop(1, 'rgba(201, 167, 122, 0)');
            ctx.fillStyle = hoverGlow;
            ctx.beginPath();
            ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Node circle - radius scales smoothly with hover
        const hoverRadiusBoost = hover * 2; // Up to 2px extra when fully hovered
        const nodeRadius = isActive
            ? STYLE.NODE_RADIUS + 2
            : STYLE.NODE_RADIUS + hoverRadiusBoost;

        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);

        // Color interpolates between node and active based on hover intensity
        if (isActive) {
            ctx.fillStyle = STYLE.COLOR_ACTIVE;
        } else {
            // Blend from COLOR_NODE to COLOR_ACTIVE based on hover
            const r = Math.round(201 * (0.6 + 0.4 * hover));
            const g = Math.round(167 * (0.6 + 0.4 * hover));
            const b = Math.round(122 * (0.6 + 0.4 * hover));
            const a = 0.6 + 0.4 * hover;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        }
        ctx.fill();

        // Draw title - opacity scales with hover intensity
        const showTitle = isActive || hover > 0.2;
        if (showTitle && node.splat) {
            const titleOpacity = isActive
                ? 1 - Math.abs(i - scrollProgress * (numSplats - 1)) * 2
                : hover * 0.9; // Hover title fades with distance
            ctx.save();
            ctx.font = '11px Inter, system-ui, sans-serif';
            ctx.fillStyle = `rgba(201, 167, 122, ${Math.max(0, titleOpacity)})`;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.splat.title || node.splat.name, node.x - STYLE.TITLE_OFFSET, node.y);
            ctx.restore();
        }
    });

    // Draw active indicator (fluid blob)
    renderActiveIndicator(scrollProgress, isScrolling);

    // Draw particles
    renderParticles();

    ctx.restore(); // Restore globalAlpha state
}

/**
 * Render glow effect
 */
function renderGlow() {
    const gradient = ctx.createRadialGradient(
        200 - STYLE.MARGIN_RIGHT, activeIndicator.y, 0,
        200 - STYLE.MARGIN_RIGHT, activeIndicator.y, 60
    );
    gradient.addColorStop(0, STYLE.COLOR_GLOW);
    gradient.addColorStop(1, 'rgba(201, 167, 122, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, window.innerHeight);
}

/**
 * Render the active indicator as a fluid blob
 */
function renderActiveIndicator(scrollProgress, isScrolling) {
    const x = 200 - STYLE.MARGIN_RIGHT;
    const y = activeIndicator.y;

    // Velocity-based stretch
    const stretch = Math.abs(activeIndicator.vy) * 0.3;
    const radiusX = STYLE.ACTIVE_RADIUS + stretch * 0.5;
    const radiusY = STYLE.ACTIVE_RADIUS + stretch;

    // Pulsing effect
    const pulse = Math.sin(state.time * 3) * 0.5 + 0.5;
    const pulseScale = 1 + pulse * 0.15;

    ctx.save();
    ctx.translate(x, y);

    // Glow
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, STYLE.ACTIVE_RADIUS * 2.5);
    glowGradient.addColorStop(0, 'rgba(201, 167, 122, 0.4)');
    glowGradient.addColorStop(0.5, 'rgba(201, 167, 122, 0.1)');
    glowGradient.addColorStop(1, 'rgba(201, 167, 122, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, STYLE.ACTIVE_RADIUS * 2.5, STYLE.ACTIVE_RADIUS * 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Main blob
    ctx.beginPath();
    ctx.ellipse(0, 0, radiusX * pulseScale, radiusY * pulseScale, 0, 0, Math.PI * 2);
    ctx.fillStyle = STYLE.COLOR_ACTIVE;
    ctx.fill();

    // Inner highlight
    ctx.beginPath();
    ctx.ellipse(-radiusX * 0.2, -radiusY * 0.3, radiusX * 0.4, radiusY * 0.3, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();

    ctx.restore();
}

/**
 * Render particles
 */
function renderParticles() {
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 167, 122, ${p.life * 0.8})`;
        ctx.fill();
    });
}

/**
 * Cleanup
 */
export function destroyFluidNavigation() {
    if (canvas) {
        canvas.removeEventListener('click', handleCanvasClick);
        canvas.removeEventListener('mousemove', handleCanvasHover);
        canvas.remove();
        canvas = null;
        ctx = null;
    }
    window.removeEventListener('resize', resizeCanvas);
}
