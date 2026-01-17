# Quick Reference: Express Backend on Render

## What Was Wrong

- ❌ Express not in package.json dependencies
- ❌ No graceful shutdown handling
- ❌ Missing error handling
- ❌ No health check endpoint

## What Was Fixed

✅ Added `"express": "^4.18.2"` to dependencies  
✅ Improved server.js with error handling & logging  
✅ Added graceful shutdown (SIGTERM/SIGINT)  
✅ Added `/api/health` health check endpoint  
✅ Proper SPA routing with fallback to index.html

---

## Installation & Local Testing

```bash
# 1. Install dependencies
npm install

# 2. Build the frontend
npm run build

# 3. Run the server locally
npm start

# 4. Visit in browser
# http://localhost:3000
```

---

## Render Deployment

### Build Command (Render executes this)

```bash
npm ci && npm run build
```

### Start Command (Render executes this)

```bash
node server.js
```

### Environment Variables (Add in Render Dashboard)

```
VITE_SUPABASE_URL = https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbG...
NODE_ENV = production
```

---

## Key Changes

### package.json

```json
{
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "build": "vite build",
    "render-build": "npm ci && npm run build"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

### server.js Features

- ✅ Listens on `process.env.PORT` (Render sets this)
- ✅ Serves static files from `dist/`
- ✅ SPA routing fallback (React Router compatible)
- ✅ Health check at `/api/health`
- ✅ Graceful shutdown on SIGTERM
- ✅ Error handling middleware
- ✅ Better logging

---

## Verification After Deployment

```bash
# Check main app loads
curl https://harvesta.onrender.com/

# Check health endpoint
curl https://harvesta.onrender.com/api/health

# Check SPA routing
curl https://harvesta.onrender.com/any/path/here
# Should still return index.html
```

---

## Why It Works on Free Tier

- No PM2 or process managers needed
- Single Node process is free-tier compatible
- Render handles all process management
- Auto-restart on crash
- Graceful shutdown support built-in

---

## Common Commands

```bash
# Install + Build + Run locally
npm install && npm run build && npm start

# Just install
npm install

# Just build
npm run build

# Just start (requires dist/ folder)
npm start

# Check if dist/ exists
ls -la dist/
```

---

## File Summary

| File                      | Purpose                      |
| ------------------------- | ---------------------------- |
| `server.js`               | Production Express server    |
| `package.json`            | Dependencies + scripts       |
| `vite.config.ts`          | Frontend build config        |
| `render.yaml`             | Render deployment config     |
| `BACKEND_RENDER_SETUP.md` | Full setup guide (this file) |

---

## Troubleshooting

**Error: Cannot find package 'express'**
→ Run: `npm install`

**Error: dist folder not found**
→ Run: `npm run build`

**Port already in use locally**
→ Run: `PORT=5000 npm start`

**Deployment failed on Render**
→ Check Render logs for build/start errors
→ Verify environment variables are set

---

For detailed setup: See `BACKEND_RENDER_SETUP.md`
