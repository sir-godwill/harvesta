# 🔧 FIX: dist folder not found Error on Render

## What Happened

You got this error on Render:

```
❌ CRITICAL ERROR: dist folder not found!
```

## Root Cause

The error means the Render build probably failed, but the server still tried to start.
When server.js starts but can't find dist/, it exits with an error.

---

## What I Fixed

### 1. Enhanced server.js Path Detection ✅

Added better detection for Render's environment:

- Added `/opt/render/project/dist` (Render's actual build path)
- Added `/var/task/dist` (AWS Lambda compatibility)
- Added `/app/dist` (Docker/container compatibility)
- Added absolute path resolution
- Added directory validation
- Added index.html verification

### 2. Better Error Messages ✅

When dist is not found, server.js now:

- Shows **ALL checked paths**
- Indicates which ones exist/don't exist
- Shows if they're directories
- Shows if index.html exists in each
- Gives clear instructions on what to do

### 3. Improved Render YAML Configuration ✅

The render.yaml is already optimized, but here's what makes it work:

```yaml
buildCommand: npm ci && npm run build
# This must complete successfully
# If it fails, dist/ won't exist

startCommand: node server.js
# This starts your server
# Now with better error messages if build failed
```

---

## How to Fix This

### Step 1: Verify Build Works Locally

```powershell
npm run build
```

**Expected output:**

```
vite v7.3.1 building client environment for production...
✓ 3323 modules transformed
✓ built in 1m 48s
```

**NOT OK:**

```
error TS...
```

If you see errors, fix them before deploying.

### Step 2: Verify Server Starts

```powershell
npm start
```

**Expected output:**

```
✅ Found dist folder at: C:\...\dist
✅ Harvestá server running on port 3000
📁 Serving static files from: C:\...\dist
```

### Step 3: Commit with Updated server.js

```powershell
git add server.js
git commit -m "Improve dist folder detection for Render deployment"
git push origin main
```

### Step 4: Redeploy on Render

1. Go to https://dashboard.render.com
2. Select your **harvesta** service
3. Click "..." menu → "Redeploy latest commit"
4. **Watch the BUILD LOGS carefully**:
   - Look for: `npm ci && npm run build`
   - If you see errors, that's why dist wasn't found
   - Fix those errors and redeploy

### Step 5: Check Render Output

After redeployment, in Render logs you should see:

**Good output:**

```
✅ Found dist folder at: /opt/render/project/dist
📁 dist folder contents: assets, favicon.ico, index.html, ...
✅ index.html found
✅ Harvestá server running on port 3000
📁 Serving static files from: /opt/render/project/dist
```

**If still an error, you'll now see exactly why:**

```
❌ CRITICAL ERROR: dist folder not found!
✅ EXISTS (dir) (has index.html): /opt/render/project/dist  ← but this worked!
```

---

## Most Common Causes of "dist not found"

### 1. Build Failed (Most Common)

**Symptom:** Render logs show `npm run build` errors

**Fix:**

- Check the error message
- Fix locally: `npm run build`
- Commit and push
- Redeploy

### 2. TypeScript Errors

**Symptom:** `error TS2322: Type X is not assignable to type Y`

**Fix:**

- Run locally to see full error
- Fix the code
- Commit and push
- Redeploy

### 3. Missing Dependencies

**Symptom:** `Cannot find module 'express'` or similar

**Fix:**

- Already handled! express is in package.json
- Just commit and push
- Redeploy

### 4. Render Disk Space

**Symptom:** Build completes but seems slow

**Fix:**

- Render automatically handles this
- Just redeploy

---

## What Changed

**File: server.js**

- ✅ Enhanced path detection (more locations)
- ✅ Better validation (checks if directory exists and has index.html)
- ✅ Better error messages (shows exactly what was checked)
- ✅ Better instructions (tells you exactly what to do)

**Files: No other changes needed**

- ✅ render.yaml is correct
- ✅ package.json is correct
- ✅ vite.config.ts is correct

---

## Deploy Now

```powershell
# 1. Test locally
npm run build
npm start
# Should work perfectly

# 2. Commit
git add server.js
git commit -m "Fix: Improve dist folder detection for Render"
git push origin main

# 3. Redeploy on Render
# Go to dashboard and click "Redeploy latest commit"
```

---

## Expected Timeline

- Local test: 2-3 minutes
- Git commit: 30 seconds
- Render build: 1-3 minutes
- Server startup: <1 minute
- **Total to live: 5-10 minutes**

---

## Success Criteria

Your deployment is successful when:

- ✅ Render build logs show no errors
- ✅ Render logs show "✅ Harvestá server running on port 3000"
- ✅ Your app loads at https://harvesta-XXXX.onrender.com
- ✅ Navigation works (no 404s)
- ✅ Supabase authentication works

---

## Need More Help?

If you still see the error after this fix:

1. **Check Render BUILD LOGS** (not runtime logs)
   - Look for "npm run build" errors
   - Fix those errors first

2. **Verify locally**

   ```powershell
   npm run build
   npm start
   ```

   This should work perfectly before deploying

3. **Check render.yaml**
   - Build Command: `npm ci && npm run build`
   - Start Command: `node server.js`

4. **Check environment variables on Render dashboard**
   - NODE_ENV = production
   - VITE_SUPABASE_URL = [your key]
   - VITE_SUPABASE_PUBLISHABLE_KEY = [your key]

---

## Summary

**The Fix:**

- Better path detection in server.js
- Better error messages
- Handles Render's environment properly

**What to Do:**

- Test locally: `npm run build && npm start`
- Commit: `git push`
- Redeploy on Render
- Check logs carefully

**Expected Result:**

- Build succeeds
- Server finds dist/
- Your app is live! 🎉

---

Deploy now and let me know if you hit any other issues!
