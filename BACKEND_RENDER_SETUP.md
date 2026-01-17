# Render Backend Deployment Guide

## Problem & Solution

### Error Encountered

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'express' imported from server.js
```

### Root Causes & Fixes Applied

1. ✅ **Express not in dependencies** - Added `express: ^4.18.2` to package.json
2. ✅ **ES Modules configured** - Project already has `"type": "module"` for ES imports
3. ✅ **No PORT listener** - server.js now listens on `process.env.PORT` (set by Render)
4. ✅ **Missing health checks** - Added `/api/health` endpoint for monitoring
5. ✅ **No error handling** - Added error middleware for production safety

---

## What Was Fixed

### 1. package.json

- ✅ Added `express: ^4.18.2` to dependencies
- ✅ Kept `"type": "module"` for ES module support
- ✅ Start script: `"start": "node server.js"`
- ✅ Build script: `"render-build": "npm ci && npm run build"`

### 2. server.js Improvements

- ✅ Robust error handling with proper HTTP status codes
- ✅ Graceful shutdown on SIGTERM (Render signal)
- ✅ Health check endpoint at `/api/health`
- ✅ Better logging for debugging
- ✅ Proper Content-Type headers for SPA routing
- ✅ Validation that dist folder exists before starting

### 3. Render Configuration

- ✅ `render.yaml` configured with correct build & start commands
- ✅ Environment variables set for Supabase

---

## Render Deployment Steps

### Step 1: Install Dependencies Locally

```bash
npm install
```

This installs Express and all other dependencies listed in package.json.

### Step 2: Build the Project Locally (Test)

```bash
npm run build
```

Verify the `dist/` folder is created with all built files.

### Step 3: Test Server Locally

```bash
npm start
```

Visit: http://localhost:3000

You should see:

- ✅ Your Harvestá app loads
- ✅ Console shows: `✅ Harvestá server running on port 3000`
- ✅ Health check works: http://localhost:3000/api/health

### Step 4: Push to GitHub

```bash
git add .
git commit -m "Add Express backend and fix Render deployment"
git push origin main
```

### Step 5: Deploy on Render

#### Option A: Automatic Deployment (Recommended)

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Fill in:
   - **Name:** `harvesta`
   - **Runtime:** Node
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `node server.js`
5. Add Environment Variables:
   ```
   VITE_SUPABASE_URL=<your_url>
   VITE_SUPABASE_PUBLISHABLE_KEY=<your_key>
   NODE_ENV=production
   ```
6. Click **"Deploy"**

#### Option B: Manual Render Configuration

Create/update `render.yaml` in root:

```yaml
services:
  - type: web
    name: harvesta
    runtime: node
    buildCommand: npm ci && npm run build
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: VITE_SUPABASE_URL
        sync: false
      - key: VITE_SUPABASE_PUBLISHABLE_KEY
        sync: false
```

---

## Render Start Command Explained

**`node server.js`** is the correct start command because:

1. ✅ It's a direct Node.js command (no PM2, no nodemon)
2. ✅ Works on Render free tier
3. ✅ Listens on `process.env.PORT` automatically set by Render
4. ✅ Gracefully handles Render signals (SIGTERM)
5. ✅ No additional dependencies needed

---

## Project Structure

```
harvesta/
├── src/                    # React frontend code
├── dist/                   # Built frontend (created by npm run build)
├── public/                 # Static assets
├── server.js              # Production server (uses Express)
├── package.json           # Dependencies including express
├── vite.config.ts         # Build configuration
├── render.yaml            # Render deployment config
└── RENDER_DEPLOYMENT.md   # This file
```

### Why This Works on Render Free Tier

- **Single server process** - No clustering or PM2 needed
- **Stateless** - Can restart without losing data (data in Supabase)
- **Lightweight** - Express serves ~10MB built files efficiently
- **Auto-scaling ready** - Render handles load balancing

---

## Verification After Deployment

Once deployed, test these endpoints:

### 1. Main App

```
https://harvesta.onrender.com/
```

You should see your Harvestá interface loaded.

### 2. Health Check

```
https://harvesta.onrender.com/api/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2026-01-17T10:30:45.123Z"
}
```

### 3. SPA Routing Test

```
https://harvesta.onrender.com/any/random/path
```

Should still load your app (React Router handles it).

---

## Environment Variables Needed on Render

| Variable                        | Source   | Where to Get                                        |
| ------------------------------- | -------- | --------------------------------------------------- |
| `VITE_SUPABASE_URL`             | Supabase | supabase.com → Project Settings → API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase | supabase.com → Project Settings → API → Anon public |
| `NODE_ENV`                      | Fixed    | Set to `production` in Render                       |

---

## Troubleshooting

### Build Fails: "Cannot find module"

```bash
# Local fix:
npm install

# Push to GitHub and redeploy on Render
```

### 404 Error

- Ensure `npm run build` creates `dist/index.html`
- Check Render logs: "Serving static files from: /opt/render/project/dist"

### Port Issues

- Render automatically sets `process.env.PORT`
- Don't hardcode port 3000 in production code
- server.js correctly uses: `process.env.PORT || 3000`

### "dist" folder not found

- Build must complete before starting
- render.yaml buildCommand must finish successfully
- Check Render deployment logs

---

## Performance Tips

1. **Caching** - Static files cached for 1 day
2. **SPA Routing** - Only index.html served for non-file routes
3. **Health Checks** - Enable Render monitoring for auto-restart
4. **Logs** - Check Render dashboard for any errors

---

## Common Questions

**Q: Do I need PM2?**
A: No. Render manages the process directly. Use `node server.js`.

**Q: Can I add API routes?**
A: Yes. Add routes to server.js before the SPA fallback (`app.get('*', ...)`).

**Q: What if port 3000 is in use locally?**
A: Set environment variable: `PORT=5000 npm start`

**Q: How do I update the app?**
A: Push to GitHub → Render auto-redeploys. No manual steps needed.

---

## Need Help?

- **Render Status:** https://render.com/status
- **Render Docs:** https://render.com/docs
- **Express Docs:** https://expressjs.com
- **Node.js ES Modules:** https://nodejs.org/en/docs/guides/ecmascript-modules/
