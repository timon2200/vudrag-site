/**
 * Pedestal Transform Debug Panel
 * Adjust position, rotation, and scale of the pedestal model in real-time.
 * Toggle with P key.
 */

let panel = null;
let pedestalEntity = null;

// Default transform
const DEFAULTS = {
    posX: 0, posY: -1, posZ: 0,
    rotX: 0, rotY: 0, rotZ: 0,
    scale: 1.84
};

/**
 * Create the pedestal transform panel
 * @param {object} entity - The PlayCanvas pedestal entity
 */
export function createPedestalTransformPanel(entity) {
    if (!entity) {
        console.warn('No pedestal entity provided to transform panel');
        return;
    }

    pedestalEntity = entity;

    panel = document.createElement('div');
    panel.id = 'pedestal-transform-panel';
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
        min-width: 260px;
        max-height: 85vh;
        overflow-y: auto;
        overscroll-behavior: contain;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        display: none;
    `;

    function sliderRow(label, id, min, max, step, value) {
        return `
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>${label}</span>
                    <span id="pt-${id}-val">${value.toFixed(2)}</span>
                </label>
                <input type="range" id="pt-${id}" min="${min}" max="${max}" step="${step}" value="${value}" style="width: 100%;">
            </div>
        `;
    }

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(201, 167, 122, 0.3); padding-bottom: 8px;">
            <span style="font-weight: 600; color: #c9a77a; letter-spacing: 0.1em;">PEDESTAL</span>
            <span style="color: #6b6b7a; font-size: 10px;">Press P to toggle</span>
        </div>

        <!-- POSITION -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="color: #c9a77a; font-size: 10px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em;">Position</div>
            ${sliderRow('X', 'posX', -5, 5, 0.01, DEFAULTS.posX)}
            ${sliderRow('Y', 'posY', -5, 5, 0.01, DEFAULTS.posY)}
            ${sliderRow('Z', 'posZ', -5, 5, 0.01, DEFAULTS.posZ)}
        </div>

        <!-- ROTATION -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="color: #c9a77a; font-size: 10px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em;">Rotation</div>
            ${sliderRow('X', 'rotX', -180, 180, 1, DEFAULTS.rotX)}
            ${sliderRow('Y', 'rotY', -180, 180, 1, DEFAULTS.rotY)}
            ${sliderRow('Z', 'rotZ', -180, 180, 1, DEFAULTS.rotZ)}
        </div>

        <!-- SCALE -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="color: #c9a77a; font-size: 10px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em;">Scale</div>
            ${sliderRow('Uniform', 'scale', 0.01, 10, 0.01, DEFAULTS.scale)}
        </div>

        <!-- BUTTONS -->
        <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button id="pt-reset" style="flex: 1; padding: 8px; background: rgba(100, 100, 100, 0.2); border: 1px solid rgba(100, 100, 100, 0.4); border-radius: 4px; color: #888; cursor: pointer; font-size: 11px;">
                Reset
            </button>
            <button id="pt-log-values" style="flex: 1; padding: 8px; background: rgba(201, 167, 122, 0.2); border: 1px solid rgba(201, 167, 122, 0.4); border-radius: 4px; color: #c9a77a; cursor: pointer; font-size: 11px;">
                Log Values
            </button>
        </div>
    `;

    document.body.appendChild(panel);

    // Current values
    const current = { ...DEFAULTS };

    const sliderKeys = ['posX', 'posY', 'posZ', 'rotX', 'rotY', 'rotZ', 'scale'];

    function applyTransform() {
        if (!pedestalEntity) return;
        pedestalEntity.setPosition(current.posX, current.posY, current.posZ);
        pedestalEntity.setEulerAngles(current.rotX, current.rotY, current.rotZ);
        pedestalEntity.setLocalScale(current.scale, current.scale, current.scale);
    }

    function loadValues() {
        sliderKeys.forEach(key => {
            const slider = document.getElementById(`pt-${key}`);
            const valEl = document.getElementById(`pt-${key}-val`);
            if (slider) {
                slider.value = current[key];
                if (valEl) valEl.textContent = Number(current[key]).toFixed(2);
            }
        });
    }

    // Bind sliders
    sliderKeys.forEach(key => {
        const slider = document.getElementById(`pt-${key}`);
        const valEl = document.getElementById(`pt-${key}-val`);
        if (slider) {
            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                current[key] = val;
                if (valEl) valEl.textContent = val.toFixed(2);
                applyTransform();
            });
        }
    });

    // Reset button
    document.getElementById('pt-reset').addEventListener('click', () => {
        Object.assign(current, DEFAULTS);
        loadValues();
        applyTransform();
    });

    // Log button
    document.getElementById('pt-log-values').addEventListener('click', () => {
        const pos = `[${current.posX}, ${current.posY}, ${current.posZ}]`;
        const rot = `[${current.rotX}, ${current.rotY}, ${current.rotZ}]`;
        const scl = current.scale;
        console.log(`\n🗿 Pedestal Transform:`);
        console.log(`  position: ${pos}`);
        console.log(`  rotation: ${rot}`);
        console.log(`  scale: ${scl}`);
        console.log(`\n// Copy-paste ready:`);
        console.log(`pedestalEntity.setPosition(${current.posX}, ${current.posY}, ${current.posZ});`);
        console.log(`pedestalEntity.setEulerAngles(${current.rotX}, ${current.rotY}, ${current.rotZ});`);
        console.log(`pedestalEntity.setLocalScale(${scl}, ${scl}, ${scl});`);
    });

    // Toggle with P key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P') {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    });

    // Prevent scroll/orbit when interacting with panel
    panel.addEventListener('wheel', (e) => {
        e.stopPropagation();
    }, { passive: true });

    panel.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    });

    panel.addEventListener('mousemove', (e) => {
        e.stopPropagation();
    });

    // Apply initial transform
    applyTransform();

    console.log('🗿 Pedestal transform panel ready (Press P to toggle)');
}
