---
description: Commit, push, and verify deployment works correctly
---

# Deploy Workflow

This workflow commits local changes, pushes to GitHub, and verifies both Render (CMS) and Vercel (Frontend) deployments are working.

## Pre-Deploy Checks

// turbo
1. Check git status to see what files have changed:
   ```bash
   cd /Users/test/Documents/vudrag-site-2 && git status
   ```

// turbo
2. Run the production build locally to catch any build errors:
   ```bash
   cd /Users/test/Documents/vudrag-site-2 && npm run build
   ```
   - If build fails, stop and fix the errors before continuing.

// turbo
3. Verify .env.production has the correct Render API URL:
   ```bash
   cat /Users/test/Documents/vudrag-site-2/.env.production
   ```
   - Should contain: `VITE_API_BASE=https://vudrag-cms.onrender.com/api`

## Commit and Push

4. Stage all changes and commit with a descriptive message:
   ```bash
   cd /Users/test/Documents/vudrag-site-2 && git add . && git commit -m "<describe what changed>"
   ```
   - Generate a meaningful commit message based on the changed files.

5. Push to GitHub to trigger auto-deploys:
   ```bash
   cd /Users/test/Documents/vudrag-site-2 && git push origin main
   ```

## Post-Deploy Verification

6. Wait 60-90 seconds for deployments to complete, then verify:

7. **Check Render CMS API is responding:**
   - Use browser_subagent or read_url_content to test: `https://vudrag-cms.onrender.com/api/sculptures`
   - Should return JSON array of sculptures
   - If error or empty, check Render dashboard logs for issues

8. **Check Vercel Frontend is loading:**
   - Use browser_subagent to visit: `https://vudrag-site.vercel.app`
   - Verify the page loads without errors
   - Check browser console for any API connection errors

9. **Report deployment status to user:**
   - Summarize what was committed
   - Confirm both services are responding
   - Note any warnings or issues found

## Troubleshooting

If Render API fails:
- Check logs at: https://dashboard.render.com/web/srv-d5vmoq56ubrc73clvig0/logs
- Verify environment variables are set correctly
- Check if the service is still building

If Vercel fails:
- Check build logs in Vercel dashboard
- Verify the build completed successfully
- Check for any import/export errors in the build output
