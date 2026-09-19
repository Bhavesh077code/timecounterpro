import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';

// ============================================
// TIMER PRESETS
// ============================================
const PRESETS = [
  { label: '5m', value: 5 },
  { label: '10m', value: 10 },
  { label: '15m', value: 15 },
  { label: '25m', value: 25 },
  { label: '45m', value: 45 },
];

// ============================================
// COLOR PALETTES — one per card
// ============================================
const CARD_THEMES = [
  {
    id: 1,
    name: 'Ocean',
    accent: '#3b82f6',
    accentDeep: '#1d4ed8',
    gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    soft: '#dbeafe',
    softDark: '#1e3a8a',
  },
  {
    id: 2,
    name: 'Violet',
    accent: '#8b5cf6',
    accentDeep: '#6d28d9',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
    soft: '#ede9fe',
    softDark: '#4c1d95',
  },
  {
    id: 3,
    name: 'Rose',
    accent: '#ec4899',
    accentDeep: '#be185d',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    soft: '#fce7f3',
    softDark: '#831843',
  },
  {
    id: 4,
    name: 'Emerald',
    accent: '#10b981',
    accentDeep: '#047857',
    gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
    soft: '#d1fae5',
    softDark: '#064e3b',
  },
];

// ============================================
// DEFAULT TIMERS
// ============================================
const DEFAULT_TIMERS = [
  {
    id: 1,
    name: 'Rahul — Physics Review',
    duration: 25 * 60,
    timeLeft: 25 * 60,
    isRunning: false,
    isFinished: false,
  },
  {
    id: 2,
    name: 'Amit — Math Practice',
    duration: 25 * 60,
    timeLeft: 25 * 60,
    isRunning: false,
    isFinished: false,
  },
  {
    id: 3,
    name: 'Priya — Chemistry Notes',
    duration: 25 * 60,
    timeLeft: 25 * 60,
    isRunning: false,
    isFinished: false,
  },
  {
    id: 4,
    name: 'Sneha — English Essay',
    duration: 25 * 60,
    timeLeft: 25 * 60,
    isRunning: false,
    isFinished: false,
  },
];

const GroupStudyGridTimer = () => {
  const [timers, setTimers] = useState(DEFAULT_TIMERS);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activePreset, setActivePreset] = useState(25);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionElapsed, setSessionElapsed] = useState(0);

  const intervalRef = useRef(null);
  const sessionIntervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const pageRef = useRef(null);
  const beepedRef = useRef({});

  // --- Audio ---
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
  }, []);

  const playBeep = useCallback((freq = 880, dur = 0.2, type = 'sine') => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = 0.15;
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  }, [initAudio]);

  // --- Session timer (group session duration) ---
  useEffect(() => {
    const anyRunning = timers.some((t) => t.isRunning);
    if (anyRunning && !sessionStartTime) {
      setSessionStartTime(Date.now());
    }
    if (!anyRunning && sessionStartTime && !timers.some((t) => t.isRunning)) {
      // Keep session time displayed
    }
  }, [timers, sessionStartTime]);

  useEffect(() => {
    if (!sessionStartTime) return;
    sessionIntervalRef.current = setInterval(() => {
      setSessionElapsed(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => {
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
    };
  }, [sessionStartTime]);

  // --- Main tick ---
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => {
          if (!t.isRunning) return t;
          const next = t.timeLeft - 1;
          if (next > 0 && next <= 3) {
            const key = `${t.id}-${next}`;
            if (!beepedRef.current[key]) {
              beepedRef.current[key] = true;
              playBeep(880, 0.1);
            }
          }
          if (next <= 0) {
            playBeep(1200, 0.5);
            return { ...t, timeLeft: 0, isRunning: false, isFinished: true };
          }
          return { ...t, timeLeft: next };
        })
      );
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playBeep]);

  // --- Actions ---
  const startTimer = (id) => {
    initAudio();
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              isRunning: true,
              isFinished: false,
              timeLeft: t.timeLeft <= 0 ? t.duration : t.timeLeft,
            }
          : t
      )
    );
    playBeep(660, 0.08);
  };

  const pauseTimer = (id) => {
    setTimers((prev) => prev.map((t) => (t.id === id ? { ...t, isRunning: false } : t)));
  };

  const resetTimer = (id) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, timeLeft: t.duration, isRunning: false, isFinished: false }
          : t
      )
    );
  };

  const renameTimer = (id, name) => {
    setTimers((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));
  };

  const changeDuration = (id, minutes) => {
    const secs = minutes * 60;
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, duration: secs, timeLeft: secs, isRunning: false, isFinished: false }
          : t
      )
    );
  };

  const startAll = () => {
    initAudio();
    setTimers((prev) =>
      prev.map((t) => ({
        ...t,
        isRunning: true,
        isFinished: false,
        timeLeft: t.timeLeft <= 0 ? t.duration : t.timeLeft,
      }))
    );
    playBeep(660, 0.1);
  };

  const pauseAll = () => {
    setTimers((prev) => prev.map((t) => ({ ...t, isRunning: false })));
  };

  const resetAll = () => {
    setTimers((prev) =>
      prev.map((t) => ({
        ...t,
        timeLeft: t.duration,
        isRunning: false,
        isFinished: false,
      }))
    );
    setSessionStartTime(null);
    setSessionElapsed(0);
    beepedRef.current = {};
  };

  const applyPresetToAll = (minutes) => {
    setActivePreset(minutes);
    const secs = minutes * 60;
    setTimers((prev) =>
      prev.map((t) => ({
        ...t,
        duration: secs,
        timeLeft: secs,
        isRunning: false,
        isFinished: false,
      }))
    );
  };

  const formatTime = (seconds) => {
    const s = Math.max(0, seconds);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const formatSessionTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  // --- Fullscreen ---
  const toggleFullscreen = useCallback(() => {
    const el = pageRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      if (e.key === 'd' || e.key === 'D') setDarkMode((v) => !v);
      if (e.code === 'Space') {
        e.preventDefault();
        const anyRunning = timers.some((t) => t.isRunning);
        if (anyRunning) pauseAll();
        else startAll();
      }
      if (e.key === 'r' || e.key === 'R') resetAll();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [timers, toggleFullscreen]);

  // --- Theme ---
  const theme = darkMode
    ? {
        bg: '#0a0a0f',
        bgGradient:
          'radial-gradient(circle at 15% 10%, #1e1b4b 0%, #0a0a0f 45%), radial-gradient(circle at 85% 90%, #1e293b 0%, transparent 50%)',
        card: '#15151f',
        cardElevated: '#1c1c28',
        cardBorder: 'rgba(255,255,255,0.06)',
        cardBorderHover: 'rgba(255,255,255,0.12)',
        text: '#f8fafc',
        textMuted: '#94a3b8',
        textSubtle: '#64748b',
        divider: 'rgba(255,255,255,0.06)',
        inputBg: 'rgba(255,255,255,0.03)',
        inputBorder: 'rgba(255,255,255,0.08)',
        inputFocus: 'rgba(255,255,255,0.15)',
      }
    : {
        bg: '#f5f6fa',
        bgGradient:
          'radial-gradient(circle at 15% 10%, #e0e7ff 0%, #f5f6fa 45%), radial-gradient(circle at 85% 90%, #fce7f3 0%, transparent 50%)',
        card: '#ffffff',
        cardElevated: '#ffffff',
        cardBorder: 'rgba(15,23,42,0.06)',
        cardBorderHover: 'rgba(15,23,42,0.12)',
        text: '#0f172a',
        textMuted: '#475569',
        textSubtle: '#94a3b8',
        divider: 'rgba(15,23,42,0.06)',
        inputBg: '#f8fafc',
        inputBorder: 'rgba(15,23,42,0.08)',
        inputFocus: 'rgba(15,23,42,0.15)',
      };

  const runningCount = timers.filter((t) => t.isRunning).length;
  const finishedCount = timers.filter((t) => t.isFinished).length;

  return (
    <div className="min-h-screen" style={{ background: theme.bg, color: theme.text }}>
      <style>{`
        html, body { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; width: 0; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        @keyframes floatIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .float-in { animation: floatIn 0.4s ease-out; }
        @keyframes pulseDot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.15); } }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
        @keyframes celebratePop { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
        .celebrate-pop { animation: celebratePop 0.6s ease-out; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .shimmer { background-size: 200% 100%; animation: shimmer 3s linear infinite; }
        .card-hover { transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-2px); }
      `}</style>

      {!isFullscreen && <Navbar />}

      <div
        ref={pageRef}
        className="relative w-full no-scrollbar"
        style={{
          minHeight: isFullscreen ? '100vh' : 'calc(100vh - 64px)',
          overflowY: 'auto',
          background: theme.bgGradient,
          backgroundColor: theme.bg,
        }}
      >
        {/* ===== TOP-RIGHT CONTROLS — positioned below navbar ===== */}
        <div
          className="fixed z-50 flex items-center gap-2 transition-all duration-200"
          style={{
            top: isFullscreen ? '1rem' : '5rem',
            right: '1rem',
          }}
        >
          <button
            onClick={() => setDarkMode((v) => !v)}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: theme.card,
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: darkMode
                ? '0 4px 16px rgba(0,0,0,0.4)'
                : '0 2px 8px rgba(15,23,42,0.06)',
            }}
            title="Dark mode (D)"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: theme.card,
              border: `1px solid ${theme.cardBorder}`,
              color: theme.textMuted,
              boxShadow: darkMode
                ? '0 4px 16px rgba(0,0,0,0.4)'
                : '0 2px 8px rgba(15,23,42,0.06)',
            }}
            title="Fullscreen (F)"
          >
            {isFullscreen ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </button>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">

          {/* ===== HEADER ===== */}
          <div className="mb-8 md:mb-10 float-in">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
                style={{
                  
                  color: '#fff',
                  boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
                }}
              >
                
              </div>
              <p
                className="text-[10px] tracking-[0.3em] uppercase font-bold"
                style={{ color: '#6366f1' }}
              >
                Focus Session · Live Grid
              </p>
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold tracking-tight leading-tight"
              style={{ color: theme.text }}
            >
              Group Study Timer
            </h1>
            <p
              className="mt-3 text-sm md:text-base max-w-2xl leading-relaxed"
              style={{ color: theme.textMuted }}
            >
              Four independent timers running in parallel. Rename each card,
              set custom durations, and let your group focus together — even
              from different rooms, cities, or timezones.
            </p>

            {/* Session + status strip */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              {sessionStartTime && (
                <div
                  className="px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold"
                  style={{
                    background: theme.card,
                    border: `1px solid ${theme.cardBorder}`,
                    boxShadow: darkMode
                      ? '0 4px 12px rgba(0,0,0,0.3)'
                      : '0 2px 8px rgba(15,23,42,0.04)',
                  }}
                >
                  <span className="pulse-dot w-2 h-2 rounded-full" style={{ background: '#10b981' }}></span>
                  <span style={{ color: theme.textSubtle, fontWeight: 600 }}>Session:</span>
                  <span className="tabular-nums font-mono" style={{ color: theme.text }}>
                    {formatSessionTime(sessionElapsed)}
                  </span>
                </div>
              )}
              <div
                className="px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                style={{
                  background: darkMode ? 'rgba(16,185,129,0.12)' : '#dcfce7',
                  color: '#16a34a',
                  border: '1px solid rgba(22,163,74,0.2)',
                }}
              >
                <span className={`w-2 h-2 rounded-full ${runningCount > 0 ? 'pulse-dot' : ''}`} style={{ background: '#16a34a' }}></span>
                {runningCount} Running
              </div>
              {finishedCount > 0 && (
                <div
                  className="px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                  style={{
                    background: darkMode ? 'rgba(99,102,241,0.12)' : '#e0e7ff',
                    color: '#6366f1',
                    border: '1px solid rgba(99,102,241,0.2)',
                  }}
                >
                  ✓ {finishedCount} Done
                </div>
              )}
            </div>
          </div>

          {/* ===== BULK ACTIONS BAR ===== */}
          <div
            className="mb-6 rounded-2xl p-4 md:p-5"
            style={{
              background: theme.card,
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: darkMode
                ? '0 4px 16px rgba(0,0,0,0.3)'
                : '0 2px 12px rgba(15,23,42,0.04)',
            }}
          >
            <div className="flex flex-wrap items-center gap-3">
              {/* Bulk buttons */}
              <button
                onClick={startAll}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
                }}
              >
                ▶ Start All
              </button>
              <button
                onClick={pauseAll}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                style={{
                  background: theme.inputBg,
                  color: theme.textMuted,
                  border: `1px solid ${theme.cardBorder}`,
                }}
              >
                ⏸ Pause All
              </button>
              <button
                onClick={resetAll}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                style={{
                  background: theme.inputBg,
                  color: theme.textMuted,
                  border: `1px solid ${theme.cardBorder}`,
                }}
              >
                ↺ Reset All
              </button>

              {/* Divider */}
              <div className="h-6 w-px hidden md:block" style={{ background: theme.divider }}></div>

              {/* Presets */}
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: theme.textSubtle }}
              >
                Duration:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p) => {
                  const active = activePreset === p.value;
                  return (
                    <button
                      key={p.value}
                      onClick={() => applyPresetToAll(p.value)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: active ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : theme.inputBg,
                        color: active ? '#fff' : theme.textMuted,
                        border: `1px solid ${active ? 'transparent' : theme.cardBorder}`,
                        boxShadow: active ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ===== 2x2 GRID ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {timers.map((timer, index) => {
              const cardTheme = CARD_THEMES[index];
              const progress = timer.duration > 0 ? 1 - timer.timeLeft / timer.duration : 0;
              const isCritical = timer.timeLeft <= 10 && timer.isRunning;

              return (
                <div
                  key={timer.id}
                  className={`rounded-2xl overflow-hidden card-hover ${
                    timer.isFinished ? 'celebrate-pop' : ''
                  }`}
                  style={{
                    background: theme.card,
                    border: `1px solid ${
                      timer.isRunning
                        ? cardTheme.accent + '55'
                        : timer.isFinished
                        ? '#16a34a55'
                        : theme.cardBorder
                    }`,
                    boxShadow: timer.isRunning
                      ? `0 12px 32px ${cardTheme.accent}25, 0 0 0 1px ${cardTheme.accent}15`
                      : timer.isFinished
                      ? '0 12px 32px rgba(22,163,74,0.2)'
                      : darkMode
                      ? '0 4px 16px rgba(0,0,0,0.3)'
                      : '0 4px 16px rgba(15,23,42,0.04)',
                  }}
                >
                  {/* Colored top strip */}
                  <div
                    className="h-1 w-full transition-all duration-300"
                    style={{
                      background: timer.isRunning
                        ? cardTheme.gradient
                        : timer.isFinished
                        ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                        : theme.divider,
                    }}
                  ></div>

                  <div className="p-5 md:p-6">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black transition-all"
                        style={{
                          background: timer.isRunning || timer.isFinished
                            ? cardTheme.gradient
                            : theme.inputBg,
                          color: timer.isRunning || timer.isFinished ? '#fff' : cardTheme.accent,
                          boxShadow: timer.isRunning
                            ? `0 6px 16px ${cardTheme.accent}44`
                            : 'none',
                        }}
                      >
                        {timer.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={timer.name}
                          onChange={(e) => renameTimer(timer.id, e.target.value)}
                          className="w-full bg-transparent border-0 outline-none text-sm md:text-[15px] font-bold tracking-tight py-0.5 truncate transition-colors"
                          style={{ color: theme.text }}
                          placeholder="Name this timer…"
                        />
                        <p
                          className="text-[10px] uppercase tracking-widest font-bold mt-0.5"
                          style={{ color: theme.textSubtle }}
                        >
                          {cardTheme.name} · {Math.round(timer.duration / 60)} min
                        </p>
                      </div>
                      {timer.isRunning && (
                        <span
                          className="pulse-dot w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5"
                          style={{
                            background: cardTheme.accent,
                            boxShadow: `0 0 12px ${cardTheme.accent}`,
                          }}
                        ></span>
                      )}
                      {timer.isFinished && (
                        <span
                          className="text-[10px] font-black tracking-widest uppercase flex-shrink-0 mt-1.5"
                          style={{ color: '#16a34a' }}
                        >
                          ✓ Done
                        </span>
                      )}
                    </div>

                    {/* Big timer */}
                    <div className="mb-4">
                      <div
                        className="font-black tabular-nums leading-none"
                        style={{
                          color: timer.isFinished
                            ? '#16a34a'
                            : isCritical
                            ? '#dc2626'
                            : timer.isRunning
                            ? cardTheme.accent
                            : theme.text,
                          fontSize: 'clamp(2.75rem, 8vw, 4.25rem)',
                          fontVariantNumeric: 'tabular-nums',
                          letterSpacing: '-0.04em',
                          fontFamily:
                            '"Inter", "SF Pro Display", system-ui, sans-serif',
                        }}
                      >
                        {timer.isFinished ? 'DONE' : formatTime(timer.timeLeft)}
                      </div>

                      {/* Progress */}
                      <div
                        className="mt-3 w-full h-1.5 rounded-full overflow-hidden"
                        style={{ background: theme.divider }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progress * 100}%`,
                            background: timer.isFinished
                              ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                              : cardTheme.gradient,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-2">
                      {!timer.isRunning ? (
                        <button
                          onClick={() => startTimer(timer.id)}
                          className="flex-1 py-3 rounded-xl text-xs font-black tracking-widest uppercase text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                          style={{
                            background: timer.isFinished
                              ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                              : cardTheme.gradient,
                            boxShadow: timer.isFinished
                              ? '0 6px 20px rgba(22,163,74,0.35)'
                              : `0 6px 20px ${cardTheme.accent}44`,
                          }}
                        >
                          {timer.isFinished
                            ? '↻ Restart'
                            : timer.timeLeft < timer.duration
                            ? '▶ Resume'
                            : '▶ Start'}
                        </button>
                      ) : (
                        <button
                          onClick={() => pauseTimer(timer.id)}
                          className="flex-1 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98]"
                          style={{
                            background: theme.inputBg,
                            color: theme.textMuted,
                            border: `1px solid ${theme.cardBorder}`,
                          }}
                        >
                          ⏸ Pause
                        </button>
                      )}
                      <button
                        onClick={() => resetTimer(timer.id)}
                        className="w-14 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                        style={{
                          background: theme.inputBg,
                          color: theme.textMuted,
                          border: `1px solid ${theme.cardBorder}`,
                        }}
                        title="Reset"
                      >
                        ↺
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ===== KEYBOARD HINTS ===== */}
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-5 text-[10px]"
            style={{ color: theme.textSubtle }}
          >
            {[
              { key: 'Space', label: 'Start/Pause All' },
              { key: 'R', label: 'Reset All' },
              { key: 'D', label: 'Dark Mode' },
              { key: 'F', label: 'Fullscreen' },
            ].map((h) => (
              <div key={h.key} className="flex items-center gap-2">
                <kbd
                  className="px-2 py-1 rounded-md font-mono text-[10px] font-bold"
                  style={{
                    background: theme.inputBg,
                    border: `1px solid ${theme.cardBorder}`,
                    color: theme.textMuted,
                  }}
                >
                  {h.key}
                </kbd>
                <span className="font-medium">{h.label}</span>
              </div>
            ))}
          </div>

          {/* ===== SEO SECTION ===== */}
          <div
            className="mt-12 rounded-3xl p-6 md:p-10"
            style={{
              background: theme.card,
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: darkMode
                ? '0 4px 16px rgba(0,0,0,0.3)'
                : '0 4px 16px rgba(15,23,42,0.04)',
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] tracking-[0.25em] uppercase font-bold px-3 py-1.5 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #6366f120, #a855f720)',
                  color: '#6366f1',
                  border: '1px solid rgba(99,102,241,0.3)',
                }}
              >
                Productivity Study
              </span>
            </div>

            <h2
              className="text-xl md:text-3xl font-bold tracking-tight mb-6 max-w-3xl"
              style={{ color: theme.text }}
            >
              Why Parallel Accountability Structures in Virtual Study Rooms Improve Focus
            </h2>

            <div
              className="space-y-4 text-sm md:text-[15px] leading-relaxed max-w-4xl"
              style={{ color: theme.textMuted }}
            >
              <p>
                Study alone, and you answer to nobody. Study with peers — even
                virtual ones — and something changes in your brain. The moment
                you know someone else is watching their own timer tick down in
                parallel, your tolerance for distraction drops sharply. This is
                the psychology of parallel accountability, and it's the single
                most underrated productivity lever in remote learning.
              </p>

              <p>
                <span style={{ color: theme.text, fontWeight: 700 }}>
                  The mirror effect.
                </span>{' '}
                When you see four timers running side by side — each one labeled
                with a friend's name and study task — you unconsciously compare
                your own focus to theirs. If Priya's timer has been running for
                18 minutes without pause, you feel a subtle pull to match that
                discipline. The effect is strongest when the timers are visible
                and named. Anonymity kills accountability; attribution creates
                it.
              </p>

              <p>
                <span style={{ color: theme.text, fontWeight: 700 }}>
                  Loss aversion at work.
                </span>{' '}
                Behavioral economists have shown that people work twice as hard
                to avoid losing something as they do to gain it. When your timer
                is paused, you're visibly "losing" study minutes that your group
                can see. This isn't about shame — it's about the natural human
                instinct to preserve a streak. A paused timer on a shared grid
                feels like a broken streak, even when nobody comments on it.
              </p>

              <p>
                <span style={{ color: theme.text, fontWeight: 700 }}>
                  Reduced decision fatigue.
                </span>{' '}
                Studying alone, every 10 minutes you make an implicit decision:
                keep going, check phone, get water, or quit. In a group timer
                grid, that decision is made for you — the timer is either
                running or it isn't. Fewer micro-decisions mean more cognitive
                bandwidth for actual work. This is why "body doubling" is one
                of the most effective interventions for ADHD and procrastination.
              </p>

              <p>
                <span style={{ color: theme.text, fontWeight: 700 }}>
                  Social proof of effort.
                </span>{' '}
                When you join a virtual study room and see all four timers
                active with names you recognize, you instantly know: these
                people are working right now. That social proof reduces the
                friction of starting. You don't need motivation — you need
                momentum, and momentum comes from seeing others already in
                motion.
              </p>

              <p>
                <span style={{ color: theme.text, fontWeight: 700 }}>
                  Built-in breaks and pacing.
                </span>{' '}
                Most virtual study rooms use Pomodoro-style intervals (25
                minutes on, 5 off). When four people share the same rhythm,
                breaks become social. You chat for 5 minutes, then everyone
                returns to their timers together. The collective rhythm makes
                breaks feel earned and endings feel natural — no guilt, no
                overrun.
              </p>

              <p>
                <span style={{ color: theme.text, fontWeight: 700 }}>
                  Accountability without authority.
                </span>{' '}
                The beauty of parallel timers is that no one is in charge.
                There's no teacher enforcing rules, no parent checking in.
                Everyone's just... working. That peer-to-peer structure is
                psychologically more sustainable than top-down accountability.
                Adults resist being managed; they thrive when they're matched.
              </p>

              <p>
                Study with others, even remotely, and you multiply your
                discipline. Study with named timers running in parallel, and
                you make that discipline visible — which is exactly when it
                becomes habit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupStudyGridTimer;