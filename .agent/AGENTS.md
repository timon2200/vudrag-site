# Agent Instructions for Vudrag Site

> [!CAUTION]
> **The dev server runs on port 3000, NOT 5173.**
> Vite is configured to use port 3000 in `vite.config.js`.
> Always use `http://localhost:3000` when opening or testing the frontend.
> The CMS runs on port 3001. Vite proxies `/api` requests to it automatically.

## Ports

| Service  | Port | URL                          |
|----------|------|------------------------------|
| Frontend | 3000 | http://localhost:3000         |
| CMS API  | 3001 | http://localhost:3001         |
| CMS Admin| 3001 | http://localhost:3001/cms-admin |

## Key Commands

```bash
# Frontend dev server (port 3000)
npm run dev

# CMS server (port 3001)
cd cms && node server.js
```

## Important Files

- `vite.config.js` — Vite config (port, proxy, multi-page entries)
- `README.md` — Project overview
- `ARCHITECTURE.md` — Technical architecture
- `DEPLOYMENT.md` — Production deployment guide
- `cms/README.md` — CMS API reference
