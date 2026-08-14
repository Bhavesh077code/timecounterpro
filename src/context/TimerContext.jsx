/*

import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [activeTimers, setActiveTimers] = useState([]);
  const [completedTimers, setCompletedTimers] = useState([]);
  const [totalStats, setTotalStats] = useState({
    totalTimers: 0,
    totalTime: 0,
    presetsUsed: 0,
    customsCreated: 0
  });
  const [shareData, setShareData] = useState(null);

  const isSavingRef = useRef(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('timerproData');
      if (savedData) {
        const data = JSON.parse(savedData);
        setCompletedTimers(data.completed || []);
        setTotalStats(data.stats || { totalTimers: 0, totalTime: 0, presetsUsed: 0, customsCreated: 0 });
        
        const savedActive = data.activeTimers || [];
        if (savedActive.length > 0) {
          const restoredTimers = savedActive.map(t => {
            const elapsed = Math.floor((Date.now() - (t.startTime || Date.now())) / 1000);
            const remaining = Math.max(0, (t.duration || 0) - elapsed);
            return {
              ...t,
              remaining: remaining,
              status: remaining > 0 ? 'running' : 'completed',
              isPaused: t.isPaused || false,
              startTime: t.startTime || Date.now()
            };
          });
          setActiveTimers(restoredTimers);
        }
      }
    } catch (error) {
      console.warn('Failed to load data from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;

    try {
      const dataToSave = {
        completed: completedTimers,
        stats: totalStats,
        activeTimers: activeTimers.map(t => ({
          id: t.id,
          name: t.name,
          duration: t.duration,
          type: t.type,
          status: t.status,
          startTime: t.startTime,
          createdAt: t.createdAt,
          isPaused: t.isPaused || false
        }))
      };
      localStorage.setItem('timerproData', JSON.stringify(dataToSave));
    } catch (error) {
      console.warn('Failed to save data to localStorage:', error);
    } finally {
      isSavingRef.current = false;
    }
  }, [completedTimers, totalStats, activeTimers]);

  const generateShareURL = useCallback((data) => {
    const base = window.location.origin;
    const query = new URLSearchParams(data).toString();
    return `${base}?${query}`;
  }, []);

  const addTimer = useCallback((name, duration, type) => {
    if (!duration || duration <= 0) {
      console.warn('Invalid duration:', duration);
      return;
    }

    const newTimer = {
      id: Date.now(),
      name: name || `${type} Timer`,
      duration,
      remaining: duration,
      type: type || 'custom',
      status: 'running',
      startTime: Date.now(),
      createdAt: new Date().toISOString(),
      isPaused: false
    };
    
    setActiveTimers(prev => [...prev, newTimer]);
    
    if (type === 'preset') {
      setTotalStats(prev => ({ ...prev, presetsUsed: (prev.presetsUsed || 0) + 1 }));
    } else {
      setTotalStats(prev => ({ ...prev, customsCreated: (prev.customsCreated || 0) + 1 }));
    }
  }, []);

  const updateTimer = useCallback((timerId, newRemaining, isComplete = false, isPaused = false) => {
    if (!timerId) return;

    setActiveTimers(prev => {
      let completedTimer = null;
      const updatedTimers = prev.map(t => {
        if (t.id === timerId) {
          if (isComplete || newRemaining <= 0) {
            completedTimer = {
              ...t,
              remaining: 0,
              completedAt: new Date().toISOString(),
              status: 'completed'
            };
            return null;
          }
          
          const safeRemaining = Math.max(0, newRemaining);
          return {
            ...t,
            remaining: safeRemaining,
            status: safeRemaining > 0 ? 'running' : 'completed',
            isPaused: isPaused || false,
            startTime: isPaused ? t.startTime : Date.now() - (t.duration - safeRemaining) * 1000
          };
        }
        return t;
      }).filter(t => t !== null);

      if (completedTimer) {
        setCompletedTimers(prevCompleted => [...prevCompleted, completedTimer]);
        setTotalStats(prevStats => ({
          ...prevStats,
          totalTimers: (prevStats.totalTimers || 0) + 1,
          totalTime: (prevStats.totalTime || 0) + completedTimer.duration
        }));
      }

      return updatedTimers;
    });
  }, []);

  const completeTimer = useCallback((timerId) => {
    if (!timerId) return;

    setActiveTimers(prev => {
      const timer = prev.find(t => t.id === timerId);
      if (timer) {
        setCompletedTimers(prevCompleted => [...prevCompleted, {
          ...timer,
          remaining: 0,
          completedAt: new Date().toISOString(),
          status: 'completed'
        }]);
        setTotalStats(prevStats => ({
          ...prevStats,
          totalTimers: (prevStats.totalTimers || 0) + 1,
          totalTime: (prevStats.totalTime || 0) + timer.duration
        }));
        return prev.filter(t => t.id !== timerId);
      }
      return prev;
    });
  }, []);

  const removeTimer = useCallback((timerId) => {
    if (!timerId) return;
    setActiveTimers(prev => prev.filter(t => t.id !== timerId));
  }, []);

  const clearHistory = useCallback(() => {
    setCompletedTimers([]);
    setTotalStats({
      totalTimers: 0,
      totalTime: 0,
      presetsUsed: 0,
      customsCreated: 0
    });
  }, []);

  const resetTimer = useCallback((timerId) => {
    if (!timerId) return;
    
    setActiveTimers(prev => 
      prev.map(t => {
        if (t.id === timerId) {
          return {
            ...t,
            remaining: t.duration,
            startTime: Date.now(),
            status: 'running',
            isPaused: false
          };
        }
        return t;
      })
    );
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const event = urlParams.get('event');
    const date = urlParams.get('date');
    const theme = urlParams.get('theme');
    const embed = urlParams.get('embed');

    if (event && date) {
      setShareData({ event, date, theme, embed });
    }
  }, []);

  return (
    <TimerContext.Provider value={{
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
      generateShareURL
    }}>
      {children}
    </TimerContext.Provider>
  );
};

*/


/*
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

export const TimerContext = createContext();

const STORAGE_KEY = 'timerproData';

const DEFAULT_STATS = {
  totalTimers: 0,
  totalTime: 0,
  presetsUsed: 0,
  customsCreated: 0,
};

const getRemaining = (timer) => {
  if (timer.isPaused) {
    return Math.max(0, Number(timer.remaining) || 0);
  }

  if (timer.targetAt) {
    return Math.max(
      0,
      Math.ceil((timer.targetAt - Date.now()) / 1000)
    );
  }

  if (timer.startTime && timer.duration) {
    const elapsed = Math.floor(
      (Date.now() - timer.startTime) / 1000
    );

    return Math.max(0, timer.duration - elapsed);
  }

  return Math.max(0, Number(timer.remaining) || 0);
};

export const TimerProvider = ({ children }) => {
  const [activeTimers, setActiveTimers] = useState([]);
  const [completedTimers, setCompletedTimers] = useState([]);
  const [totalStats, setTotalStats] = useState(DEFAULT_STATS);
  const [shareData, setShareData] = useState(null);

  const initializedRef = useRef(false);

  // --------------------------------------------------
  // LOAD DATA
  // --------------------------------------------------

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        initializedRef.current = true;
        return;
      }

      const data = JSON.parse(saved);

      setCompletedTimers(
        Array.isArray(data.completed)
          ? data.completed
          : []
      );

      setTotalStats({
        ...DEFAULT_STATS,
        ...(data.stats || {}),
      });

      const savedTimers = Array.isArray(data.activeTimers)
        ? data.activeTimers
        : [];

      const now = Date.now();

      const restoredTimers = savedTimers
        .map((timer) => {
          const remaining = getRemaining(timer);

          return {
            ...timer,
            remaining,
            status: remaining > 0 ? 'running' : 'completed',
            isPaused: Boolean(timer.isPaused),
            createdAt:
              timer.createdAt || new Date().toISOString(),
          };
        })
        .filter((timer) => timer.remaining > 0);

      setActiveTimers(restoredTimers);

      initializedRef.current = true;
    } catch (error) {
      console.error(
        'Failed to restore timer data:',
        error
      );

      initializedRef.current = true;
    }
  }, []);

  // --------------------------------------------------
  // SAVE DATA
  // --------------------------------------------------

  useEffect(() => {
    if (!initializedRef.current) return;

    try {
      const data = {
        completed: completedTimers,
        stats: totalStats,

        activeTimers: activeTimers.map((timer) => ({
          ...timer,

          // Save the latest remaining time
          remaining: timer.isPaused
            ? timer.remaining
            : getRemaining(timer),
        })),
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error(
        'Failed to save timer data:',
        error
      );
    }
  }, [
    activeTimers,
    completedTimers,
    totalStats,
  ]);

  // --------------------------------------------------
  // ADD TIMER
  // --------------------------------------------------

  const addTimer = useCallback(
    (
      name,
      duration,
      type = 'custom',
      targetDate = null,
      theme = null
    ) => {
      let durationInSeconds = Number(duration);

      if (!durationInSeconds || durationInSeconds <= 0) {
        console.warn(
          'Invalid timer duration:',
          duration
        );
        return null;
      }

      // CountdownCreator sends milliseconds.
      // Convert milliseconds -> seconds.
      if (
        type === 'countdown' &&
        durationInSeconds > 100000
      ) {
        durationInSeconds = Math.ceil(
          durationInSeconds / 1000
        );
      }

      const now = Date.now();

      let targetAt = null;

      if (targetDate) {
        const parsedTarget = new Date(
          targetDate
        ).getTime();

        if (!Number.isNaN(parsedTarget)) {
          targetAt = parsedTarget;
          durationInSeconds = Math.ceil(
            Math.max(
              0,
              parsedTarget - now
            ) / 1000
          );
        }
      }

      if (durationInSeconds <= 0) {
        console.warn(
          'Timer target time has already passed.'
        );
        return null;
      }

      const newTimer = {
        id: `${now}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

        name:
          name ||
          `${
            type === 'countdown'
              ? 'Countdown'
              : 'Timer'
          }`,

        duration: durationInSeconds,

        remaining: durationInSeconds,

        type,

        status: 'running',

        isPaused: false,

        startTime: now,

        targetAt,

        targetDate: targetDate || null,

        theme: theme || null,

        createdAt: new Date().toISOString(),
      };

      setActiveTimers((prev) => [
        ...prev,
        newTimer,
      ]);

      setTotalStats((prev) => ({
        ...prev,

        presetsUsed:
          type === 'preset'
            ? (prev.presetsUsed || 0) + 1
            : prev.presetsUsed,

        customsCreated:
          type !== 'preset'
            ? (prev.customsCreated || 0) + 1
            : prev.customsCreated,
      }));

      return newTimer;
    },
    []
  );

  // --------------------------------------------------
  // UPDATE TIMER
  // --------------------------------------------------

  const updateTimer = useCallback(
    (
      timerId,
      newRemaining,
      isComplete = false,
      isPaused = false
    ) => {
      if (!timerId) return;

      setActiveTimers((prev) => {
        const timer = prev.find(
          (t) => t.id === timerId
        );

        if (!timer) return prev;

        const safeRemaining = Math.max(
          0,
          Math.floor(Number(newRemaining) || 0)
        );

        if (isComplete || safeRemaining <= 0) {
          const completedTimer = {
            ...timer,
            remaining: 0,
            status: 'completed',
            isPaused: false,
            completedAt:
              new Date().toISOString(),
          };

          setCompletedTimers((history) => [
            completedTimer,
            ...history,
          ]);

          setTotalStats((stats) => ({
            ...stats,
            totalTimers:
              (stats.totalTimers || 0) + 1,
            totalTime:
              (stats.totalTime || 0) +
              timer.duration,
          }));

          return prev.filter(
            (t) => t.id !== timerId
          );
        }

        const now = Date.now();

        return prev.map((t) => {
          if (t.id !== timerId) {
            return t;
          }

          return {
            ...t,

            remaining: safeRemaining,

            isPaused,

            status: isPaused
              ? 'paused'
              : 'running',

            startTime: isPaused
              ? t.startTime
              : now -
                (t.duration -
                  safeRemaining) *
                  1000,

            targetAt:
              isPaused
                ? null
                : now +
                  safeRemaining *
                    1000,
          };
        });
      });
    },
    []
  );

  // --------------------------------------------------
  // COMPLETE TIMER
  // --------------------------------------------------

  const completeTimer = useCallback(
    (timerId) => {
      if (!timerId) return;

      setActiveTimers((prev) => {
        const timer = prev.find(
          (t) => t.id === timerId
        );

        if (!timer) return prev;

        const completedTimer = {
          ...timer,
          remaining: 0,
          status: 'completed',
          isPaused: false,
          completedAt:
            new Date().toISOString(),
        };

        setCompletedTimers((history) => [
          completedTimer,
          ...history,
        ]);

        setTotalStats((stats) => ({
          ...stats,
          totalTimers:
            (stats.totalTimers || 0) + 1,
          totalTime:
            (stats.totalTime || 0) +
            timer.duration,
        }));

        return prev.filter(
          (t) => t.id !== timerId
        );
      });
    },
    []
  );

  // --------------------------------------------------
  // REMOVE TIMER
  // --------------------------------------------------

  const removeTimer = useCallback(
    (timerId) => {
      if (!timerId) return;

      setActiveTimers((prev) =>
        prev.filter(
          (timer) => timer.id !== timerId
        )
      );
    },
    []
  );

  // --------------------------------------------------
  // RESET TIMER
  // --------------------------------------------------

  const resetTimer = useCallback(
    (timerId) => {
      if (!timerId) return;

      setActiveTimers((prev) =>
        prev.map((timer) => {
          if (timer.id !== timerId) {
            return timer;
          }

          const now = Date.now();

          return {
            ...timer,

            remaining: timer.duration,

            status: 'running',

            isPaused: false,

            startTime: now,

            targetAt:
              now +
              timer.duration * 1000,
          };
        })
      );
    },
    []
  );

  // --------------------------------------------------
  // CLEAR HISTORY
  // --------------------------------------------------

  const clearHistory = useCallback(() => {
    setCompletedTimers([]);

    setTotalStats(DEFAULT_STATS);
  }, []);

  // --------------------------------------------------
  // SHARE DATA
  // --------------------------------------------------

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const event = params.get('event');
    const date = params.get('date');
    const theme = params.get('theme');
    const embed = params.get('embed');

    if (event && date) {
      setShareData({
        event,
        date,
        theme,
        embed,
      });
    }
  }, []);

  // --------------------------------------------------
  // SHARE URL
  // --------------------------------------------------

  const generateShareURL = useCallback(
    (data) => {
      const base =
        window.location.origin;

      const query =
        new URLSearchParams(data).toString();

      return `${base}?${query}`;
    },
    []
  );

  return (
    <TimerContext.Provider
      value={{
        activeTimers,
        completedTimers,
        totalStats,
        shareData,

        setShareData,

        addTimer,
        updateTimer,
        completeTimer,
        removeTimer,
        resetTimer,
        clearHistory,

        generateShareURL,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

*/

/*
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

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


*/




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
