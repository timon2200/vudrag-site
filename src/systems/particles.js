/**
 * Ambient Particle System
 * Creates subtle floating dust particles for atmosphere
 */
import {
    Entity,
    Texture,
    Curve,
    CurveSet,
    BLEND_NORMAL,
    PIXELFORMAT_RGBA8,
    ADDRESS_CLAMP_TO_EDGE
} from 'playcanvas';
import { state } from '../state.js';

/**
 * Create procedural particle texture using canvas
 */
function createParticleTexture(device) {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Draw a soft radial gradient (white center, transparent edges)
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Create texture from canvas
    const texture = new Texture(device, {
        width: size,
        height: size,
        format: PIXELFORMAT_RGBA8,
        mipmaps: true,
        addressU: ADDRESS_CLAMP_TO_EDGE,
        addressV: ADDRESS_CLAMP_TO_EDGE
    });
    texture.setSource(canvas);

    return texture;
}

/**
 * Setup ambient particle system
 */
export function setupParticles() {
    const app = state.app;
    const texture = createParticleTexture(app.graphicsDevice);

    const particles = new Entity('AmbientParticles');
    particles.setPosition(0, 0.5, 0);

    // Alpha curve - fade in and out (lower peak for subtle dust)
    const alphaCurve = new Curve([0, 0, 0.2, 0.4, 0.8, 0.4, 1, 0]);

    // Scale curve - tiny dust particles
    const scaleCurve = new Curve([0, 0.004, 0.5, 0.01, 1, 0.003]);

    // Color curves (neutral gray/white for dust, not golden sparks)
    const colorCurve = new CurveSet([
        [0, 0.7, 0.5, 0.8, 1, 0.6],    // R - neutral
        [0, 0.7, 0.5, 0.8, 1, 0.6],    // G - neutral  
        [0, 0.75, 0.5, 0.85, 1, 0.65]  // B - slightly cool
    ]);

    particles.addComponent('particlesystem', {
        // Emission
        numParticles: 250,
        lifetime: 30,
        rate: 0.08,
        rate2: 0.16,

        // Spawn area - wide spread around the scene
        emitterShape: 1, // Sphere
        emitterRadius: 8.0,

        // Movement - gentle random drift
        velocityGraph: new CurveSet([
            [0, -0.03, 1, 0.03],  // X - slight horizontal drift
            [0, 0.02, 1, 0.06],   // Y - upward drift  
            [0, -0.03, 1, 0.03]   // Z - slight horizontal drift
        ]),

        // Appearance
        scaleGraph: scaleCurve,
        alphaGraph: alphaCurve,
        colorGraph: colorCurve,
        colorMap: texture,

        // Rendering - use normal blend for dust (not additive glow)
        blend: BLEND_NORMAL,
        depthWrite: false,
        lighting: false,
        halfLambert: false,

        // Slow rotation for gentle drift
        rotationSpeedGraph: new Curve([0, 5]),
        rotationSpeedGraph2: new Curve([0, -5]),

        // Soft, subtle appearance
        intensity: 1.5,

        // Playback settings
        loop: true,
        autoPlay: true,
        preWarm: true,

        // Sorting for proper transparency
        sort: 1
    });

    app.root.addChild(particles);
    state.particles = particles;

    // Explicitly reset and play to ensure emission starts
    particles.particlesystem.reset();
    particles.particlesystem.play();

    console.log('✨ Ambient particles added');
}

/**
 * Update particle system interaction based on mouse
 */
export function updateParticleInteraction(dt) {
    if (!state.particles) return;

    // Gentle rotation of the entire particle system
    // Rotate around Y axis (yaw) based on mouse X
    // Rotate around X axis (pitch) based on mouse Y
    const intensity = 8; // Degrees

    // We target a specific rotation
    const targetPitch = -(state.mouse.y * intensity);
    const targetYaw = (state.mouse.x * intensity);

    // Get current rotation
    const currentRot = state.particles.getEulerAngles();

    // Smooth lerp
    const lerpSpeed = 1.0; // Slower than splats for "background" feel

    const newPitch = currentRot.x + (targetPitch - currentRot.x) * Math.min(1, dt * lerpSpeed);
    const newYaw = currentRot.y + (targetYaw - currentRot.y) * Math.min(1, dt * lerpSpeed);

    state.particles.setEulerAngles(newPitch, newYaw, 0);
}
