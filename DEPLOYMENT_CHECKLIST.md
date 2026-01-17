# 🚀 Render Deployment Checklist - Harvestá Backend

## Pre-Deployment (Local Testing)

### Install & Verify

- [ ] Run `npm install` successfully
- [ ] Run `npm run build` - creates `dist/` folder
- [ ] Run `npm start` - server runs on port 3000
- [ ] Visit http://localhost:3000 - app loads
- [ ] Visit http://localhost:3000/api/health - shows `{"status":"ok"}`

### Code Changes Complete

- [ ] `package.json` has `"express": "^4.18.2"`
- [ ] `package.json` has `"type": "module"`
- [ ] `package.json` has `"start": "node server.js"`
- [ ] `server.js` exists and runs without errors
- [ ] `render.yaml` has `startCommand: node server.js`
- [ ] `.env.production` has template variables

### Git Ready

- [ ] All changes committed: `git status` shows clean
- [ ] Pushed to GitHub: `git push origin main`
- [ ] Can see changes in GitHub web UI

---

## Render Setup

### Account & Repository

- [ ] Have Render account (https://render.com)
- [ ] Repository is public or private (with access)
- [ ] GitHub connected to Render

### Create Web Service

- [ ] Click "New +" in Render dashboard
- [ ] Select "Web Service"
- [ ] Connect GitHub repository
- [ ] Select `main` branch

### Configure Service

- [ ] **Name:** `harvesta` (or your preferred name)
- [ ] **Runtime:** Node
- [ ] **Build Command:** `npm ci && npm run build`
- [ ] **Start Command:** `node server.js`
- [ ] **Plan:** Free (or paid if preferred)

### Environment Variables (Critical!)

Add these in Render Environment tab:

- [ ] `VITE_SUPABASE_URL` = (from supabase.com → Settings → API → Project URL)
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` = (from supabase.com → Settings → API → Anon public)
- [ ] `NODE_ENV` = `production`

### Save & Deploy

- [ ] Click "Deploy" button
- [ ] Monitor build logs for errors
- [ ] Wait for "Your service is live" message

---

## Post-Deployment Verification

### Check Render Dashboard

- [ ] Service shows "Live" status (green)
- [ ] Build succeeded (no red errors)
- [ ] No restart loops in logs

### Test Live Application

#### 1. Main App

```bash
curl https://YOUR_SERVICE_NAME.onrender.com/
# Should return HTML (starts with <!DOCTYPE html>)
```

- [ ] Returns HTML, not error

#### 2. Health Check

```bash
curl https://YOUR_SERVICE_NAME.onrender.com/api/health
# Should return JSON with status: ok
```

- [ ] Returns: `{"status":"ok","timestamp":"..."}`

#### 3. SPA Routing

```bash
curl https://YOUR_SERVICE_NAME.onrender.com/random/path/test
# Should return same HTML as main app (SPA fallback)
```

- [ ] Returns HTML, not 404

#### 4. Visual Check

- [ ] Open in browser: https://YOUR_SERVICE_NAME.onrender.com
- [ ] App loads with correct styling
- [ ] Navigation works
- [ ] No console errors (check F12)

---

## Common Issues & Fixes

### Build Fails

```
Error: Cannot find module
```

**Fix:** Add missing package to package.json → Commit → Redeploy

### Start Fails

```
ENOENT: no such file or directory, open 'dist/index.html'
```

**Fix:** Verify build command runs successfully

- [ ] Build log shows "✅ built successfully"
- [ ] Local `npm run build` creates dist/

### App Shows 404

```
Cannot GET /api/health
```

**Fix:** Check server.js is correct

- [ ] `startCommand: node server.js` (NOT `npm run preview`)
- [ ] server.js has health check route

### Environment Variables Not Working

```
Error: VITE_SUPABASE_URL is undefined
```

**Fix:**

- [ ] Variables added in Render dashboard Environment tab
- [ ] Service redeployed after adding variables
- [ ] No typos in variable names

---

## Important: Never Do This on Render

❌ Don't use PM2, nodemon, or process managers  
❌ Don't hardcode port numbers (use `process.env.PORT`)  
❌ Don't use local file storage (use Supabase)  
❌ Don't commit `.env` files  
❌ Don't run npm scripts as startCommand (use `node server.js`)

---

## Getting Service Information

### Your Live URL

- Found in Render dashboard under Service name
- Format: `https://harvesta-abc123.onrender.com`
- Takes 1-2 minutes to become live

### Render Logs

- Dashboard → Your Service → Logs tab
- Shows real-time build and runtime logs
- Check here for errors

### Supabase Credentials

- Go to https://app.supabase.com
- Select project
- Settings → API
- Copy: Project URL and Anon public key

---

## Optional: Custom Domain

After deployment works:

1. Go to Render dashboard → Your Service
2. Settings tab → Custom Domain
3. Add domain (e.g., harvestá.com)
4. Update DNS records per Render instructions
5. Wait 5-30 minutes for propagation

---

## Monitoring & Maintenance

### Enable Alerts

- [ ] Render dashboard → Notifications
- [ ] Set up email alerts for deployment failures
- [ ] Monitor uptime

### Logs Review (Weekly)

- [ ] Check error logs for issues
- [ ] Monitor startup logs for performance
- [ ] Review health check response times

### Performance

- [ ] Response time < 1 second typically
- [ ] Health check returns within 100ms
- [ ] No memory leaks (check restart frequency)

---

## Redeploy Procedures

### Full Redeploy (after code changes)

```
1. Make code changes locally
2. Test: npm run build && npm start
3. Commit & push: git push origin main
4. Render auto-deploys automatically ✅
```

### Manual Redeploy (troubleshooting)

```
1. Render dashboard → Your Service
2. Click "..." menu → "Redeploy latest commit"
3. Monitor logs during rebuild
```

### Rollback (if deployment breaks)

```
1. Render dashboard → Your Service
2. Deploys tab → Select previous working deployment
3. Click "Redeploy"
```

---

## Success Criteria

✅ All if these are true:

1. Service shows "Live" in Render dashboard
2. https://YOUR_URL/ loads your app
3. https://YOUR_URL/api/health returns JSON
4. SPA routes work (any path returns app)
5. No errors in Render logs
6. Supabase connection works (if tested)
7. Can refresh page without 404 errors

---

## Document References

- **Setup Guide:** See `BACKEND_RENDER_SETUP.md`
- **Quick Reference:** See `BACKEND_QUICK_REFERENCE.md`
- **Fix Summary:** See `FIX_SUMMARY.md`
- **Render Docs:** https://render.com/docs
- **Express Docs:** https://expressjs.com

---

## Support

**Render Status:** https://render.com/status  
**Render Support:** https://render.com/support  
**Supabase Status:** https://status.supabase.com

---

**Good luck with your deployment! 🚀**

Once you complete this checklist, your Harvestá backend will be production-ready on Render.
