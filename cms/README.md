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

The server starts on **port 3001** (or `process.env.PORT` on cPanel Passenger).

---

## 🔗 Access Points

| Interface | Local URL | Production URL |
|-----------|-----------|----------------|
| **Admin Panel** | `http://localhost:3001/cms-admin` | `https://vudrag.varazdin.studio/cms-admin` |
| **API Config** | `http://localhost:3001/api/config.json` | `https://vudrag.varazdin.studio/api/config.json` |
| **API Base** | `http://localhost:3001/api` | `https://vudrag.varazdin.studio/api` |

---

## 🔐 Authentication

The CMS uses **JWT Bearer tokens** for protected endpoints.

### Login Flow
1. `POST /api/login` with `{ "email": "admin@vudrag.com", "password": "your-password" }`
2. Receive JWT token (valid 24 hours)
3. Include `Authorization: Bearer <token>` header on protected routes

### Public vs Protected
- **Public** (no auth): `GET` sculptures, collections, site-content, grid-order, films, config.json
- **Protected** (JWT required): All `POST`, `PUT`, `DELETE`, plus `GET` splats, galleries, assets, users, archive-posts, settings

---

## 📡 API Reference

### Authentication & Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/login` | — | Authenticate, get JWT |
| `POST` | `/api/request-reset` | — | Send password reset email |
| `POST` | `/api/reset-password` | — | Reset password with token |
| `POST` | `/api/change-password` | ✅ | Update password (self) |
| `GET` | `/api/me` | ✅ | Get current user role |
| `GET` | `/api/users` | ✅ Admin | List all users |
| `POST` | `/api/users` | ✅ Admin | Create user |
| `DELETE` | `/api/users/:id` | ✅ Admin | Delete user |

### Splats

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/splats` | ✅ | List all splats |
| `POST` | `/api/splats` | ✅ | Create splat entry |
| `PUT` | `/api/splats/:index` | ✅ | Update splat at index |
| `DELETE` | `/api/splats/:index` | ✅ | Delete splat at index |

### Sculptures (Detail Pages)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/sculptures` | — | List all sculptures |
| `GET` | `/api/sculptures/:id` | — | Get by ID |
| `POST` | `/api/sculptures` | ✅ | Create (auto-adds to grid order) |
| `PUT` | `/api/sculptures/:id` | ✅ | Update sculpture |
| `DELETE` | `/api/sculptures/:id` | ✅ | Delete (auto-removes from grid order) |

### Collections & Works

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/collections` | — | List all collections |
| `GET` | `/api/collections/:id` | — | Get single collection |
| `POST` | `/api/collections` | ✅ | Create collection |
| `PUT` | `/api/collections/:id` | ✅ | Update collection |
| `DELETE` | `/api/collections/:id` | ✅ | Delete collection |
| `POST` | `/api/collections/:id/works` | ✅ | Add work |
| `PUT` | `/api/collections/:id/works/:index` | ✅ | Update work |
| `DELETE` | `/api/collections/:id/works/:index` | ✅ | Delete work |

### Galleries

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/galleries` | ✅ | List galleries |
| `POST` | `/api/galleries` | ✅ | Create gallery |
| `PUT` | `/api/galleries/:galleryId` | ✅ | Update gallery |
| `POST` | `/api/galleries/:galleryId/sculptures` | ✅ | Add sculpture to gallery |
| `PUT` | `/api/galleries/:galleryId/sculptures/:sculptureId` | ✅ | Update sculpture in gallery |

### Films

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/films` | — | List films (sorted by order) |
| `POST` | `/api/films` | ✅ | Create film |
| `PUT` | `/api/films/:id` | ✅ | Update film |
| `DELETE` | `/api/films/:id` | ✅ | Delete film |

### Archive Posts

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/archive-posts` | ✅ | List archive posts |
| `POST` | `/api/archive-posts` | ✅ Editor+ | Create post |
| `PUT` | `/api/archive-posts/:id` | ✅ Editor+ | Update post |
| `DELETE` | `/api/archive-posts/:id` | ✅ Admin | Delete post |

### Site Content

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/site-content` | — | Get footer, contact, artist content |
| `PUT` | `/api/site-content` | ✅ | Update site content |

### Grid Order

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/grid-order` | — | Get works display order |
| `PUT` | `/api/grid-order` | ✅ | Update display order (array) |

### Settings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/settings` | ✅ Admin | Get system settings |
| `POST` | `/api/settings` | ✅ Admin | Update settings |

### Asset Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/assets` | ✅ | List all uploaded assets |
| `POST` | `/api/upload/:type` | ✅ | Upload file (`splat`, `image`, `environment`) |
| `DELETE` | `/api/assets/:type/:filename` | ✅ | Delete asset file |

**Upload destinations:**
- `splat` → `public/splats/`
- `image` → `public/images/`
- `environment` → `public/environments/`

### Aggregated Config

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/config.json` | — | Aggregated config (splats + galleries + collections + films) |

---

## 📁 Data Storage

All content is stored as flat-file JSON in `cms/data/`:

```
cms/data/
├── collections.json       # Collections & nested works (~35KB)
├── sculptures.json        # Detail page narratives
├── site-content.json      # Footer, contact, artist section
├── splats.json            # 3D splat transforms & color grading
├── galleries.json         # Gallery definitions & metadata
├── films.json             # Film/video showcase data
├── archive-posts.json     # Archive posts (block-based)
├── grid-order.json        # Works showcase display order
└── users.json             # Admin user accounts
```

---

## 🎨 Admin Panel

The Admin Panel (`/cms-admin`) provides a visual interface:

- **Collection Editor** — Category hub content with nested works and `pageType` routing
- **Sculpture Page Manager** — Rich narrative fields with image uploaders
- **Splat Editor** — Position, rotation, scale, color grading sliders
- **Gallery Manager** — Sculpture metadata and descriptions
- **Asset Library** — Drag-and-drop file uploads with visual browser
- **Film Manager** — Video showcase data
- **Site Content** — Footer, contact, artist section, social links
- **User Management** — Admin accounts and roles
- **Settings** — Email templates, system preferences
- **Image Cropper** — Built-in cropper for precise framing

---

## 🔧 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Express.js** | Web server framework |
| **JWT** (jsonwebtoken) | Stateless authentication |
| **bcryptjs** | Password hashing |
| **Multer** | File upload handling |
| **CORS** | Cross-origin request configuration |
| **dotenv** | Environment variable management |
| **Resend** | Transactional email service |

---

## 🐛 Troubleshooting

### "Invalid credentials" on login
- Ensure `.env` file exists in `cms/` directory
- Verify `ADMIN_PASSWORD` is set
- Login uses email (`admin@vudrag.com` by default) + password
- Restart server after `.env` changes

### Assets not appearing
- Check that `public/` subdirectories exist (`splats/`, `images/`, `environments/`)
- Verify file permissions

### CORS errors in development
- Vite dev server proxies `/api` to port 3001 (configured in `vite.config.js`)
- If running CMS without Vite, ensure frontend port is in `CORS_ORIGIN`

---

## 📚 Related Documentation

- **[Main README](../README.md)** — Project overview
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** — Technical system documentation
- **[DEPLOYMENT.md](../DEPLOYMENT.md)** — Production hosting guide
- **[PROJECT_TRAJECTORY.md](../PROJECT_TRAJECTORY.md)** — Roadmap and status
