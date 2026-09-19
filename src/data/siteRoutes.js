// src/data/siteRoutes.js

export const SITE_URL = "https://timecounterpro.com";

export const staticRoutes = [
  // ============================================
  // CORE PAGES
  // ============================================
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
    title: "Create Custom Timer Online - Free Countdown Builder | TimeCounterPro",
    description:
      "Build your own custom countdown timer with personalized durations, labels, sounds and colors. Free online timer for study, work, cooking and workouts.",
    priority: "0.9",
    changefreq: "weekly",
  },

  // ============================================
  // STUDY & PRODUCTIVITY TIMERS
  // ============================================
  {
    path: "/pomodoro",
    title: "Pomodoro Timer Online - Free Focus Timer with Breaks",
    description:
      "Free online Pomodoro timer for focused work and study. Customizable 25/5 intervals, session tracking and notification alerts. No sign-up required.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/stopwatch",
    title: "Online Stopwatch - Free Stopwatch with Lap Times",
    description:
      "A free online stopwatch with millisecond precision, lap times and split tracking. Perfect for workouts, practice sessions and everyday timing.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/mock-test-timer",
    title: "Free Mock Test Sectional Timer - CAT, JEE, GRE, UPSC Practice",
    description:
      "Free online sectional mock test timer for CAT, JEE, GRE, GMAT and UPSC practice. Auto-locks sections with warning beeps, exactly like real exam portals.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/group-study-timer",
    title: "Group Study Multi-Timer Grid - Free Virtual Study Room Timer",
    description:
      "Free 2x2 multi-timer grid for group study sessions. Run four independent countdown timers in parallel with editable names and custom durations.",
    priority: "0.85",
    changefreq: "weekly",
  },

  // ============================================
  // FITNESS & HEALTH TIMERS
  // ============================================
  {
    path: "/hiit-timer",
    title: "Free HIIT & Tabata Interval Timer Online - Work & Rest Countdown",
    description:
      "Free HIIT and Tabata interval timer with customizable work/rest periods, cycle tracking and audio cues. Perfect for high-intensity workouts at home or the gym.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/fasting-tracker-timer",
    title: "Intermittent Fasting Tracker Clock - Free 16:8, 18:6, 20:4 Timer",
    description:
      "Free intermittent fasting tracker with live count-up and count-down clocks, metabolic phase indicators, water intake tracker and fasting history. Track 16:8, 18:6, 20:4 and custom protocols.",
    priority: "0.9",
    changefreq: "weekly",
  },

  // ============================================
  // STREAMING & ESPORTS TIMERS
  // ============================================
  {
    path: "/stream-timer",
    title: "Free Twitch & OBS Stream Countdown Overlay Timer",
    description:
      "Free stream countdown overlay for Twitch, YouTube Live and OBS Studio. Chroma-key green or pitch-black backgrounds, keyboard hotkeys and embed code included.",
    priority: "0.85",
    changefreq: "weekly",
  },
  {
    path: "/jungle-timer",
    title: "Esports Jungle Buff Timer - Multi-Objective MOBA Timer",
    description:
      "Free multi-objective jungle timer for League of Legends, Dota 2 and Wild Rift. Track Baron, Dragon, Blue/Red Buff and Scuttle respawns independently.",
    priority: "0.8",
    changefreq: "weekly",
  },
  {
    path: "/speed-timer",
    title: "Speedrun Split Stopwatch - Free Millisecond Precision Timer",
    description:
      "Free speedrun split stopwatch with millisecond precision, split logging, delta variance and baseline comparison. Matches speedrun.com standards.",
    priority: "0.8",
    changefreq: "weekly",
  },

  // ============================================
  // GAMING TIMERS
  // ============================================
  {
    path: "/gameplay-timer",
    title: "Game Timer - Free Arcade Challenge with 2 Mini-Games",
    description:
      "Free arcade countdown timer with 2 unique mini-games: Tap Target and Simon Says. Beat the clock, score points and improve your reaction time. No sign-up required.",
    priority: "0.85",
    changefreq: "weekly",
  },


  // ============================================
  // PROFESSIONAL & PRESENTATION TIMERS
  // ============================================
  {
    path: "/presentation-timer",
    title: "Presentation & Speech Timer - Stage Warning Countdown",
    description:
      "Free presentation and public speaking timer with giant full-screen display, dynamic color warnings (green → amber → red) and stage-ready visibility from across an auditorium.",
    priority: "0.85",
    changefreq: "weekly",
  },
  {
    path: "/world-clock",
    title: "World Clock - Live Time in Cities Around the World | Remote Team Tool",
    description:
      "Free world clock dashboard for remote teams. Live times across San Francisco, New York, London, Berlin, Mumbai, Tokyo, Singapore and Sydney with a time-travel planning slider.",
    priority: "0.85",
    changefreq: "daily",
  },

  // ============================================
  // INFORMATION PAGES
  // ============================================
  {
    path: "/about",
    title: "About TimeCounterPro - Free Online Timers & Tools",
    description:
      "Learn about TimeCounterPro, our collection of free online timers, and how our tools help students, professionals, athletes and streamers stay on schedule.",
    priority: "0.6",
    changefreq: "monthly",
  },
  {
    path: "/contact",
    title: "Contact TimeCounterPro - Feedback, Bugs & Feature Requests",
    description:
      "Contact TimeCounterPro for feedback, bug reports or new timer feature requests. We reply within 48 hours.",
    priority: "0.6",
    changefreq: "monthly",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | TimeCounterPro",
    description:
      "Learn how TimeCounterPro handles data, local storage and cookies. No personal information is collected.",
    priority: "0.4",
    changefreq: "monthly",
  },
  {
    path: "/terms",
    title: "Terms of Service | TimeCounterPro",
    description:
      "Terms and conditions that apply when using TimeCounterPro and its online timers.",
    priority: "0.4",
    changefreq: "monthly",
  },
  {
    path: "/history",
    title: "Your Timer History | TimeCounterPro",
    description:
      "View and manage your personal timer history. All data is stored locally in your browser.",
    priority: "0.2",
    changefreq: "monthly",
  },
];

// ============================================
// NOINDEX ROUTES — don't index in Google
// ============================================


// ============================================
// CATEGORIES for navbar/footer organization
// ============================================
export const routeCategories = {
  study: ["/pomodoro", "/mock-test", "/group-study", "/create"],
  fitness: ["/hiit-timer", "/fasting-timer"],
  gaming: ["/stream-overlay", "/jungle-timer", "/speedrun-timer"],
  professional: ["/presentation-timer", "/world-clock"],
  info: ["/about", "/contact", "/privacy", "/terms"],
};

// ============================================
// EXPORTS
// ============================================
export const allRoutes = staticRoutes;

export default allRoutes;