/**
 * Camera System
 * Handles camera setup, orbital movement, and dynamic positioning
 */
import { Entity, Vec3 } from 'playcanvas';
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { CAMERA_SETTINGS } from '../ui/splat-debug-panel.js';

/**
 * Create and configure the camera entity
 */
export function setupCamera() {
    const app = state.app;
    const { baseDistance, verticalOffset, fov } = CONFIG.camera;

    const camera = new Entity('Camera');
    camera.setPosition(0, verticalOffset, baseDistance);

    camera.addComponent('camera', {
        clearColor: CONFIG.colors.background,
        fov: fov,
        nearClip: 0.1,
        farClip: 100
    });

    app.root.addChild(camera);
    state.camera = camera;

    console.log('📷 Camera configured');
}

/**
 * Update camera position each frame
 */
export function updateCamera(dt) {
    if (!state.camera) return;

    const { baseDistance, verticalOffset } = CONFIG.camera;
    const progress = state.scrollProgress;

    // Gentle front-facing oscillation - uses mutable settings from debug panel
    const autoSway = Math.sin(state.time * CAMERA_SETTINGS.swaySpeed) * CAMERA_SETTINGS.swayAmplitude;

    // Small additional sway based on scroll progress
    const scrollSway = Math.sin(progress * Math.PI * 2) * 0.1;

    const totalSway = autoSway + scrollSway;

    // Dynamic distance - pull back slightly during transitions
    const transitionIntensity = getTransitionIntensity();
    const dynamicDistance = baseDistance + transitionIntensity * 0.4;

    // Camera position - mostly in front (positive Z), with gentle X sway
    const x = Math.sin(totalSway) * dynamicDistance * 0.3;
    const z = Math.cos(totalSway) * dynamicDistance;  // Always positive (in front)

    // Subtle vertical breathing
    const breathe = Math.sin(state.time * 0.4) * 0.03;
    const y = verticalOffset + breathe;

    // Smooth camera movement
    const currentPos = state.camera.getPosition();
    const targetPos = new Vec3(x, y, z);
    const lerpFactor = 1 - Math.pow(0.05, dt);

    const newPos = new Vec3().lerp(currentPos, targetPos, lerpFactor);
    state.camera.setPosition(newPos);
    state.camera.lookAt(0, 0.25, 0);
}

/**
 * Calculate current transition intensity for camera effects
 */
export function getTransitionIntensity() {
    const numSplats = CONFIG.splats.length;
    const splatProgress = state.scrollProgress * (numSplats - 1);
    const transitionT = splatProgress % 1;

    return transitionT < 0.5 ? transitionT * 2 : (1 - transitionT) * 2;
}
