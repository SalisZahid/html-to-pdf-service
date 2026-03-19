import puppeteer from "puppeteer";
import fs from "node:fs/promises";
import { install, Browser, detectBrowserPlatform } from "@puppeteer/browsers";

// Set the cache directory for Azure's volatile /tmp storage
const DEFAULT_CACHE_DIR = "/tmp/puppeteer";
process.env.PUPPETEER_CACHE_DIR = process.env.PUPPETEER_CACHE_DIR || DEFAULT_CACHE_DIR;

let installingPromise = null;

function getChromeExecutablePath() {
  return process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath();
}

async function ensureChromeAvailable() {
  if (installingPromise) return installingPromise;

  installingPromise = (async () => {
    const cacheDir = process.env.PUPPETEER_CACHE_DIR || "/tmp/puppeteer";

    try {
      // 1. Try to find an existing executable
      const executablePath = getChromeExecutablePath();
      await fs.access(executablePath);
      console.log("Chrome already exists at:", executablePath);
      return executablePath;
    } catch {
      console.log("Chrome not found. Downloading stable version...");

      // 2. Use a hardcoded stable Build ID (Chrome 130)
      // This avoids the 'puppeteer.browserVersion is not a function' error
      const buildId = "130.0.6723.58";

      const result = await install({
        browser: Browser.CHROME,
        cacheDir: cacheDir,
        buildId: buildId,
        platform: detectBrowserPlatform(),
      });

      process.env.PUPPETEER_EXECUTABLE_PATH = result.executablePath;
      console.log("Download complete. Path:", result.executablePath);
      return result.executablePath;
    }
  })();

  return installingPromise;
}

function wrapInDocument(html) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 0; margin-top: 18pt; }
    @page :first { margin-top: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; min-height: 0; }
    body > *:first-child { margin-top: 0 !important; padding-top: 0 !important; }
    body, body * {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }
    .appeal-letter p, .appeal-letter div { margin: 0 0 0.75em 0; display: block; }
    .appeal-letter p:last-child, .appeal-letter div:last-child { margin-bottom: 0; }
    .appeal-letter p + p, .appeal-letter div + div { margin-top: 0.25em; }
    .appeal-letter strong, .appeal-letter b { font-weight: 700; }
    .appeal-letter em, .appeal-letter i { font-style: italic; }
    .appeal-letter u { text-decoration: underline; }
    .pdf-page { width: 100%; page-break-after: always; }
  </style>
</head>
<body>${html}</body>
</html>`;
}

export const pdfService = {
  async generatePdf({ html, htmlParts }) {
    let browser;
    try {
      if (!html && !htmlParts) {
        throw new Error("Missing body: provide 'html' or 'htmlParts'");
      }

      const pages = htmlParts && Array.isArray(htmlParts) ? htmlParts : [html];
      const fullHtml =
        pages.length === 1
          ? wrapInDocument(pages[0])
          : wrapInDocument(pages.map((p) => `<div class="pdf-page">${p}</div>`).join(""));

      // 1. Ensure Chrome exists and get the path
      const executablePath = await ensureChromeAvailable();

      // 2. Launch with optimized arguments for Azure App Service
      browser = await puppeteer.launch({
        headless: true,
        executablePath,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--no-zygote",
          "--single-process",
        ],
      });

      const page = await browser.newPage();

      // Fix for "squished" content: Set a desktop-sized viewport
      await page.setViewport({ width: 1280, height: 800 });
      await page.emulateMediaType("screen");

      await page.setContent(fullHtml, {
        waitUntil: "domcontentloaded", // High speed, doesn't wait for fonts/images
        timeout: 60000,
        // waitUntil: "networkidle0",
        // timeout: 45000, // Increased for slower cloud environments
      });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        scale: 0.8, // Scale down slightly to fit desktop layouts on A4 paper
        margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
      });

      return pdfBuffer;
    } catch (err) {
      console.error("PDF Generation failed:", err);
      throw err;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  },
};
