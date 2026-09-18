// scripts/generate-sitemap.mjs
//
// Replaces src/utils/generateSitemap.js.
//
// The old version kept its own hard-coded list of curated slugs, separate from
// the list used by the app, so the two could drift apart. Everything now comes
// from src/data/siteRoutes.js.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allRoutes, SITE_URL } from "../data/siteRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const today = new Date().toISOString().split("T")[0];

const body = allRoutes
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
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  `${body}\n` +
  `</urlset>\n`;

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

console.log(`Sitemap contains ${allRoutes.length} URLs.`);
