
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { notifyTimerComplete } from '../utils/notifications';

export const TimerContext = createContext();

const STORAGE_KEY = 'timerproData';
const MAX_TIMER_SECONDS = 24 * 60 * 60;

const EMPTY_STATS = {
  totalTimers: 0,
  totalTime: 0,
  presetsUsed: 0,
  customsCreated: 0,
};

// ============ ✅ NEW - DYNAMIC BACKGROUND THEMES ============
export const CATEGORY_THEMES = {
  meditation: { 
    image: '/images/backgrounds/meditation-bg.jpg', 
    video: '/images/backgrounds/meditation-bg.mp4',
    color: '#8B5CF6', 
    bgLight: 'bg-purple-50', 
    border: 'border-purple-200', 
    icon: '🧘',
    name: 'meditation'
  },
  cooking: { 
    image: '/images/backgrounds/cooking-bg.jpg', 
    color: '#F59E0B', 
    bgLight: 'bg-amber-50', 
    border: 'border-amber-200', 
    icon: '🍳',
    name: 'cooking'
  },
  workout: { 
    image: '/images/backgrounds/workout-bg.jpg', 
    color: '#EF4444', 
    bgLight: 'bg-red-50', 
    border: 'border-red-200', 
    icon: '💪',
    name: 'workout'
  },
  study: { 
    image: '/images/backgrounds/study-bg.jpg', 
    color: '#3B82F6', 
    bgLight: 'bg-blue-50', 
    border: 'border-blue-200', 
    icon: '📚',
    name: 'study'
  },
  pomodoro: { 
    image: '/images/backgrounds/pomodoro-bg.jpg', 
    color: '#10B981', 
    bgLight: 'bg-emerald-50', 
    border: 'border-emerald-200', 
    icon: '🍅',
    name: 'pomodoro'
  },
  classroom: { 
    image: '/images/backgrounds/classroom-bg.jpg', 
    color: '#6366F1', 
    bgLight: 'bg-indigo-50', 
    border: 'border-indigo-200', 
    icon: '🎓',
    name: 'classroom'
  },
  meeting: { 
    image: '/images/backgrounds/meeting-bg.jpg', 
    color: '#0EA5E9', 
    bgLight: 'bg-sky-50', 
    border: 'border-sky-200', 
    icon: '💼',
    name: 'meeting'
  },
  sleep: { 
    image: '/images/backgrounds/meditation-bg.jpg', 
    color: '#8B5CF6', 
    bgLight: 'bg-purple-50', 
    border: 'border-purple-200', 
    icon: '😴',
    name: 'sleep'
  },
  default: { 
    image: '/images/backgrounds/default-timer-bg.jpg', 
    color: '#4F46E5', 
    bgLight: 'bg-white', 
    border: 'border-slate-200', 
    icon: '⏱️',
    name: 'default'
  },
};

export const getThemeForTimer = (timerName = '', timerType = '') => {
  const combined = `${timerName} ${timerType}`.toLowerCase();

  if (combined.includes('meditation') || combined.includes('mindfulness') || combined.includes('sleep') || combined.includes('nap') || combined.includes('break') || combined.includes('breath')) {
    return CATEGORY_THEMES.meditation;
  }
  if (combined.includes('cooking') || combined.includes('kitchen') || combined.includes('recipe')) {
    return CATEGORY_THEMES.cooking;
  }
  if (combined.includes('workout') || combined.includes('fitness') || combined.includes('gym') || combined.includes('exercise')) {
    return CATEGORY_THEMES.workout;
  }
  if (combined.includes('study') || combined.includes('exam') || combined.includes('test') || combined.includes('quiz') || combined.includes('homework') || combined.includes('reading') || combined.includes('coding') || combined.includes('school') || combined.includes('kids')) {
    return CATEGORY_THEMES.study;
  }
  if (combined.includes('pomodoro') || combined.includes('focus')) {
    return CATEGORY_THEMES.pomodoro;
  }
  if (combined.includes('classroom') || combined.includes('teacher')) {
    return CATEGORY_THEMES.classroom;
  }
  if (combined.includes('meeting') || combined.includes('presentation') || combined.includes('speech')) {
    return CATEGORY_THEMES.meeting;
  }

  return CATEGORY_THEMES.default;
};

const toSafeSeconds = (value) => {
  const seconds = Number(value);
  return Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
};

const normalizeTimer = (timer) => {
  const duration = toSafeSeconds(timer?.duration);
  const savedRemaining = toSafeSeconds(timer?.remaining);
  const now = Date.now();

  // ✅ Theme preserve karo localStorage se
  const theme = timer?.theme || getThemeForTimer(timer?.name, timer?.type);

  if (timer?.isPaused || timer?.status === 'paused') {
    return {
      ...timer,
      duration,
      theme,
      remaining: Math.min(savedRemaining || duration, duration),
      isPaused: true,
      status: 'paused',
      targetAt: null,
    };
  }

  let remaining = savedRemaining || duration;

  if (timer?.targetAt) {
    remaining = Math.ceil((Number(timer.targetAt) - now) / 1000);
  } else if (timer?.startTime) {
    remaining = duration - Math.floor((now - Number(timer.startTime)) / 1000);
  }

  remaining = Math.max(0, Math.min(remaining, duration));

  return {
    ...timer,
    duration,
    theme,
    remaining,
    isPaused: false,
    status: remaining > 0 ? 'running' : 'completed',
    targetAt: remaining > 0 ? now + remaining * 1000 : null,
  };
};

export const TimerProvider = ({ children }) => {
  const [activeTimers, setActiveTimers] = useState([]);
  const [completedTimers, setCompletedTimers] = useState([]);
  const [totalStats, setTotalStats] = useState(EMPTY_STATS);
  const [shareData, setShareData] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  const activeTimersRef = useRef([]);
  const completedTimersRef = useRef([]);
  const statsRef = useRef(EMPTY_STATS);

  useEffect(() => {
    activeTimersRef.current = activeTimers;
  }, [activeTimers]);

  useEffect(() => {
    completedTimersRef.current = completedTimers;
  }, [completedTimers]);

  useEffect(() => {
    statsRef.current = totalStats;
  }, [totalStats]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        const completed = Array.isArray(data.completed) ? data.completed : [];
        const stats = { ...EMPTY_STATS, ...(data.stats || {}) };
        const restored = Array.isArray(data.activeTimers)
          ? data.activeTimers.map(normalizeTimer)
          : [];

        const stillActive = restored.filter((timer) => timer.remaining > 0);
        const expired = restored.filter((timer) => timer.remaining <= 0);

        setCompletedTimers([...completed, ...expired.map((timer) => ({
          ...timer,
          remaining: 0,
          status: 'completed',
          completedAt: timer.completedAt || new Date().toISOString(),
        }))]);
        setTotalStats({
          ...stats,
          totalTimers: (stats.totalTimers || 0) + expired.length,
          totalTime: (stats.totalTime || 0) + expired.reduce((sum, timer) => sum + timer.duration, 0),
        });
        setActiveTimers(stillActive);
      }
    } catch (error) {
      console.warn('Failed to load timer data:', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        completed: completedTimers,
        stats: totalStats,
        activeTimers,
      }));
    } catch (error) {
      console.warn('Failed to save timer data:', error);
    }
  }, [activeTimers, completedTimers, totalStats, hydrated]);

  useEffect(() => {
    if (!hydrated) return undefined;

    const tick = () => {
      const now = Date.now();
      const current = activeTimersRef.current;
      if (!current.length) return;

      const completedNow = [];
      let changed = false;

      const next = current.flatMap((timer) => {
        if (timer.isPaused || timer.status === 'paused') return [timer];

        const remaining = Math.max(0, Math.ceil((Number(timer.targetAt) - now) / 1000));
        if (remaining <= 0) {
          completedNow.push({
            ...timer,
            remaining: 0,
            status: 'completed',
            isPaused: false,
            targetAt: null,
            completedAt: new Date(now).toISOString(),
          });
          changed = true;
          return [];
        }

        if (remaining !== timer.remaining || timer.status !== 'running') {
          changed = true;
          return [{ ...timer, remaining, status: 'running' }];
        }

        return [timer];
      });

      if (changed) setActiveTimers(next);

      if (completedNow.length) {
        setCompletedTimers((prev) => {
          const existing = new Set(prev.map((timer) => timer.id));
          return [...prev, ...completedNow.filter((timer) => !existing.has(timer.id))];
        });

        setTotalStats((prev) => ({
          ...prev,
          totalTimers: (prev.totalTimers || 0) + completedNow.length,
          totalTime: (prev.totalTime || 0) + completedNow.reduce((sum, timer) => sum + timer.duration, 0),
        }));

        completedNow.forEach((timer) => {
          notifyTimerComplete(
            `⏰ ${timer.name || 'Timer'} complete`,
            'Your TimeCounterPro timer is finished.'
          );
        });
      }
    };

    tick();
    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [hydrated]);

  const addTimer = useCallback((nameOrOptions, durationArg, typeArg) => {
    const options = typeof nameOrOptions === 'object'
      ? nameOrOptions
      : { name: nameOrOptions, duration: durationArg, type: typeArg };

    const duration = toSafeSeconds(options.duration);
    if (!duration || duration > MAX_TIMER_SECONDS) {
      console.warn('Invalid timer duration:', options.duration);
      return null;
    }

    const now = Date.now();
    const id = `${now}-${Math.random().toString(36).slice(2, 8)}`;
    
    // ✅ AUTO THEME DETECT - with-sound wala duplicate logic hat gaya, ab category se theme
    const autoTheme = getThemeForTimer(options.name, options.type);
    
    const newTimer = {
      id,
      name: options.name?.trim() || `${options.type || 'custom'} Timer`,
      duration,
      remaining: duration,
      type: options.type || 'custom',
      status: 'running',
      isPaused: false,
      startTime: now,
      targetAt: now + duration * 1000,
      targetDate: options.targetDate || null,
      theme: options.theme || autoTheme, // ✅ Theme auto assign
      createdAt: new Date(now).toISOString(),
    };

    setActiveTimers((prev) => [...prev, newTimer]);

    if (newTimer.type === 'preset') {
      setTotalStats((prev) => ({ ...prev, presetsUsed: (prev.presetsUsed || 0) + 1 }));
    } else if (newTimer.type !== 'countdown') {
      setTotalStats((prev) => ({ ...prev, customsCreated: (prev.customsCreated || 0) + 1 }));
    }

    return newTimer;
  }, []);

  const updateTimer = useCallback((timerId, newRemaining, isComplete = false, isPaused = false) => {
    if (!timerId) return;

    const remaining = toSafeSeconds(newRemaining);

    if (isComplete || remaining <= 0) {
      const timer = activeTimersRef.current.find((item) => item.id === timerId);
      if (!timer) return;

      const completed = {
        ...timer,
        remaining: 0,
        status: 'completed',
        isPaused: false,
        targetAt: null,
        completedAt: new Date().toISOString(),
      };

      setActiveTimers((prev) => prev.filter((item) => item.id !== timerId));
      setCompletedTimers((history) => (
        history.some((item) => item.id === timerId) ? history : [...history, completed]
      ));
      setTotalStats((stats) => ({
        ...stats,
        totalTimers: (stats.totalTimers || 0) + 1,
        totalTime: (stats.totalTime || 0) + timer.duration,
      }));
      return;
    }

    setActiveTimers((prev) => prev.map((timer) => {
      if (timer.id !== timerId) return timer;
      const now = Date.now();
      return {
        ...timer,
        remaining,
        isPaused,
        status: isPaused ? 'paused' : 'running',
        startTime: isPaused ? timer.startTime : now,
        targetAt: isPaused ? null : now + remaining * 1000,
      };
    }));
  }, []);

  const completeTimer = useCallback((timerId) => {
    updateTimer(timerId, 0, true, false);
  }, [updateTimer]);

  const removeTimer = useCallback((timerId) => {
    if (!timerId) return;
    setActiveTimers((prev) => prev.filter((timer) => timer.id !== timerId));
  }, []);

  const resetTimer = useCallback((timerId) => {
    if (!timerId) return;
    const now = Date.now();
    setActiveTimers((prev) => prev.map((timer) => (
      timer.id === timerId
        ? {
            ...timer,
            remaining: timer.duration,
            startTime: now,
            targetAt: now + timer.duration * 1000,
            status: 'running',
            isPaused: false,
          }
        : timer
    )));
  }, []);

  const clearHistory = useCallback(() => {
    setCompletedTimers([]);
    setTotalStats(EMPTY_STATS);
  }, []);

  const generateShareURL = useCallback((data) => {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://timecounterpro.com';
    const payload = {
      ...data,
      timezone: data?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    return `${base}?${new URLSearchParams(payload).toString()}`;
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const event = params.get('event');
    const date = params.get('date');
    const theme = params.get('theme');
    const embed = params.get('embed');
    const timezone = params.get('timezone');

    if (event && date) setShareData({ event, date, theme, embed, timezone });
  }, []);

  const value = useMemo(() => ({
    activeTimers,
    completedTimers,
    totalStats,
    shareData,
    setShareData,
    addTimer,
    completeTimer,
    removeTimer,
    clearHistory,
    updateTimer,
    resetTimer,
    generateShareURL,
    CATEGORY_THEMES,
    getThemeForTimer,
  }), [activeTimers, completedTimers, totalStats, shareData, addTimer, completeTimer, removeTimer, clearHistory, updateTimer, resetTimer, generateShareURL]);

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};