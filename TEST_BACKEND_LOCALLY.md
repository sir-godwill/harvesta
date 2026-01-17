# Test Script - Verify Backend Works Before Render Deployment

## Run This Locally First

### Copy & paste these commands to test everything:

```bash
# 1. Install dependencies
npm install

# 2. Build frontend
npm run build

# 3. Start server in background and wait
npm start &
sleep 3

# 4. Test main app (should return HTML)
echo "Testing app..."
curl -s http://localhost:3000/ | head -c 100
echo -e "\n"

# 5. Test health check (should return JSON)
echo "Testing health check..."
curl -s http://localhost:3000/api/health
echo -e "\n"

# 6. Test SPA routing (should return HTML, not 404)
echo "Testing SPA routing..."
curl -s http://localhost:3000/random/path | head -c 100
echo -e "\n"

# 7. Kill server
echo "Killing server..."
pkill -f "node server.js"

echo "✅ All tests complete!"
```

---

## What Each Test Does

### Test 1: Install

```bash
npm install
```

✅ Installs all dependencies including Express

### Test 2: Build

```bash
npm run build
```

✅ Creates `dist/` folder with built app

### Test 3: Start Server

```bash
npm start
```

✅ Server runs on port 3000

### Test 4: Health Check

```bash
curl http://localhost:3000/api/health
```

✅ Expected response:

```json
{ "status": "ok", "timestamp": "2026-01-17T..." }
```

### Test 5: Main App

```bash
curl http://localhost:3000/
```

✅ Expected: HTML starting with `<!DOCTYPE html>`

### Test 6: SPA Routing

```bash
curl http://localhost:3000/any/random/path
```

✅ Expected: Same HTML as main app (proves SPA routing works)

---

## Manual Testing (Alternative)

Open separate terminals:

### Terminal 1: Start server

```bash
npm start
```

Expected output:

```
✅ Harvestá server running on port 3000
📍 Environment: development
📁 Serving static files from: /path/to/dist
```

### Terminal 2: Test endpoints

```bash
# Test 1: Main app
curl http://localhost:3000/

# Test 2: Health check
curl http://localhost:3000/api/health

# Test 3: SPA routing
curl http://localhost:3000/orders
curl http://localhost:3000/products/123
curl http://localhost:3000/admin/dashboard

# All should return the app (SPA handles routing)
```

### Terminal 3: Check browser

Visit: http://localhost:3000

- [ ] App loads with styling
- [ ] Logo appears
- [ ] No console errors (F12)
- [ ] Navigation works
- [ ] Refresh doesn't cause 404

---

## PowerShell Test Script (Windows)

If the bash script above doesn't work, use this PowerShell version:

```powershell
# 1. Install
Write-Host "📦 Installing dependencies..." -ForegroundColor Green
npm install

# 2. Build
Write-Host "🔨 Building frontend..." -ForegroundColor Green
npm run build

# 3. Start in background
Write-Host "🚀 Starting server..." -ForegroundColor Green
$process = Start-Process node -ArgumentList "server.js" -PassThru
Start-Sleep -Seconds 3

# 4. Test health check
Write-Host "🏥 Testing health check..." -ForegroundColor Cyan
$healthCheck = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -ErrorAction SilentlyContinue
if ($healthCheck) {
    Write-Host "✅ Health check passed:" -ForegroundColor Green
    Write-Host $healthCheck.Content
} else {
    Write-Host "❌ Health check failed" -ForegroundColor Red
}

# 5. Test main app
Write-Host "`n🌐 Testing main app..." -ForegroundColor Cyan
$app = Invoke-WebRequest -Uri "http://localhost:3000/" -ErrorAction SilentlyContinue
if ($app -and $app.StatusCode -eq 200) {
    Write-Host "✅ App loads successfully" -ForegroundColor Green
} else {
    Write-Host "❌ App failed to load" -ForegroundColor Red
}

# 6. Kill server
Write-Host "`n💤 Stopping server..." -ForegroundColor Yellow
Stop-Process -Id $process.Id

Write-Host "`n✅ Test complete!" -ForegroundColor Green
```

---

## Expected Results

### ✅ Success

All tests pass:

- npm install completes without errors
- npm run build creates dist/ folder
- Server starts and shows: `✅ Harvestá server running on port 3000`
- Health check returns JSON with `"status":"ok"`
- Main app returns HTML (starts with `<!DOCTYPE`)
- SPA routing works (any path returns app)

### ❌ Failures to Fix

**Error: Cannot find package 'express'**

```
Run: npm install
```

**Error: Cannot find dist/index.html**

```
Run: npm run build
```

**Error: EADDRINUSE (port already in use)**

```
Run: PORT=5000 npm start
# Or kill process on 3000: lsof -ti:3000 | xargs kill -9
```

**Error: Server doesn't respond to requests**

```
Check server.js exists and has no syntax errors
Try: node -c server.js  (syntax check)
```

---

## CI/CD Test (Simulate Render)

This simulates exactly what Render will do:

```bash
# 1. Clean install (what Render does)
rm -rf node_modules package-lock.json
npm ci  # Clean install, not npm install

# 2. Build (Render buildCommand)
npm run build

# 3. Start (Render startCommand)
node server.js
```

If this works locally, it will work on Render.

---

## Before Committing

Ensure these files exist:

- [ ] `server.js` - exists and no syntax errors
- [ ] `package.json` - has `"express": "^4.18.2"`
- [ ] `dist/` - created by npm run build
- [ ] `dist/index.html` - main app HTML

---

## Ready for Render?

If all tests pass:

```bash
# 1. Commit changes
git add .
git commit -m "Fix Express backend - ready for Render"

# 2. Push
git push origin main

# 3. Deploy on Render
# - New Web Service
# - Build: npm ci && npm run build
# - Start: node server.js
# - Add env vars
# - Deploy!
```

---

## Troubleshooting During Tests

| Issue                 | Solution                                    |
| --------------------- | ------------------------------------------- |
| `ECONNREFUSED`        | Server not running - check Terminal 1       |
| `HTML response empty` | Build failed - check dist/index.html exists |
| `Port 3000 in use`    | Kill process or use different port          |
| `No dist folder`      | Run `npm run build` first                   |
| `Express not found`   | Run `npm install` first                     |

---

## Success Message

When everything works, you'll see:

```
✅ Harvestá server running on port 3000
📍 Environment: development
📁 Serving static files from: /path/to/dist

[Requests coming in]
GET / 200
GET /api/health 200
GET /any/path 200
```

Then you're ready for Render deployment! 🚀
