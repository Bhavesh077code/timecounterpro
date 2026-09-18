// scripts/prerender.mjs
//
// WHY THIS EXISTS
// ---------------
// TimeCounterPro is a client-side React app. Before this script, every URL on
// the site served the same empty index.html:
//
//     <div id="root"></div>
//
// with the homepage title and a canonical pointing at "/". Googlebot can
// execute JavaScript and would eventually render the page, but the AdSense
// review crawler is far less forgiving, and "every page is an empty duplicate
// of the homepage" is one of the most common causes of a "low value content"
// rejection.
//
// This script runs after `vite build` and writes a real HTML file for every
// route listed in src/data/siteRoutes.js:
//
//     dist/timers/index.html
//     dist/pomodoro/index.html
//     dist/timer/25-minute-timer/index.html
//     ...
//
// HOW IT WORKS
// ------------
// If `puppeteer` is installed it does a full prerender: it serves dist/,
// loads each route in a headless browser, waits for React to render, and saves
// the finished HTML. That gives crawlers the complete page text.
//
// If puppeteer is NOT installed it falls back to writing a per-route HTML
// shell with the correct <title>, description, canonical, robots and Open
// Graph tags. That alone fixes the duplicate-canonical problem, though the
// full prerender is strongly recommended before applying to AdSense.
//
// To enable the full version:
//     npm install --save-dev puppeteer
//
// Then just run `npm run build` as normal.

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { allRoutes, SITE_URL } from "../data/siteRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
};

function outputPathFor(route) {
  return route === "/"
    ? path.join(distDir, "index.html")
    : path.join(distDir, route.replace(/^\//, ""), "index.html");
}

function writeHtml(route, html) {
  const outPath = outputPathFor(route);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
}

/* ------------------------------------------------------------------ */
/* Meta tag injection - applied in both modes                          */
/* ------------------------------------------------------------------ */

function injectMeta(html, { path: routePath, title, description }) {
  const canonical = `${SITE_URL}${routePath === "/" ? "/" : routePath}`;
  let out = html;

  // Title
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

  // Description
  const descTag = `<meta name="description" content="${description}" />`;
  out = /<meta\s+name="description"[\s\S]*?\/?>/i.test(out)
    ? out.replace(/<meta\s+name="description"[\s\S]*?\/?>/i, descTag)
    : out.replace("</head>", `  ${descTag}\n  </head>`);

  // Remove every canonical / robots / og:url / og:title / og:description that
  // came from the template or from a previous pass, then add exactly one of
  // each. Emitting two canonicals is worse than emitting none.
  out = out.replace(/<link\s+rel="canonical"[\s\S]*?\/?>/gi, "");
  out = out.replace(/<meta\s+name="robots"[\s\S]*?\/?>/gi, "");
  out = out.replace(
    /<meta\s+property="og:(url|title|description)"[\s\S]*?\/?>/gi,
    "",
  );

  out = out.replace(
    "</head>",
    `  <link rel="canonical" href="${canonical}" />\n` +
      `    <meta name="robots" content="index,follow,max-image-preview:large" />\n` +
      `    <meta property="og:url" content="${canonical}" />\n` +
      `    <meta property="og:title" content="${title}" />\n` +
      `    <meta property="og:description" content="${description}" />\n` +
      `  </head>`,
  );

  return out;
}

/* ------------------------------------------------------------------ */
/* Mode 1: full prerender with puppeteer                               */
/* ------------------------------------------------------------------ */

function startStaticServer(port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split("?")[0]);
      let filePath = path.join(distDir, urlPath);

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        const indexCandidate = path.join(filePath, "index.html");
        filePath = fs.existsSync(indexCandidate)
          ? indexCandidate
          : path.join(distDir, "index.html"); // SPA fallback
      }

      res.writeHead(200, {
        "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream",
      });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(port, () => resolve(server));
  });
}

async function prerenderWithPuppeteer(puppeteer) {
  const port = 4183;
  const server = await startStaticServer(port);

  const launchOptions = {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
  // Lets you point at a Chrome/Chromium you already have, e.g. in CI:
  //   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium npm run build
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  let browser;
  try {
    browser = await puppeteer.launch(launchOptions);
  } catch (err) {
    server.close();
    throw err;
  }

  let ok = 0;
  try {
    for (const route of allRoutes) {
      const page = await browser.newPage();
      // Block the AdSense script during prerender: we do not want ad markup
      // baked into the static HTML.
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        if (/googlesyndication|doubleclick|google-analytics/.test(req.url())) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(`http://localhost:${port}${route.path}`, {
        waitUntil: "networkidle0",
        timeout: 45000,
      });
      await page.waitForSelector("#root > *", { timeout: 15000 });

      let html = await page.content();
      html = injectMeta(html, route);
      writeHtml(route.path, html);
      await page.close();
      ok += 1;
      console.log(`  prerendered ${route.path}`);
    }
  } finally {
    await browser.close();
    server.close();
  }
  return ok;
}

/* ------------------------------------------------------------------ */
/* Mode 2: meta-only shells (no puppeteer installed)                   */
/* ------------------------------------------------------------------ */

function prerenderShellsOnly() {
  const template = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
  for (const route of allRoutes) {
    writeHtml(route.path, injectMeta(template, route));
  }
  return allRoutes.length;
}

/* ------------------------------------------------------------------ */

async function main() {
  if (!fs.existsSync(path.join(distDir, "index.html"))) {
    console.error("prerender: dist/index.html not found. Run `vite build` first.");
    process.exit(1);
  }

  let puppeteer = null;
  try {
    puppeteer = (await import("puppeteer")).default;
  } catch {
    puppeteer = null;
  }

  if (puppeteer) {
    try {
      console.log("Prerendering with puppeteer (full HTML)...");
      const count = await prerenderWithPuppeteer(puppeteer);
      console.log(`Prerender complete: ${count} routes with full content.`);
      return;
    } catch (err) {
      // A missing Chrome binary must not break a deploy. Fall through to the
      // meta-only path, which still fixes the duplicate-canonical problem.
      console.warn(`\nHeadless browser unavailable: ${err.message}`);
      console.warn(
        "Falling back to meta-only prerender. Fix this before applying to AdSense:\n" +
          "  npx puppeteer browsers install chrome\n" +
          "  (or set PUPPETEER_EXECUTABLE_PATH to an existing Chrome/Chromium)\n",
      );
    }
  }

  const count = prerenderShellsOnly();
  console.log(
    `Prerender fallback: ${count} routes written with correct meta tags only.\n` +
      "  For full content prerendering (recommended before applying to AdSense):\n" +
      "    npm install --save-dev puppeteer && npx puppeteer browsers install chrome",
  );
}

main().catch((err) => {
  console.error("prerender failed:", err);
  process.exit(1);
});
