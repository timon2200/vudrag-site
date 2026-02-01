/**
 * Vudrag CMS Admin Application
 * Client-side JavaScript for content management
 */

// API_BASE is relative for admin since it's served by the same CMS server
const API_BASE = '/api';

// === State Management ===
const state = {
    token: localStorage.getItem('cms_token'),
    currentSection: 'splats',
    splats: [],
    sculptures: {},
    galleries: { galleries: [] },
    collections: [],
    users: [],
    assets: [],
    gridOrder: [],
    siteContent: {},
    editingItem: null,
    editingType: null,
    // Temporary state for image uploads in sculpture forms
    tempHeroImage: null,
    tempTitleTexture: null,
    tempGalleryImages: [],
    // Generic temp image for collections/works
    // Generic temp image for collections/works
    tempImage: null,
    settings: {},
    archivePosts: []
};

// === DOM Elements ===
const elements = {
    loginScreen: document.getElementById('login-screen'),
    dashboard: document.getElementById('dashboard'),
    loginForm: document.getElementById('login-form'),
    loginError: document.getElementById('login-error'),
    logoutBtn: document.getElementById('logout-btn'),
    navBtns: document.querySelectorAll('.nav-btn'),
    sections: document.querySelectorAll('.content-section'),
    modal: document.getElementById('edit-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalBody: document.getElementById('edit-form'),
    modalClose: document.getElementById('modal-close'),
    modalCancel: document.getElementById('modal-cancel'),
    modalSave: document.getElementById('modal-save'),
    uploadZone: document.getElementById('upload-zone'),
    fileInput: document.getElementById('file-input'),
    uploadStatus: document.getElementById('upload-status')
};

// === API Utilities ===
async function apiFetch(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (state.token) {
        headers['Authorization'] = `Bearer ${state.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers }
    });

    if (response.status === 401) {
        logout();
        throw new Error('Session expired');
    }

    return response.json();
}

// === Auth Functions ===
async function login(email, password) {
    try {
        const result = await apiFetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (result.token) {
            state.token = result.token;
            localStorage.setItem('cms_token', result.token);
            showDashboard();
            loadAllData();
        }
    } catch (err) {
        elements.loginError.textContent = 'Invalid credentials';
    }
}

function logout() {
    state.token = null;
    localStorage.removeItem('cms_token');
    showLogin();
}

function showLogin() {
    elements.loginScreen.classList.add('active');
    elements.dashboard.classList.remove('active');
}

function showDashboard() {
    elements.loginScreen.classList.remove('active');
    elements.dashboard.classList.add('active');
}

// === Data Loading ===
async function loadAllData() {
    try {
        const [splats, sculptures, galleries, collections, users, gridOrder, siteContent, settings, archivePosts] = await Promise.all([
            apiFetch('/splats'),
            apiFetch('/sculptures'),
            apiFetch('/galleries'),
            apiFetch('/collections'),
            apiFetch('/users'),
            loadGridOrder(),
            loadSiteContent(),
            apiFetch('/settings'),
            apiFetch('/archive-posts')
        ]);

        state.splats = splats || [];
        state.sculptures = sculptures || {};
        state.galleries = galleries || { galleries: [] };
        state.collections = collections || [];
        state.users = users || [];
        state.gridOrder = gridOrder || [];
        state.siteContent = siteContent || {};
        state.settings = settings || {};
        state.archivePosts = archivePosts || [];

        renderSplats();
        renderSculptures();
        renderGalleries();
        renderCollections();
        renderUsers();
        renderGridOrder();
        renderSiteContent();
        renderSettings();
        renderArchivePosts();
        loadAssets();
    } catch (err) {
        console.error('Failed to load data:', err);
    }
}

// === Grid Order Functions ===
async function loadGridOrder() {
    try {
        const response = await fetch(`${API_BASE}/grid-order`);
        return await response.json();
    } catch (err) {
        console.error('Failed to load grid order:', err);
        return [];
    }
}

function renderGridOrder() {
    const container = document.getElementById('grid-order-preview');
    if (!container) return;

    if (state.gridOrder.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 60px;">No grid items configured. Add sculptures first.</p>';
        return;
    }

    container.innerHTML = state.gridOrder.map((item, index) => {
        const sculpture = state.sculptures[item.id] || {};
        const heroImage = sculpture.heroImage || 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=400&q=60';

        return `
            <div class="grid-order-card grid-order-card--${item.size}" 
                 draggable="true" 
                 data-index="${index}" 
                 data-id="${item.id}">
                <img class="grid-order-card__image" src="${heroImage}" alt="${sculpture.title || item.id}">
                <div class="grid-order-card__content">
                    <div class="grid-order-card__title">${sculpture.title || item.id}</div>
                    <div class="grid-order-card__series">${sculpture.series || 'Unknown'}</div>
                </div>
                <div class="grid-order-card__size-badge">${item.size}</div>
                <div class="grid-order-card__controls">
                    <button class="grid-order-card__size-btn ${item.size === 'large' ? 'active' : ''}" data-size="large">L</button>
                    <button class="grid-order-card__size-btn ${item.size === 'medium' ? 'active' : ''}" data-size="medium">M</button>
                    <button class="grid-order-card__size-btn ${item.size === 'wide' ? 'active' : ''}" data-size="wide">W</button>
                    <button class="grid-order-card__size-btn ${item.size === 'tall' ? 'active' : ''}" data-size="tall">T</button>
                </div>
                <div class="grid-order-card__drag-handle">⋮⋮</div>
            </div>
        `;
    }).join('');

    // Setup drag-drop handlers
    setupGridDragDrop();
    setupSizeButtons();
}

function setupGridDragDrop() {
    const container = document.getElementById('grid-order-preview');
    const cards = container.querySelectorAll('.grid-order-card');
    let draggedIndex = null;

    cards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            draggedIndex = parseInt(card.dataset.index);
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            document.querySelectorAll('.grid-order-card').forEach(c => c.classList.remove('drag-over'));
        });

        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            card.classList.add('drag-over');
        });

        card.addEventListener('dragleave', () => {
            card.classList.remove('drag-over');
        });

        card.addEventListener('drop', (e) => {
            e.preventDefault();
            const dropIndex = parseInt(card.dataset.index);

            if (draggedIndex !== null && draggedIndex !== dropIndex) {
                // Reorder the array
                const [movedItem] = state.gridOrder.splice(draggedIndex, 1);
                state.gridOrder.splice(dropIndex, 0, movedItem);
                renderGridOrder();
            }

            card.classList.remove('drag-over');
        });
    });
}

function setupSizeButtons() {
    const buttons = document.querySelectorAll('.grid-order-card__size-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.grid-order-card');
            const index = parseInt(card.dataset.index);
            const newSize = btn.dataset.size;

            state.gridOrder[index].size = newSize;
            renderGridOrder();
        });
    });
}

async function saveGridOrder() {
    try {
        const saveBtn = document.getElementById('save-grid-order');
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;

        await apiFetch('/grid-order', {
            method: 'PUT',
            body: JSON.stringify(state.gridOrder)
        });

        saveBtn.textContent = '✓ Saved!';
        setTimeout(() => {
            saveBtn.textContent = '💾 Save Order';
            saveBtn.disabled = false;
        }, 2000);
    } catch (err) {
        console.error('Failed to save grid order:', err);
        alert('Failed to save grid order');
        const saveBtn = document.getElementById('save-grid-order');
        saveBtn.textContent = '💾 Save Order';
        saveBtn.disabled = false;
    }
}

// === Site Content Functions ===
async function loadSiteContent() {
    try {
        const response = await fetch(`${API_BASE}/site-content`);
        return await response.json();
    } catch (err) {
        console.error('Failed to load site content:', err);
        return {};
    }
}

function renderSiteContent() {
    const content = state.siteContent;

    // Note: Category Hub is now managed via Collections tab

    // === Artist Section with Portrait Uploader ===
    const artist = content.artistSection || {};

    // Replace portrait preview with image uploader
    const portraitContainer = document.getElementById('artist-portrait-container');
    if (portraitContainer) {
        portraitContainer.innerHTML = createImageUploader('artist-portrait', 'Portrait Image', artist.portrait || '');
        initializeImageUploader('artist-portrait', (path) => {
            state.tempArtistPortrait = path;
        });
    }

    const artistName = document.getElementById('artist-name');
    const artistBorn = document.getElementById('artist-born');
    const artistTagline = document.getElementById('artist-tagline');
    const artistQuote = document.getElementById('artist-quote');
    const artistVideo = document.getElementById('artist-video');
    const artistBioIntro = document.getElementById('artist-bio-intro');
    const artistBioEducation = document.getElementById('artist-bio-education');
    const artistBioPhilosophy = document.getElementById('artist-bio-philosophy');
    const artistTechTitle = document.getElementById('artist-tech-title');
    const artistTechDesc = document.getElementById('artist-tech-desc');
    const artistTechEffect = document.getElementById('artist-tech-effect');

    if (artistName) artistName.value = artist.name || '';
    if (artistBorn) artistBorn.value = artist.born || '';
    if (artistTagline) artistTagline.value = artist.tagline || '';
    if (artistQuote) artistQuote.value = artist.quote || '';
    if (artistVideo) artistVideo.value = artist.videoUrl || '';
    if (artistBioIntro) artistBioIntro.value = artist.biography?.intro || '';
    if (artistBioEducation) artistBioEducation.value = artist.biography?.education || '';
    if (artistBioPhilosophy) artistBioPhilosophy.value = artist.biography?.philosophy || '';
    if (artistTechTitle) artistTechTitle.value = artist.technique?.title || '';
    if (artistTechDesc) artistTechDesc.value = artist.technique?.description || '';
    if (artistTechEffect) artistTechEffect.value = artist.technique?.effect || '';

    // === Footer fields ===
    const footerBrand = document.getElementById('footer-brand');
    const footerTagline = document.getElementById('footer-tagline');
    const footerDescription = document.getElementById('footer-description');
    const footerEmail = document.getElementById('footer-email');
    const footerLocation = document.getElementById('footer-location');

    if (footerBrand) footerBrand.value = content.footer?.brand || '';
    if (footerTagline) footerTagline.value = content.footer?.tagline || '';
    if (footerDescription) footerDescription.value = content.footer?.description || '';
    if (footerEmail) footerEmail.value = content.footer?.email || '';
    if (footerLocation) footerLocation.value = content.footer?.location || '';

    // === Contact page fields ===
    const contactLabel = document.getElementById('contact-label');
    const contactTitle1 = document.getElementById('contact-title1');
    const contactTitle2 = document.getElementById('contact-title2');
    const contactText = document.getElementById('contact-text');
    const contactEmail = document.getElementById('contact-email');
    const contactName = document.getElementById('contact-name');
    const contactLocation = document.getElementById('contact-location');

    if (contactLabel) contactLabel.value = content.contact?.label || '';
    if (contactTitle1) contactTitle1.value = content.contact?.titleLine1 || '';
    if (contactTitle2) contactTitle2.value = content.contact?.titleLine2 || '';
    if (contactText) contactText.value = content.contact?.text || '';
    if (contactEmail) contactEmail.value = content.contact?.email || '';
    if (contactName) contactName.value = content.contact?.signatureName || '';
    if (contactLocation) contactLocation.value = content.contact?.signatureLocation || '';
}

async function saveSiteContent() {
    try {
        const saveBtn = document.getElementById('save-site-content');
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;

        // Note: Categories are managed via Collections tab, not here

        // === Collect Artist Section ===
        // Get portrait from hidden input created by image uploader
        const artistPortraitInput = document.querySelector('input[name="artist-portrait"]');
        const artistSection = {
            name: document.getElementById('artist-name')?.value || '',
            born: document.getElementById('artist-born')?.value || '',
            tagline: document.getElementById('artist-tagline')?.value || '',
            quote: document.getElementById('artist-quote')?.value || '',
            portrait: artistPortraitInput?.value || state.tempArtistPortrait || state.siteContent.artistSection?.portrait || '',
            videoUrl: document.getElementById('artist-video')?.value || '',
            biography: {
                intro: document.getElementById('artist-bio-intro')?.value || '',
                education: document.getElementById('artist-bio-education')?.value || '',
                philosophy: document.getElementById('artist-bio-philosophy')?.value || ''
            },
            technique: {
                title: document.getElementById('artist-tech-title')?.value || '',
                description: document.getElementById('artist-tech-desc')?.value || '',
                effect: document.getElementById('artist-tech-effect')?.value || ''
            }
        };

        // === Gather Footer & Contact ===
        const updatedContent = {
            artistSection,
            footer: {
                brand: document.getElementById('footer-brand')?.value || '',
                tagline: document.getElementById('footer-tagline')?.value || '',
                description: document.getElementById('footer-description')?.value || '',
                email: document.getElementById('footer-email')?.value || '',
                location: document.getElementById('footer-location')?.value || '',
                // Preserve existing arrays
                navLinks: state.siteContent.footer?.navLinks || [],
                socialLinks: state.siteContent.footer?.socialLinks || []
            },
            contact: {
                pageTitle: state.siteContent.contact?.pageTitle || 'Contact | Nikola Vudrag',
                pageDescription: state.siteContent.contact?.pageDescription || '',
                label: document.getElementById('contact-label')?.value || '',
                titleLine1: document.getElementById('contact-title1')?.value || '',
                titleLine2: document.getElementById('contact-title2')?.value || '',
                text: document.getElementById('contact-text')?.value || '',
                email: document.getElementById('contact-email')?.value || '',
                signatureName: document.getElementById('contact-name')?.value || '',
                signatureLocation: document.getElementById('contact-location')?.value || ''
            }
        };

        const result = await apiFetch('/site-content', {
            method: 'PUT',
            body: JSON.stringify(updatedContent)
        });

        state.siteContent = result;

        saveBtn.textContent = '✓ Saved!';
        setTimeout(() => {
            saveBtn.textContent = '💾 Save All Changes';
            saveBtn.disabled = false;
        }, 2000);
    } catch (err) {
        console.error('Failed to save site content:', err);
        alert('Failed to save site content');
        const saveBtn = document.getElementById('save-site-content');
        saveBtn.textContent = '💾 Save All Changes';
        saveBtn.disabled = false;
    }
}

// === Asset Loading ===
async function loadAssets() {
    try {
        const assets = await apiFetch('/assets');
        state.assets = assets || [];
        renderAssets();
    } catch (err) {
        console.error('Failed to load assets:', err);
    }
}

// === Rendering Functions ===
function renderSplats() {
    const container = document.getElementById('splats-list');
    container.innerHTML = state.splats.map((splat, index) => `
        <div class="item-card" data-index="${index}">
            <div class="item-card-header">
                <div>
                    <span class="item-number">${splat.number || String(index + 1).padStart(2, '0')}</span>
                    <h3 class="item-title">${splat.title || splat.name}</h3>
                    <p class="item-subtitle">${splat.subtitle || ''}</p>
                </div>
            </div>
            <div class="item-meta">
                <div class="meta-item">
                    <span class="meta-label">Position</span>
                    <span class="meta-value">${formatVector(splat.position)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Rotation</span>
                    <span class="meta-value">${formatVector(splat.rotation)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Scale</span>
                    <span class="meta-value">${splat.scale}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">File</span>
                    <span class="meta-value">${splat.file}</span>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editSplat(${index})">Edit</button>
                <button class="btn-delete" onclick="deleteSplat(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function renderSculptures() {
    const container = document.getElementById('sculptures-list');
    if (!container) return;

    const sculpturesArray = Object.values(state.sculptures);

    container.innerHTML = sculpturesArray.map((sculpture, index) => `
        <div class="item-card" data-id="${sculpture.id}">
            <div class="item-card-header">
                <div>
                    <span class="item-number">${String(index + 1).padStart(2, '0')}</span>
                    <h3 class="item-title">${sculpture.title}</h3>
                    <p class="item-subtitle">${sculpture.series || ''}</p>
                </div>
            </div>
            <div class="item-meta">
                <div class="meta-item">
                    <span class="meta-label">Year</span>
                    <span class="meta-value">${sculpture.year || '—'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Materials</span>
                    <span class="meta-value">${sculpture.materials?.substring(0, 30) || '—'}${sculpture.materials?.length > 30 ? '...' : ''}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Dimensions</span>
                    <span class="meta-value">${sculpture.dimensions || '—'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Collection</span>
                    <span class="meta-value">${sculpture.collection?.substring(0, 25) || '—'}${sculpture.collection?.length > 25 ? '...' : ''}</span>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editSculpturePage('${sculpture.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteSculpturePage('${sculpture.id}')">Delete</button>
            </div>
        </div>
    `).join('') || '<p style="color: var(--text-muted); padding: 40px; text-align: center;">No sculpture pages yet. Click "+ Add Sculpture" to create one.</p>';
}

function renderGalleries() {
    const container = document.getElementById('galleries-list');
    const galleries = state.galleries.galleries || [];

    container.innerHTML = galleries.map((gallery, gIndex) => `
        <div class="gallery-section">
            <div class="gallery-header">
                <div class="gallery-info">
                    <h3 class="gallery-title">${gallery.name}</h3>
                    <span class="gallery-count">${gallery.sculptures?.length || 0} sculptures</span>
                </div>
                <button class="btn-add" onclick="addSculpture('${gallery.id}')">+ Add Sculpture</button>
            </div>
            <div class="items-grid">
                ${gallery.sculptures?.map((sculpture, sIndex) => `
                    <div class="item-card">
                        <div class="item-card-header">
                            <div>
                                <span class="item-number">${String(sIndex + 1).padStart(2, '0')}</span>
                                <h3 class="item-title">${sculpture.title}</h3>
                                <p class="item-subtitle">${sculpture.artist || 'Unknown artist'}</p>
                            </div>
                        </div>
                        <div class="item-meta">
                            <div class="meta-item">
                                <span class="meta-label">Year</span>
                                <span class="meta-value">${sculpture.year || '—'}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Material</span>
                                <span class="meta-value">${sculpture.material || '—'}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Origin</span>
                                <span class="meta-value">${sculpture.origin || '—'}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">File</span>
                                <span class="meta-value">${sculpture.file || '—'}</span>
                            </div>
                        </div>
                        <div class="item-actions">
                            <button class="btn-edit" onclick="editSculpture('${gallery.id}', '${sculpture.id}')">Edit</button>
                            <button class="btn-delete" onclick="deleteSculpture('${gallery.id}', '${sculpture.id}')">Delete</button>
                        </div>
                    </div>
                `).join('') || '<p style="color: var(--text-muted); padding: 20px;">No sculptures yet. Click "+ Add Sculpture" to add one.</p>'}
            </div>
        </div>
    `).join('');
}

function renderCollections() {
    const container = document.getElementById('collections-list');

    container.innerHTML = `
        <div class="section-hint" style="margin-bottom: 16px; color: var(--text-muted);">
            These collections appear as Category Hub cards on the main page. Edit to change the card image and text.
        </div>
        <div class="items-grid">${state.collections.map((collection, index) => `
        <div class="item-card collection-card">
            <div class="collection-card__preview" style="position: relative; aspect-ratio: 4/3; overflow: hidden; border-radius: 8px 8px 0 0; background: var(--bg-input);">
                ${collection.image
            ? `<img src="${collection.image}" alt="${collection.title}" style="width: 100%; height: 100%; object-fit: cover;">`
            : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-muted);">No Image</div>`
        }
                <div class="collection-card__overlay" style="position: absolute; inset: 0; background: linear-gradient(transparent 50%, rgba(0,0,0,0.8)); pointer-events: none;"></div>
                <div class="collection-card__label" style="position: absolute; bottom: 12px; left: 12px; right: 12px;">
                    <span style="font-size: 10px; letter-spacing: 2px; color: var(--gold); opacity: 0.7;">${collection.subtitle || ''}</span>
                    <h3 style="margin: 4px 0 0; font-size: 18px; color: #fff; font-family: var(--font-display);">${collection.title}</h3>
                </div>
            </div>
            <div class="item-card-header" style="padding: 12px 16px;">
                <div>
                    <span class="item-number">${String(index + 1).padStart(2, '0')}</span>
                    <p class="item-subtitle">${collection.works?.length || 0} works</p>
                </div>
            </div>
            <div class="item-meta" style="padding: 0 16px 12px;">
                <div class="meta-item" style="grid-column: span 2;">
                    <span class="meta-value" style="font-size: 12px; opacity: 0.7;">${collection.description ? collection.description.substring(0, 80) + '...' : '—'}</span>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editCollection('${collection.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteCollection('${collection.id}')">Delete</button>
            </div>
        </div>
    `).join('')}</div>`;
}

function renderUsers() {
    const container = document.getElementById('users-grid');
    if (!container) return;

    if (state.users.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); padding: 20px;">No users found.</p>';
        return;
    }

    container.innerHTML = state.users.map((user, index) => `
        <div class="item-card">
            <div class="item-card-header">
                <div>
                    <h3 class="item-title">${user.name || user.email}</h3>
                    <p class="item-subtitle">${user.role} • ${user.email}</p>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn-delete" onclick="deleteUser('${user.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// === User Functions ===
window.addUser = function () {
    state.editingItem = { _isNew: true };
    state.editingType = 'user';

    elements.modalTitle.textContent = 'Add New User';
    elements.modalBody.innerHTML = `
        <div class="form-group">
            <label>Name</label>
            <input type="text" name="name" required placeholder="Full Name">
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" required placeholder="user@vudrag.com">
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type="password" name="password" required placeholder="Initial Password">
        </div>
        <div class="form-group">
            <label>Role</label>
            <select name="role">
                <option value="member">Member</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
            </select>
        </div>
    `;

    openModal();
};

window.deleteUser = async function (userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        await apiFetch(`/users/${userId}`, { method: 'DELETE' });
        await loadAllData();
    } catch (err) {
        console.error('Failed to delete user:', err);
        alert('Failed to delete user');
    }
};

function renderAssets() {
    const container = document.getElementById('assets-list');
    if (!container) return;

    if (state.assets.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1;">No assets uploaded yet.</p>';
        return;
    }

    container.innerHTML = state.assets.map(asset => {
        const isImage = asset.type === 'image';
        const icon = asset.type === 'splat' ? '🎭' : asset.type === 'environment' ? '🌅' : '🖼️';
        const thumbnail = isImage
            ? `<img src="${asset.path}" alt="${asset.filename}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 4px; margin-bottom: 12px;">`
            : `<div style="width: 100%; height: 80px; display: flex; align-items: center; justify-content: center; background: var(--bg-input); border-radius: 4px; margin-bottom: 12px; font-size: 32px;">${icon}</div>`;

        return `
            <div class="item-card">
                ${thumbnail}
                <div class="item-card-header">
                    <div>
                        <span class="item-number" style="text-transform: uppercase;">${asset.type}</span>
                        <h3 class="item-title" style="font-size: 14px; word-break: break-all;">${asset.filename}</h3>
                        <p class="item-subtitle">${formatFileSize(asset.size)}</p>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-delete" onclick="deleteAsset('${asset.type}', '${asset.filename}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

window.deleteAsset = async function (type, filename) {
    if (!confirm(`Delete asset "${filename}"? This cannot be undone.`)) return;

    try {
        await apiFetch(`/assets/${type}/${filename}`, { method: 'DELETE' });
        await loadAssets();
    } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete asset');
    }
};

function formatVector(vec) {
    if (!vec) return '—';
    return vec.map(v => v.toFixed(2)).join(', ');
}

// === Image Uploader Utilities ===

/**
 * Create HTML for a single image uploader with drag-drop
 */
function createImageUploader(id, label, currentUrl = '') {
    const hasImage = !!currentUrl;
    return `
        <div class="image-uploader" id="${id}-container">
            <label class="image-uploader__label">${label}</label>
            <div class="image-uploader__dropzone ${hasImage ? 'has-image' : ''}" id="${id}-dropzone">
                ${hasImage ? `
                    <div class="image-uploader__preview">
                        <img src="${currentUrl}" alt="Preview" id="${id}-preview">
                        <div class="image-uploader__preview-overlay">
                            <button type="button" class="image-uploader__btn image-uploader__btn--change">Change</button>
                            <button type="button" class="image-uploader__btn image-uploader__btn--remove" data-action="remove">Remove</button>
                        </div>
                    </div>
                ` : `
                    <span class="image-uploader__icon">🖼️</span>
                    <p class="image-uploader__text">Drop image here or click to upload</p>
                    <p class="image-uploader__hint">JPG, PNG, WebP • Max 10MB</p>
                `}
            </div>
            <input type="file" id="${id}-input" accept="image/*">
            <input type="hidden" name="${id}" value="${currentUrl || ''}">
        </div>
    `;
}

/**
 * Create HTML for gallery image manager
 */
function createGalleryManager(images = []) {
    const imagesHtml = images.length > 0
        ? images.map((url, index) => `
            <div class="gallery-manager__item" data-index="${index}">
                <img src="${url}" alt="Gallery image ${index + 1}">
                <div class="gallery-manager__item-overlay">
                    <button type="button" class="gallery-manager__remove" data-action="remove-gallery" data-index="${index}">×</button>
                </div>
            </div>
        `).join('')
        : '<p class="gallery-manager__empty">No gallery images yet. Click "Add Image" to upload.</p>';

    return `
        <div class="gallery-manager" id="gallery-manager">
            <div class="gallery-manager__header">
                <span class="gallery-manager__title">Gallery Images (${images.length})</span>
                <button type="button" class="gallery-manager__add" id="add-gallery-image">+ Add Image</button>
            </div>
            <div class="gallery-manager__grid" id="gallery-grid">
                ${imagesHtml}
            </div>
            <input type="file" id="gallery-input" accept="image/*" style="display: none;">
        </div>
    `;
}

/**
 * Upload a single image to the server
 */
async function uploadSingleImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE}/upload/image`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${state.token}` },
            body: formData
        });

        if (!response.ok) throw new Error('Upload failed');
        const result = await response.json();
        return result.path; // Returns relative path like /images/filename.jpg
    } catch (err) {
        console.error('Image upload failed:', err);
        alert('Failed to upload image');
        return null;
    }
}

/**
 * Initialize image uploader interactions
 */
function initializeImageUploader(id, onUpload) {
    const container = document.getElementById(`${id}-container`);
    const dropzone = document.getElementById(`${id}-dropzone`);
    const input = document.getElementById(`${id}-input`);
    const hiddenInput = container.querySelector(`input[name="${id}"]`);

    if (!dropzone || !input) return;

    // Handle file selection
    const handleFile = async (file) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Show loading state
        dropzone.innerHTML = `
            <div class="image-uploader__loading">
                <div class="image-uploader__spinner"></div>
                <span>Uploading...</span>
            </div>
        `;

        const path = await uploadSingleImage(file);

        if (path) {
            // Update UI with preview
            dropzone.classList.add('has-image');
            dropzone.innerHTML = `
                <div class="image-uploader__preview">
                    <img src="${path}" alt="Preview" id="${id}-preview">
                    <div class="image-uploader__preview-overlay">
                        <button type="button" class="image-uploader__btn image-uploader__btn--change">Change</button>
                        <button type="button" class="image-uploader__btn image-uploader__btn--remove" data-action="remove">Remove</button>
                    </div>
                </div>
            `;
            hiddenInput.value = path;
            if (onUpload) onUpload(path);
        } else {
            // Reset to empty state
            dropzone.classList.remove('has-image');
            dropzone.innerHTML = `
                <span class="image-uploader__icon">🖼️</span>
                <p class="image-uploader__text">Drop image here or click to upload</p>
                <p class="image-uploader__hint">JPG, PNG, WebP • Max 10MB</p>
            `;
        }
    };

    // Click to browse
    dropzone.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="remove"]')) {
            // Remove image
            dropzone.classList.remove('has-image');
            dropzone.innerHTML = `
                <span class="image-uploader__icon">🖼️</span>
                <p class="image-uploader__text">Drop image here or click to upload</p>
                <p class="image-uploader__hint">JPG, PNG, WebP • Max 10MB</p>
            `;
            hiddenInput.value = '';
            if (onUpload) onUpload(null);
            return;
        }
        input.click();
    });

    input.addEventListener('change', (e) => {
        if (e.target.files[0]) handleFile(e.target.files[0]);
    });

    // Drag and drop
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });
}

/**
 * Initialize gallery manager interactions
 */
function initializeGalleryManager() {
    const addBtn = document.getElementById('add-gallery-image');
    const input = document.getElementById('gallery-input');
    const grid = document.getElementById('gallery-grid');

    if (!addBtn || !input) return;

    addBtn.addEventListener('click', () => input.click());

    input.addEventListener('change', async (e) => {
        if (!e.target.files[0]) return;

        // Show uploading feedback
        addBtn.textContent = 'Uploading...';
        addBtn.disabled = true;

        const path = await uploadSingleImage(e.target.files[0]);

        addBtn.textContent = '+ Add Image';
        addBtn.disabled = false;

        if (path) {
            state.tempGalleryImages.push(path);
            updateGalleryGrid();
        }
        input.value = ''; // Reset for next upload
    });

    // Handle remove buttons via delegation
    grid.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('[data-action="remove-gallery"]');
        if (removeBtn) {
            const index = parseInt(removeBtn.dataset.index);
            state.tempGalleryImages.splice(index, 1);
            updateGalleryGrid();
        }
    });
}

function updateGalleryGrid() {
    const grid = document.getElementById('gallery-grid');
    const header = document.querySelector('.gallery-manager__title');
    if (!grid) return;

    if (state.tempGalleryImages.length === 0) {
        grid.innerHTML = '<p class="gallery-manager__empty">No gallery images yet. Click "Add Image" to upload.</p>';
    } else {
        grid.innerHTML = state.tempGalleryImages.map((url, index) => `
            <div class="gallery-manager__item" data-index="${index}">
                <img src="${url}" alt="Gallery image ${index + 1}">
                <div class="gallery-manager__item-overlay">
                    <button type="button" class="gallery-manager__remove" data-action="remove-gallery" data-index="${index}">×</button>
                </div>
            </div>
        `).join('');
    }

    if (header) {
        header.textContent = `Gallery Images (${state.tempGalleryImages.length})`;
    }
}

// === Edit Functions ===
window.editSplat = function (index) {
    const splat = state.splats[index];
    state.editingItem = { ...splat, _index: index };
    state.editingType = 'splat';

    elements.modalTitle.textContent = `Edit: ${splat.title || splat.name}`;
    elements.modalBody.innerHTML = `
        <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="${splat.title || ''}">
        </div>
        <div class="form-group">
            <label>Subtitle</label>
            <input type="text" name="subtitle" value="${splat.subtitle || ''}">
        </div>
        <div class="form-group">
            <label>Number</label>
            <input type="text" name="number" value="${splat.number || ''}">
        </div>
        <div class="form-group">
            <label>File (.sog)</label>
            <input type="text" name="file" value="${splat.file || ''}">
        </div>
        
        <h4 style="margin: 24px 0 16px; color: var(--gold);">Transform</h4>
        <div class="transform-group">
            <div class="form-group">
                <label>Position X</label>
                <input type="number" step="0.01" name="posX" value="${splat.position?.[0] || 0}">
            </div>
            <div class="form-group">
                <label>Position Y</label>
                <input type="number" step="0.01" name="posY" value="${splat.position?.[1] || 0}">
            </div>
            <div class="form-group">
                <label>Position Z</label>
                <input type="number" step="0.01" name="posZ" value="${splat.position?.[2] || 0}">
            </div>
        </div>
        <div class="transform-group">
            <div class="form-group">
                <label>Rotation X</label>
                <input type="number" step="1" name="rotX" value="${splat.rotation?.[0] || 0}">
            </div>
            <div class="form-group">
                <label>Rotation Y</label>
                <input type="number" step="1" name="rotY" value="${splat.rotation?.[1] || 0}">
            </div>
            <div class="form-group">
                <label>Rotation Z</label>
                <input type="number" step="1" name="rotZ" value="${splat.rotation?.[2] || 0}">
            </div>
        </div>
        <div class="form-group">
            <label>Scale</label>
            <input type="number" step="0.01" name="scale" value="${splat.scale || 1}">
        </div>
        
        <h4 style="margin: 24px 0 16px; color: var(--gold);">Color Grading</h4>
        <div class="grading-group">
            ${createRangeInput('brightness', 'Brightness', splat.grading?.brightness || 1, 0, 2, 0.01)}
            ${createRangeInput('contrast', 'Contrast', splat.grading?.contrast || 1, 0, 2, 0.01)}
            ${createRangeInput('saturation', 'Saturation', splat.grading?.saturation || 1, 0, 2, 0.01)}
            ${createRangeInput('exposure', 'Exposure', splat.grading?.exposure || 0, -2, 2, 0.1)}
            ${createRangeInput('gamma', 'Gamma', splat.grading?.gamma || 1, 0.5, 2, 0.01)}
            ${createRangeInput('hueShift', 'Hue Shift', splat.grading?.hueShift || 0, -1, 1, 0.01)}
        </div>
    `;

    // Add range input event listeners
    elements.modalBody.querySelectorAll('input[type="range"]').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.nextElementSibling.textContent = e.target.value;
        });
    });

    openModal();
};

// Add new splat
window.addSplat = function () {
    const defaultSplat = {
        title: '',
        subtitle: '',
        number: String(state.splats.length + 1).padStart(2, '0'),
        file: '',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1,
        grading: {
            brightness: 1,
            contrast: 1,
            saturation: 1,
            exposure: 0,
            gamma: 1,
            hueShift: 0,
            tintR: 1,
            tintG: 1,
            tintB: 1,
            shadows: 0,
            highlights: 1
        }
    };

    state.editingItem = { ...defaultSplat, _isNew: true };
    state.editingType = 'splat';

    elements.modalTitle.textContent = 'Add New Splat';
    elements.modalBody.innerHTML = `
        <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="" placeholder="Enter splat title">
        </div>
        <div class="form-group">
            <label>Subtitle</label>
            <input type="text" name="subtitle" value="" placeholder="Enter subtitle">
        </div>
        <div class="form-group">
            <label>Number</label>
            <input type="text" name="number" value="${defaultSplat.number}">
        </div>
        <div class="form-group">
            <label>File (.sog)</label>
            <input type="text" name="file" value="" placeholder="e.g., gs_example.sog">
        </div>
        
        <h4 style="margin: 24px 0 16px; color: var(--gold);">Transform</h4>
        <div class="transform-group">
            <div class="form-group">
                <label>Position X</label>
                <input type="number" step="0.01" name="posX" value="0">
            </div>
            <div class="form-group">
                <label>Position Y</label>
                <input type="number" step="0.01" name="posY" value="0">
            </div>
            <div class="form-group">
                <label>Position Z</label>
                <input type="number" step="0.01" name="posZ" value="0">
            </div>
        </div>
        <div class="transform-group">
            <div class="form-group">
                <label>Rotation X</label>
                <input type="number" step="1" name="rotX" value="0">
            </div>
            <div class="form-group">
                <label>Rotation Y</label>
                <input type="number" step="1" name="rotY" value="0">
            </div>
            <div class="form-group">
                <label>Rotation Z</label>
                <input type="number" step="1" name="rotZ" value="0">
            </div>
        </div>
        <div class="form-group">
            <label>Scale</label>
            <input type="number" step="0.01" name="scale" value="1">
        </div>
        
        <h4 style="margin: 24px 0 16px; color: var(--gold);">Color Grading</h4>
        <div class="grading-group">
            ${createRangeInput('brightness', 'Brightness', 1, 0, 2, 0.01)}
            ${createRangeInput('contrast', 'Contrast', 1, 0, 2, 0.01)}
            ${createRangeInput('saturation', 'Saturation', 1, 0, 2, 0.01)}
            ${createRangeInput('exposure', 'Exposure', 0, -2, 2, 0.1)}
            ${createRangeInput('gamma', 'Gamma', 1, 0.5, 2, 0.01)}
            ${createRangeInput('hueShift', 'Hue Shift', 0, -1, 1, 0.01)}
        </div>
    `;

    // Add range input event listeners
    elements.modalBody.querySelectorAll('input[type="range"]').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.nextElementSibling.textContent = e.target.value;
        });
    });

    openModal();
};

function createRangeInput(name, label, value, min, max, step) {
    return `
        <div class="range-input">
            <label>${label}</label>
            <input type="range" name="${name}" min="${min}" max="${max}" step="${step}" value="${value}">
            <span class="range-value">${value}</span>
        </div>
    `;
}

window.editSculpture = function (galleryId, sculptureId) {
    const gallery = state.galleries.galleries.find(g => g.id === galleryId);
    const sculpture = gallery?.sculptures?.find(s => s.id === sculptureId);
    if (!sculpture) return;

    state.editingItem = { ...sculpture, _galleryId: galleryId };
    state.editingType = 'sculpture';

    elements.modalTitle.textContent = `Edit: ${sculpture.title}`;
    elements.modalBody.innerHTML = `
        <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="${sculpture.title || ''}">
        </div>
        <div class="form-group">
            <label>Artist</label>
            <input type="text" name="artist" value="${sculpture.artist || ''}">
        </div>
        <div class="form-group">
            <label>Year</label>
            <input type="text" name="year" value="${sculpture.year || ''}">
        </div>
        <div class="form-group">
            <label>Material</label>
            <input type="text" name="material" value="${sculpture.material || ''}">
        </div>
        <div class="form-group">
            <label>Origin</label>
            <input type="text" name="origin" value="${sculpture.origin || ''}">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="3">${sculpture.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label>File Path</label>
            <input type="text" name="file" value="${sculpture.file || ''}">
        </div>
    `;

    openModal();
};

window.editCollection = function (collectionId) {
    const collection = state.collections.find(c => c.id === collectionId);
    if (!collection) return;

    state.editingItem = { ...collection };
    state.editingType = 'collection';
    state.tempImage = collection.image || null;

    const worksHtml = collection.works?.length > 0
        ? collection.works.map((work, index) => `
            <div class="work-item" style="background: var(--bg-input); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        ${work.image ? `<img src="${work.image}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px;">` : ''}
                        <div>
                            <strong style="color: var(--text-primary);">${work.title}</strong>
                            <span style="color: var(--text-muted); font-size: 12px; margin-left: 8px;">${work.year || ''}</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-edit" style="padding: 4px 12px; font-size: 12px;" onclick="editWork('${collectionId}', ${index})">Edit</button>
                        <button class="btn-delete" style="padding: 4px 12px; font-size: 12px;" onclick="deleteWork('${collectionId}', ${index})">Delete</button>
                    </div>
                </div>
                <div style="font-size: 12px; color: var(--text-secondary);">
                    ${work.dimensions ? `<span style="margin-right: 16px;">📐 ${work.dimensions}</span>` : ''}
                    ${work.description ? `<span style="opacity: 0.7;">${work.description.substring(0, 80)}...</span>` : ''}
                </div>
            </div>
        `).join('')
        : '<p style="color: var(--text-muted); padding: 20px; text-align: center;">No works in this collection yet.</p>';

    elements.modalTitle.textContent = `Edit: ${collection.title}`;
    elements.modalBody.innerHTML = `
        <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="${collection.title || ''}">
        </div>
        <div class="form-group">
            <label>Subtitle</label>
            <input type="text" name="subtitle" value="${collection.subtitle || ''}">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="3">${collection.description || ''}</textarea>
        </div>
        
        ${createImageUploader('image', 'Cover Image', collection.image || '')}
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 24px 0 16px;">
            <h4 style="color: var(--gold); margin: 0;">Works (${collection.works?.length || 0})</h4>
            <button class="btn-add" style="padding: 6px 12px; font-size: 12px;" onclick="addWork('${collectionId}')">+ Add Work</button>
        </div>
        <div class="works-list" style="max-height: 300px; overflow-y: auto;">
            ${worksHtml}
        </div>
    `;

    openModal();

    setTimeout(() => {
        initializeImageUploader('image', (path) => {
            state.tempImage = path;
        });
    }, 100);
};

window.deleteSplat = async function (index) {
    if (!confirm('Are you sure you want to delete this splat?')) return;

    try {
        await apiFetch(`/splats/${index}`, { method: 'DELETE' });
        await loadAllData();
    } catch (err) {
        console.error('Delete failed:', err);
    }
};

window.deleteCollection = async function (collectionId) {
    if (!confirm('Are you sure you want to delete this collection? This will also remove it from the Category Hub on the main page.')) return;

    try {
        await apiFetch(`/collections/${collectionId}`, { method: 'DELETE' });
        await loadAllData();
    } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete collection');
    }
};

// Add new gallery
window.addGallery = function () {
    state.editingItem = { _isNew: true };
    state.editingType = 'gallery';

    elements.modalTitle.textContent = 'Add New Gallery';
    elements.modalBody.innerHTML = `
        <div class="form-group">
            <label>Gallery Name</label>
            <input type="text" name="name" value="" placeholder="e.g., Featured Sculptures">
        </div>
        <div class="form-group">
            <label>Gallery ID (optional)</label>
            <input type="text" name="id" value="" placeholder="auto-generated if empty">
        </div>
    `;

    openModal();
};

// Add sculpture to a gallery
window.addSculpture = function (galleryId) {
    state.editingItem = { _isNew: true, _galleryId: galleryId };
    state.editingType = 'sculpture';

    elements.modalTitle.textContent = 'Add New Sculpture';
    elements.modalBody.innerHTML = `
        <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="" placeholder="Sculpture title">
        </div>
        <div class="form-group">
            <label>Artist</label>
            <input type="text" name="artist" value="">
        </div>
        <div class="form-group">
            <label>Year</label>
            <input type="text" name="year" value="">
        </div>
        <div class="form-group">
            <label>Material</label>
            <input type="text" name="material" value="">
        </div>
        <div class="form-group">
            <label>Origin</label>
            <input type="text" name="origin" value="">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="3"></textarea>
        </div>
        <div class="form-group">
            <label>File Path</label>
            <input type="text" name="file" value="" placeholder="e.g., gs_sculpture.sog">
        </div>
    `;

    openModal();
};

// Add new collection
window.addCollection = function () {
    state.editingItem = { _isNew: true };
    state.editingType = 'collection';
    state.tempImage = null;

    elements.modalTitle.textContent = 'Add New Collection';
    elements.modalBody.innerHTML = `
        <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="" placeholder="Collection title">
        </div>
        <div class="form-group">
            <label>Subtitle</label>
            <input type="text" name="subtitle" value="">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="4"></textarea>
        </div>
        
        ${createImageUploader('image', 'Cover Image')}
    `;

    openModal();

    setTimeout(() => {
        initializeImageUploader('image', (path) => {
            state.tempImage = path;
        });
    }, 100);
};

// === Sculpture Page Functions ===
window.addSculpturePage = function () {
    state.editingItem = { _isNew: true };
    state.editingType = 'sculpturePage';
    // Reset temp gallery images
    state.tempHeroImage = null;
    state.tempTitleTexture = null;
    state.tempGalleryImages = [];

    elements.modalTitle.textContent = 'Add New Sculpture Page';
    elements.modalBody.innerHTML = `
        <div class="form-group">
            <label>ID (URL slug) *</label>
            <input type="text" name="id" value="" placeholder="e.g., iron-maiden" required>
        </div>
        <div class="form-group">
            <label>Title *</label>
            <input type="text" name="title" value="" placeholder="Sculpture title">
        </div>
        <div class="form-group">
            <label>Series</label>
            <input type="text" name="series" value="" placeholder="e.g., Persona, Net-work">
        </div>
        <div class="form-group">
            <label>Year</label>
            <input type="text" name="year" value="" placeholder="e.g., 2024">
        </div>
        <div class="form-group">
            <label>Materials</label>
            <input type="text" name="materials" value="" placeholder="e.g., Welded steel mesh, LED">
        </div>
        <div class="form-group">
            <label>Dimensions</label>
            <input type="text" name="dimensions" value="" placeholder="e.g., 185 × 95 × 75 cm">
        </div>
        <div class="form-group">
            <label>Collection</label>
            <input type="text" name="collection" value="" placeholder="e.g., Private Collection, Zagreb">
        </div>
        <div class="form-group">
            <label>Concept</label>
            <textarea name="concept" rows="2" placeholder="Short concept statement..."></textarea>
        </div>
        <div class="form-group">
            <label>Artist Statement</label>
            <textarea name="statement" rows="3" placeholder="Artist statement in quotes..."></textarea>
        </div>
        
        <h4 style="margin: 24px 0 16px; color: var(--gold); border-top: 1px solid var(--border); padding-top: 24px;">Process & Technique</h4>
        <div class="form-group">
            <label>Creation Process</label>
            <textarea name="process" rows="4" placeholder="Describe the creation journey..."></textarea>
        </div>
        <div class="form-group">
            <label>Technique</label>
            <textarea name="technique" rows="4" placeholder="Technical methodology..."></textarea>
        </div>
        
        <h4 style="margin: 24px 0 16px; color: var(--gold); border-top: 1px solid var(--border); padding-top: 24px;">Artist's Vision</h4>
        <div class="form-group">
            <label>Vision Statement</label>
            <textarea name="vision" rows="3" placeholder="Artist's vision for the piece..."></textarea>
        </div>
        <div class="form-group">
            <label>Inspiration</label>
            <textarea name="inspiration" rows="2" placeholder="Sources of inspiration..."></textarea>
        </div>
        
        <h4 style="margin: 24px 0 16px; color: var(--gold); border-top: 1px solid var(--border); padding-top: 24px;">Technical Specifications</h4>
        <div class="form-group">
            <label>Weight</label>
            <input type="text" name="weight" value="" placeholder="e.g., 45 kg">
        </div>
        <div class="form-group">
            <label>Lighting System</label>
            <input type="text" name="lighting" value="" placeholder="e.g., Warm-white LED 3000K">
        </div>
        <div class="form-group">
            <label>Installation Notes</label>
            <textarea name="installationNotes" rows="2" placeholder="Installation requirements..."></textarea>
        </div>
        
        <h4 style="margin: 24px 0 16px; color: var(--gold); border-top: 1px solid var(--border); padding-top: 24px;">Story & Context</h4>
        <div class="form-group">
            <label>The Story</label>
            <textarea name="story" rows="5" placeholder="Extended narrative about the piece..."></textarea>
        </div>
        <div class="form-group">
            <label>Historical Context</label>
            <textarea name="context" rows="4" placeholder="Historical and cultural context..."></textarea>
        </div>
        
        <h4 style="margin: 24px 0 16px; color: var(--gold); border-top: 1px solid var(--border); padding-top: 24px;">Section Images</h4>
        ${createImageUploader('processImage', 'Process Section Image', '')}
        ${createImageUploader('techniqueImage', 'Technique Section Image', '')}
        ${createImageUploader('storyImage', 'Story Featured Image', '')}
        
        <h4 style="margin: 24px 0 16px; color: var(--gold); border-top: 1px solid var(--border); padding-top: 24px;">Detail Gallery Images</h4>
        ${createImageUploader('detailImage1', 'Detail Image 1 (Large)', '')}
        ${createImageUploader('detailImage2', 'Detail Image 2', '')}
        ${createImageUploader('detailImage3', 'Detail Image 3', '')}
        
        <h4 style="margin: 24px 0 16px; color: var(--gold); border-top: 1px solid var(--border); padding-top: 24px;">Main Images</h4>
        ${createImageUploader('heroImage', 'Hero Image')}
        
        ${createImageUploader('titleTexture', 'Title Background Texture', '')}
        
        ${createGalleryManager([])}
        
        <div class="form-group" style="margin-top: 24px;">
            <label>Related Sculptures (comma-separated IDs)</label>
            <input type="text" name="related" value="" placeholder="e.g., iron-maiden, vitreolum">
        </div>
    `;

    openModal();

    // Initialize uploaders after modal is open
    setTimeout(() => {
        initializeImageUploader('heroImage', (path) => {
            state.tempHeroImage = path;
        });
        initializeImageUploader('titleTexture', (path) => {
            state.tempTitleTexture = path;
        });
        initializeImageUploader('processImage', (path) => {
            state.tempProcessImage = path;
        });
        initializeImageUploader('techniqueImage', (path) => {
            state.tempTechniqueImage = path;
        });
        initializeImageUploader('storyImage', (path) => {
            state.tempStoryImage = path;
        });
        initializeImageUploader('detailImage1', (path) => {
            state.tempDetailImage1 = path;
        });
        initializeImageUploader('detailImage2', (path) => {
            state.tempDetailImage2 = path;
        });
        initializeImageUploader('detailImage3', (path) => {
            state.tempDetailImage3 = path;
        });
        initializeGalleryManager();
    }, 100);
};

window.editSculpturePage = function (sculptureId) {
    const sculpture = state.sculptures[sculptureId];
    if (!sculpture) return;

    state.editingItem = { ...sculpture };
    state.editingType = 'sculpturePage';
    // Initialize temp state from existing sculpture data
    state.tempHeroImage = sculpture.heroImage || null;
    state.tempTitleTexture = sculpture.titleTexture || null;
    state.tempGalleryImages = [...(sculpture.gallery || [])];

    elements.modalTitle.textContent = `Edit: ${sculpture.title}`;
    elements.modalBody.innerHTML = `
        <div class="form-group">
            <label>ID (URL slug)</label>
            <input type="text" name="id" value="${sculpture.id}" disabled style="opacity: 0.6;">
        </div>
        <div class="form-group">
            <label>Title *</label>
            <input type="text" name="title" value="${sculpture.title || ''}">
        </div>
        <div class="form-group">
            <label>Series</label>
            <input type="text" name="series" value="${sculpture.series || ''}">
        </div>
        <div class="form-group">
            <label>Year</label>
            <input type="text" name="year" value="${sculpture.year || ''}">
        </div>
        <div class="form-group">
            <label>Materials</label>
            <input type="text" name="materials" value="${sculpture.materials || ''}">
        </div>
        <div class="form-group">
            <label>Dimensions</label>
            <input type="text" name="dimensions" value="${sculpture.dimensions || ''}">
        </div>
        <div class="form-group">
            <label>Collection</label>
            <input type="text" name="collection" value="${sculpture.collection || ''}">
        </div>
        <div class="form-group">
            <label>Concept</label>
            <textarea name="concept" rows="2">${sculpture.concept || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Artist Statement</label>
            <textarea name="statement" rows="3">${sculpture.statement || ''}</textarea>
        </div>
        
        <h4 style="margin: 24px 0 16px; color: var(--gold); border-top: 1px solid var(--border); padding-top: 24px;">Process & Technique</h4>
        <div class="form-group">
            <label>Creation Process</label>
            <textarea name="process" rows="4">${sculpture.process || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Technique</label>
            <textarea name="technique" rows="4">${sculpture.technique || ''}</textarea>
        </div>
        
        <h4 style="margin: 24px 0 16px; color: var(--gold); border-top: 1px solid var(--border); padding-top: 24px;">Artist's Vision</h4>
        <div class="form-group">
            <label>Vision Statement</label>
            <textarea name="vision" rows="3">${sculpture.vision || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Inspiration</label>
            <textarea name="inspiration" rows="2">${sculpture.inspiration || ''}</textarea>
        </div>
        
        <h4 style="margin: 24px 0 16px; color: var(--gold); border-top: 1px solid var(--border); padding-top: 24px;">Technical Specifications</h4>
        <div class="form-group">
            <label>Weight</label>
            <input type="text" name="weight" value="${sculpture.weight || ''}">
        </div>
        <div class="form-group">
            <label>Lighting System</label>
            <input type="text" name="lighting" value="${sculpture.lighting || ''}">
        </div>
        <div class="form-group">
            <label>Installation Notes</label>
            <textarea name="installationNotes" rows="2">${sculpture.installationNotes || ''}</textarea>
        </div>
        
        <h4 style="margin: 24px 0 16px; color: var(--gold); border-top: 1px solid var(--border); padding-top: 24px;">Story & Context</h4>
        <div class="form-group">
            <label>The Story</label>
            <textarea name="story" rows="5">${sculpture.story || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Historical Context</label>
            <textarea name="context" rows="4">${sculpture.context || ''}</textarea>
        </div>
        
        <h4 style="margin: 24px 0 16px; color: var(--gold); border-top: 1px solid var(--border); padding-top: 24px;">Section Images</h4>
        ${createImageUploader('processImage', 'Process Section Image', sculpture.processImage || '')}
        ${createImageUploader('techniqueImage', 'Technique Section Image', sculpture.techniqueImage || '')}
        ${createImageUploader('storyImage', 'Story Featured Image', sculpture.storyImage || '')}
        
        <h4 style="margin: 24px 0 16px; color: var(--gold); border-top: 1px solid var(--border); padding-top: 24px;">Detail Gallery Images</h4>
        ${createImageUploader('detailImage1', 'Detail Image 1 (Large)', sculpture.detailImages?.[0] || '')}
        ${createImageUploader('detailImage2', 'Detail Image 2', sculpture.detailImages?.[1] || '')}
        ${createImageUploader('detailImage3', 'Detail Image 3', sculpture.detailImages?.[2] || '')}
        
        <h4 style="margin: 24px 0 16px; color: var(--gold); border-top: 1px solid var(--border); padding-top: 24px;">Main Images</h4>
        ${createImageUploader('heroImage', 'Hero Image', sculpture.heroImage || '')}
        
        ${createImageUploader('titleTexture', 'Title Background Texture', sculpture.titleTexture || '')}
        
        ${createGalleryManager(sculpture.gallery || [])}
        
        <div class="form-group" style="margin-top: 24px;">
            <label>Related Sculptures (comma-separated IDs)</label>
            <input type="text" name="related" value="${sculpture.related?.join(', ') || ''}">
        </div>
    `;

    openModal();

    // Initialize uploaders after modal is open
    setTimeout(() => {
        initializeImageUploader('heroImage', (path) => {
            state.tempHeroImage = path;
        });
        initializeImageUploader('titleTexture', (path) => {
            state.tempTitleTexture = path;
        });
        initializeImageUploader('processImage', (path) => {
            state.tempProcessImage = path;
        });
        initializeImageUploader('techniqueImage', (path) => {
            state.tempTechniqueImage = path;
        });
        initializeImageUploader('storyImage', (path) => {
            state.tempStoryImage = path;
        });
        initializeImageUploader('detailImage1', (path) => {
            state.tempDetailImage1 = path;
        });
        initializeImageUploader('detailImage2', (path) => {
            state.tempDetailImage2 = path;
        });
        initializeImageUploader('detailImage3', (path) => {
            state.tempDetailImage3 = path;
        });
        initializeGalleryManager();
    }, 100);
};

window.deleteSculpturePage = async function (sculptureId) {
    if (!confirm(`Delete sculpture page "${sculptureId}"?`)) return;

    try {
        await apiFetch(`/sculptures/${sculptureId}`, { method: 'DELETE' });
        await loadAllData();
    } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete sculpture page');
    }
};

// Add work to collection
window.addWork = function (collectionId) {
    state.editingItem = { _isNew: true, _collectionId: collectionId };
    state.editingType = 'work';
    state.tempImage = null;

    elements.modalTitle.textContent = 'Add New Work';
    elements.modalBody.innerHTML = `
        <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="" placeholder="Work title">
        </div>
        <div class="form-group">
            <label>Year</label>
            <input type="text" name="year" value="" placeholder="e.g., 2024">
        </div>
        <div class="form-group">
            <label>Dimensions</label>
            <input type="text" name="dimensions" value="" placeholder="e.g., 120 x 80 cm">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="4" placeholder="Work description..."></textarea>
        </div>
        
        ${createImageUploader('image', 'Work Image')}
    `;

    openModal();

    setTimeout(() => {
        initializeImageUploader('image', (path) => {
            state.tempImage = path;
        });
    }, 100);
};

// Edit work in collection
window.editWork = function (collectionId, workIndex) {
    const collection = state.collections.find(c => c.id === collectionId);
    if (!collection || !collection.works?.[workIndex]) return;

    const work = collection.works[workIndex];
    state.editingItem = { ...work, _collectionId: collectionId, _workIndex: workIndex };
    state.editingType = 'work';
    state.tempImage = work.image || null;

    elements.modalTitle.textContent = `Edit: ${work.title}`;
    elements.modalBody.innerHTML = `
        <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="${work.title || ''}">
        </div>
        <div class="form-group">
            <label>Year</label>
            <input type="text" name="year" value="${work.year || ''}">
        </div>
        <div class="form-group">
            <label>Dimensions</label>
            <input type="text" name="dimensions" value="${work.dimensions || ''}">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="4">${work.description || ''}</textarea>
        </div>
        
        ${createImageUploader('image', 'Work Image', work.image || '')}
    `;

    openModal();

    setTimeout(() => {
        initializeImageUploader('image', (path) => {
            state.tempImage = path;
        });
    }, 100);
};

// Delete work from collection
window.deleteWork = async function (collectionId, workIndex) {
    if (!confirm('Delete this work from the collection?')) return;

    try {
        await apiFetch(`/collections/${collectionId}/works/${workIndex}`, { method: 'DELETE' });
        await loadAllData();
        // Reopen collection editor to show updated list
        window.editCollection(collectionId);
    } catch (err) {
        console.error('Delete work failed:', err);
        alert('Failed to delete work');
    }
};

// === Modal Functions ===
function openModal() {
    elements.modal.classList.add('active');
}

function closeModal() {
    elements.modal.classList.remove('active');
    state.editingItem = null;
    state.editingType = null;
}

async function saveChanges() {
    const formData = new FormData(elements.modalBody);
    const data = Object.fromEntries(formData.entries());

    try {
        if (state.editingType === 'splat') {
            const updated = {
                ...state.editingItem,
                title: data.title,
                subtitle: data.subtitle,
                number: data.number,
                file: data.file,
                position: [parseFloat(data.posX), parseFloat(data.posY), parseFloat(data.posZ)],
                rotation: [parseFloat(data.rotX), parseFloat(data.rotY), parseFloat(data.rotZ)],
                scale: parseFloat(data.scale),
                grading: {
                    brightness: parseFloat(data.brightness),
                    contrast: parseFloat(data.contrast),
                    saturation: parseFloat(data.saturation),
                    exposure: parseFloat(data.exposure),
                    gamma: parseFloat(data.gamma),
                    hueShift: parseFloat(data.hueShift),
                    tintR: state.editingItem.grading?.tintR || 1,
                    tintG: state.editingItem.grading?.tintG || 1,
                    tintB: state.editingItem.grading?.tintB || 1,
                    shadows: state.editingItem.grading?.shadows || 0,
                    highlights: state.editingItem.grading?.highlights || 1
                }
            };
            delete updated._index;
            delete updated._isNew;

            if (state.editingItem._isNew) {
                // Create new splat
                await apiFetch('/splats', {
                    method: 'POST',
                    body: JSON.stringify(updated)
                });
            } else {
                // Update existing splat
                await apiFetch(`/splats/${state.editingItem._index}`, {
                    method: 'PUT',
                    body: JSON.stringify(updated)
                });
            }
        } else if (state.editingType === 'sculpture') {
            const updated = {
                title: data.title,
                artist: data.artist,
                year: data.year,
                material: data.material,
                origin: data.origin,
                description: data.description,
                file: data.file
            };

            if (state.editingItem._isNew) {
                await apiFetch(`/galleries/${state.editingItem._galleryId}/sculptures`, {
                    method: 'POST',
                    body: JSON.stringify(updated)
                });
            } else {
                await apiFetch(`/galleries/${state.editingItem._galleryId}/sculptures/${state.editingItem.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(updated)
                });
            }
        } else if (state.editingType === 'gallery') {
            const galleryData = {
                name: data.name,
                id: data.id || undefined
            };

            await apiFetch('/galleries', {
                method: 'POST',
                body: JSON.stringify(galleryData)
            });
        } else if (state.editingType === 'collection') {
            const imageValue = document.querySelector('input[name="image"]')?.value || state.tempImage;
            const updated = {
                title: data.title,
                subtitle: data.subtitle,
                description: data.description,
                image: imageValue || state.editingItem.image || ''
            };

            if (state.editingItem._isNew) {
                await apiFetch('/collections', {
                    method: 'POST',
                    body: JSON.stringify(updated)
                });
            } else {
                await apiFetch(`/collections/${state.editingItem.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(updated)
                });
            }
        } else if (state.editingType === 'work') {
            const imageValue = document.querySelector('input[name="image"]')?.value || state.tempImage;
            const workData = {
                title: data.title,
                year: data.year,
                dimensions: data.dimensions,
                description: data.description,
                image: imageValue || state.editingItem.image || ''
            };

            if (state.editingItem._isNew) {
                await apiFetch(`/collections/${state.editingItem._collectionId}/works`, {
                    method: 'POST',
                    body: JSON.stringify(workData)
                });
            } else {
                await apiFetch(`/collections/${state.editingItem._collectionId}/works/${state.editingItem._workIndex}`, {
                    method: 'PUT',
                    body: JSON.stringify(workData)
                });
            }
        } else if (state.editingType === 'sculpturePage') {
            // Use temp state for images (populated by uploaders) OR hidden form field for hero
            const heroImageValue = document.querySelector('input[name="heroImage"]')?.value || state.tempHeroImage;
            const titleTextureValue = document.querySelector('input[name="titleTexture"]')?.value || state.tempTitleTexture;

            const sculptureData = {
                id: data.id || state.editingItem.id,
                title: data.title,
                series: data.series,
                year: data.year,
                materials: data.materials,
                dimensions: data.dimensions,
                collection: data.collection,
                concept: data.concept,
                statement: data.statement,
                // New fields
                process: data.process || '',
                technique: data.technique || '',
                vision: data.vision || '',
                inspiration: data.inspiration || '',
                weight: data.weight || '',
                lighting: data.lighting || '',
                installationNotes: data.installationNotes || '',
                story: data.story || '',
                context: data.context || '',
                // Section Images
                processImage: document.querySelector('input[name="processImage"]')?.value || state.tempProcessImage || state.editingItem.processImage || '',
                techniqueImage: document.querySelector('input[name="techniqueImage"]')?.value || state.tempTechniqueImage || state.editingItem.techniqueImage || '',
                storyImage: document.querySelector('input[name="storyImage"]')?.value || state.tempStoryImage || state.editingItem.storyImage || '',
                // Detail Images
                detailImages: [
                    document.querySelector('input[name="detailImage1"]')?.value || state.tempDetailImage1 || state.editingItem.detailImages?.[0] || '',
                    document.querySelector('input[name="detailImage2"]')?.value || state.tempDetailImage2 || state.editingItem.detailImages?.[1] || '',
                    document.querySelector('input[name="detailImage3"]')?.value || state.tempDetailImage3 || state.editingItem.detailImages?.[2] || ''
                ].filter(Boolean),
                // Main Images
                heroImage: heroImageValue || state.tempHeroImage || state.editingItem.heroImage || '',
                titleTexture: titleTextureValue || state.tempTitleTexture || state.editingItem.titleTexture || '',
                gallery: state.tempGalleryImages.length > 0 ? state.tempGalleryImages : (state.editingItem.gallery || []),
                related: data.related ? data.related.split(',').map(s => s.trim()).filter(Boolean) : state.editingItem.related || []
            };

            if (state.editingItem._isNew) {
                await apiFetch('/sculptures', {
                    method: 'POST',
                    body: JSON.stringify(sculptureData)
                });
            } else {
                await apiFetch(`/sculptures/${state.editingItem.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(sculptureData)
                });
            }
        } else if (state.editingType === 'user') {
            const userData = {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role
            };

            await apiFetch('/users', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
        } else if (state.editingType === 'archivePost') {
            const content = [];
            let i = 0;
            while (data[`block-${i}-type`]) {
                content.push({
                    type: data[`block-${i}-type`],
                    value: data[`block-${i}-value`]
                });
                i++;
            }

            const postData = {
                title: data.title,
                date: data.date,
                tags: data.tags ? data.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
                isLocked: data.isLocked === 'true',
                content: content
            };

            if (state.editingItem._isNew) {
                await apiFetch('/archive-posts', { method: 'POST', body: JSON.stringify(postData) });
            } else {
                await apiFetch(`/archive-posts/${state.editingItem.id}`, { method: 'PUT', body: JSON.stringify(postData) });
            }
        }

        closeModal();
        await loadAllData();
    } catch (err) {
        console.error('Save failed:', err);
        alert('Failed to save changes');
    }
}

// === File Upload ===
function setupUpload() {
    elements.uploadZone.addEventListener('click', () => elements.fileInput.click());
    elements.uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.uploadZone.classList.add('dragover');
    });
    elements.uploadZone.addEventListener('dragleave', () => {
        elements.uploadZone.classList.remove('dragover');
    });
    elements.uploadZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        elements.uploadZone.classList.remove('dragover');
        await uploadFiles(e.dataTransfer.files);
    });
    elements.fileInput.addEventListener('change', async (e) => {
        await uploadFiles(e.target.files);
    });
}

async function uploadFiles(files) {
    for (const file of files) {
        const type = file.name.endsWith('.sog') ? 'splat' : 'image';
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE}/upload/${type}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${state.token}` },
                body: formData
            });

            const result = await response.json();

            elements.uploadStatus.innerHTML += `
                <div class="upload-item ${response.ok ? 'success' : 'error'}">
                    <span>${file.name}</span>
                    <span>${response.ok ? '✓ Uploaded' : '✗ Failed'}</span>
                </div>
            `;
        } catch (err) {
            elements.uploadStatus.innerHTML += `
                <div class="upload-item error">
                    <span>${file.name}</span>
                    <span>✗ Error</span>
                </div>
            `;
        }
    }
    // Refresh asset list after uploads
    await loadAssets();
}

// === Navigation ===
function setupNavigation() {
    elements.navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            if (!section) return; // Skip if no section data (defensive)

            // Update nav buttons
            elements.navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update sections
            elements.sections.forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(`${section}-section`);
            if (targetSection) targetSection.classList.add('active');

            state.currentSection = section;
        });
    });

    // View Toggles (List vs Grid) in Sculptures section
    const viewBtns = document.querySelectorAll('.view-btn');
    const viewContainers = document.querySelectorAll('.view-container');
    const saveOrderBtn = document.getElementById('save-grid-order');
    const addSculptureBtn = document.getElementById('add-sculpture-page');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;

            // Toggle buttons
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle containers
            viewContainers.forEach(c => c.classList.remove('active'));
            document.getElementById(`sculptures-view-${view}`).classList.add('active');

            // Toggle action buttons
            if (view === 'grid') {
                saveOrderBtn.style.display = 'block';
                addSculptureBtn.style.display = 'none';
            } else {
                saveOrderBtn.style.display = 'none';
                addSculptureBtn.style.display = 'block';
            }
        });
    });
}

// === Event Listeners ===
elements.loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});

elements.logoutBtn.addEventListener('click', logout);
elements.modalClose.addEventListener('click', closeModal);
elements.modalCancel.addEventListener('click', closeModal);
elements.modalSave.addEventListener('click', saveChanges);

// === Initialize ===
function init() {
    setupNavigation();
    setupUpload();

    // Wire up Add buttons
    document.getElementById('add-splat')?.addEventListener('click', window.addSplat);
    document.getElementById('add-sculpture-page')?.addEventListener('click', window.addSculpturePage);
    document.getElementById('add-gallery')?.addEventListener('click', window.addGallery);
    document.getElementById('add-collection')?.addEventListener('click', window.addCollection);
    document.getElementById('save-grid-order')?.addEventListener('click', saveGridOrder);
    document.getElementById('save-site-content')?.addEventListener('click', saveSiteContent);
    document.getElementById('add-user')?.addEventListener('click', window.addUser);

    if (state.token) {
        // Verify token is still valid
        apiFetch('/me')
            .then(() => {
                showDashboard();
                loadAllData();
            })
            .catch(() => {
                showLogin();
            });
    } else {
        showLogin();
    }
}

init();

// === Settings Functions ===
function renderSettings() {
    const s = state.settings.email || {};

    // Set values or defaults
    document.getElementById('setting-fromName').value = s.fromName || 'Nikola Vudrag Archive';
    document.getElementById('setting-fromEmail').value = s.fromEmail || 'onboarding@resend.dev';
    document.getElementById('setting-resetSubject').value = s.resetSubject || 'Reset your password';
    document.getElementById('setting-resetBody').value = s.resetBody || `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; color: #333;">
    <h1 style="color: #c9a77a; text-align: center;">Password Reset Request</h1>
    <p>You requested to reset your password for the Nikola Vudrag Archive.</p>
    <p>Click the button below to reset it (valid for 1 hour):</p>
    <div style="text-align: center; margin: 30px 0;">
        <a href="{{link}}" style="background: #c9a77a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
    </div>
    <p style="font-size: 12px; color: #666;">If you didn't request this, purely ignore this email.</p>
</div>`;
}

async function saveSettings() {
    const saveBtn = document.querySelector('#settings-section .action-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;

    const emailSettings = {
        fromName: document.getElementById('setting-fromName').value,
        fromEmail: document.getElementById('setting-fromEmail').value,
        resetSubject: document.getElementById('setting-resetSubject').value,
        resetBody: document.getElementById('setting-resetBody').value
    };

    const newSettings = {
        ...state.settings,
        email: emailSettings
    };

    try {
        await apiFetch('/settings', {
            method: 'POST',
            body: JSON.stringify(newSettings)
        });

        state.settings = newSettings;
        alert('Settings saved successfully');
    } catch (err) {
        console.error('Failed to save settings:', err);
        alert('Failed to save settings');
    } finally {
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
    }
}

// Make globally available
window.saveSettings = saveSettings;
window.addUser = addUser; // Ensure this is also global as used in HTML
window.deleteUser = deleteUser; // Ensure this is also global as used in HTML

// === Archive Functions ===
function renderArchivePosts() {
    const container = document.getElementById('archive-list');
    if (!container) return;

    if (state.archivePosts.length === 0) {
        container.innerHTML = '<p class="section-hint">No posts yet.</p>';
        return;
    }

    container.innerHTML = state.archivePosts.map(post => `
        <div class="item-card">
            <div class="item-card-header">
                <div>
                    <span class="item-subtitle" style="font-size: 12px; opacity: 0.7;">${new Date(post.date).toLocaleDateString()}</span>
                    <h3 class="item-title">${post.title}</h3>
                    <p class="item-subtitle">${post.tags?.join(', ') || ''} ${post.isLocked ? '🔒' : ''}</p>
                </div>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editArchivePost('${post.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteArchivePost('${post.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

window.addArchivePost = function () {
    state.editingItem = {
        _isNew: true,
        content: [],
        date: new Date().toISOString().split('T')[0],
        isLocked: true
    };
    state.editingType = 'archivePost';
    renderPostModal();
    openModal();
};

window.editArchivePost = function (id) {
    const post = state.archivePosts.find(p => p.id === id);
    if (!post) return;
    state.editingItem = JSON.parse(JSON.stringify(post)); // Deep copy
    state.editingType = 'archivePost';
    renderPostModal();
    openModal();
};

window.deleteArchivePost = async function (id) {
    if (!confirm('Delete this post?')) return;
    try {
        await apiFetch(`/archive-posts/${id}`, { method: 'DELETE' });
        await loadAllData();
    } catch (err) {
        console.error(err);
        alert('Failed to delete post');
    }
};

function renderPostModal() {
    elements.modalTitle.textContent = state.editingItem._isNew ? 'New Archive Post' : 'Edit Post';

    const blocksHtml = state.editingItem.content.map((block, index) => renderBlockInput(block, index)).join('');

    elements.modalBody.innerHTML = `
        <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="${state.editingItem.title || ''}" required placeholder="Post Title">
        </div>
        <div class="form-group">
            <label>Date</label>
            <input type="date" name="date" value="${state.editingItem.date ? new Date(state.editingItem.date).toISOString().split('T')[0] : ''}">
        </div>
        <div class="form-group">
             <label>Tags (comma separated)</label>
             <input type="text" name="tags" value="${state.editingItem.tags?.join(', ') || ''}" placeholder="news, process, update">
        </div>
        <div class="form-group">
             <label>Access</label>
             <select name="isLocked" style="width: 100%; padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">
                 <option value="true" ${state.editingItem.isLocked ? 'selected' : ''}>🔒 Locked (Members Only)</option>
                 <option value="false" ${!state.editingItem.isLocked ? 'selected' : ''}>🌍 Public Preview</option>
             </select>
        </div>
        
        <div style="margin: 24px 0; border-top: 1px solid var(--border-color); padding-top: 16px;">
            <label style="display: block; margin-bottom: 12px; color: var(--gold);">Content Components</label>
            
            <div id="post-blocks-container" style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;">
                ${blocksHtml}
            </div>
            
            <div class="item-actions" style="justify-content: flex-start;">
                <button type="button" class="btn-secondary" onclick="addPostBlock('text')">+ Text</button>
                <button type="button" class="btn-secondary" onclick="addPostBlock('image')">+ Image</button>
                <button type="button" class="btn-secondary" onclick="addPostBlock('video')">+ Video</button>
            </div>
        </div>
    `;
}

function renderBlockInput(block, index) {
    let inputHtml = '';
    if (block.type === 'text') {
        inputHtml = `<textarea name="block-${index}-value" rows="4" placeholder="Write something..." style="width: 100%; padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">${block.value || ''}</textarea>`;
    } else if (block.type === 'image') {
        inputHtml = createImageUploader(`block-${index}-value`, 'Image', block.value || '');
        // Note: We need to initialize this after render
        setTimeout(() => initializeImageUploader(`block-${index}-value`), 50);
    } else if (block.type === 'video') {
        inputHtml = `<input type="text" name="block-${index}-value" value="${block.value || ''}" placeholder="YouTube URL or /path/to/video.mp4" style="width: 100%; padding: 0.8rem; background: var(--bg-input); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px;">`;
    }

    return `
    <div class="block-item" style="background: var(--bg-card); padding: 16px; border: 1px solid var(--border-color); border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; align-items: center;">
            <span style="color: var(--gold); text-transform: uppercase; font-size: 11px; letter-spacing: 1px; font-weight: 600;">${block.type} BLOCK</span>
            <button type="button" style="color: var(--color-error); background: none; border: none; cursor: pointer; font-size: 12px;" onclick="removePostBlock(${index})">Remove</button>
        </div>
        <input type="hidden" name="block-${index}-type" value="${block.type}">
        ${inputHtml}
    </div>`;
}

// Helper to update state from current DOM before re-rendering
function updatePostStateFromDOM() {
    const formData = new FormData(elements.modalBody);
    state.editingItem.title = formData.get('title');
    state.editingItem.date = formData.get('date');
    state.editingItem.tags = formData.get('tags').split(',').map(s => s.trim()).filter(Boolean);
    state.editingItem.isLocked = formData.get('isLocked') === 'true';

    // Reconstruct content
    state.editingItem.content.forEach((block, index) => {
        // Handle specialized inputs
        if (block.type === 'image') {
            // Image uploader puts value in hidden input with name same as ID usually, 
            // but here ID is block-{index}-value.
            const val = document.getElementById(`block-${index}-value-input`)?.value ||
                document.querySelector(`input[name="block-${index}-value"]`)?.value;
            block.value = val || '';
        } else {
            block.value = formData.get(`block-${index}-value`);
        }
    });
}

window.addPostBlock = function (type) {
    updatePostStateFromDOM();
    state.editingItem.content.push({ type, value: '' });
    renderPostModal();
};

window.removePostBlock = function (index) {
    updatePostStateFromDOM();
    state.editingItem.content.splice(index, 1);
    renderPostModal();
};
