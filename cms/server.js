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
import dotenv from 'dotenv';
import crypto from 'crypto';
import { sendPasswordResetEmail } from './services/mailer.js';

// Load environment variables immediately
dotenv.config();

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
// === Middleware ===
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001,http://localhost:3003';
app.use(cors({
    origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(','),
    credentials: true
}));
app.use(express.json());

// Static file serving for admin panel
app.use('/admin', express.static(join(__dirname, '..', 'admin')));

// Serve public assets (images, splats)
app.use(express.static(PUBLIC_DIR));

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
// === User Management & Auth ===

// Initialize default admin if no users exist
function initUsers() {
    const users = loadJSON('users.json') || [];
    if (users.length === 0) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(ADMIN_PASSWORD, salt);
        users.push({
            id: 'admin',
            email: 'admin@vudrag.com',
            password: hash,
            role: 'admin',
            name: 'Administrator'
        });
        saveJSON('users.json', users);
        console.log('Initialized default admin user');
    }
}
initUsers();

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = loadJSON('users.json') || [];

    // Find user (support login by email)
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        token,
        expiresIn: 86400,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        }
    });
});

// === Settings Routes ===
app.get('/api/settings', authMiddleware, (req, res) => {
    // Check role if needed, but for now allow all auth users or restrict to admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    const settings = loadJSON('settings.json') || {};
    res.json(settings);
});

app.post('/api/settings', authMiddleware, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    const settings = req.body;
    saveJSON('settings.json', settings);
    res.json({ message: 'Settings saved' });
});

// Request Password Reset
app.post('/api/request-reset', async (req, res) => {
    const { email } = req.body;
    const users = loadJSON('users.json') || [];

    // Find user
    const user = users.find(u => u.email === email);

    // Always return success to prevent email enumeration, unless dev mode
    if (!user) {
        return res.json({ message: 'If account exists, email sent' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hour

    // Save token to user
    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    saveJSON('users.json', users);

    // Send email
    // Use requesting host for link
    const protocol = req.protocol;
    const host = req.get('host'); // e.g. localhost:3000
    // Simplify for now: assume frontend is on port 3000, API is on 3001
    // Ideally user provides frontend URL in .env, but we'll infer or hardcode for now
    const frontendHost = req.get('referer') ? new URL(req.get('referer')).origin : 'http://localhost:3000';

    const settings = loadJSON('settings.json') || {};
    const sent = await sendPasswordResetEmail(email, token, frontendHost, settings);

    if (sent) {
        res.json({ message: 'Email sent' });
    } else {
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Reset Password with Token
app.post('/api/reset-password', (req, res) => {
    const { token, newPassword } = req.body;
    const users = loadJSON('users.json') || [];

    const user = users.find(u =>
        u.resetToken === token &&
        u.resetTokenExpiry > Date.now()
    );

    if (!user) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    // Update user
    user.password = hash;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    saveJSON('users.json', users);

    res.json({ message: 'Password reset successful' });
});

// Change Password (Authenticated)
app.post('/api/change-password', authMiddleware, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const users = loadJSON('users.json') || [];
    const user = users.find(u => u.id === req.user.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Verify current
    const valid = bcrypt.compareSync(currentPassword, user.password);
    if (!valid) {
        return res.status(400).json({ error: 'Incorrect current password' });
    }

    // Update
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(newPassword, salt);
    saveJSON('users.json', users);

    res.json({ message: 'Password updated' });
});

// === Account Management Routes ===

// List users (Admin only)
app.get('/api/users', authMiddleware, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    const users = loadJSON('users.json') || [];
    // Return users without passwords
    const safeUsers = users.map(({ password, ...u }) => u);
    res.json(safeUsers);
});

// Create user (Admin only)
app.post('/api/users', authMiddleware, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    const users = loadJSON('users.json') || [];
    const { email, password, role, name } = req.body;

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = {
        id: `user-${Date.now()}`,
        email,
        password: hash,
        role: role || 'member',
        name: name || 'New Member'
    };

    users.push(newUser);
    saveJSON('users.json', users);

    const { password: _, ...safeUser } = newUser;
    res.json(safeUser);
});

// Delete user (Admin only)
app.delete('/api/users/:id', authMiddleware, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    const users = loadJSON('users.json') || [];
    const index = users.findIndex(u => u.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deleting self (optional safety)
    if (users[index].id === req.user.id) {
        return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    const deleted = users.splice(index, 1)[0];
    saveJSON('users.json', users);

    const { password: _, ...safeDeleted } = deleted;
    res.json({ deleted: safeDeleted });
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

    // Auto-add to grid order
    const gridOrder = loadJSON('grid-order.json') || [];
    gridOrder.push({ id, size: 'medium' });
    saveJSON('grid-order.json', gridOrder);

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

    // Auto-remove from grid order
    const gridOrder = loadJSON('grid-order.json') || [];
    const newGridOrder = gridOrder.filter(item => item.id !== req.params.id);
    saveJSON('grid-order.json', newGridOrder);

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
// Public endpoint - needed for frontend Category Hub
app.get('/api/collections', (req, res) => {
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

// Delete collection
app.delete('/api/collections/:id', authMiddleware, (req, res) => {
    const collections = loadJSON('collections.json') || [];
    const index = collections.findIndex(c => c.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Collection not found' });
    }
    const deleted = collections.splice(index, 1)[0];
    saveJSON('collections.json', collections);
    res.json({ deleted });
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

// === Archive Routes ===
app.get('/api/archive-posts', authMiddleware, (req, res) => {
    const posts = loadJSON('archive-posts.json') || [];
    res.json(posts);
});

app.post('/api/archive-posts', authMiddleware, (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
        return res.status(403).json({ error: 'Admin/Editor access required' });
    }
    const posts = loadJSON('archive-posts.json') || [];
    const newPost = {
        id: req.body.id || `post-${Date.now()}`,
        title: req.body.title || 'New Post',
        date: req.body.date || new Date().toISOString(),
        content: req.body.content || [], // Blocks: { type: 'text'|'image'|'video', value: '' }
        tags: req.body.tags || [],
        isLocked: req.body.isLocked !== undefined ? req.body.isLocked : true
    };
    posts.unshift(newPost); // Add to top
    saveJSON('archive-posts.json', posts);
    res.json(newPost);
});

app.put('/api/archive-posts/:id', authMiddleware, (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
        return res.status(403).json({ error: 'Admin/Editor access required' });
    }
    const posts = loadJSON('archive-posts.json') || [];
    const index = posts.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Post not found' });

    posts[index] = { ...posts[index], ...req.body };
    saveJSON('archive-posts.json', posts);
    res.json(posts[index]);
});

app.delete('/api/archive-posts/:id', authMiddleware, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    const posts = loadJSON('archive-posts.json') || [];
    const index = posts.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Post not found' });

    const deleted = posts.splice(index, 1)[0];
    saveJSON('archive-posts.json', posts);
    res.json({ deleted });
});

// === Film Routes ===
// Public endpoint - needed for frontend film showcase
app.get('/api/films', (req, res) => {
    const films = loadJSON('films.json') || [];
    // Return sorted by order
    films.sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json(films);
});

app.post('/api/films', authMiddleware, (req, res) => {
    const films = loadJSON('films.json') || [];
    const newFilm = {
        id: req.body.id || `film-${Date.now()}`,
        title: req.body.title || 'New Film',
        category: req.body.category || 'Film',
        youtubeId: req.body.youtubeId || '',
        order: req.body.order !== undefined ? req.body.order : films.length
    };
    films.push(newFilm);
    saveJSON('films.json', films);
    res.json(newFilm);
});

app.put('/api/films/:id', authMiddleware, (req, res) => {
    const films = loadJSON('films.json') || [];
    const index = films.findIndex(f => f.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Film not found' });

    films[index] = { ...films[index], ...req.body };
    saveJSON('films.json', films);
    res.json(films[index]);
});

app.delete('/api/films/:id', authMiddleware, (req, res) => {
    const films = loadJSON('films.json') || [];
    const index = films.findIndex(f => f.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Film not found' });

    const deleted = films.splice(index, 1)[0];
    saveJSON('films.json', films);
    res.json({ deleted });
});

// === Public Config Endpoint (for frontend) ===
app.get('/api/config.json', (req, res) => {
    const splats = loadJSON('splats.json') || [];
    const galleries = loadJSON('galleries.json') || { galleries: [] };
    const collections = loadJSON('collections.json') || [];
    const films = loadJSON('films.json') || [];

    res.json({
        splats,
        galleries: galleries.galleries,
        collections,
        films
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

// Trigger restart for initUsers
