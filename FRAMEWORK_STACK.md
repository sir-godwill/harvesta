# Harvesta Framework Stack

## Primary Frameworks & Technologies

### Frontend Framework
- **React** 18.3.1 - Component-based UI library
- **React Router DOM** 6.30.1 - Client-side routing
- **React DOM** 18.3.1 - React rendering

### Build Tool & Package Manager
- **Vite** 7.3.1 - Modern build tool with instant HMR
- **TypeScript** 5.8.3 - Type-safe JavaScript
- **SWC** (@vitejs/plugin-react-swc) - Fast JavaScript compiler

### Styling & UI Components
- **Tailwind CSS** 3.4.17 - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Headless UI components (full suite)
  - Accordion, Alert Dialog, Avatar, Checkbox, Collapsible, Context Menu, Dialog, Dropdown Menu, Hover Card, Label, Menubar, Navigation Menu, Popover, Progress, Radio Group, Scroll Area, Select, Separator, Slider, Switch, Tabs, Toast, Toggle, Tooltip
- **Framer Motion** 12.26.1 - Motion library for animations

### State Management & Data Fetching
- **TanStack React Query** 5.83.0 - Server state management and caching
- **Zustand** (optional) - Lightweight state management
- **React Hook Form** 7.61.1 - Performant forms

### Backend & Database
- **Supabase** 2.90.0 - PostgreSQL + Auth + Realtime + Storage
- **Express** 4.18.2 - Node.js backend server
- **Node.js** 20.x - Runtime environment

### Charts & Data Visualization
- **Recharts** 2.15.4 - React charts library
- **Embla Carousel** 8.6.0 - Headless carousel component

### Form Validation
- **Zod** 3.25.76 - TypeScript-first schema validation
- **@hookform/resolvers** 3.10.0 - Form validation resolvers

### Utilities
- **Lucide React** 0.462.0 - Icon library
- **date-fns** 3.6.0 - Date utilities
- **sonner** 1.7.4 - Toast notifications
- **class-variance-authority** 0.7.1 - CSS class generation
- **clsx** 2.1.1 - Conditional className utility
- **tailwind-merge** 2.6.0 - Tailwind class merger
- **vaul** 0.9.9 - Drawer component
- **next-themes** 0.3.0 - Theme management
- **cmdk** 1.1.1 - Command menu component
- **input-otp** 1.4.2 - OTP input component
- **react-resizable-panels** 2.1.9 - Resizable panel layouts
- **react-day-picker** 8.10.1 - Date picker

### Development Tools
- **ESLint** 9.32.0 - Code linting
- **Prettier** - Code formatting
- **Terser** 5.46.0 - JavaScript minifier
- **PostCSS** 8.5.6 - CSS transformation
- **Autoprefixer** 10.4.21 - Vendor prefix automation

## Deployment & Infrastructure

### Deployment Platforms Configured
- **Vercel** - Primary deployment platform
- **Render** - Alternative Node.js hosting
- **Netlify** - Static hosting option
- **Hostinger** - Shared hosting support

### Configuration Files
- `vite.config.ts` - Vite build configuration
- `vercel.json` - Vercel deployment settings
- `render.yaml` - Render deployment configuration
- `netlify.toml` - Netlify configuration (auto-generated)
- `.nvmrc` - Node version specification
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `server.js` - Express server for production
- `eslint.config.js` - ESLint configuration

## Architecture

### Frontend Structure
- **SPA (Single Page Application)** - Client-side routing
- **React Context API** - Global state (AppContext, AuthContext, AdminContext)
- **Component-based** - Reusable UI components
- **Custom Hooks** - Logic abstraction (useAuth, useProducts, useCart, etc.)

### Backend Structure
- **Express API Server** - Serves built React app + API endpoints
- **REST API** - Backend communication
- **Supabase Backend** - Database, auth, file storage

### Type System
- **TypeScript** - Type-safe development
- **Zod Schemas** - Runtime validation

## Database

### Supabase (PostgreSQL + Services)
- Authentication & Authorization
- Realtime subscriptions
- File storage
- Vector embeddings
- Edge Functions

## Key Features By Framework

### React Features
- Hooks (useState, useEffect, useContext, useRef, useCallback)
- Error Boundary for error handling
- Suspense for code splitting
- Context API for global state

### Vite Features
- Fast HMR (Hot Module Replacement)
- Tree-shaking for small bundles
- Pre-configured optimization
- SWC transpiler for speed

### Tailwind CSS Features
- Utility-first CSS
- Dark mode support
- Responsive design
- Custom theme configuration

### TypeScript Features
- Full type safety
- Interface definitions
- Custom types and generics
- Strict mode compilation

## Performance Optimizations

- Code splitting with React lazy loading
- Image optimization
- CSS minification
- JavaScript minification with Terser
- Asset caching strategies
- Gzip compression
- Bundle analysis

## Security

- CORS handling
- Environment variables for secrets
- Supabase Row Level Security (RLS)
- XSS protection via React
- CSRF protection
- Secure headers configuration

## Version Specifications

| Technology | Version |
|-----------|---------|
| Node.js | 20.11.1 (LTS) |
| React | 18.3.1 |
| TypeScript | 5.8.3 |
| Vite | 7.3.1 |
| Tailwind CSS | 3.4.17 |
| React Router | 6.30.1 |
| TanStack Query | 5.83.0 |
| Supabase | 2.90.0 |
| Express | 4.18.2 |

## Build & Runtime

- **Build Command**: `npm run build` (Uses Vite)
- **Start Command**: `node server.js` (Express)
- **Dev Command**: `npm run dev` (Vite dev server)
- **Build Output**: `dist/` folder (~2.3MB total)
- **Node Modules Size**: ~500MB+
