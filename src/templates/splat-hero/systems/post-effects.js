/**
 * Post-Processing Effects System
 * Uses PlayCanvas CameraFrame for HDR post-processing
 * Full API: rendering, bloom, grading, vignette, fringing, ssao, taa, dof
 */
import { CameraFrame, Color } from 'playcanvas';
import { state } from '../state.js';
import { IS_DEV } from '../config.js';

/** Post-effects configuration - all available CameraFrame parameters */
export const POST_EFFECTS_CONFIG = {
    // Rendering settings
    rendering: {
        toneMapping: 0,      // 0=LINEAR, 1=FILMIC, 2=HEJL, 3=ACES, 4=ACES2, 5=NEUTRAL
        sharpness: 0.0,      // 0-1 range
        renderTargetScale: 1.0  // 0.1-1 range
    },

    // Bloom - HDR glow from bright areas
    bloom: {
        intensity: 0.01,     // 0-0.1 range
        blurLevel: 12        // Blur iterations (1-16)
    },

    // Color grading
    grading: {
        enabled: true,
        brightness: 1.0,     // 0-3 range
        contrast: 1.35,      // 0.5-1.5 range
        saturation: 1.65,    // 0-2 range
        tint: new Color(1, 1, 1, 1)  // Tint color
    },

    // Vignette - darkens edges
    vignette: {
        intensity: 1.0,      // 0-1 range
        inner: 0.4,          // 0-3 range
        outer: 1.2,          // 0-3 range
        curvature: 0.5,      // 0.01-10 range
        color: new Color(0, 0, 0)
    },

    // Fringing - chromatic aberration
    fringing: {
        intensity: 36        // 0-100 range
    },

    // SSAO - screen space ambient occlusion
    ssao: {
        enabled: false,
        type: 'none',        // 'none', 'lighting', 'combine'
        intensity: 0.5,      // 0-1 range
        radius: 30,          // 0-100 range
        samples: 12,         // 1-64 range
        power: 6,            // 0.1-10 range
        blurEnabled: true
    },

    // TAA - temporal anti-aliasing
    taa: {
        enabled: false,
        jitter: 1.0          // 0-1 range
    },

    // DOF - depth of field
    dof: {
        enabled: false,
        focusDistance: 100,  // distance
        focusRange: 10,      // range
        blurRadius: 3,       // 2-10 range
        nearBlur: false
    }
};

/** CameraFrame instance */
let cameraFrame = null;

/**
 * Setup post-processing effects on camera
 */
export function setupPostEffects() {
    const app = state.app;
    const camera = state.camera;

    if (!camera || !camera.camera) {
        console.warn('Camera not ready for post-effects');
        return;
    }

    try {
        // Create CameraFrame for post-processing
        cameraFrame = new CameraFrame(app, camera.camera);

        // Apply all settings
        applyAllSettings();

        // Enable the camera frame
        cameraFrame.enabled = true;
        cameraFrame.update();

        // Store reference for updates
        state.cameraFrame = cameraFrame;

        console.log('🎬 Post-processing effects enabled (full API)');

    } catch (e) {
        console.warn('Could not setup post-effects:', e);
    }
}

/**
 * Apply all config settings to cameraFrame
 */
function applyAllSettings() {
    if (!cameraFrame) return;

    const { rendering, bloom, grading, vignette, fringing, ssao, taa, dof } = POST_EFFECTS_CONFIG;

    // Rendering
    cameraFrame.rendering.toneMapping = rendering.toneMapping;
    cameraFrame.rendering.sharpness = rendering.sharpness;
    cameraFrame.rendering.renderTargetScale = rendering.renderTargetScale;

    // Bloom
    cameraFrame.bloom.intensity = bloom.intensity;
    cameraFrame.bloom.blurLevel = bloom.blurLevel;

    // Grading
    cameraFrame.grading.enabled = grading.enabled;
    cameraFrame.grading.brightness = grading.brightness;
    cameraFrame.grading.contrast = grading.contrast;
    cameraFrame.grading.saturation = grading.saturation;
    cameraFrame.grading.tint = grading.tint;

    // Vignette
    cameraFrame.vignette.intensity = vignette.intensity;
    cameraFrame.vignette.inner = vignette.inner;
    cameraFrame.vignette.outer = vignette.outer;
    cameraFrame.vignette.curvature = vignette.curvature;
    cameraFrame.vignette.color = vignette.color;

    // Fringing
    cameraFrame.fringing.intensity = fringing.intensity;

    // SSAO
    if (ssao.enabled && ssao.type !== 'none') {
        // SSAOTYPE_NONE = 'none', SSAOTYPE_LIGHTING = 'lighting', SSAOTYPE_COMBINE = 'combine'
        cameraFrame.ssao.type = ssao.type;
        cameraFrame.ssao.intensity = ssao.intensity;
        cameraFrame.ssao.radius = ssao.radius;
        cameraFrame.ssao.samples = ssao.samples;
        cameraFrame.ssao.power = ssao.power;
        cameraFrame.ssao.blurEnabled = ssao.blurEnabled;
    }

    // TAA
    cameraFrame.taa.enabled = taa.enabled;
    cameraFrame.taa.jitter = taa.jitter;

    // DOF
    cameraFrame.dof.enabled = dof.enabled;
    cameraFrame.dof.focusDistance = dof.focusDistance;
    cameraFrame.dof.focusRange = dof.focusRange;
    cameraFrame.dof.blurRadius = dof.blurRadius;
    cameraFrame.dof.nearBlur = dof.nearBlur;
}

/**
 * Update post-effects each frame
 */
export function updatePostEffects() {
    if (cameraFrame && cameraFrame.enabled) {
        cameraFrame.update();
    }
}

/**
 * Dynamically adjust effects during transitions
 */
export function adjustEffectsForTransition(transitionIntensity) {
    if (!cameraFrame) return;

    // Increase bloom during transition
    const baseBloom = POST_EFFECTS_CONFIG.bloom.intensity;
    cameraFrame.bloom.intensity = baseBloom + (transitionIntensity * 0.04);

    // Increase chromatic aberration during transition
    const baseFringing = POST_EFFECTS_CONFIG.fringing.intensity;
    cameraFrame.fringing.intensity = baseFringing + (transitionIntensity * 10);
}

/**
 * Create comprehensive debug panel for ALL post-effects (dev only)
 */
export function createPostEffectsDebugPanel() {
    if (!IS_DEV || !cameraFrame) return;

    const panel = document.createElement('div');
    panel.id = 'post-effects-debug-panel';
    panel.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.92);
        border: 1px solid rgba(201, 167, 122, 0.4);
        border-radius: 8px;
        padding: 16px;
        z-index: 1000;
        font-family: 'Inter', -apple-system, sans-serif;
        font-size: 11px;
        color: #f0ebe3;
        min-width: 280px;
        max-height: 85vh;
        overflow-y: auto;
        overscroll-behavior: contain;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        display: none;
    `;

    const cfg = POST_EFFECTS_CONFIG;

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(201, 167, 122, 0.3); padding-bottom: 8px;">
            <span style="font-weight: 600; color: #c9a77a; letter-spacing: 0.1em;">POST EFFECTS</span>
            <span style="color: #6b6b7a; font-size: 10px;">Press E to toggle</span>
        </div>
        
        <!-- RENDERING -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="color: #c9a77a; font-size: 10px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em;">Rendering</div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Tone Mapping</span>
                    <select id="pe-toneMapping" style="background: #1a1a24; border: 1px solid #3a3a4a; border-radius: 3px; color: #f0ebe3; font-size: 10px;">
                        <option value="0" ${cfg.rendering.toneMapping === 0 ? 'selected' : ''}>Linear</option>
                        <option value="1" ${cfg.rendering.toneMapping === 1 ? 'selected' : ''}>Filmic</option>
                        <option value="2" ${cfg.rendering.toneMapping === 2 ? 'selected' : ''}>Hejl</option>
                        <option value="3" ${cfg.rendering.toneMapping === 3 ? 'selected' : ''}>ACES</option>
                        <option value="4" ${cfg.rendering.toneMapping === 4 ? 'selected' : ''}>ACES2</option>
                        <option value="5" ${cfg.rendering.toneMapping === 5 ? 'selected' : ''}>Neutral</option>
                    </select>
                </label>
            </div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Sharpness</span>
                    <span id="pe-sharpness-val">${cfg.rendering.sharpness.toFixed(2)}</span>
                </label>
                <input type="range" id="pe-sharpness" min="0" max="1" step="0.05" value="${cfg.rendering.sharpness}" style="width: 100%;">
            </div>
        </div>
        
        <!-- BLOOM -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="color: #c9a77a; font-size: 10px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em;">Bloom</div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Intensity</span>
                    <span id="pe-bloom-val">${cfg.bloom.intensity.toFixed(3)}</span>
                </label>
                <input type="range" id="pe-bloom" min="0" max="0.15" step="0.005" value="${cfg.bloom.intensity}" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Blur Level</span>
                    <span id="pe-bloomBlur-val">${cfg.bloom.blurLevel}</span>
                </label>
                <input type="range" id="pe-bloomBlur" min="1" max="16" step="1" value="${cfg.bloom.blurLevel}" style="width: 100%;">
            </div>
        </div>
        
        <!-- GRADING -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="color: #c9a77a; font-size: 10px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em;">Color Grading</div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Brightness</span>
                    <span id="pe-brightness-val">${cfg.grading.brightness.toFixed(2)}</span>
                </label>
                <input type="range" id="pe-brightness" min="0" max="3" step="0.05" value="${cfg.grading.brightness}" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Contrast</span>
                    <span id="pe-contrast-val">${cfg.grading.contrast.toFixed(2)}</span>
                </label>
                <input type="range" id="pe-contrast" min="0.5" max="1.5" step="0.05" value="${cfg.grading.contrast}" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Saturation</span>
                    <span id="pe-saturation-val">${cfg.grading.saturation.toFixed(2)}</span>
                </label>
                <input type="range" id="pe-saturation" min="0" max="2" step="0.05" value="${cfg.grading.saturation}" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Tint</span>
                    <input type="color" id="pe-tint" value="#ffffff" style="width: 40px; height: 20px; border: none; cursor: pointer;">
                </label>
            </div>
        </div>
        
        <!-- VIGNETTE -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="color: #c9a77a; font-size: 10px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em;">Vignette</div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Intensity</span>
                    <span id="pe-vignetteInt-val">${cfg.vignette.intensity.toFixed(2)}</span>
                </label>
                <input type="range" id="pe-vignetteInt" min="0" max="1" step="0.05" value="${cfg.vignette.intensity}" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Inner</span>
                    <span id="pe-vignetteInner-val">${cfg.vignette.inner.toFixed(2)}</span>
                </label>
                <input type="range" id="pe-vignetteInner" min="0" max="3" step="0.1" value="${cfg.vignette.inner}" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Outer</span>
                    <span id="pe-vignetteOuter-val">${cfg.vignette.outer.toFixed(2)}</span>
                </label>
                <input type="range" id="pe-vignetteOuter" min="0" max="3" step="0.1" value="${cfg.vignette.outer}" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Curvature</span>
                    <span id="pe-vignetteCurve-val">${cfg.vignette.curvature.toFixed(2)}</span>
                </label>
                <input type="range" id="pe-vignetteCurve" min="0.01" max="10" step="0.1" value="${cfg.vignette.curvature}" style="width: 100%;">
            </div>
        </div>
        
        <!-- FRINGING -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="color: #c9a77a; font-size: 10px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em;">Chromatic Aberration</div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Intensity</span>
                    <span id="pe-fringing-val">${cfg.fringing.intensity}</span>
                </label>
                <input type="range" id="pe-fringing" min="0" max="100" step="1" value="${cfg.fringing.intensity}" style="width: 100%;">
            </div>
        </div>
        
        <!-- DOF -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #c9a77a; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em;">Depth of Field</span>
                <input type="checkbox" id="pe-dofEnabled" ${cfg.dof.enabled ? 'checked' : ''}>
            </div>
            
            <div id="dof-controls" style="margin-top: 8px; ${cfg.dof.enabled ? '' : 'opacity: 0.4; pointer-events: none;'}">
                <div style="margin-bottom: 8px;">
                    <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                        <span>Focus Distance</span>
                        <span id="pe-dofFocus-val">${cfg.dof.focusDistance}</span>
                    </label>
                    <input type="range" id="pe-dofFocus" min="0" max="500" step="5" value="${cfg.dof.focusDistance}" style="width: 100%;">
                </div>
                
                <div style="margin-bottom: 8px;">
                    <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                        <span>Focus Range</span>
                        <span id="pe-dofRange-val">${cfg.dof.focusRange}</span>
                    </label>
                    <input type="range" id="pe-dofRange" min="1" max="100" step="1" value="${cfg.dof.focusRange}" style="width: 100%;">
                </div>
                
                <div style="margin-bottom: 8px;">
                    <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                        <span>Blur Radius</span>
                        <span id="pe-dofBlur-val">${cfg.dof.blurRadius}</span>
                    </label>
                    <input type="range" id="pe-dofBlur" min="1" max="10" step="0.5" value="${cfg.dof.blurRadius}" style="width: 100%;">
                </div>
            </div>
        </div>
        
        <!-- TAA -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #c9a77a; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em;">TAA (Anti-Aliasing)</span>
                <input type="checkbox" id="pe-taaEnabled" ${cfg.taa.enabled ? 'checked' : ''}>
            </div>
            
            <div id="taa-controls" style="margin-top: 8px; ${cfg.taa.enabled ? '' : 'opacity: 0.4; pointer-events: none;'}">
                <div style="margin-bottom: 8px;">
                    <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                        <span>Jitter</span>
                        <span id="pe-taaJitter-val">${cfg.taa.jitter.toFixed(2)}</span>
                    </label>
                    <input type="range" id="pe-taaJitter" min="0" max="1" step="0.1" value="${cfg.taa.jitter}" style="width: 100%;">
                </div>
            </div>
        </div>
        
        <!-- LOG BUTTON -->
        <button id="pe-log-values" style="width: 100%; padding: 8px; background: rgba(201, 167, 122, 0.2); border: 1px solid rgba(201, 167, 122, 0.4); border-radius: 4px; color: #c9a77a; cursor: pointer; font-size: 11px; margin-top: 8px;">
            Log Current Values
        </button>
    `;

    document.body.appendChild(panel);

    // Helper to bind slider
    const bindSlider = (id, configPath, cfObj, updateFn) => {
        const el = document.getElementById(id);
        const valEl = document.getElementById(id + '-val');
        el.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            if (valEl) valEl.textContent = Number.isInteger(val) ? val : val.toFixed(2);
            updateFn(val);
            cameraFrame.update();
        });
    };

    // Rendering
    document.getElementById('pe-toneMapping').addEventListener('change', (e) => {
        const val = parseInt(e.target.value);
        cfg.rendering.toneMapping = val;
        cameraFrame.rendering.toneMapping = val;
        cameraFrame.update();
    });
    bindSlider('pe-sharpness', 'rendering.sharpness', cfg, (v) => {
        cfg.rendering.sharpness = v;
        cameraFrame.rendering.sharpness = v;
    });

    // Bloom
    bindSlider('pe-bloom', 'bloom.intensity', cfg, (v) => {
        cfg.bloom.intensity = v;
        cameraFrame.bloom.intensity = v;
    });
    bindSlider('pe-bloomBlur', 'bloom.blurLevel', cfg, (v) => {
        cfg.bloom.blurLevel = v;
        cameraFrame.bloom.blurLevel = v;
    });

    // Grading
    bindSlider('pe-brightness', 'grading.brightness', cfg, (v) => {
        cfg.grading.brightness = v;
        cameraFrame.grading.brightness = v;
    });
    bindSlider('pe-contrast', 'grading.contrast', cfg, (v) => {
        cfg.grading.contrast = v;
        cameraFrame.grading.contrast = v;
    });
    bindSlider('pe-saturation', 'grading.saturation', cfg, (v) => {
        cfg.grading.saturation = v;
        cameraFrame.grading.saturation = v;
    });
    document.getElementById('pe-tint').addEventListener('input', (e) => {
        const hex = e.target.value;
        const r = parseInt(hex.substr(1, 2), 16) / 255;
        const g = parseInt(hex.substr(3, 2), 16) / 255;
        const b = parseInt(hex.substr(5, 2), 16) / 255;
        cfg.grading.tint = new Color(r, g, b, 1);
        cameraFrame.grading.tint = cfg.grading.tint;
        cameraFrame.update();
    });

    // Vignette
    bindSlider('pe-vignetteInt', 'vignette.intensity', cfg, (v) => {
        cfg.vignette.intensity = v;
        cameraFrame.vignette.intensity = v;
    });
    bindSlider('pe-vignetteInner', 'vignette.inner', cfg, (v) => {
        cfg.vignette.inner = v;
        cameraFrame.vignette.inner = v;
    });
    bindSlider('pe-vignetteOuter', 'vignette.outer', cfg, (v) => {
        cfg.vignette.outer = v;
        cameraFrame.vignette.outer = v;
    });
    bindSlider('pe-vignetteCurve', 'vignette.curvature', cfg, (v) => {
        cfg.vignette.curvature = v;
        cameraFrame.vignette.curvature = v;
    });

    // Fringing
    bindSlider('pe-fringing', 'fringing.intensity', cfg, (v) => {
        cfg.fringing.intensity = v;
        cameraFrame.fringing.intensity = v;
    });

    // DOF
    document.getElementById('pe-dofEnabled').addEventListener('change', (e) => {
        cfg.dof.enabled = e.target.checked;
        cameraFrame.dof.enabled = e.target.checked;
        document.getElementById('dof-controls').style.opacity = e.target.checked ? '1' : '0.4';
        document.getElementById('dof-controls').style.pointerEvents = e.target.checked ? 'all' : 'none';
        cameraFrame.update();
    });
    bindSlider('pe-dofFocus', 'dof.focusDistance', cfg, (v) => {
        cfg.dof.focusDistance = v;
        cameraFrame.dof.focusDistance = v;
    });
    bindSlider('pe-dofRange', 'dof.focusRange', cfg, (v) => {
        cfg.dof.focusRange = v;
        cameraFrame.dof.focusRange = v;
    });
    bindSlider('pe-dofBlur', 'dof.blurRadius', cfg, (v) => {
        cfg.dof.blurRadius = v;
        cameraFrame.dof.blurRadius = v;
    });

    // TAA
    document.getElementById('pe-taaEnabled').addEventListener('change', (e) => {
        cfg.taa.enabled = e.target.checked;
        cameraFrame.taa.enabled = e.target.checked;
        document.getElementById('taa-controls').style.opacity = e.target.checked ? '1' : '0.4';
        document.getElementById('taa-controls').style.pointerEvents = e.target.checked ? 'all' : 'none';
        cameraFrame.update();
    });
    bindSlider('pe-taaJitter', 'taa.jitter', cfg, (v) => {
        cfg.taa.jitter = v;
        cameraFrame.taa.jitter = v;
    });

    // Log button
    document.getElementById('pe-log-values').addEventListener('click', () => {
        console.log('\n📊 POST EFFECTS CONFIG:\n');
        console.log('rendering:', JSON.stringify(cfg.rendering, null, 2));
        console.log('bloom:', JSON.stringify(cfg.bloom, null, 2));
        console.log('grading:', { ...cfg.grading, tint: `Color(${cfg.grading.tint.r.toFixed(2)}, ${cfg.grading.tint.g.toFixed(2)}, ${cfg.grading.tint.b.toFixed(2)})` });
        console.log('vignette:', { ...cfg.vignette, color: 'Color(0,0,0)' });
        console.log('fringing:', JSON.stringify(cfg.fringing, null, 2));
        console.log('dof:', JSON.stringify(cfg.dof, null, 2));
        console.log('taa:', JSON.stringify(cfg.taa, null, 2));
    });

    // Toggle with E key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'e' || e.key === 'E') {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    });
    // Prevent scroll from propagating to main page
    panel.addEventListener('wheel', (e) => {
        e.stopPropagation();
    }, { passive: true });

    state.postEffectsPanel = panel;
    console.log('🎛️ Full post-effects panel ready (Press E to toggle)');
}
