# TimeCounterPro

Free online timers built with React 19, Vite and Tailwind CSS. 10 traffic pages and 4 trust pages.

## Pages
| URL | Page |
|---|---|
| `/` | Countdown timer (home) |
| `/pomodoro` | Pomodoro timer |
| `/stopwatch` | Online stopwatch |
| `/world-clock` | World clock and meeting planner |
| `/time-card-calculator-online` | Time card calculator |
| `/hiit-timer` | HIIT and Tabata timer |
| `/fasting-tracker-timer` | Intermittent fasting timer |
| `/mock-test-timer` | Sectional mock test timer |
| `/presentation-timer` | Presentation timer |
| `/meditation-timer-with-sound` | Meditation timer |
| `/create` | Create timer |
| `/about` `/contact` `/privacy` `/terms` | Trust pages (indexed, no ads) |

## Commands
```bash
npm install
npm run dev      # local development
npm run build    # client build + server render + prerender + sitemap
npm run preview  # serve dist locally
```

## How SEO works
- `src/data/siteRoutes.js` is the single source of truth: title, description, ads on/off, related pages, redirects for removed pages.
- `src/data/seoContent.js` holds the written guide and FAQ shown under each traffic page.
- `npm run build` renders every route to real HTML (`dist/*.html`) with `src/entry-server.jsx` + `src/scripts/prerender.mjs`. No headless Chrome is needed. The build fails if a traffic page has fewer than 600 visible words, no `<h1>`, or no canonical.
- `dist/404.html` gives unknown URLs a real 404; `dist/_redirects` 301-redirects removed pages.

## Ads
See `src/config/ads.js`. The AdSense script loads only on the 10 traffic pages. Paste your two ad-unit slot IDs there to show manual ads inside the written article.

## Deploy (Cloudflare)
Build command: `npm run build`. Output directory: `dist`. `wrangler.jsonc` is already set to serve `dist` with `404-page` handling.
