/**
 * Image Cropper Module
 * 
 * Opens a modal with Cropper.js for crop + compress to WebP.
 * Usage: const blob = await openCropperModal(file, { aspectRatio: 3/4, contextLabel: 'Collection Cover' });
 */

// === Aspect Ratio Presets ===
const RATIO_PRESETS = [
    { label: '3:4', value: 3 / 4, description: 'Portrait' },
    { label: '4:3', value: 4 / 3, description: 'Landscape' },
    { label: '16:9', value: 16 / 9, description: 'Wide' },
    { label: '1:1', value: 1, description: 'Square' },
    { label: 'Free', value: NaN, description: 'Freeform' }
];

// === Context-aware defaults ===
const CONTEXT_DEFAULTS = {
    'collection': { aspectRatio: 3 / 2, maxWidth: 1200, maxHeight: 800, quality: 0.80, label: 'Collection Cover' },
    'work': { aspectRatio: NaN, maxWidth: 1200, maxHeight: 1600, quality: 0.82, label: 'Work Image' },
    'hero': { aspectRatio: NaN, maxWidth: 1200, maxHeight: 1600, quality: 0.82, label: 'Hero Image' },
    'portrait': { aspectRatio: 3 / 4, maxWidth: 600, maxHeight: 800, quality: 0.80, label: 'Artist Portrait' },
    'archive': { aspectRatio: 16 / 9, maxWidth: 1200, maxHeight: 675, quality: 0.80, label: 'Archive Post' },
    'asset': { aspectRatio: NaN, maxWidth: 1400, maxHeight: 1400, quality: 0.80, label: 'Asset' },
    'gallery': { aspectRatio: NaN, maxWidth: 1200, maxHeight: 1600, quality: 0.82, label: 'Gallery Image' }
};

let cropperInstance = null;
let currentResolve = null;
let currentReject = null;
let currentQuality = 0.80;
let modalElement = null;

/**
 * Inject the modal HTML into the page (once)
 */
function ensureModalExists() {
    if (document.getElementById('cropper-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'cropper-modal-overlay';
    overlay.className = 'cropper-modal-overlay';
    overlay.innerHTML = `
        <div class="cropper-modal">
            <div class="cropper-modal__header">
                <div style="display: flex; align-items: center;">
                    <h3 class="cropper-modal__title">Crop & Compress</h3>
                    <span class="cropper-modal__context" id="cropper-context"></span>
                </div>
                <button class="cropper-modal__close" id="cropper-close">&times;</button>
            </div>

            <div class="cropper-modal__canvas" id="cropper-canvas">
                <img id="cropper-image" src="" alt="Crop preview">
            </div>

            <div class="cropper-modal__controls">
                <div class="cropper-modal__ratios" id="cropper-ratios">
                    <span class="cropper-modal__ratios-label">Ratio</span>
                </div>

                <div class="cropper-modal__quality">
                    <span class="cropper-modal__quality-label">Quality</span>
                    <input type="range" class="cropper-modal__quality-slider" id="cropper-quality" 
                        min="30" max="100" value="80" step="1">
                    <span class="cropper-modal__quality-value" id="cropper-quality-value">80%</span>
                </div>

                <div class="cropper-modal__info" id="cropper-info">
                    <span id="cropper-info-original">Original: — </span>
                    <span id="cropper-info-output">Output: —</span>
                    <span id="cropper-info-format">Format: WebP</span>
                </div>
            </div>

            <div class="cropper-modal__footer">
                <button class="cropper-modal__btn cropper-modal__btn--cancel" id="cropper-cancel">Cancel</button>
                <button class="cropper-modal__btn cropper-modal__btn--crop" id="cropper-crop">Crop & Upload</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    modalElement = overlay;

    // Wire up buttons
    document.getElementById('cropper-close').addEventListener('click', cancelCropper);
    document.getElementById('cropper-cancel').addEventListener('click', cancelCropper);
    document.getElementById('cropper-crop').addEventListener('click', applyCrop);

    // Quality slider
    const slider = document.getElementById('cropper-quality');
    const valueDisplay = document.getElementById('cropper-quality-value');
    slider.addEventListener('input', () => {
        currentQuality = parseInt(slider.value) / 100;
        valueDisplay.textContent = slider.value + '%';
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cancelCropper();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
            cancelCropper();
        }
    });
}

/**
 * Build ratio preset buttons
 */
function buildRatioButtons(activeRatio) {
    const container = document.getElementById('cropper-ratios');
    // Keep the label
    container.innerHTML = '<span class="cropper-modal__ratios-label">Ratio</span>';

    RATIO_PRESETS.forEach(preset => {
        const btn = document.createElement('button');
        btn.className = 'cropper-modal__ratio-btn';
        btn.textContent = preset.label;
        btn.title = preset.description;

        // Determine if active
        const isActive = (isNaN(preset.value) && isNaN(activeRatio)) ||
            (preset.value === activeRatio);
        if (isActive) btn.classList.add('is-active');

        btn.addEventListener('click', () => {
            // Update all buttons
            container.querySelectorAll('.cropper-modal__ratio-btn').forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            // Update cropper
            if (cropperInstance) {
                cropperInstance.setAspectRatio(isNaN(preset.value) ? NaN : preset.value);
            }
        });

        container.appendChild(btn);
    });
}

/**
 * Open the cropper modal
 * @param {File} file - The image file to crop
 * @param {string} context - Context key from CONTEXT_DEFAULTS (e.g. 'collection', 'work')
 * @returns {Promise<{blob: Blob, filename: string}>} - Cropped WebP blob and suggested filename
 */
function openCropperModal(file, context = 'asset') {
    return new Promise((resolve, reject) => {
        ensureModalExists();

        currentResolve = resolve;
        currentReject = reject;

        const defaults = CONTEXT_DEFAULTS[context] || CONTEXT_DEFAULTS['asset'];
        currentQuality = defaults.quality;

        // Set context label
        document.getElementById('cropper-context').textContent = defaults.label;

        // Set quality slider
        const slider = document.getElementById('cropper-quality');
        slider.value = Math.round(defaults.quality * 100);
        document.getElementById('cropper-quality-value').textContent = Math.round(defaults.quality * 100) + '%';

        // Build ratio buttons
        buildRatioButtons(defaults.aspectRatio);

        // Show original info
        document.getElementById('cropper-info-original').textContent =
            `Original: ${(file.size / 1024).toFixed(0)} KB`;

        // Load image
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.getElementById('cropper-image');
            img.src = e.target.result;

            // Wait for image to load then init cropper
            img.onload = () => {
                // Destroy previous instance
                if (cropperInstance) {
                    cropperInstance.destroy();
                    cropperInstance = null;
                }

                cropperInstance = new Cropper(img, {
                    aspectRatio: isNaN(defaults.aspectRatio) ? NaN : defaults.aspectRatio,
                    viewMode: 1,
                    autoCropArea: 0.9,
                    responsive: true,
                    restore: false,
                    guides: true,
                    center: true,
                    highlight: false,
                    background: false,
                    movable: true,
                    rotatable: false,
                    scalable: false,
                    zoomable: true,
                    zoomOnWheel: true,
                    cropBoxMovable: true,
                    cropBoxResizable: true,
                    crop(event) {
                        // Update output dimensions
                        const data = event.detail;
                        const w = Math.round(data.width);
                        const h = Math.round(data.height);
                        document.getElementById('cropper-info-output').textContent =
                            `Output: ${w}×${h}px`;
                    }
                });
            };
        };
        reader.readAsDataURL(file);

        // Store original filename for WebP rename
        modalElement._originalFilename = file.name;

        // Open modal
        requestAnimationFrame(() => {
            modalElement.classList.add('is-open');
        });
    });
}

/**
 * Apply the crop and return the WebP blob
 */
async function applyCrop() {
    if (!cropperInstance || !currentResolve) return;

    const cropBtn = document.getElementById('cropper-crop');
    cropBtn.textContent = 'Processing...';
    cropBtn.disabled = true;

    try {
        const context = document.getElementById('cropper-context').textContent;
        const defaults = Object.values(CONTEXT_DEFAULTS).find(d => d.label === context) || CONTEXT_DEFAULTS['asset'];

        // Get cropped canvas
        const canvas = cropperInstance.getCroppedCanvas({
            maxWidth: defaults.maxWidth,
            maxHeight: defaults.maxHeight,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high'
        });

        if (!canvas) {
            throw new Error('Failed to create cropped canvas');
        }

        // Convert to WebP blob
        const blob = await new Promise((resolve, reject) => {
            canvas.toBlob(
                (b) => b ? resolve(b) : reject(new Error('toBlob failed')),
                'image/webp',
                currentQuality
            );
        });

        // Generate WebP filename
        const originalName = modalElement._originalFilename || 'image.jpg';
        const baseName = originalName.replace(/\.[^.]+$/, '');
        const filename = baseName.replace(/[^a-zA-Z0-9_-]/g, '_') + '.webp';

        // Save resolve reference BEFORE closeModal nulls it
        const resolve = currentResolve;

        // Close modal (this nulls currentResolve/currentReject)
        closeModal();

        resolve({ blob, filename });
    } catch (err) {
        console.error('Crop failed:', err);
        cropBtn.textContent = 'Crop & Upload';
        cropBtn.disabled = false;
        alert('Failed to process image. Please try again.');
    }
}

/**
 * Cancel the cropper
 */
function cancelCropper() {
    const reject = currentReject;
    closeModal();
    if (reject) {
        reject(new Error('Cropping cancelled'));
    }
}

/**
 * Close the modal and clean up
 */
function closeModal() {
    if (cropperInstance) {
        cropperInstance.destroy();
        cropperInstance = null;
    }

    if (modalElement) {
        modalElement.classList.remove('is-open');
    }

    // Reset button
    const cropBtn = document.getElementById('cropper-crop');
    if (cropBtn) {
        cropBtn.textContent = 'Crop & Upload';
        cropBtn.disabled = false;
    }

    currentResolve = null;
    currentReject = null;
}

// === Export for use in app.js ===
window.ImageCropper = {
    open: openCropperModal,
    CONTEXT_DEFAULTS
};
