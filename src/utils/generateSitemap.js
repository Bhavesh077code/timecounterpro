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
    const data = mod.default || mod.seoTimers || [];
    console.log(`✅ Loaded ${data.length} SEO timer entries`);
    return data;
  } catch (e) {
    console.warn('⚠ Could not load seoTimers:', e.message);
    return [];
  }
}

async function buildUrls(seoTimers) {
  const urls = [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/about', changefreq: 'monthly', priority: 0.5 },
    { loc: '/history', changefreq: 'weekly', priority: 0.6 },
    { loc: '/contact', changefreq: 'monthly', priority: 0.4 },
    { loc: '/privacy', changefreq: 'yearly', priority: 0.3 },
    { loc: '/terms', changefreq: 'yearly', priority: 0.3 },
  ];
  try {
    const blogModule = await import('../pages/BlogData.js');
    const blogPosts = blogModule.blogPosts || [];
    blogPosts.forEach(post => {
      if (post?.slug) urls.push({ loc: `/blog/${post.slug}`, changefreq: 'weekly', priority: 0.7, lastmod: today });
    });
  } catch (e) {
    console.warn('⚠ Could not load blog posts:', e.message);
  }
  if (seoTimers?.length > 0) {
    seoTimers.forEach(t => {
      if (t?.slug) urls.push({ loc: `/timer/${t.slug}`, changefreq: 'weekly', priority: 0.8, lastmod: today });
    });
  }
  return urls;
}

async function generateAll() {
  console.log('\n🚀 Starting SEO file generation...\n');
  const seoTimers = await loadSeoTimers();
  const urls = await buildUrls(seoTimers);

  if (!urls.length) {
    console.warn('⚠ No URLs found');
    return false;
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => ` <url><loc>${BASE_URL}${u.loc}</loc><lastmod>${u.lastmod || today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;

  const publicPath = path.join(__dirname, '../../public/sitemap.xml');
  const distPath = path.join(__dirname, '../../dist/sitemap.xml');
  fs.mkdirSync(path.dirname(publicPath), { recursive: true });
  fs.writeFileSync(publicPath, sitemap, 'utf8');
  fs.mkdirSync(path.dirname(distPath), { recursive: true });
  fs.writeFileSync(distPath, sitemap, 'utf8');
  console.log(`✅ Sitemap generated: ${urls.length} URLs`);

  const robots = `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml`;
  fs.writeFileSync(path.join(__dirname, '../../public/robots.txt'), robots, 'utf8');
  fs.writeFileSync(path.join(__dirname, '../../dist/robots.txt'), robots, 'utf8');
  console.log('✅ robots.txt generated');
  return true;
}

generateAll().then(ok => {
  console.log(ok? '\n🎉 All done!' : '\n❌ Failed');
  process.exit(ok? 0 : 1);
});