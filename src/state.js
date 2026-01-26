/**
 * Global Application State
 * 
 * Centralized state management for the Vudrag portfolio experience.
 * All modules read/write through this shared state object.
 */

/**
 * Section identifiers for major site landmarks
 */
export const SECTIONS = {
    SPLAT_GALLERY: 'splat_gallery',
    CATEGORY_HUB: 'category_hub'
};

/**
 * Main application state
 */
export const state = {
    // === PlayCanvas Core ===
    app: null,              // PlayCanvas Application instance
    camera: null,           // Camera entity

    // === Gaussian Splat State ===
    splatEntities: [],      // Array of splat entities
    splatAssets: [],        // Loaded splat assets

    // === Time & Progress ===
    time: 0,                // Elapsed time for animations
    scrollProgress: 0,      // Current scroll position (0-1 for splats, >1 for content)
    targetScrollProgress: 0, // Target scroll (for smooth interpolation)
    currentSplatIndex: 0,   // Currently displayed sculpture

    // === Section Navigation ===
    currentSection: SECTIONS.SPLAT_GALLERY,
    selectedCategory: null, // Selected category ID for gallery navigation

    // === Interaction State ===
    mouse: { x: 0, y: 0 },  // Normalized mouse position (-1 to 1)
    isScrolling: false,     // Whether user is actively scrolling
    lastScrollTime: 0,      // For magnetic snap detection

    // === Effects & UI ===
    particles: null,        // Ambient particle entity
    textOverlay: null,      // Text overlay container
    debugPanel: null,       // Debug panel element
    isLoaded: false         // Whether initial load is complete
};
