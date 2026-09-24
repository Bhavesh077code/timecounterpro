// scripts/prerender.mjs
//
// WHY THIS EXISTS
// ---------------
// TimeCounterPro is a client-side React app. Before this script, every URL
// on the site served the same empty index.html.
//
// This script runs after `vite build` and creates a real static HTML file
// for every route listed in src/data/siteRoutes.js.
//
// Example:
//
//   dist/index.html
//   dist/create.html
//   dist/pomodoro.html
//   dist/meditation-timer-with-sound.html
//   dist/stopwatch.html
//
// This keeps the public URLs extensionless:
//
//   https://timecounterpro.com/create
//   https://timecounterpro.com/pomodoro
//   https://timecounterpro.com/meditation-timer-with-sound
//
// The homepage remains:
//
//   https://timecounterpro.com/
//
// If Puppeteer is installed, the script performs a full prerender.
// Otherwise, it creates meta-only HTML shells.
//

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

import { allRoutes, SITE_URL } from "../data/siteRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const distDir = path.join(__dirname, "..", "..", "dist");

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

/* ------------------------------------------------------------------ */
/* Output path                                                       */
/* ------------------------------------------------------------------ */

/*
 * IMPORTANT:
 *
 * We intentionally use:
 *
 *   /route -> dist/route.html
 *
 * instead of:
 *
 *   /route -> dist/route/index.html
 *
 * because Cloudflare Pages can turn:
 *
 *   route/index.html
 *
 * into:
 *
 *   /route/
 *
 * which creates the redirect problem you were seeing in Google Search
 * Console.
 *
 * The homepage is the only exception:
 *
 *   / -> dist/index.html
 */
function outputPathFor(route) {
  if (route === "/") {
    return path.join(distDir, "index.html");
  }

  const cleanRoute = route.replace(/^\/+/, "");

  return path.join(distDir, `${cleanRoute}.html`);
}

/* ------------------------------------------------------------------ */
/* Write generated HTML                                               */
/* ------------------------------------------------------------------ */

function writeHtml(route, html) {
  const outPath = outputPathFor(route);

  fs.mkdirSync(path.dirname(outPath), {
    recursive: true,
  });

  fs.writeFileSync(outPath, html, "utf8");
}

/* ------------------------------------------------------------------ */
/* Meta tag injection                                                 */
/* ------------------------------------------------------------------ */

function escapeHtmlAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function injectMeta(html, { path: routePath, title, description }) {
  /*
   * Keep homepage canonical with trailing slash.
   *
   * Other routes intentionally have NO trailing slash.
   *
   * Examples:
   *
   * /
   * /create
   * /pomodoro
   * /meditation-timer-with-sound
   */
  const canonical =
    routePath === "/"
      ? `${SITE_URL}/`
      : `${SITE_URL}${routePath}`;

  const safeTitle = escapeHtmlAttribute(title);
  const safeDescription = escapeHtmlAttribute(description);
  const safeCanonical = escapeHtmlAttribute(canonical);

  let out = html;

  /* -------------------------------------------------------------- */
  /* Title                                                           */
  /* -------------------------------------------------------------- */

  const titleTag = `<title>${safeTitle}</title>`;

  if (/<title>[\s\S]*?<\/title>/i.test(out)) {
    out = out.replace(
      /<title>[\s\S]*?<\/title>/i,
      titleTag,
    );
  } else {
    out = out.replace(
      "</head>",
      `  ${titleTag}\n  </head>`,
    );
  }

  /* -------------------------------------------------------------- */
  /* Description                                                     */
  /* -------------------------------------------------------------- */

  const descTag = `<meta name="description" content="${safeDescription}" />`;

  if (
    /<meta\s+name=["']description["'][\s\S]*?>/i.test(out)
  ) {
    out = out.replace(
      /<meta\s+name=["']description["'][\s\S]*?>/i,
      descTag,
    );
  } else {
    out = out.replace(
      "</head>",
      `  ${descTag}\n  </head>`,
    );
  }

  /* -------------------------------------------------------------- */
  /* Remove existing SEO tags                                       */
  /* -------------------------------------------------------------- */

  // Remove all existing canonical tags.
  out = out.replace(
    /<link\s+rel=["']canonical["'][\s\S]*?>/gi,
    "",
  );

  // Remove all existing robots tags.
  out = out.replace(
    /<meta\s+name=["']robots["'][\s\S]*?>/gi,
    "",
  );

  // Remove existing Open Graph URL/title/description tags.
  out = out.replace(
    /<meta\s+property=["']og:(url|title|description)["'][\s\S]*?>/gi,
    "",
  );

  /* -------------------------------------------------------------- */
  /* Add exactly one canonical + robots + Open Graph tags           */
  /* -------------------------------------------------------------- */

  const seoTags = `
    <link rel="canonical" href="${safeCanonical}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <meta property="og:url" content="${safeCanonical}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
  `;

  out = out.replace(
    "</head>",
    `${seoTags}\n  </head>`,
  );

  return out;
}

/* ------------------------------------------------------------------ */
/* Static server for Puppeteer                                        */
/* ------------------------------------------------------------------ */

/*
 * This local server must understand our new structure:
 *
 *   /pomodoro
 *        ↓
 *   dist/pomodoro.html
 *
 *   /meditation-timer-with-sound
 *        ↓
 *   dist/meditation-timer-with-sound.html
 *
 * Without this logic, Puppeteer would fall back to dist/index.html.
 */
function startStaticServer(port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      try {
        const requestUrl = req.url || "/";

        const urlPath = decodeURIComponent(
          requestUrl.split("?")[0],
        );

        /* -------------------------------------------------------- */
        /* Security: prevent paths from escaping dist directory     */
        /* -------------------------------------------------------- */

        const normalizedPath = path
          .normalize(urlPath)
          .replace(/^(\.\.(\/|\\|$))+/, "");

        /* -------------------------------------------------------- */
        /* Homepage                                                  */
        /* -------------------------------------------------------- */

        if (normalizedPath === "/" || normalizedPath === "") {
          const homePath = path.join(
            distDir,
            "index.html",
          );

          if (fs.existsSync(homePath)) {
            return sendFile(res, homePath);
          }
        }

        /* -------------------------------------------------------- */
        /* Exact requested file                                      */
        /* -------------------------------------------------------- */

        let filePath = path.join(
          distDir,
          normalizedPath,
        );

        if (
          fs.existsSync(filePath) &&
          fs.statSync(filePath).isFile()
        ) {
          return sendFile(res, filePath);
        }

        /* -------------------------------------------------------- */
        /* Extensionless route -> route.html                         */
        /* -------------------------------------------------------- */

        const cleanRoute = normalizedPath.replace(
          /^\/+/,
          "",
        );

        if (cleanRoute) {
          const htmlCandidate = path.join(
            distDir,
            `${cleanRoute}.html`,
          );

          if (fs.existsSync(htmlCandidate)) {
            return sendFile(res, htmlCandidate);
          }
        }

        /* -------------------------------------------------------- */
        /* Directory route -> index.html                             */
        /* -------------------------------------------------------- */

        if (
          fs.existsSync(filePath) &&
          fs.statSync(filePath).isDirectory()
        ) {
          const indexCandidate = path.join(
            filePath,
            "index.html",
          );

          if (fs.existsSync(indexCandidate)) {
            return sendFile(res, indexCandidate);
          }
        }

        /* -------------------------------------------------------- */
        /* SPA fallback                                              */
        /* -------------------------------------------------------- */

        const fallback = path.join(
          distDir,
          "index.html",
        );

        if (fs.existsSync(fallback)) {
          return sendFile(res, fallback);
        }

        res.writeHead(404, {
          "Content-Type": "text/plain; charset=utf-8",
        });

        res.end("Not Found");
      } catch (error) {
        console.error(
          "Static server error:",
          error,
        );

        res.writeHead(500, {
          "Content-Type": "text/plain; charset=utf-8",
        });

        res.end("Internal Server Error");
      }
    });

    server.listen(port, () => {
      resolve(server);
    });
  });
}

/* ------------------------------------------------------------------ */
/* Send static file                                                   */
/* ------------------------------------------------------------------ */

function sendFile(res, filePath) {
  const extension = path.extname(filePath).toLowerCase();

  res.writeHead(200, {
    "Content-Type":
      MIME[extension] ||
      "application/octet-stream",
  });

  fs.createReadStream(filePath).pipe(res);
}

/* ------------------------------------------------------------------ */
/* Full prerender with Puppeteer                                      */
/* ------------------------------------------------------------------ */

async function prerenderWithPuppeteer(puppeteer) {
  const port = 4183;

  const server = await startStaticServer(port);

  const launchOptions = {
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  };

  /*
   * Optional Chrome path.
   *
   * Example:
   *
   * PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium npm run build
   */
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    launchOptions.executablePath =
      process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  let browser;

  try {
    browser = await puppeteer.launch(
      launchOptions,
    );
  } catch (err) {
    server.close();
    throw err;
  }

  let ok = 0;

  try {
    for (const route of allRoutes) {
      const page = await browser.newPage();

      /*
       * Block advertising/analytics requests during prerender.
       * We don't want ad markup baked into the static HTML.
       */
      await page.setRequestInterception(true);

      page.on("request", (request) => {
        const url = request.url();

        if (
          /googlesyndication|doubleclick|google-analytics/i.test(
            url,
          )
        ) {
          request.abort();
        } else {
          request.continue();
        }
      });

      const routePath = route.path;

      /*
       * Puppeteer visits the extensionless public URL.
       *
       * Example:
       *
       * http://localhost:4183/meditation-timer-with-sound
       *
       * The local server then loads:
       *
       * dist/meditation-timer-with-sound.html
       */
      await page.goto(
        `http://localhost:${port}${routePath}`,
        {
          waitUntil: "networkidle0",
          timeout: 45000,
        },
      );

      await page.waitForSelector(
        "#root > *",
        {
          timeout: 15000,
        },
      );

      let html = await page.content();

      html = injectMeta(
        html,
        route,
      );

      writeHtml(
        routePath,
        html,
      );

      await page.close();

      ok += 1;

      console.log(
        `  prerendered ${routePath}`,
      );
    }
  } finally {
    await browser.close();
    server.close();
  }

  return ok;
}

/* ------------------------------------------------------------------ */
/* Meta-only fallback                                                 */
/* ------------------------------------------------------------------ */

function prerenderShellsOnly() {
  const template = fs.readFileSync(
    path.join(
      distDir,
      "index.html",
    ),
    "utf8",
  );

  for (const route of allRoutes) {
    const html = injectMeta(
      template,
      route,
    );

    writeHtml(
      route.path,
      html,
    );
  }

  return allRoutes.length;
}

/* ------------------------------------------------------------------ */
/* Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  /* -------------------------------------------------------------- */
  /* Make sure Vite build already happened                          */
  /* -------------------------------------------------------------- */

  const indexPath = path.join(
    distDir,
    "index.html",
  );

  if (!fs.existsSync(indexPath)) {
    console.error(
      "prerender: dist/index.html not found. Run `vite build` first.",
    );

    process.exit(1);
  }

  /* -------------------------------------------------------------- */
  /* Try loading Puppeteer                                          */
  /* -------------------------------------------------------------- */

  let puppeteer = null;

  try {
    puppeteer = (
      await import("puppeteer")
    ).default;
  } catch {
    puppeteer = null;
  }

  /* -------------------------------------------------------------- */
  /* Full prerender                                                  */
  /* -------------------------------------------------------------- */

  if (puppeteer) {
    try {
      console.log(
        "Prerendering with puppeteer (full HTML)...",
      );

      const count =
        await prerenderWithPuppeteer(
          puppeteer,
        );

      console.log(
        `Prerender complete: ${count} routes with full content.`,
      );

      return;
    } catch (err) {
      /*
       * If Chrome/Puppeteer fails, don't break deployment.
       * Fall back to meta-only HTML.
       */
      console.warn(
        `\nHeadless browser unavailable: ${err.message}`,
      );

      console.warn(
        "\nFalling back to meta-only prerender. " +
          "Fix this before applying to AdSense:\n" +
          "  npx puppeteer browsers install chrome\n" +
          "  (or set PUPPETEER_EXECUTABLE_PATH to an existing Chrome/Chromium)\n",
      );
    }
  }

  /* -------------------------------------------------------------- */
  /* Meta-only fallback                                             */
  /* -------------------------------------------------------------- */

  const count =
    prerenderShellsOnly();

  console.log(
    `Prerender fallback: ${count} routes written with correct meta tags only.\n` +
      "  For full content prerendering (recommended before applying to AdSense):\n" +
      "    npm install --save-dev puppeteer && npx puppeteer browsers install chrome",
  );
}

/* ------------------------------------------------------------------ */
/* Start                                                               */
/* ------------------------------------------------------------------ */

main().catch((err) => {
  console.error(
    "prerender failed:",
    err,
  );

  process.exit(1);
});