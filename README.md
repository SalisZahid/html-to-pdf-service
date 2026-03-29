# HTML-to-PDF Microservice

A high-performance Node.js service dedicated to converting complex HTML into pixel-perfect PDF documents. This service is specifically engineered to solve common headless Chrome rendering issues such as character overlapping, font-loading race conditions, and layout shifts in cloud environments.

## 🚀 Core Objectives

* **Visual Fidelity**: Eliminates "squashed" text and overlapping lines caused by sub-pixel rendering in Puppeteer.
* **Font Integrity**: Injects custom TTF fonts (Inter) via Base64 to ensure zero-latency rendering and consistent typography.
* **Cloud Resilience**: Features a self-managing browser binary downloader optimized for volatile `/tmp` storage (e.g., Azure App Service).
* **Scalable Output**: Seamlessly handles single-page strings or multi-part HTML arrays for automated document generation.

## 🛠 Tech Stack

* **Runtime**: Node.js (ES Modules)
* **PDF Engine**: Puppeteer & @puppeteer/browsers
* **Framework**: Express.js
* **Typography**: Inter (Embedded via Base64/TTF)
* **Logging**: Winston + Morgan

## ✨ Key Features & Fixes

* **Advanced CSS Injection**: Implements `display: flow-root` and `min-height` logic within the wrapper to ensure text wrapping never causes vertical collisions.
* **Font-First Rendering**: Bypasses external Google Font links by embedding font data directly into the document, ensuring `domcontentloaded` triggers only after the font is ready.
* **Automated Binary Management**: Dynamically detects the host platform and installs the required Chrome build, storing it in a configurable cache directory.
* **Viewport Optimization**: Uses a calibrated desktop viewport (**1000x1200**) to ensure side-by-side elements don't collapse into mobile-style stacks during the PDF print process.

## 📂 Folder Structure

```text
src/
  services/
    pdf.service.js      # Core logic: wrapInDocument, ensureChrome, & generatePdf
  assets/
    fonts/              # Local TTF files for Base64 injection
  controllers/
    pdf.controller.js   # API request handling
  routes/
    v1/
      pdf.routes.js     # PDF generation endpoints
  middlewares/
    error.middleware.js # Global error handling
  utils/
    logger.js           # Structured logging via Winston
    catchAsync.js       # Wrapper for async route handlers
```

## 🏁 Getting Started
1. Software Dependencies
Node.js: v18 (LTS) or higher.

Linux Packages: If deploying to Linux (Ubuntu/Debian), ensure the following are installed for Chromium: libnss3, libatk-1.0-0, libcups2, libgbm1, libasound2.

2. Installation
Bash
npm install
3. Setup Environment
Create a .env file in the root directory:

Code snippet
PORT=4000
PUPPETEER_CACHE_DIR=/tmp/puppeteer

# Optional: Override the executable path if Chrome is pre-installed
# PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
📡 Usage
Endpoint: POST /api/v1/pdf/generate

Payload:

JSON
```text
{
  "htmlParts": [
    "<div><h1>Header</h1><p>Page 1 content...</p></div>",
    "<div><h1>Section</h1><p>Page 2 content...</p></div>"
  ]
}
```

📜 NPM Scripts
npm run dev: Start the server with nodemon for active development.

npm start: Production-grade execution.

npm run lint: Analyze code for potential errors and style issues.

