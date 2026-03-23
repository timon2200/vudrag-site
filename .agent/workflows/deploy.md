---
description: Commit, push, and deploy to cPanel (vudrag.varazdin.studio)
---

# Deploy Workflow

This workflow builds the frontend, commits changes, pushes to GitHub, and deploys to the cPanel server at `vudrag.varazdin.studio`.

## Pre-Deploy Checks

// turbo
1. Check git status to see what files have changed:
   ```bash
   cd /Users/timonterzic/Documents/vudrag-site && git status
   ```

// turbo
2. Run the production build locally to create `dist/`:
   ```bash
   cd /Users/timonterzic/Documents/vudrag-site && npm run build
   ```
   - If build fails, stop and fix the errors before continuing.

// turbo
3. Verify .env.production has the correct relative API path:
   ```bash
   cat /Users/timonterzic/Documents/vudrag-site/.env.production
   ```
   - Should contain: `VITE_API_BASE=/api`

## Commit and Push

4. Stage all changes (including dist/) and commit with a descriptive message:
   ```bash
   cd /Users/timonterzic/Documents/vudrag-site && git add -A && git commit -m "<describe what changed>"
   ```
   - Generate a meaningful commit message based on the changed files.

5. Push to GitHub to prepare for deployment:
   ```bash
   cd /Users/timonterzic/Documents/vudrag-site && git push origin main
   ```

## Deploy on cPanel

6. Tell the user to perform these steps in cPanel:
   - Go to **Git™ Version Control** → `vudrag-site` repo → **Pull or Deploy**
   - Click **"Update from Remote"**
   - Click **"Deploy HEAD Commit"**
   - Go to **Setup Node.js App** → click **Restart**

## Post-Deploy Verification

7. Wait 30 seconds for the app to restart, then verify:

8. **Check the frontend is loading:**
   - Use browser_subagent or read_url_content to test: `https://vudrag.varazdin.studio`
   - The page should load with content

9. **Check the CMS API is responding:**
   - Use read_url_content to test: `https://vudrag.varazdin.studio/api/config.json`
   - Should return JSON data

10. **Check the admin panel:**
    - Verify `https://vudrag.varazdin.studio/cms-admin` loads the admin interface

11. **Report deployment status to user:**
    - Summarize what was committed
    - Confirm the site and API are responding
    - Note any warnings or issues found

## Troubleshooting

If the site shows "Cannot GET /":
- The Node.js app needs to be restarted in cPanel
- Check that server.js was deployed correctly

If API returns errors:
- Check cPanel → Setup Node.js App → stderr logs
- Verify environment variables are set (JWT_SECRET, ADMIN_PASSWORD, CORS_ORIGIN)

If "Run NPM Install" fails:
- This happens when DNS isn't resolving. CloudLinux checks the URL
- Verify DNS A record exists in Cloudflare (not cPanel Zone Editor)

## Reference URLs

| What | URL |
|------|-----|
| **Live Site** | https://vudrag.varazdin.studio |
| **Admin Panel** | https://vudrag.varazdin.studio/cms-admin |
| **API** | https://vudrag.varazdin.studio/api |
| **cPanel** | https://cpanel.varazdin.studio |
| **GitHub** | https://github.com/timon2200/vudrag-site.git |
