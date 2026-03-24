/**
 * Gaussian Splat Management
 * Handles loading, setup, and transitions of 3D gaussian splat sculptures
 */
import { Asset, AssetListLoader, Entity, Vec3 } from 'playcanvas';
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { PLASMA_SHADER_GLSL } from '../shaders/plasma.glsl.js';

/**
 * Load only the first splat asset (for fast initial page open)
 */
export async function loadAssets() {
    const app = state.app;
    console.log('📦 Loading first splat asset...');

    // Initialize splatAssets array with nulls for all splats
    state.splatAssets = new Array(CONFIG.splats.length).fill(null);

    // Only load the first splat eagerly
    const firstSplat = CONFIG.splats[0];
    const firstAsset = new Asset(firstSplat.name, 'gsplat', {
        url: `./${firstSplat.file}`
    });
    state.splatAssets[0] = firstAsset;

    const loader = new AssetListLoader([firstAsset], app.assets);

    await new Promise((resolve, reject) => {
        loader.load((err) => {
            if (err) {
                console.error('Asset load error:', err);
                reject(err);
            } else {
                console.log('✅ First splat asset loaded!');
                resolve();
            }
        });
    });

    state.isLoaded = true;
}

/**
 * Load remaining splat assets in the background (called after page is interactive)
 */
export async function loadRemainingAssets() {
    const app = state.app;
    const device = app.graphicsDevice;
    const shaderLanguage = device.isWebGPU ? 'wgsl' : 'glsl';

    for (let i = 1; i < CONFIG.splats.length; i++) {
        const splatConfig = CONFIG.splats[i];
        console.log(`📦 Background loading splat: ${splatConfig.name}...`);

        const asset = new Asset(splatConfig.name, 'gsplat', {
            url: `./${splatConfig.file}`
        });

        const loader = new AssetListLoader([asset], app.assets);

        await new Promise((resolve, reject) => {
            loader.load((err) => {
                if (err) {
                    console.warn(`Failed to background-load ${splatConfig.name}:`, err);
                    resolve(); // Don't block on failure
                } else {
                    state.splatAssets[i] = asset;

                    // If entity already exists (created with null asset), attach the gsplat component now
                    const entity = state.splatEntities[i];
                    if (entity && !entity.gsplat) {
                        entity.addComponent('gsplat', { asset });

                        // Apply shader
                        if (entity.gsplat && entity.gsplat.instance && shaderLanguage === 'glsl') {
                            try {
                                const material = entity.gsplat.instance.material;
                                material.getShaderChunks(shaderLanguage).set('gsplatModifyVS', PLASMA_SHADER_GLSL);
                                material.update();
                                const initialTransition = 1.0;
                                material.setParameter('uTransition', initialTransition);
                                const g = splatConfig.grading || {};
                                material.setParameter('uBrightness', g.brightness ?? 1.0);
                                material.setParameter('uContrast', g.contrast ?? 1.0);
                                material.setParameter('uSaturation', g.saturation ?? 1.0);
                                material.setParameter('uExposure', g.exposure ?? 0.0);
                                material.setParameter('uGamma', g.gamma ?? 1.0);
                                material.setParameter('uTintR', g.tintR ?? 1.0);
                                material.setParameter('uTintG', g.tintG ?? 1.0);
                                material.setParameter('uTintB', g.tintB ?? 1.0);
                                material.setParameter('uHueShift', g.hueShift ?? 0.0);
                                material.setParameter('uShadows', g.shadows ?? 0.0);
                                material.setParameter('uHighlights', g.highlights ?? 1.0);
                                entity.splatConfig = splatConfig;
                                console.log(`🎨 Applied shader to background-loaded ${splatConfig.name}`);
                            } catch (e) {
                                console.warn(`Could not apply shader to ${splatConfig.name}:`, e);
                            }
                        }
                    }

                    console.log(`✅ Background loaded: ${splatConfig.name}`);
                    resolve();
                }
            });
        });
    }

    console.log('✅ All remaining splat assets loaded in background!');
}

/**
 * Create splat entities from loaded assets
 */
export function setupSplats() {
    const app = state.app;

    CONFIG.splats.forEach((splatConfig, index) => {
        const entity = new Entity(splatConfig.name);

        entity.setPosition(...splatConfig.position);
        entity.setEulerAngles(...splatConfig.rotation);
        entity.setLocalScale(splatConfig.scale, splatConfig.scale, splatConfig.scale);

        // Store initial rotation for mouse interaction
        entity.initialRotation = new Vec3(...splatConfig.rotation);

        // Only add gsplat component if the asset is already loaded
        const asset = state.splatAssets[index];
        if (asset) {
            entity.addComponent('gsplat', { asset });
        }

        entity.enabled = (index === 0);

        // Simple: one transition value per splat
        // 0 = normal/visible, 1 = fully transitioned out
        entity.transitionValue = (index === 0) ? 0.0 : 1.0;

        app.root.addChild(entity);
        state.splatEntities.push(entity);

        console.log(`🎭 Splat "${splatConfig.name}" added${asset ? '' : ' (asset pending)'}`);
    });
}

/**
 * Apply custom plasma shaders to splat materials
 */
export function applyCustomShaders() {
    const app = state.app;
    const device = app.graphicsDevice;
    const shaderLanguage = device.isWebGPU ? 'wgsl' : 'glsl';

    state.splatEntities.forEach((entity, index) => {
        if (!entity.gsplat || !entity.gsplat.instance) {
            console.warn(`Splat ${index} not ready for shader`);
            return;
        }

        const splatConfig = CONFIG.splats[index];

        try {
            const gsplatInstance = entity.gsplat.instance;
            const material = gsplatInstance.material;

            if (material && shaderLanguage === 'glsl') {
                material.getShaderChunks(shaderLanguage).set('gsplatModifyVS', PLASMA_SHADER_GLSL);
                material.update();

                // Initialize uTransition
                const initialTransition = (index === 0) ? 0.0 : 1.0;
                material.setParameter('uTransition', initialTransition);

                // Initialize all per-splat color grading uniforms
                const g = splatConfig.grading || {};
                material.setParameter('uBrightness', g.brightness ?? 1.0);
                material.setParameter('uContrast', g.contrast ?? 1.0);
                material.setParameter('uSaturation', g.saturation ?? 1.0);
                material.setParameter('uExposure', g.exposure ?? 0.0);
                material.setParameter('uGamma', g.gamma ?? 1.0);
                material.setParameter('uTintR', g.tintR ?? 1.0);
                material.setParameter('uTintG', g.tintG ?? 1.0);
                material.setParameter('uTintB', g.tintB ?? 1.0);
                material.setParameter('uHueShift', g.hueShift ?? 0.0);
                material.setParameter('uShadows', g.shadows ?? 0.0);
                material.setParameter('uHighlights', g.highlights ?? 1.0);

                // Store config reference for debug panel
                entity.splatConfig = splatConfig;

                console.log(`🎨 Applied full shader to ${entity.name}`);
            }
        } catch (e) {
            console.warn(`Could not apply shader to ${entity.name}:`, e);
        }
    });
}

/**
 * Update all color grading uniforms for a specific splat at runtime
 */
export function updateSplatGrading(index, grading) {
    const entity = state.splatEntities[index];
    if (!entity || !entity.gsplat || !entity.gsplat.instance) return;

    const material = entity.gsplat.instance.material;
    if (material) {
        material.setParameter('uBrightness', grading.brightness);
        material.setParameter('uContrast', grading.contrast);
        material.setParameter('uSaturation', grading.saturation);
        material.setParameter('uExposure', grading.exposure);
        material.setParameter('uGamma', grading.gamma);
        material.setParameter('uTintR', grading.tintR);
        material.setParameter('uTintG', grading.tintG);
        material.setParameter('uTintB', grading.tintB);
        material.setParameter('uHueShift', grading.hueShift);
        material.setParameter('uShadows', grading.shadows);
        material.setParameter('uHighlights', grading.highlights);
    }

    // Update config for persistence
    if (entity.splatConfig) {
        entity.splatConfig.grading = { ...grading };
    }
}

/**
 * Update splat transitions based on scroll position
 * Each splat has ONE transition value: 0 = normal, 0.5 = peak explosion, 1 = gone
 */
export function updateSplatTransitions(currentIndex, transitionT, dt) {
    state.splatEntities.forEach((entity, index) => {
        let targetTransition;

        if (index < currentIndex) {
            // Already passed - fully transitioned out
            targetTransition = 1.0;
        } else if (index === currentIndex) {
            // Current splat: transition from 0 (normal) toward 1 (gone) as transitionT increases
            targetTransition = transitionT;
        } else if (index === currentIndex + 1) {
            // Next splat: transition from 1 (gone) toward 0 (normal) as transitionT increases
            targetTransition = 1.0 - transitionT;
        } else {
            // Future splats - not yet visible, keep at 1
            targetTransition = 1.0;
        }

        // Smooth interpolation for nice easing
        const speed = 8.0;
        entity.transitionValue += (targetTransition - entity.transitionValue) * Math.min(1, dt * speed);

        // Update shader uniform BEFORE deciding visibility
        // This prevents the flash of a visible splat on the first frame
        if (entity.gsplat && entity.gsplat.instance) {
            const material = entity.gsplat.instance.material;
            if (material) {
                material.setParameter('uTransition', entity.transitionValue);
            }
        }

        // Visibility is based on transition value
        // Only visible if transition value is low enough to have opacity
        const shouldBeVisible = entity.transitionValue < 0.85;
        entity.enabled = shouldBeVisible;
    });
}

/**
 * Update splat rotation based on mouse position
 */
export function updateSplatInteraction(dt) {
    state.splatEntities.forEach((entity, index) => {
        // Only affect the active or near-active splats
        if (!entity.enabled || !entity.initialRotation) return;

        // Skip Romislav (index 2) - his rotation is near gimbal lock zone
        // which causes erratic flipping with Euler angle interpolation
        if (index === 2) return;

        // Clamp mouse to prevent extreme values at edges
        const clampedMouseX = Math.max(-0.8, Math.min(0.8, state.mouse.x));
        const clampedMouseY = Math.max(-0.8, Math.min(0.8, state.mouse.y));

        // Intensity of the effect (in degrees) - reduced to prevent extreme rotations
        const intensityX = 8; // Vertical rotation (pitch)
        const intensityY = 10; // Horizontal rotation (yaw)

        // Calculate target rotation offset from initial
        const targetPitch = entity.initialRotation.x - (clampedMouseY * intensityX);
        const targetYaw = entity.initialRotation.y + (clampedMouseX * intensityY);

        // Clamp target to safe range from initial rotation
        const maxDeviation = 15; // Maximum degrees from initial rotation
        const clampedPitch = Math.max(
            entity.initialRotation.x - maxDeviation,
            Math.min(entity.initialRotation.x + maxDeviation, targetPitch)
        );
        const clampedYaw = Math.max(
            entity.initialRotation.y - maxDeviation,
            Math.min(entity.initialRotation.y + maxDeviation, targetYaw)
        );

        // Smoothly interpolate current rotation towards target
        const currentRot = entity.getEulerAngles();
        const lerpSpeed = 2.0;
        const lerpFactor = Math.min(1, dt * lerpSpeed);

        const newPitch = currentRot.x + (clampedPitch - currentRot.x) * lerpFactor;
        const newYaw = currentRot.y + (clampedYaw - currentRot.y) * lerpFactor;

        // Only update if change is significant
        if (Math.abs(newPitch - currentRot.x) > 0.01 || Math.abs(newYaw - currentRot.y) > 0.01) {
            entity.setEulerAngles(newPitch, newYaw, entity.initialRotation.z);
        }
    });
}
