#!/usr/bin/env node

/**
 * Simple static server for Render deployment
 * Serves the Vite-built SPA with proper routing fallback
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

// Compression middleware
app.use(
  express.static(distPath, {
    maxAge: "1d",
    etag: false,
  }),
);

// SPA fallback - serve index.html for all non-file routes
app.get("*", (req, res) => {
  const indexPath = join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Not found");
  }
});

app.listen(port, () => {
  console.log(`Harvestá server running on port ${port}`);
});
