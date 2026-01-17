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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const distPath = join(__dirname, "dist");

// Verify dist folder exists
if (!fs.existsSync(distPath)) {
  console.error(`❌ Error: dist folder not found at ${distPath}`);
  console.error('Run "npm run build" first to generate the dist folder');
  process.exit(1);
}

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
  const indexPath = join(distPath, "index.html");

  if (fs.existsSync(indexPath)) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.sendFile(indexPath);
  } else {
    res.status(500).send("Internal Server Error: index.html not found");
  }
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
