#!/usr/bin/env node

/**
 * Production server for Render deployment
 * Serves the Vite-built React SPA with proper SPA routing fallback
 *
 * This server:
 * - Serves static files from the dist/ directory
 * - Implements SPA routing (all non-file routes fall back to index.html)
 * - Listens on process.env.PORT (set by Render) or 3000 locally
 * - Works on Render free tier without PM2 or nodemon
 */

import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Try multiple possible dist locations
const possiblePaths = [
  join(__dirname, "dist"),
  join(__dirname, "..", "dist"),
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

// If still not found, provide detailed error
if (!distPath) {
  console.error(`❌ CRITICAL ERROR: dist folder not found!`);
  console.error(`Looked in these locations:`);
  possiblePaths.forEach((p) => {
    const exists = fs.existsSync(p) ? "✅ EXISTS" : "❌ NOT FOUND";
    console.error(`  ${exists}: ${p}`);
  });
  console.error(``);
  console.error(`SOLUTIONS:`);
  console.error(`1. Run "npm run build" locally to test`);
  console.error(`2. Check Render build logs for npm run build errors`);
  console.error(`3. Verify package.json has correct build script`);
  console.error(`4. Check vite.config.ts has outDir: "dist"`);
  process.exit(1);
}

// List contents of dist folder for debugging
const distContents = fs.readdirSync(distPath);
if (distContents.length === 0) {
  console.error(`❌ ERROR: dist folder is EMPTY!`);
  console.error(`Build likely failed. Check Render build logs.`);
  process.exit(1);
} else {
  console.log(
    `📁 dist folder contents: ${distContents.slice(0, 5).join(", ")}${distContents.length > 5 ? "..." : ""}`,
  );
}

// Verify index.html exists
const indexPath = join(distPath, "index.html");
if (!fs.existsSync(indexPath)) {
  console.error(`❌ ERROR: index.html not found in dist folder!`);
  console.error(`Build may have failed or generated incorrect output.`);
  process.exit(1);
}
console.log(`✅ index.html found`);

// Middleware: Serve static files with caching headers
app.use(
  express.static(distPath, {
    maxAge: "1d", // Cache files for 1 day
    etag: false, // Disable etag for faster serving
    lastModified: true,
  }),
);

// Middleware: Parse JSON (for potential future API routes)
app.use(express.json());

// Health check endpoint (useful for Render monitoring)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// SPA fallback: Route all non-file requests to index.html
// This allows React Router to handle client-side routing
app.get("*", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.sendFile(indexPath);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`✅ Harvestá server running on port ${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📁 Serving static files from: ${distPath}`);
});

// Graceful shutdown
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
