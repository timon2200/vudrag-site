/**
 * Particle Debug Panel (Development Only)
 * Real-time tuning UI for particle system parameters
 */
import { Curve } from 'playcanvas';
import { state } from '../state.js';

/**
 * Create debug panel for particle tuning
 * Only call this in development mode!
 */
export function createParticleDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'particle-debug-panel';
    panel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.85);
        border: 1px solid rgba(201, 167, 122, 0.4);
        border-radius: 8px;
        padding: 16px;
        z-index: 1000;
        font-family: 'Inter', -apple-system, sans-serif;
        font-size: 12px;
        color: #f0ebe3;
        min-width: 260px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    `;

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(201, 167, 122, 0.2); padding-bottom: 8px;">
            <span style="font-weight: 600; color: #c9a77a; letter-spacing: 0.1em;">PARTICLE TUNING</span>
            <span style="color: #6b6b7a; font-size: 10px;">Press P to toggle</span>
        </div>
        
        <div style="margin-bottom: 12px;">
            <label style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Emitter Radius</span>
                <span id="radius-value">8.0</span>
            </label>
            <input type="range" id="slider-radius" min="0.3" max="12" step="0.1" value="8.0" style="width: 100%;">
        </div>
        
        <div style="margin-bottom: 12px;">
            <label style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Particle Scale</span>
                <span id="scale-value">0.05</span>
            </label>
            <input type="range" id="slider-scale" min="0.01" max="0.3" step="0.01" value="0.05" style="width: 100%;">
        </div>
        
        <div style="margin-bottom: 12px;">
            <label style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Intensity</span>
                <span id="intensity-value">0.8</span>
            </label>
            <input type="range" id="slider-intensity" min="0.1" max="5" step="0.1" value="0.8" style="width: 100%;">
        </div>
        
        <div style="margin-bottom: 12px;">
            <label style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Num Particles</span>
                <span id="count-value">250</span>
            </label>
            <input type="range" id="slider-count" min="50" max="500" step="10" value="250" style="width: 100%;">
        </div>
        
        <div style="margin-bottom: 12px;">
            <label style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Lifetime</span>
                <span id="lifetime-value">30</span>
            </label>
            <input type="range" id="slider-lifetime" min="2" max="60" step="1" value="30" style="width: 100%;">
        </div>

        <div style="margin-bottom: 12px;">
            <label style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Spawn Interval (sec)</span>
                <span id="rate-value">0.08</span>
            </label>
            <input type="range" id="slider-rate" min="0.02" max="0.5" step="0.01" value="0.08" style="width: 100%;">
        </div>

        <div style="margin-bottom: 12px;">
            <label style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Y Position</span>
                <span id="ypos-value">0.5</span>
            </label>
            <input type="range" id="slider-ypos" min="-1" max="2" step="0.1" value="0.5" style="width: 100%;">
        </div>
        
        <button id="log-params" style="
            width: 100%;
            padding: 8px;
            background: rgba(201, 167, 122, 0.2);
            border: 1px solid rgba(201, 167, 122, 0.4);
            border-radius: 4px;
            color: #c9a77a;
            cursor: pointer;
            font-size: 11px;
            margin-top: 8px;
        ">Log Current Values</button>
    `;

    document.body.appendChild(panel);

    const getParticleSystem = () => {
        if (state.particles && state.particles.particlesystem) {
            return state.particles.particlesystem;
        }
        return null;
    };

    // Slider event handlers
    document.getElementById('slider-radius').addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        document.getElementById('radius-value').textContent = val.toFixed(1);
        const ps = getParticleSystem();
        if (ps) ps.emitterRadius = val;
    });

    document.getElementById('slider-scale').addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        document.getElementById('scale-value').textContent = val.toFixed(2);
        const ps = getParticleSystem();
        if (ps) {
            ps.scaleGraph = new Curve([0, val * 0.4, 0.5, val, 1, val * 0.3]);
        }
    });

    document.getElementById('slider-intensity').addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        document.getElementById('intensity-value').textContent = val.toFixed(1);
        const ps = getParticleSystem();
        if (ps) ps.intensity = val;
    });

    document.getElementById('slider-count').addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        document.getElementById('count-value').textContent = val;
        const ps = getParticleSystem();
        if (ps) ps.numParticles = val;
    });

    document.getElementById('slider-lifetime').addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        document.getElementById('lifetime-value').textContent = val;
        const ps = getParticleSystem();
        if (ps) ps.lifetime = val;
    });

    document.getElementById('slider-rate').addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        document.getElementById('rate-value').textContent = val.toFixed(2);
        const ps = getParticleSystem();
        if (ps) {
            ps.rate = val;
            ps.rate2 = val * 2;
        }
    });

    document.getElementById('slider-ypos').addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        document.getElementById('ypos-value').textContent = val.toFixed(1);
        if (state.particles) {
            state.particles.setPosition(0, val, 0);
        }
    });

    // Log button
    document.getElementById('log-params').addEventListener('click', () => {
        const ps = getParticleSystem();
        if (ps) {
            console.log('=== PARTICLE PARAMETERS ===');
            console.log(`emitterRadius: ${ps.emitterRadius}`);
            console.log(`numParticles: ${ps.numParticles}`);
            console.log(`lifetime: ${ps.lifetime}`);
            console.log(`rate: ${ps.rate}`);
            console.log(`intensity: ${ps.intensity}`);
            console.log(`Y Position: ${state.particles.getPosition().y}`);
            console.log('Copy these values to config to save!');
        }
    });

    // Toggle visibility with P key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P') {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    });

    state.debugPanel = panel;
    console.log('🎛️ Particle debug panel ready (Press P to toggle)');
}
