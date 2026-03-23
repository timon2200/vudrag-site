/**
 * Text Overlay UI Component
 * Displays artwork titles, subtitles, and numbers
 */
import { CONFIG } from '../config.js';
import { state } from '../state.js';

/**
 * Create HTML text overlay for artwork information
 */
export function createTextOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'text-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 50;
    `;
    document.body.appendChild(overlay);

    // Create Bottom Progress Track
    const progressTrack = document.createElement('div');
    progressTrack.id = 'splat-progress-track';
    progressTrack.style.cssText = `
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        height: 1px;
        background: rgba(201, 167, 122, 0.2);
        z-index: 50;
        display: flex;
        align-items: center;
    `;

    // Progress Line (Fills up)
    const progressFill = document.createElement('div');
    progressFill.id = 'splat-progress-fill';
    progressFill.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background: #c9a77a;
        width: 0%;
        box-shadow: 0 0 10px rgba(201, 167, 122, 0.5);
    `;

    // Progress Text (e.g. 01 / 03)
    const progressText = document.createElement('div');
    progressText.id = 'splat-progress-text';
    progressText.style.cssText = `
        position: absolute;
        right: -50px;
        font-family: 'Inter', -apple-system, sans-serif;
        font-size: 0.65rem;
        letter-spacing: 0.2em;
        color: rgba(201, 167, 122, 0.8);
    `;
    progressText.textContent = `01 / 0${CONFIG.splats.length}`;

    progressTrack.appendChild(progressFill);
    progressTrack.appendChild(progressText);
    document.body.appendChild(progressTrack);

    CONFIG.splats.forEach((splatConfig, index) => {
        const section = document.createElement('div');
        section.className = 'artwork-info';
        section.dataset.index = index;
        section.style.cssText = `
    position: absolute;
    left: 8vw;
    top: 50%;
    transform: translateY(-50%) translateX(-30px);
    opacity: 0;
    transition: opacity 0.4s ease, transform 0.4s ease;
    `;
        section.innerHTML = `
        <span style="
    display: block;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(0.875rem, 1.5vw, 1rem);
    font-weight: 300;
    color: #c9a77a;
    letter-spacing: 0.3em;
    margin-bottom: 1rem;
    text-transform: uppercase;
    ">${splatConfig.number}</span>
        <h2 style="
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 300;
    color: #f0ebe3;
    letter-spacing: 0.02em;
    line-height: 1.1;
    margin: 0 0 0.5rem 0;
    text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    ">${splatConfig.title}</h2>
        <p style="
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: clamp(0.875rem, 1.5vw, 1.125rem);
    font-weight: 300;
    color: #6b6b7a;
    letter-spacing: 0.1em;
    margin: 0;
    ">${splatConfig.subtitle}</p>
        `;
        overlay.appendChild(section);
    });

    // Load fonts
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Inter:wght@300&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Show first section after a delay
    setTimeout(() => {
        const firstSection = overlay.querySelector('[data-index="0"]');
        if (firstSection) {
            firstSection.style.opacity = '1';
            firstSection.style.transform = 'translateY(-50%) translateX(0)';
            
            // Add initial subtle pulse
            const title = firstSection.querySelector('h2');
            if (title) {
                title.style.transition = 'text-shadow 0.8s ease-out, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
                title.style.textShadow = '0 0 40px rgba(201, 167, 122, 0.8), 0 4px 30px rgba(0, 0, 0, 0.5)';
                title.style.transform = 'scale(1.02)';
                
                setTimeout(() => {
                    title.style.textShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
                    title.style.transform = 'scale(1)';
                }, 800);
            }
        }
    }, 1000);

    state.textOverlay = overlay;
}

/**
 * Update text overlay visibility based on scroll position
 */
export function updateTextOverlay(currentIndex, transitionT) {
    if (!state.textOverlay) return;

    const sections = state.textOverlay.querySelectorAll('.artwork-info');

    // Update bottom progress track
    const progressFill = document.getElementById('splat-progress-fill');
    const progressText = document.getElementById('splat-progress-text');
    const numSplats = CONFIG.splats.length;
    
    if (progressFill && progressText) {
        // Calculate global progress across all splats
        const globalProgress = (currentIndex + transitionT) / (numSplats - 1);
        progressFill.style.width = `${Math.max(0, Math.min(100, globalProgress * 100))}%`;
        
        // Update text based on which index is "currently active" (closest)
        // Transition visually at 0.5 mark
        const activeDisplayIndex = transitionT > 0.5 ? currentIndex + 1 : currentIndex;
        progressText.textContent = `0${activeDisplayIndex + 1} / 0${numSplats}`;
    }

    sections.forEach((section, index) => {
        let opacity = 0;
        let xOffset = -30;

        const title = section.querySelector('h2');

        if (index === currentIndex) {
            if (transitionT < 0.4) {
                opacity = 1;
                xOffset = 0;
            } else {
                opacity = 1 - (transitionT - 0.4) / 0.6;
                xOffset = -(transitionT - 0.4) * 50;
            }
        } else if (index === currentIndex + 1) {
            if (transitionT > 0.5) {
                opacity = (transitionT - 0.5) / 0.5;
                xOffset = (1 - opacity) * -30;

                // Trigger pulse effect as it snaps into view
                if (transitionT > 0.95 && transitionT < 0.98 && title && !section.dataset.pulsed) {
                    section.dataset.pulsed = 'true';
                    title.style.transition = 'text-shadow 0.6s ease-out, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
                    title.style.textShadow = '0 0 40px rgba(201, 167, 122, 0.8), 0 4px 30px rgba(0, 0, 0, 0.5)';
                    title.style.transform = 'scale(1.02)';

                    setTimeout(() => {
                        title.style.textShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
                        title.style.transform = 'scale(1)';
                    }, 600);
                }
            } else {
                // reset pulsed state when not in view
                section.dataset.pulsed = '';
            }
        } else {
            // reset pulsed state for non-active, non-next sections
            section.dataset.pulsed = '';
            if (title) {
                title.style.textShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
                title.style.transform = 'scale(1)';
                title.style.transition = 'none';
            }
        }

        section.style.opacity = Math.max(0, Math.min(1, opacity));
        section.style.transform = `translateY(-50%) translateX(${xOffset}px)`;
    });
}
