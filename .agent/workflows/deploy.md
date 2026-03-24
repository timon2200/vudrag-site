---
description: Commit, push, and deploy to cPanel (vudrag.varazdin.studio)
---

# Deploy Workflow

This workflow commits source changes, pushes to GitHub, and deploys to the cPanel server at `vudrag.varazdin.studio`. The frontend is built **on the server** via `.cpanel.yml` — no local build step needed.

## Pre-Deploy Checks

// turbo
1. Check git status to see what files have changed:
   ```bash
   cd /Users/timonterzic/Documents/vudrag-site && git status
   ```

// turbo
2. Verify .env.production has the correct relative API path:
   ```bash
   cat /Users/timonterzic/Documents/vudrag-site/.env.production
   ```
   - Should contain: `VITE_API_BASE=/api`

## Commit and Push

3. Stage all changes and commit with a descriptive message:
   ```bash
   cd /Users/timonterzic/Documents/vudrag-site && git add -A && git commit -m "<describe what changed>"
   ```
   - Generate a meaningful commit message based on the changed files.

4. Push to GitHub to prepare for deployment:
   ```bash
   cd /Users/timonterzic/Documents/vudrag-site && git push origin main
   ```

## Deploy on cPanel

5. Tell the user to perform these steps in cPanel:
   - Go to **Git™ Version Control** → `vudrag-site` repo → **Pull or Deploy**
   - Click **"Update from Remote"**
   - Click **"Deploy HEAD Commit"** (this runs `npm ci && npm run build` on the server automatically)
   - Go to **Setup Node.js App** → click **Restart**

## Post-Deploy Verification

6. Wait 30 seconds for the app to restart, then verify:

7. **Check the frontend is loading:**
   - Use browser_subagent or read_url_content to test: `https://vudrag.varazdin.studio`
   - The page should load with content

8. **Check the CMS API is responding:**
   - Use read_url_content to test: `https://vudrag.varazdin.studio/api/config.json`
   - Should return JSON data

9. **Report deployment status to user:**
   - Summarize what was committed
   - Confirm the site and API are responding
   - Note any warnings or issues found

## Troubleshooting

If Deploy HEAD Commit fails with build errors:
- Check the deployment log in cPanel Git Version Control
- Common issue: Node.js virtual env not found — verify path in `.cpanel.yml`
- Fallback: run `npm run build` locally, temporarily remove `dist/` from `.gitignore`, commit and push

If the site shows "Cannot GET /":
- The Node.js app needs to be restarted in cPanel
- Check that server.js was deployed correctly

If API returns errors:
- Check cPanel → Setup Node.js App → stderr logs
- Verify environment variables are set (JWT_SECRET, ADMIN_PASSWORD, CORS_ORIGIN)

## Reference URLs

| What | URL |
|------|-----|
| **Live Site** | https://vudrag.varazdin.studio |
| **Admin Panel** | https://vudrag.varazdin.studio/cms-admin |
| **API** | https://vudrag.varazdin.studio/api |
| **cPanel** | https://cpanel.varazdin.studio |
| **GitHub** | https://github.com/timon2200/vudrag-site.git |
