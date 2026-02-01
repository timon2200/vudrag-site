# Deployment Guide: Vercel (Frontend) + Render (Backend/CMS)

This guide explains how to deploy the Vudrag Portfolio using **Vercel** for the static frontend and **Render** for the CMS backend.

## Architecture Overview

```
┌─────────────────┐       API calls        ┌─────────────────┐
│   VERCEL        │ ────────────────────▶  │    RENDER       │
│   (Frontend)    │                        │    (CMS API)    │
│                 │                        │                 │
│   index.html    │                        │   server.js     │
│   gallery.html  │ ◀──── JSON data ────── │   /api/*        │
│   sculpture.html│                        │   /admin        │
│   + JS/CSS/Splats                        │   data/*.json   │
└─────────────────┘                        └─────────────────┘
     FREE tier                                 FREE tier
```

---

## Prerequisites

1. GitHub account with this repository pushed
2. Vercel account (free): https://vercel.com
3. Render account (free): https://render.com

---

## Part 1: Deploy CMS to Render

### Step 1: Create Render Account & New Web Service

1. Go to https://render.com and sign up
2. Click **New +** → **Web Service**
3. Connect your GitHub repository

### Step 2: Configure the Service

| Setting | Value |
|---------|-------|
| **Name** | `vudrag-cms` (or any name you prefer) |
| **Region** | Frankfurt (EU) or closest to you |
| **Branch** | `main` |
| **Root Directory** | `cms` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

### Step 3: Add Environment Variables

In the Render dashboard, go to **Environment** and add:

| Key | Value |
|-----|-------|
| `CMS_PORT` | `10000` (Render uses this port) |
| `JWT_SECRET` | Generate a random string (e.g., `your-super-secret-key-change-this-123`) |
| `ADMIN_PASSWORD` | Your admin password |
| `CORS_ORIGIN` | `*` (we'll restrict this later) |
| `RESEND_API_KEY` | Your Resend API key (for password reset emails) |

### Step 4: Deploy

Click **Create Web Service**. Render will:
1. Clone your repo
2. Run `npm install` in the `cms` folder
3. Start `npm start`
4. Give you a URL like: `https://vudrag-cms.onrender.com`

**📝 Copy this URL!** You'll need it for the next step.

### Step 5: Verify CMS

Visit `https://YOUR-RENDER-URL.onrender.com/api/config.json`

You should see JSON data with your splats, galleries, and collections.

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Production Environment

Edit `.env.production` in your project root:

```bash
VITE_API_BASE=https://YOUR-RENDER-URL.onrender.com/api
```

Replace `YOUR-RENDER-URL` with your actual Render service URL.

**Commit and push this change:**
```bash
git add .env.production
git commit -m "Configure production API URL"
git push
```

### Step 2: Create Vercel Project

1. Go to https://vercel.com and sign in
2. Click **Add New...** → **Project**
3. Import your GitHub repository

### Step 3: Configure Vercel

Vercel will auto-detect Vite. Verify these settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

Click **Deploy**.

### Step 4: Verify Deployment

1. Visit your Vercel URL (e.g., `https://vudrag-portfolio.vercel.app`)
2. The site should load and fetch data from your Render CMS
3. Visit `/login.html` and log in with your admin credentials

---

## Part 3: Configure CORS (Security)

Once both are deployed, update Render's CORS setting:

1. Go to Render Dashboard → Your CMS Service → Environment
2. Update `CORS_ORIGIN` to your Vercel domain:
   ```
   https://vudrag-portfolio.vercel.app
   ```
3. Click **Save Changes** (this will trigger a redeploy)

---

## Daily Workflow

### Making Code Changes

```bash
# 1. Make changes locally
# 2. Test locally
npm run dev                    # Frontend on localhost:3000
cd cms && npm start            # CMS on localhost:3001

# 3. Commit and push
git add .
git commit -m "Your changes"
git push origin main

# 4. Wait 1-3 minutes
# Both Vercel and Render auto-deploy!
```

### Managing Content

Use the Admin Panel at:
```
https://YOUR-RENDER-URL.onrender.com/admin
```

Changes via admin panel are saved directly to Render - no git push needed.

---

## Troubleshooting

### "API calls failing"
- Check browser console for CORS errors
- Verify `CORS_ORIGIN` in Render matches your Vercel domain exactly
- Check that `.env.production` has the correct Render URL

### "Admin panel not loading"
- Visit `https://YOUR-RENDER-URL.onrender.com/admin` directly
- Check Render logs for errors

### "Free tier sleeping"
- Render free tier spins down after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- Consider upgrading to Starter ($7/mo) for always-on

### "Images/splats not showing"
- Verify files exist in `public/` folder
- Check that Vercel deployed the `dist` folder correctly
- Large splat files may need a CDN (Cloudflare R2 recommended)

---

## Costs

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Vercel | Hobby | **FREE** |
| Render | Free | **FREE** |

**Total: $0/month** for basic usage!

### When to Upgrade

- **Render Starter ($7/mo)**: Always-on, no cold starts
- **Vercel Pro ($20/mo)**: Team features, analytics
- **Cloudflare R2**: Free 10GB for large splat/media files

---

## Quick Reference

| What | URL |
|------|-----|
| **Live Site** | `https://your-project.vercel.app` |
| **CMS API** | `https://your-cms.onrender.com/api` |
| **Admin Panel** | `https://your-cms.onrender.com/admin` |
| **API Health Check** | `https://your-cms.onrender.com/api/config.json` |
