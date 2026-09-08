// src/utils/generateSitemap.js - ✅ FINAL - Sirf 3 blogs, 9 nahi
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { seoTimers } from '../data/seoTimers.js';

const baseUrl = 'https://timecounterpro.com';
const today = new Date().toISOString().split('T')[0];

// ✅ SIRF TERE 3 BLOGS - Aur koi nahi
const manualBlogSlugs = [
  'meditation-timer-guide-mindfulness',
  '10-minute-timer-guide',
  'weight-of-the-red-stamp-mistakes'
];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/timer', priority: '0.9', changefreq: 'daily' },
  { loc: '/blog', priority: '0.8', changefreq: 'daily' },
  { loc: '/about', priority: '0.6', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.6', changefreq: 'monthly' },
];

staticPages.forEach(page => {
  sitemap += `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
});

seoTimers.forEach(timer => {
  sitemap += `  <url>
    <loc>${baseUrl}/timer/${timer.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
});

manualBlogSlugs.forEach(slug => {
  sitemap += `  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
});

sitemap += `</urlset>`;

const distPath = path.join(__dirname, '../../dist/sitemap.xml');
const publicPath = path.join(__dirname, '../../public/sitemap.xml');

try { fs.writeFileSync(distPath, sitemap); } catch {}
try { fs.writeFileSync(publicPath, sitemap); } catch {}

console.log(`✅ Sitemap: ${staticPages.length} static + ${seoTimers.length} timers + ${manualBlogSlugs.length} blogs = ${staticPages.length + seoTimers.length + manualBlogSlugs.length} URLs`);
console.log(`✅ Blogs: ${manualBlogSlugs.join(', ')}`);