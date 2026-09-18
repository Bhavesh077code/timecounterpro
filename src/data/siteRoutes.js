// src/data/siteRoutes.js

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
    path: "/create",
    title: "Online Timers | TimeCounterPro",
    description:
      "Free online timers for study, work, cooking, exercise and everyday tasks.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/pomodoro",
    title: "Pomodoro Timer Online - Free Focus Timer with Breaks",
    description:
      "A free online Pomodoro timer for focused work and study.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/stopwatch",
    title: "Online Stopwatch - Free Stopwatch with Lap Times",
    description:
      "A free online stopwatch for workouts, practice, cooking and everyday tasks.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/world-clock",
    title: "World Clock - Current Time in Cities Around the World",
    description:
      "Check the current local time across major cities and time zones.",
    priority: "0.8",
    changefreq: "daily",
  },
  {
    path: "/about",
    title: "About TimeCounterPro",
    description:
      "Learn about TimeCounterPro, its timers and how the website works.",
    priority: "0.6",
    changefreq: "monthly",
  },
  {
    path: "/contact",
    title: "Contact TimeCounterPro",
    description:
      "Contact TimeCounterPro for feedback, bugs and feature requests.",
    priority: "0.6",
    changefreq: "monthly",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | TimeCounterPro",
    description:
      "Learn how TimeCounterPro handles data, storage and cookies.",
    priority: "0.4",
    changefreq: "monthly",
  },
  {
    path: "/terms",
    title: "Terms of Service | TimeCounterPro",
    description:
      "Terms that apply when using TimeCounterPro.",
    priority: "0.4",
    changefreq: "monthly",
  },
  {
    path: "/history",
    title: "Your Timer History | TimeCounterPro",
    description:
      "View and manage your timer history.",
    priority: "0.2",
    changefreq: "monthly",
  },
];

export const noindexRoutes = ["/history"];

export const allRoutes = staticRoutes;

export default allRoutes;