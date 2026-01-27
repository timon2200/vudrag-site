/**
 * Vudrag CMS Server
 * Lightweight Express server for content management
 */
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// === Configuration ===
const PORT = process.env.CMS_PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const DATA_DIR = join(__dirname, 'data');
const PUBLIC_DIR = join(__dirname, '..', 'public');

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
}

// === Middleware ===
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003'] }));
app.use(express.json());

// Static file serving for admin panel
app.use('/admin', express.static(join(__dirname, '..', 'admin')));

// === File Storage Utilities ===
function loadJSON(filename) {
    const filepath = join(DATA_DIR, filename);
    if (!existsSync(filepath)) return null;
    return JSON.parse(readFileSync(filepath, 'utf-8'));
}

function saveJSON(filename, data) {
    const filepath = join(DATA_DIR, filename);
    writeFileSync(filepath, JSON.stringify(data, null, 2));
}

// === Auth Middleware ===
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// === Auth Routes ===
app.post('/api/login', async (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ token, expiresIn: 86400 });
    }
    return res.status(401).json({ error: 'Invalid password' });
});

app.get('/api/me', authMiddleware, (req, res) => {
    res.json({ role: req.user.role });
});

// === Splat Routes ===
app.get('/api/splats', authMiddleware, (req, res) => {
    const splats = loadJSON('splats.json') || [];
    res.json(splats);
});

app.put('/api/splats/:index', authMiddleware, (req, res) => {
    const splats = loadJSON('splats.json') || [];
    const index = parseInt(req.params.index);
    if (index < 0 || index >= splats.length) {
        return res.status(404).json({ error: 'Splat not found' });
    }
    splats[index] = { ...splats[index], ...req.body };
    saveJSON('splats.json', splats);
    res.json(splats[index]);
});

app.post('/api/splats', authMiddleware, (req, res) => {
    const splats = loadJSON('splats.json') || [];
    splats.push(req.body);
    saveJSON('splats.json', splats);
    res.json({ index: splats.length - 1, splat: req.body });
});

app.delete('/api/splats/:index', authMiddleware, (req, res) => {
    const splats = loadJSON('splats.json') || [];
    const index = parseInt(req.params.index);
    if (index < 0 || index >= splats.length) {
        return res.status(404).json({ error: 'Splat not found' });
    }
    const removed = splats.splice(index, 1);
    saveJSON('splats.json', splats);
    res.json({ removed: removed[0] });
});

// === Sculptures Routes (for detailed sculpture pages) ===
// Public endpoint - needed for related works on frontend
app.get('/api/sculptures', (req, res) => {
    const sculptures = loadJSON('sculptures.json') || {};
    res.json(sculptures);
});

// Public endpoint for frontend to fetch sculpture data
app.get('/api/sculptures/:id', (req, res) => {
    const sculptures = loadJSON('sculptures.json') || {};
    const sculpture = sculptures[req.params.id];
    if (!sculpture) {
        return res.status(404).json({ error: 'Sculpture not found' });
    }
    res.json(sculpture);
});

app.post('/api/sculptures', authMiddleware, (req, res) => {
    const sculptures = loadJSON('sculptures.json') || {};
    const id = req.body.id || `sculpture-${Date.now()}`;
    sculptures[id] = { ...req.body, id };
    saveJSON('sculptures.json', sculptures);
    res.json(sculptures[id]);
});

app.put('/api/sculptures/:id', authMiddleware, (req, res) => {
    const sculptures = loadJSON('sculptures.json') || {};
    if (!sculptures[req.params.id]) {
        return res.status(404).json({ error: 'Sculpture not found' });
    }
    sculptures[req.params.id] = { ...sculptures[req.params.id], ...req.body };
    saveJSON('sculptures.json', sculptures);
    res.json(sculptures[req.params.id]);
});

app.delete('/api/sculptures/:id', authMiddleware, (req, res) => {
    const sculptures = loadJSON('sculptures.json') || {};
    if (!sculptures[req.params.id]) {
        return res.status(404).json({ error: 'Sculpture not found' });
    }
    const deleted = sculptures[req.params.id];
    delete sculptures[req.params.id];
    saveJSON('sculptures.json', sculptures);
    res.json({ deleted });
});

// === Gallery Routes ===
app.get('/api/galleries', authMiddleware, (req, res) => {
    const galleries = loadJSON('galleries.json') || { galleries: [] };
    res.json(galleries);
});

app.put('/api/galleries/:galleryId', authMiddleware, (req, res) => {
    const data = loadJSON('galleries.json') || { galleries: [] };
    const galleryIndex = data.galleries.findIndex(g => g.id === req.params.galleryId);
    if (galleryIndex === -1) {
        return res.status(404).json({ error: 'Gallery not found' });
    }
    data.galleries[galleryIndex] = { ...data.galleries[galleryIndex], ...req.body };
    saveJSON('galleries.json', data);
    res.json(data.galleries[galleryIndex]);
});

app.put('/api/galleries/:galleryId/sculptures/:sculptureId', authMiddleware, (req, res) => {
    const data = loadJSON('galleries.json') || { galleries: [] };
    const gallery = data.galleries.find(g => g.id === req.params.galleryId);
    if (!gallery) {
        return res.status(404).json({ error: 'Gallery not found' });
    }
    const sculptureIndex = gallery.sculptures.findIndex(s => s.id === req.params.sculptureId);
    if (sculptureIndex === -1) {
        return res.status(404).json({ error: 'Sculpture not found' });
    }
    gallery.sculptures[sculptureIndex] = { ...gallery.sculptures[sculptureIndex], ...req.body };
    saveJSON('galleries.json', data);
    res.json(gallery.sculptures[sculptureIndex]);
});

// Create new gallery
app.post('/api/galleries', authMiddleware, (req, res) => {
    const data = loadJSON('galleries.json') || { galleries: [] };
    const newGallery = {
        id: req.body.id || `gallery-${Date.now()}`,
        name: req.body.name || 'New Gallery',
        sculptures: []
    };
    data.galleries.push(newGallery);
    saveJSON('galleries.json', data);
    res.json(newGallery);
});

// Add sculpture to gallery
app.post('/api/galleries/:galleryId/sculptures', authMiddleware, (req, res) => {
    const data = loadJSON('galleries.json') || { galleries: [] };
    const gallery = data.galleries.find(g => g.id === req.params.galleryId);
    if (!gallery) {
        return res.status(404).json({ error: 'Gallery not found' });
    }
    const newSculpture = {
        id: req.body.id || `sculpture-${Date.now()}`,
        title: req.body.title || 'New Sculpture',
        artist: req.body.artist || '',
        year: req.body.year || '',
        material: req.body.material || '',
        origin: req.body.origin || '',
        description: req.body.description || '',
        file: req.body.file || ''
    };
    gallery.sculptures = gallery.sculptures || [];
    gallery.sculptures.push(newSculpture);
    saveJSON('galleries.json', data);
    res.json(newSculpture);
});

// === Collections Routes ===
app.get('/api/collections', authMiddleware, (req, res) => {
    const collections = loadJSON('collections.json') || [];
    res.json(collections);
});

app.put('/api/collections/:id', authMiddleware, (req, res) => {
    const collections = loadJSON('collections.json') || [];
    const index = collections.findIndex(c => c.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Collection not found' });
    }
    collections[index] = { ...collections[index], ...req.body };
    saveJSON('collections.json', collections);
    res.json(collections[index]);
});

// Create new collection
app.post('/api/collections', authMiddleware, (req, res) => {
    const collections = loadJSON('collections.json') || [];
    const newCollection = {
        id: req.body.id || `collection-${Date.now()}`,
        title: req.body.title || 'New Collection',
        subtitle: req.body.subtitle || '',
        description: req.body.description || '',
        works: []
    };
    collections.push(newCollection);
    saveJSON('collections.json', collections);
    res.json(newCollection);
});

// Add work to collection
app.post('/api/collections/:id/works', authMiddleware, (req, res) => {
    const collections = loadJSON('collections.json') || [];
    const collection = collections.find(c => c.id === req.params.id);
    if (!collection) {
        return res.status(404).json({ error: 'Collection not found' });
    }
    const newWork = {
        title: req.body.title || 'New Work',
        year: req.body.year || '',
        dimensions: req.body.dimensions || '',
        description: req.body.description || ''
    };
    collection.works = collection.works || [];
    collection.works.push(newWork);
    saveJSON('collections.json', collections);
    res.json(newWork);
});

// Update work in collection
app.put('/api/collections/:id/works/:workIndex', authMiddleware, (req, res) => {
    const collections = loadJSON('collections.json') || [];
    const collection = collections.find(c => c.id === req.params.id);
    if (!collection) {
        return res.status(404).json({ error: 'Collection not found' });
    }
    const workIndex = parseInt(req.params.workIndex);
    if (!collection.works || workIndex >= collection.works.length) {
        return res.status(404).json({ error: 'Work not found' });
    }
    collection.works[workIndex] = { ...collection.works[workIndex], ...req.body };
    saveJSON('collections.json', collections);
    res.json(collection.works[workIndex]);
});

// Delete work from collection
app.delete('/api/collections/:id/works/:workIndex', authMiddleware, (req, res) => {
    const collections = loadJSON('collections.json') || [];
    const collection = collections.find(c => c.id === req.params.id);
    if (!collection) {
        return res.status(404).json({ error: 'Collection not found' });
    }
    const workIndex = parseInt(req.params.workIndex);
    if (!collection.works || workIndex >= collection.works.length) {
        return res.status(404).json({ error: 'Work not found' });
    }
    collection.works.splice(workIndex, 1);
    saveJSON('collections.json', collections);
    res.json({ deleted: true });
});

// === Asset Upload ===
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const type = req.params.type;
        let dest = PUBLIC_DIR;
        if (type === 'splat') dest = join(PUBLIC_DIR, 'splats');
        else if (type === 'image') dest = join(PUBLIC_DIR, 'images');
        else if (type === 'environment') dest = join(PUBLIC_DIR, 'environments');

        if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

app.post('/api/upload/:type', authMiddleware, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const relativePath = req.file.path.replace(PUBLIC_DIR, '').replace(/\\/g, '/');
    res.json({
        filename: req.file.filename,
        path: relativePath,
        size: req.file.size
    });
});

// === Asset Listing ===
app.get('/api/assets', authMiddleware, (req, res) => {
    const assets = [];

    const scanDir = (dir, type) => {
        const fullPath = join(PUBLIC_DIR, dir);
        if (!existsSync(fullPath)) return;

        try {
            const files = readdirSync(fullPath);
            files.forEach(filename => {
                const filePath = join(fullPath, filename);
                const stat = statSync(filePath);
                if (stat.isFile()) {
                    assets.push({
                        filename,
                        type,
                        path: `/${dir}/${filename}`,
                        size: stat.size,
                        modified: stat.mtime
                    });
                }
            });
        } catch (err) {
            console.error(`Error scanning ${dir}:`, err);
        }
    };

    scanDir('splats', 'splat');
    scanDir('images', 'image');
    scanDir('environments', 'environment');

    res.json(assets);
});

app.delete('/api/assets/:type/:filename', authMiddleware, (req, res) => {
    const { type, filename } = req.params;
    let dir = '';

    if (type === 'splat') dir = 'splats';
    else if (type === 'image') dir = 'images';
    else if (type === 'environment') dir = 'environments';
    else return res.status(400).json({ error: 'Invalid asset type' });

    const filePath = join(PUBLIC_DIR, dir, filename);

    if (!existsSync(filePath)) {
        return res.status(404).json({ error: 'Asset not found' });
    }

    try {
        unlinkSync(filePath);
        res.json({ deleted: filename });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete asset' });
    }
});

// === Site Content Routes (footer, contact page, etc.) ===
// Public endpoint - needed for frontend to display footer and contact content
app.get('/api/site-content', (req, res) => {
    const siteContent = loadJSON('site-content.json') || {};
    res.json(siteContent);
});

// Update site content (requires auth)
app.put('/api/site-content', authMiddleware, (req, res) => {
    const currentContent = loadJSON('site-content.json') || {};
    const updatedContent = { ...currentContent, ...req.body };
    saveJSON('site-content.json', updatedContent);
    res.json(updatedContent);
});

// === Grid Order Routes (for Works Showcase layout) ===
// Public endpoint - needed for frontend to display works in correct order
app.get('/api/grid-order', (req, res) => {
    const gridOrder = loadJSON('grid-order.json') || [];
    res.json(gridOrder);
});

// Update grid order (requires auth)
app.put('/api/grid-order', authMiddleware, (req, res) => {
    if (!Array.isArray(req.body)) {
        return res.status(400).json({ error: 'Grid order must be an array' });
    }
    saveJSON('grid-order.json', req.body);
    res.json(req.body);
});

// === Public Config Endpoint (for frontend) ===
app.get('/api/config.json', (req, res) => {
    const splats = loadJSON('splats.json') || [];
    const galleries = loadJSON('galleries.json') || { galleries: [] };
    const collections = loadJSON('collections.json') || [];

    res.json({
        splats,
        galleries: galleries.galleries,
        collections
    });
});

// === Initialize Data from Existing Config ===
app.post('/api/init-from-source', authMiddleware, async (req, res) => {
    // This endpoint migrates data from the existing JS config files
    try {
        const configPath = join(__dirname, '..', 'src', 'config.js');
        const galleriesPath = join(__dirname, '..', 'src', 'data', 'galleries.js');
        const collectionsPath = join(__dirname, '..', 'content', 'collections_data.js');

        res.json({
            message: 'Use the admin panel to import existing data or manually copy JSON',
            note: 'Source files are ES modules and need browser-based import'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// === Start Server ===
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║          Vudrag CMS Server Running                        ║
╠═══════════════════════════════════════════════════════════╣
║  Admin Panel:  http://localhost:${PORT}/admin              ║
║  API Base:     http://localhost:${PORT}/api                ║
║  Config:       http://localhost:${PORT}/api/config.json    ║
╚═══════════════════════════════════════════════════════════╝
    `);
});
