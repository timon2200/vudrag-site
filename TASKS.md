# VUDRAG SITE — CLIENT FEEDBACK TASKS
> **Session:** 28 March 2026  
> **Status:** Awaiting implementation  
> **Stack:** Vite + PlayCanvas + GSAP | Multi-page HTML app  
> **Live:** vudrag.varazdin.studio  

Each task below is self-contained. An agent can pick one task and implement it independently. Read the **Context** and **Files** sections carefully before touching any code.

---

## HOW TO READ THIS FILE

- Each task has a unique `[TASK-XX]` ID.
- Tasks marked `⚠️ BLOCKED` depend on another task completing first — that dependency is stated.
- All client questions from the previous rounds have been **resolved** and integrated into these tasks. No further clarification is needed.
- **Tech stack reference:** JavaScript ESM + HTML + CSS. No React. Vite bundler. CMS is a flat-file Express.js API at `/api/`. CSS variables defined in `src/styles/variables.css`.

---

---

## [TASK-01] Create The Forge Page — New Standalone Page

**Priority:** HIGH  
**Estimated effort:** Large (new page)

### What
Create a brand-new page `forge.html` (+ `src/forge-page.js` + `src/styles/forge-page.css`) that functions as the Nikola Vudrag / Rezervart studio page. **`gallery.html` stays exactly as it is and is NOT modified.**

### Section Spec

The page should flow top-to-bottom through these sections:

#### 1. Hero Section
- Full-bleed, dark, cinematic hero
- Title: **THE FORGE**
- Subtitle: *"Where Steel Becomes Spirit"*
- Background: use existing `/images/Forge.webp` as fallback image
- YouTube background video: existing ID `-EINfzSwMeg` (desktop) / `XH2j7ZigZyE` (mobile) — same pattern as `hero-slider.js`

#### 2. Biography Booklet — Interactive Flip Book
- An **interactive 3D-like flipbook** component simulating page turns.
- Interaction: **Drag/click to flip on desktop, swipe to flip on mobile.** Also add next/prev arrows for desktop.
- Content: The text from `content/artist_bio.md` (split across 4-6 pages).
- Images: Intersperse text with working process images like `/images/weld-process-01.webp`, `/images/weld-process-03.webp`, or `/images/weld-process-05.webp`.
- Design: dark leather/steel aesthetic. Cormorant Garamond for text. Warm gold (`#c9a77a`) accents.

#### 3. Rezervart — The Organisation
- Present Rezervart as a **large, industrial-scale creative institution** ("prikazati kao tvornicu").
- Content: Largest art centre in Croatia, based in Varaždin. Hosts exhibitions, schools, corporate events, festivals, master workshops.
- Image slot: Use a dramatic working image from the `weld-process` series or a placeholder that depicts immense industrial scale.

#### 4. The Studio / About Us Photo
- A section titled **"The Studio"** or **"About Us"**
- Centred layout with a headline and a large portrait image slot.
- Use the image: `/images/vudrag author.webp` (a brilliant dramatic portrait of the artist working at the anvil).
- Below the photo: a brief paragraph about the studio team.

#### 5. CTA / Footer Bridge (Standard)
- End with the standard "Let's Connect" CTA linking to `contact.html` (the diamond-ornament style used on homepage).

### Files to Create/Update
- `forge.html` — new HTML entry point
- `src/forge-page.js`
- `src/styles/forge-page.css`
- **Vite config:** In `vite.config.js`, add `forge: resolve(__dirname, 'forge.html')` under `build.rollupOptions.input`.

---

## [TASK-02] Link The Forge Page from Hero Slider & Works Showcase

**Priority:** HIGH  
**Depends on:** [TASK-01]

### Location 1 — Hero Slider fallback (`src/ui/hero-slider.js`)
Update the third slide in `FALLBACK_SLIDES`:
```js
link: '/forge.html', // was /gallery.html
title: 'THE FORGE',
subtitle: 'Where Steel Becomes Spirit',
eyebrow: 'Studio & Rezervart',
```

### Location 2 — Works Showcase (`src/ui/works-showcase.js`)
Replace the "Exhibitions" card with a "The Forge" card:
```js
{
    id: 'the-forge',
    title: 'The Forge',
    series: 'Studio & Rezervart',
    year: 'Varaždin',
    size: 'large',
    image: '/images/Forge.webp',
    href: '/forge.html'
}
```

### Location 3 — CMS Hero Slides Data
Update the third hero slide's `link` field to `/forge.html` in the CMS flat-file data (`cms/data/site-content.json`).

---

## [TASK-03] Remove "Let's Connect" (Inquire CTA) from Category Pages

**Priority:** MEDIUM

### What
Remove the "Let's Connect" / "Inquire" / CTA footer bridge section from *all* collection category page templates. (This was originally misinterpreted as "Maki - Let's connect", but "Maki" was a typo for "Makni" meaning "Remove").

### How
Find and remove the "Inquire" or "Let's Connect" section builders (usually `buildInquire()`) from the main template mount functions in:
- `src/templates/network/network-page.js`
- `src/templates/polygonal/polygonal-page.js`
- `src/templates/public-works/public-works-page.js`
- `src/styles/` corresponding CSS files (remove the `.nw-inquire`, `.pg-inquire`, `.pw-inquire` etc. blocks).

---

## [TASK-04] Net-Work Page — Horizontal Gallery Layout & Looping

**Priority:** HIGH

### What
1. **Wall Top / Pedestal Bottom Layout:** Organise works so wall-hung works are in a top row track (labelled "WALL") and freestanding works are in a bottom row track (labelled "PEDESTAL").
2. **Looping Scroll:** Implement a **continuous looping** horizontal scroll wrapper so when the user reaches the end, it wraps seamlessly.
3. **Mobile Layout Fixes:** On mobile, the wall/pedestal area label takes up too much space. Reduce its size/height. Also, the first image is pushed too far to the right initially on mobile; reduce the starting padding/offset.

### Files
- `src/templates/network/network-page.js` (`setupHorizontalGallery` function)
- `src/styles/network-page.css`

---

## [TASK-05] Coins Page — Fix Mobile Image Cropping & Reduce Edge Spacing

**Priority:** HIGH (visual regression)

### What
**Bug 1:** Coin images are oddly cropped on mobile, cutting subjects off.
**Bug 2:** Horizontal margin/padding from the screen edge is too large on mobile.

### Fix
In `src/styles/coins-page.css` inside the mobile media query (`max-width: 768px`):
- Make `.coin-card__image` use `object-fit: contain` (instead of cover) so the circular coins stay fully visible.
- Reduce left/right padding on the main grid wrapper so it's closer to the screen edges.

---

## [TASK-06] Public Works — Fix Splat Gallery Interactivity & Particles

**Priority:** MEDIUM

### What
1. **Not interactive enough:** Add a subtle scale + lift on card hover for the panoramic cards. Add a radial gradient "torch light" mouse-follow effect to the cards (like the homepage selection grid).
2. **Hover blocked by text:** The text inside `.pw-pano-card__info` is blocking the card's hover state. Add `pointer-events: none` to the text content in CSS.
3. **Restore particles:** Add the ambient ember/particle canvas system to the `pw-splat-hero` section (reusing code from the old template or `desert-storm.js`). Light, floating embers in warm amber.

### Files
- `src/templates/public-works/public-works-page.js`
- `src/styles/public-works-page.css`

---

## [TASK-07] Public Works — Mobile Graph Height & Add Lady of Loreto

**Priority:** LOW

### What
1. **Increase scale graph height on mobile:** The monolith towers section `.pw-scale__skyline` is too short on mobile, squishing the towers. Increase its `min-height` / `height` in mobile CSS in `public-works-page.css`.
2. **Add "Lady of Loreto" (14m, Primošten):** Add this new entry to the the scale comparison graph data in `public-works-page.js` (and the CMS JSON if applicable).

---

## [TASK-08] Monumental → Convert to "Labours of Hercules" Dedicated Page

**Priority:** HIGH  
**Estimated effort:** Large

### What
Convert the Monumental page (`polygonal-page.js`) into a dedicated **Labours of Hercules** showcase.

### Changes Required

#### A. Page Identity
Update hero title to **LABOURS OF HERCULES**, eyebrow to `Monumental Works`, subtitle to `"Twelve Tasks. One Journey. An Eternity in Steel."`

#### B. Move Prometheus to Public Works
- Remove Prometheus from the Venice split panel in `polygonal-page.js` (Keep only Atlas).
- Add Prometheus to the Hercules Labors panoramic section in `public-works-page.js`.

#### C. Removals
Remove these works from the collection JSON and CMS data so they vanish from the page:
- "Geryon Cattle" -> Rename to **"Muflon Ox"**
- Remove **"Bambi"** entirely.
- Remove **"Enos"** entirely.
- Remove **"Sword of King Tomislav"** (Lovinac).
- Remove **BOTH "Love, Spice of Life"** (Koprivnica) and **"Book of Knowledge"** (Zagreb Archives).

#### D. Lighten Hercules Labour Images
In `src/styles/polygonal-page.css`, reduce the dark overlay opacity on `.pg-labour__image-wrap` or add `filter: brightness(1.15)` so the images are more visible.

#### E. Add "Unfinished Labours" Section
At the bottom of the labours list, render placeholders/locked cards for the missing canonical labours out of the 12 (e.g., Nemean Lion, Lernaean Hydra, Erymanthian Boar, Mares of Diomedes, Girdle of Hippolyta, Cerberus). Present them as "The Labours Yet to Come" or "In the Studio".

---

## [TASK-09] Menu / Navigation — Add The Forge

**Priority:** MEDIUM  
**Depends on:** [TASK-01]

### What
Add "The Forge" as a navigation item in the full-screen menu overlay.

### Files
**File:** `src/ui/menu-overlay.js`

Find the navigation links array/HTML and add:
```html
<a href="/forge.html" class="menu-overlay__link">The Forge</a>
```
Place it after the main collection links and before Contact.
