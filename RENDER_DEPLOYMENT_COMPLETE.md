# 🚀 Harvesta Render Deployment - Complete Setup Guide

## Project Status: ✅ READY FOR RENDER DEPLOYMENT

Your Harvesta project is fully configured for production deployment on Render's free tier.

---

## Folder Structure

```
harvesta_dev/                          ← Root directory (what you push to GitHub)
├── src/                               ← React source code
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   ├── App.tsx
│   └── main.tsx
├── public/                            ← Static assets
│   ├── robots.txt
│   └── ...
├── dist/                              ← Built React app (created by npm run build)
│   ├── index.html                     ← Main app HTML (served by server.js)
│   ├── assets/                        ← JS, CSS, images
│   └── ...
├── server.js                          ← Express server (serves dist + SPA routing)
├── package.json                       ← Dependencies and scripts
├── vite.config.ts                     ← Build configuration
├── tsconfig.json                      ← TypeScript config
├── .env.production                    ← Production env variables (reference only)
├── .env.local                         ← Local dev env variables
├── render.yaml                        ← Render deployment configuration
└── vercel.json                        ← (Optional) Vercel config
```

### Key Points

- **Everything is in the root directory** (single repo, not separate backend/frontend folders)
- **server.js** runs on Render and serves the React app
- **dist folder** contains the built React app (created during build, not committed)
- **package.json** has BOTH frontend dependencies AND express

---

## Configuration Files (All Set ✅)

### 1. `package.json` - Dependencies & Scripts

```json
{
  "name": "harvesta",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "start": "node server.js",
    "render-build": "npm ci && npm run build"
  },
  "dependencies": {
    "express": "^4.18.2",
    "react": "^18.3.1",
    ...
  },
  "devDependencies": {
    "vite": "^7.3.1",
    "terser": "^5.46.0",
    "@vitejs/plugin-react-swc": "^3.11.0",
    ...
  }
}
```

**Status:** ✅ Express is installed
**Status:** ✅ type: "module" is set for ES modules
**Status:** ✅ build script: `vite build`
**Status:** ✅ start script: `node server.js`

---

### 2. `server.js` - Express Backend

```javascript
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000; // ← Render sets process.env.PORT

// Find dist folder (multiple locations for flexibility)
const possiblePaths = [
  join(__dirname, "dist"),
  "/opt/render/project/dist",
  process.cwd() + "/dist",
];

let distPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    distPath = p;
    console.log(`✅ Found dist folder at: ${distPath}`);
    break;
  }
}

if (!distPath) {
  console.error("❌ CRITICAL ERROR: dist folder not found!");
  process.exit(1);
}

// Serve static files from dist
app.use(express.static(distPath, { maxAge: "1d" }));
app.use(express.json());

// Health check endpoint (Render monitoring)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// SPA fallback: all routes → index.html (React Router handles routing)
app.get("*", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.sendFile(join(distPath, "index.html"));
});

// Start server
const server = app.listen(port, () => {
  console.log(`✅ Harvestá server running on port ${port}`);
  console.log(`📁 Serving static files from: ${distPath}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => process.exit(0));
});
```

**Status:** ✅ Uses `process.env.PORT` for Render
**Status:** ✅ Serves React app from dist/
**Status:** ✅ Handles all routes with SPA fallback
**Status:** ✅ Has health check endpoint
**Status:** ✅ ES modules compatible

---

### 3. `vite.config.ts` - Build Configuration

```typescript
export default defineConfig({
  build: {
    outDir: "dist", // ← Output to dist folder
    sourcemap: false,
    minify: "terser", // ← Minimize JS
    chunkSizeWarningLimit: 1000,
  },
});
```

**Status:** ✅ Outputs to `dist` directory
**Status:** ✅ Minifies with terser
**Status:** ✅ No sourcemaps (faster build)

---

### 4. `render.yaml` - Render Deployment Config

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
    healthCheckPath: /api/health
```

**Status:** ✅ Correct build command: installs deps and builds React app
**Status:** ✅ Correct start command: runs server.js
**Status:** ✅ NODE_ENV set in render.yaml (not in .env.production)
**Status:** ✅ Environment variables configured
**Status:** ✅ Health check enabled

---

### 5. `.env.production` - Production Environment

```dotenv
# NOTE: NODE_ENV should NOT be set here
# It's configured in render.yaml

VITE_SUPABASE_URL=your_actual_url_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_actual_key_here
```

**Status:** ✅ NODE_ENV removed (configured in render.yaml)
**Status:** ✅ Supabase keys placeholders (set in Render dashboard)

---

## Build & Deployment Process

### Local Testing (Before Deploying)

```powershell
# 1. Build React app
npm run build

# Expected output:
# ✓ 3323 modules transformed
# dist/index.html
# dist/assets/index-XXXXX.js (2.2 MB)
# ✓ built in 1m 41s
```

```powershell
# 2. Verify dist folder was created
Test-Path "dist/index.html"  # Should return True
```

```powershell
# 3. Start server
npm start

# Expected output:
# ✅ Found dist folder at: .../dist
# 📁 dist folder contents: index.html, assets, ...
# ✅ Harvestá server running on port 3000
# 📁 Serving static files from: .../dist
```

```powershell
# 4. Test health endpoint
Invoke-WebRequest http://localhost:3000/api/health

# Should return:
# {"status":"ok","timestamp":"2026-01-17T..."}
```

```powershell
# 5. Test app routes
Invoke-WebRequest http://localhost:3000/some/random/path

# Should return index.html (React Router handles routing)
```

---

### Render Deployment Process

#### Step 1: Commit and Push to GitHub

```powershell
cd c:\Users\HOME\Desktop\html\harvesta_dev

# Add all files
git add .

# Commit
git commit -m "Production deployment: configure Express server, Render settings"

# Push to GitHub
git push origin main
```

#### Step 2: Create/Connect Render Service

1. Go to **https://dashboard.render.com**
2. Click **"New +"** → **"Web Service"**
3. Select your **harvesta** repository from GitHub
4. Configure:
   - **Name:** `harvesta`
   - **Environment:** `Node`
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `node server.js`
   - **Plan:** Free tier is fine

#### Step 3: Set Environment Variables

In Render dashboard → Your Service → **Environment**:

```
NODE_ENV = production
VITE_SUPABASE_URL = your_actual_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY = your_actual_key
```

#### Step 4: Deploy

Click **"Deploy"** button. Render will:

1. Pull code from GitHub
2. Run `npm ci && npm run build` (installs deps, builds React)
3. Run `node server.js` (starts your server)
4. Serve your app on `https://harvesta-XXXX.onrender.com`

---

## Expected Render Build Logs

When Render deploys, you should see:

```
=== Build ===
$ npm ci && npm run build

added 318 packages in 45s

> harvesta@0.0.0 build
> vite build

vite v7.3.1 building client environment for production...
✓ 3323 modules transformed
dist/index.html      1.39 kB
dist/assets/...      2.3 MB
✓ built in 1m 41s

=== Start ===
$ node server.js

✅ Found dist folder at: /opt/render/project/dist
📁 dist folder contents: index.html, assets, ...
✅ Harvestá server running on port [PORT]
📁 Serving static files from: /opt/render/project/dist

=== Health Check ===
GET /api/health → 200 OK
```

---

## Troubleshooting

### Problem: "dist folder not found"

**Cause:** Build failed but error wasn't obvious
**Solution:**

1. Check Render build logs for `npm run build` errors
2. Look for missing dependencies or TypeScript errors
3. Run locally: `npm run build` to see full error

### Problem: "Cannot find package 'express'"

**Cause:** express not in package.json
**Solution:** Already fixed! Express is in dependencies

### Problem: "Static files not serving"

**Cause:** dist folder not being created
**Solution:**

1. Verify `vite.config.ts` has `outDir: "dist"`
2. Verify `package.json` has `"build": "vite build"`
3. Check for TypeScript/build errors

### Problem: "React Router gives 404 on routes"

**Cause:** SPA fallback not working
**Solution:** Already fixed! server.js has:

```javascript
app.get("*", (req, res) => {
  res.sendFile(join(distPath, "index.html"));
});
```

---

## Files to Commit to GitHub

Before deploying, make sure these files are committed:

```
✅ server.js              - Express server
✅ package.json           - Dependencies (express included)
✅ package-lock.json      - Locked versions
✅ vite.config.ts         - Build config
✅ render.yaml            - Render deployment config
✅ tsconfig.json          - TypeScript config
✅ .env.production        - Production env reference
✅ .env.example           - Env example
✅ src/                   - React source code
✅ public/                - Static assets
```

**Do NOT commit:**

```
❌ dist/                  - Generated by build (Render will create)
❌ node_modules/          - Generated by npm install
❌ .env.local             - Local development only
```

---

## Quick Reference

| Item          | Value                           | Status         |
| ------------- | ------------------------------- | -------------- |
| Backend       | Express 4.18.2                  | ✅ Installed   |
| Frontend      | React 18.3.1 + Vite             | ✅ Configured  |
| Port          | process.env.PORT (3000 locally) | ✅ Correct     |
| Build Output  | dist/ directory                 | ✅ Configured  |
| SPA Routing   | Fallback to index.html          | ✅ Implemented |
| Health Check  | /api/health endpoint            | ✅ Available   |
| Render Config | render.yaml                     | ✅ Ready       |
| Environment   | Render.yaml + Dashboard         | ✅ Configured  |

---

## Success Criteria

Your deployment is successful when:

- ✅ Build completes without errors: `npm run build` succeeds
- ✅ dist folder created with index.html
- ✅ Server starts without errors: `npm start` works
- ✅ Health endpoint responds: `GET /api/health` returns JSON
- ✅ App loads: Visit your Render URL in browser
- ✅ Routes work: Click links, navigate around
- ✅ Supabase connects: Can login/create accounts

---

## Next Steps

1. **Verify everything locally:**

   ```powershell
   npm run build
   npm start
   # Visit http://localhost:3000
   ```

2. **Commit and push:**

   ```powershell
   git add .
   git commit -m "Production deployment configuration"
   git push origin main
   ```

3. **Deploy on Render:**
   - Go to https://dashboard.render.com
   - Set environment variables
   - Click Deploy

4. **Monitor Render logs:**
   - Check build logs for errors
   - Verify server starts successfully
   - Test your app at the provided URL

5. **Set up custom domain (optional):**
   - Add your domain in Render dashboard
   - Update DNS records
   - Wait for propagation

---

## Support Resources

- **Render Docs:** https://render.com/docs
- **Express Docs:** https://expressjs.com
- **Vite Docs:** https://vitejs.dev
- **SPA Deployment:** https://vitejs.dev/guide/ssr.html

---

## You Are Ready! 🎉

Your Harvesta project is configured correctly for production deployment on Render free tier.
All files are in place, all configurations are correct, and the build process is optimized.

**Next action: Run `npm run build` locally to do a final test, then push to GitHub and deploy on Render.**
