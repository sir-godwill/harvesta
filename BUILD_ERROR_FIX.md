# Render Build Error - dist Folder Not Found - SOLUTION

## Error Message You Received

```
❌ Error: dist folder not found at /opt/render/project/src/dist
Running 'node server.js'
```

## Root Cause Analysis

The error shows the path is `/opt/render/project/src/dist` - notice the `/src/` in the middle. This means:

- ❌ Build either failed silently
- ❌ Or dist was created in the wrong location
- ❌ Or build command didn't run at all

## What Was Fixed

### ✅ Enhanced server.js

- Now searches multiple possible dist locations
- Provides detailed debugging output
- Lists contents of found dist folder
- Checks for index.html existence
- Better error messages to diagnose build issues

---

## How to Diagnose & Fix

### Step 1: Test Locally (Must Do This First!)

```bash
# Clean test - simulate what Render does
rm -rf node_modules dist
npm ci
npm run build

# Check if dist was created
ls dist/

# Check if index.html exists
ls dist/index.html

# Test server
npm start
```

**Expected output:**

```
✅ Found dist folder at: C:\...\harvesta_dev\dist
📁 dist folder contents: index.html, assets, ...
✅ index.html found
✅ Harvestá server running on port 3000
```

If you see errors here, **DO NOT PUSH TO RENDER**. Fix locally first.

---

### Step 2: Check Your Build Log on Render

1. Go to https://dashboard.render.com
2. Click your **harvesta** service
3. Go to **Logs** tab
4. Look for the build phase output

**Look for errors like:**

- `ERROR in ...` (TypeScript/Vite errors)
- `Cannot find module ...` (Missing dependency)
- `ENOSPC: no space left` (Render disk space)

### Step 3: Common Build Errors & Fixes

#### Error: "Cannot find module"

```
Error: Cannot find module '@/...'
```

**Solution:**

```bash
# Reinstall dependencies
npm install

# Push to GitHub
git add . && git commit -m "Fix dependencies" && git push
```

#### Error: "TypeScript errors"

```
error TS2...
```

**Solution:**

1. Run locally: `npm run build`
2. Fix TypeScript errors
3. Commit and push

#### Error: "Out of memory"

```
JavaScript heap out of memory
```

**Solution:**

1. In Render dashboard, upgrade to paid plan (more memory)
2. Or reduce bundle size by removing unused packages

---

## New Improved server.js Features

### 🔍 Better Debugging

Now when server starts, you'll see:

```
✅ Found dist folder at: /opt/render/project/dist
📁 dist folder contents: index.html, assets, chunks, ...
✅ index.html found
✅ Harvestá server running on port 3000
```

### 🚨 Better Error Messages

If dist is missing, you'll see:

```
❌ CRITICAL ERROR: dist folder not found!

Looked in these locations:
  ❌ NOT FOUND: /opt/render/project/dist
  ❌ NOT FOUND: /opt/render/project/../dist
  ❌ NOT FOUND: /opt/render/project/src/dist
  ✅ EXISTS: /opt/render/project/.render/dist

SOLUTIONS:
1. Run "npm run build" locally to test
2. Check Render build logs for npm run build errors
3. Verify package.json has correct build script
4. Check vite.config.ts has outDir: "dist"
```

---

## Step-by-Step Fix

### 1. Test Locally

```bash
npm run build
npm start
# Must work locally!
```

### 2. Check Build Output

Verify you see:

```
vite v7.3.1 building for production...
...
✓ 1234 modules transformed
...
dist/index.html    XX.XX kB │ gzip: XX.XX kB
dist/assets/main-xxx.js   XXX.XX kB │ gzip: XXX.XX kB
```

### 3. Commit & Push

```bash
git add package.json server.js
git commit -m "Fix dist folder detection and add build debugging"
git push origin main
```

### 4. Redeploy on Render

1. Go to https://dashboard.render.com
2. Click your service
3. Click "..." menu → "Redeploy latest commit"
4. Monitor logs carefully

### 5. Check Build Logs

Watch the "Build" section of logs for:

- ✅ `npm ci` completes
- ✅ `npm run build` shows success message
- ✅ No red ERROR messages

### 6. Check Start Logs

Watch the "Start" section for:

- ✅ `✅ Found dist folder at: ...`
- ✅ `✅ Harvestá server running on port ...`

---

## Verification Commands

### Check dist folder locally

```bash
# PowerShell
ls -Force dist/ | head -20

# Or check specific files
Test-Path "dist/index.html"  # Should return True
```

### Check if build is working

```bash
# Clean and rebuild
rm -r dist, node_modules, package-lock.json
npm ci
npm run build

# Verify output
Get-ChildItem dist/ | Measure-Object  # Should show multiple items
```

### Test the fixed server.js locally

```bash
npm start

# In another terminal, test
curl http://localhost:3000/api/health
curl http://localhost:3000/
```

---

## Why dist Folder Is Missing on Render

Possible causes:

1. **Build failed silently**
   - Check Render build logs
   - Look for npm/TypeScript errors

2. **Build command is wrong**
   - Verify: `npm ci && npm run build` in render.yaml
   - Verify: `npm run build` works locally

3. **package.json build script is wrong**
   - Should be: `"build": "vite build"`
   - Check your package.json scripts

4. **vite.config.ts output directory is wrong**
   - Should have: `outDir: "dist"`
   - Check your vite.config.ts

5. **Node modules not installed**
   - `npm ci` must complete successfully
   - Check for installation errors in logs

---

## Checking Render Build Logs

### How to Find Build Logs

1. **Dashboard** → Select service → **Logs** tab
2. Look for build phase (usually first section)

### What to Look For

✅ **Good signs:**

```
Running 'npm ci'
...
added XX packages in XXs

Running 'npm run build'
...
vite v7.3.1 building for production...
✓ XXX modules transformed
dist/index.html   XX.XX kB
```

❌ **Bad signs:**

```
npm ERR!
error TS...
Cannot find module
heap out of memory
```

---

## If Still Stuck

### Option 1: Full Clean Deploy

```bash
# 1. Locally
rm -r dist node_modules package-lock.json
npm install
npm run build
npm start
# ^ Must work!

# 2. Push
git add .
git commit -m "Clean rebuild"
git push

# 3. On Render
# Redeploy latest commit
```

### Option 2: Debug with Render Shell

If you have Render Pro/Team plan, use Shell to debug:

```bash
cd /opt/render/project
ls -la  # Check what's there
npm run build  # Try building manually
ls -la dist/  # Check if dist created
```

### Option 3: Contact Render Support

- With your service ID
- Link to your GitHub repo
- Current error message
- Render will help investigate

---

## Prevention: Pre-Deployment Checklist

Before pushing to Render:

- [ ] `npm install` completes successfully
- [ ] `npm run build` creates a `dist/` folder
- [ ] `dist/index.html` exists
- [ ] `npm start` runs without errors
- [ ] `http://localhost:3000` loads in browser
- [ ] `http://localhost:3000/api/health` returns JSON

✅ **All pass?** → Safe to deploy

❌ **Any fail?** → Fix locally first, don't push

---

## Summary

**What changed:**

- ✅ server.js now has better error detection
- ✅ Multiple dist path support
- ✅ Detailed debugging output
- ✅ Better error messages

**What to do:**

1. Test locally: `npm run build && npm start`
2. Commit and push
3. Redeploy on Render
4. Check logs carefully
5. If still stuck, use diagnostic commands above

**Expected result:**

```
✅ Harvestá server running on port 3000
📁 Serving static files from: /opt/render/project/dist
```

---

**Questions?** Check Render logs first - they'll tell you what went wrong during build!
