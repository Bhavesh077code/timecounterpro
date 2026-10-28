
// src/data/siteRoutes.js
//
// SINGLE SOURCE OF TRUTH for every public page on TimeCounterPro.
//
// It feeds:
//   - <Seo> (title, description, canonical, robots, JSON-LD)       -> src/components/Seo.jsx
//   - the build-time prerender (static HTML per route)             -> src/scripts/prerender.mjs
//   - sitemap.xml                                                  -> src/scripts/generate-sitemap.mjs
//   - ad eligibility (which pages may load AdSense)                -> src/config/ads.js
//
// Site focus: 10 traffic pages + 4 trust pages (About, Contact, Privacy, Terms).
// Everything else was removed because it had no realistic search demand
// and made the site look thin to AdSense reviewers.

export const SITE_URL = "https://timecounterpro.com";

export const staticRoutes = [
  // ============================================================
  // 10 TRAFFIC PAGES  (indexed, ads allowed)
  // ============================================================
  {
    path: "/",
    name: "Online Countdown Timer",
    title: "Online Countdown Timer - Free Timer, Stopwatch & Pomodoro",
    description:
      "Set a free online countdown timer in seconds. Fullscreen display, alarm sounds, shareable links and history. No sign-up, no download, works on any device.",
    appCategory: "UtilitiesApplication",
    priority: "1.0",
    changefreq: "weekly",
    ads: true,
    related: ["/pomodoro", "/stopwatch", "/presentation-timer", "/world-clock"],
  },
  {
    path: "/pomodoro",
    name: "Pomodoro Timer",
    title: "Free Online Pomodoro Timer - Focus Clock with Ambient Sounds & Lofi Music",
    description:
      "Free online Pomodoro timer with 25-minute focus sessions and 5-minute breaks. Sound alerts, session count and daily focus stats. No sign-up needed.",
    appCategory: "ProductivityApplication",
    priority: "0.95",
    changefreq: "weekly",
    ads: true,
    related: ["/", "/stopwatch", "/meditation-timer-with-sound", "/mock-test-timer"],
  },
  {
    path: "/stopwatch",
    name: "Online Stopwatch",
    title: "Online Stopwatch - Free Stopwatch with Lap Timer",
    description:
      "Free online stopwatch with hundredth-of-a-second precision and unlimited laps. Start, pause, split and reset in one click. No download or sign-up.",
    appCategory: "UtilitiesApplication",
    priority: "0.95",
    changefreq: "weekly",
    ads: true,
    related: ["/", "/hiit-timer", "/pomodoro", "/presentation-timer"],
  },
  {
    path: "/world-clock",
    name: "World Clock",
    title: "World Clock & Time Zone Converter - Live Meeting Planner",
    description:
      "Live world clock with a time zone converter and meeting planner. Compare cities, find overlapping working hours and plan calls across time zones.",
    appCategory: "UtilitiesApplication",
    priority: "0.9",
    changefreq: "daily",
    ads: true,
    related: ["/", "/time-card-calculator-online", "/presentation-timer", "/stopwatch"],
  },
  {
    path: "/time-card-calculator-online",
    name: "Time Card Calculator",
    title: "Free Time Card Calculator Online - Calculate Hours, Breaks & Gross Pay (CSV Export)",
    description:
      "Free time card calculator. Enter clock in, clock out and breaks to get daily and weekly hours, overtime and total pay. Copy your timesheet in seconds.",
    appCategory: "BusinessApplication",
    priority: "0.95",
    changefreq: "weekly",
    ads: true,
    related: ["/world-clock", "/stopwatch", "/", "/presentation-timer"],
  },
  {
    path: "/hiit-timer",
    name: "HIIT & Tabata Timer",
    title: "Interval Training Timer Online - Full Screen Workout & Circuit Clock with Audio Beeps",
    description:
      "Free HIIT and Tabata interval timer. Set work, rest and rounds, hear audio cues and follow your workout on any screen. No app or sign-up needed.",
    appCategory: "HealthApplication",
    priority: "0.9",
    changefreq: "weekly",
    ads: true,
    related: ["/stopwatch", "/fasting-tracker-timer", "/meditation-timer-with-sound", "/"],
  },
  {
    path: "/fasting-tracker-timer",
    name: "Intermittent Fasting Timer",
    title: "Intermittent Fasting Timer - Free 16:8 Fasting Tracker",
    description:
      "Free intermittent fasting timer for 16:8, 18:6 and 20:4. See fasting stages, track water and keep a fasting history, saved privately in your browser.",
    appCategory: "HealthApplication",
    priority: "0.9",
    changefreq: "weekly",
    ads: true,
    related: ["/hiit-timer", "/meditation-timer-with-sound", "/", "/stopwatch"],
  },
  {
    path: "/mock-test-timer",
    name: "Mock Test Timer",
    title: "Sectional Mock Test Timer with Alarm Alerts - Practice Clocks for JEE, UPSC, CAT and GRE",
    description:
      "Free sectional mock test timer with locked sections, warning alerts and fullscreen mode. Practise CAT, JEE, GRE, UPSC and other timed exams at home.",
    appCategory: "EducationalApplication",
    priority: "0.9",
    changefreq: "weekly",
    ads: true,
    related: ["/pomodoro", "/stopwatch", "/meditation-timer-with-sound", "/"],
  },
  {
    path: "/presentation-timer",
    name: "Presentation Timer",
    title: "Presentation Timer - Full Screen Speech & Talk Countdown",
    description:
      "Free full-screen presentation timer for talks, speeches and meetings. Pick 5 to 60 minutes; colours shift from green to amber to red as time runs low.",
    appCategory: "BusinessApplication",
    priority: "0.9",
    changefreq: "weekly",
    ads: true,
    related: ["/", "/stopwatch", "/world-clock", "/pomodoro"],
  },
  {
    path: "/create",
    name: "Create Timers",
    title: "Create Timers - Free Online Stopwatch, Timer and Clock",
    description:
      "Free online stopwatch, timer and clock. Set time, split, reset and pause in seconds. No sign-up or download.",
    appCategory: "UtilitiesApplication",
    priority: "0.9",
    changefreq: "weekly",
    ads: true,
    related: ["/", "/stopwatch", "/hiit-timer", "/meditation-timer-with-sound"],
  },
  {
    path: "/10-minute-timer",
    name: "10 Minute Timer",
    title: "10 Minute Timer - Free Online Stopwatch, Timer and Clock",
    description:
      "Free online stopwatch, timer and clock. Set time, split, reset and pause in seconds. No sign-up or download.",
    appCategory: "UtilitiesApplication",
    priority: "0.9",
    changefreq: "weekly",
    ads: true,
    related: ["/", "/stopwatch", "/hiit-timer", "/meditation-timer-with-sound"],
  },
  {
    path: "/meditation-timer-with-sound",
    name: "Meditation Timer",
    title: "Meditation Timer with Sound - Free Online Breathing Timer",
    description:
      "Free meditation timer with a breathing circle, bell and singing-bowl sounds and ambient rain. Quiet 5-minute sessions in your browser, no sign-up.",
    appCategory: "HealthApplication",
    priority: "0.9",
    changefreq: "weekly",
    ads: true,
    related: ["/pomodoro", "/hiit-timer", "/fasting-tracker-timer", "/"],
  },

  // ============================================================
  // TRUST PAGES (indexed, NO ads)
  // ============================================================
  {
    path: "/about",
    name: "About",
    title: "About TimeCounterPro - Free Online Timers and Clocks",
    description:
      "Who builds TimeCounterPro, why it exists and how the timers work. A free, privacy-friendly set of online timers, stopwatch and clocks.",
    priority: "0.5",
    changefreq: "monthly",
    ads: false,
    info: true,
  },
  {
    path: "/contact",
    name: "Contact",
    title: "Contact TimeCounterPro - Report a Bug or Suggest a Feature",
    description:
      "Found a bug or want a new timer feature? Contact the TimeCounterPro team. We read every message.",
    priority: "0.4",
    changefreq: "monthly",
    ads: false,
    info: true,
  },
  {
    path: "/privacy",
    name: "Privacy Policy",
    title: "Privacy Policy - TimeCounterPro",
    description:
      "How TimeCounterPro handles cookies, browser storage and advertising. Your timers stay in your own browser.",
    priority: "0.3",
    changefreq: "monthly",
    ads: false,
    info: true,
  },
  {
    path: "/terms",
    name: "Terms of Service",
    title: "Terms of Service - TimeCounterPro",
    description:
      "The terms that apply when you use TimeCounterPro's free online timers, clocks and calculators.",
    priority: "0.3",
    changefreq: "monthly",
    ads: false,
    info: true,
  },
];

// Pages that exist and are prerendered but must never be indexed or monetised.
export const utilityRoutes = [
  {
    path: "/history",
    name: "Timer History",
    title: "Timer History - TimeCounterPro",
    description: "Your completed timers, stored privately in this browser.",
    noindex: true,
    ads: false,
    sitemap: false,
  },
];

// Pages that were deleted. Each is 301-redirected to the closest live page
// (written to dist/_redirects by src/scripts/prerender.mjs) so old links and
// any link equity are not lost.

export const routeCategories = {
  core: ["/", "/create", "/pomodoro", "/stopwatch", "/world-clock"],
  study: ["/mock-test-timer","10-minutes-timer", "/meditation-timer-with-sound", "/presentation-timer"],
  health: ["/hiit-timer", "/fasting-tracker-timer"],
  work: ["/time-card-calculator-online"],
  info: ["/about", "/contact", "/privacy", "/terms"],
};

export const allRoutes = [...staticRoutes, ...utilityRoutes];
export const sitemapRoutes = staticRoutes.filter((r) => r.sitemap !== false && !r.noindex);
export const trafficRoutes = staticRoutes.filter((r) => !r.info);
export const adRoutePaths = staticRoutes.filter((r) => r.ads).map((r) => r.path);

export const getRoute = (path) => allRoutes.find((r) => r.path === path);
export default allRoutes;
