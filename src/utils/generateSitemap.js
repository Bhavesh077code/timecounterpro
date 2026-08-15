
/*
// src/utils/generateSitemap.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Production URL - Change this to your domain
const BASE_URL = 'https://timecounterpro.com';

// ✅ Get current date for lastmod
const today = new Date().toISOString().split('T')[0];

// ✅ Load seoTimers with fallback
let seoTimers = [];
try {
  const seoTimersModule = await import('../data/seoTimers.js');
  seoTimers = seoTimersModule.default || seoTimersModule.seoTimers || [];
  console.log(`✅ Loaded ${seoTimers.length} SEO timer entries`);
} catch (error) {
  console.warn('⚠️ Could not load seoTimers:', error.message);
  seoTimers = [];
}

// ✅ Build all URLs with error handling
const buildUrls = async () => {
  const urls = [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/about', changefreq: 'monthly', priority: 0.5 },
    { loc: '/history', changefreq: 'weekly', priority: 0.6 },
    { loc: '/contact', changefreq: 'monthly', priority: 0.4 },
    { loc: '/privacy', changefreq: 'yearly', priority: 0.3 },
    { loc: '/terms', changefreq: 'yearly', priority: 0.3 },
  ];

  // ✅ Add blog URLs
  try {
    const blogModule = await import('../pages/BlogData.js');
    const blogPosts = blogModule.blogPosts || [];
    
    blogPosts.forEach(post => {
      if (post && post.slug) {
        urls.push({
          loc: `/blog/${post.slug}`,
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: today,
        });
      }
    });
  } catch (error) {
    console.warn('⚠️ Could not load blog posts:', error.message);
  }

  // ✅ Add all timer pages with safe check
  if (seoTimers && Array.isArray(seoTimers) && seoTimers.length > 0) {
    seoTimers.forEach(t => {
      if (t && t.slug) {
        urls.push({
          loc: `/timer/${t.slug}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: today,
        });
      }
    });
  }

  return urls;
};

// ✅ Generate sitemap XML with error handling
const generateSitemap = () => {
  try {
    const urls = await buildUrls();
    
    if (!urls || urls.length === 0) {
      console.warn('⚠️ No URLs found to generate sitemap');
      return false;
    }

    // ✅ Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(u => `
  <url>
    <loc>${BASE_URL}${u.loc}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('')}
</urlset>`;

    // ✅ Write to public folder
    const outputPath = path.join(__dirname, '../../public/sitemap.xml');
    
    // ✅ Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, sitemap, 'utf8');
    
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`📁 Location: ${outputPath}`);
    console.log(`📊 Total URLs: ${urls.length}`);
    console.log(`🌐 Base URL: ${BASE_URL}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error.message);
    return false;
  }
};

// ✅ Generate sitemap index (for large sitemaps)
const generateSitemapIndex = () => {
  try {
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

    const outputPath = path.join(__dirname, '../../public/sitemap-index.xml');
    fs.writeFileSync(outputPath, sitemapIndex, 'utf8');
    console.log(`✅ Sitemap index generated at: ${outputPath}`);
    return true;
  } catch (error) {
    console.warn('⚠️ Sitemap index generation skipped:', error.message);
    return false;
  }
};

// ✅ Generate robots.txt
const generateRobots = () => {
  try {
    const robots = `# robots.txt for TimeCounterPro
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-index.xml

# Crawl delay for bots
Crawl-delay: 1

# Host
Host: ${BASE_URL}`;

    const outputPath = path.join(__dirname, '../../public/robots.txt');
    fs.writeFileSync(outputPath, robots, 'utf8');
    console.log(`✅ robots.txt generated at: ${outputPath}`);
    return true;
  } catch (error) {
    console.warn('⚠️ robots.txt generation skipped:', error.message);
    return false;
  }
};

// ✅ Generate security.txt (optional but good for SEO)
const generateSecurity = () => {
  try {
    const security = `Contact: mailto:security@timecounterpro.com
Expires: ${new Date(Date.now() + 31536000000).toISOString().split('T')[0]}
Preferred-Languages: en
Canonical: ${BASE_URL}`;
    
    const outputPath = path.join(__dirname, '../../public/.well-known/security.txt');
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, security, 'utf8');
    console.log(`✅ security.txt generated at: ${outputPath}`);
    return true;
  } catch (error) {
    console.warn('⚠️ security.txt generation skipped:', error.message);
    return false;
  }
};

// ✅ Run all generators
const startTime = Date.now();

console.log('\n🚀 Starting SEO file generation...\n');

const sitemapSuccess = generateSitemap();
const indexSuccess = generateSitemapIndex();
const robotsSuccess = generateRobots();
const securitySuccess = generateSecurity();

const endTime = Date.now();
const duration = ((endTime - startTime) / 1000).toFixed(2);

console.log('\n📊 Summary:');
console.log(`  - Sitemap: ${sitemapSuccess ? '✅' : '❌'}`);
console.log(`  - Sitemap Index: ${indexSuccess ? '✅' : '❌'}`);
console.log(`  - robots.txt: ${robotsSuccess ? '✅' : '❌'}`);
console.log(`  - security.txt: ${securitySuccess ? '✅' : '❌'}`);
console.log(`  - Time taken: ${duration}s`);

if (sitemapSuccess && robotsSuccess) {
  console.log('\n🎉 All SEO files generated successfully!');
  console.log('📋 Files created:');
  console.log('  - public/sitemap.xml');
  console.log('  - public/sitemap-index.xml');
  console.log('  - public/robots.txt');
  console.log('  - public/.well-known/security.txt');
  console.log('\n🌐 Submit to Google Search Console:');
  console.log(`  1. Go to https://search.google.com/search-console`);
  console.log(`  2. Add property: ${BASE_URL}`);
  console.log(`  3. Go to Sitemaps → Add: sitemap.xml`);
  process.exit(0);
} else {
  console.log('\n❌ Some files failed to generate. Check logs above.');
  process.exit(1);
}

*/


// src/utils/generateSitemap.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Production URL - Change this to your domain
const BASE_URL = 'https://timecounterpro.com';

// ✅ Get current date for lastmod
const today = new Date().toISOString().split('T')[0];

// ✅ Load seoTimers with fallback
let seoTimers = [];
try {
  const seoTimersModule = await import('../data/seoTimers.js');
  seoTimers = seoTimersModule.default || seoTimersModule.seoTimers || [];
  console.log(`✅ Loaded ${seoTimers.length} SEO timer entries`);
} catch (error) {
  console.warn('⚠️ Could not load seoTimers:', error.message);
  seoTimers = [];
}

// ✅ Build all URLs with error handling
const buildUrls = async () => {
  const urls = [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/about', changefreq: 'monthly', priority: 0.5 },
    { loc: '/history', changefreq: 'weekly', priority: 0.6 },
    { loc: '/contact', changefreq: 'monthly', priority: 0.4 },
    { loc: '/privacy', changefreq: 'yearly', priority: 0.3 },
    { loc: '/terms', changefreq: 'yearly', priority: 0.3 },
  ];

  // ✅ Add blog URLs
  try {
    const blogModule = await import('../pages/BlogData.js');
    const blogPosts = blogModule.blogPosts || [];
    
    blogPosts.forEach(post => {
      if (post && post.slug) {
        urls.push({
          loc: `/blog/${post.slug}`,
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: today,
        });
      }
    });
  } catch (error) {
    console.warn('⚠️ Could not load blog posts:', error.message);
  }

  // ✅ Add all timer pages with safe check
  if (seoTimers && Array.isArray(seoTimers) && seoTimers.length > 0) {
    seoTimers.forEach(t => {
      if (t && t.slug) {
        urls.push({
          loc: `/timer/${t.slug}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: today,
        });
      }
    });
  }

  return urls;
};

// ✅ Generate sitemap XML with error handling
const generateSitemap = () => {
  try {
    const urls = await buildUrls();
    
    if (!urls || urls.length === 0) {
      console.warn('⚠️ No URLs found to generate sitemap');
      return false;
    }

    // ✅ Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(u => `
  <url>
    <loc>${BASE_URL}${u.loc}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('')}
</urlset>`;

    // ✅ Write to public folder
    const outputPath = path.join(__dirname, '../../public/sitemap.xml');
    
    // ✅ Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, sitemap, 'utf8');
    
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`📁 Location: ${outputPath}`);
    console.log(`📊 Total URLs: ${urls.length}`);
    console.log(`🌐 Base URL: ${BASE_URL}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error.message);
    return false;
  }
};

// ✅ Generate sitemap index (for large sitemaps)
const generateSitemapIndex = () => {
  try {
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

    const outputPath = path.join(__dirname, '../../public/sitemap-index.xml');
    fs.writeFileSync(outputPath, sitemapIndex, 'utf8');
    console.log(`✅ Sitemap index generated at: ${outputPath}`);
    return true;
  } catch (error) {
    console.warn('⚠️ Sitemap index generation skipped:', error.message);
    return false;
  }
};

// ✅ Generate robots.txt
const generateRobots = () => {
  try {
    const robots = `# robots.txt for TimeCounterPro
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-index.xml

# Crawl delay for bots
Crawl-delay: 1

# Host
Host: ${BASE_URL}`;

    const outputPath = path.join(__dirname, '../../public/robots.txt');
    fs.writeFileSync(outputPath, robots, 'utf8');
    console.log(`✅ robots.txt generated at: ${outputPath}`);
    return true;
  } catch (error) {
    console.warn('⚠️ robots.txt generation skipped:', error.message);
    return false;
  }
};

// ✅ Generate security.txt (optional but good for SEO)
const generateSecurity = () => {
  try {
    const security = `Contact: mailto:security@timecounterpro.com
Expires: ${new Date(Date.now() + 31536000000).toISOString().split('T')[0]}
Preferred-Languages: en
Canonical: ${BASE_URL}`;
    
    const outputPath = path.join(__dirname, '../../public/.well-known/security.txt');
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, security, 'utf8');
    console.log(`✅ security.txt generated at: ${outputPath}`);
    return true;
  } catch (error) {
    console.warn('⚠️ security.txt generation skipped:', error.message);
    return false;
  }
};

// ✅ Run all generators
const startTime = Date.now();

console.log('\n🚀 Starting SEO file generation...\n');

const sitemapSuccess = generateSitemap();
const indexSuccess = generateSitemapIndex();
const robotsSuccess = generateRobots();
const securitySuccess = generateSecurity();

const endTime = Date.now();
const duration = ((endTime - startTime) / 1000).toFixed(2);

console.log('\n📊 Summary:');
console.log(`  - Sitemap: ${sitemapSuccess ? '✅' : '❌'}`);
console.log(`  - Sitemap Index: ${indexSuccess ? '✅' : '❌'}`);
console.log(`  - robots.txt: ${robotsSuccess ? '✅' : '❌'}`);
console.log(`  - security.txt: ${securitySuccess ? '✅' : '❌'}`);
console.log(`  - Time taken: ${duration}s`);

if (sitemapSuccess && robotsSuccess) {
  console.log('\n🎉 All SEO files generated successfully!');
  console.log('📋 Files created:');
  console.log('  - public/sitemap.xml');
  console.log('  - public/sitemap-index.xml');
  console.log('  - public/robots.txt');
  console.log('  - public/.well-known/security.txt');
  console.log('\n🌐 Submit to Google Search Console:');
  console.log(`  1. Go to https://search.google.com/search-console`);
  console.log(`  2. Add property: ${BASE_URL}`);
  console.log(`  3. Go to Sitemaps → Add: sitemap.xml`);
  process.exit(0);
} else {
  console.log('\n❌ Some files failed to generate. Check logs above.');
  process.exit(1);
}