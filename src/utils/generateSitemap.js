// Generates a curated sitemap. Low-value/generated variants are intentionally
// not submitted to search engines until they have enough unique editorial value.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import seoTimers from '../data/seoTimers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseUrl = 'https://timecounterpro.com';
const today = new Date().toISOString().split('T')[0];

const curatedTimerSlugs = [
  '5-minute-timer','10-minute-timer','15-minute-timer','20-minute-timer','25-minute-timer',
  '30-minute-timer','45-minute-timer','60-minute-timer','pomodoro-timer','pomodoro-25-5',
  'pomodoro-50-10','study-timer','workout-timer','cooking-timer','meditation-timer','meditation-timer-with-sound',"meditation-timer-10-minutes","study-timer-45-minutes","102-minute-timer-with-sound",
  'classroom-timer','meeting-timer','exam-timer','reading-timer','coding-timer'
];

const blogSlugs = [
  'meditation-timer-guide-mindfulness',
  '10-minute-timer-guide',
  'weight-of-the-red-stamp-mistakes'
];

const staticPages = [
  ['/', '1.0'], ['/timers', '0.9'], ['/pomodoro', '0.8'], ['/stopwatch', '0.8'],
  ['/blog', '0.8'], ['/about', '0.6'], ['/contact', '0.6'], ['/privacy', '0.4'],
  ['/terms', '0.4'],['/world-clock', '0.9'],
];

const urls = [];
for (const [loc, priority] of staticPages) urls.push({ loc, priority });
for (const slug of curatedTimerSlugs) {
  if (seoTimers.some((timer) => timer.slug === slug)) urls.push({ loc: `/timer/${slug}`, priority: '0.7' });
}
for (const slug of blogSlugs) urls.push({ loc: `/blog/${slug}`, priority: '0.7' });

const body = urls.map(({ loc, priority }) => `  <url>\n    <loc>${baseUrl}${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${loc.startsWith('/blog') ? 'monthly' : 'weekly'}</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

const distPath = path.join(__dirname, '../../dist/sitemap.xml');
const publicPath = path.join(__dirname, '../../public/sitemap.xml');
try { fs.writeFileSync(distPath, sitemap); } catch {}
try { fs.writeFileSync(publicPath, sitemap); } catch {}
console.log(`Sitemap generated: ${urls.length} curated URLs; excluded uncurated timer variants.`);
