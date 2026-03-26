# Client Feedback — 25 March 2026

Restructuring requirements for the homepage Intro (hero slider), Collection (category hub), and Selection (works showcase) sections.

---

## 1. Intro (Hero Slider)

The hero slider currently has 3 slides. The client wants to **keep 3 slides** but change their labels and link destinations.

| # | Current Slide | Current Link | → Requested Slide | → Requested Link |
|---|---|---|---|---|
| 1 | **THE FORGE** — "Where Steel Becomes Spirit" | `/gallery.html` (3D gallery) | **Net-Work** | `/collection.html?id=networking` (mrežasto) |
| 2 | **NETWORKING** — "Latticework & Light" | `/collection.html?id=networking` | **Monumental** | `/collection.html?id=polygonal` (Atlas + ostale) |
| 3 | **ATLAS** — "The Weight of the World" | `/gallery.html` (3D gallery) | **The Forge** | Studio link → `/gallery.html` ("club" / 3D gallery) |

### What needs to be done

- [ ] **Reorder slides**: Net-Work first, Monumental second, The Forge third
- [ ] **Slide 1 — Net-Work**: Update title/subtitle/eyebrow to reflect the network/mrežasto series. Link → `/collection.html?id=networking`
- [ ] **Slide 2 — Monumental**: Update title/subtitle/eyebrow to reflect monumental polygonal works (Atlas, Hercules, etc.). Link → `/collection.html?id=polygonal`
- [ ] **Slide 3 — The Forge**: Keep as studio intro. Link → `/gallery.html` (3D "club" experience)
- [ ] Update corresponding YouTube background videos if needed
- [ ] Update in both `hero-slider.js` FALLBACK_SLIDES and CMS `heroSlides` data

> **Files**: [hero-slider.js](file:///Users/timonterzic/Documents/vudrag-site/src/ui/hero-slider.js)

---

## 2. Collection (Category Hub)

The category hub currently shows **6 categories**. The client wants the **same 6 categories** but with some renaming/restructuring.

| # | Current Category | → Requested Category | Notes |
|---|---|---|---|
| 1 | Network | **Net-Work** | Rename to "Net-Work" (mrežasto) |
| 2 | Polygonal | **Monumental** | Rename. Includes: poligoni, svjetleće, Hercules subgroup |
| 3 | Coins | **Coins** | ✅ Keep as-is (penezi) |
| 4 | Portraits | **Portraits** | ✅ Keep as-is (biste 3D) |
| 5 | ~~Nature~~ | **Paintings** | ⚠️ Replace "Nature" → "Paintings" (metalne slike) |
| 6 | Public Works | **Public Work** | Minor rename (singular). Content: Tesla, Muflon, Nosorog + uncategorised works |

### What needs to be done

- [ ] **Rename "Polygonal" → "Monumental"** — update id, title, subtitle, description in `collections_data.js`, `category-hub.js` fallback, and CMS
- [ ] **Replace "Nature" → "Paintings"** — new category for metal paintings/slike; update id, title, subtitle, description, and cover image
- [ ] **Rename "Public Works" → "Public Work"** (singular) — update title
- [ ] Ensure the **Monumental** collection page includes: polygonal sub-category, svjetleće (luminous), and Hercules labours
- [ ] **Public Work** should be the catch-all for works like Tesla, Muflon, Nosorog, and other uncategorised pieces
- [ ] Update cover images if needed for renamed/restructured categories
- [ ] Update navigation links in menu overlay to match new names

> **Files**: [collections_data.js](file:///Users/timonterzic/Documents/vudrag-site/content/collections_data.js), [category-hub.js](file:///Users/timonterzic/Documents/vudrag-site/src/ui/category-hub.js), [collection-page.js](file:///Users/timonterzic/Documents/vudrag-site/src/collection-page.js)

---

## 3. Selection (Works Showcase — "The Selection" bento grid)

The current Selection section has **9 bento cards** with various works. The client wants a **3-item Selection** section with different content types.

| # | Requested Item | Description |
|---|---|---|
| 1 | **Net-Work rad** | A featured Net-Work artwork |
| 2 | **Exhibitions** | Photos from exhibitions (fotke s izložbi) |
| 3 | **Articles** | Newspaper clippings / press (članci, novine) — 10 articles provided |

### What needs to be done

- [ ] **Reduce from 9 cards to 3** — rethink the bento grid layout for 3 items
- [ ] **Card 1** — Feature a Net-Work piece (link to network collection or specific sculpture)
- [ ] **Card 2** — "Exhibitions" card: source exhibition photos, link to an exhibitions sub-page or archive
- [ ] **Card 3** — "Articles / Press" card: link to a press/articles sub-page displaying the 10 articles below
- [ ] Build a **Press / Articles sub-page** to house the article links
- [ ] Update `works-showcase.js` FALLBACK_WORKS and CMS grid-order data
- [ ] Adjust CSS grid layout for 3-card arrangement

### Articles — Ordered List (client-provided)

| # | Publication | Title | URL |
|---|---|---|---|
| 1 | **Forbes** | Personal Structures 2024 | [Link](https://www.forbes.com/sites/nargessbanks/2024/05/17/personal-structures-2024/) |
| 2 | **Symbol Quorum** | Nikola Vudrag: World-Class Sculptures | [Link](https://symbol-quorum.com/en/nikola-vudrag-world-class-sculptures/) |
| 3 | **Croatia Week** | Sculpture "Iron Maiden" Sells for €712,000 | [Link](https://www.croatiaweek.com/sculpture-iron-maiden-by-croatian-artist-nikola-vudrag-sells-for-an-incredible-e-712000/) |
| 4 | **Contemporary Art Issue** | The Artistic and Philanthropic Impact of Nikola Vudrag | [Link](https://www.contemporaryartissue.com/the-artistic-and-philanthropic-impact-of-nikola-vudrag/) |
| 5 | **ArtCritic** | Nikola Vudrag: Forging the Myth in Steel | [Link](https://www.artcritic.com/en/nikola-vudrag-forging-the-myth-in-steel/) |
| 6 | **Croatia Week** | Nikola Vudrag Debuts in Dubai's Jetex Space with The Seven Realms | [Link](https://www.croatiaweek.com/croatian-sculptor-nikola-vudrag-debuts-in-dubais-jetex-space-with-the-seven-realms/) |
| 7 | **ITSLIQUID** | Featured Artist: Nikola Vudrag | [Link](https://www.itsliquid.com/featuredartist-nikolavudrag.html) |
| 8 | **Croatia Week** | Nikola Vudrag at Malta Biennale | [Link](https://www.croatiaweek.com/nikola-vudrag-at-malta-biennale/) |
| 9 | **Contemporary Art Issue** | Nikola Vudrag at "Personal Structures — Beyond Boundaries" | [Link](https://www.contemporaryartissue.com/nikola-vudrag-at-personal-structures-beyond-boundaries/) |
| 10 | **Plotkopedia** | TOP CHARITY 2023 Grand Charity Auction (Iron Maiden sale) | [Link](https://plotkopedia.com/en/exclusive/rafal-brzoska-and-omenaa-mensah-break-more-records-historic-result-of-the-top-charity-2023-grand-charity-auction/) |

> **Files**: [works-showcase.js](file:///Users/timonterzic/Documents/vudrag-site/src/ui/works-showcase.js), [works-showcase.css](file:///Users/timonterzic/Documents/vudrag-site/src/styles/works-showcase.css)

---

## Summary of All Affected Files

| File | Changes |
|---|---|
| `src/ui/hero-slider.js` | Reorder + rename + relink hero slides |
| `content/collections_data.js` | Rename Polygonal→Monumental, Nature→Paintings, Public Works→Public Work |
| `src/ui/category-hub.js` | Update fallback categories to match new names |
| `src/collection-page.js` | Ensure Monumental page handles polygonal + luminous + Hercules content |
| `src/ui/works-showcase.js` | Replace 9-card grid with 3-card layout (Net-Work, Exhibitions, Articles) |
| `src/styles/works-showcase.css` | Adjust grid CSS for 3-card arrangement |
| CMS data (API) | Update collections, heroSlides, and grid-order endpoints |
| `src/ui/menu-overlay.js` | Update navigation labels if hardcoded |

---

## Open Questions for Client

1. **Monumental cover image** — should we keep the current polygonal image or use a different hero shot (Atlas, Poseidon, etc.)?
2. **Paintings (metalne slike)** — do we have assets/photos ready for this new category? Which works belong here?
3. **Exhibitions & Articles** — do these need dedicated sub-pages, or should they link to existing content (archive page, external press links)?
4. **Selection featured Net-Work piece** — which specific work should be the hero card? (Madonna, Persona, or another?)
5. **YouTube videos** — should the hero slide order change affect which background videos play?
