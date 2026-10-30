
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
// Site focus: curated tool pages plus trust pages (About, Contact, Privacy, Terms).
// Keep the public route list focused. Each page owns its visible guide and FAQs.

export const SITE_URL = "https://timecounterpro.com";

export const staticRoutes = [
  // ============================================================
  // Main traffic pages (indexed; ads are enabled only where configured)
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
    title: "Pomodoro Timer Online - Free 25-Minute Focus Timer",
    description:
      "Use a simple Pomodoro timer for focused work and study. Set a focus session, take a break, and track completed sessions with optional ambient sound.",
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
    path: "/rubiks-cube-timer",
    name: "Online Rubik's Cube Stopwatch",
    title: "Rubik's Cube Timer - Online Speedcubing Stopwatch",
    description:
      "Time your Rubik's Cube solves with a scramble generator, inspection countdown, +2 and DNF penalties, and solve history. Practice in your browser without an account.",
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
    related: ["/", "/time-card-calculator", "/presentation-timer", "/stopwatch"],
  },
  {
    path: "/time-card-calculator",
    name: "Time Card Calculator",
    title: "Time Card Calculator - Weekly Hours, Overtime & Pay",
    description:
      "Calculate shift hours, unpaid breaks, weekly totals, overtime and estimated pay. Save entries in your browser, copy a summary or export a CSV timesheet.",
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
      "A browser-based fasting time log with elapsed-time display, water tracking and local history. It does not measure metabolic changes or provide medical advice.",
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
    title: "Custom Timer Maker - Create a Free Online Countdown",
    description:
      "Build a countdown for the task you choose. Give it a name, set the duration and use your custom timer in the browser without creating an account.",
    appCategory: "UtilitiesApplication",
    priority: "0.9",
    changefreq: "weekly",
    ads: true,
    related: ["/", "/stopwatch", "/hiit-timer", "/meditation-timer-with-sound"],
  },
  {
    path: "/10-minute-timer",
    name: "10 Minute Timer",
    title: "10-Minute Focus Timer - Grow a Tree While You Work",
    description:
      "Start a ten-minute focus session with a growing-tree visual. Use a short work block to begin a task, pause when needed and build a steady routine.",
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

// Groupings used for internal navigation and reporting.
export const routeCategories = {
  core: ["/", "/create", "/pomodoro", "/stopwatch", "/world-clock"],
  study: ["/mock-test-timer", "/10-minute-timer", "/meditation-timer-with-sound", "/presentation-timer"],
  health: ["/hiit-timer", "/fasting-tracker-timer"],
  work: ["/time-card-calculator", "/rubiks-cube-timer"],
  info: ["/about", "/contact", "/privacy", "/terms"],
};

export const allRoutes = [...staticRoutes, ...utilityRoutes];
export const sitemapRoutes = staticRoutes.filter((r) => r.sitemap !== false && !r.noindex);
export const trafficRoutes = staticRoutes.filter((r) => !r.info);
export const adRoutePaths = staticRoutes.filter((r) => r.ads).map((r) => r.path);

export const getRoute = (path) => allRoutes.find((r) => r.path === path);
export default allRoutes;
