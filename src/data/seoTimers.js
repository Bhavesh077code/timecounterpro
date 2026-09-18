// src/data/seoTimers.js
//
// CURATED TIMER LIST.
//
// Previously this file programmatically generated 800+ timer URLs
// (1-120 minutes x 6 variants, 1-12 hours, etc.). Almost all of those pages
// shared identical text and had no unique value, which is exactly the pattern
// Google classifies as "thin" / "scaled" content and a very common reason for
// AdSense "low value content" rejections.
//
// The list below is hand-curated. Every slug here has its own original,
// hand-written page content in src/data/timerContent.js.

export const seoTimers = [
  // ---------- Duration timers ----------
  {
    id: 1,
    slug: "5-minute-timer",
    title: "5 Minute Timer",
    duration: 300,
    description:
      "A 5 minute countdown for short breaks, breathing exercises, quick tidying and buffer time between meetings.",
    keywords: "5 minute timer, 5 min timer, five minute countdown",
    category: "minutes",
    background: "countdown",
  },
  {
    id: 2,
    slug: "10-minute-timer",
    title: "10 Minute Timer",
    duration: 600,
    description:
      "A 10 minute countdown for short study blocks, warm-ups, stretching and the classic ten-minute start rule.",
    keywords: "10 minute timer, 10 min timer, ten minute countdown",
    category: "minutes",
    background: "countdown",
  },
  {
    id: 3,
    slug: "15-minute-timer",
    title: "15 Minute Timer",
    duration: 900,
    description:
      "A 15 minute countdown for cleaning sprints, revision blocks, stand-up meetings and short practice sessions.",
    keywords: "15 minute timer, 15 min timer, quarter hour timer",
    category: "minutes",
    background: "countdown",
  },
  {
    id: 4,
    slug: "20-minute-timer",
    title: "20 Minute Timer",
    duration: 1200,
    description:
      "A 20 minute countdown for power naps, reading sessions, screen breaks and the 20-20-20 eye rule.",
    keywords: "20 minute timer, 20 min timer, twenty minute countdown",
    category: "minutes",
    background: "countdown",
  },
  {
    id: 5,
    slug: "25-minute-timer",
    title: "25 Minute Timer",
    duration: 1500,
    description:
      "A 25 minute countdown - the standard Pomodoro focus block used for study, writing and deep work.",
    keywords: "25 minute timer, pomodoro 25 minutes, 25 min countdown",
    category: "minutes",
    background: "pomodoro",
  },
  {
    id: 6,
    slug: "30-minute-timer",
    title: "30 Minute Timer",
    duration: 1800,
    description:
      "A 30 minute countdown for workouts, half-hour meetings, oven cooking and focused half-hour work blocks.",
    keywords: "30 minute timer, half hour timer, 30 min countdown",
    category: "minutes",
    background: "countdown",
  },
  {
    id: 7,
    slug: "45-minute-timer",
    title: "45 Minute Timer",
    duration: 2700,
    description:
      "A 45 minute countdown matching a school period, a long study block or a single deep-work session.",
    keywords: "45 minute timer, 45 min timer, school period timer",
    category: "minutes",
    background: "study",
  },
  {
    id: 8,
    slug: "60-minute-timer",
    title: "60 Minute Timer",
    duration: 3600,
    description:
      "A 60 minute countdown for one-hour exams, long meetings, slow cooking and hour-long practice sessions.",
    keywords: "60 minute timer, 1 hour timer, one hour countdown",
    category: "minutes",
    background: "countdown",
  },
  {
    id: 9,
    slug: "90-minute-timer",
    title: "90 Minute Timer",
    duration: 5400,
    description:
      "A 90 minute countdown built around the ultradian work cycle - one long focus block before a real break.",
    keywords: "90 minute timer, 1.5 hour timer, ultradian timer",
    category: "hours",
    background: "study",
  },
  {
    id: 10,
    slug: "2-hour-timer",
    title: "2 Hour Timer",
    duration: 7200,
    description:
      "A 2 hour countdown for long exams, extended study sessions, slow cooking and half-day project blocks.",
    keywords: "2 hour timer, two hour countdown, 120 minute timer",
    category: "hours",
    background: "countdown",
  },

  // ---------- Pomodoro ----------
  {
    id: 11,
    slug: "pomodoro-timer",
    title: "Pomodoro Timer",
    duration: 1500,
    description:
      "A Pomodoro timer that splits work into focused intervals separated by planned breaks.",
    keywords: "pomodoro timer, focus timer, tomato timer",
    category: "pomodoro",
    background: "pomodoro",
  },
  {
    id: 12,
    slug: "pomodoro-25-5",
    title: "Pomodoro 25/5 Timer",
    duration: 1500,
    description:
      "The classic 25 minutes of focus followed by a 5 minute break - the original Pomodoro cycle.",
    keywords: "pomodoro 25 5, 25 minute focus 5 minute break",
    category: "pomodoro",
    background: "pomodoro",
  },
  {
    id: 13,
    slug: "pomodoro-50-10",
    title: "Pomodoro 50/10 Timer",
    duration: 3000,
    description:
      "A longer 50 minute focus block with a 10 minute break, suited to writing, coding and deep work.",
    keywords: "pomodoro 50 10, 50 minute focus timer, long pomodoro",
    category: "pomodoro",
    background: "pomodoro",
  },

  // ---------- Study & work ----------
  {
    id: 14,
    slug: "study-timer",
    title: "Study Timer",
    duration: 2700,
    description:
      "A study timer that turns an open-ended syllabus into one clearly defined revision session.",
    keywords: "study timer, revision timer, homework timer",
    category: "study",
    background: "study",
  },
  {
    id: 15,
    slug: "exam-timer",
    title: "Exam Timer",
    duration: 3600,
    description:
      "An exam timer for timed practice papers, mock tests and sectional attempts under real conditions.",
    keywords: "exam timer, mock test timer, test countdown",
    category: "study",
    background: "study",
  },
  {
    id: 16,
    slug: "reading-timer",
    title: "Reading Timer",
    duration: 1200,
    description:
      "A reading timer for daily reading habits, chapter goals and measuring your reading pace.",
    keywords: "reading timer, book timer, reading session countdown",
    category: "study",
    background: "study",
  },
  {
    id: 17,
    slug: "coding-timer",
    title: "Coding Timer",
    duration: 1500,
    description:
      "A coding timer for timeboxed debugging, practice problems and focused programming sessions.",
    keywords: "coding timer, programming timer, debugging timebox",
    category: "study",
    background: "study",
  },

  // ---------- Body ----------
  {
    id: 18,
    slug: "workout-timer",
    title: "Workout Timer",
    duration: 1800,
    description:
      "A workout timer for home training, circuits, planks, rest periods and timed exercise blocks.",
    keywords: "workout timer, exercise timer, gym countdown",
    category: "workout",
    background: "workout",
  },
  {
    id: 19,
    slug: "meditation-timer",
    title: "Meditation Timer",
    duration: 600,
    description:
      "A meditation timer that removes clock-watching from your practice so you can stay with the breath.",
    keywords: "meditation timer, mindfulness timer, breathing timer",
    category: "meditation",
    background: "meditation",
  },
  {
    id: 20,
    slug: "nap-timer",
    title: "Nap Timer",
    duration: 1200,
    description:
      "A nap timer built around sleep-cycle length so you wake up refreshed instead of groggy.",
    keywords: "nap timer, power nap timer, 20 minute nap",
    category: "meditation",
    background: "meditation",
  },

  // ---------- Kitchen ----------
  {
    id: 21,
    slug: "cooking-timer",
    title: "Cooking Timer",
    duration: 900,
    description:
      "A kitchen timer for baking, simmering, resting dough and every recipe step that needs watching.",
    keywords: "cooking timer, kitchen timer, baking countdown",
    category: "cooking",
    background: "cooking",
  },
  {
    id: 22,
    slug: "egg-timer",
    title: "Egg Timer",
    duration: 420,
    description:
      "An egg timer with the standard timings for soft, medium and hard boiled eggs.",
    keywords: "egg timer, boiled egg timer, 7 minute egg",
    category: "cooking",
    background: "cooking",
  },

  // ---------- Classroom & meetings ----------
  {
    id: 23,
    slug: "classroom-timer",
    title: "Classroom Timer",
    duration: 900,
    description:
      "A large classroom timer for group work, quizzes, transitions and timed activities.",
    keywords: "classroom timer, teacher timer, activity timer",
    category: "classroom",
    background: "study",
  },
  {
    id: 24,
    slug: "meeting-timer",
    title: "Meeting Timer",
    duration: 1800,
    description:
      "A meeting timer that keeps agenda items, stand-ups and presentations inside their planned slot.",
    keywords: "meeting timer, agenda timer, presentation countdown",
    category: "meeting",
    background: "meeting",
  },
];

export const getTimerBySlug = (slug) => seoTimers.find((t) => t.slug === slug);
export const getTimersByCategory = (category) =>
  seoTimers.filter((t) => t.category === category);
export const getAllSlugs = () => seoTimers.map((t) => t.slug);

export default seoTimers;
