# Welcome to the Harvestá project

## Project info

**URL:**
https://harvestá.com

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

### Frontend Stack
- **React** 18.3.1 - Component-based UI library
- **TypeScript** 5.8.3 - Type-safe JavaScript
- **Vite** 7.3.1 - Modern build tool with instant HMR
- **React Router DOM** 6.30.1 - Client-side routing
- **Tailwind CSS** 3.4.17 - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Radix UI** - Headless UI primitives
- **Framer Motion** 12.26.1 - Animation library
- **React Hook Form** 7.61.1 - Performant forms
- **Zod** 3.25.76 - Schema validation
- **TanStack React Query** 5.83.0 - Server state management

### Backend & Database
- **Express** 4.18.2 - Node.js web framework
- **Supabase** 2.90.0 - PostgreSQL + Auth + Realtime
- **Node.js** 20.11.1 - JavaScript runtime

### Development Tools
- **SWC** - Fast JavaScript compiler
- **ESLint** 9.32.0 - Code linting
- **Terser** 5.46.0 - Code minification
- **PostCSS** 8.5.6 - CSS transformation

### Additional Libraries
- **Lucide React** 0.462.0 - Icon library
- **Recharts** 2.15.4 - Data visualization
- **Sonner** 1.7.4 - Toast notifications
- **date-fns** 3.6.0 - Date utilities
- **Embla Carousel** 8.6.0 - Carousel component

**For a complete framework breakdown, see:**
- [`FRAMEWORK_STACK.md`](./FRAMEWORK_STACK.md) - Detailed documentation
- [`tech-stack.json`](./tech-stack.json) - Machine-readable format
- `.nvmrc` - Node.js version specification (20.11.1)

## How can I deploy this project?

This project is **production-ready** and configured for deployment on multiple platforms:

### Supported Platforms
- **Vercel** (Recommended) - `vercel.json` auto-detected
- **Render** - `render.yaml` auto-detected
- **Netlify** - `netlify.toml` auto-detected
- **Hostinger & Self-Hosted** - `server.js` Express server included

### Build & Start Commands
```bash
# Build for production
npm run build

# Start Express server
npm start
# or
node server.js
```

**Output:** `dist/` folder (~2.3MB, optimized and minified)

### Required Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-public-anon-key
NODE_ENV=production
```

### Deployment on Vercel
1. Push changes to main branch
2. Vercel automatically detects `vercel.json`
3. Environment variables auto-configured from project settings
4. Deploy completes in ~2-3 minutes

### Deployment on Render
1. Connect your GitHub repository
2. Render automatically detects `render.yaml`
3. Set environment variables in dashboard
4. Deploy starts automatically

### Deployment on Netlify
1. Connect your GitHub repository
2. Netlify automatically detects `netlify.toml`
3. Set environment variables in build settings
4. Deploy completes automatically

### Deployment on Hostinger or Self-Hosted
1. Install Node.js 20.11.1 (check `.nvmrc`)
2. `npm install`
3. `npm run build`
4. `npm start` (runs `node server.js` on port 3000)
5. Point domain to your server IP

**See also:**
- [`HOSTINGER_DEPLOYMENT_ENV_GUIDE.md`](./HOSTINGER_DEPLOYMENT_ENV_GUIDE.md)
- [`PRODUCTION_BLANK_PAGE_FIX.md`](./PRODUCTION_BLANK_PAGE_FIX.md)
- [`DEPLOYMENT_FIX_SUMMARY.md`](./DEPLOYMENT_FIX_SUMMARY.md)

## Connecting a Custom Domain

To connect a custom domain to your Vercel project:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Domains
3. Add your custom domain and follow the DNS configuration instructions
