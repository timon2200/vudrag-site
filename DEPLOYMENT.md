# Deployment Guide: cPanel + Passenger (Self-Hosted)

> **Live Site**: [https://vudrag.varazdin.studio](https://vudrag.varazdin.studio)  
> **Admin Panel**: [https://vudrag.varazdin.studio/cms-admin](https://vudrag.varazdin.studio/cms-admin)  
> **API Base**: [https://vudrag.varazdin.studio/api](https://vudrag.varazdin.studio/api)

## Architecture Overview

Both the frontend and CMS backend are served from a **single Node.js application** on cPanel with CloudLinux Passenger. The Express CMS server handles API routes, admin panel, and also serves the static frontend files.

```
┌──────────────────────────────────────────────────────────┐
│                    cPanel Server                         │
│             vudrag.varazdin.studio                       │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │         CloudLinux Passenger (Node.js 22)           │ │
│  │                                                     │ │
│  │  ┌─────────────────────┐  ┌──────────────────────┐ │ │
│  │  │   Express CMS       │  │   Static Frontend    │ │ │
│  │  │   (cms/server.js)   │  │   (dist/ files)      │ │ │
│  │  │                     │  │                      │ │ │
│  │  │   /api/*            │  │   index.html         │ │ │
│  │  │   /cms-admin        │  │   gallery.html       │ │ │
│  │  │   data/*.json       │  │   sculpture.html     │ │ │
│  │  │                     │  │   assets/, images/   │ │ │
│  │  │                     │  │   splats/*.sog       │ │ │
│  │  └─────────────────────┘  └──────────────────────┘ │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Key insight**: With cPanel Passenger, ALL HTTP requests are routed through the Node.js app. The Express server serves both the API and the static frontend files from the document root (`../` relative to `cms/`).

---

## Hosting Environment

| Detail | Value |
|--------|-------|
| **Server** | WHM/cPanel on `git.brzioblak.eu` |
| **IP Address** | `194.56.74.62` |
| **cPanel Account** | `varazdin` (for `varazdin.studio`) |
| **Subdomain** | `vudrag.varazdin.studio` |
| **Document Root** | `/home/varazdin/vudrag.varazdin.studio/` |
| **Node.js App Root** | `/home/varazdin/vudrag.varazdin.studio/cms/` |
| **Node.js Version** | 22 (CloudLinux Node.js Selector) |
| **Startup File** | `server.js` |
| **DNS Provider** | Cloudflare (`santino.ns.cloudflare.com`, `sky.ns.cloudflare.com`) |
| **SSL** | AutoSSL (Let's Encrypt), auto-renews |
| **Git Repository** | `https://github.com/timon2200/vudrag-site.git` |

### Important: DNS is on Cloudflare

The domain `varazdin.studio` uses **Cloudflare nameservers**, not cPanel's Zone Editor. Any DNS changes (new subdomains, etc.) MUST be made in the Cloudflare dashboard, NOT in WHM/cPanel Zone Editor.

**Cloudflare DNS Records for the subdomain:**
| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `vudrag` | `194.56.74.62` | DNS only (grey) |
| CNAME | `www.vudrag` | `vudrag.varazdin.studio` | DNS only (grey) |

> ⚠️ **Proxy must be "DNS only" (grey cloud)** — Cloudflare orange-cloud proxy interferes with Passenger/Node.js.

---

## WHM Server Setup

The WHM server at `git.brzioblak.eu` required the following setup before cPanel could host Node.js apps. This only needs to be done once per server.

### Prerequisites Installed in WHM

1. **CloudLinux LVE Manager** → Node.js Selector
   - WHM → **CloudLinux LVE Manager** → **Options** tab → Enable **Node.js Selector**
   - This adds the "Setup Node.js App" feature to cPanel

2. **Apache Passenger (mod_passenger)**
   - WHM → **EasyApache 4** → **Currently Installed Packages** → search for `passenger`
   - Install `mod_passenger` module
   - This allows Apache to proxy requests to Node.js apps

3. **Feature Manager** (enable for user package)
   - WHM → **Feature Manager** → edit the relevant feature list
   - Enable: **Node.js Selector**, **Application Manager**
   - This makes the features visible in the cPanel account

### cPanel Node.js App Configuration

In **cPanel → Setup Node.js App**:

| Setting | Value |
|---------|-------|
| Node.js version | `22` |
| Application mode | `Production` |
| Application root | `vudrag.varazdin.studio/cms` |
| Application URL | `vudrag.varazdin.studio` |
| Application startup file | `server.js` |

**Environment variables** are set in the same UI (see Environment Variables section below).

### cPanel Git Version Control

In **cPanel → Git™ Version Control**:

| Setting | Value |
|---------|-------|
| Clone URL | `https://github.com/timon2200/vudrag-site.git` |
| Repository path | `/home/varazdin/repositories/vudrag-site` |
| Branch | `main` |

The `.cpanel.yml` in the repo root defines deployment tasks (copy files to document root).

### Node.js Virtual Environment

CloudLinux stores node_modules in a separate virtual environment, not in the app directory. The path is:
```
/home/varazdin/nodevenv/vudrag.varazdin.studio/cms/22/
```

To activate manually (e.g., via Terminal):
```bash
source /home/varazdin/nodevenv/vudrag.varazdin.studio/cms/22/bin/activate && cd /home/varazdin/vudrag.varazdin.studio/cms
```

> **Never upload a `node_modules` folder** to the app directory — it conflicts with CloudLinux's symlink. Always use cPanel's "Run NPM Install" button.

---

## Future: Migrating to vudrag.com

When ready to point `vudrag.com` to this site:

### Option A: Add vudrag.com as Addon Domain (Recommended)

1. **In cPanel** → **Domains** → **Create a New Domain**
   - Domain: `vudrag.com`
   - Document root: `/home/varazdin/vudrag.varazdin.studio/` (share with existing subdomain)
   - Check "Share document root"

2. **Update Node.js App** in cPanel:
   - Add `vudrag.com` as an additional Application URL (or create a second app pointing to the same root)

3. **DNS at vudrag.com's registrar:**
   - Set A record: `@` → `194.56.74.62`
   - Set CNAME: `www` → `vudrag.com`
   - Or point nameservers to Cloudflare and manage there

4. **Update CORS_ORIGIN** env variable:
   - Change to: `https://vudrag.com,https://vudrag.varazdin.studio`

5. **Run AutoSSL** to provision SSL for the new domain

6. **Optional redirect**: Add to `.htaccess` to redirect the old subdomain:
   ```apache
   RewriteEngine On
   RewriteCond %{HTTP_HOST} ^vudrag\.varazdin\.studio$ [NC]
   RewriteRule ^(.*)$ https://vudrag.com/$1 [L,R=301]
   ```

### Option B: Replace Subdomain Entirely

1. Change the subdomain's document root to a placeholder
2. Set up `vudrag.com` as the primary domain for this site
3. Update all env variables and CORS settings
4. Update `.env.production` if using absolute URLs

> **Note**: Keep `vudrag.varazdin.studio` as a staging/development URL even after `vudrag.com` goes live.

---

## Server File Structure

```
/home/varazdin/vudrag.varazdin.studio/
├── index.html              # Frontend entry page
├── gallery.html            # Gallery page
├── sculpture.html          # Sculpture detail page
├── archive.html            # Archive page
├── contact.html            # Contact page
├── login.html              # Login page
├── splat-hero.html         # Standalone splat hero
├── splat-viewer.html       # Interactive splat viewer
├── assets/                 # Vite-built JS/CSS bundles
├── images/                 # Compressed WebP images
├── textures/               # Title textures (WebP)
├── splats/                 # Gaussian splat .sog files
├── environments/           # HDR environment maps
├── models/                 # 3D models (GLB)
├── admin/                  # CMS admin panel (static HTML/JS/CSS)
├── public/                 # Public assets served by Express
├── dist/                   # Vite build output (built on server during deploy)
├── cms/                    # Node.js CMS application
│   ├── server.js           # Express server (Passenger entry point)
│   ├── package.json        # CMS dependencies
│   ├── node_modules/       # Symlink → CloudLinux virtual env
│   ├── data/               # JSON flat-file database
│   │   ├── splats.json
│   │   ├── galleries.json
│   │   ├── collections.json
│   │   ├── films.json
│   │   ├── sculptures.json
│   │   ├── site-content.json
│   │   ├── grid-order.json
│   │   └── users.json
│   └── services/
│       └── mailer.js       # Email service (Resend)
└── wordpress-backups/      # (unrelated, pre-existing)
```

---

## Environment Variables

Set in **cPanel → Setup Node.js App → Environment Variables**:

| Variable | Value | Description |
|----------|-------|-------------|
| `JWT_SECRET` | `vudrag-cpanel-prod-2026-s3cur3k3y` | JWT signing key |
| `ADMIN_PASSWORD` | *(your password)* | CMS admin login |
| `CORS_ORIGIN` | `https://vudrag.varazdin.studio` | Allowed CORS origin |

> `process.env.PORT` is set automatically by Passenger — do not set manually.

---

## Deployment Workflow

### How Deployment Works

1. **Commit & push** source code to GitHub (`dist/` is gitignored — only source is pushed)
2. **Pull & Deploy** in cPanel's Git Version Control
3. The `.cpanel.yml` file **builds the frontend on the server** (`npm ci && npm run build`) and copies files to the correct locations
4. **Restart** the Node.js app in cPanel

### Step-by-Step Deploy

```bash
# 1. Stage source changes
git add -A

# 2. Commit with a descriptive message
git commit -m "Your changes description"

# 3. Push to GitHub
git push origin main
```

Then in **cPanel**:

4. Go to **Git™ Version Control** → your repo → **Pull or Deploy**
5. Click **"Update from Remote"**
6. Click **"Deploy HEAD Commit"** (this triggers the server-side build)
7. Go to **Setup Node.js App** → click **Restart**

### First-Time Setup

If setting up for the first time on a new cPanel account:

1. **Create subdomain** in cPanel → Domains
2. **Setup Node.js App** in cPanel:
   - Node.js version: 22
   - Application mode: Production
   - Application root: `vudrag.varazdin.studio/cms`
   - Application URL: `vudrag.varazdin.studio`
   - Application startup file: `server.js`
3. **Add environment variables** (see table above)
4. **Clone repo** in Git Version Control:
   - Repository URL: `https://github.com/timon2200/vudrag-site.git`
   - Deploy key or credentials as needed
5. **Deploy HEAD Commit**
6. **Run NPM Install** in Node.js App settings
7. **Restart** the app
8. **Add DNS record** in Cloudflare (A record → server IP)
9. **Run AutoSSL** in cPanel → SSL/TLS Status

### What `.cpanel.yml` Does

The `.cpanel.yml` file in the repo root defines deployment tasks. It **builds the frontend on the server** using the Node.js 22 virtual environment, then copies files to the document root:

```yaml
---
deployment:
  tasks:
    # Build frontend on the server
    - source nodevenv/.../22/bin/activate && npm ci && npm run build
    # Copy build output + assets to document root
    - /bin/cp -R dist/* .../vudrag.varazdin.studio/
    - /bin/cp -R public/* .../vudrag.varazdin.studio/
    - /bin/cp -R admin .../vudrag.varazdin.studio/
    # Copy CMS backend
    - /bin/cp cms/server.js .../vudrag.varazdin.studio/cms/
    - /bin/cp cms/package.json .../vudrag.varazdin.studio/cms/
    - /bin/cp -R cms/services/* .../vudrag.varazdin.studio/cms/services/
```

> **Note**: `dist/` is in `.gitignore` — the frontend is built on the server, not locally. This keeps git pushes fast (~2MB source code vs ~64MB build artifacts).

### CloudLinux Node.js Virtual Environment

CloudLinux manages `node_modules` through a virtual environment, NOT a regular folder. The `node_modules` inside `cms/` is a **symlink** to `/home/varazdin/nodevenv/vudrag.varazdin.studio/cms/22/`. 

**Never upload a `node_modules` folder directly** — use cPanel's "Run NPM Install" button instead.

To activate the virtual environment manually (e.g., via Terminal):
```bash
source /home/varazdin/nodevenv/vudrag.varazdin.studio/cms/22/bin/activate && cd /home/varazdin/vudrag.varazdin.studio/cms
```

---

## How Passenger Serves the Site

With cPanel's Node.js app setup, Apache Passenger intercepts **all requests** to `vudrag.varazdin.studio` and routes them through the Express app in `cms/server.js`.

The Express server handles requests in this order:

1. **`/cms-admin`** → Serves admin panel static files from `admin/`
2. **Document root static files** → Serves `index.html`, `gallery.html`, CSS, JS, images, splats from `../` (parent of cms)
3. **`/public` static files** → Images, splats, models from `public/`
4. **`/api/*`** → CMS API routes (CRUD for content data)
5. **SPA fallback** → Any unmatched non-API GET request serves `index.html`

---

## Image Optimization

All images are converted to **WebP** format for optimal loading:

| Original | WebP | Savings |
|----------|------|---------|
| `8.png` (6.2MB) | `8.webp` (853KB) | 86% |
| `title-texture.png` (708KB) | `title-texture.webp` (70KB) | 90% |
| 11 JPG files (~2MB total) | WebP (~1.9MB) | ~5–35% each |

All code references (JS, CSS, JSON) use `.webp` extensions. The only exception is YouTube thumbnail URLs which remain `.jpg` (external service).

---

## SSL Certificate

SSL is managed by **cPanel AutoSSL** (Let's Encrypt):

- **Domain**: `vudrag.varazdin.studio`
- **www**: `www.vudrag.varazdin.studio`
- **Auto-renews**: Yes, via AutoSSL
- **Expires**: Check SSL/TLS Status in cPanel

To force HTTPS, add to the `.htaccess` in the document root:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## Troubleshooting

### "Cannot GET /"
The Node.js app needs to serve the frontend files. Check that `cms/server.js` has:
```javascript
const DOCUMENT_ROOT = join(__dirname, '..');
app.use(express.static(DOCUMENT_ROOT));
```

### "Run NPM Install" fails
- Usually DNS-related: the server must resolve the subdomain URL
- Ensure the DNS A record exists in **Cloudflare** (not just cPanel's Zone Editor)
- Wait for DNS propagation, then retry

### CORS errors
- The `.env.production` should use relative API path: `VITE_API_BASE=/api`
- Since frontend and API are on the same domain, requests are same-origin
- No CORS issues when using relative paths

### DNS not resolving
- DNS for `varazdin.studio` is managed by **Cloudflare**, not WHM
- Add/edit records in the Cloudflare dashboard
- Flush local DNS cache: `sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder`

### Site showing cPanel default page
- Accessing by IP shows the default page (expected on shared hosting)
- Always access via domain name: `https://vudrag.varazdin.studio`

### Node.js app not starting
- Check stderr log in cPanel → Setup Node.js App
- Verify `server.js` exists in `/home/varazdin/vudrag.varazdin.studio/cms/`
- Verify environment variables are set

---

## Costs

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| WHM/cPanel | Existing server | **Included** |
| Cloudflare DNS | Free | **FREE** |
| SSL (AutoSSL) | Free | **FREE** |

**Total: $0 additional/month** (uses existing server infrastructure)

---

## Quick Reference

| What | URL |
|------|-----|
| **Live Site** | `https://vudrag.varazdin.studio` |
| **Admin Panel** | `https://vudrag.varazdin.studio/cms-admin` |
| **API Endpoint** | `https://vudrag.varazdin.studio/api` |
| **API Health Check** | `https://vudrag.varazdin.studio/api/config.json` |
| **cPanel** | `https://cpanel.varazdin.studio` |
| **WHM** | `https://whm.varazdin.studio` |
| **GitHub Repo** | `https://github.com/timon2200/vudrag-site.git` |
