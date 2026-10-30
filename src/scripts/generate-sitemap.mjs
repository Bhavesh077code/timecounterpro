
/*
// src/scripts/generate-sitemap.mjs
// Builds sitemap.xml from src/data/siteRoutes.js (indexable pages only).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sitemapRoutes, SITE_URL } from "../data/siteRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const today = new Date().toISOString().split("T")[0];

const body = sitemapRoutes
  .map(
    (route) =>
      `  <url>\n` +
      `    <loc>${SITE_URL}${route.path === "/" ? "/" : route.path}</loc>\n` +
      `    <lastmod>${today}</lastmod>\n` +
      `    <changefreq>${route.changefreq}</changefreq>\n` +
      `    <priority>${route.priority}</priority>\n` +
      `  </url>`,
  )
  .join("\n");

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

for (const target of [
  path.join(__dirname, "../../dist/sitemap.xml"),
  path.join(__dirname, "../../public/sitemap.xml"),
]) {
  try {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, sitemap);
    console.log(`sitemap written: ${target}`);
  } catch (err) {
    console.warn(`sitemap skipped ${target}: ${err.message}`);
  }
}
console.log(`Sitemap contains ${sitemapRoutes.length} URLs.`);

*/

// src/scripts/generate-sitemap.mjs
// Builds sitemap.xml from src/data/siteRoutes.js (indexable pages only).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sitemapRoutes, SITE_URL } from "../data/siteRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const body = sitemapRoutes
  .map(
    (route) =>
      `  <url>\n` +
      `    <loc>${SITE_URL}${route.path === "/" ? "/" : route.path}</loc>\n` +
      (route.lastmod ? `    <lastmod>${route.lastmod}</lastmod>\n` : "") +
      `    <changefreq>${route.changefreq}</changefreq>\n` +
      `    <priority>${route.priority}</priority>\n` +
      `  </url>`,
  )
  .join("\n");

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

for (const target of [
  path.join(__dirname, "../../dist/sitemap.xml"),
  path.join(__dirname, "../../public/sitemap.xml"),
]) {
  try {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, sitemap);
    console.log(`sitemap written: ${target}`);
  } catch (err) {
    console.warn(`sitemap skipped ${target}: ${err.message}`);
  }
}
console.log(`Sitemap contains ${sitemapRoutes.length} URLs.`);
