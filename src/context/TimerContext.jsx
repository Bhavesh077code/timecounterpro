

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

const toSafeSeconds = (value) => {
  const seconds = Number(value);
  return Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
};

const normalizeTimer = (timer) => {
  const duration = toSafeSeconds(timer?.duration);
  const savedRemaining = toSafeSeconds(timer?.remaining);
  const now = Date.now();

  if (timer?.isPaused || timer?.status === 'paused') {
    return {
      ...timer,
      duration,
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

  // Load saved state once. Paused timers use their saved remaining time;
  // running timers use an absolute target timestamp so refresh/background tabs do not create drift.
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

  // Persist only after hydration so the initial empty state cannot overwrite saved data.
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

  // One timer engine for the whole app. Components only render Context state.
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

        // Notification is opt-in and fires once from the single timer engine.
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
      theme: options.theme || null,
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
    return `${base}?${new URLSearchParams(data).toString()}`;
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const event = params.get('event');
    const date = params.get('date');
    const theme = params.get('theme');
    const embed = params.get('embed');

    if (event && date) setShareData({ event, date, theme, embed });
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
  }), [activeTimers, completedTimers, totalStats, shareData, addTimer, completeTimer, removeTimer, clearHistory, updateTimer, resetTimer, generateShareURL]);

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};
