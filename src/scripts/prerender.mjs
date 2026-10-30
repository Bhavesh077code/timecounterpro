/*
// src/scripts/prerender.mjs
//
// WHAT THIS DOES
// --------------
// TimeCounterPro is a React single-page app. Without this step every URL would
// serve an empty <div id="root"></div>, so Googlebot and the AdSense crawler
// would see "Please enable JavaScript" instead of the page.
//
// After `vite build` (client) and `vite build --ssr` (server bundle), this
// script renders EVERY route with the real React app (tool UI, written guide,
// FAQ, links) and writes full static HTML:
//
//   dist/index.html                 -> /
//   dist/pomodoro.html              -> /pomodoro   (served at the extensionless URL)
//   dist/404.html                   -> any unknown URL, with a real 404 status
//   dist/_redirects                 -> 301s for the removed pages
//
// No headless Chrome / Puppeteer is needed, so it works on Cloudflare's build
// machines. The browser then replaces this HTML with the live interactive app.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  allRoutes,
  adRoutePaths,
  trafficRoutes,
} from "../data/siteRoutes.js";
import { ADSENSE_CLIENT } from "../config/ads.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "..");
const distDir = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");


function makeStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => void m.set(k, String(v)),
    removeItem: (k) => void m.delete(k),
    clear: () => m.clear(),
    key: (i) => [...m.keys()][i] ?? null,
    get length() {
      return m.size;
    },
  };
}
globalThis.localStorage = makeStorage();
globalThis.sessionStorage = makeStorage();


const outputPathFor = (route) =>
  route === "/" ? path.join(distDir, "index.html") : path.join(distDir, `${route.replace(/^\/+/, "")}.html`);

function stripHeadTags(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, "")
    .replace(/<meta\s+name=["']robots["'][^>]*>/gi, "")
    .replace(/<meta\s+(?:property|name)=["'](?:og|twitter):[^"']+["'][^>]*>/gi, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<script[^>]*googlesyndication[^>]*><\/script>/gi, "");
}

const adScript =
  `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>`;

function buildPage(template, { html, head }, withAds) {
  let out = stripHeadTags(template);
  out = out.replace(/<noscript>[\s\S]*?<\/noscript>/i, "");
  out = out.replace(
    "</head>",
    `    ${head}\n${withAds ? `    ${adScript}\n` : ""}  </head>`,
  );
  out = out.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  return out;
}

const textWords = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .split(/\s+/)
    .filter(Boolean).length;


async function main() {
  const templatePath = path.join(distDir, "index.html");
  if (!fs.existsSync(templatePath)) {
    throw new Error("dist/index.html not found. Run `vite build` first.");
  }
  const ssrEntry = path.join(ssrDir, "entry-server.js");
  if (!fs.existsSync(ssrEntry)) {
    throw new Error("dist-ssr/entry-server.js not found. Run `vite build --ssr src/entry-server.jsx --outDir dist-ssr` first.");
  }

  const template = fs.readFileSync(templatePath, "utf8");
  const { render } = await import(pathToFileURL(ssrEntry).href);
  const adPaths = new Set(adRoutePaths);
  const trafficPaths = new Set(trafficRoutes.map((r) => r.path));
  const report = [];
  let problems = 0;

  // Render the home page LAST so the template read above is never overwritten early.
  const ordered = [...allRoutes].sort((a, b) => (a.path === "/" ? 1 : b.path === "/" ? -1 : 0));

  for (const route of ordered) {
    const result = await render(route.path);
    const page = buildPage(template, result, adPaths.has(route.path));
    fs.mkdirSync(path.dirname(outputPathFor(route.path)), { recursive: true });
    fs.writeFileSync(outputPathFor(route.path), page, "utf8");

    const words = textWords(result.html);
    const hasH1 = /<h1[\s>]/i.test(result.html);
    const hasTitle = /<title[^>]*>[^<]+<\/title>/i.test(page);
    const hasCanonical = /rel="canonical"/i.test(page);
    const ok = (hasH1 || route.noindex) && hasTitle && (route.noindex || hasCanonical) && (!trafficPaths.has(route.path) || words >= 600);
    if (!ok) problems += 1;
    report.push({ path: route.path, words, h1: hasH1, canonical: hasCanonical, ads: adPaths.has(route.path), ok });
  }

  // Real 404 page (served with HTTP 404 by the host).
  const notFound = await render("/this-page-does-not-exist");
  fs.writeFileSync(path.join(distDir, "404.html"), buildPage(template, notFound, false), "utf8");

  

  fs.rmSync(ssrDir, { recursive: true, force: true });

  console.log("\nPrerender report (words are visible text in the static HTML):");
  for (const r of report) {
    console.log(
      `  ${r.ok ? "OK  " : "FAIL"} ${r.path.padEnd(34)} words=${String(r.words).padStart(5)} h1=${r.h1} canonical=${r.canonical} ads=${r.ads}`,
    );
  }
  console.log("  404.html written.");

  if (problems) {
    throw new Error(`${problems} page(s) failed the prerender checks above.`);
  }
}

main().catch((err) => {
  console.error("prerender failed:", err);
  process.exit(1);
});


*/

// src/scripts/prerender.mjs
//
// WHAT THIS DOES
// --------------
// TimeCounterPro is a React single-page app. Without this step every URL would
// serve an empty <div id="root"></div>, so Googlebot and the AdSense crawler
// would see "Please enable JavaScript" instead of the page.
//
// After `vite build` (client) and `vite build --ssr` (server bundle), this
// script renders EVERY route with the real React app (tool UI, written guide,
// FAQ, links) and writes full static HTML:
//
//   dist/index.html                 -> /
//   dist/pomodoro.html              -> /pomodoro   (served at the extensionless URL)
//   dist/404.html                   -> any unknown URL, with a real 404 status
//
// No headless Chrome / Puppeteer is needed, so it works on Cloudflare's build
// machines. The browser then replaces this HTML with the live interactive app.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { allRoutes, adRoutePaths } from "../data/siteRoutes.js";
import { ADSENSE_CLIENT } from "../config/ads.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "..");
const distDir = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

/* ---- Browser globals that some components touch while rendering ---- */
function makeStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => void m.set(k, String(v)),
    removeItem: (k) => void m.delete(k),
    clear: () => m.clear(),
    key: (i) => [...m.keys()][i] ?? null,
    get length() {
      return m.size;
    },
  };
}
globalThis.localStorage = makeStorage();
globalThis.sessionStorage = makeStorage();

/* ---- Helpers ---- */
const outputPathFor = (route) =>
  route === "/"
    ? path.join(distDir, "index.html")
    : path.join(distDir, `${route.replace(/^\/+/, "")}.html`);

function stripHeadTags(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, "")
    .replace(/<meta\s+name=["']robots["'][^>]*>/gi, "")
    .replace(
      /<meta\s+(?:property|name)=["'](?:og|twitter):[^"']+["'][^>]*>/gi,
      "",
    )
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<script[^>]*googlesyndication[^>]*><\/script>/gi, "");
}

const adScript = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>`;

function buildPage(template, { html, head }, withAds) {
  let out = stripHeadTags(template);
  out = out.replace(/<noscript>[\s\S]*?<\/noscript>/i, "");
  out = out.replace(
    "</head>",
    `    ${head}\n${withAds ? `    ${adScript}\n` : ""}  </head>`,
  );
  out = out.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  return out;
}

const textWords = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .split(/\s+/)
    .filter(Boolean).length;

/* ---- Main ---- */
async function main() {
  const templatePath = path.join(distDir, "index.html");
  if (!fs.existsSync(templatePath)) {
    throw new Error("dist/index.html not found. Run `vite build` first.");
  }
  const ssrEntry = path.join(ssrDir, "entry-server.js");
  if (!fs.existsSync(ssrEntry)) {
    throw new Error(
      "dist-ssr/entry-server.js not found. Run `vite build --ssr src/entry-server.jsx --outDir dist-ssr` first.",
    );
  }

  const template = fs.readFileSync(templatePath, "utf8");
  const { render } = await import(pathToFileURL(ssrEntry).href);
  const adPaths = new Set(adRoutePaths);
  const report = [];
  let problems = 0;

  // Render the home page LAST so the template read above is never overwritten early.
  const ordered = [...allRoutes].sort((a, b) =>
    a.path === "/" ? 1 : b.path === "/" ? -1 : 0,
  );

  for (const route of ordered) {
    const result = await render(route.path);
    const page = buildPage(template, result, adPaths.has(route.path));
    fs.mkdirSync(path.dirname(outputPathFor(route.path)), { recursive: true });
    fs.writeFileSync(outputPathFor(route.path), page, "utf8");

    const words = textWords(result.html);
    const hasH1 = /<h1[\s>]/i.test(result.html);
    const hasTitle = /<title[^>]*>[^<]+<\/title>/i.test(page);
   const hasDescription =
            /<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["'][^"']+["'])[^>]*>/i.test(page);
    const hasCanonical = /rel="canonical"/i.test(page);
    const ok =
      (hasH1 || route.noindex) &&
      hasTitle &&
      hasDescription &&
      (route.noindex || hasCanonical);
    if (!ok) problems += 1;
    report.push({
      path: route.path,
      words,
      h1: hasH1,
      title: hasTitle,
      description: hasDescription,
      canonical: hasCanonical,
      ads: adPaths.has(route.path),
      ok,
    });
  }

  // Real 404 page (served with HTTP 404 by the host).
  const notFound = await render("/this-page-does-not-exist");
  fs.writeFileSync(
    path.join(distDir, "404.html"),
    buildPage(template, notFound, false),
    "utf8",
  );

  fs.rmSync(ssrDir, { recursive: true, force: true });

  console.log(
    "\nPrerender report (words are visible text in the static HTML):",
  );
  for (const r of report) {
    console.log(
     `  ${r.ok ? "OK  " : "FAIL"} ${r.path.padEnd(34)} words=${String(r.words).padStart(5)} h1=${r.h1} title=${r.title} description=${r.description} canonical=${r.canonical} ads=${r.ads}`,
    );
  }
  console.log("  404.html written.");

  if (problems) {
    throw new Error(`${problems} page(s) failed the prerender checks above.`);
  }
}

main().catch((err) => {
  console.error("prerender failed:", err);
  process.exit(1);
});
