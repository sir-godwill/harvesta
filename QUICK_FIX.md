# Quick Fix - Test These Commands Now

## The Issue

```
❌ Error: dist folder not found at /opt/render/project/src/dist
```

## The Fix

Your `server.js` has been improved with better error detection. Now test locally:

---

## Run These Commands in PowerShell

### 1. Clean Install & Build

```powershell
# Remove old builds
Remove-Item -Path "node_modules", "dist", "package-lock.json" -Recurse -Force -ErrorAction SilentlyContinue

# Clean install (simulates what Render does)
npm ci

# Build
npm run build
```

**Expected output:**

```
vite v7.3.1 building for production...
✓ XXX modules transformed.
dist/index.html                 XX.XX kB │ gzip: XX.XX kB
dist/assets/index-xxx.js   XXXXX.XX kB │ gzip: XXXXX.XX kB
✓ built in XXs
```

### 2. Check dist Folder Was Created

```powershell
# List dist contents
Get-ChildItem -Path "dist" | Format-Table Name, Length

# Verify index.html exists
Test-Path "dist/index.html"  # Should return: True
```

**Expected output:**

```
True

    Directory: C:\...\harvesta_dev\dist

Mode                 LastWriteTime         Length Name
----                 -----------         ------ ----
-a----         1/17/2026   10:30 AM       XXXXX index.html
d-----         1/17/2026   10:30 AM             assets
```

### 3. Test Server

```powershell
# Start server
npm start
```

**Expected output:**

```
✅ Found dist folder at: C:\...\harvesta_dev\dist
📁 dist folder contents: index.html, assets
✅ index.html found
✅ Harvestá server running on port 3000
📍 Environment: development
📁 Serving static files from: C:\...\harvesta_dev\dist
```

### 4. Test in Another Terminal

```powershell
# In a new PowerShell window, test:

# Test health endpoint
Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing

# Test main app
Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing | Select-Object StatusCode
```

**Expected output:**

```
StatusCode        : 200
StatusDescription : OK
...

{"status":"ok","timestamp":"2026-01-17T..."}
```

### 5. Stop Server

```powershell
# Press Ctrl+C in the terminal running npm start
```

---

## If Any Step Fails

### If `npm ci` fails

```powershell
# Try with npm install instead
npm install

# Then try build again
npm run build
```

### If `npm run build` fails

Check for TypeScript errors:

```powershell
# Look at the error messages carefully
# Common issues:
# - Import errors (@/... paths)
# - Type errors (red underlines)
# - Missing packages
```

**Fix:**

```powershell
# Fix errors shown in build output
# Then rebuild
npm run build
```

### If dist folder is empty

```powershell
# Check if build actually ran
Get-ChildItem dist/ | Measure-Object

# If empty, build failed. Check error output from: npm run build
```

### If server won't start

```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000

# If in use, try different port
$env:PORT=5000; npm start
```

---

## Success Checklist ✅

- [ ] `npm ci` completes without errors
- [ ] `npm run build` shows "built in XXs"
- [ ] `dist/` folder exists and has files
- [ ] `dist/index.html` exists
- [ ] `npm start` shows "✅ Harvestá server running"
- [ ] Health check returns JSON
- [ ] Main app loads at http://localhost:3000

**All pass?** ✅ Ready to commit and push to GitHub!

---

## Next Steps

Once all tests pass:

```powershell
# 1. Stop server (Ctrl+C)

# 2. Commit changes
git add server.js
git commit -m "Improve dist folder detection and build debugging"

# 3. Push to GitHub
git push origin main

# 4. Redeploy on Render
# Go to https://dashboard.render.com
# Click "..." → "Redeploy latest commit"
# Wait for build to complete
# Check logs - should now show:
#   ✅ Found dist folder at: ...
#   ✅ Harvestá server running on port ...
```

---

## Still Stuck?

Run this diagnostic:

```powershell
# PowerShell diagnostic script
Write-Host "=== DIAGNOSTIC ===" -ForegroundColor Green

# Check files exist
Write-Host "`n1. Checking files..."
Test-Path "package.json" | Write-Host "✓ package.json exists"
Test-Path "server.js" | Write-Host "✓ server.js exists"
Test-Path "vite.config.ts" | Write-Host "✓ vite.config.ts exists"

# Try build
Write-Host "`n2. Building..."
npm run build 2>&1 | Select-Object -Last 5

# Check output
Write-Host "`n3. Checking dist..."
if (Test-Path "dist/index.html") {
  Write-Host "✅ dist/index.html exists" -ForegroundColor Green
} else {
  Write-Host "❌ dist/index.html NOT FOUND" -ForegroundColor Red
}

# Check server
Write-Host "`n4. Testing server (5 second timeout)..."
$job = Start-Job -ScriptBlock { npm start }
Start-Sleep -Seconds 5
Stop-Job -Job $job
Write-Host "✓ Server started successfully" -ForegroundColor Green
```

Output this info if you need help!

---

## TL;DR

```powershell
# Just run these 3 commands
rm -r dist, node_modules, package-lock.json
npm ci && npm run build
npm start

# Open browser: http://localhost:3000
# Should load your Harvestá app!
```

Good luck! 🚀
