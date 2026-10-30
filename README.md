# TimeCounterPro

Free browser-based timers and time tools built with React 19, Vite and Tailwind CSS.

## Public pages

| URL | Page |
|---|---|
| `/` | Online countdown timer |
| `/pomodoro` | Pomodoro focus timer |
| `/stopwatch` | Online stopwatch |
| `/world-clock` | World clock and time-zone comparison |
| `/time-card-calculator` | Time card calculator |
| `/hiit-timer` | HIIT and Tabata timer |
| `/fasting-tracker-timer` | Fasting time log |
| `/mock-test-timer` | Sectional mock test timer |
| `/presentation-timer` | Presentation timer |
| `/10-minute-timer` | Ten-minute focus tree timer |
| `/meditation-timer-with-sound` | Meditation timer |
| `/rubiks-cube-timer` | Rubik's Cube speed timer |
| `/create` | Custom timer builder |
| `/about`, `/contact`, `/privacy`, `/terms` | Site information and trust pages |

`/history` is a private utility route and is marked `noindex`.

## Commands

```bash
npm install
npm run dev      # local development
npm run build    # client build, SSR render, prerender and sitemap
npm run preview  # serve dist locally
```

## How SEO works

- `src/data/siteRoutes.js` is the source of truth for public URLs, titles, descriptions, canonicals, related links and ad eligibility.
- Each page component contains its own visible guide and FAQ content. The shared duplicate SEO article layer has been removed so visitors do not see two overlapping guides.
- `src/components/Seo.jsx` outputs page-specific title, description, canonical, robots, Open Graph, Twitter and WebApplication/Breadcrumb JSON-LD.
- `src/entry-server.jsx` and `src/scripts/prerender.mjs` render each route into static HTML so crawlers can read the page content without relying on client-side rendering.
- The prerender check verifies an H1 (except noindex utility pages), title, description and canonical. It does not require an arbitrary word count.
- `src/scripts/generate-sitemap.mjs` builds the sitemap from indexable routes. It only writes `lastmod` when a route has an explicit date.

## Ads

AdSense script eligibility is controlled by `ads` in `src/data/siteRoutes.js`. Manual ad units also need real slot IDs in `src/config/ads.js`; the current slot values are blank, so manual ad units will not render until valid IDs are added.

## Deploy

Build command: `npm run build`. Output directory: `dist`. Check the hosting provider's routing and redirect rules before deploying.
