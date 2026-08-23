import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'https://timecounterpro.com';
const today = new Date().toISOString().split('T')[0];

async function loadSeoTimers() {
  try {
    const mod = await import('../data/seoTimers.js');
    return mod.default || mod.seoTimers || [];
  } catch { return []; }
}
async function buildUrls() {
  const seoTimers = await loadSeoTimers();
  const urls = [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/about', changefreq: 'monthly', priority: 0.5 },
  ];
  try {
    const blogModule = await import('../pages/BlogData.js');
    (blogModule.blogPosts || []).forEach(p => {
      if (p?.slug) urls.push({ loc: `/blog/${p.slug}`, changefreq: 'weekly', priority: 0.7, lastmod: today });
    });
  } catch {}
  seoTimers.forEach(t => { if (t?.slug) urls.push({ loc: `/timer/${t.slug}`, changefreq: 'weekly', priority: 0.8, lastmod: today }); });
  return urls;
}
async function main() {
  const urls = await buildUrls();
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => ` <url><loc>${BASE_URL}${u.loc}</loc><lastmod>${u.lastmod || today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}\n</urlset>`;
  fs.mkdirSync('public', { recursive: true });
  fs.mkdirSync('dist', { recursive: true });
  fs.writeFileSync('public/sitemap.xml', sitemap);
  fs.writeFileSync('dist/sitemap.xml', sitemap);
  fs.writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml`);
  console.log(`✅ Sitemap: ${urls.length} URLs`);
}
main();