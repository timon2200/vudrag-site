/**
 * Splat Grading Debug Panel
 * Per-splat color grading controls (dev only)
 * Toggle with G key
 * 
 * Controls: Brightness, Contrast, Saturation, Exposure, Gamma,
 *           Tint (RGB), Hue Shift, Shadows, Highlights
 */
import { CONFIG, IS_DEV } from '../config.js';
import { state } from '../state.js';
import { updateSplatGrading } from '../systems/splats.js';

let panel = null;
let currentSplatIndex = 0;
let currentGrading = {};

// Default grading values
const DEFAULTS = {
    brightness: 1.0, contrast: 1.0, saturation: 1.0,
    exposure: 0.0, gamma: 1.0,
    tintR: 1.0, tintG: 1.0, tintB: 1.0,
    hueShift: 0.0, shadows: 0.0, highlights: 1.0
};

/**
 * Create the splat grading debug panel
 */
export function createSplatGradingPanel() {
    if (!IS_DEV) return;

    panel = document.createElement('div');
    panel.id = 'splat-grading-panel';
    panel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
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

    const splatOptions = CONFIG.splats.map((s, i) =>
        `<option value="${i}">${s.name}</option>`
    ).join('');

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(201, 167, 122, 0.3); padding-bottom: 8px;">
            <span style="font-weight: 600; color: #c9a77a; letter-spacing: 0.1em;">SPLAT GRADING</span>
            <span style="color: #6b6b7a; font-size: 10px;">Press G to toggle</span>
        </div>
        
        <div style="margin-bottom: 12px;">
            <label style="display: block; margin-bottom: 4px;">Select Splat</label>
            <select id="sg-splat-select" style="width: 100%; padding: 6px; background: #1a1a24; border: 1px solid #3a3a4a; border-radius: 4px; color: #f0ebe3;">
                ${splatOptions}
            </select>
        </div>
        
        <!-- EXPOSURE & BRIGHTNESS -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="color: #c9a77a; font-size: 10px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em;">Exposure</div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Exposure</span>
                    <span id="sg-exposure-val">0.00</span>
                </label>
                <input type="range" id="sg-exposure" min="-2" max="2" step="0.1" value="0" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Brightness</span>
                    <span id="sg-brightness-val">1.00</span>
                </label>
                <input type="range" id="sg-brightness" min="0.5" max="2.0" step="0.05" value="1.0" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Gamma</span>
                    <span id="sg-gamma-val">1.00</span>
                </label>
                <input type="range" id="sg-gamma" min="0.5" max="2.0" step="0.05" value="1.0" style="width: 100%;">
            </div>
        </div>
        
        <!-- CONTRAST & SATURATION -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="color: #c9a77a; font-size: 10px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em;">Tone</div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Contrast</span>
                    <span id="sg-contrast-val">1.00</span>
                </label>
                <input type="range" id="sg-contrast" min="0.5" max="2.0" step="0.05" value="1.0" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Saturation</span>
                    <span id="sg-saturation-val">1.00</span>
                </label>
                <input type="range" id="sg-saturation" min="0" max="2.0" step="0.05" value="1.0" style="width: 100%;">
            </div>
        </div>
        
        <!-- SHADOWS & HIGHLIGHTS -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="color: #c9a77a; font-size: 10px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em;">Shadows / Highlights</div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Shadows</span>
                    <span id="sg-shadows-val">0.00</span>
                </label>
                <input type="range" id="sg-shadows" min="-1" max="1" step="0.05" value="0" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Highlights</span>
                    <span id="sg-highlights-val">1.00</span>
                </label>
                <input type="range" id="sg-highlights" min="0.5" max="1.5" step="0.05" value="1.0" style="width: 100%;">
            </div>
        </div>
        
        <!-- HUE & TINT -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="color: #c9a77a; font-size: 10px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em;">Color</div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Hue Shift</span>
                    <span id="sg-hueShift-val">0.00</span>
                </label>
                <input type="range" id="sg-hueShift" min="-0.5" max="0.5" step="0.01" value="0" style="width: 100%;">
            </div>
            
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>Tint</span>
                    <input type="color" id="sg-tint" value="#ffffff" style="width: 40px; height: 20px; border: none; cursor: pointer;">
                </label>
            </div>
            
            <div style="display: flex; gap: 8px;">
                <div style="flex: 1;">
                    <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                        <span>R</span>
                        <span id="sg-tintR-val">1.00</span>
                    </label>
                    <input type="range" id="sg-tintR" min="0" max="2" step="0.05" value="1.0" style="width: 100%;">
                </div>
                <div style="flex: 1;">
                    <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                        <span>G</span>
                        <span id="sg-tintG-val">1.00</span>
                    </label>
                    <input type="range" id="sg-tintG" min="0" max="2" step="0.05" value="1.0" style="width: 100%;">
                </div>
                <div style="flex: 1;">
                    <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                        <span>B</span>
                        <span id="sg-tintB-val">1.00</span>
                    </label>
                    <input type="range" id="sg-tintB" min="0" max="2" step="0.05" value="1.0" style="width: 100%;">
                </div>
            </div>
        </div>
        
        <!-- BUTTONS -->
        <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button id="sg-reset" style="flex: 1; padding: 8px; background: rgba(100, 100, 100, 0.2); border: 1px solid rgba(100, 100, 100, 0.4); border-radius: 4px; color: #888; cursor: pointer; font-size: 11px;">
                Reset
            </button>
            <button id="sg-log-values" style="flex: 1; padding: 8px; background: rgba(201, 167, 122, 0.2); border: 1px solid rgba(201, 167, 122, 0.4); border-radius: 4px; color: #c9a77a; cursor: pointer; font-size: 11px;">
                Log Values
            </button>
        </div>
    `;

    document.body.appendChild(panel);

    // Get all slider elements
    const sliders = ['exposure', 'brightness', 'gamma', 'contrast', 'saturation', 'shadows', 'highlights', 'hueShift', 'tintR', 'tintG', 'tintB'];

    // Load values for a splat
    function loadSplatValues(index) {
        currentSplatIndex = index;
        const g = CONFIG.splats[index].grading || { ...DEFAULTS };
        currentGrading = { ...DEFAULTS, ...g };

        sliders.forEach(key => {
            const slider = document.getElementById(`sg-${key}`);
            const valEl = document.getElementById(`sg-${key}-val`);
            if (slider && currentGrading[key] !== undefined) {
                slider.value = currentGrading[key];
                if (valEl) valEl.textContent = currentGrading[key].toFixed(2);
            }
        });

        // Update tint color picker
        const tintPicker = document.getElementById('sg-tint');
        const r = Math.min(255, Math.round(currentGrading.tintR * 255));
        const g2 = Math.min(255, Math.round(currentGrading.tintG * 255));
        const b = Math.min(255, Math.round(currentGrading.tintB * 255));
        tintPicker.value = `#${r.toString(16).padStart(2, '0')}${g2.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    // Apply current grading to splat
    function applyGrading() {
        updateSplatGrading(currentSplatIndex, currentGrading);
    }

    // Bind sliders
    sliders.forEach(key => {
        const slider = document.getElementById(`sg-${key}`);
        const valEl = document.getElementById(`sg-${key}-val`);
        if (slider) {
            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                currentGrading[key] = val;
                if (valEl) valEl.textContent = val.toFixed(2);
                applyGrading();
            });
        }
    });

    // Splat selector
    document.getElementById('sg-splat-select').addEventListener('change', (e) => {
        loadSplatValues(parseInt(e.target.value));
    });

    // Tint color picker
    document.getElementById('sg-tint').addEventListener('input', (e) => {
        const hex = e.target.value;
        currentGrading.tintR = parseInt(hex.substr(1, 2), 16) / 255;
        currentGrading.tintG = parseInt(hex.substr(3, 2), 16) / 255;
        currentGrading.tintB = parseInt(hex.substr(5, 2), 16) / 255;

        document.getElementById('sg-tintR').value = currentGrading.tintR;
        document.getElementById('sg-tintG').value = currentGrading.tintG;
        document.getElementById('sg-tintB').value = currentGrading.tintB;
        document.getElementById('sg-tintR-val').textContent = currentGrading.tintR.toFixed(2);
        document.getElementById('sg-tintG-val').textContent = currentGrading.tintG.toFixed(2);
        document.getElementById('sg-tintB-val').textContent = currentGrading.tintB.toFixed(2);

        applyGrading();
    });

    // Reset button
    document.getElementById('sg-reset').addEventListener('click', () => {
        currentGrading = { ...DEFAULTS };
        loadSplatValues(currentSplatIndex);
        applyGrading();
    });

    // Log button
    document.getElementById('sg-log-values').addEventListener('click', () => {
        console.log('\n📊 All Splat Grading Values:\n');
        CONFIG.splats.forEach((splat, i) => {
            const g = splat.grading || DEFAULTS;
            console.log(`${splat.name}:`, JSON.stringify(g, null, 2));
        });
        console.log('\n// Copy to config.js grading object');
    });

    // Toggle with G key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'g' || e.key === 'G') {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            if (panel.style.display === 'block') {
                const idx = state.currentSplatIndex || 0;
                document.getElementById('sg-splat-select').value = idx;
                loadSplatValues(idx);
            }
        }
    });

    // Prevent scroll propagation
    panel.addEventListener('wheel', (e) => {
        e.stopPropagation();
    }, { passive: true });

    // Initial load
    loadSplatValues(0);

    state.splatGradingPanel = panel;
    console.log('🎨 Full splat grading panel ready (Press G to toggle)');
}
