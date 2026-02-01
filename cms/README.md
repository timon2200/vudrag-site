# Vudrag CMS Server

> Lightweight headless CMS for managing portfolio content and assets.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
cd cms
npm install
```

### Configuration

Create a `.env` file in the `cms/` directory:

```env
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
RESEND_API_KEY=re_123456789
```

### Running the Server

```bash
node server.js
```

The server starts on **port 3001**.

---

## 🔗 Access Points

| Interface | URL | Description |
|-----------|-----|-------------|
| **Admin Panel** | `http://localhost:3001/admin` | Visual content management UI |
| **API Config** | `http://localhost:3001/api/config.json` | Aggregated site configuration |
| **Sculptures API** | `http://localhost:3001/api/sculptures/:id` | Public sculpture data |

---

## 🔐 Authentication

The CMS uses **JWT Bearer tokens** for protected endpoints.

### Login Flow
1. `POST /api/login` with `{ "password": "your-password" }`
2. Receive a JWT token (valid for 24 hours)
3. Include token in `Authorization: Bearer <token>` header for protected routes

### Protected vs Public Endpoints
- **Protected** (require JWT): All `POST`, `PUT`, `DELETE` operations
- **Public** (no auth): `GET /api/sculptures/:id`, `GET /api/config.json`, `POST /api/request-reset`, `POST /api/reset-password`

---

## 📡 API Reference

### System Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/settings` | Get global settings (email, system) |
| `POST` | `/api/settings` | Update global settings |

### Authentication & Passwords
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/login` | Authenticate and get JWT |
| `POST` | `/api/request-reset` | Send password reset email |
| `POST` | `/api/reset-password` | Set new password with token |
| `POST` | `/api/change-password` | Update password (authenticated) |

### Splats

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/config.json` | Get all splats (in aggregated config) |
| `POST` | `/api/splats` | Create new splat entry |
| `PUT` | `/api/splats/:index` | Update splat at index |
| `DELETE` | `/api/splats/:index` | Delete splat at index |

### Sculptures (Detail Pages)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/sculptures` | List all sculptures |
| `GET` | `/api/sculptures/:id` | Get sculpture by ID (public) |
| `POST` | `/api/sculptures` | Create new sculpture |
| `PUT` | `/api/sculptures/:id` | Update sculpture |
| `DELETE` | `/api/sculptures/:id` | Delete sculpture |

### Galleries

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/galleries` | List all galleries |
| `POST` | `/api/galleries` | Create new gallery |
| `PUT` | `/api/galleries/:galleryId` | Update gallery |
| `PUT` | `/api/galleries/:galleryId/sculptures/:sculptureId` | Update sculpture in gallery |

### Collections & Works

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/collections` | List all collections |
| `POST` | `/api/collections` | Create new collection |
| `PUT` | `/api/collections/:id` | Update collection |
| `POST` | `/api/collections/:id/works` | Add work to collection |
| `PUT` | `/api/collections/:id/works/:index` | Update work at index |
| `DELETE` | `/api/collections/:id/works/:index` | Delete work at index |

### Asset Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/assets` | List all uploaded assets |
| `POST` | `/api/upload/:type` | Upload file (type: `splat`, `image`, `environment`) |
| `DELETE` | `/api/assets/:type/:filename` | Delete asset file |

**Upload destinations:**
- `splat` → `public/splats/`
- `image` → `public/images/`
- `environment` → `public/environments/`

---

## 📁 Data Storage

All content is stored as flat-file JSON in `cms/data/`:

```
cms/data/
├── splats.json        # 3D splat transforms & color grading
├── galleries.json     # Gallery definitions & metadata
├── collections.json   # Category hub & nested works
├── sculptures.json    # Rich narrative content for detail pages
├── users.json         # Admin user accounts [NEW]
└── settings.json      # Global system configuration [NEW]
```

### Sculpture Schema (sculptures.json)

```json
{
  "iron-maiden": {
    "id": "iron-maiden",
    "title": "Iron Maiden",
    "artist": "Nikola Vudrag",
    "year": "2023",
    "material": "Bronze",
    "heroImage": "/images/sculptures/iron-maiden-hero.jpg",
    "process": "Detailed creation process...",
    "technique": "Technical methodology...",
    "vision": "Artistic vision statement...",
    "inspiration": "Source of inspiration...",
    "story": "Historical narrative...",
    "context": "Broader context...",
    "gallery": ["/images/doc1.jpg", "/images/doc2.jpg"],
    "related": ["maska", "kapljica"]
  }
}
```

---

## 🎨 Admin Panel

The Admin Panel (`/admin`) provides a visual interface for content management:

- **Splat Editor** — Position, rotation, scale, and color grading sliders
- **Gallery Manager** — Sculpture metadata and descriptions
- **Collection Editor** — Category hub content with nested works
- **Sculpture Page Manager** — Rich narrative fields with image uploaders
- **Asset Library** — Drag-and-drop file uploads with visual browser

### Image Uploaders

The admin panel features inline drag-and-drop uploaders:
- Immediate upload to server on drop
- Visual preview of uploaded images
- Gallery management for multiple images
- Automatic path persistence

---

## 🔧 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Express.js** | Web server framework |
| **JWT** | Authentication tokens |
| **Multer** | File upload handling |
| **CORS** | Cross-origin requests (ports 3000, 3001) |

---

## 🐛 Troubleshooting

### "Invalid credentials" on login
- Ensure `.env` file exists in `cms/` directory
- Verify `ADMIN_PASSWORD` is set correctly
- Restart the server after `.env` changes

### Assets not appearing
- Check that `public/` directories exist (`splats/`, `images/`, `environments/`)
- Verify file permissions

### CORS errors
- Ensure frontend runs on port 3000 or 3001
- Check that CORS middleware is configured in `server.js`

---

## 📚 Related Documentation

- **[Main README](../README.md)** — Project overview
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** — Technical system documentation
- **[PROJECT_TRAJECTORY.md](../PROJECT_TRAJECTORY.md)** — Roadmap and vision
