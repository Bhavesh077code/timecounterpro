// src/data/siteRoutes.js
//
// Single source of truth for every URL on the site.
//
// Used by:
//   scripts/generate-sitemap.mjs  -> builds public/sitemap.xml + dist/sitemap.xml
//   scripts/prerender.mjs         -> writes a real static HTML file per route
//
// If you add a page, add it here. Nothing else needs to change.

import seoTimers from "./seoTimers.js";
import timerContent from "./timerContext.js";

export const SITE_URL = "https://timecounterpro.com";

export const staticRoutes = [
  {
    path: "/",
    title: "TimeCounterPro - Free Countdown, Pomodoro & Stopwatch",
    description:
      "Free online countdown timer, Pomodoro focus timer and stopwatch for study, work, workouts and cooking. No registration, no download.",
    priority: "1.0",
    changefreq: "weekly",
  },
  {
    path: "/timers",
    title: "Online Timers for Study, Work, Cooking & Exercise | TimeCounterPro",
    description:
      "Browse 24 hand-written timer pages for study, Pomodoro, workouts, cooking, meditation, classrooms and meetings. Free and no signup.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/pomodoro",
    title: "Pomodoro Timer Online - Free Focus Timer with Breaks",
    description:
      "A free online Pomodoro timer with focus intervals and breaks, plus a practical guide to using the technique for study and deep work.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/stopwatch",
    title: "Online Stopwatch - Free Stopwatch with Lap Times",
    description:
      "A free online stopwatch for workouts, practice, cooking and any task where you need to measure how long something actually takes.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/world-clock",
    title: "World Clock - Current Time in Cities Around the World",
    description:
      "Check the current local time across major cities and time zones. Useful for scheduling calls and meetings across countries.",
    priority: "0.8",
    changefreq: "daily",
  },
  {
    path: "/about",
    title: "About TimeCounterPro - Who Builds This Timer",
    description:
      "Who makes TimeCounterPro, why it exists, how the timers are built and how the site is funded.",
    priority: "0.6",
    changefreq: "monthly",
  },
  {
    path: "/contact",
    title: "Contact TimeCounterPro - Feedback, Bugs & Requests",
    description:
      "Get in touch with TimeCounterPro about a bug, a feature request, a correction or a partnership enquiry.",
    priority: "0.6",
    changefreq: "monthly",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | TimeCounterPro",
    description:
      "How TimeCounterPro handles data, local storage, cookies and third-party advertising, explained in plain language.",
    priority: "0.4",
    changefreq: "monthly",
  },
  {
    path: "/terms",
    title: "Terms of Service | TimeCounterPro",
    description:
      "The terms that apply when you use the timers, stopwatch and other tools on TimeCounterPro.",
    priority: "0.4",
    changefreq: "monthly",
  },
];

// Routes that exist for users but should never be indexed:
// they hold no content for a first-time visitor (History reads local storage,
// share links are user-generated, /404 is an error page).
export const noindexRoutes = ["/history"];

export const timerRoutes = seoTimers
  .filter((timer) => Boolean(timerContent[timer.slug]))
  .map((timer) => {
    const content = timerContent[timer.slug];
    return {
      path: `/timer/${timer.slug}`,
      title: content.metaTitle,
      description: content.metaDescription,
      priority: "0.7",
      changefreq: "monthly",
    };
  });

export const allRoutes = [...staticRoutes, ...timerRoutes];

export default allRoutes;
