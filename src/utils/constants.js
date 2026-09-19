// src/utils/constants.js - Quick Start me Page Link Add Kiya

// ============================================
// 1. TIMER PRESETS - With Direct Page Links
// ============================================
export const TIMER_PRESETS = [
  // Quick & Short
  { 
    name: 'Quick Break', 
    duration: 300, 
    color: 'emerald', 
    bgClass: 'bg-emerald-50 border-emerald-200',
    textClass: 'text-emerald-700',
    hoverClass: 'hover:bg-emerald-100',
    category: 'Quick',
    description: '5 minute refresh break',
    slug: '5-minute-timer',
    link: '/timer/5-minute-timer'
  },
  { 
    name: 'Meditation', 
    duration: 600, 
    color: 'teal', 
    bgClass: 'bg-teal-50 border-teal-200',
    textClass: 'text-teal-700',
    hoverClass: 'hover:bg-teal-100',
    category: 'Quick',
    description: '10 minutes of mindfulness',
    slug: 'meditation-timer-10-minutes',
    link: '/timer/meditation-timer-10-minutes'
  },
  { 
    name: 'Focus Session', 
    duration: 900, 
    color: 'indigo', 
    bgClass: 'bg-indigo-50 border-indigo-200',
    textClass: 'text-indigo-700',
    hoverClass: 'hover:bg-indigo-100',
    category: 'Quick',
    description: '15 minutes deep focus',
    slug: '15-minute-timer',
    link: '/timer/15-minute-timer'
  },
  
  // Deep Work
  { 
    name: 'Deep Work', 
    duration: 1800, 
    color: 'blue', 
    bgClass: 'bg-blue-50 border-blue-200',
    textClass: 'text-blue-700',
    hoverClass: 'hover:bg-blue-100',
    category: 'Work',
    description: '30 minutes concentrated effort',
    slug: '30-minute-timer',
    link: '/timer/30-minute-timer'
  },
  { 
    name: 'Study Session', 
    duration: 2700, 
    color: 'indigo', 
    bgClass: 'bg-indigo-50 border-indigo-200',
    textClass: 'text-indigo-700',
    hoverClass: 'hover:bg-indigo-100',
    category: 'Work',
    description: '45 minutes of study',
    slug: 'study-timer-45-minutes',
    link: '/timer/study-timer-45-minutes'
  },
  { 
    name: 'Coding Sprint', 
    duration: 1500, 
    color: 'cyan', 
    bgClass: 'bg-cyan-50 border-cyan-200',
    textClass: 'text-cyan-700',
    hoverClass: 'hover:bg-cyan-100',
    category: 'Work',
    description: '25 minutes focused coding',
    slug: '25-minute-timer',
    link: '/timer/25-minute-timer'
  },
  
  // Fitness
  { 
    name: 'Workout', 
    duration: 3600, 
    color: 'rose', 
    bgClass: 'bg-rose-50 border-rose-200',
    textClass: 'text-rose-700',
    hoverClass: 'hover:bg-rose-100',
    category: 'Fitness',
    description: '1 hour exercise routine',
    slug: 'workout-timer-1-hour',
    link: '/timer/workout-timer-1-hour'
  },
  { 
    name: 'HIIT Timer', 
    duration: 1200, 
    color: 'orange', 
    bgClass: 'bg-orange-50 border-orange-200',
    textClass: 'text-orange-700',
    hoverClass: 'hover:bg-orange-100',
    category: 'Fitness',
    description: '20 minutes high intensity',
    slug: 'workout-timer-20-minutes',
    link: '/timer/workout-timer-20-minutes'
  },
  { 
    name: 'Yoga Practice', 
    duration: 1800, 
    color: 'amber', 
    bgClass: 'bg-amber-50 border-amber-200',
    textClass: 'text-amber-700',
    hoverClass: 'hover:bg-amber-100',
    category: 'Fitness',
    description: '30 minutes yoga flow',
    slug: '30-minute-timer',
    link: '/timer/30-minute-timer'
  },
  
  // Entertainment
  { 
    name: 'Movie Time', 
    duration: 7200, 
    color: 'amber', 
    bgClass: 'bg-amber-50 border-amber-200',
    textClass: 'text-amber-700',
    hoverClass: 'hover:bg-amber-100',
    category: 'Entertainment',
    description: '2 hours movie duration',
    slug: '2-hour-timer',
    link: '/timer/2-hour-timer'
  },
  { 
    name: 'Gaming Session', 
    duration: 3600, 
    color: 'purple', 
    bgClass: 'bg-purple-50 border-purple-200',
    textClass: 'text-purple-700',
    hoverClass: 'hover:bg-purple-100',
    category: 'Entertainment',
    description: '1 hour gaming break',
    slug: '1-hour-timer',
    link: '/timer/1-hour-timer'
  },
  { 
    name: 'Podcast Listening', 
    duration: 1800, 
    color: 'pink', 
    bgClass: 'bg-pink-50 border-pink-200',
    textClass: 'text-pink-700',
    hoverClass: 'hover:bg-pink-100',
    category: 'Entertainment',
    description: '30 minutes podcast',
    slug: '30-minute-timer',
    link: '/timer/30-minute-timer'
  },
  
  // Lifestyle
  { 
    name: 'Sleep Timer', 
    duration: 28800, 
    color: 'indigo', 
    bgClass: 'bg-indigo-50 border-indigo-200',
    textClass: 'text-indigo-700',
    hoverClass: 'hover:bg-indigo-100',
    category: 'Lifestyle',
    description: '8 hours sleep tracking',
    slug: 'sleep-timer',
    link: '/timer/sleep-timer'
  },
  { 
    name: 'Cooking Timer', 
    duration: 2700, 
    color: 'orange', 
    bgClass: 'bg-orange-50 border-orange-200',
    textClass: 'text-orange-700',
    hoverClass: 'hover:bg-orange-100',
    category: 'Lifestyle',
    description: '45 minutes cooking',
    slug: 'cooking-timer-45-minutes',
    link: '/timer/cooking-timer-45-minutes'
  },
  { 
    name: 'Cleaning Session', 
    duration: 1800, 
    color: 'emerald', 
    bgClass: 'bg-emerald-50 border-emerald-200',
    textClass: 'text-emerald-700',
    hoverClass: 'hover:bg-emerald-100',
    category: 'Lifestyle',
    description: '30 minutes cleaning',
    slug: 'timer-for-cleaning',
    link: '/timer/timer-for-cleaning'
  },
];

// ============================================
// 2. THEMES
// ============================================
export const THEMES = [
  { id: 'light', label: 'Light', bg: 'bg-slate-50', cardBg: 'bg-white', text: 'text-slate-900', border: 'border-slate-200', headerBg: 'bg-white', description: 'Clean and minimal design' },
  { id: 'dark', label: 'Dark', bg: 'bg-slate-900', cardBg: 'bg-slate-800', text: 'text-slate-100', border: 'border-slate-700', headerBg: 'bg-slate-800', description: 'Easy on the eyes' },
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-50', cardBg: 'bg-white', text: 'text-slate-900', border: 'border-indigo-200', headerBg: 'bg-indigo-600', description: 'Calm and focused' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-50', cardBg: 'bg-white', text: 'text-slate-900', border: 'border-emerald-200', headerBg: 'bg-emerald-600', description: 'Fresh and natural' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-50', cardBg: 'bg-white', text: 'text-slate-900', border: 'border-rose-200', headerBg: 'bg-rose-600', description: 'Warm and welcoming' },
  { id: 'slate', label: 'Slate', bg: 'bg-slate-100', cardBg: 'bg-white', text: 'text-slate-900', border: 'border-slate-300', headerBg: 'bg-slate-700', description: 'Professional and sleek' },
];

// ============================================
// 3. STORAGE KEYS
// ============================================
export const STORAGE_KEYS = {
  TIMERS: 'timerpro_timers',
  HISTORY: 'timerpro_history',
  STATS: 'timerpro_stats',
  THEME: 'timerpro_theme',
  SETTINGS: 'timerpro_settings',
  SESSIONS: 'timerpro_sessions',
  USER_PREFS: 'timerpro_preferences',
};

// ============================================
// 4. SOUND OPTIONS
// ============================================
export const SOUND_OPTIONS = [
  { id: 'tick', label: 'Tick Sound', description: 'Gentle tick during countdown' },
  { id: 'complete', label: 'Complete Sound', description: 'Alert when timer finishes' },
  { id: 'ambient', label: 'Ambient Sound', description: 'Background atmosphere' },
];

// ============================================
// 5. TIMER DURATIONS
// ============================================
export const TIMER_DURATIONS = {
  MINUTE: 60,
  FIVE_MINUTES: 300,
  TEN_MINUTES: 600,
  FIFTEEN_MINUTES: 900,
  TWENTY_MINUTES: 1200,
  THIRTY_MINUTES: 1800,
  FORTY_FIVE_MINUTES: 2700,
  ONE_HOUR: 3600,
  TWO_HOURS: 7200,
  EIGHT_HOURS: 28800,
};

// ============================================
// 6. PRESET CATEGORIES
// ============================================
export const PRESET_CATEGORIES = [
  { id: 'all', label: 'All Timers' },
  { id: 'Quick', label: 'Quick' },
  { id: 'Work', label: 'Work' },
  { id: 'Fitness', label: 'Fitness' },
  { id: 'Entertainment', label: 'Entertainment' },
  { id: 'Lifestyle', label: 'Lifestyle' },
];

// ============================================
// 7. DEFAULT SETTINGS
// ============================================
export const DEFAULT_SETTINGS = {
  soundEnabled: true,
  volume: 50,
  autoStart: false,
  theme: 'light',
  pomodoroFocus: 25,
  pomodoroBreak: 5,
  soundOnComplete: true,
  showNotifications: true,
  displayFormat: 'digital',
  language: 'en',
};

// ============================================
// 8. TIMER COLOR MAP
// ============================================
export const TIMER_COLORS = {
  emerald: { light: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', hover: 'hover:bg-emerald-100', active: 'bg-emerald-600', activeHover: 'hover:bg-emerald-700', ring: 'ring-emerald-500' },
  teal: { light: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', hover: 'hover:bg-teal-100', active: 'bg-teal-600', activeHover: 'hover:bg-teal-700', ring: 'ring-teal-500' },
  indigo: { light: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', hover: 'hover:bg-indigo-100', active: 'bg-indigo-600', activeHover: 'hover:bg-indigo-700', ring: 'ring-indigo-500' },
  blue: { light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', hover: 'hover:bg-blue-100', active: 'bg-blue-600', activeHover: 'hover:bg-blue-700', ring: 'ring-blue-500' },
  cyan: { light: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', hover: 'hover:bg-cyan-100', active: 'bg-cyan-600', activeHover: 'hover:bg-cyan-700', ring: 'ring-cyan-500' },
  rose: { light: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', hover: 'hover:bg-rose-100', active: 'bg-rose-600', activeHover: 'hover:bg-rose-700', ring: 'ring-rose-500' },
  orange: { light: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', hover: 'hover:bg-orange-100', active: 'bg-orange-600', activeHover: 'hover:bg-orange-700', ring: 'ring-orange-500' },
  amber: { light: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', hover: 'hover:bg-amber-100', active: 'bg-amber-600', activeHover: 'hover:bg-amber-700', ring: 'ring-amber-500' },
  purple: { light: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', hover: 'hover:bg-purple-100', active: 'bg-purple-600', activeHover: 'hover:bg-purple-700', ring: 'ring-purple-500' },
  pink: { light: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', hover: 'hover:bg-pink-100', active: 'bg-pink-600', activeHover: 'hover:bg-pink-700', ring: 'ring-pink-500' },
};

// ============================================
// 9. SITE METADATA
// ============================================
export const SITE_METADATA = {
  name: 'TimeCounterPro',
  description: 'Free online timer tools for productivity, study, and events.',
  keywords: 'timer, countdown, stopwatch, pomodoro, productivity, study timer',
  author: 'TimeCounterPro',
  url: 'https://timecounterpro.com',
  ogTitle: 'TimeCounterPro - Free Online Timer Tools',
  ogDescription: 'Manage your time effectively with our free timer tools.',
  twitterCard: 'summary_large_image',
};

// ============================================
// 10. ACCESSIBILITY
// ============================================
export const ACCESSIBILITY = {
  ARIA_LABELS: { timer: 'Timer display', start: 'Start timer', pause: 'Pause timer', reset: 'Reset timer', lap: 'Record lap', settings: 'Open settings', close: 'Close' },
  KEYBOARD_SHORTCUTS: { start: 'Space or Enter', pause: 'Space or Enter', reset: 'R key', fullscreen: 'F key' },
};

// ============================================
// 11. VALIDATION
// ============================================
export const VALIDATION = {
  MAX_TIMER_NAME_LENGTH: 80,
  MIN_TIMER_DURATION: 1,
  MAX_TIMER_DURATION: 86400,
  MAX_PRESETS: 50,
  MAX_HISTORY_ITEMS: 100,
};

export default {
  TIMER_PRESETS,
  THEMES,
  STORAGE_KEYS,
  SOUND_OPTIONS,
  TIMER_DURATIONS,
  PRESET_CATEGORIES,
  DEFAULT_SETTINGS,
  TIMER_COLORS,
  SITE_METADATA,
  ACCESSIBILITY,
  VALIDATION,
};