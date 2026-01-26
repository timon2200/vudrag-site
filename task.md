# Task Checklist: Vudrag Site Expansion & Integration

## Phase 1: Planning & Analysis (Current)
- [x] Analyze `vudrag-gallery` repository structure
    - [x] Clone repository to temporary location
    - [x] Identify dependencies and build system
    - [x] Understand splat loading mechanism
    - [x] Determine integration points (assets, state, event bus)
- [x] Update `implementation_plan.md` with integration strategy

## Phase 2: Integration Foundation
- [/] Create routing system (`NavigationManager`)
- [/] Integrate/Merge `vudrag-gallery` code into `src/gallery/` or `src/features/viewing-room/`
- [/] Unify dependency versions (PlayCanvas, etc.)

## Phase 3: Content & UI Connection
- [x] Update `collections_data.js` with splat paths for relevant items
- [x] Implement "Open in Viewing Room" logic in `category-hub.js`
- [x] Pass correct splat asset to the viewer

## Phase 4: UI Polish
- [x] Ensure "Back" navigation works from Gallery to Hub
- [x] Match Gallery UI styling to `luxury-typography.css`
