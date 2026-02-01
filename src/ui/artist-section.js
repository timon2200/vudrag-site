/**
 * Artist Section - Premium Biography Component
 * 
 * Creates an immersive artist biography section with portrait,
 * philosophy, and Net-work technique highlight.
 * Follows Patek-inspired design with scroll-reveal animations.
 */

import { observeElement } from './scroll-reveal.js';

// CMS API URL
const CMS_API = import.meta.env.VITE_API_BASE || '/api';

// Fallback artist content
const FALLBACK_ARTIST_DATA = {
    name: 'Nikola Vudrag',
    born: '1989, Croatia',
    tagline: 'Sculptor of Light & Steel',
    quote: '"Each weld is a meditation—twenty thousand moments of attention fused into form."',
    portrait: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/FWGdlVFq39g',
    biography: {
        intro: 'Born into a family with a metalworking legacy, Nikola was raised amidst forges and workshops, developing an early bond with metal that would define his artistic vision.',
        education: 'He studied at the Academy of Applied Arts in Rijeka and the Academy of Fine Arts in Zagreb, specializing in medal-making and art therapy.',
        philosophy: 'His work synthesizes science, mathematics, linguistics, philosophy, and mythology. Vudrag focuses on universal truths, creating art that resonates beyond cultural boundaries.'
    },
    technique: {
        title: 'The Net-work Method',
        description: 'Vudrag\'s signature technique involves welding thousands of short steel rods into organic lattices. Up to 20,000 welds are fused in what he describes as a "ritual of attention."',
        effect: 'The resulting structures oscillate between solidity and void—appearing as dense mass in daylight and "solidified mist" when lit from within.'
    },
};

// Current artist data (populated from CMS or fallback)
let ARTIST_DATA = { ...FALLBACK_ARTIST_DATA };

/**
 * Fetch artist section content from CMS
 */
async function fetchArtistContent() {
    try {
        // Create a timeout signal (2 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(`${CMS_API}/site-content`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('CMS unavailable');
        const data = await response.json();
        if (data.artistSection) {
            return {
                name: data.artistSection.name || FALLBACK_ARTIST_DATA.name,
                born: data.artistSection.born || FALLBACK_ARTIST_DATA.born,
                tagline: data.artistSection.tagline || FALLBACK_ARTIST_DATA.tagline,
                quote: data.artistSection.quote || FALLBACK_ARTIST_DATA.quote,
                portrait: data.artistSection.portrait || FALLBACK_ARTIST_DATA.portrait,
                videoUrl: data.artistSection.videoUrl || FALLBACK_ARTIST_DATA.videoUrl,
                biography: {
                    intro: data.artistSection.biography?.intro || FALLBACK_ARTIST_DATA.biography.intro,
                    education: data.artistSection.biography?.education || FALLBACK_ARTIST_DATA.biography.education,
                    philosophy: data.artistSection.biography?.philosophy || FALLBACK_ARTIST_DATA.biography.philosophy
                },
                technique: {
                    title: data.artistSection.technique?.title || FALLBACK_ARTIST_DATA.technique.title,
                    description: data.artistSection.technique?.description || FALLBACK_ARTIST_DATA.technique.description,
                    effect: data.artistSection.technique?.effect || FALLBACK_ARTIST_DATA.technique.effect
                }
            };
        }
        return FALLBACK_ARTIST_DATA;
    } catch (err) {
        console.warn('⚠️ CMS unavailable or timed out, using fallback artist data');
        return FALLBACK_ARTIST_DATA;
    }
}

/**
 * Initialize the artist section
 */
export async function setupArtistSection() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) {
        console.warn('⚠️ Content area not found for artist section');
        return null;
    }

    // Fetch content from CMS
    ARTIST_DATA = await fetchArtistContent();

    const sectionElement = createArtistSectionDOM();
    contentArea.appendChild(sectionElement);

    // Register all reveal elements with observer
    const revealElements = sectionElement.querySelectorAll('[data-reveal]');
    revealElements.forEach(el => observeElement(el));

    console.log('✨ Artist section initialized');
    return sectionElement;
}

/**
 * Build YouTube embed URL with autoplay parameters
 */
function buildVideoEmbedUrl(baseUrl) {
    // Extract video ID from various YouTube URL formats
    let videoId = '';
    const regExp = /(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([^?&]+)/;
    const match = baseUrl.match(regExp);
    if (match) {
        videoId = match[1];
    } else {
        // Assume it's already just a video ID or full embed URL
        videoId = baseUrl.includes('embed') ? baseUrl.split('/').pop().split('?')[0] : baseUrl;
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&showinfo=0&modestbranding=1&disablekb=1&fs=0`;
}

/**
 * Create the artist section DOM structure
 */
function createArtistSectionDOM() {
    const section = document.createElement('section');
    section.className = 'artist-section';
    section.id = 'artist-section';

    const videoEmbedUrl = buildVideoEmbedUrl(ARTIST_DATA.videoUrl);

    section.innerHTML = `
        <!-- Ambient Video Background -->
        <div class="artist-section__video-bg">
            <iframe
                src="${videoEmbedUrl}"
                frameborder="0" allow="autoplay; encrypted-media" allowfullscreen
                title="Ambient background video"></iframe>
        </div>
        <div class="artist-section__video-overlay"></div>
        
        <div class="artist-section__watermark" aria-hidden="true">ARTIST</div>
        
        <!-- Hero Quote -->
        <div class="artist-section__quote-block" data-reveal>
            <blockquote class="artist-section__quote">
                ${ARTIST_DATA.quote}
            </blockquote>
        </div>

        <!-- Main Content Grid -->
        <div class="artist-section__grid">
            <!-- Portrait Column -->
            <div class="artist-section__portrait-col" data-reveal="left">
                <div class="artist-section__portrait-frame">
                    <img 
                        class="artist-section__portrait" 
                        src="${ARTIST_DATA.portrait}" 
                        alt="${ARTIST_DATA.name}"
                        loading="lazy"
                    />
                    <div class="artist-section__portrait-overlay"></div>
                </div>
                <div class="artist-section__portrait-caption">
                    <span class="artist-section__name">${ARTIST_DATA.name}</span>
                    <span class="artist-section__born">${ARTIST_DATA.born}</span>
                </div>
            </div>

            <!-- Biography Column -->
            <div class="artist-section__bio-col">
                <header class="artist-section__header" data-reveal data-reveal-delay="1">
                    <span class="artist-section__label">The Artist</span>
                    <h2 class="artist-section__title">${ARTIST_DATA.tagline}</h2>
                    <div class="artist-section__divider"></div>
                </header>

                <div class="artist-section__bio-text" data-reveal data-reveal-delay="2">
                    <p>${ARTIST_DATA.biography.intro}</p>
                    <p>${ARTIST_DATA.biography.education}</p>
                    <p>${ARTIST_DATA.biography.philosophy}</p>
                </div>

                <!-- Technique Highlight -->
                <div class="artist-section__technique" data-reveal data-reveal-delay="3">
                    <h3 class="artist-section__technique-title">${ARTIST_DATA.technique.title}</h3>
                    <p class="artist-section__technique-desc">${ARTIST_DATA.technique.description}</p>
                    <p class="artist-section__technique-effect">${ARTIST_DATA.technique.effect}</p>
                </div>
            </div>
        </div>

    `;

    return section;
}

/**
 * Get artist data (for external use)
 */
export function getArtistData() {
    return ARTIST_DATA;
}
