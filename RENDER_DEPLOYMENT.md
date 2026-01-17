# Render Deployment Guide for Harvestá

## Prerequisites

- GitHub repository with your Harvestá code
- Render account (https://render.com)
- Supabase project with your credentials

## Step 1: Prepare Your Repository

Make sure your repository has:

- ✅ `render.yaml` - Render configuration file
- ✅ `server.js` - Production server
- ✅ `vite.config.ts` - Updated build config
- ✅ `package.json` - With production scripts
- ✅ `.env.example` - Environment variable template

## Step 2: Deploy to Render

1. **Connect GitHub Repository**
   - Go to https://dashboard.render.com
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Select the branch (usually `main`)

2. **Configure Service**
   - **Name:** `harvesta`
   - **Runtime:** Node
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `node server.js`

3. **Set Environment Variables**
   - In Render dashboard, go to your service's Environment tab
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=<your_supabase_url>
     VITE_SUPABASE_PUBLISHABLE_KEY=<your_supabase_key>
     NODE_ENV=production
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (2-5 minutes)
   - Your site will be available at `https://harvesta.onrender.com`

## Step 3: Connect Custom Domain (Optional)

1. In Render dashboard, go to your service's Settings tab
2. Under "Custom Domain," enter your domain (e.g., `harvestá.com`)
3. Update your domain's DNS records to point to Render
4. Wait for DNS propagation (5-30 minutes)

## Environment Variables Reference

| Variable                        | Description               | Example                     |
| ------------------------------- | ------------------------- | --------------------------- |
| `VITE_SUPABASE_URL`             | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase public anon key  | `eyJhbG...`                 |
| `NODE_ENV`                      | Environment mode          | `production`                |

## Getting Supabase Credentials

1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings > API
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon public** → `VITE_SUPABASE_PUBLISHABLE_KEY`

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Verify TypeScript compilation: `npm run build` locally
- Check build logs in Render dashboard

### Site Shows 404

- Ensure `render.yaml` is correctly configured
- Verify `server.js` exists and has proper routing
- Check that `dist/index.html` is being created

### Environment Variables Not Working

- Verify variables are set in Render dashboard
- Redeploy after adding variables
- Check variable names match exactly in code

### Supabase Connection Issues

- Verify credentials are correct and in Render dashboard
- Check Supabase RLS policies
- Ensure network access is allowed

## Performance Optimization

The `render.yaml` includes:

- ✅ Node modules caching for faster builds
- ✅ Minified production bundle
- ✅ Optimized chunk splitting
- ✅ SPA routing fallback

## Monitoring

After deployment:

1. Check health status in Render dashboard
2. Monitor logs for errors
3. Test all critical user flows
4. Set up uptime monitoring alerts

## Continuous Deployment

Every push to your main branch will automatically trigger a new build and deployment on Render. This ensures your production site is always up-to-date.

## Rolling Back

If deployment causes issues:

1. Go to Render dashboard
2. Click your service
3. Go to "Deploys" tab
4. Click "Redeploy" on a previous deployment

## Support

- Render Docs: https://render.com/docs
- Supabase Docs: https://supabase.com/docs
- Vite Docs: https://vitejs.dev
