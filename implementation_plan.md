# Implementation Plan: Digital Monograph Expansion

> **Goal**: Transform the current "Hero MVP" into a complete "Digital Monograph" by integrating the new content structure and implementing the "Viewing Room" experience.

## Phase 1: Foundation & Routing

We need a lightweight routing system to switch between the 3D Hero/Hub and the new 2D content interfaces without page reloads.

- [ ] **Extend `state.js`**: Add new section constants (`SERIES_VIEW`, `VIEWING_ROOM`, `ATELIER`).
- [ ] **Create `NavigationManager`**: A simple class to handle view switching.
    -   Hides/Shows the PlayCanvas canvas (or blurs it further).
    -   Mounts/Unmounts DOM content for the new sections.
    -   Updates URL history (optional but good for UX).

## Phase 2: Connecting Real Data

- [ ] **Update `category-hub.js`**:
    -   Import `COLLECTIONS` from `content/collections_data.js`.
    -   Dynamically generate the 3D cards based on the 6 defined series.
    -   Update click handlers to trigger a state change to `SERIES_VIEW`.

## Phase 3: The Series View (2D Grid)

Create a new UI section `src/sections/SeriesView.js` that displays when a category is selected.

- [ ] **Layout**:
    -   **Header**: Elegant title (e.g., "PERSONA") + Subtitle.
    -   **Grid**: A masonry or asymmetric grid of artworks in that series.
    -   **Card**: Minimalist snippet (Title + Year).
- [ ] **Design**: Use `variables.css` colors (`--color-canvas`, `--color-surface`).
- [ ] **Interaction**: Clicking an artwork triggers state change to `VIEWING_ROOM`.

## Phase 4: The Viewing Room (Integrated Gallery App)

We will port the core logic from `vudrag-gallery` (TypeScript) into the main site (JavaScript) to create a seamless `ViewingRoom` class.

- [ ] **Infrastructure**:
    -   Create `src/systems/gallery/` to house the ported code.
    -   Port `camera/controls.ts` -> `src/systems/gallery/camera-controls.js`.
    -   Port `gallery/splat.ts` -> `src/systems/gallery/splat-viewer.js`.
    -   Port `ui/overlay.ts` -> `src/ui/gallery-overlay.js`.

- [ ] **Integration Logic**:
    -   In `state.js`, add `galleryApp` state.
    -   Create `src/sections/ViewingRoom.js`:
        -   **Init**: Initializes a *new* PlayCanvas app (or reuses the main one if we are clever, but separate might be safer for independent post-processing stacks) or simply reconfigures the existing scene.
        -   **Asset Loading**: Accepts a `splatPath` from the route params.
        -   **UI**: Renders the "Story Section" overlay on top of the 3D viewer.

- [ ] **Data Connection**:
    -   Update `collections_data.js`: Add `splatUrl`, `initialCameraPos` fields to relevant works.
    -   Example: "Waterdrop" -> `splatUrl: 'gs_waterdrop.sog'`.

## Phase 5: The Atelier (Artist Page)

Create `src/sections/Atelier.js`.

- [ ] **Content**:
    -   Parse/Hardcode the content from `content/artist_bio.md`.
    -   Layout: Text columns with generous whitespace ("The Net-Work Philosophy").

## Phase 6: Navigation Integration

- [ ] **Update `menu-overlay.js`**:
    -   Link "Gallery" -> Hero.
    -   Link "Collections" -> Category Hub.
    -   Link "Artist" -> Atelier Section.
- [ ] **Update `sticky-header.js`**:
    -   Ensure the "Back" button functions correctly (Viewing Room -> Series -> Hub).

## Verification Plan

1.  **Flow Test**: Start at Hero -> Scroll to Hub -> Click "Persona" -> See Grid -> Click "Iron Maiden" -> See Detail.
2.  **Design Check**: Verify RAL colors and typography match `strategic_brief.md`.
3.  **Data Check**: Ensure all 6 categories appearing in the Hub match `collections_data.js`.
