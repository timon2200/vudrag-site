# Deployment Guide: Digital Ocean App Platform

This guide explains how to deploy the Vudrag Portfolio to Digital Ocean App Platform. The application consists of two parts that need to be deployed together:

1.  **Backend (CMS)**: A Node.js server that manages content and files.
2.  **Frontend (Website)**: A text/image/3D splat static site built with Vite.

## Prerequisites

1.  A Digital Ocean account.
2.  This code pushed to a GitHub repository (public or private).

---

## Step 1: Create App

1.  Log in to Digital Ocean and click **Create** -> **Apps**.
2.  Choose **GitHub** as your source.
3.  Select the repository `vudrag-site-2` (or whatever you named it).
4.  **Source Directory**: Keep this as `/` (root).
5.  Click **Next**.

## Step 2: Configure Resources

Digital Ocean will try to auto-detect the resources. We need to manually configure them to split the backend and frontend.

### Resource 1: The Backend (Web Service)

1.  Click **Edit** next to the detected service (or "Add Resource" -> "Web Service").
2.  **Name**: `vudrag-cms`
3.  **Source Directory**: `cms` (Important! This tells it to look in the cms folder).
4.  **Environment Variables**:
    *   `CMS_PORT`: `8080` (Digital Ocean automatically exposes port 8080).
    *   `JWT_SECRET`: Generate a random string (e.g., `my-super-secret-key-123`).
    *   `ADMIN_PASSWORD`: Your desired admin password.
    *   `CORS_ORIGIN`: `*` (or your final domain name, e.g., `https://vudrag-portfolio.ondigitalocean.app`).
5.  **Build Command**: `npm install` (default is usually fine).
6.  **Run Command**: `npm start` (which runs `node server.js`).
7.  **HTTP Port**: `8080`.

### Resource 2: The Frontend (Static Site)

1.  Click **Add Resource** -> **Static Site**.
2.  **Name**: `vudrag-frontend`
3.  **Source Directory**: `/` (Root).
4.  **Build Command**: `npm run build`.
5.  **Output Directory**: `dist`.
6.  **Routes** (Crucial Step):
    *   You need to tell the static site to send API requests to the Backend service.
    *   Find the **Routes** or **HTTP Request Routes** section.
    *   Add a route:
        *   **Path**: `/api`
        *   **Proxy to**: `vudrag-cms` (the name of your backend service).

## Step 3: Global Review

1.  **Region**: frankfurt or closest to you.
2.  **Plan**: Basic ($5/mo) is usually sufficient for starting.
3.  Click **Create Resources**.

---

## Verifying Deployment

Once the build finishes (it may take a few minutes):

1.  Click the **Live URL** provided by Digital Ocean.
2.  The site should load.
3.  Go to `/admin` (e.g., `https://your-app.ondigitalocean.app/admin`).
4.  Login with the password you set in Environment Variables.
5.  Upload an image to test that persistence works.

> **Note on Storage**: The App Platform file system is ephemeral, meaning files uploaded to `cms/public` (images/splats) will disappear if the app restarts/redeploys.
> **Production Recommendation**: For a serious live site, you should use **Digital Ocean Spaces (S3)** for storing the splats and images, or attach a **Mountable Volume** to the CMS service (available on Pro/Growth plans) essentially giving it a permanent hard drive.

## Troubleshooting

-   **502 Bad Gateway**: Check the CMS logs. Did it start successfully? Is it listening on port 8080?
-   **CORS Errors**: Check the `CORS_ORIGIN` env var in the CMS service. Set it to the full URL of your frontend (e.g. `https://your-app.ondigitalocean.app`).
-   **Images not loading**: Check the Routes configuration for `/api`. It must point to the CMS service.
