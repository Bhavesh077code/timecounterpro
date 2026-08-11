// src/utils/constants.js

// ============================================
// 1. TIMER PRESETS - More Categories & Colors
// ============================================
export const TIMER_PRESETS = [
  // 🟢 Quick & Short
  { name: 'Quick Break', duration: 300, icon: '☕', color: 'from-emerald-500 to-green-500', category: 'Quick' },
  { name: 'Meditate', duration: 600, icon: '🧘', color: 'from-teal-500 to-emerald-500', category: 'Quick' },
  { name: 'Focus', duration: 900, icon: '🎯', color: 'from-purple-500 to-indigo-500', category: 'Quick' },
  
  // 🔵 Deep Work
  { name: 'Deep Work', duration: 1800, icon: '📚', color: 'from-blue-500 to-cyan-500', category: 'Work' },
  { name: 'Study Session', duration: 2700, icon: '📖', color: 'from-indigo-500 to-blue-500', category: 'Work' },
  { name: 'Coding Sprint', duration: 1500, icon: '💻', color: 'from-cyan-500 to-teal-500', category: 'Work' },
  
  // 🟠 Fitness
  { name: 'Workout', duration: 3600, icon: '💪', color: 'from-red-500 to-rose-500', category: 'Fitness' },
  { name: 'HIIT Timer', duration: 1200, icon: '⚡', color: 'from-orange-500 to-red-500', category: 'Fitness' },
  { name: 'Yoga', duration: 1800, icon: '🧘‍♀️', color: 'from-amber-500 to-yellow-500', category: 'Fitness' },
  
  // 🟣 Entertainment
  { name: 'Movie', duration: 7200, icon: '🎬', color: 'from-amber-500 to-orange-500', category: 'Entertainment' },
  { name: 'Gaming', duration: 3600, icon: '🎮', color: 'from-purple-500 to-pink-500', category: 'Entertainment' },
  { name: 'Podcast', duration: 1800, icon: '🎙️', color: 'from-rose-500 to-pink-500', category: 'Entertainment' },
  
  // 🟤 Lifestyle
  { name: 'Sleep', duration: 28800, icon: '😴', color: 'from-indigo-500 to-purple-500', category: 'Lifestyle' },
  { name: 'Cooking', duration: 2700, icon: '🍳', color: 'from-orange-500 to-red-500', category: 'Lifestyle' },
  { name: 'Cleaning', duration: 1800, icon: '🧹', color: 'from-emerald-500 to-teal-500', category: 'Lifestyle' },
];

// ============================================
// 2. THEMES - More Options
// ============================================
export const THEMES = [
  { id: 'neon', label: '🌙 Neon Dark', bg: 'from-purple-900 to-pink-900', text: 'text-white' },
  { id: 'sunset', label: '🌅 Sunset', bg: 'from-orange-600 to-pink-600', text: 'text-white' },
  { id: 'cyber', label: '🤖 Cyberpunk', bg: 'from-cyan-900 to-purple-900', text: 'text-cyan-300' },
  { id: 'ocean', label: '🌊 Ocean Blue', bg: 'from-blue-900 to-teal-900', text: 'text-blue-300' },
  { id: 'forest', label: '🌿 Forest Green', bg: 'from-green-900 to-emerald-900', text: 'text-emerald-300' },
  { id: 'coffee', label: '☕ Coffee', bg: 'from-amber-900 to-brown-900', text: 'text-amber-300' },
  { id: 'lavender', label: '💜 Lavender', bg: 'from-purple-800 to-pink-800', text: 'text-purple-300' },
  { id: 'midnight', label: '🌃 Midnight', bg: 'from-slate-900 to-indigo-900', text: 'text-slate-300' },
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
};

// ============================================
// 4. SOUND OPTIONS
// ============================================
export const SOUND_OPTIONS = [
  { id: 'tick', label: 'Tick Sound', icon: '🔊' },
  { id: 'complete', label: 'Complete Sound', icon: '🔔' },
  { id: 'ambient', label: 'Ambient Sound', icon: '🎵' },
];

// ============================================
// 5. TIMER DURATIONS (in seconds)
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
// 6. QUICK PRESET CATEGORIES
// ============================================
export const PRESET_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'Quick', label: '⚡ Quick' },
  { id: 'Work', label: '💼 Work' },
  { id: 'Fitness', label: '💪 Fitness' },
  { id: 'Entertainment', label: '🎬 Entertainment' },
  { id: 'Lifestyle', label: '🌿 Lifestyle' },
];

// ============================================
// 7. DEFAULT VALUES
// ============================================
export const DEFAULT_SETTINGS = {
  soundEnabled: true,
  volume: 50,
  autoStart: false,
  theme: 'dark',
  pomodoroFocus: 25,
  pomodoroBreak: 5,
};

export default {
  TIMER_PRESETS,
  THEMES,
  STORAGE_KEYS,
  SOUND_OPTIONS,
  TIMER_DURATIONS,
  PRESET_CATEGORIES,
  DEFAULT_SETTINGS,
};