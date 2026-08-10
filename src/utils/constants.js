export const TIMER_PRESETS = [
  { name: 'Quick Break', duration: 300, icon: '☕', color: 'from-emerald-500 to-green-500' },
  { name: 'Focus', duration: 900, icon: '🎯', color: 'from-purple-500 to-indigo-500' },
  { name: 'Deep Work', duration: 1800, icon: '📚', color: 'from-blue-500 to-cyan-500' },
  { name: 'Workout', duration: 3600, icon: '💪', color: 'from-red-500 to-rose-500' },
  { name: 'Movie', duration: 7200, icon: '🎬', color: 'from-amber-500 to-orange-500' },
  { name: 'Sleep', duration: 28800, icon: '😴', color: 'from-indigo-500 to-purple-500' },
  { name: 'Cooking', duration: 2700, icon: '🍳', color: 'from-orange-500 to-red-500' },
  { name: 'Meditate', duration: 600, icon: '🧘', color: 'from-teal-500 to-emerald-500' },
];

export const THEMES = [
  { id: 'neon', label: 'Neon Dark', bg: 'from-purple-900 to-pink-900' },
  { id: 'sunset', label: 'Sunset', bg: 'from-orange-600 to-pink-600' },
  { id: 'cyber', label: 'Cyberpunk', bg: 'from-cyan-900 to-purple-900' },
  { id: 'ocean', label: 'Ocean Blue', bg: 'from-blue-900 to-teal-900' },
  { id: 'forest', label: 'Forest Green', bg: 'from-green-900 to-emerald-900' },
];

export const STORAGE_KEYS = {
  TIMERS: 'timerpro_timers',
  HISTORY: 'timerpro_history',
  STATS: 'timerpro_stats',
  THEME: 'timerpro_theme',
};