# 🚀 Vercel Deployment Guide - Harvesta

## Overview

Vercel is perfect for deploying your React + Vite frontend. Your project is now fully configured for Vercel deployment.

---

## Key Differences: Vercel vs Render

| Feature            | Vercel                | Render                   |
| ------------------ | --------------------- | ------------------------ |
| **Best for**       | Frontend/SPA apps     | Full-stack with backend  |
| **Cold Start**     | ~100-200ms            | ~2-3 seconds             |
| **Free Tier**      | Generous (80GB/month) | Limited (0.5GB RAM)      |
| **Backend Server** | Serverless Functions  | Node.js server           |
| **Scaling**        | Automatic             | Limited free tier        |
| **Use Case**       | React-only apps       | React + Express backends |

---

## Why Vercel is Great for Your React App

✅ **Optimized for React/Vite** - Native support, zero config needed
✅ **Fast CDN** - Global edge network
✅ **SPA Routing** - Automatic fallback to index.html
✅ **Environment Variables** - Easy to manage
✅ **Automatic Deployments** - Git-triggered builds
✅ **Free HTTPS** - Built-in
✅ **Custom Domain** - Supported

---

## Vercel Configuration (Already Done ✅)

Your `vercel.json` is now configured with:

```json
{
  "buildCommand": "npm run build",        // Build React
  "outputDirectory": "dist",              // Vite output
  "framework": "vite",                    // Tells Vercel it's Vite
  "nodejs": "20.x",                       // Node version
  "regions": ["iad1"],                    // US region (fastest)
  "env": {                                // Environment variables
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_PUBLISHABLE_KEY": "@vite_supabase_publishable_key"
  },
  "headers": [...],                       // Cache optimization
  "rewrites": [                           // SPA routing
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Step-by-Step Deployment

### Step 1: Push to GitHub (Already Done)

Make sure your code is pushed:

```powershell
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Select **"Continue with GitHub"**
4. Authorize Vercel access to your repositories

### Step 3: Import Your Project

1. Click **"New Project"**
2. Search for **"harvesta"** repository
3. Click **"Import"**

### Step 4: Configure Environment Variables

Vercel will auto-detect settings from `vercel.json`. Now add secrets:

1. Click **"Environment Variables"**
2. Add these variables:

| Name                            | Value             | Type   |
| ------------------------------- | ----------------- | ------ |
| `VITE_SUPABASE_URL`             | Your Supabase URL | Secret |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase key | Secret |

3. Select environments: **Production, Preview, Development**
4. Click **"Save"**

### Step 5: Deploy

Click **"Deploy"** button

**That's it!** Vercel will:

1. Clone your GitHub repo
2. Run `npm run build`
3. Build React with Vite
4. Deploy to global CDN
5. Provide you a live URL

---

## Expected Deployment Time

```
0-30s    Clone repository
30-60s   Install dependencies
60-2m    Build React with Vite
2m-2:30  Upload to Vercel CDN
2:30+    🎉 App is LIVE!

Total: ~2-3 minutes
```

---

## Post-Deployment

### Your App Will Be Available At

```
https://harvesta.vercel.app
```

(or your custom domain)

### Test Your Deployment

1. **Visit your app:**

   ```
   https://harvesta.vercel.app
   ```

2. **Verify Supabase connection:**
   - Try logging in
   - Try creating an account
   - Check if data appears in Supabase

3. **Test all routes:**
   - Click links in app
   - Should work without 404 errors

4. **Check network tab:**
   - Assets should load from CDN
   - Should be very fast

---

## Adding a Custom Domain

### Via Vercel Dashboard

1. Go to **Project Settings**
2. Click **"Domains"**
3. Enter your domain (e.g., `harvesta.com`)
4. Follow DNS setup instructions
5. Wait for propagation (up to 48 hours)

### For Your Harvesta Domain

If you own `harvesta.com`:

1. Update nameservers to Vercel's
2. Or create CNAME records pointing to Vercel
3. Vercel will auto-provision SSL certificate
4. Your app is accessible at `https://harvesta.com`

---

## Environment Variables on Vercel

Your Supabase credentials are automatically available:

```javascript
// In your code:
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// They're available because vercel.json includes:
"env": {
  "VITE_SUPABASE_URL": "@vite_supabase_url",
  "VITE_SUPABASE_PUBLISHABLE_KEY": "@vite_supabase_publishable_key"
}
```

---

## Automatic Deployments

Every time you push to GitHub:

1. Vercel detects the push
2. Automatically builds your app
3. Deploys new version
4. Your app updates live (no manual steps needed)

```
git push origin main
    ↓
GitHub webhook
    ↓
Vercel receives notification
    ↓
npm run build
    ↓
Vite builds React
    ↓
Deploy to CDN
    ↓
Your app is updated! ✅
```

---

## Vercel vs Render: Which Should I Use?

### Use Vercel If:

- ✅ Frontend-only React app
- ✅ Don't need Node.js backend
- ✅ Want fastest cold start
- ✅ Want global CDN
- ✅ Don't need 24/7 always-on server

### Use Render If:

- ✅ Have Express/Node.js backend (like you do)
- ✅ Need always-on server
- ✅ Running background jobs
- ✅ Need persistent connections

---

## Your Current Architecture

You have:

- **React frontend** → Deploy to Vercel (or Render)
- **Supabase backend** → Already hosted (no deployment needed)
- **Express server** → Only for local dev (Render for production)

### Best Setup

For your Harvesta project, you have options:

**Option 1: Vercel Frontend Only** (Recommended for React-only apps)

```
Vercel (React SPA)
    ↓
Supabase (Backend)
```

**Option 2: Render Full Stack** (If you keep Express)

```
Render (React + Express)
    ↓
Supabase (Database)
```

**Option 3: Both** (Most Flexible)

```
Vercel (React frontend)
    ↓
Render (Express backend)
    ↓
Supabase (Database)
```

---

## Performance on Vercel

Vercel provides:

```
✅ Global CDN (200+ edge locations)
✅ Automatic image optimization
✅ Code splitting & tree shaking (via Vite)
✅ Gzip compression
✅ Minification
✅ Caching headers

Result: Your React app loads in ~100-200ms globally
```

---

## SPA Routing on Vercel

Vercel automatically handles SPA routing through `vercel.json`:

```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

This means:

- All requests → serve `index.html`
- React Router handles routing client-side
- No 404 errors on routes
- Perfect for SPA apps

---

## Troubleshooting Vercel Deployment

### Build Fails: "vite build failed"

**Cause:** TypeScript/JavaScript error in your code
**Fix:**

1. Check Vercel build logs
2. Run locally: `npm run build`
3. Fix errors
4. Push to GitHub again

### App Shows Blank Page

**Cause:** Supabase credentials not set
**Fix:**

1. Go to Vercel dashboard
2. Project → Settings → Environment Variables
3. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
4. Redeploy

### Routes Give 404

**Cause:** SPA routing not working
**Fix:**

1. Verify `vercel.json` has rewrites section
2. Verify `index.html` is in dist/
3. Redeploy

---

## Monitoring & Analytics

Vercel provides:

```
✅ Build logs (see all errors)
✅ Deployment history (rollback if needed)
✅ Analytics (page views, performance)
✅ Performance monitoring
✅ Error tracking
```

Access via **Project → Analytics**

---

## Cost Estimation

**Vercel Free Tier:**

- ✅ Unlimited deployments
- ✅ 80GB bandwidth/month
- ✅ Unlimited projects
- ✅ Global CDN
- ✅ Custom domains
- ✅ HTTPS

**Your monthly usage:**

- ~10-100 deployments (free)
- ~1-10GB bandwidth (easily within free tier)
- **Cost: $0/month**

---

## Next Steps

1. **Go to Vercel:** https://vercel.com/signup
2. **Connect GitHub**
3. **Import harvesta project**
4. **Add environment variables**
5. **Click Deploy**
6. **Done!** 🎉

---

## Your Vercel URL Will Be

```
https://harvesta.vercel.app
```

(Auto-generated, or set a custom domain)

---

## Key Commands

```powershell
# Local development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel (automatic via GitHub)
git push origin main
```

---

## Configuration Files Ready

✅ `vercel.json` - Configured for Vite + React + SPA routing
✅ `package.json` - All dependencies included
✅ `vite.config.ts` - Optimized build settings
✅ `.env.production` - Production variables (if needed)

---

## Summary

| Step | What to Do                | Time         |
| ---- | ------------------------- | ------------ |
| 1    | Create Vercel account     | 2 min        |
| 2    | Connect GitHub            | 1 min        |
| 3    | Import project            | 1 min        |
| 4    | Add environment variables | 2 min        |
| 5    | Deploy                    | Click button |
| 6    | Wait for build            | 2-3 min      |
| 7    | App is live!              | ✅ Done      |

**Total time: ~10 minutes**

---

## You're Ready for Vercel! 🚀

Your project is fully configured. Just connect to Vercel and deploy.

**Start here:** https://vercel.com/signup
