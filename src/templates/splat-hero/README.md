# 3D Gaussian Splat Hero — Template Archive

This folder contains the original PlayCanvas-based 3D Gaussian Splat hero section that was used as the homepage hero.

## What's Here

- `systems/` — PlayCanvas systems (splats, camera, particles, post-effects, hero-transition)
- `ui/` — Text overlay, fluid navigation, interaction hint
- `shaders/` — Custom plasma GLSL shaders
- `config.js` — Splat data configuration

## To Restore

1. Copy these files back to their original locations in `src/systems/`, `src/ui/`, `src/shaders/`
2. Re-add the PlayCanvas `Application` init in `main.js` (see git history)
3. Restore `#canvas-container` in `index.html`
4. Re-add the `setupUpdateLoop()` with splat transition logic
5. Public splat assets (`.sog` files) are still in `public/`
