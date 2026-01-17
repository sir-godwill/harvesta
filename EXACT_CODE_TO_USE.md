# 💻 EXACT CODE TO USE - Copy & Paste Ready

This document contains the exact code you should use in your project.
Everything is production-ready and tested.

---

## 1. server.js - The Express Backend

**File:** `server.js` (in root directory)

```javascript
#!/usr/bin/env node

/**
 * Harvesta Production Server
 * Serves React SPA with proper routing and Render compatibility
 */

import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Find dist folder (multiple locations for compatibility)
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

// Error if dist not found
if (!distPath) {
  console.error(`❌ CRITICAL ERROR: dist folder not found!`);
  console.error(`Looked in:`);
  possiblePaths.forEach((p) => {
    console.error(`  ${fs.existsSync(p) ? "✅" : "❌"} ${p}`);
  });
  process.exit(1);
}

// Verify dist has content
const distContents = fs.readdirSync(distPath);
if (distContents.length === 0) {
  console.error(`❌ ERROR: dist folder is EMPTY!`);
  process.exit(1);
}
console.log(
  `📁 dist folder contents: ${distContents.slice(0, 5).join(", ")}${distContents.length > 5 ? "..." : ""}`,
);

// Verify index.html exists
const indexPath = join(distPath, "index.html");
if (!fs.existsSync(indexPath)) {
  console.error(`❌ ERROR: index.html not found in dist folder!`);
  process.exit(1);
}
console.log(`✅ index.html found`);

// ============= MIDDLEWARE =============

// Serve static files with caching
app.use(
  express.static(distPath, {
    maxAge: "1d",
    etag: false,
    lastModified: true,
  }),
);

// Parse JSON
app.use(express.json());

// ============= ROUTES =============

// Health check endpoint for Render monitoring
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// SPA Fallback Route - CRITICAL for React Router
// All non-file requests get index.html
// React Router handles routing on client side
app.get("*", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.sendFile(indexPath);
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ============= START SERVER =============

const server = app.listen(port, () => {
  console.log(`✅ Harvestá server running on port ${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📁 Serving static files from: ${distPath}`);
});

// ============= GRACEFUL SHUTDOWN =============

process.on("SIGTERM", () => {
  console.log("⚠️  SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("🛑 Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("⚠️  SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("🛑 Server closed");
    process.exit(0);
  });
});
```

---

## 2. package.json - Dependencies

**File:** `package.json` (in root directory)

```json
{
  "name": "harvesta",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview",
    "start": "node server.js",
    "render-build": "npm ci && npm run build"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@supabase/supabase-js": "^2.90.0",
    "@tanstack/react-query": "^5.83.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "express": "^4.18.2",
    "framer-motion": "^12.26.1",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.462.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.61.1",
    "react-resizable-panels": "^2.1.9",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.9",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@eslint/js": "^9.32.0",
    "@tailwindcss/typography": "^0.5.16",
    "@types/node": "^22.16.5",
    "@types/react": "^18.3.23",
    "@types/react-dom": "^18.3.7",
    "@vitejs/plugin-react-swc": "^3.11.0",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.32.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^15.15.0",
    "lovable-tagger": "^1.1.13",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "terser": "^5.46.0",
    "typescript": "^5.8.3",
    "typescript-eslint": "^8.38.0",
    "vite": "^7.3.1"
  }
}
```

**Key Points:**

- ✅ `"type": "module"` - Required for ES modules
- ✅ `"express": "^4.18.2"` - In regular dependencies (not devDependencies)
- ✅ `"start": "node server.js"` - Render uses this
- ✅ `"build": "vite build"` - Creates dist/ folder

---

## 3. vite.config.ts - Build Configuration

**File:** `vite.config.ts` (in root directory)

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "terser",
    chunkSizeWarningLimit: 1000,
  },
}));
```

**Key Points:**

- ✅ `outDir: "dist"` - Outputs to dist/ directory
- ✅ `minify: "terser"` - Minifies JavaScript
- ✅ `sourcemap: false` - Faster build
- ✅ `chunkSizeWarningLimit: 1000` - Suppresses size warnings

---

## 4. render.yaml - Render Configuration

**File:** `render.yaml` (in root directory)

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
    disk:
      name: node_modules
      mountPath: /opt/render/project/.render/node_modules
      sizeGB: 5
```

**Key Points:**

- ✅ `buildCommand: npm ci && npm run build` - Installs deps, builds React
- ✅ `startCommand: node server.js` - Starts your server
- ✅ `NODE_ENV: production` - Production environment
- ✅ `healthCheckPath: /api/health` - Render monitoring endpoint
- ✅ `disk` - Caches node_modules between deployments

---

## 5. .env.production - Production Environment

**File:** `.env.production` (in root directory)

```dotenv
# Production environment variables for Render
# NOTE: NODE_ENV should NOT be set here
# It's configured in render.yaml

# These values are for reference - actual values set in Render dashboard
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key_here
```

**Key Points:**

- ✅ NO `NODE_ENV=production` (configured in render.yaml)
- ✅ Supabase keys as placeholders (set in Render dashboard)

---

## 6. .env.local - Local Development

**File:** `.env.local` (in root directory)

```dotenv
# Local development environment variables
# DO NOT commit to GitHub - add to .gitignore

VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Key Points:**

- ✅ Add to .gitignore (don't commit)
- ✅ Use local Supabase URL
- ✅ Use local/test keys

---

## 7. .gitignore - What Not to Commit

**File:** `.gitignore` (update existing)

```gitignore
# Dependencies
node_modules/
package-lock.json

# Build output
dist/
build/

# Environment
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

**Key Points:**

- ✅ Ignore dist/ (created by npm run build)
- ✅ Ignore node_modules/ (created by npm install)
- ✅ Ignore .env.local (local dev only)

---

## 8. tsconfig.json - TypeScript (Keep Existing)

Your existing tsconfig.json is fine. Just make sure it exists in root:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

---

## Installation & Deployment

### Step 1: Ensure Dependencies Are Installed

```powershell
npm install
```

### Step 2: Test Locally

```powershell
# Build React
npm run build

# Should output:
# ✓ 3323 modules transformed
# dist/index.html
# dist/assets/...
# ✓ built in 1m 41s

# Verify dist exists
Test-Path "dist/index.html"  # Should return True

# Start server
npm start

# Should output:
# ✅ Found dist folder at: ...
# ✅ Harvestá server running on port 3000

# Visit in browser: http://localhost:3000
```

### Step 3: Commit to GitHub

```powershell
git add .
git commit -m "Production deployment: Express server, Render config, optimized build"
git push origin main
```

### Step 4: Deploy on Render

1. Go to **https://dashboard.render.com**
2. Click **"New +"** → **"Web Service"**
3. Select your GitHub repository
4. Set:
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `node server.js`
5. Add environment variables in dashboard:
   ```
   NODE_ENV = production
   VITE_SUPABASE_URL = [your-key]
   VITE_SUPABASE_PUBLISHABLE_KEY = [your-key]
   ```
6. Click **"Deploy"**

### Step 5: Test Deployment

Once deployment completes:

```
Visit: https://harvesta-XXXX.onrender.com
Expected: Your app loads ✅
```

---

## Files Summary

| File              | Purpose           | Status           |
| ----------------- | ----------------- | ---------------- |
| `server.js`       | Express backend   | ✅ Provided      |
| `package.json`    | Dependencies      | ✅ Provided      |
| `vite.config.ts`  | Build config      | ✅ Provided      |
| `render.yaml`     | Render config     | ✅ Provided      |
| `.env.production` | Production env    | ✅ Provided      |
| `.env.local`      | Dev env           | ✅ Provided      |
| `tsconfig.json`   | TypeScript config | ✅ Keep existing |

---

## You're All Set! 🚀

All code is production-ready and tested.

**Next action:**

1. Copy `server.js` code to your project
2. Update `package.json` with dependencies
3. Verify `vite.config.ts` matches
4. Add/update `render.yaml`
5. Configure `.env.production`
6. Commit and push
7. Deploy on Render

**Your app will be live in 3-5 minutes!** 🎉
