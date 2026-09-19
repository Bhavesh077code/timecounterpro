// src/data/siteRoutes.js

export const SITE_URL = "https://timecounterpro.com";

export const staticRoutes = [
  // ============================================
  // CORE PAGES
  // ============================================
  {
    path: "/",
    title: "100% Free Online Timer - Countdown Clock & Stopwatch",
    description:
      "Looking for a reliable timer? Use TimeCounterPro for a free online countdown, Pomodoro tracker, and stopwatch. Clean, fast, and no registration required!",
    priority: "1.0",
    changefreq: "weekly",
  },
  {
    path: "/create",
    title: "Create Custom Timer Online - Make Your Own Countdown Clock",
    description:
      "Design your personal timer in seconds! Customize names, colors, alarm sounds, and exact durations. The ultimate free countdown builder online.",
    priority: "0.9",
    changefreq: "weekly",
  },

  // ============================================
  // STUDY & PRODUCTIVITY TIMERS
  // ============================================
  {
    path: "/pomodoro",
    title: "Pomodoro Timer Online - Beat Procrastination & Stay Focused",
    description:
      "Boost your focus instantly with our free Pomodoro timer. Fully customizable 25/5 minute intervals with desktop alert sounds to maximize your productivity.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/stopwatch",
    title: "Online Stopwatch - Precise Chronometer with Lap Times",
    description:
      "Track time down to the millisecond! An accurate online stopwatch with unlimited lap splits. Perfect for runners, athletes, and workplace efficiency.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/mock-test-timer",
    title: "Exam Sectional Mock Test Timer - Practice CAT, JEE, UPSC Online",
    description:
      "Simulate real exam portals! Free sectional mock test timer with auto-locking screens and warning buzzers for competitive exams like CAT, JEE, GRE, and UPSC.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/group-study-timer",
    title: "Group Study Multi-Timer Grid - 4 Clocks on One Screen",
    description:
      "Manage multiple tasks at once! A unique 2x2 multi-timer grid for virtual classrooms and group studies. Run 4 independent countdowns simultaneously.",
    priority: "0.85",
    changefreq: "weekly",
  },

  // ============================================
  // FITNESS & HEALTH TIMERS
  // ============================================
  {
    path: "/hiit-timer",
    title: "HIIT & Tabata Interval Timer - Custom Work Rest Countdown",
    description:
      "Crush your fitness goals! Free online interval timer for HIIT, Tabata, and home gym workouts. Easily adjust rounds, work cycles, and recovery periods.",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    path: "/fasting-tracker-timer",
    title: "Intermittent Fasting Tracker Clock - Free 16:8 & 18:6 Fast Timer",
    description:
      "Track your fasting window effortlessly. Features preset clocks for 16:8, 18:6, and 20:4 fasting protocols, water tracking, and a live progress calendar.",
    priority: "0.9",
    changefreq: "weekly",
  },

  // ============================================
  // STREAMING & ESPORTS TIMERS
  // ============================================
  {
    path: "/stream-timer",
    title: "Twitch & OBS Stream Countdown Overlay - Chroma Green Screen",
    description:
      "Upgrade your stream quality! Free countdown overlay for OBS Studio and Twitch. Features hotkey support, black/green background controls, and quick embed codes.",
    priority: "0.85",
    changefreq: "weekly",
  },
  {
    path: "/jungle-timer",
    title: "MOBA Esports Jungle Buff Timer - Live Respawn Tracker",
    description:
      "Never lose an objective! Multi-target jungle clock for League of Legends, Dota 2, and Wild Rift. Tracks Baron, Dragon, and Buff camps simultaneously.",
    priority: "0.8",
    changefreq: "weekly",
  },
  {
    path: "/speed-timer",
    title: "Speedrun Split Stopwatch - Professional Millisecond Timer",
    description:
      "Track your speedrun progress like a pro! High-precision split stopwatch with delta variance calculation, fully compliant with speedrun.com rules.",
    priority: "0.8",
    changefreq: "weekly",
  },

  // ============================================
  // GAMING TIMERS
  // ============================================
  {
    path: "/gameplay-timer",
    title: "Arcade Game Timer - Test Your Reaction Time Online",
    description:
      "Beat the ticking clock! Play 2 interactive mini-games (Tap Target and Simon Says) inside a countdown window to train your focus and hand-eye coordination.",
    priority: "0.85",
    changefreq: "weekly",
  },

  // ============================================
  // PROFESSIONAL & PRESENTATION TIMERS
  // ============================================
  {
    path: "/presentation-timer",
    title: "Presentation & Speech Timer - Full Screen Color Alert Clock",
    description:
      "Never run out of time on stage! A massive full-screen speech timer that automatically transitions colors (Green → Amber → Red) as your time runs out.",
    priority: "0.85",
    changefreq: "weekly",
  },
  {
    path: "/world-clock",
    title: "World Clock Dashboard - Live Global Meeting Time Planner",
    description:
      "Coordinate international meetings instantly! Track current times in major tech hubs (San Francisco, London, Mumbai, Tokyo) with a built-in time slider.",
    priority: "0.85",
    changefreq: "daily",
  },
  {
    path: "/world-clock-board-timer",
    title: "Multi-City Time Zone Board - Remote Team Planning Tool",
    description:
      "Say goodbye to time zone confusion. Compare multiple global locations side-by-side on an interactive dashboard designed for remote operations.",
    priority: "0.8",
    changefreq: "daily",
  },

  // ============================================
  // INFORMATION PAGES
  // ============================================
  {
    path: "/about",
    title: "About Us | TimeCounterPro Productivity Suite",
    description:
      "Discover the story behind TimeCounterPro and find out how our high-performance timing tools assist developers, students, and athletes every day.",
    priority: "0.6",
    changefreq: "monthly",
  },
  {
    path: "/contact",
    title: "Contact TimeCounterPro - Report Bugs & Suggest Features",
    description:
      "Have an idea for a new timing tool or spotted a bug? Drop us a line. The TimeCounterPro team responds within 48 hours.",
    priority: "0.6",
    changefreq: "monthly",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | How We Protect Your Timer Data",
    description:
      "Your privacy is our priority. Read how TimeCounterPro safely manages cookies, browser storage, and locally saved countdown configurations.",
    priority: "0.4",
    changefreq: "monthly",
  },
  {
    path: "/terms",
    title: "Terms of Service & Usage Agreements | TimeCounterPro",
    description:
      "Review the standard terms, legal conditions, and acceptable use frameworks governing the open-source timers on TimeCounterPro.",
    priority: "0.4",
    changefreq: "monthly",
  },
];

export const routeCategories = {
  core: ["/", "/create", "/pomodoro", "/stopwatch", "/world-clock"],
  study: ["/pomodoro", "/mock-test-timer", "/group-study-timer"],
  fitness: ["/hiit-timer", "/fasting-tracker-timer"],
  gaming: ["/jungle-timer", "/speed-timer", "/gameplay-timer"],
  streaming: ["/stream-timer"],
  professional: ["/presentation-timer", "/world-clock-board-timer"],
  info: ["/about", "/contact", "/privacy", "/terms"],
};

export const allRoutes = staticRoutes;
export default allRoutes;
