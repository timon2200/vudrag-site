/**
 * Splat & Camera Debug Panel (Development Only)
 * Real-time tuning UI for splat rotation/position/scale and camera sway
 */
import { CONFIG } from '../config.js';
import { state } from '../state.js';

/** Camera sway settings (mutable for debug) */
export const CAMERA_SETTINGS = {
    swayAmplitude: 0.55,
    swaySpeed: 0.31
};

/**
 * Create debug panel for splat and camera tuning
 */
export function createSplatDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'splat-debug-panel';
    panel.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid rgba(201, 167, 122, 0.4);
        border-radius: 8px;
        padding: 16px;
        z-index: 1000;
        font-family: 'Inter', -apple-system, sans-serif;
        font-size: 11px;
        color: #f0ebe3;
        min-width: 320px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        display: none;
    `;

    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(201, 167, 122, 0.2); padding-bottom: 8px;">
            <span style="font-weight: 600; color: #c9a77a; letter-spacing: 0.1em;">SPLAT & CAMERA</span>
            <span style="color: #6b6b7a; font-size: 10px;">Press S to toggle</span>
        </div>

        <!-- Camera Sway Controls -->
        <div style="margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <div style="color: #c9a77a; margin-bottom: 8px; font-weight: 500;">Camera Sway</div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Amplitude</span>
                    <span id="sway-amp-value">${CAMERA_SETTINGS.swayAmplitude}</span>
                </label>
                <input type="range" id="slider-sway-amp" min="0" max="1" step="0.05" value="${CAMERA_SETTINGS.swayAmplitude}" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Speed</span>
                    <span id="sway-speed-value">${CAMERA_SETTINGS.swaySpeed}</span>
                </label>
                <input type="range" id="slider-sway-speed" min="0.01" max="0.5" step="0.01" value="${CAMERA_SETTINGS.swaySpeed}" style="width: 100%;">
            </div>
        </div>
    `;

    // Generate controls for each splat
    CONFIG.splats.forEach((splat, index) => {
        html += `
        <div style="margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <div style="color: #c9a77a; margin-bottom: 8px; font-weight: 500;">${splat.name}</div>
            
            <!-- Rotation Controls -->
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Rotation X</span>
                    <span id="rot-x-value-${index}">${splat.rotation[0]}</span>
                </label>
                <input type="range" id="slider-rot-x-${index}" min="-180" max="180" step="5" value="${splat.rotation[0]}" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Rotation Y</span>
                    <span id="rot-y-value-${index}">${splat.rotation[1]}</span>
                </label>
                <input type="range" id="slider-rot-y-${index}" min="-180" max="180" step="5" value="${splat.rotation[1]}" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Rotation Z (Vertical)</span>
                    <span id="rot-z-value-${index}">${splat.rotation[2]}</span>
                </label>
                <input type="range" id="slider-rot-z-${index}" min="-180" max="360" step="5" value="${splat.rotation[2]}" style="width: 100%;">
            </div>
            
            <!-- Position Controls -->
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Position Y</span>
                    <span id="pos-y-value-${index}">${splat.position[1]}</span>
                </label>
                <input type="range" id="slider-pos-y-${index}" min="-1" max="2" step="0.05" value="${splat.position[1]}" style="width: 100%;">
            </div>
            
            <!-- Scale Control -->
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Scale</span>
                    <span id="scale-value-${index}">${splat.scale}</span>
                </label>
                <input type="range" id="slider-scale-${index}" min="0.1" max="2" step="0.05" value="${splat.scale}" style="width: 100%;">
            </div>
        </div>
        `;
    });

    html += `
        <button id="log-splat-params" style="
            width: 100%;
            padding: 8px;
            background: rgba(201, 167, 122, 0.2);
            border: 1px solid rgba(201, 167, 122, 0.4);
            border-radius: 4px;
            color: #c9a77a;
            cursor: pointer;
            font-size: 11px;
        ">Log Current Values</button>
    `;

    panel.innerHTML = html;
    document.body.appendChild(panel);

    // Camera sway handlers
    document.getElementById('slider-sway-amp').addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        document.getElementById('sway-amp-value').textContent = val.toFixed(2);
        CAMERA_SETTINGS.swayAmplitude = val;
    });

    document.getElementById('slider-sway-speed').addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        document.getElementById('sway-speed-value').textContent = val.toFixed(2);
        CAMERA_SETTINGS.swaySpeed = val;
    });

    // Splat control handlers
    CONFIG.splats.forEach((splat, index) => {
        const entity = state.splatEntities[index];

        // Rotation X
        document.getElementById(`slider-rot-x-${index}`).addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            document.getElementById(`rot-x-value-${index}`).textContent = val;
            splat.rotation[0] = val;
            if (entity) entity.setEulerAngles(splat.rotation[0], splat.rotation[1], splat.rotation[2]);
        });

        // Rotation Y
        document.getElementById(`slider-rot-y-${index}`).addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            document.getElementById(`rot-y-value-${index}`).textContent = val;
            splat.rotation[1] = val;
            if (entity) entity.setEulerAngles(splat.rotation[0], splat.rotation[1], splat.rotation[2]);
        });

        // Rotation Z
        document.getElementById(`slider-rot-z-${index}`).addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            document.getElementById(`rot-z-value-${index}`).textContent = val;
            splat.rotation[2] = val;
            if (entity) entity.setEulerAngles(splat.rotation[0], splat.rotation[1], splat.rotation[2]);
        });

        // Position Y
        document.getElementById(`slider-pos-y-${index}`).addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            document.getElementById(`pos-y-value-${index}`).textContent = val.toFixed(2);
            splat.position[1] = val;
            if (entity) entity.setPosition(splat.position[0], splat.position[1], splat.position[2]);
        });

        // Scale
        document.getElementById(`slider-scale-${index}`).addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            document.getElementById(`scale-value-${index}`).textContent = val.toFixed(2);
            splat.scale = val;
            if (entity) entity.setLocalScale(val, val, val);
        });
    });

    // Log button
    document.getElementById('log-splat-params').addEventListener('click', () => {
        console.log('=== SPLAT & CAMERA PARAMETERS ===');
        console.log(`Camera Sway: amplitude=${CAMERA_SETTINGS.swayAmplitude}, speed=${CAMERA_SETTINGS.swaySpeed}`);
        CONFIG.splats.forEach((splat, index) => {
            console.log(`${splat.name}:`);
            console.log(`  position: [${splat.position.join(', ')}]`);
            console.log(`  rotation: [${splat.rotation.join(', ')}]`);
            console.log(`  scale: ${splat.scale}`);
        });
        console.log('Copy these values to config.js to save!');
    });

    // Toggle with S key
    window.addEventListener('keydown', (e) => {
        if (e.key === 's' || e.key === 'S') {
            // Don't toggle if typing in an input
            if (e.target.tagName === 'INPUT') return;
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    });

    state.splatDebugPanel = panel;
    console.log('🎛️ Splat & Camera debug panel ready (Press S to toggle)');
}
